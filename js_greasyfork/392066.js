// ==UserScript==
// @name         18-25 barre fixed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.jeuxvideo.com/forums/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392066/18-25%20barre%20fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/392066/18-25%20barre%20fixed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


var bite = document.getElementsByClassName('nav-link');
var tebi = bite[35];

tebi.setAttribute("href", "http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm");
tebi.innerHTML = "1825";


  ///

var elements = document.getElementsByClassName('nav-link');
var requiredElement = elements[26];


requiredElement.setAttribute("href", "http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm");
requiredElement.innerHTML = "Forum Blabla 18-25 ans";


    ///

    var issou = document.getElementsByClassName('nav-link');
    var eussou = issou[25];

   eussou.setAttribute("href", "http://www.jeuxvideo.com/forums/0-3017788-0-1-0-1-0-playstation-5.htm");
   eussou.innerHTML = "PS5";


})();