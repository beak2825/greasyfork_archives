// ==UserScript==
// @name         Přesměrování Maďarsko-WaterPolo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Změna URL pro maďarské vodní pólo
// @author       LM
// @match        https://waterpolo.hu/adatbank/meccs/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488009/P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20Ma%C4%8Farsko-WaterPolo.user.js
// @updateURL https://update.greasyfork.org/scripts/488009/P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20Ma%C4%8Farsko-WaterPolo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Get the current URL
    var currentUrl = window.location.href;
    // Extract the number after the last "/"
    var lastIndex = currentUrl.lastIndexOf("/");
    var numberAfterLastSlash = currentUrl.substring(lastIndex + 1);
    // Replace the part before the last "/" with the new URL
    var newUrl = "https://waterpololive.webpont.com/?" + numberAfterLastSlash;
    // Redirect to the new URL
    window.location.replace(newUrl);
})();