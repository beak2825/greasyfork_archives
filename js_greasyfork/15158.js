// ==UserScript==
// @name         NYT Temperature Conversion
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Converts weather temperature from the NYT website from Fahrenheit to Celsius
// @author       Rodrigo García
// @match        http://international.nytimes.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/1003-wait-for-key-elements/code/Wait%20for%20key%20elements.js?version=49342
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/15158/NYT%20Temperature%20Conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/15158/NYT%20Temperature%20Conversion.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

waitForKeyElements(".weather-button", convertTemperature);

function convertTemperature(jNode) {
    var weatherButton       = document.getElementsByClassName('weather-button')[0];
    var fahrenheitString    = weatherButton.textContent.trim();
    var fahrenheit          = fahrenheitString.substr(0,fahrenheitString.length-2);
    var celsius             = Math.round((parseFloat(fahrenheit)-32)*5/9);
    var celsiusString       = celsius.toString()+'°C'; 
    weatherButton.innerHTML = weatherButton.innerHTML.replace(fahrenheitString,celsiusString);
}
