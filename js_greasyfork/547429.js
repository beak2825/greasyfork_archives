// ==UserScript==
// @name         Perplexiti New Thread Shortcut
// @namespace    https://blog.valley.town/@zeronox
// @version      1.0
// @description  새 채팅 단축키 Ctrl+Shift+Z로 지정.
// @author       zeronox
// @license      MIT
// @match        https://www.perplexity.ai/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=perplexity.ai
// @downloadURL https://update.greasyfork.org/scripts/547429/Perplexiti%20New%20Thread%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/547429/Perplexiti%20New%20Thread%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'z') {
            event.preventDefault();
            const newThreadButton = document.querySelector('button[data-testid="sidebar-new-thread"]');
            if (newThreadButton) {
                console.log('새 스레드 버튼을 찾아 단축키로 클릭했습니다.');
                newThreadButton.click();
            } else {
                console.error('새 스레드 버튼을 찾을 수 없습니다.');
            }
        }
    });
})();