// ==UserScript==
// @name         元器件信息提取
// @namespace    http://tampermonkey.net/
// @version      1.9.1
// @description  支持最新版元器件管理添加Token认证
// @author       lzq-hopego
// @match        https://item.szlcsc.com/*
// @exclude      https://item.szlcsc.com/datasheet/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544670/%E5%85%83%E5%99%A8%E4%BB%B6%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/544670/%E5%85%83%E5%99%A8%E4%BB%B6%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建悬浮框样式
    const style = document.createElement('style');
    style.textContent = `
        .float-container {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            width: 300px;
            user-select: none;
        }
        .float-container.collapsed {
            width: 120px;
            padding: 5px;
            transition: all 0.3s ease;
        }
        .float-container .title {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #333;
        }
        .float-container.collapsed .title {
            margin: 0;
            font-size: 14px;
            text-align: center;
        }
        .float-container .input-group {
            margin-bottom: 10px;
        }
        .float-container .drag-handle {
            cursor: move;
            text-align: center;
            padding: 5px;
            background: #f5f5f5;
            margin: -15px -15px 10px -15px;
            border-bottom: 1px solid #eee;
            border-radius: 8px 8px 0 0;
            user-select: none;
        }
        .float-container.collapsed .drag-handle {
            margin: -5px -5px 5px -5px;
            padding: 3px;
        }
        .float-container label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            color: #666;
        }
        .float-container input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .float-container input.invalid {
            border-color: #ff4444;
        }
        .float-container .error-message {
            color: #ff4444;
            font-size: 12px;
            margin-top: 3px;
            display: none;
        }
        .float-container button {
            width: 100%;
            padding: 8px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .float-container button:hover {
            background: #0056b3;
        }
        .status-message {
            margin-top: 10px;
            padding: 8px;
            border-radius: 4px;
            font-size: 13px;
            display: none;
        }
        .status-success {
            background-color: #dff0d8;
            color: #3c763d;
            display: block;
        }
        .status-error {
            background-color: #f2dede;
            color: #a94442;
            display: block;
        }
        .debug-info {
            margin-top: 10px;
            font-size: 12px;
            color: #666;
            max-height: 100px;
            overflow-y: auto;
            display: none;
        }
        .show-debug {
            display: block;
        }
        .content-wrapper {
            transition: all 0.3s ease;
        }
        .float-container.collapsed .content-wrapper {
            display: none;
        }
        .float-container.dragging {
            transition: none !important;
            opacity: 0.9;
        }
        .error-details {
            font-size: 11px;
            margin-top: 5px;
            padding-top: 5px;
            border-top: 1px dashed #e0e0e0;
            word-break: break-all;
        }
    `;
    document.head.appendChild(style);

    // 创建悬浮框
    const floatContainer = document.createElement('div');
    floatContainer.className = 'float-container';
    floatContainer.innerHTML = `
        <div class="drag-handle">拖动/双击收起</div>
        <h3 class="title">数据上传配置</h3>
        <div class="content-wrapper">
            <div class="input-group">
                <label for="upload-domain">上传域名</label>
                <input type="text" id="upload-domain" placeholder="例如: http://127.0.0.1" value="http://127.0.0.1">
            </div>

            <div class="input-group">
                <label for="auth-token">认证Token</label>
                <input type="text" id="auth-token" placeholder="输入认证Token" value="">
            </div>

            <div class="input-group">
                <label for="storage-location">存放位置</label>
                <input type="text" id="storage-location" placeholder="例如: A1-1-1" value="A1-1-1">
            </div>

            <div class="input-group">
                <label for="stock-quantity">库存数量</label>
                <input type="number" id="stock-quantity" placeholder="大于等于0的数字" min="0" value="0">
                <div class="error-message" id="stock-error">请输入大于等于0的数字</div>
            </div>

            <button id="submit-btn">提取并上传数据</button>
            <div class="status-message" id="status">
                <span class="status-text"></span>
                <div class="error-details"></div>
            </div>
            <div class="debug-info" id="debug-info">调试信息将显示在这里</div>
        </div>
    `;
    document.body.appendChild(floatContainer);

    // 获取DOM元素
    const dragHandle = floatContainer.querySelector('.drag-handle');
    const domainInput = document.getElementById('upload-domain');
    const tokenInput = document.getElementById('auth-token');
    const locationInput = document.getElementById('storage-location');
    const stockInput = document.getElementById('stock-quantity');
    const stockError = document.getElementById('stock-error');
    const submitBtn = document.getElementById('submit-btn');
    const statusElement = document.getElementById('status');
    const statusText = statusElement.querySelector('.status-text');
    const errorDetails = statusElement.querySelector('.error-details');
    const debugInfo = document.getElementById('debug-info');

    // 双击和拖动事件处理
    let isCollapsed = false;
    let clickCount = 0;
    let clickTimer = null;
    let isDragging = false;
    let lastClickTime = 0;
    const DOUBLE_CLICK_DELAY = 300;

    // 双击处理（日志清理功能）
    dragHandle.addEventListener('click', function(e) {
        if (isDragging) return;

        const now = Date.now();
        if (now - lastClickTime < DOUBLE_CLICK_DELAY) {
            // 双击操作
            e.preventDefault();
            isCollapsed = !isCollapsed;

            if (isCollapsed) {
                floatContainer.classList.add('collapsed');
                // 收起时清理调试日志
                debugInfo.innerHTML = '';
                debugInfo.classList.remove('show-debug');
                showDebug('面板已收起，日志已清理');
            } else {
                floatContainer.classList.remove('collapsed');
            }

            clickCount = 0;
            lastClickTime = 0;
            return;
        }

        lastClickTime = now;
        clickCount = 1;
    });

    // 初始化拖动功能
    makeDraggable(floatContainer);

    // 库存输入验证
    stockInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        if (isNaN(value) || value < 0) {
            this.classList.add('invalid');
            stockError.style.display = 'block';
            return false;
        } else {
            this.classList.remove('invalid');
            stockError.style.display = 'none';
            return true;
        }
    });

    // 提交按钮点击事件
    submitBtn.addEventListener('click', function() {
        // 重置状态显示
        statusText.textContent = '';
        errorDetails.textContent = '';
        errorDetails.style.display = 'none';

        // 显示调试信息
        debugInfo.classList.add('show-debug');
        debugInfo.innerHTML = '开始提取数据...<br>';

        // 验证库存输入
        const stockValue = parseFloat(stockInput.value);
        if (isNaN(stockValue) || stockValue < 0) {
            stockInput.classList.add('invalid');
            stockError.style.display = 'block';
            showDebug('库存数量输入无效');
            return;
        }

        // 获取Token
        const tokenValue = tokenInput.value.trim();
        if (!tokenValue) {
            showStatus('请输入认证Token', 'error');
            showDebug('未输入认证Token');
            tokenInput.classList.add('invalid');
            // 添加短暂延迟后移除无效状态
            setTimeout(() => {
                tokenInput.classList.remove('invalid');
            }, 2000);
            return;
        }
        showDebug('已获取认证Token（前4位：' + tokenValue.substring(0, 4) + '...）');

        // 获取存放位置
        const locationValue = locationInput.value.trim();
        showDebug(`存放位置: ${locationValue}`);

        // 获取域名并构建URL
        let domain = domainInput.value.trim();
        if (!domain) {
            showStatus('请输入上传域名', 'error');
            showDebug('未输入上传域名');
            return;
        }

        if (domain.endsWith('/')) {
            domain = domain.slice(0, -1);
        }
        const uploadUrl = `${domain}/api/records_tools/`;
        showDebug(`上传URL: ${uploadUrl}`);

        // 提取各类数据
        const tableData = extractTableData() || {};
        const flexData = extractFlexData() || {};
        const imageUrls = extractImageUrls();
        const nameValue = extractNameData() || '';
        const manualUrl = extractDataManualUrl() || '';
        const priceValue = extractPrice() || '';

        // 合并所有原始数据
        let allRawData = {
            ...tableData,
            ...flexData,
            '数据手册': manualUrl
        };

        // 确保商品目录有值
        if (!allRawData['商品目录']) {
            allRawData['商品目录'] = '未知';
            showDebug('未找到商品目录数据，已添加默认值"未知"');
        }

        // 确保商品封装有值
        if (!allRawData['商品封装']) {
            allRawData['商品封装'] = '未知';
            showDebug('未找到商品封装数据，已添加默认值"未知"');
        }

        showDebug(`原始数据总数: ${Object.keys(allRawData).length}`);

        // 按需求组装新数据结构
        const formattedData = assembleData(
            allRawData,
            nameValue,
            priceValue,
            imageUrls,
            locationValue,
            stockValue
        );

        showDebug('数据组装完成，结构如下:');
        showDebug(JSON.stringify(formattedData, null, 2));
        console.log('组装后的数据:', formattedData);

        // 上传数据
        uploadData(uploadUrl, formattedData, tokenValue);
    });

    // 数据组装核心函数
    function assembleData(rawData, name, price, images, location, stock) {
        // 1. 初始化基础结构
        const result = {
            name: name,
            price: price,
            model: '',           // 商品型号
            category: '',        // 商品目录
            fengzhuang: '',      // 商品封装
            location: location,
            stock: stock,
            image_url: '',       // img列表第一个元素
            description: '',     // 描述
            specifications: []   // 剩余数据
        };

        // 2. 提取指定字段
        const processedKeys = new Set([
            'name', 'price', 'model', 'category',
            'fengzhuang', 'location', 'stock',
            'image_url', 'description'
        ]);

        // 提取商品型号
        if (rawData['商品型号']) {
            result.model = rawData['商品型号'];
            processedKeys.add('商品型号');
        }

        // 提取商品目录（确保有值）
        result.category = rawData['商品目录'] || '未知';
        processedKeys.add('商品目录');
        showDebug(`商品目录值: "${result.category}"`);

        // 提取商品封装（确保有值）
        result.fengzhuang = rawData['商品封装'] || '未知';
        processedKeys.add('商品封装');
        showDebug(`商品封装值: "${result.fengzhuang}"`);

        // 提取描述
        if (rawData['描述']) {
            result.description = rawData['描述'];
            processedKeys.add('描述');
        }

        // 处理图片
        if (images.length > 0) {
            // 第一个图片作为主图
            result.image_url = images[0];

            // 剩余图片按"图片1"、"图片2"格式添加到specifications
            images.slice(1).forEach((img, index) => {
                // 过滤空图片URL
                if (img && img.trim()) {
                    result.specifications.push({
                        key: `图片${index + 1}`,
                        value: img
                    });
                } else {
                    showDebug(`图片${index + 1} URL为空，已过滤`);
                }
            });
        }

        // 3. 处理剩余数据，添加到specifications（过滤空值）
        Object.entries(rawData).forEach(([key, value]) => {
            if (!processedKeys.has(key)) {
                // 转换为字符串并检查是否为空
                const stringValue = value ? value.toString().trim() : '';

                if (stringValue) {
                    result.specifications.push({
                        key: key,
                        value: stringValue
                    });
                } else {
                    showDebug(`键为"${key}"的值为空，已过滤`);
                }
            }
        });

        return result;
    }

    // 提取表格数据
    function extractTableData() {
        const targetTables = document.querySelectorAll('table.w-full.caption-bottom.text-sm');

        if (!targetTables || targetTables.length === 0) {
            showDebug('未找到任何目标表格，将跳过表格数据提取');
            return {};
        }

        if (targetTables.length < 2) {
            showDebug(`只找到 ${targetTables.length} 个目标表格（需要至少2个），将提取现有表格数据`);
        } else {
            showDebug(`找到 ${targetTables.length} 个目标表格，开始提取数据`);
        }

        const allTableData = {};

        targetTables.forEach((table, tableIndex) => {
            const tableBody = table.querySelector('tbody');
            if (!tableBody) {
                showDebug(`表格 ${tableIndex + 1} 中未找到tbody元素，跳过该表格`);
                return;
            }

            const rows = tableBody.querySelectorAll('tr');

            if (rows.length === 0) {
                showDebug(`表格 ${tableIndex + 1} 的tbody中未找到任何行数据，跳过该表格`);
                return;
            }

            showDebug(`表格 ${tableIndex + 1} 包含 ${rows.length} 行数据`);

            rows.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 3) {
                    const key = cells[1].textContent.trim();
                    const value = cells[2].textContent.trim();

                    if (key && value) {
                        allTableData[key] = value;
                        showDebug(`表格 ${tableIndex + 1} 行 ${rowIndex + 1}: ${key} = ${value}`);
                    } else {
                        showDebug(`表格 ${tableIndex + 1} 行 ${rowIndex + 1}: 键或值为空，已跳过`);
                    }
                } else {
                    showDebug(`表格 ${tableIndex + 1} 行 ${rowIndex + 1}: 单元格数量不足3个，跳过`);
                }
            });
        });

        return allTableData;
    }

    // 提取flex容器中的dt/dd数据
    function extractFlexData() {
        const flexContainers = document.querySelectorAll('div.flex[class*="mt-\\[16px\\]"]');

        if (!flexContainers || flexContainers.length === 0) {
            showDebug('未找到任何flex容器');
            return null;
        }

        showDebug(`找到 ${flexContainers.length} 个flex容器，开始提取数据`);

        const flexData = {};

        flexContainers.forEach((container, containerIndex) => {
            const dtElements = container.querySelectorAll('dt');

            if (dtElements.length === 0) {
                showDebug(`flex容器 ${containerIndex + 1} 中未找到dt元素`);
                return;
            }

            dtElements.forEach((dt, dtIndex) => {
                const key = dt.textContent.trim();
                if (!key) {
                    showDebug(`flex容器 ${containerIndex + 1} 中dt ${dtIndex + 1} 为空，已跳过`);
                    return;
                }

                let ddElement = dt.nextElementSibling;
                if (ddElement && ddElement.tagName.toLowerCase() !== 'dd') {
                    ddElement = dt.parentElement.querySelector('dd');
                }

                if (ddElement && ddElement.tagName.toLowerCase() === 'dd') {
                    let value;

                    // 规则：如果dt是"商品封装"，优先使用dd的title属性
                    if (key === '商品封装') {
                        // 检查dd元素是否有title属性
                        if (ddElement.title && ddElement.title.trim()) {
                            value = ddElement.title.trim();
                            showDebug(`flex容器 ${containerIndex + 1} dt ${dtIndex + 1}: 商品封装使用dd的title值 → "${value}"`);
                        } else {
                            // 如果没有title属性，使用文本内容
                            value = ddElement.textContent.trim();
                            showDebug(`flex容器 ${containerIndex + 1} dt ${dtIndex + 1}: 商品封装没有title属性，使用文本值 → "${value}"`);
                        }
                    }
                    // 原有逻辑：处理包含"参考"的dt
                    else if (key.includes('参考')) {
                        showDebug(`flex容器 ${containerIndex + 1} dt ${dtIndex + 1}: 发现包含"参考"的dt内容`);

                        const aTag = ddElement.querySelector('a');
                        if (aTag && aTag.href) {
                            value = aTag.href;
                            showDebug(`flex容器 ${containerIndex + 1} dt ${dtIndex + 1}: 提取a标签href: ${value}`);
                        } else {
                            value = ddElement.textContent.trim();
                            showDebug(`flex容器 ${containerIndex + 1} dt ${dtIndex + 1}: 未找到a标签，使用dd文本值`);
                        }
                    }
                    // 其他情况使用文本内容
                    else {
                        value = ddElement.textContent.trim();
                        showDebug(`flex容器 ${containerIndex + 1} dt ${dtIndex + 1}: 使用dd文本值 → "${value}"`);
                    }

                    // 只添加有值的数据
                    if (value && value.trim()) {
                        flexData[key] = value;
                    } else {
                        showDebug(`flex容器 ${containerIndex + 1} dt ${dtIndex + 1}: 值为空，已跳过`);
                    }
                } else {
                    showDebug(`flex容器 ${containerIndex + 1} 中dt ${dtIndex + 1} (${key}) 未找到对应的dd元素`);
                }
            });
        });

        return Object.keys(flexData).length > 0 ? flexData : null;
    }

    // 提取图片URL
    function extractImageUrls() {
        const imageUrls = [];
        const targetUl = document.querySelector('ul.flex-1.flex.items-center.justify-center');

        if (!targetUl) {
            showDebug('未找到class为"flex-1 flex items-center justify-center"的ul元素');
            return imageUrls;
        }

        const listItems = targetUl.querySelectorAll('li');

        if (!listItems || listItems.length === 0) {
            showDebug('找到目标ul，但未包含任何li元素');
            return imageUrls;
        }

        showDebug(`找到目标ul，包含 ${listItems.length} 个li元素，开始提取图片URL`);

        listItems.forEach((li, index) => {
            const imgElement = li.querySelector('img');
            if (imgElement && imgElement.src) {
                let imgUrl = imgElement.src.replace('breviary', 'source');
                // 过滤空URL
                if (imgUrl && imgUrl.trim()) {
                    imageUrls.push(imgUrl);
                    showDebug(`li元素 ${index + 1}: 提取并处理URL - ${imgUrl}`);
                } else {
                    showDebug(`li元素 ${index + 1}: 图片URL为空，已过滤`);
                }
            } else {
                showDebug(`li元素 ${index + 1}: 未找到有效img元素或src属性`);
            }
        });

        return imageUrls;
    }

    // 提取名称数据
    function extractNameData() {
        const nameParagraph = document.querySelector('div.text-\\[14px\\].mb-\\[20px\\] p');

        if (!nameParagraph) {
            showDebug('未找到class为"text-[14px] mb-[20px]"的div下的p标签，尝试通用选择器');
            const generalParagraph = document.querySelector('.text-\\[14px\\].mb-\\[20px\\] p');
            if (generalParagraph) {
                return generalParagraph.textContent.trim();
            }
            return null;
        }

        return nameParagraph.textContent.trim();
    }

    // 提取数据手册PDF下载链接
    function extractDataManualUrl() {
        const pdfLink = document.querySelector('a#item-pdf-down');

        if (!pdfLink) {
            showDebug('未找到id为"item-pdf-down"的a标签');
            return null;
        }

        if (!pdfLink.href) {
            showDebug('找到id为"item-pdf-down"的a标签，但未包含href属性');
            return null;
        }

        return pdfLink.href;
    }

    // 提取价格数据
    function extractPrice() {
        // 获取所有class为"flex-1 text-[#000000]"的span元素
        const elements = document.querySelectorAll('span.flex-1.text-\\[\\#000000\\]');
        const elements_relative = document.querySelectorAll('span.relative.flex-1.text-\\[\\#FF4960\\]');
        if(elements_relative && elements_relative.length > 0){
            showDebug(`匹配活动价格`);
            const secondElementText = elements_relative[0].textContent.trim();
            showDebug(`${secondElementText}`)
            // 检查文本长度是否足够
            if (secondElementText.length < 2) {
                showDebug(`第二个span元素文本长度不足，无法提取从第二个字符开始的内容`);
                return null;
            }
            const priceValue = secondElementText.substring(1).trim();
            showDebug(`提取到的价格数据（去除第一个字符后）: ${priceValue}`);
            return priceValue;
        }



        if (!elements || elements.length < 2) {
            showDebug(`找到 ${elements ? elements.length : 0} 个class为"flex-1 text-[#000000]"的span元素，需要至少2个`);
            return null;
        }

        // 获取第二个元素的文本内容
        const secondElementText = elements[1].textContent.trim();
        showDebug(`第二个class为"flex-1 text-[#000000]"的span元素完整文本: "${secondElementText}"`);

        // 检查文本长度是否足够
        if (secondElementText.length < 2) {
            showDebug(`第二个span元素文本长度不足，无法提取从第二个字符开始的内容`);
            return null;
        }

        // 提取从第二个字符开始的所有内容（忽略第一个价格符号）
        const priceValue = secondElementText.substring(1).trim();
        showDebug(`提取到的价格数据（去除第一个字符后）: ${priceValue}`);

        return priceValue;
    }

    // 上传数据，增强错误处理
    function uploadData(url, data, token) {
        showDebug('开始上传数据...');
        showStatus('正在上传数据...', 'success');

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `LoginToken ${token}`
            },
            data: JSON.stringify(data),
            onload: function(response) {
                console.log('服务器响应:', response.responseText);
                showDebug(`服务器响应状态: ${response.status}`);

                // 尝试解析服务器响应
                let responseData = null;
                try {
                    if (response.responseText) {
                        responseData = JSON.parse(response.responseText);
                        showDebug('服务器返回数据: ' + JSON.stringify(responseData, null, 2));
                    }
                } catch (e) {
                    showDebug('服务器返回非JSON格式数据: ' + response.responseText);
                    responseData = { message: response.responseText };
                }

                // 处理不同状态码
                if (response.status >= 200 && response.status < 300) {
                    showDebug('上传成功，服务器返回成功状态码');
                    showStatus('数据上传成功！', 'success');
                } else if (response.status === 401) {
                    // 未授权 - 显示详细错误信息
                    const errorMsg = responseData?.message || '未授权访问，Token可能无效或已过期';
                    showDebug(`上传失败，401未授权: ${errorMsg}`);
                    showStatus(`认证失败: ${errorMsg}`, 'error', errorMsg);
                } else if (response.status === 403) {
                    // 禁止访问 - 显示详细错误信息
                    const errorMsg = responseData?.message || '服务器拒绝访问，您可能没有足够权限';
                    showDebug(`上传失败，403禁止访问: ${errorMsg}`);
                    showStatus(`访问被拒绝: ${errorMsg}`, 'error', errorMsg);
                } else if (response.status === 404) {
                    const errorMsg = responseData?.message || '请求的API端点不存在';
                    showDebug(`上传失败，404未找到: ${errorMsg}`);
                    showStatus(`资源未找到: ${errorMsg}`, 'error', errorMsg);
                } else {
                    const errorMsg = responseData?.message || `服务器返回错误状态码: ${response.status}`;
                    showDebug(`上传失败: ${errorMsg}`);
                    showStatus(`上传失败: ${errorMsg}`, 'error', errorMsg);
                }
            },
            onerror: function(error) {
                console.error('数据上传失败:', error);
                const errorMsg = error.message || '未知网络错误';
                showDebug(`上传失败: ${errorMsg}`);
                showStatus('数据上传失败：网络错误', 'error', errorMsg);
            },
            onabort: function() {
                console.log('请求已中止');
                showDebug('请求已中止');
                showStatus('请求已中止', 'error');
            },
            ontimeout: function() {
                console.log('请求超时');
                showDebug('请求超时');
                showStatus('请求超时', 'error');
            }
        });
    }

    // 显示状态消息，支持错误详情
    function showStatus(message, type, details) {
        statusText.textContent = message;
        statusElement.className = 'status-message';
        statusElement.classList.add(`status-${type}`);

        // 如果有详细信息，显示在状态消息下方
        if (details) {
            errorDetails.textContent = `详情: ${details}`;
            errorDetails.style.display = 'block';
        } else {
            errorDetails.textContent = '';
            errorDetails.style.display = 'none';
        }

        if (type === 'success') {
            setTimeout(() => {
                statusElement.className = 'status-message';
                statusText.textContent = '';
                errorDetails.textContent = '';
                errorDetails.style.display = 'none';
            }, 3000);
        }
    }

    // 显示调试信息
    function showDebug(message) {
        const timestamp = new Date().toLocaleTimeString();
        debugInfo.innerHTML += `[${timestamp}] ${message}<br>`;
        debugInfo.scrollTop = debugInfo.scrollHeight;
    }

    // 拖动功能实现
    function makeDraggable(element) {
        let offsetX, offsetY;
        const handle = element.querySelector('.drag-handle');
        let dragStartX, dragStartY;
        const DRAG_THRESHOLD = 5;

        function startDrag(e) {
            dragStartX = e.clientX;
            dragStartY = e.clientY;

            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            document.addEventListener('mousemove', drag, true);
            document.addEventListener('mouseup', stopDrag, true);

            handle.style.cursor = 'grabbing';
        }

        function drag(e) {
            const dx = Math.abs(e.clientX - dragStartX);
            const dy = Math.abs(e.clientY - dragStartY);

            if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
                isDragging = true;
                element.classList.add('dragging');

                e.preventDefault();
                e.stopPropagation();

                const newX = e.clientX - offsetX;
                const newY = e.clientY - offsetY;

                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const elementWidth = element.offsetWidth;
                const elementHeight = element.offsetHeight;

                const boundedX = Math.max(0, Math.min(newX, viewportWidth - elementWidth));
                const boundedY = Math.max(0, Math.min(newY, viewportHeight - elementHeight));

                element.style.left = boundedX + 'px';
                element.style.top = boundedY + 'px';
            }
        }

        function stopDrag() {
            isDragging = false;
            element.classList.remove('dragging');

            document.removeEventListener('mousemove', drag, true);
            document.removeEventListener('mouseup', stopDrag, true);

            handle.style.cursor = 'move';
        }

        handle.addEventListener('mousedown', startDrag);
    }
})();
