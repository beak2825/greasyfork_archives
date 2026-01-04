// ==UserScript==
// @name         未知搜索 豆瓣直接搜片播放资源跳转
// @namespace    https://xsear.ch/
// @version      0.1
// @description  豆瓣电影的标题旁会显示「未知搜索」的播放资源链接，跳转到未知搜索，一键搜索全网影视、动漫在线播放资源站。
// @author       zhshch
// @match        *://movie.douban.com/subject/*
// @icon         https://xsear.ch/logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429726/%E6%9C%AA%E7%9F%A5%E6%90%9C%E7%B4%A2%20%E8%B1%86%E7%93%A3%E7%9B%B4%E6%8E%A5%E6%90%9C%E7%89%87%E6%92%AD%E6%94%BE%E8%B5%84%E6%BA%90%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/429726/%E6%9C%AA%E7%9F%A5%E6%90%9C%E7%B4%A2%20%E8%B1%86%E7%93%A3%E7%9B%B4%E6%8E%A5%E6%90%9C%E7%89%87%E6%92%AD%E6%94%BE%E8%B5%84%E6%BA%90%E8%B7%B3%E8%BD%AC.meta.js
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
        sectl.insertAdjacentHTML('beforebegin', `<a style="vertical-align: middle;background: #fff!important;margin-left: 15px;color: #37a!important;font-size: 1rem;" href="https://xsear.ch/search/${title}" class="xsearch" target="_blank">
        <img src="https://xsear.ch/logo.png" style="width: 30px" alt="使用未知搜索搜索播放地址"/><span style="margin-left: 5px;">播放地址</span>
        </a>`);
    }
})();