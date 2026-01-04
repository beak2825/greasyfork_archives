// ==UserScript==
// @name         rarbg bigger cover privew
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js

// @author       You
// @match        https://rarbgprx.org/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419106/rarbg%20bigger%20cover%20privew.user.js
// @updateURL https://update.greasyfork.org/scripts/419106/rarbg%20bigger%20cover%20privew.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //var e = $("a[onmouseout='return nd();']");
    var elements = $("table.lista2t td.lista");
    elements.each(function(){
        var original = $(this).html();
        if (original.indexOf("/static/over/") != -1){
            var fs = original.split('/static/over/')[1].substr(0,1);
            var re = original.replace('/static/over/','/posters2/'+fs+'/');
            if(original!=re){
                $(this).html(re);
            }
        }else if(original.indexOf("over_opt")!= -1){
            var re = original.replace('over_opt','poster_opt')
            if(original!=re){
                $(this).html(re);
            }
        }else if(original.indexOf("_small.jpg")!= -1){
            var re = original.replace('_small.jpg','_banner_optimized.jpg')
            if(original!=re){
                $(this).html(re);
            }
        }
    });

    // Your code here...
})();