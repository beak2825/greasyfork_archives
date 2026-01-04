// ==UserScript==
// @name         网络认证
// @namespace    CK
// @version      1.0.3
// @description  模拟网络认证
// @author       You
// @match        http://192.168.240.156/a/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=240.156
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445461/%E7%BD%91%E7%BB%9C%E8%AE%A4%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/445461/%E7%BD%91%E7%BB%9C%E8%AE%A4%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    localStorage.clear();
    document.cookie='';

    const _navigator = window.navigator;

    Object.defineProperty(window, 'navigator', {
        get: () => ({
            ...Object.keys(Object.getPrototypeOf(_navigator)).reduce((prev, curr) => { prev[curr] = _navigator[curr]; return prev; }, {}),
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15',
            platform: 'Linux aarch64',
        }),
    });

    console.log('%c new navigator is', 'background: green;color: white;padding: 2px 4px;', navigator, _navigator);

    const script = document.createElement('script');
    script.innerHTML = `
            window.lc_device_info = new Proxy({
                is_mobile: 1,
                os_platform: 'Mac',
            }, {
                set(target, key, value) {
                    console.log('==== set property', target, key, value);
                    switch (key) {
                        case 'is_mobile':
                            value = 1;
                            break;
                        case 'os_platform':
                            value = 'Mac';
                            break;
                    }
                    target[key] = value;
                    return Reflect.set(target, key, value);
                },
                get(target, key) {
                    console.log('=== get property', key, target[key]);
                    return target[key];
                },
            });`;
    document.head.appendChild(script);
})();