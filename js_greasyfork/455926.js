// ==UserScript==
// @name         学习通教师自动批阅
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  学习通批改作业点击ctrl直接触发“提交并进入下一份”
// @author       You
// @match          *://*.chaoxing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      End-User License Agreement
// @downloadURL https://update.greasyfork.org/scripts/455926/%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%95%99%E5%B8%88%E8%87%AA%E5%8A%A8%E6%89%B9%E9%98%85.user.js
// @updateURL https://update.greasyfork.org/scripts/455926/%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%95%99%E5%B8%88%E8%87%AA%E5%8A%A8%E6%89%B9%E9%98%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeyup = function(e) {
    // 兼容FF和IE和Opera
    var event = e || window.event;
    var key = event.which || event.keyCode || event.charCode;

        // 获取所有<a>元素的 NodeList
        var anchorElements = document.getElementsByTagName('a');

        // 遍历<a>元素列表，找到指定的<a>元素
        for (var i = 0; i < anchorElements.length; i++) {
            // 使用条件判断匹配具体的<a>元素
            if (anchorElements[i].outerHTML === '<a href="javascript:;" class="jb_btn jb_btn_160 fr fs14 marginLeft30" onclick="markAction(0)">提交并进入下一份</a>') {
                console.log("指定的<a>元素位于索引号：" + i);
                if (key == 17) { // 可以自行修改，ctrl是17，enter是13，你可以根据自己的需要替换数字
                   document.getElementsByTagName('a')[i].click()
                }
                break; // 找到后可以选择退出循环
            }
        }




    };

})();