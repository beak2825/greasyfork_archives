// ==UserScript==
// @name         Neoboards User Buttons
// @namespace    http://snotspoon.neocities.com
// @version      1.3
// @description  Inserts “Neomail User” and “Copy Username” buttons to the left of report buttons on Neoboards posts with custom styling.
// @match        *://www.neopets.com/neoboards/*
// @grant        none
// @author       @nadinejun0
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528807/Neoboards%20User%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/528807/Neoboards%20User%20Buttons.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Inject custom CSS
    const css = `
    /* Container for our extra buttons */
    #boardTopic ul li .np-extra-buttons {
      margin-bottom: 5px;
      clear: both;
    }
    /* Extra button style */
    #boardTopic ul li .np-extra-buttons .np-extra-button {
      border: 1px solid #CACACA;
      font-family: "Palanquin", "Arial Bold", sans-serif;
      font-size: 9pt;
      line-height: 9pt;
      padding: 5px 10px;
      box-sizing: border-box;
      color: #CACACA;
      background-color: #FFF;
      border-radius: 10px;
      margin: 5px 5px 5px 0;
      display: inline-block;
      float: left;
      position: relative;
    }
    /* Hover state */
    #boardTopic ul li .np-extra-buttons .np-extra-button:hover {
      background-color: #CACACA;
      color: #FFF;
      cursor: pointer;
    }
    /* Active state: while pressed, show "Copied!" overlay */
    #boardTopic ul li .np-extra-buttons .np-extra-button:active::after {
      content: "Copied!";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFF;
      background-color: #CACACA;
      border-radius: 10px;
    }
    `;
    const styleElem = document.createElement('style');
    styleElem.textContent = css;
    document.head.appendChild(styleElem);

    // extract username from userlookup link
    const getUsername = link => {
        try {
            const url = new URL(link.href, window.location.href);
            return url.searchParams.get('user');
        } catch {
            const match = link.href.match(/[?&]user=([^&#]+)/);
            return match ? decodeURIComponent(match[1]) : null;
        }
    };

    // create button element
    const createExtraButton = (label, clickHandler) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.className = 'np-extra-button';
        btn.addEventListener('click', clickHandler);
        return btn;
    };

    // insert extra buttons into the post byline if not already added.
    const processByline = byline => {
        if (byline.dataset.npExtraAdded) return;
        const link = byline.querySelector('a[href*="userlookup.phtml?user="]');
        if (!link) return;
        const username = getUsername(link);
        if (!username) return;
        const container = document.createElement('div');
        container.className = 'np-extra-buttons';

        // "Neomail User" button: opens neomail in a new tab.
        container.appendChild(createExtraButton('Neomail User', () => {
            window.open(`https://www.neopets.com/neomessages.phtml?type=send&recipient=${encodeURIComponent(username)}`, '_blank');
        }));
        // "Copy Username" button: copies username to clipboard.
        container.appendChild(createExtraButton('Copy Username', e => {
            e.preventDefault();
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(username);
            } else {
                const tempInput = document.createElement('input');
                tempInput.value = username;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
            }
        }));

        byline.dataset.npExtraAdded = 'true';
        return container;
    };

    // process each report button and insert our extra buttons before it - float:left
    const processReportButtons = () => {
        document.querySelectorAll('.reportButton-neoboards').forEach(reportBtn => {
            const byline = reportBtn.closest('li')?.querySelector('.boardPostByline');
            if (!byline) return;
            const extraButtons = processByline(byline);
            if (extraButtons) reportBtn.parentNode.insertBefore(extraButtons, reportBtn);
        });
    };

    // DOM
    if (document.readyState !== 'loading') processReportButtons();
    else document.addEventListener('DOMContentLoaded', processReportButtons);
})();