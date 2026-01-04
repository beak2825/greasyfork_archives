// ==UserScript==
// @name         OA显示加班脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  显示 🐕Personnel 隐藏的overtime时长
// @author       小辫子
// @match        http://oa.en-plus.com.cn:8090/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=en-plus.com.cn
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543176/OA%E6%98%BE%E7%A4%BA%E5%8A%A0%E7%8F%AD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/543176/OA%E6%98%BE%E7%A4%BA%E5%8A%A0%E7%8F%AD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForEcodeSDK() {
        if (window.ecodeSDK && typeof window.ecodeSDK === 'object') {
            try {
                Object.defineProperty(window.ecodeSDK, 'rewriteApiDataQueue', {
                    configurable: true,
                    enumerable: true,
                    get() {
                        console.log('🔍 window.ecodeSDK.rewriteApiDataQueue 被访问');
                        return window.ecodeSDK; // 如果有原值，可以改成返回原值或替换
                    },
                    set(value) {
                        console.log('🔍 window.ecodeSDK.rewriteApiDataQueue 被修改为:', value);
                        this._rewriteApiDataQueue = value; // 存储赋值
                    }
                });
                console.log('OA显示加班脚本已加载并劫持rewriteApiDataQueue');
            } catch(e) {
                console.error('劫持rewriteApiDataQueue失败:', e);
            }
        } else {
            setTimeout(waitForEcodeSDK, 50);
        }
    }

    waitForEcodeSDK();

})();
