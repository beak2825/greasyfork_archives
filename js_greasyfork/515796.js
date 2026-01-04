// ==UserScript==
// @name         小红书链接简化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify the URL to keep only specific parameters
// @author       Larynx
// @match        https://www.xiaohongshu.com/*
// @license MIT
// @grant        none
// @run-at		document-start
// @downloadURL https://update.greasyfork.org/scripts/515796/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%93%BE%E6%8E%A5%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/515796/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%93%BE%E6%8E%A5%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前的 URL
    const url = new URL(window.location.href);

    // 提取需要的参数
    const xsec_source = url.searchParams.get('xsec_source');
    const xsec_token = url.searchParams.get('xsec_token');

    // 构造新的 URL
    const newUrl = `${url.origin}${url.pathname}?`;

    const params = new URLSearchParams();
    if (xsec_source) params.append('xsec_source', xsec_source);
    if (xsec_token) params.append('xsec_token', xsec_token);

    // 如果参数存在，则更新 URL
    if (params.toString()) {
        window.history.replaceState(null, '', newUrl + params.toString());
        //window.location.replace(newUrl + params.toString());
    }
})();
