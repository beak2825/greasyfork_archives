// ==UserScript==
// @name wsmud_flat_color
// @namespace mos
// @version 1.0.6
// @description 武神传说(wsmud)配色
// @author mapleo
// @homepageURL https://greasyfork.org/zh-CN/scripts/394736-wsmud-flat-color
// @grant GM_addStyle
// @run-at document-start
// @match *://*.wsmud.com/*
// @downloadURL https://update.greasyfork.org/scripts/394736/wsmud_flat_color.user.js
// @updateURL https://update.greasyfork.org/scripts/394736/wsmud_flat_color.meta.js
// ==/UserScript==

(function() {
let css = `
    @media screen and (-webkit-min-device-pixel-ratio: 0) {
        .item-status-bar > .status-item {
            zoom: 1
        }
    }
    pre {
        font-size: 1em;
    }
    .container,
    .login-content,
    .left,
    .right {
        color: rgb(0, 178, 0);
        background-color: #121212;
    }
    .room-item > .item-name {
        margin-left: 1em;
    }
    .room_items {
        max-height: 120px;
    }
    .item-status-bar > .status-item {
        font-size: 0.8em;
        font-weight: lighter;
    }
    .state-bar {
        overflow-x: auto;
    }
    .hp > .progress-bar {
        background-color: #c0392b;
    }
    .mp > .progress-bar {
        background-color: #2980b9;
    }
    HIG {
        color: #2ecc71;
    }
    HIC {
        color: #2980b9;
    }
    HIY {
        color: #f1c40f;
    }
    HIZ {
        color: #8e44ad;
    }
    HIO {
        color: #e67e22;
    }
    HIR {
        color: #c0392b;
    }
    HIM {
        color: #e84393;
    }

    /* funny */
    .left,
    .right {
        width: 350px;
    }
    .left,
    .left-content,
    .right > .msg {
        font-size: 12px;
    }
    .span-btn {
        font-size: 12px;
    }
    /* raid */
    .layui-layer-page > .layui-layer-content {
        font-size: 12px;
        color: rgb(0, 128, 0);
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
