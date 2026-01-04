// ==UserScript==
// @name         clojure planet
// @namespace    http://tampermonkey.net/
// @version      2024-06-12
// @description  comfortable read without sidebar
// @author       zdc
// @match        https://planet.clojure.in/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clojure.in
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498132/clojure%20planet.user.js
// @updateURL https://update.greasyfork.org/scripts/498132/clojure%20planet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('#planet').style.width = '70em';
    document.querySelector('#main').style.width = '100%';
    let sidebar = document.querySelector('div#sidebar');
    sidebar.parentNode.removeChild(sidebar);
    document.querySelectorAll('.entry .article').forEach(e => e.style.width = '100%');
    document.querySelectorAll('.entry .aside').forEach(e => e.style.float = 'right');
})();