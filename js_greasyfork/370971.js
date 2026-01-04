// ==UserScript==
// @name         animelon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://animelon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370971/animelon.user.js
// @updateURL https://update.greasyfork.org/scripts/370971/animelon.meta.js
// ==/UserScript==

(function() {
    'use strict';



    function searchForVideo(){

        if (jQuery("video[preload='']").length == 0 && jQuery("video:visible").length > 0 &&  jQuery(".video-container:visible").length > 0 && jQuery("video").attr("src") !== undefined){

                jQuery("header").after("<textarea style='width: 100%' id='copyarea'></textarea>")
                jQuery("#copyarea").after("<button type='button' onclick='window.next()'>Next</button>")
                jQuery("#copyarea").after("<button type='button' onclick='window.copyName()'>Copy Name</button>")
                jQuery("#copyarea").after("<button type='button' onclick='window.copy()'>Copy</button>")
                jQuery("#copyarea").val(jQuery("video").attr("src") + "#" + jQuery(".currently-watching:visible").next().text())
                //if ( jQuery("video").attr("src").indexOf("blob.core.windows.net") > 0)
                //    location.reload(true);
        }
        else{

            setTimeout(function(){searchForVideo() }, 1);
        }

    }
// 57986e7c641f6457395b6b23
    window.copy = function(){
            jQuery("#copyarea").select()
            document.execCommand('copy')

            setTimeout(function(){
                jQuery("#copyarea").val(jQuery("video").attr("src") + "#" + jQuery(".currently-watching:visible").next().text())
            }, 1000);

    }

    window.copyName = function(){

            jQuery("#copyarea").val(jQuery(".currently-watching:visible").next().text() + ".mp4")
            jQuery("#copyarea").select()
            document.execCommand('copy')
    }

    window.next = function(){

        window.location = jQuery(".currently-watching:visible").parents("a").eq(0).prev().attr("href")
    }
$( document ).ready(function() {
            setTimeout(function(){
                searchForVideo()
            }, 2000);
});
    // Your code here...
})();