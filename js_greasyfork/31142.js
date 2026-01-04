// ==UserScript==
// @name         hide-wiki-permission-tip
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://wiki.sankuai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31142/hide-wiki-permission-tip.user.js
// @updateURL https://update.greasyfork.org/scripts/31142/hide-wiki-permission-tip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styleel = document.createElement('style');
    styleel.setAttribute('type', 'text/css');
    styleel.textContent = `
#header-precursor {
  display: none;
}
`;
    document.head.appendChild(styleel);

    document.addEventListener('DOMContentLoaded', () => {
        const el = document.getElementById('header-precursor');
        if (el) {
            el.parentNode.removeChild(el);
        }
    });
})();