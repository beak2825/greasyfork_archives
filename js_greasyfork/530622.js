// ==UserScript==
// @name        bilibili-dark-theme-ng
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/*
// @match       https://t.bilibili.com/*
// @match       https://search.bilibili.com/*
// @match       https://space.bilibili.com/*
// @match       https://message.bilibili.com/*
// @run-at      document-idle
// @grant       GM_addStyle
// @version     1.0.0
// @author      slimer10
// @license     MIT
// @description b站深色模式
// @downloadURL https://update.greasyfork.org/scripts/530622/bilibili-dark-theme-ng.user.js
// @updateURL https://update.greasyfork.org/scripts/530622/bilibili-dark-theme-ng.meta.js
// ==/UserScript==

GM_addStyle(`
  :root {
    color-scheme: dark;

    --Lb5: #00bbff !important;
    --Wh0: #0f0f0f !important;
    --Ga0: #222222 !important;
    --Ga0_s: #222222 !important;
    --Ga1: #282828 !important;
    --Ga1_s: #222222 !important;
    --Ga2: #484848 !important;
    --Ga7: #a4a4a4 !important;
    --Ga10: #d1d1d1 !important;
    --Ga11: #222222 !important;
    --Ga12: #4a4a4a !important;
    --Ga13_s: #5a5a5a !important;

    /*UP觉得很赞修复 & tag圆形化*/
    .tag {
      color: var(--Ga1) !important;
      background-color: var(--Ga1_s) !important;
      border-radius: 180px !important;
    }

    .tag:hover {
      color: var(--Ga2) !important;
      background-color: var(--Ga1_s) !important;
      border-radius: 180px !important;
    }

    /* 回复框 */
    .reply-box-warp {
      border: 1px solid #626262 !important;
    }

    /* 弹幕输入框 */
    .bpx-player-video-inputbar-wrap {
      background: #333333;
    }

    /* 颜色调整 */
    .bpx-player-container {
      -webkit-box-shadow: 0 0 8px var(--Ga0);
      box-shadow: 0 0 8px var(--Wh0) !important;
      height: 100%;
      position: relative;
      width: 100%;
    }


    /* 标题栏阴影 */
    .mini-header {
      box-shadow: none;
      border-bottom: 1px solid #484848;
      background-color:var(--Wh0) !important;
    }

    /* 总是去除背景图 */
    body {
    background: none !important; /* 移除背景图 */
    background-color: #000000 !important; /* 设置纯色背景 */
    }

    /* 总是抑制加载动画 */
    .card {
      background-color: var(--Ga0) !important;
      border-color: 1px solid var(--Ga0) !important;
    }
    .link-progress-tv {
      background-color:var(--Ga0) !important;
    }

    /*修正小卡片*/
    .bili-video-card__info--icon-text {
      background-color: var(--Ga1) !important;
      padding: 0 6px;
    }

    .bili-video-card__info--rcmd-text {
      background-color: var(--Ga10) !important;
      color: var(--Ga1) !important;
      padding: 0 6px;
    }

    .bili-header .slide-down {
      background: var(--Wh0);
    }

    /*修改恶心的边框*/
    .bili-header .header-avatar-wrap .header-avatar-wrap--container .bili-avatar {
      border: 1px solid #ccc;
    }

    .bili-header .mini-avatar--small .header-entry-mini {
	    border: 1px solid #ccc;
    }

    /*搜索*/
    .vui_button--tab:active, .vui_button--tab.vui_button--active {
      color: var(--Ga10);
      background-color: var(--Ga1);
      border: none;
    }

    #nav-searchform{
      border-radius: 180px !important;
    }

    .bili-header .center-search-container .center-search__bar .nav-search-content {
      border-radius: 180px !important;
      padding: 0 16px !important;
    }

    .bili-header .search-panel {
      border: 1px solid var(--line_regular) !important;
      border-top: 1px solid var(--line_regular) !important;
      border-radius: 8px !important;
      padding: 13px 0 0px !important;
      transform: fade(100%);
      transition: all .5s ease-in;
    }

    .user-info-wrapper {
      background-color:var(--Wh0) !important;
      color: var(--Ga10) !important;
    }

    /*反馈框修复*/
    .feedback-module .entry {
      background-color:var(--Wh0) !important;
      color: var(--Ga10) !important;
    }

    .feedback-module .entry:hover {
      background-color:var(--Lb5) !important;
      color: var(--Ga1) !important;
    }

    .reason {
      background-color:var(--Wh0) !important;
      color: var(--Ga10) !important;
    }

    .reason:hover {
      background-color:var(--Lb5) !important;
      color: var(--Ga1) !important;
    }


    /*拜托，弹幕显示只要一次啦*/
    .bpx-player-video-info-divide {
      display: none !important;
    }
    .bpx-player-video-info-dm {
      display: none !important;
    }

    /*去除大会员标志，粉色名字已经够了*/
    .layer-res {
      display: none !important;
    }

    /*发现音乐*/
    #musicApp {
      background-color: var(--Wh0);
    }
  }
