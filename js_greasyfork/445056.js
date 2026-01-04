// ==UserScript==
// @name         George：知识星球打印为PDF
// @version      0.6
// @description  知识星球，改变页面样式，方便打印为PDF
// @match        https://wx.zsxq.com/*
// @author       George
// @namespace    http://tampermonkey.net/
// @license      MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/445056/George%EF%BC%9A%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%89%93%E5%8D%B0%E4%B8%BAPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/445056/George%EF%BC%9A%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%89%93%E5%8D%B0%E4%B8%BAPDF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("脚本运行");

    window.onload=function(){
        console.log("onload");
        tryAgain();
    };

    // 多次尝试
    function tryAgain() {
        if (!addButton())
        {
            console.log("添加按钮失败");
            setTimeout(addButton,3500);
        }
    }

    // 添加按钮
    function addButton() {

        console.log("添加触发打印按钮：克隆节点");
        var sourceNode = document.getElementsByClassName("like")[0]; // 获得被克隆的节点对象
        console.log("获取节点："+sourceNode);
        if (!!sourceNode)
        {
            console.log("克隆节点");
            var printBtn = sourceNode.cloneNode(true); // 克隆节点

            printBtn.title="收藏";
            printBtn.setAttribute("class","like");
            printBtn.id="HtmToPDF";
            printBtn.addEventListener("click", saveToPDF);

            sourceNode.parentNode.appendChild(printBtn); // 在父节点插入克隆的节点
            return true;
        }
        return false;
    }

    // 日期格式化
    function dateFormat(fmt, date) {
        var ret;
        var opt = {
            "y+": date.getFullYear().toString(), // 年
            "m+": (date.getMonth() + 1).toString(), // 月
            "d+": date.getDate().toString(), // 日
            "h+": date.getHours().toString(), // 时
            "M+": date.getMinutes().toString(), // 分
            "s+": date.getSeconds().toString() // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (var k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            }
        }
        return fmt;
    }

    // 检查是否为正确的data
    function isValidDate(date) {
        return date instanceof Date && !isNaN(date.getTime())
    }

    // 触发打印
    function saveToPDF() {

        // console.log("隐藏网页不需要打印的部分：头、返回");
        var nxg1 = document.getElementsByClassName("header-container")[0].style.display = 'none';
        var nxg2 = document.getElementsByClassName("enter-group")[0].style.display = 'none';

        // console.log("获取页面上的发布时间，修改格式，设置为页面title，方便打印命名");
        var data = document.getElementsByClassName("date")[0];
        // console.log("获取时间："+data);
        if (!!data)
        {
            var text = data.innerText;
            // console.log("文字："+text);
            var timeString = new Date(text); // 转换为日期对象
            // console.log("timeString1="+timeString);

            if(!isValidDate(timeString)) {
                timeString = new Date();
            }
            // console.log("timeString2="+timeString);
            var format = dateFormat('yyyy.mm.dd - ',timeString);
            // console.log("format="+format);
            document.getElementsByTagName("title")[0].innerText = format; // 知识星球原来的title，没有什么有用内容，这里改用文章发表日期作为默认命名
        }
        window.print();
    }
})();