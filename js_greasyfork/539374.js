// ==UserScript==
// @name         xhamster 默认选择最高清晰度
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  改善xhamster采用默认的指定清晰度策略/自动清晰度策略导致的清晰度不高的问题，自动选择最高清晰度
// @author       anaaya
// @match        https://xhamster.com/videos/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.2/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xhamster.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539374/xhamster%20%E9%BB%98%E8%AE%A4%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E6%B8%85%E6%99%B0%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/539374/xhamster%20%E9%BB%98%E8%AE%A4%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E6%B8%85%E6%99%B0%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const anaaya_window = unsafeWindow
    // code here...
    const anaaya = {}
    function chooseBestQuality() {
//         所有清晰度父节点
        let eleF = document.querySelector(".quality.chooser-control.xp-settings-inner-list-inner")
        for (const e of eleF.childNodes) {
            if (e.getAttribute('data-value') == 'auto') {
                continue
            }
            if (e.className.includes('chosen')) {
                break
            }
            e.click()
            break
        }
    }
    function start() {
        try {
            console.log('script start.')
            anaaya_window.anaaya = anaaya
            chooseBestQuality()
        }catch (e) {
            console.error(e)
            alert('some error occured, please see console.')
        }
    }
    setTimeout(start, 5000)
})();