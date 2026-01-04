// ==UserScript==
// @name         Lighthouse Compass helper script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Break out all dashboard elements to be visible/scrollable in the viewport; dim out users who last requested assistance more than 1 week ago.
// @author       Max Kovalenkov
// @match        https://web.compass.lighthouselabs.ca/queue
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402486/Lighthouse%20Compass%20helper%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/402486/Lighthouse%20Compass%20helper%20script.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function() {
    'use strict';

    const nodeWithMaxHeight = document.querySelector('div.queue-by-location');
    console.log('node: ', nodeWithMaxHeight);
    nodeWithMaxHeight.style.maxHeight = 'initial';

    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('div.queue-column.right ul.list-group');
    console.log('targetNode', targetNode);

    const regex = /(weeks ago)|(month(s?) ago)$/i;
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
                const node = mutation.addedNodes[i];
                const lastRequest = node.querySelector('span.time > span').textContent;
                const res = lastRequest.match(regex);
                if(res) {
                    console.log('last request:', lastRequest);
                    // node.style.background = 'rgba(0,0,0,0.03)';
                    node.style.opacity = '0.3';
                }
            }
        });
    });

    observer.observe(targetNode, { childList: true, subtree: true });

    // observer.disconnect(); // can disconnect when no longer needed
})();