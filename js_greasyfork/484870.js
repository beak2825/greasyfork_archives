// ==UserScript==
// @name         Youtube LiveChat Modification
// @namespace    https://github.com/RutsuLun
// @version      0.2
// @description  Youtube直播分離聊天室調整
// @author       Rutsu Lun
// @match        https://www.youtube.com/live_chat?*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @license      Only Share
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/484870/Youtube%20LiveChat%20Modification.user.js
// @updateURL https://update.greasyfork.org/scripts/484870/Youtube%20LiveChat%20Modification.meta.js
// ==/UserScript==

(function () {
    GM.registerMenuCommand('呼叫', Lun_createBtnList);
    GM.registerMenuCommand('表符調整', Lun_removeEmojiTag);
    GM.registerMenuCommand('移除愛心', hideShitHard);
})();

const btnListSetting = [
    { id: 'Lun_emojiMenuChenge', name: '移除愛心', method: hideShitHard, },
    { id: 'Lun_removeEmojiTag', name: '表符調整', method: Lun_removeEmojiTag }
]
const btnListCss = 'position: fixed; top: 0; right: 40px;'

function Lun_removeEmojiTag() {
    document.querySelector('#search-panel')?document.querySelector('#search-panel').remove():'';
    document.querySelector('#category-buttons')?document.querySelector('#category-buttons').remove():'';
    document.querySelector('yt-emoji-picker-renderer').style.cssText += 'margin: 0 -24px;';
    document.getElementById('categories').querySelector('yt-emoji-picker-category-renderer').querySelectorAll('img.yt-emoji-picker-category-renderer').forEach(el => {
        el.style.cssText += 'width: 36px;height: 36px;'
    })
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
    document.querySelector('#reaction-control-panel').remove()
}

function Lun_createBtnList() {
    if (document.querySelector('Lun_btnList') == null) {
        const btnList = document.createElement('span');
        btnList.id = 'Lun_btnList';
        btnList.style = btnListCss;
        document.body.append(btnList);
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

tryBrowserIndependentExecution();