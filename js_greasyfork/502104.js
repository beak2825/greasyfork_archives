// ==UserScript==
// @name Spektrum lesen
// @namespace Violentmonkey Scripts
// @match https://www.spektrum.de/*
// @description Spektrum lesen (p/k/a: kackspektrum)
// @grant none
// @version 0.0.1.20251011154024
// @downloadURL https://update.greasyfork.org/scripts/502104/Spektrum%20lesen.user.js
// @updateURL https://update.greasyfork.org/scripts/502104/Spektrum%20lesen.meta.js
// ==/UserScript==

document.getElementsByTagName("body")[0].innerHTML = document.getElementsByClassName("pw-premium")[0].innerHTML;