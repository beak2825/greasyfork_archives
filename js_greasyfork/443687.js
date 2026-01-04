// ==UserScript==
// @name         HN Favicons
// @namespace    https://campital.xyz/
// @version      0.3
// @license MIT
// @description  Favicons for Hacker News
// @match        https://*.ycombinator.com/*
// @grant        GM.addElement
// @downloadURL https://update.greasyfork.org/scripts/443687/HN%20Favicons.user.js
// @updateURL https://update.greasyfork.org/scripts/443687/HN%20Favicons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for (let link of document.querySelectorAll('.titlelink')) {
        let domain;
        try {
            domain = new URL(link.href).hostname;
        } catch(err) {
            continue;
        }
        const imageUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
        const container = document.createElement('span');
        container.style.paddingRight = '0.25em';
        container.style.paddingLeft = '0.25em';
        link.prepend(container);
        GM.addElement(container, 'img', {
            src: imageUrl,
            width: 16,
            height: 16
        });
    }
})();