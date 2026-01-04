// ==UserScript==
// @name         网易云音乐显示评论数
// @version      1.0
// @namespace    https://greasyfork.org/zh-CN/users/297892
// @description  网易云音乐每日歌曲推荐界面显示评论数
// @author       移影残风
// @match        http*://music.163.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382562/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E6%98%BE%E7%A4%BA%E8%AF%84%E8%AE%BA%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/382562/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E6%98%BE%E7%A4%BA%E8%AF%84%E8%AE%BA%E6%95%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function () {
        console.log('网易云音乐每日歌曲推荐界面显示评论数')
        //console.log('iframe:' + $("iframe")[0].contentWindow.$(".txt:eq(2) a").attr('href').split('id=')[1])
        //console.log('iframe:' + $("iframe")[0].contentWindow.$(".txt:eq(2) a b").attr('title'))
        $("iframe")[0].contentWindow.$("thead tr").append('<th><div style="padding: 8px 10px;">评论数</div></th>')

        for (let i = 0; i <= 29; i++) {
            let selector = ".txt:eq(" + i + ") a";
            let musicId = $("iframe")[0].contentWindow.$(selector).attr('href').split('id=')[1]
            let selector2 = ".txt:eq(" + i + ")";
            let url = "https://music.163.com/api/v1/resource/comments/R_SO_4_" + musicId + "?limit=20&offset=0";
            $.get(url, function (data) {
                let jsonObj = JSON.parse(data);
                let commentCount = jsonObj.total;
                $("iframe")[0].contentWindow.$(selector2).parents("tr").append('<td class=""><div class="f-cb"><div class="tt"><div class="ttc"><span>'+commentCount+'</span></div></div></div></td>')

            })
        }
    }
})();