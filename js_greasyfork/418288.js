// ==UserScript==
// @name         NSFW thumbnails
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  removes warning from nsfw previews of workshop items
// @author       Arjix
// @match        https://steamcommunity.com/workshop/browse/*
// @match        https://steamcommunity.com/profiles/*/myworkshopfiles/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418288/NSFW%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/418288/NSFW%20thumbnails.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", function () {

    var allWarnings = document.querySelectorAll(".ugc")
    for (let i=0; i < allWarnings.length; i++) {
        //let warning = allWarnings[i]
        allWarnings[i].className = "ugc"
    }
}, false)
})();