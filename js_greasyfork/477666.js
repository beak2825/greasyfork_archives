// ==UserScript==
// @name         去云图客服图标+去用户名水印
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/477666/%E5%8E%BB%E4%BA%91%E5%9B%BE%E5%AE%A2%E6%9C%8D%E5%9B%BE%E6%A0%87%2B%E5%8E%BB%E7%94%A8%E6%88%B7%E5%90%8D%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/477666/%E5%8E%BB%E4%BA%91%E5%9B%BE%E5%AE%A2%E6%9C%8D%E5%9B%BE%E6%A0%87%2B%E5%8E%BB%E7%94%A8%E6%88%B7%E5%90%8D%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function appendDoc() {
    const likeComment = document.querySelector(".effect-support-entry-wrapper");
    if (likeComment) {
      likeComment.style.display = "none";
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  function appendDoc2() {
    const likeComment = document.querySelector(".watermark");
    if (likeComment) {
      likeComment.style.opacity = 0;
      return;
    }
    setTimeout(appendDoc2, 1000);
  }
  appendDoc2();

})();
