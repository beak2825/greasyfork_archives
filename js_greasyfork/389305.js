// ==UserScript==
// @name         Politics and War Default Declaration Replacer
// @namespace    https://politicsandwar.com/nation/id=98616
// @version      0.30
// @description  Replaces the default war declaration reasons in Politics & War with different quotes
// @author       Talus
// @match        https://politicsandwar.com/nation/war/declare/*
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/389305/Politics%20and%20War%20Default%20Declaration%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/389305/Politics%20and%20War%20Default%20Declaration%20Replacer.meta.js
// ==/UserScript==
// ********************
// * ADD QUOTES BELOW *
// ********************
// RULES:
// 1. Keep quotes in alphabetical order to avoid duplicates.
// 2. Maximum declaration reason length is 61 characters. ie. don't be longer than the below line
//  "012345678901234567890123456789012345678901234567890123456789"
var QUOTES = [
    "Beware the thorns of our bouquet",
    "Our roses will bloom on your ruins",
    "Prickly surprise from our garden",
    "Thorny code runs through our veins",
    "Our roses cut deeper than swords",
    "In the garden of war, we reign",
    "Roses sharpened to draw first blood",
    "The scent of war is in our roses",
    "Our thorns will pierce your armor",
    "Our roses conceal lethal blades"
];
// ******************************************************************
// * DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU ARE DOING *
// ******************************************************************
var REASON_SELECTOR = "#rightcolumn > form > table > tbody > tr:nth-child(16) > td:nth-child(2) > input[type=text]";
(function() {
    'use strict';
    var randomQuoteIndex = Math.floor(Math.random() * QUOTES.length);
    var randomQuote = QUOTES[randomQuoteIndex];
    document.querySelector(REASON_SELECTOR).value = randomQuote;
})();