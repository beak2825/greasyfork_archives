// ==UserScript==
// @name         自動登入
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自動點擊登入
// @author       You
// @match        https://highschool.kh.edu.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491874/%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/491874/%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5.meta.js
// ==/UserScript==
class A {
    constructor(){
       this.autoClick()
    }
    autoClick(){
        const textElement = document.getElementById('validateCode');

        if(1>0){
            textElement.addEventListener('input', function(event) {
            const text = event.target.value.trim(); 
            if (text.length == 4) {
                console.log('驗證碼已填上：', text);
                setTimeout(() => document.querySelector('#login').click(),1000);
                //setTimeout(() => document.querySelector('#login').click(),1000);
            }
            });
        }
         else {
            // If the login button is not found, check again after a short delay
            setTimeout(() => this.autoClick(), 500);
    }
    }
}
(function() {
    'use strict';
    new A();
})();
(function() {
    'use strict';
    document.querySelector('input[name="loginId"]').value = '自行填入帳號';
    document.querySelector('input[name="password"]').value = '自行填入密碼';
})();