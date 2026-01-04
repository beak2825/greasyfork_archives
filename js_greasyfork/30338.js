// ==UserScript==
// @name         makemytrip
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.makemytrip.com/air/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30338/makemytrip.user.js
// @updateURL https://update.greasyfork.org/scripts/30338/makemytrip.meta.js
// ==/UserScript==

(function() {
    'use strict';
   $(window).load(function(){
setTimeout(function() {

$('#listing-sorter > div.dropdown.pull-right.c-dropdown.append_right5.currency-dropdown').find('span:contains(OMR)').click();
    }, 1000);
       });
    // Your code here...
})();