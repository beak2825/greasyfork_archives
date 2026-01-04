// ==UserScript==
// @name         哔哩哔哩开启/关闭弹幕快捷键-C
// @namespace    https://imwyl.com
// @version      0.1
// @description  按C键开启或关闭B站弹幕，直播或点播都可以。
// @author       You
// @match        https://www.bilibili.com/*
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412450/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%BC%80%E5%90%AF%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95%E5%BF%AB%E6%8D%B7%E9%94%AE-C.user.js
// @updateURL https://update.greasyfork.org/scripts/412450/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%BC%80%E5%90%AF%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95%E5%BF%AB%E6%8D%B7%E9%94%AE-C.meta.js
// ==/UserScript==

function main() {
    var buiBtn = document.querySelector('div.bilibili-player-video-danmaku-switch>input.bui-switch-input');
    var iframe = document.querySelector('iframe');
    if (!iframe && !buiBtn) {
        console.log('no iframe or bui-switch-btn, dealy 2s');
        setInterval(function() {main()}, 2000);
        return;
    }
    var innerDoc = null;
    if (!buiBtn) {
        innerDoc = iframe ? ((iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document) : null;
    }
    innerDoc ? !!innerDoc.querySelector('div.bilibili-live-player-video-controller').dispatchEvent(new Event('mouseenter')) : null;
    document.onkeydown = function(e) {
        let keyNum = window.event ? e.keyCode : e.which;
        if (keyNum === 67) {
            var danmaku = (document.querySelector('input.bui-switch-input')
             || (innerDoc ? (innerDoc.querySelector('button.blpui-btn[data-title="隐藏弹幕"]')
             || innerDoc.querySelector('button.blpui-btn[data-title="显示弹幕"]')) : null));
            if (danmaku) danmaku.click();
        }
    }
}

(function() {
    var inIframe = function() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    if (!inIframe()) {
        var script = document.createElement('script');
        script.appendChild(document.createTextNode('('+ main +')();'));
        (document.body || document.head || document.documentElement).appendChild(script);
    } else {
        console.log('in iframe, will not insert');
    }
})();