`);

/*搜索结果防止弹出新窗口*/
if (
location.href.startsWith("https://search.bilibili.com/")
) {
  function fixLinks() {
      document.querySelectorAll('a[target="_blank"]').forEach(link => {
          link.removeAttribute('target');
      });
  }

  fixLinks();

  new MutationObserver(fixLinks).observe(document.body, {
      childList: true,
      subtree: true
  });
}

/* 动态 */
if (
  location.href.startsWith("https://www.bilibili.com/opus/") ||
  location.href.startsWith("https://t.bilibili.com/")
) {
  // 移除背景图片
  const bg = document.querySelector(".bg");
  if (bg) {
    bg.remove();
  }

  GM_addStyle(`
    :root {
      --Wh0: #333333 !important;
      --Ga0: #484848 !important;
    }
     /* 全局背景颜色 */
     * {
       background-color: transparent !important;
     }

    /* 背景遮罩 */
    .bgc {
      background-color: var(--Ga1) !important;
    }

    /* 动态UP名字 */
    .bili-dyn-up-list__item__name {
      color: var(--Ga5) !important;
    }

    /* 推荐视频商品卡片 */
    .bili-dyn-card-ugc__wrap,
    .bili-dyn-card-goods__wrap {
      background-color: var(--Ga1) !important;
    }
  `);
}

/* 个人空间 */
if (location.href.startsWith("https://space.bilibili.com/"))  {
  GM_addStyle(`
    :root {
      --Wh0: #242424 !important;
      --Ga0: #333333 !important;

      html,body {
        background-color: var(--Ga1) !important;
        border: 1px solid var(--Ga1) !important;
      }
      .element.style {
        color:var(--Ga0) !important;
      }
    }

     /* 全局背景颜色 */
     * {
       background-color: transparent !important;
     }
    /* 顶部背景 */
    .h-space-header {
      background-color: var(--Ga0) !important;
    }

    /* 用户信息卡片 */
    .h-user-card {
      background-color: var(--Ga1) !important;
    }

    /* 动态列表背景 */
    .bili-dyn-list {
      background-color: var(--Ga1) !important;
    }

    /* 动态卡片样式 */
    .bili-dyn-card {
      background-color: var(--Ga1) !important;
      border: 1px solid #333333 !important;
    }

    /* 去除头图 */
    .h-inner {
      background-image: none !important; /* 移除背景图 */
      background-color: #242424 !important; /* 设置纯色背景 */
      .space-theme-trigger.icon {
        background-image: none !important; /* 移除背景图 */
        background-color: #242424 !important; /* 设置纯色背景 */
      }
    }
    .n .n-inner {
      background: var(--Ga0) !important;
      box-shadow: 0 0 0 1px #242424 !important;
    }
    .n .n-text{
      color: var(--Ga0) !important;
    }
    .wrapper.clearfix::before {
      display:none;
    }
    .col-1 {
      background: var(--Ga0) !important;
      border: 1px solid var(--Ga0) !important;
      .i-pin-v.be-tab {
        border-bottom: 1px solid var(--Ga0) !important;
      }
      .clearfix:after{
        display:none;
      }
      .section{
        border-bottom: 1px solid var(--Ga0) !important;
      }
      .section-title {
        color: var(--Ga7) !important;
      }
      .title {
        color: var(--Ga7) !important;
      }
      .section.fav {
        .section-title{
          color: var(--Ga7) !important;
        }
        .fav-covers {
          border: 1px solid var(--Ga0) !important;
        }
        .name {
          color: var(--Ga7) !important;
        }
      }
      .section.bangumi {
        .desc {
          color: var(--Ga8) !important;
        }
      }
      .section.bangumi.section-title {
        color: var(--Ga7) !important;
        .b-img {
          background: var(--Ga0) !important;
        }
      }
      .channel-item {
        border-bottom: 1px solid var(--Ga0) !important;
      }
    }
    .col-2 {
      background: var(--Ga0) !important;
      .section{
        background: var(--Ga0) !important;
        border: 1px solid var(--Ga0) !important;
      }
      .elec.elec-action {
        display: none !important;
      }
      .i-m-r2 {
        border: 1px solid var(--Ga0) !important;
      }
      .section-title {
        border-bottom: 1px solid var(--Ga0) !important;
      }
    }
  `);
}

/* 消息中心 */
if (location.href.startsWith("https://message.bilibili.com/")) {
  GM_addStyle(`
    :root {
      --Wh0: #242424 !important;
      --Ga0: #333333 !important;
      border: 1px solid var(--Ga0) !important;
    }

  // 移除背景图片
  const bg = document.querySelector(".background");
  if (bg) {
    bg.remove();
  }
     /* 全局背景颜色 */
     * {
       background-color: transparent !important;
     }
    /* 消息 */
    .space-right{
      background-color: var(--Ga0) !important;
      border: 1px solid var(--Ga0) !important;
    }
    .space-right-top{
      background-color: var(--Ga0) !important;
      .title{
        background-color: var(--Ga0) !important;
      }
    }
    .space-right-bottom.ps {
      background-color: var(--Ga0) !important;
     }

     /* 我的消息 */
     .bili-im {
       background-color: var(--Ga0) !important;
       .title {
       border-bottom: 1px solid var(--Ga0) !important;
       }
     }
     .router-view {
       background-color: var(--Ga0) !important;
       border: 1px solid var(--Ga0) !important;
       .left {
        .list-container.ps {
          background-color: var(--Ga0) !important;
          .list-item.active {
            background-color: var(--Ga2) !important;
          }
        }
        border-right: border: 1px solid var(--Ga10) !important;
       }
       .right {
         .message-list{
           background-color: var(--Ga0) !important;
           .msg-notify {
             background-color: var(--Ga12) !important;
             .title{
               color:var(--Ga7) !important;
             }
             .content{
               color:var(--Ga7) !important;
             }
             .detail {
               color:var(--Ga10) !important;
             }
             .link {
               color:var(--Ga10) !important;
             }
           }
           .message-content{
             background-color:var(--Ga12) !important;
             color: var(--Ga7) !important;
           }
         }
       }
     }

     /* 回复我的 */
    .card.reply-card {
      background-color: var(--Ga0) !important;
      .divider {
        border-bottom: 1px solid var(--Ga0) !important;
      }
     }
     .name-field {
      color: var(--Ga5) !important;
     }
     .real-reply {
      color: var(--Ga7) !important;
     }

     /* @ 我的 */
     .divided-line {
       border-top-color: var(--Ga1) !important;
}
     .card.at-card {
       background-color: var(--Ga0) !important;
       .at-item::after {
         border-bottom: 1px solid var(--Ga0) !important;
       }
                    }
     .name-field {
       color: var(--Ga5) !important;
     }
     .real-at {
       color: var(--Ga7) !important;
     }

     /* 收到的赞 */
     .card.love-card {
       background-color: var(--Ga0) !important;
      .love-item::after {
        border-bottom: 1px solid var(--Ga0) !important;
      }
     }
     .name-field {
       color: var(--Ga5) !important;
     }
     .desc-field.like-item {
       color: var(--Ga7) !important;
     }
     .love-detail {
       background-color: var(--Ga0) !important;
       .card.detail{
         background-color: var(--Ga0) !important;
         .text.content.active{
           color: var(--Ga5) !important
         }
       }
       .card.like-list{
         background-color: var(--Ga0) !important;
         .liked-user {
           .follow-btn.active{
             background-color: var(--Ga0) !important;
             border-top-color: var(--Lb5) !important;
             border-left-color: var(--Lb5) !important;
             border-right-color: var(--Lb5) !important;
             border-bottom-color: var(--Lb5) !important;
           }
         }
         .liked-user::after {
         border-bottom: 1px solid var(--Ga0) !important;
         }
        }
     }

    /* 消息列表 */
    .space-left {
      background-color: var(--Ga0) !important;
      border: 1px solid #333333 !important;
    }

    /* 消息列表背景 */
    .sidebar {
      background-color: var(--Ga0) !important;
    }

    /* 消息头部背景 */
    .space-right-top {
      background-color: var(--Ga0) !important;
      border: 1px solid var(--Ga0) !important;
    }

    /* 系统通知 */
    .card.system-item.im-fade-in-enter-to{
      .title {
        color:var(--Ga7) !important;
      }
    }
    .card.system-item{
      .title {
        color:var(--Ga7) !important;
      }
    }
    /* 消息设置 */
    .config {
      background-color: var(--Ga0) !important;
      .text {
        color: var(--Ga7) !important;
        .tip {
          color: var(--Ga12) !important;
        }
      }
      .config-item::before {
        background: var(--Ga0) !important;
        color: var(--Ga7) !important;
      }
      .radio-selector {
        color: var(--Ga7) !important;
      }
    }
  `);
}