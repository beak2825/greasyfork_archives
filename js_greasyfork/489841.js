// ==UserScript==
// @name         自动更改生日
// @namespace    https://linux.do
// @version      0.0.6
// @description  名字后面加蛋糕！
// @author       DengDai
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_log
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/489841/%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%94%B9%E7%94%9F%E6%97%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/489841/%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%94%B9%E7%94%9F%E6%97%A5.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // 获取当前日期
    const currentDate = new Date().toLocaleDateString();

    // 检查本地存储中是否已经记录了今天的日期（使用GM_getValue代替localStorage）
    let lastExecutedDate = GM_getValue('lastExecutedDate');

    // 如果本地存储中的日期与当前日期不相等，说明今天还没执行过
    if (!lastExecutedDate || lastExecutedDate !== currentDate) {
        try {
            setTimeout(function() {
                const now = new Date();
                const month = now.getMonth() + 1;
                const day = now.getDate();
                const date_of_birth = `2004-${month}-${day}`;
                let old_birthdate = "";

                // 获取CSRF Token 和用户名
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                const username = document.querySelector('[data-link-name="my-posts"]').getAttribute('href').split("/")[2];
                // 设置请求头
                const headers = {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "content-type": "application/json; charset=utf-8",
                    "x-csrf-token": csrfToken,
                    "x-requested-with": "XMLHttpRequest"
                };
                // 使用GM_xmlhttpRequest代替fetch
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://linux.do/u/${username}.json`,
                    headers,
                    onload: function (response) {
                        if (response.status !== 200) {
                            throw new Error(`获取用户数据失败: ${response.statusText}`);
                        }
                        const data = JSON.parse(response.responseText);
                        old_birthdate = data.user.birthdate;

                        // 检查生日是否需要更新
                        if (old_birthdate && (parseInt(old_birthdate.split("-")[1]) === month) && (parseInt(old_birthdate.split("-")[2]) === day)) {
                            console.log("无需修改！");
                        } else {
                            // 更新生日
                            headers['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
                            GM_xmlhttpRequest({
                                method: "PUT",
                                url: `https://linux.do/u/${username}.json`,
                                headers,
                                data: `date_of_birth=${date_of_birth}`,
                                onload: function (updateResponse) {
                                    if (updateResponse.status !== 200) {
                                        throw new Error(`更新生日失败: ${updateResponse.statusText}`);
                                    }
                                    console.log("已经修改！");
                                },
                                onerror: function (err) {
                                    console.error('更新生日请求失败:', err);
                                }
                            });
                        }

                        // 记录当前日期到GM_setValue，表示今天已经执行过
                        GM_setValue('lastExecutedDate', currentDate);
                    },
                    onerror: function (err) {
                        console.error('获取用户数据请求失败:', err);
                    }
                });

            }, 3000);
        } catch (err) {
            console.error('操作失败:', err.message);
        }
    }
})();