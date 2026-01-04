// ==UserScript==
// @name         Browse is important
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       BigNibba
// @include      https://anilist.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378092/Browse%20is%20important.user.js
// @updateURL https://update.greasyfork.org/scripts/378092/Browse%20is%20important.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let loggedIn = true;
    let navDiv = document.querySelector(".links");
    for(let i = 0; i <= navDiv.childNodes.length-1; i++){
         if(navDiv.childNodes[i].innerText == "Login"){loggedIn = false;} // Checks if user is logged in
    }

    if(loggedIn){
          navDiv.insertBefore(navDiv.childNodes[8],navDiv.childNodes[2]);
    }

})();