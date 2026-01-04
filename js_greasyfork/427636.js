// ==UserScript==
// @name         Wikifeet for EU
// @namespace    http://www.jeroendekort.nl
// @version      0.3
// @description  Re-enables Wikifeet for users browsing from inside the EU.
// @author       You
// @match        https://www.wikifeet.com/*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.5.0.js
// @downloadURL https://update.greasyfork.org/scripts/427636/Wikifeet%20for%20EU.user.js
// @updateURL https://update.greasyfork.org/scripts/427636/Wikifeet%20for%20EU.meta.js
// ==/UserScript==

var $ = window.jQuery;
$(function(){
    messanger.eus = 0;
    pSkipPage(1);

    $(document).ready(function() {
        window.setTimeout(function(){
            $("[id^='w_post']").each(function(){
                if (typeof $(this) !== 'undefined'){
                    if ($(this).find("a")){
                        var $ahref = $(this).find("a");
                        var style = $ahref.children().first().attr("style");
                        if (style){
                            $ahref.attr("href", /https.*?jpg/.exec(style)[0].replace("thumbs","pics"));
                        }
                    }
                }
            });
        }, 1000);
    });
});