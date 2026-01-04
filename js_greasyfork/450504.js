// ==UserScript==
// @name         CSDN 免登录复制
// @version      0.1
// @icon         https://blog.csdn.net/favicon.ico
// @description  CSDN 免登录复制，净化页面
// @namespace    https://github.com/maqi1520
// @match        *://*.csdn.net/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/450504/CSDN%20%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/450504/CSDN%20%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(
`pre,
code {
  user-select: auto !important;
}
#blogExtensionBox,
.hide-article-box,
.insert-baidu-box,
.signin,
.wwads-horizontal,
.wwads-vertical,
.blog-top-banner,
.blog_container_aside,
.programmer1Box,
.recommend-box,
.recommend-nps-box,
.template-box,
.hide-preCode-box {
  display: none !important;
}
main {
  width: 100% !important;
}
#article_content,
main div.blog-content-box pre.set-code-hide {
  height: auto !important;
}
`
  );
    $("link").each((index, item) => {
    if ($(item).attr("href").indexOf("skin") > -1) {
      $(item).remove();
    }
  });

  // 免登录复制
  $(".hljs-button").removeClass("signin");
  $(".hljs-button").attr("data-title", "免登录复制");
  $(".hljs-button").attr(
    "onclick",
    "hljs.copyCode(event);setTimeout(function(){$('.hljs-button').attr('data-title', '免登录复制');},3500);"
  );
  // 去除剪贴板劫持
  $("code").attr("onclick", "mdcp.copyCode(event)");
  try {
    // 复制时保留原文格式，参考 https://greasyfork.org/en/scripts/390502-csdnremovecopyright/code
    Object.defineProperty(window, "articleType", {
      value: 0,
      writable: false,
      configurable: false,
    });

  csdn.copyright.init("", "", "");
  } catch (err) {}
})();
