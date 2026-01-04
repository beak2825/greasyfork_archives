// ==UserScript==
// @name         Perplexity Source Toggle
// @namespace    https://blog.valley.town/@zeronox
// @version      1.1
// @description  web, social, scholar, finance 4가지 소스 전환. alt+1,2,3,4.
// @author       zeronox
// @license      MIT
// @match        https://www.perplexity.ai/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=perplexity.ai
// @downloadURL https://update.greasyfork.org/scripts/547428/Perplexity%20Source%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/547428/Perplexity%20Source%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function toggleSource(sourceTestId) {
        const sourcesButton = document.querySelector('[data-testid="sources-switcher-button"]');
        if (!sourcesButton) {
            console.error('소스 전환 버튼을 찾을 수 없습니다.');
            return;
        }
        sourcesButton.click();
        setTimeout(() => {
            const sourceSwitch = document.querySelector(`[data-testid="${sourceTestId}"] button[role="switch"]`);
            if (sourceSwitch) {
                sourceSwitch.click();
            } else {
                console.error(`'${sourceTestId}'에 대한 스위치를 찾을 수 없습니다.`);
            }
            const closeButton = document.querySelector('[data-testid="sources-switcher-button"]');
            if (closeButton) {
                closeButton.click();
            }
        }, 300);
    }
    document.addEventListener('keydown', (event) => {
        if (!event.altKey || event.ctrlKey || event.shiftKey) {
            return;
        }

        switch (event.key) {
            case '1':
                event.preventDefault();
                toggleSource('source-toggle-web');
                break;
            case '2':
                event.preventDefault();
                toggleSource('source-toggle-scholar');
                break;
            case '3':
                event.preventDefault();
                toggleSource('source-toggle-social');
                break;
            case '4':
                event.preventDefault();
                toggleSource('source-toggle-edgar');
                break;
        }
    });

})();