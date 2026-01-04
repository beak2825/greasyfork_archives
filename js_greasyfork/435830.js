// ==UserScript==
// @name         巴哈姆特之單張圖片放大
// @description  將圖片網址後的w=?去除以取得原始大小圖片
// @namespace    nathan60107
// @author       nathan60107(貝果)
// @version      1.0
// @license      MIT
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=nathan60107
// @match        https://truth.bahamut.com.tw/*
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/435830/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E5%96%AE%E5%BC%B5%E5%9C%96%E7%89%87%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/435830/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E5%96%AE%E5%BC%B5%E5%9C%96%E7%89%87%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
    let url = window.location.href;
    if(url.match(/\?w=/)){
        window.location.href = url.substr(0, url.match(/\?w=/).index)
    }
})();