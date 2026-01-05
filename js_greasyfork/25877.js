// ==UserScript==
// @name         1point3acres
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Give a minimal simple and fast UI.
// @author       Ethan Wei
// @match        http://www.1point3acres.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/25877/1point3acres.user.js
// @updateURL https://update.greasyfork.org/scripts/25877/1point3acres.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
     var nv = document.getElementById("nv");
     nv.style.display = "none";
    
     var wpat = document.getElementsByClassName("wp a_t")[0];
     if (wpat) {
         wpat.style.display = "none";
     }
    
     Array.prototype.forEach.call(
         document.getElementsByClassName("a_mu"),
         function(element) {
             element.style.display = "none";
         });

     Array.prototype.forEach.call(
         document.getElementsByClassName("plc plm"),
         function(element) {
             //console.log(element);
             element.style.display = "none";
         });

     Array.prototype.forEach.call(
         document.getElementsByClassName("a_p"),
         function(element) {
             element.style.display = "none";
         });
    
     Array.prototype.forEach.call(
         document.getElementsByClassName("avatar"),
         function(element) {
             element.style.display = "none";
         });
    
    Array.prototype.forEach.call(
         document.getElementsByClassName("tns xg2"),
         function(element) {
             element.style.display = "none";
         });
   
        Array.prototype.forEach.call(
         document.getElementsByClassName("pls"),
         function(element) {
             element.style.display = "none";
         });
})();