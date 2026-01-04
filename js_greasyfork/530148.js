// ==UserScript==
// @name         Platform Spoofer
// @namespace    https://viayoo.com/
// @version      0.6.1
// @description  Modify platform Only.
// @author       Via
// @match        *://*/*
// @exclude      *://*.baidu.*/*
// @exclude      *://*.bing.*/*
// @exclude      *://*.github.com/*
// @exclude      *://*.google.*/*
// @exclude      *://*.ifeng.com/*
// @exclude      *://*.iqiyi.com/*
// @exclude      *://*.mgtv.com/*
// @exclude      *://*.pptv.com/*
// @exclude      *://*.qq.com/*
// @exclude      *://*.sina.com.cn/*
// @exclude      *://*.sohu.com/*
// @exclude      *://*.v.qq.com/*
// @exclude      *://*.yandex.*/*
// @exclude      *://github.com/*
// @exclude      *://greasyfork.org/*
// @exclude      *://rebang.today/*
// @exclude      *://scriptcat.org/*
// @exclude      *://twitter.com/*
// @exclude      *://x.com/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530148/Platform%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/530148/Platform%20Spoofer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const FAKE_PLATFORM = 'Mac';
    const spoofNavigator = new Proxy(navigator, {
        get(target, prop) {
            return prop === 'platform' ? FAKE_PLATFORM : Reflect.get(target, prop);
        },
        getOwnPropertyDescriptor(target, prop) {
            if (prop === 'platform') {
                return {
                    value: FAKE_PLATFORM,
                    writable: false,
                    configurable: true,
                    enumerable: true
                };
            }
            return Object.getOwnPropertyDescriptor(target, prop);
        }
    });
    try {
        const descriptor = Object.getOwnPropertyDescriptor(navigator, 'platform');
        if (descriptor?.configurable) {
            Object.defineProperty(navigator, 'platform', {
                get: () => FAKE_PLATFORM,
                configurable: true,
                enumerable: true
            });
        } else if (navigator.__defineGetter__) {
            navigator.__defineGetter__('platform', () => FAKE_PLATFORM);
        }
        Object.defineProperty(window, 'navigator', {
            value: spoofNavigator,
            writable: false,
            configurable: true
        });
        const protoDescriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'platform');
        if (protoDescriptor?.configurable) {
            Object.defineProperty(Navigator.prototype, 'platform', {
                get: () => FAKE_PLATFORM,
                configurable: true,
                enumerable: true
            });
        }
        const originalIndexOf = String.prototype.indexOf;
        String.prototype.indexOf = function(searchString) {
            if (this === FAKE_PLATFORM) {
                if (searchString === 'Win' || searchString === 'Linux' || searchString === 'X11') return -1;
                if (searchString === 'Mac') return 0;
            }
            return originalIndexOf.call(this, searchString);
        };

    } catch (e) {
        console.warn('Platform spoofing fallback:', e);
        window.navigator = spoofNavigator;
    }
    Object.freeze(window.navigator);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (navigator.platform !== FAKE_PLATFORM) {
                Object.defineProperty(window, 'navigator', {
                    value: spoofNavigator,
                    writable: false,
                    configurable: true
                });
                Object.freeze(window.navigator);
            }
        }, {
            once: true
        });
    }
})();