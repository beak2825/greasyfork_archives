// ==UserScript==
// @name         自动登录阿里云
// @namespace    https://penjj.fun
// @version      2024-06-28
// @description  利用浏览器保存淘宝账号密码来实现自动登录
// @author       penjj<github.com/penjj>
// @match        https://account.aliyun.com/login/login.htm*
// @match        https://havanalogin.taobao.com/mini_login.htm*
// @match        https://havanalogin.taobao.com:443//newlogin/login.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyun.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499101/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E9%98%BF%E9%87%8C%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/499101/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E9%98%BF%E9%87%8C%E4%BA%91.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const IS_ALIYUN = location.origin === 'https://account.aliyun.com'
    const IS_TAOBAO = location.origin === 'https://havanalogin.taobao.com'
    const IS_DRAGGER_BAR = location.pathname.includes('newlogin/login.do')

    const createEvent = (type, x = 0, y = 0) => {
        return new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y })
    }


    if (IS_ALIYUN) {
        console.log('检测当前运行在阿里云')
        const taobao = document.querySelector('.aliyun-account-console.third-party-login-icon.aliyun-account-consoletaobao.taobao')

        taobao?.dispatchEvent(createEvent('click'))
    }

    if (IS_TAOBAO) {
        console.log('检测当前运行在淘宝')
        const accountInput = document.querySelector('#fm-login-id')
        const pwdInput = document.querySelector('#fm-login-password')
        const confirm = document.querySelector('.password-login')
        await new Promise(r => setTimeout(r, 1000))

        if (accountInput?.value && pwdInput?.value) {
            confirm?.dispatchEvent(createEvent('click'))
        }
    }

    if (IS_DRAGGER_BAR) {
        console.log('检测到拖动条')
        const scaler = document.querySelector('.nc_scale')
        const slider = document.querySelector('.btn_slide')

        if (!slideRect) return

        const slideRect = slider.getBoundingClientRect()
        const scaleRect = scaler.getBoundingClientRect()
        const target = scaleRect.width - slideRect.width

        slider.dispatchEvent(createEvent('mousedown', slideRect.x + 1, slideRect.y + 1))
        slider.dispatchEvent(createEvent('mousemove', slideRect.x + target, slideRect.y + target))
        slider.dispatchEvent(createEvent('mouseup', slideRect.x + target, slideRect.y + target))
    }

})();