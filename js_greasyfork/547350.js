// ==UserScript==
// @name         Perplexity Searching Mode Switching
// @namespace    https://blog.valley.town/@zeronox
// @version      1.1
// @description  Alt+Z (검색), Alt+X (연구), Alt+C (실험실) 단축키로 Perplexity의 검색 모드를 전환합니다.
// @author       zeronox
// @match        https://www.perplexity.ai/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=perplexity.ai
// @downloadURL https://update.greasyfork.org/scripts/547350/Perplexity%20Searching%20Mode%20Switching.user.js
// @updateURL https://update.greasyfork.org/scripts/547350/Perplexity%20Searching%20Mode%20Switching.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        if (!event.altKey) {
            return;
        }

        let targetButton;
        switch (event.key.toLowerCase()) {
            case 'z':
                targetButton = document.querySelector('button[value="search"]');
                break;
            case 'x':
                targetButton = document.querySelector('button[value="research"]');
                break;
            case 'c':
                targetButton = document.querySelector('button[value="studio"]');
                break;
            default:
                return;
        }
        if (targetButton) {
            event.preventDefault();
            targetButton.click();
        }
    });
})();