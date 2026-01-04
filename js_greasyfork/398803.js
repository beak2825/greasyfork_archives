// ==UserScript==
// @name             微软文档优先简体中文
// @namespace        https://github.com/Roger-WIN/greasemonkey-user-scripts
// @description      Microsoft Docs 微软文档优先使用简体中文浏览
// @version          1.0.6
// @match            *docs.microsoft.com/*
// @match            *support.microsoft.com/*
// @match            *learn.microsoft.com/*
// @require          https://cdn.jsdelivr.net/gh/Roger-WIN/greasemonkey-user-scripts@a44e2ee0a802fd0fbed6c461196188237294fc32/Chinese%20(Simplified)%20first/_common/language-first.js
// @author           神齐 <RogerKung.WIN@outlook.com>
// @license          MIT
// @supportURL       https://github.com/Roger-WIN/greasemonkey-user-scripts/issues
// @contributionURL  https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=RogerKung.WIN@outlook.com&item_name=Greasy+Fork+donation
// @downloadURL https://update.greasyfork.org/scripts/398803/%E5%BE%AE%E8%BD%AF%E6%96%87%E6%A1%A3%E4%BC%98%E5%85%88%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/398803/%E5%BE%AE%E8%BD%AF%E6%96%87%E6%A1%A3%E4%BC%98%E5%85%88%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(() => {
    // 目标语言
    const lang_target = "/zh-cn/";
    convertWithExclude(lang_target, ['/answers/']);
})();