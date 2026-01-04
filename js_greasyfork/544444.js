// ==UserScript==
// @name         manhwa-latino.com
// @namespace    http://realidadscans.org
// @version      2025-08-02
// @description  mobile reader for manwha latino.
// @author       AngelXex
// @match        https://manhwa-latino.com/manga/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manhwa-latino.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544444/manhwa-latinocom.user.js
// @updateURL https://update.greasyfork.org/scripts/544444/manhwa-latinocom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const paddedit = document.getElementsByClassName("container");
    Array.prototype.forEach.call(paddedit, function(el) {
        el.classList.remove("container");
    });

    const paddedit2 = document.getElementsByClassName("reading-content");
    Array.prototype.forEach.call(paddedit2, function(el) {
        el.style.padding = "0 0";
    });

     const temp = document.getElementsByClassName("entry-content");
    if (temp.length > 0) {
        temp[0].addEventListener(
            "click", ButtonClickAction, false
        );
    }


    function ButtonClickAction(zEvent) {
        openFullscreen();
    }
    /* Get the documentElement (<html>) to display the page in fullscreen */
    const elem = document.documentElement;

    /* View in fullscreen */
    function openFullscreen() {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }

})();