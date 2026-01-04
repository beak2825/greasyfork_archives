// ==UserScript==
// @name         去除飞书&netshort水印
// @namespace    Tampermonkey BETA
// @version      1.1
// @description  综合两个脚本，破解飞书&netshort的复制和右键限制
// @author       向也
// @match        *://*.feishu.cn/*
// @match        *://*.netshort.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520685/%E5%8E%BB%E9%99%A4%E9%A3%9E%E4%B9%A6netshort%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/520685/%E5%8E%BB%E9%99%A4%E9%A3%9E%E4%B9%A6netshort%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==
(function () {
    console.log('改进飞书体验已启动');
 
    // 修改右键限制
    const bodyAddEventListener = document.body.addEventListener;
    document.body.addEventListener = function (type, listener, options) {
        bodyAddEventListener.call(
            document.body,
            type,
            event => {
                if (type === 'contextmenu') {
                    return true;
                }
                return listener(event);
            },
            options
        );
    };
 
    // 修改网络请求以破解复制限制
    XMLHttpRequest.prototype._open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
        const [ method, url ] = args;
        if (method !== 'POST' || !url.includes('space/api/suite/permission/document/actions/state/')) {
            return this._open(...args);
        }
 
        this.addEventListener("readystatechange", function() {
            if (this.readyState !== 4) return;
            let response = this.response;
            try {
                response = JSON.parse(response);
            } catch(e) {};
            console.log('debug:', response);
            if (response.data.actions.copy === 1) {
                return;
            }
 
            response.data.actions.copy = 1;
 
            Object.defineProperty(this, 'response', {
                get() {
                    return response;
                }
            });
            Object.defineProperty(this, 'responseText', {
                get() {
                    return JSON.stringify(response);
                }
            });
        }, false);
 
        return this._open(...args);
    };
 
})();
 
    // 获取所有图片元素
    const images = document.querySelectorAll('img');
 
    // 遍历每个图片元素
    images.forEach(image => {
        // 监听点击事件
        image.addEventListener('click', () => {
            // 复制图片本身而不是URL
            const img = document.createElement('img');
            img.src = image.src;
            img.style.display = 'none';
            document.body.appendChild(img);
 
            // 使用Clipboard API复制图片
            navigator.clipboard.writeImage(img).then(() => {
                console.log('Image copied to clipboard:', img.src);
                img.remove();
            }).catch(err => {
                console.error('Failed to copy image:', err);
                img.remove();
            });
        });
    });
 
 
 
 
// 添加样式
if (typeof GM_addStyle === 'undefined') {
    this.GM_addStyle = (aCss) => {
        'use strict'
        const head = document.getElementsByTagName('head')[0]
        if (head) {
            const style = document.createElement('style')
            style.setAttribute('type', 'text/css')
            style.textContent = aCss
            head.appendChild(style)
            return style
        }
        return null
    }
}
 
const bgImageNone = '{background-image: none !important;}'
 
function genStyle(selector) {
    return `${selector}${bgImageNone}`
}
 
GM_addStyle(genStyle('[class*="watermark"]'))
GM_addStyle(genStyle('[style*="pointer-events: none"]'))
GM_addStyle(genStyle('.ssrWaterMark'))
GM_addStyle(genStyle('body>div>div>div>div[style*="position: fixed"]:not(:has(*))'))
GM_addStyle(genStyle('[class*="TIAWBFTROSIDWYKTTIAW"]'))
GM_addStyle(genStyle('body>div[style*="position: fixed"]:not(:has(*))'))
GM_addStyle(genStyle('#watermark-cache-container'))
GM_addStyle(genStyle('body>div[style*="inset: 0px;"]:not(:has(*))'))
GM_addStyle(genStyle('.chatMessages>div[style*="inset: 0px;"]'))