// ==UserScript==
// @name              Y!メール 样式美化
// @version           0.1.4
// @description       Yahoo! Japan 邮箱页面样式修改、隐藏多余内容
// @author            asadahimeka
// @namespace         https://kanata.ml
// @license           MIT
// @match             https://mail.yahoo.co.jp/u/pc*
// @require           https://lib.baomitu.com/arrive/2.4.1/arrive.min.js
// @source            https://github.com/asadahimeka/userscripts
// @supportURL        https://github.com/asadahimeka/userscripts/issues
// @run-at            document-start
// @grant             GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448833/Y%21%E3%83%A1%E3%83%BC%E3%83%AB%20%E6%A0%B7%E5%BC%8F%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/448833/Y%21%E3%83%A1%E3%83%BC%E3%83%AB%20%E6%A0%B7%E5%BC%8F%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  "use strict";
  GM_addStyle(`
a[href="https://yahoo.jp/v4qcw7I"],
#mhHeadLine,
#mhPointDetailTxtPaypay,
#mhd_text_pc {
  display: none !important;
}

#root #TEMPLA_MH_VDOM {
  min-height: unset !important;
}
  `);

  function setParentStyle(selector, callback) {
    var _a, _b;
    const style2 = (_b = (_a = document.querySelector(selector)) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.style;
    style2 && (callback == null ? void 0 : callback(style2));
  }
  function setBasicStyle() {
    setParentStyle("#switchTab", (s) => s.width = "255px");
    setParentStyle("#tagYadsListTop", (s) => s.display = "none");
    setParentStyle("#tagYadsSideColumn", (s) => s.display = "none");
    setParentStyle("#tagYadsDetail", (s) => s.display = "none");
  }
  function setTwimgStyle(el) {
    setTimeout(() => {
      var _a, _b, _c;
      const d = (_a = el.contentWindow) == null ? void 0 : _a.document;
      if (!d)
        return;
      const avatar = d.querySelector('img[src^="https://pbs.twimg.com/profile_images"');
      if (!avatar)
        return;
      const tds = d.querySelectorAll('td[background^="https://pbs.twimg.com/media"]');
      for (const item of tds) {
        const bg = (_b = item.getAttribute("background")) == null ? void 0 : _b.replace(":mosaic", "");
        bg && ((_c = item.querySelector("img")) == null ? void 0 : _c.setAttribute("src", bg));
      }
    }, 200);
  }
  function doClean() {
    const selector = 'div[data-cy="mailPreviewArea"]';
    document.arrive(selector, (el) => {
      setBasicStyle();
      el.arrive("iframe", (ifr) => setTwimgStyle(ifr));
      document.unbindArrive(selector);
    });
  }
  addEventListener("load", () => {
    doClean();
  });
})();
