// ==UserScript==
// @name         Envoy Visitor Pic Enhance (SPA Fix)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Enhance visitor avatars only on /visitors/ pages, but run on all Envoy pages for SPA support and reliability improvements.
// @author       You
// @match        https://dashboard.envoy.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/523873/Envoy%20Visitor%20Pic%20Enhance%20%28SPA%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523873/Envoy%20Visitor%20Pic%20Enhance%20%28SPA%20Fix%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function isVisitorsPage() {
        return window.location.pathname.startsWith('/visitors');
    }

    function applyStyles() {
        if (!isVisitorsPage()) return;

        const profileRows = document.querySelectorAll('div.table-row');
        if (profileRows.length === 0) return;

        profileRows.forEach((row) => {
            const profilePic = row.querySelector('span.block.mx-auto.overflow-hidden.rounded-full');
            const nameElement = row.querySelector('div[data-test-entry-full-name-clamp]');
            const signOutTime = row.querySelector('span[data-test-entry-feed-sign-out-time]');
            const signInTime = row.querySelector('div[data-test-entry-feed-sign-in-time]');
            const signOutText = row.textContent.includes('Sign out');

            if (profilePic) {
                const picSize = signOutText ? '160px' : '60px';
                profilePic.style.borderRadius = '90px';
                profilePic.style.width = picSize;
                profilePic.style.height = picSize;
                profilePic.style.border = '4px solid';
                profilePic.style.borderColor = signOutText ? '#2bbd31' : '#ae302c';

                const img = profilePic.querySelector('img');
                if (img) {
                    img.style.width = picSize;
                    img.style.height = picSize;
                    img.style.objectFit = 'cover';

                    if (!img.dataset.listenersAdded) {
                        img.addEventListener('mouseover', handleMouseOver);
                        img.addEventListener('mouseout', handleMouseOut);
                        img.dataset.listenersAdded = 'true';
                    }
                }
            }

            if (nameElement) {
                nameElement.style.color = signOutText ? '#2bbd31' : '#ae302c';
            }

            if (signInTime) {
                signInTime.style.color = signOutText ? '#2bbd31' : '#8b8171';
            }
        });

        console.log('Envoy Visitor Pic Enhance: Styles applied');
    }

    function handleMouseOver(event) {
        const img = event.target;
        const pic = img.closest('span');
        pic.style.width = '160px';
        pic.style.height = '160px';
        img.style.width = '160px';
        img.style.height = '160px';
    }

    function handleMouseOut(event) {
        const img = event.target;
        const pic = img.closest('span');
        const signOutText = img.closest('div.table-row').textContent.includes('Sign out');
        const picSize = signOutText ? '160px' : '60px';

        pic.style.width = picSize;
        pic.style.height = picSize;
        img.style.width = picSize;
        img.style.height = picSize;
        pic.style.borderColor = signOutText ? '#2bbd31' : '#ae302c';
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const debouncedApplyStyles = debounce(applyStyles, 200);

    const contentObserver = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                debouncedApplyStyles();
            }
        }
    });

    contentObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            if (isVisitorsPage()) {
                console.log('Envoy Visitor Pic Enhance: URL changed, applying styles...');
                waitForProfileRows();
            }
        }
    });
    urlObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    function waitForProfileRows() {
        if (!isVisitorsPage()) return;
        const interval = setInterval(() => {
            if (!isVisitorsPage()) {
                clearInterval(interval);
                return;
            }

            const profileRows = document.querySelectorAll('div.table-row');
            if (profileRows.length > 0) {
                clearInterval(interval);
                applyStyles();
            }
        }, 300);
    }

    waitForProfileRows();
})();
