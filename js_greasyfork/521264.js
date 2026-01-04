// ==UserScript==
// @name         【无水印下载神器】豆包|即梦|美间生成图片视频一键无水印-收费
// @namespace    http://tampermonkey.net/
// @version      4.1.4
// @description  实现豆包&即梦生成的图片视频免费无水印下载
// @author       微信11208596
// @license      UNLICENSED
// @match        https://www.doubao.com/*
// @match        https://jimeng.jianying.com/ai-tool/*
// @match        https://www.meijian.com/mj-box/*
// @match        https://www.meijian.com/ai/*
// @match        https://meijian.com/mj-box/*
// @match        https://meijian.com/ai/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      feishu.cn
// @connect      weserv.nl
// @connect      doubao.com
// @connect      jianying.com
// @connect      meijian.com
// @connect      vlabvod.com
// @connect      byteimg.com
// @connect      self
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521264/%E3%80%90%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD%E7%A5%9E%E5%99%A8%E3%80%91%E8%B1%86%E5%8C%85%7C%E5%8D%B3%E6%A2%A6%7C%E7%BE%8E%E9%97%B4%E7%94%9F%E6%88%90%E5%9B%BE%E7%89%87%E8%A7%86%E9%A2%91%E4%B8%80%E9%94%AE%E6%97%A0%E6%B0%B4%E5%8D%B0-%E6%94%B6%E8%B4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/521264/%E3%80%90%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD%E7%A5%9E%E5%99%A8%E3%80%91%E8%B1%86%E5%8C%85%7C%E5%8D%B3%E6%A2%A6%7C%E7%BE%8E%E9%97%B4%E7%94%9F%E6%88%90%E5%9B%BE%E7%89%87%E8%A7%86%E9%A2%91%E4%B8%80%E9%94%AE%E6%97%A0%E6%B0%B4%E5%8D%B0-%E6%94%B6%E8%B4%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 尝试自动允许所有跨域请求（重要提示，添加在最前面）
    // 这段代码会尝试拦截Tampermonkey的请求确认对话框并自动点击"总是允许全部域名"按钮
    function autoAcceptCrossOriginRequests() {
        // 创建一个MutationObserver来监视DOM变化
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查是否是Tampermonkey的跨域请求对话框
                        if (node.textContent && node.textContent.includes('跨源资源请求') ||
                            node.textContent && node.textContent.includes('cross-origin')) {

                            console.log('[自动允许] 检测到跨域请求对话框，尝试自动点击"总是允许全部域名"按钮');

                            // 尝试查找"总是允许全部域名"按钮并点击
                            setTimeout(() => {
                                // 通过文本内容定位按钮
                                const buttons = document.querySelectorAll('button');
                                for (const button of buttons) {
                                    if (button.textContent && (
                                        button.textContent.includes('总是允许全部域名') ||
                                        button.textContent.includes('Always allow all domains'))) {
                                        console.log('[自动允许] 找到"总是允许全部域名"按钮，自动点击');
                                        button.click();
                                        return;
                                    }
                                }

                                // 如果没找到按钮，尝试通过其他方式定位
                                const allButtons = document.querySelectorAll('button, div[role="button"]');
                                for (const btn of allButtons) {
                                    // 寻找可能是"允许全部域名"的按钮
                                    if (btn.textContent && (btn.textContent.includes('允许全部') ||
                                        btn.textContent.includes('Allow all'))) {
                                        console.log('[自动允许] 找到可能的"允许全部"按钮，自动点击');
                                        btn.click();
                                        return;
                                    }
                                }

                                console.log('[自动允许] 未找到"总是允许全部域名"按钮，尝试通过ID定位');
                                // 通过已知ID尝试
                                const allowBtn = document.querySelector('[id*="allow"], [class*="allow"]');
                                if (allowBtn) {
                                    console.log('[自动允许] 通过ID找到可能的允许按钮，自动点击');
                                    allowBtn.click();
                                }
                            }, 500);
                        }
                    }
                }
            }
        });

        // 开始观察整个文档
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        console.log('[自动允许] 已启动跨域请求自动允许功能');
    }

    // 立即运行自动允许函数
    autoAcceptCrossOriginRequests();

    // 添加激活码相关功能
    const ACTIVATION_KEY = 'doubao_activation_status';
    const SECRET_KEY = 'db94xy20240322'; // 使用一个固定的密钥值
    const VALID_DAYS = 30; // 激活码有效期(天)

    // 添加共享激活状态的常量
    const SHARED_ACTIVATION_KEY = 'ai_platform_activation_status';
    const SHARED_EXPIRE_KEY = 'ai_platform_expire_time';
    const SHARED_RECORD_KEY = 'ai_platform_record_id';
    const SHARED_CODE_KEY = 'ai_platform_activation_code';

    // 飞书多维表格配置
    const FEISHU_CONFIG = {
        APP_ID: 'cli_a7317a5d6afd901c',
        APP_SECRET: 'cdGf1f5n5xY0tI6F07xKkcU1iPoFVdPD',
        BASE_ID: 'T1M4bzmLLarNLhs5jcEcwAcRn8Q',    // 多维表格 base ID
        TABLE_ID: 'tbliBckxa87pskV8',              // 数据表 ID
        API_URL: 'https://open.feishu.cn/open-apis',
        TOKEN: null
    };

    // 添加设备指纹生成函数
    function generateDeviceFingerprint() {
        const components = [
            navigator.userAgent,
            navigator.language,
            navigator.platform,
            new Date().getTimezoneOffset(),
            screen.colorDepth,
            screen.width + 'x' + screen.height,
            navigator.hardwareConcurrency,
            navigator.deviceMemory,
            navigator.vendor
        ].join('|');

        // 使用更稳定的哈希算法
        let hash = 0;
        for (let i = 0; i < components.length; i++) {
            const char = components.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        // 转换为固定长度的字符串
        return Math.abs(hash).toString(36).substring(0, 8);
    }

    // 修改设备ID获取逻辑
    function getOrCreateDeviceId() {
        // 使用固定的存储键名，确保两个平台使用相同的键
        const DEVICE_ID_KEY = 'ai_platform_device_id';
        let deviceId = localStorage.getItem(DEVICE_ID_KEY);

        if (!deviceId) {
            // 生成新的设备ID，结合设备指纹和随机数
            const fingerprint = generateDeviceFingerprint();
            const randomPart = Math.random().toString(36).substring(2, 6);
            deviceId = `${fingerprint}${randomPart}`;

            // 保存到localStorage
            localStorage.setItem(DEVICE_ID_KEY, deviceId);

            // 同时保存到原来的键名，保持兼容性
            localStorage.setItem('deviceId', deviceId);
        } else {
            // 确保两个键名下的值一致
            localStorage.setItem('deviceId', deviceId);
        }

        return deviceId;
    }

    // 修改获取访问令牌的函数
    async function getFeishuAccessToken() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: JSON.stringify({
                    "app_id": FEISHU_CONFIG.APP_ID,
                    "app_secret": FEISHU_CONFIG.APP_SECRET
                }),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        console.log('访问令牌响应:', data);

                        if (data.code === 0 && data.tenant_access_token) {
                            FEISHU_CONFIG.TOKEN = data.tenant_access_token;
                            resolve(data.tenant_access_token);
                        } else {
                            console.error('获取访问令牌失败:', data);
                            reject(new Error(`获取访问令牌失败: ${data.msg || '未知错误'}`));
                        }
                    } catch (e) {
                        console.error('解析响应失败:', e);
                        reject(e);
                    }
                },
                onerror: function(error) {
                    console.error('请求失败:', error);
                    reject(error);
                }
            });
        });
    }

    // 修改生成激活码的函数
    async function generateActivationCode() {
        try {
            if (!FEISHU_CONFIG.TOKEN) {
                await getFeishuAccessToken();
            }

            // 生成随机部分
            const randomPart = Math.random().toString(36).substring(2, 10);
            // 时间戳部分
            const timestampPart = Date.now().toString(36);
            // 校验部分
            const checkPart = generateCheckPart(randomPart + timestampPart);
            // 组合激活码
            const code = `${randomPart}-${timestampPart}-${checkPart}`;

            // 计算过期时间
            const expireTime = new Date();
            expireTime.setDate(expireTime.getDate() + VALID_DAYS);

            // 创建新记录
            const response = await fetch(`${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${FEISHU_CONFIG.TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        '激活码': code,
                        '状态': '正常',
                        '过期时间': expireTime.toISOString(),
                        '创建时间': new Date().toISOString()
                    }
                })
            });

            const data = await response.json();
            if (data.code === 0) {
                return code;
            } else {
                console.error('创建激活码失败:', data);
                return null;
            }
        } catch (e) {
            console.error('生成激活码出错:', e);
            return null;
        }
    }

    // 生成校验部分
    function generateCheckPart(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36).substring(0, 4);
    }

    // 添加获取字段信息的函数
    async function getTableFields() {
        const token = await getFeishuAccessToken();
        return new Promise((resolve, reject) => {
            const url = `${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/fields`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        console.log('字段信息:', data);
                        if (data.code === 0) {
                            resolve(data.data.items);
                        } else {
                            reject(new Error(data.msg));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    // 添加缓存机制
    const ACTIVATION_CACHE = {
        status: null,
        timestamp: 0,
        CACHE_TTL: 60000 // 缓存有效期，毫秒
    };

    // 修改 checkActivation 函数
    async function checkActivation() {
        // 首先检查缓存
        const now = Date.now();
        if (ACTIVATION_CACHE.status !== null && (now - ACTIVATION_CACHE.timestamp) < ACTIVATION_CACHE.CACHE_TTL) {
            return ACTIVATION_CACHE.status;
        }

        const activationStatus = localStorage.getItem(ACTIVATION_KEY);
        const deviceId = localStorage.getItem('deviceId');
        const activationCode = localStorage.getItem('activation_code');
        const recordId = localStorage.getItem('record_id');
        const expireTime = localStorage.getItem('expire_time');

        if (!deviceId || !activationStatus || !activationCode || !recordId || !expireTime) {
            ACTIVATION_CACHE.status = false;
            ACTIVATION_CACHE.timestamp = now;
            return false;
        }

        // 检查本地过期时间
        if (new Date() > new Date(expireTime)) {
            localStorage.removeItem(ACTIVATION_KEY);
            localStorage.removeItem('activation_code');
            localStorage.removeItem('record_id');
            localStorage.removeItem('expire_time');
            showFloatingTip('激活码已过期，请重新激活');
            ACTIVATION_CACHE.status = false;
            ACTIVATION_CACHE.timestamp = now;
            return false;
        }

        // 设置缓存
        ACTIVATION_CACHE.status = true;
        ACTIVATION_CACHE.timestamp = now;
        return true;

        // 注意：我们将远程检查改为定时任务，而不是在每次右键点击时执行
    }

    // 修改验证激活码的函数
    async function verifyActivationCode(deviceId, code) {
        try {
            const token = await getFeishuAccessToken();
            console.log('获取到的访问令牌:', token);

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records/search`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        page_size: 1,
                        filter: {
                            conditions: [
                                {
                                    field_name: "激活码1",
                                    operator: "is",
                                    value: [code]
                                },
                                {
                                    field_name: "状态",
                                    operator: "is",
                                    value: ["正常"]
                                }
                            ],
                            conjunction: "and"
                        }
                    }),
                    onload: function(response) {
                        try {
                            if (!response.responseText) {
                                console.error('空响应');
                                resolve(false);
                                return;
                            }

                            let data;
                            try {
                                data = JSON.parse(response.responseText);
                                console.log('验证响应数据:', data);
                            } catch (e) {
                                console.error('JSON解析失败:', response.responseText);
                                resolve(false);
                                return;
                            }

                            if (!data || data.code !== 0 || !data.data?.items?.length) {
                                console.log('激活码验证失败: 未找到匹配记录');
                                resolve(false);
                                return;
                            }

                            const record = data.data.items[0];
                            const fields = record.fields;
                            console.log('找到记录:', fields);

                            // 验证激活码状态和过期时间
                            const now = new Date().getTime();
                            if (fields.状态 !== '正常' || now > fields.过期时间) {
                                console.log('激活码状态不正常或已过期');
                                resolve(false);
                                return;
                            }

                            // 验证设备ID - 处理文本格式
                            if (fields.设备ID) {
                                const existingDeviceId = Array.isArray(fields.设备ID) ?
                                    fields.设备ID[0]?.text : fields.设备ID;

                                if (existingDeviceId && existingDeviceId !== deviceId) {
                                    console.log('设备ID不匹配:', {existing: existingDeviceId, current: deviceId});
                                    resolve(false);
                                    return;
                                }
                            }

                            // 更新记录 - 使用文本格式
                            const updatedFields = {
                                ...fields,
                                设备ID: deviceId,
                                激活时间: new Date().toISOString()
                            };

                            // 使用 Promise 处理更新记录
                            updateActivationRecord(record.record_id, updatedFields)
                                .then(() => {
                                    // 保存到共享存储
                                    localStorage.setItem(SHARED_ACTIVATION_KEY, 'activated');
                                    localStorage.setItem(SHARED_CODE_KEY, code);
                                    localStorage.setItem(SHARED_RECORD_KEY, record.record_id);
                                    localStorage.setItem(SHARED_EXPIRE_KEY, fields.过期时间);

                                    // 同时保存到原有键名，保持兼容性
                                    localStorage.setItem(ACTIVATION_KEY, 'activated');
                                    localStorage.setItem('activation_code', code);
                                    localStorage.setItem('record_id', record.record_id);
                                    localStorage.setItem('expire_time', fields.过期时间);

                                    showActivationStatus();
                                    console.log('激活成功');
                                    resolve(true);

                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 1500);
                                })
                                .catch((error) => {
                                    console.error('更新记录失败:', error);
                                    resolve(false);
                                });

                        } catch (e) {
                            console.error('处理验证响应失败:', e);
                            resolve(false);
                        }
                    },
                    onerror: function(error) {
                        console.error('验证请求失败:', error);
                        resolve(false);
                    }
                });
            });
        } catch (e) {
            console.error('验证过程出错:', e);
            return false;
        }
    }

    // 修改更新激活记录的函数
    async function updateActivationRecord(recordId, fields) {
        try {
            const token = await getFeishuAccessToken();

            // 格式化日期时间
            const formatDateTime = (dateStr) => {
                if (!dateStr) return null;
                const date = new Date(dateStr);
                return date.getTime(); // 转换为时间戳
            };

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'PUT',
                    url: `${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records/${recordId}`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        fields: {
                            设备ID: fields.设备ID,
                            激活时间: formatDateTime(fields.激活时间), // 转换为时间戳
                            状态: fields.状态,
                            过期时间: formatDateTime(fields.过期时间) // 转换为时间戳
                        }
                    }),
                    onload: function(response) {
                        try {
                            if (!response.responseText) {
                                console.error('更新记录时收到空响应');
                                reject(new Error('更新记录失败: 空响应'));
                                return;
                            }

                            const data = JSON.parse(response.responseText);
                            console.log('更新记录响应:', data);

                            if (data.code === 0) {
                                resolve(data);
                            } else {
                                console.error('更新记录失败:', data);
                                reject(new Error(`更新记录失败: ${data.msg || '未知错误'}`));
                            }
                        } catch (e) {
                            console.error('处理更新响应失败:', e);
                            reject(e);
                        }
                    },
                    onerror: function(error) {
                        console.error('更新请求失败:', error);
                        reject(new Error('更新记录失败: 网络错误'));
                    }
                });
            });
        } catch (e) {
            console.error('更新记录过程出错:', e);
            throw e;
        }
    }

    // 修改激活对话框样式
    function createActivationDialog() {
        const overlay = document.createElement('div');
        overlay.className = 'download-confirm-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'download-confirm-dialog';

        // 使用新的设备ID获取函数
        const deviceId = getOrCreateDeviceId();

        dialog.innerHTML = `
            <h3 style="font-size: 17px; margin-bottom: 4px;">软件激活</h3>
            <p style="color: #999; font-size: 14px; margin: 0 0 20px;">请输入激活码以继续使用</p>
            <div class="input-container" style="margin-bottom: 12px;">
                <label style="color: #333; font-size: 14px; display: block; margin-bottom: 8px;">设备ID</label>
                <input type="text"
                       id="deviceId"
                       value="${deviceId}"
                       readonly
                       style="width: 100%;
                              padding: 12px;
                              border: 1px solid #e5e5e5;
                              border-radius: 8px;
                              font-size: 14px;
                              background: #f5f5f5;">
                <div class="tip" style="font-size: 12px; color: #999; margin-top: 4px;">
                    请复制设备ID并联系微信<span class="copyable-text" style="cursor: pointer; color: #007AFF;">(11208596)</span>获取激活码
                </div>
            </div>
            <div class="input-container" style="margin-bottom: 20px;">
                <label style="color: #333; font-size: 14px; display: block; margin-bottom: 8px;">激活码</label>
                <input type="text"
                       id="activationCode"
                       placeholder="请输入激活码"
                       style="width: 100%;
                              padding: 12px;
                              border: 1px solid #e5e5e5;
                              border-radius: 8px;
                              font-size: 14px;">
            </div>
            <div class="buttons" style="display: flex; gap: 12px;">
                <button class="cancel-btn"
                        style="flex: 1;
                               padding: 12px;
                               border: none;
                               border-radius: 8px;
                               font-size: 14px;
                               background: #f5f5f5;
                               color: #333;
                               cursor: pointer;">
                    取消
                </button>
                <button class="confirm-btn"
                        style="flex: 1;
                               padding: 12px;
                               border: none;
                               border-radius: 8px;
                               font-size: 14px;
                               background: #007AFF;
                               color: white;
                               cursor: pointer;">
                    激活
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .download-confirm-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(8px);
                z-index: 9999;
            }

            .download-confirm-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 24px;
                border-radius: 12px;
                width: 90%;
                max-width: 360px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                z-index: 10000;
            }

            .confirm-btn:hover {
                background: #0066DD !important;
            }

            .cancel-btn:hover {
                background: #eee !important;
            }

            .confirm-btn:active {
                transform: scale(0.98);
            }

            .cancel-btn:active {
                transform: scale(0.98);
            }
        `;
        document.head.appendChild(style);

        const confirmBtn = dialog.querySelector('.confirm-btn');
        const cancelBtn = dialog.querySelector('.cancel-btn');
        const activationInput = dialog.querySelector('#activationCode');
        const deviceIdInput = dialog.querySelector('#deviceId');
        const wechatElement = dialog.querySelector('.copyable-text');

        // 复制设备ID功能
        deviceIdInput.addEventListener('click', () => {
            deviceIdInput.select();
            document.execCommand('copy');
            showFloatingTip('设备ID已复制到剪贴板');
        });

        // 添加复制微信号功能
        wechatElement.addEventListener('click', () => {
            const tempInput = document.createElement('input');
            tempInput.value = '11208596';
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showFloatingTip('微信号已复制到剪贴板');
        });

        function closeDialog() {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        }

        confirmBtn.addEventListener('click', async () => {
            const code = activationInput.value.trim();
            if (!code) {
                showFloatingTip('请输入激活码');
                return;
            }

            confirmBtn.disabled = true;
            confirmBtn.textContent = '验证中...';
            confirmBtn.style.opacity = '0.7';

            try {
                const result = await verifyActivationCode(deviceId, code);
                if (result) {
                    showFloatingTip('激活成功');
                    setTimeout(() => {
                        closeDialog();
                        window.location.reload();
                    }, 1500);
                } else {
                    showFloatingTip('激活失败，请联系作者11208596');
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = '激活';
                    confirmBtn.style.opacity = '1';
                }
            } catch (e) {
                console.error('验证过程出错:', e);
                showFloatingTip('验证出错，请联系作者11208596');
                confirmBtn.disabled = false;
                confirmBtn.textContent = '激活';
                confirmBtn.style.opacity = '1';
            }
        });

        cancelBtn.addEventListener('click', closeDialog);

        // 聚焦到文件名输入框，方便用户直接修改
        setTimeout(() => activationInput.focus(), 50);
    }

    // 添加一个带远程验证的检查函数
    async function checkActivationWithRemote() {
        // 首先检查本地状态
        const localActivated = await checkActivation();
        if (!localActivated) return false;

        // 如果本地状态正常，再检查远程状态
        try {
            const activationCode = localStorage.getItem('activation_code');
            const recordId = localStorage.getItem('record_id');
            const deviceId = localStorage.getItem('deviceId');

            if (!activationCode || !recordId || !deviceId) return false;

            if (!FEISHU_CONFIG.TOKEN) {
                await getFeishuAccessToken();
            }

            // 检查飞书表格中的状态
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records/${recordId}`,
                    headers: {
                        'Authorization': `Bearer ${FEISHU_CONFIG.TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    onload: resolve,
                    onerror: reject
                });
            });

            const data = JSON.parse(response.responseText);
            if (data.code === 0) {
                const record = data.data.record;
                const now = new Date().getTime();

                // 检查状态和过期时间
                if (record.fields.状态 !== '正常' || now > record.fields.过期时间) {
                    clearActivationInfo();
                    showFloatingTip('激活码已过期或失效，请重新激活');
                    return false;
                }

                // 计算剩余时间
                const expireTime = new Date(record.fields.过期时间);
                const remainingTime = Math.ceil((expireTime - now) / (1000 * 60 * 60 * 24)); // 剩余天数
                localStorage.setItem('remaining_time', remainingTime); // 存储剩余时间

                // 检查设备ID
                const recordDeviceId = Array.isArray(record.fields.设备ID) ?
                    record.fields.设备ID[0]?.text :
                    record.fields.设备ID;

                if (recordDeviceId !== deviceId) {
                    clearActivationInfo();
                    showFloatingTip('设备ID不匹配，请重新激活');
                    return false;
                }

                return true;
            }
        } catch (e) {
            console.error('远程验证失败:', e);
            return false;
        }

        return false;
    }

    // 添加一个激活码生成工具函数(仅供开发使用)
    function generateActivationCodeForDevice(deviceId) {
        return generateActivationCode(deviceId);
    }

    // 显示浮动提示
    function showFloatingTip(message) {
        const tip = document.createElement('div');
        tip.className = 'floating-tip';
        tip.innerHTML = `
            <div class="icon">i</div>
            <span>${message}</span>
        `;

        document.body.appendChild(tip);

        setTimeout(() => {
            tip.classList.add('show');
        }, 100);

        setTimeout(() => {
            tip.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(tip);
            }, 300);
        }, 3000);
    }

    // 修改查询激活码状态的函数
    window.queryActivationCode = async function() {
        const code = document.getElementById('queryCode').value.trim();
        const resultDiv = document.getElementById('queryResult');

        if (!code) {
            showFloatingTip('请输入激活码');
            return;
        }

        try {
            const response = await fetch(`${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${FEISHU_CONFIG.TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filter: `CurrentValue.[激活码] = "${code}"`
                })
            });

            const data = await response.json();

            if (!data.data.records || data.data.records.length === 0) {
                resultDiv.innerHTML = '<div style="color: #ff3b30;">激活码不存在</div>';
                return;
            }

            const record = data.data.records[0].fields;
            const expireTime = new Date(record.过期时间);
            const now = new Date();
            const isExpired = now > expireTime;

            resultDiv.innerHTML = `
                <div style="background: #f5f5f7; padding: 15px; border-radius: 8px;">
                    <div><strong>设备ID:</strong> ${record.设备ID || '未使用'}</div>
                    <div><strong>到期时间:</strong> ${expireTime.toLocaleString()}</div>
                    <div><strong>状态:</strong>
                        <span style="color: ${record.状态 === '正常' && !isExpired ? '#00c853' : '#ff3b30'}">
                            ${record.状态 === '正常' ? (isExpired ? '已过期' : '有效') : '已禁用'}
                        </span>
                    </div>
                    ${record.状态 === '正常' && !isExpired ? `
                        <div style="margin-top: 15px;">
                            <button onclick="deactivateCode('${code}')"
                                    style="background: #ff3b30; padding: 8px 16px; font-size: 13px;">
                                取消此激活码
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        } catch (e) {
            resultDiv.innerHTML = '<div style="color: #ff3b30;">查询失败，请稍后重试</div>';
            console.error('查询失败:', e);
        }
    };

    // 修改取消激活码的函数
    window.deactivateCode = async function(code) {
        if (!confirm('确定要取消此激活码吗？取消后此激活码将无法继续使用。')) {
            return;
        }

        try {
            // 查询激活码记录
            const response = await fetch(`${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${FEISHU_CONFIG.TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filter: `CurrentValue.[激活码] = "${code}"`
                })
            });

            const data = await response.json();
            if (!data.data.records || data.data.records.length === 0) {
                showFloatingTip('激活码不存在');
                return;
            }

            // 更新状态为已禁用
            await updateActivationRecord(data.data.records[0].record_id, {
                状态: '已禁用',
                禁用时间: new Date().toISOString()
            });

            // 如果当前用户正在使用这个激活码，立即取消激活
            const currentCode = localStorage.getItem('activation_code');
            if (currentCode === code) {
                localStorage.removeItem(ACTIVATION_KEY);
                localStorage.removeItem('activation_code');
            }

            showFloatingTip('激活码已成功取消');

            // 更新查询结果显示
            const resultDiv = document.getElementById('queryResult');
            resultDiv.innerHTML = `
                <div style="background: #f5f5f7; padding: 15px; border-radius: 8px;">
                    <div style="color: #ff3b30;">此激活码已被禁用，无法继续使用</div>
                </div>
            `;

            // 强制刷新页面以确保状态更新
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (e) {
            console.error('取消激活码失败:', e);
            showFloatingTip('取消激活码失败');
        }
    };

    // 修改定期检查机制
    function startBlacklistCheck() {
        setInterval(async () => {
            const activationCode = localStorage.getItem('activation_code');
            if (!activationCode) return;

            try {
                const token = await getFeishuAccessToken();

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records/search`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        page_size: 1,
                        filter: {
                            conditions: [
                                {
                                    field_name: "激活码1",  // 修改为检查激活码1字段
                                    operator: "is",
                                    value: [activationCode]
                                },
                                {
                                    field_name: "状态",
                                    operator: "is",
                                    value: ["正常"]
                                }
                            ],
                            conjunction: "and"
                        }
                    }),
                    onload: function(response) {
                        try {
                            // 添加响应内容类型检查
                            if (!response.responseText) {
                                console.error('空响应');
                                return;
                            }

                            // 尝试解析响应
                            let data;
                            try {
                                data = JSON.parse(response.responseText);
                            } catch (e) {
                                console.error('JSON解析失败:', response.responseText);
                                return;
                            }

                            // 检查响应状态
                            if (response.status !== 200) {
                                console.error('HTTP状态码错误:', response.status);
                                return;
                            }

                            // 验证数据结构
                            if (!data || typeof data !== 'object') {
                                console.error('无效的响应数据格式');
                                return;
                            }

                            // 处理响应数据
                            if (data.code === 0 && data.data && data.data.items) {
                                const record = data.data.items[0];
                                if (!record || !record.fields) {
                                    console.error('记录数据无效');
                                    return;
                                }

                                const fields = record.fields;
                                if (fields.状态 === '已禁用' || new Date() > new Date(fields.过期时间)) {
                                    localStorage.removeItem(ACTIVATION_KEY);
                                    localStorage.removeItem('activation_code');
                                    showFloatingTip('激活码已失效，请重新激活');
                                    window.location.reload();
                                }
                            }
                        } catch (e) {
                            console.error('处理响应时出错:', e);
                        }
                    },
                    onerror: function(error) {
                        console.error('请求失败:', error);
                    }
                });
            } catch (e) {
                console.error('检查激活状态失败:', e);
            }
        }, 30000); // 每30秒检查一次
    }

    // 修改下载验证函数
    async function downloadWithActivationCheck(mediaUrl, mediaType, downloadFunction) {
        if (!checkActivation()) {
            createActivationDialog();
            return;
        }
        createConfirmDialog(mediaUrl, mediaType, downloadFunction);
    }

    // 修改确认对话框样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes dialogShow {
            from {
                opacity: 0;
                transform: translate(-50%, -48%) scale(0.96);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }

        @keyframes overlayShow {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .download-confirm-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            padding: 28px 24px;
            border-radius: 14px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12),
                        0 0 0 1px rgba(0, 0, 0, 0.05);
            z-index: 10000;
            min-width: 320px;
            max-width: 400px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
            animation: dialogShow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .download-confirm-dialog h3 {
            margin: 0 0 8px 0;
            color: #1d1d1f;
            font-size: 19px;
            font-weight: 600;
            letter-spacing: -0.022em;
        }

        .download-confirm-dialog p {
            margin: 0 0 20px 0;
            color: #86868b;
            font-size: 14px;
            line-height: 1.4;
            letter-spacing: -0.016em;
        }

        .download-confirm-dialog .input-container {
            margin: 20px 0;
            text-align: left;
        }

        .download-confirm-dialog label {
            display: block;
            margin-bottom: 8px;
            color: #1d1d1f;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: -0.016em;
        }

        .download-confirm-dialog input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            font-size: 15px;
            color: #1d1d1f;
            background: rgba(255, 255, 255, 0.8);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-sizing: border-box;
        }

        .download-confirm-dialog input:focus {
            outline: none;
            border-color: #0071e3;
            box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.15);
            background: #ffffff;
        }

        .download-confirm-dialog .buttons {
            margin-top: 28px;
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .download-confirm-dialog button {
            min-width: 128px;
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: -0.016em;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .download-confirm-dialog .confirm-btn {
            background: #0071e3;
            color: white;
            transform: scale(1);
        }

        .download-confirm-dialog .confirm-btn:hover {
            background: #0077ED;
            transform: scale(1.02);
        }

        .download-confirm-dialog .confirm-btn:active {
            transform: scale(0.98);
        }

        .download-confirm-dialog .confirm-btn:disabled {
            background: #999999;
            cursor: not-allowed;
            opacity: 0.7;
            transform: scale(1);
        }

        .download-confirm-dialog .cancel-btn {
            background: rgba(0, 0, 0, 0.05);
            color: #1d1d1f;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }

        .download-confirm-dialog .cancel-btn:hover {
            background: rgba(0, 0, 0, 0.1);
        }

        .download-confirm-dialog .cancel-btn:active {
            background: rgba(0, 0, 0, 0.15);
        }

        .download-confirm-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            z-index: 9999;
            animation: overlayShow 0.3s ease-out;
        }

        @media (prefers-color-scheme: dark) {
            .download-confirm-dialog {
                background: rgba(40, 40, 45, 0.8);
            }

            .download-confirm-dialog h3 {
                color: #ffffff;
            }

            .download-confirm-dialog p {
                color: #98989d;
            }

            .download-confirm-dialog label {
                color: #ffffff;
            }

            .download-confirm-dialog input {
                background: rgba(60, 60, 65, 0.8);
                border-color: rgba(255, 255, 255, 0.1);
                color: #ffffff;
            }

            .download-confirm-dialog input:focus {
                background: rgba(70, 70, 75, 0.8);
            }

            .download-confirm-dialog .cancel-btn {
                background: rgba(255, 255, 255, 0.1);
                color: #ffffff;
            }

            .download-confirm-dialog .cancel-btn:hover {
                background: rgba(255, 255, 255, 0.15);
            }
        }

        .download-confirm-dialog .tip {
            font-size: 12px;
            color: #86868b;
            margin-top: 6px;
            text-align: left;
        }

        .download-confirm-dialog .progress-text {
            margin-top: 12px;
            font-size: 13px;
            color: #1d1d1f;
            letter-spacing: -0.016em;
        }

        .download-confirm-dialog .success-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #00c853;
            position: relative;
            margin-right: 6px;
            transform: scale(0);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .download-confirm-dialog .success-icon:after {
            content: '';
            position: absolute;
            width: 8px;
            height: 4px;
            border: 2px solid white;
            border-top: 0;
            border-right: 0;
            transform: rotate(-45deg);
            top: 4px;
            left: 4px;
        }

        .download-confirm-dialog .success-icon.show {
            transform: scale(1);
        }

        @media (prefers-color-scheme: dark) {
            .download-confirm-dialog .tip {
                color: #98989d;
            }
            .download-confirm-dialog .progress-text {
                color: #ffffff;
            }
        }

        .floating-tip {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 12px 20px;
            border-radius: 10px;
            color: white;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
            display: flex;
            align-items: center;
            gap: 8px;
            pointer-events: none;
        }

        .floating-tip.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }

        .floating-tip .icon {
            width: 18px;
            height: 18px;
            background: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            color: #000;
        }

        @media (prefers-color-scheme: dark) {
            .floating-tip {
                background: rgba(255, 255, 255, 0.9);
                color: #1d1d1f;
            }
            .floating-tip .icon {
                background: #1d1d1f;
                color: #fff;
            }
        }

        .usage-tip {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-size: 15px;
            line-height: 1.4;
            z-index: 9999;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            max-width: 90%;
            width: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .usage-tip.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }

        .usage-tip .icon {
            font-size: 24px;
            flex-shrink: 0;
        }

        .usage-tip .content {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .usage-tip .main-text {
            font-weight: 500;
        }

        .usage-tip .contact {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.8);
        }

        @media (prefers-color-scheme: dark) {
            .usage-tip {
                background: rgba(255, 255, 255, 0.95);
                color: #1d1d1f;
                border: 1px solid rgba(0, 0, 0, 0.1);
            }
            .usage-tip .contact {
                color: rgba(0, 0, 0, 0.6);
            }
        }

        .remaining-time {
            background: rgba(0, 0, 0, 0.03);
            padding: 8px 12px;
            border-radius: 8px;
            text-align: center;
        }

        @media (prefers-color-scheme: dark) {
            .remaining-time {
                background: rgba(255, 255, 255, 0.05);
                color: #98989d;
            }
        }
    `;
    document.head.appendChild(style);

    // 获取当前网站域名
    const currentDomain = window.location.hostname;

    // 修改createConfirmDialog函数，补充被省略的代码部分
    function createConfirmDialog(mediaUrl, mediaType, downloadFunction) {
        // 使用预创建的元素或创建新元素
        const overlay = window._preCreatedOverlay || document.createElement('div');
        const dialog = window._preCreatedDialog || document.createElement('div');

        if (!window._preCreatedOverlay) {
            overlay.className = 'download-confirm-overlay';
            dialog.className = 'download-confirm-dialog';
        }

        // 显示元素
        overlay.style.display = 'block';
        dialog.style.display = 'block';

        // 获取当前日期时间作为默认文件名的备选
        const now = new Date();
        const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}`;

        // 简化提示词获取逻辑
        let promptText = '';
        try {
            // 预定义可能的选择器列表
            const selectors = [
                'span[class*="promptText-"]',
                '.message-text-aF_36u[data-testid="message_text_content"]'
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    promptText = element.textContent.trim()
                        .replace('帮我生成图片：', '')
                        .replace(/\s+/g, ' ')
                        .replace(/^[""]-|[""]$/g, '')
                        .replace(/[\\/:*?"<>|]/g, '_')
                        .substring(0, 100);
                    break;
                }
            }
        } catch(e) {
            console.error('获取提示词失败:', e);
        }

        // 默认文件名使用提示词，如果没有提示词则使用日期
        const defaultFileName = promptText || dateStr;

        // 获取用户默认格式设置
        const defaultFormat = localStorage.getItem('default_image_format') || 'png';

        // 设置对话框内容，添加格式选择选项
        dialog.innerHTML = `
            <h3>下载${mediaType === 'video' ? '视频' : '图片'}</h3>
            <p>请确认下载信息</p>
            <div class="input-container">
                <label for="fileName">文件名称</label>
                <input type="text"
                       id="fileName"
                       value="${defaultFileName}"
                       placeholder="请输入文件名称"
                       spellcheck="false"
                       autocomplete="off">
                ${mediaType === 'image' ? `
                <div class="format-selection" style="margin-top: 12px;">
                    <label style="display: block; margin-bottom: 8px;">图片格式</label>
                    <div style="display: flex; gap: 10px;">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="radio" name="imageFormat" value="png" ${defaultFormat === 'png' ? 'checked' : ''} style="margin-right: 5px;"> PNG格式
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="radio" name="imageFormat" value="jpg" ${defaultFormat === 'jpg' ? 'checked' : ''} style="margin-right: 5px;"> JPG格式
                        </label>
                    </div>
                </div>
                ` : ''}
                <div class="tip">提示：右键点击${mediaType === 'video' ? '视频' : '图片'}即可下载，文件名将自动使用AI提示词</div>
                <div class="tip" style="margin-top: 6px;">有问题联系微信：<span class="copyable-wechat" style="cursor: pointer; color: #007AFF;">11208596</span></div>
            </div>
            <div class="progress-text" style="display: none;">
                <span class="success-icon"></span>
                <span class="status-text"></span>
            </div>
            <div class="buttons">
                <button class="cancel-btn">取消</button>
                <button class="confirm-btn">下载</button>
            </div>
        `;

        // 获取元素引用
        const confirmBtn = dialog.querySelector('.confirm-btn');
        const cancelBtn = dialog.querySelector('.cancel-btn');
        const fileNameInput = dialog.querySelector('#fileName');
        const progressText = dialog.querySelector('.progress-text');
        const statusText = dialog.querySelector('.status-text');
        const successIcon = dialog.querySelector('.success-icon');
        const wechatElement = dialog.querySelector('.copyable-wechat');

        // 添加复制微信号功能
        wechatElement.addEventListener('click', () => {
            const tempInput = document.createElement('input');
            tempInput.value = '11208596';
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showFloatingTip('微信号已复制到剪贴板');
        });

        function closeDialog() {
            overlay.style.display = 'none';
            dialog.style.display = 'none';
        }

        function handleDownloadProgress(percent) {
            if (percent) {
                progressText.style.display = 'block';
                statusText.textContent = `正在下载...${percent}%`;
            }
        }

        function handleDownloadSuccess() {
            confirmBtn.style.display = 'none';
            progressText.style.display = 'block';
            successIcon.classList.add('show');
            statusText.textContent = '下载完成';
            setTimeout(() => {
                closeDialog();
            }, 1500);
        }

        function handleDownloadError(error) {
            progressText.style.display = 'block';
            statusText.textContent = `下载失败: ${error}`;
            statusText.style.color = '#ff3b30';
            confirmBtn.disabled = false;
            confirmBtn.textContent = '重试';
        }

        confirmBtn.addEventListener('click', async () => {
            // 点击下载按钮时再次验证激活状态
            const isActivated = await checkActivationWithRemote();
            if (!isActivated) {
                closeDialog();
                createActivationDialog();
                return;
            }

            confirmBtn.disabled = true;
            confirmBtn.textContent = '准备下载...';
            const customFileName = fileNameInput.value.trim();

            // 获取用户选择的图片格式
            let selectedFormat = '';
            if (mediaType === 'image') {
                const formatRadios = dialog.querySelectorAll('input[name="imageFormat"]');
                for (const radio of formatRadios) {
                    if (radio.checked) {
                        selectedFormat = radio.value;
                        // 保存用户的选择到localStorage作为默认设置
                        localStorage.setItem('default_image_format', selectedFormat);
                        break;
                    }
                }
            }

            if (downloadFunction) {
                downloadFunction(
                    mediaUrl,
                    handleDownloadSuccess,
                    customFileName,
                    handleDownloadProgress,
                    handleDownloadError,
                    selectedFormat // 传递用户选择的格式
                );
            } else {
                // 兼容旧的调用方式
                if (mediaType === 'video') {
                    const videoUrl = await getRealVideoUrl(mediaUrl);
                    await downloadVideo(videoUrl, handleDownloadSuccess, customFileName, handleDownloadProgress, handleDownloadError);
                } else {
                    await downloadImage(mediaUrl, handleDownloadSuccess, customFileName, handleDownloadProgress, handleDownloadError, selectedFormat);
                }
            }
        });

        cancelBtn.addEventListener('click', closeDialog);

        // 聚焦到文件名输入框，方便用户直接修改
        setTimeout(() => fileNameInput.focus(), 50);
    }

    // 处理视频URL,移除水印
    function processVideoUrl(url) {
        try {
            if (url.includes('vlabvod.com')) {
                const urlObj = new URL(url);
                const paramsToRemove = [
                    'lr', 'watermark', 'display_watermark_busi_user',
                    'cd', 'cs', 'ds', 'ft', 'btag', 'dy_q', 'feature_id'
                ];

                paramsToRemove.forEach(param => {
                    urlObj.searchParams.delete(param);
                });

                if (urlObj.searchParams.has('br')) {
                    const br = parseInt(urlObj.searchParams.get('br'));
                    urlObj.searchParams.set('br', Math.max(br, 6000).toString());
                    urlObj.searchParams.set('bt', Math.max(br, 6000).toString());
                }

                urlObj.searchParams.delete('l');
                return urlObj.toString();
            }
            return url;
        } catch (e) {
            console.error('处理视频URL时出错:', e);
            return url;
        }
    }

    // 获取真实视频URL
    async function getRealVideoUrl(videoElement) {
        let videoUrl = videoElement.src;
        if (!videoUrl) {
            const sourceElement = videoElement.querySelector('source');
            if (sourceElement) {
                videoUrl = sourceElement.src;
            }
        }
        if (!videoUrl) {
            videoUrl = videoElement.getAttribute('data-src');
        }
        return videoUrl;
    }

    // 获取文件扩展名
    function getFileExtension(url) {
        // 针对美间的图片特殊处理
        if (url.includes('maas-cos.kujiale.com') ||
            url.includes('meijian-cos.kujiale.com') ||
            url.includes('kujiale.com')) {
            // 检查美间图片的命名格式，如果有后缀则使用，否则默认为png
            const filenamePart = url.split('/').pop();
            if (filenamePart.includes('.')) {
                const extension = filenamePart.match(/\.(jpg|jpeg|png|gif|webp)($|\?)/i);
                if (extension) return extension[0].replace('?', '');
            }
            return '.png'; // 美间大多数图片是png格式
        }

        // 原来的逻辑
        const extension = url.split('?')[0].match(/\.(jpg|jpeg|png|gif|mp4|webm)$/i);
        return extension ? extension[0] : '.jpg';
    }

    // 下载图片的函数
    function downloadImage(imageUrl, onSuccess, customFileName, onProgress, onError, userFormat) {
        // 下载前再次验证激活状态
        checkActivation().then(isActivated => {
            if (!isActivated) {
                if (onError) onError('激活状态无效，请重新激活');
                setTimeout(() => {
                    createActivationDialog();
                }, 1000);
                return;
            }

            // 处理美间网站图片URL
            if (imageUrl.includes('maas-cos.kujiale.com') ||
                imageUrl.includes('meijian-cos.kujiale.com') ||
                imageUrl.includes('kujiale.com')) {
                // 处理美间网站的图片URL，移除水印参数
                imageUrl = imageUrl.split('?')[0]; // 移除查询参数
            }

            // 获取文件扩展名，优先使用用户选择的格式
            let fileExtension = userFormat ? `.${userFormat}` : getFileExtension(imageUrl);
            const fileName = customFileName ? `${customFileName}${fileExtension}` : getFileNameFromUrl(imageUrl);

            // 对于微信头像等特殊图片使用代理
            const finalUrl = imageUrl.includes('wx.qlogo.cn') ?
                `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}` :
                imageUrl;

            GM_xmlhttpRequest({
                method: 'GET',
                url: finalUrl,
                responseType: 'blob',
                headers: {
                    'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Referer': currentDomain.includes('doubao') ? 'https://www.doubao.com/' :
                              currentDomain.includes('jimeng') ? 'https://jimeng.jianying.com/' :
                              'https://www.meijian.com/',
                    'Origin': currentDomain.includes('doubao') ? 'https://www.doubao.com' :
                             currentDomain.includes('jimeng') ? 'https://jimeng.jianying.com' :
                             'https://www.meijian.com',
                    'User-Agent': navigator.userAgent
                },
                onprogress: function(progress) {
                    if (progress.lengthComputable) {
                        const percent = Math.round((progress.loaded / progress.total) * 100);
                        if (onProgress) onProgress(percent);
                    }
                },
                onload: function(response) {
                    try {
                        if (response.status === 200) {
                            const blob = response.response;

                            // 如果用户指定了格式且需要转换
                            if (userFormat && (blob.type.includes('webp') ||
                                               (userFormat === 'png' && blob.type.includes('jpeg')) ||
                                               (userFormat === 'jpg' && blob.type.includes('png')))) {

                                // 将图片转换为用户选择的格式
                                const img = new Image();
                                img.crossOrigin = 'anonymous';

                                img.onload = () => {
                                    const canvas = document.createElement('canvas');
                                    canvas.width = img.width;
                                    canvas.height = img.height;
                                    const ctx = canvas.getContext('2d');
                                    ctx.drawImage(img, 0, 0);

                                    // 根据用户选择的格式进行转换
                                    canvas.toBlob((convertedBlob) => {
                                        const url = URL.createObjectURL(convertedBlob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = fileName;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        setTimeout(() => URL.revokeObjectURL(url), 100);
                                        if (onSuccess) onSuccess();
                                    }, userFormat === 'png' ? 'image/png' : 'image/jpeg', userFormat === 'jpg' ? 0.92 : 1);
                                };

                                img.onerror = (err) => {
                                    console.error('图片格式转换失败:', err);
                                    if (onError) onError('图片格式转换失败');
                                };

                                img.src = URL.createObjectURL(blob);
                            } else {
                                // 直接下载原格式
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = fileName;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                setTimeout(() => URL.revokeObjectURL(url), 100);
                                if (onSuccess) onSuccess();
                            }
                        } else {
                            if (onError) onError(`HTTP ${response.status}`);
                        }
                    } catch (e) {
                        console.error('下载图片时出错:', e);
                        if (onError) onError(e.message || '下载失败');
                    }
                },
                onerror: function(error) {
                    console.error('请求图片失败:', error);
                    if (onError) onError(error.message || '网络错误');
                }
            });
        });
    }

    // 下载视频的函数
    function downloadVideo(videoUrl, onSuccess, customFileName, onProgress, onError) {
        // 下载前再次验证激活状态
        checkActivation().then(isActivated => {
            if (!isActivated) {
                if (onError) onError('激活状态无效，请重新激活');
                setTimeout(() => {
                    createActivationDialog();
                }, 1000);
                return;
            }

            const processedUrl = processVideoUrl(videoUrl);
            const fileExtension = '.mp4';
            const fileName = customFileName ? `${customFileName}${fileExtension}` : getFileNameFromUrl(processedUrl);

            GM_xmlhttpRequest({
                method: 'GET',
                url: processedUrl,
                responseType: 'blob',
                headers: {
                    'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Range': 'bytes=0-',
                    'Referer': currentDomain.includes('doubao') ?
                              'https://www.doubao.com/' :
                              'https://jimeng.jianying.com/',
                    'Origin': currentDomain.includes('doubao') ?
                             'https://www.doubao.com' :
                             'https://jimeng.jianying.com',
                    'User-Agent': navigator.userAgent
                },
                onprogress: function(progress) {
                    if (progress.lengthComputable && onProgress) {
                        const percent = Math.round((progress.loaded / progress.total) * 100);
                        onProgress(percent);
                    }
                },
                onload: function(response) {
                    if (response.status === 200 || response.status === 206) {
                        const blob = response.response;
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = fileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        setTimeout(() => URL.revokeObjectURL(url), 100);
                        if (onSuccess) onSuccess();
                    } else {
                        if (onError) onError(`HTTP ${response.status}`);
                    }
                },
                onerror: function(error) {
                    if (onError) onError(error.message || '网络错误');
                }
            });
        });
    }

    // 从 URL 中提取文件名
    function getFileNameFromUrl(url) {
        url = url.split('?')[0];
        const urlParts = url.split('/');
        let fileName = urlParts[urlParts.length - 1];

        if (fileName.includes('~')) {
            fileName = fileName.split('~')[0];
        }

        if (!fileName.match(/\.(mp4|webm|jpg|jpeg|png)$/i)) {
            fileName += url.includes('video') ? '.mp4' : '.jpeg';
        }

        return fileName;
    }

    // 修改右键菜单事件监听，增加对美间网站的支持
    document.addEventListener('contextmenu', safeEventHandler(function (event) {
        const target = event.target;

        try {
            // 检查是否是美间网站
            const isMeijian = window.location.hostname.includes('meijian.com');

            // 美间网站特殊处理
            if (isMeijian) {
                // 处理美间网站的图片
                let imageUrl = null;

                // 直接的img标签
                if (target.tagName.toLowerCase() === 'img') {
                    imageUrl = target.src;
                }
                // 查找最近的img标签
                else {
                    const closestImg = target.closest('div')?.querySelector('img');
                    if (closestImg) {
                        imageUrl = closestImg.src;
                    }

                    // 如果还没找到，尝试查找父元素中的图片
                    if (!imageUrl) {
                        const parentWithImg = target.closest('[style*="background-image"]');
                        if (parentWithImg) {
                            const bgImage = window.getComputedStyle(parentWithImg).backgroundImage;
                            if (bgImage && bgImage !== 'none') {
                                imageUrl = bgImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
                            }
                        }
                    }

                    // 查找特定的美间图片容器
                    if (!imageUrl) {
                        const meijianContainer = target.closest('.ai-matting-result') ||
                                                target.closest('.mj-box-preview-container') ||
                                                target.closest('.ai-design-preview');
                        if (meijianContainer) {
                            const imgElement = meijianContainer.querySelector('img');
                            if (imgElement) {
                                imageUrl = imgElement.src;
                            }
                        }
                    }
                }

                // 处理找到的图片URL
                if (imageUrl) {
                    event.preventDefault();

                    // 检查URL格式，确保是完整URL
                    if (imageUrl.startsWith('/')) {
                        imageUrl = window.location.origin + imageUrl;
                    }

                    // 立即显示确认对话框
                    createConfirmDialog(imageUrl, 'image', (url, onSuccess, fileName, onProgress, onError, userFormat) => {
                        downloadImage(url, onSuccess, fileName, onProgress, onError, userFormat);
                    });

                    // 验证激活状态
                    setTimeout(() => {
                        checkActivation().then(isActivated => {
                            if (!isActivated) {
                                const existingDialog = document.querySelector('.download-confirm-dialog');
                                const existingOverlay = document.querySelector('.download-confirm-overlay');
                                if (existingDialog) existingDialog.style.display = 'none';
                                if (existingOverlay) existingOverlay.style.display = 'none';
                                createActivationDialog();
                            }
                        });
                    }, 100);

                    return;
                }
            }

            // 处理普通的img标签(原有逻辑)
            if (target.tagName.toLowerCase() === 'img') {
                event.preventDefault();
                const imageUrl = target.src;
                if (imageUrl) {
                    // 立即显示确认对话框，避免任何网络请求导致的延迟
                    createConfirmDialog(imageUrl, 'image', (url, onSuccess, fileName, onProgress, onError, userFormat) => {
                        downloadImage(url, onSuccess, fileName, onProgress, onError, userFormat);
                    });

                    // 在对话框显示后，异步验证激活状态
                    setTimeout(() => {
                        checkActivation().then(isActivated => {
                            if (!isActivated) {
                                // 如果验证失败，关闭当前对话框并显示激活对话框
                                const existingDialog = document.querySelector('.download-confirm-dialog');
                                const existingOverlay = document.querySelector('.download-confirm-overlay');
                                if (existingDialog) existingDialog.style.display = 'none';
                                if (existingOverlay) existingOverlay.style.display = 'none';

                                createActivationDialog();
                            }
                        });
                    }, 100);
                }
            }
            else if (target.tagName.toLowerCase() === 'video' || target.closest('video')) {
                event.preventDefault();
                const videoElement = target.tagName.toLowerCase() === 'video' ?
                                   target : target.closest('video');

                if (videoElement) {
                    // 立即显示确认对话框
                    const videoUrl = videoElement.src || videoElement.querySelector('source')?.src || videoElement.getAttribute('data-src');
                    if (videoUrl) {
                        createConfirmDialog(videoUrl, 'video', (url, onSuccess, fileName, onProgress, onError) => {
                            downloadVideo(url, onSuccess, fileName, onProgress, onError);
                        });

                        // 异步验证和获取完整视频URL
                        Promise.all([
                            checkActivation(),
                            getRealVideoUrl(videoElement)
                        ]).then(([isActivated, realVideoUrl]) => {
                            if (!isActivated) {
                                // 如果验证失败，关闭当前对话框并显示激活对话框
                                const existingDialog = document.querySelector('.download-confirm-dialog');
                                const existingOverlay = document.querySelector('.download-confirm-overlay');
                                if (existingDialog) existingDialog.style.display = 'none';
                                if (existingOverlay) existingOverlay.style.display = 'none';

                                createActivationDialog();
                            } else if (realVideoUrl && realVideoUrl !== videoUrl) {
                                // 如果找到更好的视频URL，更新下载函数中的URL
                                const confirmBtn = document.querySelector('.download-confirm-dialog .confirm-btn');
                                if (confirmBtn) {
                                    confirmBtn.onclick = () => {
                                        confirmBtn.disabled = true;
                                        confirmBtn.textContent = '准备下载...';
                                        const customFileName = document.getElementById('fileName').value.trim();

                                        downloadVideo(
                                            realVideoUrl,
                                            handleDownloadSuccess,
                                            customFileName,
                                            handleDownloadProgress,
                                            handleDownloadError
                                        );
                                    };
                                }
                            }
                        });
                    }
                }
            }
        } catch (e) {
            console.error('处理右键菜单事件时出错:', e);
        }
    }), true);

    // 修改显示提示的函数
    function showUsageTip() {
        // 先检查激活状态
        const activationStatus = localStorage.getItem(ACTIVATION_KEY);
        if (activationStatus === 'activated') {
            return; // 如果已激活，不显示提示
        }

        // 检查今天是否已经显示过
        const today = new Date().toDateString();
        const lastShownDate = localStorage.getItem('lastTipShownDate');

        if (lastShownDate === today) {
            return; // 今天已经显示过，不再显示
        }

        const tip = document.createElement('div');
        tip.className = 'usage-tip';
        tip.innerHTML = `
            <span class="icon">💡</span>
            <div class="content">
                <span class="main-text">点击图片或视频，单击鼠标右键即可免费下载无水印的图片或视频</span>
                <span class="contact">有问题联系微信：<span class="copyable-wechat" style="cursor: pointer; color: #007AFF;">11208596</span></span>
            </div>
        `;
        document.body.appendChild(tip);

        // 添加复制微信号功能
        const wechatElement = tip.querySelector('.copyable-wechat');
        wechatElement.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止冒泡，避免触发整个提示的点击事件
            const tempInput = document.createElement('input');
            tempInput.value = '11208596';
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showFloatingTip('微信号已复制到剪贴板');
        });

        // 显示提示
        setTimeout(() => {
            tip.classList.add('show');
            // 记录显示日期
            localStorage.setItem('lastTipShownDate', today);
        }, 500);

        // 10秒后自动隐藏提示
        setTimeout(() => {
            tip.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(tip);
            }, 600);
        }, 10000);

        // 点击可以提前关闭提示
        tip.addEventListener('click', () => {
            tip.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(tip);
            }, 600);
        });
    }

    // 修改页面加载时的提示逻辑
    function initUsageTip() {
        if (window.location.hostname.includes('doubao.com') ||
            window.location.hostname.includes('jimeng.jianying.com') ||
            window.location.hostname.includes('meijian.com')) {

            // 页面加载完成后显示提示
            if (document.readyState === 'complete') {
                showUsageTip();
            } else {
                window.addEventListener('load', showUsageTip);
            }

            // 监听页面可见性变化，但仍然遵循每天显示一次的规则
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    showUsageTip();
                }
            });

            // 监听页面焦点变化，但仍然遵循每天显示一次的规则
            window.addEventListener('focus', showUsageTip);
        }
    }

    // 修改测试函数
    async function testFeishuAPI() {
        try {
            console.log('开始测试飞书API...');

            // 1. 测试获取访问令牌
            console.log('1. 测试获取访问令牌');
            const tokenResponse = await fetch(`${FEISHU_CONFIG.API_URL}/auth/v3/tenant_access_token/internal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "app_id": FEISHU_CONFIG.APP_ID,
                    "app_secret": FEISHU_CONFIG.APP_SECRET
                })
            });

            const tokenData = await tokenResponse.json();
            console.log('访问令牌响应:', tokenData);

            if (tokenData.code === 0) {
                FEISHU_CONFIG.TOKEN = tokenData.tenant_access_token;

                // 2. 测试查询表格
                console.log('2. 测试查询表格');
                const tableResponse = await fetch(`${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records?page_size=1`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${FEISHU_CONFIG.TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });

                const tableData = await tableResponse.json();
                console.log('表格数据响应:', tableData);

                if (tableData.code === 0) {
                    return '测试成功，API正常工作';
                } else {
                    return `表格查询失败: ${tableData.msg}`;
                }
            } else {
                return `获取访问令牌失败: ${tokenData.msg}`;
            }
        } catch (e) {
            console.error('测试出错:', e);
            return `测试失败: ${e.message}`;
        }
    }

    // 修改测试面板的创建方式
    function addTestPanel() {
        // 创建测试面板
        const testPanel = document.createElement('div');
        testPanel.innerHTML = `
            <div style="position: fixed; top: 10px; right: 10px; background: white; padding: 15px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 10000;">
                <h3 style="margin: 0 0 10px 0;">激活码管理测试面板</h3>
                <div style="margin-bottom: 10px;">
                    <button id="testAPIBtn" style="padding: 5px 10px;">测试飞书API</button>
                    <button id="generateCodeBtn" style="padding: 5px 10px;">生成新激活码</button>
                </div>
                <div style="margin-bottom: 10px;">
                    <input type="text" id="testCode" placeholder="输入激活码" style="padding: 5px; margin-right: 5px;">
                    <button id="verifyCodeBtn" style="padding: 5px 10px;">验证</button>
                    <button id="queryCodeBtn" style="padding: 5px 10px;">查询</button>
                </div>
                <div id="queryResult" style="margin-top: 10px;"></div>
                <div style="margin-top: 10px; font-size: 12px; color: #666;">
                    设备ID: ${localStorage.getItem('deviceId') || '未生成'}
                </div>
                <div style="margin-top: 10px;">
                    <label style="display: block; margin-bottom: 5px;">默认图片格式</label>
                    <select id="defaultImageFormat" style="padding: 5px; width: 100%;">
                        <option value="png" ${localStorage.getItem('default_image_format') === 'png' ? 'selected' : ''}>PNG格式</option>
                        <option value="jpg" ${localStorage.getItem('default_image_format') === 'jpg' ? 'selected' : ''}>JPG格式</option>
                    </select>
                </div>
            </div>
        `;
        document.body.appendChild(testPanel);

        // 添加事件监听器
        document.getElementById('testAPIBtn').addEventListener('click', async function() {
            const button = this;
            const originalText = button.textContent;
            button.disabled = true;
            button.textContent = '测试中...';

            try {
                const result = await testFeishuAPI();
                showFloatingTip(result);
            } catch (e) {
                showFloatingTip('测试失败，请查看控制台');
            } finally {
                button.disabled = false;
                button.textContent = originalText;
            }
        });

        document.getElementById('generateCodeBtn').addEventListener('click', async function() {
            try {
                const code = await generateActivationCode();
                if (code) {
                    document.getElementById('testCode').value = code;
                    showFloatingTip('激活码生成成功');
                } else {
                    showFloatingTip('生成失败，请查看控制台');
                }
            } catch (e) {
                console.error('生成测试激活码失败:', e);
                showFloatingTip('生成失败');
            }
        });

        document.getElementById('verifyCodeBtn').addEventListener('click', async function() {
            const code = document.getElementById('testCode').value.trim();
            if (!code) {
                showFloatingTip('请输入激活码');
                return;
            }

            const deviceId = localStorage.getItem('deviceId');
            if (!deviceId) {
                showFloatingTip('设备ID未生成');
                return;
            }

            try {
                const result = await verifyActivationCode(deviceId, code);
                showFloatingTip(result ? '验证成功' : '验证失败');
                if (result) {
                    setTimeout(() => window.location.reload(), 1500);
                }
            } catch (e) {
                console.error('验证测试激活码失败:', e);
                showFloatingTip('验证出错');
            }
        });

        document.getElementById('queryCodeBtn').addEventListener('click', function() {
            window.queryActivationCode();
        });

        // 增加默认图片格式保存功能
        document.getElementById('defaultImageFormat').addEventListener('change', function() {
            localStorage.setItem('default_image_format', this.value);
            showFloatingTip(`默认图片格式已设置为 ${this.value.toUpperCase()}`);
        });
    }

    // 修改测试面板显示条件
    function shouldShowTestPanel() {
        return false;
    }

    // 修改激活状态显示函数
    function showActivationStatus() {
        const activationStatus = localStorage.getItem(ACTIVATION_KEY);
        const expireTime = localStorage.getItem('expire_time');
        const deviceId = localStorage.getItem('deviceId');
        const remainingTime = localStorage.getItem('remaining_time') || '未知'; // 获取剩余时间

        // 创建或获取状态显示面板
        let statusPanel = document.getElementById('activation-status-panel');
        if (!statusPanel) {
            statusPanel = document.createElement('div');
            statusPanel.id = 'activation-status-panel';
            statusPanel.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.9);
                padding: 12px 16px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                font-size: 13px;
                z-index: 9999;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0,0,0,0.1);
            `;
            document.body.appendChild(statusPanel);
        }

        // 更新状态显示
        if (activationStatus === 'activated' && expireTime) {
            const now = new Date();
            const expire = new Date(expireTime);

            if (now > expire) {
                clearActivationInfo();
                statusPanel.innerHTML = `
                    <div style="color: #ff3b30;">激活已过期，请重新激活</div>
                    <div style="color: #666; margin-top: 4px; font-size: 12px;">
                        设备ID: <span class="copyable-device-id">${deviceId || '未知'}</span>
                    </div>
                    <div style="color: #666; margin-top: 4px; font-size: 12px;">
                        联系微信: <span class="copyable-wechat">11208596</span>
                    </div>
                `;
                return;
            }

            // 计算剩余时间
            const diffTime = expire - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            statusPanel.innerHTML = `
                <div style="color: #00c853;">✓ 已激活</div>
                <div style="color: #666; margin-top: 4px;">
                    剩余 ${remainingTime} 天
                </div>
                <div style="color: #666; margin-top: 4px; font-size: 12px;">
                    设备ID: <span class="copyable-device-id">${deviceId || '未知'}</span>
                </div>
                <div style="color: #666; margin-top: 4px; font-size: 12px;">
                    联系微信: <span class="copyable-wechat">11208596</span>
                </div>
            `;
        } else {
            statusPanel.innerHTML = `
                <div style="color: #ff3b30;">未激活</div>
                <div style="color: #666; margin-top: 4px; font-size: 12px;">
                    设备ID: <span class="copyable-device-id">${deviceId || '未知'}</span>
                </div>
                <div style="color: #666; margin-top: 4px; font-size: 12px;">
                    联系微信: <span class="copyable-wechat">11208596</span>
                </div>
            `;
        }

        // 添加点击复制设备ID的功能
        const deviceIdElement = statusPanel.querySelector('.copyable-device-id');
        if (deviceIdElement) {
            deviceIdElement.style.cursor = 'pointer';
            deviceIdElement.style.color = '#007AFF';
            deviceIdElement.addEventListener('click', function() {
                const tempInput = document.createElement('input');
                tempInput.value = deviceId;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showFloatingTip('设备ID已复制到剪贴板');
            });
        }

        // 添加点击复制微信号的功能
        const wechatElement = statusPanel.querySelector('.copyable-wechat');
        if (wechatElement) {
            wechatElement.style.cursor = 'pointer';
            wechatElement.style.color = '#007AFF';
            wechatElement.addEventListener('click', function() {
                const tempInput = document.createElement('input');
                tempInput.value = '11208596';
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showFloatingTip('微信号已复制到剪贴板');
            });
        }
    }

    // 添加全局错误处理和补丁
    function applyPatches() {
        // 处理 markWeb undefined 错误
        if (typeof window.markWeb === 'undefined') {
            window.markWeb = {
                markWeb: function() { return null; },
                init: function() { return null; },
                destroy: function() { return null; }
            };
        }

        // 处理可能缺失的其他依赖
        window.Slardar = window.Slardar || {
            init: function() { return null; },
            config: function() { return null; }
        };
    }

    // 修改预加载资源的函数
    function preloadResources() {
        // 在页面空闲时请求飞书API令牌
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                getFeishuAccessToken().catch(err => console.log('预加载令牌失败:', err));
            });
        } else {
            setTimeout(() => {
                getFeishuAccessToken().catch(err => console.log('预加载令牌失败:', err));
            }, 3000);
        }

        // 预创建DOM结构
        preCreateDialogElements();

        // 其它预加载...
    }

    // 在脚本初始化部分添加以下代码
    function preCreateDialogElements() {
        // 预先创建弹窗结构
        window._preCreatedDialog = document.createElement('div');
        window._preCreatedDialog.className = 'download-confirm-dialog';
        window._preCreatedDialog.style.display = 'none';

        window._preCreatedOverlay = document.createElement('div');
        window._preCreatedOverlay.className = 'download-confirm-overlay';
        window._preCreatedOverlay.style.display = 'none';

        document.body.appendChild(window._preCreatedOverlay);
        document.body.appendChild(window._preCreatedDialog);
    }

    // 添加直接下载功能按钮
    function addRightClickButton() {
        // 创建一个浮动按钮
        const button = document.createElement('button');
        button.innerHTML = '点击下载';
        button.className = 'download-direct-button';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 50px;
            padding: 10px 15px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;

        // 鼠标悬停效果
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#2980b9';
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#3498db';
        });

        // 查找并下载当前页面上最主要的图片或视频
        function findAndDownloadMainMedia() {
            console.log('尝试查找主要媒体元素');

            // 1. 首先尝试下载鼠标悬停的媒体
            const hoverImg = document.querySelector('img:hover');
            const hoverVideo = document.querySelector('video:hover');

            if (hoverImg && hoverImg.src) {
                console.log('找到鼠标悬停的图片');
                createConfirmDialog(hoverImg.src, 'image', (url, onSuccess, fileName, onProgress, onError, userFormat) => {
                    downloadImage(url, onSuccess, fileName, onProgress, onError, userFormat);
                });
                return true;
            } else if (hoverVideo) {
                console.log('找到鼠标悬停的视频');
                getRealVideoUrl(hoverVideo).then(videoUrl => {
                    if (videoUrl) {
                        createConfirmDialog(videoUrl, 'video', (url, onSuccess, fileName, onProgress, onError) => {
                            downloadVideo(url, onSuccess, fileName, onProgress, onError);
                        });
                    }
                });
                return true;
            }

            // 2. 查找视口中的主要媒体元素
            const visibleMedia = findVisibleMediaInViewport();
            if (visibleMedia) {
                if (visibleMedia.type === 'image') {
                    console.log('找到视口中的主要图片');
                    createConfirmDialog(visibleMedia.element.src, 'image', (url, onSuccess, fileName, onProgress, onError, userFormat) => {
                        downloadImage(url, onSuccess, fileName, onProgress, onError, userFormat);
                    });
                    return true;
                } else if (visibleMedia.type === 'video') {
                    console.log('找到视口中的主要视频');
                    getRealVideoUrl(visibleMedia.element).then(videoUrl => {
                        if (videoUrl) {
                            createConfirmDialog(videoUrl, 'video', (url, onSuccess, fileName, onProgress, onError) => {
                                downloadVideo(url, onSuccess, fileName, onProgress, onError);
                            });
                        }
                    });
                    return true;
                }
            }

            // 3. 如果没有找到主要媒体，尝试查找页面上任何可见的媒体
            const allImages = Array.from(document.querySelectorAll('img'))
                .filter(img => img.src && isElementVisible(img) && img.width > 100 && img.height > 100)
                .sort((a, b) => (b.width * b.height) - (a.width * a.height));

            const allVideos = Array.from(document.querySelectorAll('video'))
                .filter(video => isElementVisible(video));

            if (allImages.length > 0) {
                console.log('找到页面上最大的图片');
                createConfirmDialog(allImages[0].src, 'image', (url, onSuccess, fileName, onProgress, onError, userFormat) => {
                    downloadImage(url, onSuccess, fileName, onProgress, onError, userFormat);
                });
                return true;
            } else if (allVideos.length > 0) {
                console.log('找到页面上的视频');
                getRealVideoUrl(allVideos[0]).then(videoUrl => {
                    if (videoUrl) {
                        createConfirmDialog(videoUrl, 'video', (url, onSuccess, fileName, onProgress, onError) => {
                            downloadVideo(url, onSuccess, fileName, onProgress, onError);
                        });
                    }
                });
                return true;
            }

            // 如果什么都没找到
            alert('未找到可下载的图片或视频，请确保页面上有媒体内容');
            return false;
        }

        // 查找视口中最主要的媒体元素
        function findVisibleMediaInViewport() {
            // 获取视口尺寸
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const viewportCenterX = viewportWidth / 2;
            const viewportCenterY = viewportHeight / 2;

            // 查找所有可见的图片和视频
            const visibleImages = Array.from(document.querySelectorAll('img'))
                .filter(img => {
                    if (!img.src || !isElementVisible(img) || img.width < 100 || img.height < 100) {
                        return false;
                    }

                    const rect = img.getBoundingClientRect();
                    return (
                        rect.left < viewportWidth &&
                        rect.right > 0 &&
                        rect.top < viewportHeight &&
                        rect.bottom > 0
                    );
                });

            const visibleVideos = Array.from(document.querySelectorAll('video'))
                .filter(video => {
                    if (!isElementVisible(video)) return false;

                    const rect = video.getBoundingClientRect();
                    return (
                        rect.left < viewportWidth &&
                        rect.right > 0 &&
                        rect.top < viewportHeight &&
                        rect.bottom > 0
                    );
                });

            // 如果没有可见媒体，返回null
            if (visibleImages.length === 0 && visibleVideos.length === 0) {
                return null;
            }

            // 计算每个元素的分数（基于大小和与视口中心的距离）
            function calculateScore(element) {
                const rect = element.getBoundingClientRect();
                const area = rect.width * rect.height;

                // 计算元素中心点
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // 计算与视口中心的距离
                const distanceToCenter = Math.sqrt(
                    Math.pow(centerX - viewportCenterX, 2) +
                    Math.pow(centerY - viewportCenterY, 2)
                );

                // 分数 = 面积 / (距离+1)，加1避免除以0
                return area / (distanceToCenter + 1);
            }

            // 为所有媒体元素计算分数
            const scoredMedia = [];

            visibleImages.forEach(img => {
                scoredMedia.push({
                    element: img,
                    type: 'image',
                    score: calculateScore(img)
                });
            });

            visibleVideos.forEach(video => {
                scoredMedia.push({
                    element: video,
                    type: 'video',
                    score: calculateScore(video) * 1.5 // 视频权重略高
                });
            });

            // 按分数排序并返回最高分的媒体
            if (scoredMedia.length > 0) {
                scoredMedia.sort((a, b) => b.score - a.score);
                return scoredMedia[0];
            }

            return null;
        }

        // 检查元素是否可见
        function isElementVisible(el) {
            if (!el) return false;

            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                return false;
            }

            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        }

        // 添加点击事件处理程序 - 直接下载当前主要媒体
        button.addEventListener('click', async (event) => {
            event.preventDefault();

            try {
                console.log('下载按钮被点击');

                // 查找并下载主要媒体
                findAndDownloadMainMedia();

            } catch (err) {
                console.error('下载功能触发失败:', err);
                alert('下载功能初始化失败，请重试');
            }
        });

        // 将按钮添加到页面
        document.body.appendChild(button);
        console.log('下载按钮已添加到页面');
    }

    // 在initScript函数中调用
    function initScript() {
        try {
            // 应用补丁
            applyPatches();

            // 确保设备ID一致性
            getOrCreateDeviceId();

            // 预加载资源
            preloadResources();

            // 初始化提示
            initUsageTip();

            // 显示激活状态
            showActivationStatus();

            // 每分钟更新一次状态显示
            setInterval(showActivationStatus, 60000);

            // 如果启用测试面板
            if (shouldShowTestPanel()) {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', addTestPanel);
                } else {
                    addTestPanel();
                }
            }

            // 启动黑名单检查
            startBlacklistCheck();

            // 添加全局错误处理
            window.addEventListener('error', handleError, true);
            window.addEventListener('unhandledrejection', handleError, true);

            // 添加预创建弹窗
            preCreateDialogElements();

            // 添加右键模拟按钮
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', addRightClickButton);
            } else {
                addRightClickButton();
            }

        } catch (e) {
            console.error('初始化脚本时出错:', e);
        }
    }

    // 修改事件监听器添加方式
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            try {
                initScript();
            } catch (e) {
                console.error('DOMContentLoaded 初始化失败:', e);
            }
        });
    } else {
        try {
            initScript();
        } catch (e) {
            console.error('直接初始化失败:', e);
        }
    }

    // 添加安全的事件处理包装器
    function safeEventHandler(handler) {
        return function(event) {
            try {
                handler.call(this, event);
            } catch (e) {
                console.error('事件处理出错:', e);
                event.preventDefault();
                return false;
            }
        };
    }

    // 修改错误处理函数
    function handleError(event) {
        // 忽略特定的错误
        const errorMessage = event.error?.message || event.reason?.message || event.message || '';
        const ignoredErrors = [
            'markWeb',
            'NotSameOriginAfterDefaultedToSameOriginByCoep',
            'The resource',
            'preloaded using link preload',
            'screenshot.min.js',
            'content.js',
            'async/$.3f091a3f.js',
            'async/$.3d5ca379.css'
        ];

        if (ignoredErrors.some(err => errorMessage.includes(err))) {
            event.preventDefault();
            event.stopPropagation();
            return true;
        }

        console.error('脚本执行错误:', event.error || event.reason || event);
        return false;
    }

    // 修改清除激活信息的逻辑
    function clearActivationInfo() {
        // 清除共享存储
        localStorage.removeItem(SHARED_ACTIVATION_KEY);
        localStorage.removeItem(SHARED_CODE_KEY);
        localStorage.removeItem(SHARED_RECORD_KEY);
        localStorage.removeItem(SHARED_EXPIRE_KEY);

        // 清除原有存储
        localStorage.removeItem(ACTIVATION_KEY);
        localStorage.removeItem('activation_code');
        localStorage.removeItem('record_id');
        localStorage.removeItem('expire_time');
    }
})();