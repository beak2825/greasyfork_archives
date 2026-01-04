// ==UserScript==
// @name         Remove reddit click tracking
// @name:en      Remove reddit click tracking
// @description  Remove the data-inbound-url parameter from links
// @version      1.0
// @namespace    skeeto
// @license      Public Domain
// @include      http*://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38402/Remove%20reddit%20click%20tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/38402/Remove%20reddit%20click%20tracking.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function() {
    let links = document.querySelectorAll('a');
    for (let i = 0; i < links.length; i++)
        delete links[i].dataset.inboundUrl;
});
