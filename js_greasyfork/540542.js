// ==UserScript==
// @name         Cursort Automatic Registration Assistant(JavaScript)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Cursor自动注册助手，需要配置临时邮箱和注册邮箱域名
// @author       ChatGPT
// @match        https://authenticator.cursor.sh/*
// @match        https://www.cursor.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540542/Cursort%20Automatic%20Registration%20Assistant%28JavaScript%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540542/Cursort%20Automatic%20Registration%20Assistant%28JavaScript%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 持久化配置（用于保存和加载用户自定义配置）
    const DEFAULT_CONFIG = {
        username: "",              // 临时邮箱用户名（用于收验证码）
        emailExtension: "@mailto.plus", // 临时邮箱服务后缀（如 @mailto.plus）
        epin: "",                        // 邮箱访问PIN码，用于登录临时邮箱
        domain: ""         // 注册用邮箱域名（如 123456.xyz）
    };

    // 读取本地配置
    function loadConfig() {
        return {
            username: GM_getValue('username', DEFAULT_CONFIG.username),
            emailExtension: GM_getValue('emailExtension', DEFAULT_CONFIG.emailExtension),
            epin: GM_getValue('epin', DEFAULT_CONFIG.epin),
            domain: GM_getValue('domain', DEFAULT_CONFIG.domain)
        };
    }
    // 保存配置
    function saveConfig(cfg) {
        GM_setValue('username', cfg.username);
        GM_setValue('emailExtension', cfg.emailExtension);
        GM_setValue('epin', cfg.epin);
        GM_setValue('domain', cfg.domain);
    }
    // 加载配置
    let config = loadConfig();

    const FIRST_NAMES = ["alex", "emily", "jason", "olivia", "ryan", "sophia", "thomas", "isabella", "william", "mia"];
    const LAST_NAMES = ["taylor", "anderson", "thompson", "jackson", "white", "harris", "martin", "thomas", "lewis", "clark"];

    // 颜色配置
    const COLORS = {
        primary: '#3498db',
        secondary: '#2ecc71',
        danger: '#e74c3c',
        warning: '#f39c12',
        info: '#34495e',
        light: '#ecf0f1',
        dark: '#2c3e50',
        background: 'rgba(30, 30, 30, 0.95)'
    };

    // 配置面板弹窗
    function showConfigPanel() {
        // 检查并移除所有同 id 面板，彻底避免重复
        const existings = document.querySelectorAll('#cursor-config-panel');
        existings.forEach(e => e.parentNode && e.parentNode.removeChild(e));
        // 创建面板
        const panel = document.createElement('div');
        panel.id = 'cursor-config-panel';
        panel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 40px;
            z-index: 99999;
            background: #fff;
            color: #222;
            border: 2px solid #3498db;
            border-radius: 8px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.18);
            padding: 24px 28px 18px 28px;
            min-width: 320px;
            font-size: 15px;
        `;
        panel.innerHTML = `
            <div style="height:46px;background:linear-gradient(90deg,#3498db 0%,#6dd5fa 100%);border-radius:8px 8px 0 0;display:flex;align-items:center;padding-left:22px;padding-right:14px;margin-bottom:18px;gap:10px;box-shadow:0 2px 8px #b3e0fc80;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="margin-right:7px;"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="#fff" stroke-width="1.7"/><path d="M19.4 15c-.6 1.1-1.4 2.1-2.4 2.9-2.5 2-6.1 2-8.6 0C6.3 17.1 5.5 16.1 4.9 15" stroke="#fff" stroke-width="1.7"/></svg>
                <span style="font-weight:bold;font-size:19px;letter-spacing:1px;color:#fff;text-shadow:0 2px 8px #1976d2a0;">邮箱配置</span>
            </div>
            <div style="margin-bottom:20px;padding:18px 16px 14px 16px;background:linear-gradient(110deg,#f7fafd 70%,#e3f2fd 100%);border-radius:10px;box-shadow:0 2px 12px rgba(52,152,219,0.09);border:1px solid #e3eaf3;">
                <div style="font-weight:700;margin-bottom:12px;font-size:15px;color:#1976d2;letter-spacing:0.5px;">临时邮箱账号</div>
                <div style="margin-bottom:12px;display:flex;align-items:center;">
                    <label style="display:flex;align-items:center;gap:2px;font-size:14px;">用户名:
                        <input id="config-username" style="width:130px;padding:7px 12px;border-radius:6px;border:1.2px solid #b0bec5;margin:0 4px 0 2px;box-shadow:0 2px 8px #e3f2fd;transition:all 0.18s;" value="${GM_getValue('username', DEFAULT_CONFIG.username)}">
                        <span style="margin-left:2px;color:#888;font-size:14px;">${GM_getValue('emailExtension', DEFAULT_CONFIG.emailExtension)}</span>
                    </label>
                </div>
                <div>
                    <label style="font-size:14px;">邮箱PIN:
                        <input id="config-epin" style="width:130px;padding:7px 12px;border-radius:6px;border:1.2px solid #b0bec5;margin-left:4px;box-shadow:0 2px 8px #e3f2fd;transition:all 0.18s;" value="${GM_getValue('epin', DEFAULT_CONFIG.epin)}">
                    </label>
                </div>
            </div>
            <div style="margin-bottom:20px;padding:18px 16px 14px 16px;background:linear-gradient(110deg,#f7fafd 70%,#e3f2fd 100%);border-radius:10px;box-shadow:0 2px 12px rgba(52,152,219,0.09);border:1px solid #e3eaf3;">
                <div style="font-weight:700;margin-bottom:12px;font-size:15px;color:#1976d2;letter-spacing:0.5px;">注册用邮箱域名</div>
                <label style="font-size:14px;">邮箱域名:
                    <input id="config-domain" style="width:180px;padding:7px 12px;border-radius:6px;border:1.2px solid #b0bec5;margin-left:6px;box-shadow:0 2px 8px #e3f2fd;transition:all 0.18s;" value="${GM_getValue('domain', DEFAULT_CONFIG.domain).replace(/^@/, '')}">
                </label>
                <span style="color:#888;font-size:13px;margin-left:8px;">不带@，如 example.com</span>
            </div>
            <div style="margin-top:18px;text-align:right;">
                <button id="config-save-btn" style="margin-right:14px;padding:8px 28px;background:linear-gradient(90deg,#3498db 60%,#6dd5fa 100%);color:#fff;border:none;border-radius:6px;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px #90caf9;transition:background 0.2s,box-shadow 0.2s;">保存</button>
                <button id="config-cancel-btn" style="padding:8px 22px;background:#f1f3f4;color:#1976d2;border:none;border-radius:6px;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px #e3f2fd;transition:background 0.2s,box-shadow 0.2s;">关闭</button>
            </div>
            <style>
                #cursor-config-panel button:hover { filter: brightness(1.09); box-shadow:0 4px 16px #90caf9; }
                #cursor-config-panel input:focus { outline: 2px solid #90caf9; border-color: #90caf9; background:#e3f2fd; }
            </style>
        `;
        document.body.appendChild(panel);

        // 拖动功能：通过顶部标题栏拖动整个面板
        const dragBar = panel.querySelector('div[style*="background:linear-gradient"]');
        let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
        dragBar.style.cursor = 'move';
        dragBar.addEventListener('mousedown', function (e) {
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                panel.style.left = (e.clientX - dragOffsetX) + 'px';
                panel.style.top = (e.clientY - dragOffsetY) + 'px';
                panel.style.right = '';
                panel.style.position = 'fixed';
            }
        });
        document.addEventListener('mouseup', function () {
            isDragging = false;
            document.body.style.userSelect = '';
        });

        // 保存按钮
        document.getElementById('config-save-btn').onclick = function () {
            const newConfig = {
                username: document.getElementById('config-username').value.trim(),
                emailExtension: GM_getValue('emailExtension', DEFAULT_CONFIG.emailExtension), // 保持当前
                epin: document.getElementById('config-epin').value.trim(),
                domain: document.getElementById('config-domain').value.trim().replace(/^@/, '')
            };
            saveConfig(newConfig);
            config = loadConfig(); // 立即同步到全局
            alert('保存成功！刷新页面后生效');
            panel.style.display = 'none';
        };

        // 关闭按钮
        document.getElementById('config-cancel-btn').onclick = function () {
            panel.style.display = 'none';
        };
    }

    // 日志UI配置
    const LOG_UI_CONFIG = {
        position: {
            bottom: 40,
            left: 20
        },
        dimensions: {
            width: 320,
            maxHeight: 450
        }
    };

    // 当前流程邮箱变量，仅在点击“开始注册”后生成
    let currentEmail = '';

    // 全局变量，用于存储最近获取到的验证码
    let lastVerificationCode = null;

    // 记录上一次获取的邮件ID和时间戳
    let lastEmailId = null;
    let lastEmailTime = 0;
    let waitingForNewEmail = false;

    // 创建日志UI
    function createLogUI() {
        const logContainer = document.createElement('div');
        logContainer.id = "auto-register-log";
        logContainer.style.cssText = `
            position: fixed;
            bottom: ${LOG_UI_CONFIG.position.bottom}px;
            left: ${LOG_UI_CONFIG.position.left}px;
            width: ${LOG_UI_CONFIG.dimensions.width}px;
            max-height: ${LOG_UI_CONFIG.dimensions.maxHeight}px;
            background: ${COLORS.background};
            border-radius: 10px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        logContainer.innerHTML = `
            <div style="
                padding: 14px 16px;
                background: ${COLORS.primary};
                color: white;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid ${COLORS.secondary};
            ">
                <span>Cursor简易注册助手</span>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <button id="clear-log" style="
                        background: transparent;
                        border: 1px solid rgba(255, 255, 255, 0.7);
                        color: white;
                        cursor: pointer;
                        font-size: 13px;
                        padding: 6px 12px;
                        border-radius: 4px;
                        transition: all 0.2s ease;
                    ">清除</button>
                    <button id="minimize-log" style="
                        background: transparent;
                        border: none;
                        color: white;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 6px 12px;
                        margin-left: 8px;
                        transition: all 0.2s ease;
                    ">_</button>
                    <button id="start-register-btn" style="
                        background: #43a047;
                        border: none;
                        color: white;
                        cursor: pointer;
                        font-size: 13px;
                        padding: 6px 16px;
                        border-radius: 4px;
                        font-weight: bold;
                        margin-left: 10px;
                        transition: background 0.2s;
                    ">开始注册</button>
                    <button id="config-gear-btn" title="配置" style="
                        background: transparent;
                        border: none;
                        color: white;
                        cursor: pointer;
                        padding: 6px 8px;
                        margin-left: 6px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: background 0.2s;
                    ">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="3.5" stroke="#fff" stroke-width="2"/>
                            <path d="M10 2v2M10 16v2M18 10h-2M4 10H2M15.07 15.07l-1.42-1.42M6.35 6.35L4.93 4.93M15.07 4.93l-1.42 1.42M6.35 13.65l-1.42 1.42" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div style="
                padding: 8px 16px;
                background: ${COLORS.dark};
                border-bottom: 1px solid ${COLORS.info};
                font-size: 12px;
                color: ${COLORS.light};
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                <span style="color: ${COLORS.secondary};">📢</span>
                <span>操作控制台</span>
            </div>
            <div id="log-content" style="
                padding: 16px;
                overflow-y: auto;
                max-height: calc(${LOG_UI_CONFIG.dimensions.maxHeight}px - 120px);
                font-size: 14px;
                color: ${COLORS.light};
                line-height: 1.5;
            "></div>
        `;

        document.body.appendChild(logContainer);

        // 最小化功能
        let isMinimized = false;
        const logContent = document.getElementById('log-content');
        // 配置齿轮按钮事件
        const configGearBtn = document.getElementById('config-gear-btn');
        if (configGearBtn) {
            configGearBtn.addEventListener('click', showConfigPanel);
        }
        const startRegisterBtn = document.getElementById('start-register-btn');
        if (startRegisterBtn) {
            startRegisterBtn.addEventListener('click', async () => {
                // 生成邮箱并自动填入及提交
                await fillEmailAndSubmit();
            });
        }
        const minimizeBtn = document.getElementById('minimize-log');

        minimizeBtn.addEventListener('click', () => {
            isMinimized = !isMinimized;
            logContent.style.display = isMinimized ? 'none' : 'block';
            minimizeBtn.textContent = isMinimized ? '▢' : '_';
        });

        // 清除日志功能
        const clearBtn = document.getElementById('clear-log');
        clearBtn.addEventListener('click', () => {
            logContent.innerHTML = '';
            logger.log('日志已清除', 'info');
        });

        return {
            log: function (message, type = 'info') {
                const logEntry = document.createElement('div');
                logEntry.className = 'log-entry ' + (type || 'info');
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                logEntry.textContent = `[${time}] ${message}`;
                logContent.appendChild(logEntry);
                logContent.scrollTop = logContent.scrollHeight;
            }
        };
    }

    // 创建全局日志对象
    const logger = createLogUI();
    logger.log('===== Cursor简易注册助手已启动 =====', 'success');
    logger.log('当前页面URL: ' + window.location.href);

    // 生成注册邮箱
    function generateRegisterEmail() {
        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const lastName = LAST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const timestamp = Date.now().toString(36); // 转换为36进制以缩短长度
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 生成4位随机数
        const username = `${firstName}${lastName}${timestamp}${randomNum}`;
        // 用 config.domain 作为域名
        let domain = (config.domain || '').trim().replace(/^@/, '');
        if (!domain) {
            throw new Error('请先在配置面板设置邮箱域名！');
        }
        return `${username}@${domain}`;
    }

    // 等待元素出现
    async function waitForElement(selector, timeout = 10000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) {
                return element;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

    // 从邮件文本中提取验证码 - 增强版，处理带空格的验证码
    function extractVerificationCode(mailText) {
        logger.log("尝试从邮件内容中提取验证码...");

        // 先尝试匹配常见的验证码格式
        const patterns = [
            /code is:?\s*(\d[\s\d]{0,11}\d)/i,  // "code is:" 后面的数字(可能带空格)
            /one-time code is:?\s*(\d[\s\d]{0,11}\d)/i,  // "one-time code is:" 后面的数字
            /verification code[^\d]*(\d[\s\d]{0,11}\d)/i,  // "verification code" 后面的数字
            /code[^\d]*(\d[\s\d]{0,11}\d)/i,  // "code" 后面的数字
            /\b(\d[\s\d]{0,11}\d)\b/  // 任何可能带空格的数字序列
        ];

        for (const pattern of patterns) {
            const match = mailText.match(pattern);
            if (match) {
                // 提取匹配到的验证码并移除所有空格
                const rawCode = match[1] || match[0];
                const cleanCode = rawCode.replace(/\s+/g, '');

                // 检查是否为6位数字
                if (/^\d{6}$/.test(cleanCode)) {
                    logger.log(`匹配到验证码: ${rawCode} -> 清理后: ${cleanCode}`);
                    return cleanCode;
                }
            }
        }

        // 如果上面的模式都没匹配到，尝试直接查找6位连续数字
        const directMatch = mailText.match(/\b\d{6}\b/);
        if (directMatch) {
            logger.log(`直接匹配到6位数字验证码: ${directMatch[0]}`);
            return directMatch[0];
        }

        logger.log("未能从邮件中提取到验证码", 'error');
        return null;
    }

    async function getLatestMailCode(forceNew = false) {
        function requestMailList() {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://tempmail.plus/api/mails?email=${config.username}${config.emailExtension}&epin=${config.epin}`,
                    onload: resolve,
                    onerror: reject
                });
            });
        }
        function requestMailDetail(firstId) {
            return new Promise((resolve, reject) => {
                const mailDetailUrl = `https://tempmail.plus/api/mails/${firstId}?email=${config.username}${config.emailExtension}&epin=${config.epin}`;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: mailDetailUrl,
                    onload: resolve,
                    onerror: reject
                });
            });
        }
        try {
            logger.log('请求邮箱API...');
            const mailListResponse = await requestMailList();
            logger.log('收到邮箱API响应，状态码: ' + mailListResponse.status);
            const mailListData = JSON.parse(mailListResponse.responseText);
            logger.log('邮件列表数据: ' + JSON.stringify(mailListData).substring(0, 100) + '...');
            if (!mailListData.result && !mailListData.first_id) {
                logger.log('未找到邮件', 'warning');
                if (waitingForNewEmail) {
                    logger.log('正在等待新邮件，请稍候...', 'info');
                    await new Promise(res => setTimeout(res, 2000));
                    return await getLatestMailCode(forceNew);
                }
                return null;
            }
            const firstId = mailListData.first_id;
            logger.log('找到邮件ID: ' + firstId);
            if (forceNew && firstId === lastEmailId) {
                logger.log('没有新邮件，继续等待...', 'warning');
                waitingForNewEmail = true;
                await new Promise(res => setTimeout(res, 2000));
                return await getLatestMailCode(forceNew);
            }
            lastEmailId = firstId;
            waitingForNewEmail = false;
            logger.log('请求邮件详情API...');
            const mailDetailResponse = await requestMailDetail(firstId);
            logger.log('收到邮件详情API响应，状态码: ' + mailDetailResponse.status);
            const mailDetailData = JSON.parse(mailDetailResponse.responseText);
            if (!mailDetailData.result && !mailDetailData.text) {
                logger.log('邮件详情获取失败', 'error');
                return null;
            }
            const mailText = mailDetailData.text || "";
            const mailSubject = mailDetailData.subject || "";
            const mailTime = mailDetailData.date ? new Date(mailDetailData.date).getTime() : Date.now();
            logger.log("找到邮件主题: " + mailSubject);
            logger.log("邮件内容前100字符: " + mailText.substring(0, 100) + "...");
            logger.log("邮件时间: " + new Date(mailTime).toLocaleString());
            if (forceNew && mailTime <= lastEmailTime) {
                logger.log('这不是最新的邮件，继续等待...', 'warning');
                waitingForNewEmail = true;
                await new Promise(res => setTimeout(res, 2000));
                return await getLatestMailCode(forceNew);
            }
            lastEmailTime = mailTime;
            const code = extractVerificationCode(mailText);
            if (code) {
                logger.log("成功提取验证码: " + code, 'success');
                lastVerificationCode = code;
            } else {
                logger.log("未能从邮件中提取到验证码", 'error');
            }
            return code;
        } catch (error) {
            logger.log("解析邮件列表或详情失败: " + error, 'error');
            return null;
        }
    }

    // 清空邮箱 - 修复方法，先获取邮件列表，然后删除每个邮件
    async function clearMailbox() {
        logger.log('尝试清空邮箱...');

        // 先获取邮件列表
        try {
            const mailListUrl = `https://tempmail.plus/api/mails?email=${config.username}${config.emailExtension}&limit=50&epin=${config.epin}`;

            const mailListResponse = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: mailListUrl,
                    onerror: reject,
                    onload: async function (mailListResponse) {
                        try {
                            const mailListData = JSON.parse(mailListResponse.responseText);

                            if (!mailListData.result && !mailListData.first_id) {
                                logger.log('邮箱已经是空的', 'success');
                                // 重置邮件ID和时间戳
                                lastEmailId = null;
                                lastEmailTime = 0;
                                resolve(true);
                                return;
                            }

                            // 获取第一封邮件ID
                            const firstId = mailListData.first_id;
                            if (!firstId || firstId === 0) {
                                logger.log('邮箱没有可删除的邮件', 'success');
                                lastEmailId = null;
                                lastEmailTime = 0;
                                resolve(true);
                                return;
                            }
                            logger.log(`找到邮件，准备删除，first_id: ${firstId}`);

                            // 使用正确的删除方法
                            const clearUrl = `https://tempmail.plus/api/mails/${firstId}?email=${config.username}${config.emailExtension}&epin=${config.epin}`;

                            GM_xmlhttpRequest({
                                method: "DELETE",
                                url: clearUrl,
                                onload: function (response) {
                                    try {
                                        const result = JSON.parse(response.responseText);
                                        if (result.result) {
                                            logger.log('邮件删除成功，继续检查是否还有其他邮件', 'success');
                                            // 递归调用，直到邮箱清空
                                            clearMailbox().then(resolve).catch(reject);
                                        } else {
                                            logger.log('邮件删除失败', 'error');
                                            resolve(false);
                                        }
                                    } catch (error) {
                                        logger.log('解析删除响应失败: ' + error, 'error');
                                        resolve(false);
                                    }
                                },
                                onerror: function (error) {
                                    logger.log('删除邮件请求失败: ' + error, 'error');
                                    resolve(false);
                                }
                            });
                        } catch (error) {
                            logger.log('解析邮件列表失败: ' + error, 'error');
                            resolve(false);
                        }
                    },
                    onerror: function (error) {
                        logger.log('获取邮件列表失败: ' + error, 'error');
                        resolve(false);
                    }
                });
            });
        } catch (error) {
            logger.log('清空邮箱过程出错: ' + error, 'error');
            return false;
        }
    }

    // 获取验证码（带重试机制）
    async function getVerificationCode(maxRetries = 10, retryInterval = 3000, forceNew = false) {
        logger.log(`开始尝试获取验证码，最大重试次数: ${maxRetries}，间隔: ${retryInterval}ms，强制获取新验证码: ${forceNew}`);

        // 如果强制获取新验证码，先清空邮箱
        if (forceNew) {
            logger.log('强制获取新验证码，先清空邮箱');
            waitingForNewEmail = true;
            await clearMailbox();
        }

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            logger.log(`尝试获取验证码 (第 ${attempt + 1}/${maxRetries} 次)...`);
            try {
                const code = await getLatestMailCode(forceNew);
                if (code) {
                    logger.log("成功获取验证码: " + code, 'success');
                    return code;
                }
                if (attempt < maxRetries - 1) {
                    logger.log(`未获取到验证码，${retryInterval / 1000}秒后重试...`, 'warning');
                    await new Promise(resolve => setTimeout(resolve, retryInterval));
                }
            } catch (error) {
                logger.log("获取验证码出错: " + error, 'error');
                if (attempt < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, retryInterval));
                }
            }
        }
        throw new Error(`经过 ${maxRetries} 次尝试后仍未获取到验证码。`);

    }

    // 填写分离的验证码输入框
    function fillSeparateCodeInputs(code) {
        if (!code) {
            logger.log('验证码为空，无法填写', 'error');
            return false;
        }
        logger.log(`准备填写验证码: ${code}`);

        // 1. 选择所有可见的、maxlength=1 且 inputmode=numeric 的 input，按 DOM 顺序排列
        let codeInputs = Array.from(document.querySelectorAll('input[maxlength="1"][inputmode="numeric"]:not([type="hidden"]):not([disabled])'));
        codeInputs = codeInputs.filter(input => input.offsetParent !== null);

        // 2. 数量校验与日志
        if (codeInputs.length !== code.length) {
            logger.log(`验证码输入框数量(${codeInputs.length})与验证码长度(${code.length})不符`, 'error');
            // 输出所有相关 input 的属性，便于排查
            const allInputs = Array.from(document.querySelectorAll('input'));
            allInputs.forEach((input, idx) => {
                logger.log(`input[${idx}]: type=${input.type}, name=${input.name}, maxlength=${input.maxLength}, inputmode=${input.inputMode}, value='${input.value}', data-index=${input.getAttribute('data-index')}, class='${input.className}'`, 'info');
            });
            return false;
        }

        // 3. 依次填充验证码
        for (let i = 0; i < code.length; i++) {
            const digit = code[i];
            const input = codeInputs[i];
            try {
                input.focus();
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeInputValueSetter.call(input, digit);
            } catch (e) {
                input.value = digit;
            }
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new KeyboardEvent('keydown', { key: digit }));
            input.dispatchEvent(new KeyboardEvent('keypress', { key: digit }));
            input.dispatchEvent(new KeyboardEvent('keyup', { key: digit }));
            input.blur();
        }
        codeInputs[code.length - 1].focus();
        logger.log('验证码填写完成', 'success');

        // 4. 同步隐藏 input[type=hidden][name=code]
        const hiddenInput = document.querySelector('input[type="hidden"][name="code"]');
        if (hiddenInput) {
            try {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeInputValueSetter.call(hiddenInput, code);
            } catch (e) {
                hiddenInput.value = code;
            }
            hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
            hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
            logger.log('已自动填入隐藏验证码', 'success');
        }
        return true;
    }

    // 添加辅助提交按钮
    function addSubmitHelper() {
        // 检查是否已存在辅助按钮
        if (document.getElementById('cursor-submit-helper')) {
            return;
        }

        const submitHelper = document.createElement('button');
        submitHelper.id = 'cursor-submit-helper';
        submitHelper.textContent = '提交验证码';
        submitHelper.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;

        submitHelper.addEventListener('click', () => {
            logger.log('尝试辅助提交验证码');

            // 模拟按回车键
            document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            }));

            // 尝试提交表单
            const form = document.querySelector('form');
            if (form) {
                try {
                    if (typeof form.requestSubmit === 'function') {
                        form.requestSubmit();
                    } else {
                        form.submit();
                    }
                    logger.log('尝试提交表单', 'success');
                } catch (e) {
                    logger.log(`提交表单失败: ${e}`, 'error');
                }
            }
        });

        document.body.appendChild(submitHelper);
        logger.log('添加了辅助提交按钮', 'info');
    }

    // 填写邮箱并提交（点击“开始注册”后生成邮箱并填入再提交）
    async function fillEmailAndSubmit() {
        const emailInput = document.querySelector('input[name="email"]');
        if (emailInput) {
            logger.log('找到邮箱输入框');

            // 先清空邮箱，确保获取最新验证码
            logger.log('先清空邮箱，准备接收新验证码');
            await clearMailbox();

            // 生成新邮箱（随机）
            currentEmail = generateRegisterEmail();
            emailInput.value = currentEmail;
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            logger.log('使用邮箱: ' + currentEmail, 'info');
            logger.log('填写邮箱: ' + currentEmail);

            // 等待提交按钮可用
            const submitBtn = await waitForElement('button[type="submit"]');
            if (submitBtn) {
                submitBtn.click();
                logger.log('点击提交按钮，已清空邮箱，等待新验证码', 'success');
                waitingForNewEmail = true;
            } else {
                logger.log('未找到提交按钮', 'error');
            }
        } else {
            logger.log('未找到邮箱输入框', 'error');
        }
    }

    // 创建功能按钮 - 现已无任何手动按钮，所有流程自动化
    function createFunctionButtons() {
        // 此函数保留占位，已无任何按钮逻辑。
        // 所有注册、验证码、清空邮箱等操作均集成在自动注册流程中。
    }

    // 进入cursor.com首页自动点击“登录”按钮
    function autoClickCursorHomeLogin() {
        // 支持 https://www.cursor.com/cn、https://www.cursor.com/cn/ 及带参数
        if (/^https:\/\/www\.cursor\.com\/cn(\/?|\?.*)?$/.test(window.location.href)) {
            setTimeout(() => {
                const loginBtn = document.querySelector('a[href="/api/auth/login"]');
                if (loginBtn) {
                    logger && logger.log ? logger.log('自动点击首页登录按钮') : console.log('自动点击首页登录按钮');
                    loginBtn.click();
                } else {
                    logger && logger.log ? logger.log('未找到首页登录按钮，自动跳转登录页', 'warning') : console.log('未找到首页登录按钮，自动跳转登录页');
                    window.location.href = 'https://www.cursor.com/api/auth/login';
                }
            }, 400);
            return;
        }
    }

    // 启动时立即检测一次首页
    autoClickCursorHomeLogin();

    // 监听URL变化，动态更新按钮
    function setupUrlChangeListener() {
        // 保存当前URL
        let lastUrl = window.location.href;

        // 创建一个观察器实例
        const observer = new MutationObserver(() => {
            if (lastUrl !== window.location.href) {
                // 首页自动点登录
                autoClickCursorHomeLogin();
                lastUrl = window.location.href;
                logger.log('检测到URL变化: ' + lastUrl);

                // 自动点击“使用验证码登录”按钮
                if (/\/password(\?|$)/.test(lastUrl)) {
                    setTimeout(() => {
                        const magicBtn = document.querySelector('button[name="intent"][value="magic-code"]');
                        if (magicBtn) {
                            logger.log('自动点击“使用验证码登录”按钮');
                            magicBtn.click();
                        } else {
                            logger.log('未找到“使用验证码登录”按钮', 'warning');
                        }
                    }, 300); // 页面渲染延迟
                }
                // magic-code页面自动获取验证码
                if (/\/magic-code(\?|$)/.test(lastUrl)) {
                    setTimeout(async () => {
                        logger.log('检测到magic-code页面，自动获取验证码');
                        try {
                            const code = await getVerificationCode(10, 3000, false);
                            // 自动填写验证码输入框
                            if (code) {
                                fillSeparateCodeInputs(code);
                                logger.log('已自动填入验证码');
                            }
                        } catch (e) {
                            logger.log('自动获取验证码流程异常: ' + e, 'error');
                        }
                    }, 400);
                }

                // 移除旧按钮
                const oldButtons = document.getElementById('cursor-function-buttons');
                if (oldButtons) {
                    oldButtons.remove();
                }

                // 创建新按钮
                createFunctionButtons();
            }
        });

        // 配置观察选项
        const config = { subtree: true, childList: true };

        // 开始观察
        observer.observe(document.body, config);

        // 初始创建按钮
        createFunctionButtons();
    }

    // 添加样式
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    // ====== 插入全局美化CSS的函数 ======
    function injectGlobalStyle() {
        if (!document.getElementById('cursor-global-style')) {
            const style = document.createElement('style');
            style.id = 'cursor-global-style';
            style.innerHTML = `
            #cursor-config-panel, #auto-register-log {
                font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif !important;
            }
            #cursor-config-panel {
                background: #fff;
                border-radius: 14px !important;
                box-shadow: 0 8px 32px rgba(52,152,219,0.18), 0 2px 8px #b3e0fc80;
                border: none !important;
                color: #222;
            }
            #cursor-config-panel input {
                border-radius: 8px !important;
                border: 1.5px solid #b0bec5 !important;
                padding: 8px 14px !important;
                font-size: 15px !important;
                margin: 0 6px 0 2px;
                box-shadow: 0 2px 8px #e3f2fd;
                transition: all 0.18s;
                background: #fafdff;
            }
            #cursor-config-panel input:focus {
                outline: 2px solid #90caf9 !important;
                border-color: #3498db !important;
                background: #e3f2fd !important;
            }
            #cursor-config-panel button {
                border-radius: 8px !important;
                font-size: 16px !important;
                font-weight: 700;
                box-shadow: 0 2px 8px #90caf9;
                transition: background 0.2s, box-shadow 0.2s, filter 0.18s;
            }
            #cursor-config-panel button:hover {
                filter: brightness(1.12);
                box-shadow: 0 6px 24px #90caf9;
            }
            #auto-register-log {
                border-radius: 14px !important;
                box-shadow: 0 12px 40px rgba(52,152,219,0.22), 0 2px 8px #b3e0fc80;
                background: rgba(30, 30, 30, 0.97) !important;
                color: #ecf0f1 !important;
            }
            #auto-register-log button {
                border-radius: 8px !important;
                font-size: 15px !important;
                font-weight: 600;
                transition: background 0.18s, box-shadow 0.18s, filter 0.18s;
            }
            #auto-register-log button:hover {
                filter: brightness(1.09);
                box-shadow: 0 4px 16px #90caf9;
            }
            #auto-register-log #log-content {
                background: linear-gradient(110deg,#232e37 70%,#2e3e50 100%) !important;
                border-radius: 0 0 14px 14px !important;
            }
            .log-entry {
                margin-bottom: 10px;
                padding: 12px;
                border-radius: 8px;
                word-break: break-all;
                transition: all 0.3s ease;
                font-size: 14px;
                box-shadow: 0 1px 7px rgba(52,152,219,0.07);
            }
            .log-entry.success {
                background: linear-gradient(90deg,#e8f5e9 60%,#d0f8ce 100%);
                color: #2ecc71;
            }
            .log-entry.error {
                background: linear-gradient(90deg,#fdecea 60%,#ffd6d6 100%);
                color: #e74c3c;
            }
            .log-entry.warning {
                background: linear-gradient(90deg,#fffbe6 60%,#ffe9b3 100%);
                color: #f39c12;
            }
            .log-entry.info {
                background: linear-gradient(90deg,#e3f2fd 60%,#f7fafd 100%);
                color: #1976d2;
            }
            #cursor-config-panel label, #cursor-config-panel span,
            #cursor-config-panel .config-title {
                font-size: 15px !important;
            }
            #cursor-config-panel .config-title {
                font-weight: bold;
                color: #1976d2;
                margin-bottom: 10px;
            }
            #cursor-config-panel svg, #auto-register-log svg {
                vertical-align: middle;
            }
            `;
            document.head.appendChild(style);
        }
    }
    // 主函数
    async function main() {
        // 只在 Cursor 注册相关页面运行
        if (!window.location.href.includes('authenticator.cursor.sh')) {
            logger.log('当前页面不是Cursor注册页面，脚本不执行', 'info');
            return;
        }

        logger.log('===== 开始简易注册流程 =====', 'info');
        logger.log('接收邮箱: ' + config.username + config.emailExtension, 'info');

        // 添加样式
        addStyles();
        injectGlobalStyle();

        // 设置URL变化监听器，动态更新按钮
        setupUrlChangeListener();

        // 检查当前页面状态
        const currentUrl = window.location.href;

        // 严格检查是否在验证码页面 - 只有URL包含magic-code的才是验证码页面
        const isCodePage = currentUrl.includes('/magic-code') || currentUrl.includes('magic-code');
        // 修复：定义 emailInput，避免未定义错误
        const emailInput = document.querySelector('input[name="email"]');

        if (isCodePage) {
            logger.log('检测到验证码输入页面', 'success');
            // 如果是验证码页面，可以自动尝试获取验证码
            setTimeout(async () => {
                try {
                    logger.log('自动尝试获取验证码...');
                    const code = await getVerificationCode(10, 3000, false);
                    fillSeparateCodeInputs(code);
                } catch (error) {
                    logger.log('自动获取验证码失败: ' + error, 'error');
                    logger.log('请手动点击"获取验证码"按钮', 'warning');
                }
            }, 1000);
            return;
        }

        if (emailInput && !isCodePage) {
            logger.log('检测到邮箱输入页面');
            return;
        }

        logger.log('未识别当前页面状态，请使用右上角的功能按钮手动操作', 'warning');
    }

    // 启动脚本
    main().catch(error => logger.log('脚本执行出错: ' + error, 'error'));
}
)();