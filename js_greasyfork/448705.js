// ==UserScript==
// @name         pixelpaste bypasser
// @match        https://pixelpaste.net/*
// @description  This script skips the random number generation step.
// @license MIT
// @version 0.0.1.20220731075409
// @namespace https://greasyfork.org/users/941655
// @downloadURL https://update.greasyfork.org/scripts/448705/pixelpaste%20bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/448705/pixelpaste%20bypasser.meta.js
// ==/UserScript==

console.log("Script engaged");
Math.floor = e => 1;

sex();
$(".rules").hide();
$(".scroll").show();
$(".eap").show();