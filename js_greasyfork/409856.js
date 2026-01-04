// ==UserScript==
// @name         killZhihuAd-屏蔽知乎广告/文章/视频-沉浸模式浏览
// @description  只优化知乎，没有其他乱七八糟的功能。干掉知乎广告+沉浸模式/屏蔽文章/屏蔽视频可选。
// @namespace    http://tampermonkey.net/
// @icon         https://www.zhihu.com/static/favicon.ico
// @version      1.4(2025/3/24)
// @author       shawn
// @run-at       document-end
// @match        *://*.zhihu.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/409856/killZhihuAd-%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E5%B9%BF%E5%91%8A%E6%96%87%E7%AB%A0%E8%A7%86%E9%A2%91-%E6%B2%89%E6%B5%B8%E6%A8%A1%E5%BC%8F%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/409856/killZhihuAd-%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E5%B9%BF%E5%91%8A%E6%96%87%E7%AB%A0%E8%A7%86%E9%A2%91-%E6%B2%89%E6%B5%B8%E6%A8%A1%E5%BC%8F%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==


(function() {
    /* global $ */
    'use strict';
    var href = window.location.href;
    if (href.indexOf("https://www.zhihu.com/people") != -1) {
        return;
    }

    //沉浸模式开关
    var focus_mode_on = GM_getValue("focus_mode_on");
    if(focus_mode_on){
        GM_registerMenuCommand("☑ 沉浸模式", focus_close, "");
    } else {
        GM_registerMenuCommand("☐ 沉浸模式", focus_open, "");
    }
    function focus_open () {
        GM_setValue("focus_mode_on", true);
        location.reload();
    }
    function focus_close () {
        GM_setValue("focus_mode_on", false);
        location.reload();
    }

    //屏蔽文章开关
    var kill_article_mode_on = GM_getValue("kill_article_mode_on");
    if(kill_article_mode_on){
        GM_registerMenuCommand("☑ 屏蔽文章", kill_article_close, "");
    } else {
        GM_registerMenuCommand("☐ 屏蔽文章", kill_article_open, "");
    }
    function kill_article_open () {
        GM_setValue("kill_article_mode_on", true);
        location.reload();
    }
    function kill_article_close () {
        GM_setValue("kill_article_mode_on", false);
        location.reload();
    }

    //屏蔽视频开关
    var kill_video_mode_on = GM_getValue("kill_video_mode_on");
    if(kill_video_mode_on){
        GM_registerMenuCommand("☑ 屏蔽视频", kill_video_close, "");
    } else {
        GM_registerMenuCommand("☐ 屏蔽视频", kill_video_open, "");
    }
    function kill_video_open () {
        GM_setValue("kill_video_mode_on", true);
        location.reload();
    }
    function kill_video_close () {
        GM_setValue("kill_video_mode_on", false);
        location.reload();
    }

    //取消二次转链
    if(window.location.host == "link.zhihu.com"){
    	var regRet = location.search.match(/target=(.+?)(&|$)/);
    	if(regRet && regRet.length == 3){
    		location.href = decodeURIComponent(regRet[1]);
    	}
	}

    //去除广告
    $(".Footer").remove();//侧边栏底部信息

    //+沉浸模式
    if(focus_mode_on){
        if(href.indexOf("https://www.zhihu.com/question/") != -1) {
            setTimeout(resetQuestionColumn, 50);
            setInterval(resetQuestionColumn, 1000);
	    } else if (href.indexOf("https://www.zhihu.com/search") != -1) {
            setTimeout(resetSearchColumn, 50);
        } else {
            setTimeout(resetMainColumn, 50);
            setInterval(killCardAd, 500);
        }
    } else {
        if(href.indexOf("https://www.zhihu.com/question/") != -1) {
            setInterval(killSideBarAd, 500);
	    } else {
            setInterval(killCardAd, 500);
            setInterval(killSideBarAd, 500);
        }
    }

    //+屏蔽所有文章
    if(kill_article_mode_on || kill_video_mode_on){
        setInterval(killArticleAndVedio, 500);
    }
    return;

    function killArticleAndVedio() {
        $(".TopstoryItem").each(function(){
            //去除文章
            if (kill_article_mode_on) {
                if($(this).find(".ArticleItem").length != 0){
                    $(this).remove();
                }
            }
            //去除视频
            if (kill_video_mode_on) {
                if($(this).find(".ZVideoItem").length != 0){
                    $(this).remove();
                }
            }
        });
    }
    function killCardAd() {
        //答案卡片中的广告
        $(".TopstoryItem--advertCard").remove();
        // 顶部广告
        $(".Pc-Business-Card-PcTopFeedBanner").remove();
    }
    function killSideBarAd() {
        //右边栏广告
        $(".Pc-card").each(function(){
            if($(this).find(".Banner-adTag").length != 0){
                $(this).remove();
            }
        });
        $(".AdvertImg").remove();
    }
    function resetQuestionColumn() {
        $(".Question-sideColumn").remove();
        $(".Question-mainColumn").width('960px');
        $(".ContentItem-actions").width('920px');
    }
    function resetMainColumn() {
        //$(".GlobalSideBar").remove();
        var child = $(".Topstory-container").children();
        child[1].remove();
        $(".Topstory-mainColumn").width('960px');
        $(".ContentItem-actions").width('920px');
    }
    function resetSearchColumn() {
        $(".SearchSideBar").remove();
        $(".SearchMain").width('960px');
        $(".ContentItem-actions").width('920px');
    }

})();
