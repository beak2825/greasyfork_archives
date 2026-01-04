// ==UserScript==
// @name         菜鸟教程改颜色
// @namespace    http://tampermonkey.net/
// @version      2024-02-10
// @description  让"菜鸟教程"的颜色变得多样
// @author       WhiteSeven
// @match        https://www.runoob.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=runoob.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @run-at       document-end
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/487283/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B%E6%94%B9%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/487283/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B%E6%94%B9%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function ($) {
    'use strict';
    // 随机整数
    function randint(min, max) {
        // max无法取到
        return Math.floor(Math.random() * (max - min) + min);
    }

    // 填有0的16进制字符串
    function fillString(number) {
        let color = number.toString(16);
        if (color.length === 1) {
            color = '0' + color;
        }
        return color;
    }

    // 随机整数,字符串格式
    function randint16(min, max) {
        // max无法取到
        return fillString(randint(min, max).toString(16));
    }

    // 获取随机颜色
    function getRandomColor() {
        function getTopBottom(number) {
            let top = number - 64;
            let bottom = number + 64;
            if (top > 256) {
                bottom -= top - 256;
                top = 256;
            } else if (bottom < 0) {
                top += -bottom;
                bottom = 0;
            }
            return [top, bottom];
        }
        const r = randint(0, 256);
        let tb = getTopBottom(r);
        const g = randint(tb[0], tb[1]);
        tb = getTopBottom(g);
        const b = randint(tb[0], tb[1]);
        return '#' + fillString(r) + fillString(g) + fillString(b);
    }

    // 获取随机角度数值
    function getRandomRotate() {
        return randint(0, 360) + 'deg';
    }

    // 获取随机浅色(文字背景)
    function getLightColor() {
        return '#' + randint16(192, 256) + randint16(192, 256) + randint16(192, 256);
    }

    // 获取随机深色(文字背景)
    function getDarkColor() {
        return '#' + randint16(64, 192) + randint16(64, 192) + randint16(64, 192);
    }

    // 设置颜色color
    function setColor(selector, color) {
        const colorFunction = color === undefined ? getRandomColor : color;
        $(selector).css('color', colorFunction());
    }

    // 设置背景颜色backgroundColor
    function setBackgroundColor(selector, color) {
        const colorFunction = color === undefined ? getRandomColor : color;
        $(selector).css('background-color', colorFunction());
    }

    // 设置的filter
    function setFilter(selector) {
        $(selector).css('filter', `hue-rotate(${getRandomRotate()})`);
    }

    // 头像
    // TODO: 怎么修改
    ///$('link[rel="shortcut icon"]').css('filter', `hue-rotate(${getRandomRotate()})`);
    $('link').each(function(){
        const refValue = $(this).attr('rel');
        if (refValue && refValue.indexOf('icon') !== -1) {
            $(this).css('filter', `hue-rotate(${getRandomRotate()})`);
            return false;
        }
    });
    // 主页面
    // 修改log的filter
    setFilter('.logo h1');
    // 设置顶部菜单栏
    setBackgroundColor('.navigation', getDarkColor);
    // 设置左侧菜单顶部文字
    setColor('.tab', getDarkColor);
    // 设置正文科目颜色
    setColor('.codelist a.item-top h4', getDarkColor);
    // 设置右侧快捷键的颜色
    setColor('.go-top');
    setColor('.qrcode');
    setBackgroundColor('.writer');
    // 修改二维码图片的filter
    setFilter('img[src="/wp-content/themes/runoob/assets/images/qrcode.png"]');
    // 一般页面
    // 正文
    // 标题
    setColor('.color_h1', getDarkColor);
    // "注意"的背景
    $('blockquote').css('background-color', getLightColor()).find('p').css('background-color', 'inherit');
    // "实例"框的背景颜色
    $('div.example').css('background-image', `linear-gradient(#fff, ${getLightColor()} 100px)`);
    // "实例"的文字
    setColor('h2.example', getDarkColor);
    // 链接的颜色
    setColor('.article-body a', getDarkColor);
    // 代码区块的颜色
    setBackgroundColor('.prettyprint', getLightColor);
    // 查看在线实例的剪刀图片
    setFilter('img[src="/images/tryitimg.gif"]');
    // 笔记栏的左侧
    setBackgroundColor('div.altblock');
    // 笔记中的链接
    setColor('div.comt-main a', getDarkColor);
    // 笔记中作者信息的背景
    setBackgroundColor('div.tooltip', getDarkColor);
    // "点我分享笔记"
    setColor('#share_code', getDarkColor);
    // "实例"的"尝试一下"
    setBackgroundColor('.tryitbtn', getDarkColor);
    // 把"尝试一下"的字体改成白色
    $('.tryitbtn').css('color', '#fff');
    // 左边目录栏
    // 顶部月亮(太阳)图标
    setColor('#moon');
    // 被选中的目录
    // setBackgroundColor(`div.design a[href="${window.location.pathname}"]`, getDarkColor);
    (function () {
        const link = window.location.pathname;
        $('div.design a').each(function() {
            const hrefValue = $(this).attr('href');
            if (link.indexOf(hrefValue) !== -1) {
                $(this).css('background-color', getDarkColor());
                return false; // 结束循环
            }
        });
    })();
    // 录栏的标题栏
    setColor('.left_h2', getDarkColor);
    // 小屏时的目录拉开按钮
    setBackgroundColor('#pull');
    // 右侧目录
    // 标题
    setColor('.recommend-here a', getDarkColor);
    // 代码编辑页面
    // 顶部栏背景颜色
    setBackgroundColor('header', getDarkColor);
    // "点击运行"按钮
    $('#submitBTN').css({
        'background-color': getDarkColor(),
        'border-color': getDarkColor()
    });
    // 反馈界面
    // 图标
    // TODO: 不管用
    $('button.feedback-btn.feedback-btn-gray').each(function(){
        $(this).click(function(){
            $('i.feedback-logo').css('background-color', getRandomColor());
        });
    });
})(jQuery);