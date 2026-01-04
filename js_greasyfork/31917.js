// ==UserScript==
// @name Kbagi Anti+
// @version	0.2
// @author Akbar Yahya
// @description	GoodBye Internet+
// @icon http://119.81.2.142/img/logo_200x200.jpg
// @include	*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant none
// @namespace https://greasyfork.org/users/11997
// @downloadURL https://update.greasyfork.org/scripts/31917/Kbagi%20Anti%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/31917/Kbagi%20Anti%2B.meta.js
// ==/UserScript==
$(window).ready(function(){
    var fullurl=window.location.href;
    var hostx=window.location.hostname;
    var page=window.location.pathname;
    if ((/kbagi|kumpulbagi/i).test(hostx)){
        window.location = "http://119.81.2.142"+window.location.pathname;
    } else {
     // Other page
     console.log(hostx+page);
    }
});