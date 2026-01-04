// ==UserScript==
// @name         mask card helper(part2)
// @version      1.0.4
// @description   口罩小幫手
// @match        https://medvpn.nhi.gov.tw/*
// @author       Godpriest
// @grant        GM_addStyle
// @run-at       document-start
// @namespace https://greasyfork.org/users/459415
// @downloadURL https://update.greasyfork.org/scripts/397943/mask%20card%20helper%28part2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/397943/mask%20card%20helper%28part2%29.meta.js
// ==/UserScript==

//抓取背景
var bg2 = document.getElementsByClassName("main");
//抓取title的文字
var titletext2 = document.getElementsByClassName("title");

//偵測到alert視窗並執行動作
function myAlert (str) {
    console.log ("kill alert!", str);

    //成功過卡就不動作，其他的警告視窗則改變背景顏色並顯示
    if(str.indexOf('成功') >= 0 ){}else{
        if(str.indexOf('超過') >= 0 ){
        document.cookie = "finish=2";
        }
        setTimeout(function(){
                 titletext2[0].innerHTML = '<font size="7"><font color="red"><b>警告:'+ str +'，請按[F7]清除或按[F8]/[F9]繼續!</b></font></font>'
    },100);
        //底下兩行4.23後要刪除
    document.cookie = "kid=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "adult=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    bg2[0].style.backgroundColor = "#FF3333";}
    }

unsafeWindow.alert = exportFunction(myAlert, unsafeWindow);