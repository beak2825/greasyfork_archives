// ==UserScript==
// @name         自定义屏幕分辨率
// @namespace    http://tampermonkey.net/
// @description  适合移动端、pc端
// @version      0.4
// @include      *
// @grant        none
// @license      MIT
// @author       abusizhishen
// @downloadURL https://update.greasyfork.org/scripts/521739/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B1%8F%E5%B9%95%E5%88%86%E8%BE%A8%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/521739/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B1%8F%E5%B9%95%E5%88%86%E8%BE%A8%E7%8E%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function setResolution() {
        let box = document.createElement('div')
        box.style.position = 'absolute'
        box.style.top = '10%'
        box.style.right = '10%'
        box.style.zIndex = '9999'
        box.style.display = 'flex'
        box.style.flexDirection = 'column'
        box.style.padding = '3px'
        box.style.backgroundColor = 'deepskyblue'

        let label = document.createElement('label')
        label.textContent = '设置分辨率'
        // label for input

        label.setAttribute('for', 'input')

        let input = document.createElement('input')
        input.style.width = '5rem'
        input.style.height = '3rem'
        input.style.minWidth = '100px'
        input.style.minHeight = '20px'
        input.style.fontSize = '2rem'
        input.value = localStorage.getItem('fenbianlv') ?? '100'
        input.id = 'input'
        box.appendChild(label)
        box.appendChild(input)
        document.body.appendChild(box)

        document.body.style.zoom = `${input.value}%`;
        box.style.zoom = 100 / Number(input.value)
        input.addEventListener('change', () => {
            console.log('fenbianlv: ', input.value)
            document.body.style.zoom = `${input.value}%`;
            localStorage.setItem('fenbianlv', input.value)
            box.style.zoom = 100 / Number(input.value)
        })
    }

    setResolution()
})();
