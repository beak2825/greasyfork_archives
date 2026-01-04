// ==UserScript==
// @name         Niko Belić Garda Panteri
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description  Hides undesirable posts on shitposting forum Ylilauta International. Nemojte zaboravljati roditelje...
// @author       Arfy Doofstein
// @match        https://ylilauta.org/international/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ylilauta.org
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/461480/Niko%20Beli%C4%87%20Garda%20Panteri.user.js
// @updateURL https://update.greasyfork.org/scripts/461480/Niko%20Beli%C4%87%20Garda%20Panteri.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
$(document).ready(function() {
    $("img[title='Serbia']").parent().parent().hide();
    $( "span.name:contains('Sharter')" ).parent().parent().show();
    });

$( "a" ).mouseover(function() {
    $("img[title='Serbia']").parent().parent().hide();
   });