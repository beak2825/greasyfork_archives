// ==UserScript==
// @name                书剑永恒MUD - 替换空格
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @version             1.0.0
// @description         将表格中的 "&nbsp;" 替换成 "&ensp;"，优代其在非 IE 上的显示效果
// @author              pana
// @license             GNU General Public License v3.0 or later
// @match               *://www.sjever.net/bbs/forum.php*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/405957/%E4%B9%A6%E5%89%91%E6%B0%B8%E6%81%92MUD%20-%20%E6%9B%BF%E6%8D%A2%E7%A9%BA%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/405957/%E4%B9%A6%E5%89%91%E6%B0%B8%E6%81%92MUD%20-%20%E6%9B%BF%E6%8D%A2%E7%A9%BA%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function init() {
        document.querySelectorAll('table.t_table').forEach((item) => {
            item.innerHTML = item.innerHTML.replace(/&nbsp;/g, "&ensp;");
        });
    }
    init();
})();
