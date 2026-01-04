// ==UserScript==
// @name         GPT国内免费镜像（去除身份验证）
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  GPT国内免费镜像去除身份验证
// @author       You
// @match        https://chat.tomyres.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tomyres.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480320/GPT%E5%9B%BD%E5%86%85%E5%85%8D%E8%B4%B9%E9%95%9C%E5%83%8F%EF%BC%88%E5%8E%BB%E9%99%A4%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/480320/GPT%E5%9B%BD%E5%86%85%E5%85%8D%E8%B4%B9%E9%95%9C%E5%83%8F%EF%BC%88%E5%8E%BB%E9%99%A4%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81%EF%BC%89.meta.js
// ==/UserScript==

const _ds = window._ds = {
    isModalMatch: true,
}

const obs = new MutationObserver(mrs => {
    mrs.forEach((mr) => {
        Array.from(mr.addedNodes, an => {
            const qrCodeModal = [...document.querySelectorAll('.tui-modal__container')].find(item => item.textContent.includes('扫码关注公众号回复【GPT】领取口令'))
            if(qrCodeModal && _ds.isModalMatch) {
                qrCodeModal.remove()
                _ds.isModalMatch = false
            }
        })
    })
})

obs.observe(document.body, {childList: true, subtree: true})