// ==UserScript==
// @name         暴力阻止牛阅网的自动跳转首页（打开F12控制台时）
// @version      0.1.0
// @description  仅作为参考脚本，我技术有限，但搜不到相关插件就只能自己写了。采用离开页面（unload）之前弹窗提醒的方式阻止跳转。
// @author       SineObama
// @match        https://www.niuyueshu.com/*
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1238190
// @downloadURL https://update.greasyfork.org/scripts/484738/%E6%9A%B4%E5%8A%9B%E9%98%BB%E6%AD%A2%E7%89%9B%E9%98%85%E7%BD%91%E7%9A%84%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E9%A6%96%E9%A1%B5%EF%BC%88%E6%89%93%E5%BC%80F12%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%97%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/484738/%E6%9A%B4%E5%8A%9B%E9%98%BB%E6%AD%A2%E7%89%9B%E9%98%85%E7%BD%91%E7%9A%84%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E9%A6%96%E9%A1%B5%EF%BC%88%E6%89%93%E5%BC%80F12%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%97%B6%EF%BC%89.meta.js
// ==/UserScript==

'use strict';

// 全局上下文
var ctx = {
    // 是否启用阻止跳转（状态）
    myBlockJump: true
};

doBlockJump();

function doBlockJump() {

    // 这种方式会同时阻止所有离开页面的操作，包括用户自己关闭网页的操作，所以后面做了一些优化。
    window.addEventListener('beforeunload', function (event) {
        if (ctx.myBlockJump) {
            console.log('prevent window unload', event);
            event.preventDefault();
        }
    });

    // 如果是用户点击操作，则允许页面跳转
    window.addEventListener('click', releaseJump, true);

    var reBlockNum;

    function releaseJump(e) {
        if (!ctx.myBlockJump) {
            return;
        }

        // 不管点击的是什么，实际可能有很多情况，
        // 通过暂时关闭阻止功能来允许页面跳转
        ctx.myBlockJump = false;
        clearTimeout(reBlockNum);
        reBlockNum = setTimeout(function () {
            ctx.myBlockJump = true;
        }, 500);
    }

    optMyBlock();
}

// 针对各种场景优化拦截方法
function optMyBlock() {
    // 允许在浏览器中关闭后台网页，避免弹窗
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            console.debug('用户离开了当前窗口');
            ctx.myBlockJump = false;
        } else if (document.visibilityState === 'visible') {
            console.debug('用户回到了当前窗口');
            ctx.myBlockJump = true;
        }
    });

    // 鼠标离开网页范围后，可能是准备点击网页页签的关闭按钮，也可能使用其他快捷键关闭，允许这种操作，
    // 但同时做个延迟，有可能是打开F12的瞬间鼠标离开了，此时仍然保持一下阻止跳转
    var mouseleaveUnblockNum;
    document.addEventListener('mouseleave', function () {
        clearTimeout(mouseleaveUnblockNum);
        mouseleaveUnblockNum = setTimeout(function () {
            console.debug('鼠标离开了当前窗口');
            ctx.myBlockJump = false;
        }, 200);
    });
    document.addEventListener('mouseover', function (event) {
        if (event.target === document.body.parentElement) {
            clearTimeout(mouseleaveUnblockNum);
            console.debug('鼠标回到了当前窗口');
            ctx.myBlockJump = true;
        }
    });

    // 在页面中按下Ctrl很可能是使用快捷键，可能想关闭网页，此时不阻止跳转
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && ctx.myBlockJump) {
            console.debug("Ctrl键被按下！");
            ctx.myBlockJump = false;
        }
    });
    document.addEventListener('keyup', function (event) {
        if (!event.ctrlKey && !ctx.myBlockJump) {
            console.debug("Ctrl键松开！");
            ctx.myBlockJump = true;
        }
    });
}