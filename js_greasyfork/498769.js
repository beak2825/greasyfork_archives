// ==UserScript==
// @name         谷歌搜索优化
// @namespace    龟龟
// @version      0.1
// @description  自动添加搜索关键词reddit
// @author       兰屿绿蠵龟
// @match        https://www.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498769/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/498769/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addRedditToQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (query && !query.toLowerCase().includes('reddit')) {
            const newQuery = `${query} reddit`;
            urlParams.set('q', newQuery);
            const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
            window.location.replace(newUrl);
        }
    }
    window.addEventListener('load', addRedditToQuery);
})();