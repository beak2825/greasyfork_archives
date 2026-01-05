// ==UserScript==
// @name        Select Pement
// @namespace   ANAND KUMAR
// @description Pement Option
// @include     https://www.irctc.co.in/eticketing/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14102/Select%20Pement.user.js
// @updateURL https://update.greasyfork.org/scripts/14102/Select%20Pement.meta.js
// ==/UserScript==
bn=getCookie("bank");
 bty=getCookie("bt");
$(document).ready(function(){
  checkSearchType(bty);
var qu = document.getElementsByName(bty);
  for (var i = 0; i < qu.length; i++) {
  pg=qu[i].value
  switch (pg) {
    case bn:
    var elements = document.getElementsByName(bty);
    elements[i].click(checked = true);
      window.scrollTo(0,600);
    break;
  }}});
