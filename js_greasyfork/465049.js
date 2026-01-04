// ==UserScript==
// @name         IT之家清爽文章阅读
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  只保留标题、文章、打分和评论
// @author       Bingnme
// @license      MIT
// @match        https://www.ithome.com/0/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465049/IT%E4%B9%8B%E5%AE%B6%E6%B8%85%E7%88%BD%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/465049/IT%E4%B9%8B%E5%AE%B6%E6%B8%85%E7%88%BD%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //隐藏shareto元素
    var shareto = document.querySelectorAll(".shareto");//获取shareto元素
    for (var i = 0; i < shareto.length; i++) {
      shareto[i].style.display = 'none'; // 将所有匹配的元素的 display 样式设置为 none,从而隐藏它们
    }
    //隐藏iframe元素
    var iframes = document.querySelectorAll('iframe');//获取iframe元素
    Array.from(iframes).forEach(function(iframe) {
        iframe.style.display = 'none'; // 将所有 `<iframe>` 元素设置为隐藏状态
    });


    var side_func = document.getElementById("side_func");
    var top = document.getElementById("top");
    var nav = document.getElementById("nav");
    var tt = document.getElementById("tt");
    var dt = document.getElementById("dt");
    var fls = document.getElementById("fls");
    var lns = document.getElementById("lns");
    var fi = document.getElementById("fi");
    var cl = dt.children[1];
    var wz = dt.children[0];
    var cv = wz.children[0];
    var related_post = wz.children[6];
    var dajia = wz.iframe
    side_func.style.display = 'none';//将元素隐藏
    top.style.display = 'none';
    nav.style.display = 'none';
    tt.style.display = 'none';
    fls.style.display = 'none';
    cl.style.display = 'none';
    cv.style.display = 'none';
    lns.style.display = 'none';
    fi.style.display = 'none';
    related_post.style.display = 'none';

})();