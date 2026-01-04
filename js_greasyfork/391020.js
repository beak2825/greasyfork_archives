// ==UserScript==
// @name         MT share-alter
// @namespace    https://greasyfork.org/en/users/370170
// @version      0.4
// @description  Script for altering share-link
// @author       Radoslaw Rusek
// @match        *://app.mediatask.pl/orders/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/391020/MT%20share-alter.user.js
// @updateURL https://update.greasyfork.org/scripts/391020/MT%20share-alter.meta.js
// ==/UserScript==
$.noConflict();
jQuery( document ).ready(function( $ ) {
    'use strict';
    // Tekst do dopisania do linka
    if(!$("#unshare-project").length){
        let urlString = "zgoda na wykorzystanie";

        let shareBtn = $(".icon.glyphicon.glyphicon-share");
        let shareText = shareBtn.attr("data-clipboard-text");
        try {
            shareBtn.attr("data-clipboard-text", shareText+" "+urlString);
        }
        catch(error) {
            console.error(error);
        }
    }
});