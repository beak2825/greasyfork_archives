// ==UserScript==
// @name         鲨鱼TV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  鲨鱼TV去广告
// @author       You
// @match        https://www.danmudy.com/*
// @match        https://www.danmutv.com/*
// @match        https://www.m4411.com.com/*
// @match        https://www.danmutv.com/*
// @icon         https://sports3.gtimg.com/community/a2173c75a5bb42ab91c17fb723b44c43.webp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509981/%E9%B2%A8%E9%B1%BCTV.user.js
// @updateURL https://update.greasyfork.org/scripts/509981/%E9%B2%A8%E9%B1%BCTV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep1(ms, callback) {
        setTimeout(callback, ms)
    }

    //sleep 1s
    sleep1(2000, () => {
        remove1()
    })
    // 生成去除广告按钮
    let btn = document.createElement('button');
    // 按钮文字
    btn.innerText = '去除广告';
    // 添加按钮的样式类名class值为deleteBtn
    btn.setAttribute('class', 'deleteBtn');
    // 生成style标签
    let style = document.createElement('style');
    // 把样式写进去
    style.innerText = `.deleteBtn{position:fixed;top:150px;right:15px;width:75px;height:55px;padding:3px 5px;border:1px solid #0d6efd;cursor:pointer;color:#0d6efd;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.deleteBtn:hover{background-color:#0d6efd;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(style);
    // 在body中添加button按钮
    document.body.appendChild(btn);
    // 点击按钮去执行去除广告函数 remove1
    document.querySelector('.deleteBtn').addEventListener('click', function () {
        remove1();
    })

    function remove1() {
        if (document.getElementById("coupletright") != null) {
            document.getElementById("coupletright").remove();
        };
        if (document.getElementById("coupletleft") != null) {
            document.getElementById("coupletleft").remove();
        };
        if (document.getElementById("PERxrR") != null) {
            document.getElementById("PERxrR").remove();
        };
        document.getElementById("hbidbox").parentElement.remove();
        document.getElementsByClassName('am-gallery am-avg-sm-1 am-avg-md-2 am-avg-lg-2 am-gallery-imgbordered adlists am-no-layout')[0].remove();
        document.getElementById('adv_wrap_hh').remove();
    }
})();