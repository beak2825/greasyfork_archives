// ==UserScript==
// @name        灵驹运维平台添加标识
// @namespace   bytedance
// @match       http://byteair-*.byted.org:*/*
// @grant       none
// @version     1.0.1
// @author      yaxin
// @license     private
// @icon        https://sf1-ttcdn-tos.pstatp.com/obj/ttfe/favicon-bytedance.ico
// @description 对运维平台添加标识
// @downloadURL https://update.greasyfork.org/scripts/482745/%E7%81%B5%E9%A9%B9%E8%BF%90%E7%BB%B4%E5%B9%B3%E5%8F%B0%E6%B7%BB%E5%8A%A0%E6%A0%87%E8%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/482745/%E7%81%B5%E9%A9%B9%E8%BF%90%E7%BB%B4%E5%B9%B3%E5%8F%B0%E6%B7%BB%E5%8A%A0%E6%A0%87%E8%AF%86.meta.js
// ==/UserScript==

(function() {
  const prefixMap = {
    "byteair-honor": "荣耀",
    "byteair-saas-sgglobal": "SGGlobal",
    "byteair-saas": "SAAS",
    "byteair-vivo": "VIVO",
    "byteair-agile": "敏捷"
  }

  const host = window.location.host;
  const prefix = host.split(".")[0];

  if (prefix in prefixMap) {
    const name = prefixMap[prefix];
    const titleDom = document.querySelector("head title");

    var observer = new MutationObserver(function(mutations) {
      const title = titleDom.innerText;
      const titlePrefix = `[${name}]`;
      if (title.startsWith(titlePrefix)) {
        return;
      }
      titleDom.innerText = `${titlePrefix} ${title}`
    });
    observer.observe(titleDom, {
      subtree: true,
      characterData: true,
      childList: true
    });
  }
})();
