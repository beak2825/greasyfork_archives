// ==UserScript==
// @name         「Ele-Cat」百度三下
// @namespace    https://ele-cat.gitee.io/
// @version      0.0.1
// @description  基础-百度三下
// @author       Ele-Cat
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492630/%E3%80%8CEle-Cat%E3%80%8D%E7%99%BE%E5%BA%A6%E4%B8%89%E4%B8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492630/%E3%80%8CEle-Cat%E3%80%8D%E7%99%BE%E5%BA%A6%E4%B8%89%E4%B8%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";
    console.log("我的脚本加载了");
    let button = document.createElement("button"); //创建一个input对象（提示框按钮）
    // 修改button的一系列属性
    button.id = "id001";
    button.textContent = "百度三下";
    button.style.width = "108px";
    button.style.height = "44px";
    button.style.align = "center";
    button.style.background = "#4e6ef2";
    button.style.color = "#fff";
    button.style.lineHeight = "45px";
    button.style.padding = "0";
    button.style.borderRadius = "0 10px 10px 0";
    button.style.fontSize = "17px";
    button.style.boxShadow = "none";
    button.style.fontWeight = 400;
    button.style.border = "none";
    button.style.outline = 0;
    //绑定按键点击功能
    button.onclick = function () {
        console.log("点击了按键");
        //为所欲为 功能实现处
        if (document.getElementById("kw").value) {
            window.open(
                `https://www.baidu.com/s?wd=${document.getElementById("kw").value}`,
                "_self"
            );
        }
        return;
    };
    //绑定鼠标移入事件
    button.onmouseenter = function () {
        console.log("鼠标移入按钮");
        button.style.background = "#4662d9";
        return;
    };
    //绑定鼠标移出事件
    button.onmouseleave = function () {
        console.log("鼠标移出按钮");
        button.style.background = "#4e6ef2";
        return;
    };
    let btnBox = document.getElementsByClassName("bg s_btn_wr")[0]; //getElementsByClassName 返回的是数组，所以要用[] 下标
    //在浏览器控制台可以查看所有函数，ctrl+shift+I 或 F12 调出控制台，在Console窗口进行实验测试
    btnBox.appendChild(button);
})(); //(function(){})() 表示该函数立即执行