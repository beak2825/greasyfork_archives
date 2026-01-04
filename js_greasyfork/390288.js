// ==UserScript==
// @name          自动审核
// @description   一键通过
// @namespace     Violentmonkey Scripts
// @author        xq
// @run-at         document-end
// @include       *://my.jjwxc.net/backend/bbs_check.php*
// @grant         GM_addStyle
// @version       0.0.2.20190919
// @downloadURL https://update.greasyfork.org/scripts/390288/%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%A0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/390288/%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%A0%B8.meta.js
// ==/UserScript==

function autopass () {
    var btns = document.getElementsByTagName('input');
    if (btns.length > 2) {
        if (btns[0].value=="全选") {
            btns[0].click();
        }
        for( var i = btns.length -2 ; i>=0 ; i--) {
            if (btns[i].value=="全选") {
                btns[i].click();
            }
        }
        for( var j = btns.length -2 ; j>=0 ; j--){
            if (btns[j].value=="√批量通过") {
                btns[j].click();
            }
        }
    }
}

autopass();