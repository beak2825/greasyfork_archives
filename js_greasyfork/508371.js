// ==UserScript==
// @name         动态拦截并替换指定 JS 文件（符号位置匹配，前后两位字符）
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  动态拦截并替换目标 JS 文件，并根据符号位置生成宽松的正则表达式查找相似结构，并输出需要修改的位置前后两位
// @author       Rich_DooRoo
// @match        https://play.pixels.xyz/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508371/%E5%8A%A8%E6%80%81%E6%8B%A6%E6%88%AA%E5%B9%B6%E6%9B%BF%E6%8D%A2%E6%8C%87%E5%AE%9A%20JS%20%E6%96%87%E4%BB%B6%EF%BC%88%E7%AC%A6%E5%8F%B7%E4%BD%8D%E7%BD%AE%E5%8C%B9%E9%85%8D%EF%BC%8C%E5%89%8D%E5%90%8E%E4%B8%A4%E4%BD%8D%E5%AD%97%E7%AC%A6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/508371/%E5%8A%A8%E6%80%81%E6%8B%A6%E6%88%AA%E5%B9%B6%E6%9B%BF%E6%8D%A2%E6%8C%87%E5%AE%9A%20JS%20%E6%96%87%E4%BB%B6%EF%BC%88%E7%AC%A6%E5%8F%B7%E4%BD%8D%E7%BD%AE%E5%8C%B9%E9%85%8D%EF%BC%8C%E5%89%8D%E5%90%8E%E4%B8%A4%E4%BD%8D%E5%AD%97%E7%AC%A6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetPathPattern = /\/_next\/static\/chunks\/167\.[a-z0-9]+\.js/; // 动态捕获目标JS文件路径的正则表达式

    // 替换规则
    const replacementRules = [
{
            search: 'z=Math.max(3,Math.floor((null!==(o=null===(n=I[0])||void 0===n?void 0:n.price)&&void 0!==o?o:0)*1.2));',
            replace: 'z=Math.max(1,Math.floor((null!==(o=null===(n=I[0])||void 0===n?void 0:n.price)&&void 0!==o?o:0)*1.0));'
        },
        {
            search: 'R(10)',
            replace: `R((function() {
                let calculatedValue = Math.floor(Number(
                    document.querySelector("#__next > div > div.room-layout > div > div:nth-child(1) > div > div.Hud_top__nZRRz.Hud_left__mQoqW > div > div.Hud_berry__6A2FS.clickable > div > span")
                    ?.innerText.replace(/,/g, '') || '0') / W);

                if (calculatedValue > 2970) {
                    return 2970;
                } else {
                    return calculatedValue;
                }
            })() || (I[0] ? c.listings.reduce((sum, e) => sum + (e.price === I[0].price ? e.quantity - e.purchasedQuantity : 0), 0) : 0))`
        },
        {
            search: 'R(Math.min(Math.max(Math.floor(Number(e.target.value)),0),99))',
            replace: 'R(Math.min(Math.max(Math.floor(Number(e.target.value)),0),999999))'
        },
        {
            search: 'defaultValue:"Remove"',
            replace: 'defaultValue: `单价:${a.price}`'
        },
        {
          search: 'quantity:G,price:(0,E.xG)(W*G,q)})}),(0,s.jsx)("button",{className:u()(y().pushbutton,nV().buyListing),onClick:e=>{e.preventDefault(),F(void 0)},children:v("marketplace.itemListings.no",{ns:"ui",defaultValue:"Cancel"})',
          replace: `quantity:G,price:(0,E.xG)(W*G,q)})}),

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
    (0,s.jsx)("input",{id:"maxPriceInput", className:nV().remarksInput, style:{width: '70px'}, placeholder:"高价", type:"text", defaultValue:"404"})
]}),

    (0,s.jsx)("button",{className:u()(y().pushbutton,nV().buyListing),onClick:e=>{e.preventDefault(), e.preventDefault(),  // 保持逗号，不添加分号

    // 获取玩家市场列表的逻辑，替换掉原来的 A(void 0)
    (async () => {
    try {
        // 获取玩家市场列表
        console.log("用户的mid: " + N.core.mid);
        const playerListings = await ed.Z.fetchMarketplaceListingsForPlayer(N.core.mid);

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
            nU({
                subcommand: "create",
                itemId: itemId,
                quantity: totalQuantity,
                price: parseFloat(document.getElementById('maxPriceInput').value) || 40,
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
},children:v("marketplace.itemListings.no",{ns:"ui",defaultValue:"出售"})`
        },
        {
            search: '("button",{className:u()(y().uikit,y().pushbutton,nF().button),onClick:e=>{e.preventDefault(),d((0,nG.Uj)())},children:o("marketplace.buy.success.close",{ns:"ui",defaultValue:"Close"})})',
            replace: '("button",{className:u()(y().uikit,y().pushbutton,nF().button),onClick:e=>{e.preventDefault(),d((0,nG.Uj)())},children:[o("marketplace.buy.success.close",{ns:"ui",defaultValue:"Close"}),(()=>{setTimeout(()=>{d((0,nG.Uj)())},3000)})()]})'
        },
        {
    search: 'r.useEffect(()=>{var e;if("pending"===j)return;f(!0);let t=!0;return ed.Z.fetchMarketplaceListingsForItem(d.id,null==N?void 0:null===(e=N.core)||void 0===e?void 0:e.mid).then(e=>t&&x(e),e=>t&&console.error(e)).finally(()=>t&&f(!1)),()=>{t=!1}},[j,d])',
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
                f(true);
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
                        console.log("用户的mid:" + N.core.mid);
                        const playerListings = await ed.Z.fetchMarketplaceListingsForPlayer(N.core.mid);
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
                            nU({
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
                        currentRequest = ed.Z.fetchMarketplaceListingsForItem(d.id,null==N?void 0:null === (e = N.core) || void 0 === e ? void 0 : e.mid);
                        const listingsData = await currentRequest;

                        if (isMounted && listingsData && listingsData.listings && listingsData.listings.length > 0) {
                            x(listingsData);
                            // 更新商品列表
                            globalListingsData = listingsData;
                            // 存储到全局变量

                            const minPriceInputElement = document.getElementById("minPriceInput");
                            if (minPriceInputElement) {
                                O(parseFloat(minPriceInputElement.value));
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

                                R(totalQuantity);

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
                            f(false);
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
            ,[j,d])`
        },
        {
            search: 'O(Math.min(Math.max(Math.floor(Number(e.target.value)),3),z))',
            replace: 'O(Math.min(Math.max(Math.floor(Number(e.target.value)),0),999999))'
        },
        {
            search: '"Maximum Amount"',
            replace: `"Max_N " +
"低价:" + I[0].price +
" 总数:" + (function() {
    let totalQuantity = 0;
    if (I[0]) {
        totalQuantity = h.listings.reduce((sum, e) => sum + (e.price === I[0].price ? e.quantity - e.purchasedQuantity : 0), 0);
    }
    return totalQuantity;
})() +
" 滞销价:" + (function() {
    let oldestTimestamp = Infinity;
    let oldestPrice = 0;
    let maxStagnationDuration = 0;
    let maxStagnationTimeFormatted = "";

    h.listings.forEach(e => {
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

    let referencePrice = Math.ceil((W * G) / 0.99 / G);
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
            replace: `"Max_P 普:"+ Math.ceil((W * G) / 0.90 / G) + " 会:" + Math.ceil((W * G) / 0.99 / G) + " 余位: " + window.remainingSlots `
        },
        {
            search: '[v,h]=r.useState(()=>Math.min(1,c))',
            replace: '[v,h]=r.useState(c)'
        },
        {
            search: 'let[N,k]=r.useState("")',
            replace: 'let[N,k]=r.useState(()=>{let storedOrderbuy=localStorage.getItem("Orderbuy");if(storedOrderbuy&&storedOrderbuy.trim()!==""){return storedOrderbuy.split(",").map(entry=>entry.split("-")[0]).join(", ")}else{return"Copperite Ore"}})'
        },
        {
            search: 'w=r.useMemo(()=>{var e;if(!c)return[];let t=null!==(e=o.get(c))&&void 0!==e?e:[];if(!f)return[];let i=N.toLocaleLowerCase();return t.filter(e=>{if(!f[e.id])return!1;let t=n((0,b.sA)(e.id),{ns:"game"});return!!t&&t.toLocaleLowerCase().includes(i)})},[o,c,f,N,n])',
            replace: 'w=r.useMemo(()=>{if(!c){console.log("c=",c);return[]}let t=o.get(c)||[];if(!f)return[];let inputName="sap".toLocaleLowerCase();let matchedItem=t.find(e=>{let itemName=n((0,b.sA)(e.id),{ns:"game"}).toLocaleLowerCase();return itemName===inputName});if(matchedItem){console.log("找到的物品ID:",matchedItem.id)}else{console.log("未找到匹配的物品")};return[]},[o,c,f,N,n])' //多搜索
        },
        {
            search: 'null===(n=e.listings)||void 0===n||n.forEach(e=>{e.currency===x&&(e.price<t.floor&&(t.floor=e.price),e.price>t.max&&(t.max=e.price))}),T(t)',
            replace: 'null===(n=e.listings)||void 0===n||n.forEach(e=>{if(e.currency===x){e.price<t.floor&&(t.floor=e.price),e.price>t.max&&(t.max=e.price)}});t.max>=1&&(t.floor=1===t.max?1:t.max-1);T(t);k(t.floor.toString());F(t.floor.toString())'
        },
        {
            search: 'nU({subcommand:"purchase",listingId:e._id,quantity:G})',
            replace: 'nU({subcommand:"purchase",listingId:e._id,quantity:G}); setTimeout(() => { d((0,nR.Uj)()) }, 2000)'
        },
        {
            search: 'defaultValue:"View Listings"',
            replace: 'defaultValue:(()=>{let storedOrderbuy=localStorage.getItem("Orderbuy")||"";let orderbuyArray=storedOrderbuy.split(",").filter(Boolean);let itemEntry=orderbuyArray.find(entry=>entry.split("-")[0]===t);let quantity=itemEntry?itemEntry.split("-")[1]:"0";return"数量: "+quantity})()'
        },
        {
            search: '("img",{crossOrigin:"anonymous",src:m}),(0,s.jsx)("span",{children:c})]})',
            replace: '("img",{crossOrigin:"anonymous",src:m}),(0,s.jsx)("span",{children:`${c} (数量:${a.quantity} 单价:${a.price} 收益:${Math.floor(a.quantity * a.price - a.fee)})`})]})'
        }
        // 更多替换规则...
    ];

    // 提取前后两位字符
    function extractSurroundingChars(text, startIndex, length = 1) {
        const before = startIndex > 0 ? text[startIndex - 1] : '';
        const after = startIndex + length < text.length ? text[startIndex + length] : '';
        return `${before}${text.substr(startIndex, length)}${after}`;
    }

    // 对比并输出修改内容（前后字符）
    function compareAndLogDifferences(original, modified) {
        for (let i = 0; i < original.length; i++) {
            if (original[i] !== modified[i]) {
                const snippet = extractSurroundingChars(original, i);
                const modifiedSnippet = extractSurroundingChars(modified, i);
                console.log(`将 ${snippet} 修改为 ${modifiedSnippet}`);
            }
        }
    }

    // 根据符号位置生成宽松的正则表达式
    function generateRegexFromSymbols(code) {
        let regexParts = [];
        let symbolPositions = [];

        // 遍历字符串，找到符号的位置
        for (let i = 0; i < code.length; i++) {
            const char = code[i];

            // 只处理特定的符号，如=, ., +, -, *, /, (, ), [, ], {, }, !, ?, :, ; 等
            if (/[\=\.\+\-\*\/\(\)\[\]\{\}\!\?\:\;]/.test(char)) {
                symbolPositions.push({symbol: char, position: i});
            }
        }

        // 生成正则部分
        let lastPosition = 0;
        symbolPositions.forEach((entry) => {
            // 添加任意字符的通用匹配 (包括字母、数字和空白符)
            let gapLength = entry.position - lastPosition;
            regexParts.push(`.{${gapLength}}`); // 匹配任意的gapLength长度的字符
            regexParts.push(`\\${entry.symbol}`); // 匹配特定符号，注意转义符号
            lastPosition = entry.position + 1;
        });

        // 最后如果有剩余字符，需要加上任意字符匹配
        if (lastPosition < code.length) {
            regexParts.push(`.{${code.length - lastPosition}}`);
        }

        // 合并生成完整的正则表达式
        return new RegExp(regexParts.join(''), 'g');
    }

    // 修改并执行 JS 内容
    function modifyAndExecuteJSContent(text) {
        //console.log('原始 JS 文件内容：', text); // 输出原始 JS 内容，用于调试

        replacementRules.forEach((rule, index) => {
            try {
                const searchRegex = new RegExp(rule.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

                if (!text.includes(rule.search)) {
                    console.log(`第 ${index + 1} 个匹配失败: ${rule.search}`); // 匹配失败日志

                    // 当匹配失败时使用符号位置生成宽松正则表达式
                    const looseRegex = generateRegexFromSymbols(rule.search);
                    const similarMatches = text.match(looseRegex); // 使用生成的正则查找相似的代码

                    if (similarMatches && similarMatches.length > 0) {
                        const match = similarMatches[0];
                        console.log(`找到相似结构: ${match}`);

                        // 对比需要修改的位置，并输出前后两位
                        compareAndLogDifferences(rule.search, match);
                    } else {
                        console.log(`第 ${index + 1} 个规则匹配失败，且未找到相似结构`);
                    }
                } else {
                    text = text.replace(searchRegex, rule.replace);
                    //console.log(`第 ${index + 1} 个替换规则成功应用`); // 确认替换成功
                }
            } catch (error) {
                console.error(`处理替换规则时出错 (第 ${index + 1} 个规则):`, rule.search, error);
            }
        });

        // 使用 eval 执行修改后的 JS 代码
        try {
            eval(text);
        } catch (error) {
            console.error('执行修改后的 JS 代码时出错:', error);
        }
    }

    // 持续监控插入的 script 标签，找到目标 JS 文件并替换
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'SCRIPT' && node.src && targetPathPattern.test(node.src)) {
                        console.log('检测到符合条件的 script 标签: ' + node.src);

                        // Fetch JS 文件内容
                        fetch(node.src)
                            .then(response => response.text())
                            .then(text => {
                                modifyAndExecuteJSContent(text); // 修改并执行 JS 内容
                                node.remove(); // 移除原始的 script 标签
                            })
                            .catch(err => console.error('获取 JS 文件时出错:', err));
                    }
                });
            }
        });
    });

    // 开始观察 DOM 变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 定时检查是否有新的 script 标签插入
    setInterval(() => {
        document.querySelectorAll('script[src]').forEach(script => {
            if (targetPathPattern.test(script.src)) {
                console.log('检测到符合条件的 script 标签: ' + script.src);

                // Fetch JS 文件内容
                fetch(script.src)
                    .then(response => response.text())
                    .then(text => {
                        modifyAndExecuteJSContent(text); // 修改并执行 JS 内容
                        script.remove(); // 移除原始的 script 标签
                    })
                    .catch(err => console.error('获取 JS 文件时出错:', err));
            }
        });
    }, 1000); // 每隔 1 秒检查一次

})();