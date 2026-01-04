// ==UserScript==
// @name         CSDN免登陆复制代码/Copy EveryThing you selected
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  无需登陆，复制你选中的任何来自CSDN页面的字符串/文本/代码(请确保你在页面上能看到这些代码!)；Copy Everything from CSDN that you selected without login in.
// @author       limbopro
// @license MIT
// @match        https://*.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/455938/CSDN%E5%85%8D%E7%99%BB%E9%99%86%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81Copy%20EveryThing%20you%20selected.user.js
// @updateURL https://update.greasyfork.org/scripts/455938/CSDN%E5%85%8D%E7%99%BB%E9%99%86%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81Copy%20EveryThing%20you%20selected.meta.js
// ==/UserScript==


function loginPage_remove() { // 让CSDN 所有元素标签可复制并隐藏登陆框
    const styleNew = document.createElement('style')
    styleNew.id = 'fuckcsdn'
    styleNew.innerHTML = "* {user-select: auto !important;} .copysuccess {background:green !important;color:white !important;} .copy-cdsn {z-index:115454;border:0; position:fixed;right:0px; font-size:medium; font-weight:bolder;color:wheat;padding:10px; top:20%; box-shadow:6px 3px 2px 1px rgba(0, 0, 255, .2);background:blueviolet;} .passport-login-container, div.passport-login-mark {display:none! important ; pointer-events:none !important ; opacity:0 !important;}"
    document.querySelectorAll('head')[0].appendChild(styleNew)
}

function isCopybutton_newAndListen() { // 页面右上角复制代码按钮
    const button = document.createElement('button')
    button.className = 'copy-cdsn'
    button.id = 'copy-cdsn'
    button.textContent = '复制代码!'
    document.body.appendChild(button)

    setTimeout(() => { // 添加点击监听事件
        document.querySelector('.copy-cdsn').addEventListener('click', function () {
            
            const selector_csdn = window.getSelection().toString() // 选中的内容转为字符串 string 
            if (selector_csdn == null || selector_csdn == '') { alert("先用（鼠标选中想要复制的代码/文本/段落），再点击页面右侧的（复制代码）按钮!") }
            else {

                const textarea = document.createElement('textarea') // 创建 textarea 元素 并将选中内容填充进去
                textarea.id = 'fuckcsdn_code'
                document.body.appendChild(textarea)
                textarea.value = selector_csdn
                textarea.select();
                document.execCommand('copy', true); // 执行复制

                document.querySelector('.copy-cdsn').classList.add('copysuccess')  // 复制成功提醒
                document.querySelector('.copy-cdsn').textContent = '复制成功!'

                setTimeout(() => { // ↩️按钮恢复原状
                    document.querySelector('.copy-cdsn').classList.remove('copysuccess')
                    document.querySelector('.copy-cdsn').textContent = '复制代码!'
                }, 4000)

                if (document.getElementById('fuckcsdn_code')) { // 删除刚刚创建的 textarea 元素
                    document.getElementById('fuckcsdn_code').remove()
                }

            }
        })
    }, 1500)

}

loginPage_remove()
isCopybutton_newAndListen()