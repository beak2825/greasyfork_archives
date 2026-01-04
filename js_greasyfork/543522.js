// ==UserScript==
// @name         Downloader (with persistent folder)
// @namespace    http://tampermonkey.net/
// @version      2025-07-25.2
// @description  Alt+Clickで画像や動画をダウンロードし、一度選択したフォルダを記憶します。画像と動画の保存先は別々に指定できます。
// @author       You
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license      MIT 
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543522/Downloader%20%28with%20persistent%20folder%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543522/Downloader%20%28with%20persistent%20folder%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- IndexedDB Helper (変更なし) ---
    const DB_NAME = 'FileSystemHandlesDB';
    const STORE_NAME = 'handles';
    // ▼▼▼ 保存先フォルダを分離するため、キーを分ける ▼▼▼
    const HANDLE_KEY_IMAGE = 'x-downloader-image-directory';
    const HANDLE_KEY_VIDEO = 'x-downloader-video-directory';
    let db;

    function initDB() {
        return new Promise((resolve, reject) => {
            if (db) return resolve(db);
            const request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = () => {
                request.result.createObjectStore(STORE_NAME);
            };
            request.onsuccess = () => {
                db = request.result;
                resolve(db);
            };
            request.onerror = () => reject(request.error);
        });
    }

    function saveHandle(key, handle) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await initDB();
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put(handle, key);
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    function getHandle(key) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await initDB();
                const tx = db.transaction(STORE_NAME, 'readonly');
                const request = tx.objectStore(STORE_NAME).get(key);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    // --- Video Data Interception ---
    const videoDataStore = new Map();

    function processTweetForVideo(tweetResult) {
        if (!tweetResult) return;
        const targetTweet = tweetResult.legacy?.retweeted_status_result?.result || tweetResult;
        const tweetId = targetTweet.rest_id;
        if (!tweetId || videoDataStore.has(tweetId)) return;

        const mediaList = targetTweet.legacy?.extended_entities?.media;
        if (!mediaList) return;

        const videoInfo = mediaList.find(m => m.type === 'video' || m.type === 'animated_gif');
        if (!videoInfo || !videoInfo.video_info?.variants) return;

        const mp4Variants = videoInfo.video_info.variants.filter(v => v.content_type === 'video/mp4' && v.bitrate);
        if (mp4Variants.length === 0) return;

        const bestVariant = mp4Variants.reduce((best, current) => (current.bitrate || 0) > (best.bitrate || 0) ? current : best);
        const screenName = targetTweet.core?.user_results?.result?.legacy?.screen_name || 'unknown_user';
        const filename = `${screenName}_${tweetId}.mp4`;

        videoDataStore.set(tweetId, { videoUrl: bestVariant.url, filename });
        console.log(`[Downloader] Video found: ${filename}`);
    }

    function findAndStoreVideoInfo(data) {
        if (typeof data !== 'object' || data === null) return;
        if (data.tweet_results && data.tweet_results.result) {
            processTweetForVideo(data.tweet_results.result);
            return;
        }
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                findAndStoreVideoInfo(data[key]);
            }
        }
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function () {
            if (this.responseURL.includes('/i/api/graphql/')) {
                try {
                    findAndStoreVideoInfo(JSON.parse(this.responseText));
                } catch (e) { /* Ignore parsing errors */ }
            }
        });
        originalOpen.apply(this, arguments);
    };

    // --- UI and Helper Functions ---
    function addToastContainer() {
        if (document.getElementById('toast-container')) return;
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
        const style = document.createElement('style');
        style.textContent = `
#toast-container {
    position: fixed; bottom: 20px; right: 20px;
    background-color: rgba(0, 0, 0, 0.8); color: white;
    padding: 15px 25px; border-radius: 5px; z-index: 10000;
    visibility: hidden; opacity: 0;
    transition: visibility 0s 0.5s, opacity 0.5s linear;
}
#toast-container.show {
    visibility: visible; opacity: 1;
    transition: opacity 0.5s linear;
}`;
        document.head.appendChild(style);
    }

    function showToast(message) {
        const toast = document.getElementById('toast-container');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => hideToast(), 3000);
    }

    function hideToast() {
        const toast = document.getElementById('toast-container');
        if (toast) toast.classList.remove('show');
    }

    function getElementUnderCursor(event) {
        return document.elementFromPoint(event.clientX, event.clientY);
    }

    function getDeepestImageElement(element) {
        let deepestImage = null, maxDepth = -1;
        function find(el, depth) {
            if (el.tagName === 'IMG') {
                if (depth > maxDepth) {
                    deepestImage = el;
                    maxDepth = depth;
                }
            }
            for (const child of el.children) find(child, depth + 1);
        }
        if (element) find(element, 0);
        return deepestImage;
    }

    function convertTwitterImageUrl(url) {
        const match = url.match(/pbs\.twimg\.com\/media\/([a-zA-Z0-9_-]+)/);
        return match ? `https://pbs.twimg.com/media/${match[1]}?format=png&name=4096x4096` : null;
    }

    function getTweetIdFromArticle(article) {
        const link = article.querySelector('a[href*="/status/"]');
        const match = link?.href.match(/\/status\/(\d+)/);
        return match?.[1] || null;
    }

    async function verifyFileSystemPermission(handle) {
        const options = { mode: 'readwrite' };
        if (await handle.queryPermission(options) === 'granted') return true;
        if (await handle.requestPermission(options) === 'granted') return true;
        return false;
    }

    // --- ▼▼▼ ファイル保存処理を共通化 ▼▼▼ ---
    /**
     * 指定されたフォルダハンドルを取得する。なければユーザーに選択を促す。
     * @param {string} key IndexedDBに保存するためのキー
     * @param {string} type '画像' または '動画'。ダイアログメッセージに使用
     * @returns {Promise<FileSystemDirectoryHandle|null>}
     */
    async function getDirectoryHandle(key, type) {
        if (!('showDirectoryPicker' in window)) {
            showToast('このブラウザはファイル保存機能に対応していません。');
            return null;
        }
        try {
            let dirHandle = await getHandle(key);
            if (!dirHandle || !(await verifyFileSystemPermission(dirHandle))) {
                showToast(`${type}の保存先フォルダを選択...`);
                dirHandle = await window.showDirectoryPicker();
                await saveHandle(key, dirHandle);
                showToast('保存先を記憶しました。');
            }
            return dirHandle;
        } catch (err) {
            if (err.name === 'AbortError') console.log('フォルダ選択がキャンセルされました。');
            else console.error('フォルダハンドルの取得に失敗:', err);
            hideToast();
            return null;
        }
    }

    /**
     * ファイルをダウンロードして指定フォルダに保存する共通関数
     * @param {{type: '画像'|'動画', key: string, url: string, filename: string}} options
     */
    async function saveFileToDirectory({ type, key, url, filename }) {
        const dirHandle = await getDirectoryHandle(key, type);
        if (!dirHandle) return;

        try {
            showToast(`${type}をダウンロード中...`);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = await response.blob();

            showToast(`${type}を保存中...`);
            const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
            showToast(`${type}を保存しました: ${filename}`);

        } catch (error) {
            console.error(`${type}保存エラー:`, error);
            showToast(error.name === 'NotAllowedError' ? 'フォルダへのアクセスが拒否されました。' : `${type}の保存に失敗しました。`);
        }
    }

    // --- Main Click Event Listener ---
    document.addEventListener('click', async function(event) {
        if (!event.altKey) return;

        // 元の実装に従い、まずイベントをキャンセル
        event.preventDefault();
        event.stopPropagation();

        const elementUnderCursor = getElementUnderCursor(event);
        if (!elementUnderCursor) return;

        // 1. 画像ダウンロードを試みる
        const deepestImage = getDeepestImageElement(elementUnderCursor);
        if (deepestImage && deepestImage.src.includes('pbs.twimg.com/media')) {
            const imageUrl = convertTwitterImageUrl(deepestImage.src);
            if (imageUrl) {
                const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1).split('?')[0] + '.png';
                await saveFileToDirectory({
                    type: '画像',
                    key: HANDLE_KEY_IMAGE,
                    url: imageUrl,
                    filename: filename
                });
                return; // 画像を処理したので終了
            }
        }

        // 2. 動画ダウンロードを試みる
        const videoPlayer = elementUnderCursor.closest('[data-testid="videoPlayer"]');
        if (videoPlayer) {
            const tweetArticle = videoPlayer.closest('article[data-testid="tweet"]');
            if (tweetArticle) {
                const tweetId = getTweetIdFromArticle(tweetArticle);
                if (tweetId && videoDataStore.has(tweetId)) {
                    const { videoUrl, filename } = videoDataStore.get(tweetId);
                    await saveFileToDirectory({
                        type: '動画',
                        key: HANDLE_KEY_VIDEO,
                        url: videoUrl,
                        filename: filename
                    });
                    return; // 動画を処理したので終了
                }
            }
        }

    }, true);

    // --- Initialization ---
    addToastContainer();
    console.log('[Downloader] Script loaded. Alt+Click on images or videos to download.');
})();