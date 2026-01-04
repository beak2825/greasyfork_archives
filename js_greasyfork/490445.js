// ==UserScript==
// @name         神藏小说网黑色主题
// @namespace    https://greasyfork.org/zh-CN/scripts/490445
// @version      1.0.3
// @description  神藏小说网站的黑色主题脚本
// @author       Joytome
// @match        http://www.swangwx.la/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swangwx.la
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490445/%E7%A5%9E%E8%97%8F%E5%B0%8F%E8%AF%B4%E7%BD%91%E9%BB%91%E8%89%B2%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/490445/%E7%A5%9E%E8%97%8F%E5%B0%8F%E8%AF%B4%E7%BD%91%E9%BB%91%E8%89%B2%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 代码中使用的变量和函数
    document.querySelectorAll('*').forEach(element => {
        element.style.backgroundColor = 'rgb(40, 40, 40)';
        element.style.color = 'rgb(255, 255, 255)';
        element.style.fontSize = '16px';
    });

    setTimeout(function(){

        // 获取目标元素
        var div = document.getElementById('chaptercontent');
        // 获取元素内容
        var content = div.innerHTML;

        // 替换 <br> 标签为 <p> 标签
        var newContent = content.replace(/<br>/g, '</p><p>');

        // 设置元素内容
        div.innerHTML = newContent;

        // 定义一个函数来突出显示元素
        function highlightElement(element) {
            element.style.backgroundColor = 'gray';
        }

        // 为你想要突出显示的元素添加鼠标悬停事件监听器
        document.querySelectorAll('p').forEach(element => {
            element.addEventListener('mouseover', (event) => {
                $("p:not(this)").css("background-color", "");
                highlightElement(element);
            });
        });

        $(".info").remove();
    },1000);

    //移除一些非必要的元素
    $(".title").next().next().remove();
    $("#center_tip").remove();
    $("#center_tip").remove();
    $(".copyright").remove();
    $(".bottominfo").remove();

    $("img").remove();
    $(".pticon-bookmark,.pticon-globe").parent().remove();
    $(".frame-source").remove();
    $(".title").css('padding','0px');

})();