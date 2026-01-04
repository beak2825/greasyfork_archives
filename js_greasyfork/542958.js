// ==UserScript==
// @name         导出MPlus物料数据工具
// @namespace    http://tampermonkey.net/
// @version      1.9.2
// @description  从MPlus系统获取店铺列表和安装数据并导出Excel
// @author       21克的爱情提供技术支持
// @match        *://mplus.lorealchina.com/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license MIT
// @supportURL   https://github.com/CodeGather/tampermonkey/issues
// @downloadURL https://update.greasyfork.org/scripts/542958/%E5%AF%BC%E5%87%BAMPlus%E7%89%A9%E6%96%99%E6%95%B0%E6%8D%AE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/542958/%E5%AF%BC%E5%87%BAMPlus%E7%89%A9%E6%96%99%E6%95%B0%E6%8D%AE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 版本控制
    const SCRIPT_VERSION = GM_info.script.version;
    console.log(`导出MPlus物料数据工具 v${SCRIPT_VERSION}`);

    // 显示版本更新通知
    function showUpdateNotification() {
        // 检查是否为新版本
        const lastVersion = localStorage.getItem('mplusExportToolVersion');
        if (lastVersion !== SCRIPT_VERSION) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                z-index: 10000;
                max-width: 300px;
                font-family: Arial, sans-serif;
            `;

            notification.innerHTML = `
                <h3 style="margin:0 0 10px 0;">MPlus导出工具已更新!</h3>
                <p>当前版本: v${SCRIPT_VERSION}</p>
                <div style="display:flex; justify-content:space-between; margin-top:10px;">
                    <button id="close-notification" style="background:#f44336;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">关闭</button>
                    <button id="show-changelog" style="background:#2196F3;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">更新日志</button>
                </div>
            `;

            document.body.appendChild(notification);

            // 关闭通知
            document.getElementById('close-notification').addEventListener('click', () => {
                notification.remove();
                localStorage.setItem('mplusExportToolVersion', SCRIPT_VERSION);
            });

            // 显示更新日志
            document.getElementById('show-changelog').addEventListener('click', () => {
                alert(`导出MPlus物料数据工具更新日志 v${SCRIPT_VERSION}：
1. 修复切换项目导出按钮消失问题
2、修复切换项目后数据没有切换`);
                notification.remove();
                localStorage.setItem('mplusExportToolVersion', SCRIPT_VERSION);
            });
        }
    }

    // 创建符合Element UI风格的按钮
    function createExportButton() {

        // 创建按钮
        const btn = document.createElement('button');
        btn.textContent = '导出安装数据';
        btn.className = 'el-button el-button--primary el-button--small';
        btn.id = 'mplus-export-btn';
        btn.style.marginLeft = '10px';

        // 添加Element UI按钮样式
        const style = document.createElement('style');
        style.textContent = `
            #mplus-export-btn {
                padding: 9px 15px;
                font-size: 12px;
                border-radius: 4px;
                transition: all .1s;
                font-weight: 500;
                color: #FFF;
                background-color: #409EFF;
                border-color: #409EFF;
            }
            #mplus-export-btn:hover {
                background: #66b1ff;
                border-color: #66b1ff;
                color: #FFF;
            }
        `;
        document.head.appendChild(style);

        const hasBtn = document.querySelector("#mplus-export-btn")
        if (hasBtn) return
        // 点击事件处理
        btn.addEventListener('click', function() {
            fetchShopListAndExportData();
        });

        // 尝试找到class为second的元素
        const secondElement = document.querySelector('.footerAction');

        if (secondElement) {
            // 如果找到.footerAction元素，将按钮插入其中
            const container = document.createElement('div');
            container.style.display = 'inline-block';
            container.style.margin = '10px';
            container.appendChild(btn);
            secondElement.appendChild(container);
            console.log('按钮已添加到.footerAction元素');
        } else {
            // 如果没找到.footerAction元素，将按钮固定在页面右下角
            btn.style.position = 'fixed';
            btn.style.bottom = '20px';
            btn.style.right = '20px';
            btn.style.zIndex = '9999';
            document.body.appendChild(btn);
            console.log('未找到.footerAction元素，按钮已添加到body');
        }
    }

    // 从宿主页面获取API基础域名
    function getBaseApiUrl() {
        // 尝试从当前页面获取API域名
        const scripts = document.querySelectorAll('script[src]');
        for (let script of scripts) {
            const src = script.src;
            if (src.includes('pmmsapi')) {
                const url = new URL(src);
                return `${url.protocol}//${url.host}`;
            }
        }
        // 默认使用原域名
        return 'https://mplus.lorealchina.com';
    }

    // 从用户信息获取请求参数
    function getUserInfoParams() {
        try {
            // 从sessionStorage获取用户信息
            const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            if (!userInfo) {
                throw new Error('无法获取用户信息');
            }

            // 解构用户信息
            const {
                workSystem,
                roleId: permissionRoleId,
                attributes: {
                    supplierId
                }
            } = userInfo;

            return {
                workSystem,
                permissionRoleId,
                supplierId
            };
        } catch (e) {
            console.error('获取用户信息失败:', e);
            return {
                workSystem: "LD",
                permissionRoleId: "985f492c-81b5-4cec-8810-c04f885db80c",
                supplierId: "1d3323a1-80a3-494e-84d2-4e6b176f1d0f",
                error: e.message
            };
        }
    }

    // 从sessionStorage获取access_token
    function getAuthToken() {
        try {
            // 优先从sessionStorage获取access_token
            const accessToken = sessionStorage.getItem('access_token');
            if (accessToken) return accessToken;

            // 备用方案
            const metaToken = document.querySelector('meta[name="auth-token"]');
            if (metaToken) return metaToken.content;

            const storedToken = localStorage.getItem('authToken');
            if (storedToken) return storedToken;

            const cookieMatch = document.cookie.match(/auth_token=([^;]+)/);
            if (cookieMatch) return cookieMatch[1];

        } catch (e) {
            console.error('获取token失败:', e);
        }

        // 默认token
        return "3845a1c1-4e77-4cfc-9816-6e507736a889";
    }

    // 获取店铺列表
    function fetchShopList(page, size, list) {
        return new Promise((resolve, reject) => {
            const data = new URL(location.href)
            const procurementRequestId = data.searchParams.get("procurementRequestId")
            const tabType = data.searchParams.get("tabType")
            const baseUrl = getBaseApiUrl();
            let apiPath = "/pmmsapi/pmms-new-launch-bff/supplier/fetchReportInstallationCounter"
            if (tabType) {
                apiPath = "/pmmsapi/pmms-new-launch-bff/supplier/fetchInstallationCounter";
            }
            const userParams = getUserInfoParams();
            console.log(procurementRequestId)

            const requestData = {
                "requestId": crypto.randomUUID(),
                "procurementId": procurementRequestId,
                "workflowId": "WNL252RNER21",
                page,
                size, // 获取更多店铺
                "supplierId": userParams.supplierId,
                "timestamp": 0,
                "apiVersion": "string",
                "counterName": "",
                "channelIdList": [],
                "permissionRoleId": userParams.permissionRoleId,
                "workSystem": userParams.workSystem
            };

            const authToken = getAuthToken();
            const headers = {
                "Content-Type": "application/json",
                "token": authToken,
                "authorization": `Bearer ${authToken}`
            };

            GM_xmlhttpRequest({
                method: "POST",
                url: baseUrl + apiPath,
                headers: headers,
                data: JSON.stringify(requestData),
                responseType: "json",
                onload: function(response) {
                    console.log(888888, response)
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        if (data && Array.isArray(data.data.dataList)) {
                            list = list.concat(data.data.dataList)
                            if (data.data.dataList.length == size) {
                                page++
                                resolve(fetchShopList(page, size, list));
                            } else {
                                resolve(list);
                            }
                        } else {
                            reject(new Error("返回的店铺列表数据格式不正确"));
                        }
                    } else {
                        reject(new Error(`请求店铺列表失败: ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`请求店铺列表出错: ${error}`));
                }
            });
        });
    }

    // 获取灯片数据
    function fetchLightData(counterId, shopName) {
        return new Promise((resolve, reject) => {
            const data = new URL(location.href)
            const procurementRequestId = data.searchParams.get("procurementRequestId")
            console.log(procurementRequestId)

            const baseUrl = getBaseApiUrl();
            const apiPath = "/pmmsapi/pmms-new-launch-bff/supplier/fetchInstallationLight";
            const userParams = getUserInfoParams();

            const requestData = {
                "apiVersion": "string",
                "counterId": counterId,
                "page": 0,
                "procurementId": procurementRequestId,
                "requestId": crypto.randomUUID(),
                "size": 15,
                "timestamp": 0,
                "permissionRoleId": userParams.permissionRoleId,
                "workSystem": userParams.workSystem
            };

            const authToken = getAuthToken();
            const headers = {
                "Content-Type": "application/json",
                "token": authToken,
                "authorization": `Bearer ${authToken}`
            };

            GM_xmlhttpRequest({
                method: "POST",
                url: baseUrl + apiPath,
                headers: headers,
                data: JSON.stringify(requestData),
                onload: function(response) {
                    try {
                        // 1. 检查响应状态
                        if (response.status !== 200) {
                            throw new Error(`请求失败，状态码: ${response.status}`);
                        }

                        // 2. 安全解析JSON
                        let data;
                        try {
                            data = JSON.parse(response.responseText);
                        } catch (e) {
                            throw new Error("响应不是有效的JSON格式");
                        }

                        // 3. 检查数据结构
                        if (!data || typeof data !== 'object') {
                            throw new Error("返回数据不是有效对象");
                        }

                        // 4. 检查data.data是否存在
                        if (!data.data) {
                            console.warn(`店铺 ${shopName} (${counterId}) 没有灯片数据`);
                            resolve([]);
                            return;
                        }

                        // 5. 检查data.data.dataList是否是数组
                        if (!Array.isArray(data.data.dataList)) {
                            if (data.data.dataList === null || data.data.dataList === undefined) {
                                console.warn(`店铺 ${shopName} (${counterId}) 没有灯片数据`);
                                resolve([]);
                                return;
                            }
                            throw new Error("dataList不是数组");
                        }

                        // 6. 添加店铺信息并返回数据
                        const enhancedData = data.data.dataList.map(item => ({
                            ...item,
                            shopId: counterId,
                            shopName: shopName,
                            dataType: "灯片数据" // 添加数据类型标识
                        }));

                        resolve(enhancedData);
                    } catch (error) {
                        reject(new Error(`处理店铺 ${shopName} (${counterId}) 灯片数据失败: ${error.message}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`请求店铺 ${shopName} (${counterId}) 灯片数据出错: ${error}`));
                }
            });
        });
    }

    // 获取安装数据
    function fetchInstallationData(counterId) {
        return new Promise((resolve, reject) => {
            const baseUrl = getBaseApiUrl();
            const apiPath = "/pmmsapi/pmms-new-launch-bff/supplier/fetchInstallationNewItem";
            const userParams = getUserInfoParams();
            const data = new URL(location.href)
            const procurementRequestId = data.searchParams.get("procurementRequestId")
            console.log(procurementRequestId)

            const requestData = {
                "apiVersion": "string",
                "brandIdList": [
                    "77faea5b-368f-4efe-acd3-d650f3a06d00",
                    "77faea5b-368f-4efe-acd3-d650f3a06d00"
                ],
                "counterId": counterId,
                "page": 0,
                "procurementId": procurementRequestId,
                "requestId": crypto.randomUUID(),
                "size": 15,
                "timestamp": 0,
                "permissionRoleId": userParams.permissionRoleId,
                "workSystem": userParams.workSystem
            };

            const authToken = getAuthToken();
            const headers = {
                "Content-Type": "application/json",
                "token": authToken,
                "authorization": `Bearer ${authToken}`
            };

            GM_xmlhttpRequest({
                method: "POST",
                url: baseUrl + apiPath,
                headers: headers,
                data: JSON.stringify(requestData),
                responseType: "json",
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        if (data && data.data && data.data.dataList) {
                            resolve(data.data.dataList);
                        } else {
                            reject(new Error("返回的安装数据格式不正确"));
                        }
                    } else {
                        reject(new Error(`请求安装数据失败: ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`请求安装数据出错: ${error}`));
                }
            });
        });
    }

    // 获取店铺列表并导出数据
    async function fetchShopListAndExportData() {
        // 显示加载指示器并初始化进度条
        const loading = showLoading();
        let progressBar = document.createElement('div');
        progressBar.style.cssText = 'width: 80%; height: 10px; background: #eee; border-radius: 5px; margin: 20px auto 0;';
        let progressInner = document.createElement('div');
        progressInner.style.cssText = 'height: 100%; width: 0%; background: #409EFF; border-radius: 5px; transition: width 0.2s;';
        progressBar.appendChild(progressInner);
        let percentText = document.createElement('div');
        percentText.style.cssText = 'text-align:center; font-size:12px; color:#409EFF; margin-top:5px;';
        percentText.textContent = '0%';
        loading.querySelector('div[style*="background: white;"]').appendChild(progressBar);
        loading.querySelector('div[style*="background: white;"]').appendChild(percentText);

        fetchShopList(0, 50, [])
            .then(shopList => {
                console.log('获取到店铺列表:', shopList);
                const totalRequests = shopList.length * 2;
                let finishedRequests = 0;
                // 并发请求所有店铺的安装数据和灯片数据
                const allPromises = shopList.flatMap(shop => [
                    fetchInstallationData(shop.counterId)
                        .then(installationData => installationData.map(item => ({
                            ...item,
                            shopId: shop.counterId,
                            shopName: shop.counterName,
                            shopChannel: shop.channelName,
                            shopCity: shop.cityName
                        })))
                        .catch(error => {
                            console.error(`获取店铺 ${shop.counterName} 安装数据失败:`, error);
                            return [];
                        })
                        .finally(() => {
                            finishedRequests++;
                            const percent = Math.round(finishedRequests / totalRequests * 100);
                            progressInner.style.width = percent + '%';
                            percentText.textContent = percent + '%';
                        }),
                    fetchLightData(shop.counterId, shop.counterName)
                        .then(lightData => lightData.map(item => ({
                            ...item,
                            shopName: shop.counterName,
                            shopChannel: shop.channelName,
                            shopCity: shop.cityName
                        })))
                        .catch(error => {
                            console.error(`获取店铺 ${shop.counterName} 灯片数据失败:`, error);
                            return [];
                        })
                        .finally(() => {
                            finishedRequests++;
                            const percent = Math.round(finishedRequests / totalRequests * 100);
                            progressInner.style.width = percent + '%';
                            percentText.textContent = percent + '%';
                        })
                ]);
                return Promise.all(allPromises)
                    .then( results => {
                        const cloneList = results.flat(Infinity).map(item => ({
                            "包装编号": item.itemCode || "",
                            "点位": item.lightPositionClass,
                            "物料名称": `${item.itemName || item.pictureContent}${item.length && item.width ? (item.length + 'x' + item.width) : ''}`,
                            "物料供应商": "",
                            [item.shopName]: 1
                        }))
                        const list = cloneList.reduce((prev, next) => {
                            prev[next['物料名称']] = {
                                ...prev[next['物料名称']] || {},
                                ...next
                            }
                            return prev
                        }, {})
                        return Object.values(list)
                    }
                );
            })
            .then(allData => {
                loading.remove();
                if (allData.length > 0) {
                    exportToExcel(allData);
                } else {
                    showError("没有获取到任何安装数据");
                }
            })
            .catch(error => {
                loading.remove();
                showError(error.message);
            });
    }

    // 显示错误信息
    function showError(message, data) {
        console.error(message, data);
        alert(`${message}\n请查看控制台获取详细信息`);
    }

    // 导出数据到Excel - 使用FileSaver.js
    function exportToExcel(dataList) {
        try {
            // 验证数据
            if (!Array.isArray(dataList)) {
                throw new Error(`期望数组数据，但得到: ${typeof dataList}`);
            }
            if (dataList.length === 0) {
                throw new Error("没有可导出的数据");
            }

            // 创建工作簿
            const wb = XLSX.utils.book_new();

            // 处理数据 - 确保所有对象都有相同的字段
            const processedData = uniformData(dataList);

            // 将数据转换为工作表
            const ws = XLSX.utils.json_to_sheet(processedData);

            // 将工作表添加到工作簿
            XLSX.utils.book_append_sheet(wb, ws, "安装数据");

            // 生成Excel文件
            const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});

            // 创建Blob对象
            const blob = new Blob([wbout], {type: 'application/octet-stream'});

            // 使用FileSaver.js保存文件
            const fileName = `MPlus安装数据_${new Date().toISOString().slice(0, 10)}.xlsx`;
            saveAs(blob, fileName);

            console.log('导出成功', processedData);
        } catch (error) {
            showError("导出Excel时出错: " + error.message, dataList);
        }
    }

    // 统一数据字段
    function uniformData(dataList) {
        // 收集所有可能的字段
        const allFields = new Set();
        dataList.forEach(item => {
            Object.keys(item).forEach(key => allFields.add(key));
        });

        // 确保每条数据都有所有字段
        return dataList.map(item => {
            const newItem = {};
            allFields.forEach(field => {
                newItem[field] = item[field] !== undefined ? item[field] : '';
            });
            return newItem;
        });
    }

    // 显示加载指示器
    function showLoading() {
        const loading = document.createElement('div');
        loading.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            ">
                <div style="
                    background: white;
                    padding: 20px;
                    border-radius: 5px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                ">
                    <div class="spinner" style="
                        border: 5px solid #f3f3f3;
                        border-top: 5px solid #3498db;
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        animation: spin 1s linear infinite;
                        margin-bottom: 15px;
                    "></div>
                    <p style="margin: 0;">正在获取数据，请稍候...</p>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loading);
        return loading;
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        // 检查是否有新增节点包含.footerAction类
        const hasSecondClass = Array.from(mutations).some(mutation => {
            return Array.from(mutation.addedNodes).some(node => {
                return node.nodeType === 1 && (node.classList.contains('footerAction') ||
                                               node.querySelector('.footerAction') !== null);
            });
        });

        if (hasSecondClass || document.querySelector('.footerAction')) {
            createExportButton();
        }
    });

    // 开始观察整个document.body及其子节点的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始检查
    if (document.querySelector('.footerAction')) {
        createExportButton();
    }

    // 显示更新通知
    setTimeout(showUpdateNotification, 3000);
})();