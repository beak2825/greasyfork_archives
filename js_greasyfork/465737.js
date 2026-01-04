// ==UserScript==
// @name              KeepBingChat
// @description       实现火狐浏览器访问New Bing的ChatGPT（谷歌浏览器对user script不友好，所以暂时只支持火狐浏览器）
// @version           1.4
// @author            xcanwin
// @namespace         https://github.com/xcanwin/KeepBingChat/
// @supportURL        https://github.com/xcanwin/KeepBingChat/
// @icon              data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" stroke-width="2" fill="none" stroke="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
// @license           GPL-2.0-only
// @match             https://www.bing.com/*
// @match             https://www.bing.com/chat
// @match             https://*.bing.com/search?*q=Bing+AI*
// @run-at            document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/465737/KeepBingChat.user.js
// @updateURL https://update.greasyfork.org/scripts/465737/KeepBingChat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!location.href.match(/.*q=(bingchat|Bing\+AI).*/)) {
        return;
    }

    const setIfr = function(u = "") {
        const kbc = document.createElement('iframe');
        kbc.id = 'xcanwin';
        kbc.style = `position: fixed; top: 0; left: 0; width: 100%;height: 100%; border: none;`;
        document.documentElement.appendChild(kbc);
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1788.0"
        };
        fetch(u, {headers: headers}).then((response) => {
            response.text().then((data) => {
                try {
                    kbc.srcdoc = data;
                } catch (e) {
                    console.log(e);
                }
            })
        });
    };

    const clearWin = function() {
        window.stop();
        if (document.head) document.documentElement.removeChild(document.head);
        if (document.body) document.documentElement.removeChild(document.body);
    };

    const initWin = function() {
        const nHead = document.createElement('head');
        nHead.innerHTML = `<title>Bing Chat</title>`;
        document.documentElement.appendChild(nHead)
        const nBody = document.createElement('body');
        nBody.innerHTML = `<div>正在加载中.....<br>若长时间无反应, 说明当前网络缺乏魔法.</div>`;
        document.documentElement.appendChild(nBody)
    };

    const u = `https://www.bing.com/se${GM_info.script.namespace.slice(37, 38)}rch?q=Bing+AI&sh${GM_info.script.namespace.slice(16, 17)}wconv=1&cc=us&s${GM_info.script.namespace.slice(28, 29)}tlang=zh-Hans`;
    clearWin();
    initWin();
    setIfr(u);

})();
