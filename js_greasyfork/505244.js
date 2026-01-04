// ==UserScript==
// @name         从豆瓣电影直接跳转漫狐猿搜索资源
// @namespace    https://manhuape.com/
// @version      0.0.2
// @description  漫狐猿是一个影视资源聚合搜索引擎。安装脚本后豆瓣电影标题旁会显示漫狐猿的logo，点击就可以搜索影视资源了。
// @author       manhuape
// @match        *://movie.douban.com/subject/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505244/%E4%BB%8E%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%BC%AB%E7%8B%90%E7%8C%BF%E6%90%9C%E7%B4%A2%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/505244/%E4%BB%8E%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%BC%AB%E7%8B%90%E7%8C%BF%E6%90%9C%E7%B4%A2%E8%B5%84%E6%BA%90.meta.js
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
            `<style>.cupfox{vertical-align: middle;}.cupfox:hover{background: #fff!important;}</style>
            <a href="https://manhuape.com/index.php/vod/search.html?wd=${title}" class="cupfox" target="_blank">
            <?xml version="1.0" encoding="UTF-8" standalone="no"?>
            <svg t="1724658398332" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16198" width="32" height="32"><path d="M267.8784 646.144c0 33.3824 4.8128 65.5872 13.568 96.1536 52.8896 37.9904 117.6576 60.416 187.7504 60.416 177.9712 0 322.2016-144.2816 322.2016-322.2016 0-55.7568-14.1824-108.1856-39.0656-153.9584-41.984-18.0224-88.2176-28.0064-136.8064-28.0064-192 0-347.648 155.5968-347.648 347.5968z" fill="#ffe048" p-id="16199"></path><path d="M469.1968 823.1936c-188.9792 0-342.6816-153.7536-342.6816-342.6816s153.7536-342.6816 342.6816-342.6816 342.6816 153.7536 342.6816 342.6816-153.7536 342.6816-342.6816 342.6816z m0-644.4544c-166.4 0-301.7216 135.3728-301.7216 301.7216s135.3728 301.7216 301.7216 301.7216 301.7216-135.3728 301.7216-301.7216-135.3728-301.7216-301.7216-301.7216zM868.9664 904.4992c-5.3248 0-10.6496-2.048-14.6432-6.1952l-119.7056-122.5728a20.52096 20.52096 0 0 1 0.3584-28.9792 20.52096 20.52096 0 0 1 28.9792 0.3584l119.7056 122.5728a20.52096 20.52096 0 0 1-0.3584 28.9792 20.48 20.48 0 0 1-14.336 5.8368z" fill="#55524F" p-id="16200"></path></svg>`
        );
    }
})();
