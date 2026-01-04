// ==UserScript==
// @name         Steam250 Redirector
// @namespace    https://mjyai.com
// @version      1.0.0
// @description  Adds a button to Steam250 for region-locked games.
// @author       mjy
// @match        *://store.steampowered.com/app/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/528307/Steam250%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/528307/Steam250%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSteam250Button() {
        const errorBox = document.querySelector('#error_box');
        const pageHeader = document.querySelector('h2.pageheader');

        if (errorBox && pageHeader && pageHeader.innerText.includes("OOPS, SORRY!")) {
            const appIdMatch = window.location.pathname.match(/\/app\/(\d+)/);
            if (appIdMatch) {
                const appId = appIdMatch[1];
                const steam250Url = `https://club.steam250.com/app/${appId}`;

                const button = document.createElement('a');
                button.href = steam250Url;
                button.innerText = 'View on Steam250';
                button.style.display = 'block'; // New line
                button.style.width = '90%'; // 90% width
                button.style.margin = '10px auto'; // Centered
                button.style.padding = '12px';
                button.style.background = '#1b2838';
                button.style.color = 'white';
                button.style.borderRadius = '5px';
                button.style.textDecoration = 'none';
                button.style.fontSize = '14px';
                button.style.textAlign = 'center';

                errorBox.appendChild(button);
            }
        }
    }

    window.addEventListener('load', addSteam250Button);
})();