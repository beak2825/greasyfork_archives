// ==UserScript==
// @name         HideAdForWuhaolin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hide ad in webpack.wuhaolin.cn
// @author       Roastwind
// @match        https://webpack.wuhaolin.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389993/HideAdForWuhaolin.user.js
// @updateURL https://update.greasyfork.org/scripts/389993/HideAdForWuhaolin.meta.js
// ==/UserScript==

(function() {
'use strict';
var ready = function(callback) {
    var href = window.location.href
    var isWuhaolin = /^https?:\/\/webpack\.wuhaolin.cn/.test(href)
    if (!isWuhaolin) return
    var timer = setInterval(function() {
        var ad = document.querySelector('.gitbook-plugin-modal')
        var style = ad.style
        // add && style.display === 'block'
        if (ad) {
            clearInterval(timer)
            callback && callback()
        }
    }, 100)
}

ready(function() {
    init()
})

var init = function () {
    // hideAd()
    var style = document.createElement('style')
    style.textContent = '.gitbook-plugin-modal { display: none !important; }'
    document.getElementsByTagName('head')[0].appendChild(style)
}

var hideAd = function () {
    var ad = document.querySelector('.gitbook-plugin-modal')
    // https://www.cnblogs.com/LiuWeiLong/p/6058059.html
    ad.style.setProperty('display', 'none', 'important')
}

})();