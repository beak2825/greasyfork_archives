// ==UserScript==
// @name         划词翻译
// @namespace    lrx.cn/translate
// @version      0.4
// @description  一款划词翻译脚本，你选中的任何文案都会被立即翻译
// @author       You
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459054/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/459054/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function debounce(fn, wait = 50) {
        // 通过闭包缓存一个定时器 id
        let timer = null
        // 将 debounce 处理结果当作函数返回
        // 触发事件回调时执行这个返回函数
        return function(...args) {
            // this保存给context
            const context = this
            // 如果已经设定过定时器就清空上一次的定时器
            if (timer) clearTimeout(timer)

            // 开始设定一个新的定时器，定时器结束后执行传入的函数 fn
            timer = setTimeout(() => {
                fn.apply(context, args)
            }, wait)
        }
    }

    const translate = async (query) => {
        if (!query) {
            return;
        }
        const url = `https://bviknq9g9i.hk.aircode.run/hello?query=${query}`;
        const {message} = await fetch(url).then(res => res.json());
        return message;
    }

    const createContainer = () => {
        const div = document.createElement('div');
        div.setAttribute('id', 'lrx');
        div.style.position = 'absolute'
        div.style.backgroundColor = '#eeeeeeee'
        div.style.maxWidth = '20em'
        div.style.minWidth = '5em'
        div.style.textAlign='center'
        div.style.padding = '10px'
        div.style.transition = 'all ease 200ms'
        document.body.appendChild(div);
    }

    window.onload = createContainer;
    document.onselectionchange = debounce(() => {
        const lrx = document.getElementById('lrx');
        try {
            const selection = document.getSelection()
            const oRange = selection.getRangeAt(0)
            const {x,y} = oRange.getBoundingClientRect()
            const text = selection.toString()
            translate(text).then(t => {
                if (!lrx) {
                    createContainer();
                }
                if (!t) {
                    lrx.style.left = '100vw';
                    lrx.style.top = '100vh';
                    return
                }
                lrx.style.left = `${x+scrollX}px`;
                lrx.style.top = `${y+scrollY}px`;
                lrx.innerHTML = t || '';
            })
        } catch (error) {
            lrx.style.left = '100vw';
            lrx.style.top = '100vh';
        }
    }, 500);

})();