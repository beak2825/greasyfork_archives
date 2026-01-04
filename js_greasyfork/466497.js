// ==UserScript==
// @name         Copy User Lolz Id by_el9in
// @namespace    Copy User Lolz Id by_el9in
// @version      0.2
// @description  Copy User Lolz Id
// @author       el9in
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/466497/Copy%20User%20Lolz%20Id%20by_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/466497/Copy%20User%20Lolz%20Id%20by_el9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const followContainer = document.querySelector('div.followContainer') || document.querySelector('a.button.full.followContainer.OverlayTrigger');
    if(followContainer) {
        const idContainer = document.createElement('div');
        idContainer.className = 'idContainer';
        const idButton = document.createElement('a');
        idButton.className = 'idButton button block OverlayTrigger';
        idButton.setAttribute('title', '');
        idButton.setAttribute('id', '');
        idButton.setAttribute('data-cacheoverlay', 'false');
        idButton.textContent = 'Скопировать ID';
        idContainer.appendChild(idButton);
        followContainer.insertAdjacentElement('afterend', idContainer);
        idButton.addEventListener('click', function() {
            const userContentLinks = document.querySelector('div.userContentLinks');
            const firstLink = userContentLinks.querySelector('a.button:nth-child(2)');
            const href = firstLink.getAttribute('href');
            const hrefText = href.match(/\/(\d+)\//)[1];
            if((hrefText | 0) != 0) {
                const userId = hrefText | 0;
                navigator.clipboard.writeText(userId);
            }
        });
    }
})();