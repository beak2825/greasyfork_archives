// ==UserScript==
// @name         Redirect stocks.zerodha.com to tickertape
// @namespace    https://greasyfork.org/en/users/1019658-aayush-dutt
// @version      0.1
// @description  Redirect stocks.zerodha.com to tickertape for more comprehensive analysis
// @author       aayushdutt
// @match        https://stocks.zerodha.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zerodha.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472886/Redirect%20stockszerodhacom%20to%20tickertape.user.js
// @updateURL https://update.greasyfork.org/scripts/472886/Redirect%20stockszerodhacom%20to%20tickertape.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.location = "https://tickertape.in" +  window.location.pathname
})();