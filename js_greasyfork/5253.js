// ==UserScript==
// @name       论坛最新帖
// @author	monsm
// @namespace  http://weibo.com/monsm
// @version    1.2
// @description  论坛点击最新永远获取最新，不是伪最新
// @match      http*://*bbs*
// @match      http*://*BBS*
// @match      http*://*FORUM*
// @match      http*://*forum*
// @match      http*://*/forum*
// @match      http*://*/FORUM*

// @copyright  2013+, monsm
// @license monsm
// @downloadURL https://update.greasyfork.org/scripts/5253/%E8%AE%BA%E5%9D%9B%E6%9C%80%E6%96%B0%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/5253/%E8%AE%BA%E5%9D%9B%E6%9C%80%E6%96%B0%E5%B8%96.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var false_reg = "filter=lastpost&orderby=lastpost";
    var true_reg = "filter=author&orderby=dateline";
    if (window.location.href.indexOf(false_reg) > 0) {
        window.location.href = window.location.href.replace(false_reg, true_reg);
    }
    return;
})();