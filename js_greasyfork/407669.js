// ==UserScript==
// @name         SendAfterTime
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       SStvAA
// @match        https://view.appen.io/assignments/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407669/SendAfterTime.user.js
// @updateURL https://update.greasyfork.org/scripts/407669/SendAfterTime.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Tiempo
    var tiempo = 25; //Segundos

   $(document).ready(function() {
       setTimeout(()=>{jQuery('input[type="submit"]')[0].click()},tiempo*1000)
   });
})();