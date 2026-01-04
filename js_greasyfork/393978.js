// ==UserScript==
// @name         emerald-dl
// @namespace    ogun@cock.li
// @version      0.1
// @description  Emerald article viewer/dowloader
// @author       Ogun
// @match        https://www.emerald.com/insight/content/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393978/emerald-dl.user.js
// @updateURL https://update.greasyfork.org/scripts/393978/emerald-dl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.href;
    var patt = /\d.+/;
    const doi = url.match(patt);
    const auth = document.getElementsByClassName("intent_explore")[0];
    auth.dataset.target = "#";
    auth.setAttribute('data-toggl', '#');
    auth.innerHTML='DOWNLOAD';
    auth.href="https://sci-hub.tw/" +doi;
    // Your code here...
})();