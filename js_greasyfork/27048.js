// ==UserScript==
// @name         Remove death msgs
// @namespace    meatman2tasty
// @version      1.2
// @description  Removes Death Messages, etc. to reduce lag
// @author       Meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27048/Remove%20death%20msgs.user.js
// @updateURL https://update.greasyfork.org/scripts/27048/Remove%20death%20msgs.meta.js
// ==/UserScript==

var element = document.getElementById("scoreMessage");
element.parentNode.removeChild(element);

var element = document.getElementById("scoreMessageAmnt");
element.parentNode.removeChild(element);