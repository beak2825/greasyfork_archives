// ==UserScript==
// @name         推し旅新干线验证（mujica）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  如题
// @match        *://oshi-tabi.voistock.com/ave-mujica/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532350/%E6%8E%A8%E3%81%97%E6%97%85%E6%96%B0%E5%B9%B2%E7%BA%BF%E9%AA%8C%E8%AF%81%EF%BC%88mujica%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/532350/%E6%8E%A8%E3%81%97%E6%97%85%E6%96%B0%E5%B9%B2%E7%BA%BF%E9%AA%8C%E8%AF%81%EF%BC%88mujica%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeOriginalScript() {
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            if (script.src && script.src.indexOf("geolocationV2.js") !== -1) {
                script.parentNode.removeChild(script);
                break;
            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'SCRIPT' && node.src && node.src.indexOf("geolocationV2.js") !== -1) {
                    node.remove();
                }
            });
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    removeOriginalScript();

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://oshi-tabi.voistock.com/view/event/ave-mujica/voice/js/geolocationV2.js",
        onload: function(response) {
            if (response.status === 200) {
                let code = response.responseText;

                // 1. 替换 var direction;
                code = code.replace(/var\s+direction\s*;/g, "var direction = 'towards';");
                // 2. 替换 Checkspeed 函数中 var flag=false;
                code = code.replace(/var\s+flag\s*=\s*false\s*;/g, "var flag = true;");
                // 3. 替换 var inarea=false;
                code = code.replace(/var\s+inArea\s*=\s*false\s*;/g, "var inArea = true;");

                const script = document.createElement('script');
                script.textContent = code;
                document.head.appendChild(script);
            } else {
                console.error("获取 geolocationV2.js 失败，状态码：" + response.status);
            }
        },
        onerror: function(error) {
            console.error("GM_xmlhttpRequest 请求出错：", error);
        }
    });
})();
