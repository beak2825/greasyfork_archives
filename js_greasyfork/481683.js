// ==UserScript==
// @name         Youtube Interface Modification
// @namespace    https://github.com/RutsuLun
// @version      1.7
// @description  將聊天室與直播位置切換
// @author       Rutsu Lun
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @license      Only Share
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/481683/Youtube%20Interface%20Modification.user.js
// @updateURL https://update.greasyfork.org/scripts/481683/Youtube%20Interface%20Modification.meta.js
// ==/UserScript==

(function () {
    GM.registerMenuCommand('呼叫', Lun_createBtnList);
    GM.registerMenuCommand('介面', Lun_loayoutSwitch);
    GM.registerMenuCommand('emoji調整', Lun_removeEmojiTag);
    GM.registerMenuCommand('移除愛心', hideShitHard);
    // GM.registerMenuCommand('表符', Lun_emojiMenuChenge);
})();

const btnListSetting = [
    { id: 'Lun_loayoutSwitch', name: '介面', method: Lun_loayoutSwitch, },
    { id: 'Lun_emojiMenuChenge', name: '表符', method: Lun_removeEmojiTag, },
    { id: 'Lun_emojiMenuChenge', name: '移除愛心', method: hideShitHard, },
]
const btnListCss = 'position: absolute;top: 0;left: 0;'

function Lun_loayoutSwitch() {
    document.getElementById('columns').style.cssText == '' ? document.getElementById('columns').style.cssText = 'flex-direction: row-reverse;' : document.getElementById('columns').style.cssText = '';
    document.querySelector('ytd-player').style.cssText += 'border-radius: 0;'
}

function Lun_removeEmojiTag() {
    const iframe = document.getElementById('chatframe');
    if (iframe.contentDocument) {
        var iframeDocument = iframe.contentDocument;
        var category = iframeDocument.getElementById('category-buttons');
        var search = iframeDocument.getElementById('search-panel');
        var emoji = iframeDocument.querySelector('yt-emoji-picker-renderer');
        category.style.cssText += 'display:none;'
        search.style.cssText += 'display:none;'
        emoji.style.cssText += 'margin: -5px -24px !important'
    }
}

function Lun_emojiMenuChenge() {
    const iframe = document.getElementById('chatframe');
    if (iframe.contentDocument) {
        var iframeDocument = iframe.contentDocument;
        var targetElement = iframeDocument.querySelector('yt-emoji-picker-renderer[floating-emoji-picker]');
        targetElement.style.cssText = 'min-height: 400px';
    }
}

function hideShitHard() {
    const iframe = document.getElementById('chatframe');
    if (iframe.contentDocument) {
        var iframeDocument = iframe.contentDocument;
        var targetElement = iframeDocument.querySelector('#reaction-control-panel');
        targetElement.style.cssText = 'display:none;'
    }
}

function Lun_createBtnList() {
    const chat = document.getElementById('secondary');
    if (chat && document.querySelector('Lun_btnList') == null) {
        const btnList = document.createElement('span');
        btnList.id = 'Lun_btnList';
        btnList.style = btnListCss;
        chat.append(btnList);
        btnListSetting.forEach(b => {
            let btn = document.createElement('button');
            btn.id = b.id;
            btn.innerText = b.name;
            btnList.append(btn);
            btn.addEventListener('click', b.method);
        });
    }
}

const main = function () {
    // Lun_emojiMenuChenge();
    console.log('載入完畢');
    Lun_createBtnList();
}

const injectScript = function (frameWindow) {
    main()
}

const retrieveChatFrameWindow = function () {
    if (window.location.pathname === "/live_chat" || window.location.pathname === "/live_chat_replay") return window;
    for (let i = 0; i < window.frames.length; i++) {
        try {
            if (window.frames[i].location) {
                let pathname = window.frames[i].location.pathname;
                if (pathname === "/live_chat" || pathname === "/live_chat_replay") return frames[i];
            }
        } catch (ex) { }
    }
}

const tryBrowserIndependentExecution = function () {
    let destinationFrameWindow = retrieveChatFrameWindow();
    if (!destinationFrameWindow || !destinationFrameWindow.document || destinationFrameWindow.document.readyState != "complete") {
        setTimeout(tryBrowserIndependentExecution, 1000);
        return;
    }
    if (destinationFrameWindow.channelResolverInitialized) return;
    injectScript(destinationFrameWindow);
    destinationFrameWindow.channelResolverInitialized = true;
}

const getPopup = () => {
    let pop = document.querySelector('ytd-popup-container')
    if (pop == null) {
        setTimeout(getPopup, 1000);
        console.log(pop)
    } else {
        pop.remove();
    }
}

if (ytInitialPlayerResponse.videoDetails.isLiveContent) {
    console.log('直播')
    tryBrowserIndependentExecution();
} else {
    console.log('正常影片')
}
