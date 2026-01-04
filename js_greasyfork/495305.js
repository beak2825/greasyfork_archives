// ==UserScript==
// @name         MCU login
// @description  MCU login skip the stupid questionnaire
// @name:zh-TW   銘傳大學學生資訊系統自動登入
// @description:zh-TW 自動登入銘傳大學學生資訊系統，跳過問卷調查
// @namespace    https://mcu-file.svnet.uk/
// @version      1.6
// @author       YANG
// @match        *://www.mcu.edu.tw/*
// @license      GPL-3.0
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.log
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/495305/MCU%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/495305/MCU%20login.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    var homepage = "https://www.mcu.edu.tw/student/new-query/Default.asp";
    if(window.location.href == "https://www.mcu.edu.tw/student/msg.asp?msg=session+%BF%F2%A5%A2%2C+%BD%D0%AD%AB%B7s%B5n%A4J%21&url=-1"){
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++){
            document.cookie = cookies[i] + "=; expires=Sun, 04 June 1989 00:00:00 UTC; path=/;";
        }
        window.location.href = homepage;
    }
    if(!window.location.href.includes(homepage)){
        const originalWindowOpen = window.open;
        unsafeWindow.open = function(){};
        if(window.location.href == "https://www.mcu.edu.tw/student/new-query/Default_LogOut.asp"){
            await GM.log("Clear all data");
            await GM.setValue("no", 0);
            await GM.setValue("pw", 0);
            setTimeout(function(){window.location.href = homepage;}, 1000);
        }
        else{
            unsafeWindow.open = originalWindowOpen;
        }   
    }
    if(window.location.href == "https://www.mcu.edu.tw/student/new-query/-1"){
        //清除所有cookie
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++){
            document.cookie = cookies[i] + "=; expires=Sun, 04 June 1989 00:00:00 UTC; path=/;";
        }
        window.location.href = homepage;
    }
    if(window.location.href.includes(homepage)){
        //關閉alert彈窗
        unsafeWindow.alert = function(){};
    }
    if(window.document.cookie.match(/(^| )srlogin=true(;|$)/) != null && window.location.href.includes("https://www.mcu.edu.tw/student/msg.asp")){
        await GM.setValue("no", 0);
        await GM.setValue("pw", 0);
        document.cookie = "srlogin=; expires=Sun, 04 June 1989 00:00:00 UTC; path=/;";
    }
    if(window.document.cookie.match(/(^| )srlogin=true(;|$)/) != null && !window.location.href.includes(homepage)){
        //清除cookie
        document.cookie = "srlogin=; expires=Sun, 04 June 1989 00:00:00 UTC; path=/;";
        //跳轉到首頁
        window.location.href = homepage;
    }
    else{
        //清除cookie
        document.cookie = "srlogin=; expires=Sun, 04 June 1989 00:00:00 UTC; path=/;";
    }
    //如果已經登入，則不再執行
    if(document.readyState !== "loading"){
        rwgosubmit();
    }else{
        document.addEventListener("DOMContentLoaded", async function() {
            rwgosubmit();
        });
    }

    async function rwgosubmit(){
        if(document.getElementById("id1") != null){
            //複寫gosubmit函數
            unsafeWindow.gosubmit = async function() {
                if (check()) {
                    document.cookie = "srlogin=true; path=/";
                    if(await GM.getValue("no") == undefined || await GM.getValue("no") == null || await GM.getValue("no") == 0){
                        await GM.setValue("no", document.getElementById("id1").value);
                        //使用base64儲存密碼
                        await GM.setValue("pw", btoa(document.getElementById("id2").value));
                        console.log("Save account and password");
                    }
                    f.action = "Chk_Pass_New_v2.asp";
                    f.submit();
                }
            };
            //判斷是否有儲存過帳號密碼
            if(await GM.getValue("no") != undefined && await GM.getValue("no") != null && await GM.getValue("no") != 0) {
                document.getElementById("id1").value = await GM.getValue("no");
                document.getElementById("id2").value = atob(await GM.getValue("pw"));
                gosubmit();
            }
        }
    }
})();