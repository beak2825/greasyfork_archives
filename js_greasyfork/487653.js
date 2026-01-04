// ==UserScript==
// @name         Dealabs lien direct
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Discord: .fri.
// @author       Fri
// @match        https://www.dealabs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dealabs.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487653/Dealabs%20lien%20direct.user.js
// @updateURL https://update.greasyfork.org/scripts/487653/Dealabs%20lien%20direct.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
            if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.threadDetail && window.__INITIAL_STATE__.threadDetail.link) {
                const newLink = window.__INITIAL_STATE__.threadDetail.link;
                console.log("New Link found:", newLink);
                const button = document.querySelector('.button--fromW3-size-l.space--fromW3-mr-3.width--all-12.width--fromW4-6.button.button--shape-circle.button--type-primary.button--mode-brand[data-t="getDeal"]');
                if (button) {
                    button.href = newLink;
                    console.log("Button link updated to:", newLink);
                } else {
                    console.log("Button not found.");
                }
            } else {
                console.log("Link not found.");
            }
    });
})();