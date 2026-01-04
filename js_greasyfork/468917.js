// ==UserScript==
// @license      MIT
// @name         B站搜索过滤
// @namespace    http://tampermonkey.net/
// @version      230618.1
// @description  屏蔽B站搜索页面下不想看的UP主以及苍蝇般烦人的营销号
// @author       Crossous
// @match        *://search.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/468917/B%E7%AB%99%E6%90%9C%E7%B4%A2%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/468917/B%E7%AB%99%E6%90%9C%E7%B4%A2%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    //在这里输入你想屏蔽的UP主和关键词
    let Uploaders = [
        "超级氪",
        "鸢ㅡ折纸",
        "大猫不贪玩",
        "无灵为233",
        "原野小新之助"
    ];

    let Keywords = [
        "优惠",
        "618",
        "双11",
        "京东",
        "好物",
        "好价"
    ];

    let Hidden = function(){
        Uploaders.forEach(function(value,index,array){
            let containsString = ":contains('" + value + "')";
            $("span.bili-video-card__info--author" + containsString).parents('div.bili-video-card').parent().hide();
        });
        Keywords.forEach(function(value,index,array){
            let containsString = ":contains('" + value + "')";
            $("h3.bili-video-card__info--tit" + containsString).parents('div.bili-video-card').parent().hide();
        });
    }

    document.addEventListener('DOMNodeInserted', function() {
        Hidden();
    }, false);
})();