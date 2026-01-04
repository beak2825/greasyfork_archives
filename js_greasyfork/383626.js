// ==UserScript==
// @name         Hide Ads in Google search results
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide inline ads in Google search results.
// @author       Matt Blais
// @include     http*://www.google.*/*
// @exclude     http*://www.google.com/recaptcha/*
// @include     http*://www.google.co*.*/*
// @include     http*://news.google.*/*
// @include     http*://encrypted.google.*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/383626/Hide%20Ads%20in%20Google%20search%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/383626/Hide%20Ads%20in%20Google%20search%20results.meta.js
// ==/UserScript==

$.noConflict();
jQuery( document ).ready(function( $ ) {
    'use strict';
    $('li.ads-ad').hide();
    $('#bottomads').hide();
});