// ==UserScript==
// @name         飞猪酒店比价助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在飞猪酒店页面右侧添加浮动比价窗口，支持多价格选项比价，精确匹配房型信息
// @author       chongxian
// @match        *://*.hotel.fliggy.com/hotel_detail2.htm*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      112.124.36.214
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534981/%E9%A3%9E%E7%8C%AA%E9%85%92%E5%BA%97%E6%AF%94%E4%BB%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/534981/%E9%A3%9E%E7%8C%AA%E9%85%92%E5%BA%97%E6%AF%94%E4%BB%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 版本信息
    const VERSION = "2.0";
    const VERSION_HISTORY = [
        "v2.0 增加了插件登录账号的回传信息",
        "v1.9 修复了酒店名字会把括号去掉的问题，增加信息栏的显示",
        "v1.8 修复了酒店名字获取存在特殊字符问题；修复了窗户窗型的提取逻辑",
        "v1.7 增加版本号管理并在界面展示; 增加标准酒店名字的获取; 增加checkIn日期服务端提交",
        "v1.6 增加了服务端提交",
        "v1.5 修复了generalInfo的提取逻辑",
        "v1.4 增加大列表展开后小列表再次展开的信息",
        "v1.3 增加了卖家和取消策略",
        "v1.2 修复了AJAX请求的处理逻辑"
    ];

    // 全局存储
    let allRoomData = [];
    let isProcessing = false;
    let currentRoomIndex = 0;

    // 添加样式
    GM_addStyle(`
        #comparison-floating-panel {
            position: fixed;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 750px;
            max-height: 80vh;
            background: white;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            border-radius: 8px;
            z-index: 9999;
            overflow: hidden;
            transition: all 0.3s ease;
            font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
            border: 1px solid #eee;
        }

        #comparison-floating-panel.collapsed {
            width: 40px;
            height: 40px;
            overflow: hidden;
        }

        .comparison-header {
            background: #FF6A00;
            color: white;
            padding: 12px 15px;
            font-size: 15px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            user-select: none;
        }

        .comparison-content {
            padding: 0;
            overflow-y: auto;
            max-height: calc(80vh - 44px);
        }

        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        .comparison-table th {
            background-color: #f8f8f8;
            padding: 10px 8px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
            position: sticky;
            top: 0;
            color: #666;
            font-weight: normal;
        }

        .comparison-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #f0f0f0;
            vertical-align: top;
        }

        .comparison-table tr:nth-child(even) {
            background-color: #fcfcfc;
        }

        .comparison-table tr:hover {
            background-color: #f5f5f5;
        }

        .custom-price-cell {
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 2px;
        }

        .custom-price-input {
            width: 60px;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            text-align: left;
            flex-shrink: 0;
        }

        .best-price {
            color: #FF6A00;
            font-weight: bold;
        }

        .loading {
            color: #999;
            font-style: italic;
        }

        .toggle-btn {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0 5px;
            line-height: 1;
        }

        .room-highlight {
            background-color: #FFF8E6 !important;
            box-shadow: 0 0 0 2px #FFD699;
        }

        #comparison-floating-panel.collapsed .comparison-header span {
            display: none;
        }

        #comparison-floating-panel.collapsed .comparison-header .toggle-btn:after {
            content: "比";
            display: inline-block;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            letter-spacing: 2px;
            font-size: 14px;
        }

        .price-compare {
            font-weight: bold;
        }

        .feizhu-price {
            color: #FF6A00;
        }

        .ctrip-price {
            color: #1BA9EE;
        }

        .no-data {
            color: #999;
            font-style: italic;
        }

        .info-label {
            color: #888;
            font-size: 12px;
            display: block;
            margin-bottom: 3px;
        }

        .action-buttons {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background: #f8f8f8;
            border-top: 1px solid #eee;
        }

        .action-btn {
            padding: 6px 12px;
            border-radius: 4px;
            border: 1px solid #ddd;
            background: white;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }

        .action-btn:hover {
            background: #f0f0f0;
        }

        .refresh-btn {
            color: #666;
        }

        .submit-btn {
            background: #FF6A00;
            color: white;
            border-color: #FF6A00;
        }

        .submit-btn:hover {
            background: #E05C00;
        }

        .custom-price-input {
            width: 80px;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
        }

        .custom-price-label {
            font-size: 12px;
            color: #666;
            margin-right: 5px;
        }

        .price-controls {
            display: flex;
            align-items: center;
        }

        .breakfast-info {
            font-size: 12px;
        }
        .breakfast-type {
            display: block;
            color: #666;
        }
        .breakfast-price {
            color: #FF6A00;
            font-weight: bold;
        }

        .status-indicator {
            margin-left: 10px;
            font-size: 12px;
            color: #666;
        }

        .version-info {
            position: absolute;
            right: 40px;
            top: 12px;
            font-size: 15px;
            color: rgba(255,255,255,0.8);
        }

        .version-history {
            display: none;
            position: absolute;
            right: 0;
            top: 100%;
            background: white;
            color: #333;
            padding: 10px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            width: 300px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 10000;
            font-size: 12px;
            text-align: left;
        }

        .version-info:hover .version-history {
            display: block;
        }

        .version-history li {
            margin-bottom: 5px;
            list-style-type: none;
        }

    `);

    // 主函数
    function init() {
        // 创建浮动面板
        const panel = createFloatingPanel();
        document.body.appendChild(panel);

        // 初始化交互功能
        setupPanelInteractions(panel);
        setupAjaxInterceptor();
    }

    function createFloatingPanel() {
        const panel = document.createElement('div');
        const account = getAccount();
        panel.id = 'comparison-floating-panel';
        panel.innerHTML = `
            <div class="comparison-header">
                <span>🏨 酒店房型比价 | 账号: ${account}</span>
                <div class="version-info">
                    v${VERSION}
                    <div class="version-history">
                        <strong>版本历史:</strong>
                        <ul>
                            ${VERSION_HISTORY.map(v => `<li>${v}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <button class="toggle-btn">×</button>
            </div>
            <div class="comparison-content">
                <div id="hotel-info" style="padding:12px 15px; background:#f8f8f8; border-bottom:1px solid #e0e0e0;"></div>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th style="width:18%">商家房型名称</th>
                            <th style="width:18%">标准房型名称</th>
                            <th style="width:18%">卖家名字</th>
                            <th style="width:12%">床型信息</th>
                            <th style="width:6%">面积</th>
                            <th style="width:6%">楼层</th>
                            <th style="width:6%">窗型</th>
                            <th style="width:8%">早餐</th>
                            <th style="width:8%">取消政策</th>
                            <th style="width:5%">飞猪价格</th>
                            <th style="width:5%">自定义价格</th>
                        </tr>
                    </thead>
                    <tbody id="comparison-body">
                        <tr><td colspan="9" style="text-align:center;" class="no-data">点击"开始比价"按钮加载数据</td></tr>
                    </tbody>
                </table>
                <div class="action-buttons">
                    <div class="price-controls">
                        <span class="custom-price-label"></span>
                        <span class="status-indicator"></span>
                    </div>
                    <div>
                        <button class="action-btn start-btn">🔍 开始比价</button>
                        <button class="action-btn refresh-btn">🔄 刷新数据</button>
                        <button class="action-btn submit-btn">提交数据</button>
                    </div>
                </div>
            </div>
        `;
        return panel;
    }

    function setupPanelInteractions(panel) {
        // 折叠/展开功能
        const header = panel.querySelector('.comparison-header');
        header.addEventListener('click', () => panel.classList.toggle('collapsed'));

        // 拖动功能
        setupDragFunctionality(panel, header);

        // 按钮功能
        const startBtn = panel.querySelector('.start-btn');
        const refreshBtn = panel.querySelector('.refresh-btn');
        const submitBtn = panel.querySelector('.submit-btn');
        const statusIndicator = panel.querySelector('.status-indicator');

        submitBtn.style.display = 'none';
        refreshBtn.style.display = 'none';

        startBtn.addEventListener('click', () => {
            refreshData();
            startBtn.style.display = 'none';
            submitBtn.style.display = 'inline';
            refreshBtn.style.display = 'inline';
        });

        refreshBtn.addEventListener('click', () => {
            refreshData();
        });

        submitBtn.addEventListener('click', () => {
            submitData();
        });
    }

    function setupDragFunctionality(panel, header) {
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('toggle-btn')) return;

            isDragging = true;
            const rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            panel.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            panel.style.right = 'auto';
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.transform = 'none';
        });

        document.addEventListener('mouseup', function() {
            if (!isDragging) return;
            isDragging = false;
            panel.style.cursor = '';

            // 自动吸附到最近边缘
            const panelRect = panel.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            if (panelRect.left > viewportWidth / 2) {
                panel.style.left = 'auto';
                panel.style.right = '10px';
            } else {
                panel.style.right = 'auto';
                panel.style.left = '10px';
            }
        });
    }

    function setupAjaxInterceptor() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function() {
            if (this._url && this._url.includes('/ajax/hotelDetailRT.htm')) {
                this._roomIndex = currentRoomIndex;
                this.addEventListener('load', () => {
                    try {
                        processAjaxResponse(this);
                    } catch (e) {
                        console.error('处理AJAX响应失败:', e);
                    }
                });
            }
            return originalSend.apply(this, arguments);
        };
    }

    function processAjaxResponse(xhr) {
        const responseText = xhr.responseText;
        //console.log('AJAX响应:', responseText);
        if (!responseText) return;

        try {
            let jsonData;
            const jsonpMatch = responseText.match(/jsonp\d+\((.*)\)$/);
            if (jsonpMatch) {
                jsonData = JSON.parse(jsonpMatch[1]);
            }

            if (jsonData?.code === 200 && jsonData.data?.items?.length) {
                jsonData.data.items.forEach(item => {
                    if (item.sellerRoomPrices?.length) {
                        allRoomData.push({
                            roomIndex: xhr._roomIndex,
                            requests: item.sellerRoomPrices,
                            seller: item.sellerName || '-',
                        });
                    }
                });
                updateStatus(`已收集 ${allRoomData.flatMap(d => d.requests).length} 条价格数据`);
            }
        } catch (e) {
            console.error('解析AJAX响应失败:', e);
        }
    }

    function refreshData() {
        isProcessing = true;
        allRoomData = [];
        updateStatus("正在收集价格数据...");

        const tbody = document.getElementById('comparison-body');
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;" class="loading">正在加载房型信息...</td></tr>';

        const roomItems = document.querySelectorAll('.room-item-wrapper');
        if (!roomItems.length) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;" class="no-data">未检测到房型信息</td></tr>';
            isProcessing = false;
            return;
        }

        triggerAllQuoteButtons(roomItems, () => {
            createRoomRows();

            updateCustomPrices();
        });
    }

    function triggerAllQuoteButtons(roomItems, callback) {
        let totalClicks = 0;
        let completedClicks = 0;

        roomItems.forEach(room => {
            const quoteButtons = room.querySelectorAll('.quoted-price button.pi-btn-primary');
            totalClicks += quoteButtons.length;
        });

        if (totalClicks === 0) {
            setTimeout(() => {
                callback();
                isProcessing = false;
            }, 1000);
            return;
        }

        roomItems.forEach((room, roomIndex) => {
            const quoteButtons = room.querySelectorAll('.quoted-price button.pi-btn-primary');

            quoteButtons.forEach((btn, btnIndex) => {
                setTimeout(() => {
                    currentRoomIndex = roomIndex;
                    btn.click();
                    completedClicks++;
                    updateStatus(`正在收集价格 (${completedClicks}/${totalClicks})`);

                    if (completedClicks === totalClicks) {
                        setTimeout(() => {
                            callback();
                        }, 1500);
                    }
                }, (roomIndex * 1000) + (btnIndex * 500));
            });
        });
    }

    // 修改后的 createRoomRows 函数
    function createRoomRows() {
        const tbody = document.getElementById('comparison-body');
        tbody.innerHTML = '';

        const hotelInfoDiv = document.getElementById('hotel-info');    
        const hotelName = getHotelName();
        const checkInDate = extractCheckInDate();
        const checkOutDate = extractCheckOutDate();
    
        hotelInfoDiv.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-weight:bold; font-size:14px; color:#333; background: yellow;">🏨 ${hotelName}</div>
                <div style="font-size:13px; color:#666;">
                    <span style="margin-right:15px;">📅 入住: ${checkInDate}</span>
                    <span>📅 离店: ${checkOutDate}</span>
                </div>
            </div>
        `;

        const roomItems = document.querySelectorAll('.room-item-wrapper');
        if (allRoomData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;" class="no-data">未收集到价格数据</td></tr>';
            return;
        }

        //console.log('allRoomData:', allRoomData);

        // 遍历所有房间数据
        allRoomData.forEach(data => {
            const room = roomItems[data.roomIndex];
            if (!room) return;

            const generalInfo = room.querySelector('.general-info')?.textContent || '';
            console.log('generalInfo:', generalInfo);
            const standardRoomTypeName = room.querySelector('.item-title')?.textContent || '';


            const normalizedInfo = generalInfo.replace(/\s+/g, '');
            const baseInfo = {
                bedType: extractInfo(normalizedInfo, /床型：([^面积]+)/) || '-',
                area: extractInfo(normalizedInfo, /面积：([^楼层]+)/) || '-',
                floor: extractInfo(normalizedInfo, /楼层：([^窗户窗型]+)/) || '-',
                // 兼容 "窗户：" 或 "窗型："
                windowType: extractInfo(normalizedInfo, /(?:窗户|窗型)：(.+)/) || '-',
            };

            // 遍历每个房间的所有价格选项
            data.requests.forEach(request => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${request.sellerRoomTypeName}</td>
                    <td>${standardRoomTypeName}</td>
                    <td>${data.seller}</td>
                    <td>${baseInfo.bedType}</td>
                    <td>${baseInfo.area}</td>
                    <td>${baseInfo.floor}</td>
                    <td>${baseInfo.windowType}</td>
                    <td>${request.breakfirst || '-'}</td>
                    <td>${request.refundDesc  || '-'}</td>
                    <td class="feizhu-price">¥${request.price - request.totalSubtractAmount || '0'}</td>
                    <td class="custom-price-cell">¥<input type="number" class="custom-price-input" value="0" min="0"></td>
                `;
                tbody.appendChild(row);
            });
        });
    }

    function extractInfo(text, regex) {
        const match = text.match(regex);
        return match ? match[1].trim() : null;
    }

    function updateStatus(message) {
        const statusIndicator = document.querySelector('.status-indicator');
        if (statusIndicator) statusIndicator.textContent = message;
    }


    function getAccount() {
        try {
            // 方法1：从登录昵称区域获取
            const nickElement = document.querySelector('.login-nick a');
            if (nickElement) {
                return nickElement.textContent.trim();
            }
            return '获取失败';
        } catch (e) {
            console.error('获取账号失败:', e);
            return '获取失败';
        }
    }

    
    function getHotelName() {
        return document.querySelector('.info>.base>h2')?.textContent
        .replace(/[\uE000-\uF8FF]/g, '')  // 移除特殊字符
        .replace(/\s+/g, ' ')             // 多个空格变一个
        .trim()
    }

    function extractCheckInDate() {
        try {
            const dateStr = document.querySelector('#J_CheckInDate')?.value;
            return dateStr ? formatDate(new Date(dateStr)) : '-';
        } catch (e) {
            return '-';
        }
    }

    function extractCheckOutDate() {
        try {
            const dateStr = document.querySelector('#J_CheckOutDate')?.value;
            return dateStr ? formatDate(new Date(dateStr)) : '-';
        } catch (e) {
            return '-';
        }
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function updateCustomPrices() {
        const rows = document.querySelectorAll('#comparison-body tr');

        rows.forEach(row => {
            const customPriceInput = row.querySelector('.custom-price-input');
            const feizhuPriceCell = row.querySelector('.feizhu-price');
            customPriceInput.value = parseFloat(feizhuPriceCell.textContent.replace(/[^\d.]/g, ''));
        });
    }

    async function submitData() {
        isProcessing = true;
        const rows = document.querySelectorAll('#comparison-body tr');
        const roomRequests = [];
        const hotelName = getHotelName();
        const account = getAccount();
        const checkInDate = extractCheckInDate();
        const checkOutDate = extractCheckOutDate();

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 10) return;

            roomRequests.push({
                room_type: cells[0].textContent.trim(),
                s_room_type: cells[1].textContent.trim(),
                seller: cells[2].textContent.trim(),
                bed_type: cells[3].textContent.trim(),
                room_area: cells[4].textContent.trim(),
                floor: cells[5].textContent.trim(),
                window_type: cells[6].textContent.trim(),
                breakfast: cells[7].textContent.trim(),
                refund_desc: cells[8].textContent.trim(),
                price: parseFloat(cells[10].querySelector('input').value),
                hotel_name: hotelName,
                account: account,
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
                crawl_time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }).replace(/\//g, '-'),
            });
        });
        
        try {
            var request_json = JSON.stringify(roomRequests);
            console.log('提交数据:', request_json);
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://112.124.36.214:5001/api/fliggy/hotel_results",
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache",
                        "Pragma": "no-cache"
                    },
                    data: request_json,
                    responseType: "json",
                    timeout: 10000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: () => reject(new Error("请求超时"))
                });
            });

            if (response.status === 200 && response.response?.success) {
                const recordCount = response.response.data.id_list.length;
                console.log('提交成功:', response.response);
                alert(`数据提交成功！共提交了 ${recordCount} 条记录。`);
            } else {
                throw new Error(response.response?.msg || '提交失败');
            }
        } catch (error) {
            console.error('提交数据失败:', error);
            alert('提交数据失败，请稍后重试！');
        } finally {
            isProcessing = false;
        }
    }

    // 启动脚本
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();