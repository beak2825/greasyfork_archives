// ==UserScript==
// @name         豆瓣电影海报原图直接看
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  无需登录，直接查看豆瓣电影的海报原图。
// @author       necan
// @include        /https:\/\/movie\.douban\.com\/subject\/\d+\/photos/
// @match        https://movie.douban.com/photos/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373006/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E6%B5%B7%E6%8A%A5%E5%8E%9F%E5%9B%BE%E7%9B%B4%E6%8E%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/373006/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E6%B5%B7%E6%8A%A5%E5%8E%9F%E5%9B%BE%E7%9B%B4%E6%8E%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    let lis = document.querySelectorAll('#content .article li');
    if (lis){
        for (let li of lis) {
            li.getElementsByTagName("img")[0].src = `https://img3.doubanio.com/view/photo/raw/public/p${li.getAttribute('data-id')}.jpg`
        }
    };

    let currentUrl = window.location.href
    if (window.location.href.match('https://movie.douban.com/photos/photo/')) {
        let imgUrl = `https://img3.doubanio.com/view/photo/raw/public/p${currentUrl.match(/\d+/)[0]}.jpg`;

        let show = document.querySelectorAll('.update.magnifier .j.a_show_login')[0];
        show.href = imgUrl;
        show.parentNode.replaceChild(show.cloneNode(true), show);
        let zoom = document.querySelectorAll('.photo-zoom.j.a_show_login')[0];
        zoom.href = imgUrl;
        zoom.parentNode.replaceChild(zoom.cloneNode(true), zoom);
    }
})();