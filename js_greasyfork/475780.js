// ==UserScript==
// @name         59iedu华博在线南平继续教育自动下一节
// @namespace    www.31ho.com
// @version      1.6
// @description  自动播放，自动下一节。
// @author       1990
// @match        *//59iedu/*
// @grant        keke31h
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/475780/59iedu%E5%8D%8E%E5%8D%9A%E5%9C%A8%E7%BA%BF%E5%8D%97%E5%B9%B3%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/475780/59iedu%E5%8D%8E%E5%8D%9A%E5%9C%A8%E7%BA%BF%E5%8D%97%E5%B9%B3%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 重命名confirm函数，以防止与全局的window.confirm发生冲突
    var customConfirm = function () {
        return true;
    };
    window.confirm = customConfirm;

    // 声明变量和数组
    var links = [];
    var index = 0;

    // 执行自动学习
    startAutoLearning();

    function startAutoLearning() {
        // 获取所有链接并存入数组
        if (window.location.href.indexOf("http://xy.59iedu.com/Course/MyCourse/Index") !== -1) {
            var chapters = document.querySelectorAll('img[src*="xkarrowone.gif"]');
            chapters.forEach(function(chapter) {
                chapter.click();
            });

            var learningTabs = document.getElementById("tabsLearning");
            if (learningTabs) {
                var tabLinks = learningTabs.querySelectorAll('a[href*="medId"]');
                tabLinks.forEach(function(link) {
                    var href = link.getAttribute("href");
                    if (href) {
                        links.push(href);
                    }
                });
            }

            GM_setValue('links', links);

            if (links.length > 0) {
                console.log('即将开始学习：' + links[0]);
                window.location.href = "http://xy.59iedu.com" + links[0];
            }
        }

        // 检查学习进度和跳转
        setInterval(function () {
            var progress = document.getElementById("div_ProgressBar_value").innerHTML;
            console.log('当前学习网址：' + window.location.href + ' 当前学习进度：' + progress);

            if (progress === "100%") {
                var currentUrl = window.location.href;
                var links = GM_getValue('links', []);

                links.splice(index, 1); // 移除已完成的链接
                GM_setValue('links', links);

                index++;
                if (links[index]) {
                    console.log('跳转到新的学习网址：' + links[index]);
                    window.location.href = "http://xy.59iedu.com" + links[index];
                }
            }
        }, 2000);
    }

    // 弹出密码输入框
    function promptPassword() {
        var enteredPassword = prompt("请输入密码"); 
        
        var md5Password = CryptoJS.MD5("keke31h").toString(); 
       
        if (CryptoJS.MD5(enteredPassword).toString() !== md5Password) {
            alert('密码错误，无法进行自动学习');
            return;
        }

        // 验证通过，开始自动学习
        startAutoLearning();
    }

    // 延迟弹出密码输入框
    setTimeout(promptPassword, 1000);
})();
