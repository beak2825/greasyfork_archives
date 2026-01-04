// ==UserScript==
// @name         百度测试Demo
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  百度使用增强!
// @author       huijin
// @match        https://www.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      AGPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473348/%E7%99%BE%E5%BA%A6%E6%B5%8B%E8%AF%95Demo.user.js
// @updateURL https://update.greasyfork.org/scripts/473348/%E7%99%BE%E5%BA%A6%E6%B5%8B%E8%AF%95Demo.meta.js
// ==/UserScript==

function loadCssCode(code) {
    let style = document.createElement('style')
    style.rel = 'stylesheet'
    style.appendChild(document.createTextNode(code))
    let head = document.getElementsByTagName('head')[0]
    head.appendChild(style)
}

const sleep = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, timeout)
    })
}

const showMsg = async (msg, elem) => {
    elem.value = msg.slice(0, 1)
    for (let i = 1; i < msg.length; i++) {
        await sleep(300)
        elem.value = msg.slice(0, i + 1)
    }
}

(() => {
    'use strict';
    let cssText = `
    #mydiv{
        position: fixed;
        top: 0px;
        left: 0px;
        width:100vw;
        height:100px;
        font-size:20px;
        text-align: center;
        line-height: 100px;
        background:#f00;
        z-index: 9000;
    }`

    function main() {
        const adElem = document.querySelector('#s_wrap')
        adElem.remove()

        setTimeout(() => {
            console.clear()
            const elem = document.querySelector('#kw')
            let msg = '去自首吧，你的所作所为都被监控留存证据了'
            showMsg(msg, elem)

            const divElem = document.createElement('div')
            divElem.id = 'mydiv'
            document.body.appendChild(divElem)
            divElem.innerHTML = msg
            loadCssCode(cssText)
        }, 1000)
    }
    main()
})();