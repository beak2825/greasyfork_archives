// ==UserScript==
// @name        MyBike.gr get first unread message
// @namespace   mybikegr_getnew
// @include     http://www.mybike.gr/forums/*
// @version     2
// @description Go to the first unread message in a thread
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12129/MyBikegr%20get%20first%20unread%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/12129/MyBikegr%20get%20first%20unread%20message.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  
  var ar = document.getElementById("ipsLayout_mainArea");
  var lis = ar.getElementsByTagName("ul");
  var getFirst = document.createElement("li");

  var link = document.createElement("a");
  link.appendChild(document.createTextNode("Πρώτο νέο μήνυμα"));
  link.className = "ipsButton ipsButton_link ipsButton_medium ipsButton_fullWidth";
  link.href = "?do=getNewComment";

  getFirst.appendChild(link);
  lis[2].appendChild(getFirst);
  
}, false);

