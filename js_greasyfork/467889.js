// ==UserScript==
// @name         Zlibrary+Douban
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  check book rate in douban
// @author       Silvio27
// @match        https://lib-samzjiiwyqjxzv4sp36yxv7v.1lib.cz/book/*
// @match        https://lib-n6cmvvqvhglwq5udt6lialfw.1lib.at/book/*
// @match        https://zlibrary-africa.se/book/*
// @match        https://zh.z-library.se/*
// @match        https://z-library.se/*
// @match        https://zh.z-lib.gs/*
// @match        https://zh.z-library.rs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1lib.cz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467889/Zlibrary%2BDouban.user.js
// @updateURL https://update.greasyfork.org/scripts/467889/Zlibrary%2BDouban.meta.js
// ==/UserScript==


function addDoubanLink() {
    let target = document.getElementsByTagName('h1')[0]
    let bookName = target.innerText
    let aTag = document.createElement("a")
    aTag.href = "https://www.douban.com/search?q=" + bookName.split(/[(（:：【]/)[0]
    aTag.target = "_blank"
    aTag.style.color = '#007722' // 豆瓣绿
    aTag.style.textDecoration = "none"
    aTag.innerText = bookName
    target.innerText = ""
    target.append(aTag)
}



(function () {
    'use strict';
    console.log('Added Douban Link')
    addDoubanLink()
    // 获取要移动的元素
    var commentsElement = document.querySelector('z-comments');

    // 获取目标元素
    var booksMosaicElement = document.querySelector('.books-mosaic');

    // 检查是否找到了这两个元素
    if (commentsElement && booksMosaicElement) {
        // 获取目标元素的父元素
        var parentElement = booksMosaicElement.parentNode;

        // 将commentsElement插入到booksMosaicElement之前
        parentElement.insertBefore(commentsElement, booksMosaicElement);
    }

})();