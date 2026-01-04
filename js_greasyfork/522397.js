// ==UserScript==
// @name         删除苦力怕论坛外链二次跳转
// @namespace    Mooshed88
// @version      0.1
// @description  安装后，苦力怕论坛内点击外链将将不再弹出确认跳转提示
// @author       Mooshed88
// @match        https://klpbbs.com/*
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/522397/%E5%88%A0%E9%99%A4%E8%8B%A6%E5%8A%9B%E6%80%95%E8%AE%BA%E5%9D%9B%E5%A4%96%E9%93%BE%E4%BA%8C%E6%AC%A1%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/522397/%E5%88%A0%E9%99%A4%E8%8B%A6%E5%8A%9B%E6%80%95%E8%AE%BA%E5%9D%9B%E5%A4%96%E9%93%BE%E4%BA%8C%E6%AC%A1%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.href;
        if (href.includes('klpbbs.com/url.php?url=')) {
            const urlParam = href.split('url=')[1];
            try {
                const decodedUrl = atob(urlParam);
                link.href = decodedUrl;
                link.target = '_blank';
                console.log('已处理',link)
            } catch (error) {
                console.error('处理URL失败:', href);
            }
        }
    });
})();