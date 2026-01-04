// ==UserScript==
// @name         M-Team helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://tp.m-team.cc/movie.php*
// @grant        GM_log
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/30783/M-Team%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/30783/M-Team%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //var imdb = $("table.torrents tbody tr");
    var items = $("table.torrentname");
    items.each(function(){
        var a_tag = $(this).find("td.embedded a").eq(3);
        var mark = a_tag.text();
        GM_log(mark);
        if(mark !=="" && mark<6){
            $(this).parent().parent().hide();
        }else if(mark>=6 && mark<7.9){
        }else if(mark>=8 && mark <9){
            $(this).attr("style","color:blue");
            $(this).find("a").attr("style","color:blue");
            a_tag.attr("style","color:red;font-size:2em");
        }else if(mark>=9){
            $(this).attr("style","color:red");
            $(this).find("a").attr("style","color:red");
            a_tag.attr("style","color:red;font-size:2em");
        }
    });

})();