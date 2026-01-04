// ==UserScript==
// @name         千图网隐藏搜索页企业专享
// @namespace    https://www.52pojie.cn/home.php?mod=space&uid=508077
// @version      1.22
// @description  避免不需要使用企业素材的用户看到不需要的资源
// @author       未知的动力
// @match        *://www.58pic.com/*
// @run-at      document-end
// @grant       GM_addStyle
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/445726/%E5%8D%83%E5%9B%BE%E7%BD%91%E9%9A%90%E8%97%8F%E6%90%9C%E7%B4%A2%E9%A1%B5%E4%BC%81%E4%B8%9A%E4%B8%93%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/445726/%E5%8D%83%E5%9B%BE%E7%BD%91%E9%9A%90%E8%97%8F%E6%90%9C%E7%B4%A2%E9%A1%B5%E4%BC%81%E4%B8%9A%E4%B8%93%E4%BA%AB.meta.js
// ==/UserScript==

!(function () {
  const t = new (class {
    constructor(t, o, e = null, n = "childList") {
      (this.ele = t),
        (this.callback = o),
        (this.config = null == e ? { attributes: !0, childList: !0, subtree: !0 } : e),
        (this.monitorType = n);
    }
    startMonitor() {
      let t = this;
      let o = new MutationObserver(function (o, e) {
        for (let e of o) e.type == t.monitorType && t.callback();
      });
      o.observe(t.ele, t.config), (t._monitorHandle = o);
    }
    stopMonitor() {
      this._monitorHandle.disconnect();
    }
  })(document.body, function () {
    const o = document.querySelectorAll(".qtd-card");
    if (null != o) {
      t.stopMonitor();
      for (let t = 0; t < o.length; t++) {
        const e = o[t].querySelectorAll("em");
        for (let n = 0; n < e.length; n++) {
          const l = e[n]?.textContent.indexOf("仅限商用");
          -1 != l && o[t].remove();
        }
      }
    }
  });
  t.startMonitor();
})();
