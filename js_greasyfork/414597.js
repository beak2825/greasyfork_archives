// ==UserScript==
// @name               myPass
// @namespace          noFreeze
// @version            1.0.0
// @description        Protect Privacy for Google & Chrome by myPass. Password is 4222 (Can change if you want). Basically none can use the browser without a Password!
// @author             nofreeze
// @match              *://www.google.com/*

// @downloadURL https://update.greasyfork.org/scripts/414597/myPass.user.js
// @updateURL https://update.greasyfork.org/scripts/414597/myPass.meta.js
// ==/UserScript==

(function() {
    'use strict';
  var password = "4222"; //Change to what you want it to be//
var response;
var entryCount = 1;
var entryLimit = 10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000;
var error = false;

while(response != password && !error){
    if(entryCount < entryLimit){
        response = window.prompt("Password:");
        entryCount++;
    } else {
        error = true;
    }
}
})();