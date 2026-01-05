// ==UserScript==
// @name         Ukrywanie forsowniczych i spermiarskich
// @namespace    http://karachan.org/b/
// @version      0.21
// @description  ka ra chan xD
// @author       Anonek :3
// @match        *://karachan.org/b/*
// @match        *://*.karachan.org/b/*
// @exclude      http://www.karachan.org/*/src/*
// @exclude      https://www.karachan.org/*/src/*
// @exclude      http://karachan.org/*/src/*
// @exclude      https://karachan.org/*/src/*
// @license      chuj kurwa
// @grant        twoj stary
// @downloadURL https://update.greasyfork.org/scripts/26715/Ukrywanie%20forsowniczych%20i%20spermiarskich.user.js
// @updateURL https://update.greasyfork.org/scripts/26715/Ukrywanie%20forsowniczych%20i%20spermiarskich.meta.js
// ==/UserScript==

var slownik = [
"seks",
"dupa",
"cycki",
"sperma",
"spermiarski",
"pierdziawa",
"kutas",
"zsrr",
"podpaski",
"varg",
"hitler",
"ROOCHANIE",
"ROOHANIE",
"cerazy",
"doktor",
"euroazjata",
"szczyt humanitaryzmu",
];

setInterval(function usun() { var arrayLength = slownik.length; for (var i = 0; i < arrayLength; i++) { slowo = slownik[i]; $(".post:contains('" + slowo + "')").remove(); } }, 1000);
usun();