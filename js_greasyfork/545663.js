// ==UserScript==
// @name         ThreatIntel Auto Popup
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  选中文本自动弹窗查询奇安信威胁情报（支持IP、域名、MD5、SHA1、URL）
// @author       wooluo
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545663/ThreatIntel%20Auto%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/545663/ThreatIntel%20Auto%20Popup.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置区
    const CONFIG = {
        // 替换为你自己的 Token 和 API Key
        API_TOKENS: {
            sandbox: 'xxxxxxxxxx', // 情报沙箱 Token
            threat: 'xxxxxxxxxxxxxxxxxx',   // 威胁情报 API Key
        },
        // 启用详细错误提示
        ENABLE_DETAILED_ERRORS: true,
        // API 版本
        API_VERSION: 'v3',
        // API 地址
        API_URLS: {
            sandbox: (token) => `https://sandbox.ti.qianxin.com/sandbox/api/v1/token/${token}/report`,
            ip_reputation: `https://webapi.ti.qianxin.com/ip/v3/reputation`,
            file_reputation: `https://ti.qianxin.com/api/v2/malfile`,
            url_reputation: `https://a.ti.qianxin.com/url/v1/CheckUrls`,
            compromise: `https://ti.qianxin.com/api/v2/compromise`
        },
        // 查询缓存过期时间(毫秒)
        CACHE_EXPIRE_TIME: 3600000, // 1小时
        // 最大缓存条目数
        MAX_CACHE_ITEMS: 100,
        // 防抖时间(毫秒)
        DEBOUNCE_TIME: 500,
        // 弹窗显示时间(毫秒)
        TOOLTIP_SHOW_TIME: 15000,
        // 是否允许手动关闭弹窗
        ALLOW_MANUAL_CLOSE: true,
        // 调试模式
        DEBUG_MODE: true
    };

    // 类型检测正则
    const PATTERNS = {
        // 局域网IP检测
        privateIp: /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3})|(172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})|(192\.168\.\d{1,3}\.\d{1,3})$/,
        md5: /^[a-f0-9]{32}$/i,
        sha1: /^[a-f0-9]{40}$/i,
        ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::\d+)?$|(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){0,7}|:))(?::\d+)?/,
        domain: /^[a-zA-Z0-9][a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}$/,
        url: /^https?:\/\/[^\s$.?#].[^\s]*$/i
    };

    // 查询缓存
    const queryCache = {};
    // 缓存键列表，用于实现LRU缓存
    const cacheKeys = [];

    /**
     * 检测文本类型
     * @param {string} text - 要检测的文本
     * @returns {string|null} - 检测到的类型或null
     */
    function detectType(text) {
        // 先检查是否是URL，因为URL可能包含域名
        if (PATTERNS.url.test(text)) {
            return 'url';
        }
        // 检查其他类型
        return Object.entries(PATTERNS).find(([key, regex]) => key !== 'url' && regex.test(text))?.[0];
    }

    /**
 * 显示提示框
 * @param {string} content - 提示内容
 * @param {number} x - 鼠标X坐标
 * @param {number} y - 鼠标Y坐标
 */
function showTooltip(content, x = 20, y = 20) {
    // 移除已有的提示框
    const existingTooltip = document.getElementById('threat-intel-tooltip');
    if (existingTooltip && existingTooltip.parentNode === document.body) {
        document.body.removeChild(existingTooltip);
    }

    const tooltip = document.createElement('div');
    tooltip.id = 'threat-intel-tooltip';
    tooltip.style = `
        position: fixed;
        top: ${y}px;
        left: ${x}px;
        background: #222;
        color: #fff;
        padding: 15px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 99999;
        max-width: 500px;
        word-break: break-all;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
    `;

        // 如果允许手动关闭，添加关闭按钮
        if (CONFIG.ALLOW_MANUAL_CLOSE) {
            const closeBtn = document.createElement('span');
            closeBtn.style = 'position: absolute; top: 5px; right: 10px; cursor: pointer; color: #aaa;';
            closeBtn.innerHTML = '×';
            closeBtn.onclick = () => {
                if (tooltip.parentNode === document.body) {
                    document.body.removeChild(tooltip);
                }
            };
            tooltip.appendChild(closeBtn);
        }

        tooltip.innerHTML += content;
        document.body.appendChild(tooltip);

        setTimeout(() => {
            const tooltipToRemove = document.getElementById('threat-intel-tooltip');
            if (tooltipToRemove && tooltipToRemove.parentNode === document.body) {
                document.body.removeChild(tooltipToRemove);
            }
        }, CONFIG.TOOLTIP_SHOW_TIME);
    }

    /**
     * 检查缓存是否有效
     * @param {string} key - 缓存键
     * @returns {boolean} - 缓存是否有效
     */
    function isCacheValid(key) {
        if (!queryCache[key]) return false;
        const now = Date.now();
        return now - queryCache[key].timestamp < CONFIG.CACHE_EXPIRE_TIME;
    }

    /**
     * 更新缓存
     * @param {string} key - 缓存键
     * @param {string} result - 缓存结果
     */
    function updateCache(key, result) {
        // 检查缓存是否已满
        if (cacheKeys.length >= CONFIG.MAX_CACHE_ITEMS) {
            // 移除最早的缓存
            const oldestKey = cacheKeys.shift();
            delete queryCache[oldestKey];
        }

        // 更新缓存
        queryCache[key] = {
            result,
            timestamp: Date.now()
        };

        // 更新缓存键列表
        if (cacheKeys.includes(key)) {
            // 移除旧位置
            cacheKeys.splice(cacheKeys.indexOf(key), 1);
        }
        // 添加到最新位置
        cacheKeys.push(key);
    }

    /**
 * 处理错误
 * @param {string} message - 错误消息
 * @param {number} x - 鼠标X坐标
 * @param {number} y - 鼠标Y坐标
 * @param {object} [details=null] - 错误详情
 */
