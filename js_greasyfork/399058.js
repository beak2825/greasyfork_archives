// ==UserScript==
// @name         教学立方课件下载脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在课件页点击导航栏“显示下载链接”
// @author       Peidong Xie
// @match        https://teaching.applysquare.com/S/Course/index/cid/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399058/%E6%95%99%E5%AD%A6%E7%AB%8B%E6%96%B9%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/399058/%E6%95%99%E5%AD%A6%E7%AB%8B%E6%96%B9%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = () => {
        if (location.hash !== '#S-Lesson-index') return;
        var navbar = document.getElementById('navbar');
        if (navbar.children[1].nodeName === 'A') return;
        var link = document.createElement('a');
        link.innerHTML = '显示下载链接';
        link.onclick = () => {
            if (location.hash !== '#S-Lesson-index') return;
            var page = document.getElementsByClassName('pagination')[0];
            if (page === undefined) {
                page = 1;
            } else {
                page = page.getElementsByClassName('active')[0].children[0].innerText;
            }
            var data = { p: page, status: 1, plan_id: lessonindex.plan_id, all: 0, pub_stat: 1 };
            $.get('/Api/CourseAttachment/getList' + top_controller.$apendUrl(), top_controller.$appendParams(data), function (res) {
                var trs = document.getElementById('table_points').children[0].children[1].children;
                var list = res.message.list;
                var length = list.length;
                for (var i = 0; i < length; i++) {
                    var td = trs[i].children[6];
                    var path = list[i].path;
                    if (td.childElementCount == 1) {
                        var link = document.createElement('a');
                        link.href = path;
                        link.innerHTML = '下载';
                        link.style.marginLeft = '24px';
                        td.appendChild(link);
                    }
                }
            });
        }
        navbar.insertBefore(link, navbar.children[1]);
    }
    window.onhashchange = () => {
        getContent();
        window.onload();
    };
})();