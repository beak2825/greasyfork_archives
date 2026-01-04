// ==UserScript==
// @name         RPGEN SNS - Tweet delete button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://rpgen.site/login/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/424093/RPGEN%20SNS%20-%20Tweet%20delete%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/424093/RPGEN%20SNS%20-%20Tweet%20delete%20button.meta.js
// ==/UserScript==

(function(unsafeWindow) {
    'use strict';
    $("#idTweetButton").on("click",main);
    main();
    function main(){
        $(".cBlog").each((i,e)=>{
            $("<button>").appendTo(e).text("delete").on("click",()=>{
                delTweet($(e).find("bdate").attr("d")).done(()=>{
                    $(e).remove();
                }).fail(()=>{
                    alert("failed to delete");
                });
                return false;
            });
        });
    }
    function delTweet(g_d){
        return $.ajax({
            type: "POST",
            url: "cons/tweetDel.php",
            data: {
                token: unsafeWindow.g_token,
                gd: g_d
            }
        });
    }
})(window.unsafeWindow || window);