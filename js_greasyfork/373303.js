// ==UserScript==
// @name         mteam good movie
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  mteam 电影板块, 根据 imdb 分数高亮颜色
// @author       hitsmaxft
// @match        https://*.m-team.cc/browse/movie*
// @match        https://*.m-team.io/browse/movie*
// @grant        GM_log
// @run-at document-end
// @supportURL https://greasyfork.org/en/scripts/373303-mteam-good-movie
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373303/mteam%20good%20movie.user.js
// @updateURL https://update.greasyfork.org/scripts/373303/mteam%20good%20movie.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    var scan_link = () => {
        try {
            console.log("start good movie");
            var imdb_test = /imdb\.com/
            var links = $(".justify-end a").filter(function (link) { return imdb_test.test($(this).attr("href")) });
            GM_log( "find "+links.length+" links");
            $(links).each( function(){

                var $el = $(this).find(".align-middle");


                var score = $el.text()
                GM_log( "find score " + score);
                var color;
                if(score>=8) color = "#FF6E40";
                else if (score >= 7) color = "#228653";//"GoldenRod";
                else if (score >= 6) color ="#A69800";
                else color ="gray";


                $el.css("font-size","12pt")
                $el.css("background", color);
                $el.css("color", "white");
                $el.css("border-radius", "1em");
                $el.css("padding", "0 0.5em");


                //var p = $el.parents(".torrentname");
                //p.find("b").css("background",color);
                //p.css("color",color);
            });
        } catch(e){
            GM_log(e)
        }
    }

    setInterval(scan_link, 3000);

})(jQuery);