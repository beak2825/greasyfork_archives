// ==UserScript==
// @name Remove Fandom Garbage X
// @description 简化 Fondom 界面，移除各个广告。
// @namespace https://greasyfork.org/zh-CN/scripts/431460-remove-fandom-garbage-x
// @author WeiHengYi
// @version 2.0.3
// @license GPL-3.0-only
// @grant GM_addStyle
// @run-at document-start
// @include http://fandom.com/*
// @include https://fandom.com/*
// @include http://*.fandom.com/*
// @include https://*.fandom.com/*
// @downloadURL https://update.greasyfork.org/scripts/431460/Remove%20Fandom%20Garbage%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/431460/Remove%20Fandom%20Garbage%20X.meta.js
// ==/UserScript==


(function() {
  let css = `
  
    #mixed-content-footer, .wds-global-footer, #rail-boxad-wrapper, .top-ads-container {
      display:none;
    }
  
  `;
  if (typeof GM_addStyle !== "undefined") {
    GM_addStyle(css);
  } else {
    let styleNode = document.createElement("style");
    styleNode.appendChild(document.createTextNode(css));
    (document.querySelector("head") || document.documentElement).appendChild(styleNode);
  }
  })();
