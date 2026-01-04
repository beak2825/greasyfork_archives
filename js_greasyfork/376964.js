// ==UserScript==
// @name         巴哈姆特之手機版網頁自動轉跳電腦版
// @description  自動切換成電腦版，省去手動切換的麻煩。
// @namespace    nathan60107
// @version      1.2
// @author       nathan60107(貝果)
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=nathan60107
// @include      *//m.gamer.com.tw*
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/376964/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%B2%E9%A0%81%E8%87%AA%E5%8B%95%E8%BD%89%E8%B7%B3%E9%9B%BB%E8%85%A6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/376964/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%B2%E9%A0%81%E8%87%AA%E5%8B%95%E8%BD%89%E8%B7%B3%E9%9B%BB%E8%85%A6%E7%89%88.meta.js
// ==/UserScript==

(function() {
    var target = document.getElementsByClassName("gtm-nav-backpc");
    console.log(target)
    if(target != null){
        var dest = target[0].href;
        window.location.href = dest;
    }
})();