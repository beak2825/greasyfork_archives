// ==UserScript==
// @name         Discogs Draft Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Deletes All Discog Submission Drafts on the Page. Adds a "Delete All" button under "Add a Release" on Discogs submissions/drafts pages to delete all submissions. Clicking the button will click all delete-draft buttons and confirm, shoutout Foolz_.
// @author       nj4442
// @license      CC-BY-4.0
// @match        https://www.discogs.com/users/drafts*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541248/Discogs%20Draft%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/541248/Discogs%20Draft%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility to wait for an element to appear
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if (elapsed >= timeout) {
                    clearInterval(timer);
                    reject(new Error('Element not found: ' + selector));
                }
                elapsed += interval;
            }, interval);
        });
    }

    // Simulate a click
    function simulateClick(element) {
        if (!element) return;
        element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }

    // Main deletion logic
    async function autoDelete() {
        let deleteButtons = Array.from(document.querySelectorAll('button.button-red.delete-draft'));

        // If none found, exit
        if (deleteButtons.length === 0) {
            alert("No delete buttons found.");
            return;
        }

        for (let btn of deleteButtons) {
            // Click the delete button
            simulateClick(btn);

            // Wait for the modal to appear
            try {
                await waitForElement('.react-modal .react-modal-title');
                // Confirm it's the correct modal by checking title/content
                let title = document.querySelector('.react-modal .react-modal-title');
                if (title && /confirm/i.test(title.textContent)) {
                    // Find and click the Okay button in the modal (look for span "Okay")
                    let okayBtn = Array.from(document.querySelectorAll('.react-modal button')).find(b =>
                        Array.from(b.querySelectorAll('span')).some(s => /okay/i.test(s.textContent))
                    );
                    if (okayBtn) {
                        simulateClick(okayBtn);
                        // Wait for DOM to update/remove the deleted item
                        await new Promise(r => setTimeout(r, 1500));
                    }
                }
            } catch (e) {
                // Modal didn't appear, skip
                continue;
            }
        }
        alert("All visible drafts/submissions deleted. Refresh to check for more.");
    }

    // Create and inject the "Delete All" button below the "Add a Release" button
    function addDeleteAllButton() {
        if (document.getElementById('userscript-delete-all-btn')) return; // avoid duplicates

        // Find the "Add a Release" button
        let addReleaseBtn = document.querySelector('a.button.button-green.fright[href="/release/add"]');
        if (!addReleaseBtn) return;

        // Create the Delete All button
        let btn = document.createElement('button');
        btn.id = 'userscript-delete-all-btn';
        btn.innerHTML = `<span style="display:inline-block;vertical-align:middle;font-size:20px;line-height:20px;color:#fff;background:none;margin-right:8px;">
            <svg width="20" height="20" viewBox="0 2 20 20" style="vertical-align:middle;">
                <rect x="4" y="9" width="15" height="3.5" rx="2" fill="#fff"/>
            </svg>
        </span>
        <span style="vertical-align:middle;">Delete All Drafts</span>`;

        btn.className = 'Info';
        btn.style.marginTop = '0px';
        btn.style.marginLeft = '100px';
        btn.style.background = '#c00';
        btn.style.color = '#fff';
        btn.style.padding = '4.5px 15px';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.fontSize = '15px';
        btn.style.fontWeight = 'normal';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 0px 0px rgba(0,0,0,0.2)';
        btn.onmouseenter = () => btn.style.background = '#a00';
        btn.onmouseleave = () => btn.style.background = '#c00';
        btn.onclick = function() {
            if (confirm('Are you sure you want to delete ALL visible drafts/submissions? This cannot be undone!')) {
                autoDelete();
            }
        };

        // Insert after the Add a Release button
        addReleaseBtn.parentNode.insertBefore(btn, addReleaseBtn.nextSibling);
    }

    // Only show button on likely drafts/submissions page
    function maybeAddButton() {
        if (/submissions|drafts/i.test(window.location.pathname)) {
            addDeleteAllButton();
        }
    }

    // Initial run
    maybeAddButton();

    // Listen for SPA navigation
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            maybeAddButton();
        }
    }, 1000);
})();