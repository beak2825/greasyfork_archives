// ==UserScript==
// @name        Herpes Versand
// @description Because Hermes Logistics is an bad delivery service i decided to rename the logo from "Hermes" to "Herpes" (its an virus).
// @namespace   Konrad
// @include     https://www.myhermes.de/*
// @include     https://myhermes.de/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22657/Herpes%20Versand.user.js
// @updateURL https://update.greasyfork.org/scripts/22657/Herpes%20Versand.meta.js
// ==/UserScript==
document.getElementById("logo").children[0].children[0].src = "http://www.derauto.de/herpes.png";