// ==UserScript==
// @name         [GC] Neopoints Hider
// @namespace    https://greasyfork.org/en/users/1230396
// @version      1.0
// @description  Hide NP with your username and show NP on mouseover
// @author       Berna
// @match        https://www.grundos.cafe/*
// @icon         https://i.imgur.com/gDxnNrn.gif
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496182/%5BGC%5D%20Neopoints%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/496182/%5BGC%5D%20Neopoints%20Hider.meta.js
// ==/UserScript==
/*
If you have a short username (up to 6 characters), you can also use this in your site-wide css (https://www.grundos.cafe/help/siteprefs/) to make your points transparent before the script loads.

#userinfo a[href="/inventory/"] { color: transparent }
*/
(function() {
    'use strict';

    const npElement = document.querySelector('#userinfo a[href="/inventory/"]');
    const originalNP = npElement.textContent.trim();
    const usernameElement = document.querySelector('#userinfo a[href*="/userlookup/?user="]');

    const originalWidth = npElement.offsetWidth;
    const originalminWidth = npElement.offsetminWidth;

    npElement.textContent = usernameElement.textContent.trim();
    npElement.style.color = window.getComputedStyle(usernameElement).color;
    npElement.style.display = 'inline-block';
    npElement.style.width = originalWidth + 'px';
    npElement.style.minWidth = originalminWidth + 'px';
    npElement.style.textAlign = 'start';

    npElement.addEventListener('mouseover', () => {
        npElement.textContent = originalNP;
    });

    npElement.addEventListener('mouseout', () => {
        npElement.textContent = usernameElement.textContent.trim();
    });
})();