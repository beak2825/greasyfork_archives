// ==UserScript==
// @name         教学立方课件下载脚本
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  在课件页点击导航栏"显示下载链接", 无论课件是否开放下载权限. 仅作学习研究之用, 敬请尊重版权!
// @author       Richard
// @match        https://teaching.applysquare.com/S/Course/index/cid/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437483/%E6%95%99%E5%AD%A6%E7%AB%8B%E6%96%B9%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/437483/%E6%95%99%E5%AD%A6%E7%AB%8B%E6%96%B9%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.meta.js
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
            var page_index = document.getElementsByClassName('pagination')[0];
            if (page_index == undefined) {
                page_index = 1;
            } else {
                page_index = page_index.getElementsByClassName('active')[0].children[0].innerText;
            }
            var list_data = { parent_id: 0, page: page_index, plan_id: lessonindex.plan_id, uid: lessonindex.uid, cid: lessonindex.cid };
            $.get('/Api/CourseAttachment/getList' + top_controller.$apendUrl(), top_controller.$appendParams(list_data), function (res) {
                var list = res.message.list;
                var trs = document.getElementById('table_points').children[0].children[1].children;
                var length = list.length;
                for (var i = 0; i < length; i++) {
                    var id = list[i].id;
                    var item_data = { id: id, uid: lessonindex.uid, cid: lessonindex.cid };
                    (function (idx) {
                        var td = trs[idx].children[6];
                        if (td.childElementCount == 1)
                            $.get('/Api/CourseAttachment/ajaxGetInfo' + top_controller.$apendUrl(), top_controller.$appendParams(item_data), function(res) {
                                var path = res.message.path;
                                var link = document.createElement('a');
                                link.href = path;
                                link.innerHTML = '下载';
                                link.style.marginLeft = '12px';
                                td.appendChild(link);
                            });
                    })(i);
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