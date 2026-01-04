// ==UserScript==
// @name         共创世界(CCW)自动签到
// @namespace    https://greasyfork.org/zh-CN/scripts/481630-%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8C-ccw-%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0
// @version      1.9
// @description  自动签到脚本，从本地读取上次签到时间并判断是否是新的一天进行签到
// @author       kukemc
// @match        *.ccw.site/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481630/%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8C%28CCW%29%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/481630/%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8C%28CCW%29%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从本地读取上次签到时间
    var lastCheckinTime = GM_getValue('lastCheckinTime');

    // 获取当前日期
    var currentDate = new Date().toLocaleDateString();
    console.log('开始判断签到');

    // 函数监听请求
    function listenForRequest() {
        const originalXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this.addEventListener('load', function() {
                if (url.includes("https://community-web.ccw.site/students/self/detail")) {
                    console.log('请求成功，开始执行签到');
                    executeSignIn();
                }
            });
            // 确保调用原始方法时传递所有参数
            originalXhrOpen.apply(this, arguments);
        };
    }

    // 主签到函数
    function executeSignIn() {
        // 判断是否是新的一天
        if (lastCheckinTime !== currentDate) {
            console.log('执行签到');
            function clickElementByClass(className) {
                var elements = document.getElementsByClassName(className);
                if (elements.length > 0) {
                    elements[0].click();
                    console.log("点击 " + className + " 成功");
                } else {
                    console.error("无法找到类名为 " + className + " 的元素");
                }
            }
            // 执行签到流程
            setTimeout(function() {
                clickElementByClass('signInEntery-2G189 toolTip');
                clickElementByClass('signInEntery-2G189 toReceive-1Y0YL toolTip');
                setTimeout(function() {
                    clickElementByClass('signIn-3FzQR');
                    setTimeout(function() {
                        clickElementByClass('closeBtn-30jhg');
                        GM_setValue('lastCheckinTime', currentDate);
                        console.log('签到成功');
                    }, 300);
                }, 300);
            }, 5000);
        } else {
            console.log("用户已签到过");
        }
    }

    // 开始监听请求
    listenForRequest();
})();
