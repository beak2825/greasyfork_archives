
// ==UserScript==
// @name         爱家登录
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  爱家pc端切换登录，移动端自动登录，自动设置背景图
// @author       zhang333
// @include      *://broker.mklij.com*
// @include      *://broker-h5.mklij.com*
// @include      *://broker-dev.mklij.com*
// @include      *://broker-h5-dev.mklij.com*
// @include      *://localhost/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_cookie
// @run-at document-end
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/427503/%E7%88%B1%E5%AE%B6%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/427503/%E7%88%B1%E5%AE%B6%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict'

    // 设置首页壁纸
    var timer = null
    function checkDom() {
        const login = document.querySelector('.login')
        if (login) {
            login.style.backgroundImage = "url('https://aijiawang-test-image.aijiawang.com/survey/default/2021-08-06/ef6d4a40-b5f0-4aa9-ac40-944bc99d85eb.png')"
            if (!timer) {
                clearTimeout(timer)
            }
        } else {
            timer = setTimeout(checkDom, 0)
        }
    }
    checkDom()

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
                    // captcha.value = '🍊🍉🍋🍍'
                    captcha.value = '🐄🍺'
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

/*------------鼠标点击文字效果-start-------------*/
$(document).ready(function() {
    var f_idx = 0;
    var c_idx = 0;
    $("body").click(function(e) {
        var font = new Array("富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善");
        var color = new Array('#ff0000', '#eb4310', '#f6941d', '#fbb417', '#ffff00', '#cdd541', '#99cc33', '#3f9337', '#219167', '#239676', '#24998d', '#1f9baa', '#0080ff', '#3366cc', '#333399', '#003366', '#800080', '#a1488e', '#c71585', '#bd2158');
        var $i = $("<span />").text(font[f_idx]);
        f_idx = (f_idx + 1) % font.length;
        c_idx = (c_idx + 1) % color.length;
        var x = e.pageX,
            y = e.pageY;
        $i.css({
            "z-index": 9999,
            "top": y - 20,
            "left": x,
            "font-family": "Roboto Mono",
            "position": "absolute",
            "font-weight": "900",
            "color": color[c_idx]
        });
        $("body").append($i);
        $i.animate({
            "top": y - 180,
            "opacity": 0
        }, 1500, function() {
            $i.remove()
        })
    })
})
