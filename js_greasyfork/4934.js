// ==UserScript==
// @name        Batoto Fix
// @namespace   BatotoFix
// @include     http://bato.to/*
// @version     1
// @grant       none
// @description swag money
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/4934/Batoto%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/4934/Batoto%20Fix.meta.js
// ==/UserScript==

// saving the world
this.$ = this.jQuery = jQuery.noConflict(true);

// home logo thingy
$("div#user_bar.clearfix").append ( '                \
<div class="home_logo_thingy" style="width: 116px; padding: 0 10px; margin: 0 auto;" ><a title="Main Page" href="http://bato.to/">   \
    <img alt="Main Page" style="height: 40px;" src="https://bato.to/forums/public/style_images/11_4_logo.png">   \
    </a></div>   \
' );

// fixing search function
$("ul#search_options_menucontent.ipbmenu_content.ipsPad li.app:last-child").hide()

$("ul#search_options_menucontent.ipbmenu_content.ipsPad").append ( ' \
    <li class="app" style="z-index: 10000;">   \
        <label title="Search Comics" for="s_ccs" style="z-index: 10000;">   \
        <input type="radio" checked="checked" value="ccs" id="s_ccs" class="input_radio" name="search_app" style="z-index: 10000;">   \
        Search Comics</label>   \
    </li>   \
' );

// swag scroll
window.onload = function() {    
    $('html, body').animate({
        scrollTop: $("div#comic_wrap > div > a > img#comic_page").offset().top
    }, 500); // increase this number for smoothness
}