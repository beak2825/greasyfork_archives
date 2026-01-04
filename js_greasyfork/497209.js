// ==UserScript==
// @name         あぷ小へ飛ぶ
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Open selected text as URL suffix
// @author       toshiaki
// @match        https://discord.com/channels/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497209/%E3%81%82%E3%81%B7%E5%B0%8F%E3%81%B8%E9%A3%9B%E3%81%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/497209/%E3%81%82%E3%81%B7%E5%B0%8F%E3%81%B8%E9%A3%9B%E3%81%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('contextmenu', function(event) {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            event.preventDefault(); // 標準の右クリックメニューをキャンセル

            const contextMenu = document.createElement('div');
            contextMenu.style.position = 'absolute';
            contextMenu.style.top = `${event.clientY}px`;
            contextMenu.style.left = `${event.clientX}px`;
            contextMenu.style.backgroundColor = 'white';
            contextMenu.style.border = '1px solid black';
            contextMenu.style.padding = '5px';
            contextMenu.style.cursor = 'pointer';
            contextMenu.style.zIndex = 10000; // カスタムメニューを前面に表示
            contextMenu.textContent = `Open ${selectedText} as URL`;
            contextMenu.onclick = function() {
                window.open(`https://dec.2chan.net/up2/src/${selectedText}`, '_blank');
                document.body.removeChild(contextMenu);
            };
            document.body.appendChild(contextMenu);

            document.addEventListener('click', function() {
                if (document.body.contains(contextMenu)) {
                    document.body.removeChild(contextMenu);
                }
            }, { once: true });
        }
    });
})();
