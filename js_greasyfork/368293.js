// ==UserScript==
// @name         ESC to skip HIT/Return HIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip or return a HIT by pressing ESC
// @author       Karuption
// @match        https://worker.mturk.com/projects/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368293/ESC%20to%20skip%20HITReturn%20HIT.user.js
// @updateURL https://update.greasyfork.org/scripts/368293/ESC%20to%20skip%20HITReturn%20HIT.meta.js
// ==/UserScript==

$(document).ready(function() {
    if( $(".force-inline").length != 0) {
        return;
    }
});

$(window).keydown(e => {

        if(e.which == 27) {
            $(".force-inline").submit();
        }
});