
// ==UserScript==
// @name         美凯龙爱家内网登录
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  爱家pc端切换登录，移动端自动登录
// @author       CUILONGJIN
// @include      *://broker.mklij.com*
// @include      *://broker-h5.mklij.com*
// @include      *://broker-dev.mklij.com*
// @include      *://broker-stage.mklij.com*
// @include      *://broker-h5-dev.mklij.com*
// @include      *://broker-h5-stage.mklij.com*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_cookie
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/434492/%E7%BE%8E%E5%87%AF%E9%BE%99%E7%88%B1%E5%AE%B6%E5%86%85%E7%BD%91%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/434492/%E7%BE%8E%E5%87%AF%E9%BE%99%E7%88%B1%E5%AE%B6%E5%86%85%E7%BD%91%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict'
    // 登录切换
    function changeLogin() {
        const app = document.querySelector('#app')
        if (!app) return false

        function callback(e) {
            e = e || window.event
            const target = e.target || e.srcElement
            if (target.classList.contains('login')) {
                const account = document.querySelector('.account')
                const captcha = account.querySelector('.captcha input')
                if (captcha) {
                    captcha.value = '🍊🍉🍋🍍'
                    // captcha.value = '🐄🍺'
                    const event = new Event('input')
                    captcha.dispatchEvent(event)
                }

                const dingding = document.querySelector('.dingding')
                const show = account.style.display
                account.style.display = show === 'none' ? 'block' : 'none'
                dingding.style.display = show
            }
        }

        app.addEventListener('click', callback)

        if(!location.search) {
            app.click()
            setTimeout(() => {
                const button = document.querySelector('.account button')
                if (!button) return
                button.click()
            }, 1000)
        }

    }
    changeLogin()

    // 移动端登录：设置cookie 和 storage
    const host = location.host
    if (host.indexOf('broker-h5') === -1) {
        const cookie = document.cookie.split('; ')
        const token = (cookie.find(item => { return item.indexOf('aika-token') !== -1 }) || '').split('=')[1]
        if (!token) return
        const user = localStorage.getItem('user')

        if (host === 'broker-dev.mklij.com') {
            GM_setValue('user-dev', user)
            GM_setValue('token-dev', token)
        } else if (host === 'broker.mklij.com') {
            GM_setValue('user', user)
            GM_setValue('token', token)
        }
        GM_setValue('timestamp', +new Date)

    } else {
        // h5
        GM_cookie("delete", {
            "name": "JSESSIONID",
            "path": "/",
        })

        let token
        let user
        let timestamp = GM_getValue('timestamp', 0)
        if (+new Date - timestamp > 1000 * 60 * 60 * 12 ) return clearInfo()

        if (host === 'broker-h5-dev.mklij.com') {
            user = GM_getValue('user-dev', {})
            token = GM_getValue('token-dev', '')
        } else if (host === 'broker-h5.mklij.com') {
            user = GM_getValue('user', {})
            token = GM_getValue('token', '')
        }
        if (!token) return clearInfo()

        document.cookie = `aika-token=${token};domain=${host};path=/`
        // document.cookie = `JSESSIONID=${token};domain=${host};path=/`
        document.cookie = `dd-token=${token};domain=${host};path=/`
        GM_cookie("set", {
            "name": "JSESSIONID",
            "value": token,
            "path": "/",
            // "httpOnly": true,
        });

        const userISON = JSON.parse(user)
        const session = userISON.employeeDTO
        session.resourceDTO = userISON.resourceDTO

        sessionStorage.setItem('user', JSON.stringify(session))
    }

    function clearInfo() {
        sessionStorage.removeItem('user')

        document.cookie = `aika-token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=${host}`
        document.cookie = `JSESSIONID=;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=${host}`
        document.cookie = `dd-token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=${host}`
    }
})()
