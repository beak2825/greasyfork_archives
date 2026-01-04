// ==UserScript==
// @name         电商平台页面增强
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  通过用户粘贴的json来高亮指定的商品属性
// @author       You
// @match        https://detail.1688.com/offer/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=125.92
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519503/%E7%94%B5%E5%95%86%E5%B9%B3%E5%8F%B0%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/519503/%E7%94%B5%E5%95%86%E5%B9%B3%E5%8F%B0%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let parsedData = (() => {
        const storedData = localStorage.getItem('highlighted_products');
        try {
            if (!storedData) {
                return null;
            }
            const data = JSON.parse(storedData);
            // 校验数据结构
            if (typeof data.订单号 === 'string' && Array.isArray(data.订单详情)) {
                return data;
            }
            else {
                throw new Error('JSON 数据结构不正确');
            }
        }
        catch (error) {
            console.error('JSON 解析失败:', error);
            return null;
        }
    })();
    let matchedProducts = [];
    const currentURL = window.location.href;
    // 当前页面配置
    const currentConfig = getPageConfig();
    const listenerMap = new Map();
    // 在电商平台上添加相关控件
    setControlEle();
    // 初始化时运行主逻辑
    window.addEventListener('load', () => {
        // 黑名单检查
        checkShopBlacklist();
        // 在页面完全加载后执行主逻辑
        runMainLogic();
    });
    // 监听 storage 事件，跨标签页通信
    window.addEventListener('storage', function (event) {
        if (event.key === 'highlighted_products' && event.newValue) {
            // 移除所有标记和样式
            resetDefaults();
            parsedData = JSON.parse(event.newValue); // 更新全局变量
            runMainLogic(); // 重新执行主逻辑
        }
        if (event.key === 'highlighted_products' && event.newValue === null) {
            // 移除所有标记和样式
            resetDefaults();
            // 重置输入框和状态提示
            // 获取各个控件元素
            const jsonInput = document.querySelector('#jsonInput');
            const statusMessage = document.querySelector('#statusMessage');
            jsonInput.value = '';
            jsonInput.placeholder = '粘贴生成的 JSON';
            statusMessage.textContent = '数据已清空';
        }
    });
    // Your code here...
    // 主逻辑处理函数
    function runMainLogic() {
        if (!parsedData || !currentConfig) {
            console.warn(`parseData:${parsedData}`);
            console.warn(`currentConfig:${currentConfig}`);
            return;
        }
        matchedProducts = parsedData.订单详情.filter(item => currentURL.includes(item.offerId));
        if (matchedProducts.length <= 0) {
            return;
        }
        processSkuLayout(matchedProducts, currentConfig);
    }
    function getPageConfig() {
        const pageVersions = [
            {
                version: 'newVersion',
                pageRootSel: '.antd-sonoma',
                insertJsonInputControl: (div) => {
                    let cart = document.querySelector('#cart');
                    if (!cart)
                        return;
                    cart.prepend(div);
                },
                prop: {
                    'wrap': { sel: 'div.transverse-filter', customAttr: '', inlineStyle: '' },
                    'item': { sel: 'button.sku-filter-button', customAttr: '', inlineStyle: '' },
                    'inner': { sel: ':self', customAttr: 'data-prop-inner', inlineStyle: 'flex-wrap:wrap;height:auto;max-width:min-content;' },
                    'active': { sel: 'button.sku-filter-button', customAttr: '', inlineStyle: '' },
                    'label': { sel: 'span.label-name', customAttr: 'data-prop-label', inlineStyle: 'background-color:gold;flex:0 0 auto;' },
                    'tag': {
                        sel: 'div[data-prop-tag]', customAttr: 'data-prop-tag', inlineStyle: 'flex-basis:100%; white-space: nowrap;padding: 0 2px 0 2px;',
                        data_removeTag: true,
                    }
                },
                sku: {
                    'wrap': { sel: 'div.expand-view-list', customAttr: '', inlineStyle: '' },
                    'item': { sel: 'div.expand-view-item', customAttr: 'data-sku-item', inlineStyle: 'flex-wrap:wrap;' },
                    'label': { sel: 'span.item-label', customAttr: 'data-sku-label', inlineStyle: 'background-color:lightgreen;' },
                    'tag': { sel: 'div[data-sku-tag]', customAttr: 'data-sku-tag', inlineStyle: 'flex: 0 0 100%;', data_removeTag: true },
                }
            },
            {
                version: 'oldVersion',
                pageRootSel: '#root-container',
                insertJsonInputControl: (div) => {
                    const targetInput = document.querySelector('input[placeholder="输入产品关键词"]');
                    if (targetInput) {
                        const parentElement = targetInput.closest('div')?.parentElement;
                        parentElement?.append(div);
                    }
                },
                prop: {
                    'wrap': { sel: 'div.prop-item-wrapper', customAttr: '', inlineStyle: '' },
                    'item': { sel: 'div.prop-item', customAttr: 'data-prop-item', inlineStyle: '' },
                    'inner': { sel: 'div.prop-item-inner-wrapper', customAttr: 'data-prop-inner', inlineStyle: 'margin-bottom:0px;' },
                    'active': { sel: 'div.prop-item-inner-wrapper.active', customAttr: '', inlineStyle: '' },
                    'label': { sel: 'div.prop-name', customAttr: 'data-prop-label', inlineStyle: 'background-color:gold' },
                    'tag': {
                        sel: 'div[data-sku-tag]', customAttr: 'data-sku-tag', inlineStyle: 'margin-bottom:10px;',
                        data_removeTag: true
                    }
                },
                sku: {
                    'wrap': { sel: 'div#sku-count-widget-wrapper', customAttr: '', inlineStyle: '' },
                    'item': { sel: 'div.sku-item-wrapper', customAttr: 'data-sku-item', inlineStyle: 'flex-wrap:wrap;' },
                    'label': { sel: 'div.sku-item-name', customAttr: 'data-sku-label', inlineStyle: 'background-color:lightgreen;' },
                    'tag': { sel: 'div[data-sku-tag]', customAttr: 'data-sku-tag', inlineStyle: 'flex-basis:100%' },
                }
            }
        ];
        return pageVersions.find(item => document.querySelector(item.pageRootSel)) ?? null;
    }
    function checkShopBlacklist() {
        // 添加自定义脚本
        let productScript = document.createElement('script');
        productScript.src = "https://ruminel.github.io/product-remark/index.js";
        document.body.append(productScript);
        // 处理黑名单
        // 模态框
        let 模态框html = `<div id="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); justify-content: center; align-items: center; z-index: 9999;">
    <div style="background: white; padding: 30px; border-radius: 10px; width: 80%; max-width: 400px; text-align: center;">
        <p id="modal-message" style="font-size: 16px; margin-bottom: 20px;"></p>
        <button id="continue-btn" style="padding: 10px 20px; font-size: 14px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; margin-right: 10px;">继续访问</button>
        <button id="close-btn" style="padding: 10px 20px; font-size: 14px; background-color: #f44336; color: white; border: none; border-radius: 5px;">关闭窗口</button>
    </div>
</div>`;
        productScript.addEventListener('load', () => {
            let 当前店铺名 = '';
            // 检查新版页面的店铺名获取方式（通过 a.shop-company-name）
            let 店铺名元素 = document.querySelector('a.shop-company-name');
            if (店铺名元素) {
                // 新版页面，使用 a.shop-company-name 来获取店铺名
                当前店铺名 = 店铺名元素.textContent.trim();
            }
            else {
                // 旧版页面，使用 img 元素旁边的文本来获取店铺名
                let 店铺名旁箭头 = document.querySelector('img[src="https://img.alicdn.com/imgextra/i4/O1CN01SU9YgY1vTk2sEzSbO_!!6000000006174-2-tps-20-12.png"]');
                if (店铺名旁箭头) {
                    当前店铺名 = 店铺名旁箭头.parentElement.textContent.trim();
                }
            }
            if (店铺黑名单.some(item => 当前店铺名.includes(item['店铺名']))) {
                let 模态框 = document.createElement('div');
                模态框.innerHTML = 模态框html;
                document.body.append(模态框);
                document.getElementById('modal').style.display = 'flex';
                document.getElementById('modal-message').textContent = `店铺 ${当前店铺名} 在黑名单内！是否继续访问？`;
                // 获取按钮元素
                const closeBtn = document.querySelector('#close-btn');
                const continueBtn = document.querySelector('#continue-btn');
                // 关闭按钮逻辑：关闭当前页面
                closeBtn.addEventListener('click', () => {
                    window.close(); // 关闭窗口
                    setTimeout(() => {
                        // 判断页面是否还在，通常情况下，window.close() 只会对通过 JS 打开的窗口有效
                        if (!window.closed) {
                            // 如果当前页面未被关闭，则清空页面内容
                            document.body.innerHTML = ''; // 清空页面内容
                        }
                    }, 100);
                });
                // 继续按钮逻辑：隐藏模态框
                continueBtn.addEventListener('click', () => {
                    document.getElementById('modal').style.display = 'none'; // 隐藏模态框
                });
            }
        });
    }
    function getSkuLayoutType() {
        if (!currentConfig) {
            return 'no-attribute';
        }
        const skuWrapSelector = currentConfig.sku.wrap.sel;
        const propWrapSelector = currentConfig.prop.wrap.sel;
        if (document.querySelector(skuWrapSelector) && !document.querySelector(propWrapSelector)) {
            return 'one-level'; // 一层属性
        }
        else if (document.querySelector(propWrapSelector)) {
            return 'two-level'; // 二层属性
        }
        else {
            return 'no-attribute'; // 无属性（假设找不到时默认为无属性）
        }
    }
    function processSkuLayout(matchedProducts, currentConfig) {
        const layoutType = getSkuLayoutType();
        switch (layoutType) {
            case 'one-level':
                skuClass(matchedProducts, currentConfig);
                break;
            case 'two-level':
                bindPropWrapperEvent(matchedProducts, currentConfig);
                propClass(matchedProducts, currentConfig);
                break;
            case 'no-attribute': // 以后可以补充无属性的处理逻辑
                break;
            default:
                console.warn('无法识别的SKU布局类型');
        }
    }
    // 在电商平台上添加相关控件
    // 等待页面加载完成后执行脚本
    function setControlEle() {
        const style = document.createElement('style');
        // 添加 CSS 样式
        style.textContent = `
        .sku-wrap {
            flex-wrap: wrap;
        }
        .sku-highlighted-background {
            background-color: lightgreen;
        }
        .sku-mark {
            flex: 0 0 100%;
        }
        .prop-wrap {
            margin-bottom: 0px;
        }
        .prop-highlighted-background {
            background-color: gold;
        }

        .prop-mark{
            margin-bottom: 10px;
        }
    `;
        // 将 <style> 元素插入到 <head> 中
        document.head.appendChild(style);
        window.addEventListener('load', () => {
            // 获取目标 input 元素
            if (!document.querySelector('#jsonInput') && currentConfig) {
                // 创建新的 div 元素
                const newDiv = document.createElement('div');
                newDiv.id = 'jsonInputContainer';
                newDiv.innerHTML = `
                <input id="jsonInput" type="text" placeholder="粘贴生成的 JSON">
                <button id="submitButton">提交 JSON</button>
                <button id="clearButton">清空数据</button>
                <p id="statusMessage"></p>
            `;
                // 将新创建的 div 插入到页面
                currentConfig.insertJsonInputControl(newDiv);
                // 获取各个控件元素
                const jsonInput = document.querySelector('#jsonInput');
                const submitButton = document.querySelector('#submitButton');
                const clearButton = document.querySelector('#clearButton');
                const statusMessage = document.querySelector('#statusMessage');
                // 检查 localStorage 中的 highlighted_products
                if (parsedData) {
                    const orderNumber = parsedData.订单号 ?? parsedData.订单详情[0].编号.split('-')[0] ?? '未知订单号';
                    jsonInput.placeholder = `${orderNumber}_已存储`;
                }
                // 提交 JSON 数据的事件处理
                submitButton.addEventListener('click', () => {
                    const inputValue = jsonInput.value.trim();
                    if (!inputValue) {
                        alert('请输入 JSON 数据！');
                        return;
                    }
                    try {
                        const newParsedData = JSON.parse(inputValue);
                        // 检查数据结构是否符合预期
                        if (!newParsedData.订单号 || !Array.isArray(newParsedData.订单详情)) {
                            throw new Error('JSON 数据结构不正确');
                        }
                        // 存储 JSON 数据到 localStorage
                        localStorage.setItem('highlighted_products', inputValue);
                        // 更新parsedData
                        parsedData = newParsedData;
                        // 更新 placeholder 并清空输入框内容
                        jsonInput.value = '';
                        jsonInput.placeholder = `${newParsedData.订单号}_已存储`;
                        // 显示状态信息
                        statusMessage.innerText = `订单号 ${newParsedData.订单号} 的数据已成功存储`;
                        // 清除当前页的标记和高亮
                        resetDefaults();
                        // 运行主逻辑
                        runMainLogic();
                        alert('JSON 数据已成功存储');
                    }
                    catch (error) {
                        alert('JSON 格式或数据结构错误，请检查后重新粘贴');
                        console.error(error);
                    }
                });
                // 清空数据的事件处理
                clearButton.addEventListener('click', () => {
                    // 清除 localStorage 中的 JSON 数据
                    localStorage.removeItem('highlighted_products');
                    // 清除当前页的标记和高亮
                    resetDefaults();
                    // 重置输入框和状态提示
                    jsonInput.value = '';
                    jsonInput.placeholder = '粘贴生成的 JSON';
                    statusMessage.textContent = '数据已清空';
                    alert('数据已清空');
                });
            }
        });
    }
    function bindPropWrapperEvent(matchedProducts, currentConfig) {
        const propWrapSel = currentConfig.prop.wrap.sel;
        const propActiveSel = currentConfig.prop.active.sel;
        const propLabelSel = currentConfig.prop.label.sel;
        const propWrapper = document.querySelector(propWrapSel);
        // 定义新的监听器，使用最新的 matchedProducts
        const newListener = () => {
            requestAnimationFrame(() => {
                let activeProp = document.querySelector(propActiveSel);
                if (activeProp) {
                    let activePropLabel = activeProp.querySelector(propLabelSel);
                    let activePropName = activePropLabel?.title || activePropLabel?.textContent || '無い';
                    // 使用最新的 matchedProducts
                    skuClass(matchedProducts, currentConfig, activePropName);
                }
            });
        };
        if (propWrapper) {
            // 如果 propWrapper 已经绑定了监听器，先移除旧的监听器
            if (listenerMap.has(propWrapper)) {
                const oldListener = listenerMap.get(propWrapper);
                if (oldListener && typeof oldListener === 'function') {
                    propWrapper.removeEventListener('click', oldListener);
                }
            }
            // 添加新的监听器
            propWrapper.addEventListener('click', newListener);
            // 更新 listenerMap 中的回调函数
            listenerMap.set(propWrapper, newListener);
            // 立即执行 newListener
            newListener();
        }
    }
    function propClass(matchedProducts, currentConfig) {
        const propItemSel = currentConfig.prop.item.sel;
        const propLabelSel = currentConfig.prop.label.sel;
        let propList = Array.from(document.querySelectorAll(propItemSel)).map(propEle => {
            let propName = propEle.querySelector(propLabelSel)?.textContent?.trim() ?? '無い';
            let matchPropProduct = matchedProducts.filter(item => {
                const attributes = item.商品属性.split('|');
                return attributes.some(attribute => attribute === propName);
            });
            let sortedPropProduct = [...matchPropProduct].sort((a, b) => parseInt(a.编号.split('-')[1]) - parseInt(b.编号.split('-')[1]));
            let { 编号整合 } = integrateProducts(sortedPropProduct);
            return { key: propName, element: propEle, 编号整合 };
        });
        console.log('propList', propList);
        markPropElements(propList, currentConfig);
    }
    function markPropElements(propList, currentConfig) {
        const propConfig = currentConfig.prop;
        propList.forEach(prop => {
            if (!prop.编号整合) {
                return;
            }
            // 获取 prop 元素
            const propItem = prop.element;
            let propItemInner = propConfig.inner.sel === ':self'
                ? propItem
                : propItem.querySelector(propConfig.inner.sel);
            if (propItemInner && !propItemInner.getAttribute(propConfig['inner'].customAttr)) {
                propItemInner.setAttribute(propConfig['inner'].customAttr, 'true');
                propItemInner.style.cssText = propConfig.inner.inlineStyle;
            }
            // 添加标记
            if (!propItem.querySelector('div[data-prop-tag]')) {
                const propTag = document.createElement('div');
                propTag.setAttribute(propConfig.tag.customAttr, 'true');
                propTag.textContent = `${prop.编号整合}`;
                propTag.style.cssText = propConfig.tag.inlineStyle;
                propItem.append(propTag);
            }
            // 修改 prop-item-name的背景色
            const porpItemName = propItem.querySelector(propConfig.label.sel);
            if (porpItemName && !porpItemName.getAttribute(propConfig.label.customAttr)) {
                porpItemName.setAttribute(propConfig.label.customAttr, 'true');
                porpItemName.style.cssText = propConfig.label.inlineStyle;
            }
        });
    }
    function skuClass(matchedProducts, currentConfig, propName) {
        if (!currentConfig) {
            return;
        }
        const skuItemSelector = currentConfig.sku.item.sel;
        const skuLabelSelector = currentConfig.sku.label.sel;
        let skuItemList = Array.from(document.querySelectorAll(skuItemSelector))
            .map(skuEle => {
            let skuName = skuEle.querySelector(skuLabelSelector)?.textContent?.trim() ?? '無い';
            // 如果有propName，则把itemName更新为propName和skuName排序后用|相连成的字符串。
            if (propName) {
                skuName = [propName, skuName].sort().join('|');
            }
            let matchSkuProduct = matchedProducts.filter(item => item.商品属性 === skuName);
            let sortedSkuProduct = [...matchSkuProduct].sort((a, b) => parseInt(a.编号.split('-')[1]) - parseInt(b.编号.split('-')[1]));
            let { 编号整合, 总数量 } = integrateProducts(sortedSkuProduct);
            // // 更新匹配状态
            // sortedSkuProduct.forEach(product => {
            //     product.isMatched = true; // 这里标记为已匹配
            // });
            return { key: skuName, element: skuEle, 编号整合, 总数量 };
        });
        console.log('skuItemList', skuItemList);
        markSkuElements(skuItemList, currentConfig);
    }
    function markSkuElements(skuList, currentConfig) {
        if (!currentConfig) {
            return;
        }
        const skuConfig = currentConfig.sku;
        skuList.forEach(sku => {
            if (typeof sku.总数量 !== 'number' || sku.总数量 <= 0) {
                return;
            }
            // 获取 SKU 元素
            const skuItem = sku.element;
            // 设置 skuItem 的样式
            if (skuItem && !skuItem.getAttribute(skuConfig.item.customAttr)) {
                skuItem.setAttribute(skuConfig.item.customAttr, 'true');
                skuItem.style.cssText = skuConfig.item.inlineStyle;
            }
            // 添加标记
            if (!skuItem.querySelector(skuConfig.tag.sel)) {
                // 创建 div 元素
                const skuTag = document.createElement('div');
                skuTag.textContent = `${sku.编号整合} 合计数量${sku.总数量}`;
                skuTag.setAttribute(skuConfig.tag.customAttr, 'true');
                skuTag.style.cssText = skuConfig.tag.inlineStyle;
                // 将元素添加到 skuItem
                skuItem.appendChild(skuTag);
            }
            // 修改 sku-label 的背景色
            const skuLabel = skuItem.querySelector(skuConfig.label.sel);
            if (skuLabel && !skuLabel.getAttribute(skuConfig.label.customAttr)) {
                skuLabel.setAttribute(skuConfig.label.customAttr, 'true');
                skuLabel.style.cssText = skuConfig.label.inlineStyle;
            }
        });
    }
    function integrateProducts(products) {
        if (products.length === 0) {
            return { 编号整合: "", 总数量: 0 };
        }
        ;
        let result编号List = [];
        let total数量 = 0;
        let 订单编号 = products[0].编号.split('-')[0]; // 获取订单编号前缀
        for (let i = 0; i < products.length; i++) {
            let current编号 = Number(products[i].编号.split('-')[1]);
            total数量 += products[i].总采购数量;
            result编号List.push(current编号);
        }
        function formatRanges(nums) {
            let result = [];
            let rangeStart = nums[0];
            for (let i = 1; i <= nums.length; i++) {
                // 如果当前数字与下一个数字不连续或已到数组末尾
                if (nums[i] !== nums[i - 1] + 1 || i === nums.length) {
                    // 如果范围只有一个数字
                    if (rangeStart === nums[i - 1]) {
                        result.push(rangeStart.toString());
                    }
                    else {
                        result.push(`${rangeStart}~${nums[i - 1]}`);
                    }
                    // 更新rangeStart为当前的数字
                    rangeStart = nums[i];
                }
            }
            return result.join(',');
        }
        // 加上订单编号前缀
        return { 编号整合: `${订单编号}-${formatRanges(result编号List)}`, 总数量: total数量 };
    }
    function resetDefaults(currentConfig = getPageConfig()) {
        if (!currentConfig) {
            return;
        }
        const propConfigList = Object.values(currentConfig.prop);
        const skuConfigList = Object.values(currentConfig.sku);
        [...propConfigList, ...skuConfigList].forEach((config) => {
            if (config.customAttr && config.inlineStyle) {
                const inlineStyleList = config.inlineStyle.split(';').filter(style => style.includes(':'));
                const elements = document.querySelectorAll(`div[${config.customAttr}]`);
                elements.forEach(element => {
                    if (config.data_removeTag) {
                        element.remove();
                    }
                    else {
                        element.removeAttribute(config.customAttr);
                        inlineStyleList.forEach(style => {
                            const [prop] = style.split(':');
                            element.style.removeProperty(prop);
                        });
                    }
                });
            }
        });
    }
    function createAndFillTable(sortedSkuProduct) {
        /* 创建表格 */
        const table = document.createElement('table');
        // 表头
        const thead = document.createElement('thead');
        thead.innerHTML = `
        <tr>
            <th>匹配状态</th>
            <th>商品编号</th>
            <th>商品属性</th>
            <th>数量</th>
        </tr>
        `;
        table.append(thead);
        // 表格主体
        const tbody = document.createElement('tbody');
        table.append(tbody);
    }
    // function resetDefaults() {
    //     const elementsClassNames = ['sku-mark', 'prop-mark']; // 待移除的元素的类名数组
    //     const classesToRemove = ['sku-wrap', 'sku-highlighted-background', 'prop-highlighted-background']; // 待移除的类名数组
    //     const attrToRemove = [{ attr: 'prop-wrap="true"', stylesToRemove: ['margin-bottom'] }]; // 待移除的自定义属性和内联属性
    //     // 处理移除元素的类
    //     elementsClassNames.forEach(className => {
    //         // 查询所有具有当前类名的元素
    //         const elements = document.querySelectorAll(`.${className}`);
    //         // 删除这些元素
    //         elements.forEach(element => {
    //             element.remove(); // 从 DOM 中移除这些元素
    //         });
    //     });
    //     // 处理移除元素类
    //     classesToRemove.forEach(className => {
    //         // 查询所有具有当前类名的元素
    //         const elements = document.querySelectorAll(`.${className}`);
    //         // 移除这些元素的类
    //         elements.forEach(element => {
    //             element.classList.remove(className); // 移除类
    //         });
    //     });
    //     // 对有特定属性的元素操作
    //     attrToRemove.forEach(({ attr, stylesToRemove }) => {
    //         const elements = document.querySelectorAll<HTMLElement>(`div[${attr}]`);
    //         // 移除指定的style
    //         elements.forEach(element => {
    //             // 遍历 stylesToRemove 数组，移除每个样式属性
    //             stylesToRemove.forEach(style => { element.style.removeProperty(style) });
    //             // 移除自定义属性
    //             element.removeAttribute(attr);
    //         })
    //     })
    // }
})();
