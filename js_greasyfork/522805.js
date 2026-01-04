// ==UserScript==
// @name         Fix Aternos Site
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  It Fixes site design issues, blocks ads, and dynamically removes specific unwanted elements.
// @author       https://youtube.com/@vukichannel
// @match        https://aternos.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aternos.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522805/Fix%20Aternos%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/522805/Fix%20Aternos%20Site.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables
    let isContentReplaced = false;
    let sidebaron = false; // Toggle sidebar visibility
    let canClickDivs = true;
    const targetText = 'Continue with adblocker anyway';

    // Function to remove elements by class name
    function removeElementsByClass(classNames) {
        classNames.forEach(className => {
            const elements = document.querySelectorAll(`.${className}`);
            elements.forEach(element => element.remove());
        });
    }

    // Function to replace content of an element by class name
    function replaceContentByClass(className, newContent) {
        const elements = document.querySelectorAll(`.${className}`);
        elements.forEach(element => {
            if (!isContentReplaced) {
                element.innerHTML = newContent;
                isContentReplaced = true;
            }
        });
    }

    // Function to click divs containing specific text
    function clickDivsBasedOnCondition() {
        if (!canClickDivs) return;
        const divs = document.querySelectorAll('div');
        divs.forEach(div => {
            if (div.textContent.trim().toLowerCase() === targetText.toLowerCase()) {
                div.click();
            }
        });
    }

    // Function to remove dynamically created span with specific styles
    function removeTargetSpan() {
        const span = document.querySelector(
            'span[style*="position: fixed"][style*="bottom: 0px"][style*="z-index: 2147483646"]'
        );
        if (span) {
            span.remove();
        }
    }

    // Function to adjust header-right height
    function adjustHeaderHeight() {
        const header = document.querySelector('.header-right');
        if (header) {
            header.style.height = '100px';
            header.style.position = 'fixed';
            header.style.right = '16px';
        }
    }

    function rmuselesshelponhomepage() {
        if (window.location.href == 'https://aternos.org/servers/') {
            const a = document.querySelector('.help-center-articles');
            if (a) {
                a.remove();
                console.log(a)
            }
        }
    }

    function fixmarginissue() {
        const header = document.querySelector('.inner');
        if (header) {
            header.style.setProperty('display', 'flex', 'important');
            header.style.setProperty('justify-content', 'flex-end', 'important');
            header.style.setProperty('align-items', 'flex-end', 'important');
        }
    }
    // Sidebar customization logic
    let classesToRemove = [
        'responsive-leaderboard',
        'ad-dfp',
        'server-b-tutorials',
        'header-center',
        'fa-ban',
        'server-info-box-footer-autoupdate',
        'boost-cta-box',
        'new',
        'navigation-darkmode-toggle'
    ];

    if (!sidebaron) {
        classesToRemove.push('sidebar');
    } else {
        const newSidebarContent = `
            <ul style="list-style-type: none; padding: 0; background-color: black;">
                <li style="padding: 8px 16px; text-align: center;"><a href="https://aternos.org/server/" style="color: white; text-decoration: none;">Server</a></li>
                <li style="padding: 8px 16px; text-align: center;"><a href="https://aternos.org/options/" style="color: white; text-decoration: none;">Options</a></li>
                <li style="padding: 8px 16px; text-align: center;"><a href="https://aternos.org/console/" style="color: white; text-decoration: none;">Console</a></li>
                <li style="padding: 8px 16px; text-align: center;"><a href="https://aternos.org/log/" style="color: white; text-decoration: none;">Logs</a></li>
                <li style="padding: 8px 16px; text-align: center;"><a href="https://aternos.org/players/" style="color: white; text-decoration: none;">Players</a></li>
                <li style="padding: 8px 16px; text-align: center;"><a href="https://aternos.org/files/" style="color: white; text-decoration: none;">Files</a></li>
                <li style="padding: 8px 16px; text-align: center;"><a href="https://aternos.org/worlds/" style="color: white; text-decoration: none;">Worlds</a></li>
                <li style="padding: 8px 16px; text-align: center;"><a href="https://aternos.org/backups/" style="color: white; text-decoration: none;">Backups</a></li>
                <li style="padding: 8px 16px; text-align: center;"><a href="https://aternos.org/access/" style="color: white; text-decoration: none;">Access</a></li>
            </ul>`;
        replaceContentByClass('sidebar', newSidebarContent);
    }

    // Observe dynamic DOM changes for specific cleanup
    const spanObserver = new MutationObserver(() => {
        removeTargetSpan(); // Dynamically remove the span
    });

    // Start observing for span additions
    spanObserver.observe(document.body, { childList: true, subtree: true });

    // General observer for other cleanup tasks
    const observer = new MutationObserver(() => {
        adjustHeaderHeight();
        removeElementsByClass(classesToRemove);
        clickDivsBasedOnCondition();
        rmuselesshelponhomepage()
        fixmarginissue()
    });

    // Start observing the DOM for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial cleanup and adjustments
    adjustHeaderHeight();
    removeElementsByClass(classesToRemove);
    removeTargetSpan();
    clickDivsBasedOnCondition();
    rmuselesshelponhomepage()
    fixmarginissue()
})();
