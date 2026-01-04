// ==UserScript==
// @name Wider Bilibili 自定义样式
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description 搭配Wider Bilibili使用
// @author posthumz
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/493223/Wider%20Bilibili%20%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/493223/Wider%20Bilibili%20%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
let css = `
  :root {
    /* 导航栏高度 */
    --navbar-height: 50px !important;
    /* 控件区高度 */
    --control-height: 54px;
    /* 进度条高度 */
    --progess-height: 6px;
    /* 高能区透明度 */
    --pbp-opacity: 75%;
    /* 高能区高度比例 */
    --pbp-height: 80%;
    /* 稍后观看最大显示数量 */
    --actions-max-count: 8;
  }


  .bpx-player-control-wrap {
    height: var(--control-height) !important;
  }

  .bpx-player-control-bottom {
    margin-top: 10px !important;
  }


  .bpx-player-progress {
    height: var(--progess-height) !important;
    transform: translateY(100%);
    top: 1px;
  }

  .bpx-player-control-top {
    bottom: 100% !important;
  }


  .bpx-player-pbp>svg {
    opacity: var(--pbp-opacity);
    transform-origin: bottom;
    transform: scaleY(var(--pbp-height));
  }


  #playlist-video-action-list-body {
    max-height: initial;
  }

  #playlist-video-action-list {
    max-height: calc(var(--actions-max-count) * 72px - 6px);
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
