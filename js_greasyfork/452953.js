// ==UserScript==
// @name         乌龟雷达
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  乌龟雷达插件
// @author       You
// @match        *://*.scboy.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scboy.cc
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452953/%E4%B9%8C%E9%BE%9F%E9%9B%B7%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/452953/%E4%B9%8C%E9%BE%9F%E9%9B%B7%E8%BE%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $.ajax({url: 'https://www.scboy.cc/?user-3.htm'}).then(res => {
        const $res = $(res)
        const replys = $res.find('.media-body').find('.text-dark[title=主题回复]')
        const urlsMap = {}
        const urls = replys.each(i => {
            const url = replys[i].href.replace('https://www.scboy.cc/', '').split('#')[0]
            urlsMap[url] = true
        })
        const links = $('.list-unstyled').find('li.media .xs-thread-a')
        const tortiseUrl = []
        links && links.each(i => {
            const link = links[i]
            const url = link.href.replace('https://www.scboy.cc/', '').split('#')[0]
            if (urlsMap[url]) {
                const myImage = document.createElement("img");
                myImage.src = 'https://www.scboy.cc/plugin/scboy_moj/face/sb/156.png';
                myImage.style = "width: 16px;height:16px;"
                link.append(myImage)
            }
        })
    })
})();