// ==UserScript==
// @name         天河小泰
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  FOP开发小助手
// @author       zhouxingchen04
// @match        *://*/visualeditor/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454574/%E5%A4%A9%E6%B2%B3%E5%B0%8F%E6%B3%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/454574/%E5%A4%A9%E6%B2%B3%E5%B0%8F%E6%B3%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setStyle(e, styleObj) {
        Object.keys(styleObj).forEach(key => {
            e.style[key] = styleObj[key]
        })
    }
    if (top.location !== self.location) return

    console.log('[天河小泰] 启动了')
    const ele = document.createElement('div')
    const styles = {
        position: 'absolute',
        top: "10px",
        left: "10px",
        width: "80px",
        height: "35px",
        color: "white",
        'line-height': "35px",
        background: 'rgba(47, 113, 237)',
        'border-radius': '10px',
        'text-align': 'center',
        cursor: 'pointer'
    }
    setStyle(ele, styles)

    const { href } = window.location
    const isEdit = href.includes('visualEdit')
    ele.innerText = isEdit ? '返回查看': '点击编辑'
    ele.onclick = function() {
        let url = ''
        const nowHref = window.location.href
        console.log('[天河小泰] nowHref', nowHref)
        if (isEdit) {
            url = nowHref.replace('/visualEdit', '')
        }else {
            url = nowHref.replace('/visualeditor','/visualeditor/visualEdit')
        }
        location.href = url
    }
    document.body.appendChild(ele)
})();