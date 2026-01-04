// ==UserScript==
// @name         Cover Downloader for Amazon
// @namespace    https://chiyukiruon.com/
// @version      1.0.0
// @description  获取亚马逊商品封面
// @author       ChiyukiRuon
// @supportURL   https://github.com/ChiyukiRuon/cover-downloader-for-amazon
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.co.jp
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/507793/Cover%20Downloader%20for%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/507793/Cover%20Downloader%20for%20Amazon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentUrl = window.location.href.split('?')[0]

    let asin = extractAsin(currentUrl)

    if (asin) {
        GM_registerMenuCommand('获取大图', function() {
            openImage('l')
        })

        GM_registerMenuCommand('获取小图', function() {
            openImage('s')
        })
    } else {
        GM_registerMenuCommand('未获取到商品 ASIN', function() {
            alert('未获取到商品 ASIN')
        })
    }

    /**
     * 从网址中提取 ASIN
     *
     * @param {string} url 网址
     * @return {string} ASIN
     * @author ChiyukiRuon
     * */
    function extractAsin(url) {
        let asin = url.match(/\/(?:product|dp)\/([A-Z0-9]{10})/)
        return asin ? asin[1] : null
    }

    /**
     * 新标签页打开图片
     *
     * @param {string} size 大图(l)或小图(s)
     * @return {void}
     * @author ChiyukiRuon
     * */
    function openImage(size) {
        if (!asin) return
        let baseUrl = `https://m.media-amazon.com/images/P/${asin}`
        let imageUrl = size === 'l' ? `${baseUrl}.01.MAIN._SCRM_.jpg` : `${baseUrl}.jpg`
        window.open(imageUrl, '_blank')
    }
})();