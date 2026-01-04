// ==UserScript==
// @name         B 站获取 BV 号
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快速复制 BV 号
// @author       Yunser
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423649/B%20%E7%AB%99%E8%8E%B7%E5%8F%96%20BV%20%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/423649/B%20%E7%AB%99%E8%8E%B7%E5%8F%96%20BV%20%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copy(text) {
        let transfer = document.createElement('input');
        transfer.style.position = 'position: fixed; left:0;top: 0';
        document.body.appendChild(transfer);
        transfer.value = text;  // 这里表示想要复制的内容
        transfer.focus();
        transfer.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
        }
        transfer.blur();
        console.log('复制成功');
        document.body.removeChild(transfer);
        
    }

    console.log('hello monkey')

    // document.body.appendChild

    const root = document.createElement('DIV')
    document.body.appendChild(root)
    root.outerHTML = `
    <div style="position: fixed; right: 16px; bottom: 16px; z-index: 10000;">
        <button id="myCopyBtn" type="button">复制 BV 号</button>
    </div>
    `
    // const num = document.getElementById('myCopyBtn')

    document.getElementById('myCopyBtn').addEventListener('click', (e) => {
        // console.log('num', num)
        e.preventDefault()
        e.stopPropagation()
        console.log('click')
        const bv = location.pathname.split('/').pop()
        copy(bv)
    })
    // Your code here...
})();
