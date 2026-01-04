// ==UserScript==
// @name         AntiCovidMSGYT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  No more useless YouTube Covid-19 Infotext
// @author       Leinadix
// @include      *.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/439733/AntiCovidMSGYT.user.js
// @updateURL https://update.greasyfork.org/scripts/439733/AntiCovidMSGYT.meta.js
// ==/UserScript==

(() => {
    "use strict";
    var checkExist = setInterval(function() {
        if ($('#clarify-box').length) {
            console.log("Exists!");
            $('#clarify-box').remove();
            clearInterval(checkExist);
        }
    }, 100); // check every 100ms
    var checkExist2 = setInterval(function() {
        if ($("ytd-clarification-renderer").length) {
            console.log("Exists!");
            $("ytd-clarification-renderer").remove();
            clearInterval(checkExist2);
        }
    }, 100); // check every 100ms
})();