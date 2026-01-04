// ==UserScript==
// @name         yuhuoji-bilibiliPageCleaning
// @description  bilibili网页版外观优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       yuhuoji
// @match        https://*.bilibili.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457807/yuhuoji-bilibiliPageCleaning.user.js
// @updateURL https://update.greasyfork.org/scripts/457807/yuhuoji-bilibiliPageCleaning.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function () {
  "use strict";
  // console.log("my first script");

  //主页删除广告card
  function removeAdvertisementCard() {
    // console.log("removeAdvertisementDiv");
    //删除左侧轮换图片
    $("div.recommended-swipe.grid-anchor").remove();
    //删除广告
    $("svg.bili-video-card__info--ad").parents(".feed-card").remove();
    $("svg.bili-video-card__info--ad").parents(".bili-video-card.is-rcmd").remove();
    //删除搜索页面广告
    $("svg.bili-video-card__info--ad").parents().filter(".bili-video-card").parent().remove();
    //删除创作推广
    $("img.bili-video-card__info--creative-img").parents(".feed-card").remove();
    $("img.bili-video-card__info--creative-img").parents(".bili-video-card.is-rcmd").remove();
    //删除创作激励视频（粉红小火箭）
    $("svg.bili-video-card__info--creative-ad").parents(".feed-card").remove();
    //删除直播中
    $("div.bili-live-card.is-rcmd").remove();
    //删除浮出的card（推荐的直播，番剧，课堂，电视剧等）
    $("div.floor-single-card").remove();
  }

  //修改主页视频style
  function modifyFormat() {
    //feed-card  margin-top:0
    $("div.feed-card").css("margin-top", "24px");
  }

  //播放页www.bilibili.com/video/
  function playingPage() {
    console.log("playingPage");
    //删除视频特殊类型弹幕
    $("div.bpx-player-cmd-dm-inside").remove();

    setTimeout(function () {
      //默认关闭迷你播放器
      $("div.nav-menu").children().eq(0).attr("class", "item mini");
      //删除视频下方广告comment
      $("div#v_tag").nextUntil("div#comment").remove();
      //删除侧栏广告
      $("div.video-page-special-card-small").remove();
      $("div.video-page-game-card-small").remove();
      $("div.vcd").remove();
      $("div.recommend-list-v1").nextAll().remove();
    }, 1000);

    //循环执行
    setInterval(function () {
      $("div.bpx-player-cmd-dm-inside").remove();
      removeCommentLink();
    }, 5000);
  }

  //净化播放页www.bilibili.com/video/评论区a标签超链接
  function removeCommentLink() {
    $("a.jump-link.search-word").each(function () {
      $(this).next("i.icon.search-word").remove();
      //a标签内容
      let content = $(this).html();
      $(this).before(content);
      $(this).remove();
    });
  }

  //页面dom加载完成后 Dom Ready
  $(document).ready(function () {
    console.log("Dom Ready");

    //www.bilibili.com
    if (window.location.host == "www.bilibili.com") {
      // console.log(window.location.href);
      // console.log(window.location.host);
      // console.log(window.location.pathname);
      const pathnameArray = window.location.pathname.split("/");

      //主页/
      if (pathnameArray[1] == "") {
        console.log("/");
        removeAdvertisementCard();
        modifyFormat();

        setTimeout(function () {
          //主页监听主页右侧换一换刷新按钮
          $("button.primary-btn.roll-btn").on("click", function () {
            console.log("click换一换");
            setTimeout(function () {
              removeAdvertisementCard();
              modifyFormat();
            }, 500);
            // $(function () {
            //   removeAdvertisementCard();
            // });
          });
        }, 500);

        //循环执行
        setInterval(function () {
          removeAdvertisementCard();
        }, 5000);
      }

      //播放页/video/
      if (pathnameArray[1] == "video") {
        console.log("video");
        playingPage();
      }
    }

    //个人空间
    if (window.location.host == "space.bilibili.com") {
      console.log("space.bilibili.com");
    }
  });

  //页面所有资源加载完成后
  window.onload = function () {
    console.log("loaded");
  };

  // continue ...
})();
