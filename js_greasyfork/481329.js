// ==UserScript==
// @name         hihope direct download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bypass hihope download login requirement
// @author       QZLin
// @match        http*://www.hihope.org/download/*
// @icon         https://icons.duckduckgo.com/ip2/hihope.org.ico
// @license      MITM
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481329/hihope%20direct%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/481329/hihope%20direct%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll("img[src=\"../images/xz.svg\"]").forEach(e => {
        let s = e.getAttributeNode('onclick').nodeValue
        let url = s.match("return Dow\\('(.*)'\\)")
        if (url) {
            e.onclick = () => { window.open(url[1]) }
        }
    })
})();