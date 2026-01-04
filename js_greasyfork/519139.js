// ==UserScript==
// @name         Wider-Bilibili
// @namespace    https://greasyfork.org/zh-CN/users/863179
// @version      0.4.99
// @author       posthumz
// @description  哔哩哔哩宽屏体验,fork from [474507]
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @supportURL   https://github.com/posthumz/wider-bilibili/issues
// @match        http*://*.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-start
// @compatible   firefox 117+
// @compatible   chrome 120+
// @compatible   edge 120+
// @compatible   safari 17.2+ (理论上，实际未经测试)
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/519139/Wider-Bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/519139/Wider-Bilibili.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const styles = {
    video: `/* 播放器 */
:root {
  --navbar-height: 64px;
  --player-height: 100vh;
}

/* 播放器定位 */
#playerWrap.player-wrap,
#bilibili-player-wrap {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: auto;
  /* 番剧页加载时播放器会有右填充 */
  padding-right: 0;
}

#bilibili-player {
  /* 播放器适应宽高 */
  height: auto !important;
  width: auto !important;
  box-shadow: none !important;

  .bpx-player-container {
    box-shadow: none;
  }

  /* Bilibili Evolved 夜间模式样式的优先级很高，所以嵌套在#bilibili-player里面 */
  .bpx-player-video-info {
    color: hsla(0, 0%, 100%, .9) !important;
    margin-right: 10px;
    /* 某些页面莫名其妙加了width */
    width: initial !important;
  }

  .bpx-player-video-btn-dm,
  .bpx-player-dm-setting,
  .bpx-player-dm-switch {
    fill: hsla(0, 0%, 100%, .9) !important;
  }

  .bpx-player-dm-hint>a {
    color: hsla(0, 0%, 100%, .6) !important;
    fill: hsla(0, 0%, 100%, .6) !important;
  }
}

/* 限制高度上限100vh */
.bpx-player-video-wrap>video {
  max-height: 100vh;
}

/* 小窗时仍然保持播放器容器高度 */
.bpx-docker:has(>.bpx-player-container[data-screen="mini"]) {
  height: var(--player-height);
}

/* 加载时强制占用全屏 */
.bpx-player-container:not([data-screen="mini"]) .bpx-player-video-area:has(>.bpx-state-loading) video {
  height: 100vh;
}

/* 换源时强制占用全屏 */
.bpx-player-video-wrap>video:not([src]) {
  height: 100vh;
}

/* 这啥？加载时会导致屏幕超出 */
.bpx-player-cmd-dm-wrap {
  position: absolute;
  top: 0;
}

/* 加载动画强制显示 */
.bpx-player-loading-panel-blur {
  display: flex !important;
}

/* 强制显示播放器控件 */
.bpx-player-top-left-title,
.bpx-player-top-left-music,
.bpx-player-top-mask {
  display: block !important;
}

/* 不然会鬼畜 */
.bpx-player-top-mask {
  transition-property: none !important;
}

/* 原弹幕发送区域不显示 */
.bpx-player-sending-area {
  display: none;
}

/* 原宽屏/网页全屏按钮不显示 */
.bpx-player-ctrl-wide,
.bpx-player-ctrl-web {
  display: none;
}

/* 以防窗口过窄 */
#app {
  width: 100%;
  min-width: 10vw;
}

/* 导航栏 */
#biliMainHeader {
  height: auto !important;
  margin-top: var(--player-height);
  margin-bottom: 0;
  position: initial;
  visibility: initial !important;

  >.bili-header.fixed-header {
    min-height: initial !important;
    min-width: initial !important;

    >.bili-header__bar {
      height: var(--navbar-height);
      position: relative !important;
    }
  }

  /* BiliBili Evolved自定义顶栏加载前，强制显示原生顶栏 */
  &:not(:has(>.custom-navbar)) .bili-header__bar {
    display: flex !important;
  }

  /* 自定义顶栏加载后 */
  >.custom-navbar {
    position: relative;
    z-index: 3 !important;
  }
}

/* 自定义顶栏加载前 */
body>.custom-navbar {
  z-index: 0 !important;
}

/* 使用 static 才能让播放器的 absolute 正确定位 */
/* 视频、番剧、收藏/稍后再看页 */
.video-container-v1,
.left-container,
.main-container,
.playlist-container--left {
  position: static !important;
}

/* 视频页、番剧页、收藏/稍后再看页的下方容器 */
.video-container-v1,
.main-container,
.playlist-container {
  padding: 0 var(--layout-padding) !important;
  min-width: initial !important;
}

.left-container,
.plp-l,
.playlist-container--left {
  flex: 1;
}

.plp-r {
  /* 番剧页加载时不会先使用sticky */
  position: sticky !important;
  padding-top: 0 !important;
}

/* 以防播放器挡住一些浮窗 */
.playlist-container--left,
.bilibili-player-wrap {
  z-index: 1 !important;
}

/* 番剧页下方容器 */
.main-container {
  width: auto !important;
  box-sizing: border-box;
  display: flex;

  /* 番剧页弹窗 */
  >:nth-last-child(2)[class^=dialogcoin_coin_dialog_mask] {
    z-index: 100001;
  }

  /* 右下方浮动按钮位置 */
  >:last-child[class^=navTools_floatNavExp] {
    z-index: 2 !important;
  }
}

/* 特殊页面 */
.special .main-container {
  margin-top: 0;
}

.special>.special-cover {
  max-height: calc(var(--player-height) + var(--navbar-height));
}

.player-left-components {
  padding-right: 30px !important;
}

.toolbar {
  padding-top: 0;
}

/* 视频标题自动高度 */
#viewbox_report,
.video-info-container {
  height: auto;
}

/* 视频标题换行显示 */
.video-title {
  white-space: normal !important;
}

/* bgm浮窗 */
#bgm-entry {
  z-index: 114514 !important;
  left: 0 !important;
}

/* 笔记浮窗 */
.note-pc {
  z-index: 114514 !important;
}

.fixed-sidenav-storage {
  z-index: initial !important;
}

/* Bilibili Evolved侧栏 */
.be-settings .sidebar {
  z-index: 114514 !important;
}`,
    t: `#app {

  /* 单个动态 */
  >.bg+.content {
    width: auto;
    margin: 10px 0;

    >.card {
      margin: 0 var(--layout-padding)
    }

    >.sidebar-wrap {
      right: 58px;
      margin-right: var(--layout-padding);
    }
  }

  /* 动态页 */
  >[class^=bili-dyn-home] {
    margin: 0 var(--layout-padding);

    .left {
      .bili-dyn-live-users {
        margin-bottom: 10px;
        position: initial !important;
        transform: none !important;
      }
    }

    .right {
      width: initial;

      .bili-dyn-banner {
        display: none;
      }

      .bili-dyn-topic-box {
        transform: none !important;
      }
    }

    main {
      flex: 1
    }

    .bili-dyn-sidebar {
      right: var(--layout-padding);
      transform: none;
    }
  }
}`,
    space: `/* 空间页 */
#app {
  margin: 0 var(--layout-padding);
  min-width: 1120px;
}

#biliMainHeader {
  height: initial !important;
}

div.wrapper,
.search-page {
  width: auto !important;
  margin: 0;
}

/* 主页 */
#page-index {
  >div.col-1 {
    /* 以防不支持round */
    max-width: calc(100% - 400px);
    width: round(down, calc(100% - 400px), 180px);

    .section {
      >.content {
        width: auto;
      }

      /* 投稿、投币、点赞 */
      &.video>.content,
      &.coin>.content,
      .channel-video {
        margin-left: -10px;
        overflow: auto !important;
        scroll-snap-type: both mandatory;

        >.small-item {
          padding: 10px !important;
          scroll-snap-align: start;
        }

        &::after {
          content: none;
        }
      }

      /* 收藏 */
      &.fav>.content {
        margin-top: -14px;
        margin-left: -10px;

        >.fav-item {
          margin: 14px 10px;
        }
      }

      /* 番剧 */
      &.bangumi>.content>.large-item {
        margin-right: 0;
      }
    }

    .article-content {
      width: calc(100% - 135px);
    }
  }
}

/* 动态 */
#page-dynamic>div.col-1 {
  width: calc(100% - 360px);
}

/* 投稿, 搜索 */
#page-video {
  width: 100% !important;

  >.col-full {
    display: flex;

    >.main-content {
      flex: 1;

      .cube-list {
        width: auto !important;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  }
}

/* 合集 */
.channel-index {
  width: auto !important;

  .channel-list {
    gap: 20px;

    &::before,
    &::after {
      content: none;
    }

    .channel-item {
      margin: 0 !important;
    }
  }
}

/* 收藏夹, 关注 */
#page-fav,
#page-follows {
  .col-full {
    display: flex !important;

    .fav-main,
    .follow-main {
      flex: 1;
    }
  }

  .fav-content>.fav-video-list {
    margin: 10px;

    >.small-item {
      margin: 10px !important;
    }
  }
}

/* 追番 */
#page-bangumi,
#page-pgc {
  .section>.content {
    width: initial;

    .pgc-space-follow-page {
      padding-left: 0;
    }
  }
}`,
    search: `/* 搜索页 */
.i_wrapper {
  padding: 0 var(--layout-padding) !important;
}`,
    read: `/* 阅读页 */
#app {
  margin: 0 var(--layout-padding);

  >.article-detail {
    width: auto;

    .article-up-info {
      width: auto;
      margin: 0 80px 20px;
    }

    .right-side-bar {
      right: 0;
    }
  }
}`,
    opus: `div.opus-detail {
  width: initial;
  margin: 0 var(--layout-padding);
}

.right-sidebar-wrap {
  margin-left: 0;
  right: 0;
}`,
    message: `#message-navbar {
  display: none;
}

.container {
  max-width: initial !important;
  width: auto !important;
}

.space-right-top {
  padding-top: 0 !important;
}`,
    home: `/* 首页 */
.feed-card,
.floor-single-card,
.bili-video-card {
  margin-top: 0px !important;
}

.palette-button-wrap {
  left: initial !important;
  right: 30px;
}`,
    common: `/* This overrides :root style */
html {
  --layout-padding: 30px;
}

/* 搜索栏 */
.center-search-container {
  min-width: 0;
}

/* 兼容性检测 */
.wb-button-group::before {
  content: '内核版本不完全适配脚本，请考虑升级浏览器';
  color: red;
}

/* 脚本选项 */
#wider-bilibili {
  --wb-bg: var(--Wh0, #FFF);
  --wb-fg: var(--Ga10, #18191C);
  --wb-white: rgb(255, 255, 255);
  --wb-blue: 0, 174, 236;
  --wb-pink: 255, 102, 153;
  --wb-red: 248, 90, 84;

  position: fixed;
  top: 0;
  bottom: 0;
  height: fit-content;
  max-height: 80vh;
  left: 0;
  right: 0;
  width: fit-content;
  max-width: 80vw;
  z-index: 114514;
  padding: 10px;
  border-radius: 10px;
  margin: auto;
  box-sizing: border-box;
  overflow: auto;
  flex-direction: column;
  gap: 10px;

  outline: 2px solid rgba(var(--wb-blue), 0.8);
  outline-offset: 0;
  background-color: var(--wb-bg);
  color: var(--wb-fg);
  font-size: 20px;

  opacity: 0.9;

  &:hover {
    opacity: 1
  }

  >header {
    position: sticky;
    z-index: 2;
    top: -10px;
    display: flex;
    justify-content: space-between;
    margin: -10px;
    background-color: var(--wb-bg);
    font-weight: bold;

    &::before {
      content: "Wider Bilibili 选项";
      align-self: center;
      margin-left: 10px;
      margin-right: auto;
    }
  }

  .wb-button-group {
    display: flex;
    margin-bottom: 10px;

    >* {
      height: 100%;
    }
  }

  div.wb-button-group::before {
    display: none;
  }

  a,
  button {
    border: none;
    padding: 4px;
    background: none;
    color: var(--wb-fg);
    display: flex;
    font-size: 16px;
    text-wrap: nowrap;
    transition: opacity .1s;
    cursor: pointer;

    &:hover {
      opacity: 0.75;
    }

    &:active {
      opacity: 0.5;
    }

    >svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
      fill-rule: evenodd;
      clip-rule: evenodd;
    }
  }

  #wb-close {
    width: fit-content;
    height: fit-content;
    opacity: 1;

    &:hover {
      background-color: rgb(var(--wb-red));
    }

    &:active {
      background-color: rgba(var(--wb-red), 0.75);
    }
  }

  >fieldset {
    border: none;
    border-radius: 10px;
    padding: 10px;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 15px;
    background-color: rgba(127, 127, 127, 0.1);

    &::before {
      content: attr(data-title);
      border-radius: 4px 4px 0 0;
      border-bottom: 2px solid rgba(127, 127, 127, 0.1);
      grid-column: 1 / -1;
    }
  }

  label {
    display: inline-flex;
    gap: 10px;
    place-items: center;
    position: relative;
    text-wrap: nowrap;

    &[data-hint]:hover::before {
      position: absolute;
      bottom: 110%;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: fit-content;
      padding: 3px 5px;
      border-radius: 5px;
      content: attr(data-hint);
      font-size: 12px;
      background-color: rgb(var(--wb-blue));
      color: var(--wb-white);
      white-space: pre-line;
    }
  }

  input {
    box-sizing: content-box;
    margin: 0;
    padding: 4px;
    height: 20px;
    font-size: 16px;
    transition: .2s;

    &:hover {
      box-shadow: 0 0 8px rgb(var(--wb-blue));
    }

    &[type=checkbox] {
      box-sizing: content-box;
      border-radius: 20px;
      min-width: 40px;
      background-color: #ccc;
      appearance: none;
      cursor: pointer;

      &::before {
        content: "";
        position: relative;
        display: block;
        transition: 0.3s;

        height: 100%;
        aspect-ratio: 1/1;
        border-radius: 50%;
        background-color: #FFF;
      }

      &:checked {
        background-color: rgb(var(--wb-blue));
      }

      &:checked::before {
        transform: translateX(20px);
      }

      &:active {
        opacity: 0.5;
      }
    }

    &[type=number] {
      width: 40px;
      border: none;
      border-radius: 5px;
      outline: 2px solid rgb(var(--wb-blue));
      background: none;
      color: var(--wb-fg);
      appearance: textfield;

      &::-webkit-inner-spin-button {
        appearance: none;
      }
    }
  }
}`,
    upperNavigation: `/* 导航栏上置 (默认下置) */
:root {
  --player-height: calc(100vh - var(--navbar-height));
}

#biliMainHeader {
  margin-top: 0;
  margin-bottom: var(--player-height);
  /* 播放器的 z-index 是100000 */
  z-index: 114514;
}


#playerWrap.player-wrap,
#bilibili-player-wrap {
  top: var(--navbar-height);
}

/* 限制高度上限（非全屏时） */
.bpx-player-container:not(:fullscreen) .bpx-player-video-wrap>video {
  max-height: calc(100vh - var(--navbar-height));
}`,
    stickyHeader: `#biliMainHeader {
  position: sticky;
  top: 0;
  /* 其他元素 z-index 基本是<100 */
  z-index: 100;
}`,
    stickyAside: `#app .left {
  height: fit-content;
  position: sticky;
  top: 72px;
}`,
    pauseShowControls: `/* 暂停显示控件 */
.bpx-player-container.bpx-state-paused {

  .bpx-player-top-wrap,
  .bpx-player-control-top,
  .bpx-player-control-bottom,
  .bpx-player-control-mask {
    opacity: 1 !important;
    visibility: visible !important;
  }

  div.bpx-player-shadow-progress-area {
    visibility: hidden !important;
  }

  .bpx-player-pbp {
    bottom: 100% !important;
    margin-bottom: 5px;
    opacity: 1 !important;
    left: 0;
    right: 0;
    width: auto !important;

    .bpx-player-pbp-pin {
      opacity: 1 !important;
    }
  }
}`,
    mini: `/* 小窗 */
.bpx-player-container {
  --mini-width: 320px;
  /* 最小宽度，以防不可见 */
  min-width: 180px;

  &[data-screen="mini"] {
    max-width: var(--mini-width) !important;
    width: auto !important;
    height: auto !important;

    /* 以防竖屏视频超出：留出导航栏高度+16px */
    .bpx-player-video-wrap>video {
      max-height: calc(100vh - 16px - var(--navbar-height));
    }
  }
}

.bpx-player-mini-resizer {
  position: absolute;
  left: 0;
  width: 10px;
  height: 100%;
  cursor: ew-resize;
}`,
    hideControls: `.bpx-player-control-mask,
.bpx-player-control-top,
.bpx-player-control-bottom,
.bpx-player-pbp {
  opacity: 0 !important;
}

.bpx-player-top-wrap:hover {
  opacity: 1 !important;
}

.bpx-player-control-wrap:not(:hover) {
  .bpx-player-shadow-progress-area {
    opacity: 1 !important;
    visibility: visible !important;
  }
}

.bpx-player-control-wrap:hover {

  .bpx-player-control-mask,
  .bpx-player-control-top,
  .bpx-player-control-bottom,
  .bpx-player-pbp {
    opacity: 1 !important;
  }
}`,
    fixHeight: `.bpx-player-container:not([data-screen="mini"]) .bpx-player-video-wrap>video {
  height: 100vh;
}`,
    compactControls: `/* 播放器控件 */
.bpx-player-control-bottom {
  padding: 0 20px !important;
}

.bpx-player-control-bottom>* {
  flex: initial !important;
}

/* 控件区域 */
.bpx-player-control-bottom-left,
.bpx-player-control-bottom-right {
  min-width: initial !important;
  gap: 8px;
}

/* Bilibili Evolved 自定义控件区域 */
.bpx-player-control-bottom-left>.be-video-control-bar-extend {
  gap: 8px;
}

/* 减少中间填充空间 */
.bpx-player-control-bottom-center {
  flex: 1 !important;
  padding: 0 20px !important;
}

/* 防止选集/倍速按钮错位 */
.bpx-player-control-bottom-right>.bpx-player-ctrl-btn:hover {
  padding: 0;
}

/* 所有按钮控件 */
.bpx-player-ctrl-btn {
  margin: 0 !important;
  width: fit-content !important;
}

.bpx-player-ctrl-time {
  width: 130px !important;
}

/* 时间控件 */
.bpx-player-ctrl-time-seek {
  width: 100% !important;
  padding: 0 !important;
  left: 0 !important;
}

.bpx-player-ctrl-time-label {
  text-align: center !important;
  text-indent: 0 !important;
}

/* 弹幕发送框区域 */
.bpx-player-sending-bar {
  background-color: transparent !important;
  max-width: 90% !important;
}

.bpx-player-video-inputbar {
  max-width: initial !important;
}

.bpx-player-video-inputbar-wrap {
  width: auto;
}`
  };
  const waitFor = (loaded, desc = "页面加载", retry = 100, interval = 100) => new Promise((resolve, reject) => {
    const intervalID = setInterval((res = loaded()) => {
      if (res) {
        clearInterval(intervalID);
        console.info(`${desc}已加载`);
        return resolve(res);
      }
      if (--retry === 0) {
        clearInterval(intervalID);
        return reject(new Error(`${desc}加载超时`));
      }
      if (retry % 10 === 0) {
        console.debug(`${desc}等待加载`);
      }
    }, interval);
  });
  const observeFor = (className, parent) => new Promise((resolve) => {
    const elem = parent.getElementsByClassName(className)[0];
    if (elem) {
      return resolve(elem);
    }
    new MutationObserver((mutations, observer) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element && node.classList.contains(className)) {
            observer.disconnect();
            return resolve(node);
          }
        }
      }
    }).observe(parent, { childList: true });
  });
  const waitReady = () => new Promise((resolve) => {
    document.readyState === "loading" ? window.addEventListener("DOMContentLoaded", () => resolve(), { once: true }) : resolve();
  });
  const html = `<div id="wider-bilibili" style="display: none;">
  <header>
    <div class="wb-button-group">
      <a target="_blank" href="//greasyfork.org/scripts/474507">
        <svg viewBox="0 0 96 96" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <!-- Based on https://github.com/denilsonsa/denilsonsa.github.io -->
          <circle fill="#000" r="48" cy="48" cx="48"/>
          <path fill="#000" stroke="#000" stroke-width="4" d="M 44,29  a6.36396,6.36396 0,0,1 0,9  l36,36  a3.25,3.25 0,0,1 -6.5,6.5  l-36,-36  a6.36396,6.36396 0,0,1 -9,0  l-19,-19  a1.76777,1.76777 0,0,1 0,-2.5  l13.0,-13  a1.76777,1.76777 0,0,1 2.5,0  z"/>
          <path fill="#fff" d="M 44,29  a6.36396,6.36396 0,0,1 0,9  l36,36  a3.25,3.25 0,0,1 -6.5,6.5  l-36,-36  a6.36396,6.36396 0,0,1 -9,0  l-19,-19  a1.76777,1.76777 0,0,1 2.5,-2.5  l14,14 4,-4 -14,-14  a1.76777,1.76777 0,0,1 2.5,-2.5  l14,14 4,-4 -14,-14  a1.76777,1.76777 0,0,1 2.5,-2.5  z"/>
        </svg>
      </a>
      <a target="_blank" href="//github.com/posthumz/wider-bilibili">
        <!-- From https://www.radix-ui.com/icons -->
        <svg viewBox="0 0 15 15"  width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"></path>
        </svg>
      </a>
      <button id="wb-close">
        <!-- From https://www.radix-ui.com/icons -->
        <svg viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"></path>
        </svg>
      </button>
    </div>
  </header>
  <fieldset data-title="通用">
    <label><input type="number" min="0">左右边距</label>
  </fieldset>
  <fieldset data-title="播放页">
    <label data-hint="播放器无上下黑边"><input type="checkbox">自动高度</label>
    <!--
    <label data-hint="试试拉一下小窗左侧？&#10;记录小窗宽度与位置"><input type="checkbox">小窗样式</label>
    -->
    <label><input type="checkbox">导航栏下置</label>
    <label><input type="checkbox">粘性导航栏</label>
    <label><input type="checkbox">紧凑控件间距</label>
    <label data-hint="默认检测到鼠标活动显示控件&#10;需要一直显示请打开此选项"><input type="checkbox">暂停显示控件</label>
    <label data-hint="在线人数/弹幕数"><input type="checkbox">显示观看信息</label>
    <label data-hint="默认隐藏控件区&#10;悬浮到相应位置以显示"><input type="checkbox">隐藏控件</label>
  </fieldset>
  <!--
  <fieldset data-title="动态页">
    <label data-hint="可能导致侧栏显示不全"><input type="checkbox">粘性侧栏</label>
  </fieldset>
  -->
</div>`;
  function styleToggle(s, init = true, flip = false) {
    if (flip) {
      init = !init;
    }
    const style = GM_addStyle(s);
    if (!init) {
      style.disabled = true;
    }
    return flip ? (enable) => {
      style.disabled = enable;
    } : (enable) => {
      style.disabled = !enable;
    };
  }
  function onStyleValueChange(toggle) {
    return (_k, _o, newVal) => toggle(newVal);
  }
  const commonOptions = {
    左右边距: {
      default_: 50,
      callback: (init) => {
        document.documentElement.style.setProperty("--layout-padding", `${init}px`);
        return (_k, _o, newVal) => document.documentElement.style.setProperty("--layout-padding", `${newVal || 30}px`);
      }
    }
  };
  const videoOptions = {
    自动高度: {
      // 也就是说，不会有上下黑边
      default_: true,
      callback: (init) => {
        const container = document.getElementsByClassName("bpx-player-container")[0];
        const observer = new ResizeObserver((entries) => {
          const { height } = entries[0].contentRect;
          if (container.dataset.screen === "mini") return;
          if (height < window.innerHeight && height)
            document.documentElement.style.setProperty("--player-height", `${height}px`);
          else
            document.documentElement.style.removeProperty("--player-height");
        });
        const toggle = styleToggle(styles.fixHeight, init, true);
        init && observer.observe(container);
        return onStyleValueChange((enable) => {
          toggle(enable);
          enable ? observer.observe(container) : observer.disconnect(), document.documentElement.style.removeProperty("--player-height");
        });
      }
    },
    小窗样式: {
      default_: false,
      callback: (init) => {
        const toggle1 = styleToggle(styles.mini, init);
        const toggle2 = styleToggle(".bpx-player-container{--mini-width:initial}", init, true);
        return onStyleValueChange((enable) => (toggle1(enable), toggle2(enable)));
      }
    },
    导航栏下置: {
      default_: true,
      callback: (init) => onStyleValueChange(styleToggle(styles.upperNavigation, init, true))
    },
    粘性导航栏: {
      default_: true,
      callback: (init) => onStyleValueChange(styleToggle(styles.stickyHeader, init))
    },
    紧凑控件间距: {
      default_: true,
      callback: (init) => onStyleValueChange(styleToggle(styles.compactControls, init))
    },
    暂停显示控件: {
      default_: true,
      callback: (init) => onStyleValueChange(styleToggle(styles.pauseShowControls, init))
    },
    显示观看信息: {
      default_: true,
      callback: (init) => onStyleValueChange(styleToggle(".bpx-player-video-info{display:flex!important}", init))
    },
    隐藏控件: {
      default_: true,
      callback: (init) => onStyleValueChange(styleToggle(styles.hideControls, init))
    }
  };
  const timelineOptions = {
    粘性侧栏: {
      default_: false,
      callback: (init) => onStyleValueChange(styleToggle(styles.stickyAside, init))
    }
  };
  function listenOptions(options) {
    for (const [name, { default_, callback }] of Object.entries(options))
      GM_addValueChangeListener(name, callback(GM_getValue(name, default_)));
  }
  const optionsFlat = { ...commonOptions, ...videoOptions, ...timelineOptions };
  waitReady().then(() => {
    document.body.insertAdjacentHTML("beforeend", html);
    const app = document.getElementById("wider-bilibili");
    GM_registerMenuCommand("选项", () => {
      app.style.display = "flex";
    });
    document.getElementById("wb-close")?.addEventListener("click", () => {
      app.style.display = "none";
    });
    const modifiers = ["ctrlKey", "altKey", "shiftKey", "metaKey"];
    const comb = [["altKey", "shiftKey"], "W"];
    (function addListener() {
      document.addEventListener("keydown", (ev) => {
        const { key } = ev;
        if (key === comb[1] && modifiers.every((mod) => comb[0].includes(mod) === ev[mod])) {
          ev.stopImmediatePropagation();
          ev.stopPropagation();
          app.style.display = app.style.display === "none" ? "flex" : "none";
        }
        setTimeout(addListener, 250);
      }, { once: true });
    })();
    for (const input of app.getElementsByTagName("input")) {
      const key = input.parentElement?.textContent;
      if (!key) {
        continue;
      }
      const option = optionsFlat[key];
      if (!option) {
        continue;
      }
      switch (input.type) {
        case "checkbox":
          input.checked = GM_getValue(key, option.default_);
          input.onchange = () => GM_setValue(key, input.checked);
          break;
        case "number":
          input.value = GM_getValue(key, option.default_);
          input.oninput = () => {
            const val = Number(input.value);
            Number.isInteger(val) && GM_setValue(key, val);
          };
          break;
      }
    }
    listenOptions(commonOptions);
  }).catch(console.error);
  GM_addStyle(styles.common);
  const url = new URL(window.location.href);
  switch (url.host) {
    case "www.bilibili.com": {
      if (url.pathname === "/") {
        GM_addStyle(styles.home);
        console.info("使用首页宽屏样式");
        break;
      }
      if (url.pathname.startsWith("/read")) {
        GM_addStyle(styles.read);
        console.info("使用阅读页宽屏样式");
        break;
      }
      if (url.pathname.startsWith("/opus")) {
        GM_addStyle(styles.opus);
        break;
      }
      const style = GM_addStyle(styles.video);
      await( waitReady());
      const player = document.getElementById("bilibili-player");
      if (!player) {
        style.remove();
        break;
      }
      const container = await( waitFor(() => player.getElementsByClassName("bpx-player-container")[0], "播放器内容器"));
      listenOptions(videoOptions);
      if (container.getAttribute("data-screen") !== "mini") {
        container.setAttribute("data-screen", "web");
      }
      container.setAttribute = new Proxy(container.setAttribute.bind(container), {
        apply: (target, thisArg, [name, val]) => target.apply(thisArg, [name, name === "data-screen" && val !== "mini" ? "web" : val])
      });
      container.style.setProperty("--mini-width", `${GM_getValue("小窗宽度", 320)}px`);
      GM_addValueChangeListener("小窗宽度", (_k, _o, newVal) => container.style.setProperty("--mini-width", `${newVal}px`));
      GM_addStyle(`.bpx-player-container[data-screen="mini"] {
        translate: ${84 - GM_getValue("小窗右", 52)}px ${48 - GM_getValue("小窗下", 8)}px;
      }`);
      new MutationObserver(() => {
        if (container.dataset.screen != "mini") return;
        if (container.style.right === "84px" && container.style.bottom === "48px") return;
        const { right, bottom } = container.getBoundingClientRect();
        GM_setValue("小窗右", Math.round(window.innerWidth - right));
        GM_setValue("小窗下", Math.round(window.innerHeight - bottom));
      }).observe(container, { attributes: true, attributeFilter: ["style"] });
      const miniResizer = document.createElement("div");
      miniResizer.className = "bpx-player-mini-resizer";
      miniResizer.onmousedown = (ev) => {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        const resize = (ev2) => {
          const miniWidth = Math.max(container.offsetWidth + container.getBoundingClientRect().x - ev2.x + 5, 0);
          GM_setValue("小窗宽度", Math.round(miniWidth));
        };
        if (ev.button !== 0) return;
        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", () => document.removeEventListener("mousemove", resize), { once: true });
      };
      const videoArea = container.getElementsByClassName("bpx-player-video-area")[0];
      if (!videoArea) {
        console.error("页面加载错误：视频区域不存在");
        break;
      }
      observeFor("bpx-player-mini-warp", videoArea).then((wrap) => wrap.appendChild(miniResizer)).catch(console.error);
      const sendingBar = player.getElementsByClassName("bpx-player-sending-bar")[0];
      if (!sendingBar) {
        console.error("页面加载错误：发送框不存在");
        break;
      }
      const danmaku = (await( observeFor("bpx-player-video-info", sendingBar))).parentElement;
      const bottomCenter = container.getElementsByClassName("bpx-player-control-bottom-center")[0];
      if (!bottomCenter || !danmaku) {
        console.error("页面加载错误：弹幕框不存在");
        break;
      }
      document.addEventListener("fullscreenchange", () => document.fullscreenElement || bottomCenter.replaceChildren(danmaku));
      bottomCenter.replaceChildren(danmaku);
      const header = document.getElementById("biliMainHeader");
      await( waitFor(() => document.getElementById("nav-searchform"), "搜索框").then(() => {
        observeFor("custom-navbar", document.body).then((nav) => header?.append(nav)).catch(console.error);
      }));
      console.info("宽屏模式成功启用");
      break;
    }
    case "t.bilibili.com":
      GM_addStyle(styles.t);
      listenOptions(timelineOptions);
      waitFor(() => document.getElementsByClassName("right")[0], "右侧栏").then((right) => {
        const left = document.getElementsByClassName("left")[0];
        left.appendChild(right);
      }).catch(console.error);
      console.info("使用动态样式");
      break;
    case "space.bilibili.com":
      GM_addStyle(styles.space);
      console.info("使用空间样式");
      break;
    case "message.bilibili.com":
      GM_addStyle(styles.message);
      console.info("使用通知样式");
      break;
    case "search.bilibili.com":
      GM_addStyle(styles.search);
      console.info("使用搜索页样式");
      break;
    default:
      console.info(`未适配页面，仅启用通用样式: ${url.href}`);
      break;
  }
})();