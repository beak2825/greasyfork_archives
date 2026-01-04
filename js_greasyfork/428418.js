// ==UserScript==
// @name         bobby
// @namespace    http://krizisdev.github.io/
// @version      1.0
// @description  booby
// @author       bobby (KrizisDev)
// @match        *://*/*
// @require      https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428418/bobby.user.js
// @updateURL https://update.greasyfork.org/scripts/428418/bobby.meta.js
// ==/UserScript==
/* globals $, waitForKeyElements */

$(document).ready(function() {
    function _f(jNode) {
        var images = document.querySelectorAll("img");
        for (var i = 0; i < images.length; i++){
            images[i].src = "https://cdn.discordapp.com/attachments/817428875377115166/857710812399140864/bobby_-_Copy_-_Copy_-_Copy_-_Copy_3_-_Copy_-_Copy_-_Copy_-_Copy.jpg";
        }
    }

    waitForKeyElements("img", _f);
    $("img").on('load', function() {
        _f();
    });
});