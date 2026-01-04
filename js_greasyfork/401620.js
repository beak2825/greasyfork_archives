// ==UserScript==
// @name         Wikipedia anchor title remover
// @description  Removes all title attributes from links on Wikipedia
// @version      1.0.0
// @namespace    nullprogram.com
// @license      Public Domain
// @include      https://*.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401620/Wikipedia%20anchor%20title%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/401620/Wikipedia%20anchor%20title%20remover.meta.js
// ==/UserScript==

(function() {
    let links = document.querySelectorAll('a');
    for (let i = 0; i < links.length; i++) {
        links[i].removeAttribute('title');
    }
}());
