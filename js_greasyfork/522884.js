// ==UserScript==
// @name                Default Trusted Types Policy for All Pages
// @namespace           TTP
// @match               *://*/*
// @version             1.0.2
// @author              CY Fung
// @license             MIT
// @run-at              document-start
// @grant               none
// @unwrap
// @inject-into         page
// @allFrames           true
// @description         To Add Default Trusted Types Policy for All Pages
// @description:ja      すべてのページにデフォルトのTrusted Typesポリシー (TTP) を追加する
// @description:zh-TW   為所有頁面新增預設的Trusted Types策略 (TTP)
// @description:zh-CN   为所有页面新增默认的Trusted Types策略 (TTP)
// @downloadURL https://update.greasyfork.org/scripts/522884/Default%20Trusted%20Types%20Policy%20for%20All%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/522884/Default%20Trusted%20Types%20Policy%20for%20All%20Pages.meta.js
// ==/UserScript==

if (typeof trustedTypes !== 'undefined' && trustedTypes.defaultPolicy === null) {
  let s = s => s, [p, q, r] = [s, s, s]; s = trustedTypes;
  s.createPolicy('default', { createHTML: s => p(s), createScriptURL: s => q(s), createScript: s => r(s) });
  s.$Ω = s.createPolicy;
  s.createPolicy = function (a, b) {
    if (a === 'default' && s) {
      s = 0;
      const { createHTML: x, createScriptURL: y, createScript: z } = b;
      x && (p = x);
      y && (q = y);
      z && (r = z);
      return this.defaultPolicy;
    }
    return this.$Ω(...arguments);
  };
}