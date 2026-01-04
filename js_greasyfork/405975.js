// ==UserScript==
// @name         RP+ Remover
// @namespace    http://tampermonkey.net/
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @version      0.1.1
// @description  Remove RP+ article from rp-online.de ### Takes some time to remove on mainpage
// @include      https://rp-online.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405975/RP%2B%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/405975/RP%2B%20Remover.meta.js
// ==/UserScript==

  window.addEventListener("load", function(event) {
    console.log("DOM fully loaded and parsed");

var allImages = [];
var images = [];

var classMatcher = /(?:^|\s)park-icon-paid(?:\s|$)/;
var els = document.getElementsByTagName('*');
for (var i=els.length;i--;){
  if (classMatcher.test(els[i].className)){
       els[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove('header');
       }
     }
});