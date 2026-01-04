// ==UserScript==
// @name         YZF本地项目自动复制cookies
// @version      0.1
// @description  登录测试或者开发环境, 后打开控制台页或平台首页, 再打开本地项目地址, 会自动登录
// @author       oneness
// @include      *://localhost*
// @include      *://console.*.yzf.net/vco/*
// @include      *://workbench.*.yzf.net*
// @grant        GM_registerMenuCommand
// @grant        GM_cookie
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @namespace https://greasyfork.org/users/108102
// @downloadURL https://update.greasyfork.org/scripts/428385/YZF%E6%9C%AC%E5%9C%B0%E9%A1%B9%E7%9B%AE%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/428385/YZF%E6%9C%AC%E5%9C%B0%E9%A1%B9%E7%9B%AE%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6cookies.meta.js
// ==/UserScript==

;(() => {
    const localHostName = 'localhost'
    if (location.hostname === localHostName) {
        setTimeout(() => {
            let yzf_cookies = GM_getValue('yzf_cookies') || []
            yzf_cookies.forEach((element) => {
                GM_cookie(
                    'set',
                    {
                        name: element.name,
                        value: element.value,
                        domain: localHostName,
                        path: element.path,
                        secure: element.secure,
                        httpOnly: element.httpOnly,
                        sameSite: element.sameSite,
                        expirationDate: element.expirationDate,
                        hostOnly: element.hostOnly,
                    },
                    (err) => {}
                )
            })
        })
    } else {
        GM_cookie.list({ url: location.href }, (cookies, error) => {
            if (error) {
                throw new Error(error)
            }
            const yzf_cookies = cookies.filter(({ domain, name }) => {
                if (domain === '.yzf.net' && ['refresh_token', 'access_token'].includes(name)) {
                    return true
                }
            })
            GM_setValue('yzf_cookies', yzf_cookies)
        })
    }
})()
