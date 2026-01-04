// ==UserScript==
// @name         京东读书助手
// @namespace    https://github.com/GitHub-Xzhi
// @version      0.1.2
// @description  为了更好的摸鱼，将【上一章】【下一章】按钮的字样分别改为【prev】【next】，并修改颜色为透明；鼠标离开头部和侧栏就隐藏，否则就显示。
// @author       Xzhi
// @match        https://e-m.jd.com/reader/*
// @icon         https://e-m.jd.com/reader/ico.png
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/450607/%E4%BA%AC%E4%B8%9C%E8%AF%BB%E4%B9%A6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/450607/%E4%BA%AC%E4%B8%9C%E8%AF%BB%E4%B9%A6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

GM_addStyle(`.prevChapter:before {content: "prev" !important;}`);
GM_addStyle(`.nextChapter:before {content: "next" !important;}`);
GM_addStyle(`.nextChapter{background-color: rgb(255,255,255,0) !important;}`);
GM_addStyle(`.prevChapter{background-color: rgb(255,255,255,0) !important;}`);

(function () {
    'use strict';
    reload();

    // 重新加载
    function reload() {
        setTimeout(() => elementsDeal(), 500);
    }

    // 按钮点击事件绑定
    function clickBind() {
        $('.prevChapter').bind('click', () => reload());
        $('.nextChapter').bind('click', () => reload());
    }

    // 元素处理
    function elementsDeal() {
        let side = $('.side-tools-box');
        side.css('opacity', '0');
        side.mouseenter(() => side.css('opacity', '1'));
        side.mouseleave(() => side.css('opacity', '0'));
        let pct = $('.pc-chapter-title');
        pct.css('opacity', '0');
        pct.mouseenter(function () {
            pct.css('opacity', '1')
        });
        pct.mouseleave(function () {
            pct.css('opacity', '0')
        })
        clickBind();
    }

    // 下滑暂时无效果，是否延迟加载才可以？
    var windowTop = 0;
    $(window).scroll(function () {
        let scrollS = $(this).scrollTop();
        let stb = document.querySelector(".side-tools-box");
        if (scrollS >= windowTop) {
            // 下滑隐藏
            stb.style.opacity = 0;
            windowTop = scrollS;
        } else {
            // 上划显示
            // stb.style.opacity = 1;
            windowTop = scrollS;
        }
    });
})();