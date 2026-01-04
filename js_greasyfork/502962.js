// ==UserScript==
// @name         稿定设计去水印
// @namespace    xcantloadx
// @version      2024-08-08
// @description  稿定设计去水印脚本
// @author       You
// @match        https://www.gaoding.com/editor/design*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gaoding.com
// @grant        none
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/502962/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/502962/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hook canvas operations
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function() {
        const context = originalGetContext.apply(this, arguments);
        if (this.className !== 'infinite-canvas')
            return context;
        if (context && context.__isHooked) return context;

        const canvas = this;
        const history = new Set();

        const proxy2Raw = new Map();

        function intercept(value) {
            switch (typeof value) {
                case 'function':
                case 'object':
                    const proxy = new Proxy(value, {
                        get(target, key) {
                            const value = Reflect.get(target, key);
                            if (value instanceof HTMLCanvasElement)
                                return value;
                            else
                                return intercept(value);
                        },
                        set(target, key, value) {
                            const result = Reflect.set(target, key, value);
                            return result;
                        },
                        apply(target, thisArg, args) {
                            const value = Reflect.apply(target, proxy2Raw.get(thisArg), args);
                            if(target.name === 'save') {
                                saveHistory();
                            }
                            return intercept(value);
                        }
                    });
                    if (typeof value === 'object')
                        proxy2Raw.set(proxy, value);
                    return proxy;
                default:
                    return value;
            }
        }

        const saveHistory = () => {
            const dataURL = canvas.toDataURL('image/png');
            history.add(dataURL);
        };

        const proxyContext = intercept(context);
        proxyContext.__isHooked = true;

        window.setTimeout(function(){
            // Create a floating button
            const button = document.createElement('button');
            button.innerText = '下载 <canvas> 快照';
            button.style.position = 'absolute';
            button.style.top = '50px';
            button.style.left = '50%';
            button.style.transform = 'translate(-50%, -50%)';
            button.style.zIndex = '10000';
            button.style.padding = '10px';
            button.style.backgroundColor = '#007bff';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.zIndex = '9999';
            document.body.appendChild(button);

            // Create an overlay to block clicks
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '9998';
            overlay.style.cursor = 'not-allowed';
            document.body.appendChild(overlay);

            button.addEventListener('click', () => {
                Array.from(history).forEach((dataURL, index) => {
                    const a = document.createElement('a');
                    a.href = dataURL;
                    a.download = `canvas_history_${index + 1}.png`;
                    a.click();
                });
            });

        }, 300);

        return proxyContext;
    };
})();