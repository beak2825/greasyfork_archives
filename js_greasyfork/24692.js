// ==UserScript==
// @name         Memrise "Hack"
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Personal use for the Memrise course completion bar.
// @author       Summer Wummer
// @match        http://www.memrise.com/*
// @grant        (none)
// @downloadURL https://update.greasyfork.org/scripts/24692/Memrise%20%22Hack%22.user.js
// @updateURL https://update.greasyfork.org/scripts/24692/Memrise%20%22Hack%22.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.progress { background-image: linear-gradient(#8ede28, #8ede28 49.9%, #8ede28 50%); background-color: #8ede28; border: 1px solid #578b15; overflow: visible; position: relative; };');