// ==UserScript==
// @name         豆瓣电影 免费片源
// @namespace    https://yunpan.12356.ren/
// @version      1.8.0
// @author       yunpan.12356.ren
// @match        *://movie.douban.com/subject/*
// @description  https://yunpan.12356.ren/ 是一个影视资源聚合站点。安装脚本后豆瓣电影标题旁会显示【查看免费片源】按钮。
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479373/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%20%E5%85%8D%E8%B4%B9%E7%89%87%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/479373/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%20%E5%85%8D%E8%B4%B9%E7%89%87%E6%BA%90.meta.js
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
            `<style>.cupfox{vertical-align: middle;color: red !important; background-color: gold !important; padding: 5px 10px;border-radius: 22px;} .cupfox:hover{background: blue;}</style>
            <a href="https://yunpan.12356.ren/?q=${title}" class="cupfox" target="_blank">查看免费片源</a>`
        );
    }
})();