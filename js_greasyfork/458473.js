// ==UserScript==
// @name 已点超链接变色(新）
// @namespace https://greasyfork.org/users/30791
// @version 1.0.2
// @description 一个自己用的css
// @author ShowLee
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.wnflb2023.com/*
// @match *://*.sehuatang.net/*
// @match *://*.laowang.vip/*
// @match *://*.xxxclub.to/*
// @match *://*.hacg.mom/*
// @match *://*.javbus.com/*
// @match *://*.mmybmwvv.cc/*
// @match *://*.hacg.mov/*
// @match *://*.reimu.net/*
// @match *://*.haijiao.com/*
// @match *://*.asiantolick.com/*
// @match *://*.xvideos.com/*
// @match *://*.spankbang.com/*
// @match *://*.rarbgprx.org/*
// @match *://*.pornhubpremium.com/*
// @match *://*.sukebei.nyaa.si/*
// @match *://*.pornhub.com/*
// @match *://*.hsex.men/*
// @match *://*.t66y.com/*
// @downloadURL https://update.greasyfork.org/scripts/458473/%E5%B7%B2%E7%82%B9%E8%B6%85%E9%93%BE%E6%8E%A5%E5%8F%98%E8%89%B2%28%E6%96%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/458473/%E5%B7%B2%E7%82%B9%E8%B6%85%E9%93%BE%E6%8E%A5%E5%8F%98%E8%89%B2%28%E6%96%B0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
let css = `
    a:visited {
        color: rgba(123, 207, 166, 0.1)!important;
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
