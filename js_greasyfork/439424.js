// ==UserScript==
// @name         Kanjikaveri CSS Fix
// @namespace    https://debu.moe
// @version      1.1
// @description  fix CSS
// @author       Jersu
// @supportURL   https://twitter.com/jepe_art
// @match        http*://www.kanjikaveri.net/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/439424/Kanjikaveri%20CSS%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/439424/Kanjikaveri%20CSS%20Fix.meta.js
// ==/UserScript==

    // fix CSS link in <head>
    console.log("script working");

    var a = document.querySelector("head > link:nth-child(15)");

    console.log(a);

    a.setAttribute('href', '/css/kanjikaveri.css');

    // fix text overflow on frontpage
    document.getElementById("teksti_index").style.height="450px";