// ==UserScript==
// @name         长沙理工
// @namespace    https://greasyfork.org/zh-CN/scripts/476690-%E9%95%BF%E6%B2%99%E7%90%86%E5%B7%A5
// @version      0.54
// @description  理工刷题脚本!
// @author       You
// @match        https://*.edu-edu.com.cn/*
// @match        https://*.edu-cj.com/*
// @match        https://*.edu-edu.com/*
// @require      https://cdn.jsdelivr.net/npm/wj50500@1.0.7
// @match        https://cjexamnew.edu-edu.com/exam-admin/student/exam/single/view/doresult/exam_16114/ckc001/431027200001010516?d=1696419241966&syncUrl=https%3a%2f%2fcsustcj.edu-edu.com.cn%2fScoreReturn%2fScoreList%2fAddCJ%3fmoduleCode%3dcsust_10753_1&m=a24346a768f99c3eb10e9838c899a19a
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu-edu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476690/%E9%95%BF%E6%B2%99%E7%90%86%E5%B7%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/476690/%E9%95%BF%E6%B2%99%E7%90%86%E5%B7%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    if (window.top === window.self) {
        window.onload=function(){
            // 创建一个新的 div 元素
            var newDiv = document.createElement("div");

            // 为新的 div 元素添加一些内容或属性
            newDiv.innerHTML = "正在使用老王插件..( 使用方法：1.先点平时作业 > 2.开始考试交卷(随便选一个交卷) > 3. 查看答案点击按钮返回重新考试 。)";
            newDiv.style.color = "#fff";
            newDiv.style.background='linear-gradient(to bottom,#7EBBFF,#8EBBFF)';
            // newDiv.style.width='100px';
            newDiv.style.height='50px'
            newDiv.style.display = "flex";
            newDiv.style.justifyContent = "center";
            newDiv.style.alignItems = "center";
            newDiv.style.fontSize='20px';
            // 获取 body 元素
            var body = document.body;
            // 在 body 的最前面插入新的 div 元素
            body.insertAdjacentElement('afterbegin', newDiv);
           const url= location.origin;

            if(window.location.href.startsWith(url+'/exam/student/exam2/doexam/')){
                newDiv.remove();
                var iframe = document.querySelector('iframe')
                iframe.onload =create


            }



        }
    }

})();