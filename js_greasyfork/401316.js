// ==UserScript==
// @name         隱藏教學平台上 非本學期的作業
// @version      1.01
// @match        http://elearning.nkust.edu.tw/learn/my_homework.php
// @grant        none

// @description         作者：Shawn Chuang EE
// @description:zh-tw   作者：Shawn Chuang EE
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/401316/%E9%9A%B1%E8%97%8F%E6%95%99%E5%AD%B8%E5%B9%B3%E5%8F%B0%E4%B8%8A%20%E9%9D%9E%E6%9C%AC%E5%AD%B8%E6%9C%9F%E7%9A%84%E4%BD%9C%E6%A5%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/401316/%E9%9A%B1%E8%97%8F%E6%95%99%E5%AD%B8%E5%B9%B3%E5%8F%B0%E4%B8%8A%20%E9%9D%9E%E6%9C%AC%E5%AD%B8%E6%9C%9F%E7%9A%84%E4%BD%9C%E6%A5%AD.meta.js
// ==/UserScript==

/*
修改規則如下:
將本學期課程編號的"開頭前4碼"
輸入到下方的 " targetString "

Example:
登入教學平台，進入到"我的作業"，觀察"課程編號"
假設本學期課程編號前4碼均為 1002
var targetString = "1002";

作者 gitHub:
https://github.com/1105104205
聯絡信箱:
1105104205@nkust.edu.tw

*/

//課程代碼 (前4碼)
var targetString = "1002";

var main = function (){
    //判斷是否在"我的作業": 檢查是否有 "box1" 此class
    var condiction = document.getElementsByClassName("box1");
    if (condiction.length == 0){
        //長度為0，表示沒找到(非該頁) 結束函式
        return;
    }

    //逐層抓取目標Table
    var box2 = document.getElementsByClassName("box2");
    var HW_table = box2[0].getElementsByClassName("table")[1];
    var HW_trs = HW_table.rows;

    //過濾非本學期的課程
    for(var idx = HW_trs.length -1 ; idx >= 0; idx--){
        //抓取該列的課程代碼
        var string = HW_trs[idx].getElementsByClassName("text-left")[0].innerText;

        //不符合就刪除該列
        if(!string.match(targetString)){
            document.getElementsByClassName("box2")[0].getElementsByClassName("table")[1].deleteRow(idx);
        }
    }
}


if (['complete', 'loaded', 'interactive'].indexOf(document.readyState) !== -1) main();
else window.addEventListener('DOMContentLoaded', main);
