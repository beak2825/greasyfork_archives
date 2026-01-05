// ==UserScript==
// @name         Public Raffle AutoJoin
// @namespace    http://sergiosusa.com
// @version      0.1
// @description  Enter raffle til the end.
// @author       Sergio Susa (http://sergiosusa.com)
// @match        https://steamcompanion.com/gifts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17987/Public%20Raffle%20AutoJoin.user.js
// @updateURL https://update.greasyfork.org/scripts/17987/Public%20Raffle%20AutoJoin.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$(document).ready(function() {

    setInterval(function(){

        var btn = $("#more_entries");

        for(var x = 0 ; x < 100 ; x++ ) {
            btn.click();
        }
        realoadPage(200000);

    },8000);
});

/***********************************************************
 *  Utility Functions
 **********************************************************/

function realoadPage(miliseconds) {
    setInterval(function(){
        window.location.reload();
    }, miliseconds);
}