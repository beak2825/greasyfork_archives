// ==UserScript==
// @name         LittleFox 打开台词
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  LittleFox 打开所有台词
// @author       You
// @match        https://www.littlefox.com/cn/readers/contents_list/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=littlefox.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467172/LittleFox%20%E6%89%93%E5%BC%80%E5%8F%B0%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/467172/LittleFox%20%E6%89%93%E5%BC%80%E5%8F%B0%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function run() {
        document.querySelectorAll('tr').forEach((el) => {
        const id = el.dataset.fcid
        if (id) {
          window.open(`https://www.littlefox.com/cn/supplement/org/${id}`)
        }
      })
    }

    const button = document.createElement('button')
    button.innerText = '复制'
    button.addEventListener('click', run)
    button.style.position = 'fixed'
    button.style.right = 0
    button.style.top = '50vh'
    button.style.padding = '0.5em'
    button.style.background = "#79d88f"
    document.body.appendChild(button)
})();