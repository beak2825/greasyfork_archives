// ==UserScript==
// @name             萌娘百科优先简体中文
// @namespace        https://github.com/Roger-WIN/greasemonkey-user-scripts
// @description      Moegirl 萌娘百科优先使用简体中文浏览
// @version          1.2.0
// @match            *zh.moegirl.org/*
// @match            *mzh.moegirl.org/*
// @match            *zh.moegirl.org.cn/*
// @match            *mzh.moegirl.org.cn/*
// @require          https://cdn.jsdelivr.net/gh/Roger-WIN/greasemonkey-user-scripts@bf3bbd28ab2ecfc677a3836ddc8a9c7943dca2d1/Chinese%20(Simplified)%20first/_common/language-first.js
// @author           神齐 <RogerKung.WIN@outlook.com>
// @license          MIT
// @supportURL       https://github.com/Roger-WIN/greasemonkey-user-scripts/issues
// @contributionURL  https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=RogerKung.WIN@outlook.com&item_name=Greasy+Fork+donation
// @downloadURL https://update.greasyfork.org/scripts/391552/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E4%BC%98%E5%85%88%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/391552/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E4%BC%98%E5%85%88%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(() => {
    // 目标语言
    const lang_target = "/zh-cn/";
    // 表示页面是否指定语言
    let langs_head = "/zh";
    // 表示路径中含有文件，因为文件的扩展名以 . 开头
    let flags_exclude = ["index.php", "."];
    convertWithExclude(lang_target, flags_exclude, langs_head);
    convertToDesktop(0);
})();