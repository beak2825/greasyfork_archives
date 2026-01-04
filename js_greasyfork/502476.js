// ==UserScript==
// @name         自动低价抢购/背包满智能出售提醒/自动延时领邮件/任务委托获取单价,计算总开销
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  拦截并修改Play Pixels网站的JavaScript文件，添加低价抢购显示低价总数量和滞销价格，并自动领取邮件，智能出售, 任务委托获取单价,计算总开销
// @author       Rich_DooRoo
// @match        https://play.pixels.xyz/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502476/%E8%87%AA%E5%8A%A8%E4%BD%8E%E4%BB%B7%E6%8A%A2%E8%B4%AD%E8%83%8C%E5%8C%85%E6%BB%A1%E6%99%BA%E8%83%BD%E5%87%BA%E5%94%AE%E6%8F%90%E9%86%92%E8%87%AA%E5%8A%A8%E5%BB%B6%E6%97%B6%E9%A2%86%E9%82%AE%E4%BB%B6%E4%BB%BB%E5%8A%A1%E5%A7%94%E6%89%98%E8%8E%B7%E5%8F%96%E5%8D%95%E4%BB%B7%2C%E8%AE%A1%E7%AE%97%E6%80%BB%E5%BC%80%E9%94%80.user.js
// @updateURL https://update.greasyfork.org/scripts/502476/%E8%87%AA%E5%8A%A8%E4%BD%8E%E4%BB%B7%E6%8A%A2%E8%B4%AD%E8%83%8C%E5%8C%85%E6%BB%A1%E6%99%BA%E8%83%BD%E5%87%BA%E5%94%AE%E6%8F%90%E9%86%92%E8%87%AA%E5%8A%A8%E5%BB%B6%E6%97%B6%E9%A2%86%E9%82%AE%E4%BB%B6%E4%BB%BB%E5%8A%A1%E5%A7%94%E6%89%98%E8%8E%B7%E5%8F%96%E5%8D%95%E4%BB%B7%2C%E8%AE%A1%E7%AE%97%E6%80%BB%E5%BC%80%E9%94%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetPath = '/_next/static/chunks/167.e2040ca51dd35366.js';

    const replacements = [
        {
            search: 'q=Math.max(3,Math.floor((null!==(l=null===(i=C[0])||void 0===i?void 0:i.price)&&void 0!==l?l:0)*1.2));',
            replace: 'q=Math.max(1,Math.floor((null!==(l=null===(i=C[0])||void 0===i?void 0:i.price)&&void 0!==l?l:0)*1.0));'
        },
        {
            search: 'F(10)',
            replace: `F((function() {
                let calculatedValue = Math.floor(Number(
                    document.querySelector("#__next > div > div.room-layout > div > div:nth-child(1) > div > div.Hud_top__nZRRz.Hud_left__mQoqW > div > div.Hud_berry__6A2FS.clickable > div > span")
                    ?.innerText.replace(/,/g, '') || '0') / W);
                
                if (calculatedValue > 2970) {
                    return 2970;
                } else {
                    return calculatedValue;
                }
            })() || (C[0] ? c.listings.reduce((sum, e) => sum + (e.price === C[0].price ? e.quantity - e.purchasedQuantity : 0), 0) : 0))`
        },
        {
            search: 'F(Math.min(Math.max(Math.floor(Number(e.target.value)),0),99))',
            replace: 'F(Math.min(Math.max(Math.floor(Number(e.target.value)),0),999999))'
        },
        {
            search: 'defaultValue:"Remove"',
            replace: 'defaultValue: `单价:${t.price}`'
        },
        {
          search: 'quantity:L,price:(0,E.xG)(R*L,W)})}),(0,s.jsx)("button",{className:u()(y().pushbutton,nV().buyListing),onClick:e=>{e.preventDefault(),A(void 0)},children:d("marketplace.itemListings.no",{ns:"ui",defaultValue:"Cancel"})',
          replace: `quantity:L,price:(0,E.xG)(R*L,W)})}),
    
     // 添加提示文字和输入框
    (0,s.jsxs)("div",{className:nV().remarksContainer,style:{display: 'inline-flex', alignItems: 'center', gap: '4px'}, children:[
    (0,s.jsx)("span",{children:"低购价:"}),
    (0,s.jsx)("input",{id:"minPriceInput", className:nV().remarksInput, style:{width: '70px'}, placeholder:"低价", type:"text", defaultValue:"1", 
        onChange: function(e) {
            var minPrice = parseFloat(e.target.value) || 1;
            var maxPriceInput = document.getElementById('maxPriceInput');
            if (maxPriceInput) {
                maxPriceInput.value = minPrice + 1;
            }
        }
    }),
    (0,s.jsx)("span",{children:"高售价:"}),
    (0,s.jsx)("input",{id:"maxPriceInput", className:nV().remarksInput, style:{width: '70px'}, placeholder:"高价", type:"text", defaultValue:"2"})
]}),
    
    (0,s.jsx)("button",{className:u()(y().pushbutton,nV().buyListing),onClick:e=>{e.preventDefault(), e.preventDefault(),  // 保持逗号，不添加分号

    // 获取玩家市场列表的逻辑，替换掉原来的 A(void 0)
    (async () => {
    try {
        // 获取玩家市场列表
        console.log("用户的mid: " + f.core.mid);
        const playerListings = await ed.Z.fetchMarketplaceListingsForPlayer(f.core.mid);

        // 检查 playerListings 是否有效
        if (playerListings && playerListings.listings) {
            console.log("玩家的市场列表已刷新 (共 " + playerListings.listings.length + " 项): " + JSON.stringify(playerListings));
        } else {
            console.error("未能获取到有效的玩家市场列表。");
            return; // 如果获取市场列表失败，则退出
        }

        // 获取背包信息并计算空位
        let inventory = null;

        // 确保背包数据完全加载
        for (let retries = 0; retries < 5; retries++) {
            inventory = K.l.getInstance()?.selfPlayer?.inventory;
            if (inventory && inventory.slots && Object.keys(inventory.slots).length > 0) {
                console.log("背包数据加载成功: " + JSON.stringify(inventory));
                break;
            }
            console.log("背包数据未完全加载，重试中...");
            await new Promise(resolve => setTimeout(resolve, 1000)); // 延时1秒
        }

        if (!inventory) {
            throw new Error("背包数据加载失败");
        }

        // 计算剩余空位和物品数量
        let totalQuantityUsed = 0;
        let totalQuantity = 0;
        let itemId = null;
        const maxStackSize = 99;
        const totalSlots = inventory.size;

        // 深度复制 slots 防止并发问题
        const slots = JSON.parse(JSON.stringify(inventory.slots));

        for (let i = 0; i < totalSlots; i++) {
            const slot = slots[i.toString()];
            if (slot && slot.item) {
                if (!itemId) {
                    itemId = slot.item;
                    console.log("获取到 itemId: " + itemId);
                }
                if (slot.item === itemId) {
                    totalQuantity += slot.quantity;
                    console.log("累加数量：当前 " + slot.quantity + ", 总计 " + totalQuantity);
                }
                totalQuantityUsed += slot.quantity;
            }
        }

        const totalCapacity = totalSlots * maxStackSize;
        const totalEmptySlots = totalCapacity - totalQuantityUsed;

        // 验证计算结果
        if (totalEmptySlots < 0 || totalEmptySlots > totalCapacity) {
            throw new Error("计算结果异常，总空位数不在合理范围内: " + totalEmptySlots);
        }

        window.remainingSlots = totalEmptySlots;
        console.log("当前剩余可放置物品的位置总数: " + totalEmptySlots);

        // 检查是否满足出售条件
        if (playerListings.listings.length < 10 && totalQuantity > 0 && itemId) {
            console.log("市场列表项数少于10，准备执行出售操作");

            // 执行出售操作
            nG({
                subcommand: "create",
                itemId: itemId,  
                quantity: totalQuantity,
                price: parseFloat(document.getElementById('maxPriceInput').value) || 2,
                currency: "cur_coins"
            });
            console.log("出售操作已执行: " + itemId + "，数量: " + totalQuantity);
window.waitingForSlots = false; // 取消暂停标志

        } else {
            console.log("市场列表已满，未执行出售操作");
        }

    } catch (error) {
        console.error("操作过程中出错: " + (error.message || error));
    }
})()
},children:d("marketplace.itemListings.no",{ns:"ui",defaultValue:"出售"})`
        },
        {
            search: '("button",{className:u()(y().uikit,y().pushbutton,nL().button),onClick:e=>{e.preventDefault(),d((0,nF.Uj)())},children:o("marketplace.buy.success.close",{ns:"ui",defaultValue:"Close"})})',
            replace: '("button",{className:u()(y().uikit,y().pushbutton,nL().button),onClick:e=>{e.preventDefault(),d((0,nF.Uj)())},children:[o("marketplace.buy.success.close",{ns:"ui",defaultValue:"Close"}),(()=>{setTimeout(()=>{d((0,nF.Uj)())},3000)})()]})'
        },
        {
    search: 'r.useEffect(()=>{var e;if("pending"===_)return;g(!0);let t=!0;return ed.Z.fetchMarketplaceListingsForItem(a.id,null==f?void 0:null===(e=f.core)||void 0===e?void 0:e.mid).then(e=>t&&v(e),e=>t&&console.error(e)).finally(()=>t&&g(!1)),()=>{t=!1}},[_,a])',
    replace: `// 声明全局变量
            let waitingForSlots = false;
            let retryCount = 0;
            let errorCount = 0;
            let isStopped = false;
            // 用于停止和重启循环
            let lastMaxPriceInputValue = 404;
            // 用于记录上一次的 maxPriceInput 值
            let globalListingsData = null;
            // 用于存储全局的市场数据

            r.useEffect( () => {
                var e;
                if ("pending" === _)
                    return;
                g(true);
                // 设置加载状态为 true
                let isMounted = true;
                // 追踪组件是否挂载
                let isPaused = false;
                // 暂停标志
                let currentRequest = null;
                // 当前请求追踪

                // 延迟函数，确保顺序执行
                const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                // 监听 maxPriceInput 值变化的函数
                const checkMaxPriceInputValue = () => {
                    const maxPriceInputElement = document.getElementById("maxPriceInput");
                    if (maxPriceInputElement) {
                        const currentMaxPriceInputValue = parseFloat(maxPriceInputElement.value);

                        // 判断当前值是否为404，如果是404则暂停循环
                        if (currentMaxPriceInputValue === 404) {
                            const now = new Date();
                            console.log("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - maxPriceInput 值为404，暂停循环。");
                            isStopped = true;
                            // 暂停循环
                        } else if (currentMaxPriceInputValue !== lastMaxPriceInputValue) {
                            // 当值从404修改为其他值时，重新开始循环
                            const now = new Date();
                            console.log("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - maxPriceInput 值已修改，继续循环。");
                            isStopped = false;
                            // 继续循环
                            startFetchLoop();
                            // 重新启动循环
                        }
                        lastMaxPriceInputValue = currentMaxPriceInputValue;
                    }
                }
                ;

                // 顺序执行背包数据加载和计算逻辑
                const fetchInventoryAndCalculateSlots = async () => {
                    if (!isMounted || isStopped)
                        return;
                    try {
                        let inventory = null;

                        // 确保背包数据完全加载
                        for (let retries = 0; retries < 5; retries++) {
                            if (!isMounted || isStopped)
                                return;
                            inventory = K.l.getInstance()?.selfPlayer?.inventory;
                            if (inventory && inventory.slots && Object.keys(inventory.slots).length > 0) {
                                const now = new Date();
                                console.log("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - 背包数据加载成功: " + JSON.stringify(inventory));
                                break;
                            }
                            const now = new Date();
                            console.log("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - 背包数据未完全加载，重试中...");
                            await delay(1000);
                        }

                        if (!inventory) {
                            throw new Error("背包数据加载失败");
                        }

                        // 计算剩余空位
                        let totalQuantityUsed = 0;
                        const maxStackSize = 99;
                        const totalSlots = inventory.size;

                        // 深度复制 slots 防止并发问题
                        const slots = JSON.parse(JSON.stringify(inventory.slots));

                        for (let i = 0; i < totalSlots; i++) {
                            const slot = slots[i.toString()];
                            if (slot && slot.quantity !== undefined) {
                                totalQuantityUsed += slot.quantity;
                            }
                        }

                        const totalCapacity = totalSlots * maxStackSize;
                        const totalEmptySlots = totalCapacity - totalQuantityUsed;

                        // 验证计算结果
                        if (totalEmptySlots < 0 || totalEmptySlots > totalCapacity) {
                            throw new Error("计算结果异常，总空位数不在合理范围内: " + totalEmptySlots);
                        }

                        window.remainingSlots = totalEmptySlots;
                        const now = new Date();
                        console.log("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - 当前剩余可放置物品的位置总数: " + totalEmptySlots);
                        return totalEmptySlots;

                    } catch (error) {
                        const now = new Date();
                        console.error("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - 处理库存时出错: " + error);
                        window.remainingSlots = 0;
                        return 0;
                    }
                }
                ;

                const startSellMonitoring = async () => {
                    while (waitingForSlots && isMounted) {
                        await delay(30000);
                        // 每30秒检查一次
                        const newRemainingSlots = await fetchInventoryAndCalculateSlots();
                        const now = new Date();

                        if (newRemainingSlots > 0) {
                            console.log("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - 空位恢复，重新启动随机循环");
                            waitingForSlots = false;
                            isStopped = false;
                            // 重新启动随机循环
                            startFetchLoop();
                            break;
                        } else {
                            console.log("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - 空位仍为0，继续等待...");

                            // 滞销价和时间的计算逻辑
                            let oldestListing = globalListingsData.listings.reduce(function(oldest, listing) {
                                return listing.createdAt < oldest.createdAt ? listing : oldest;
                            });

                            const stagnationPrice = oldestListing.price;
                            const stagnationTime = Date.now() - oldestListing.createdAt;

                            let adjustedSellPrice;
                            const minPriceInputElement = document.getElementById("minPriceInput");

                            // 判断滞销价减2是否大于等于低购价
                            if (stagnationPrice - 2 >= parseFloat(minPriceInputElement.value)) {
                                if (stagnationTime <= 10 * 60 * 1000) {
                                    adjustedSellPrice = stagnationPrice;
                                    console.log("当前时间: " + new Date().toLocaleString() + " 购买价：" + minPriceInputElement.value + " - 滞销价减2大于等于低购价，且滞销时间小于10分钟，设置高售价为: " + adjustedSellPrice);
                                } else {
                                    adjustedSellPrice = stagnationPrice - 1;
                                    console.log("当前时间: " + new Date().toLocaleString() + " 购买价：" + minPriceInputElement.value + "+- 滞销价减2大于等于低购价，且滞销时间大于10分钟，设置高售价为: " + adjustedSellPrice);
                                }
                                document.getElementById("maxPriceInput").value = adjustedSellPrice;

                            } else if (stagnationPrice - 1 >= parseFloat(minPriceInputElement.value)) {
                                // 如果滞销价减2不符合，再判断滞销价减1是否大于等于低购价
                                adjustedSellPrice = stagnationPrice;
                                console.log("当前时间: " + new Date().toLocaleString() + " - 滞销价减1大于等于低购价，设置高售价为: " + stagnationPrice);
                                document.getElementById("maxPriceInput").value = stagnationPrice;

                            } else {
                                // 如果所有条件都不满足，使用默认高售价
                                adjustedSellPrice = parseFloat(document.getElementById("maxPriceInput").value);
                                console.log("当前时间: " + new Date().toLocaleString() + " - 不符合条件，使用默认高售价。");
                            }

                            // 执行售出操作
                            const sellSuccess = await executeSellAction(adjustedSellPrice, oldestListing.itemId);
                            if (sellSuccess) {
                                console.log("当前时间: " + new Date().toLocaleString() + " - 出售成功，继续循环。");
                                // 发送出售成功的通知
                                fetch("https://api.day.app/kV4QuUCKSGeH3w4qTRXjgE/"+ oldestListing.itemId + "购买价："+ minPriceInputElement.value +"已"+adjustedSellPrice+"金币的价格出售"+"?sound=glass", {
                                    method: "POST",
                                });
                                await delay(3000);
                                document.getElementById("minPriceInput").value = adjustedSellPrice -2;//更新最低购买价
                                document.getElementById("maxPriceInput").value = adjustedSellPrice; //更新出售价
                                waitingForSlots = false;
                                isStopped = false;
                                // 出售成功后重新启动随机循环
                                startFetchLoop();
                            } else {
                                console.log("当前时间: " + new Date().toLocaleString() + " - 出售失败，进入30秒检测循环。");
                                await startSellMonitoring();
                            }
                        }
                    }
                }
                ;

                // 执行出售操作的函数
                const executeSellAction = async (price, itemId) => {
                    try {
                        // 获取玩家市场列表
                        console.log("用户的mid:" + f.core.mid);
                        const playerListings = await ed.Z.fetchMarketplaceListingsForPlayer(f.core.mid);
                        // 检查 playerListings 是否有效
                        if (playerListings && playerListings.listings) {
                            console.log("玩家的市场列表已刷新 (共 " + playerListings.listings.length + " 项): " + JSON.stringify(playerListings));
                        } else {
                            console.error("未能获取到有效的玩家市场列表。");
                            return false;
                            // 如果获取市场列表失败，则退出
                        }

                        // 获取背包信息并计算空位
                        let inventory = null;

                        // 确保背包数据完全加载
                        for (let retries = 0; retries < 5; retries++) {
                            inventory = K.l.getInstance()?.selfPlayer?.inventory;
                            if (inventory && inventory.slots && Object.keys(inventory.slots).length > 0) {
                                console.log("背包数据加载成功: " + JSON.stringify(inventory));
                                break;
                            }
                            console.log("背包数据未完全加载，重试中...");
                            await delay(1000);
                        }

                        if (!inventory) {
                            throw new Error("背包数据加载失败");
                        }

                        // 计算剩余空位和物品数量
                        let totalQuantityUsed = 0;
                        let totalQuantity = 0;
                        const maxStackSize = 99;
                        const totalSlots = inventory.size;
                        let itemId = null;

                        // 深度复制 slots 防止并发问题
                        const slots = JSON.parse(JSON.stringify(inventory.slots));

                        for (let i = 0; i < totalSlots; i++) {
                            const slot = slots[i.toString()];
                            if (slot && slot.item) {
                                if (!itemId) {
                                    itemId = slot.item;
                                    console.log("获取到 itemId: " + itemId);
                                }
                                if (slot.item === itemId) {
                                    totalQuantity += slot.quantity;
                                    console.log("累加数量：当前 " + slot.quantity + ", 总计 " + totalQuantity);
                                }
                                totalQuantityUsed += slot.quantity;
                            }
                        }

                        const totalCapacity = totalSlots * maxStackSize;
                        const totalEmptySlots = totalCapacity - totalQuantityUsed;

                        // 验证计算结果
                        if (totalEmptySlots < 0 || totalEmptySlots > totalCapacity) {
                            throw new Error("计算结果异常，总空位数不在合理范围内: " + totalEmptySlots);
                        }

                        window.remainingSlots = totalEmptySlots;
                        console.log("当前剩余可放置物品的位置总数: " + totalEmptySlots);

                        // 检查是否满足出售条件
                        if (playerListings.listings.length < 10 && totalQuantity > 0 && itemId) {
                            console.log("市场列表项数少于10，准备执行出售操作");

                            // 执行出售操作
                            nG({
                                subcommand: "create",
                                itemId: itemId,
                                quantity: totalQuantity,
                                price: price,
                                currency: "cur_coins"
                            });
                            console.log("出售操作已执行: " + itemId + "，数量: " + totalQuantity);

                            return true;
                        } else {
                            console.log("市场列表项数过多或物品数量不足，未执行出售操作");
                            return false;
                        }
                    } catch (error) {
                        console.error("操作过程中出错: " + (error.message || error));
                        return false;
                    }
                }
                ;

                // 判断是否成功出售的函数
                const checkIfSoldSuccessfully = async (previousRemainingSlots) => {
                    await delay(5000);
                    // 等待 5 秒钟以确保出售操作完成
                    const newRemainingSlots = await fetchInventoryAndCalculateSlots();
                    return newRemainingSlots > previousRemainingSlots;
                }
                ;

                // 刷新列表并尝试购买的函数
                const fetchAndPurchase = async () => {
                    if (isPaused || !isMounted || waitingForSlots || isStopped)
                        return;

                    try {
                        const maxPriceInputElement = document.getElementById("maxPriceInput");
                        if (maxPriceInputElement) {
                            const maxPriceInput = parseFloat(maxPriceInputElement.value);
                            if (maxPriceInput === 404) {
                                const now = new Date();
                                console.log("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - maxPriceInput 值为 404，停止所有循环。");
                                isStopped = true;
                                // 设置停止标志
                                return;
                            }
                        }

                        // 如果未找到元素或者没有设置停止标志，继续正常执行
                        currentRequest = ed.Z.fetchMarketplaceListingsForItem(a.id, null == f ? void 0 : null === (e = f.core) || void 0 === e ? void 0 : e.mid);
                        const listingsData = await currentRequest;

                        if (isMounted && listingsData && listingsData.listings && listingsData.listings.length > 0) {
                            v(listingsData);
                            // 更新商品列表
                            globalListingsData = listingsData;
                            // 存储到全局变量

                            const minPriceInputElement = document.getElementById("minPriceInput");
                            if (minPriceInputElement) {
                                V(parseFloat(minPriceInputElement.value));
                                // 更新购买价格
                            } else {
                                const now = new Date();
                                console.warn("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - minPriceInput 元素未找到，跳过价格更新。");
                            }

                            retryCount = 0;
                            // 重置重试次数
                            errorCount = 0;
                            // 重置错误计数

                            const currentRemainingSlots = await fetchInventoryAndCalculateSlots();

                            const firstPrice = listingsData.listings[0]?.price;
                            if (firstPrice !== undefined) {
                                let totalQuantity = listingsData.listings.filter(listing => listing.price === firstPrice).reduce( (sum, listing) => sum + listing.quantity, 0);

                                if (totalQuantity > currentRemainingSlots) {
                                    const now = new Date();
                                    console.log("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - 调整 totalQuantity 为当前剩余空位数。");
                                    totalQuantity = currentRemainingSlots;
                                }

                                F(totalQuantity);

                                // 条件1：背包空位为0时，停止所有操作并处理滞销价和高售价
                                if (currentRemainingSlots === 0) {
                                    const now = new Date();
                                    console.log("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - 空位已满，停止所有操作并等待空位恢复");
                                    waitingForSlots = true;
                                    // 设置全局标志，等待空位恢复

                                    startSellMonitoring();
                                    return;
                                    // 停止进一步处理
                                }

                                // 常规购买逻辑：市场低价小于或等于低购价时触发购买
                                if (minPriceInputElement && firstPrice <= parseFloat(minPriceInputElement.value) && (totalQuantity >= 30 || currentRemainingSlots <= 30)) {
                                    const button = document.querySelector(".commons_pushbutton__7Tpa3.MarketplaceItemListings_buyListing__jYwuF");
                                    if (button && isMounted) {
                                        button.click();
                                        const now = new Date();
                                        console.log("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - 已点击购买按钮，等待5秒后进行库存检查。");

                                        // 在点击购买按钮后延迟 5 秒钟，然后继续计算库存空位
                                        await delay(5000);
                                        const newRemainingSlots = await fetchInventoryAndCalculateSlots();
                                        const nowAgain = new Date();
                                        console.log("当前时间: " + nowAgain.getDate() + "日" + nowAgain.getHours() + "时" + nowAgain.getMinutes() + "分" + nowAgain.getSeconds() + "秒 - 再次计算库存空位: " + newRemainingSlots);

                                        if (newRemainingSlots !== currentRemainingSlots) {
                                            console.log("当前时间: " + nowAgain.getDate() + "日" + nowAgain.getHours() + "时" + nowAgain.getMinutes() + "分" + nowAgain.getSeconds() + "秒 - 库存有变化，延时13秒后再继续循环。");
                                            await delay(13000);
                                        } else {
                                            console.log("当前时间: " + nowAgain.getDate() + "日" + nowAgain.getHours() + "时" + nowAgain.getMinutes() + "分" + nowAgain.getSeconds() + "秒 - 库存无变化，立即进行下一次循环。");
                                        }
                                    }
                                }
                            }
                        } else {
                            const now = new Date();
                            console.warn("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - 没有可用的商品列表数据。");
                        }
                    } catch (error) {
                        // 捕获 429 错误或网络错误
                        if ((error.response && error.response.status === 429) || error.code === "ERR_NETWORK") {
                            errorCount++;
                            // 增加错误计数

                            if (errorCount >= 3) {
                                // 如果连续三次出现错误
                                const now = new Date();
                                console.log("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - 连续三次请求过于频繁或网络错误，暂停3分钟后再继续请求...");

                                // 发送获取市场频繁的通知
                                fetch("https://api.day.app/kV4QuUCKSGeH3w4qTRXjgE/获取频繁?sound=alarm", {
                                    method: "POST",
                                });

                                isPaused = true;
                                await delay(180000);
                                // 暂停3分钟
                                if (!isMounted)
                                    return;
                                isPaused = false;
                                // 如果不再发生错误，发送解除通知
                                fetch("https://api.day.app/kV4QuUCKSGeH3w4qTRXjgE/获取频繁解除?sound=calm", {
                                    method: "POST",
                                });
                            } else {
                                // 未达到三次错误，继续下一次循环
                                await delay(2000);
                                if (isMounted) {
                                    await fetchAndPurchase();
                                    // 再次尝试获取数据
                                }
                            }
                        } else {
                            const now = new Date();
                            console.error("当前时间: " + now.getDate() + "日" + now.getHours() + "时" + now.getMinutes() + "分" + now.getSeconds() + "秒 - 获取列表时出错: " + error);
                        }
                    } finally {
                        if (isMounted && !isPaused && !isStopped) {
                            g(false);
                            // 请求完成后重置加载状态
                            currentRequest = null;
                        }
                    }
                }
                ;

                const startFetchLoop = () => {
                    if (!isMounted || isStopped)
                        return;
                    setTimeout(async () => {
                        if (isMounted && !isStopped) {
                            await fetchAndPurchase();
                            // 正常循环获取数据并购买
                            startFetchLoop();
                            // 继续下一次循环
                        }
                    }
                    , Math.random() * 1000 + 1000);
                    // 1到2秒之间随机延时
                }
                ;

                // 启动循环
                startFetchLoop();

                // 启动值变化监听
                setInterval(checkMaxPriceInputValue, 1000);
                // 每秒检查一次 maxPriceInput 值是否改变

                // 组件卸载时清理资源
                return () => {
                    isMounted = false;
                    isStopped = true;
                    // 停止所有循环
                    if (currentRequest) {
                        currentRequest = null;
                    }
                }
                ;

            }
            , [_, a])`
        },
        {
            search: 'V(Math.min(Math.max(Math.floor(Number(e.target.value)),3),q))',
            replace: 'V(Math.min(Math.max(Math.floor(Number(e.target.value)),0),999999))'
        },
        {
            search: '"Maximum Amount"',
            replace: `"Max_N " + 
"低价:" + C[0].price + 
" 总数:" + (function() {
    let totalQuantity = 0;
    if (C[0]) {
        totalQuantity = c.listings.reduce((sum, e) => sum + (e.price === C[0].price ? e.quantity - e.purchasedQuantity : 0), 0);
    }
    return totalQuantity;
})() + 
" 滞销价:" + (function() {
    let oldestTimestamp = Infinity;
    let oldestPrice = 0;
    let maxStagnationDuration = 0;
    let maxStagnationTimeFormatted = "";

    c.listings.forEach(e => {
        if (e.createdAt < oldestTimestamp) {
            oldestTimestamp = e.createdAt;
            oldestPrice = e.price;
        }

        // 计算滞销时间
        const stagnationDuration = Date.now() - e.createdAt;
        if (stagnationDuration > maxStagnationDuration) {
            maxStagnationDuration = stagnationDuration;

            // 将创建时间转换为本地日期
            const date = new Date(e.createdAt);
            const day = date.getDate(); // 获取日期
            const hours = date.getHours(); // 获取小时
            const minutes = date.getMinutes(); // 获取分钟
            
            maxStagnationTimeFormatted = 
                day + "号" +
                (hours > 0 ? hours + "时" : "0时") +
                (minutes > 0 ? minutes + "分" : "0分");
        }
    });

    let referencePrice = Math.ceil((R * L) / 0.99 / L);
    if (oldestPrice - referencePrice >= 2) {
        return oldestPrice + 
            " 预出售价:" + (oldestPrice - 1) + 
            " 收益:" + (oldestPrice - referencePrice - 1) +
            " 滞销时间:" + maxStagnationTimeFormatted;
    }
    return oldestPrice + " 滞销时间:" + maxStagnationTimeFormatted;
})()`
        },
        {
            search: '"Maximum Price"',
            replace: `"Max_P 普:"+ Math.ceil((R * L) / 0.90 / L) + " 会:" + Math.ceil((R * L) / 0.99 / L) + " 余位: " + window.remainingSlots `
        },
        {
            search: '[d,c]=r.useState(()=>Math.min(1,o))',
            replace: '[d,c]=r.useState(o)'
        },
        {
            search: 'let[N,k]=r.useState("")',
            replace: 'let[N,k]=r.useState(()=>{let storedOrderbuy=localStorage.getItem("Orderbuy");if(storedOrderbuy&&storedOrderbuy.trim()!==""){return storedOrderbuy.split(",").map(entry=>entry.split("-")[0]).join(", ")}else{return"Copperite Ore"}})'
        },
        {
            search: 'C=r.useMemo(()=>{var e;if(!c)return[];let t=null!==(e=o.get(c))&&void 0!==e?e:[];if(!f)return[];let i=N.toLocaleLowerCase();return t.filter(e=>{if(!f[e.id])return!1;let t=n((0,b.sA)(e.id),{ns:"game"});return!!t&&t.toLocaleLowerCase().includes(i)})},[o,c,f,N,n])',
            replace: 'C=r.useMemo(()=>{if(!c)return[];let t=o.get(c)||[];if(!f)return[];let searchTerms=N.includes(",")?N.split(/,+/).map(term=>term.trim().toLocaleLowerCase()):[N.toLocaleLowerCase()],searchResults=[];searchTerms.forEach(i=>{let filteredItems;if(searchTerms.length===1&&!N.includes(",")){filteredItems=t.filter(e=>f[e.id]&&n((0,b.sA)(e.id),{ns:"game"}).toLocaleLowerCase().includes(i))}else{filteredItems=t.filter(e=>f[e.id]&&n((0,b.sA)(e.id),{ns:"game"}).toLocaleLowerCase()===i)}searchResults=searchResults.concat(filteredItems)});return[...new Map(searchResults.map(item=>[item.id,item])).values()]},[o,c,f,N,n])' //多搜索
        },
        {
            search: 'null===(n=e.listings)||void 0===n||n.forEach(e=>{e.currency===v&&(e.price<i.floor&&(i.floor=e.price),e.price>i.max&&(i.max=e.price))}),S(i)',
            replace: 'null===(n=e.listings)||void 0===n||n.forEach(e=>{if(e.currency===v){e.price<i.floor&&(i.floor=e.price),e.price>i.max&&(i.max=e.price)}});i.max>=1&&(i.floor=1===i.max?1:i.max-1);S(i);j(i.floor.toString());D(i.floor.toString())'
        },
        {
            search: 'nG({subcommand:"purchase",listingId:e._id,quantity:L})',
            replace: 'nG({subcommand:"purchase",listingId:e._id,quantity:L}); setTimeout(() => { d((0,nF.Uj)()) }, 2000)'
        },
        {
            search: 'defaultValue:"View Listings"',
            replace: 'defaultValue:(()=>{let storedOrderbuy=localStorage.getItem("Orderbuy")||"";let orderbuyArray=storedOrderbuy.split(",").filter(Boolean);let itemEntry=orderbuyArray.find(entry=>entry.split("-")[0]===t);let quantity=itemEntry?itemEntry.split("-")[1]:"0";return"数量: "+quantity})()'
        },
        {
            search: '("img",{crossOrigin:"anonymous",src:l}),(0,s.jsx)("span",{children:n})]})',
            replace: '("img",{crossOrigin:"anonymous",src:l}),(0,s.jsx)("span",{children:`${n} (数量:${t.quantity} 单价:${t.price} 收益:${Math.floor(t.quantity * t.price - t.fee)})`})]})'
        },
        {
            startPattern: 'lw=()=>',
            endPattern: '(s.Fragment,{})}',
            replace: `lw = () => {
    var e;
    let t = (0, m.C)(ly.AK),
        i = (0, m.T)(),
        { t: n } = (0, x.$)("ui"),
        l = () => {
            setTimeout(() => {
                i((0, ly.I_)());
            }, 2000);
        };

    const checkAndCollectMails = () => {
        setTimeout(() => {
            if (t.mail && t.mail.length > 0) {
                // 如果有邮件则收集
                t.mail.forEach(e => {
                    z.ZP.emitEventNow(z.Yi.COLLECT_MAIL_ITEM, { mailId: e._id, similar: true });
                });
                // 收集完邮件后延时3秒关闭
                setTimeout(() => {
                    l();
                }, 3000);
            } else {
                // 如果没有邮件则直接关闭
                l();
            }
        }, 10000); // 10秒后检查邮件
    };

    (0, r.useEffect)(() => {
        t.isVisible && z.ZP.emitEventNow(z.Yi.FETCH_MAIL);
    }, [t.isVisible]);

    (0, r.useEffect)(() => {
        if (t.isVisible) {
            checkAndCollectMails();
        } else {
            l();
        }
    }, [t.isVisible, t.mail]);

    return t.isVisible ? (
        (0, s.jsxs)("div", {
            className: y().modalBackdrop,
            children: [
                (0, s.jsx)(ek, {
                    onKeyDown: e => { "Escape" === e.key && l(); }
                }),
                (0, s.jsx)("div", {
                    className: u()(y().uikit, y().pixelbox, y().navy, y().center, lN().container),
                    children: (0, s.jsxs)("div", {
                        className: y().inner,
                        children: [
                            (0, s.jsx)("h1", {
                                children: n("mailbox.title", "Mailbox")
                            }),
                            t.isLoading && (0, s.jsx)(es.s5, {}),
                            t.isLoading || (null === (e = t.mail) || void 0 === e ? void 0 : e.length) ? 
                            (0, s.jsx)(lk, {}) : 
                            (0, s.jsx)("h2", {
                                className: y().center,
                                children: n("mailbox.nomail", "You have no mail at this time.")
                            }),
                            (0, s.jsx)("button", {
                                className: y().closeBtn,
                                type: "button",
                                onClick: l,
                                children: "\xa0"
                            })
                        ]
                    })
                })
            ]
        })
    ) : (0, s.jsx)(s.Fragment, {});
} `
        },
{
            startPattern: 'H=e=>{var t;let{request:i,reward:n,canFill:l,onFill:a,playerClassId:r}=e,{t:o}=(0,x.$)("ui");return(0,s.jsx)',
            endPattern: '{defaultValue:"DELIVER"})})]})]})})})}',
            replace: `H = e => {
    var t;
    let { request: i, reward: n, canFill: l, onFill: a, playerClassId: r } = e, { t: o } = (0, x.$)("ui");

    // 读取当前 Orderbuy 内容，初始化为空字符串
    let storedOrderbuy = localStorage.getItem("Orderbuy") || "";
    let orderbuyArray = storedOrderbuy.split(",").filter(Boolean);

    // 查找是否已经有相同的物品，如果有则更新数量
    let itemEntryIndex = orderbuyArray.findIndex(entry => entry.split("-")[0] === i.item.name);
    if (itemEntryIndex > -1) {
        // 如果找到相同的物品，累加数量
        let [name, quantity] = orderbuyArray[itemEntryIndex].split("-");
        quantity = parseInt(quantity) + i.quantity;
        orderbuyArray[itemEntryIndex] = name + "-" + quantity;
    } else {
        // 如果是新物品，添加到数组
        orderbuyArray.push(i.item.name + "-" + i.quantity);
    }

    // 保存更新后的 Orderbuy 字符串到 localStorage
    let updatedOrderbuy = orderbuyArray.join(",");
    localStorage.setItem("Orderbuy", updatedOrderbuy);

    // 输出最终保存的 Orderbuy 数据
    console.log("Final Saved Orderbuy:", updatedOrderbuy);

    // 获取价格并显示（可以在保存后继续执行其他操作）
    const itemNameToIdMap = {
        "Flex Master 3000": "itm_iamrich"  // 仅保留一个映射
    };

    let itemId = itemNameToIdMap[i.item.name];
    let uniqueId = i.item.id || Math.random().toString(36).substr(2, 9); // 确保唯一性

    if (itemId) {
        let mid = "6630b9f054c3ca96743cad99";
        console.log("Fetching price for item:", itemId, "with mid:", mid);

        ed.Z.fetchMarketplaceListingsForItem(itemId, mid).then(data => {
            let listings = data.listings;
            if (listings && listings.length > 0) {
                let price = listings[0].price;
                let totalCost = price * i.quantity;
                document.getElementById("item-price-" + uniqueId).textContent = "单价: " + price + " 花销: " + totalCost;
            }
        }).catch(error => {
            console.error("Error fetching listings for item:", itemId, error);
        });
    }

    return (0, s.jsx)("div", {
        className: u()(k()["store-item-container"], k().order),
        children: (0, s.jsx)("div", {
            className: u()(k()["card-content-wrapper"], k()["store-locked"], { [k()["order-class-".concat(r)]]: !!r }),
            children: (0, s.jsxs)("div", {
                className: k()["card-content"],
                children: [
                    (0, s.jsxs)("div", {
                        className: k()["card-header"],
                        children: [
                            (0, s.jsx)("div", {
                                children: !!n.skill.skillType && (0, s.jsx)(U, { skill: n.skill.skillType, xp: n.skill.xp })
                            }),
                            (0, s.jsx)("div", {
                                children: (0, s.jsx)(q, {
                                    currency: w.Z.getGameCurrency(null !== (t = n.currency.currencyId) && void 0 !== t ? t : w.Z.getDefaultCurrency()),
                                    balance: n.currency.amount,
                                    styles: { display: "inline" },
                                    small: !0,
                                    short: !0
                                })
                            })
                        ]
                    }),
                    (0, s.jsx)(G, {
                        itemData: i.item,
                        itemImage: i.item.image
                    }),
                    (0, s.jsxs)("div", {
                        className: k()["item-quantity"],
                        children: ["x", (0, s.jsx)("span", { children: i.quantity })]
                    }),
                    (0, s.jsxs)("div", {
                        className: k()["card-footer"],
                        children: [
                            (0, s.jsx)("div", { className: k()["card-title"], children: i.item.name }),
                            (0, s.jsx)("div", { id: "item-price-" + uniqueId, children: itemId ? "获取价格中..." : null }),
                            (0, s.jsx)("button", {
                                type: "button",
                                className: u()(k()["btn-max"], y().pushbutton),
                                disabled: !l,
                                onClick: a,
                                children: o("store.orders.deliver", { defaultValue: "$$$Luck$$$" })
                            })
                        ]
                    })
                ]
            })
        })
    });
}`
       }
    ];

    function modifyJSContent(text) {
        replacements.forEach(replacement => {
            if (replacement.search && replacement.replace) {
                let searchRegex = new RegExp(replacement.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                if (text.includes(replacement.search)) {
                    text = text.replace(searchRegex, replacement.replace);
                }else {
console.log('匹配失败:'+ replacement.search);
}
} else if (replacement.startPattern && replacement.endPattern && replacement.replace) {
const startIndex = text.indexOf(replacement.startPattern);
const endIndex = text.indexOf(replacement.endPattern, startIndex);
if (startIndex !== -1 && endIndex !== -1) {
text = text.substring(0, startIndex) + replacement.replace + text.substring(endIndex + replacement.endPattern.length);
} else {
console.log('匹配失败:'+ replacement.startPattern + '到 '+ replacement.endPattern);
}
}
});
return text;
}

(function(open, send) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._url = url;
        open.call(this, method, url, async, user, password);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4 && this.status === 200 && this._url.endsWith('.js') && this._url.includes(targetPath)) {
                let modifiedText = modifyJSContent(this.responseText);
                Object.defineProperty(this, 'responseText', { value: modifiedText });
            }
        });
        send.call(this, body);
    };
})(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);

(function(fetch) {
    window.fetch = function() {
        return fetch.apply(this, arguments).then(response => {
            if (response.url.endsWith('.js') && response.url.includes(targetPath)) {
                return response.clone().text().then(text => {
                    let modifiedText = modifyJSContent(text);
                    return new Response(modifiedText, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                });
            }
            return response;
        });
    };
})(window.fetch);

(function(createElement) {
    var originalCreateElement = document.createElement;
    document.createElement = function() {
        var element = originalCreateElement.apply(this, arguments);
        if (arguments[0].toLowerCase() === 'script') {
            Object.defineProperty(element, 'src', {
                set: function(url) {
                    if (url.endsWith('.js') && url.includes(targetPath)) {
                        fetch(url).then(response => response.text()).then(text => {
                            let modifiedText = modifyJSContent(text);
                            var blob = new Blob([modifiedText], { type: 'text/javascript' });
                            var newUrl = URL.createObjectURL(blob);
                            element.setAttribute('src', newUrl);
                        });
                    } else {
                        element.setAttribute('src', url);
                    }
                }
            });
        }
        return element;
    };
})(document.createElement);

})();