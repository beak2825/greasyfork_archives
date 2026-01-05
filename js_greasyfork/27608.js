// ==UserScript==
// @name         Karnage, remove delete clan button
// @namespace    meatman2tasty
// @version      1.0
// @description  Removes delete button
// @author       Meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27608/Karnage%2C%20remove%20delete%20clan%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/27608/Karnage%2C%20remove%20delete%20clan%20button.meta.js
// ==/UserScript==

var element = document.getElementById("loginButtonHolder.itemValueC");
element.parentNode.removeChild(element);