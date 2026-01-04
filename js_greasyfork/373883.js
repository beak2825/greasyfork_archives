// ==UserScript==
// @name         巴哈姆特之訂閱看板跳過進板圖頁面
// @description  可以直接跳過進板圖頁面，不用再等進板圖載入啦。
// @namespace    nathan60107
// @version      2.4
// @author       nathan60107(貝果)
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=nathan60107
// @include      *gamer.com.tw/*
// @exclude      *ani.gamer.com.tw*
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @run-at       document-end
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/373883/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E8%A8%82%E9%96%B1%E7%9C%8B%E6%9D%BF%E8%B7%B3%E9%81%8E%E9%80%B2%E6%9D%BF%E5%9C%96%E9%A0%81%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/373883/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E8%A8%82%E9%96%B1%E7%9C%8B%E6%9D%BF%E8%B7%B3%E9%81%8E%E9%80%B2%E6%9D%BF%E5%9C%96%E9%A0%81%E9%9D%A2.meta.js
// ==/UserScript==

function Insert(){
    if(jQuery("#topBarMsgList_forum")[0]){
        let target = jQuery("#topBarMsgList_forum")[0].innerHTML;
        target = target.replace(/A.php\?bsn=/g, "B.php?bsn=");
        jQuery("#topBarMsgList_forum")[0].innerHTML = target;
    }else{
        setTimeout(function(){Insert();}, 500);
    }
};

jQuery("#topBar_forum").on("click", Insert)
