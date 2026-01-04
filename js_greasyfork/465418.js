// ==UserScript==
// @name         Bing-Rewards一键签到
// @version      0.1
// @description  必应Rewards每日任务一键领取工具
// @author       一只屑阿狼
// @match        https://rewards.bing.com/*
// @icon         https://www.bing.com/favicon.ico
// @grant        none
// @license      Apache 2.0
// @namespace https://greasyfork.org/users/756710
// @downloadURL https://update.greasyfork.org/scripts/465418/Bing-Rewards%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/465418/Bing-Rewards%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==



(function () {
    window.onload = function () {
        // 页面加载完毕
        var mee_card_group = document.getElementsByTagName("mee-rewards-more-activities-card")[0].getElementsByTagName("mee-card-group")
        function mee_card_group_t() {
            for (let x = 0; x < mee_card_group.length; x++) {
                if (document.getElementsByTagName("mee-rewards-more-activities-card")[0].getElementsByTagName("mee-card-group")[x].id == 'more-activities') {
                    return x
                }
            }
        }
        console.log(mee_card_group_t())
        document.getElementsByTagName("mee-rewards-more-activities-card")[0].getElementsByTagName("h3")[0].innerHTML = `<h3 mee-heading="heading5" ng-if="!$ctrl.hasOtherOffers &amp;&amp; $ctrl.cardItems.length > 0" class="c-heading-5 ng-binding ng-scope">每日活动<span>     <button id="bing_rewards_button">一键领取</button></span></h3>`
        var mee_card = document.getElementsByTagName("mee-rewards-more-activities-card")[0].getElementsByTagName("mee-card-group")[mee_card_group_t()].getElementsByTagName("mee-card")
        document.getElementById("bing_rewards_button").addEventListener("click", function () {
            for (var i = 0; i < mee_card.length; i++) {
                document.getElementsByTagName("mee-rewards-more-activities-card")[0].getElementsByTagName("mee-card-group")[mee_card_group_t()].getElementsByTagName("mee-card")[i].getElementsByTagName("a")[0].click()
            }
        }, false)
    }
})();