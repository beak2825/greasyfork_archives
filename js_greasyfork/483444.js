// ==UserScript==
// @name         Bing 跳转链接直达
// @name:zh      Bing 跳转链接直达
// @name:ja      Bing remove redirect link
// @name:en      Bing remove redirect link
// @description:en  remove redirect for bing.com/ck
// @description:ja bing.com/ck のリダイレクトを削除して、直接サイトにアクセス
// @description  去除 bing.com/ck 的重定向直达网站
// @namespace    TropicLinear_space
// @version      2024-1-17
// @author       TropicLinear
// @icon         https://cn.bing.com/sa/simg/favicon-trans-bg-blue-mg.ico
// @match        *://*.bing.com/search*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483444/Bing%20%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/483444/Bing%20%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    let throttle_callback;

    function throttle(callback, limit) {
        return function () {
            const context = this, args = arguments;
            clearTimeout(throttle_callback);
            throttle_callback = setTimeout(function () {
                callback.apply(context, args);
            }, limit);
        };
    }

    function decodeUtf8Base64Url(encodedUrl) {
        const bytes = Uint8Array.from(atob(encodedUrl), c => c.charCodeAt(0));
        return new TextDecoder().decode(bytes);
    }

    if (/https?:\/\/(?:[\w]+\.)?bing\.com\//.test(location.href)) {

        const observer = new MutationObserver(throttle((mutations, obs) => {
            document.querySelectorAll('[href^="https://www.bing.com/ck/a"]').forEach(element => {
                const match = element.href.match(/&u=([^&]+)/);
                const encodedUrl = match[1].slice(2);
                if (match && /^[A-Za-z0-9=_-]+$/.test(encodedUrl)) {
                    try {
                        const decodedUrl = decodeUtf8Base64Url(encodedUrl
                                                               .replace(/_/g, "/")
                                                               .replace(/-/g, "+"));
                        element.href = decodedUrl;
                    } catch (e) {
                        console.info('Bing URL Decode Error:', encodedUrl);
                    }
                }
            });
        }, 2));

        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }
})();