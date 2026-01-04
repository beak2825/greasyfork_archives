// ==UserScript==
// @name         问卷星回答
// @namespace    http://tampermonkey.net/
// @version      2024-02-23
// @description  自动答题问卷星，支持单选多选，不支持自动提交
// @author       You
// @match        https://www.wjx.cn/请替换为问卷网址
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wjx.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488109/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/488109/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //在这里修改答案
    var answer = ['a','b','c','c','e',//1-5
                  'abc','b','c','c','c',//6-10
                  'a','b','c','c','c',//11-15
                  'a','b','c','c','c',//16-20
                  'a','b','c','c','c']//21-25
    var times = 1;//答题次数,没用，没通过验证
    var q;//定位答案按钮
    var submit;
    var check;
    while(times--){
        for (var i = 0; i < answer.length; i++) {
            console.log(answer[i])
            var str = answer[i]
            var chars = str.split('');
            chars.forEach(function(char) {
                q = document.querySelector(`div.label[for="q${i+1}_${String.fromCharCode(char.charCodeAt(0) - 48)}"]`);
                console.log(`div.label[for="q${i+1}_${String.fromCharCode(char.charCodeAt(0) - 48)}"]`)
                q.click();
            })
        }
        setTimeout(function() {window.scrollTo(0, document.body.scrollHeight)},1000);
      /*  submit = document.querySelector('div.submitbtn.mainBgColor');
        console.log(submit)
        setTimeout(function() {submit.click()},1000);

        setTimeout(function() {var confirmButton = document.querySelector('a.layui-layer-btn0');//确认去验证
                               confirmButton.click()},3000);
         setTimeout(function() {check = document.querySelector('div.sm-ico-wave')//验证
                                check.click();},3000);*/
    }
    // Your code here...
})();