// ==UserScript==
// @name         Centreon improvement changes
// @namespace    ESM Centreon CSS
// @version      4.0
// @description  Change background color on specified page and adds Paste button, unchecks Notify, checks Sticky and Set downtime on services attached to host
// @author       KLElisa
// @match        https://scsmon01.smn.prod/*
// @match        https://scsmon02.smn.prod/*
// @match        https://monitoring.santacare.net/*
// @match        https://monitoring01.santacare.net/*
// @match        https://monitoring02.santacare.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/475890/Centreon%20improvement%20changes.user.js
// @updateURL https://update.greasyfork.org/scripts/475890/Centreon%20improvement%20changes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElements(selector, duration, maxTries, identifier) {
        return new Promise((resolve, reject) => {
            let tries = 0;
            const interval = setInterval(() => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    clearInterval(interval);
                    resolve(elements);
                } else if (tries >= maxTries) {
                    clearInterval(interval);
                    reject(new Error(`Elements ${identifier} not found`));
                }
                tries++;
            }, duration);
        });
    }

    // CSS for the button
    GM_addStyle(`
        .styled-paste-button {
            background-color: #3067a8;
            color: #ffffff;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;
            margin-left: 8px;
        }
        .styled-paste-button:hover {
            background-color: #255891;
        }
    `);

    // Add the "Paste" button
    async function addButton() {
        var elements = document.querySelectorAll('[data-testid="Disable autorefresh"]');
        if (elements.length > 0 && !document.querySelector('.styled-paste-button')) {
            var btn = document.createElement("BUTTON");
            btn.textContent = "Paste";
            btn.className = "styled-paste-button";
            btn.onclick = async function() {
                var searchInput = document.querySelector('.MuiInputBase-input[placeholder="Search"]');
                if (searchInput) {
                    const clipboardText = await navigator.clipboard.readText();
                    searchInput.focus();
                    searchInput.select();
                    document.execCommand('insertText', false, clipboardText);
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    var enterEvent = new KeyboardEvent('keydown', {bubbles : true, cancelable : true, key : "Enter"});
                    searchInput.dispatchEvent(enterEvent);
                    var refreshButton = document.querySelector('[data-testid="Refresh"]');
                    if (refreshButton) {
                        refreshButton.click();
                    }
                }
            };
            elements[0].parentNode.parentNode.appendChild(btn);
        }
    }

    window.addEventListener('load', function() {
        addButton();

        // Change the sorting order
        waitForElements('[aria-label="Column Status"]', 200, 50, 'Column Status')
            .then((elements) => {
            var isAscending = elements[0].querySelector('.MuiTableSortLabel-iconDirectionAsc') !== null;
            if (isAscending) {
                elements[0].click();
                localStorage.setItem('statusSorting', 'descending');
            }
        })
            .catch((error) => {
            console.error(error);
        });

        var observer = new MutationObserver(addButton);
        observer.observe(document.body, { childList: true, subtree: true });
    }, false);

    // New functionality to manage checkboxes
    function uncheckNotify() {
        const notifyCheckbox = document.querySelector('input[aria-label="Notify"]');
        if (notifyCheckbox && notifyCheckbox.checked) {
            notifyCheckbox.click();
        }
    }

    function checkForNotify() {
        const notifyElement = document.querySelector('input[aria-label="Notify"]');
        if (notifyElement) {
            uncheckNotify();
        }
    }

    function checkDowntime() {
        const downtimeCheckbox = document.querySelector('input[aria-label="Set downtime on services attached to host"]');
        if (downtimeCheckbox && !downtimeCheckbox.checked) {
            downtimeCheckbox.click();
        }
    }

    function checkForDowntime() {
        const downtimeElement = document.querySelector('input[aria-label="Set downtime on services attached to host"]');
        if (downtimeElement) {
            checkDowntime();
        }
    }


    function checkSticky() {
        const stickyCheckbox = document.querySelector('input[aria-label="Sticky"]');
        if (stickyCheckbox && !stickyCheckbox.checked) {
            stickyCheckbox.click();
        }
    }

    function checkForSticky() {
        const stickyElement = document.querySelector('input[aria-label="Sticky"]');
        if (stickyElement) {
            checkSticky();
        }
    }

    // Check for the Notify checkbox every second
    setInterval(checkForNotify, 1000);

    // Check for the Downtime checkbox every second
    setInterval(checkForDowntime, 1000);

    // Check for the Sticky checkbox every second
    setInterval(checkForSticky, 1000);
})();