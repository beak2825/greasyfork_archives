// ==UserScript==
// @name         掘金纯净模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  简单的掘金广告去除
// @author       LTF
// @match        https://juejin.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469111/%E6%8E%98%E9%87%91%E7%BA%AF%E5%87%80%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/469111/%E6%8E%98%E9%87%91%E7%BA%AF%E5%87%80%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setInterval(function () {
        //右侧广告
        var elements = document.querySelectorAll('div.sidebar-block.banner-block');
        elements.forEach(function (element) {
            element.style.display = 'none';
        });

        //滚动广告
        var gg = document.getElementsByClassName('banner banner sticky-banner');
        for (var i = 0; i < gg.length; i++) {
            gg[i].style.display = 'none'; // 设置样式
        }

        //app下载广告页面
        var appad = document.getElementsByClassName('block-body');
        appad[0].style.display = 'none';



        var listad = document.getElementsByClassName('sidebar-block link-block');
        listad[0].style.display = 'none';

        //导航栏广告
        var navad = document.querySelectorAll('.phone-hide .nav-item.link-item.special-activity-item');

        navad[0].style.display = 'none';

        //文章广告
        var advertisements = document.getElementsByClassName('advertisement');

        let centerForAdvertising = advertisements[0]
        let centerForAdvertising_value = advertisements[0].children[1].innerHTML

        if (centerForAdvertising_value == '广告') {
            centerForAdvertising.style.display = 'none';
        } else {
            return
        }

    }, 1000); // 每隔1秒执行一次
})();