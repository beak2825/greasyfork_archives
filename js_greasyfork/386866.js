// ==UserScript==
// @name         阮一峰博客屏蔽广告后样式修复
// @namespace    roastchicken
// @version      0.1
// @description  阮一峰博客在使用屏蔽广告后的样式修复
// @author       kj863257
// @match        http*://www.ruanyifeng.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386866/%E9%98%AE%E4%B8%80%E5%B3%B0%E5%8D%9A%E5%AE%A2%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E5%90%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/386866/%E9%98%AE%E4%B8%80%E5%B3%B0%E5%8D%9A%E5%AE%A2%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E5%90%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }
    //loadjscssfile("http://www.ruanyifeng.com/blog/styles.css", "css");
    loadjscssfile('/static/themes/theme_scrapbook/theme_scrapbook.css', "css");

    var a = document.createElement('a'),img = document.createElement('img');
    img.setAttribute('src', 'about:blank;?wangbase.com/blogimg/asset/');
    a.appendChild(img);
    document.body.appendChild(a)
})();