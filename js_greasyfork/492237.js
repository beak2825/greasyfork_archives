// ==UserScript==
// @name         nexusmods-image
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MPL-2.0
// @description  nexusmods模糊图片直接显示
// @author       brackrock12
// @match        https://www.nexusmods.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/492237/nexusmods-image.user.js
// @updateURL https://update.greasyfork.org/scripts/492237/nexusmods-image.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function show_Image() {

        $("[class*='blur-image']").each(function () {
            const img = $(this);
            const classlist = img.attr('class').split(' ');
            classlist.forEach(element => {
                if (element.indexOf('blur-image') > -1) {
                    img.removeClass(element);
                }
            });
        });

        $(".mod_adult_warning_wrapper").each(function () {
            $(this).hide();
        });
        $(".unblur-btn").each(function () {
            $(this).hide();
        });
        $(".blur-description").each(function () {
            $(this).removeClass('blur-description');
        });

        if ($(".mod_adult_warning_wrapper").length == 0) return;

        // Firefox和Chrome早期版本中带有前缀
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
        // 选择目标节点
        var target = document.querySelector('body');
        // 创建观察者对象
        var observer = new MutationObserver(function (mutations) {
            const subimg = $("[class*='blur-image']");
            if (subimg.length == 0) {
                return;
            }
            subimg.each(function () {
                const img = $(this);
                const classlist = img.attr('class').split(' ');
                classlist.forEach(element => {
                    if (element.indexOf('blur-image') > -1) {
                        img.removeClass(element);
                    }
                });
            });
            $(".unblur-btn").each(function () {
                $(this).hide();
            });
            // if (subimg.length == 0) {
            //     observer.disconnect();
            // }
        });
        // 配置观察选项:
        var config = { attributes: true, childList: true, characterData: true, subtree: true }         // 传入目标节点和观察选项
        observer.observe(target, config);
    }

    setTimeout(show_Image, 100);

})();