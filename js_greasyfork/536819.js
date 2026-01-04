// ==UserScript==
// @name         拦截XHR响应
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  拦截并处理HTTP响应
// @author       czy
// @match        *://dfdcvp-perf-t-eu.voyah.cn/*
// @match        *://dfdcvp-uat-t-eu.dongfeng-global.com/*
// @match        *://dfdcvp-uat-t-ap.dongfeng-global.com/*
// @license     MIT
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/536819/%E6%8B%A6%E6%88%AAXHR%E5%93%8D%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/536819/%E6%8B%A6%E6%88%AAXHR%E5%93%8D%E5%BA%94.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 备份原始XHR对象
    const originalXHR = window.XMLHttpRequest;
    console.log('原始XHR对象', originalXHR);

    // 具体接口解密key，查看https://fj9r9pccfb.feishu.cn/docx/Nt6qdPXUQoYW3txR9BAclbVynVb
    const requestKeys = {
        'http://dfdcvp-perf-t-eu.voyah.cn':
        '111111',
        'https://dfdcvp-uat-t-eu.dongfeng-global.com':
        '111111', // 欧盟
        'https://dfdcvp-uat-t-ap.dongfeng-global.com':
        '111111', // 亚太
    };

    // 重写XMLHttpRequest构造函数
    window.XMLHttpRequest = function() {
        let xhr = new originalXHR();

        // 监听响应完成事件
        xhr.addEventListener('load', function() {
            // 解密处理
            let enStr = this.responseText.replace(/[\r\n]/g,"");
            let decrypted = decrypt(enStr);
            console.log('解密后json对象:', decrypted);

            // 使用Object.defineProperty创建可写的responseText
            Object.defineProperty(xhr, 'responseText', {
                value: decrypted,
                writable: false,
                enumerable: true,
                configurable: false
            });
        });

        return xhr;
    };

    // 解密函数
    function decrypt(encryptedData) {
        console.log('解密前字符串:', encryptedData);
        const envKey = _.findKey(requestKeys, (key, env) => _.includes(window.location.href, env));
        console.log('解密前key:', requestKeys[envKey]);
        const key = CryptoJS.enc.Hex.parse(requestKeys[envKey]);
        let decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        let jsonString = decrypted.toString(CryptoJS.enc.Utf8);
        console.log('解密后字符串:', jsonString);
        return JSON.parse(jsonString);
    }
})();