// ==UserScript==
// @name         Go to biliplus
// @namespace    https://liu233w.github.io
// @version      1.0.2
// @description  给tucao.one的某些页面的视频条目添加一个链接，一键跳转到对应的biliplus地址
// @author       Liu233w
// @match        https://www.tucao.in/*
// @icon         https://www.google.com/s2/favicons?domain=tucao.one
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427754/Go%20to%20biliplus.user.js
// @updateURL https://update.greasyfork.org/scripts/427754/Go%20to%20biliplus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.location.href.indexOf("www.tucao.in/index.php?m=search&") > -1) {
        $('.list .info').each(function () {
            const href = $(this).find('a.blue').attr('href')
            const vid = href.match(/(h\d+)/)[0]
            $(this).append(`<a href="https://www.biliplus.com/play/${vid}/">BiliPlus</a>`)
        })

    } else if (window.location.href.indexOf("www.tucao.in/list/") > -1) {
        $('li .box').each(function () {
            const href = $(this).find('a.title').attr('href')
            const vid = href.match(/(h\d+)/)[0]
            $(this).find('.info').append(`<a href="https://www.biliplus.com/play/${vid}/">BiliPlus</a>`)
        })

    } else if (window.location.href.indexOf("www.tucao.in/play/") > -1) {
        const vid = window.location.href.match(/(h\d+)/)[0]
        $('.new_tool ul').prepend(`<a href="https://www.biliplus.com/play/${vid}/">BiliPlus</a>`)
    }

})();
