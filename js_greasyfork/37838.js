// ==UserScript==
// @name         TPCU_AutoLogin
// @namespace    undefined
// @version      1.0
// @description  自動登入 台北城市科技大學校務資訊系統
// @author       howpwn(小曹)

// @match        *://siw71.tpcu.edu.tw/tsint/*
// @match        *://siw72.tpcu.edu.tw/tsint/*
// @match        *://siw77.tpcu.edu.tw/tsint/*
// @match        *://siw78.tpcu.edu.tw/tsint/*

// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37838/TPCU_AutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/37838/TPCU_AutoLogin.meta.js
// ==/UserScript==


/*
   使用注意事項：

   預設開啟"自動填入驗證碼"。
   自動登入為"不穩定"功能，
   會常常遇到"驗證碼輸入錯誤或瀏覽器開導致驗證碼失效，請重新登入"的問題，
   此問題無解，校方問題。
   還是可以自動登入，只是要多按幾次"驗證碼輸入錯誤"的那個確認按鈕。

   建議使用瀏覽器自動記憶帳密 + 自動驗證碼功能就好。
*/


/* 自動登入設定 */
var auto_login = "false"; // 若要啟用自動登入功能，將"false"改為"true"

/* 若不啟用自動登入功能，以下免填 */
var username = "";        // 在雙引號裡填入你的帳號
var password = "";        // 在雙引號裡填入你的密碼


window.onload=function(){
    not_CAPTCHA = eval(window.frames[2].document.querySelectorAll('font')[6].innerText.replace(/=/, ''));
    window.frames[2].document.querySelector('#ls_chkrand').value = not_CAPTCHA;
};

if(username != "" && password != "" && auto_login == "true"){
    thisform.uid.value = username;
    thisform.pwd.value = password;
    chk.click();
}