// ==UserScript==
// @name         Music7S Row Style
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  row style add
// @author       devAston and PapaIvan
// @match        https://music7s.appspot.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392358/Music7S%20Row%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/392358/Music7S%20Row%20Style.meta.js
// ==/UserScript==

// @require http://code.jquery.com/jquery-3.4.1.min.js

var $, jQuery;
$ = jQuery = window.jQuery;

(function() {
    'use strict';

    $('body').on('click', 'div.sp_notify_prompt', function(event){
        $('div.collection-item.active').removeClass('active');
        $(this).closest('.collection-item').addClass('active');
        console.log(this);
    })
})();