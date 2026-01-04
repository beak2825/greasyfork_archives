// ==UserScript==
// @name     Gmail column Width increase Script
// @author   Miguel Ángel Romero Lluch
// @include  https://mail.google.com/mail/u/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description Script to add more width to Google Gmail left column.
// @version  1
// @namespace https://greasyfork.org/users/174568
// @downloadURL https://update.greasyfork.org/scripts/369460/Gmail%20column%20Width%20increase%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/369460/Gmail%20column%20Width%20increase%20Script.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function() {
    /**
     * Function to render
     */
    function renderChanges() {
        setTimeout(function() {
            //<div jscontroller="DUNnfe" style="width: 270px;">
          	var obj = $('[jscontroller]');
          	if (('undefined' !== typeof obj) && (obj)) {
            	obj.css({"width":"270px"});
            }
        }, 3000);
    }

    //Loop to set changes each 9 seconds
    //var intervalTime = setInterval(function() {
        renderChanges();
    //},2500);
});
