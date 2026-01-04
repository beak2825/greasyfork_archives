// ==UserScript==
// @name         Fix Blogtruyen Top Bar
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Make the top bar at blogtruyen not appear or disappear when scrolling.
// @author       Psyblade
// @match        http://m.blogtruyen.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35450/Fix%20Blogtruyen%20Top%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/35450/Fix%20Blogtruyen%20Top%20Bar.meta.js
// ==/UserScript==

var x = document.getElementsByClassName("navbar-inverse");
x[0].style.position = "absolute";