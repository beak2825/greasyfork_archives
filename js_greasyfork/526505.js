// ==UserScript==
// @name         携程搜索页面抓取酒店列表及静态信息
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Capture hotel list data and hotel static info from Ctrip API
// @author       Lnx
// @match        https://*/*
// @match        https://hotels.ctrip.com/hotels/*  // 携程搜索页面 url
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526505/%E6%90%BA%E7%A8%8B%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E6%8A%93%E5%8F%96%E9%85%92%E5%BA%97%E5%88%97%E8%A1%A8%E5%8F%8A%E9%9D%99%E6%80%81%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/526505/%E6%90%BA%E7%A8%8B%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E6%8A%93%E5%8F%96%E9%85%92%E5%BA%97%E5%88%97%E8%A1%A8%E5%8F%8A%E9%9D%99%E6%80%81%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // 定义正则表达式来匹配目标接口 URL
    const targetApiRegex = /21881\/json\/HotelSearch/;
    // 用于存储收集到的酒店数据
    let collectedHotels = [];
    // 存储最终处理后的数据
    let finalHotelData = [];
    // 导出按钮元素
    let exportButton;

    // 拦截 XMLHttpRequest
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        console.log('Intercepted XHR URL:', url);
        if (targetApiRegex.test(url)) {
            const originalOnLoad = this.onload;
            this.onload = function () {
                console.log('XHR status:', this.status);
                if (this.status === 200) {
                    try {
                        const responseData = JSON.parse(this.responseText);
                        console.log('XHR response data:', responseData);
                        collectHotelData(responseData);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                }
                if (originalOnLoad) {
                    originalOnLoad.apply(this, arguments);
                }
            };
        }
        return originalXhrOpen.apply(this, arguments);
    };

    // 拦截 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
        const url = typeof input === 'string' ? input : input.url;
        console.log('Intercepted fetch URL:', url);
        if (targetApiRegex.test(url)) {
            return originalFetch(input, init).then(response => {
                console.log('Fetch status:', response.status);
                const clone = response.clone();
                return clone.json().then(data => {
                    console.log('Fetch response data:', data);
                    collectHotelData(data);
                    return response;
                });
            });
        }
        return originalFetch.apply(this, arguments);
    };

    // 收集酒店数据
    function collectHotelData(data) {
        try {
            // 检查数据结构是否符合预期
            if (!data || !data.Response || !data.Response.hotelList || !Array.isArray(data.Response.hotelList.list)) {
                console.error('数据结构不符合预期:', data);
                return;
            }
            const hotelList = data.Response.hotelList.list;
            hotelList.forEach(item => {
                collectedHotels.push(item);
            });
            // 如果还没有添加导出按钮，则添加
            if (!document.getElementById('exportCsvButton')) {
                addExportButton();
            }
            exportButton.textContent = '导出酒店数据, 已收集' + collectedHotels.length + '条数据';
        } catch (error) {
            console.error('收集数据时出错:', error);
        }
    }

    // 添加导出按钮
    function addExportButton() {
        exportButton = document.createElement('button');
        exportButton.id = 'exportCsvButton';
        exportButton.style.position = 'fixed';
        exportButton.style.top = '10px';
        exportButton.style.right = '10px';
        exportButton.style.zIndex = '9999';
        exportButton.addEventListener('click', processAndExportData);
        document.body.appendChild(exportButton);
    }

    // 处理并导出数据
    function processAndExportData() {
        // 禁用按钮并修改文字
        exportButton.disabled = true;
         console.log(`导出中1`)

        // 根据 hotelId 去重
        const uniqueHotels = [];
        const hotelIds = new Set();
        collectedHotels.forEach(hotel => {
            const traceInfo = hotel.traceInfo || '{}';
            let hotelId;
            try {
                const traceObj = JSON.parse(traceInfo);
                hotelId = traceObj.hotelId;
                if (hotelId && !hotelIds.has(hotelId)) {
                    uniqueHotels.push(hotel);
                    hotelIds.add(hotelId);
                }
            } catch (parseError) {
                console.error('解析 traceInfo 时出错:', parseError);
            }
        });
 console.log(`导出中2`)
        let processedCount = 0;
        const totalCount = uniqueHotels.length;
        finalHotelData = uniqueHotels
        exportToCsv();
        return
        uniqueHotels.forEach((hotel, index) => {
            const traceInfo = hotel.traceInfo || '{}';
            let hotelId;
            try {
                const traceObj = JSON.parse(traceInfo);
                hotelId = traceObj.hotelId || '';
            } catch (parseError) {
                console.error('解析 traceInfo 时出错:', parseError);
                hotelId = '';
            }
            const hotelDetailLink = `https://hotels.ctrip.com/hotels/detail/?hotelId=${hotelId}`;
            console.log(`导出中3,${hotelId}`)
            // 模拟访问酒店详情页
            GM_xmlhttpRequest({
                method: 'GET',
                url: hotelDetailLink,
                onload: function (response) {
                    // 在这里可以注入脚本拦截指定请求
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    iframeDoc.open();
                    iframeDoc.write(response.responseText);
                    iframeDoc.close();

                    // 拦截指定请求
                    const originalIframeXhrOpen = iframe.contentWindow.XMLHttpRequest.prototype.open;
                    iframe.contentWindow.XMLHttpRequest.prototype.open = function (method, url) {
                        if (url.includes('https://m.ctrip.com/restapi/soa2/21881/json/hotelStaticInfo')) {
                            const originalOnLoad = this.onload;
                            this.onload = function () {
                                if (this.status === 200) {
                                    try {
                                        const staticInfo = JSON.parse(this.responseText);
                                        const openingTime = staticInfo.Response && staticInfo.Response.hotelInfo && staticInfo.Response.hotelInfo.basic && staticInfo.Response.hotelInfo.basic.label && staticInfo.Response.hotelInfo.basic.label[0] || '';
                                        const roomCount = staticInfo.Response && staticInfo.Response.hotelInfo && staticInfo.Response.hotelInfo.basic && staticInfo.Response.hotelInfo.basic.label && staticInfo.Response.hotelInfo.basic.label[1] || '';
                                        const combinedData = {
                                            ...hotel,
                                            openingTime,
                                            roomCount
                                        };
                                        finalHotelData.push(combinedData);

                                        processedCount++;
                                        const progress = Math.round((processedCount / totalCount) * 100);
                                        exportButton.textContent = `导出中，已处理 ${progress}%（${processedCount}/${totalCount}）`;
                                        console.log(`导出中，已处理 ${progress}%（${processedCount}/${totalCount}）`)

                                        if (processedCount === totalCount) {
                                            console.log(`导出中6,${hotelId}`)
                                            exportToCsv();
                                        }
                                    } catch (error) {
                                        console.error('解析酒店静态信息出错:', error);
                                        processedCount++;
                                        const progress = Math.round((processedCount / totalCount) * 100);
                                        exportButton.textContent = `导出中，已处理 ${progress}%（${processedCount}/${totalCount}）`;
                                        console.log(`导出中，已处理 ${progress}%（${processedCount}/${totalCount}）`)
                                        if (processedCount === totalCount) {
                                            console.log(`导出中5,${hotelId}`)
                                            exportToCsv();
                                        }
                                    }
                                }
                                if (originalOnLoad) {
                                    originalOnLoad.apply(this, arguments);
                                }
                            };
                        }
                        return originalIframeXhrOpen.apply(this, arguments);
                    };
                },
                onerror: function (error) {
                    console.error('访问酒店详情页出错:', error);
                    processedCount++;
                    const progress = Math.round((processedCount / totalCount) * 100);
                    exportButton.textContent = `导出中，已处理 ${progress}%（${processedCount}/${totalCount}）`;
                    console.log(`导出中，已处理 ${progress}%（${processedCount}/${totalCount}）`)
                    if (processedCount === totalCount) {
                        console.log(`导出中4,${hotelId}`)
                        exportToCsv();
                    }
                }
            });
        });
    }

    // 导出数据到 CSV
    function exportToCsv() {
        // 定义表头，增加酒店详情链接、开业时间和客房数量
        const headers = ['酒店名称', '点评数量', '售卖价格', '地址', '距离市中心距离', '评分', '酒店详情链接', '开业时间', '客房数量'];
        const csvRows = [headers.join(',')];

        // 遍历最终的酒店数据
        finalHotelData.forEach(item => {
            const base = item.base || {};
            const comment = item.comment || {};
            const money = item.money || {};
            const position = item.position || {};
            const score = item.score || {};
            const traceInfo = item.traceInfo || '{}';
            const openingTime = item.openingTime || '';
            const roomCount = item.roomCount || '';

            const hotelName = base.hotelName || '';
            const commentCount = comment.content || '';
            const price = money.price || '';
            const address = [position.cityName, position.area, position.address].filter(Boolean).join(' ') || '';
            const distanceToCenter = position.poi || '';
            const rating = score.number || '';
            let hotelId;
            try {
                const traceObj = JSON.parse(traceInfo);
                hotelId = traceObj.hotelId || '';
            } catch (parseError) {
                console.error('解析 traceInfo 时出错:', parseError);
                hotelId = '';
            }
            const hotelDetailLink = `https://hotels.ctrip.com/hotels/detail/?hotelId=${hotelId}`;
            const row = [hotelName, commentCount, price, address, distanceToCenter, rating, hotelDetailLink, openingTime, roomCount].map(value => {
                return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
            }).join(',');
            csvRows.push(row);
        });
        // 获取当前日期
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        // 获取抓取的酒店数量
        const hotelCount = finalHotelData.length;
        // 生成文件名
        const fileName = `携程酒店列表抓取_${hotelCount}_${dateStr}.csv`;
        // 将 CSV 数据转换为 Blob 对象
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        // 创建下载链接并触发下载
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        // 恢复按钮状态
        exportButton.disabled = false;
        exportButton.textContent = '导出酒店数据';
    }
})();