// ==UserScript==
// @name         灰色网页变彩色
// @version      0.1
// @description  取消各网站首页变灰
// @author       AyaSono
// @match        http://*/*
// @match        https://*/*
// @icon         https://img1.baidu.com/it/u=3816024841,1982428002&fm=253&fmt=auto&app=138&f=JPEG?w=444&h=444
// @grant        none
// @namespace https://greasyfork.org/users/992881
// @downloadURL https://update.greasyfork.org/scripts/456054/%E7%81%B0%E8%89%B2%E7%BD%91%E9%A1%B5%E5%8F%98%E5%BD%A9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/456054/%E7%81%B0%E8%89%B2%E7%BD%91%E9%A1%B5%E5%8F%98%E5%BD%A9%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
/*/
    const html = document.querySelector('html')
    if (window.getComputedStyle(html).filter === 'grayscale(1)' || window.getComputedStyle(html).filter === 'grayscale(100%)') {
        html.style.filter = 'none'
        console.log('grayscale reset')
    }
    console.log('grayscale undetected')
/*/

    function grayKiller(dom) {
        const filter = window.getComputedStyle(dom, null).getPropertyValue('filter')
        filter.includes('grayscale') && dom.style.setProperty('filter', 'none')
    }
    grayKiller(document.documentElement)
    grayKiller(document.body)

})();