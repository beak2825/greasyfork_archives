// ==UserScript==
// @name         Bilibili弹幕颜色过滤器带按钮版
// @namespace    https://github.com/Fenejifen
// @version      0.2.0
// @description  按下按钮将弹幕颜色转为另一个颜色
// @author       Fenejifen
// @match        https://*.bilibili.com/*
// @match        http://*.bilibili.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459014/Bilibili%E5%BC%B9%E5%B9%95%E9%A2%9C%E8%89%B2%E8%BF%87%E6%BB%A4%E5%99%A8%E5%B8%A6%E6%8C%89%E9%92%AE%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/459014/Bilibili%E5%BC%B9%E5%B9%95%E9%A2%9C%E8%89%B2%E8%BF%87%E6%BB%A4%E5%99%A8%E5%B8%A6%E6%8C%89%E9%92%AE%E7%89%88.meta.js
// ==/UserScript==

// 融合https://greasyfork.org/zh-CN/scripts/450794 和 https://greasyfork.org/zh-CN/scripts/420995两个而来，前者创建按钮后者改变颜色

(function () {
    "use strict";

    /** 刷新弹幕颜色的间隔时间(毫秒) */
    var CD = 233;
    /** 需要过滤的颜色列表,请务必使用小写*/
    var COLORS_TO_FILTER = [
        "#ffffff", // 示例：过滤白色弹幕
    ];
    /** 想要转换成的颜色，此处默认转为绿色弹幕*/
    var TARGET_COLOR = "#00FF00";

    // 生成过滤颜色按钮
    var btn = document.createElement("button");
    // 按钮文字
    btn.innerText = "启动过滤";
    // 添加按钮的样式id值为filterBtn
    btn.setAttribute("id", "filterBtn");
    // 生成style标签
    var style = document.createElement("style");
    // 把样式写进去
    style.innerText = `#filterBtn{position:fixed;top:150px;right:15px;width:75px;height:55px;padding:3px 5px;border:1px solid #0d6efd;cursor:pointer;color:#0d6efd;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}#filterBtn:hover{background-color:#0d6efd;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(style);
    // 在body中添加button按钮
    document.body.appendChild(btn);
    // 添加点击按钮去执行颜色过滤函数
    btn.addEventListener("click", clickToStart);

    var interval; //用于绑定开始结束循环刷新弹幕颜色

    function clickToStart() {
        /** 启动过滤同时绑定再次按下取消过滤 */
        startFilter();
        btn.removeEventListener("click", clickToStart);
        btn.addEventListener("click", clickToEnd);
        btn.innerText = "结束过滤"
    }

    function clickToEnd() {
        /** 结束过滤同时绑定再次按下启动过滤 */
        endFilter()
        btn.removeEventListener("click", clickToEnd);
        btn.addEventListener("click", clickToStart);
        btn.innerText = "启动过滤"
    }

    function startFilter() {
        /** 开始循环刷新弹幕颜色 */
        interval = setInterval(function () {
            document.querySelectorAll(".bili-show").forEach(function (ele) {
                var startColorString = ele.outerHTML.indexOf("--color");
                var dmColor = ele.outerHTML.slice(startColorString + 9, startColorString + 16);
                var res = COLORS_TO_FILTER.indexOf(dmColor);
                if (res != -1) {
                    ele.style.color = TARGET_COLOR;
                }
            });
        }, CD);
    }

    function endFilter() {
        /** 结束循环刷新弹幕颜色 */
        clearInterval(interval)
    }

})();
