// ==UserScript==
// @name         空中网特贵商城增强-启用点券结算
// @namespace     http://TouHou.DieMoe.net/
// @version      0.2
// @description  修正特贵商城如果点券余额不足结算前的原价，无法使用点券进行交易的问题。
// @author       DieMoe
// @run-at       document-end
// @match       *://mall.kongzhong.com/cart/toSettle*
// @grant          unsafeWindow
// @compatible firefox
// @compatible chrome
// @compatible edge
// @downloadURL https://update.greasyfork.org/scripts/29640/%E7%A9%BA%E4%B8%AD%E7%BD%91%E7%89%B9%E8%B4%B5%E5%95%86%E5%9F%8E%E5%A2%9E%E5%BC%BA-%E5%90%AF%E7%94%A8%E7%82%B9%E5%88%B8%E7%BB%93%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/29640/%E7%A9%BA%E4%B8%AD%E7%BD%91%E7%89%B9%E8%B4%B5%E5%95%86%E5%9F%8E%E5%A2%9E%E5%BC%BA-%E5%90%AF%E7%94%A8%E7%82%B9%E5%88%B8%E7%BB%93%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    pay_0.removeAttribute("disabled");
})();