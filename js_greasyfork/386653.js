// ==UserScript==
// @name         Switch to Freedom Units
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simple script to automatically click the Fahrenheit button when viewing a forecast, which will switch the forecast display from metric to Imperial units
// @author       chalsp
// @match        https://www.mountain-forecast.com/peaks/*/forecasts/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/386653/Switch%20to%20Freedom%20Units.user.js
// @updateURL https://update.greasyfork.org/scripts/386653/Switch%20to%20Freedom%20Units.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $( document ).ready(function() {
        $("button[data-units='Imperial']").click();
    });
    
})();