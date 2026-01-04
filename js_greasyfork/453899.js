// ==UserScript==
// @name         Hackergame2022-XCaptcha
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  XCaptcha
// @author       Patchouli_Nine
// @match        http://202.38.93.111:10047/xcaptcha
// @icon         https://www.google.com/s2/favicons?sz=64&domain=93.111
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453899/Hackergame2022-XCaptcha.user.js
// @updateURL https://update.greasyfork.org/scripts/453899/Hackergame2022-XCaptcha.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function add(num1, num2) {
        let maxLength = Math.max(num1.length, num2.length);
        //num1和num2位数对齐，位数较小的前面补0
        num1 = num1.padStart(maxLength, '0');
        num2 = num2.padStart(maxLength, '0');
        let res = '';//存放最后得到的结果
        let figure = 0;//figure = 两个数字对应位数数值相加 + 进位
        let currentNum = 0;//对应位数的结果
        let carry = 0;//进位
        for(let i=num1.length-1; i>=0; i--) {
            figure = parseInt(num1[i]) + parseInt(num2[i]) + carry;
            currentNum = figure % 10;
            carry = Math.floor(figure / 10);
            res = currentNum + res;
        }
        return res;
    }
    var lst=document.getElementsByClassName("form-group");
    for(var i=1;i<=3;i++){
        var k=lst[i-1].children[0].innerHTML.split(' ')[0].split('+');
        document.getElementById("captcha"+i).value=add(k[0],k[1]);
    }
    document.getElementById('submit').click();
    // Your code here...
})();