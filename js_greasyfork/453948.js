// ==UserScript==
// @name         Dark Reader Killer
// @namespace    Hentiedup
// @version      0.1
// @description  Removes Dark Reader styles from head
// @author       Hentiedup
// @license      unlicense
// @match        http*://rule34hentai.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453948/Dark%20Reader%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/453948/Dark%20Reader%20Killer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const nodeList = document.querySelectorAll("head > style.darkreader");
    for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].remove();
    }
})();