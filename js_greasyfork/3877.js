// ==UserScript==
// @name      coursera helper
// @namespace  http://andreabisognin.it
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version    0.32
// @description  keybindings for coursera
// @match      https://class.coursera.org/*/lecture/*
// @copyright  2014+, Andrea Bisognin
// @downloadURL https://update.greasyfork.org/scripts/3877/coursera%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/3877/coursera%20helper.meta.js
// ==/UserScript==



this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function(){
	setTimeout(foo, 10000);
});

function foo(){
    var Captions = false;
    //var video = unsafeWindow.$("iframe").contents().find("video")[0];
    //console.log("element is "+video);
    jQuery(document).keydown(function(e){
        if(e.keyCode == 84) { 
            unsafeWindow.$("iframe").contents().find("button[title='Fullscreen']")[0].click();	
        }
        if (e.keyCode == 83) {
            if (Captions){
                unsafeWindow.$("iframe").contents().find("input[id='mep_0_captions_none']")[0].click();
                unsafeWindow.$("iframe").contents().find("input[id='mep_0_captions_none']")[0].click();
                Captions = false;
            }
            else {
                unsafeWindow.$("iframe").contents().find("input[id='mep_0_captions_en']")[0].click();
                unsafeWindow.$("iframe").contents().find("input[id='mep_0_captions_en']")[0].click();
                Captions = true;
            }
            
        }
    });
}