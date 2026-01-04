// ==UserScript==
// @name        gaoding去水印11.07（代码已更新）
// @description 去水印神器
// @namespace   maomao1996.kill-watermark
// @version     1.0.2
// @author      solid
// @license     MIT
// @match       *://*.gaoding.com/editor/*
// @grant       GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/516196/gaoding%E5%8E%BB%E6%B0%B4%E5%8D%B01107%EF%BC%88%E4%BB%A3%E7%A0%81%E5%B7%B2%E6%9B%B4%E6%96%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/516196/gaoding%E5%8E%BB%E6%B0%B4%E5%8D%B01107%EF%BC%88%E4%BB%A3%E7%A0%81%E5%B7%B2%E6%9B%B4%E6%96%B0%EF%BC%89.meta.js
// ==/UserScript==

!(function() {
    "use strict";
    let h = 'div[style*="visibility"][style*="display"][style*="position"][style*="top"][style*="left"] {\n      clip-path:circle(0) !important;\n      //z-index:-1 !important;\n  }\n      ',
    t = '.water,.watermark {\n        clip-path:circle(0)!;\n        display:none;\n    }\n    .material-water-mark{\n    clip-path:circle(0)!;\n        display:none;\n    }\n    ',
    h2 = 'div[style*="pointer-events"][style*="background"][style*="position"][style*="top"][style*="left"] {\n      clip-path:circle(0) !important;\n      //z-index:-1 !important;\n  }\n      ';
    GM_addStyle(h);
    GM_addStyle(h2);
    GM_addStyle(t);

    const loadingStyle = '<style>#loading-screen{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:9999}.loading-spinner{width:50px;height:50px;border:5px solid #f3f3f3;border-top:5px solid #3498db;border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>';
    const loadingHTML = '<div id="loading-screen" style="display:none;"><div class="loading-spinner"></div></div>';

    function showLoadingScreen() {
        const styleEl = document.createElement('style');
        styleEl.type = 'text/css';
        styleEl.id = 'loading-style';
        styleEl.innerHTML = loadingStyle;
        document.head.appendChild(styleEl);
        const loadingEl = document.createElement('div');
        loadingEl.innerHTML = loadingHTML;
        document.body.appendChild(loadingEl);
    }

    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        const loadingStyle = document.getElementById('loading-style');
        if (loadingStyle) {
            loadingStyle.remove();
        }
    }

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

    let GaodingData = null;
    var originalCreateObjectURL = URL.createObjectURL;
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

    URL.createObjectURL = function(blob) {
        if (blob.type === 'image/png' && blob.size > 200000) {
            GaodingData = blob;
        } else if (blob.type == 'image/svg+xml') {
            blob = new Blob([''], {
                type: 'image/svg+xml'
            });
        }
        var url = originalCreateObjectURL(blob);
        return url;
    };

    document.body.appendChild(button);

    button.onclick = function() {
        if (GaodingData) {
            const url = URL.createObjectURL(GaodingData);
            const link = document.createElement('a');
            link.href = url;
            link.download = '无水印设计_' + new Date().getTime() + '.png';
            link.click();
            URL.revokeObjectURL(url);
        } else {
            alert('编辑或者移动一下模板');
        }
    };
})();