// ==UserScript==
// @name         巴哈姆特之禁用場外廣場聊天室
// @description  場外的廣場聊天室放著就會不斷載入很多資源，ban掉節省資源。
// @namespace    nathan60107
// @version      1.1
// @author       nathan60107(貝果)
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=nathan60107
// @match        https://forum.gamer.com.tw/B.php?*bsn=60076*
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/431219/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E7%A6%81%E7%94%A8%E5%A0%B4%E5%A4%96%E5%BB%A3%E5%A0%B4%E8%81%8A%E5%A4%A9%E5%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/431219/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E7%A6%81%E7%94%A8%E5%A0%B4%E5%A4%96%E5%BB%A3%E5%A0%B4%E8%81%8A%E5%A4%A9%E5%AE%A4.meta.js
// ==/UserScript==

(function() {
    jQuery(".as-mes-wrapper").remove()
    jQuery("#chatRoom").remove()
})();