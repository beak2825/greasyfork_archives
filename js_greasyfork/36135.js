// ==UserScript==
// @name         豆瓣名人相册列表显示大图
// @namespace    http://tampermonkey.net/
// @version      0.1.20171208
// @description  show big image in images list for celebrity on douban
// @author       塞北的雪
// @match        http://movie.douban.com/*/photos/*
// @match        https://movie.douban.com/*/photos/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36135/%E8%B1%86%E7%93%A3%E5%90%8D%E4%BA%BA%E7%9B%B8%E5%86%8C%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/36135/%E8%B1%86%E7%93%A3%E5%90%8D%E4%BA%BA%E7%9B%B8%E5%86%8C%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==
//TestURL:https://movie.douban.com/celebrity/1274514/photos/?type=C&start=120&sortby=size&size=a&subtype=a

(function() {
    'use strict';
    if($)
    {
        $('.article ul.poster-col3 li div.cover img').each(function(i){
            this.src=this.src.replace('/m/','/raw/').replace('.webp','.jpg');
        });
    }
})();