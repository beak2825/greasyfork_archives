// ==UserScript==
// @name         图寻复盘助手
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  新一代复盘助手，更精美的UI、更高效的复盘
// @author       zbmin
// @match        https://tuxun.fun/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541918/%E5%9B%BE%E5%AF%BB%E5%A4%8D%E7%9B%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541918/%E5%9B%BE%E5%AF%BB%E5%A4%8D%E7%9B%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试模式开关
    const DEBUG_MODE = true;
    // 百度地图API密钥
    // 获取方式：https://lbsyun.baidu.com/apiconsole/key，完成实名认证后，创建应用，选择应用类型浏览器端，IP白名单填写*，完成后复制AK
    const BAIDU_AK = '请在此处输入你的百度开发者AK';

    // 日志函数
    function log(...args) {
        if (DEBUG_MODE) {
            console.log('[图寻小助手-Log]', ...args);
        }
    }

    function error(...args) {
        if (DEBUG_MODE) {
            console.error('[图寻小助手-Err]', ...args);
        }
    }

    // 保存原始的fetch函数
    const originalFetch = window.fetch;

    // 保存原始的XMLHttpRequest
    const OriginalXHR = window.XMLHttpRequest;

    // 创建调试面板元素
    function createDebugPanel() {
        log('创建调试面板...');

        const panel = document.createElement('div');
        panel.id = 'tuxun-debug-panel';
        panel.className = 'fixed top-[30px] left-4 w-[50%] max-w-[1200px] bg-white/95 rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200 transition-all duration-300 hidden';

        // 面板头部
        const header = document.createElement('div');
        header.className = 'bg-gray-800 text-white px-4 py-2 flex justify-between items-center';
        header.innerHTML = `
            <div class="flex items-center flex-wrap gap-2">
                <h3 class="font-semibold mr-3">图寻复盘助手 v0.8</h3>
                <span id="tuxun-status" class="text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full">等待请求</span>
                <span id="tuxun-map-type" class="text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full ml-2">未检测</span>
            </div>
            <div class="flex space-x-2">
                <button id="tuxun-close-btn" class="text-white hover:text-gray-300 transition-colors">
                    <i class="fa fa-times"></i>
                </button>
            </div>
        `;

        // 面板内容区域 - 分为左右两栏
        const content = document.createElement('div');
        content.id = 'tuxun-debug-content';
        content.className = 'flex flex-col md:flex-row max-h-[70vh] overflow-hidden';

        // 左侧：原始响应
        const rawSection = document.createElement('div');
        rawSection.id = 'tuxun-raw-section';
        rawSection.className = 'md:w-1/2 p-4 overflow-y-auto bg-gray-50 border-r border-gray-200';
        rawSection.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-800">原始响应</h4>
                <span id="tuxun-raw-size" class="text-xs text-gray-500">0 KB</span>
            </div>
            <pre id="tuxun-raw-response" class="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto text-xs">等待响应...</pre>
        `;

        // 右侧：解析后信息
        const parsedSection = document.createElement('div');
        parsedSection.id = 'tuxun-parsed-section';
        parsedSection.className = 'md:w-1/2 p-4 overflow-y-auto bg-gray-50';
        parsedSection.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-800">解析后信息</h4>
                <span id="tuxun-parsed-time" class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    未捕获请求
                </span>
            </div>
            <div id="tuxun-parsed-content">
                <p class="text-gray-500 italic">等待街景...</p>
            </div>
        `;

        content.appendChild(rawSection);
        content.appendChild(parsedSection);

        // 面板底部
        const footer = document.createElement('div');
        footer.className = 'bg-gray-100 px-4 py-2 flex justify-between items-center border-t border-gray-200';
        footer.innerHTML = `
            <div class="flex items-center space-x-3">
                <button id="tuxun-copy-raw-btn" class="text-sm bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded transition-colors">
                    <i class="fa fa-copy mr-1"></i> 复制原始
                </button>
                <button id="tuxun-copy-parsed-btn" class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors">
                    <i class="fa fa-copy mr-1"></i> 复制解析
                </button>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-xs text-gray-500">调试模式: <span id="tuxun-debug-mode">开启</span></span>
                <button id="tuxun-refresh-btn" class="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors">
                    <i class="fa fa-refresh mr-1"></i> 重置
                </button>
            </div>
        `;

        panel.appendChild(header);
        panel.appendChild(content);
        panel.appendChild(footer);
        document.body.appendChild(panel);

        // 添加事件监听器
        document.getElementById('tuxun-close-btn').addEventListener('click', closePanel);
        document.getElementById('tuxun-copy-raw-btn').addEventListener('click', () => copyToClipboard('tuxun-raw-response', '原始响应'));
        document.getElementById('tuxun-copy-parsed-btn').addEventListener('click', () => copyToClipboard('tuxun-parsed-content', '解析后信息'));
        document.getElementById('tuxun-refresh-btn').addEventListener('click', resetDebugger);

        log('调试面板创建完成');
        return panel;
    }

    // 创建重新打开按钮
    function createReopenButton() {
        const button = document.createElement('button');
        button.id = 'tuxun-reopen-btn';
        button.className = 'fixed top-4 left-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow-lg z-50 transition-all duration-300 hover:scale-110';
        button.innerHTML = '<i class="fa fa-bug mr-1"></i> 复盘工具';

        button.addEventListener('click', openPanel);
        document.body.appendChild(button);

        return button;
    }

    // 打开面板
    function openPanel() {
        const panel = document.getElementById('tuxun-debug-panel');
        const reopenBtn = document.getElementById('tuxun-reopen-btn');

        if (panel) {
            panel.classList.remove('hidden');
            reopenBtn.classList.add('hidden');
            log('面板已重新打开');
            //showNotification('调试面板已重新打开');
        }
    }

    // 关闭面板
    function closePanel() {
        const panel = document.getElementById('tuxun-debug-panel');
        const reopenBtn = document.getElementById('tuxun-reopen-btn');

        if (panel) {
            panel.classList.add('hidden');
            reopenBtn.classList.remove('hidden');
            log('面板已关闭');
        }
    }

    // 复制内容到剪贴板
    function copyToClipboard(elementId, type) {
        const element = document.getElementById(elementId);
        const text = element.textContent || element.innerText;

        navigator.clipboard.writeText(text)
            .then(() => {
                showNotification(`${type}已复制到剪贴板`);
                log(`${type}复制成功`);
            })
            .catch(err => {
                showNotification(`复制${type}失败: ${err.message}`, true);
                error(`复制${type}失败`, err);
            });
    }

    // 显示通知
    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50 transition-all duration-300 transform translate-y-10 opacity-0 ${
            isError ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // 显示通知
        setTimeout(() => {
            notification.classList.remove('translate-y-10', 'opacity-0');
        }, 10);

        // 隐藏通知
        setTimeout(() => {
            notification.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => notification.remove(), 200);
        }, 3000);
    }

    // 格式化JSON响应为HTML
    function formatJsonResponse(json) {
        return JSON.stringify(json, null, 2)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
                let cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="json-' + cls + '">' + match + '</span>';
            });
    }

    // 创建解析后的响应内容
    function createParsedContent(responseData, mapType) {
        const parsedContent = document.getElementById('tuxun-parsed-content');
        parsedContent.innerHTML = '';

        // 地图类型标识
        let mapTypeBadge;
        let mapTypeColor;
        if (mapType === 'baidu') {
            mapTypeBadge = '百度街景';
            mapTypeColor = 'bg-blue-100 text-blue-800';
        } else if (mapType === 'tencent') {
            mapTypeBadge = '腾讯街景';
            mapTypeColor = 'bg-green-100 text-green-800';
        } else if (mapType === 'google') {
            mapTypeBadge = '谷歌街景';
            mapTypeColor = 'bg-red-100 text-red-800';
        }

        const mapTypeBadgeHtml = `<span class="inline-block px-2 py-0.5 ${mapTypeColor} text-xs rounded-full mb-2">${mapTypeBadge}</span>`;

        // 添加基本信息卡片
        const infoCard = document.createElement('div');
        infoCard.className = 'bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200';

        let lat, lng;

        // 百度和腾讯街景信息解析
        if (mapType === 'baidu' || mapType === 'tencent') {
            lat = responseData.data.lat;
            lng = responseData.data.lng;

            infoCard.innerHTML = `
                ${mapTypeBadgeHtml}
                <h5 class="font-medium text-gray-800 mb-3">基本信息</h5>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-50 p-2 rounded">
                        <span class="text-xs text-gray-500 block">Pano ID</span>
                        <div class="font-medium text-gray-800 break-all"><span class="cursor-pointer hover:underline" onclick="navigator.clipboard.writeText('${responseData.data.pano}').then(() => showNotification('Pano ID已复制')).catch(err => showNotification('复制失败', true))">${responseData.data.pano}</span></div>
                    </div>
                    <div class="bg-gray-50 p-2 rounded">
                        <span class="text-xs text-gray-500 block">坐标 (WGS84)</span>
                        <span class="font-medium text-gray-800">${lat.toFixed(6)}, ${lng.toFixed(6)}</span>
                    </div>
                    <div class="bg-gray-50 p-2 rounded">
                        <span class="text-xs text-gray-500 block">坐标 (BD09)</span>
                        <span class="font-medium text-gray-800">${responseData.data.bd09Lat.toFixed(6)}, ${responseData.data.bd09Lng.toFixed(6)}</span>
                    </div>
                    <div class="bg-gray-50 p-2 rounded">
                        <span class="text-xs text-gray-500 block">初始方向</span>
                        <span class="font-medium text-gray-800">${responseData.data.centerHeading}°</span>
                    </div>
                </div>
            `;
        }
        // 谷歌街景信息解析
        else if (mapType === 'google') {
            // 解析谷歌街景数据
            const panoId = responseData[1][0][1][1];
            const location = responseData[1][0][5][1][2];
            lat = location[2];
            lng = location[3];
            const heading = responseData[1][0][5][1][4];
            const address = responseData[1][0][3][2][0][0];
            const copyright = responseData[1][0][4][0][0][0];

            infoCard.innerHTML = `
                ${mapTypeBadgeHtml}
                <h5 class="font-medium text-gray-800 mb-3">基本信息</h5>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-50 p-2 rounded">
                        <span class="text-xs text-gray-500 block">Pano ID</span>
                        <div class="font-medium text-gray-800 break-all"><span class="cursor-pointer hover:underline" onclick="navigator.clipboard.writeText('${panoId}').then(() => showNotification('Pano ID已复制')).catch(err => showNotification('复制失败', true))">${panoId}</span></div>
                    </div>
                    <div class="bg-gray-50 p-2 rounded">
                        <span class="text-xs text-gray-500 block">坐标</span>
                        <span class="font-medium text-gray-800">${lat.toFixed(6)}, ${lng.toFixed(6)}</span>
                    </div>
                    <div class="bg-gray-50 p-2 rounded">
                        <span class="text-xs text-gray-500 block">初始方向</span>
                        <span class="font-medium text-gray-800">${heading}°</span>
                    </div>
                    <div class="bg-gray-50 p-2 rounded">
                        <span class="text-xs text-gray-500 block">地址</span>
                        <span class="font-medium text-gray-800">${address}</span>
                    </div>
                </div>
                <div class="mt-3 bg-gray-50 p-2 rounded">
                    <span class="text-xs text-gray-500 block">版权信息</span>
                    <span class="font-medium text-gray-800">${copyright}</span>
                </div>
            `;
        }

        parsedContent.appendChild(infoCard);

        // 百度和腾讯街景相邻街景信息
        if (mapType === 'baidu' || mapType === 'tencent') {
            // 添加相邻街景信息
            const linksSection = document.createElement('div');
            linksSection.className = 'bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200';
            linksSection.innerHTML = `
                <div class="flex items-center justify-between mb-3">
                    <h5 class="font-medium text-gray-800">相邻街景 (${responseData.data.links.length})</h5>
                    <span class="text-xs text-gray-500">点击复制Pano ID</span>
                </div>
                <div id="tuxun-links-list" class="space-y-2">
                    ${responseData.data.links.map((link, index) => `
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer" data-pano="${link.pano}">
                            <div class="flex justify-between">
                                <span class="font-medium text-gray-800">街景 ${index + 1}</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                    ${link.heading.toFixed(2)}°
                                </span>
                            </div>
                            <div class="mt-1 grid grid-cols-2 gap-2">
                                <div>
                                    <span class="text-xs text-gray-500 block">Pano ID</span>
                                    <div class="text-sm text-gray-800 break-all">${link.pano}</div>
                                </div>
                                <div>
                                    <span class="text-xs text-gray-500 block">目标方向</span>
                                    <span class="text-sm text-gray-800">${link.centerHeading}°</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            parsedContent.appendChild(linksSection);

            // 为每个相邻街景添加点击事件
            document.querySelectorAll('#tuxun-links-list > div').forEach(link => {
                link.addEventListener('click', () => {
                    const pano = link.getAttribute('data-pano');
                    navigator.clipboard.writeText(pano)
                        .then(() => showNotification(`已复制Pano ID: ${pano}`))
                        .catch(err => showNotification('复制失败', true));
                });
            });
        }

        // 添加位置解析信息
        addLocationInfoSection(lat, lng, mapType);

        // 添加响应结构分析
        const structureSection = document.createElement('div');
        structureSection.className = 'bg-white rounded-lg shadow-sm p-4 border border-gray-200';

        if (mapType === 'baidu' || mapType === 'tencent') {
            structureSection.innerHTML = `
                <h5 class="font-medium text-gray-800 mb-3">响应结构分析</h5>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div class="text-blue-600 text-2xl font-bold">${Object.keys(responseData).length}</div>
                        <div class="text-xs text-blue-700 mt-1">顶层字段</div>
                    </div>
                    <div class="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div class="text-green-600 text-2xl font-bold">${Object.keys(responseData.data).length}</div>
                        <div class="text-xs text-green-700 mt-1">数据字段</div>
                    </div>
                    <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <div class="text-yellow-600 text-2xl font-bold">${responseData.data.links.length}</div>
                        <div class="text-xs text-yellow-700 mt-1">相邻节点</div>
                    </div>
                    <div class="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <div class="text-purple-600 text-2xl font-bold">${JSON.stringify(responseData).length}</div>
                        <div class="text-xs text-purple-700 mt-1">字符长度</div>
                    </div>
                </div>
            `;
        } else if (mapType === 'google') {
            structureSection.innerHTML = `
                <h5 class="font-medium text-gray-800 mb-3">响应结构分析</h5>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div class="text-blue-600 text-2xl font-bold">${responseData.length}</div>
                        <div class="text-xs text-blue-700 mt-1">顶层元素</div>
                    </div>
                    <div class="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div class="text-green-600 text-2xl font-bold">${responseData[1][0].length}</div>
                        <div class="text-xs text-green-700 mt-1">数据字段</div>
                    </div>
                    <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <div class="text-yellow-600 text-2xl font-bold">${responseData[1][0][5][1].length}</div>
                        <div class="text-xs text-yellow-700 mt-1">位置信息</div>
                    </div>
                    <div class="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <div class="text-purple-600 text-2xl font-bold">${JSON.stringify(responseData).length}</div>
                        <div class="text-xs text-purple-700 mt-1">字符长度</div>
                    </div>
                </div>
            `;
        }

        parsedContent.appendChild(structureSection);

        log('解析后内容已生成');
    }

    // 添加位置信息区域
    function addLocationInfoSection(lat, lng, mapType) {
        const parsedContent = document.getElementById('tuxun-parsed-content');

        // 创建位置信息卡片
        const locationCard = document.createElement('div');
        locationCard.className = 'bg-white rounded-lg shadow-sm p-4 mt-4 border border-gray-200';
        locationCard.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <h5 class="font-medium text-gray-800">位置解析</h5>
                <div class="flex items-center space-x-2">
                    <span id="tuxun-location-status" class="text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full">
                        等待解析
                    </span>
                    <button id="tuxun-refresh-location-btn" class="text-xs text-blue-500 hover:text-blue-700">
                        <i class="fa fa-refresh mr-1"></i> 重新解析
                    </button>
                </div>
            </div>
            <div id="tuxun-location-info">
                <p class="text-gray-500 italic">正在使用百度地图API解析位置信息...</p>
            </div>
        `;

        parsedContent.appendChild(locationCard);

        // 添加重新解析按钮事件
        document.getElementById('tuxun-refresh-location-btn').addEventListener('click', () => {
            const locationInfo = document.getElementById('tuxun-location-info');
            const locationStatus = document.getElementById('tuxun-location-status');

            locationInfo.innerHTML = '<p class="text-gray-500 italic">正在重新解析位置信息...</p>';
            locationStatus.textContent = '解析中';
            locationStatus.className = 'text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full';

            fetchLocationInfo(lat, lng);
        });

        // 立即开始解析位置
        fetchLocationInfo(lat, lng);
    }

// 新增：加载百度地图JS API并解析位置
function fetchLocationInfo(lat, lng) {
    const locationInfo = document.getElementById('tuxun-location-info');
    const locationStatus = document.getElementById('tuxun-location-status');

    // 显示加载状态
    locationInfo.innerHTML = '<p class="text-gray-500 italic">正在加载地图API并解析位置...</p>';
    locationStatus.textContent = '加载中';
    locationStatus.className = 'text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full';

    // 检查百度地图API是否已加载
    if (window.BMap) {
        doGeocode(lat, lng);
        return;
    }

    // 首次加载百度地图API
    const script = document.createElement('script');
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${BAIDU_AK}&callback=initBaiduMap`;
    script.type = 'text/javascript';
    document.head.appendChild(script);

    // 定义全局回调函数
    window.initBaiduMap = function() {
        doGeocode(lat, lng);
    };

    // 超时处理
    setTimeout(() => {
        if (!window.BMap) {
            locationInfo.innerHTML = '<p class="text-red-500">百度地图API加载超时，请重试</p>';
            locationStatus.textContent = '加载失败';
            locationStatus.className = 'text-xs bg-red-500 text-white px-2 py-0.5 rounded-full';
        }
    }, 5000);
}

