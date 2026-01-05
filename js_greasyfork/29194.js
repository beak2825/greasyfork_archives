// ==UserScript==
// @name Facebook Auto Redirect Most Recent
// @version	0.2
// @author Akbar Yahya & Hélder Ferreira
// @description	GoodBye Top Stories
// @icon http://i.imgur.com/WpjyLA4.png
// @include	https://www.facebook.com/*
// @include	http://www.facebook.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant none
// @namespace https://greasyfork.org/users/11997
// @downloadURL https://update.greasyfork.org/scripts/29194/Facebook%20Auto%20Redirect%20Most%20Recent.user.js
// @updateURL https://update.greasyfork.org/scripts/29194/Facebook%20Auto%20Redirect%20Most%20Recent.meta.js
// ==/UserScript==
var siakbary = "http://www.facebook.com/?siakbary=true&sk=h_chr";
$(window).ready(function(){
    var urlx=window.location.href;
    if (window.location.pathname == '/' ){
     // Index (home) page
     if(urlx.indexOf( "?siakbary=true" ) == -1)
         window.location.replace(siakbary);
    } else {
     // Other page
     console.log(urlx);
    }
});
$("[data-click='home_icon']").click(function(){
    window.location.replace(siakbary);
});
$('a[data-testid="blue_bar_fb_logo"]').attr("href", siakbary);