// ==UserScript==
// @name         Platzi - AntiCodeSpam blur!
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Facundo Soto
// @match        https://platzi.com/clases/*
// @description  Put a blur effect on code comments to prevent spoilers
// @icon         https://www.google.com/s2/favicons?domain=platzi.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/435047/Platzi%20-%20AntiCodeSpam%20blur%21.user.js
// @updateURL https://update.greasyfork.org/scripts/435047/Platzi%20-%20AntiCodeSpam%20blur%21.meta.js
// ==/UserScript==

waitForKeyElements ("#material-view pre code", function(e) {

    var elemento = $(e[0]);

    elemento.css({"filter": "blur(5px)grayscale(1)", "transition": ".2s ease"});

    elemento.hover(
        function () {
            $(this).css("filter", "blur(0px)")
        },

        function () {
            $(this).css("filter", "blur(5px)grayscale(1)")
        }
    )

});