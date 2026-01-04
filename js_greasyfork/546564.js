// ==UserScript==
// @name         WPlace Title Timer
// @namespace    http://tampermonkey.net/
// @version      2025-08-20
// @description  Really dumb simple little script that tells you how many charges you've accumulated since the last time the wplace tab was open.
// @author       khakicat
// @match        https://wplace.live/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wplace.live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546564/WPlace%20Title%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/546564/WPlace%20Title%20Timer.meta.js
// ==/UserScript==

var c = 0;

(function() {
    'use strict';
    setInterval(myMethod, 30000);

    window.onblur = () => {
        c = 0;
    }
})();


function myMethod( )
{
    c++;
    document.title = "wplace ("+c+")";
}