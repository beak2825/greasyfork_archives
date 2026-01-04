// ==UserScript==
// @name         GOOGLE 指定 BING 壁纸
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将 google 首页背景替换为 bing 每日图片
// @author       dksong
// @match        https://www.google.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449107/GOOGLE%20%E6%8C%87%E5%AE%9A%20BING%20%E5%A3%81%E7%BA%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/449107/GOOGLE%20%E6%8C%87%E5%AE%9A%20BING%20%E5%A3%81%E7%BA%B8.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    document.querySelector('.c93Gbe').style.background = 'unset' // footer 透明
    document.body.style.background = 'url(https://api.dujin.org/bing/1920.php) center/cover'
})()
