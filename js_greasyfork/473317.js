// ==UserScript==
// @name         Piratebay - focus to search box
// @description  focuses on the search when entering this specific pirate bay proxy
// @version      0.3
// @include      https://thepiratebay0.org/search/medicat/1/99/0
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thepiratebay0.org
// @namespace Piratebay_auto-focus
// @downloadURL https://update.greasyfork.org/scripts/473317/Piratebay%20-%20focus%20to%20search%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/473317/Piratebay%20-%20focus%20to%20search%20box.meta.js
// ==/UserScript==

var nodes;

// ei toiminu
nodes = document.querySelectorAll(".searchBox input[type=search]");

// toimii
nodes = document.querySelectorAll("input[type=search]");

// toimii
nodes = document.querySelectorAll(".searchBox");
for (var i = 0; i < nodes.length; i++) {
  nodes[i].value = ""
  nodes[i].focus();
  console.log(i + ": " + nodes[i].value)
}