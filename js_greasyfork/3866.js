// ==UserScript==
// @name       edx helper
// @namespace  http://andreabisognin.it
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version    0.37
// @description  some keybindings for edx: next, previous, play/pause
// @match      https://courses.edx.org/courses/*
// @copyright  2014+, Andrea Bisognin
// @downloadURL https://update.greasyfork.org/scripts/3866/edx%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/3866/edx%20helper.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function()
{
    jQuery(document).keydown(function(e){
        if(e.keyCode == 78) { 
            unsafeWindow.$("li[class='next']")[1].children[0].click();
			
        }
        if(e.keyCode == 80) {
            unsafeWindow.$("li[class='prev']")[1].children[0].click();
        }
        if (e.keyCode == 84) {
            unsafeWindow.$("a[class^='video_control']").click();
        }
        if (e.keyCode == 72) {
            unsafeWindow.$("a[class^='quality-control']").click();
        }
        if (e.keyCode == 67) {
            unsafeWindow.$("a[class$='subtitles']").click();
        }
        if (e.keyCode == 77) {
            unsafeWindow.$("a[class$='fullscreen']").click();
        }

    });
});