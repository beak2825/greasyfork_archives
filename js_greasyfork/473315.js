// ==UserScript==
// @name        New York Times scrollbar enable
// @description New York Times scrollbar enable2222
// @namespace   newyorkscroll
// @version     1
// @grant       none
// @include     https://www.nytimes.com/*
// @downloadURL https://update.greasyfork.org/scripts/473315/New%20York%20Times%20scrollbar%20enable.user.js
// @updateURL https://update.greasyfork.org/scripts/473315/New%20York%20Times%20scrollbar%20enable.meta.js
// ==/UserScript==

function enable_scrollbars() {
  console.log("jii");
  $qs = document.querySelector("div.css-mcm29f");
  $qs.style.overflowx = "visible"; // scroll
  console.log("jaa");
  $qs.style.position = "static";
  console.log("jahas");
}

setTimeout(enable_scrollbars, 3000);

document.querySelector("div.css-mcm29f").style.overflowx = "visible"; 
document.querySelector("div.css-mcm29f").style.position = "static";
