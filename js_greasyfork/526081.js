// ==UserScript==
// @name         显示SPU销量图表-店小秘
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  在页面上添加一个按钮，点击后显示数据图表；店小秘仓库-销量管理  数据-SKU销量
// @author       wk
// @match        https://www.dianxiaomi.com/pddkjInventory/index.htm*
// @match        https://www.dianxiaomi.com/web/stat/skuSalesList
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526081/%E6%98%BE%E7%A4%BASPU%E9%94%80%E9%87%8F%E5%9B%BE%E8%A1%A8-%E5%BA%97%E5%B0%8F%E7%A7%98.user.js
// @updateURL https://update.greasyfork.org/scripts/526081/%E6%98%BE%E7%A4%BASPU%E9%94%80%E9%87%8F%E5%9B%BE%E8%A1%A8-%E5%BA%97%E5%B0%8F%E7%A7%98.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // ----------------------------------------------从SPU获取sku销量数据---------------------------------------------
    async function getSalesData(SPU = '', SKU = "") {
        //skuSalesData = [
        //     { skuId: '1458620711', skuAttr: '', salesData: [] },
        //     { skuId: '2848343068', skuAttr: '40pcs', salesData: [{ date: 1736524800000, count: 3 }, { date: 1738425600000, count: 6 }] },
        //     { skuId: '1780586233', skuAttr: '', salesData: [] },
        //     { skuId: '3357105439', skuAttr: 'Multicolour-20pcs', salesData: [{ date: 1736524800000, count: 1 }, { date: 1738166400000, count: 1 }, { date: 1738425600000, count: 1 }] },
        // ];
 
        // 获取SKU
        let SKUs = [];
        if (SPU) {
            const url = `https://www.dianxiaomi.com/pddkjProduct/pageList.htm?pageNo=1&pageSize=50&shopId=-1&shopGroupId=&searchType=3&searchValue=${SPU}&sortName=2&sortValue=0&dxmState=online&dxmOfflineState=&productSearchType=1&fullCid=&productStatus=active&quantityLift=&quantityRight=&advancedTime=1&timeLift=&timeRight=&priceLift=&priceRight=&advancedSearch=&commentType=0&commentContent=&productStateValue=&productType=`;
     
            let responseDocument;
            try {
                const response = await fetch(url);
                const text = await response.text();
                const parser = new DOMParser();
                responseDocument = parser.parseFromString(text, 'text/html');
            } catch (error) {
                console.error(`获取 SPU ${SPU}数据失败：`, error);
                showToast('获取数据失败');
                return;
            }
     
            // 获取页面内容
            let rows = responseDocument.querySelectorAll('#goodsContent table tbody > tr');
     
            rows.forEach(row => {
                // 查找嵌套的 SKU 行
                let skuRows = row.querySelectorAll('tbody tr') || [];
     
                skuRows.forEach(skuRow => {
                    let skuId = skuRow.querySelector('td:nth-child(3) span')?.innerText.trim() || '';
     
                    if (skuId) {
                        SKUs.push(skuId);
                    }
                });
            });
        } else if (SKU) {
            SKUs = [SKU];
        } else {
            return;
        }
  
        // 获取SKU属性
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        const beginDate = new Date();
        beginDate.setDate(beginDate.getDate() - 61);
        const formattedEndDate = endDate.toISOString().split('T')[0];
        const formattedBeginDate = beginDate.toISOString().split('T')[0];
 
        const skuData = await Promise.all(SKUs.map(async (skuId) => {
        const skuUrl = `https://www.dianxiaomi.com/api/stat/product/statSalesPageList.json?platform=&shopIds=all&shopGroupId=&sortType=salesCount&isDesc=1&pageNo=1&pageSize=100&beginDate=${formattedBeginDate}&endDate=${formattedEndDate}&searchType=sku&searchValue=${skuId}&searchCondition=1`;
        try {
            const skuResponse = await fetch(skuUrl);
            const skuJson = await skuResponse.json();
            let skuAttr = '';
            if (skuJson.data.page.list && skuJson.data.page.list.length > 0) {
                skuAttr = skuJson.data.page.list[0].productAttributes || '';
            }
            return { skuId, skuAttr };
        } catch (error) {
            console.error(`获取 SKU ${skuId} 销售数据失败:`, error);
        }
        }));
 
        // 获取过去60天的销售数据
        const skuSalesData = await Promise.all(skuData.map(async ({skuId, skuAttr}) => {
            const salesUrl = `https://www.dianxiaomi.com/stat/product/getProductSalesDetailCharts.json?beginDate=${formattedBeginDate}&endDate=${endDate}&shopId=all&shopGroupId=&chartCountType=salesCount&currency=usd&chartTimeType=Daily&searchType=sku&searchValue=${skuId}&searchCondition=0`;
            try {
                const salesResponse = await fetch(salesUrl);
                const salesJson = await salesResponse.json();
                return { skuId, skuAttr, salesData: salesJson || [] };
            } catch (error) {
                console.error(`获取 SKU ${skuId} 销售数据失败:`, error);
                return { skuId, skuAttr, salesData: [] };
            }
        }));
 
        console.log(skuSalesData);
        return skuSalesData;
    }
 
    // ----------------------------------------------生成显示折现图---------------------------------------------
    let chart = null; // 全局 Chart 实例
    let container = null; // 全局容器
    let canvas = null; // 全局 canvas

    // 创建一个提示框（隐藏状态）
    let toast = document.createElement('div');
    toast.id = 'copyToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '10px 20px';
    toast.style.backgroundColor = '#4caf50';
    toast.style.color = '#fff';
    toast.style.fontSize = '14px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s';
    toast.style.zIndex = 2000;
    document.body.appendChild(toast);
    
    // 显示提示框函数
    function showToast(message) {
        toast.innerText = message;
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 2000);
    }
    
    // **创建全局唯一的容器和 Canvas**
    function createChartContainer() {
        if (container) return; // 避免重复创建
 
        container = document.createElement("div");
        container.style.display = "none";
        container.style.position = "fixed";
        container.style.top = "50%";
        container.style.left = "50%";
        container.style.transform = "translate(-50%, -50%)";
        container.style.backgroundColor = "white";
        container.style.border = "1px solid black";
        container.style.zIndex = "1000";
        container.style.padding = "20px";
        container.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
        document.body.appendChild(container);
 
        // 插入画布
        canvas = document.createElement("canvas");
        canvas.id = "dataChart";
        canvas.width = 800;
        canvas.height = 400;
        container.appendChild(canvas);
 
        // 点击容器外部关闭图表
        document.addEventListener("click", function (event) {
            if (!container.contains(event.target) && !event.target.classList.contains('show-sales-button')) {
                container.style.display = "none";
            }
        });
    }
 
    // **更新 Chart 数据**
    function updateChart(rawData) {
        //rawData = [
        //     { skuId: '1458620711', skuAttr: '', salesData: [] },
        //     { skuId: '2848343068', skuAttr: '40pcs', salesData: [{ date: 1736524800000, count: 3 }, { date: 1738425600000, count: 6 }] },
        //     { skuId: '1780586233', skuAttr: '', salesData: [] },
        //     { skuId: '3357105439', skuAttr: 'Multicolour-20pcs', salesData: [{ date: 1736524800000, count: 1 }, { date: 1738166400000, count: 1 }, { date: 1738425600000, count: 1 }] },
        // ];
 
        if (!rawData || rawData.length === 0) {
            alert("没有可用的销量数据！");
            return;
        }
 
        // 计算时间范围
        // const allDates = rawData.flatMap(item => item.salesData.map(d => d.date));
        // const startDate = new Date(Math.min(...allDates));
        // const endDate = new Date(Math.max(...allDates));
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 31);
 
        // 生成完整的时间轴
        const fullLabels = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            fullLabels.push(new Date(d).toLocaleDateString());
        }
 
        // 过滤掉 salesData 为空的项
        const filteredData = rawData.filter(item => item.salesData.length > 0); 
        // 生成数据集
        const datasets = filteredData.map(item => {
            const dateMap = new Map(item.salesData.map(d => [d.date, d.count]));
            const data = fullLabels.map(label => dateMap.get(new Date(label).getTime()) || 0);
 
            let color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
 
            return {
                label: item.skuAttr || item.skuId,
                data: data,
                borderColor: color,
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointBackgroundColor: color,
                pointRadius: 5,
                pointStyle: 'circle'
            };
        });
 
        // **更新 Chart**
        if (container.style.display === "none") {
            container.style.display = "block";
 
            if (chart) {
                chart.data.labels = fullLabels;
                chart.data.datasets = datasets;
                chart.options.scales = {
                    y: {
                        beginAtZero: true,
                        suggestedMax: Math.max(...datasets.flatMap(d => d.data)) + 1,
                        ticks: {
                            precision: 0, // ✅ 确保 y 轴只显示整数
                            callback: function (value) {
                                return Number(value).toFixed(0); // ✅ 强制转换为整数显示
                            }
                        }
                    }
                };
                chart.update();
            } else {
                // **首次创建 Chart**
                const ctx = canvas.getContext("2d");
                chart = new Chart(ctx, {
                    type: 'line',
                    data: { labels: fullLabels, datasets: datasets },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true
                            },
                            tooltip: { enabled: true },
                            datalabels: {
                                display: true,
                                color: 'black',
                                font: { weight: 'bold' },
                                anchor: 'end',
                                align: 'top'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                suggestedMax: Math.max(...datasets.flatMap(d => d.data)) + 1,
                                ticks: {
                                    precision: 0, // ✅ 确保 y 轴只显示整数
                                    callback: function (value) {
                                        return Number(value).toFixed(0); // ✅ 强制转换为整数显示
                                    }
                                }
                            }
                        }
                    },
                    plugins: [ChartDataLabels]
                });
            }
        } else {
            container.style.display = "none";
        }
    }
 
    //-------------------------------------给销售管理页面批量增加按钮并捆绑显示图表函数----------------------------------------
    // 处理表格内容
    function processTable() {
        const site = window.location.href;
        let trs;
        if (site === "https://www.dianxiaomi.com/web/stat/skuSalesList") {
            trs = document.evaluate('//div[@class="vxe-table--body-wrapper body--wrapper"]//table[@class="vxe-table--body"]//tr[@class="vxe-body--row"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        } else {
            trs = document.evaluate('//div[@class="left-tbody-box leftTbodyBox"]//tr[@class="content trContent cusconTr"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        }
 
        if (trs.snapshotLength > 0) {
            console.log('找到 产品-表格内容，开始添加按钮...');
            for (let i = 0; i < trs.snapshotLength; i++) {
                addButtonsToTrs(trs.snapshotItem(i));
            }
        } else {
            console.log('未找到 产品-表格内容。');
        }
    }
 
    // 在每个tr行添加按钮
    function addButtonsToTrs(tr) {
        const button = document.createElement('button');
        button.innerText = '销量图';
        button.className = 'show-sales-button';
        button.style.marginLeft = '10px';
        button.style.cursor = 'pointer';

        const site = window.location.href;
        if (site === "https://www.dianxiaomi.com/web/stat/skuSalesList") {
            // 提取SKU
            const span_SPU = document.evaluate('.//td[contains(@class,"col_9")]//div[contains(text(),"平台SKU ID：")]', tr, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const SKU = span_SPU.innerText.trim().match(/\d+/);

            // 检查是否已添加按钮
            const element = document.evaluate('.//td[contains(@class,"col_8")]', tr, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const safeClass = `sku-${SKU}`;
            const existingBtn = element.querySelector(`.show-sales-button`);
            if (existingBtn) {
                if (!existingBtn.classList.contains(safeClass)) {
                    console.log("存在其他 SKU 的按钮，已清除");
                    existingBtn.remove(); // 清除旧按钮
                } else {
                    console.log("已创建按钮");
                    return; // 当前 SKU 按钮已存在
                }
            }
            // 创建显示按钮
            button.className = `show-sales-button ${safeClass}`;
            element.appendChild(button);

            // 按钮点击事件
            button.addEventListener('click', async () => {
                // 获取SPU的子SKU销量数据
                const skuSalesData = await getSalesData("",SKU);
                updateChart(skuSalesData);
            });
        } else {
            // 提取SPU
            const span_SPU = document.evaluate('.//div[@class="proSpu"]//span', tr, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const SPU = span_SPU.innerText.trim()
     
            // 检查是否已添加按钮
            const element = document.evaluate('.//td[@class="w120-all f-center"]', tr, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const safeClass = `spu-${SPU}`;
            const existingBtn = element.querySelector(`.show-sales-button`);
            if (existingBtn) {
                if (!existingBtn.classList.contains(safeClass)) {
                    console.log("存在其他 SPU 的按钮，已清除");
                    existingBtn.remove(); // 清除旧按钮
                } else {
                    console.log("已创建按钮");
                    return; // 当前 SKU 按钮已存在
                }
            }
            // 创建显示按钮
            button.className = `show-sales-button ${safeClass}`;
            element.appendChild(button);
     
            // 按钮点击事件
            button.addEventListener('click', async () => {
                // 获取SPU的子SKU销量数据
                const skuSalesData = await getSalesData(SPU);
                updateChart(skuSalesData);
            });
        }
    }
 
    let observer = null; // 用于存储当前的容器观察器
 
    // 监听 tr.header 的变化
    function observeHeaders() {
        const observer = new MutationObserver(() => {
            const site = window.location.href;
            if (site === "https://www.dianxiaomi.com/web/stat/skuSalesList") {
                const title = document.querySelectorAll("li.in-active div")[0].textContent.trim();
                if (title === "SKU销量") {
                    console.log('销量图表 - 检测到 SKU销量-商品tr 出现变化，更新按钮...');
                    processTable();
                }
            } else {
                const title = document.querySelectorAll("li.moduleLiBox.in-active div")[0].textContent.trim();
                if (title === "销售管理") {
                    console.log('销量图表 - 检测到 销售管理-商品tr 出现变化，更新按钮...');
                    processTable();
                }
            }
        });
 
        //const table = document.querySelector('table.leftTbody');
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('销量图表 - 正在全局监听 销售管理-商品tr 变化...');
    }
 
    /** 📌 动态加载外部库 */
    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }
 
 
    // 启动脚本
    (function initialize() {
        // 先加载 Chart.js，再加载 Datalabels 插件
        loadScript('https://cdn.jsdelivr.net/npm/chart.js', function () {
            loadScript('https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels', function () {
                console.log('销量图表 - 脚本初始化，立即检查并监听 商品tr...');
                createChartContainer();
                processTable(); // 尝试立即处理表格
                observeHeaders(); // 开始监听 商品tr 的动态变化
            });
        });
    })();
 
    // ----------------------------------------------按钮绑定---------------------------------------------
    // const rawData = [
    //     { skuId: '1458620711', skuAttr: '', salesData: [] },
    //     { skuId: '2848343068', skuAttr: '40pcs', salesData: [{ date: 1736524800000, count: 3 }, { date: 1738425600000, count: 6 }] },
    //     { skuId: '1780586233', skuAttr: '', salesData: [] },
    //     { skuId: '3357105439', skuAttr: 'Multicolour-20pcs', salesData: [{ date: 1736524800000, count: 1 }, { date: 1738166400000, count: 1 }, { date: 1738425600000, count: 1 }] },
    // ];
 
    // // 插入按钮
    // const button = document.createElement("button");
    // button.textContent = "显示数据图表";
    // button.style.position = "fixed";
    // button.style.top = "10px";
    // button.style.right = "10px";
    // button.style.zIndex = "1000";
    // document.body.appendChild(button);
 
    // // 按钮点击事件
    // button.addEventListener("click", showChart(rawData));
})();