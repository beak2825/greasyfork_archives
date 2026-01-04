// ==UserScript==
// @name         从豆瓣电影直接跳转懒鱼看看下载资源
// @namespace    https://lykk.top/
// @version      0.0.1
// @author       lykk
// @match        *://movie.douban.com/subject/*
// @description  懒鱼看看是一个云盘资源聚合下载网站。安装脚本后豆瓣电影标题旁会显示懒鱼的logo，点击就可以前往下载影视资源了。
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475995/%E4%BB%8E%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%87%92%E9%B1%BC%E7%9C%8B%E7%9C%8B%E4%B8%8B%E8%BD%BD%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/475995/%E4%BB%8E%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%87%92%E9%B1%BC%E7%9C%8B%E7%9C%8B%E4%B8%8B%E8%BD%BD%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==

(function () {
    var host = location.hostname;
    if (host === 'movie.douban.com') {
        const doubanId = location.pathname.match(/\/subject\/(\d+)/)[1];
        const title = encodeURIComponent(document.querySelector('title').innerText.replace(/(^\s*)|(\s*$)/g, '').replace(' (豆瓣)', ''));
        const subjectwrap = document.querySelector('h1');
        const subject = document.querySelector('.year');
        if (!subjectwrap || !subject) {
            return;
        }
        const sectl = document.createElement('span');
        subjectwrap.insertBefore(sectl, subject.nextSibling);
        sectl.insertAdjacentHTML('beforebegin',
            `<style>.lykk-logo{vertical-align: middle;}.lykk-logo:hover{background: #fff!important;}</style>
            <a href="https://lykk.top/api/go?doubanId=${doubanId}&name=${title}" class="lykk-logo" target="_blank">
            <?xml version="1.0" encoding="UTF-8" standalone="no"?>
            <svg fill="none" width="26" height="26" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="m45.1981 41.3005c-31.2226-.0432-28.1529 21.6995-28.1529 21.6995s-21.71657-23.252-11.14235-42.9134c7.85805-14.61256 25.63965-21.83832 39.71415-16.13625 8.5112 3.44664 13.5653 10.77185 14.5864 19.29095 1.0105 8.4484-5.96 18.0709-15.0053 18.0592z" fill="#ffd600"/><path d="m44.1837 43.2339c-31.0603-3.1731-30.1885 18.7647-30.1885 18.7647s-19.27396-25.3098-6.78072-43.8114c9.28612-13.74466 27.70262-19.154819 41.13442-12.07043 8.1225 4.28313 12.4147 12.07823 12.5757 20.65753.1584 8.5073-7.7428 17.3824-16.7409 16.4596z" fill="#ff1744"/></svg>
            </a>`
        );
    }
})();
