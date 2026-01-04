// ==UserScript==
// @name         Realself Parser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.realself.com/*/before-and-after-photos
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377432/Realself%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/377432/Realself%20Parser.meta.js
// ==/UserScript==

(function() {
   'use strict';
   $( document ).ready(function(){
       console.log('Start Iterating');
       var page_number = 1;
       setInterval(function(){
           $('img.lazyloaded').each(function(i,t){console.log(t.src)});
           var domains = window.location.href.split('/');
           var domain_name = domains[3];
           page_number += 1;
           var new_url = 'https://www.realself.com/' + domain_name + '/before-and-after-photos#page=' + (page_number - 1) + '&tags=&location=1001';

           window.location.href = new_url;
       }, 5000);
   });
})();