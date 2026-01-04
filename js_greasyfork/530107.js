// ==UserScript==
// @name         跳转到Seaborn对应的中文网站
// @namespace    http://tampermonkey.net/
// @version      2025-03-17
// @description  自动尝试跳转到Seaborn对应的中文网站
// @author       zsjng
// @match        https://seaborn.pydata.org/*
// @grant        none
// @include      https://seaborn.pydata.org/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530107/%E8%B7%B3%E8%BD%AC%E5%88%B0Seaborn%E5%AF%B9%E5%BA%94%E7%9A%84%E4%B8%AD%E6%96%87%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/530107/%E8%B7%B3%E8%BD%AC%E5%88%B0Seaborn%E5%AF%B9%E5%BA%94%E7%9A%84%E4%B8%AD%E6%96%87%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const currentUrl = new URL(window.location.href);
    const excludePath = '/search.html'; // 排除路径配置项
    try {
        // 双重验证逻辑：域名匹配且路径不包含排除项
        if (currentUrl.hostname.startsWith('seaborn.pydata.org')
            && !currentUrl.pathname.startsWith(excludePath)) {
            const redirectUrl = new URL(
                `${currentUrl.protocol}//seaborn.org.cn${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
            );
            setTimeout(() => window.location.href = redirectUrl, 100);
        }
    } catch (error) {
        console.error('Redirect failed:', error);
    }
})();