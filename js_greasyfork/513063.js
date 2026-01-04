// ==UserScript==
// @name         oil-set-frame
// @namespace    longslee-longslee
// @version      2024-10-18_01
// @description  google proxy
// @author       longslee
// @include      https://admin-zc.zjcw.cn*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513063/oil-set-frame.user.js
// @updateURL https://update.greasyfork.org/scripts/513063/oil-set-frame.meta.js
// ==/UserScript==
(function() {
    function injectInterceptor(win) {
        // 拦截并修改请求
        const originalFetch = win.fetch;
        win.fetch = function(input, init) {
            if (typeof input === 'string' && input.startsWith('https://test-zc.zjcw.cn/satellite/map/vt2/')) {
                input = input.replace('https://test-zc.zjcw.cn/satellite/map/vt2/', 'http://23.94.25.133/kh/kh/');
                input += '&v=968';
            }
            return originalFetch.call(this, input, init);
        };

        // 拦截并修改 XMLHttpRequest
        const originalOpen = win.XMLHttpRequest.prototype.open;
        win.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            if (typeof url === 'string' && url.startsWith('https://test-zc.zjcw.cn/satellite/map/vt2/')) {
                url = url.replace('https://test-zc.zjcw.cn/satellite/map/vt2/', 'http://23.94.25.133/kh/kh/');
                url += '&v=968';
            }
            return originalOpen.call(this, method, url, async, user, password);
        };
    }

    // 注入到当前窗口
    injectInterceptor(window);

    // 注入到所有现有的iframe
    Array.from(document.getElementsByTagName('iframe')).forEach(iframe => {
        try {
            injectInterceptor(iframe.contentWindow);
        } catch (e) {
            console.error('无法注入到iframe:', e);
        }
    });

    // 监听新的iframe的加载
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IFRAME') {
                    node.addEventListener('load', () => {
                        try {
                            injectInterceptor(node.contentWindow);
                        } catch (e) {
                            console.error('无法注入到新的iframe:', e);
                        }
                    });
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();