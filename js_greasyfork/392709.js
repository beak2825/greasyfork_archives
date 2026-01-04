// ==UserScript==
// @name         18-25 barre fixed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.jeuxvideo.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392709/18-25%20barre%20fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/392709/18-25%20barre%20fixed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


var bite = document.getElementsByClassName('nav-link');
var tebi = bite[36];

tebi.setAttribute("href", "http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm");
tebi.innerHTML = "1825";


     /// -15

    var issou = document.getElementsByClassName('nav-link');
    var eussou = issou[26];

   eussou.setAttribute("href", "http://www.jeuxvideo.com/forums/0-15-0-1-0-1-0-blabla-moins-de-15-ans.htm");
   eussou.innerHTML = "Blabla -15 ans";


  /// 15-18

var elements = document.getElementsByClassName('nav-link');
var requiredElement = elements[27];


requiredElement.setAttribute("href", "http://www.jeuxvideo.com/forums/0-50-0-1-0-1-0-blabla-15-18-ans.htm");
requiredElement.innerHTML = "Blabla 15-18 ans";




    /// 18-25

    var aya = document.getElementsByClassName('nav-link');
    var ayax = aya[28];

   ayax.setAttribute("href", "http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm");
   ayax.innerHTML = "Blabla 18-25 ans";

    /// commu

    var ayaz = document.getElementsByClassName('nav-link');
    var ayazz = ayaz[29];

   ayazz.setAttribute("href", "http://www.jeuxvideo.com/forums/0-1000021-0-1-0-1-0-communaute.htm");
   ayazz.innerHTML = "Communauté";


    /// aau


        var aau = document.getElementsByClassName('nav-link');
    var aauel = aau[30];

    aauel.setAttribute("href", "http://www.jeuxvideo.com/forums/0-1000017-0-1-0-1-0-aide-aux-utilisateurs.htm#bloc-formulaire-forum");
    aauel.innerHTML = "";





})();