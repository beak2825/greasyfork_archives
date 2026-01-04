// ==UserScript==
// @name             MDN Web 文档优先简体中文
// @namespace        https://github.com/Roger-WIN/greasemonkey-user-scripts
// @description      MDN Web Docs（MDN Web 文档）优先使用简体中文浏览
// @version          1.0.4
// @match            *developer.mozilla.org/*
// @require          https://cdn.jsdelivr.net/gh/Roger-WIN/greasemonkey-user-scripts@a44e2ee0a802fd0fbed6c461196188237294fc32/Chinese%20(Simplified)%20first/_common/language-first.js
// @author           神齐 <RogerKung.WIN@outlook.com>
// @license          MIT
// @supportURL       https://github.com/Roger-WIN/greasemonkey-user-scripts/issues
// @contributionURL  https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=RogerKung.WIN@outlook.com&item_name=Greasy+Fork+donation
// @downloadURL https://update.greasyfork.org/scripts/398804/MDN%20Web%20%E6%96%87%E6%A1%A3%E4%BC%98%E5%85%88%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/398804/MDN%20Web%20%E6%96%87%E6%A1%A3%E4%BC%98%E5%85%88%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(() => {
    // 目标语言
    const lang_target = "/zh-CN/";
    convertWithoutExclude(lang_target);
})();