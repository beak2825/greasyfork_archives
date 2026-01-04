// ==UserScript==
// @name         compare
// @namespace    your-namespace
// @version      7.0
// @description  监听XHR请求并打印返回结果和网页源码到控制台
// @author       lujipeng
// @match        https://item.yiyaojd.com/*.html
// @match        https://item.jkcsjd.com/*
// @match        https://item.jd.com/*
// @match        https://item.yiyaojd.com/*
// @match        https://npcitem.jd.hk/*
// @match        https://item.jingdonghealth.cn/*
// @match        https://detail.tmall.com/*
// @connect      osweb-b2c-alihealth.tmall.com
// @connect      pre-osweb-b2c-alihealth.tmall.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.js

// @downloadURL https://update.greasyfork.org/scripts/479177/compare.user.js
// @updateURL https://update.greasyfork.org/scripts/479177/compare.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apiUrl = 'https://osweb-b2c-alihealth.tmall.com/gw/openapi/allies/collect/reportAlliesContent';
    const SECRET_KEY = "super_spider_man";
    let username = "";

    GM_addStyle(`
        .styled-table {
            width: 100%;
            border-collapse: collapse;
        }

        .styled-table thead th {
            background-color: #f2f2f2;
            padding: 10px;
            border: 1px solid #ddd;
            font-weight: bold;
        }

        .styled-table tbody td {
            padding: 10px;
            border: 1px solid #ddd;
        }

        .styled-table .green-status {
            color: green;
            font-weight: bold;
        }

        .styled-table .red-status {
            color: red;
            font-weight: bold;
        }
    `);

    // 发送JD结果到服务器
    function sendResultOfJd(result) {
        const content = JSON.stringify([result]);

        // 构建请求数据
        const requestData = {
            taskId: 123,
            spiderSource: 'JD_DETAIL_UPDATE',
            status:'SUCCESS',
            content: [result]
        };

        // 生成时间戳
        const timestamp = Date.now().toString();

        // 生成签名
        const dataString = `spiderSource=${requestData.spiderSource}&taskId=${requestData.taskId}`;
        const message = dataString + timestamp + SECRET_KEY;
        const sign = generateSignatureSync(message);

        console.log("dataString:", dataString)
        console.log("timestamp:", timestamp)
        console.log("SECRET_KEY:", SECRET_KEY)
        console.log("message:", message)
        console.log("sign:", sign)

        // 增加 ts 和 sign 到请求数据
        requestData.ts = timestamp;
        requestData.sign = sign;

        console.log("requestData:", requestData)

        GM_xmlhttpRequest({
            method: "POST",
            url: apiUrl,
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Accept-Encoding": "gzip, deflate, br"
            },
            data: JSON.stringify(requestData),
            responseType: "arraybuffer",
            onload: function(response) {
                console.log(response);

                console.log(response.response ? new TextDecoder("utf-8").decode(response.response) : "");
                const msg = response.response ? new TextDecoder("utf-8").decode(response.response) : "";
                const resultContent = response.response ? JSON.parse(new TextDecoder("utf-8").decode(response.response)).result.resultContent : null;
                console.log("resultContent", resultContent)
                const resultList = JSON.parse(resultContent);
                console.log(resultList)


                if (resultContent) {
                    // 创建表格内容
                    const columnOrder = [
                        "cate1Name",
                        "jkSellerName",
                        "jkItemId",
                        "jkSkuId",
                        "jkItemTitle",
                        "jkSkuName",
                        "operationName",
                        "jkSkuTag",
                        "compareStatus",
                        "jkGotPrice",
                        "jkGotPriceQty",
                        "jkGotPriceDisplay",
                        "alliesGotPrice",
                        "alliesGotPriceQty",
                        "alliesGotPriceDisplay"
                    ];

                    function createTableCell(text) {
                        const cell = document.createElement('td');
                        cell.innerText = text;
                        return cell;
                    }

                    function createStatusTableCell(text) {
                        const cell = document.createElement('td');
                        cell.innerText = text;
                        if (text === '问题不大') {
                            cell.classList.add('green-status');
                        } else {
                            cell.classList.add('red-status');
                        }
                        return cell;
                    }

                    function createMoneyTableCell(text) {
                        const cell = document.createElement('td');
                        cell.innerText = "¥" + text;
                        return cell;
                    }

                    function createLinkTableCell(text, link) {
                        const cell = document.createElement('td');
                        const linkElement = document.createElement('a');
                        linkElement.href = link;
                        linkElement.target = "_blank";
                        linkElement.innerText = text;
                        cell.appendChild(linkElement);
                        return cell;
                    }


                    const tbody = document.createElement('tbody');
                    resultList.forEach(result => {
                        const row = document.createElement('tr');
                        columnOrder.forEach(column => {
                            if (column === 'jkItemTitle') {
                                row.appendChild(createLinkTableCell(result[column], result['jkUrl']));
                            } else if(column === 'jkGotPrice' || column === 'alliesGotPrice'){
                                row.appendChild(createMoneyTableCell(result[column]));
                            } else if(column === 'compareStatus'){
                                row.appendChild(createStatusTableCell(result[column]));
                            } else {
                                row.appendChild(createTableCell(result[column]));
                            }
                        });
                        tbody.appendChild(row);
                    });

                    const table = document.createElement('table');
                    table.classList.add('styled-table');
                    const thead = document.createElement('thead');
                    const headRow = document.createElement('tr');
                    const headers = [
                        '一级类目',
                        '店铺名称',
                        '健康商品ID',
                        '健康SKU ID',
                        '健康商品标题',
                        '健康SKU名称',
                        '运营',
                        '健康SKU标签',
                        '比价状态',
                        '健康凑单到手价格',
                        '健康凑单数量',
                        '健康凑单到手价格计算过程',
                        '竞对凑单到手价',
                        '竞对凑单数量',
                        '竞对凑单到手价计算过程'
                    ];
                    headers.forEach(header => {
                        const th = document.createElement('th');
                        th.innerText = header;
                        headRow.appendChild(th);
                    });
                    thead.appendChild(headRow);
                    table.appendChild(thead);
                    table.appendChild(tbody);



                    // 创建叉叉符号
                    const closeButton = document.createElement('button');
                    closeButton.innerHTML = '关闭';
                    closeButton.style.position = 'absolute';
                    closeButton.style.top = '5px';
                    closeButton.style.right = '5px';
                    closeButton.style.cursor = 'pointer';
                    closeButton.style.fontSize = '20px';
                    closeButton.style.color = '#ffffff'; // 设置按钮文字颜色为白色
                    closeButton.style.backgroundColor = '#ff0000'; // 设置按钮背景色为红色
                    closeButton.style.border = 'none'; // 移除按钮边框样式
                    closeButton.style.padding = '10px 15px'; // 设置按钮内边距
                    closeButton.style.borderRadius = '50%'; // 设置按钮为圆形
                    closeButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)'; // 添加按钮阴影效果
                    closeButton.addEventListener('click', () => {
                        // 点击叉叉符号时移除悬浮窗
                        document.body.removeChild(floatingWindow);
                    });

                    const filterLabel = document.createElement('label');
                    filterLabel.for = 'filterInput';
                    filterLabel.innerText = '筛选运营：';
                    filterLabel.style.marginRight = '5px'; // 设置标签右侧留有间距

                    const filterInput = document.createElement('input');
                    filterInput.id = 'filterInput';
                    filterInput.type = 'text';
                    filterInput.style.padding = '5px'; // 设置输入框内边距
                    filterInput.style.borderRadius = '5px'; // 设置输入框圆角样式
                    filterInput.style.border = '1px solid #ccc'; // 设置输入框边框样式

                    const filterTitleLabel = document.createElement('label');
                    filterTitleLabel.for = 'filterTitleInput';
                    filterTitleLabel.innerText = '筛选标题：';
                    filterTitleLabel.style.marginRight = '5px'; // 设置标签右侧留有间距

                    const filterTitleInput = document.createElement('input');
                    filterTitleInput.id = 'filterTitleInput';
                    filterTitleInput.type = 'text';
                    filterTitleInput.style.padding = '5px'; // 设置输入框内边距
                    filterTitleInput.style.borderRadius = '5px'; // 设置输入框圆角样式
                    filterTitleInput.style.border = '1px solid #ccc'; // 设置输入框边框样式


                    filterInput.addEventListener('input', () => {
                        const filterValue = filterInput.value.toLowerCase().trim(); // 去除输入的空格
                        const rows = tbody.getElementsByTagName('tr');
                        for (let i = 0; i < rows.length; i++) {
                            const row = rows[i];
                            const operationCell = row.querySelector('td:nth-child(7)');
                            const operationText = operationCell.innerText.toLowerCase();
                            if (operationText.includes(filterValue)) {
                                row.style.display = '';
                            } else {
                                row.style.display = 'none';
                            }
                        }
                    });

                    filterTitleInput.addEventListener('input', () => {
                        const filterTitleValue = filterTitleInput.value.toLowerCase().trim(); // 去除输入的空格
                        const rows = tbody.getElementsByTagName('tr');
                        for (let i = 0; i < rows.length; i++) {
                            const row = rows[i];
                            const titleCell = row.querySelector('td:nth-child(5)');
                            const titleText = titleCell.innerText.toLowerCase();
                            if (titleText.includes(filterTitleValue)) {
                                row.style.display = '';
                            } else {
                                row.style.display = 'none';
                            }
                        }
                    });

                    const filterDiv = document.createElement('div');
                    filterDiv.appendChild(filterLabel);
                    filterDiv.appendChild(filterInput);
                    filterDiv.appendChild(filterTitleLabel);
                    filterDiv.appendChild(filterTitleInput);

                    const container = document.createElement('div');
                    container.style.display = 'flex';
                    container.style.flexDirection = 'column';
                    container.style.alignItems = 'center'; // 水平居中
                    container.style.justifyContent = 'center'; // 垂直居中

                    const filterContainer = document.createElement('div');
                    filterContainer.style.marginBottom = '10px'; // 筛选框下方留有间距
                    filterContainer.appendChild(filterDiv);
                    container.appendChild(filterContainer);

                    const tableContainer = document.createElement('div');
                    tableContainer.style.flex = '1';
                    tableContainer.style.overflowX = 'auto';
                    tableContainer.appendChild(table);
                    container.appendChild(tableContainer);

                    // 创建悬浮窗进行展示
                    const floatingWindow = document.createElement('div');
                    floatingWindow.style.position = 'fixed';
                    floatingWindow.style.bottom = '20px';
                    floatingWindow.style.left = '50%';
                    floatingWindow.style.transform = 'translateX(-50%)';
                    floatingWindow.style.width = '80%'; // 设置悬浮窗宽度
                    floatingWindow.style.maxHeight = '40%'; // 设置悬浮窗最大高度
                    floatingWindow.style.background = '#fff';
                    floatingWindow.style.border = '1px solid #000';
                    floatingWindow.style.zIndex = '9999';
                    floatingWindow.style.overflow = 'auto';
                    floatingWindow.appendChild(container);
                    floatingWindow.style.overflowX = 'hidden'; // 隐藏横向滑动条
                    floatingWindow.style.paddingRight = '10px'; // 增加右侧内边距给滑动条留出空间
                    floatingWindow.style.scrollbarWidth = 'thin'; // 设置滑动条宽度为细
                    floatingWindow.style.scrollbarColor = 'rgba(0,0,0,0.5) transparent'; // 设置滑动条颜色
                    floatingWindow.appendChild(closeButton); // 将叉叉符号添加到悬浮窗

                    // 将悬浮窗添加到页面中
                    document.body.appendChild(floatingWindow);


                    let isDragging = false;
                    let initialX, initialY;
                    let offsetX = 0, offsetY = 0;
                    let animationFrameId;

                    floatingWindow.addEventListener('mousedown', function(e) {
                        console.log("floatingWindow mousedown")
                        isDragging = true;
                        initialX = e.clientX;
                        initialY = e.clientY;
                        offsetX = 0;
                        offsetY = 0;
                    });

                    floatingWindow.addEventListener('mousemove', function(e) {
                        console.log("floatingWindow mousemove")
                        if (!isDragging) return;
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = requestAnimationFrame(function() {
                            offsetX = (e.clientX - initialX) / 2;
                            offsetY = (e.clientY - initialY) / 2;
                            floatingWindow.style.left = `${floatingWindow.offsetLeft + offsetX}px`;
                            floatingWindow.style.top = `${floatingWindow.offsetTop + offsetY}px`;
                        });
                    });

                    document.addEventListener('mouseup', function(e) {
                        console.log("document mouseup")
                        isDragging = false;
                    });

                }

                //alert("Result sent successfully:");
            },
            onerror: function(error) {
                alert("Failed to send result:", error);
            },
            mozAnon: true, // 规避SSL验证
            mozSystem: true, // 规避SSL验证
            overrideMimeType: 'text/plain; charset=x-user-defined', // 禁止浏览器执行跨域检查
        });
    }

    function sendResultOfTm(result) {
        const content = JSON.stringify([result]);

        // 构建请求数据
        const requestData = {
            taskId: 123,
            spiderSource: 'TM_QUICK_COMPARE',
            status:'SUCCESS',
            content: [result]
        };

        // 生成时间戳
        const timestamp = Date.now().toString();

        // 生成签名
        const dataString = `spiderSource=${requestData.spiderSource}&taskId=${requestData.taskId}`;
        const message = dataString + timestamp + SECRET_KEY;
        const sign = generateSignatureSync(message);

        console.log("dataString:", dataString)
        console.log("timestamp:", timestamp)
        console.log("SECRET_KEY:", SECRET_KEY)
        console.log("message:", message)
        console.log("sign:", sign)

        // 增加 ts 和 sign 到请求数据
        requestData.ts = timestamp;
        requestData.sign = sign;

        console.log("requestData:", requestData)

        GM_xmlhttpRequest({
            method: "POST",
            url: apiUrl,
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Accept-Encoding": "gzip, deflate, br"
            },
            data: JSON.stringify(requestData),
            responseType: "arraybuffer",
            onload: function(response) {
                console.log(response);

                console.log(response.response ? new TextDecoder("utf-8").decode(response.response) : "");
                const msg = response.response ? new TextDecoder("utf-8").decode(response.response) : "";
                const resultContent = response.response ? JSON.parse(new TextDecoder("utf-8").decode(response.response)).result.resultContent : null;
                console.log("resultContent", resultContent)
                const resultList = JSON.parse(resultContent);
                console.log(resultList)


                if (resultContent) {
                    // 创建表格内容
                    const columnOrder = [
                        "alliesPlatform",
                        "alliesSellerName",
                        "alliesSkuTitle",
                        "alliesGotPrice",
                        "alliesGotPriceQty",
                        "alliesGotPriceDisplay",
                        "alliesGotPriceDirect",
                        "alliesGotPriceDirectDisplay",
                        "alliesProfitPoint"

                    ];
                    const headers = [
                        '竞对平台',
                        '竞对店铺',
                        '竞对sku标题',
                        '竞对普惠到手价',
                        '竞对普惠到手价凑单件数',
                        '竞对普惠到手价计算过程',
                        '竞对单品到手价',
                        '竞对单品到手价计算过程',
                        '竞对利益点'

                    ];

                    function createTableCell(text) {
                        const cell = document.createElement('td');
                        cell.innerText = text;
                        return cell;
                    }

                    function createStatusTableCell(text) {
                        const cell = document.createElement('td');
                        cell.innerText = text;
                        if (text === '问题不大') {
                            cell.classList.add('green-status');
                        } else {
                            cell.classList.add('red-status');
                        }
                        return cell;
                    }

                    function createMoneyTableCell(text) {
                        const cell = document.createElement('td');
                        cell.innerText = "¥" + text;
                        return cell;
                    }

                    function createLinkTableCell(text, link) {
                        const cell = document.createElement('td');
                        const linkElement = document.createElement('a');
                        linkElement.href = link;
                        linkElement.target = "_blank";
                        linkElement.innerText = text;
                        cell.appendChild(linkElement);
                        return cell;
                    }


                    const tbody = document.createElement('tbody');
                    resultList.forEach(result => {
                        const row = document.createElement('tr');
                        columnOrder.forEach(column => {
                            if (column === 'alliesSkuTitle') {
                                row.appendChild(createLinkTableCell(result[column], result['alliesUrl']));
                            }else {
                                row.appendChild(createTableCell(result[column]));
                            }
                        });
                        tbody.appendChild(row);
                    });

                    const table = document.createElement('table');
                    table.classList.add('styled-table');
                    const thead = document.createElement('thead');
                    const headRow = document.createElement('tr');

                    headers.forEach(header => {
                        const th = document.createElement('th');
                        th.innerText = header;
                        headRow.appendChild(th);
                    });
                    thead.appendChild(headRow);
                    table.appendChild(thead);
                    table.appendChild(tbody);

                    // 创建叉叉符号
                    const closeButton = document.createElement('button');
                    closeButton.innerHTML = '关闭';
                    closeButton.style.position = 'absolute';
                    closeButton.style.top = '5px';
                    closeButton.style.right = '5px';
                    closeButton.style.cursor = 'pointer';
                    closeButton.style.fontSize = '20px';
                    closeButton.style.color = '#ffffff'; // 设置按钮文字颜色为白色
                    closeButton.style.backgroundColor = '#ff0000'; // 设置按钮背景色为红色
                    closeButton.style.border = 'none'; // 移除按钮边框样式
                    closeButton.style.padding = '10px 15px'; // 设置按钮内边距
                    closeButton.style.borderRadius = '50%'; // 设置按钮为圆形
                    closeButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)'; // 添加按钮阴影效果
                    closeButton.addEventListener('click', () => {
                        // 点击叉叉符号时移除悬浮窗
                        document.body.removeChild(floatingWindow);
                    });

                    // 创建悬浮窗进行展示
                    const floatingWindow = document.createElement('div');
                    floatingWindow.style.position = 'fixed';
                    floatingWindow.style.bottom = '20px';
                    floatingWindow.style.left = '50%';
                    floatingWindow.style.transform = 'translateX(-50%)';
                    floatingWindow.style.width = '80%'; // 设置悬浮窗宽度
                    floatingWindow.style.maxHeight = '40%'; // 设置悬浮窗最大高度
                    floatingWindow.style.background = '#fff';
                    floatingWindow.style.border = '1px solid #000';
                    floatingWindow.style.zIndex = '9999';
                    floatingWindow.style.overflow = 'auto';
                    floatingWindow.appendChild(table);
                   // floatingWindow.style.overflow = 'auto';
                    floatingWindow.style.overflowX = 'hidden'; // 隐藏横向滑动条
                    floatingWindow.style.paddingRight = '10px'; // 增加右侧内边距给滑动条留出空间
                    floatingWindow.style.scrollbarWidth = 'thin'; // 设置滑动条宽度为细
                    floatingWindow.style.scrollbarColor = 'rgba(0,0,0,0.5) transparent'; // 设置滑动条颜色
                    floatingWindow.appendChild(closeButton); // 将叉叉符号添加到悬浮窗


                    // 将悬浮窗添加到页面中
                    document.body.appendChild(floatingWindow);

                    let isDragging = false;
                    let initialX, initialY;
                    let offsetX = 0, offsetY = 0;
                    let animationFrameId;

                    floatingWindow.addEventListener('mousedown', function(e) {
                        console.log("floatingWindow mousedown")
                        isDragging = true;
                        initialX = e.clientX;
                        initialY = e.clientY;
                        offsetX = 0;
                        offsetY = 0;
                    });

                    floatingWindow.addEventListener('mousemove', function(e) {
                        console.log("floatingWindow mousemove")
                        if (!isDragging) return;
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = requestAnimationFrame(function() {
                            offsetX = (e.clientX - initialX) / 2;
                            offsetY = (e.clientY - initialY) / 2;
                            floatingWindow.style.left = `${floatingWindow.offsetLeft + offsetX}px`;
                            floatingWindow.style.top = `${floatingWindow.offsetTop + offsetY}px`;
                        });
                    });

                    document.addEventListener('mouseup', function(e) {
                        console.log("document mouseup")
                        isDragging = false;
                    });
                }

                //alert("Result sent successfully:");
            },
            onerror: function(error) {
                alert("Failed to send result:", error);
            },
            mozAnon: true, // 规避SSL验证
            mozSystem: true, // 规避SSL验证
            overrideMimeType: 'text/plain; charset=x-user-defined', // 禁止浏览器执行跨域检查
        });
    }





    // 重写原生的XMLHttpRequest对象
    const originalXHR = unsafeWindow.XMLHttpRequest;
    unsafeWindow.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        xhr.addEventListener('load', function() {
            // 只捕获包含指定URL的XHR请求
            if (xhr.responseURL.includes("appid=pc-item-soa&functionId=pc_detailpage_wareBu")) {
                const pageSource = document.documentElement.outerHTML;
                const xhrResponse = {
                    url: xhr.responseURL,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    responseText: xhr.responseText,
                    responseHeaders: xhr.getAllResponseHeaders()
                };
                const textEncoder = new TextEncoder();
                const pageSourceArray = textEncoder.encode(pageSource);
                const xhrResponseArray = textEncoder.encode(xhr.responseText);
                const base64PageSource = arrayBufferToBase64(pageSourceArray.buffer);
                const base64XhrResponse = arrayBufferToBase64(xhrResponseArray.buffer);
                const result = {
                    pageSource: base64PageSource,
                    url: unsafeWindow.location.href,
                    xhrResponse: base64XhrResponse
                };
                sendResultOfJd(result);
            }
        });
        return xhr;
    };

    // 发送网络请求并捕获响应体
    GM_xmlhttpRequest({
        method: "GET",
        url: window.location.href,
        onload: function(response) {
            if(window.location.href.includes("https://detail.tmall.com/")){
                const result = {
                    url:window.location.href,
                };
                sendResultOfTm(result)

            }

        }
    });



    function generateSignatureSync(message) {
        const hash = CryptoJS.SHA256(message);
        return hash.toString();
    }


    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }


})();
