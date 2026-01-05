// ==UserScript==
// @run-at document-body
// @name         Gruszkozgłaszacz
// @namespace    http://wypok.pl/
// @version      0.3
// @description  Prawidłowa ikonka dla zgłoszeń
// @author       le1t00
// @match        http://www.wykop.pl/*
// @require http://code.jquery.com/jquery-latest.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/16269/Gruszkozg%C5%82aszacz.user.js
// @updateURL https://update.greasyfork.org/scripts/16269/Gruszkozg%C5%82aszacz.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

$(function(){
$('.btnNotify i').hide();
$('.btnNotify').prepend('<img src="http://i.imgur.com/YzxTMqW.png" style="width:14px;">');
})