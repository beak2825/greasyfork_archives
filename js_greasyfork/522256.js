// ==UserScript==
// @name         百度热搜页重绘
// @namespace    dreamcenter
// @version      2024-12-26
// @license      MIT
// @description  简化热搜页，适合摸鱼；可以屏蔽指定条目的热搜内容
// @author       dreamcenter
// @match        *://top.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522256/%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C%E9%A1%B5%E9%87%8D%E7%BB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/522256/%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C%E9%A1%B5%E9%87%8D%E7%BB%98.meta.js
// ==/UserScript==

var filterKeywords = [
    '专家','董明珠','金条','房','SU7'
]


// true which should be show
function filter(str) {
    for(var keyword of filterKeywords){
        if (str.includes(keyword)) return false
    }
    return true
}

(function() {
    'use strict';

    var hiddenElements = document.querySelectorAll('header,[class*=left-side-wrapper],[class*=img-wrapper],[class*=path-wrapper],[class*=trend],[class*=c-text-hot]')

    hiddenElements.forEach(item => {
        item.style.display = "none"
    })

    // 调整背景色
    var sandRoot = document.getElementById("sanRoot")
    sandRoot.style.background = "white"

    // 过滤器
    var categories = document.querySelectorAll('[class*=category-wrap]')
    for(var category of categories){
        var title = category.querySelectorAll('[class=c-single-text-ellipsis]')[0]
        title.style.fontSize = "16px"
        title.style.color = "grey"
        var isShow = filter(title.innerText)
        if (!isShow) category.style.display = "none"
    }


})();