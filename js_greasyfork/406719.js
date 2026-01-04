// ==UserScript==
// @name         删除oschina的blocked
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://oschina.net/*
// @match        *://*.oschina.net/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/406719/%E5%88%A0%E9%99%A4oschina%E7%9A%84blocked.user.js
// @updateURL https://update.greasyfork.org/scripts/406719/%E5%88%A0%E9%99%A4oschina%E7%9A%84blocked.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var sb_user_ids = ['2683987'];
    var nc_user_ids = ['3836799'];
    function removeBlocked(){
        $("div.blocked").each(function(){
            var data_comment_user_id = $(this).attr( "data-comment-user-id" );
            if ( typeof(data_comment_user_id) !== "undefined" && data_comment_user_id !== null ) {
                console.log(data_comment_user_id);
            }else{
                data_comment_user_id = $(this).attr( "data-tweet-owner-id" );
            }
            if ( typeof(data_comment_user_id) !== "undefined" && data_comment_user_id !== null ) {
                console.log(data_comment_user_id);
            }else{
                console.log(this);
            }
            if(nc_user_ids.indexOf(data_comment_user_id) < 0){
                $(this).removeClass("blocked");
            }
            if(sb_user_ids.indexOf(data_comment_user_id) < 0){
                $(this).css({"background-color":"rgba(0,0,0,0.1)"});
            }else{
                console.log("find sb : "+data_comment_user_id);
                $(this).css({"background-color":"rgba(0,255,0,0.1)"});
            }
        });
    }
    $("#mainScreen").bind('DOMNodeInserted', function(e) {
        removeBlocked();
    });
    removeBlocked();
})();