// ==UserScript==
// @name         Kn辅助登录
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  辅助登录
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @author       You
// @match        https://m.flycua.com/*
// @connect      conversationserver.spider.htairline.com
// @connect      .flycua.com
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527293/Kn%E8%BE%85%E5%8A%A9%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/527293/Kn%E8%BE%85%E5%8A%A9%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    var domain = 'http://conversationserver.spider.htairline.com/jing_dong/'
    let originFetch = window.fetch
    unsafeWindow.fetch = (...arg) => {
        console.log('fetch arg', ...arg);
        if (arg[0].indexOf('bilivideo.com') > -1) {
            //console.log('拦截直播流')
            return new Promise(() => {
                throw new Error();
            });
        } else {
            //console.log('通过')
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
        } else if (location.pathname === '/buyer/index') {
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
                const phone = document.body.textContent.match(/1\d{10}/)[0]
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
        }
        },500)
    }

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
                    console.log(key, cookies[key])
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