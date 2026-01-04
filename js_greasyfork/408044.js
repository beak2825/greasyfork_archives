// ==UserScript==
// @name 哔哩哔哩播放器模糊效果
// @namespace ckylin-style-bilibiliplayerblur
// @version 1.0.1
// @description 为哔哩哔哩播放器添加模糊效果
// @author CKylinMC
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/408044/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%92%AD%E6%94%BE%E5%99%A8%E6%A8%A1%E7%B3%8A%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/408044/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%92%AD%E6%94%BE%E5%99%A8%E6%A8%A1%E7%B3%8A%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
let css = `
    .video-control-show .bilibili-player-video-control-wrap {
        backdrop-filter: blur(12px);
    }
    .bilibili-player-video-toast-bottom .bilibili-player-video-toast-item {
        backdrop-filter: blur(12px);
        background: #00000066;
    }
    .bilibili-player-video-toast-item-jump {
        font-weight: bold;
        color: #f25d8e;
        /* text-shadow: 0 0 5px white; */
        background: #00000061;
    }
    .bilibili-player-video-toast-item-jump:hover {
        color: #ff85ad;
        background-color: hsla(0, 0%, 0%, 0.2);
    }
    .bilibili-player-context-menu-container.black,
    .bilibili-player-video-info-container.active,
    .bilibili-player-event-log-container.active,
    .bilibili-player-color-panel,
    .bl-audio-panel,
    .bilibili-player-hotkey-panel-container.active
    {
        background: rgba(28, 28, 28, 0.64);
        backdrop-filter: blur(12px);
    }
    .n-fix .n-inner {
        box-shadow: 0 0 5px 2px #00000080 !important;
    }

    .bilibili-player-video-danmaku-setting-box {
        background: rgb(21 21 21 / 66%)!important;
        border-radius: 2px!important;
        backdrop-filter: blur(10px);
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
