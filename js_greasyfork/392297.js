// ==UserScript==
// @name         nv_sale_cnt_rev
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  try to take over the world!
// @author       You
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match        https://land.naver.com/article/articleList.nhn*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392297/nv_sale_cnt_rev.user.js
// @updateURL https://update.greasyfork.org/scripts/392297/nv_sale_cnt_rev.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tcnt = 0;
    var now = 0;
    tcnt = $("span.list_name").length
    if (tcnt == 0 ) {
        console.log ("complete");
        location.href="https://www.dawin.xyz/salecnt/done"
        return;
    }
     $("span.list_name").each( function() {
        var cpx = $(this).children("a").attr("id");
        var cnt = $(this).children("em").text();
         $.ajax({
             url: 'https://www.dawin.xyz/salecnt',
             type: 'POST',
             data: {cpx: cpx, cnt:cnt},
             dataType : "jsonp",
             success: function (result) {

             },
             error : function(request, status, error) {
                 console.log("error - " + cpx)
             },
             complete : function ( ) {
                 now += 1;
                 if ( tcnt <= now ) {
                     console.log ("complete")
                     location.href="https://www.dawin.xyz/salecnt/done"
                 }
             }
         });
    });
    // Your code here...
})();