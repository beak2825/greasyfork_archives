// ==UserScript==
// @name         去除网页灰色滤镜
// @namespace    http://tampermonkey.net/
// @version      0.3.7
// @description  去除网页灰色滤镜，目前明确支持的有：哔哩哔哩，贴吧，淘宝，知乎，百度首页
// @author       DearCyan
// @runat        document-end
// @grant        none
// @match        https://*/*
// @match        https://www.bilibili.com/*
// @match        https://tieba.baidu.com/*
// @match        https://www.taobao.com/*
// @match        https://www.zhihu.com/*
// @match        https://mihoyo.com/*
// @match        https://bbs.mihoyo.com/*
// @match        https://www.miyoushe.com/*
// @match        https://music.163.com/*
// @match        https://www.huya.com/*
// @match        https://www.douyu.com/
// @icon         https://cdn-icons-png.flaticon.com/512/747/747062.png
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/455708/%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455708/%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==


console.debug('anti_gray:script start')

function anti_gray() {
    const url = window.location.href
    removeAllGray()

    // bilibili
    if (/bilibili.com/.test(url)) {
        removeClass('gray')
    }

    //tieba
    if (/tieba.baidu.com/.test(url)) {
        removeClass('tb-allpage-filter')
    }

    //douyu
    if(/douyu.com/.test(url)){
        removeClass('grayCtrl')
    }
}
//method

function removeAllGray(){
    console.debug('remove all div filter');
    const div = document.querySelectorAll('div')
    div.forEach(item=>{
            item.style.filter = 'none'
    })
}

function removeClass(className) {
    console.debug('remove class: ' + className)
    let htmlClass = document.documentElement.classList
    const arr = Array.from(htmlClass)
    const res = arr.filter(item => item !== className)
    htmlClass = res
}

function addStyle() {
    console.debug('reset filter')
    const html = document.documentElement
    const body = document.body
    html.style.filter = 'none'
    body.style.filter = 'none'
}

window.onload = anti_gray

anti_gray()

window.anti_gray=true