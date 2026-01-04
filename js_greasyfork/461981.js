// ==UserScript==
// @name         浏览Steam时自动领取Steam贴纸
// @name:zh      浏览Steam时自动领取Steam贴纸
// @name:en      Auto claim Steam stickers when browsing Steam
// @namespace    https://github.com/UnluckyNinja
// @version      0.2.2
// @description  自动领取各种Steam促销活动中的贴纸奖励（如果有）
// @description:en  Auto claim sticker rewards in various steam sales (if any)
// @author       UnluckyNinja
// @license      MIT
// @match        https://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461981/%E6%B5%8F%E8%A7%88Steam%E6%97%B6%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96Steam%E8%B4%B4%E7%BA%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/461981/%E6%B5%8F%E8%A7%88Steam%E6%97%B6%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96Steam%E8%B4%B4%E7%BA%B8.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function log(text){
        console.log(`[自动领促销贴纸油猴脚本] ${text}`)
    }

    // 为避免脚本在促销期之外进行不必要的请求，超过时间直接跳过
    // 不过请求量一天一次已经很低了，就一直开着吧，也省得手动更新了
    // if (Date.now() > new Date('2023-05-24').getTime()) {
    //    log('为避免不必要的请求自动跳过，你可以手动修改行为（注释脚本内这两行），或者等待下次更新')
    //    return
    // }

    // before any request, check if there is a web api token on the page, if not, request to a valid page, if no valid response again, take it as not claimable
    let webapi_token = null
    if( window.application_config?.dataset?.loyalty_webapi_token){
        webapi_token = JSON.parse(window.application_config.dataset.loyalty_webapi_token)
    } else {
        const res = await fetch('/category/action')
        const html = await res.text()
        const doc = new DOMParser().parseFromString(html, 'text/html')
        const token = doc.getElementById('application_config')?.dataset?.loyalty_webapi_token
        if (!token){
            log('未找到有效api token，是否未登录？')
            return
        }
        webapi_token = JSON.parse(token)
    }

    // can claim check
    const res = await fetch(`https://api.steampowered.com/ISaleItemRewardsService/CanClaimItem/v1/?access_token=${webapi_token}`)
    const json = await res.json()

    const can_claim = !!json.response?.can_claim
    const next_claim_time = json.response?.next_claim_time

    // request to /ClaimItem
    if(can_claim){
        await fetch(`https://api.steampowered.com/ISaleItemRewardsService/ClaimItem/v1/?access_token=${webapi_token}`, { method: 'POST'})
        log('领取完成')
    } else {
        if(next_claim_time){
            log('今日已领取，下次领取时间在：'+new Date(next_claim_time * 1000).toLocaleString())
        } else {
            log('无可领取内容，跳过')
        }
    }
})();