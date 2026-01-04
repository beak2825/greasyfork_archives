// ==UserScript==
// @name         抖店后台操作增强脚本
// @namespace    vip4pt
// @version      1.17
// @description  为抖店后台添加一些有用的功能，包括获取Cookie、复制目标信息和隐藏商家助手等选项。单击按钮打开功能菜单，点击菜单以外区域可关闭菜单。
// @author       vip4pt
// @match        https://fxg.jinritemai.com/ffa/*
// @match        https://im.jinritemai.com/*
// @match        https://buyin.jinritemai.com/dashboard/*
// @match        https://haohuo.jinritemai.com/*
// @grant        GM_setClipboard
// @license      zh-cn
// @downloadURL https://update.greasyfork.org/scripts/466980/%E6%8A%96%E5%BA%97%E5%90%8E%E5%8F%B0%E6%93%8D%E4%BD%9C%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/466980/%E6%8A%96%E5%BA%97%E5%90%8E%E5%8F%B0%E6%93%8D%E4%BD%9C%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var menuVisible = false;
    var assistantHidden = false;
    var sidebarHidden = false;

    // 创建按钮容器
    var buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.left = '10px';
    buttonContainer.style.bottom = '60px';
    buttonContainer.style.zIndex = '9999';

    // 创建菜单按钮
    var menuButton = document.createElement('button');
    menuButton.innerHTML = '打开菜单';
    menuButton.style.display = 'block';
    menuButton.style.marginBottom = '10px';
    buttonContainer.appendChild(menuButton);

    // 创建菜单内容
    var menuContent = document.createElement('div');
    menuContent.style.display = 'none';
    menuContent.style.backgroundColor = 'white';
    menuContent.style.border = '1px solid black';
    menuContent.style.padding = '10px';
    buttonContainer.appendChild(menuContent);

    // 创建获取Cookie按钮
    var cookieButton = document.createElement('button');
    cookieButton.innerHTML = '获取Cookie';
    cookieButton.style.display = 'block';
    cookieButton.style.marginBottom = '5px';
    menuContent.appendChild(cookieButton);

    // 创建获取目标信息按钮
    var targetInfoButton = document.createElement('button');
    targetInfoButton.innerHTML = '获取目标信息';
    targetInfoButton.style.display = 'block';
    targetInfoButton.style.marginBottom = '5px';
    menuContent.appendChild(targetInfoButton);

    // 创建获取订单信息按钮
    var orderInfoButton = document.createElement('button');
    orderInfoButton.innerHTML = '获取订单信息';
    orderInfoButton.style.display = 'block';
    orderInfoButton.style.marginBottom = '5px';
    menuContent.appendChild(orderInfoButton);

    // 创建隐藏商家助手选择框
    var toggleAssistantCheckbox = document.createElement('input');
    toggleAssistantCheckbox.type = 'checkbox';
    toggleAssistantCheckbox.style.marginRight = '5px';
    var toggleAssistantLabel = document.createElement('label');
    toggleAssistantLabel.innerHTML = '隐藏商家助手';
    toggleAssistantLabel.appendChild(toggleAssistantCheckbox);
    toggleAssistantLabel.style.display = 'block';
    toggleAssistantLabel.style.marginBottom = '5px';
    menuContent.appendChild(toggleAssistantLabel);

    // 创建隐藏右侧工具栏选择框
    var toggleSidebarCheckbox = document.createElement('input');
    toggleSidebarCheckbox.type = 'checkbox';
    toggleSidebarCheckbox.style.marginRight = '5px';
    var toggleSidebarLabel = document.createElement('label');
    toggleSidebarLabel.innerHTML = '隐藏右侧工具栏';
    toggleSidebarLabel.appendChild(toggleSidebarCheckbox);
    toggleSidebarLabel.style.display = 'block';
    toggleSidebarLabel.style.marginBottom = '5px';
    menuContent.appendChild(toggleSidebarLabel);

    // 恢复上次保存的选择框状态
    var savedAssistantState = localStorage.getItem('hideAssistant');
    if (savedAssistantState === 'hidden') {
        toggleAssistantCheckbox.checked = true;
        assistantHidden = true;
    }

    var savedSidebarState = localStorage.getItem('hideSidebar');
    if (savedSidebarState === 'hidden') {
        toggleSidebarCheckbox.checked = true;
        sidebarHidden = true;
    }

    // 菜单按钮点击事件处理程序
    menuButton.addEventListener('click', function() {
        toggleMenu();
    });

    // 获取Cookie按钮点击事件处理程序
    cookieButton.addEventListener('click', function() {
        var cookie = document.cookie;
        console.log('Cookie:', cookie);
        GM_setClipboard(cookie);
        showNotification('Cookie已复制到剪贴板');
    });

    // 获取目标信息按钮点击事件处理程序
    targetInfoButton.addEventListener('click', function() {
        var targetElements = document.evaluate("//div[contains(text(), 'ID:')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var targetInfoArray = [];
        for (var i = 0; i < targetElements.snapshotLength; i++) {
            var targetElement = targetElements.snapshotItem(i);
            var targetInfo = targetElement.textContent;
            targetInfoArray.push(targetInfo);
        }
        if (targetInfoArray.length > 0) {
            console.log('目标信息:', targetInfoArray);
            GM_setClipboard(targetInfoArray.join('\n'));
            showNotification('目标信息已复制到剪贴板');
        } else {
            console.log('未找到目标信息');
        }
    });

    // 获取订单信息按钮点击事件处理程序
    orderInfoButton.addEventListener('click', function() {
        var orderData = extractOrderInfo();
        if (orderData.length > 0) {
            var tableText = convertToTable(orderData);
            GM_setClipboard(tableText);
            showNotification('订单信息已复制到剪贴板，共' + orderData.length + '条订单');
            console.log('订单信息:', orderData);
        } else {
            showNotification('未找到订单信息');
        }
    });

    // 隐藏商家助手选择框点击事件处理程序
    toggleAssistantCheckbox.addEventListener('change', function() {
        assistantHidden = toggleAssistantCheckbox.checked;
        saveAssistantState();
        toggleAssistant();
    });

    // 隐藏右侧工具栏选择框点击事件处理程序
    toggleSidebarCheckbox.addEventListener('change', function() {
        sidebarHidden = toggleSidebarCheckbox.checked;
        saveSidebarState();
        toggleSidebar();
    });

    // 点击页面其他区域收起菜单
    document.addEventListener('click', function(event) {
        if (menuVisible && !buttonContainer.contains(event.target)) {
            toggleMenu();
        }
    });

    // 初始化MutationObserver，监控页面变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (assistantHidden) {
                hideAssistant();
            }
            if (sidebarHidden) {
                hideSidebar();
            }
        });
    });

    // 监控整个文档的变化
    observer.observe(document, { childList: true, subtree: true });

    // 切换菜单的显示状态
    function toggleMenu() {
        menuVisible = !menuVisible;
        if (menuVisible) {
            menuButton.innerHTML = '关闭菜单';
            menuContent.style.display = 'block';
        } else {
            menuButton.innerHTML = '打开菜单';
            menuContent.style.display = 'none';
        }
    }

    // 保存商家助手状态到本地存储
    function saveAssistantState() {
        localStorage.setItem('hideAssistant', assistantHidden ? 'hidden' : 'visible');
    }

    // 保存右侧工具栏状态到本地存储
    function saveSidebarState() {
        localStorage.setItem('hideSidebar', sidebarHidden ? 'hidden' : 'visible');
    }

    // 隐藏商家助手
    function hideAssistant() {
        var targetClass = 'index_DragController__';
        var elements = document.querySelectorAll('body > div[class*="' + targetClass + '"]');
        elements.forEach(function(element) {
            element.style.display = 'none';
        });
    }

    // 显示商家助手
    function showAssistant() {
        var targetClass = 'index_DragController__';
        var elements = document.querySelectorAll('body > div[class*="' + targetClass + '"]');
        elements.forEach(function(element) {
            element.style.display = '';
        });
    }

    // 隐藏右侧工具栏
    function hideSidebar() {
        var elements = document.querySelectorAll('div.bottomGuides-uFkrWK');
        elements.forEach(function(element) {
            element.style.display = 'none';
        });
    }

    // 显示右侧工具栏
    function showSidebar() {
        var elements = document.querySelectorAll('div.bottomGuides-uFkrWK');
        elements.forEach(function(element) {
            element.style.display = '';
        });
    }

    // 切换商家助手的显示/隐藏状态
    function toggleAssistant() {
        if (assistantHidden) {
            hideAssistant();
        } else {
            showAssistant();
        }
    }

    // 切换右侧工具栏的显示/隐藏状态
    function toggleSidebar() {
        if (sidebarHidden) {
            hideSidebar();
        } else {
            showSidebar();
        }
    }

    // 创建提示框
    function showNotification(message) {
        var alertBox = document.createElement('div');
        alertBox.innerHTML = message;
        alertBox.style.position = 'fixed';
        alertBox.style.left = '50%';
        alertBox.style.bottom = '10px';
        alertBox.style.transform = 'translateX(-50%)';
        alertBox.style.padding = '10px';
        alertBox.style.backgroundColor = 'white';
        alertBox.style.border = '1px solid black';
        alertBox.style.zIndex = '9999';
        document.body.appendChild(alertBox);
        setTimeout(function() {
            document.body.removeChild(alertBox);
        }, 3000);
    }

    // 提取订单信息
    function extractOrderInfo() {
        var orders = [];

        try {
            // 获取所有子订单行
            var orderRows = document.evaluate(
                "//tr[contains(@data-row-key, 'child') and contains(@class, 'auxo-table-row-level-1')]",
                document,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null
            );

            for (var i = 0; i < orderRows.snapshotLength; i++) {
                var orderRow = orderRows.snapshotItem(i);
                var order = {};

                // 优化：从父订单行获取订单编号（只提取数字部分）
                var orderNumberElement = document.evaluate(
                    "./preceding-sibling::tr[contains(@class, 'auxo-table-row-level-0')][1]//div[contains(@class, 'index_content__pnosO')]",
                    orderRow,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                if (orderNumberElement) {
                    var fullText = orderNumberElement.textContent;
                    // 提取订单编号数字部分
                    var match = fullText.match(/\d+/);
                    order.orderNumber = match ? match[0] : fullText.replace('订单编号', '').trim();
                } else {
                    order.orderNumber = '';
                }

                // 优化：从父订单行获取下单时间（只提取时间部分）
                var orderTimeElement = document.evaluate(
                    "./preceding-sibling::tr[contains(@class, 'auxo-table-row-level-0')][1]//span[contains(@class, 'index_text__HgcUD') and contains(text(), '下单时间')]",
                    orderRow,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                if (orderTimeElement) {
                    var timeText = orderTimeElement.textContent;
                    // 提取时间部分（YYYY-MM-DD HH:MM:SS格式）
                    var timeMatch = timeText.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
                    order.orderTime = timeMatch ? timeMatch[0] : timeText.replace('下单时间', '').trim();
                } else {
                    order.orderTime = '';
                }

                // 获取商品名称
                var productNameElement = document.evaluate(
                    ".//div[contains(@class, 'style_name__a5MGg')]/@title",
                    orderRow,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                order.productName = productNameElement ? productNameElement.value : '';

                // 获取商品规格(SKU)
                var skuElement = document.evaluate(
                    ".//div[contains(@class, 'style_property__viLT8')][1]//div[contains(@class, 'index_ellipsis__VPEwh')]",
                    orderRow,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                order.sku = skuElement ? skuElement.textContent : '';

                // 获取单价
                var priceElement = document.evaluate(
                    ".//div[contains(@class, 'index_marked-container__iY86s')]",
                    orderRow,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                order.price = priceElement ? priceElement.textContent.trim() : '';

                // 获取数量（去掉"x"字符）
                var quantityElement = document.evaluate(
                    ".//div[contains(@class, 'index_sub__HGXgq')]",
                    orderRow,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                if (quantityElement) {
                    var quantityText = quantityElement.textContent;
                    // 去掉"x"字符，只保留数字
                    order.quantity = quantityText.replace('x', '').trim();
                } else {
                    order.quantity = '';
                }

                // 获取售后状态
                var afterSaleElement = document.evaluate(
                    ".//div[contains(@class, 'index_after-sale-status__QGSZn')]",
                    orderRow,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                order.afterSaleStatus = afterSaleElement ? afterSaleElement.textContent.trim() : '-';

                // 获取订单状态
                var orderStatusElement = document.evaluate(
                    ".//td[contains(@class, 'auxo-table-cell')]/div/span",
                    orderRow,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                order.orderStatus = orderStatusElement ? orderStatusElement.textContent.trim() : '';

                // 修复：正确获取商家收入金额
                // 根据您提供的HTML结构，商家收入金额在表格的第6列（从1开始计数）
                var incomeElement = document.evaluate(
                    "./td[6]/div",
                    orderRow,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                // 如果第6列没有找到，尝试其他可能的列
                if (!incomeElement || !incomeElement.textContent.trim()) {
                    // 尝试第5列
                    incomeElement = document.evaluate(
                        "./td[5]/div",
                        orderRow,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue;
                }

                order.income = incomeElement ? incomeElement.textContent.trim() : '';

                orders.push(order);
            }
        } catch (error) {
            console.error('提取订单信息时出错:', error);
        }

        return orders;
    }

    // 将订单数据转换为表格文本
    function convertToTable(orderData) {
        var headers = ['订单编号', '下单时间', '商品名称', 'SKU', '单价', '数量', '售后状态', '订单状态', '商家收入'];
        var tableRows = [];

        // 添加表头
        tableRows.push(headers.join('\t'));

        // 添加数据行
        orderData.forEach(function(order) {
            var row = [
                order.orderNumber,
                order.orderTime,
                order.productName,
                order.sku,
                order.price,
                order.quantity,
                order.afterSaleStatus,
                order.orderStatus,
                order.income
            ];
            tableRows.push(row.join('\t'));
        });

        return tableRows.join('\n');
    }

    // 初始化隐藏状态
    if (assistantHidden) {
        hideAssistant();
    }
    if (sidebarHidden) {
        hideSidebar();
    }

    // 将容器添加到页面
    document.body.appendChild(buttonContainer);
})();