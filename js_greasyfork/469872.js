// ==UserScript==
// @name               Scribd bypass
// @description        Script disables blur on text & add full document
// @author             karrdozo
// @version            1.2
// @namespace          https://greasyfork.org/users/1115413
// @match              https://www.scribd.com/document/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=scribd.com
// @license            MIT
// @require            https://code.jquery.com/jquery-3.6.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/469872/Scribd%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/469872/Scribd%20bypass.meta.js
// ==/UserScript==
/* eslint-env jquery */

$(document).ready(function(){

    'use strict';
    if (window.location.href.match(/document\/(\d+)\//) == null) return;
    //Remove blocks between pages
    $('div.between_page_module').remove();

    //Remove banners on pages
    $('div.auto__doc_page_webpack_doc_page_blur_promo').remove();

    // Remove blur
    $('div.newpage div.text_layer').css('text-shadow', 'black 0px 0px 0px');

    // Remove unselectable attribute
    $('[unselectable]').removeAttr('unselectable');

    // Remove blurred_page class
    $('.blurred_page').removeClass('blurred_page');

	  // Remove Preview Banner
    //$('div._140Ouo').css('display', 'none');
	  $('div._140Ouo').remove();

});