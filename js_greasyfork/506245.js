// ==UserScript==
// @name         trtc 全屏
// @namespace    http://tampermonkey.net/
// @version      2024-09-01
// @description  trtc 全屏脚本
// @author       https://github.com/eric-gitta-moore
// @match        https://trtc.io/demo/homepage/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trtc.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506245/trtc%20%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/506245/trtc%20%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const STATE = {
        window: 0,
        fullscreen: 1
    }
    let state = STATE.window

    function createControlPanel() {
        const dom = `<button style="position: absolute;top:0;left:0;z-index:999;">切换全屏</button>`
        const el = Document.parseHTMLUnsafe(dom).body.children[0]
        el.addEventListener('click', () => {
            console.log('切换全屏');
            try {
                hiddenWidget()
                fullscreen()
            } catch (err) { }
        })
        document.body.appendChild(el)
    }
    function hiddenWidget() {
        document.querySelector('.floating-window-component').style.display = 'none'
        document.querySelector('.header-international-component').style.display = 'none'
        document.querySelector('.sidebar.deltail-sidebar').style.display = 'none'
        document.querySelector('.content-side.position-large').style.display = 'none'
    }

    function fullscreen() {
        document.querySelector('.content-international').style.maxWidth = 'unset'
        document.querySelector('.content-international').style.display = 'block'
        const iframe = document.querySelector('iframe')
        iframe.style.height = '100vh'
        iframe.style.weight = '100vw'
        iframe.style.maxWidth = 'none'
    }

    createControlPanel()
    // Your code here...
})();