// 新增：执行逆地理编码
function doGeocode(lat, lng) {
    const locationInfo = document.getElementById('tuxun-location-info');
    const locationStatus = document.getElementById('tuxun-location-status');

    try {
        // 创建坐标点（WGS84转百度坐标）
        const point = new BMap.Point(lng, lat);
        const convertor = new BMap.Convertor();
        const points = [point];

        // 坐标转换（WGS84 -> BD09）
        convertor.translate(points, 1, 5, (data) => {
            if (data.status === 0) {
                const bdPoint = data.points[0];

                // 创建逆地理编码器
                const geoc = new BMap.Geocoder();
                geoc.getLocation(bdPoint, (rs) => {
                    const address = rs.addressComponents;
                    const formattedAddress = rs.formattedAddress;

                    // 显示解析结果
                    locationInfo.innerHTML = `
                        <div class="space-y-3">
                            <div class="bg-gray-50 p-3 rounded-lg">
                                <span class="text-xs text-gray-500 block">详细地址</span>
                                <div class="font-medium text-gray-800">${formattedAddress}</div>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div class="bg-gray-50 p-3 rounded-lg">
                                    <span class="text-xs text-gray-500 block">省/市/区</span>
                                    <div class="font-medium text-gray-800">${address.province} ${address.city} ${address.district}</div>
                                </div>
                                <div class="bg-gray-50 p-3 rounded-lg">
                                    <span class="text-xs text-gray-500 block">街道信息</span>
                                    <div class="font-medium text-gray-800">${address.street} ${address.streetNumber}</div>
                                </div>
                            </div>
                            <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <span class="text-xs text-blue-700 block">查看地图</span>
                                <a href="https://map.baidu.com/search/${lat},${lng}" target="_blank" class="font-medium text-blue-600 hover:underline">
                                    <i class="fa fa-map-o mr-1"></i> 在百度地图中查看
                                </a>
                            </div>
                        </div>
                    `;

                    locationStatus.textContent = '解析成功';
                    locationStatus.className = 'text-xs bg-green-500 text-white px-2 py-0.5 rounded-full';
                    showNotification('百度API地点解析成功');
                });
            } else {
                throw new Error('坐标转换失败，错误码：' + data.status);
            }
        });
    } catch (error) {
        locationInfo.innerHTML = `
            <div class="bg-red-50 p-3 rounded-lg border border-red-200">
                <div class="font-medium text-red-800">解析失败</div>
                <div class="text-sm text-red-600 mt-1">${error.message}</div>
            </div>
        `;

        locationStatus.textContent = '解析失败';
        locationStatus.className = 'text-xs bg-red-500 text-white px-2 py-0.5 rounded-full';
        error('位置解析失败:', error);
        showNotification('位置解析失败: ' + error.message, true);
    }
}

    // 注入Tailwind CSS
    function injectTailwindCSS() {
        log('注入Tailwind CSS和Font Awesome...');

        const tailwindScript = document.createElement('script');
        tailwindScript.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(tailwindScript);

        const fontAwesome = document.createElement('link');
        fontAwesome.href = 'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css';
        fontAwesome.rel = 'stylesheet';
        document.head.appendChild(fontAwesome);

        // 配置Tailwind自定义颜色
        tailwindScript.onload = function() {
            const style = document.createElement('style');
            style.textContent = `
                @layer utilities {
                    .content-auto {
                        content-visibility: auto;
                    }
                    .json-key {
                        color: #e53e3e;
                    }
                    .json-string {
                        color: #48bb78;
                    }
                    .json-number {
                        color: #3182ce;
                    }
                    .json-boolean {
                        color: #f6ad55;
                    }
                    .json-null {
                        color: #b7791f;
                    }
                }
            `;
            document.head.appendChild(style);

            log('Tailwind CSS配置完成');
        };
    }

    // 重置调试器
    function resetDebugger() {
        log('重置调试器...');

        const rawResponse = document.getElementById('tuxun-raw-response');
        const parsedContent = document.getElementById('tuxun-parsed-content');
        const status = document.getElementById('tuxun-status');
        const parsedTime = document.getElementById('tuxun-parsed-time');
        const rawSize = document.getElementById('tuxun-raw-size');
        const mapType = document.getElementById('tuxun-map-type');
        const locationStatus = document.getElementById('tuxun-location-status');

        rawResponse.textContent = '等待响应...';
        parsedContent.innerHTML = '<p class="text-gray-500 italic">等待getPanoInfo、getQQPanoInfo或谷歌街景请求...</p>';
        status.textContent = '等待请求';
        status.className = 'text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full';
        parsedTime.textContent = '未捕获请求';
        rawSize.textContent = '0 KB';
        mapType.textContent = '未检测';
        mapType.className = 'text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full ml-2';

        if (locationStatus) {
            locationStatus.textContent = '等待解析';
            locationStatus.className = 'text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full';
        }

        // 隐藏面板
        const panel = document.getElementById('tuxun-debug-panel');
        const reopenBtn = document.getElementById('tuxun-reopen-btn');
        if (panel) {
            panel.classList.add('hidden');
            reopenBtn.classList.remove('hidden');
        }

        showNotification('调试器已重置');
        log('调试器重置完成');
    }

    // 初始化调试面板
    injectTailwindCSS();
    const debugPanel = createDebugPanel();
    const reopenBtn = createReopenButton();



    // 重写fetch函数以拦截请求
    window.fetch = async function(input, init) {
        const url = typeof input === 'string' ? input : input.url;

        // 记录所有fetch请求（调试用）
        log('拦截到fetch请求:', url);

        // 检查是否是百度街景请求
        const baiduPanoRegex = /https:\/\/tuxun\.fun\/api\/v0\/tuxun\/mapProxy\/getPanoInfo/;
        // 检查是否是腾讯街景请求
        const tencentPanoRegex = /https:\/\/tuxun\.fun\/api\/v0\/tuxun\/mapProxy\/getQQPanoInfo/;
        // 检查是否是谷歌街景请求
        const googlePanoRegex = /https:\/\/tile\.chao-fan\.com\/\$rpc\/google\.internal\.maps\.mapsjs\.v1\.MapsJsInternalService\/GetMetadata/;

        if (baiduPanoRegex.test(url)) {
            log('检测到百度街景getPanoInfo请求!');
            handlePanoRequest(url, 'baidu');
        } else if (tencentPanoRegex.test(url)) {
            log('检测到腾讯街景getQQPanoInfo请求!');
            handlePanoRequest(url, 'tencent');
        } else if (googlePanoRegex.test(url)) {
            log('检测到谷歌街景请求!');
            handlePanoRequest(url, 'google');
        }

        // 非目标请求，直接执行
        return originalFetch(input, init);
    };

    // 处理街景请求
    async function handlePanoRequest(url, mapType) {
        // 更新地图类型显示
        const mapTypeElement = document.getElementById('tuxun-map-type');
        mapTypeElement.textContent = mapType === 'baidu' ? '百度街景' : mapType === 'tencent' ? '腾讯街景' : '谷歌街景';
        mapTypeElement.className = `text-xs ${mapType === 'baidu' ? 'bg-blue-500' : mapType === 'tencent' ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-0.5 rounded-full ml-2`;

        // 记录请求参数
        const urlObj = new URL(url);
        let panoId = '';

        if (mapType === 'baidu' || mapType === 'tencent') {
            panoId = urlObj.searchParams.get('pano');
        } else if (mapType === 'google') {
            // 谷歌街景的panoId在请求体中，这里无法直接获取
            panoId = '需从响应中解析';
        }

        log(`${mapType === 'baidu' ? '百度' : mapType === 'tencent' ? '腾讯' : '谷歌'}街景请求的Pano ID:`, panoId);

        // 更新状态
        const status = document.getElementById('tuxun-status');
        status.textContent = '正在请求';
        status.className = 'text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full';

        // 显示面板
        const panel = document.getElementById('tuxun-debug-panel');
        const reopenBtn = document.getElementById('tuxun-reopen-btn');
        if (panel) {
            panel.classList.remove('hidden');
            reopenBtn.classList.add('hidden');
        }

        try {
            // 记录请求开始时间
            const startTime = performance.now();
            log('请求开始时间:', new Date().toLocaleString());

            // 创建对应的请求对象
            let response;
            if (mapType === 'baidu') {
                response = await originalFetch(url);
            } else if (mapType === 'tencent') {
                // 腾讯街景请求需要添加Referer
                response = await originalFetch(url, {
                    headers: {
                        'Referer': 'https://tuxun.fun/'
                    }
                });
            } else if (mapType === 'google') {
                // 谷歌街景请求
                response = await originalFetch(url, {
                    headers: {
                        'Referer': 'https://tuxun.fun/'
                    }
                });
            }

            const responseClone = response.clone();

            // 记录请求完成时间
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2);
            log(`请求完成，耗时: ${duration}ms`);

            // 记录响应状态
            log('响应状态:', response.status);

            // 更新状态
            status.textContent = '解析中';
            status.className = 'text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full';

            // 解析响应JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const jsonData = await responseClone.json();

                // 记录响应内容
                log(`${mapType === 'baidu' ? '百度' : mapType === 'tencent' ? '腾讯' : '谷歌'}街景响应JSON:`, jsonData);

                // 计算响应大小
                const responseSize = (JSON.stringify(jsonData).length / 1024).toFixed(2);

                // 在面板中显示原始响应
                const rawResponse = document.getElementById('tuxun-raw-response');
                rawResponse.textContent = JSON.stringify(jsonData, null, 2);

                // 更新响应时间和大小
                document.getElementById('tuxun-parsed-time').textContent = new Date().toLocaleString();
                document.getElementById('tuxun-raw-size').textContent = `${responseSize} KB`;

                // 显示解析后内容
                createParsedContent(jsonData, mapType);

                // 更新状态
                status.textContent = '已捕获';
                status.className = 'text-xs bg-green-500 text-white px-2 py-0.5 rounded-full';

                showNotification(`成功捕获${mapType === 'baidu' ? '百度' : mapType === 'tencent' ? '腾讯' : '谷歌'}街景响应`);
                log('响应已成功显示在面板中');
            } else {
                const responseText = await responseClone.text();
                const rawResponse = document.getElementById('tuxun-raw-response');
                rawResponse.textContent = `非JSON响应 (${contentType}):\n\n${responseText.substring(0, 500)}...`;

                error('响应不是JSON格式:', contentType);
                showNotification('响应不是JSON格式', true);

                // 更新状态
                status.textContent = '格式错误';
                status.className = 'text-xs bg-red-500 text-white px-2 py-0.5 rounded-full';
            }

            return response;
        } catch (error) {
            const rawResponse = document.getElementById('tuxun-raw-response');
            rawResponse.textContent = `请求出错:\n\n${error.message}`;

            error('拦截请求出错:', error);
            showNotification('请求处理失败: ' + error.message, true);

            // 更新状态
            status.textContent = '请求失败';
            status.className = 'text-xs bg-red-500 text-white px-2 py-0.5 rounded-full';

            throw error;
        }
    }

    // 重写XMLHttpRequest以拦截请求
    window.XMLHttpRequest = function() {
        const xhr = new OriginalXHR();

        // 保存原始的open和send方法
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        // 重写open方法，记录请求信息
        xhr.open = function(method, url) {
            // 记录所有XHR请求
            log('拦截到XHR请求:', url);

            // 保存请求URL用于后续检查
            this._url = url;

            return originalOpen.apply(this, arguments);
        };

        // 重写send方法，在响应完成后处理
        xhr.send = function() {
            // 监听load事件，获取响应
            xhr.addEventListener('load', () => {
                const url = this._url;

                // 检查是否是百度街景请求
                const baiduPanoRegex = /https:\/\/tuxun\.fun\/api\/v0\/tuxun\/mapProxy\/getPanoInfo/;
                // 检查是否是腾讯街景请求
                const tencentPanoRegex = /https:\/\/tuxun\.fun\/api\/v0\/tuxun\/mapProxy\/getQQPanoInfo/;
                // 检查是否是谷歌街景请求
                const googlePanoRegex = /https:\/\/tile\.chao-fan\.com\/\$rpc\/google\.internal\.maps\.mapsjs\.v1\.MapsJsInternalService\/GetMetadata/;

                if (baiduPanoRegex.test(url)) {
                    log('检测到百度街景getPanoInfo XHR请求!');
                    handleXHRPanoResponse(xhr, 'baidu');
                } else if (tencentPanoRegex.test(url)) {
                    log('检测到腾讯街景getQQPanoInfo XHR请求!');
                    handleXHRPanoResponse(xhr, 'tencent');
                } else if (googlePanoRegex.test(url)) {
                    log('检测到谷歌街景XHR请求!');
                    handleXHRPanoResponse(xhr, 'google');
                }
            });

            return originalSend.apply(this, arguments);
        };

        return xhr;
    };

    // 处理XHR街景响应
    function handleXHRPanoResponse(xhr, mapType) {
        // 更新地图类型显示
        const mapTypeElement = document.getElementById('tuxun-map-type');
        mapTypeElement.textContent = mapType === 'baidu' ? '百度街景' : mapType === 'tencent' ? '腾讯街景' : '谷歌街景';
        mapTypeElement.className = `text-xs ${mapType === 'baidu' ? 'bg-blue-500' : mapType === 'tencent' ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-0.5 rounded-full ml-2`;

        // 记录请求参数
        const urlObj = new URL(xhr._url);
        let panoId = '';

        if (mapType === 'baidu' || mapType === 'tencent') {
            panoId = urlObj.searchParams.get('pano');
        } else if (mapType === 'google') {
            // 谷歌街景的panoId在请求体中，这里无法直接获取
            panoId = '需从响应中解析';
        }

        log(`${mapType === 'baidu' ? '百度' : mapType === 'tencent' ? '腾讯' : '谷歌'}街景XHR请求的Pano ID:`, panoId);

        // 更新状态
        const status = document.getElementById('tuxun-status');
        status.textContent = '正在请求';
        status.className = 'text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full';

        // 显示面板
        //const panel = document.getElementById('tuxun-debug-panel');
        //const reopenBtn = document.getElementById('tuxun-reopen-btn');
        //if (panel) {
        //    panel.classList.remove('hidden');
        //    reopenBtn.classList.add('hidden');
        //}

        try {
            // 尝试解析响应
            const responseText = xhr.responseText;

            // 先检查是否是JSON格式
            let jsonData;
            try {
                jsonData = JSON.parse(responseText);

                // 记录响应内容
                log(`${mapType === 'baidu' ? '百度' : mapType === 'tencent' ? '腾讯' : '谷歌'}街景XHR响应JSON:`, jsonData);

                // 计算响应大小
                const responseSize = (responseText.length / 1024).toFixed(2);

                // 在面板中显示原始响应
                const rawResponse = document.getElementById('tuxun-raw-response');
                rawResponse.textContent = JSON.stringify(jsonData, null, 2);

                // 更新响应时间和大小
                document.getElementById('tuxun-parsed-time').textContent = new Date().toLocaleString();
                document.getElementById('tuxun-raw-size').textContent = `${responseSize} KB`;

                // 显示解析后内容
                createParsedContent(jsonData, mapType);

                // 更新状态
                status.textContent = '已捕获';
                status.className = 'text-xs bg-green-500 text-white px-2 py-0.5 rounded-full';

                showNotification(`成功捕获${mapType === 'baidu' ? '百度' : mapType === 'tencent' ? '腾讯' : '谷歌'}街景XHR响应`);
                log('XHR响应已成功显示在面板中');
            } catch (parseError) {
                // 不是JSON格式
                const rawResponse = document.getElementById('tuxun-raw-response');
                rawResponse.textContent = `非JSON响应:\n\n${responseText.substring(0, 500)}...`;

                error('XHR响应不是JSON格式:', parseError);
                // showNotification('XHR响应不是JSON格式', true);

                // 更新状态
                status.textContent = '格式错误';
                status.className = 'text-xs bg-red-500 text-white px-2 py-0.5 rounded-full';
            }
        } catch (error) {
            const rawResponse = document.getElementById('tuxun-raw-response');
            rawResponse.textContent = `XHR请求出错:\n\n${error.message}`;

            error('处理XHR请求出错:', error);
            showNotification('XHR请求处理失败: ' + error.message, true);

            // 更新状态
            status.textContent = '请求失败';
            status.className = 'text-xs bg-red-500 text-white px-2 py-0.5 rounded-full';
        }
    }
})();