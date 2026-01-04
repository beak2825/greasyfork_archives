// ==UserScript==
// @name         Wider Bilibili
// @namespace    https://greasyfork.org/users/1125570
// @version      0.4.8
// @author       posthumz
// @description  哔哩哔哩宽屏体验
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @supportURL   https://github.com/posthumz/wider-bilibili/issues
// @match        http*://*.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_deleteValue
// @grant        GM_deleteValues
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-start
// @compatible   firefox 117+
// @compatible   chrome 120+
// @compatible   edge 120+
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/474507/Wider%20Bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/474507/Wider%20Bilibili.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const styles = {
    video: `/* 播放器 */
:root {
  --upper-nav: 0;
  --reserve-height-input: calc(var(--upper-nav) * var(--navbar-height));
  --reserve-height: calc(min(var(--reserve-height-input), 25vh));
  /* 播放器高度 = 100vh - 预留高度 */
  --player-height: calc(100vh - var(--reserve-height));
  --player-height-record: var(--player-height);
}

#biliMainHeader {
  margin-top: var(--player-height-record);

  /* BiliBili Evolved自定义顶栏加载前，强制显示原生顶栏 */
  &:not(:has(>.custom-navbar)) .bili-header__bar {
    display: flex !important;
  }
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
    width: auto !important;
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

/* 播放器高度 */
.bpx-player-container:not(:fullscreen) .bpx-player-video-wrap>video {
  max-height: var(--player-height);
}

/* 小窗时仍然保持播放器容器高度 */
.bpx-docker:has(>.bpx-player-container[data-screen="mini"]) {
  height: var(--player-height--record);
}

/* 加载时 */
.bpx-player-container:not([data-screen="mini"]) .bpx-player-video-area:has(>.bpx-state-loading) video,
/* 换源时 */
.bpx-player-video-wrap>video:not([src]) {
  /* 宽高比不详，强制占用最大可用高度 */
  height: 100vh;
}

/* 这啥？加载时会导致屏幕超出 */
.bpx-player-cmd-dm-wrap {
  position: absolute;
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
.bpx-player-sending-area,
/* 原宽屏/网页全屏按钮不显示 */
.bpx-player-ctrl-wide,
.bpx-player-ctrl-web {
  display: none;
}

/* 以防窗口过窄 */
#app {
  width: 100vw !important;
  max-width: 100% !important;
}

/* 自定义顶栏加载前 */
body>.custom-navbar {
  z-index: 0 !important;
}

/* 自定义顶栏弹出菜单样式修复 */
.custom-navbar .popup[data-popper-placement="top"] {
  inset: auto auto var(--navbar-height) 0 !important;
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
  max-width: none !important;
  min-width: auto !important;
}

.left-container,
.plp-l,
.playlist-container--left {
  flex: 1;
  width: auto;
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
.special {
  >.special-cover {
    max-height: var(--player-height);
  }

  .main-container {
    margin-top: 0 !important;
  }
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
    space: `/* 新版空间页 */
#app .space-main,
.nav-bar__main,
.header .header-upinfo {
  --side-padding: var(--layout-padding) !important;
}

/* 空间页 */
#app,
.header-upinfo,
.nav-bar__main,
.space-main,
.bili-dyn-list {
  max-width: none !important;
}

#app {
  margin: 0 var(--layout-padding);
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
    panel: `/* popover兼容性检测 */
@supports not (selector(:popover-open)) {
  .wb-button-group::before {
    content: '浏览器内核版本不完全适配脚本，请考虑升级';
    color: red;
  }
}

.wb-button-group::before {
  /* CSS Nesting兼容性检测 */
  content: '浏览器内核版本不完全适配脚本，请考虑升级';
  color: red;
}

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

  border: 2px solid rgba(var(--wb-blue), 0.8);
  background-color: var(--wb-bg);
  color: var(--wb-fg);
  font-size: 20px;

  opacity: 0.9;

  &:popover-open {
    display: flex;
  }

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
  #wb-close {
    padding: 4px;
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
    border-radius: 0;
    outline: none;
    box-shadow: none;

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
      content: attr(name);
      border-radius: 4px 4px 0 0;
      border-bottom: 2px solid rgba(127, 127, 127, 0.1);
      grid-column: 1 / -1;
    }

  }

  [data-option]::after {
    content: attr(data-option);
    text-wrap: nowrap;
  }

  [data-hint]:hover::before {
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

  label {
    display: inline-flex;
    gap: 10px;
    place-items: center;
    position: relative;
  }

  input,
  button {
    box-sizing: content-box;
    margin: 0;
    padding: 4px;
    height: 20px;
    font-size: 16px;
    line-height: 1;
    transition: .2s;

    &:hover {
      box-shadow: 0 0 8px rgb(var(--wb-blue));
    }

    &:active {
      opacity: 0.5;
    }
  }

  input {
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

  button {
    border: none;
    background: none;
    border-radius: 5px;
    outline: 1px solid #C9CCD0;

    &:hover {
      outline: 2px solid rgb(var(--wb-blue));
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
  max-width: none !important;
  width: auto !important;
}

.space-right-top {
  padding-top: 0 !important;
}`,
    home: `/* 首页 */
div#i_cecream {
  max-width: none;
}

.feed-roll-btn {
  left: initial !important;
  right: 0 !important;
  /* at most 10px away from container; at least 10px away from page */
  transform: translateX(min(calc(var(--layout-padding) - 10px), calc(100% + 10px))) !important;

  .roll-btn {
    aspect-ratio: 1/1;

    >span {
      display: none
    }

    >svg {
      margin-bottom: 0 !important;
    }
  }
}

.feed-card,
.floor-single-card,
.bili-video-card {
  margin-top: 0 !important;
}`,
    common: `/* This overrides :root style */
html {
  --layout-padding-input: 30px;
  --navbar-height: 64px;
}

body {
  --layout-padding: min(var(--layout-padding-input), 15vw);
}

/* 导航栏 */
#biliMainHeader {
  height: auto !important;
  min-height: var(--navbar-height) !important;
  margin-bottom: 0;
  position: initial;
  visibility: initial !important;

  >.bili-header {
    min-width: auto !important;
    max-width: none !important;
    min-height: auto !important;

    >.bili-header__bar {
      position: relative !important;
      height: var(--navbar-height);
      max-width: none !important;
    }
  }

  /* 自定义顶栏加载后 */
  >.custom-navbar {
    position: relative;
    z-index: 3 !important;
  }
}

/* 搜索栏 */
.center-search-container {
  min-width: 0;
}`,
    upperNavigation: `/* 导航栏上置 (默认下置) */
:root {
  --upper-nav: 1;
}

#biliMainHeader {
  margin-top: 0;
  margin-bottom: var(--player-height-record);
  /* 播放器的 z-index 是100000 */
  z-index: 114514;
}


#playerWrap.player-wrap,
#bilibili-player-wrap {
  top: var(--navbar-height);
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
  min-width: auto !important;
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
  max-width: none !important;
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
    if (elem instanceof HTMLElement) {
      return resolve(elem);
    }
    new MutationObserver((mutations, observer) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement && node.classList.contains(className)) {
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
  const html = `<header>
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
      <svg viewBox="0 0 15 15"  width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"></path></svg>
    </a>
    <button id="wb-close" popovertarget="wider-bilibili">
      <!-- From https://www.radix-ui.com/icons -->
      <svg viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"><path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"></path></svg>
    </button>
  </div>
</header>
<fieldset name="通用">
  <label data-option="左右边距" data-hint="单位px(不会超过15%宽度)"><input type="number" min="0"></label>
</fieldset>
<fieldset name="播放页">
  <label data-option="自动高度" data-hint="播放器无上下黑边"><input type="checkbox"></label>
  <label data-option="预留高度" data-hint="单位px(不会超过25%高度)&#10;>0时强制显示导航栏"><input type="number" min="0"></label>
  <label data-option="导航栏下置"><input type="checkbox"></label>
  <label data-option="粘性导航栏"><input type="checkbox"></label>
  <label data-option="紧凑控件间距"><input type="checkbox"></label>
  <label data-option="显示观看信息" data-hint="在线人数/弹幕数"><input type="checkbox"></label>
  <label data-option="隐藏控件" data-hint="默认隐藏控件区&#10;悬浮到相应位置以显示"><input type="checkbox"></label>
  <label data-option="暂停显示控件" data-hint="默认检测到鼠标活动显示控件&#10;需要一直显示请打开此选项"><input type="checkbox"></label>
  <label data-option="小窗样式" data-hint="试试拉一下小窗左侧？&#10;记录小窗宽度与位置"><input type="checkbox"></label>
  <label><button data-option="重置小窗位置"></button></label>
</fieldset>
<fieldset name="动态页">
  <label data-option="粘性侧栏" data-hint="可能导致侧栏显示不全"><input type="checkbox"></label>
</fieldset>`;
  function styleToggle(s, flip = false) {
    const style = GM_addStyle(s);
    return flip ? (b) => {
      style.disabled = b;
    } : (b) => {
      style.disabled = !b;
    };
  }
  function initUpdate(update, fallback, init) {
    update(init ?? fallback);
    return (_k, _o, newVal) => update(newVal ?? fallback);
  }
  const commonOptions = {
    左右边距: {
      fallback: 30,
      callback(init) {
        return initUpdate((val) => document.documentElement.style.setProperty("--layout-padding-input", `${val}px`), this.fallback, init);
      }
    }
  };
  const videoOptions = {
    导航栏下置: {
      fallback: true,
      callback(init) {
        return initUpdate(styleToggle(styles.upperNavigation, true), this.fallback, init);
      }
    },
    预留高度: {
      fallback: 96,
      callback(init) {
        return initUpdate((val) => val ? document.documentElement.style.setProperty("--reserve-height-input", `calc(var(--navbar-height) + ${val}px)`) : document.documentElement.style.removeProperty("--reserve-height-input"), this.fallback, init);
      }
    },
    自动高度: {
fallback: true,
      callback(init) {
        waitFor(() => document.getElementsByClassName("bpx-player-container")[0], "播放器内容器").then((container) => {
          new ResizeObserver((entries) => {
            if (container.dataset.screen === "mini") return;
            const height = Math.round(entries[0].contentRect.height);
            if (height && height <= window.innerHeight)
              document.documentElement.style.setProperty("--player-height-record", `${height}px`);
            else
              document.documentElement.style.removeProperty("--player-height-record");
          }).observe(container);
        }).catch(console.error);
        return initUpdate(styleToggle(styles.fixHeight, true), this.fallback, init);
      }
    },
    小窗样式: {
      fallback: true,
      callback(init) {
        const toggle1 = styleToggle(styles.mini);
        const toggle2 = styleToggle(".bpx-player-container{--mini-width:initial}", true);
        return initUpdate((enable) => {
          toggle1(enable);
          toggle2(enable);
        }, this.fallback, init);
      }
    },
    粘性导航栏: {
      fallback: true,
      callback(init) {
        return initUpdate(styleToggle(styles.stickyHeader), this.fallback, init);
      }
    },
    紧凑控件间距: {
      fallback: true,
      callback(init) {
        return initUpdate(styleToggle(styles.compactControls), this.fallback, init);
      }
    },
    暂停显示控件: {
      fallback: false,
      callback(init) {
        return initUpdate(styleToggle(styles.pauseShowControls), this.fallback, init);
      }
    },
    显示观看信息: {
      fallback: true,
      callback(init) {
        return initUpdate(styleToggle(".bpx-player-video-info{display:flex!important}"), this.fallback, init);
      }
    },
    隐藏控件: {
      fallback: true,
      callback(init) {
        return initUpdate(styleToggle(styles.hideControls), this.fallback, init);
      }
    }
  };
  const timelineOptions = {
    粘性侧栏: {
      fallback: false,
      callback(init) {
        return initUpdate(styleToggle(styles.stickyAside), this.fallback, init);
      }
    }
  };
  function listenOptions(options) {
    for (const [name, option] of Object.entries(options)) {
      GM_addValueChangeListener(name, option.callback(GM_getValue(name)));
    }
  }
  const optionsFlat = { ...commonOptions, ...videoOptions, ...timelineOptions };
  waitReady().then(() => {
    const app = document.createElement("div");
    app.id = "wider-bilibili";
    app.popover = "auto";
    app.innerHTML = html;
    document.body.insertAdjacentElement("beforeend", app);
    GM_registerMenuCommand("选项", () => {
      app.showPopover();
    });
    const modifiers = ["ctrlKey", "altKey", "shiftKey", "metaKey"];
    const comb = [["altKey", "shiftKey"], "W"];
    (function addListener() {
      document.addEventListener("keydown", (ev) => {
        const { key } = ev;
        if (key === comb[1] && modifiers.every((mod) => comb[0].includes(mod) === ev[mod])) {
          ev.stopImmediatePropagation();
          ev.stopPropagation();
          app.togglePopover();
        }
        setTimeout(addListener, 250);
      }, { once: true });
    })();
    for (const [name, option] of Object.entries(optionsFlat)) {
      const init = GM_getValue(name);
      const input = document.querySelector(`label[data-option=${name}]>input`);
      switch (input?.type) {
        case "checkbox":
          input.checked = init ?? option.fallback;
          input.onchange = () => GM_setValue(name, input.checked);
          input.parentElement.oncontextmenu = (e) => {
            e.preventDefault();
            input.checked = option.fallback;
            GM_deleteValue(name);
          };
          break;
        case "number":
          input.value = String(init ?? option.fallback);
          input.oninput = () => {
            if (!input.value) {
              input.value = String(option.fallback);
              return GM_deleteValue(name);
            }
            const val = Number(input.value);
            if (Number.isInteger(val))
              GM_setValue(name, val);
          };
          input.parentElement.oncontextmenu = (e) => {
            e.preventDefault();
            input.value = String(option.fallback);
            GM_deleteValue(name);
          };
          break;
      }
    }
    listenOptions(commonOptions);
  }).catch(console.error);
  GM_addStyle(styles.panel);
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
      listenOptions(videoOptions);
      const container = await( waitFor(() => player.getElementsByClassName("bpx-player-container")[0], "播放器内容器"));
      if (container.getAttribute("data-screen") !== "mini") {
        container.setAttribute("data-screen", "web");
      }
      container.setAttribute = new Proxy(container.setAttribute.bind(container), {
        apply: (target, thisArg, [name, val]) => target.apply(thisArg, [name, name === "data-screen" && val !== "mini" ? "web" : val])
      });
      container.style.setProperty("--mini-width", `${GM_getValue("小窗宽度", 320)}px`);
      GM_addValueChangeListener("小窗宽度", (_k, _o, newVal) => container.style.setProperty("--mini-width", `${newVal}px`));
      const miniResizer = document.createElement("div");
      miniResizer.className = "bpx-player-mini-resizer";
      miniResizer.onmousedown = (ev) => {
        if (ev.button !== 0) return;
        ev.stopImmediatePropagation();
        ev.preventDefault();
        const resize = (ev2) => {
          const miniWidth = Math.round(Math.max(container.offsetWidth + container.getBoundingClientRect().x - ev2.x + 1, 0));
          GM_setValue("小窗宽度", miniWidth);
        };
        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", () => document.removeEventListener("mousemove", resize), { once: true });
      };
      const miniPositionFormat = (rt, bt) => `.bpx-player-container[data-screen="mini"] {
  right: ${rt}px !important;
  bottom: ${bt}px !important;
}`;
      const miniStyle = GM_addStyle(miniPositionFormat(GM_getValue("小窗右", "52"), GM_getValue("小窗下", "8")));
      document.querySelector(`button[data-option=重置小窗位置]`)?.addEventListener("click", () => {
        GM_deleteValues(["小窗右", "小窗下", "小窗宽度"]);
        miniStyle.textContent = miniPositionFormat("52", "8");
        container.style.removeProperty("--mini-width");
      });
      const videoArea = container.getElementsByClassName("bpx-player-video-area")[0];
      if (!(videoArea instanceof HTMLElement)) {
        console.error("页面加载错误：视频区域不存在");
        break;
      }
      observeFor("bpx-player-mini-warp", videoArea).then((warp) => {
        warp.appendChild(miniResizer);
        warp.addEventListener("mousedown", (ev) => {
          if (ev.button !== 0) return;
          const { right, bottom } = warp.getBoundingClientRect();
          const offsetX = right - ev.x;
          const offsetY = bottom - ev.y;
          const onmousemove = (ev2) => {
            const newRt = Math.round(Math.max(window.innerWidth - ev2.x - offsetX, 0));
            const newBt = Math.round(Math.max(window.innerHeight - ev2.y - offsetY, 0));
            GM_setValue("小窗右", newRt);
            GM_setValue("小窗下", newBt);
            miniStyle.textContent = miniPositionFormat(String(newRt), String(newBt));
          };
          document.addEventListener("mousemove", onmousemove);
          document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", onmousemove);
          }, { once: true });
        });
      }).catch(console.error);
      const sendingBar = player.getElementsByClassName("bpx-player-sending-bar")[0];
      if (!(sendingBar instanceof HTMLElement)) {
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