// ==UserScript==
// @name         b站动态详情页面直接跳转旧版
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  在动态列表直接点击动态内容会进入新版动态页面,使用该脚本自动跳转旧版动态详情页面，超过用户设置的访问次数后弹窗提示.
// @author       aotmd
// @match        https://www.bilibili.com/opus/*
// @noframes
// @run-at document-start
// @license MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/468446/b%E7%AB%99%E5%8A%A8%E6%80%81%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9D%A2%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/468446/b%E7%AB%99%E5%8A%A8%E6%80%81%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9D%A2%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取当前日期
    const today = new Date().toISOString().split('T')[0];

    // 获取当前动态ID
    let NO = window.location.pathname.match(/\d+/)?.[0];

    // 默认最大访问次数
    const defaultMaxVisits = 1;

    // 获取用户设置的最大访问次数
    let maxVisits = GM_getValue('maxVisits', defaultMaxVisits);

    // 提供设置最大访问次数的选项
    GM_registerMenuCommand('设置动态页面访问超过多少次后询问是否继续跳转页面', () => {
        let userInput = prompt('请输入最大访问次数:', maxVisits);
        if (userInput !== null) {
            maxVisits = parseInt(userInput, 10);
            if (!isNaN(maxVisits) && maxVisits > 0) {
                GM_setValue('maxVisits', maxVisits);
                alert('最大访问次数已更新为: ' + maxVisits);
            } else {
                alert('无效的输入，请输入一个正整数。');
            }
        }
    });

    if (NO != null) {
        // 获取存储的data对象
        let data = GM_getValue('bilibili_opus_data', {});

        // 检查存储的数据日期是否是今天，不是今天则重置
        if (data.date !== today) {
            data = {
                date: today,
                visits: {},
                noJumpUrls: {}
            };
        }

        // 检查是否已设置当前URL不跳转
        if (data.noJumpUrls[NO]) {
            return;
        }

        // 获取当前动态的访问次数
        let visitCount = data.visits[NO] || 0;

        if (visitCount >= maxVisits) {
            // 超过用户设置的访问次数，弹窗提示
            if (confirm(`您今天已经访问该页面超过${maxVisits}次（第${visitCount}次），是否取消跳转到旧版动态页面？`)) {
                // 用户选择取消跳转，记录不跳转的URL
                data.noJumpUrls[NO] = true;
                GM_setValue('bilibili_opus_data', data);
                return;
            }
        }

        // 更新访问次数
        data.visits[NO] = visitCount + 1;

        // 保存更新后的data对象
        GM_setValue('bilibili_opus_data', data);

        // 执行跳转
        window.location.href = "https://t.bilibili.com/" + NO;
    }
})();
