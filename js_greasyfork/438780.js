// ==UserScript==
// @name         复制去除版权信息
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  复制文字时自动去除网站自带的版权信息
// @author       myaijarvis
// @icon         https://greasyfork.org/vite/assets/blacklogo16.bc64b9f7.png
// @run-at       document-end
// @match        https://leetcode.cn/*
// @match        https://www.jianshu.com/p/*
// @match        https://*.blog.csdn.net/article/details/*
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://juejin.cn/post/*
// @match        https://www.acwing.com/file_system/file/content/whole/index/content/*
// @match        https://*.nowcoder.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/438780/%E5%A4%8D%E5%88%B6%E5%8E%BB%E9%99%A4%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/438780/%E5%A4%8D%E5%88%B6%E5%8E%BB%E9%99%A4%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
let url = document.URL;
// console.log(url);
(function () {
    "use strict";
    function copyOperation(e) {
        e.preventDefault(); //阻止默认事件
        e.stopImmediatePropagation(); // 在执行完当前事件处理程序之后，停止当前节点以及所有后续节点的事件处理程序的运行
        let selected = window.getSelection();
        let clipboard = e.clipboardData;
        clipboard.setData("Text", selected.toString());
        console.log(selected.toString());
    }

    if(url.includes('leetcode.cn')){
        // 不是答题页 （答题页复制不会有小尾巴）
        if (!url.match(/https:\/\/leetcode\.cn\/problems\/.*?\/(description|discussion|solutions|submissions)+\/$/)){
            document.addEventListener("copy", copyOperation);
            //console.log(1); // 调试专用 debugger;
        }else{
            console.log(`油猴脚本【复制去除版权信息】已排除此网址 `);
        }

    }else if(url.includes('www.nowcoder.com/exam/test')){
        console.log(`油猴脚本【复制去除版权信息】已排除此网址 `);
    }else{
        document.addEventListener('copy',copyOperation);
        //console.log(2); // 调试专用
    }
})();