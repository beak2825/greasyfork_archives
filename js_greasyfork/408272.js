// ==UserScript==
// @name         隐藏 v2ex 用户头像/页面背景
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为了更好地摸鱼
// @author       en20
// @match        https://*.v2ex.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/408272/%E9%9A%90%E8%97%8F%20v2ex%20%E7%94%A8%E6%88%B7%E5%A4%B4%E5%83%8F%E9%A1%B5%E9%9D%A2%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/408272/%E9%9A%90%E8%97%8F%20v2ex%20%E7%94%A8%E6%88%B7%E5%A4%B4%E5%83%8F%E9%A1%B5%E9%9D%A2%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 头像列表
    let list = document.querySelectorAll(".avatar")
    for (let i = 0; i < list.length; i++) {
        list[i].style.display='None';
    }

    // 移除背景
    var wrapperDom = document.querySelector('#Wrapper')
    if (wrapperDom) {
        wrapperDom.style.background = '#e2e2e2'
    }

    // 移除头部 V2EX logo
    var logoDom = document.querySelector('#Logo')
    if (logoDom) {
        logoDom.style.background = 'none'
    }

    // 节点 header 图片
    let nodeHeader = document.querySelector('.node-header')
    if (nodeHeader) {
        nodeHeader.style.background = '#001D25'
        nodeHeader.querySelector('img').remove()
    }
    const header = document.querySelector('.node-header > .page-content-header')
    if (header) {
        header.style.backgroundColor = '#fff'
        header.style.color = '#000'
    }
    // 替换显眼的感谢图标
    var thinksDom = document.querySelectorAll('.cell .small img')
    for (let elemOld of thinksDom) {

        var elemParent = elemOld.parentNode
        var elemNew = document.createElement('span')
        elemNew.innerHTML = '感谢: '
        // 如果你需要替换 `感谢` 颜色的话
        // elemNew.style.color = ''
        elemParent.replaceChild(elemNew, elemOld)
    }
})();