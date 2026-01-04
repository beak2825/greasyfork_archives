// ==UserScript==
// @name         freetutsdownload without AD
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://freetutsdownload.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411208/freetutsdownload%20without%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/411208/freetutsdownload%20without%20AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var modalWindow = document.getElementById('modal-adbmon-div468774');
    if(modalWindow){
       modalWindow.parentNode.removeChild(modalWindow);
     }else{

      modalWindow = document.getElementById('modal-adbmon-div988551');
      if(modalWindow){
       modalWindow.parentNode.removeChild(modalWindow);
     }
    }

    // Your code here...
})();