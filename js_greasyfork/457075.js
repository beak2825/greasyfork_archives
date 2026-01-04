// ==UserScript==
// @license MIT
// @name         Loading Ad Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This will fix the loading ad bug in ShellShockers
// @author       Trix
// @match        *://shellshock.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shellshock.io
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/457075/Loading%20Ad%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/457075/Loading%20Ad%20Fix.meta.js
// ==/UserScript==
function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.keyCode == 80) {
            var popup = document.getElementsByClassName("popup_window popup_lg centered roundme_lg info");
            popup[0].remove();
        }
    }
    document.addEventListener('keydown', onKeydown, true);
