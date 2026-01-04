// ==UserScript==
// @name         alabout連結縮址 v1.1
// @namespace    https://www.facebook.com/airlife917339
// @version      1.1
// @description  feel free to donate: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @match        http://alabout.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381574/alabout%E9%80%A3%E7%B5%90%E7%B8%AE%E5%9D%80%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/381574/alabout%E9%80%A3%E7%B5%90%E7%B8%AE%E5%9D%80%20v11.meta.js
// ==/UserScript==

// 1. 找出所有的a標籤
var url_count = document.getElementsByTagName('a').length;  // 總共有幾個a標籤
// 2. 處理所有的a標籤，在a標籤中找出是http開頭的
var cur_url_text = '';  // 宣告當前url的innerText
var cur_url = '';       // 宣告當前的url
var url_dec = '';       // 宣告url_decode

for(var i=0; i<=url_count-1; i++) {
    cur_url_text = document.getElementsByTagName('a')[i].innerText;
    if(cur_url_text.substr(0, 4)=='http') {
        // 第i個符合是http開頭的a標籤
        // 3. 符合是http開頭的a標籤後，decode url
        cur_url = document.getElementsByTagName('a')[i].href;   // 賦值當前為第i個的url
        url_dec = decodeURIComponent(cur_url);                  // 將當前的url_decode
        if(url_dec.substr(0, 31)=="http://alabout.com/j.phtml?url=") {
            // 如果符合特定alabout轉址網站，才執行縮址
            cur_url = url_dec.substr(31);   // 將當前的url縮址
            document.getElementsByTagName('a')[i].href = cur_url;       // 改變url成新的縮址
            document.getElementsByTagName('a')[i].innerText = cur_url;  // 改變text成新的縮址
        }
    }
}