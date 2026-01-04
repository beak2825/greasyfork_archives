// ==UserScript==
// @name         Michabitco.in Rollbot Script
// @version      0.1
// @description  Please use my Referal-Link https://michabitco.in/?ref=4291
// @author       unknown
// @match        https://michabitco.in/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/708530
// @downloadURL https://update.greasyfork.org/scripts/416709/Michabitcoin%20Rollbot%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/416709/Michabitcoin%20Rollbot%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
setTimeout(function(){ location.reload(); }, random(61000,63000));
    document.getElementsByClassName("btn btn-danger btn-md w-100 mt-2")[0].click();
    random(1000,3000);
})();

function random(min,max){
   return min + (max - min) * Math.random();
}