// ==UserScript==
// @name         Copy Prompt
// @namespace    http://tampermonkey.net/
// @version      1.1.7
// @description  danbooru.donmai.us—gelbooru.com—safebooru.org—yande.re—rule34.xxx—furry.booru.org—nozomi.la—www.zerochan.net（nozomi/zerochan不支持列表页面直接复制）
// @author       zuogangju
// @match        *://danbooru.donmai.us/*
// @match        *://gelbooru.com/*
// @match        *://safebooru.org/*
// @match        *://yande.re/*
// @match        *://rule34.xxx/*
// @match        *://furry.booru.org/*
// @match        *://nozomi.la/*
// @match        *://www.zerochan.net/*
// @match        *://safe.aibooru.online/*
// @match        *://aibooru.online/*
// @match        *://xbooru.com/*
// @match        *://konachan.com/*
// @match        *://konachan.net/*
// @match        *://furbooru.org/*
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.0.16/dist/sweetalert2.all.min.js
// @resource     customCSS https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/dist/sweetalert2.min.css
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/471731/Copy%20Prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/471731/Copy%20Prompt.meta.js
// ==/UserScript==


// 获取当前页面的URL
const currentURL = window.location.href;

const myEvent="mousemove"





/*复制文本到剪切板并弹出复制成功*/
function copyPrompt(tagsValue){
    console.log("prompt:")
    console.log(tagsValue)
    // 复制选中内容到剪贴板
    // navigator.clipboard.writeText(tagsValue)
    GM_setClipboard(tagsValue)
    Swal.fire({
        //position: 'top-end',
        icon: 'success',
        title: '复制成功',
        showConfirmButton: false,
        timer: 600
    })
}


function addEvent(selectors, qualifiedName) {
    // 选择所有图片元素
    let imageElements = document.querySelectorAll(selectors);
    // 遍历每个图片元素并添加鼠标移动监听事件
    imageElements.forEach(function (image) {
        image.addEventListener(myEvent, function (event) {
            if (event.ctrlKey) {
                // 获取data-tags属性的值
                const data = image.getAttribute(qualifiedName);
                copyPrompt(data.split(" ").join(","))
            }
            // 这里可以执行你想要的操作，例如显示在页面上等
        });
    });
}

window.onload=function() {
    'use strict';
    let selectors = '[data-tags]';
    let qualifiedName ="data-tags";

    if(currentURL.includes("danbooru.donmai.us")
        ||currentURL.includes("aibooru.online")
        ||currentURL.includes("safe.aibooru.online")
        ||currentURL.includes("gelbooru.com")){
        addEvent(selectors, qualifiedName);
    }else if (currentURL.includes("www.zerochan.net")){
        selectors = "#content .preview img";
        qualifiedName ="alt";
    }else if (currentURL.includes("safebooru.org")){
        selectors = "#content img";
        qualifiedName ="alt";
    } else if (currentURL.includes("yande.re")
        ||currentURL.includes("rule34.xxx")
        ||currentURL.includes("xbooru.com")
    ||currentURL.includes("konachan.com")
    ||currentURL.includes("konachan.net")){
        selectors = "#image";
        qualifiedName ="alt";
    }else if (currentURL.includes("nozomi.la")){
        selectors = ".container img";
        qualifiedName ="alt";
    }else if (currentURL.includes("furbooru.org")){
        selectors = "[data-image-tag-aliases]";
        qualifiedName ="data-image-tag-aliases";
    }



    addEvent(selectors, qualifiedName);
};