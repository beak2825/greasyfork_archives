// ==UserScript==
// @namespace greasyfork
// @name 阡陌居自动签到脚本（含心情选择）
// @namespace http://tampermonkey.net/
// @version 1.0
// @description 在签到按钮存在时自动完成签到流程，并监测签到按钮消失以停止脚本
// @author 猫啊咪呀
// @match http://www.1000qm.vip/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487797/%E9%98%A1%E9%99%8C%E5%B1%85%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC%EF%BC%88%E5%90%AB%E5%BF%83%E6%83%85%E9%80%89%E6%8B%A9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/487797/%E9%98%A1%E9%99%8C%E5%B1%85%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC%EF%BC%88%E5%90%AB%E5%BF%83%E6%83%85%E9%80%89%E6%8B%A9%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 尝试触发签到流程
    function triggerSignInProcess() {
        var signInButton = document.querySelector('a[onclick*="dsu_paulsign:sign"]');
        if (signInButton) {
            console.log("找到签到按钮，准备触发签到窗口");
            signInButton.click(); // 触发签到窗口
            setTimeout(autoSignIn, 3000); // 等待签到窗口完全加载
        } else {
            console.log("未找到签到按钮或已签到");
        }
    }

    // 自动完成签到流程
    function autoSignIn() {
        // 选择心情图标，这里假设选择“开心”
        var happyMoodIcon = document.getElementById('kx');
        if (happyMoodIcon) {
            happyMoodIcon.click();
            console.log("心情图标已选择");
            // 延时点击签到确认按钮
            setTimeout(() => {
                var confirmSignInButton = document.querySelector('button[onclick*="showWindow"]');
                if (confirmSignInButton) {
                    confirmSignInButton.click();
                    console.log("签到确认按钮被点击");
                }
            }, 1000); // 根据需要调整延时
        }
    }

    // 使用MutationObserver监听签到按钮的消失
    var observer = new MutationObserver(function(mutations, obs) {
        if (!document.querySelector('a[onclick*="dsu_paulsign:sign"]')) {
            console.log("签到按钮消失，停止观察");
            obs.disconnect(); // 如果签到按钮消失，停止观察
        }
    });

    // 配置观察器并开始观察
    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    // 页面加载完毕后，尝试签到
    window.addEventListener('load', triggerSignInProcess, false);
})();
