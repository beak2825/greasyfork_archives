// ==UserScript==
// @name         在豆瓣电影页面直接搜索电影资源
// @namespace    https://www.soudianying.net/
// @description:zh-CN 在豆瓣电影页面显示影视资源搜索页的直达链接
// @match        *://movie.douban.com/subject/*
// @version 0.0.1.20200705054302
// @description 在豆瓣电影页面显示影视资源搜索页的直达链接
// @downloadURL https://update.greasyfork.org/scripts/406503/%E5%9C%A8%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E9%A1%B5%E9%9D%A2%E7%9B%B4%E6%8E%A5%E6%90%9C%E7%B4%A2%E7%94%B5%E5%BD%B1%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/406503/%E5%9C%A8%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E9%A1%B5%E9%9D%A2%E7%9B%B4%E6%8E%A5%E6%90%9C%E7%B4%A2%E7%94%B5%E5%BD%B1%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==

(function () {
    var host = location.hostname;
    if (host === 'movie.douban.com') {
        const title = document.querySelector('title').innerText.replace(/(^\s*)|(\s*$)/g, '').replace(' (豆瓣)', '');
        const subjectwrap = document.querySelector('h1');
        const subject = document.querySelector('.year');
        if (!subjectwrap || !subject) {
            return;
        }
        const sectl = document.createElement('span');
        subjectwrap.insertBefore(sectl, subject.nextSibling);
        sectl.insertAdjacentHTML('beforebegin',
`<style>.cupfox{vertical-align: middle;}.cupfox:hover{background: #fff!important;}</style>
<a href="https://www.soudianying.net/search/?q=${title}" class="cupfox" target="_blank">
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xli
nk="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="23px"
 viewBox="0 0 32 23" enable-background="new 0 0 32 23" xml:space="preserve">
<image id="image0" width="32" height="23" x="0" y="0" xlink:href="data:image/png;base64,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"/></svg></a>`);
    }
})();