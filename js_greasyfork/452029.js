// ==UserScript==
// @name         明道自動使用帳號密碼模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在https://www.mingdao.edu.tw/homeX/Web/?stu的時候，會自動跳到帳號密碼模式
// @author       You
// @match        https://www.mingdao.edu.tw/homeX/Web/?stu
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452029/%E6%98%8E%E9%81%93%E8%87%AA%E5%8B%95%E4%BD%BF%E7%94%A8%E5%B8%B3%E8%99%9F%E5%AF%86%E7%A2%BC%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/452029/%E6%98%8E%E9%81%93%E8%87%AA%E5%8B%95%E4%BD%BF%E7%94%A8%E5%B8%B3%E8%99%9F%E5%AF%86%E7%A2%BC%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log('明道自動帳號密碼模式 啟用');
    var btn = document.querySelector(".style12");
    if(btn != null) {
       console.log("有抓到 帳號密碼模式 的按鈕");
       btn.click();
    } else {
       console.log("沒有抓到 帳號密碼模式 的按鈕");
    }


   

    

})();


