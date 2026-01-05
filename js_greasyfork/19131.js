// ==UserScript==
// @name         tumblr optica restyle
// @namespace    https://greasyfork.org/en/users/36620
// @version      0.4
// @description  for tumblrs with the optica theme, move header to side and automatically display post notes
// @author       scriptfairy
// @include      http*://*.tumblr.com/*
// @exclude      http*://www.tumblr.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/19131/tumblr%20optica%20restyle.user.js
// @updateURL https://update.greasyfork.org/scripts/19131/tumblr%20optica%20restyle.meta.js
// ==/UserScript==

(function($) {
    if ($('a[href$="optica"]').length > 0) {
        var themeBackground = $('body').css('background-color'), r, g, b, searchColor;
        themeBackground = themeBackground.slice(themeBackground.indexOf('(')+1,themeBackground.indexOf(')')).split(',');
        if ((themeBackground[0] < 128 && themeBackground[1] < 128) || (themeBackground[0] < 128 && themeBackground[2] < 128) || (themeBackground[1] < 128 && themeBackground[2] < 128)) {
            r = b = g = 255;
        }
        else {r = g = b = 0;}
        searchColor = 'rgb('+r+','+g+','+b+')';
        $('<style>').text(
            '@media screen and (min-width: 1200px) {.iframe-controls--desktop {width:500px;} .narrow .content, .narrow .main {max-width:none;} .logo-wrapper {color:'+searchColor+'!important;} #posts .post-wrapper {overflow:visible;width:700px} .l-container {padding:0;} .inline-meta {max-width:100%; margin: 0 20px;} .date-note-wrapper #notes {display:block;position:relative;min-height:50px;width:100%;margin:0;left:-10px;top:32px;border:none;box-shadow:none;} .date-note-wrapper .post-date {position:absolute;top:4px;right:120px;} .notes-wrapper .notes {overflow:auto;max-height:100%;} .post-footer .post-controls {position:absolute;top:0;right:0;} .header-wrapper {position:absolute;top:50px;} .header-wrapper #header {max-width:500px;margin:25px;} #posts {float:right;top:75px;right:50px;} #footer {float:right;top:75px;right:50px;clear:both;} .staff-blogs {position:absolute;left:-150px;}}'
       ).appendTo($('head'));
    }
})(window.jQuery);