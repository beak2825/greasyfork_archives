// ==UserScript==
// @name          百度文库畅通无阻
// @namespace     http://tampermonkey.net/
// @version      0.1
// @description  消除恶心的百度文库复制限制
// @author       于镇桂
// @match        https://wenku.baidu.com/*
// @icon          https://edu-wenku.bdimg.com/v1/pc/logo.svg
// @license       End-User License Agreement
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/469458/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E7%95%85%E9%80%9A%E6%97%A0%E9%98%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/469458/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E7%95%85%E9%80%9A%E6%97%A0%E9%98%BB.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.body.addEventListener("keydown", function (e) {
        // Ctrl功能键 + 67（C）
        if (e.ctrlKey && e.keyCode == "67") {
            // 目标文本
            let tagetStr = document.querySelector(".search-result-wrap .link").innerText.split("查看全部包含“")[1].split("”的文档")[0];
            // 创建input元素，为实现复制准备
            let input = document.createElement("input");
            // 给input的value属性设置值为目标文本
            input.setAttribute("value", tagetStr);
            // 将input添加到页面
            document.body.appendChild(input);
            // 选中input
            input.select();
            // 执行copy命令
            document.execCommand("copy");
            // 完了之后移除input元素，为下一次初始化
            document.body.removeChild(input);
            // 定时器延迟1毫秒隐藏vip提示和遮罩层
            setTimeout(function () {
                document.querySelector(".dialog-mask").style.display = "none";
                document.querySelector(".copy-limit-dialog-v2").style.display = "none";
            }, 1)
        }
    })

    // 鼠标抬起触发
    document.body.addEventListener("mouseup", function () {
        // 设置不想看见的盒子隐藏
        document.querySelector("#reader-helper").style.display = "none";
    })



    // Your code here...
})();