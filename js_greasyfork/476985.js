// ==UserScript==
// @name         Take Twitter Link Preview Back
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Take the link preview of Twitter back
// @author       solstice23
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476985/Take%20Twitter%20Link%20Preview%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/476985/Take%20Twitter%20Link%20Preview%20Back.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(`
        body[style*='background-color: rgb(255, 255, 255)'] {
            --link-preview-text-color: #000;
        }
        body[style*='background-color: rgb(0, 0, 0)'] {
            --link-preview-text-color: #fff;
        }
        body[style*='background-color: rgb(21, 32, 43)'] {
            --link-preview-text-color: #f7f9f9;
        }
        div[data-testid='card.layoutLarge.media'] > a::after {
            content: attr(aria-label);
            font-family: sans-serif;
            display: block;
            padding: 8px 10px;
            line-height: 1.3;
            color: var(--link-preview-text-color, #000);
        }
        div[data-testid='card.layoutLarge.media'] > a > div:last-child {
            bottom: unset;
            left: unset;
            top: 10px;
            right: 10px;
        }
    `));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        document.documentElement.appendChild(node);
    }
})();