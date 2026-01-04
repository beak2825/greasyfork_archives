// ==UserScript==
// @name 阿里云盘网页优化- 进度条隐藏 / 播放窗口防遮挡 / 去广告
// @namespace github.com/openstyles/stylus
// @version 1.1.1
// @description 视频进度条隐藏(移动鼠标再启用)，视频音频播放控制窗口防遮挡，去广告
// @author yui
// @grant GM_addStyle
// @run-at document-start
// @match *://*.aliyundrive.com/*
// @downloadURL https://update.greasyfork.org/scripts/424170/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96-%20%E8%BF%9B%E5%BA%A6%E6%9D%A1%E9%9A%90%E8%97%8F%20%20%E6%92%AD%E6%94%BE%E7%AA%97%E5%8F%A3%E9%98%B2%E9%81%AE%E6%8C%A1%20%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/424170/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96-%20%E8%BF%9B%E5%BA%A6%E6%9D%A1%E9%9A%90%E8%97%8F%20%20%E6%92%AD%E6%94%BE%E7%AA%97%E5%8F%A3%E9%98%B2%E9%81%AE%E6%8C%A1%20%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
let css = `
    .text-primary--3DHOJ{overflow:visible;font-weight:bold}
    .loader--3P7-4,.loader--zXBWG{opacity:0.5!important}
    .outer-wrapper--3ViSy,.video-player--k1J-M{opacity:0!important}
    .outer-wrapper--3ViSy:hover,.video-player--k1J-M:hover{opacity:0.6!important}
    .button--1pH7M,.container--CIvrv{display:none}
    .sign-bar--1XrSl,.ai-summary-btn--fQnJ{display:none!important}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
