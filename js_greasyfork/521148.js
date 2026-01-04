// ==UserScript==
// @name         Myrient Collect Links with Filters
// @version      1.0
// @description  Collect, filter links, and then copy to your clipboard with a single button click. filters for links containing "(USA)" and excludes "(demo)" and "(kiosk)". Is fairly easy to modify.
// @author       Dethkiller15 & ChatGPT
// @match        https://myrient.erista.me/files/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @namespace https://greasyfork.org/users/994690
// @downloadURL https://update.greasyfork.org/scripts/521148/Myrient%20Collect%20Links%20with%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/521148/Myrient%20Collect%20Links%20with%20Filters.meta.js
// ==/UserScript==

// Note: This is meant to be used with a urls.txt downloader.(something that can batch download urls inside a .txt file) its fairly easy to make one yourself with chatgpt using a .bat or .sh file if you dont want to install one.

(function() {
    'use strict';

    // Add button to the bottom-left of the screen
    const button = document.createElement('button');
    button.textContent = "Copy Links";
    button.id = "copy-links-btn";
    document.body.appendChild(button);

    // Style the button
    GM_addStyle(`
        #copy-links-btn {
            position: fixed;
            bottom: 10px;
            left: 10px;
            z-index: 9999;
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-size: 14px;
        }
        #copy-links-btn:hover {
            background-color: #0056b3;
        }
    `);

    // Button click event
    button.addEventListener('click', () => {
        const pageUrl = window.location.origin;
        const links = [...document.querySelectorAll('a[href][title]')]
            .filter(link =>
                link.title.toLowerCase().includes("(usa)") &&
                !link.title.toLowerCase().includes("(demo)") &&
                !link.title.toLowerCase().includes("(kiosk)")
            )
            .map(link => new URL(link.href, pageUrl).href);

        // Copy links to clipboard
        if (links.length > 0) {
            GM_setClipboard(links.join('\n'), { type: 'text', mimetype: 'text/plain' });
            alert(`Copied ${links.length} link(s) to clipboard!`);
        } else {
            alert("No matching links found.");
        }
    });
})();
