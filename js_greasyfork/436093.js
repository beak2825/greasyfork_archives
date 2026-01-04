// ==UserScript==
// @name         密码展示
// @namespace    arale
// @version      0.1.4
// @description  密码输入框，可直观展示密码
// @author       Gj
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436093/%E5%AF%86%E7%A0%81%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/436093/%E5%AF%86%E7%A0%81%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

        const LocalEvnKey = 'show_password_env'
        const envKey = sessionStorage.getItem(LocalEvnKey) || 'hide'

        const findTarget = document.querySelectorAll('[type="password"]')
        function changeAttrByPwd(isShow) {
            findTarget.forEach(item => {
                item.setAttribute('type', isShow ? 'text' : 'password')
            })
        }
        changeAttrByPwd(envKey == 'show')

        const container = document.createElement('div')
        const labelDom = document.createElement('label')
        labelDom.innerText = '密码'
        labelDom.style.cssText = 'margin-right: 5px; font-size: 12px;color: #fff;cursor: pointer;'
        labelDom.setAttribute('for', 'show_password_check_box')
        container.appendChild(labelDom)

        const checkDom = document.createElement('input')
        checkDom.setAttribute('type', 'checkbox')
        checkDom.id = 'show_password_check_box'
        if (envKey == 'show') checkDom.setAttribute('checked', envKey)
        else checkDom.removeAttribute('checked')
        checkDom.onchange = function () {
            checkDom.setAttribute('checked', checkDom.checked)
            if (!checkDom.checked) checkDom.removeAttribute('checked')
            sessionStorage.setItem(LocalEvnKey, checkDom.checked ? 'show' : 'hide')
            changeAttrByPwd(checkDom.checked)
        }
        container.appendChild(checkDom)
        // container.style.cssText = 'position: absolute;top: 10px;left: 70px;z-index: 9999;background-color: #fff;'
        container.style.cssText = `
            width: 60px;
            height: 30px;
            position: fixed;
            z-index: 999999;
            top: 45px;
            left: -55px;
            background-color: #d9534f;
            border-color: #d43f3a;
            border: none;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.1s;`
        container.onmouseover = function () {
            this.style.left = '0px'
        }
        container.onmouseout = function () {
            this.style.left = '-55px'
        }

        if (findTarget.length > 0) document.body.appendChild(container)

})();