// ==UserScript==
// @name         Enhanced UI for Oracle Apex
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add some useful font resizing stuffs
// @match        *://*/apex/*
// @match        *://apex.oracle.com/pls/apex/*
// @author       Vernyihel Zoltan
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/378169/Enhanced%20UI%20for%20Oracle%20Apex.user.js
// @updateURL https://update.greasyfork.org/scripts/378169/Enhanced%20UI%20for%20Oracle%20Apex.meta.js
// ==/UserScript==

/*  Usage
    Button - # decrease font size
    Button 0 # back to default font size
    Button + # increase font size
*/

$(document).ready(function() {
    if (document.title == "SQL Commands") {
        $('.apex-row').append('&nbsp;&nbsp;&nbsp;Input:&nbsp;');
        $('.apex-row').append('<button type="button" id="down">-</button>&nbsp;');
        $('.apex-row').append('<button type="button" id="default">0</button>&nbsp;');
        $('.apex-row').append('<button type="button" id="up">+</button>');
        $('.apex-row').append('&nbsp;&nbsp;&nbsp;Output:&nbsp;');
        $('.apex-row').append('<button type="button" id="down2">-</button>&nbsp;');
        $('.apex-row').append('<button type="button" id="default2">0</button>&nbsp;');
        $('.apex-row').append('<button type="button" id="up2">+</button>');
    }

    $( "#down" ).on( "click", function() {
        $( '.a-Form-inputContainer textarea.textarea' ).css( "font-size", "-=2" );
        $( '.a-Form-inputContainer textarea.textarea' ).css( "line-height", "initial" );
    });

    $( "#default" ).on( "click", function() {
        $( '.a-Form-inputContainer textarea.textarea' ).css( "font-size", "12px" );
        $( '.a-Form-inputContainer textarea.textarea' ).css( "line-height", "16px" );
    });

    $( "#up" ).on( "click", function() {
        $( '.a-Form-inputContainer textarea.textarea' ).css( "font-size", "+=2" );
        $( '.a-Form-inputContainer textarea.textarea' ).css( "line-height", "initial" );
    });

    $( "#down2" ).on( "click", function() {
        $( '.fielddata' ).css( "font-size", "-=2" );
        $( '.fielddata' ).css( "line-height", "initial" );
    });

    $( "#default2" ).on( "click", function() {
        $( '.fielddata' ).css( "font-size", "14px" );
        $( '.fielddata' ).css( "line-height", "16px" );
    });

    $( "#up2" ).on( "click", function() {
        $( '.fielddata' ).css( "font-size", "+=2" );
        $( '.fielddata' ).css( "line-height", "initial" );
    });
});