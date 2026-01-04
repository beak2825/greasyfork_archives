// ==UserScript==
// @name         U校园延时点击
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  U校园，自动点击确定、提交和继续学习按钮，并在页面刷新时继续执行脚本
// @author       Chardy
// @match        https://ucontent.unipus.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498290/U%E6%A0%A1%E5%9B%AD%E5%BB%B6%E6%97%B6%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/498290/U%E6%A0%A1%E5%9B%AD%E5%BB%B6%E6%97%B6%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完成后执行
    function executeScript() {
        // 延时2秒后点击“确定”按钮
        setTimeout(function() {
            var confirmButton = document.querySelector('button[style*="background-color: rgb(41, 155, 228); text-align: right;"] span[style*="color: rgb(255, 255, 255);"]:contains("确定")');
            if (confirmButton) {
                confirmButton.click();
                console.log('确定按钮已点击');
            } else {
                console.log('找不到确定按钮');
            }

            // 延时70秒后点击“提交”按钮
            setTimeout(function() {
                var submitButton = document.querySelector('button.submit-bar-pc--btn-1_Xvo[temp="true"]');
                if (submitButton) {
                    submitButton.click();
                    console.log('提交按钮已点击');

                    // 提交完成后再点击“继续学习”按钮
                    setTimeout(function() {
                        var continueButton = document.querySelector('button[style*="background-color: rgb(41, 155, 228);"] span[style*="color: rgb(255, 255, 255);"]:contains("继续学习")');
                        if (continueButton) {
                            continueButton.click();
                            console.log('继续学习按钮已点击');
                        } else {
                            console.log('找不到继续学习按钮');
                        }
                    }, 2000); // 提交后延时2秒点击“继续学习”按钮，确保提交操作完成
                } else {
                    console.log('找不到提交按钮');
                }
            }, 70000); // 70秒
        }, 2000); // 2秒
    }

    // 执行脚本
    executeScript();

    // 监听页面的刷新事件
    window.addEventListener('load', function() {
        console.log('页面刷新检测');
        executeScript();
    });

})();
