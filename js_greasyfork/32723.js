// ==UserScript==
// @name         OHG-Bensberg Redesign
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://ohg-bensberg.de
// @include      http://ohg-bensberg.de/*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32723/OHG-Bensberg%20Redesign.user.js
// @updateURL https://update.greasyfork.org/scripts/32723/OHG-Bensberg%20Redesign.meta.js
// ==/UserScript==

$(function() {
    'use strict';
    $('body').append("<style>body{font-family:Roboto,Helvetica,sans-serif;font-size:16px}.countdown-page,.ja-footer{background-color:#fff;border:0}a{color:#00ADEF;transition:all .2s}a:hover,a:focus{color: hsla(197, 100%, 65%, 1)}#t3-mainnav,.module-title,#t3-footer{background-color:#00ADEF;color:#fff}#t3-mainnav li>*{color:#fff}#t3-mainnav .caret{border-top:4px solid #fff}.t3-megamenu .mega-nav > li,.t3-megamenu .dropdown-menu .mega-nav > li{border-color:#00ADEF}.uk-blog-date .uk-event-date, .uk-event-time .uk-event-date, .block-number .digit{padding:10px;border-radius:4px;cursor:pointer;transition:background-color .2s}.block-numer .digit:hover{background-color:#00ADEF}.block-number .bottom{display:none}.upcoming_event_container{min-height: 65px;height:auto}.t3-bot-sl .module-title{color:#00ADEF}.btn-primary{color:#00ADEF;border-color:#00ADEF}.btn-primary:hover{color:#fff;background-color:#00ADEF;}.btn-vplan{width:100%;display:block;margin-top:10px}#login-form input{border-radius: 0 4px 4px 0;}.t3-navhelper{border-color:#00ADEF;}.t3-navhelper .breadcrumb{color:#00ADEF;}.t3-sl .container{border-color:#00ADEF;}</style>");
    $('#form-login-username .add-on').append('<i class="fa fa-user"></i>');
    $('#form-login-password .add-on').append('<i class="fa fa-key"></i>');
    $('.modlgn-username').val('vplan');
    $('.modlgn-password').val('OHGSchule');
    $('.countdown-page > .custom > p > a > img').attr('src', "http://i.imgur.com/kv9vLMO.png").css('height', '100px').removeAttr('width').removeAttr('height').attr('title', 'Designed by KingOfDog');
    $('.logo-img').attr('src', "http://i.imgur.com/UIDPuWL.png").css('height', '90px').attr('title', 'Designed by KingOfDog');
    $('.random-image img').attr('src', 'http://i.imgur.com/kv9vLMO.png').css('max-width', '260px').removeAttr('width').removeAttr('height').attr('title', 'Designed by KingOfDog');
    $('#vertretungsplan p strong a').addClass('btn btn-primary btn-vplan');
});