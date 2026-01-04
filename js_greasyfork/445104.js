// ==UserScript==
// @name         豆瓣电影图书一键搜索下载
// @namespace    https://greasyfork.org/users/139519
// @version      0.4.1
// @description  豆瓣电影详情页一键搜索资源和字幕 目前支援资源站：BD影视 Zlib
// @author       kk
// @match        *://movie.douban.com/subject/*
// @match        *://book.douban.com/subject/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445104/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%9B%BE%E4%B9%A6%E4%B8%80%E9%94%AE%E6%90%9C%E7%B4%A2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/445104/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%9B%BE%E4%B9%A6%E4%B8%80%E9%94%AE%E6%90%9C%E7%B4%A2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let host = location.hostname;
    if (host === 'movie.douban.com') {
        let title = document.querySelector('h1 > span').textContent.trim().split()

        let doubanId = window.location.href.split("/")[4]
        let url = 'https://ddys.tv/?s='+doubanId+'&post_type=post'
        insertDoubanInfo('低端影视', url,'前往');

        let subUrl = 'http://assrt.net/sub/?searchword='+title
        insertDoubanInfo('射手字幕', subUrl,'前往');
        let netflixUrl = 'https://www.netflix.com/search?q='+title
        insertDoubanInfo('奈飞', netflixUrl,'前往');

    }
    if (host == 'book.douban.com'){
        let title = document.querySelector('h1 > span').textContent.trim().split()
        let url = encodeURI('https://1lib.domains/s/'+title)
        insertDoubanInfo('zlib', url,'前往');
    }
})();

function insertDoubanInfo(name, url, value) {
    const info = document.querySelector('#info');
    if (info) {
        if (info.lastElementChild.nodeName != 'BR')
            info.insertAdjacentHTML('beforeend', '<br>');
        info.insertAdjacentHTML('beforeend', `<span class="pl">${name}:</span> <a href="${url}" target="_blank">${value}</a> <br>`);
    }
}