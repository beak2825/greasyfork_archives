// ==UserScript==
// @name         3c版主网出现下载按钮
// @namespace    http://ynotme.club
// @version      0.3
// @description  提供下载按钮
// @author       zhangtao
// @match        http://www.xxxbz.info/*/*/
// @match        http://www.xxxbz/info/*/
// @match        http://www.xxxbz.info/*/*/
// @match        http://www.xxxbz/info/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415481/3c%E7%89%88%E4%B8%BB%E7%BD%91%E5%87%BA%E7%8E%B0%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/415481/3c%E7%89%88%E4%B8%BB%E7%BD%91%E5%87%BA%E7%8E%B0%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
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