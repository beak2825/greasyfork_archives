// ==UserScript==
// @name        発言時間表示 (最終版)
// @namespace   http://tampermonkey.net/
// @version     2.5
// @description 各発言の右側から3cm左にタイムスタンプを表示。
// @author      Rabbit
// @match       *://drrrkari.com/room/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/523363/%E7%99%BA%E8%A8%80%E6%99%82%E9%96%93%E8%A1%A8%E7%A4%BA%20%28%E6%9C%80%E7%B5%82%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523363/%E7%99%BA%E8%A8%80%E6%99%82%E9%96%93%E8%A1%A8%E7%A4%BA%20%28%E6%9C%80%E7%B5%82%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addTimestamps() {
        const newTalks = document.querySelectorAll('.talk:not(.timestamped)');

        newTalks.forEach(talk => {
            const now = new Date();
            let timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            timestamp.style.cssText = `
                font-size: smaller;
                color: #fff;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
                margin-left: calc(100% - 3cm - 5px); /* 右端から3cm左に配置 */
                white-space: nowrap;
                font-family: sans-serif;
                display: inline-block;
            `;
            timestamp.textContent = timeString;

            talk.appendChild(timestamp);

            talk.classList.add('timestamped');
        });
    }

    const observer = new MutationObserver(addTimestamps);
    const chatContainer = document.querySelector('#chat-container') || document.body;
    if(chatContainer){
        observer.observe(chatContainer, { childList: true, subtree: true });
    } else {
        console.error("Chat container not found. Timestamp script may not work correctly.")
    }

    addTimestamps();
})();