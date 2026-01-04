// ==UserScript==
// @name         从豆瓣电影跳转到91公里动画直接看
// @namespace    https://v.91km.cc/
// @version      1.0.5
// @author       cococol
// @match        *://movie.douban.com/subject/*
// @description  91千米/公里动画是一个垃圾的动漫分类影视网站。安装此脚本后，豆瓣电影标题旁有显示'(→_→)观看' 字样，点击就可以去v.91km.cc搜索直接看了。
// @downloadURL https://update.greasyfork.org/scripts/481090/%E4%BB%8E%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E8%B7%B3%E8%BD%AC%E5%88%B091%E5%85%AC%E9%87%8C%E5%8A%A8%E7%94%BB%E7%9B%B4%E6%8E%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/481090/%E4%BB%8E%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E8%B7%B3%E8%BD%AC%E5%88%B091%E5%85%AC%E9%87%8C%E5%8A%A8%E7%94%BB%E7%9B%B4%E6%8E%A5%E7%9C%8B.meta.js
// ==/UserScript==

// 匿名函数，立即执行
(function () {
    // 获取当前页面的主机名
    var host = location.hostname;

    // 如果主机名是豆瓣电影的域名
    if (host === 'movie.douban.com') {
        // 获取电影标题，对标题进行处理以获得可用的搜索关键字
        const title = encodeURIComponent(
    document.querySelector('title')
    .innerText
    .replace(/(^\s*)|(\s*$)/g, '')
    .replace(' (豆瓣)', '')
    .replace(/\s/g, '%')
    );

        // 获取页面上的标题元素和年份元素
        const subjectwrap = document.querySelector('h1');
        const subject = document.querySelector('.year');

        // 如果标题元素或年份元素不存在，则退出函数
        if (!subjectwrap || !subject) {
            return;
        }

        // 在标题元素后插入一个新的span元素
        const sectl = document.createElement('span');
        subjectwrap.insertBefore(sectl, subject.nextSibling);

        // 在新span元素前插入一些样式和一个链接
        sectl.insertAdjacentHTML('beforebegin',
            `<style>
                .v91kmcc { vertical-align: middle; }
                .v91kmcc:hover { background: #000000; color:#ffffff; }
            </style>
            <a href="https://dh.91km.cc/index.php/vod/search.html?wd=${title}%" class="v91kmcc" target="_blank">
                <span style="color: #ffc107;">(→_→)观看</span>
            </a>`
        );
    }
})();
