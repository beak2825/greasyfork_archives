// ==UserScript==
// @name         Clear Zhihu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一个清净的知乎
// @author       lk
// @match        https://www.zhihu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454608/Clear%20Zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/454608/Clear%20Zhihu.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function $(str) {
        return document.querySelector(str)

    }

    function setDisplayNone(e) {
       e && (e.style.display = 'none')
    }

    function removeRightBar() {
       const rightBar = $('.css-1qyytj7')
       setDisplayNone(rightBar)
    }
    function removeHeader() {
        const herader = $('header')
       setDisplayNone(herader)
    }

    function removeBanner() {
        const bannerWrap = $('.Topstory') || {children: []}
        const banner = bannerWrap.children[0]
        setDisplayNone(banner)
    }

    function resetLocation() {
        const container = $('.Topstory-container')
        const container1 = $('.Question-main')
        container1.style['justify-content'] = 'center'
        container.style['justify-content'] = 'center'
    }

    function fixedHead() {
        const head = $('.Topstory-tabCard')
        $('.Topstory-mainColumnCard').style.paddingTop = '45px'
        head.style = `position: fixed; z-index: 100; width: 693px; border-bottom: 1px #ccc solid; top: 0;`
    }

    console.debug('【Watermelon Zhihu】 开始运行');

    // 移除右边栏
    removeRightBar()

    // 移除顶部
    removeHeader()

    // 移除banner广告
    removeBanner()

    // 内容居中
    resetLocation()

    // 固定顶部
    fixedHead()

})();
