// ==UserScript==
// @name         统计语雀文章总数
// @namespace    https://www.yuque.com/istao
// @version      0.1
// @description  统计语雀文章总数！
// @author       https://www.yuque.com/istao
// @match        https://www.yuque.com/dashboard/books
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuque.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467612/%E7%BB%9F%E8%AE%A1%E8%AF%AD%E9%9B%80%E6%96%87%E7%AB%A0%E6%80%BB%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/467612/%E7%BB%9F%E8%AE%A1%E8%AF%AD%E9%9B%80%E6%96%87%E7%AB%A0%E6%80%BB%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
     setTimeout(() => {
    let dom = document.querySelectorAll('.ant-card-body')
    let sum = 0
    dom.forEach((item) => {
        sum += Number(item.children[2].children[0].children[0].innerHTML)
    })
    console.log('%c'+sum,'font-size:36px;color:red;')
}, 2000)
})();