// ==UserScript==
// @name             中文维基百科优先简体中文
// @namespace        https://github.com/Roger-WIN/greasemonkey-user-scripts
// @description      Wikipedia 维基百科（中文）优先使用简体中文浏览
// @version          1.3.2
// @match            *zh.wikipedia.org/*
// @match            *zh.m.wikipedia.org/*
// @require          https://cdn.jsdelivr.net/gh/Roger-WIN/greasemonkey-user-scripts@bf3bbd28ab2ecfc677a3836ddc8a9c7943dca2d1/Chinese%20(Simplified)%20first/_common/language-first.js
// @author           神齐 <RogerKung.WIN@outlook.com>
// @license          MIT
// @supportURL       https://github.com/Roger-WIN/greasemonkey-user-scripts/issues
// @contributionURL  https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=RogerKung.WIN@outlook.com&item_name=Greasy+Fork+donation
// @downloadURL https://update.greasyfork.org/scripts/391554/%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E4%BC%98%E5%85%88%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/391554/%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E4%BC%98%E5%85%88%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(() => {
    // 目标语言
    const lang_target = "/zh-cn/";
    // 表示页面是否指定语言
    let langs_head = "/zh";
    let lang_default = "/wiki/";
    let flags_exclude = ["index.php", "/w/"];
    if (convertSubdomain()) {
        convertWithExclude(lang_target, flags_exclude, langs_head, lang_default);
    }
    convertToDesktop(2, ".m");
})();