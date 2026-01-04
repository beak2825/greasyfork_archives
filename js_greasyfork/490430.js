// ==UserScript==
// @name         浏览Steam时自动领取Steam贴纸（每日一次）
// @name:zh-CN      浏览Steam时自动领取Steam贴纸
// @name:en      Auto claim Steam stickers when browsing Steam
// @namespace    none
// @version      0.0.1
// @description  自动领取各种Steam促销活动中的贴纸奖励（如果有）
// @description:en  Auto claim sticker rewards in various steam sales (if any)
// @author       superhao
// @license      MIT
// @match        https://store.steampowered.com/*
// @icon         https://img.favpng.com/7/6/11/steam-computer-icons-logo-png-favpng-qfyfNDxk9jBezKZ5vsXJmi8Y0.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490430/%E6%B5%8F%E8%A7%88Steam%E6%97%B6%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96Steam%E8%B4%B4%E7%BA%B8%EF%BC%88%E6%AF%8F%E6%97%A5%E4%B8%80%E6%AC%A1%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/490430/%E6%B5%8F%E8%A7%88Steam%E6%97%B6%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96Steam%E8%B4%B4%E7%BA%B8%EF%BC%88%E6%AF%8F%E6%97%A5%E4%B8%80%E6%AC%A1%EF%BC%89.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    var currentDate = new Date().toLocaleDateString();
    var lastExecutionDate = localStorage.getItem('lastExecutionDate');

    function log(text) {
        console.log(`[自动领促销贴纸油猴脚本] ${text}`)
    }

    if (lastExecutionDate !== currentDate) {
        // before any request, check if there is a web api token on the page, if not, request to a valid page, if no valid response again, take it as not claimable
        let webapi_token = null
        if (window.application_config?.dataset?.loyalty_webapi_token) {
            webapi_token = JSON.parse(window.application_config.dataset.loyalty_webapi_token)
        } else {
            const res = await fetch('/category/action')
            const html = await res.text()
            const doc = new DOMParser().parseFromString(html, 'text/html')
            const token = doc.getElementById('application_config')?.dataset?.loyalty_webapi_token
            if (!token) {
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
        if (can_claim) {
            await fetch(`https://api.steampowered.com/ISaleItemRewardsService/ClaimItem/v1/?access_token=${webapi_token}`, { method: 'POST' })
            log('领取完成')
            ShowAlertDialog('自动领促销贴纸油猴脚本', `${currentDate}领取成功`);
        } else {
            if (next_claim_time) {
                log('今日已领取，下次领取时间在：' + new Date(next_claim_time * 1000).toLocaleString())
            } else {
                log('无可领取内容，跳过')
            }
        }
    } else {
        log("今日已执行过一次")
        localStorage.setItem('lastExecutionDate', currentDate);
    }
})();