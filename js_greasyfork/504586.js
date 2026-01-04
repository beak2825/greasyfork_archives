// ==UserScript==
// @name         manhuagui Mod
// @namespace    https://www.wenku8.net
// @version      1.0.1
// @description  apply css to novel page
// @author       You
// @match        http*://*.manhuagui.com/comic/*.html*
// @icon         https://tw.manhuagui.com/favicon.ico
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504586/manhuagui%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/504586/manhuagui%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict'

    // Your code here...

})()

$(document).on('keydown', function(e) {
    const currentY = $(window).scrollTop()
    const length = 600

    if (e.code === 'ArrowUp') {
        $('html,body').animate({
            scrollTop: currentY - length
        })
    } else if (e.code === 'ArrowDown') {
        $('html,body').animate({
            scrollTop: currentY + length
        })
    }
})

$(window).on('hashchange', function(e) {
    console.log('hashchange')
    window.location.reload()
})