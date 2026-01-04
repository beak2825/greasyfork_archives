// ==UserScript==
// @name         Homestuck go to next page with right arrow
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  with right arrow
// @author       blazor67
// @match        https://www.homestuck.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392028/Homestuck%20go%20to%20next%20page%20with%20right%20arrow.user.js
// @updateURL https://update.greasyfork.org/scripts/392028/Homestuck%20go%20to%20next%20page%20with%20right%20arrow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let prox = document.querySelector('div span+a[href^="/story"]');
    //console.log(prox); //debug

        document.onkeydown = function(event) {
        if (event.keyCode === 39) {
           //console.log(prox.href);
           window.location = prox.href;
        }
    };
    
})();