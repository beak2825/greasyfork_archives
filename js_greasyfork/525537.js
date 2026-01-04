// ==UserScript==
// @name         Bing-Rewards一键签到
// @version      1.0
// @description  必应Rewards每日任务一键领取工具
// @author       一只屑阿狼
// @match        https://rewards.bing.com/*
// @icon         https://www.bing.com/favicon.ico
// @grant        GM_registerMenuCommand
// @license      Apache 2.0
// @namespace https://greasyfork.org/scripts/525537
// @downloadURL https://update.greasyfork.org/scripts/525537/Bing-Rewards%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/525537/Bing-Rewards%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    async function completeTasks() {
        // 处理 mee-card-group 中的 mee-card 元素
        var mee_card_group = document.getElementsByTagName("mee-rewards-more-activities-card")[0].getElementsByTagName("mee-card-group");
        function mee_card_group_t() {
            for (let x = 0; x < mee_card_group.length; x++) {
                if (document.getElementsByTagName("mee-rewards-more-activities-card")[0].getElementsByTagName("mee-card-group")[x].id == 'more-activities') {
                    return x;
                }
            }
        }

        var cardGroupIndex = mee_card_group_t();
        if (cardGroupIndex !== undefined) {
            var mee_card = document.getElementsByTagName("mee-rewards-more-activities-card")[0].getElementsByTagName("mee-card-group")[cardGroupIndex].getElementsByTagName("mee-card");
            for (var i = 0; i < mee_card.length; i++) {
                mee_card[i].getElementsByTagName("a")[0].click();
                await new Promise(resolve => setTimeout(resolve, 10000)); // 等待10秒
            }
        }

        // 处理 #daily-sets 中的 span.pointLink.ng-binding 元素
        var dailySetsCards = document.querySelectorAll('#daily-sets > mee-card-group:nth-child(5) > div > mee-card');
        for (var j = 0; j < dailySetsCards.length; j++) {
            var pointLinks = dailySetsCards[j].querySelectorAll('div > card-content > mee-rewards-daily-set-item-content > div > a > div.actionLink.x-hidden-vp1 > span.pointLink.ng-binding');
            for (var k = 0; k < pointLinks.length; k++) {
                pointLinks[k].closest('a').click();
                await new Promise(resolve => setTimeout(resolve, 10000)); // 等待10秒
            }
        }
    }

    let menu1 = GM_registerMenuCommand('开始', completeTasks);
})();



