// ==UserScript==
// @name         Pixiv enhance history a little
// @name:zh-CN   Pixiv历史记录稍微增强
// @name:zh-TW   Pixiv歷史記錄稍微增强
// @name:ja      pixivの履歴の機能をわずかに強化
// @namespace    http://tampermonkey.net/
// @icon         https://i.pximg.net/user-profile/img/2019/05/02/16/56/10/15718030_ded90a676c52836d9f739f7aa6d4faf6_170.jpg
// @version      0.3
// @description        Just let non-members browse history
// @description:zh-CN  单纯让非会员浏览历史记录
// @description:zh-TW  單純讓非會員瀏覽歷史記錄
// @description:ja     非会員が履歴を閲覧できるようにする
// @author       Quantum-Electrodynamics
// @include      http*://www.pixiv.net/history.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389389/Pixiv%20enhance%20history%20a%20little.user.js
// @updateURL https://update.greasyfork.org/scripts/389389/Pixiv%20enhance%20history%20a%20little.meta.js
// ==/UserScript==

(function() {
    // 'use strict';
    var count=60
    var temp=setInterval(function(){
        var historys = $("span._history-item")
        if (historys.length) {
            var pids=[]
            historys.each(function () {
                var url=/http.*?\.jpg/.exec($(this).attr("style"))[0]
                var pid=/\/\d*?_/.exec(url)[0].slice(1, -1)
                pids.push(pid)
                var newelement = "<a href=\"/artworks/" + pid + "\" target=\"_blank\" class=\"_history-item show-detail list-item\" style=\"background-image: url(&quot;" + url + "&quot;);\"><div class=\"status\">" + "</div></a>"
                $(this).replaceWith(newelement)
            })
            var pidsText = pids.reduce((s, e) => { return s + "," + e })
            $.getJSON("https://www.pixiv.net/rpc/index.php?mode=get_illust_detail_by_ids&illust_ids="+pidsText, (data) => {
                $("a._history-item").each(function(){
                    var url=/http.*?\.jpg/.exec($(this).attr("style"))
                    var pid = /\/\d*?_/.exec(url)[0].slice(1, -1)
                    if (pids.includes(pid)) {
                        var newelement = "<a href=\"/artworks/" + pid + "\" target=\"_blank\" class=\"_history-item show-detail list-item\" style=\"background-image: url(&quot;" + url + "&quot;);\"><div class=\"status\">" + (data.body[pid].is_bookmarked ? "<span class=\"_bookmark-icon-like-icon-font white\"></span>" : "") + "</div></a>"
                        $(this).replaceWith(newelement)
                    } else {
                        return
                    }
                })
            })
            clearInterval(temp)
        } else {
            if (!--count) {
                console.log("Pixiv历史记录稍微增强: 超时")
                clearInterval(temp)
            }
        }
    }, 500)
})();
