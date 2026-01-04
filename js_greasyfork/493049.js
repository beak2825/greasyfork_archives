// ==UserScript==
// @name        bilibili-dark-theme
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/*
// @match       https://t.bilibili.com/*
// @match       https://search.bilibili.com/*
// @match       https://space.bilibili.com/*
// @match       https://live.bilibili.com/*
// @run-at      document-idle
// @grant       GM_addStyle
// @version     1.2.5
// @author      mesimpler
// @license     MIT
// @description 提供b站黑夜模式。(drak mode with bilibili.)
// @downloadURL https://update.greasyfork.org/scripts/493049/bilibili-dark-theme.user.js
// @updateURL https://update.greasyfork.org/scripts/493049/bilibili-dark-theme.meta.js
// ==/UserScript==

GM_addStyle(`
  :root {
    color-scheme: dark;

    --Lb5: #0087b7 !important;
    --Wh0: #242424 !important;
    --Ga0: #333333 !important;
    --Ga0_s: #333333 !important;
    --Ga1: #1c1c1c !important;
    --Ga1_s: #333333 !important;
    --Ga2: #484848 !important;
    --Ga7: #a4a4a4 !important;
    --Ga9: #a1a1a1 !important;
    --Ga10: #d1d1d1 !important;
    --Ga11: #333333 !important;
    --Ga12: #4a4a4a !important;
    --Ga13_s: #3d3e3e !important;

    /* 评论加载遮罩 */
    --Wh0_rgb: 61, 61, 61;

    /* 回复框*/
    .reply-box-warp {
      border: 1px solid #626262 !important;
    }

    /* 弹幕输入框 */ 
    .bpx-player-video-inputbar-wrap {
      background: #333333;
    }
  
    /* 标题栏阴影 */
    .mini-header {
      box-shadow: none;
      border-bottom: 1px solid #484848;
    }
  }
`);

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
 
    /* 背景遮罩 */
    .bgc {
      background-color: var(--Ga1) !important;
    }
 
    /* 动态UP名字 */
    .bili-dyn-up-list__item__name {
      color: var(--Ga5) !important;
    }

    /* 直播预约卡片 */
    .bili-dyn-card-reserve__card {
      background-color: var(--Ga0) !important;
    }
 
    /* 推荐视频商品卡片 */
    .bili-dyn-card-ugc__wrap,
    .bili-dyn-card-goods__wrap {
      background-color: var(--Ga1) !important;
    }
  `);
}

/* 稍后再看画中画 */
documentPictureInPicture.addEventListener("enter", (event) => {
  const pipWindow = event.window;
  pipWindow.document.documentElement.style.backgroundColor = "#242424";
  const style = GM_addStyle(`
    :root {
      --Ga11: #333333 !important;
      --Ga10: #d1d1d1 !important;
      --Ga13_s: #3d3e3e !important;
      --Ga2: #484848 !important;
      --Lb5: #0087b7 !important;
    }

    body {
      background-color: var(--Ga11)
    }
  `)

  // 将样式添加到画中画窗口的head中
  pipWindow.document.head.appendChild(style);
});