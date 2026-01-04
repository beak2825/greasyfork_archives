// ==UserScript==
// @name         猫狸盘搜
// @namespace    https://alipansou.com/
// @version      0.0.1
// @author       fyzhu
// @license      MIT 
// @match        *://movie.douban.com/subject/*
// @description 猫狸盘搜是一个影视资源聚合搜索引擎。安装脚本后豆瓣电影标题旁会显示猫狸盘搜的logo，点击就可以搜索影视资源了。
// @downloadURL https://update.greasyfork.org/scripts/478927/%E7%8C%AB%E7%8B%B8%E7%9B%98%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/478927/%E7%8C%AB%E7%8B%B8%E7%9B%98%E6%90%9C.meta.js
// ==/UserScript==

(function () {
    var host = location.hostname;
    if (host === 'movie.douban.com') {
        const title = encodeURIComponent(document.querySelector('title').innerText.replace(/(^\s*)|(\s*$)/g, '').replace(' (豆瓣)', ''));
        const subjectwrap = document.querySelector('h1');
        const subject = document.querySelector('.year');
        if (!subjectwrap || !subject) {
            return;
        }
        const sectl = document.createElement('span');
        subjectwrap.insertBefore(sectl, subject.nextSibling);
        sectl.insertAdjacentHTML('beforebegin',
            `<style>.alipansou{vertical-align: top;}.alipansou:hover{background: #fff!important;}.alipansou img { width: 26px;}</style>
            <a href="https://alipansou.com/search?k=${title}" class="alipansou" target="_blank">
            <img src="https://ts3.cn.mm.bing.net/th?id=ODLS.e772305d-4950-457f-9003-b7e40e7998a6&w=32&h=32&qlt=90&pcl=fffffa&o=6&cb=1102&pid=1.2"/>
            </a>`
        );
    }
})();
