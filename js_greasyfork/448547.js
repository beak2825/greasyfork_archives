// ==UserScript==
// @name         Open-link-in-new-tab
// @namespace    cyyyu
// @version      0.1
// @description  Append "[[New tab]]" to links that don't open in new tab. Skip image links.
// @author       Chuang Yu
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sourceforge.net
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448547/Open-link-in-new-tab.user.js
// @updateURL https://update.greasyfork.org/scripts/448547/Open-link-in-new-tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const aTags = document.querySelectorAll('a');
    const linksOpenInWindow = Array.from(aTags).filter(a => {
        const isInWindow = a.getAttribute('target') !== '_blank';
        if (!isInWindow) return false;
        const url = a.getAttribute('href');
        if (!url || !url.startsWith('http')) return false;
        const hasImage = a.querySelector('img') || a.querySelector('svg');
        if (hasImage) return false;
        return true;
    });
    linksOpenInWindow.forEach(a => {
        const newLink = document.createElement('a');
        newLink.setAttribute('href', a.getAttribute('href'));
        newLink.setAttribute('target', '_blank');
        newLink.textContent = ' [[New tab]]';
        a.appendChild(newLink);
    });
})();