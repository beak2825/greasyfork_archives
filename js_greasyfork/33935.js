// ==UserScript==
// @name         Mongoose phone
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change phone number to a clickable one
// @author       Marcin, modified by Maxime
// @match https://mongoose.circlek.com/siteinfo.php*
// @match https://192.168.252.205/siteinfo.php*
// @match https://www.timeanddate.com/worldclock/*
// @downloadURL https://update.greasyfork.org/scripts/33935/Mongoose%20phone.user.js
// @updateURL https://update.greasyfork.org/scripts/33935/Mongoose%20phone.meta.js
// ==/UserScript==

(function() {
    'use strict';
//
//TO REPLACE PHONE NUMBER
//
var x = document.getElementsByTagName("body")[0];
var replacementString = '<a href="tel:+1$1">+1-$1</a>';
x.innerHTML = x.innerHTML.replace(/(\d{3}\-\d{3}\-\d{4})/g, replacementString);

})();