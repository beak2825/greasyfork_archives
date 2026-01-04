// ==UserScript==
// @name         MWISubscribe
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Subscribe Market Item
// @author       Lhiok
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @supportURL   https://github.com/Lhiok/MWIScript/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537847/MWISubscribe.user.js
// @updateURL https://update.greasyfork.org/scripts/537847/MWISubscribe.meta.js
// ==/UserScript==

(function() {
    "use strict";

    let mwi_common = null;
    let mwi_subscribe_items = {};

    const storage_key = "mwi_subscribe_items";
    const subscribeItemsStorage = localStorage.getItem(storage_key);
    if (subscribeItemsStorage) {
        const subscribeItems = JSON.parse(subscribeItemsStorage);
        // 兼容旧版本
        if (Array.isArray(subscribeItems)) {
            for (let i = 0; i < subscribeItems.length; i++) {
                mwi_subscribe_items[subscribeItems[i]] = {
                    ask: -2, // -1 代表查询失败 这里使用-2表示旧数据
                    bid: -2,
                };
            }
            localStorage.setItem(storage_key, JSON.stringify(mwi_subscribe_items));
        }
        else {
            mwi_subscribe_items = subscribeItems;
        }
    }

    function formatNumber(value) {
        return value.toString().replace(/\d+/, function (n) {
            return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        })
    }

    function fixNumber(value) {
        if (value > 100) return value.toFixed(0);
        if (value > 10) return value.toFixed(1);
        return value.toFixed(2);
    }

    function formatNumberWithUnit(value) {
        if (value >= 1_000_000_000_000_000) return `${fixNumber(value / 1_000_000_000_000_000)}P`;
        if (value >= 1_000_000_000_000) return `${fixNumber(value / 1_000_000_000_000)}T`;
        if (value >= 1_000_000_000) return `${fixNumber(value / 1_000_000_000)}B`;
        if (value >= 1_000_000) return `${fixNumber(value / 1_000_000)}M`;
        if (value >= 1_000) return `${fixNumber(value / 1_000)}K`;
        return value.toFixed(0);
    }

    function updateSubscribePrice(itemHrid, itemLevel) {
        const itemHridLevel = itemLevel > 0? `${itemHrid}::${itemLevel}`: itemHrid;
        if (mwi_subscribe_items[itemHridLevel] == undefined) {
            return;
        }

        mwi_subscribe_items[itemHridLevel] = {
            ask: mwi_common.getItemPriceByHrid(itemHrid, itemLevel, 'ask'),
            bid: mwi_common.getItemPriceByHrid(itemHrid, itemLevel, 'bid'),
        };
        localStorage.setItem(storage_key, JSON.stringify(mwi_subscribe_items));
    }

    function getPricePercentColor(pricePercent) {
        if (pricePercent > 0) {
            return "#ff0000";
        }
        else if (pricePercent < 0) {
            return "#00ff00";
        }
        else {
            return "#aaaaaa";
        }
    }

    function updateSubscribedList() {
        const displayContainer = document.querySelector("div#subscribeDisplayContainer");
        if (!displayContainer) {
            return;
        }
        
        // 移除收藏物品
        displayContainer.innerHTML = "";
        // 创建收藏物品
        for (let itemHridLevel in mwi_subscribe_items) {
            const itemInfo = itemHridLevel.split("::");
            const itemHrid = itemInfo[0];
            const itemLevel = itemInfo[1]? Number(itemInfo[1]): 0;
            if (!itemHrid || itemHrid === "" || itemHrid === "undefined") {
                return;
            }

            const itemCount = mwi_common.getItemNumByHrid(itemHrid, itemLevel);
            
            // 当前价格
            const askPrice = mwi_common.getItemPriceByHrid(itemHrid, itemLevel, 'ask');
            const bidPrice = mwi_common.getItemPriceByHrid(itemHrid, itemLevel, 'bid');

            // 昨日价格
            const askPriceYesterday = mwi_common.getItemPriceYesterdayByHrid(itemHrid, itemLevel, 'ask');
            const bidPriceYesterday = mwi_common.getItemPriceYesterdayByHrid(itemHrid, itemLevel, 'bid');
            const askPricePercentYesterday = askPriceYesterday > 0? (askPrice - askPriceYesterday) / askPriceYesterday * 100: 0;
            const bidPricePercentYesterday = bidPriceYesterday > 0? (bidPrice - bidPriceYesterday) / bidPriceYesterday * 100: 0;

            // 订阅价格
            const subscribePrice = mwi_subscribe_items[itemHridLevel];
            let askPriceSubscribe = subscribePrice.ask;
            let bidPriceSubscribe = subscribePrice.bid;
            if (askPriceSubscribe == -2 && bidPriceSubscribe == -2) {
                askPriceSubscribe = askPrice;
                bidPriceSubscribe = bidPrice;
                updateSubscribePrice(itemHrid, itemLevel);
            }
            const askPricePercentSubscribe = askPriceSubscribe > 0? (askPrice - askPriceSubscribe) / askPriceSubscribe * 100: 0;
            const bidPricePercentSubscribe = bidPriceSubscribe > 0? (bidPrice - bidPriceSubscribe) / bidPriceSubscribe * 100: 0;

            const item = document.createElement("div");
            item.innerHTML = `<div style="position: relative; background: hsl(198, 76.50%, 16.70%); padding: 4px;">
                <div style="display: flex; width: 100%; height: 40px;">
                    <svg role="img" aria-label="${mwi_common.getItemNameByHrid(itemHrid, mwi_common.isZh)}" style="width: 40px; height: 40px;">
                        <use href="/static/media/items_sprite.6d12eb9d.svg#${itemHrid.substr(7)}"></use>
                    </svg>
                    <div style="${mwi_common.isZh? "": "font-size: 13px; "}width: 200px; height: 40px; padding-left: 4px;">
                        <div style="display: flex; gap: 4px; white-space: nowrap;">
                            <div style="color:hsl(202, 41.50%, 71.20%);">${mwi_common.isZh? "名称": "Name"}:</div>
                            <div>${mwi_common.getItemNameByHrid(itemHrid, mwi_common.isZh)}${itemLevel > 0? ` +${itemLevel}`: ""}</div>
                        </div>
                        <div style="display: flex; gap: 4px; white-space: nowrap;">
                            <div style="color:hsl(202, 41.50%, 71.20%);">${mwi_common.isZh? "数量": "Count"}:</div>
                            <div>${formatNumber(itemCount)}</div>
                        </div>
                    </div>
                </div>
                <hr borderColor="hsl(204, 92.60%, 5.30%)" margin="4px 4px">
                <div style="display: flex; gap: 4px; white-space: nowrap;">
                    <div style="color:hsl(202, 41.50%, 71.20%);">${mwi_common.isZh? "今": "T"}:</div>
                    <div>${formatNumberWithUnit(askPrice)} / ${formatNumberWithUnit(bidPrice)}</div>
                    <div>(${formatNumberWithUnit(askPrice * itemCount)} / ${formatNumberWithUnit(bidPrice * itemCount)})</div>
                </div>
                <div style="display: flex; gap: 4px; white-space: nowrap;">
                    <div style="color:hsl(202, 41.50%, 71.20%);">${mwi_common.isZh? "昨": "Y"}:</div>
                    <div>${formatNumberWithUnit(askPriceYesterday)} / ${formatNumberWithUnit(bidPriceYesterday)}</div>
                    <div>(<span style="color: ${getPricePercentColor(askPricePercentYesterday)}">${askPricePercentYesterday.toFixed(2)}%</span> / <span style="color: ${getPricePercentColor(bidPricePercentYesterday)}">${bidPricePercentYesterday.toFixed(2)}%</span>)</div>
                </div>
                <div style="display: flex; gap: 4px; white-space: nowrap;">
                    <div style="color:hsl(202, 41.50%, 71.20%);">${mwi_common.isZh? "订": "S"}:</div>
                    <div>${formatNumberWithUnit(askPriceSubscribe)} / ${formatNumberWithUnit(bidPriceSubscribe)}</div>
                    <div>(<span style="color: ${getPricePercentColor(askPricePercentSubscribe)}">${askPricePercentSubscribe.toFixed(2)}%</span> / <span style="color: ${getPricePercentColor(bidPricePercentSubscribe)}">${bidPricePercentSubscribe.toFixed(2)}%</span>)</div>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; white-space: nowrap;">
                    <button id="updatePrice" style="background-color: orange; color: black; white-space: nowrap;">${mwi_common.isZh? "更新": "Update"}</button>
                    <button id="goToMarket" style="background-color: orange; color: black; white-space: nowrap;">${mwi_common.isZh? "前往": "Market"}</button>
                </div>
            </div>`;
            displayContainer.appendChild(item);

            // 添加点击事件
            const updatePriceButton = item.querySelector("button#updatePrice");
            const goToMarketButton = item.querySelector("button#goToMarket");
            updatePriceButton && updatePriceButton.addEventListener("click", () => {
                updateSubscribePrice(itemHrid, itemLevel)
                updateSubscribedList();
            });
            goToMarketButton && goToMarketButton.addEventListener("click", () => mwi_common.gotoMarket(itemHrid, itemLevel));
        };
    }

    function createSubscribeButton(marketPanel) {
        const displayContainer = marketPanel.querySelector(".MarketplacePanel_currentItem__3ercC");
        if (!displayContainer) {
            return;
        }

        // 创建收藏按钮
        const subscribeButton = document.createElement("button");
        subscribeButton.setAttribute("id", "subscribeButton");
        subscribeButton.className = "subscribe-btn";
        subscribeButton.style.position = "absolute";
        subscribeButton.style.padding = "0";
        subscribeButton.style.marginLeft = "6px";
        subscribeButton.style.background = "none";
        subscribeButton.style.border = "none";
        subscribeButton.style.outline = "none";
        subscribeButton.style.zIndex = "2"; /** make sure it's on top of the item level div created by MWITools */
        
        // 创建图标
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "24");
        // 未收藏
        const heartUnsubscribed = document.createElementNS(svgNS, "path");
        heartUnsubscribed.setAttribute("d", "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z");
        heartUnsubscribed.setAttribute("fill", "#aaaaaa");
        heartUnsubscribed.setAttribute("stroke", "#333");
        heartUnsubscribed.setAttribute("transition", "all 0.3s");
        // 已收藏
        const heartSubscribed = document.createElementNS(svgNS, "path");
        heartSubscribed.setAttribute("d", "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z");
        heartSubscribed.setAttribute("fill", "#ff4d4f");
        heartSubscribed.setAttribute("opacity", "0");
        heartSubscribed.setAttribute("transition", "opacity 0.3s");
        // 添加图标
        svg.appendChild(heartUnsubscribed);
        svg.appendChild(heartSubscribed);
        subscribeButton.appendChild(svg);
        displayContainer.prepend(subscribeButton);
        
        // 物品等级
        let itemHrid = "";
        let itemLevel = 0;
        let itemHridLevel = "";
        let isSubscribed = false;

        const updateSubscribedButton = function() {
            if (isSubscribed) {
                heartUnsubscribed.setAttribute("stroke", "#ff4d4f");
                heartSubscribed.setAttribute("opacity", "1");
            } else {
                heartUnsubscribed.setAttribute("stroke", "#333");
                heartSubscribed.setAttribute("opacity", "0");
            }
        };

        const updateMarketItem = function() {
            itemHrid = "";
            const displayItem = displayContainer.querySelector(".Item_iconContainer__5z7j4");
            if (displayItem && displayItem.firstChild) {
                const itemName = displayItem.firstChild.getAttribute("aria-label");
                if (itemName && itemName !== "") {
                    itemHrid = mwi_common.getItemHridByName(itemName);
                }
            }

            itemLevel = 0;
            const levelDiv = displayContainer.querySelector(".Item_enhancementLevel__19g-e");
            if (levelDiv) {
                itemLevel = Number(levelDiv.textContent.replace("+", ""));
                if (isNaN(itemLevel)) itemLevel = 0;
            }

            itemHridLevel = itemHrid && itemLevel > 0? `${itemHrid}::${itemLevel}`: itemHrid;
            isSubscribed = mwi_subscribe_items[itemHridLevel] != undefined;
            updateSubscribedButton();
        }

        updateMarketItem();
        
        // 绑定点击
        subscribeButton.addEventListener("click", function() {
            if (!itemHridLevel || itemHridLevel === "") {
                return;
            }

            isSubscribed = !isSubscribed;
            updateSubscribedButton();

            if (isSubscribed) {
                console.info("[MWISubscribe] add item " + itemHridLevel);
                mwi_subscribe_items[itemHridLevel] = {
                    ask: mwi_common.getItemPriceByHrid(itemHrid, itemLevel, 'ask'),
                    bid: mwi_common.getItemPriceByHrid(itemHrid, itemLevel, 'bid'),
                }
            }
            else {
                console.info("[MWISubscribe] remove item " + itemHridLevel);
                delete mwi_subscribe_items[itemHridLevel];
            }

            localStorage.setItem(storage_key, JSON.stringify(mwi_subscribe_items));
            updateSubscribedList();
        });

        new MutationObserver(updateMarketItem).observe(displayContainer, { childList: true, subtree: true });
    }
    
    function createDisplayButton(marketPanel) {
        const tabPanelContainer = marketPanel.querySelector(".TabsComponent_tabPanelsContainer__26mzo");
        const filterContainer = marketPanel.querySelector(".MarketplacePanel_itemFilterContainer__3F3td");
        if (!tabPanelContainer || !filterContainer) {
            return;
        }

        const tabList = tabPanelContainer.querySelector("[role=tablist]");
        const panelList = tabPanelContainer.querySelector(".TabsComponent_tabPanelsContainer__26mzo");
        if (!tabList || !panelList) {
            return;
        }
        
        // 创建收藏页签按钮
        const subscribeTabButton = document.createElement("button");
        subscribeTabButton.setAttribute("class", "MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-1q2h7u5");
        subscribeTabButton.setAttribute("tabindex", -1);
        subscribeTabButton.setAttribute("role", "tab");
        subscribeTabButton.setAttribute("aria-selected", false);
        subscribeTabButton.setAttribute("id", "subscribeTabButton");
        subscribeTabButton.textContent = mwi_common.isZh? "收藏": "Subscribed";
        tabList.appendChild(subscribeTabButton);

        // 创建收藏面板
        const subscribeDisplayPanel = document.createElement("div");
        subscribeDisplayPanel.setAttribute("class", "TabPanel_tabPanel__tXMJF TabPanel_hidden__26UM3");
        panelList.appendChild(subscribeDisplayPanel);
        // 创建收藏容器
        const subscribeDisplayContainer = document.createElement("div");
        subscribeDisplayContainer.setAttribute("id", "subscribeDisplayContainer");
        subscribeDisplayContainer.style.display = "grid";
        subscribeDisplayContainer.style.gridTemplateColumns = "repeat(auto-fill, 240px)";
        subscribeDisplayContainer.style.gridTemplateRows = "max-content";
        subscribeDisplayContainer.style.gap = "10px";
        subscribeDisplayContainer.style.justifyContent = "center";
        subscribeDisplayContainer.style.overflowY = "auto";
        subscribeDisplayPanel.appendChild(subscribeDisplayContainer);
        updateSubscribedList();
        
        // 创建查看收藏按钮
        const showSubscribeButton = document.createElement("button");
        showSubscribeButton.setAttribute("id", "showSubscribeButton");
        showSubscribeButton.style.position = "absolute";
        showSubscribeButton.style.marginLeft = "20px";
        showSubscribeButton.style.backgroundColor = "orange";
        showSubscribeButton.style.color = "black";
        showSubscribeButton.style.whiteSpace = "nowrap";
        showSubscribeButton.textContent = mwi_common.isZh? "查看收藏": "View Subscribed Items";
        filterContainer.appendChild(showSubscribeButton);

        // 设置按钮点击事件
        tabList.childNodes.forEach((childBtn, btnIdx) => {
            childBtn.addEventListener("click", function() {
                // 按钮样式更改
                tabList.childNodes.forEach(otherBtn => {
                    if (otherBtn === childBtn) {
                        otherBtn.setAttribute("class", "MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary Mui-selected css-1q2h7u5");
                        otherBtn.setAttribute("tabindex", 0);
                        otherBtn.setAttribute("aria-selected", true);
                    }
                    else {
                        otherBtn.setAttribute("class", "MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-1q2h7u5");
                        otherBtn.setAttribute("tabindex", -1);
                        otherBtn.setAttribute("aria-selected", false);
                    }
                });
                // 面板样式更改
                panelList.childNodes.forEach((otherPanel, panelIdx) => {
                    if (panelIdx === btnIdx) {
                        otherPanel.setAttribute("class", "TabPanel_tabPanel__tXMJF");
                    }
                    else {
                        otherPanel.setAttribute("class", "TabPanel_tabPanel__tXMJF TabPanel_hidden__26UM3");
                    }
                });
                // 更新收藏列表
                if (childBtn === subscribeTabButton) updateSubscribedList();
            });
        });

        showSubscribeButton.addEventListener("click", function () {
            const filterInput = filterContainer.querySelector(".Input_input__2-t98");
            if (!filterInput) {
                return;
            }
            
            // 取消筛选
            const lastValue = filterInput.value;
            const event = new Event("input", { bubbles: true });
            event.simulated = true;
            filterInput.value = "";
            filterInput._valueTracker && filterInput._valueTracker.setValue(lastValue);
            filterInput.dispatchEvent(new Event("input", { bubbles: true }));

            // 选中收藏页签
            subscribeTabButton.click();
        });
    }

    function addButton() {
        const marketPanel = document.querySelector(".MarketplacePanel_marketplacePanel__21b7o ");
        if (!marketPanel) {
            return;
        }

        const subscribeButton = marketPanel.querySelector("button#subscribeButton");
        subscribeButton || createSubscribeButton(marketPanel);

        const displayButton = marketPanel.querySelector("button#subscribeTabButton");
        displayButton || createDisplayButton(marketPanel);
    }

    function start() {
        console.info("[MWISubscribe] start");
        mwi_common = window.mwi_common;
        if (!mwi_common) {
            console.error("[MWISubscribe] mwi_common not found");
            return;
        }

        setInterval(addButton, 500);
        // 监听市场数据变动
        document.addEventListener(mwi_common.eventNames.marketDataUpdate, updateSubscribedList);
    }

    if (window.mwi_common) start();
    else {
        console.info("[MWISubscribe] waiting for mwi_common");
        document.addEventListener("mwi_common_injected", start);
    }

})();