// ==UserScript==
// @name         在steam游戏界面添加游戏评分与移除按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在steam游戏界面添加游戏评分与移除按钮(待优化监视器功能以应对页面变化)
// @author       sjx01
// @icon    https://store.steampowered.com/favicon.ico
// @match        https://steamcommunity.com/*/*/games/?tab=*
// @connect    store.steampowered.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529216/%E5%9C%A8steam%E6%B8%B8%E6%88%8F%E7%95%8C%E9%9D%A2%E6%B7%BB%E5%8A%A0%E6%B8%B8%E6%88%8F%E8%AF%84%E5%88%86%E4%B8%8E%E7%A7%BB%E9%99%A4%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/529216/%E5%9C%A8steam%E6%B8%B8%E6%88%8F%E7%95%8C%E9%9D%A2%E6%B7%BB%E5%8A%A0%E6%B8%B8%E6%88%8F%E8%AF%84%E5%88%86%E4%B8%8E%E7%A7%BB%E9%99%A4%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用setTimeout来延迟执行
    setTimeout(async function() {
        // 选择所有包含游戏信息的div
        const gameInfoDivs = document.querySelectorAll('._2-pQFn1G7dZ7667rrakcU3'); // 注意：这个选择器可能需要根据实际页面结构进行调整

        // 遍历每个div
        gameInfoDivs.forEach(async gameDiv => {
            // 在每个div内找到a标签
            const link = gameDiv.querySelector('a._1bAC6eBHy0MpRWrwTkgT9o');

            // 验证是否找到了链接
            if (link) {
                // 提取app ID
                const appId = link.href.split('/app/')[1].split('/')[0];

                // 构造Steam API URL以获取评论分数描述
                const apiUrl = `https://store.steampowered.com/appreviews/${appId}?json=1&language=all&review_type=all&purchase_type=all`;

                // 使用GM_xmlhttpRequest从Steam API获取数据
                GM_xmlhttpRequest({
                    method: "GET",
                    url: apiUrl,
                    onload: function(response) {
                        // 检查HTTP状态码
                        if (response.status !== 200) {
                            throw new Error('Network response was not ok: ' + response.status);
                        }

                        // 解析JSON数据
                        const data = JSON.parse(response.responseText);

                        // 检查数据是否有效
                        if (data.success !== 1) {
                            throw new Error('Failed to retrieve review data');
                        }

                        // 从返回的JSON数据中提取review_score_desc
                        const reviewScoreDesc = data.query_summary.review_score_desc;

                        //获取目标容器
                        const contentContainer = gameDiv.querySelector('._1uRB5he6cj97y-rG3RcI6H');

                        // 创建一个新的按钮
                        const newButton = document.createElement('button');
                        newButton.textContent = reviewScoreDesc + '^'; // 更新按钮文本
                        newButton.classList.add('_3aNUlXqnUCLTuW3Aeu2vQ1');
                        newButton.style.color = '#1A9FFF';
                        newButton.title = '点击跳转到该游戏的移除页面';
                        newButton.onclick =function(){    //跳转客服移除页面
                            window.open("https://help.steampowered.com/zh-cn/wizard/HelpWithGameIssue/?appid="+appId+"&issueid=123&transid=");
                        };

                        // 将按钮添加到contentContainer的末尾
                        contentContainer.appendChild(newButton);
                    },

                    //捕获异常
                    onerror: function(error) {
                        // 处理网络请求错误
                        console.error('Error fetching review score for app ID ' + appId + ':', error);
                        // 在页面上显示错误信息
                        const errorDiv = document.createElement('div');
                        errorDiv.textContent = 'Error fetching review score for app ID ' + appId;
                        errorDiv.style.color = 'red';
                        gameDiv.appendChild(errorDiv);
                    }
                });
            }
        });
    }, 5000); // 延时5000毫秒（即5秒）
})();
