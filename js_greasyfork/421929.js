// ==UserScript==
// @name         Navigator for manhwa18
// @namespace    mfartex.manhwa18
// @version      0.1
// @esversion    6
// @description  A navigator to read on manhwa18. Left arrow for previous chapter, right arrow for next chaper. Home button is back to the overview screen of the manga
// @author       secpick
// @match        https://manhwa18.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421929/Navigator%20for%20manhwa18.user.js
// @updateURL https://update.greasyfork.org/scripts/421929/Navigator%20for%20manhwa18.meta.js
// ==/UserScript==
 
/* jshint esversion:6 */

(function() {
    'use strict';

    document.onkeydown = checkKey;
 
    const home_url = document.querySelector('a.manga-name').href
    const cur_opt = document.querySelector(`option[selected]`);
    const next_opt = cur_opt.nextSibling
    const prev_opt = cur_opt.previousSibling
    const next_url = prev_opt ? prev_opt.value : home_url
    const prev_url = next_opt ? next_opt.value : home_url
    
    function checkKey(e) {
 
        e = e || window.event;
 
        if (e.keyCode == '39') {
            // right arrow
            window.location = next_url
        }
        else if (e.keyCode == '37') {
            // left arrow
            window.location = prev_url
        }
        else if (e.keyCode == '36') {
            // home
            window.location = home_url
        }
    }
})();