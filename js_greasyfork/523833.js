// ==UserScript==
// @name         manhuagui Mod v2
// @namespace    https://www.wenku8.net
// @version      1.0
// @description  apply css to novel page
// @author       You
// @match        http*://*.manhuagui.com/comic/*.html*
// @match        http*://*.manhuagui.com/*
// @icon         https://tw.manhuagui.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523833/manhuagui%20Mod%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/523833/manhuagui%20Mod%20v2.meta.js
// ==/UserScript==

document.querySelector('html').style.scrollBehavior = 'smooth'

window.addEventListener('keydown', function(e) {
    if(["ArrowUp","ArrowDown"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false)

document.addEventListener('keydown', function(e) {

    const currentX = window.scrollX
    const currentY = window.scrollY
    const step = 400

    if (e.key === 'ArrowUp') {
        window.scroll(currentX, currentY - step,'smooth')

    } else if (e.key === 'ArrowDown') {
        window.scroll(currentX, currentY + step,'smooth')
    }
})