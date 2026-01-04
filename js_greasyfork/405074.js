// ==UserScript==
// @name         巴哈姆特反種族歧視
// @namespace    巴哈姆特反種族歧視
// @version      20200610
// @description  避免種族歧視的好幫手
// @author       johnny860726
// @match        https://home.gamer.com.tw/friendList.php*
// @match        https://home.gamer.com.tw/homeindex.php*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/405074/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8F%8D%E7%A8%AE%E6%97%8F%E6%AD%A7%E8%A6%96.user.js
// @updateURL https://update.greasyfork.org/scripts/405074/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8F%8D%E7%A8%AE%E6%97%8F%E6%AD%A7%E8%A6%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elems = document.querySelectorAll(".friend_menu_li>a, .BH-slave_btnA");
    for (var i=0; i<elems.length; i++) {
        switch (true) {
            case (elems[i].parentNode.classList.contains("friend_menu_li")):
                elems[i].innerHTML = elems[i].innerHTML.replace('黑名單', '封鎖名單');
                break;
            case (elems[i].classList.contains("BH-slave_btnA")):
                elems[i].innerHTML = elems[i].innerHTML.replace('黑名單', '封鎖');
                break;
            default:
                break;
        }
    }
    setInterval(function () {
        var elem = document.querySelector("div.dialogify__body>p, .friendlist_user_hint>p");
        if (elem.innerHTML.includes('黑名單')) {
            elem.innerHTML = elem.innerHTML.replace('加為黑名單', '封鎖此人');
            elem.innerHTML = elem.innerHTML.replace('已加進黑名單', '已加進封鎖名單');
            elem.innerHTML = elem.innerHTML.replace('已移出黑名單', '已移出封鎖名單');
        }
    }, 100);
})();