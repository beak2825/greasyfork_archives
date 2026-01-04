// ==UserScript==
// @name         六角學院自動登入腳本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用戶自動登入系統，適用於六角學院的程式勇者村。如需使用，請至https://networkkenny.github.io/login_script/
// @author       Kenny526
// @match        https://rpg.hexschool.com/login
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459066/%E5%85%AD%E8%A7%92%E5%AD%B8%E9%99%A2%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/459066/%E5%85%AD%E8%A7%92%E5%AD%B8%E9%99%A2%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    let epTurn = {
        'example@gmail.com':'1111',
        'example2@gmail.com':'11111'
    }
    const button = document.querySelector('.btn-block');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    password.type = 'text';
    button.addEventListener('click', function(){
        let input = email.value;
        password.value = epTurn[input];
    })
})();