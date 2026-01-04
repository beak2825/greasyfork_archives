// ==UserScript==
// @name         巴哈姆特刪除指定最近閱覽看板
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  刪除巴哈姆特上指定的最近閱覽看板
// @author       skypiea1993（嗄嗚）
// @match        https://forum.gamer.com.tw/*
// @exclude      https://forum.gamer.com.tw/*.php?bsn=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371072/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%88%AA%E9%99%A4%E6%8C%87%E5%AE%9A%E6%9C%80%E8%BF%91%E9%96%B1%E8%A6%BD%E7%9C%8B%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/371072/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%88%AA%E9%99%A4%E6%8C%87%E5%AE%9A%E6%9C%80%E8%BF%91%E9%96%B1%E8%A6%BD%E7%9C%8B%E6%9D%BF.meta.js
// ==/UserScript==

/*
   ver0.1.1 加入排除網址 使特定部分網址不執行腳本
*/


(function() {
    'use strict';

    //找最近閱覽看板的element
    var board_ul = document.getElementById("forum-lastBoard").children;
    var board_li = board_ul[0].children;

    //放新增的checkbox
    var board_cbbox = [];

    //幫list新增checkbox
    for(var index=0; index<board_li.length; index++){
        //board_li[index].style.display = "flex";
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        board_li[index].appendChild(checkbox);
        board_cbbox.push(board_li[index].children[1]);

        board_li[index].children[0].style.display = "inline-block";
        board_li[index].children[1].style.display = "inline-block";
        board_li[index].children[1].style = "float:right"
    }

    //新增刪除按鈕
    var deletebutton = document.createElement("button");
    var buttontext = document.createTextNode("刪除勾選之看板");
    deletebutton.style.display="block";
    deletebutton.style.margin = "auto";
    deletebutton.appendChild(buttontext);
    deletebutton.onclick = function(){deleteboard(board_li,board_cbbox)};
    document.getElementById("forum-lastBoard").appendChild(deletebutton);

})();

function deleteboard(list,checkbox){

    //獲取 最近閱覽看板 紀錄資料
    //[["號嗎","看板名稱"],["號嗎","看板名稱"],....] ← 資料紀錄的方式
    var lastboardcookie = getCookie('ckBH_lastBoard');
    console.log(lastboardcookie);

    //剝掉最外層的中括號
    lastboardcookie = lastboardcookie.substring(1,lastboardcookie.length-1);

    //將看板資料一個個切出來
    var board=[];
    for(var i=0; i<list.length; i++){
        var boarddata = lastboardcookie.substring(0,lastboardcookie.indexOf(']')+1);
        board[i] = boarddata;
        lastboardcookie = lastboardcookie.substring(boarddata.length+1,lastboardcookie.length);
    }

    //建立新的 最近閱覽看板 紀錄資料
    var newboardcookie="";
    for(var j=0; j<list.length; j++){
        if(checkbox[j].checked == false){
            newboardcookie = newboardcookie + ',' + board[j];
        }
    }

    //刪除多餘的逗號
    newboardcookie = newboardcookie.substring(1,newboardcookie.length);

    //把被剝掉的最外層中括號加回來
    newboardcookie = "[" + newboardcookie + "]";

    //將舊的資料改寫成新的
    setCookie('ckBH_lastBoard', newboardcookie ,14);

    //重新整理頁面
    location.reload();
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=.gamer.com.tw;path=/";
}