// ==UserScript==
// @name         巴哈姆特之查詢該使用者本看板發文
// @description  在C頁的使用者名稱後面新增「本板發文」按鈕，以快速查詢該使用者本板發文。
// @namespace    nathan60107
// @version      1.2
// @author       nathan60107(貝果)
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=nathan60107
// @match        *forum.gamer.com.tw/C*
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/432907/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E6%9F%A5%E8%A9%A2%E8%A9%B2%E4%BD%BF%E7%94%A8%E8%80%85%E6%9C%AC%E7%9C%8B%E6%9D%BF%E7%99%BC%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/432907/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E6%9F%A5%E8%A9%A2%E8%A9%B2%E4%BD%BF%E7%94%A8%E8%80%85%E6%9C%AC%E7%9C%8B%E6%9D%BF%E7%99%BC%E6%96%87.meta.js
// ==/UserScript==

(function() {
    let bsn = window.location.href.match(/.*(?<!sub)bsn=(\d+).*/)[1]
    for(let user of jQuery(".c-post__header__author")){
        let uid = jQuery(user).find(".userid")[0].innerText
        jQuery(user).append(`
<a class="floor tippy-gpbp" data-tooltipped="" data-original-title="本板發文" href="https://forum.gamer.com.tw/Bo.php?bsn=${bsn}&qt=6&q=${uid}">
    本板發文
</a>
`)
    }
})();