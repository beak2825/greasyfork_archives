// ==UserScript==
// @name              CSDN 文章页面美化
// @version           0.1.1
// @description       CSDN 文章页面样式美化、隐藏多余内容
// @author            asadahimeka
// @namespace         https://www.nanoka.top
// @license           MIT
// @match             https://blog.csdn.net/*/article/details/*
// @source            https://github.com/asadahimeka/userscripts
// @supportURL        https://github.com/asadahimeka/userscripts/issues
// @run-at            document-body
// @grant             GM_addStyle
// @grant             GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/448835/CSDN%20%E6%96%87%E7%AB%A0%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/448835/CSDN%20%E6%96%87%E7%AB%A0%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  "use strict";
  GM_addStyle(`
.hide-article-box,
.recommend-right,
.passport-login-container,
.login-mark,
.recommend-box,
.blog-footer-bottom,
.template-box,
.csdn-side-toolbar a:not([data-type="gotop"]),
aside .mb8[data-pid="blog"],
[id^="dmp_ad"],
#asideHotArticle,
#asideCategory,
#asideNewComments,
#asideNewNps,
#asideArchive,
#recommendNps,
#csdn-toolbar,
#toolBarBox,
#passportbox {
  display: none !important;
}
#recommend-right[style^="position: fixed"] {
  top: 0 !important;
}
#article_content {
  height: auto !important;
  overflow: auto !important;
}
#content_views pre,
#content_views pre code {
  user-select: auto !important;
}
main,
aside {
  float: none;
  margin-right: 10px;
}
.container {
  width: 100% !important;
}
main {
  width: 90% !important;
  padding-left: 302px;
}
aside {
  position: fixed !important;
  left: 12px !important;
  top: 8px !important;
}
#asidedirectory {
  display: block !important;
}
.blog-content-box {
  margin-bottom: 40px !important;
  padding-bottom: 40px !important;
}
#content_views .hl-1 {
  color: inherit !important;
  padding-right: 0 !important;
  background: 0 !important;
  margin-right: 0 !important;
}
  `);

  addEventListener("load", () => {
    csdn.copyright.init("", "", "");
    localStorage.setItem("anonymousUserLimit", "");
    $("#content_views").off("click");
    $(".look-more-preCode").trigger("click");
    const $btn = $(".hljs-button");
    $btn.removeClass("signin");
    $btn.off("click");
    $btn.each(function() {
      this.onclick = null;
    });
    $btn.attr("data-title", "\u590D\u5236");
    $btn.on("click", function() {
      GM_setClipboard(this.parentNode.innerText);
      $btn.attr("data-title", "\u590D\u5236\u6210\u529F");
      setTimeout(() => {
        $btn.attr("data-title", "\u590D\u5236");
      }, 1e3);
    });
  });
})();
