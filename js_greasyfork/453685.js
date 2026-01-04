// ==UserScript==
// @name         重复小冰说话
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  你是否想知道不停的重复微软小冰说话会怎么样呢？该脚本将会帮你验证这一想法。
// @author       ZJoker
// @match        https://cn.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453685/%E9%87%8D%E5%A4%8D%E5%B0%8F%E5%86%B0%E8%AF%B4%E8%AF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/453685/%E9%87%8D%E5%A4%8D%E5%B0%8F%E5%86%B0%E8%AF%B4%E8%AF%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        function msgPlusOne() {
            document.querySelector('#ev_send_text').value = msg
            document.querySelector('#ev_send_button').click()
        }

        const zoMsgList = document.querySelectorAll('.ev_zo_msg')
        const lastZoMsg = zoMsgList[zoMsgList.length - 1]
        const msg = lastZoMsg.children[0].innerHTML
        const button = document.createElement('button')
        button.innerHTML = '+1'
        button.addEventListener('click', msgPlusOne)
        lastZoMsg.appendChild(button)
        button.click()
        lastZoMsg.removeChild(button)
    }, 1000)
})();