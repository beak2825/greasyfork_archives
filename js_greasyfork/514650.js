// ==UserScript==
// @name         follow（保活）
// @namespace    http://tampermonkey.net/
// @version      2024-10-29
// @description  每天随机订阅，超过50个订阅随机删除 - 小号专用
// @author       cursor
// @match        https://app.follow.is/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514650/follow%EF%BC%88%E4%BF%9D%E6%B4%BB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/514650/follow%EF%BC%88%E4%BF%9D%E6%B4%BB%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ===== 可配置参数 =====
    const CONFIG = {
        // 订阅相关
        SUBSCRIPTION: {
            MAX_COUNT: 50,           // 订阅数量上限，超过此数量将触发删除操作
            DAILY_NEW_COUNT: 5,      // 每天新增订阅的数量
            DELETE_COUNT: {
                MIN: 2,              // 随机删除的最小数量
                MAX: 8               // 随机删除的最大数量
            }
        },
        // 延迟设置（毫秒）
        DELAY: {
            NORMAL: 2000,           // 普通操作间隔
            ERROR: 3000,            // 出错后的等待时间
            MAX_RETRIES: 5          // 最大失败重试次数
        },
        // 其他用户ID（用于获取推荐订阅）
        REFERENCE_USER_ID: "41125409313095680"
    };

    // ===== 原有代码 =====
    async function getCsrfToken() {
        try {
            await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY.NORMAL));
            const response = await fetch("https://api.follow.is/auth/csrf", {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("获取 CSRF Token 失败");
            }
            const data = await response.json();
            return data.csrfToken;
        } catch (error) {
            console.error("获取 CSRF Token 错误:", error);
            throw error;
        }
    }

    async function newSubscription(url, view, feedId) {
        try {
            const csrfToken = await getCsrfToken(); // 这里已经包含了 2 秒延迟

            // 添加额外延迟
            await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY.NORMAL));

            const response = await fetch("https://api.follow.is/subscriptions", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    origin: "https://app.follow.is",
                    "x-csrf-token": csrfToken,
                },
                body: JSON.stringify({
                    url: url,
                    view: view,
                    isPrivate: true,
                    feedId: feedId,
                    category: "",
                }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("订阅成功:", data);
            return data;
        } catch (error) {
            console.error("订阅失败:", error);
            throw error;
        }
    }

    async function newListSubscription(listId, view) {
        try {
            const csrfToken = await getCsrfToken(); // 这里已经包含了 2 秒延迟

            // 添加额外延迟
            await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY.NORMAL));

            const response = await fetch("https://api.follow.is/subscriptions", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    origin: "https://app.follow.is",
                    "x-csrf-token": csrfToken,
                },
                body: JSON.stringify({ listId: listId, view: view, isPrivate: true }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("订阅成功:", data);
            return data;
        } catch (error) {
            console.error("订阅失败:", error);
            throw error;
        }
    }

    async function deleteSubscription(feedId) {
        try {
            const csrfToken = await getCsrfToken();

            // 添加延迟
            await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY.NORMAL));

            const response = await fetch("https://api.follow.is/subscriptions", {
                method: "DELETE",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    origin: "https://app.follow.is",
                    "x-csrf-token": csrfToken,
                },
                body: JSON.stringify({ feedId }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("取消订阅成功:", data);
            return data;
        } catch (error) {
            console.error("取消订阅失败:", error);
            throw error;
        }
    }

    // 检查今天是否已经执行过
    function checkLastExecutionDate() {
        const lastExecution = localStorage.getItem("lastSubscriptionUpdate");
        if (!lastExecution) return true; // 从未执行过，允许执行

        const lastDate = new Date(lastExecution);
        const today = new Date();

        // 只比较日期
        return lastDate.getDate() !== today.getDate();
    }

    // 更新最后执行时间
    function updateLastExecutionDate() {
        localStorage.setItem("lastSubscriptionUpdate", new Date().toISOString());
        console.log("已更新执行时间记录");
    }

    // 修改阅读操作函数
    async function markAsRead(feedId, view) {
        try {
            const csrfToken = await getCsrfToken();

            // 添加延迟
            await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY.NORMAL));

            // 先获取未读条目
            const response = await fetch("https://api.follow.is/entries", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    origin: "https://app.follow.is",
                    "x-csrf-token": csrfToken,
                },
                body: JSON.stringify({
                    isArchived: false,
                    view: view,
                    feedId: feedId,
                }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.code !== 0 || !Array.isArray(data.data)) {
                console.log(`未找到需要标记的条目 feedId: ${feedId}`);
                return;
            }

            // 获取未读条目的 ID
            const unreadEntries = data.data
                .filter((item) => item.read === false)
                .map((item) => item.entries.id);

            if (unreadEntries.length === 0) {
                console.log(`没有未读条目需要标记 feedId: ${feedId}`);
                return;
            }

            console.log(`找到 ${unreadEntries.length} 个未读条目`);

            // 将未读条目分组，每组两个
            const groups = [];
            for (let i = 0; i < unreadEntries.length; i += 2) {
                groups.push(unreadEntries.slice(i, i + 2));
            }

            // 处理每组未读条目
            for (const group of groups) {
                await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY.NORMAL));

                const markResponse = await fetch("https://api.follow.is/reads", {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                        "content-type": "application/json",
                        origin: "https://app.follow.is",
                        "x-csrf-token": csrfToken,
                    },
                    body: JSON.stringify({
                        entryIds: group,
                        isInbox: false,
                        readHistories: [],
                    }),
                    credentials: "include",
                });

                if (!markResponse.ok) {
                    throw new Error(`标记已读失败! status: ${markResponse.status}`);
                }

                console.log(`已标记 ${group.length} 个条目为已读`);
            }

            return data;
        } catch (error) {
            console.error("阅读操作失败:", error);
            throw error;
        }
    }

    // 批量执行阅读操作
    async function batchMarkAsRead(subscriptions) {
        console.log("\n开始执行批量阅读操作...");
        let readSuccess = 0;
        let readFail = 0;

        for (const sub of subscriptions) {
            try {
                await markAsRead(sub.feedId, sub.view);
                readSuccess++;

                // 添加延迟
                await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY.NORMAL));
            } catch (error) {
                console.error(`阅读操作失败 feedId: ${sub.feedId}:`, error);
                readFail++;

                // 失败后增加额外延迟
                await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY.ERROR));

                if (readFail > CONFIG.DELAY.MAX_RETRIES) {
                    throw new Error("连续失败次数过多，中断操作");
                }
            }
        }

        console.log("\n====== 阅读操作统计 ======");
        console.log(`处理的订阅总数: ${subscriptions.length}`);
        console.log(`成功处理数: ${readSuccess}`);
        console.log(`失败数: ${readFail}`);
    }

    async function batchUnsubscribe() {
        try {
            // 打开数据库获取订阅数据
            console.log("正在打开数据库 FOLLOW_DB...");
            const db = await new Promise((resolve, reject) => {
                const request = indexedDB.open("FOLLOW_DB");

                request.onerror = (event) => {
                    console.error("数据库打开错误:", event.target.error);
                    reject("打开数据库失败");
                };

                request.onupgradeneeded = (event) => {
                    console.log("数据库版本更新事件触发");
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains("subscriptions")) {
                        console.log("创建 subscriptions store");
                        db.createObjectStore("subscriptions", { keyPath: "feedId" });
                    }
                };

                request.onsuccess = (event) => {
                    const db = event.target.result;
                    console.log("数据库打开成功，版本:", db.version);
                    resolve(db);
                };
            });

            // 获取订阅数据
            const subscriptions = await new Promise((resolve, reject) => {
                try {
                    const transaction = db.transaction(["subscriptions"], "readonly");
                    const store = transaction.objectStore("subscriptions");

                    console.log("正在获取已订阅数据...");
                    const request = store.getAll();

                    request.onsuccess = () => {
                        const data = request.result;
                        console.log(`成功获取订阅数据: ${data.length} 条记录`);
                        resolve(data);
                    };

                    request.onerror = (event) => {
                        console.error("获取数据失败:", event.target.error);
                        reject("获取订阅数据失败");
                    };
                } catch (error) {
                    console.error("访问 store 时发生错误:", error);
                    reject(error);
                }
            });

            if (!subscriptions || subscriptions.length === 0) {
                console.log("没有已订阅的数据");
                return;
            }

            // 先检查是否需要执行订阅操作
            const needSubscriptionUpdate = checkLastExecutionDate();

            if (needSubscriptionUpdate) {
                console.log("开始执行今日订阅更新...");

                // 检查是否需要取消订阅
                if (subscriptions.length > CONFIG.SUBSCRIPTION.MAX_COUNT) {
                    console.log(`当前订阅数量(${subscriptions.length})超过 ${CONFIG.SUBSCRIPTION.MAX_COUNT}，将随机取消 ${CONFIG.SUBSCRIPTION.DELETE_COUNT.MAX} 个订阅`);

                    // 随机决定要取消的订阅数量
                    const range = CONFIG.SUBSCRIPTION.DELETE_COUNT.MAX - CONFIG.SUBSCRIPTION.DELETE_COUNT.MIN + 1;
                    const cancelCount = Math.floor(Math.random() * range) + CONFIG.SUBSCRIPTION.DELETE_COUNT.MIN;

                    // 随机选择要取消的订阅
                    const shuffled = [...subscriptions].sort(() => 0.5 - Math.random());
                    const toCancel = shuffled.slice(0, cancelCount);

                    console.log(`将随机取消 ${toCancel.length} 个订阅`);

                    // 批量取消订阅
                    let cancelSuccess = 0;
                    let cancelFail = 0;

                    for (const sub of toCancel) {
                        try {
                            console.log(`[${cancelSuccess + cancelFail + 1}/${toCancel.length}] 正在取消订阅 feedId: ${sub.feedId}`);
                            await deleteSubscription(sub.feedId);
                            cancelSuccess++;

                            // 添加延迟
                            await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY.NORMAL));
                        } catch (error) {
                            console.error(`取消订阅失败:`, error);
                            cancelFail++;

                            // 失败后增加额外延迟
                            await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY.ERROR));

                            if (cancelFail > CONFIG.DELAY.MAX_RETRIES) {
                                throw new Error("连续取消失败次数过多，中断操作");
                            }
                        }
                    }

                    console.log("\n====== 取消订阅统计 ======");
                    console.log(`计划取消数: ${toCancel.length}`);
                    console.log(`成功取消数: ${cancelSuccess}`);
                    console.log(`失败数: ${cancelFail}`);

                    // 更新本地订阅数据
                    subscriptions.length = subscriptions.length - cancelSuccess;
                    console.log(`更新后的订阅数量: ${subscriptions.length}`);
                }

                // 添加延迟后获取可用订阅
                await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY.NORMAL));

                const availableSubscriptions = await fetch(
                    `https://api.follow.is/subscriptions?userId=${CONFIG.REFERENCE_USER_ID}`
                )
                .then((res) => res.json())
                .then((response) => {
                    // 检查响应格式
                    if (
                        !response ||
                        response.code !== 0 ||
                        !Array.isArray(response.data)
                    ) {
                        console.error("获取到的响应格式不正确:", response);
                        return [];
                    }

                    const data = response.data;
                    console.log("获取到的订阅总数:", data.length);

                    // 过滤掉已订阅的内容
                    const existingFeedIds = new Set(
                        subscriptions.map((sub) => sub.feedId)
                    );
                    const filteredData = data.filter((item) => {
                        // 检查是否为有效的订阅项
                        const isValid = item && (item.lists || item.feeds);
                        // 检查是否已订阅
                        const isNotSubscribed = !existingFeedIds.has(item.feedId);
                        return isValid && isNotSubscribed;
                    });

                    console.log("过滤后的可用订阅数量:", filteredData.length);

                    // 随机选择 5 个订阅内容
                    const selectedItems = [];
                    const totalNeeded = Math.min(CONFIG.SUBSCRIPTION.DAILY_NEW_COUNT, filteredData.length);

                    // 随机选择内容
                    while (
                        selectedItems.length < totalNeeded &&
                        filteredData.length > 0
                    ) {
                        const randomIndex = Math.floor(
                            Math.random() * filteredData.length
                        );
                        const item = filteredData[randomIndex];

                        // 从 filteredData 中移除已选择的项，避免重复选择
                        filteredData.splice(randomIndex, 1);
                        selectedItems.push(item);
                    }

                    console.log(`已选择 ${selectedItems.length} 个订阅内容进行处理`);
                    if (selectedItems.length > 0) {
                        console.log("选择的第一个内容:", {
                            type: selectedItems[0].lists ? "list" : "feed",
                            id: selectedItems[0].feedId,
                            title:
                                selectedItems[0].lists?.title ||
                                selectedItems[0].feeds?.title,
                        });
                    }
                    return selectedItems;
                })
                .catch((error) => {
                    console.error("获取可用订阅时出错:", error);
                    return [];
                });

                if (!availableSubscriptions || availableSubscriptions.length === 0) {
                    console.log("没有找到新的订阅内容");
                    return;
                }

                // 批量处理订阅
                let successCount = 0;
                let failCount = 0;

                for (const item of availableSubscriptions) {
                    try {
                        // 添加延迟
                        await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY.NORMAL));

                        if (item.lists) {
                            const listId = item.listId;
                            const view = item.view || 0;
                            console.log(`[${successCount + failCount + 1}/${availableSubscriptions.length}] 正在处理列表订阅 listId: ${listId}`);

                            await newListSubscription(listId, view);
                            successCount++;
                        } else if (item.feeds) {
                            const feedId = item.feedId;
                            const url = item.feeds.url;
                            const view = item.view || 0;
                            console.log(`[${successCount + failCount + 1}/${availableSubscriptions.length}] 正在处理 Feed 订阅 feedId: ${feedId}`);

                            await newSubscription(url, view, feedId);
                            successCount++;
                        }

                        // 处理完成后的延迟
                        await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY.NORMAL));
                    } catch (error) {
                        console.error(`❌ 处理订阅失败:`, error);
                        failCount++;

                        // 失败后增加额外延迟
                        await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY.ERROR));

                        if (failCount > CONFIG.DELAY.MAX_RETRIES) {
                            throw new Error("连续失败次数过多，中断操作");
                        }
                    }
                }

                console.log("\n====== 执行结果统计 ======");
                console.log(`计划订阅数: ${CONFIG.SUBSCRIPTION.DAILY_NEW_COUNT}`);
                console.log(`实际处理数: ${availableSubscriptions.length}`);
                console.log(`成功订阅数: ${successCount}`);
                console.log(`失败数: ${failCount}`);

                // 只有在成功执行完订阅操作后才更新时间
                if (successCount > 0) {
                    updateLastExecutionDate();
                    console.log("今日订阅更新完成，已记录执行时间");
                }
            } else {
                console.log("今天已经执行过订阅更新，跳过订阅操作");
            }

            // 执行阅读操作（无论是否执行了订阅更新）
            console.log("\n开始执行阅读操作...");
            await batchMarkAsRead(subscriptions);
            console.log("阅读操作执行完成");

            return; // 确保脚本执行完毕后终止
        } catch (error) {
            console.error("脚本执行出错:", error);
            throw error;
        }
    }

    // 执行脚本
    console.log("开始执行脚本...");
    batchUnsubscribe()
        .then(() => {
            console.log("所有操作执行完成，脚本终止");
        })
        .catch((error) => {
            console.error("脚本执行失败:", error);
        })
        .finally(() => {
            console.log("脚本已终止运行");
        });
})();