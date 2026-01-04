// ==UserScript==
// @name              简书文章页面美化
// @version           0.1.2
// @description       简书文章页面样式美化、隐藏多余内容
// @author            asadahimeka
// @namespace         https://www.nanoka.top
// @license           MIT
// @match             https://www.jianshu.com/p/*
// @require           https://lib.baomitu.com/arrive/2.4.1/arrive.min.js
// @source            https://github.com/asadahimeka/userscripts
// @supportURL        https://github.com/asadahimeka/userscripts/issues
// @run-at            document-body
// @grant             GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448834/%E7%AE%80%E4%B9%A6%E6%96%87%E7%AB%A0%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/448834/%E7%AE%80%E4%B9%A6%E6%96%87%E7%AB%A0%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  "use strict";
  GM_addStyle(`
header,
footer,
aside > div,
a[href*=apps],
a[href="/sign_in"],
a[href="/sign_up"],
a[href="/writer"],
i[aria-label="ic-diamond"],
i[aria-label="ic-diamond"] + span,
i[aria-label="ic-dislike"],
textarea[placeholder="写下你的评论..."],
textarea[placeholder="写下你的评论..."] + div,
[aria-label="baidu-ad"],
[aria-label="点赞"],
[aria-label="回复评论"],
[aria-label="添加评论"],
[aria-label="添加子评论"],
[aria-label="给文章点赞"],
[aria-label="给文章点赞"] + div,
[aria-label="赞赏作者"],
[aria-label="查看赞赏列表"],
[aria-label="简书钻"],
[aria-label="抽奖关闭"],
._3Pnjry,
._13lIbp,
.adad_container,
._11TSfs,
aside {
  display: none !important;
}
.ouvJEz:has(._11TSfs) {
  padding: 0;
}
[role="main"] > div {
  width: 100%;
}
pre[class*=language-].line-numbers {
  overflow-x: auto;
}
  `);

  function waitArriveTest(sel, test, cb) {
    document.arrive(sel, { existing: true }, (element) => {
      const el = element;
      test(el) && cb(el);
    });
  }
  function waitArrive(sel, cb) {
    document.arrive(sel, { existing: true }, (element) => {
      cb(element);
    });
  }
  waitArrive('button[type="button"]', (el) => {
    var _a;
    if ((_a = el.textContent) == null ? void 0 : _a.includes("\u9605\u8BFB\u5168\u6587")) {
      el.click();
    }
    if (el.innerText.includes("\u5173\u6CE8")) {
      el.remove();
    }
  });
  waitArriveTest("div[role=button]", (el) => el.innerText.includes("\u62BD\u5956"), (el) => el.remove());
  waitArrive("h3", (el) => {
    var _a;
    if (el.innerText.includes("\u63A8\u8350\u9605\u8BFB")) {
      el.style.display = "none";
      (_a = el.nextElementSibling) == null ? void 0 : _a.setAttribute("style", "display:none");
    }
  });
})();
