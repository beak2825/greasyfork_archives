// ==UserScript==
// @name         AWBW Viewer Count Hider
// @namespace    https://awbw.amarriner.com/
// @version      1.0
// @description  Hides viewer count
// @icon         https://awbw.amarriner.com/favicon.ico
// @author       lol
// @match        https://awbw.amarriner.com/game.php?games_id=*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/538803/AWBW%20Viewer%20Count%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/538803/AWBW%20Viewer%20Count%20Hider.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hideViewerCount(node) {
        const viewer = node.querySelector('.game-viewer-count');
        if (viewer) {
            const cover = document.createElement('span');
            cover.textContent = '???';
            cover.style.fontWeight = 'bold';
            cover.style.color = '#000';
            node.replaceWith(cover);
        }
    }

    document.querySelectorAll('span.small_text_14.bold').forEach(hideViewerCount);

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    if (node.matches && node.matches('span.small_text_14.bold')) {
                        hideViewerCount(node);
                    } else if (node.querySelector) {
                        const match = node.querySelector('span.small_text_14.bold');
                        if (match) hideViewerCount(match);
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();