// ==UserScript==
// @name         zert add blocker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  blocks zert's anoying adds
// @author       shellshock hacker
// @match        *://shellshock.io/*
// @icon         https://www.google.com/s2/favicons?domain=shellshock.io
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/446432/zert%20add%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/446432/zert%20add%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
        if(window.shouldShowAd!=false){
            window.shouldShowAd=false;
            setTimeout(function (){document.querySelector("body > div.popup_window.popup_lg.centered.roundme_lg.info").remove()},3000);
        }
})();