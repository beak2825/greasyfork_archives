// ==UserScript==
// @name         解除飞书复制限制,并去掉零宽字符
// @license      GPL License
// @namespace    https://bytedance.com
// @version      0.5
// @description  解除飞书复制限制, 再复制过程中去掉零宽字符
// @author       NOABC
// @match        *://*.feishu.cn/*
// @match        *://*.larkoffice.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528965/%E8%A7%A3%E9%99%A4%E9%A3%9E%E4%B9%A6%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%2C%E5%B9%B6%E5%8E%BB%E6%8E%89%E9%9B%B6%E5%AE%BD%E5%AD%97%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/528965/%E8%A7%A3%E9%99%A4%E9%A3%9E%E4%B9%A6%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%2C%E5%B9%B6%E5%8E%BB%E6%8E%89%E9%9B%B6%E5%AE%BD%E5%AD%97%E7%AC%A6.meta.js
// ==/UserScript==
(function () {
    // Override addEventListener to handle copy and contextmenu events
    const overrideEventListeners = () => {
        const rawAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            if (type === 'copy') {
                rawAddEventListener.call(this, type, event => {
                  let selection = window.getSelection().toString();
let newStr =selection.replaceAll("​", '');
 event.clipboardData.setData('text/plain', newStr);
   event.preventDefault();
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