// ==UserScript==
// @name         巴哈姆特之互動改回回覆
// @description  把巴哈亂改的互動調整回原本的回覆
// @namespace    nathan60107
// @version      1.3
// @author       nathan60107(貝果)
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=nathan60107
// @include      https://forum.gamer.com.tw/B.php*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/381816/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E4%BA%92%E5%8B%95%E6%94%B9%E5%9B%9E%E5%9B%9E%E8%A6%86.user.js
// @updateURL https://update.greasyfork.org/scripts/381816/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E4%BA%92%E5%8B%95%E6%94%B9%E5%9B%9E%E5%9B%9E%E8%A6%86.meta.js
// ==/UserScript==

/*=======================================================
For使用者 注意以下的情況不會顯示正確的數字
1. 在"本討論串已無文章"的情況因為使用者無法進入文章所以仍舊會顯示"互動/人氣"。
2. 在縮圖模式的mode2之下因為無法得知精確的互動數所以首篇留言數會以"?"來顯示。
=======================================================*/

//=====================以下內容可修改====================

var mode = 1;//mode = 1代表變更為"回覆數/人氣"，mode = 2代表變更為"回覆數/首樓留言數/人氣"。
var 刪除愉悅爬文 = true;//刪除愉悅爬文 = true代表要將縮圖模式旁的愉悅爬文刪除，刪除愉悅爬文 = false代表不刪除。

//=====================以上內容可修改====================

function replace(){
    var list = document.getElementsByClassName("b-list__row");
    if(list.length!=0) {
        var head = document.getElementsByClassName("b-list__head")[0];
        head.outerHTML = head.outerHTML.replace("互動", "回覆"+(mode==2?" / 留言":""));

        for(var i=0; i<list.length; i++){
            if(list[i].children[3]==null)continue;//遇到廣告 不處理
            if(list[i].children[3].outerHTML.match(/tnum=[0-9k]+&/)==null)continue;//遇到"本討論串已無文章" 不處理

            var reply = list[i].children[3].outerHTML.match(/tnum=[0-9k]+&/)[0];//回覆數
            reply = parseInt(reply.substr(5, reply.length-6))-1;
            var interactive = list[i].children[2].outerHTML.match(/>[0-9k]+<\/span>\//)[0];//互動數
            var comment;//首篇留言數
            if(interactive.match("k")!=null)comment = "?";//因互動數無法得知精確值故不顯示首篇留言數
            else {
                interactive = parseInt(interactive.substr(1, interactive.length-9));
                comment = interactive -reply;
            }

            list[i].children[2].outerHTML = list[i].children[2].outerHTML.replace(/<span title=\"互動：[0-9k]+\">[0-9k]+<\/span>\// , "<span title=\"回覆："+reply.toString()+"\">"+reply.toString()+"</span>/"+(mode==2?"\n<span title=\"留言："+comment+"\">"+comment+"</span>/":""));
        }
    }else{
        setTimeout(function(){replace();}, 1000);
    }
}

(function() {
    'use strict';
    setTimeout(function(){replace();}, 1000);
    if(刪除愉悅爬文){
        var pleasantClimb = document.getElementsByClassName("text-tooltip");
        pleasantClimb = pleasantClimb[pleasantClimb.length-1];
        pleasantClimb.parentNode.removeChild(pleasantClimb);
    }
})();