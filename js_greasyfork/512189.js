// ==UserScript==
// @name         [Azure] Auto Resolve All
// @namespace    Azure
// @version      1.10.12
// @description  [Azure] Auto Resolve
// @author       N.Duong
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @run-at       document-start
// @grant        none
// @license      MIT
// @match        https://*/*/pullrequest/*
// @match        https://*/*/pullrequest/*
// @downloadURL https://update.greasyfork.org/scripts/512189/%5BAzure%5D%20Auto%20Resolve%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/512189/%5BAzure%5D%20Auto%20Resolve%20All.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addResolveAllButton() {
        if (document.querySelector('#resolve')) {
            return; // Button already exists
        }

        let targetDiv = document.querySelector('.repos-activity-filter-dropdown');
        if (targetDiv) {
            let resolveButton = document.createElement('button');
            resolveButton.id = "resolve";
            resolveButton.textContent = 'Resolve All';
            resolveButton.className = 'bolt-button enabled bolt-focus-treatment';
            resolveButton.type = 'button';
            resolveButton.tabIndex = '0';
            resolveButton.style.marginLeft = '12px';

            resolveButton.addEventListener('click', function() {
                let xpath = "//div[contains(@class, 'repos-comment-editor-max-width')]//button[contains(@class, 'bolt-button')]";
                let button = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                for (let i = 0; i < button.snapshotLength; i++) {
                    let element = button.snapshotItem(i);
                    if (element.textContent.trim().toLowerCase() === 'resolve') {
                        console.log(element.textContent);
                        element.click();
                    }
                }
            });

            targetDiv.appendChild(resolveButton);
        }
    }
    
    // Option 1:
    window.addEventListener('DOMContentLoaded', addResolveAllButton, false);
    
    // Option 2:
    //addResolveAllButton();
    //const observer = new MutationObserver(addResolveAllButton);
    //observer.observe(document.body, { childList: true, subtree: true });
})();