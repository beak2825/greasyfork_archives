// ==UserScript==
// @name         Web Weixin Helper
// @namespace    http://creamidea.github.io/
// @version      0.0.1
// @description  make web weixin fullscreen
// @author       creamidea
// @license      MIT License (Expat)
// @email        creamidea@gmail.com
// @match        https://wx.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23256/Web%20Weixin%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/23256/Web%20Weixin%20Helper.meta.js
// ==/UserScript==

(function () {
    var timer

    function resize() {
        $('.main').css({
            'paddingTop': 0,
            'height': '100%'
        }).find('.main_inner').css({
            'maxWidth': $('body').width()
        })
    }

    $(window).on('resize', resize)

    resize()
    timer = setInterval(function () {
        if ( $('.main').css('paddingTop') === 0 ) {
            resize()
            clearInterval(timer)
        }
    }, 1000)

})()