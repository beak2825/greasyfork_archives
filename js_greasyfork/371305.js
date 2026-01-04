// ==UserScript==
// @name         Remove vOZ's right blank area.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove voz right blank area.
// @author       Psyblade
// @grant        none
// @include        https://forums.voz.vn/*
// @downloadURL https://update.greasyfork.org/scripts/371305/Remove%20vOZ%27s%20right%20blank%20area.user.js
// @updateURL https://update.greasyfork.org/scripts/371305/Remove%20vOZ%27s%20right%20blank%20area.meta.js
// ==/UserScript==

var element = document.getElementsByClassName("main");
element[0].classList.remove("main");