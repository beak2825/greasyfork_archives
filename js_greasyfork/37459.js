// ==UserScript==
// @name PureLive
// @version 1.0.9
// @description:zh-cn 移除直播网站广告
// @namespace Violentmonkey Scripts
// @include https://www.zhanqi.tv/*   
// @exclude https://www.zhanqi.tv/topic/*
// @include https://www.showroom-live.com/*
// @include https://live.bilibili.com/*
// @include https://www.douyu.com/*
// @exclude https://www.douyu.com/
// @grant none
// @description 移除直播网站广告
// @downloadURL https://update.greasyfork.org/scripts/37459/PureLive.user.js
// @updateURL https://update.greasyfork.org/scripts/37459/PureLive.meta.js
// ==/UserScript==

/**
 * WARNING
 * 本脚本仅支持 Violentmonkey Scripts
 */
$(document).ready(() => {
  const applyCSS = (css) => {
    let styleTag = $(css);
    $('html > head').append(styleTag);
  }
  const zhanqi = () => {
    $('.live-chat-content').remove(); // 聊天窗口
    $('.live-side-content').remove(); // 左侧边栏
    $('.want-headlines-btn').remove(); // 上头条
    $('.js-room-fun-area').remove(); // 礼物区域
    $('.sdk-zhanqiMall').remove(); // 商城按钮
    $('.anchor-info-area').remove(); // 主播信息
    $('.hot-tg').remove(); // 热门推广
    applyCSS(`<style>
    .no-play-down-ibox {display: none !important;} /* 客户端下载广告 */
    #js-flash-layer {width: 99vw !important; height: 100vh !important;} /* 拉伸播放器 */
    .live-room-content {padding: 0 !important;} /* 砍掉主容器左内间距 */
    .sdk-zhanqiMall {display: none !important;} /* 商城按钮 */
    .room-rank-ibox,.ranking-btn {display: none !important;} /* 排名展示和排名按钮 */
    .zb-task .zb-task-entrance { display: none !important } /* 主播任务 */
    .shrink-icon { display: none !important } /* 主播任务 */
    </style>`);
    $(window).trigger('resize');
  }

  const showroom = () => {
    applyCSS(`<style>
      #js-avatar { display: none !important; } /* 垃圾头像 */
      #gift-area, #gift-log  { display: none !important; }  /* 礼物区域 */
      #event-and-support-area  { display: none !important; }  /* 活动和赞助区域 */
      .l-room-footer { display: none !important; }  /* 底栏 */
      .remove-background {background-image: none !important;} /* 垃圾背景图 */
      .l-publicity-banner { display: none !important; }  /* banner */
      .l-room-video {left: 0 !important; margin-left: 0;} /* 以下三行是拉伸播放器 */
      #js-room-video { width: auto !important; height: auto !important;}
      #js-video { width: 99vw !important; height: 70vh !important;}
      #js-room-comment-wrapper { top: 85vh !important; opacity: 0.5; } /* 调整评论框位置 */
      #js-room-comment-wrapper:hover { opacity: 1 }
      .l-room-youtube { text-align: center; }
    </style>`);
    $('.room-inner').addClass('remove-background');
    // 背景太黑 所以搞个自定义背景
    $('.l-wrapper').on(
      'dragover',
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      }
    )
    $('.l-wrapper').on(
      'dragenter',
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      }
    )
    $('.l-wrapper').on(
      'drop',
      function (e) {
        if (e.originalEvent.dataTransfer) {
          if (e.originalEvent.dataTransfer.files.length) {
            e.preventDefault();
            e.stopPropagation();
            const fileReader = new FileReader();
            fileReader.readAsDataURL(e.originalEvent.dataTransfer.files[0]);
            fileReader.onloadend = () => {
              $('.room-inner').removeClass('remove-background');
              $('#js-room-section').removeAttr('style');
              $('#js-room-section').css('background-image', `url(${fileReader.result})`);
            }
          }
        }
      }
    );
  }

  const bilibili = () => {
    applyCSS(`<style>
      .bilibili-live-player-video-gift { display: none !important; } /* 覆盖播放器的礼物横幅 */
      .gift-content, .gift-prefix {display: none !important;} /* 覆盖播放器的礼物横幅 */
    </style>`)
  }

  const douyu = () => {
    applyCSS(`<style>
      .left-menu { display: none !important; } /* 弱智左边栏 */
      #js-stats-and-actions { display: none !important; } /* 礼物投喂和任务 */
      #js-live-room-normal-right  { display: none !important; } /* 聊天区域 */
      #anchor-info { display: none !important; } /* 主播信息 */
      #header { display: none !important; } /* 顶栏 */
      #container { margin-top: -50px; } /* 填补顶栏 */
      #mainbody { margin-left: 0 !important; padding: 0 !important; } /* 播放器拉伸 填补 */
      #js-room-video { margin: 0 !important; overflow: visible !important;}
      #douyu_room_normal_flash_proxy_box, #douyu_room_normal_flash_proxy_box object, #douyu_room_normal_flash_proxy_box video { width: 99vw; height: 100vh; }
      .room-ad-top  { display: none !important; } /* 顶部广告 */
      .noble-face-wrap { display: none !important; } /* 贵族主播活动 */
      </style>`)
  }

  switch (location.host) {
    case 'www.zhanqi.tv':
    case 'zhanqi.tv':
      zhanqi(); break;
    case 'www.showroom-live.com':
      showroom(); break;
    case 'live.bilibili.com':
      bilibili(); break;
    case 'douyu.com':
    case 'www.douyu.com':
      douyu(); break;
  }
});