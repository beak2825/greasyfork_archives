// ==UserScript==
// @name         Remove star wars youtube player theme
// @namespace    https://lkubuntu.wordpress.com/
// @version      1.0
// @description  Reverts the youtube player to its default state
// @author       AnonymousMeerkat
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/15239/Remove%20star%20wars%20youtube%20player%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/15239/Remove%20star%20wars%20youtube%20player%20theme.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var beyond_el;
var load_int;

if (window.location.href.match(".youtube.com") !== null)
{
    load_int = window.setInterval(function() {
        beyond_el = document.getElementsByClassName("ytp-project-beyond");
        if (beyond_el && beyond_el[0])
        {
            beyond_el = beyond_el[0];
            window.clearInterval(load_int);
            window.setInterval(beyond_main, 100);
        }
    });
}

function beyond_main() {
    beyond_el.classList.remove("ytp-project-beyond");
    beyond_el.classList.remove("ytp-project-beyond-light");
    beyond_el.classList.remove("ytp-project-beyond-dark");
}