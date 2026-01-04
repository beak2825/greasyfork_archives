// ==UserScript==
// @name         微店自动加入购物车 V:ditianbrother
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  承接脚本定制开发 V:ditianbrother
// @author       ditianbrother
// @match        https://h5.weidian.com/decoration/shop-category/category.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540319/%E5%BE%AE%E5%BA%97%E8%87%AA%E5%8A%A8%E5%8A%A0%E5%85%A5%E8%B4%AD%E7%89%A9%E8%BD%A6%20V%3Aditianbrother.user.js
// @updateURL https://update.greasyfork.org/scripts/540319/%E5%BE%AE%E5%BA%97%E8%87%AA%E5%8A%A8%E5%8A%A0%E5%85%A5%E8%B4%AD%E7%89%A9%E8%BD%A6%20V%3Aditianbrother.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 记录已处理过的商品ID，防止重复
    let addedItemIds = new Set();

    // 查询SKU信息
    async function fetchSkuInfo(itemId) {
        let url = `https://thor.weidian.com/detail/getItemSkuInfo/1.0?param=${encodeURIComponent(JSON.stringify({ itemId }))}&_=${Date.now()}`;
        let resp = await fetch(url, { credentials: 'include' });
        let data = await resp.json();
        return data.result ? data.result.skuInfos : [];
    }

    // 加入购物车
    async function addToCart({ itemId, skuId }) {
        let param = {
            itemId: itemId,
            source: "h5",
            skuId: skuId,
            count: 1,
            payType: 1
        };
        let url = `https://thor.weidian.com/vcart/addCart/2.0?param=${encodeURIComponent(JSON.stringify(param))}&_=${Date.now()}`;
        let resp = await fetch(url, { credentials: 'include' });
        let data = await resp.json();
        return data;
    }

    function createButton() {
        if (document.getElementById('addAllSkuBtn')) return; // 防止重复插入
        const btn = document.createElement('button');
        btn.id = 'addAllSkuBtn';
        btn.innerText = '一键加购';
        btn.style.position = 'fixed';
        btn.style.top = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = 9999;
        btn.style.padding = '10px 20px';
        btn.style.background = '#ff6600';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.onclick = addAllToCart;
        document.body.appendChild(btn);
    }

    // 随机选一个元素
    function randomPick(arr) {
        // 过滤出有库存的商品
        arr = arr.filter(item => item.skuInfo.stock > 0);
        if (arr.length === 0) {
            console.warn('没有可用的有库存SKU');
            return null;
        }
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function showLoading() {
        if (document.getElementById('addAllSkuLoading')) return;
        const loading = document.createElement('div');
        loading.id = 'addAllSkuLoading';
        loading.innerText = '正在加购...';
        loading.style.position = 'fixed';
        loading.style.top = '60px';
        loading.style.right = '20px';
        loading.style.zIndex = 10000;
        loading.style.padding = '10px 20px';
        loading.style.background = 'rgba(0,0,0,0.7)';
        loading.style.color = '#fff';
        loading.style.borderRadius = '5px';
        loading.style.fontSize = '16px';
        loading.style.display = 'flex';
        loading.style.alignItems = 'center';
        // 简单动画
        const dot = document.createElement('span');
        dot.id = 'addAllSkuLoadingDot';
        dot.innerText = '';
        loading.appendChild(dot);
        document.body.appendChild(loading);
        let count = 0;
        loading._interval = setInterval(() => {
            count = (count + 1) % 4;
            dot.innerText = '.'.repeat(count);
        }, 400);
    }

    function hideLoading() {
        const loading = document.getElementById('addAllSkuLoading');
        if (loading) {
            clearInterval(loading._interval);
            loading.remove();
        }
    }

    async function addAllToCart() {
        showLoading();
        let items = document.querySelectorAll('.link-area');
        let itemIds = [];
        items.forEach(item => {
            // 从href中提取itemId
            let href = item.getAttribute('href');
            if (href) {
                let match = href.match(/itemID=(\d+)/);
                if (match && match[1]) {
                    itemIds.push(match[1]);
                }
            }
            // 从data-spider-action-args中提取itemId
            let spiderArgs = item.getAttribute('data-spider-action-args');
            if (spiderArgs) {
                try {
                    let args = JSON.parse(spiderArgs);
                    if (args.itemId) {
                        itemIds.push(args.itemId);
                    }
                } catch (e) {
                    console.error('解析data-spider-action-args失败:', e);
                }
            }
        });
        // 去重
        itemIds = [...new Set(itemIds)];
        // 过滤掉已处理过的ID
        let newItemIds = itemIds.filter(id => !addedItemIds.has(id));
        if (newItemIds.length === 0) {
            alert('没有新的商品需要查询SKU');
            return;
        }
        console.log('获取到商品个数', newItemIds.length);

        for (let itemId of newItemIds) {
            try {
                let skuInfos = await fetchSkuInfo(itemId);
                // 如果获取不到SKU信息，则加购默认SKU
                if (!skuInfos || skuInfos.length === 0) {
                    await addToCart({ itemId, skuId: 0 });
                    continue;
                }
                // 随机选一个SKU
                let randomSku = randomPick(skuInfos);
                if (!randomSku) {
                    console.warn(`商品${itemId}没有可用的有库存SKU`);
                    continue;
                }
                let skuId = randomSku.skuInfo.id;
                // 调用加购接口
                let result = await addToCart({ itemId, skuId });
            } catch (e) {
                console.error(`商品${itemId}加购失败:`, e);
            }
        }
        // 记录已处理
        newItemIds.forEach(id => addedItemIds.add(id));
        hideLoading();
        // 新增：加购完毕后提醒
        alert('全部商品已加购完毕！');
    }

    // 每2秒检查一次按钮是否存在
    setInterval(createButton, 2000);
})();
