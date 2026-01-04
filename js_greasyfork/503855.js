// ==UserScript==
// @name         闲鱼管家上货助手
// @namespace    http://tampermonkey.net/
// @version      1.26.12
// @description  在商品页面复制商品信息并在闲鱼管家后台上架页面插入“一键填充”按钮，添加下载商品详情图片的功能。包括选品功能，可在闲鱼商详页导出猜你喜欢的数据到Excel，支持动态数据
// @author       阿阅 wx：pangyue2    mail:pang-yue@qq.com
// @match        https://goofish.pro/*
// @match        https://www.goofish.pro/*
// @match        https://h5.m.goofish.com/item?id=*
// @match        https://www.goofish.com/item*
// @match        https://www.goofish.com/search*
// @match        https://www.goofish.com/personal*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=goofish.pro
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @require      https://registry.npmmirror.com/sweetalert2/11.22.5/files/dist/sweetalert2.min.js
// @require      https://registry.npmmirror.com/xlsx/0.18.5/files/dist/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503855/%E9%97%B2%E9%B1%BC%E7%AE%A1%E5%AE%B6%E4%B8%8A%E8%B4%A7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/503855/%E9%97%B2%E9%B1%BC%E7%AE%A1%E5%AE%B6%E4%B8%8A%E8%B4%A7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 使用 unsafeWindow 访问原始 window 对象
    const unsafeWindow = window.unsafeWindow || window;

    // 全局数组，用于存储商品数据，确保全局数据存储在 window 对象上
    if (!window.collectedData) {
        window.collectedData = [];
    }
    if (!window.goodsInfo) {
        window.goodsInfo = {};
    }

    interceptRequests();

    function showToast(message, type = "success") {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: type,
            title: message,
            showConfirmButton: false,
            timer: 1500,
        });
    }

    function downloadImage(url, fileName) {
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `${fileName}.jpg`;
                a.click();
                URL.revokeObjectURL(a.href);
            })
            .catch((error) => console.error("图片下载失败:", error));
    }

    // 生成随机数
    function getRandomNumber(min, max) {
        const randomInt =
            Math.floor(Math.random() * (max / 10 - min / 10 + 1)) + min / 10;
        return randomInt * 10;
    }

    // 获取价格，适配不同格式，比如 1~10、10
    function getPrice(priceStr) {
        // 移除特殊字符 "¥" 和 "\n"
        const cleanedStr = priceStr.replace(/[¥\n]/g, "");

        // 使用正则表达式提取所有数字
        const numbers = cleanedStr.match(/\d+(\.\d+)?/g);

        if (numbers === null) {
            return null; // 如果没有匹配到数字，返回null
        }

        // 将提取出的字符串数字转换为浮点数
        const prices = numbers.map(Number);

        // 找出最大值
        const maxPrice = Math.max(...prices);

        return maxPrice;
    }


    function insertGoodsButton(imagesLength) {
        const button = document.createElement("button");

        button.innerHTML = `复制商品信息 & 下载图片（ <b> ${imagesLength} </b>）`;
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.left = "20px";
        button.style.zIndex = 1000;
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#28a745";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";

        document.body.appendChild(button);

        button.addEventListener("click", () => {
            copyGoods();
            downloadImages();
        });
    }

    // 复制商品信息
    function copyGoods() {
        const mainElement = document.querySelector('[class^="item-main-info--"]');
        const detailTextElement = mainElement.querySelector('[class^="desc--"]');
        const priceElement = mainElement.querySelector('[class^="price--"]');

        if (detailTextElement && priceElement) {
            const detailText = detailTextElement.innerText;
            const indexOfFirstNewLine = detailText.indexOf(" ");
            let productName, productDescription;

            if (indexOfFirstNewLine !== -1) {
                productName = detailText.slice(0, indexOfFirstNewLine).trim();
                productDescription = detailText.trim();
            } else {
                productName = detailText.trim();
                productDescription = "";
            }

            // 裁剪商品标题到30个中文字以内
            const maxTitleLength = 30;
            productName = productName.slice(0, maxTitleLength);

            const productPrice = getPrice(priceElement.innerText.trim());

            GM_setValue("productName", productName);
            // GM_setValue("productDescription", productDescription);
            GM_setValue("productPrice", productPrice);

            console.log("商品信息已存储");
            console.log("商品名:", productName);
            // console.log("商品详情:", productDescription);
            console.log("商品价格:", productPrice);

            showToast("商品信息已复制");
        } else {
            console.error("未找到商品详情或价格元素");
            showToast("未找到商品详情或价格元素", "error");
        }
    }

    // 下载商品图片
    function downloadImages() {
        // 获取所有 class 为 slick-slide 且不包含 slick-cloned 的 div 元素
        const goofishImageDivs = document.querySelectorAll(
            "div.slick-slide:not(.slick-cloned)"
        );

        // 遍历这些 div 元素，获取其中的 img 标签
        const goofishImages = Array.from(goofishImageDivs).map((div) =>
            div.querySelector("img")
        );

        // 过滤掉可能不存在 img 标签的 div
        const filteredGoofishImages = goofishImages.filter((img) => img !== null);

        filteredGoofishImages.forEach((img, index) => {
            setTimeout(() => {
                let src = img.src.replace(/_webp$/, ""); // 去掉_webp并下载jpg格式
                downloadImage(src, `${index + 1}`);
            }, index * 100); // 每个下载任务之间延迟100毫秒
        });
        showToast("图片正在开始");
    }

    // 闲鱼管家上架页面逻辑
    if (window.location.hostname.includes("goofish.pro")) {
        return;
        const button = document.createElement("button");
        button.innerText = "一键填充";
        button.style.position = "fixed";
        button.style.bottom = "10px";
        button.style.left = "150px";
        button.style.zIndex = 1000;
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#28a745";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";

        document.body.appendChild(button);

        button.addEventListener("click", () => {
            // 检查当前页面是否是商品添加页面
            if (!window.location.href.includes("/sale/product/add")) {
                window.location.href =
                    "https://goofish.pro/sale/product/add?from=%2Fon-sale";
                setTimeout(() => fillProductInfo(), 1500);
                return;
            } else {
                fillProductInfo();
            }
        });
    }

    function fillProductInfo() {
        // 从 Tampermonkey 存储中获取商品信息
        const productName = GM_getValue("productName", "");
        const productDescription = GM_getValue("productDescription", "") || productName;
        let prict = GM_getValue("productPrice");
        let productPrice = 100;
        if (prict < 2) {
            productPrice = 1.9;
        } else {
            productPrice = parseFloat(GM_getValue("productPrice", "100")) - 0.1;
        }

        if (!productName || !productDescription || isNaN(productPrice)) {
            showToast("请先去闲鱼详情页复制商品信息", "warning");
            return;
        }

        console.log("读取到的商品名:", productName);
        console.log("读取到的商品详情:", productDescription);
        console.log("读取到的商品价格:", productPrice);

        // 选择类目
        const categoryElements = document.querySelectorAll(".release-history");
        if (categoryElements.length > 0) {
            categoryElements[0].click();
        } else {
            console.error("未找到类目选择元素");
            showToast("未找到类目选择元素", "error");
        }

        setTimeout(() => {
            // 选择店铺
            const shopList = document.querySelectorAll("ul.auth-list li");
            if (shopList.length > 0) {
                shopList[0].click();
            } else {
                console.error("未找到目标店铺元素");
                showToast("未找到目标店铺元素", "error");
            }

            setTimeout(() => {
                // 填充商品名
                const inputElements = document.querySelectorAll(".el-input__inner");
                if (inputElements.length > 2) {
                    inputElements[2].value = productName;
                    const event = new Event("input", { bubbles: true });
                    inputElements[2].dispatchEvent(event);
                } else {
                    console.error("未找到商品标题输入框");
                    showToast("未找到商品标题输入框", "error");
                }

                // 填充商品详情
                const descriptionElements = document.querySelectorAll(
                    ".el-textarea__inner"
                );
                if (descriptionElements.length > 0) {
                    descriptionElements[0].value = productDescription;
                    const event = new Event("input", { bubbles: true });
                    descriptionElements[0].dispatchEvent(event);
                } else {
                    console.error("未找到商品描述输入框");
                    showToast("未找到商品描述输入框", "error");
                }

                // 填充价格
                if (inputElements.length > 5) {
                    inputElements[5].value = productPrice.toFixed(2);
                    const event = new Event("input", { bubbles: true });
                    inputElements[5].dispatchEvent(event);
                } else {
                    console.error("未找到价格输入框");
                    showToast("未找到价格输入框", "error");
                }

                //   // 填充原价
                //   if (inputElements.length > 5) {
                //     inputElements[5].value = getRandomNumber(200, 500);
                //     const event = new Event('input', { bubbles: true });
                //     inputElements[5].dispatchEvent(event);
                // } else {
                //     console.error('未找到价格输入框');
                //     showToast('未找到价格输入框', 'error');
                // }

                // 填充库存
                const productStore = 1;
                if (inputElements.length > 5) {
                    inputElements[6].value = productStore;
                    const event = new Event("input", { bubbles: true });
                    inputElements[6].dispatchEvent(event);
                } else {
                    console.error("未找到库存输入框");
                    showToast("未找到库存输入框", "error");
                }

                // 选择发布商品时机
                const radioElements = document.querySelectorAll(".el-radio");
                if (radioElements.length > 11) {
                    radioElements[11].click();
                } else {
                    console.error("未找到发布商品时机的单选框");
                    showToast("未找到发布商品时机的单选框", "error");
                }

                showToast("商品信息已填充");
            }, 500);
        }, 500);
    }

    // 拦截并处理接口请求
    function interceptRequests() {
        // 覆盖原生的 XMLHttpRequest
        const originalXHR = unsafeWindow.XMLHttpRequest;
        unsafeWindow.XMLHttpRequest = function () {
            const xhr = new originalXHR();

            // 保存原始的 open 方法
            const originalOpen = xhr.open;
            xhr.open = function (method, url, ...rest) {
                this._url = url; // 保存请求 URL
                return originalOpen.apply(this, [method, url, ...rest]);
            };

            // 保存原始的 send 方法
            const originalSend = xhr.send;
            xhr.send = function (...args) {
                this.addEventListener("load", function () {
                    // 拦截商品详情接口，获取详情文本内容
                    if (
                        this._url.includes(
                            "h5api.m.goofish.com/h5/mtop.taobao.idle.pc.detail"
                        )
                    ) {
                        try {
                            const data = JSON.parse(this.responseText);
                            console.log("接收到的数据:", data);
                            // window.goodsInfo = data.data.itemDO;
                            if (data?.data?.itemDO?.desc) {
                                let productDescription = data.data.itemDO.desc;
                                const goodsId = new URL(location.href).searchParams.get("id");
                                productDescription += `\n \n[钉子]发的是百 度 网 盘 链 接，永不失效，售出不退。
[钉子]任何情况，不要申请退款，私信沟通给你处理，小店经营不易。
[钉子]所有文件均获取自网络公开渠道，仅供学习和交流使用，所有版权归版权人所有，如版权方认为侵犯了您的版权，请及时联系小店删除。`;
                                productDescription += `\n${goodsId}`;
                                GM_setValue("productDescription", productDescription);
                                console.log("商品详情:", productDescription);

                                insertGoodsButton(data.data.itemDO.imageInfos.length);
                                showGoodsViewCount();
                            }
                        } catch (error) {
                            console.error("解析 XHR 响应时发生错误:", error);
                        }
                    }

                    // 拦截商品详情接口，获取详情文本内容
                    if (
                        this._url.includes(
                            "h5api.m.goofish.com/h5/mtop.taobao.idle.item.web.recommend.list"
                        )
                    ) {
                        try {
                            const data = JSON.parse(this.responseText);
                            console.log('接收到的数据:', data);

                            // 检查 data.data.cardList 是否为数组
                            if (data && Array.isArray(data.data?.cardList)) {
                                // 提取有效的数据
                                const tempData = data.data.cardList.filter((item) => {
                                    if (item && item.cardData && item.cardData.itemId) {
                                        const price = item.cardData.price;
                                        return price > 0;
                                    }
                                    return false;
                                });

                                // 合并到全局数组 window.collectedData
                                window.collectedData.push(...tempData);
                                console.log('新数据已追加:', data.data.cardList);

                                // 去重：使用一个 Set 来追踪已经存在的 itemId
                                const uniqueItems = [];
                                const itemIdSet = new Set();

                                // 遍历 window.collectedData，添加未重复的 item
                                for (const item of window.collectedData) {
                                    const itemId = item.cardData?.itemId;
                                    if (itemId && !itemIdSet.has(itemId)) {
                                        uniqueItems.push(item);
                                        itemIdSet.add(itemId);
                                    }
                                }

                                // 更新 window.collectedData 为去重后的结果
                                window.collectedData = uniqueItems;

                                console.log('去重后的数据:', window.collectedData);

                                insertDownloadButton('猜你喜欢', recommentGoodListToExcel);

                                // 更新数据计数
                                updateDataCount();
                            }
                        } catch (error) {
                            console.error("解析 XHR 响应时发生错误:", error);
                        }
                    }

                    // 拦截搜索接口
                    if (
                        this._url.includes(
                            "h5api.m.goofish.com/h5/mtop.taobao.idlemtopsearch.pc.search"
                        )
                    ) {
                        try {
                            const data = JSON.parse(this.responseText);
                            console.log('接收到的数据:', data);

                            // 检查 data.data.resultList 是否为数组
                            if (data && Array.isArray(data.data?.resultList)) {
                                // 提取有效的数据
                                const tempData = data.data.resultList.filter((item) => {
                                    if (item && item.data && item.data?.item?.main?.exContent?.itemId) {
                                        const price = item.data?.item?.main?.exContent?.detailParams?.soldPrice;
                                        return price > 0;
                                    }
                                    return false;
                                });

                                // 合并到全局数组 window.collectedData
                                window.collectedData.push(...tempData);
                                console.log('新数据已追加:', data.data.resultList);

                                // 去重：使用一个 Set 来追踪已经存在的 itemId
                                const uniqueItems = [];
                                const itemIdSet = new Set();

                                // 遍历 window.collectedData，添加未重复的 item
                                for (const item of window.collectedData) {
                                    const itemId = item.data?.item?.main?.exContent?.itemId;
                                    if (itemId && !itemIdSet.has(itemId)) {
                                        uniqueItems.push(item.data.item.main);
                                        itemIdSet.add(itemId);
                                    }
                                }

                                // 更新 window.collectedData 为去重后的结果
                                window.collectedData = uniqueItems;

                                console.log('去重后的数据:', window.collectedData);

                                insertDownloadButton('搜索结果', searchGoodListToExcel);

                                // 更新数据计数
                                updateDataCount();
                            }
                        } catch (error) {
                            console.error("解析 XHR 响应时发生错误:", error);
                        }
                    }

                    // 拦截店铺页面接口
                    if (
                        this._url.includes(
                            "h5api.m.goofish.com/h5/mtop.idle.web.xyh.item.list"
                        )
                    ) {
                        try {
                            const data = JSON.parse(this.responseText);
                            console.log('接收到的数据:', data);

                            // 检查 data.data.cardList 是否为数组
                            if (data && Array.isArray(data.data?.cardList)) {
                                // 提取有效的数据
                                const tempData = data.data.cardList.filter((item) => {
                                    if (item && item.cardData && item.cardData.id) {
                                        const price = item.cardData.priceInfo.price;
                                        return price > 0;
                                    }
                                    return false;
                                });

                                // 合并到全局数组 window.collectedData
                                console.log('已存在的数据:', window.collectedData)
                                window.collectedData.push(...tempData);
                                console.log('新数据已追加:', window.collectedData);

                                // 去重：使用一个 Set 来追踪已经存在的 itemId
                                const uniqueItems = [];
                                const itemIdSet = new Set();

                                // 遍历 window.collectedData，添加未重复的 item
                                for (const item of window.collectedData) {
                                    const itemId = item.cardData?.id;
                                    if (itemId && !itemIdSet.has(itemId)) {
                                        uniqueItems.push(item);
                                        itemIdSet.add(itemId);
                                    }
                                }

                                // 更新 window.collectedData 为去重后的结果
                                window.collectedData = uniqueItems;

                                console.log('去重后的数据:', window.collectedData);

                                const nickNameElement = document.querySelector('[class^="personalWrap--"]').querySelector('[class^="nick--"]');
                                const nickName = (nickNameElement ? nickNameElement.innerText : '').replace(/[:\/\\?\*\[\]]/g, '-');

                                insertDownloadButton(nickName + '店铺', storeGoodListToExcel);

                                // 更新数据计数
                                updateDataCount();
                            }
                        } catch (error) {
                            console.error("解析 XHR 响应时发生错误:", error);
                        }
                    }
                });
                return originalSend.apply(this, args);
            };

            return xhr;
        };
    }

    // 自动写入类目（暂定为电子资料）
    /* if (window.location.hostname.includes("goofish.pro")) {
        // 要写入的键
        const key = "goods_select";

        // 要写入的值（注意是一个字符串）
        const value = JSON.stringify([
            {
                name: "电子资料",
                id: [
                    99,
                    "eebfcb1cd9bfce8e212e21d79c0262e7",
                    "eebfcb1cd9bfce8e212e21d79c0262e7",
                    "3cdbae6d47df9251a7f7e02f36b0b49a",
                ],
                item_biz_type: 2,
            },
        ]);

        // 检查localStorage中是否已经存在该键
        if (!localStorage.getItem(key)) {
            // 将键值对写入localStorage
            localStorage.setItem(key, value);
            console.log(`已写入localStorage: ${key} = ${value}`);
        } else {
            console.log(
                `localStorage中已存在: ${key} = ${localStorage.getItem(key)}`
            );
        }
    }*/

    repleaceUrl();
    // 避免闲管家的域名混用，带www和不带www的，因为两者的cookie不同，导致登录状态是不共享的
    function repleaceUrl() {
        // 获取当前页面的 URL
        const currentUrl = window.location.href;

        // 判断是否是以 'https://www.goofish.pro/' 开头
        if (currentUrl.startsWith("https://www.goofish.pro/")) {
            // 使用正则表达式替换 'www.' 为 ''
            const newUrl = currentUrl.replace("https://www.", "https://");

            // 跳转到新的 URL
            window.location.replace(newUrl);
        }
    }

    function showGoodsViewCount() {
        setTimeout(() => {
            const spanElement = document.querySelector('[class^="item-main-info--"]').querySelector('[class^="want--"]');

            if (spanElement) {
                const textContent = spanElement.textContent.trim();

                // 初始化变量
                let wantText = "0人想要";
                let viewText = "0浏览";

                // 检查字符串内容并进行拆分和处理
                if (textContent.includes("人想要") && textContent.includes("浏览")) {
                    // 如果同时包含 "人想要" 和 "浏览"
                    [wantText, viewText] = textContent.split(" ");
                } else if (textContent.includes("浏览")) {
                    // 只有 "浏览"
                    viewText = textContent;
                }

                // 提取数字部分并转换为整数
                const wantNumber =
                      parseInt(wantText.replace("人想要", "").trim(), 10) || 0;
                const viewNumber =
                      parseInt(viewText.replace("浏览", "").trim(), 10) || 0;

                let rate = 0;
                if (wantNumber != 0 || viewNumber != 0) {
                    rate = wantNumber / viewNumber;
                }
                const conversionRate = (rate * 100).toFixed(0);
                const conversionRateText = conversionRate + "%";

                const statsDiv = document.createElement("div");
                statsDiv.style.position = "fixed";
                statsDiv.style.bottom = "63px";
                statsDiv.style.left = "20px";
                statsDiv.style.backgroundColor = "#93ab9b";
                statsDiv.style.borderRadius = "6px";
                statsDiv.style.color = "white";
                statsDiv.style.padding = "10px";
                statsDiv.style.zIndex = "1000";
                statsDiv.style.fontSize = "14px";

                const conversionRateSpan = document.createElement("b");
                conversionRateSpan.textContent = conversionRateText;
                conversionRateSpan.style.backgroundColor =
                    conversionRate > 7 ? "green" : "red";
                statsDiv.style.backgroundColor =
                    conversionRate > 7 ? "#93ab9b" : "rgb(211 131 131)";

                conversionRateSpan.style.padding = "2px 4px";
                conversionRateSpan.setAttribute("id", "conversion-rate");

                statsDiv.innerHTML = `
想要数 : <b id="want-num">${wantNumber}</b><br>
浏览量 : <b id="view-num">${viewNumber}</b><br>
转化率 : `;
                statsDiv.appendChild(conversionRateSpan);

                document.body.appendChild(statsDiv);

                if (conversionRate < 7) {
                    console.log(`转化率太低了 ${conversionRate}%`);
                }
            } else {
                console.error("无法找到目标 span 元素");
            }
        }, 1000);
    }

    // 更新商品数量显示
    function updateDataCount() {
        console.log('length:', window.collectedData.length)
        const countElement = document.getElementById('data-count');
        if (countElement) {
            countElement.innerText = window.collectedData.length;
        }
    }

    function insertDownloadButton(title, goodsListToExcel) {
        const exportButton = document.getElementById('data-count-button');
        if (exportButton){
            return;
        }
        const button = document.createElement('button');
        button.setAttribute('id', 'data-count-button');
        button.innerHTML = `导出 [${title}] 商品 (<b id="data-count">0</b>)`;
        button.style.position = 'fixed';
        button.style.width = '240px';
        button.style.left = '50%';
        button.style.marginLeft = '-120px';
        button.style.bottom = '20px';
        button.style.zIndex = 9999;
        button.style.padding = '10px 20px';
        button.style.backgroundColor = 'rgb(40, 167, 69)';
        button.style.color = '#FFFFFF';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', function() {
            downloadExcel(title, goodsListToExcel)
        });
        document.body.appendChild(button);
    }

    // 时间戳转换成日期格式
    function timestampToFormattedDate(timestamp) {
        if (!timestamp) return "";
        var date = new Date(parseInt(timestamp));
        var year = date.getFullYear(); // 获取年份
        var month = date.getMonth() + 1; // 获取月份，月份是从0开始的，所以需要加1
        var day = date.getDate(); // 获取日期

        // 月份和日期如果是单数，需要在前面补0
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`;
    }

    // 下载Excel文件
    function downloadExcel(title, goodsListToExcel) {
        const worksheetData = goodsListToExcel();
        if (worksheetData.length === 0) {
            alert('没有数据可导出');
            return;
        }

        // 创建Excel工作簿
        const workbook = XLSX.utils.book_new();

        // 将数据转化为工作表
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, title);

        // 生成Excel并触发下载
        const workbookOut = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([workbookOut], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = title + '商品.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function recommentGoodListToExcel() {
        return window.collectedData.map((item) => {
            return {
                链接: {
                    f: `HYPERLINK("https://www.goofish.com/item?id=${item.cardData.itemId}", "https://www.goofish.com/item?id=${item.cardData.itemId}")`
                },
                标题: {
                    f: `HYPERLINK("https://www.goofish.com/item?id=${item.cardData.itemId}", "${item.cardData.title}")`
                },
                想要数: parseInt(item.cardData.clickParam.args.wantNum, 10) || '',
                价格: item.cardData.price || '',
                城市: item.cardData.area || '',
                发布日期: timestampToFormattedDate(item.cardData?.clickParam?.args?.publishTime)
            }
        }).sort((a, b) => b.想要数 - a.想要数);
    }

    function searchGoodListToExcel() {
        return window.collectedData.map((item) => {
            const itemId = item.exContent.itemId
            const title = item.exContent.title.substr(0,30)

            const r3Tags = item.exContent.fishTags.r3?.tagList || [];
            // 查找包含 "人想要" 的标签
            const wantTag = r3Tags.find(tag => tag?.data?.content?.includes("人想要"));
            // 提取数字
            let wantCount = '';
            if (wantTag) {
                const match = wantTag.data.content.match(/(\d+)/);
                if (match) {
                    wantCount = parseInt(match[1], 10);
                }
            }
            return {
                链接: {
                    f: `HYPERLINK("https://www.goofish.com/item?id=${itemId}", "https://www.goofish.com/item?id=${itemId}")`
                },
                标题: {
                    f: `HYPERLINK("https://www.goofish.com/item?id=${itemId}", "${title}")`
                },
                想要数: wantCount,
                价格: item.exContent.detailParams.soldPrice || '',
                城市: item.exContent.area || '',
                发布日期: timestampToFormattedDate(item.clickParam?.args?.publishTime)
            }
        }).sort((a, b) => b.想要数 - a.想要数);
    }


    function storeGoodListToExcel() {
        return window.collectedData.map((item) => {
            const itemId = item.cardData.id;
            const title = item.cardData.title.substr(0,30);

            const r3Tags = item.cardData?.itemLabelDataVO?.labelData?.r3?.tagList || [];
            // 查找包含 "人想要" 的标签
            const wantTag = r3Tags.find(tag => tag?.data?.content?.includes("人想要"));
            // 提取数字
            let wantCount = '';
            if (wantTag) {
                const match = wantTag.data.content.match(/(\d+)/);
                if (match) {
                    wantCount = parseInt(match[1], 10);
                }
            }

            return {
                链接: {
                    f: `HYPERLINK("https://www.goofish.com/item?id=${itemId}", "https://www.goofish.com/item?id=${itemId}")`
                },
                标题: {
                    f: `HYPERLINK("https://www.goofish.com/item?id=${itemId}", "${title}")`
                },
                想要数: wantCount,
                价格: item.cardData.priceInfo.price || '',
                城市: '',
                发布日期: ''
            }
        }).sort((a, b) => b.想要数 - a.想要数);
    }
})();
