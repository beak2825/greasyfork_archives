// ==UserScript==
// @name         Torn Special Weapon Log Helper
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds keyword labels inside a box in Torn's attack log for easier visibility on both desktop and mobile devices.
// @author       QueenLunara [3408686]
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508351/Torn%20Special%20Weapon%20Log%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/508351/Torn%20Special%20Weapon%20Log%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const keywords = ['eviscerated', 'raged'];
    const processedItems = new Set();

    const customEvents = {
        'attacking-events-rage': 'Rage',
        'attacking-events-assault': 'Assault',
        'attacking-events-eviscareted': 'Eviscerated',
        'attacking-events-critical-hit': 'Critical',
    };

    function addLabel(log, labelText) {
        if (log.querySelector(`.log-label[data-label="${labelText}"]`)) {
            return;
        }

        const labelElement = document.createElement('span');
        labelElement.innerText = labelText;
        labelElement.style.fontWeight = 'bold';
        labelElement.style.color = '#0056b3';
        labelElement.style.marginLeft = '10px';
        labelElement.style.fontSize = 'inherit';
        labelElement.style.lineHeight = 'inherit';
        labelElement.style.verticalAlign = 'middle';
        labelElement.style.padding = '2px 6px';
        labelElement.style.border = '1px solid #0056b3';
        labelElement.style.borderRadius = '4px';
        labelElement.style.display = 'inline-block';
        labelElement.style.maxWidth = '90%';
        labelElement.style.wordWrap = 'break-word';
        labelElement.classList.add('log-label');
        labelElement.setAttribute('data-label', labelText);

        log.querySelector('.message').appendChild(labelElement);
    }

    function highlightKeywords(newNodes) {
        newNodes.forEach(log => {
            const messageWrap = log.querySelector('.message');
            let customEventDetected = false;

            if (messageWrap && !processedItems.has(log)) {
                Object.keys(customEvents).forEach(eventClass => {
                    const eventElement = log.querySelector(`.${eventClass}`);
                    if (eventElement && !log.querySelector('.attacking-events-standart-damage')) {
                        addLabel(log, customEvents[eventClass]);
                        customEventDetected = true;
                    }
                });
                if (!customEventDetected) {
                    let logText = messageWrap.innerText.toLowerCase();
                    keywords.forEach(keyword => {
                        if (logText.includes(keyword)) {
                            addLabel(log, keyword.charAt(0).toUpperCase() + keyword.slice(1));
                        }
                    });
                }

                processedItems.add(log);
            }
        });
    }

    function init() {
        const logItems = document.querySelectorAll('.log-list .message-wrap');
        highlightKeywords(logItems);
    }

    window.addEventListener('DOMContentLoaded', () => {
        const logContainer = document.querySelector('#log-list-scrollbar');
        if (logContainer) {
            init();
        }
        const observer = new MutationObserver(mutations => {
            const addedNodes = [];
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('.log-list .message-wrap')) {
                        addedNodes.push(node);
                    }
                });
            });
            if (addedNodes.length > 0) {
                highlightKeywords(addedNodes);
            }
        });
        observer.observe(logContainer, { childList: true, subtree: true });
    });
})();
