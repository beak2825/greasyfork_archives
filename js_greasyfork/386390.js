// ==UserScript==
// @name         88dushu小说网站出现下载按钮
// @namespace    http://ynotme.club
// @version      0.3
// @description  提供下载按钮
// @author       zhangtao
// @match        https://www.88dush.com/xiaoshuo/*/*/
// @match        https://m.88dush.com/info/*/
// @match        https://www.88dushu.com/xiaoshuo/*/*/
// @match        https://m.88dushu.com/info/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386390/88dushu%E5%B0%8F%E8%AF%B4%E7%BD%91%E7%AB%99%E5%87%BA%E7%8E%B0%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/386390/88dushu%E5%B0%8F%E8%AF%B4%E7%BD%91%E7%AB%99%E5%87%BA%E7%8E%B0%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pathnames = window.location.pathname.split("/").reverse();
    console.log(pathnames);
    var i =0 ;
    while (i<pathnames.length) {
        var path = pathnames[i];
        if(path && path!=""){
            $(".info").append(`<a href="/modules/article/txtarticle.php?id=${path}">下载本书</a>`);
            $(".ablum_read").append(`<span><a href="/modules/article/txtarticle.php?id=${path}">下载本书</a></span>`)
            return;
        }
        i++;
    }
    // Your code here...
})();