// ==UserScript==
// @name         CSDN阅读模式
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除CSDN中的多余的信息，包括广告推荐等信息，将背景图片重置为护眼模式
// @author       https://github.com/KDaisyers
// @match        https://blog.csdn.net/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.0.min.js
// @require      https://greasyfork.org/scripts/401025-%E6%82%AC%E6%B5%AE%E8%8F%9C%E5%8D%95%E6%8C%89%E9%92%AE/code/%E6%82%AC%E6%B5%AE%E8%8F%9C%E5%8D%95%E6%8C%89%E9%92%AE.js?version=793227
// @downloadURL https://update.greasyfork.org/scripts/401026/CSDN%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/401026/CSDN%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

// 添加CSS
function loadStyles(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(link);
}

// 移除多余信息
function removeHtml() {
    // 移除多余的信息，包括作者信息，推荐信息，导航栏，右侧点赞栏，广告位
    $("#csdn-toolbar").remove();
    $("#mainBox > aside").remove();
    $("body > div.tool-box.vertical > ul").remove();
    $("#mainBox > main > div.recommend-box").remove();
    $("#mainBox > main > div.template-box").remove();
    $("#dmp_ad_58").remove();
}

/**
 * 悬浮按钮
 * 使用了 float-module
 * 已在 https://daisylike.top/float/js/float-module.min.js 中加载
 */
function floatBtn() {
    $('.fm-li').css("cssText", "right: 70px !important;bottom: 65px !important;");
}


// 默认样式
function defaultCSS() {
    // 页面居中显示
    $(".container#mainBox").css("cssText", "width:auto !important;");
    // 去掉默认背景图片 并添加护眼模式
    $("body").css("cssText", "background:#FAFAFA !important;");
}

(function () {
    'use strict';
    let toggle = window.sessionStorage.getItem('isHided') || 'true';
    setTimeout(function () {
        /**
         * 由于举报和反馈框是异步加载
         * 因此可以设置 500 毫秒后再执行
         */
        $("body > div:nth-child(59) > div").remove();
        $(".csdn-side-toolbar").remove();
    }, 500)

    // 加载 float-module 需要的 css
    loadStyles("https://kdaisyers.github.io/float/css/float-module.min.css");
    loadStyles("https://kdaisyers.github.io/float/fontawesome/css/font-awesome.min.css");

    if (toggle === 'true') {
        // 移除广告等
        removeHtml();
        // 悬浮按钮
        floatBtn();
        // 默认加载过后的样式
        defaultCSS();
    }

    // 生成悬浮按钮
    var fm = new FloatModule({
        radius: '50%',
        theme_color: '#56b4f8',
        theme_content_color: '#fff',
        font_size: '18px',
        width_height: '50px',
        margin_screen_x: '50px',
        margin_screen_y: '50px',
        margin_li: '10px',
        animation: 'slide-in',
        position: 'right-bottom',
        icon_css_path: '',
        btn_config: [{
            icon: 'fa fa-th-large'
        }, {
            icon: 'fa fa-sign-out',
            title: '退出阅读模式',
            click: function () {
                window.sessionStorage.setItem('isHided', false)
                window.location.reload()
            }
        }, {
            icon: 'fa fa-book',
            title: '阅读模式',
            click: function () {
                window.sessionStorage.setItem('isHided', true)
                window.location.reload()
            }
        }, {
            icon: 'fa fa-github',
            title: 'github项目地址',
            click: function () {
                window.open('https://kdaisyers.github.io');
            }
        }]
    });

    // 悬浮按钮样式重置
    floatBtn();
})();