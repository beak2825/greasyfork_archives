// ==UserScript==
// @name         小红书辅助显示
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  just for myself
// @author       pealpool
// @include      https://creator.xiaohongshu.com/creator/notes
// @require      https://cdn.staticfile.org/jquery/3.7.1/jquery.min.js
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485830/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%BE%85%E5%8A%A9%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/485830/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%BE%85%E5%8A%A9%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //css----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var styleStr = `
    .f-dot-btn{
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        position: fixed;
        z-index: 999999999;
        bottom: 136px;
        right: 15px;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: #ff2442;
        box-shadow: 0 5px 12px -4px rgb(175 0 0 / 30%);
    }
    .f-dot-btn:hover{
        background: #ff3e58;
    }
    .f-title{
        line-height: 31px;
        margin-left:18px;
    }
    .f-span{
        color:#888;
    }
    .f-red{
        color:#ff7800;
    }
    #f-button{
        courer:pointer;
    }
    .data-list{
        width:auto !important;
    }
`;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styleStr;
    document.getElementsByTagName('HEAD').item(0).appendChild(style);

    setTimeout(() => {
        //$("body").append("<div class='f-dot-btn'>辅</div>");
        //console.log(window.location.href);
        if (window.location.href === "https://creator.xiaohongshu.com/creator/notes") {
            $("span.f-span").remove();
            toCalculate();
        }
    }, 4000)



    $("body").append("<div class='f-dot-btn'>辅</div>");
    $("body").on("click", ".f-dot-btn", function () {
        if (window.location.href === "https://creator.xiaohongshu.com/creator/notes") {
            $("span.f-span").remove();
            toCalculate();
        }
    });

function parseChineseNumber(str) {
    const chineseNumberPattern = /^(\d+(\.\d+)?)(万)?$/; // 匹配数字+万的正则表达式

    const matches = str.match(chineseNumberPattern);
    if (!matches) {
        return NaN; // 不匹配则返回 NaN
    }

    const number = parseFloat(matches[1]); // 提取数字部分并转为浮点数

    if (matches[3] === '万') {
        return number * 10000; // 如果单位是万，则乘以 10000
    } else {
        return number; // 否则直接返回数字
    }
}


    function toCalculate() {
        // 遍历每个包含类名为 "info-list" 的 div 元素
        $(".info-list").each(function () {
            // 获取观看量、评论数、点赞量、分享数、收藏数
            const views = parseChineseNumber($(this).find(".data-list label:contains('观看量')+b").text());
            const comments = parseChineseNumber($(this).find(".data-list label:contains('评论数')+b").text());
            const likes = parseChineseNumber($(this).find(".data-list label:contains('点赞量')+b").text());
            const shares = parseChineseNumber($(this).find(".data-list label:contains('分享数')+b").text());
            const favorites = parseChineseNumber($(this).find(".data-list label:contains('收藏数')+b").text());
            const fans = parseChineseNumber($(this).find(".data-list label:contains('直接涨粉数')+b").text());
            //const duration = parseInt($(this).find(".data-list label:contains('人均观看时长')+b").text());
            //const barrage = parseInt($(this).find(".data-list label:contains('弹幕数')+b").text());

            // 计算评论率、点赞率、分享率、收藏率
            const commentRate = (comments / views * 100).toFixed(2);
            const likeRate = (likes / views * 100).toFixed(2);
            const shareRate = (shares / views * 100).toFixed(2);
            const favoriteRate = (favorites / views * 100).toFixed(2);
            const fansRate = (fans / views * 100).toFixed(2);

            const interactionRate = ((comments + likes + favorites) / views * 100).toFixed(2);

            const interactionCss = interactionRate > 3 ? "f-red" : "";

            if (views) {
                // 创建新的 <span> 元素，并添加到相应的位置
                $(this).find(".data-list label:contains('评论数')+b").append("<span class='f-span'>　" + commentRate + "</span>");
                $(this).find(".data-list label:contains('点赞量')+b").append("<span class='f-span'>　" + likeRate + "</span>");
                $(this).find(".data-list label:contains('分享数')+b").append("<span class='f-span'>　" + shareRate + "</span>");
                $(this).find(".data-list label:contains('收藏数')+b").append("<span class='f-span'>　" + favoriteRate + "</span>");
                $(this).find(".data-list label:contains('直接涨粉数')+b").append("<span class='f-span'>　" + fansRate + "</span>");
                $(this).find(".data-list label:contains('观看量')+b").append("<span class='f-span " + interactionCss + "'>　" + interactionRate + "</span>");
            }
        });
    }

})();