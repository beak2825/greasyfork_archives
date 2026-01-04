// ==UserScript==
// @name         获取当天点赞数
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击右上角获取今日点赞数据（请注意不要频繁拉取数据，以免对服务器造成压力)
// @author       慕思斐教-忠实教徒
// @match        https://linux.do/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499093/%E8%8E%B7%E5%8F%96%E5%BD%93%E5%A4%A9%E7%82%B9%E8%B5%9E%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/499093/%E8%8E%B7%E5%8F%96%E5%BD%93%E5%A4%A9%E7%82%B9%E8%B5%9E%E6%95%B0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 添加一个按钮到页面
    const button = document.createElement('button');
    button.textContent = '获取今天的点赞数';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    document.body.appendChild(button);
 
    button.addEventListener('click', async function() {
        const username = Discourse.User.current().username;
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
 
        async function fetchAndFilterHeartReactions(username) {
            const response = await fetch(
                `https://linux.do/user_actions.json?limit=100&offset=0&username=${username}&filter=1`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Csrf-Token": csrfToken,
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    credentials: "include",
                }
            );
 
            const data = await response.json();
            const todayUTC = new Date().toISOString().slice(0, 10);
            console.log("当前UTC日期:", todayUTC);
 
            const todayActions = data.user_actions.filter(action => action.created_at.slice(0, 10) === todayUTC);
            return {
                count: todayActions.length,
                date: todayUTC
            };
        }
 
        const result = await fetchAndFilterHeartReactions(username);
        alert(`时间（UTC）: ${result.date}\n今天点赞数: ${result.count}`);
    });
})();