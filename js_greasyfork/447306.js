// ==UserScript==
// @name         飞书云文档只读
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  给飞书文档添加禁用编辑按钮
// @license MIT
// @match        https://bytedance.feishu.cn/docx/*
// @match        https://bytedance.feishu.cn/docs/*
// @match        https://bytedance.feishu.cn/wiki/*
// @downloadURL https://update.greasyfork.org/scripts/447306/%E9%A3%9E%E4%B9%A6%E4%BA%91%E6%96%87%E6%A1%A3%E5%8F%AA%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/447306/%E9%A3%9E%E4%B9%A6%E4%BA%91%E6%96%87%E6%A1%A3%E5%8F%AA%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const style = document.createElement('style')
    const buttonStyle = style.cloneNode()
    style.innerHTML = `.page-main, .etherpad-container { pointer-events: none }
    .page-main img, .etherpad-container img { pointer-events: all }`
    const button = document.createElement('button')
    button.id = 'toggle-doc-edit'
    button.innerHTML = 'Edit: enabled'
    document.body.appendChild(button)
    buttonStyle.innerHTML = `#toggle-doc-edit { position: fixed; top: 50px; left: 0; padding: 4px 8px;
    background: #f9f2eb; z-index: 999; border: solid 1px #888; }
    #toggle-doc-edit:hover { background-color: #f1eae5 }
    `
    document.head.appendChild(buttonStyle)
    let enabled = true
    const disableMouse = () => { enabled = false; document.head.appendChild(style); button.innerHTML = 'Edit: disabled' }
    const enableMouse = () => { enabled = true; document.head.removeChild(style); button.innerHTML = 'Edit: enabled' }
    button.addEventListener('click', () => {
        if (enabled) {
            disableMouse()
        } else {
            enableMouse()
        }
    })
})();