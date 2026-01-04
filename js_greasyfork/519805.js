// ==UserScript==
// @name        gaoding去水印12.5
// @description 去水印神器
// @namespace   maomao1996.kill-watermark
// @version     1.0.2
// @author      solid
// @license     MIT
// @match       *://*.gaoding.com/editor/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/519805/gaoding%E5%8E%BB%E6%B0%B4%E5%8D%B0125.user.js
// @updateURL https://update.greasyfork.org/scripts/519805/gaoding%E5%8E%BB%E6%B0%B4%E5%8D%B0125.meta.js
// ==/UserScript==

!(function() {
    "use strict";

    // 水印样式处理
    let h = 'div[style*="visibility"][style*="display"][style*="position"][style*="top"][style*="left"] {\n      clip-path:circle(0) !important;\n      //z-index:-1 !important;\n  }\n      ',
    t = '.water,.watermark {\n        clip-path:circle(0)!;\n        display:none;\n    }\n    .material-water-mark{\n    clip-path:circle(0)!;\n        display:none;\n    }\n    ',
    h2 = 'div[style*="pointer-events"][style*="background"][style*="position"][style*="top"][style*="left"] {\n      clip-path:circle(0) !important;\n      //z-index:-1 !important;\n  }\n      ';

    // 添加样式
    GM_addStyle(h);
    GM_addStyle(h2);
    GM_addStyle(t);

    // 添加下载按钮
    let button = document.createElement('button');
    button.innerHTML = '下载';
    button.style.position = 'fixed';
    button.style.right = '20px';
    button.style.top = '80px';
    button.style.zIndex = '999';
    button.style.padding = '8px 16px';
    button.style.fontSize = '14px';
    button.style.color = '#FF4D4D';
    button.style.backgroundColor = '#FFD700';
    button.style.border = '1px solid transparent';
    button.style.borderColor = '#230eff';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';

    document.body.appendChild(button);

    // 点击事件
    button.onclick = function() {
        alert('关注公众号：小黑臭臭，获取下载链接');
    };

    // 处理Math.max
    var originalMathMax = Math.max;
    Math.max = function() {
        var args = Array.prototype.slice.call(arguments);
        var result = originalMathMax.apply(null, args);
        if (args[0] <= 500 && args[1] == 256) {
            const sizeInfo = document.querySelector('[test-id="right-canvas-size-info"]');
            let width = 1024;
            if (sizeInfo) {
                const text = sizeInfo.textContent;
                const matches = text.match(/(\d+)\s*×\s*(\d+)/);
                width = matches[1];
            }
            return width;
        }
        return result;
    };

    // 处理URL.createObjectURL
    var originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = function(blob) {
        if (blob.type == 'image/svg+xml') {
            blob = new Blob([''], {
                type: 'image/svg+xml'
            });
        }
        var url = originalCreateObjectURL(blob);
        return url;
    };
})();