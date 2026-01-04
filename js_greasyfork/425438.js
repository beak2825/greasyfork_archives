// ==UserScript==
// @name         科學投票小幫手
// @namespace    https://sciexplore.colife.org.tw/
// @version      1.1
// @description  投票小幫手
// @author       meowmeow
// @match        https://sciexplore.colife.org.tw/work.php*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425438/%E7%A7%91%E5%AD%B8%E6%8A%95%E7%A5%A8%E5%B0%8F%E5%B9%AB%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/425438/%E7%A7%91%E5%AD%B8%E6%8A%95%E7%A5%A8%E5%B0%8F%E5%B9%AB%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $input = $('<input type="button" value="投票" id="test"/>');
    $input.appendTo($('.section-title'));


    $('#test').on('click',function(){
        var count = prompt('你要投幾票？');
        if (count === null) {
            return; //break out of the function early
        }
        var url = new URL(window.location.href);
        var t = url.searchParams.get("t");
        for (var i=0; i<count;i++){
            fetch("https://sciexplore.colife.org.tw/campaign-count.php", {
                "credentials": "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Upgrade-Insecure-Requests": "1",
                    "Pragma": "no-cache",
                    "Cache-Control": "no-cache"
                },
                "referrer": window.location.href,
                "body": "action=vote&sttype=3&scuid=986&stformatid=" + t,
                "method": "POST",
                "mode": "cors"
            });
        }
        alert('投票完成');
    });


})();