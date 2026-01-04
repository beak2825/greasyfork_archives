// ==UserScript==
// @name        百度文库复制 
// @namespace   Violentmonkey Scripts
// @match       https://wenku.baidu.com/view/*
// @grant       none
// @version     1.0
// @author      YJP
// @description 2022/8/21 上午9:41:26
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450032/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/450032/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
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