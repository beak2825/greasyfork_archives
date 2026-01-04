// ==UserScript==
// @name         ZSHExtension
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  一个简单的Chrome扩展，用于在所有页面插入一行代码。
// @author       Your Name
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496116/ZSHExtension.user.js
// @updateURL https://update.greasyfork.org/scripts/496116/ZSHExtension.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function injectScript() {
        const scriptContent = `
            (function() {
                console.log("开始插入代码");
                function modifyFunction(func) {
                    return function(b, h) {
                        if (typeof b !== 'undefined' && b !== null) {
                            console.log("修改参数前 - 查看",b.securityCode);
                            b.securityCode = "";
                            console.log("插入的新代码 - b.securityCode 已修改");
                        } else {
                            console.log("b 对象未定义或为空");
                        }
                        // 原始函数的逻辑
                         b.securityCode = ""; // 新插入的代码
                        console.log("修改参数后 - 查看",b.securityCode);
                        var c = this.local.createUuid();
                        console.log("UUID 创建成功：", c);
                        var y = this.local.createUrl(c, b); 
                        console.log("URL 创建成功：", y);
                        y = this.local.createRequest(y, h);
                        console.log("Request 创建成功：", y);
                        this.rm[c] = y;
                        y.run();
                        console.log("Request 运行成功");
                    };
                }

                function waitForComSbpsSystem(retryCount = 0) {
                    const maxRetries = 50; // 设置最大重试次数
                    const retryInterval = 100; // 设置重试间隔时间
                    if (typeof com_sbps_system !== 'undefined' && typeof com_sbps_system.generateToken === 'function') {
                    console.log(com_sbps_system.generateToken)
                        com_sbps_system.generateToken = modifyFunction(com_sbps_system.generateToken);
                        console.log("目标函数已修改");
                    } else {
                        if (retryCount < maxRetries) {
                            console.log(\`目标函数未找到，重试中...（第 \${retryCount + 1} 次）\`);
                            setTimeout(() => waitForComSbpsSystem(retryCount + 1), retryInterval);
                        } else {
                            console.log("超过最大重试次数，停止重试");
                        }
                    }
                }
                console.log("页面已完全加载，开始检查目标函数");
                waitForComSbpsSystem();
            })();
        `;
        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.documentElement.appendChild(script);
        script.remove();
    }
    console.log("Content script loaded");
    injectScript();
})();