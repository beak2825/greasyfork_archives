// ==UserScript==
// @name         bilibili美化，去除bilibili左上角多余的元素（主页完全去除，其他页面保留回到主页的主站标识）。可选择安装后观察效果，也可直接在下方对比图中查看。
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  解决ABP不方便解决的问题
// @author       黄先生
// @match        *.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405977/bilibili%E7%BE%8E%E5%8C%96%EF%BC%8C%E5%8E%BB%E9%99%A4bilibili%E5%B7%A6%E4%B8%8A%E8%A7%92%E5%A4%9A%E4%BD%99%E7%9A%84%E5%85%83%E7%B4%A0%EF%BC%88%E4%B8%BB%E9%A1%B5%E5%AE%8C%E5%85%A8%E5%8E%BB%E9%99%A4%EF%BC%8C%E5%85%B6%E4%BB%96%E9%A1%B5%E9%9D%A2%E4%BF%9D%E7%95%99%E5%9B%9E%E5%88%B0%E4%B8%BB%E9%A1%B5%E7%9A%84%E4%B8%BB%E7%AB%99%E6%A0%87%E8%AF%86%EF%BC%89%E3%80%82%E5%8F%AF%E9%80%89%E6%8B%A9%E5%AE%89%E8%A3%85%E5%90%8E%E8%A7%82%E5%AF%9F%E6%95%88%E6%9E%9C%EF%BC%8C%E4%B9%9F%E5%8F%AF%E7%9B%B4%E6%8E%A5%E5%9C%A8%E4%B8%8B%E6%96%B9%E5%AF%B9%E6%AF%94%E5%9B%BE%E4%B8%AD%E6%9F%A5%E7%9C%8B%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/405977/bilibili%E7%BE%8E%E5%8C%96%EF%BC%8C%E5%8E%BB%E9%99%A4bilibili%E5%B7%A6%E4%B8%8A%E8%A7%92%E5%A4%9A%E4%BD%99%E7%9A%84%E5%85%83%E7%B4%A0%EF%BC%88%E4%B8%BB%E9%A1%B5%E5%AE%8C%E5%85%A8%E5%8E%BB%E9%99%A4%EF%BC%8C%E5%85%B6%E4%BB%96%E9%A1%B5%E9%9D%A2%E4%BF%9D%E7%95%99%E5%9B%9E%E5%88%B0%E4%B8%BB%E9%A1%B5%E7%9A%84%E4%B8%BB%E7%AB%99%E6%A0%87%E8%AF%86%EF%BC%89%E3%80%82%E5%8F%AF%E9%80%89%E6%8B%A9%E5%AE%89%E8%A3%85%E5%90%8E%E8%A7%82%E5%AF%9F%E6%95%88%E6%9E%9C%EF%BC%8C%E4%B9%9F%E5%8F%AF%E7%9B%B4%E6%8E%A5%E5%9C%A8%E4%B8%8B%E6%96%B9%E5%AF%B9%E6%AF%94%E5%9B%BE%E4%B8%AD%E6%9F%A5%E7%9C%8B%E3%80%82.meta.js
// ==/UserScript==

window.onload = function() {
    setTimeout(function() {
        for(var i=0; i<10; i++) {
            if(location.href == "https://www.bilibili.com/") {
                //document.getElementsByClassName('nav-link-item')[0].remove();
                document.getElementsByClassName('nav-link-item')[i].style.visibility = "hidden";
            }else {
                document.getElementsByClassName('nav-link-item')[i+1].style.visibility = "hidden";
            }
        }
    }, 1500)
}