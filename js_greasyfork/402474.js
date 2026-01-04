// ==UserScript==
// @name         TORN Stock Market Abbreviations
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show the Abbreviations next to Company names in Torn City's Stock Exchange
// @author       Fuzzyketchup [2206068]
// @match        https://www.torn.com/stockexchange.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402474/TORN%20Stock%20Market%20Abbreviations.user.js
// @updateURL https://update.greasyfork.org/scripts/402474/TORN%20Stock%20Market%20Abbreviations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var parentDiv = "#ui-accordion-1-header-";
    var stockCount = 31; //# of companies
    var abbrDiv = "div.abbr-name";
    var textDiv = "div.name.t-overflow";
    var child;
    var abbrTxt;

    for (var i = 0; i < stockCount; i++) { //Loop through each company and prepends the abbreviation
        child = parentDiv + i.toString();
        abbrTxt = $(child).find(abbrDiv).text();
        $(child).find(textDiv).prepend("("+abbrTxt+") ");
    }
})();