// ==UserScript==
// @name              douyin-helper 抖音优化
// @version           0.0.1
// @description       抖音网页版优化，配合 Yandex 浏览器、油猴脚本代替抖音APP，防止烧屏
// @author            soul mate
// @namespace         http://tampermonkey.net/soulmate
// @license           MIT
// @match             https://www.douyin.com/*
// @homepage          https://greasyfork.org/scripts/******
// @supportURL        https://github.com
// @run-at            document-body
// @grant             GM_download
// @grant             GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/453957/douyin-helper%20%E6%8A%96%E9%9F%B3%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/453957/douyin-helper%20%E6%8A%96%E9%9F%B3%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  "use strict";
  GM_addStyle(`
/** 纯净模式
 * ======================================================== */
/* 纯净模式，即隐藏点赞、文案、小进度条等 */
.douyin-pure {
  /* 侧边栏 */
  /* 底部左侧（播放按钮、进度）*/
  /* 底部右侧(自动连播按钮等)*/
  /* 文案 */
}
.douyin-pure .xgplayer-controls + div,
.douyin-pure .xgplayer-controls .xg-left-grid,
.douyin-pure .xgplayer-controls .xg-right-grid {
  opacity: 0.1 !important;
}
.douyin-pure .xgplayer-video-info-wrap {
  opacity: 0.3 !important;
}
/** 大屏模式
 * ======================================================== */
/* 大屏模式，视频放大显示 */
.douyin-large .xgplayer-is-fullscreen .xg-video-container > video,
.douyin-large .xgplayer-is-fullscreen .imgBackground > img {
  margin-left: -7.4vw !important;
  width: calc(100% + 14.8vw) !important;
}
/** 基本样式
 * ======================================================== */
/* 移动端取消高亮 */
* {
  -webkit-tap-highlight-color: transparent !important;
}
/* 去除多余动画 */
*:not(.swiper-wrapper) {
  animation: none !important;
  transition: none !important;
}
/** 动画，防止固定显示烧屏
 * ======================================================== */
/* 上下缓动的动画 */
@keyframes moveUpAndDown {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-3vh);
  }
}
/* 侧边栏 */
.xgplayer-controls + div,
.video-info-detail {
  animation: moveUpAndDown 10s linear infinite alternate !important;
}
/** 侧边栏
 * ======================================================== */
/* 上下切换按钮 */
@media screen and (orientation: portrait) {
  .xgplayer-playswitch {
    /* 上下切换按钮颜色移除 */
  }
  .xgplayer-playswitch .xgplayer-icon {
    transform: scale(1.8) !important;
    margin-bottom: 2vh !important;
  }
  .xgplayer-playswitch * {
    background-color: transparent !important;
  }
}
/* 侧边按钮 */
.xgplayer-controls + div {
  pointer-events: none;
  padding-bottom: 10vh;
  padding-right: 15px !important;
}
.xgplayer-controls + div > div {
  pointer-events: auto !important;
  /* 侧边按钮图标阴影 */
}
.xgplayer-controls + div > div > div {
  /* 收藏等按钮隐藏 */
}
.xgplayer-controls + div > div > div:nth-child(1) > div {
  /* 头像去掉顶部 margin */
  margin-top: 0;
  /* 关注按钮下移，方便手机点击 */
}
.xgplayer-controls + div > div > div:nth-child(1) > div > a + div {
  position: relative;
  top: 12px;
  opacity: 0.5;
  margin-top: 0;
}
.xgplayer-controls + div > div > div:nth-child(n + 4) {
  display: none;
}
.xgplayer-controls + div > div svg {
  filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.5));
}
/* 横屏【更多】按钮显示 */
@media screen and (orientation: landscape) {
  .xgplayer-controls + div > div > div:last-child {
    display: block;
  }
}
/** 底部按钮文案等
 * ======================================================== */
@media screen and (orientation: portrait) {
  .xgplayer {
    /* 全屏按钮变大，方便手机端点击，目前是满屏了 */
  }
  .xgplayer .xgplayer-fullscreen .xg-get-fullscreen {
    pointer-events: auto !important;
    position: absolute;
    width: 1000vh !important;
    height: 1000vh !important;
    bottom: -100vh;
    right: -100vh;
    opacity: 0;
  }
  .xgplayer .xgplayer-immersive-switch-setting {
    display: none !important;
  }
  .xgplayer .xgplayer-autoplay-setting .xgplayer-setting-title {
    display: inline-flex;
    flex-direction: row-reverse;
    overflow: hidden;
    width: 24px;
    white-space: nowrap;
  }
}
.xgplayer {
  /* 作者\文案等缩小，加阴影方便查看 */
  /* 左侧边栏放大到下半屏，方便滑动上/下一个 */
}
.xgplayer .xgplayer-video-info-wrap {
  opacity: 1;
  --fc: rgba(0, 0, 0, 0.1);
  text-shadow: -1px -1px 0 var(--fc), -1px 1px 0 var(--fc), 1px -1px 0 var(--fc), 1px 1px 0 var(--fc), -1px 0 0 var(--fc), 1px 0 0 var(--fc), 0 -1px 0 var(--fc), 0 1px 0 var(--fc), 0 0 4px rgba(0, 0, 0, 0.5);
}
.xgplayer .xgplayer-video-info-wrap .video-info-detail {
  background-image: none !important;
}
.xgplayer .xg-left-bar {
  top: 60% !important;
  left: 0 !important;
  bottom: 0 !important;
  display: block !important;
  width: 100% !important;
  z-index: 0 !important;
  pointer-events: auto;
}
.xgplayer .xg-right-bar {
  top: 0 !important;
  left: 0 !important;
  bottom: 90% !important;
  display: block !important;
  width: 100% !important;
  z-index: 10000 !important;
  pointer-events: auto;
}
/**  评论弹窗、视频弹窗
 * ======================================================== */
/* 全屏时评论弹窗、视频弹窗优化 */
@media screen and (orientation: portrait) {
  .xgplayer-fullscreen-parent {
    /* 弹窗显示在屏幕底部 */
  }
  .xgplayer-fullscreen-parent .playerContainer + div {
    width: 100%;
    overflow: hidden;
    position: absolute;
    top: 50vh;
    bottom: 0;
    transition: none;
    pointer-events: none;
    max-width: 100%;
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div {
    /* 评论列表 */
    /* 视频列表 */
    /* 评论列表弹窗背景透明 */
    /* 视频弹窗背景透明 */
    /* 弹窗背景透明 */
    /* 视频弹窗背景透明，方便看文案 */
    /* 弹窗关闭按钮点击区域放大 */
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(1),
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) {
    width: 100%;
    left: 0;
    transition: none;
    overflow: initial;
    pointer-events: auto;
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(1) {
    /* 评论列表展开按钮点击区域加大 */
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(1) button {
    width: 100%;
    text-align: left;
    margin-top: 0;
    height: 48px;
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) {
    top: 100px;
    background: rgba(255, 255, 255, 0.23) !important;
    border: 0 !important;
    /* 视频列表   */
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) > div {
    /* 视频弹窗wrapper */
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) > div,
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) > div > div {
    position: relative;
    background: transparent !important;
    overflow: hidden;
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) > div:nth-child(1) {
    /* 视频弹窗header */
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) {
    /* 标题等穿透点击，方便点到关闭按钮 */
    /* 视频弹窗header右侧按钮区域，占满，方便关闭按钮 */
    /* 视频弹窗header图标颜色 */
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > :first-child {
    position: relative;
    z-index: 10;
    pointer-events: none;
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > :first-child > * {
    pointer-events: all;
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:last-child {
    justify-content: flex-end;
    display: flex;
    left: 0;
    height: 60px;
    position: absolute;
    width: 100%;
    /* 视频弹窗header折起展开按钮显示样式 */
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:last-child svg:not(:last-child) {
    position: absolute;
    top: 12px;
    right: 32px;
    z-index: 3;
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) path {
    fill: #2f3035;
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) ul {
    width: 100%;
    max-width: 90vw;
    margin: 0 auto;
    /* 视频列表项目   */
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) ul li {
    padding: 0;
    width: calc((100% - 24px) / 3);
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) ul li:nth-child(3n) {
    padding: 0;
    padding-bottom: 8px;
    padding-left: 6px;
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) ul li:nth-child(3n-1) {
    padding: 0 3px 8px;
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) ul li:nth-child(3n-2) {
    padding-bottom: 8px;
    padding-right: 6px;
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(3) {
    background-color: transparent !important;
    border: none !important;
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(4) {
    background: transparent !important;
  }
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) svg:last-child,
  .xgplayer-fullscreen-parent .playerContainer + div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) svg:last-child {
    position: absolute;
    left: 0;
    top: -50vh;
    width: 100%;
    height: calc(50vh + 60px);
    padding-top: 50vh;
    padding-left: calc(100% - 36px);
    z-index: 2;
  }
}
/* 非通用类名，头条修改类目要相应修改 */
/* 去春节广告 */
div[slot="wrapper-start"] {
  display: none !important;
}
/* 去评论登录弹窗 */
.comment-input-un-login-container {
  display: none !important;
}
/* 登录弹窗 */
.login-mask-enter-done {
  display: none !important;
}
/* 图文隐藏切换按钮 */
.xgplayer .swiper-container + svg,
.xgplayer .swiper-container + svg + svg {
  display: none;
}
/* 页面按钮透明度 */
@media screen and (orientation: portrait) {
  .xg-inner-controls .xg-left-grid,
  .xg-inner-controls .xg-right-grid {
    opacity: 0.3 !important;
  }
}
  `);

  console.log("douyinHelper \u52A0\u8F7D\u6210\u529F~");
  (() => {
    pageInit();
    function pageInit() {
      addPureFunction();
      addLargeFunction();
    }
    function togglePureFunction(status = false) {
      let bodyClassList = document.body.classList;
      if (status) {
        if (!bodyClassList.contains("douyin-pure")) {
          bodyClassList.add("douyin-pure");
        }
      } else {
        if (bodyClassList.contains("douyin-pure")) {
          localStorage.removeItem("____douyin_pure");
          bodyClassList.remove("douyin-pure");
        } else {
          localStorage.setItem("____douyin_pure", "1");
          bodyClassList.add("douyin-pure");
        }
      }
    }
    function addPureFunction() {
      let isPure = localStorage.getItem("____douyin_pure") === "1";
      if (isPure) {
        togglePureFunction(isPure);
      }
      document.addEventListener("click", (e) => {
        var _a, _b;
        let classList = (_a = e.target) == null ? void 0 : _a.classList;
        if ((_b = classList == null ? void 0 : classList.contains) == null ? void 0 : _b.call(classList, "xg-right-bar")) {
          togglePureFunction();
        }
      });
    }
    function toggleLargeFunction(status = false) {
      let bodyClassList = document.body.classList;
      if (status) {
        if (!bodyClassList.contains("douyin-large")) {
          bodyClassList.add("douyin-large");
        }
      } else {
        if (bodyClassList.contains("douyin-large")) {
          localStorage.removeItem("____douyin_large");
          bodyClassList.remove("douyin-large");
        } else {
          localStorage.setItem("____douyin_large", "1");
          bodyClassList.add("douyin-large");
        }
      }
    }
    function addLargeFunction() {
      let isLarge = localStorage.getItem("____douyin_large") === "1";
      if (isLarge) {
        toggleLargeFunction(isLarge);
      }
      document.addEventListener("dblclick", (e) => {
        var _a, _b;
        let classList = (_a = e.target) == null ? void 0 : _a.classList;
        if ((_b = classList == null ? void 0 : classList.contains) == null ? void 0 : _b.call(classList, "xg-right-bar")) {
          toggleLargeFunction();
        }
      });
    }
  })();
})();
