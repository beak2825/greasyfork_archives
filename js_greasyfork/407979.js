// ==UserScript==
// @name         EasyExchangeCredit
// @Namespace    http://tampermonkey.net/
// @version      0.25
// @description  簡單兌換綠意成蒸汽
// @license      MIT
// @author       Wentao MA
// @copyright    2019, Wentao MA (https://openuserjs.org//users/GGsimida)
// @match        http*://steamcn.com/home.php?mod=spacecp&ac=credit&op=exchange
// @match        http*://keylol.com/home.php?mod=spacecp&ac=credit&op=exchange
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @namespace https://greasyfork.org/users/672030
// @downloadURL https://update.greasyfork.org/scripts/407979/EasyExchangeCredit.user.js
// @updateURL https://update.greasyfork.org/scripts/407979/EasyExchangeCredit.meta.js
// ==/UserScript==

var PWDNAME = "steamcn"; //使用此NAME保存密碼
var FIRSTRUN = "firstrun"; //使用此檢測是否第一次運行,並存儲結束綠意數量
var stopBalance;
var pwd = "";
var stopButton;

(function() {
    'use strict';

    if(getPassword()){
        if(!GM_getValue(FIRSTRUN)){
            if(!getStopBalance()){
                return;
            }
            GM_setValue(FIRSTRUN,stopBalance);
        }
        document.body.addEventListener("keypress", pressToStop);
        stopBalance = GM_getValue(FIRSTRUN);
        if(checkCredit()){
            exchangeCredit();
        }
    }
})();

function exchangeCredit(){
    document.getElementById("tocredits").value = 3;
    document.getElementById("fromcredits_0").value = 6;
    document.getElementById("exchangeamount").value = 3;//每次兌換3綠意
    exchangecalcredit();
    document.querySelector("input[type=\"password\"]").value = pwd;
    document.getElementById("exchangeform").submit();
}

function getPassword(){
    if(!GM_getValue(PWDNAME)){
        pwd = prompt("請輸入你的密碼(當兌換結束時會自動刪除密碼)：", "");
        if (pwd !== null && pwd !== "") {
            GM_setValue(PWDNAME, pwd);
            return true;
        }else{
            alert("沒有輸密碼 怎麼種莊稼");
            return false;
        }
    }else{
        pwd = GM_getValue(PWDNAME);
        return true;
    }
}

function getStopBalance(){
    stopBalance = prompt("請輸入結束時綠意數量(至少50哦)：", "50");
    stopBalance = parseInt(stopBalance);
    if((!stopBalance)|| stopBalance<50){
        alert("哎呀，輸入的數字不太對...");
        stopExchange();
        return false;
    }
    return true;
}

function checkCredit(){
    //獲取綠意數量，<=stopBalance自動停止
    var balance =  parseInt(document.querySelectorAll(".creditl.mtm.bbda.cl li")[3].lastChild.textContent);
    if(balance <= stopBalance){
        alert("綠意兌換結束\n剩餘綠意："+balance);
        stopExchange();
        return false;
    }
    return true;
}

function pressToStop(event){
    document.body.removeEventListener("keydown", pressToStop);
    var kCode = event.which || event.keyCode;
    if (kCode == 83 || kCode == 115) {
        stopExchange();
    }
}

function stopExchange(){
    if(GM_getValue(PWDNAME)){
        GM_deleteValue(PWDNAME);
    }
    if(GM_getValue(FIRSTRUN)){
        GM_deleteValue(FIRSTRUN);
    }
    alert("已經停止自動兌換並刪除保存密碼\n\n重新開始請刷新頁面");
}