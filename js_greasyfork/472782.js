// ==UserScript==
// @name         让你的飞书更好用(优化版)
// @license      GPL License
// @namespace    https://bytedance.com
// @version      0.5
// @description  让飞书文档不受权限限制，可以复制任意内容，可以打开右键菜单(复制下载图片)
// @author       NOABC
// @match        *://*.feishu.cn/*
// @match        *://*.larkoffice.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473205/%E8%AE%A9%E4%BD%A0%E7%9A%84%E9%A3%9E%E4%B9%A6%E6%9B%B4%E5%A5%BD%E7%94%A8%28%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/473205/%E8%AE%A9%E4%BD%A0%E7%9A%84%E9%A3%9E%E4%B9%A6%E6%9B%B4%E5%A5%BD%E7%94%A8%28%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==
(function () {
    // Override addEventListener to handle copy and contextmenu events
    const overrideEventListeners = () => {
        const rawAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            if (type === 'copy') {
                rawAddEventListener.call(this, type, event => {
                    event.stopImmediatePropagation();
                    return null;
                }, options);
                return;
            }
            if (type === 'contextmenu') {
                rawAddEventListener.call(this, type, event => {
                    event.stopImmediatePropagation();
                    return listener(event);
                }, options);
                return;
            }
            rawAddEventListener.call(this, type, listener, options);
        };
    };

    // Override XMLHttpRequest to manipulate permission responses
    const overrideXHR = () => {
        const rawOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && url.includes('space/api/suite/permission/document/actions/state/')) {
                    let response = this.responseText;
                    try {
                        response = JSON.parse(response);
                        if (response.data && response.data.actions && response.data.actions.copy !== 1) {
                            response.data.actions.copy = 1;
                            Object.defineProperty(this, 'responseText', { value: JSON.stringify(response) });
                            Object.defineProperty(this, 'response', { value: response });
                        }
                    } catch (e) {
                        console.error('Failed to modify response:', e);
                    }
                }
            }, false);
            rawOpen.call(this, method, url, ...rest);
        };
    };

    // Run overrides immediately and on DOMContentLoaded
    overrideEventListeners();
    overrideXHR();
    document.addEventListener('DOMContentLoaded', () => {
        overrideEventListeners();
        overrideXHR();
    });
})();