function handleError(message, x = 20, y = 20, details = null) {
    if (CONFIG.DEBUG_MODE) {
        GM_log('错误: ' + message);
        if (details) {
            GM_log('错误详情: ' + JSON.stringify(details));
        }
    }
    showTooltip(message, x, y);
}

    /**
     * 查询威胁情报
     * @param {string} value - 要查询的值
     * @param {string} type - 类型
     */
    // 存储最后鼠标位置
    let lastMouseX = 20;
    let lastMouseY = 20;
    
    // 更新鼠标位置
    document.addEventListener('mousemove', (e) => {
        lastMouseX = e.clientX + 10;
        lastMouseY = e.clientY + 10;
    });
    
    function queryIntel(value, type) {
        // 处理带端口的IP地址
        if (type === 'ip' && value.includes(':')) {
            // 提取IP部分
            const ipPart = value.split(':')[0];
            // 检查提取后的IP是否有效
            if (PATTERNS.ip.test(ipPart)) {
                value = ipPart;
            }
        }

        // 检查缓存
        const cacheKey = `${type}:${value}`;
        if (isCacheValid(cacheKey)) {
            showTooltip(queryCache[cacheKey].result, lastMouseX, lastMouseY);
            return;
        }

        let api_url, method = 'POST', headers = {}, data = null;

        try {
            if (['md5', 'sha1'].includes(type)) {
                api_url = CONFIG.API_URLS.sandbox(CONFIG.API_TOKENS.sandbox);
                headers = {'Content-Type': 'application/json'};
                data = JSON.stringify([{type: 'file', value}]);

            } else if (type === 'ip') {
                api_url = CONFIG.API_URLS.ip_reputation;
                method = 'GET';
                headers = {'Api-Key': CONFIG.API_TOKENS.threat};
                // 构建查询参数
                const params = new URLSearchParams();
                params.append('param', value);
                params.append('version', CONFIG.API_VERSION);
                api_url = `${api_url}?${params.toString()}`;

            } else if (type === 'url') {
                api_url = CONFIG.API_URLS.url_reputation;
                headers = {'Api-Key': CONFIG.API_TOKENS.threat, 'Content-Type': 'application/json'};
                // 确保数据格式正确
                data = JSON.stringify({
                    queries: [{
                        index: 0,
                        origin_url: value,
                        version: CONFIG.API_VERSION
                    }]
                });

            } else if (type === 'domain') {
                api_url = CONFIG.API_URLS.compromise;
                method = 'GET';
                headers = {'Api-Key': CONFIG.API_TOKENS.threat};
                // 构建查询参数
                const params = new URLSearchParams();
                params.append('apikey', CONFIG.API_TOKENS.threat);
                params.append('param', value);
                params.append('version', CONFIG.API_VERSION);
                api_url = `${api_url}?${params.toString()}`;

            } else {
                return handleError('不支持的查询类型', lastMouseX, lastMouseY);
            }

            // 调试日志
            if (CONFIG.DEBUG_MODE) {
                GM_log('API请求信息:');
                GM_log('URL: ' + api_url);
                GM_log('方法: ' + method);
                GM_log('头部: ' + JSON.stringify(headers));
                GM_log('数据: ' + data);
            }

            GM_xmlhttpRequest({
                method,
                url: api_url,
                headers,
                data,
                timeout: 10000, // 10秒超时
                onload: function (res) {
                    // 调试日志
                    if (CONFIG.DEBUG_MODE) {
                        GM_log('API响应状态: ' + res.status);
                        GM_log('API响应内容: ' + res.responseText);
                    }

                    try {
                        const result = JSON.parse(res.responseText);

                        // 检查认证错误
                        if (result.status === 10001 && CONFIG.ENABLE_DETAILED_ERRORS) {
                            let errorMsg = 'API认证错误: ' + (result.msg || '未知错误');
                            errorMsg += '\n\n请检查您的API密钥和令牌是否有效。';
                            handleError(errorMsg, lastMouseX, lastMouseY);
                        } else {
                            const formattedResult = formatResult(result, type, value);
                            // 更新缓存
                            updateCache(cacheKey, formattedResult);
                            showTooltip(formattedResult, lastMouseX, lastMouseY);
                        }
                    } catch (e) {
                        handleError('解析响应失败：' + e.message, lastMouseX, lastMouseY, {
                        responseText: res.responseText
                    });
                    }
                },
                onerror: function (error) {
                    handleError('API请求失败，请检查网络或Token', lastMouseX, lastMouseY, error);
                },
                ontimeout: function () {
                    handleError('API请求超时，请稍后再试', lastMouseX, lastMouseY);
                }
            });
        } catch (e) {
            handleError('查询过程中出错：' + e.message, lastMouseX, lastMouseY);
        }
    }

    /**
     * 格式化结果
     * @param {object} result - API返回的结果
     * @param {string} type - 类型
     * @param {string} value - 查询的值
     * @returns {string} - 格式化后的结果
     */
    /**
     * 检查是否为局域网IP
     * @param {string} ip - IP地址
     * @returns {boolean} - 是否为局域网IP
     */
    function isPrivateIp(ip) {
        return PATTERNS.privateIp.test(ip);
    }

    /**
     * 格式化结果
     * @param {object} result - API返回的结果
     * @param {string} type - 类型
     * @param {string} value - 查询的值
     * @returns {string} - 格式化后的结果
     */
    function formatResult(result, type, value) {
        let message = `【查询结果】\n类型：${type.toUpperCase()}\n值：${value}\n`;
        let isAPT = false;

        switch (type) {
            case 'md5':
            case 'sha1':
                if (result.status === 10000 && result.data?.[value]) {
                    const data = result.data[value];
                    // 综合判断是否恶意
                    const isMalicious = data.static_detect.is_virus || 
                                      (data.static_detect.static_score && data.static_detect.static_score > 0) ||
                                      (data.dynamic_detect && data.dynamic_detect.dropfile && data.dynamic_detect.dropfile.length > 0);
                    
                    message += `\n` +
                              `文件名：${data.static_detect.filename || '未知'}\n` +
                              `恶意评分：${data.static_detect.static_score || 'undefined'}/100\n` +
                              `是否恶意：${isMalicious ? '<span style="color:red;">是</span>' : '否'}\n` +
                              `分析报告：${data.web_url || '未知'}`;
                } else {
                    message += '未找到该样本的分析报告';
                }
                break;

            case 'ip':
                if (result.status === 10000 && result.data?.[value]) {
                    const data = result.data[value];
                    // 检查是否为局域网IP
                    const isPrivate = isPrivateIp(value);
                    message += `\n` +
                              `国家：${data.geo?.country || '未知'}\n` +
                              `省份/城市：${data.geo?.province || ''} ${data.geo?.city || ''}\n` +
                              `运营商：${data.normal_info?.asn_org || '未知'}\n` +
                              `信誉状态：${data.summary_info?.reputation || '未知'}\n` +
                              `最后活跃时间：${data.summary_info?.latest_reputation_time || '未知'}\n` +
                              `是否局域网：${isPrivate ? '<span style="color:blue;">是</span>' : '否'}`;

                    // 检查是否存在APT相关信息
                    if (data.compromise && data.compromise.length > 0) {
                        data.compromise.forEach(item => {
                            if (item.alert_name && item.alert_name.includes('APT')) {
                                isAPT = true;
                            }
                        });
                    }

                    // 检查是否存在远控木马活动事件
            if (data.compromise && data.compromise.length > 0) {
                // 检查是否存在CobaltStrike远控木马活动事件
                const cobaltStrikeEvents = data.compromise.filter(item => 
                    item.malicious_family && item.malicious_family.includes('CobaltStrike')
                );

                if (cobaltStrikeEvents.length > 0) {
                    message += `\n\n<span style="color:red;font-weight:bold;">⚠️ 发现CobaltStrike远控木马活动事件 ⚠️</span>\n`;
                    cobaltStrikeEvents.forEach(event => {
                        message += `\n` +
                                  `告警名称：${event.alert_name || '未知'}\n` +
                                  `风险等级：${event.risk || '未知'}\n` +
                                  `恶意类型：${event.malicious_type || '未知'}\n` +
                                  `首次发现时间：${event.etime || '未知'}`;
                    });
                }

                // 检查是否存在其他远控木马活动事件
                const otherTrojanEvents = data.compromise.filter(item => 
                    item.malicious_type === '远控木马' && 
                    (!item.malicious_family || !item.malicious_family.includes('CobaltStrike'))
                );

                if (otherTrojanEvents.length > 0) {
                    message += `\n\n<span style="color:red;font-weight:bold;">⚠️ 发现远控木马活动事件 ⚠️</span>\n`;
                    otherTrojanEvents.forEach(event => {
                        message += `\n` +
                                  `告警名称：${event.alert_name || '未知'}\n` +
                                  `风险等级：${event.risk || '未知'}\n` +
                                  `恶意类型：${event.malicious_type || '未知'}\n` +
                                  `首次发现时间：${event.etime || '未知'}`;
                    });
                }
            }
                } else {
                    message += '未找到该IP的威胁情报';
                }
                break;

            case 'url':
                if (result.status === 10000 && result.replies?.[0]?.uss?.uss) {
                    const data = result.replies[0].uss.uss;
                    message += `\n` +
                              `安全等级：${data.level}\n` +
                              `分类：${data.category}\n` +
                              `首次检测时间：${data.first_detect_time}\n` +
                              `最后更新时间：${data.last_update_time}`;
                } else {
                    message += '未找到该URL的威胁情报';
                }
                break;

            case 'domain':
                if (result.status === 10000 && result.data?.length > 0) {
                    const data = result.data[0];
                    message += `\n` +
                              `告警名称：<span style="color:red;">${data.alert_name}</span>\n` +
                              `风险等级：${data.risk === 'high' ? '<span style="color:red;">high</span>' : data.risk}\n` +
                              `恶意类型：${data.malicious_type && (data.malicious_type.includes('病毒') || data.malicious_type.includes('木马')) ? '<span style="color:red;">' + data.malicious_type + '</span>' : data.malicious_type}\n` +
                              `首次发现时间：${data.etime}`;
                } else {
                    message += '未找到该域名的威胁情报';
                }
                break;

            default:
                message += '未知错误';
        }

        // 如果检测到APT，在结果前添加红色标记
        if (isAPT) {
            message = `<span style="color:red;font-weight:bold;">‼️APT‼️</span>\n` + message;
        }

        return message;
    }

    // 初始化
    function init() {
        // 防止频繁触发
        let debounceTimer;
        let lastHoveredText = '';

        // 鼠标经过检测
        document.addEventListener('mousemove', (e) => {
            // 获取鼠标位置的文本
            const range = document.caretRangeFromPoint(e.clientX, e.clientY);
            if (!range) return;

            // 扩展范围以获取更多文本
            const expandRange = (range, expandSize = 50) => {
                const start = Math.max(0, range.startOffset - expandSize);
                const end = Math.min(range.endContainer.length, range.endOffset + expandSize);
                const newRange = document.createRange();
                newRange.setStart(range.startContainer, start);
                newRange.setEnd(range.endContainer, end);
                return newRange;
            };

            const expandedRange = expandRange(range);
            const hoveredText = expandedRange.toString().trim();

            // 避免重复检测相同的文本
            if (hoveredText === lastHoveredText) return;
            lastHoveredText = hoveredText;

            // 检查文本中是否包含可检测的类型
            let detected = false;
            let detectedType = null;
            let detectedValue = null;

            // 检查URL
            if (PATTERNS.url.test(hoveredText)) {
                const match = hoveredText.match(PATTERNS.url);
                if (match) {
                    detected = true;
                    detectedType = 'url';
                    detectedValue = match[0];
                }
            }

            // 检查其他类型
            if (!detected) {
                Object.entries(PATTERNS).forEach(([key, regex]) => {
                    if (key !== 'url' && regex.test(hoveredText)) {
                        const match = hoveredText.match(regex);
                        if (match) {
                            detected = true;
                            detectedType = key;
                            detectedValue = match[0];
                        }
                    }
                });
            }

            if (detected && detectedValue && detectedValue.length <= 100) {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    queryIntel(detectedValue, detectedType);
                }, CONFIG.DEBOUNCE_TIME);
            }
        });

        // 保留原有的选中检测功能
        document.addEventListener('mouseup', () => {
            const selected = window.getSelection().toString().trim();
            if (!selected || selected.length > 100) return; // 限制长度，避免过大的选择

            const type = detectType(selected);
            if (!type) return;

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                queryIntel(selected, type);
            }, CONFIG.DEBOUNCE_TIME);
        });
    }

    // 启动脚本
    init();
})();