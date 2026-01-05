// ==UserScript==
// @name         Linguee show date v0.4
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Shows the date of the translated source.
// @author       Emilis -> inboxvartotojas@gmail.com
// @match        www.linguee.com/*
// @require      https://code.jquery.com/jquery-1.12.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/17877/Linguee%20show%20date%20v04.user.js
// @updateURL https://update.greasyfork.org/scripts/17877/Linguee%20show%20date%20v04.meta.js
// ==/UserScript==
$(document).ready(function() {
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle('.date{font-size:11px;color:#777;float:right;margin:0px;padding-right:20px;}.datered{font-size:11px;color:orange;float:right;margin:0px;padding-right:20px;}.source_url_spacer{display:none;}.source_url{position:relative;width:100%;display:inline-block;bottom:auto;right:auto;}.source_url a{float:left;}');
    source_url_get = $(".source_url > a");var link_get;var i_index_i;var matchResult;var date4;var link4_8check = /(19|20)+[0-9]+[0-9]/;var link2check = /(9|0|1|2)+[0-9]/;
    for (i_index_i = 0; i_index_i < source_url_get.length; ++i_index_i) {
        link_get = source_url_get.eq(i_index_i).attr('href');
        if(link4_8check.test(link_get)){
            if(link_get.match(link4_8check)[0].length == 4){
                $(".source_url > a").eq(i_index_i).after("<p class='date'>Date: " + link_get.match(link4_8check)[0] + "</p>");
            }else if(link_get.match(link4_8check)[0].length == 8){
                $(".source_url > a").eq(i_index_i).after("<p class='date'>Date: " + link_get.match(link4_8check)[0].slice(0,4)+" "+link_get.match(link4_8check)[0].slice(4,6)+" "+link_get.match(link4_8check)[0].slice(6,8) + "</p>");
            }else{
                console.log("Invalid date lenght");
            }
        }else if(link2check.test(link_get)){
            if(link_get.match(link2check)[0].length == 2 && link_get.match(link2check)[0] >= 40){
                $(".source_url > a").eq(i_index_i).after("<p class='date'>Date: "+"19"+ link_get.match(link2check)[0] + "</p>");
            }else if(link_get.match(link2check)[0].length == 2 && link_get.match(link2check)[0] < 40){
                $(".source_url > a").eq(i_index_i).after("<p class='date'>Date: "+"20"+ link_get.match(link2check)[0] + "</p>");
            }        
        }else{
            $(".source_url > a").eq(i_index_i).after("<p class='datered'>Date not found.</p>");
        }
    }    
});