

    // ==UserScript==
    // @name         谷歌图片hk重定向
    // @namespace    http://tampermonkey.net/
    // @version      0.3
    // @description  识图用，防止Google图片跳转到带有安全过滤的hk，也防止某些hk运营商会将图片重定向到cn
    // @author       青青
    // @include      http://www.google.com.hk/imghp*
    // @include      https://www.google.com.hk/imghp*
    // @include      http://www.google.cn/imghp*
    // @include      https://www.google.cn/imghp*
    // @include      http://www.google.com.hk/search*
    // @include      https://www.google.com.hk/search*
    // @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/450774/%E8%B0%B7%E6%AD%8C%E5%9B%BE%E7%89%87hk%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/450774/%E8%B0%B7%E6%AD%8C%E5%9B%BE%E7%89%87hk%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
    // ==/UserScript==
    document.location.href = document.location.href.replace('www.google.com/imghp','www.google.com/imghp').replace('www.google.com.hk/search','www.google.com/search').replace('www.google.com.hk/imghp','www.google.com.hk/imghp');

