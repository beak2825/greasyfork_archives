// ==UserScript==
// @name         GSC URL单元格点主区域新标签页跳转，子div不拦截
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Google Search Console中点击链接会在当前页面打开，对于一些需要新开标签页的场景不太方便。所以脚本实现了点击页面中链接时在新标签页打开的功能。
// @license      MIT
// @match        https://search.google.com/*/search-console/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533585/GSC%20URL%E5%8D%95%E5%85%83%E6%A0%BC%E7%82%B9%E4%B8%BB%E5%8C%BA%E5%9F%9F%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E8%B7%B3%E8%BD%AC%EF%BC%8C%E5%AD%90div%E4%B8%8D%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/533585/GSC%20URL%E5%8D%95%E5%85%83%E6%A0%BC%E7%82%B9%E4%B8%BB%E5%8C%BA%E5%9F%9F%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E8%B7%B3%E8%BD%AC%EF%BC%8C%E5%AD%90div%E4%B8%8D%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 你的站点ID，不同账号/域名要改
    const resource_id = encodeURIComponent('sc-domain:yourdomain.com');

    setInterval(function(){
        document.querySelectorAll('td.LoCYSb[data-string-value]').forEach(td=>{
            if (td.dataset.tapNewtab) return;
            td.dataset.tapNewtab = "1";

            td.addEventListener('click', function(e){
                // ★ 如果点的正是在或包含在.qUFtbf.mEONWd内的元素，不处理!
                if (e.target.closest('.qUFtbf.mEONWd')) {
                    // 放过，不干预此区块点击
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                const url = td.getAttribute('data-string-value');
                if(/^https?:\/\//.test(url)){
                    const targetUrl = `https://search.google.com/u/1/search-console/performance/search-analytics?resource_id=${resource_id}&breakdown=query&page=!${encodeURIComponent(url)}`;
                    window.open(targetUrl,'_blank');
                }
            }, true);
        });
    }, 1500);
})();