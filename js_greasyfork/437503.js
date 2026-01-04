// ==UserScript==
// @name        YouTube: Take screenshots using hotkey
// @description 動画のスクリーンショットを撮るキーボードショートカットを追加する
// @namespace   https://gitlab.com/sigsign
// @version     0.4.0
// @author      Sigsign
// @license     MIT or Apache-2.0
// @match       https://www.youtube.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/437503/YouTube%3A%20Take%20screenshots%20using%20hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/437503/YouTube%3A%20Take%20screenshots%20using%20hotkey.meta.js
// ==/UserScript==
(function () {
'use strict';

const MAX_CAPTURE_SIZE = 720;
const infoCache = {
    url: '',
    title: '',
    icon: '',
    expire: 0,
};
const notifications = new Set();
let permissionCache = Notification.permission;
async function convert(bitmap) {
    const { width, height } = getSize(bitmap);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('[Err] canvas.getContext() is failed');
    }
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, width, height);
    return await getBlob(canvas);
}
// [Firefox] dom.events.asyncClipboard.clipboardItem => True
async function copyToClipboard(blob) {
    // eslint-disable-next-line no-undef
    const clipboardItem = new ClipboardItem({
        [blob.type]: blob
    });
    await navigator.clipboard.write([clipboardItem]);
}
function getBlob(canvas) {
    return new Promise((resolv, reject) => {
        canvas.toBlob((blob) => {
            return (blob) ? resolv(blob) : reject('[Err] blob is null');
        }, 'image/png');
    });
}
function getIcon() {
    const icon = document.querySelector('ytd-video-owner-renderer img');
    return icon?.src || null;
}
function getInfo() {
    if (infoCache.expire > Date.now() && infoCache.url === location.href) {
        return { title: infoCache.title, icon: infoCache.icon };
    }
    const title = getTitle();
    const icon = getIcon();
    if (title && icon) {
        infoCache.url = location.href;
        infoCache.title = title;
        infoCache.icon = icon;
        infoCache.expire = Date.now() + (5 * 60 * 1000); // 5 minutes
    }
    return { title: title || '', icon: icon || '' };
}
function getSize(bitmap) {
    let width = bitmap.width;
    let height = bitmap.height;
    // 短辺を MAX_CAPTURE_SIZE 以下にする
    if (width > height) {
        if (height > MAX_CAPTURE_SIZE) {
            width = width * MAX_CAPTURE_SIZE / height;
            height = MAX_CAPTURE_SIZE;
        }
    }
    else {
        if (width > MAX_CAPTURE_SIZE) {
            height = height * MAX_CAPTURE_SIZE / width;
            width = MAX_CAPTURE_SIZE;
        }
    }
    return { width, height };
}
function getTitle() {
    const title = location.pathname.startsWith('/embed/')
        ? document.querySelector('#movie_player .ytp-title-text')
        : document.querySelector('ytd-video-primary-info-renderer h1.title');
    return title?.textContent?.trim() || null;
}
async function notify(blob) {
    if (permissionCache === 'denied') {
        return;
    }
    if (permissionCache !== 'granted') {
        permissionCache = await Notification.requestPermission();
        if (permissionCache !== 'granted') {
            return;
        }
    }
    // 連続して撮るときは過去の通知を消す
    for (const n of notifications) {
        n.close();
    }
    notifications.clear();
    const { title, icon } = getInfo();
    const url = URL.createObjectURL(blob);
    const options = {
        body: title,
        icon: icon,
        image: url,
        silent: true,
    };
    const notify = new Notification('Take a screenshot', options);
    notify.addEventListener('click', (ev) => {
        ev.preventDefault();
        const url = URL.createObjectURL(blob);
        setTimeout(function (u) {
            URL.revokeObjectURL(u);
        }, 5 * 60 * 1000, url);
        window.open(url, '_blank');
    }, false);
    setTimeout(function (n, u) {
        n.close();
        URL.revokeObjectURL(u);
        notifications.delete(n);
    }, 5 * 1000, notify, url);
    notifications.add(notify);
}
async function takeScreenshot() {
    const player = document.querySelector('#movie_player');
    if (!player) {
        throw new Error('[Err] YouTube Player is not ready');
    }
    const video = player.querySelector('video');
    if (!video) {
        throw new Error('[Err] HTMLVideoElement is not exists');
    }
    const list = player.classList;
    if (!list.contains('playing-mode') && !list.contains('paused-mode')) {
        return;
    }
    if (list.contains('unstarted-mode')) {
        return;
    }
    const bitmap = await createImageBitmap(video);
    const blob = await convert(bitmap);
    await copyToClipboard(blob);
    await notify(blob);
}
function init() {
    const path = location.pathname;
    // チャット欄にフォーカスがあってもスクショを撮れるようにする
    if (path.includes('/live_chat') || path.includes('/live_chat_replay')) {
        window.addEventListener('keydown', function (ev) {
            if (ev.key.toLowerCase() !== 'q' || ev.target !== document.body) {
                return;
            }
            const message = {
                type: 'userscript-take-screenshots'
            };
            window.parent.postMessage(message);
        }, false);
        // チャット欄でやることはもうない
        return;
    }
    // 最上位のフレームだけが postMessage() を受け取る
    if (window.top === window.self) {
        window.addEventListener('message', (ev) => {
            const url = new URL(ev.origin);
            if (url.hostname !== 'www.youtube.com' || !ev.data) {
                return;
            }
            const message = ev.data;
            if (message.type === 'userscript-take-screenshots') {
                takeScreenshot().catch((err) => {
                    console.error(err);
                });
            }
        }, false);
    }
    window.addEventListener('keydown', (ev) => {
        if (ev.key.toLowerCase() !== 'q') {
            return;
        }
        const target = ev.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            return;
        }
        takeScreenshot().catch((err) => {
            console.error(err);
        });
    }, false);
}
init();

})();
