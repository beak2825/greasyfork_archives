// ==UserScript==
// @name         豆瓣 - 搜索电影资源(手机版)
// @namespace   豆瓣/电影/电视剧
// @description:   豆瓣电影页面显示影视资源搜索页的直达链接
// @match        *://m.douban.com/movie/subject/*
// @version     0.0.3
// @license     MIT
// @author      1771245847
// @description 在豆瓣电影页面显示影视资源搜索页的直达链接
// @downloadURL https://update.greasyfork.org/scripts/514987/%E8%B1%86%E7%93%A3%20-%20%E6%90%9C%E7%B4%A2%E7%94%B5%E5%BD%B1%E8%B5%84%E6%BA%90%28%E6%89%8B%E6%9C%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/514987/%E8%B1%86%E7%93%A3%20-%20%E6%90%9C%E7%B4%A2%E7%94%B5%E5%BD%B1%E8%B5%84%E6%BA%90%28%E6%89%8B%E6%9C%BA%E7%89%88%29.meta.js
// ==/UserScript==
 
(function () {
    var host = location.hostname;
    if (host === 'm.douban.com') {
        const subject = document.querySelector('.sub-title');
        if (!subject) {
            return;
        }
        const title = subject.innerText.replace(/(^\s*)|(\s*$)/g, '').replace(' (豆瓣)', '');
 subject.insertAdjacentHTML('beforeend',
`<span><style>.cupfox{vertical-align: middle;}.cupfox:hover{background: #fff!important;}</style>
<a href="http://soupian.pro/search?key=${title}" class="cupfox" target="_blank">
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xli
nk="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="23px"
 viewBox="0 0 32 23" enable-background="new 0 0 32 23" xml:space="preserve">
<image id="image0" width="32" height="23" x="0" y="0" xlink:href="https://soupian.pro/favicon.ico"/></svg></a></span>`);
    }
})();