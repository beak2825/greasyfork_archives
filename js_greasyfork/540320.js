// ==UserScript==
// @name         微店购物车自动下单 V:ditianbrother
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  承接脚本定制开发 V:ditianbrother
// @author       ditianbrother
// @match        https://*weidian.com/new-cart/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540320/%E5%BE%AE%E5%BA%97%E8%B4%AD%E7%89%A9%E8%BD%A6%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95%20V%3Aditianbrother.user.js
// @updateURL https://update.greasyfork.org/scripts/540320/%E5%BE%AE%E5%BA%97%E8%B4%AD%E7%89%A9%E8%BD%A6%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95%20V%3Aditianbrother.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 获取收货地址列表
    async function getAddressList() {
        const url = 'https://thor.weidian.com/address/buyerGetAddressList/1.0';
        const params = {
            buyer_address_id: "",
            page_num: 0,
            page_size: 50,
            shop_id: ""
        };

        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'accept': 'application/json, */*',
                'accept-language': 'zh-CN,zh;q=0.9',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'referer': 'https://weidian.com/'
            },
            body: "param=" + encodeURIComponent(JSON.stringify(params))
        });

        const data = await res.json();
        console.log('获取到的地址列表:', data);
        return data;
    }

    // 获取默认地址或第一个地址
    async function getDefaultAddress() {
        const addressData = await getAddressList();
        if (addressData.status.code === 0 && addressData.result && addressData.result.length > 0) {
            // 先找默认地址
            let address = addressData.result.find(addr => addr.isDefault === 1);
            // 如果没有默认地址，就用第一个
            if (!address) {
                address = addressData.result[0];
            }
            return address;
        }
        return null;
    }

    // 获取指定 cookie
    function getCookie(name) {
        const value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return value ? value.pop() : '';
    }

    async function clickMyBtn() {
        showLoading();

        // 1. 获取店铺名称、下单数量的元素
        const shopNamesTextarea = document.getElementById('my-shop-names-textarea');
        const countInput = document.getElementById('my-count-input');

        if (!shopNamesTextarea || !countInput) {
            console.error('找不到必要的输入框元素！');
            hideLoading();
            alert('自动下单失败：找不到输入框！');
            return;
        }

        // 2. 获取文本区域和输入框的值
        const shopName = shopNamesTextarea.value.trim();
        const totalCount = parseInt(countInput.value, 10); // 获取下单数量

        // 校验店铺名称
        if (!shopName) {
            alert('请输入店铺名称！');
            hideLoading();
            return;
        }

        // 验证输入值
        if (isNaN(totalCount) || totalCount <= 0 || totalCount >= 50) {
            alert('请输入有效的下单数量 (大于0且小于50的数字)！');
            hideLoading();
            return;
        }

        console.log('获取到的店铺名称:', shopName);
        console.log('下单数量:', totalCount);

        // 获取待下单订单
        const allItems = await parseAllItemsFromPage();
        console.log('获取到的待下单商品:', allItems);

        //找到输入的店铺的商品
        let inputShopItems = allItems.filter(item => item.shopName === shopName);
        console.log('找到的输入的店铺的商品:', inputShopItems);

        //没有报错
        if (inputShopItems.length === 0) {
            alert('没有找到输入的店铺的商品！');
            hideLoading();
            return;
        }

        //切割商品
        inputShopItems = inputShopItems.slice(0, totalCount);
        console.log('切割后的商品的items:', inputShopItems);

        // 组装下单参数
        const itemList = inputShopItems.map(item => {
            const oriPrice = (parseFloat(item.oriPrice) || 0).toFixed(2);
            const price = (parseFloat(item.price) || 0).toFixed(2);
            return {
                item_id: item.itemId,
                quantity: item.count,
                item_sku_id: item.skuId,
                ori_price: oriPrice,
                price: price,
                extend: item.ext || {},
                price_type: item.priceType,
                discount_list: item.discountList || [],
                item_convey_info: {}
            };
        });

        const shopId = inputShopItems[0].shopId;

        // 获取收货地址
        const address = await getDefaultAddress();
        if (!address) {
            alert('获取收货地址失败！');
            hideLoading();
            return;
        }

        // 获取cookie中的uid
        const buyer_id = getCookie('uid');
        const buyerInfo = {
            buyer_id: buyer_id,
            eat_in_table_name: "",
            address_id: address.id,     // 使用获取到的地址ID
            agreement_type_list: [5]
        };

        // shop_list中的ori_price和price也保证为字符串且两位小数
        const shopOriPrice = itemList.reduce((sum, item) => sum + parseFloat(item.ori_price), 0).toFixed(2);
        const shopPrice = itemList.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
        // 发起下单
        const orderResult = await createOrder(shopId, itemList, buyerInfo, shopPrice, shopOriPrice);
        console.log('下单结果:', orderResult);

        hideLoading();
        alert('自动下单成功！');
    }

    function showLoading() {
        if (document.getElementById('myLoading')) return;
        const loading = document.createElement('div');
        loading.id = 'myLoading';
        loading.innerText = '正在自动下单...';
        loading.style.position = 'fixed';
        loading.style.top = '50%'; // 垂直居中
        loading.style.left = '50%'; // 水平居中
        loading.style.transform = 'translate(-50%, -50%)'; // 微调位置使其完全居中
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
        const loading = document.getElementById('myLoading');
        if (loading) {
            clearInterval(loading._interval);
            loading.remove();
        }
    }

    // 切换元素的显示/隐藏状态
    function toggleElementsVisibility() {
        const autoEvaluateBtn = document.getElementById('my-btn');
        const shopNamesTextarea = document.getElementById('my-shop-names-textarea');
        const countInput = document.getElementById('my-count-input');
        const toggleBtn = document.getElementById('my-toggle-btn');

        if (!autoEvaluateBtn || !shopNamesTextarea || !toggleBtn || !countInput) {
            return;
        }

        const isHidden = autoEvaluateBtn.style.display === 'none';

        const displayStyle = isHidden ? '' : 'none';
        autoEvaluateBtn.style.display = displayStyle;
        shopNamesTextarea.style.display = displayStyle;
        countInput.style.display = displayStyle;

        toggleBtn.innerText = isHidden ? '隐藏' : '显示';
    }

    // 创建按钮和输入框
    function createButton() {
        if (document.getElementById('my-btn')) return; // 防止重复插入

        // 创建自动下单按钮
        const btn = document.createElement('button');
        btn.id = 'my-btn';
        btn.innerText = '自动下单';
        btn.style.position = 'fixed';
        btn.style.top = '70px'; // 调整位置，在显示/隐藏按钮下方
        btn.style.left = 'calc(100vw - 200px)'; // 距离右侧200px，实现左对齐
        btn.style.zIndex = 9999;
        btn.style.padding = '10px 20px';
        btn.style.background = '#ff6600';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.onclick = clickMyBtn;
        document.body.appendChild(btn);

        // 创建店铺名称输入框
        const input = document.createElement('input');
        input.id = 'my-shop-names-textarea';
        input.placeholder = '请输入店铺名称';
        input.value = '手工坊';
        input.style.position = 'fixed';
        input.style.top = '110px'; // 放在自动下单按钮下方
        input.style.left = 'calc(100vw - 200px)'; // 与自动下单按钮左对齐
        input.style.zIndex = 9999;
        input.style.padding = '10px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '5px';
        input.style.width = '150px';
        input.style.marginTop = '10px';
        document.body.appendChild(input);

        // 创建下单数量输入框
        const countInput = document.createElement('input');
        countInput.id = 'my-count-input';
        countInput.type = 'number';
        countInput.placeholder = '下单数量';
        countInput.value = '49';
        countInput.style.position = 'fixed';
        countInput.style.top = '170px'; // 调整位置
        countInput.style.left = 'calc(100vw - 200px)';
        countInput.style.zIndex = 9999;
        countInput.style.padding = '10px';
        countInput.style.border = '1px solid #ccc';
        countInput.style.borderRadius = '5px';
        countInput.style.width = '150px';
        document.body.appendChild(countInput);

        // 创建显示/隐藏切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'my-toggle-btn';
        toggleBtn.innerText = '显示';
        toggleBtn.style.position = 'fixed';
        toggleBtn.style.top = '20px';
        toggleBtn.style.right = '20px';
        toggleBtn.style.zIndex = 9999;
        toggleBtn.style.padding = '10px 10px';
        toggleBtn.style.background = '#555';
        toggleBtn.style.color = '#fff';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '5px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.onclick = toggleElementsVisibility;
        document.body.appendChild(toggleBtn);

        // 初始时隐藏元素 (除了切换按钮本身)
        toggleElementsVisibility();
    }

    // 每2秒检查一次按钮和输入框是否存在
    setInterval(createButton, 2000);

    // 解析当前网页所有商品信息的方法（新版，解析JSON数据）
    async function parseAllItemsFromPage() {
        try {
            // 1. 获取购物车页面 HTML
            const res = await fetch('https://weidian.com/new-cart/index.php?pageName=shop_mine_cart&spider_token=e56a', {
                credentials: 'include',
                headers: {
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'accept-language': 'zh-CN,zh;q=0.9',
                    'cache-control': 'max-age=0',
                    'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'document',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-user': '?1',
                    'upgrade-insecure-requests': '1'
                }
            });
            const html = await res.text();

            // 2. 创建一个 DOM 解析器
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 3. 获取包含购物车数据的script标签
            const scriptEl = doc.querySelector('script#__rocker-render-inject__');
            if (!scriptEl) {
                console.error('找不到购物车数据script标签');
                return [];
            }

            // 4. 解析data-obj属性中的JSON数据
            const dataObj = scriptEl.getAttribute('data-obj');
            if (!dataObj) {
                console.error('找不到购物车JSON数据');
                return [];
            }

            // 5. 安全地解析JSON数据
            let cartData;
            try {
                // 先尝试直接解析
                cartData = JSON.parse(dataObj);
            } catch (e) {
                try {
                    // 如果直接解析失败，尝试先解码再解析
                    cartData = JSON.parse(decodeURIComponent(dataObj));
                } catch (e2) {
                    try {
                        // 如果还是失败，尝试替换掉特殊字符再解析
                        const cleanData = dataObj.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
                        cartData = JSON.parse(cleanData);
                    } catch (e3) {
                        console.error('JSON解析失败，原始数据:', dataObj);
                        throw new Error('无法解析购物车数据');
                    }
                }
            }

            console.log('解析到的购物车数据:', cartData);

            // 6. 提取商品信息
            const allItems = [];
            const shops = cartData.cart?.result?.shops || [];

            shops.forEach(shop => {
                const shopName = shop.shopName;
                const shopId = shop.shopId;  // 获取店铺ID
                shop.partitions?.forEach(partition => {
                    partition.itemList?.forEach(item => {
                        if (item) {
                            allItems.push({
                                // 店铺信息
                                shopName,
                                shopId,

                                // 商品基本信息
                                itemId: item.itemId,
                                itemName: item.itemName,
                                skuId: item.skuId || '',  // SKU ID
                                skuName: item.skuName,

                                // 价格信息
                                price: item.price,
                                oriPrice: item.oriPrice || item.price,  // 原价

                                // 图片
                                img: item.itemImg,

                                // 数量相关
                                count: item.count || 1,
                                stock: item.stock,
                                limitCount: item.limitCount,

                                // 状态信息
                                status: item.status,
                                canOrder: item.canOrder,

                                // 其他可能用到的信息
                                attribute: item.attribute,
                                payType: item.payType || 1,
                                priceType: item.priceType || 0,

                                // 扩展信息
                                ext: item.ext || {},

                                // 优惠信息
                                discountList: item.discountList || item.discount_list || [],

                                // 原始数据，以防后面需要用到其他字段
                                rawData: item
                            });
                        }
                    });
                });
            });

            console.log('解析到的商品列表:', allItems);
            return allItems;
        } catch (error) {
            console.error('解析购物车数据失败:', error);
            // 如果解析失败，打印更多调试信息
            console.log('HTML内容:', html?.substring(0, 1000));
            return [];
        }
    }

    // 下单接口请求
    /**
     * 下单接口
     * @param {string} shopId
     * @param {Array} itemList
     * @param {Object} buyerInfo
     * @param {string|number} totalPrice
     * @param {Object} options 可选扩展参数: {source_id, q_pv_id, context, udc}
     */
    async function createOrder(shopId, itemList, buyerInfo, totalPrice, totalOriPrice, options = {}) {
        const url = 'https://thor.weidian.com/vbuy/CreateOrder/1.0';
        const params = {
            channel: "bjh5",
            source_id: options.source_id || "6df14f35dae7e6e49e1a944cd2ad4adf",
            q_pv_id: options.q_pv_id || "133200000196e8c1aac20a20669d6030",
            biz_type: 1,
            buyer: buyerInfo,
            shop_list: [
                {
                    shop_id: shopId,
                    f_shop_id: "",
                    sup_id: "",
                    item_list: itemList,
                    order_type: 3,
                    ori_price: totalOriPrice,
                    price: totalPrice,
                    express_fee: "0.00",
                    express_type: 4,
                    discount_list: [],
                    invalid_item_list: []
                }
            ],
            deliver_type: 0,
            is_no_ship_addr: 0,
            total_pay_price: totalPrice,
            total_vjifen: "",
            wfr: "c",
            appid: "",
            discount_list: [],
            invalid_shop_list: [],
            pay_type: 0
        };

        // context 和 udc 字段
        const contextObj = options.context || {
            shopping_center: shopId,
            subChannel: "browser",
            thirdSubchannel: "chrome"
        };
        const udcStr = options.udc || "";

        // 拼接body
        const body =
            "param=" + encodeURIComponent(JSON.stringify(params)) +
            "&context=" + encodeURIComponent(JSON.stringify(contextObj)) +
            (udcStr ? ("&udc=" + udcStr) : "");

        try {
            const res = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'accept': 'application/json, */*',
                    'accept-language': 'zh-CN,zh;q=0.9',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'referer': 'https://weidian.com/'
                },
                body
            });

            const data = await res.json();
            return data;
        } catch (error) {
            console.error('下单请求失败:', error);
            throw error;
        }
    }

})();
