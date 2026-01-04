// ==UserScript==
// @name         豆瓣电影 恢复IMDb跳转链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  恢复豆瓣电影页面去掉的点击IMDB编号直接跳转功能
// @author       You
// @match        *://movie.douban.com/subject*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426505/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%20%E6%81%A2%E5%A4%8DIMDb%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/426505/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%20%E6%81%A2%E5%A4%8DIMDb%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a = $("#info").html().replace(/\s\n/g,''),
        b = /IMDb:<\/span>(.*?)<br>/gm,
        c = a.match(b)[0],
        d = c.replace('IMDb:<\/span>','').replace('<br>','').replace(/\s/g,''),
        e = 'IMDb:</span>&nbsp;<a href="https://www.imdb.com/title/'+d+'" target="_blank">'+d+'</a>',
        f = a.replace(c,e);
    $("#info").html(f);

})();