// ==UserScript==
// @name         masterlab 个人工作台已完成的任务隐藏/展示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  masterlab 个人工作台已完成的任务隐藏/展示，方便查看重要信息。
// @author       shihuang
// @include      *://masterlab.xq5.com/
// @include      *://masterlab.xq5.com/dash*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xq5.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444495/masterlab%20%E4%B8%AA%E4%BA%BA%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%B7%B2%E5%AE%8C%E6%88%90%E7%9A%84%E4%BB%BB%E5%8A%A1%E9%9A%90%E8%97%8F%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/444495/masterlab%20%E4%B8%AA%E4%BA%BA%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%B7%B2%E5%AE%8C%E6%88%90%E7%9A%84%E4%BB%BB%E5%8A%A1%E9%9A%90%E8%97%8F%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideTrList = [] // 需要被隐藏的列表
    let hide = true

    function bindShowOrHideBtn() {
        const aTag = document.createElement('a')
        aTag.className = 'btn btn_issue_type_add js-key-create btn-default'
        aTag.textContent = '展示或隐藏已完成/发布'
        aTag.onclick = function() {
            hideTrList.forEach(tr => {
                tr.style.display = hide ? '' : 'none'
            })

            hide = !hide
        }

        const btnGroup = document.querySelector('.nav-controls .btn-group')
        btnGroup.insertBefore(aTag, btnGroup.childNodes[0])
    }

    window.onload = () => {



        setTimeout(() => {
            // 需要清除已完成(已实现)的项的面板 id 集合
            const needRemoveCompletedTableIdList = ['widget_assignee_my', 'widget_my_assistant_issue', 'widget_unresolve_assignee_my']

            needRemoveCompletedTableIdList.forEach(id => {
                const table = document.querySelector(`#${id} table.table`)
                if (!table) return
                const trList = table.querySelectorAll('tr')
                trList.forEach(tr => {
                    // 获取标签内容
                    const span = tr.querySelector('a > span')
                    if (!span) return
                    const text = span.textContent
                    const textReg = /(已实现)|(已发布)/g
                    if (textReg.test(text)) {
                        tr.style.display = 'none'
                        hideTrList.push(tr)
                    }
                    // if (textReg.test(text)) tr.remove()
                })
            })

            // 添加主动隐藏或开启的按钮
            bindShowOrHideBtn()
        }, 500)
    }
})();