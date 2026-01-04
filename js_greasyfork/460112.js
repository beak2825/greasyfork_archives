// ==UserScript==
// @name         巴哈跳過看版圖
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  巴哈轉跳看版圖
// @author       (原作者)nathan60107(貝果)
// @match        https://forum.gamer.com.tw/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460112/%E5%B7%B4%E5%93%88%E8%B7%B3%E9%81%8E%E7%9C%8B%E7%89%88%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/460112/%E5%B7%B4%E5%93%88%E8%B7%B3%E9%81%8E%E7%9C%8B%E7%89%88%E5%9C%96.meta.js
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