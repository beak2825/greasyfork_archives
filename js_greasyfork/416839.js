// ==UserScript==
// @name         Symbolab Pro
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Symbolab pro for free
// @author       J. Lawrence Dev Pro Tips
// @match        https://www.symbolab.com/
// @include      *://*symbolab.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416839/Symbolab%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/416839/Symbolab%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var code = `window.onload = function(){
        /* set subscription params */
        if (typeof(SYSTEPS) != 'undefined') { SYSTEPS.subscribed = true }
        if (typeof(SOLUTIONS) != 'undefined') { SOLUTIONS.subscribed = true }
        if (typeof(SYMBOLAB) != 'undefined') { SYMBOLAB.params.subscribed = true }
        if (typeof(SYPRACTICE) != 'undefined') { SYPRACTICE.subscribed = true }
        isUserLoggedIn = function() { return true }

        /* remove popup when verify solution box is clicked */
        if ($("#click-capture")) {
            // add the class name to the click capture to prevent blocking
            $("#click-capture").addClass("click-capture-subscribed")
        }
    }`

    // make sure the code runs before the subscription status is checked
    document.documentElement.setAttribute("onreset", code)
    document.documentElement.dispatchEvent(new CustomEvent("reset"))
    document.documentElement.removeAttribute("onreset")

})()