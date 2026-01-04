// ==UserScript==
// @name         双击显示密码
// @namespace    https://github.com/Tyrone2333/display-password
// @version      1.3.1
// @description  双击显示密码,失去焦点隐藏.不覆盖 onload,支持密码框后生成的网站
// @author       en20
// @include      http*://*
// @grant        none
// @run-at		 document-start
// @downloadURL https://update.greasyfork.org/scripts/380762/%E5%8F%8C%E5%87%BB%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/380762/%E5%8F%8C%E5%87%BB%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==
(function () {
    function displayPassword() {
        let list = document.querySelectorAll("input[type=password]")
        for (let i = 0; i < list.length; i++) {
            let item = list[i]
            item.ondblclick = function () {
                item.setAttribute("type", "text")
            }
            item.onblur = function () {
                item.setAttribute("type", "password")
            }
        }
    }

    // 防止覆盖 onload 事件
    function addLoadEvent(func) {
        const oldOnload = window.onload
        if (typeof window.onload != 'function') {
            window.onload = func
        } else {
            window.onload = function () {
                oldOnload()
                func()
            }
        }
    }

    // 防抖,mutationObserver 触发非常频繁
    function debounce(fn, delay) {
        // console.log(args)
        let timer = null

        return function (...args) {

            clearTimeout(timer)

            timer = setTimeout(() => {

                fn.call(this, ...args)

            }, delay)
        }
    }

    // 保存旧版 MutationObserver,防止如百度之类站点覆盖 MutationObserver
    function preserveMutationObserver() {
        window.preserveMutationObserver = window.MutationObserver
    }

    function addMutationObserver() {
        const MutationObserver = window.preserveMutationObserver || window.MutationObserver
        // 监听每次 dom 变化,重新寻找密码框添加事件
        const mutationObserver = new MutationObserver(debounce((mutations) => {
            displayPassword()
            // mutations.forEach(function (mutation) {
            //     console.log(mutation.addedNodes)
            // })
        }, 300))

        // 开始监听页面根元素 HTML 变化。
        mutationObserver.observe(document.documentElement, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true,
        })
    }

    preserveMutationObserver()

    addLoadEvent(displayPassword)
    addLoadEvent(addMutationObserver)

})()
