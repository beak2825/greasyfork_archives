// ==UserScript==
// @name         Karnage Fast Purchase(test)
// @namespace    meatman2tasty
// @version      1.0
// @description  Removes Spin when purchasing
// @author       Meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27063/Karnage%20Fast%20Purchase%28test%29.user.js
// @updateURL https://update.greasyfork.org/scripts/27063/Karnage%20Fast%20Purchase%28test%29.meta.js
// ==/UserScript==

var element = document.getElementById("spin-container");
element.parentNode.removeChild(element);