// ==UserScript==
// @name         Hide 7tv theather mode button on youtube
// @version      1.3
// @description  It is in the name
// @author       equmaq
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/990886
// @downloadURL https://update.greasyfork.org/scripts/462136/Hide%207tv%20theather%20mode%20button%20on%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/462136/Hide%207tv%20theather%20mode%20button%20on%20youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElementsByClassName(className) {
        const elements = document.getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
            elements[i].remove();
        }
    }

    const targetClassName = 'seventv-yt-theater-mode-button-container';

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const addedNodes = Array.from(mutation.addedNodes);
            addedNodes.forEach((node) => {
                if (node.classList && node.classList.contains(targetClassName)) {
                    removeElementsByClassName(targetClassName);
                }
            });
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();