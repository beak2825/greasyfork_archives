// ==UserScript==
// @name         绕过 orangeSpeedCheck_v3.js 检查
// @match        https://oshi-tabi.voistock.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @version 0.0.1.20250622092841
// @namespace http://tampermonkey.net/
// @description 如题
// @downloadURL https://update.greasyfork.org/scripts/540385/%E7%BB%95%E8%BF%87%20orangeSpeedCheck_v3js%20%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/540385/%E7%BB%95%E8%BF%87%20orangeSpeedCheck_v3js%20%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 备份原始 XMLHttpRequest，用于拦截脚本加载
    const origXHR = window.XMLHttpRequest;
    let scriptLoaded = false;

    // 拦截 XMLHttpRequest 请求
    window.XMLHttpRequest = function() {
        const xhr = new origXHR();
        
        // 监听请求完成事件
        xhr.addEventListener('load', function() {
            if (this.responseURL.includes('orangeSpeedCheck_v3.js') && !scriptLoaded) {
                scriptLoaded = true;
                let code = this.responseText;
                
                // 方案1：直接修改 checkRide 函数，仅保留 requirementMet 调用
                code = code.replace(/function\s+checkRide\s*\([^)]*\)\s*{([\s\S]*?)}/gm, `
                    function checkRide() {
                        console.log('绕过检查，直接调用 requirementMet');
                        return requirementMet();
                    }
                `);
                
                // 方案2：添加全局访问接口（如果方案1失败）
                code += `
                    // 暴露闭包内的函数到全局
                    window._exposed = {
                        checkRide: checkRide,
                        requirementMet: requirementMet
                    };
                `;
                
                // 执行修改后的代码
                const script = document.createElement('script');
                script.textContent = code;
                document.head.appendChild(script);
                
                console.log('已注入修改后的 orangeSpeedCheck_v3.js');
            }
        });
        
        return xhr;
    };

    // 恢复原始 XHR（可选）
    setTimeout(() => {
        window.XMLHttpRequest = origXHR;
    }, 1000);

})();