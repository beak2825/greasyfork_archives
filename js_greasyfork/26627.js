// ==UserScript==
// @name         Remove death message
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the end game death message
// @author       meatman2tasty
// @match        http://karnage.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26627/Remove%20death%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/26627/Remove%20death%20message.meta.js
// ==/UserScript==

var element = document.getElementById("scoreMessage");
element.parentNode.removeChild(element);
