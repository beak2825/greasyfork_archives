// ==UserScript==
// @name 萌娘百科：移除背景廣告
// @namespace https://jasonhk.dev/
// @version 1.0.0
// @description 移除萌娘百科「MoeSkin」外觀的背景廣告圖片。
// @author Jason Kwok
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.zh.moegirl.org.cn/*
// @downloadURL https://update.greasyfork.org/scripts/466725/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%EF%BC%9A%E7%A7%BB%E9%99%A4%E8%83%8C%E6%99%AF%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/466725/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%EF%BC%9A%E7%A7%BB%E9%99%A4%E8%83%8C%E6%99%AF%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

(function() {
let css = `
    body.skin-moeskin #moe-global-background
    {
        --theme-background-color: rgb(185 214 244);
    }
    
    @media(prefers-color-scheme: dark)
    {
        body.skin-moeskin #moe-global-background
        {
            --theme-background-color: rgb(47, 51, 53);
        }
    }
    
    body.skin-moeskin #moe-global-background::before, body.skin-moeskin #moe-global-background::after
    {
        background: var(--theme-background-color) !important;
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
