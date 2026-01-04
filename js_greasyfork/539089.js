// ==UserScript==
// @name         再漫画自动签到
// @namespace    http://unlucky.ninja/
// @version      0.1.1
// @description  在打开再漫画页面后自动尝试签到，注意因为官方服务器经常变化，本脚本不能完美工作并且可能随时失效
// @author       UnluckyNinja
// @match        https://i.zaimanhua.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zaimanhua.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.cookie
// @downloadURL https://update.greasyfork.org/scripts/539089/%E5%86%8D%E6%BC%AB%E7%94%BB%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/539089/%E5%86%8D%E6%BC%AB%E7%94%BB%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const LAST_CHECK_ID = 'lastCheck'

    const date = new Date()
    const lastCheck = GM_getValue(LAST_CHECK_ID, null);
    if (lastCheck && date.toDateString() === lastCheck) {
        console.info('[再漫画自动签到] 今日已签到，跳过')
        return
    } else if (date.getHours() < 8 || (date.getHours() >= 23 && date.getMinutes() >= 58)) {
        console.info('[再漫画自动签到] 避免服务器BUG导致提前签到不计入并断签，凌晨及半夜12点前不签到')
        return
    }
    const cookies = (await GM.cookie.list({
        name: 'token',
    })).filter(it => it.domain === 'i.zaimanhua.com' && it.path === '/')
    if (cookies.length === 0){
        console.error('[再漫画自动签到] 未找到签到用cookie，未登录或者API有变动，无法签到，请尝试手动签到。')
        const result = confirm('未登录或者API有变动，无法签到，请先登录或者尝试手动签到，点击确认将视今天为已签到并不再提示。\n\n本消息来自油猴脚本：再漫画自动签到')
        if (result) {
            GM_setValue('lastCheck', date.toDateString())
        }
        return
    }
    const bearer = `Bearer ${cookies[0].value}`
    let json = {}
    try {
        const res = await fetch("https://i.zaimanhua.com/lpi/v1/task/sign_in", {
            "credentials": "include",
            "headers": {
                "User-Agent": navigator.userAgent,
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "zh-CN,en-US;q=0.8,zh-TW;q=0.6,en;q=0.4,ja;q=0.2",
                "Authorization": bearer,
                "Sec-GPC": "1",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Priority": "u=0",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            "referrer": "https://i.zaimanhua.com/",
            "method": "POST",
            "mode": "cors"
        });
        json = await res.json()
    } catch (e) {
        console.error(e)
        console.error('[再漫画自动签到] 进行HTTP请求时失败，请尝试手动签到')
        const result = confirm('自动签到失败，请尝试手动签到，点击确认将视今天为已签到并不再提示。\n报错信息可按F12在开发者工具中查看。\n\n本消息来自油猴脚本：再漫画自动签到')
        if (result) {
            GM_setValue(LAST_CHECK_ID, date.toDateString())
        }
        return
    }
    if (json?.errno === 0) {
        GM_setValue(LAST_CHECK_ID, date.toDateString())
        console.info('签到成功')
        return
    } else {
        console.error('[再漫画自动签到] 服务器返回失败消息，请尝试手动签到')
        console.error('响应消息：'+json?.errmsg)
        const result = confirm('自动签到失败，请尝试手动签到，点击确认将视今天为已签到并不再提示。\n报错信息可按F12在开发者工具中查看。\n\n本消息来自油猴脚本：再漫画自动签到')
        if (result) {
            GM_setValue(LAST_CHECK_ID, date.toDateString())
        }
        return
    }
})();