// ==UserScript==
// @name         NSW2U
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Delete anti adblock.
// @author       AngelXex
// @match        https://nsw2u.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nsw2u.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467677/NSW2U.user.js
// @updateURL https://update.greasyfork.org/scripts/467677/NSW2U.meta.js
// ==/UserScript==

(function() {
    'use strict';

const element1 = document.querySelectorAll('[id^="atContainer"]');


element1.forEach((item) => {
  var tempname = (item.getAttribute('id'));
    console.log(tempname);
const element = document.getElementById(tempname);
element.remove();
});

var addetect;

for (const a of document.querySelectorAll("span")) {
  if (a.textContent.includes("Powered By")) {
   addetect = a.parentElement;
  }
}

  var tempname = (addetect.getAttribute('id'));
    console.log(tempname);
  var x = document.getElementById(tempname).parentElement.parentElement.getAttribute('id');

const element = document.getElementById(x);
element.remove();
})();