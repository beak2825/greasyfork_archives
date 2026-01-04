// ==UserScript==
// @name         Tower任务标题复制
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  任务标题一键复制功能
// @author       ZJoker
// @match        https://tower.im/teams/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tower.im
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453682/Tower%E4%BB%BB%E5%8A%A1%E6%A0%87%E9%A2%98%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/453682/Tower%E4%BB%BB%E5%8A%A1%E6%A0%87%E9%A2%98%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function copyTitle(e) {
        const contentDiv = e.target.parentNode.nextElementSibling.nextElementSibling
        const title = contentDiv.children[1].innerHTML
        let oInput = document.createElement('input')
        oInput.value = title
        document.body.appendChild(oInput)
        oInput.select()
        document.execCommand('Copy')
        oInput.remove()
    }

    setTimeout(() => {
        const todoList = document.querySelectorAll('.todo-actions')
        todoList.forEach(item => {
            const span = document.createElement('span')
            span.style.cursor = 'pointer'
            span.style.width = '25px'
            span.style.display = 'flex'
            span.style.alignItems = 'center'
            span.style.justifyContent = 'center'
            span.style.height = '100%'
            span.style.outlineColor = '#44acb6'
            span.style.color = '#44acb6'
            span.style.textDecoration = 'none'
            span.style.margin = '0'
            span.style.padding = '0'
            span.style.fontSize = '12px'
            span.style.verticalAlign = 'baseline'
            span.style.background = 'transparent'
            span.title = '复制'
            span.innerHTML = '复制'
            span.addEventListener('click', copyTitle)
            item.appendChild(span)
        })
    }, 1000)


})();