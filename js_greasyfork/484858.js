// ==UserScript==
// @name        通用广告过滤优化
// @namespace   通用广告过滤优化
// @match       *://*manhuahg.cn/*
// @match       *://*kundihulan.com/*
// @match       *://*zdxyzys.com/*
// @match       *://*xmflv.*/*
// @match       *://*qq.com*/*
// @match       *://*youku.com*/*
// @require     https://code.jquery.com/jquery-1.11.0.min.js
// @grant       none
// @version     1.5.2
// @license     GPL
// @author      忙里偷闲
// @description 2024/10/06 下午10:40:15
// @downloadURL https://update.greasyfork.org/scripts/484858/%E9%80%9A%E7%94%A8%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/484858/%E9%80%9A%E7%94%A8%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


$(document).ready(function () {

    if (window.location.hostname.includes("manhuahg.cn")) {

        $(".layout-box:contains('热门推荐')").remove();
        $(".vod-list:contains('猜你喜欢')").remove();
        $(".vod-list:contains('用户评论')").remove();
        $(".vod-list:contains('内容简介')").remove();
        $(".banner").remove();
        $(".comment-box").remove();
        $(".vod-right").remove();
        $(".bottom").remove();
        $(".fixedbar-fixed-bar").remove();        
        $(".vod-left.col-xl-9").removeClass();
        $('.ewave-player-full-toggle').click();
        $(".swiper-wrapper>a.swiper-slide:contains('资讯')").remove();
        $(".swiper-wrapper>a.swiper-slide:contains('留言报错')").remove();
        $(".swiper-wrapper>a.swiper-slide:contains('最近更新')").remove();
        $(".fixedbar-fixed-bar").remove();

    } else if (window.location.hostname.includes("kundihulan.com")) {

        $(".panel:contains('同主演推荐')").remove();
        $(".panel:contains('网友评论')").remove();
        $(".panel:contains('同年代推荐')").remove();
        $(".panel:contains('同类型推荐')").remove();
        $(".menu>li:contains('动作片')").remove();
        $(".menu>li:contains('喜剧片')").remove();
        $(".menu>li:contains('爱情片')").remove();
        $(".menu>li:contains('国产剧')").remove();
        $(".menu>li:contains('韩国剧')").remove();
        $(".menu>li:contains('美国剧')").remove();
        $(".playbtn>a.btn:contains('评论')").remove();
        $("#wenziad").remove();
        $(".tzt-fixedbar").remove();
        $(".tzt-footer").parent().remove();
        $(".icon-news").parent().remove();

    }
   else if (window.location.hostname.includes("zdxyzys.com")) {

        $(".panel:contains('同主演推荐')").remove();
        $(".panel:contains('网友评论')").remove();
        $(".panel:contains('同年代推荐')").remove();
        $(".panel:contains('同类型推荐')").remove();
        $(".menu>li:contains('动作片')").remove();
        $(".menu>li:contains('喜剧片')").remove();
        $(".menu>li:contains('爱情片')").remove();
        $(".menu>li:contains('国产剧')").remove();
        $(".menu>li:contains('韩国剧')").remove();
        $(".menu>li:contains('美国剧')").remove();
        $(".playbtn>a.btn:contains('评论')").remove();
        $("#wenziad").remove();
        $(".tzt-fixedbar").remove();
        $(".tzt-footer").parent().remove();
        $(".icon-news").parent().remove();

    }
    else if (window.location.hostname.includes("qq.com")) {
       setInterval(function() {
         if($(".panel-tip-pay").length >0)
        $(".panel-tip-pay").remove();
      }, 1000);
    }
    else if (window.location.hostname.includes("youku.com")) {
       setInterval(function() {
         if($(".cc_popup_window_close").length >0)
        $(".cc_popup_window_close").click();
      }, 1000);
    }

     setInterval(function() {
         if($("#adv_wrap_hh").length >0) $("#adv_wrap_hh").remove();
         if($(".playlist-overlay-minipay").length >0) $(".playlist-overlay-minipay").remove();
         if($(".vip-button-wrapper").length >0) $(".vip-button-wrapper").remove();
         if($(".playlist-intro__actions").length >0) $(".playlist-intro__actions").remove();
         if($(".page-content__bottom").length >0) $(".page-content__bottom").remove();
         if($(".game-switch-ad").length >0) $(".game-switch-ad").remove();
         if($(".playlist-video-modules-union").length >0) $(".playlist-video-modules-union").remove();
         if($(".game-switch-ad").length >0) $(".game-switch-ad").remove();

      }, 1000);


});

