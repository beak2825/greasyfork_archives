// ==UserScript==
// @name         SteamPY & CICI 价格显示
// @version      2.0
// @description  显示 Steam 游戏在 SteamPY 和 STEAMCICI 的价格信息
// @author       Li
// @match        https://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @connect      steampy.com
// @connect      steamcici.com
// @connect      steampowered.com
// @run-at       document-end
// @icon         https://steampy.com/m_logo.ico
// @license      MIT
// @supportURL   https://greasyfork.org/zh-CN/scripts/518189/feedback
// @homepageURL  https://greasyfork.org/zh-CN/scripts/518189
// @namespace https://greasyfork.org/users/
// @downloadURL https://update.greasyfork.org/scripts/518189/SteamPY%20%20CICI%20%E4%BB%B7%E6%A0%BC%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/518189/SteamPY%20%20CICI%20%E4%BB%B7%E6%A0%BC%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STEAMPY_BASE_URL = "https://steampy.com/";
    const CICI_BASE_URL = "https://steamcici.com/";

    const API_ENDPOINTS = {
        // SteamPY API
        gameInfo: (subId, appId, type) => `${STEAMPY_BASE_URL}xboot/common/plugIn/getGame?subId=${subId}&appId=${appId}&type=${type}`,
        cdkDetail: (id) => `${STEAMPY_BASE_URL}cdkDetail?name=cn&gameId=${id}`,
        balanceBuyDetail: (id) => `${STEAMPY_BASE_URL}balanceBuyDetail?data=cn&gameId=${id}`,
        hotGameDetail: (id) => `${STEAMPY_BASE_URL}hotGameDetail?gameId=${id}`,
        // CICI API
        ciciGameList: (parentId) => `${CICI_BASE_URL}prod-api/user/system/shopGame/list?parentId=${parentId}`,
    };

    const getAppId = () => {
        try {
            const gamePageElement = document.querySelector('.game_page_background.game[data-miniprofile-appid]');
            const appId = gamePageElement?.getAttribute('data-miniprofile-appid');
            return appId || null;
        } catch (err) {
            console.error("获取 AppID 失败：", err);
            return null;
        }
    };

    const getSubIdElements = () => [...document.querySelectorAll('.game_area_purchase_game_wrapper')];

    const createPlaceholder = (parent) => {
        const placeholder = document.createElement('div');
        placeholder.className = 'price-box';
        placeholder.innerHTML = `<div class="loading-text">加载中...</div>`;
        parent.appendChild(placeholder);
        return placeholder;
    };

    const updatePlaceholder = (placeholder, content, isError = false) => {
        placeholder.innerHTML = isError
            ? `<div class="error-text">${content}</div>`
            : content;
    };

    const calculateDaysAgo = (dateString) => {
        if (!dateString) return '';
        try {
            const targetDate = new Date(dateString);
            const today = new Date();
            const diffTime = today - targetDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return '今天';
            if (diffDays === 1) return '1天前';
            return `${diffDays}天前`;
        } catch (err) {
            console.error('日期计算错误：', err);
            return '';
        }
    };

    const displayPrices = (pyRes, ciciRes, placeholder, subId) => {
        let content = '';

        // SteamPY 价格显示
        if (pyRes && pyRes.success) {
            const { keyPrice, marketPrice, daiPrice, id } = pyRes.result;
            content += `
                <a href="${API_ENDPOINTS.cdkDetail(id)}" target="_blank" class="price-link">
                    PY CDKey 价格：￥${keyPrice || "未知"}
                </a>
                <a href="${API_ENDPOINTS.balanceBuyDetail(id)}" target="_blank" class="price-link">
                    PY 余额购价格：￥${marketPrice || "未知"}
                </a>
                <a href="${API_ENDPOINTS.hotGameDetail(id)}" target="_blank" class="price-link">
                    PY 代购价格：￥${daiPrice || "未知"}
                </a>
            `;
        } else {
            content += `<div class="price-link">PY CDKey 价格：加载失败</div>`;
            content += `<div class="price-link">PY 余额购价格：加载失败</div>`;
            content += `<div class="price-link">PY 代购价格：加载失败</div>`;
        }

        // CICI 价格显示
        if (ciciRes && ciciRes.code === 200 && ciciRes.rows) {
            const gameData = ciciRes.rows.find(item => item.gameId === subId);
            if (gameData) {
                const { lastLowSellPrice, lastHangingTime } = gameData;
                if (lastLowSellPrice !== null) {
                    const timeAgo = calculateDaysAgo(lastHangingTime);
                    const timeDisplay = timeAgo ? `（${timeAgo}）` : '';
                    content += `
                        <a href="https://steamcici.com/index" target="_blank" class="price-link">
                            CICI CDKey 价格：￥${lastLowSellPrice}${timeDisplay}
                        </a>
                    `;
                } else {
                    content += `
                        <a href="https://steamcici.com/index" target="_blank" class="price-link">
                            CICI CDKey 价格：暂无上架
                        </a>
                    `;
                }
            } else {
                content += `<a href="https://steamcici.com/index" target="_blank" class="price-link">CICI CDKey 价格：未找到商品</a>`;
            }
        } else {
            content += `<a href="https://steamcici.com/index" target="_blank" class="price-link">CICI CDKey 价格：加载失败</a>`;
        }

        updatePlaceholder(placeholder, content);
    };

    const appId = getAppId();
    if (!appId) {
        console.error("无法获取 AppID。");
        return;
    }

    const subIdElements = getSubIdElements();
    subIdElements.forEach((element) => {
        try {
            const input = element.querySelector('input[name="subid"], input[name="bundleid"]');
            if (!input) return;

            const subId = input.value;
            const type = input.name;
            const pyApiUrl = API_ENDPOINTS.gameInfo(subId, appId, type);
            const ciciApiUrl = API_ENDPOINTS.ciciGameList(appId);

            const placeholder = createPlaceholder(element);

            let pyResult = null;
            let ciciResult = null;
            let completedRequests = 0;

            const checkCompletion = () => {
                completedRequests++;
                if (completedRequests === 2) {
                    displayPrices(pyResult, ciciResult, placeholder, subId);
                }
            };

            // 请求 SteamPY API
            GM_xmlhttpRequest({
                method: "GET",
                url: pyApiUrl,
                onload: (response) => {
                    try {
                        if (response.status === 200) {
                            const responseText = response.responseText;
                            try {
                                pyResult = JSON.parse(responseText);
                            } catch (jsonErr) {
                                console.error("PY JSON 解析失败：", jsonErr);
                                pyResult = { success: false, message: "数据解析错误" };
                            }
                        } else {
                            pyResult = { success: false, message: `HTTP ${response.status}` };
                        }
                    } catch (err) {
                        console.error("PY 处理响应失败：", err);
                        pyResult = { success: false, message: "内部错误" };
                    }
                    checkCompletion();
                },
                onerror: (error) => {
                    console.error("PY 请求失败：", error);
                    pyResult = { success: false, message: "网络请求错误" };
                    checkCompletion();
                }
            });

            // 请求 CICI API
            GM_xmlhttpRequest({
                method: "GET",
                url: ciciApiUrl,
                onload: (response) => {
                    try {
                        if (response.status === 200) {
                            const responseText = response.responseText;
                            try {
                                ciciResult = JSON.parse(responseText);
                            } catch (jsonErr) {
                                console.error("CICI JSON 解析失败：", jsonErr);
                                ciciResult = { code: 500, msg: "数据解析错误" };
                            }
                        } else {
                            ciciResult = { code: response.status, msg: `HTTP ${response.status}` };
                        }
                    } catch (err) {
                        console.error("CICI 处理响应失败：", err);
                        ciciResult = { code: 500, msg: "内部错误" };
                    }
                    checkCompletion();
                },
                onerror: (error) => {
                    console.error("CICI 请求失败：", error);
                    ciciResult = { code: 500, msg: "网络请求错误" };
                    checkCompletion();
                }
            });
        } catch (err) {
            console.error("处理 SubID 失败：", err);
        }
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .price-box {
            font-size: 14px;
            margin-top: 8px;
            padding: 8px;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
            color: #f0f0f0;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            box-sizing: border-box;
        }
        .price-link {
            color: #ffffff;
            text-decoration: none;
            font-size: 13px;
            white-space: nowrap;
        }
        .price-link:hover {
            color: #cccccc;
        }
        .error-text {
            color: #ff6666;
            font-size: 12px;
        }
        .loading-text {
            color: #cccccc;
            font-size: 12px;
        }
        @media screen and (max-width: 767px) {
            .price-box {
                flex-direction: column;
                gap: 4px;
            }
        }
    `;
    document.head.appendChild(style);
})();