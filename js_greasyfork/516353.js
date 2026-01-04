// ==UserScript==
// @name         京东JD商品item信息提取
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  在PC端的京东商品详情页，一键复制店铺Id、店铺名称、SKUId、SKU标题、产品归属类目等信息
// @author       .XX的青春  Wechat:gz08091011
// @match        https://item.jd.com/*.html*
// @match        https://item.m.jd.com/product/*.html*
// @icon         https://www.jd.com/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      Copyright .XX的青春  Wechat:gz08091011
// @downloadURL https://update.greasyfork.org/scripts/516353/%E4%BA%AC%E4%B8%9CJD%E5%95%86%E5%93%81item%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/516353/%E4%BA%AC%E4%B8%9CJD%E5%95%86%E5%93%81item%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.clear();
    const isMobile = /AndroId|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    var catName = "",venderId = "",shopId = "",shopName = "",mainSkuId = "",skuIdGroup = "",spuName = "",outPutText = "",reportSkuId = "",reportSkuName = "",reportFull = "";
    var imageUrls = [];
 
    // 检查是否已经存在设置，如果没有则初始化
    let customText = GM_getValue('customText', '#');
    let separator = customText;
 
    // 创建弹出设置界面的函数
    function showSettings() {
        const settingsDiv = document.createElement('div');
        settingsDiv.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background-color: #d9eeee; border: 10px solid #ccc; padding: 20px;
        z-index: 9999; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    `;
 
        const hint = document.createElement('p');
        hint.textContent = '设置复制结果参数间分隔符';
        hint.style.cssText = 'color: #000; font-size: 14px; margin-bottom: 10px;';
        settingsDiv.appendChild(hint);
 
        const input = document.createElement('input');
        input.value = customText;
        input.style.cssText = `
        width: 200px; padding: 8px; border: 1px solid #ccc;
        border-radius: 5px; font-size: 14px;
    `;
        settingsDiv.appendChild(input);
 
        const dynamicHint = document.createElement('p');
        dynamicHint.textContent = `复制内容为：\n商家ID${separator}店铺名${separator}skuid${separator}商品名${separator}spuId${separator}所属类别`;
        dynamicHint.style.cssText = 'color: #000; font-size: 14px; margin-top: 10px;';
        settingsDiv.appendChild(dynamicHint);
 
        function updateDynamicHint() {
            const newSeparator = input.value;
            dynamicHint.textContent = `复制内容为：\n商家ID${newSeparator}店铺名${newSeparator}skuid${newSeparator}商品名${newSeparator}spuId${newSeparator}所属类别`;
        }
 
        input.addEventListener('input', updateDynamicHint);
 
        // 按钮样式
        const buttonStyle = `
        border: none; padding: 10px 15px; border-radius: 5px; margin: 5px; cursor: pointer;
    `;
 
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.style.cssText = `background-color: #4CAF50; color: white; ${buttonStyle}`;
        saveButton.addEventListener('click', () => {
            customText = input.value;
            GM_setValue('customText', customText);
            separator = customText;
            updateDynamicHint();
            settingsDiv.remove();
        });
        settingsDiv.appendChild(saveButton);
 
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.cssText = `background-color: #f44336; color: white; ${buttonStyle}`;
        closeButton.addEventListener('click', () => settingsDiv.remove());
        settingsDiv.appendChild(closeButton);
 
        document.body.appendChild(settingsDiv);
    }
 
    // 注册菜单设置项
    GM_registerMenuCommand('自定义复制分隔符', showSettings);
 
    if (isMobile) {
        try {
            const skuJson = window._itemInfo;
            shopName = skuJson.stock.D.shopName;
            reportSkuId = skuJson.item.skuId;
            reportSkuName = skuJson.skuChooseArr;
            spuName = skuJson.item.skuName.replace(reportSkuName, "");
            catName = skuJson.product.category;
 
            skuJson.item.ColorSize.forEach(item => {
                outPutText += `${skuJson.item.venderId}${separator}${shopName}${separator}${item.skuId}${separator}${spuName}${separator}${item.color}${separator}${skuJson.product.productId}${separator}${catName}\n`;
                skuIdGroup += `${item.skuId}\r\n`;
            });
 
            if (!skuJson.item.ColorSize.length) {
                outPutText += `${skuJson.item.venderId}${separator}${shopName}${separator}${skuJson.product.skuId}${separator}${skuJson.item.skuName}${separator}${skuJson.product.productId}${separator}${catName}\n`;
                skuIdGroup += `${skuJson.product.skuId}\r\n`;
            }
            toolBar();
        } catch (e) {
            console.log("解析商品信息失败~");
        }
    } else {
        shopName = $("div .name a")[0].innerText;
        try {
            const skuJson = JSON.parse(JSON.stringify(pageConfig));
            const skuLength = skuJson.product.colorSize.length;
            catName = skuJson.product.catName.join(">");
            shopId = skuJson.product.shopId;
            venderId = skuJson.product.venderId;
            reportSkuId = skuJson.product.skuid;
            reportSkuName = skuJson.product.name;
            mainSkuId = skuJson.product.mainSkuId;
            reportFull = `${venderId}${separator}${shopName}${separator}${reportSkuId}${separator}${reportSkuName}${separator}${mainSkuId}${separator}${catName}`;
            imageUrls = skuJson.product.imageList.map(url => 'http://img30.360buyimg.com/imgzone/' + url);
 
 
            if (skuLength > 0) {
                spuName = findAndExtractLast(skuJson.product.name, " ");
                skuJson.product.colorSize.forEach(item => {
                    const color = item[Object.keys(item)[1]];
                    outPutText += `${venderId}${separator}${shopName}${separator}${item.skuId}${separator}${spuName} ${color}${separator}${mainSkuId}${separator}${catName}\n`;
                    skuIdGroup += `${item.skuId}\n`;
                });
            } else {
                outPutText += `${reportFull}\n`;
                skuIdGroup += `${reportSkuId}\n`;
            }
            toolBar();
        } catch (e) {
            console.log("解析商品信息失败！");
        }
    }
 
    function toolBar() {
        // 创建工具栏容器
        const toolbar = document.createElement('div');
        toolbar.style.cssText = 'background-color: #ecf2ff; padding: 5px; display: flex; position: relative;';
 
        function createSubMenu(buttons) {
            const submenu = document.createElement('div');
            submenu.style.cssText = 'position: absolute; top: 100%; left: 0; background-color: #ecf2ff; display: none; flex-direction: column; border: 1px solid #ccc; z-index: 9999;';
            buttons.forEach(({ text, id, title, action, specialColor }) => {
                const button = document.createElement('div');
                button.textContent = text;
                button.style.cssText = `cursor: pointer; padding: 5px 10px; background-color: #ecf2ff; color: ${specialColor || '#000'}; font-size: 12px; font-weight: bold; white-space: nowrap;`;
                button.id = id;
                button.title = title;
                button.addEventListener('mouseover', () => {
                    button.style.cssText += 'border-radius: 10px; background-color: #aabbf2; color: #fff;';
                });
                button.addEventListener('mouseout', () => {
                    button.style.cssText += `border-radius: 0; background-color: #ecf2ff; color: ${specialColor || '#000'};`;
                });
                button.addEventListener('click', () => {
                    if (action) {
                        if (typeof action === 'function') {
                            action();
                        } else {
                            copyToClip(action);
                            showTip("复制成功!", event.target);
                        }
                    } else {
                        alert('获取信息失败，请刷新网页后重试！');
                    }
                });
                submenu.appendChild(button);
            });
            return submenu;
        }
 
        function createMenuButton(text, submenu) {
            const menuButton = document.createElement('div');
            menuButton.textContent = text;
            menuButton.style.cssText = 'cursor: pointer; padding: 5px 10px; background-color: #ecf2ff; color: #000; font-size: 12px; font-weight: bold; position: relative;';
            menuButton.addEventListener('mouseover', () => submenu.style.display = 'flex');
            menuButton.addEventListener('mouseout', () => submenu.style.display = 'none');
            menuButton.appendChild(submenu);
            return menuButton;
        }
 
        const storeInfoSubMenu = createSubMenu([
            { text: '店铺 Id', id: 'button1', title: '复制店铺 Id', action: shopId },
            { text: '商家Id', id: 'button2', title: '复制商家 Id', action: venderId },
            { text: '店铺名', id: 'button3', title: '复制店铺名称', action: shopName }
        ]);
        const skuInfoSubMenu = createSubMenu([
            { text: 'SkuId', id: 'button4', title: '复制当前SkuId', action: reportSkuId },
            { text: '商品名', id: 'button5', title: '复制商品名称', action: reportSkuName },
            { text: '所有SkuId', id: 'button6', title: '复制该商品全部 SkuId', action: skuIdGroup },
            { text: 'Sku全信息', id: 'button8', title: '复制当前Sku完整信息', action: reportFull, specialColor: '#fa2c19' }
        ]);
        const spuInfoSubMenu = createSubMenu([
            { text: 'spuId', id: 'button9', title: '复制商品spuId', action: mainSkuId },
            { text: 'SPU 信息', id: 'button7', title: '复制该商品完整 SPU 信息', action: outPutText }
        ]);
        const mainImageSubMenu = createSubMenu([
            { text: '复制主图Url', id: 'downloadMainImage', title: '复制所有主图链接', action: imageUrls.join('\n') }
        ]);
 
        const feedbackButton = document.createElement('div');
        feedbackButton.textContent = '工具反馈';
        feedbackButton.style.cssText = 'cursor: pointer; padding: 5px 10px; background-color: #ecf2ff; color: #000; font-size: 12px; font-weight: bold;';
        feedbackButton.addEventListener('mouseover', () => {
            feedbackButton.style.cssText += 'border-radius: 10px; background-color: #aabbf2; color: #fff;';
        });
        feedbackButton.addEventListener('mouseout', () => {
            feedbackButton.style.cssText += 'border-radius: 0; background-color: #ecf2ff; color: #000;';
        });
        feedbackButton.addEventListener('click', () => {
            const feedbackDiv = document.createElement('div');
            feedbackDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 310px; height: 460px; background-color: #f9f9f9; border: 2px solid #ccc; padding: 10px;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); z-index: 1000;
        `;
            const feedbackImage = document.createElement('img');
            feedbackImage.src = 'https://wwimages.s3.cn-north-1.jdcloud-oss.com/7.9kudi.jpg';
            feedbackImage.style.cssText = 'width: 300px; height: 380px; border-radius: 10px; ';
            feedbackDiv.appendChild(feedbackImage);
 
            const feedbackText = document.createElement('p');
            feedbackText.textContent = '反馈问题 ==> 微信：gz08091011';
            feedbackText.href = 'weixin://';
            feedbackText.style.cssText = 'color: #000; font-size: 14px; margin-top: 10px;';
            feedbackDiv.appendChild(feedbackText);
 
            const closeButton = document.createElement('button');
            closeButton.textContent = '关闭';
            closeButton.style.cssText = 'margin-top: 10px; padding: 5px 10px; background-color: #f44336; color: #fff; border: none; border-radius: 5px; cursor: pointer;';
            closeButton.addEventListener('click', () => {
                document.body.removeChild(feedbackDiv);
            });
            feedbackDiv.appendChild(closeButton);
 
            document.body.appendChild(feedbackDiv);
        });
 
        toolbar.appendChild(createMenuButton('店铺信息', storeInfoSubMenu));
        toolbar.appendChild(createMenuButton('Sku信息', skuInfoSubMenu));
        toolbar.appendChild(createMenuButton('Spu信息', spuInfoSubMenu));
        toolbar.appendChild(createMenuButton('主图&视频', mainImageSubMenu));
        toolbar.appendChild(feedbackButton);
 
        const targetDiv = document.querySelector('.sku-name');
        if (targetDiv) {
            targetDiv.insertAdjacentElement('afterend', toolbar);
        }
    }
 
    function copyToClip(message) {
        const content = document.createElement("textarea");
        content.value = message;
        document.body.appendChild(content);
        content.select();
        document.execCommand("copy");
        document.body.removeChild(content);
    }
 
    function showTip(text, targetElement) {
        // 创建提示框
        const tip = document.createElement('div');
        tip.textContent = text;
        tip.style.cssText = `
        position: absolute;
        padding: 5px 10px;
        background-color: rgba(0, 0, 0, 0.75);
        color: #fff;
        border-radius: 5px;
        z-index: 9999;
        font-size: 14px;
        pointer-events: none;
        white-space: nowrap;
    `;
 
        const rect = targetElement.getBoundingClientRect();
        tip.style.left = `${rect.right + 10}px`;
        tip.style.top = `${rect.top + window.scrollY}px`;
        document.body.appendChild(tip);
        setTimeout(() => {
            document.body.removeChild(tip);
        }, 1500);
    }
 
    function findAndExtractLast(text, search) {
        var index = text.lastIndexOf(search);
        if (index !== -1) {
            return text.substring(0,index);
        }
        return '';
    }
})();
