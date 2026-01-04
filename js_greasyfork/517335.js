// ==UserScript==
// @name         库街区助手
// @namespace    https://yinr.cc/
// @version      0.1
// @description  获取库街区 Token
// @author       Yinr
// @license      MIT
// @icon         https://web-static.kurobbs.com/resource/wiki/prod/favicon.png
// @match        https://wiki.kurobbs.com/mc/home
// @require      https://update.greasyfork.org/scripts/458769/1147575/Yinr-libs.js
// @run-at       document-idle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/517335/%E5%BA%93%E8%A1%97%E5%8C%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/517335/%E5%BA%93%E8%A1%97%E5%8C%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/* global YinrLibs */

(function() {
    'use strict';

    const FEEDBACK_CONTAINER_SELECTOR = '#app div.home div.feedback-aside-layout > div.feedback-layout'

    const getToken = () => localStorage.getItem('WIKI_USER_TOKEN') || localStorage.getItem('auth_token')
    const showToken = () => {
        const token = getToken()
        if (token) {
            GM_setClipboard(token, "text", () => {
                console.log("Clipboard set!")
                prompt('以下为当前账户 Token，请复制使用', token)
            });
        } else {
            alert('当前未登录，请登录后操作')
        }
    }

    const addBtn = () => {
        const div = document.createElement('div')
        const icon = 'https://img.icons8.com/?size=100&id=14085&format=png&color=000000'
        div.innerHTML = `<div class="feedback-item kuro-helper-token"><img src="${icon}" alt=""><div class="is-mini name"><span>获取 Token</span></div></div>`
        const container = document.querySelector(FEEDBACK_CONTAINER_SELECTOR)
        container.append(div)
        container.querySelector('div.kuro-helper-token').addEventListener('click', showToken)
    }

    YinrLibs.launchObserver({
        parentNode: document,
        selector: FEEDBACK_CONTAINER_SELECTOR,
        successCallback: () => {
            addBtn()
        },
        stopWhenSuccess: true,
    })
})();