/*jshint esversion: 6 */
// ==UserScript==
// @name         Blackboard non-js "My Grades" links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows middle clicking in "My Grades" by turning assignment links from being managed by js to html.
// @author       Brendan Early
// @homepage     https://github.com/mymindstorm
// @source       https://github.com/mymindstorm/tampermonkey-scripts
// @supportURL   https://github.com/mymindstorm/tampermonkey-scripts/issues
// @license      MIT
// @match        https://acconline.austincc.edu/*
// @icon         https://www.google.com/s2/favicons?domain=blackboard.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436869/Blackboard%20non-js%20%22My%20Grades%22%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/436869/Blackboard%20non-js%20%22My%20Grades%22%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    new MutationObserver((mutations, observer) => {
        const fixLink = (node) => {
            const onclick = node.getAttribute("onclick");
            let urlMatch;
            if (onclick) {
                urlMatch = onclick.match(/loadContentFrame\('(.+)'\)/);
            }
            if (urlMatch && !node.getAttribute('href')) {
                node.setAttribute("href", onclick.match(/loadContentFrame\('(.+)'\)/)[1]);
                node.setAttribute("target", "_top");
                node.removeAttribute("onclick");
            }
        };
        for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLDivElement) {
                    for (const subnode of node.querySelectorAll('a')) {
                        fixLink(subnode);
                    }
                } else if (node instanceof HTMLAnchorElement) {
                    fixLink(node);
                }
            });
        }
    }).observe(document.body, { childList: true, subtree: true });
})();
