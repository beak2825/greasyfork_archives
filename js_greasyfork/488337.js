// ==UserScript==
// @name         Pt-Page-DIY
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  自定义PT页面
// @author       7ommy
// @match        *://*.agsvpt.com/*
// @match        *://*.pterclub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agsvpt.com
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488337/Pt-Page-DIY.user.js
// @updateURL https://update.greasyfork.org/scripts/488337/Pt-Page-DIY.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 是否屏蔽AGSV悬浮按钮
    var hide_agsv_float_btn = 1;
    // 是否屏蔽AGSV热门/经典页
    var hide_agsv_recommend = 1;
    // 是否屏蔽AGSV海报
    var hide_agsv_poster = 1;
    // 是否屏蔽猫站悬浮按钮
    var hide_pter_float_btn = 1;

    if(hide_agsv_float_btn){
        var element = document.querySelector('.circle-container');
        if(element){
            element.style.display = 'none';
        }
    }

    if(hide_agsv_recommend && window.location.href.includes("agsvpt.com/torrents.php")){
        var element1 = document.querySelector('#outer > table.main > tbody > tr > td > h2:nth-child(1)');
        if(element1){
            element1.style.display = 'none';
        }

        var element2 = document.querySelector('#outer > table.main > tbody > tr > td > table:nth-child(2)');
        if(element2){
            element2.style.display = 'none';
        }

        var element3 = document.querySelector('#outer > table.main > tbody > tr > td > h2:nth-child(3)');
        if(element3){
            element3.style.display = 'none';
        }

        var element4 = document.querySelector('#outer > table.main > tbody > tr > td > table:nth-child(4)');
        if(element4){
            element4.style.display = 'none';
        }

        if(hide_agsv_poster){
            // $('img').hide();
            // 选择特定路径下每一行指定单元格中的所有图片
            var images = document.querySelectorAll('#outer > table.main > tbody > tr > td > table.torrents > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) img');

            // 遍历并隐藏这些图片
            images.forEach(function(img) {
                img.style.display = 'none';
            });
        }

    }

    if(hide_pter_float_btn){
        var element_pter = document.querySelector('#aside-nav');
        if(element_pter){
            element_pter.style.display = 'none';
        }
    }
})();