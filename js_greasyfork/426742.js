// ==UserScript==
// @name         訂便當 自動輸入驗證碼
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自動輸入網頁「訂便當」登入驗證碼
// @author       CrispyFriedChicken0404
// @match        https://dinbendon.net/*
// @icon         https://dinbendon.net/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426742/%E8%A8%82%E4%BE%BF%E7%95%B6%20%E8%87%AA%E5%8B%95%E8%BC%B8%E5%85%A5%E9%A9%97%E8%AD%89%E7%A2%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/426742/%E8%A8%82%E4%BE%BF%E7%95%B6%20%E8%87%AA%E5%8B%95%E8%BC%B8%E5%85%A5%E9%A9%97%E8%AD%89%E7%A2%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
       let exp = document.querySelector('#signInPanel_signInForm > table > tbody > tr:nth-child(3) > td.alignRight').textContent.toString();
       exp = exp.replace('=','').replace('＝','').replace('等於','').replace(' 加 ','+').replace('＋','+');
       let numbers = exp.split('+');
       let answer = parseInt(numbers[0]) + parseInt(numbers[1]);
       document.querySelector('#signInPanel_signInForm > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=text]').value = answer;
})();