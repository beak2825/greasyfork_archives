// ==UserScript==
// @name         节点延迟排序
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       StephZard
// @include     *://*.monster*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377789/%E8%8A%82%E7%82%B9%E5%BB%B6%E8%BF%9F%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/377789/%E8%8A%82%E7%82%B9%E5%BB%B6%E8%BF%9F%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    var tableDom = document.querySelector('.table') // 获取table对象
    var tbodyDom = tableDom.querySelector('tbody') // 获取tbody对象
    addEvent()
    // 添加事件
    function addEvent () {
        var thDomArr = tbodyDom.firstChild.querySelectorAll('th') // 获取th对象数组
        thDomArr.forEach((v, i) => {
            if (i > 0) {
                v.style.cursor = 'pointer'
                v.addEventListener('click', function () {
                    debounce(sortBySpeed.call(v, i))
                })
            }
        })
    }
    // 点击事件 - 根据速度排序
    var sortBySpeed = debounce(function (index) {
        var trDomArr = Array.from(tbodyDom.querySelectorAll('tr'))
        trDomArr.forEach((v, i) => {
            if (i > 0) { // 第一个节点不处理
                v.aaa = parseFloat(nthNode.call(v, 'td', index).innerText) // 添加当前速度值
            } else { // 第一个节点速度默认为0
                v.aaa = 0
            }
        })
        trDomArr.sort(function (a, b) {
            return a.aaa - b.aaa
        })
        tbodyDom.innerHTML = ''
        trDomArr.forEach(v => {
            tbodyDom.appendChild(v)
        })
        addEvent()
    })
    // 获取第n个节点
    function nthNode (name, n) {
        const nodeArr = this.querySelectorAll(name)
        return nodeArr[n]
    }
    // 延迟点击
    function debounce (func, delay) {
        let timer
        delay = delay || 200
        return function (...args) {
            return new Promise((resolve, reject) => {
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    resolve(func.apply(this, args))
                }, delay)
            })
        }
    }
})();