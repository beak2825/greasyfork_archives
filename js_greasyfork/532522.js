// ==UserScript==
// @name         蝉之助
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  在libulib网页上使用DeepSeek生成Stable Diffusion提示词，蝉蝉IP生成助手
// @author       You
// @match        https://libulib.com/*
// @match        https://*.liblib.art/*
// @match        https://liblib.art/sd/*
// @grant        GM_xmlhttpRequest
// @connect      api.deepseek.com
// @connect      api.jsonbin.io
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532522/%E8%9D%89%E4%B9%8B%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/532522/%E8%9D%89%E4%B9%8B%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    const VERSION = '2.1.0';
    const DEBUG_ENABLED = false; // 关闭调试日志以提高性能
    
    // 性能优化标志
    const ENABLE_LAZY_LOADING = true; // 懒加载模式，按需初始化组件
    const USE_PASSIVE_EVENTS = true; // 使用被动事件监听器
    const OFFSCREEN_INIT_DELAY = 500; // 非关键组件延迟初始化时间(ms)
    const MAX_LOG_LENGTH = 100; // 日志字符串最大长度
    
    // 新增：本地存储键名
    const LAST_TAB_KEY = 'libulib_last_selected_tab';
    const LOGIN_STATUS_KEY = 'libulib_login_status';
    
    // 邮箱格式验证函数
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // JSONBin.io API 配置
    const JSONBIN_API_URL = 'https://api.jsonbin.io/v3/b';
    const JSONBIN_API_KEY = '$2a$10$4KBwSkndc7MxyKP0/lr1l.T0ZBFXIFGLj9/hT4i1Alxe9jwjjqBO2';
    // 创建一个新的bin并将其ID填入这里
    const JSONBIN_BIN_ID = '67f348468960c979a57f9e97'; // 已配置JSONBin ID
    
    // 跟踪已注册的事件和计时器，便于清理
    const registeredEvents = [];
    const activeTimers = [];
    
    // 用户管理相关常量和变量
    const AUTH_STORAGE_KEY = 'libulib_auth_data';
    const DEFAULT_USERS = [
        { username: 'admin', password: 'admin123', isAdmin: true }
    ];
    
    // 用户登录状态
    let isLoggedIn = false;
    let currentUser = null;
    
    // 存储用户注册数据的数组
    let registeredUsers = [];
    
    // 加载已存储的用户数据
    async function loadUserData() {
        try {
            logDebug('[用户] 开始加载用户数据');
            
            // 尝试从JSONBin.io加载
            if (JSONBIN_BIN_ID && JSONBIN_BIN_ID !== 'YOUR_BIN_ID_HERE') {
                try {
                    const users = await fetchUsersFromJSONBin();
                    if (Array.isArray(users) && users.length > 0) {
                        registeredUsers = users;
                        // 同时更新本地备份
                        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
                        logDebug('[用户] 从JSONBin.io成功加载用户数据');
                        return true;
                    }
                } catch (error) {
                    logError('[用户] 从JSONBin.io加载失败，尝试使用本地数据:', error);
                }
            } else {
                logDebug('[用户] 未配置JSONBin.io Bin ID，尝试创建新的Bin');
                try {
                    await createNewJSONBin();
                } catch (error) {
                    logError('[用户] 创建新的JSONBin失败:', error);
                }
            }
            
            // 尝试从本地存储加载
            const storedData = localStorage.getItem(AUTH_STORAGE_KEY);
            if (storedData) {
                registeredUsers = JSON.parse(storedData);
                logDebug('[用户] 从本地存储成功加载用户数据');
                
                // 如果JSONBin.io配置正确，尝试同步本地数据到远程
                if (JSONBIN_BIN_ID && JSONBIN_BIN_ID !== 'YOUR_BIN_ID_HERE') {
                    try {
                        await saveUsersToJSONBin();
                        logDebug('[用户] 本地数据已同步到JSONBin.io');
                    } catch (error) {
                        logError('[用户] 同步本地数据到JSONBin.io失败:', error);
                    }
                }
                
                return true;
            } else {
                // 首次使用，初始化默认用户
                registeredUsers = [...DEFAULT_USERS];
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(registeredUsers));
                logDebug('[用户] 初始化默认用户数据');
                
                // 如果JSONBin.io配置正确，同步默认用户到远程
                if (JSONBIN_BIN_ID && JSONBIN_BIN_ID !== 'YOUR_BIN_ID_HERE') {
                    try {
                        await saveUsersToJSONBin();
                        logDebug('[用户] 默认用户数据已同步到JSONBin.io');
                    } catch (error) {
                        logError('[用户] 同步默认用户数据到JSONBin.io失败:', error);
                    }
                }
                
                return true;
            }
        } catch (error) {
            logError('[用户] 加载用户数据失败:', error);
            // 使用默认用户作为最后的后备方案
            registeredUsers = [...DEFAULT_USERS];
            return false;
        }
    }
    
    // 调试日志函数，仅在开启调试模式时输出
    function logDebug(...args) {
        if (!DEBUG_ENABLED) return;
        
        // 限制日志长度，防止过长字符串
        const processedArgs = args.map(arg => {
            if (typeof arg === 'string' && arg.length > MAX_LOG_LENGTH) {
                return arg.substring(0, MAX_LOG_LENGTH) + '...';
            }
            return arg;
        });
        
        console.log(...processedArgs);
    }
    
    // 错误日志函数，始终输出
    function logError(...args) {
        console.error(...args);
    }
    
    // 从JSONBin.io获取用户数据
    async function fetchUsersFromJSONBin() {
        logDebug('[JSONBin] 开始从JSONBin.io获取用户数据');
        
        try {
            // 检查是否有配置bin ID
            if (!JSONBIN_BIN_ID || JSONBIN_BIN_ID === 'YOUR_BIN_ID_HERE') {
                throw new Error('未配置JSONBin.io Bin ID');
            }
            
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${JSONBIN_API_URL}/${JSONBIN_BIN_ID}`,
                    headers: {
                        'X-Master-Key': JSONBIN_API_KEY,
                        'X-Bin-Meta': false
                    },
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const userData = JSON.parse(response.responseText);
                                logDebug('[JSONBin] 成功获取用户数据');
                                resolve(userData);
                            } catch (error) {
                                logError('[JSONBin] 解析用户数据失败:', error);
                                reject(error);
                            }
                        } else {
                            logError(`[JSONBin] 获取数据失败: ${response.status} ${response.statusText}`);
                            reject(new Error(`获取数据失败: ${response.status} ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        logError('[JSONBin] 网络请求失败:', error);
                        reject(new Error('网络请求失败'));
                    }
                });
            });
        } catch (error) {
            logError('[JSONBin] 从JSONBin.io获取用户数据过程中出错:', error);
            throw error;
        }
    }

    // 保存用户数据到JSONBin.io
    async function saveUsersToJSONBin() {
        logDebug('[JSONBin] 开始保存用户数据到JSONBin.io');
        
        try {
            // 检查是否有配置bin ID
            if (!JSONBIN_BIN_ID || JSONBIN_BIN_ID === 'YOUR_BIN_ID_HERE') {
                throw new Error('未配置JSONBin.io Bin ID');
            }
            
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'PUT',
                    url: `${JSONBIN_API_URL}/${JSONBIN_BIN_ID}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': JSONBIN_API_KEY
                    },
                    data: JSON.stringify(registeredUsers),
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            logDebug('[JSONBin] 用户数据成功保存到JSONBin.io');
                            resolve(true);
                        } else {
                            logError(`[JSONBin] 保存数据失败: ${response.status} ${response.statusText}`);
                            reject(new Error(`保存数据失败: ${response.status} ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        logError('[JSONBin] 网络请求失败:', error);
                        reject(new Error('网络请求失败'));
                    }
                });
            });
        } catch (error) {
            logError('[JSONBin] 保存用户数据到JSONBin.io过程中出错:', error);
            throw error;
        }
    }

    // 创建新的Bin (首次使用时)
    async function createNewJSONBin() {
        logDebug('[JSONBin] 开始创建新的JSONBin');
        
        try {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: JSONBIN_API_URL,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': JSONBIN_API_KEY
                    },
                    data: JSON.stringify(DEFAULT_USERS),
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const responseData = JSON.parse(response.responseText);
                                if (responseData.metadata && responseData.metadata.id) {
                                    const binId = responseData.metadata.id;
                                    logDebug(`[JSONBin] 成功创建新的JSONBin，ID: ${binId}`);
                                    alert(`成功创建新的JSONBin！请将以下ID复制到脚本中的JSONBIN_BIN_ID变量:\n${binId}`);
                                    resolve(binId);
                                } else {
                                    reject(new Error('响应中没有找到Bin ID'));
                                }
                            } catch (error) {
                                logError('[JSONBin] 解析创建响应失败:', error);
                                reject(error);
                            }
                        } else {
                            logError(`[JSONBin] 创建Bin失败: ${response.status} ${response.statusText}`);
                            reject(new Error(`创建Bin失败: ${response.status} ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        logError('[JSONBin] 网络请求失败:', error);
                        reject(new Error('网络请求失败'));
                    }
                });
            });
        } catch (error) {
            logError('[JSONBin] 创建新的JSONBin过程中出错:', error);
            throw error;
        }
    }
    
    // 安全添加事件监听器，记录以便后续清理
    function safeAddEventListener(element, eventType, handler, options = {}) {
        if (!element) return null;
        
        // 默认添加passive:true以提高性能
        const eventOptions = USE_PASSIVE_EVENTS ? 
            {...options, passive: options.passive !== false} : options;
        
        element.addEventListener(eventType, handler, eventOptions);
        
        // 记录事件以便清理
        const eventRecord = {element, eventType, handler};
        registeredEvents.push(eventRecord);
        
        return eventRecord;
    }
    
    // 安全移除事件监听器
    function safeRemoveEventListener(eventRecord) {
        if (!eventRecord || !eventRecord.element) return;
        
        try {
            eventRecord.element.removeEventListener(
                eventRecord.eventType, 
                eventRecord.handler
            );
            
            // 从注册表中移除
            const index = registeredEvents.indexOf(eventRecord);
            if (index !== -1) {
                registeredEvents.splice(index, 1);
            }
        } catch (err) {
            // 忽略清理错误
        }
    }
    
    // 安全设置延时器，记录以便后续清理
    function safeSetTimeout(callback, delay) {
        const timerId = setTimeout(() => {
            // 执行回调
            callback();
            
            // 执行后从活动计时器列表移除
            const index = activeTimers.indexOf(timerId);
            if (index !== -1) {
                activeTimers.splice(index, 1);
            }
        }, delay);
        
        // 记录timer以便清理
        activeTimers.push(timerId);
        return timerId;
    }
    
    // 清理所有注册的事件和计时器
    function cleanupResources() {
        // 清理事件
        while (registeredEvents.length > 0) {
            safeRemoveEventListener(registeredEvents[0]);
        }
        
        // 清理计时器
        activeTimers.forEach(timerId => {
            clearTimeout(timerId);
        });
        activeTimers.length = 0;
    }

    // 在脚本开始时添加placeholder样式 - 延迟加载
    function addPlaceholderStyles() {
        // 检查是否已添加样式
        if (document.getElementById('libulib-prompt-helper-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'libulib-prompt-helper-styles';
        style.textContent = `
            input::placeholder,
            textarea::placeholder {
                color: #bbbbbb !important;
                opacity: 0.7 !important;
                font-style: italic !important;
            }
            
            /* 兼容不同浏览器 */
            input::-webkit-input-placeholder,
            textarea::-webkit-input-placeholder {
                color: #bbbbbb !important;
                opacity: 0.7 !important;
                font-style: italic !important;
            }
            
            input::-moz-placeholder,
            textarea::-moz-placeholder {
                color: #bbbbbb !important;
                opacity: 0.7 !important;
                font-style: italic !important;
            }
            
            input:-ms-input-placeholder,
            textarea:-ms-input-placeholder {
                color: #bbbbbb !important;
                opacity: 0.7 !important;
                font-style: italic !important;
            }
        `;
        
        // 使用requestAnimationFrame推迟渲染相关操作
        requestAnimationFrame(() => {
            document.head.appendChild(style);
        });
    }

    // DeepSeek API 配置
    const DEEPSEEK_API_KEY = 'sk-6fbd209f4e0649bb8b55286348a9f606';
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

    // 系统提示词 - 仅在需要时再加载到内存
    let SYSTEM_PROMPT = null;
    
    // 加载系统提示词 - 懒加载
    function loadSystemPrompt() {
        if (SYSTEM_PROMPT) return SYSTEM_PROMPT;
        
        SYSTEM_PROMPT = `你是一个专业的提示词生成助手，需要为Stable Diffusion F.1模型生成高质量的提示词。请遵循以下规则：

1. 需要符合Stable Diffusion F.1模型的提示词特征
2. 提示词必须精炼，格式整齐，清晰分成正向提示词和负向提示词两部分
3. 根据用户输入的需求自动发散提示词，提示词只用于stable diffusion生图相关内容
4. 必须确保生成的是完整的全身形象，正向提示词中加入"full body, full shot"关键词
5. 在负向提示词中必须加入"cropped, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, bad feet, fewer toes, extra toes"防止生成局部和低质量图像
6. 返回格式必须是纯JSON字符串，包含positive和negative两个字段，分别对应正向和负向提示词
7. 必须确保提示词与用户输入的需求高度相关，将用户提及的关键词放在提示词最前面，并增加权重
   - 例如，用户输入"火箭"，则正向提示词应以"rocket(1.4), space rocket(1.3), ..."开头
   - 给用户核心需求关键词增加权重(1.2)到(1.5)，越核心的需求权重越高
   - 次要关键词和相关描述放在后面，保持正常权重
8. 提示词顺序应按照相关性排序：核心需求 > 重要特征 > 场景描述 > 风格 > 辅助描述
9. 不要在开头或结尾添加\`\`\`json或其他任何额外说明，直接返回格式化的JSON字符串

返回的JSON格式示例（请确保返回格式完全一致，不添加任何额外内容）：
{
  "positive": "rocket(1.4), space rocket(1.3), detailed character, full body, full shot, [other positive prompts]",
  "negative": "cropped, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, bad feet, fewer toes, extra toes, [other negative prompts]"
}`;

        return SYSTEM_PROMPT;
    }

    // 创建用户输入模态框
    function createUserInputModal() {
        logDebug('创建提示词输入对话框');
        
        // 检查是否已登录
        if (!isLoggedIn || !currentUser) {
            logDebug('[用户] 未登录，跳转到登录界面');
            createAuthModal();
            return;
        }
        
        // 检查模态框是否已存在，防止重复创建
        if (document.getElementById('libulib-prompt-modal-overlay')) {
            logDebug('模态框已存在，不重复创建');
            return;
        }
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'libulib-prompt-modal-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
        overlay.style.zIndex = '10000';
        overlay.style.backdropFilter = 'blur(5px)';
        overlay.style.animation = 'libulibFadeIn 0.3s ease';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        
        // 移除此处重复的样式定义

        // 修改遮罩层点击事件，允许点击遮罩层关闭模态框
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                // 检查是否有未保存的更改
                const inputField = document.querySelector('#libulib-prompt-modal-overlay textarea');
                const hasInput = inputField && inputField.value.trim().length > 0;
                
                if (hasInput) {
                    const confirmClose = confirm('当前输入的内容尚未生成提示词，确定要关闭吗？');
                    if (!confirmClose) {
                        return;
                    }
                }
                document.body.removeChild(overlay);
            }
        });

        const modal = document.createElement('div');
        modal.style.position = 'absolute';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '28px';
        modal.style.borderRadius = '16px';
        modal.style.boxShadow = '0 10px 40px rgba(0,0,0,0.15)';
        modal.style.width = '520px';
        modal.style.maxWidth = '90%';
        modal.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '15px';
        closeButton.style.right = '15px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.color = '#999';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '5px';
        closeButton.style.lineHeight = '1';
        closeButton.style.transition = 'all 0.2s ease';
        closeButton.style.borderRadius = '4px';

        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = '#f5f5f5';
            closeButton.style.color = '#666';
        });

        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = 'transparent';
            closeButton.style.color = '#999';
        });

        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            // 检查是否有未保存的输入
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            
            // 修复选择器以匹配实际的输入类型
            let hasLoginInput = false;
            let hasRegisterInput = false;
            
            try {
                hasLoginInput = loginForm && (
                    (loginForm.querySelector('input[type="email"]')?.value.trim()) ||
                    (loginForm.querySelector('input[type="password"]')?.value.trim())
                );
            } catch (e) {
                console.error("检查登录表单输入时出错:", e);
            }
            
            try {
                hasRegisterInput = registerForm && (
                    (registerForm.querySelector('input[type="text"]')?.value.trim()) ||
                    (registerForm.querySelector('input[type="password"]')?.value.trim())
                );
            } catch (e) {
                console.error("检查注册表单输入时出错:", e);
            }
            
            if (hasLoginInput || hasRegisterInput) {
                const confirmClose = confirm('当前输入的内容尚未提交，确定要关闭吗？');
                if (!confirmClose) {
                    return;
                }
            }
            document.body.removeChild(overlay);
        });

        modal.appendChild(closeButton);
        
        // 添加用户信息栏
        const userInfoBar = document.createElement('div');
        userInfoBar.style.display = 'flex';
        userInfoBar.style.justifyContent = 'space-between';
        userInfoBar.style.alignItems = 'center';
        userInfoBar.style.marginBottom = '15px';
        userInfoBar.style.paddingBottom = '10px';
        userInfoBar.style.borderBottom = '1px solid #eee';
        
        // 用户信息显示
        const userInfo = document.createElement('div');
        userInfo.style.display = 'flex';
        userInfo.style.alignItems = 'center';
        userInfo.style.position = 'relative';
        userInfo.style.cursor = 'pointer';
        
        // 用户图标
        const userIcon = document.createElement('span');
        userIcon.textContent = '👤';
        userIcon.style.marginRight = '5px';
        userInfo.appendChild(userIcon);
        
        const usernameLabel = document.createElement('span');
        usernameLabel.textContent = `${currentUser.username}`;
        usernameLabel.style.fontSize = '14px';
        usernameLabel.style.color = '#666';
        usernameLabel.style.display = 'flex';
        usernameLabel.style.alignItems = 'center';
        usernameLabel.style.gap = '4px';

        // 添加下拉箭头图标
        const arrowIcon = document.createElement('span');
        arrowIcon.innerHTML = '▼';
        arrowIcon.style.fontSize = '10px';
        arrowIcon.style.color = '#999';
        arrowIcon.style.marginLeft = '4px';
        arrowIcon.style.transition = 'transform 0.2s ease';
        usernameLabel.appendChild(arrowIcon);
        
        userInfo.appendChild(usernameLabel);
        
        // 创建下拉菜单
        const dropdownMenu = document.createElement('div');
        dropdownMenu.style.position = 'absolute';
        dropdownMenu.style.top = '100%';
        dropdownMenu.style.left = '0';
        dropdownMenu.style.backgroundColor = 'white';
        dropdownMenu.style.border = '1px solid #eee';
        dropdownMenu.style.borderRadius = '6px';
        dropdownMenu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        dropdownMenu.style.padding = '8px 0';
        dropdownMenu.style.minWidth = '120px';
        dropdownMenu.style.display = 'none';
        dropdownMenu.style.zIndex = '1000';
        
        // 登出选项
        const logoutOption = document.createElement('div');
        logoutOption.textContent = '退出登录';
        logoutOption.style.padding = '8px 16px';
        logoutOption.style.fontSize = '14px';
        logoutOption.style.color = '#666';
        logoutOption.style.cursor = 'pointer';
        logoutOption.style.transition = 'all 0.2s ease';
        
        logoutOption.addEventListener('mouseover', () => {
            logoutOption.style.backgroundColor = '#f5f5f5';
            logoutOption.style.color = '#FF5B2E';
        });
        
        logoutOption.addEventListener('mouseout', () => {
            logoutOption.style.backgroundColor = 'transparent';
            logoutOption.style.color = '#666';
        });
        
        logoutOption.addEventListener('click', () => {
            const result = logoutUser();
            if(result.success) {
                document.body.removeChild(overlay);
                createAuthModal();
            }
        });
        
        dropdownMenu.appendChild(logoutOption);
        userInfo.appendChild(dropdownMenu);
        
        // 切换下拉菜单显示状态
        let isDropdownVisible = false;
        userInfo.addEventListener('click', (e) => {
            e.stopPropagation();
            isDropdownVisible = !isDropdownVisible;
            dropdownMenu.style.display = isDropdownVisible ? 'block' : 'none';
            arrowIcon.style.transform = isDropdownVisible ? 'rotate(180deg)' : 'rotate(0)';
        });
        
        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', () => {
            if (isDropdownVisible) {
                isDropdownVisible = false;
                dropdownMenu.style.display = 'none';
                arrowIcon.style.transform = 'rotate(0)';
            }
        });
        
        userInfoBar.appendChild(userInfo);
        modal.appendChild(userInfoBar);

        // 添加选项卡切换功能
        const tabContainer = document.createElement('div');
        tabContainer.style.display = 'flex';
        tabContainer.style.justifyContent = 'center';
        tabContainer.style.marginBottom = '24px';
        tabContainer.style.borderBottom = '1px solid #eee';
        tabContainer.style.position = 'relative';
        modal.appendChild(tabContainer);

        // 创建标签数据
        const tabs = [
            { id: 'general', text: '通用', active: true },
            { id: 'b-icon', text: 'B端图标', active: false },
            { id: 'chan-ip', text: '蝉蝉IP', active: false }
        ];

        // 保存当前活动的标签ID
        let activeTabId = 'general';
        
        // 创建标签元素
        tabs.forEach(tab => {
            const tabElement = document.createElement('div');
            tabElement.textContent = tab.text;
            tabElement.dataset.tabId = tab.id;
            tabElement.style.padding = '12px 20px';
            tabElement.style.cursor = 'pointer';
            tabElement.style.borderBottom = tab.active ? `2px solid #FF5B2E` : '2px solid transparent';
            tabElement.style.color = tab.active ? '#FF5B2E' : '#666';
            tabElement.style.fontWeight = tab.active ? 'bold' : 'normal';
            tabElement.style.transition = 'all 0.3s ease';
            tabElement.style.fontSize = '15px';
            tabElement.style.position = 'relative';

            // 标签点击事件
            tabElement.addEventListener('click', () => {
                // 更新所有标签状态
                tabContainer.querySelectorAll('div').forEach(el => {
                    const isActive = el.dataset.tabId === tab.id;
                    el.style.borderBottom = isActive ? `2px solid #FF5B2E` : '2px solid transparent';
                    el.style.color = isActive ? '#FF5B2E' : '#666';
                    el.style.fontWeight = isActive ? 'bold' : 'normal';
                });
                
                // 保存当前活动标签
                activeTabId = tab.id;
                // 保存选择的tab到本地存储
                localStorage.setItem(LAST_TAB_KEY, tab.id);
                
                // 根据选择的标签更新输入框占位符
                if (tab.id === 'general') {
                    inputField.placeholder = '例如：一个魔法师正在魔法学院施展魔法';
                    
                    // 隐藏特定标签的UI元素
                    if (iconOptionsContainer) iconOptionsContainer.style.display = 'none';
                    if (chanOptionsContainer) chanOptionsContainer.style.display = 'none';
                } else if (tab.id === 'b-icon') {
                    inputField.placeholder = '例如：设计一个简洁的商务风格邮件图标';
                    
                    // 显示B端图标特定选项，隐藏其他
                    if (iconOptionsContainer) iconOptionsContainer.style.display = 'block';
                    if (chanOptionsContainer) chanOptionsContainer.style.display = 'none';
                } else if (tab.id === 'chan-ip') {
                    inputField.placeholder = '例如：一个可爱的蝉蝉角色在森林里探险';
                    
                    // 显示蝉蝉IP特定选项，隐藏其他
                    if (iconOptionsContainer) iconOptionsContainer.style.display = 'none';
                    if (chanOptionsContainer) chanOptionsContainer.style.display = 'block';
                }
            });

            tabContainer.appendChild(tabElement);
        });

        
        // 输入框 - 提示词描述
        const inputLabel = document.createElement('div');
        inputLabel.textContent = '请输入你想要的图像描述';
        inputLabel.style.fontWeight = '600';
        inputLabel.style.marginBottom = '8px';
        inputLabel.style.fontSize = '15px';
        inputLabel.style.color = '#333';
        modal.appendChild(inputLabel);

        const inputField = document.createElement('textarea');
        inputField.style.width = '100%';
        inputField.style.height = '90px';
        inputField.style.marginBottom = '20px';
        inputField.style.padding = '14px';
        inputField.style.boxSizing = 'border-box';
        inputField.style.borderRadius = '10px';
        inputField.style.border = '1px solid #e1e1e1';
        inputField.style.fontSize = '14px';
        inputField.style.fontFamily = 'inherit';
        inputField.style.transition = 'border-color 0.3s ease';
        inputField.style.resize = 'none';
        inputField.placeholder = '例如：一个魔法师正在魔法学院施展魔法';
        // 设置placeholder颜色更淡
        inputField.style.setProperty('::placeholder', 'color: #bbb', 'important');
        // 对各浏览器的兼容性设置
        const placeholderStyles = document.createElement('style');
        placeholderStyles.textContent = `
            ::placeholder { color: #bbb !important; opacity: 0.7; }
            ::-webkit-input-placeholder { color: #bbb !important; opacity: 0.7; }
            ::-moz-placeholder { color: #bbb !important; opacity: 0.7; }
            :-ms-input-placeholder { color: #bbb !important; opacity: 0.7; }
            :-moz-placeholder { color: #bbb !important; opacity: 0.7; }
        `;
        document.head.appendChild(placeholderStyles);
        inputField.addEventListener('focus', () => {
            inputField.style.borderColor = '#FF5B2E';
            inputField.style.outline = 'none';
            inputField.style.boxShadow = '0 0 0 3px rgba(255, 91, 46, 0.15)';
        });
        inputField.addEventListener('blur', () => {
            inputField.style.borderColor = '#e1e1e1';
            inputField.style.boxShadow = 'none';
        });
        modal.appendChild(inputField);
        
        // B端图标特定选项
        const iconOptionsContainer = document.createElement('div');
        iconOptionsContainer.style.display = 'none'; // 默认隐藏
        iconOptionsContainer.style.marginBottom = '20px';
        iconOptionsContainer.style.backgroundColor = '#f9f9f9';
        iconOptionsContainer.style.padding = '15px 20px';
        iconOptionsContainer.style.borderRadius = '12px';
        iconOptionsContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
        modal.appendChild(iconOptionsContainer);

        // 添加"不要底座"选项
        const noBaseCheckboxContainer = document.createElement('div');
        noBaseCheckboxContainer.style.display = 'flex';
        noBaseCheckboxContainer.style.alignItems = 'center';
        noBaseCheckboxContainer.style.cursor = 'pointer';

        const noBaseCheckbox = document.createElement('input');
        noBaseCheckbox.type = 'checkbox';
        noBaseCheckbox.id = 'b-icon-no-base';
        noBaseCheckbox.style.marginRight = '10px';
        noBaseCheckbox.style.cursor = 'pointer';
        noBaseCheckbox.style.accentColor = '#FF5B2E'; // 美化checkbox颜色

        const noBaseLabel = document.createElement('label');
        noBaseLabel.htmlFor = 'b-icon-no-base';
        noBaseLabel.textContent = '更简约';
        noBaseLabel.style.fontSize = '14px';
        noBaseLabel.style.color = '#444';
        noBaseLabel.style.cursor = 'pointer';

        noBaseCheckboxContainer.appendChild(noBaseCheckbox);
        noBaseCheckboxContainer.appendChild(noBaseLabel);
        iconOptionsContainer.appendChild(noBaseCheckboxContainer);

        // 点击label也能切换checkbox状态
        noBaseCheckboxContainer.addEventListener('click', (e) => {
            // 避免label点击触发两次事件
            if (e.target !== noBaseCheckbox) {
                noBaseCheckbox.checked = !noBaseCheckbox.checked;
            }
        });

        // 蝉蝉IP特定选项
        const chanOptionsContainer = document.createElement('div');
        chanOptionsContainer.style.marginBottom = '20px';
        chanOptionsContainer.style.display = 'none'; // 默认隐藏
        chanOptionsContainer.style.backgroundColor = '#f9f9f9';
        chanOptionsContainer.style.padding = '15px 20px';
        chanOptionsContainer.style.borderRadius = '12px';
        chanOptionsContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
        modal.appendChild(chanOptionsContainer);
        
        // 添加蝉蝉IP选项标题和展开/收起按钮
        const chanOptionsHeader = document.createElement('div');
        chanOptionsHeader.style.display = 'flex';
        chanOptionsHeader.style.justifyContent = 'space-between';
        chanOptionsHeader.style.alignItems = 'center';
        chanOptionsHeader.style.marginBottom = '15px';
        chanOptionsHeader.style.cursor = 'pointer';
        chanOptionsHeader.style.paddingBottom = '8px';
        chanOptionsHeader.style.borderBottom = '1px solid #eee';
        chanOptionsContainer.appendChild(chanOptionsHeader);
        
        const chanOptionsTitle = document.createElement('div');
        chanOptionsTitle.textContent = '角色设置';
        chanOptionsTitle.style.fontSize = '16px';
        chanOptionsTitle.style.fontWeight = '600';
        chanOptionsTitle.style.color = '#333';
        chanOptionsHeader.appendChild(chanOptionsTitle);
        
        // 使用SVG替代文本三角形，确保旋转不会变形
        const toggleIcon = document.createElement('div');
        toggleIcon.innerHTML = `
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        toggleIcon.style.display = 'flex';
        toggleIcon.style.alignItems = 'center';
        toggleIcon.style.justifyContent = 'center';
        toggleIcon.style.transition = 'transform 0.3s ease';
        chanOptionsHeader.appendChild(toggleIcon);
        
        // 创建角色设置内容容器
        const chanOptionsContent = document.createElement('div');
        chanOptionsContent.style.display = 'none'; // 默认隐藏
        chanOptionsContainer.appendChild(chanOptionsContent);
        
        // 创建双列布局容器
        const chanOptionsGrid = document.createElement('div');
        chanOptionsGrid.style.display = 'grid';
        chanOptionsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        chanOptionsGrid.style.gap = '16px';
        chanOptionsContent.appendChild(chanOptionsGrid);
        
        // 添加点击展开/收起功能
        chanOptionsHeader.addEventListener('click', () => {
            const isExpanded = chanOptionsContent.style.display === 'block';
            chanOptionsContent.style.display = isExpanded ? 'none' : 'block';
            // 使用更可靠的旋转方式
            toggleIcon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        });
        
        // 创建蝉蝉IP的附加输入选项
        const chanOptions = [
            { id: 'holding', label: '手拿着', placeholder: '例如：滑板、魔法棒', icon: '👋' },
            { id: 'emotion', label: '情绪', placeholder: '例如：开心、惊讶', icon: '😊' },
            { id: 'viewpoint', label: '视角', placeholder: '例如：正面、侧面', icon: '👁️' },
            { id: 'action', label: '动作', placeholder: '例如：跑步、跳跃', icon: '🏃' },
            { id: 'scene', label: '场景', placeholder: '例如：森林、城市', icon: '🏞️' },
            { id: 'style', label: '风格', placeholder: '例如：可爱、酷炫', icon: '🎨' }
        ];
        
        chanOptions.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.style.marginBottom = '8px';
            
            // 创建带图标的标签
            const labelContainer = document.createElement('div');
            labelContainer.style.display = 'flex';
            labelContainer.style.alignItems = 'center';
            labelContainer.style.marginBottom = '6px';
            
            const iconSpan = document.createElement('span');
            iconSpan.textContent = option.icon;
            iconSpan.style.marginRight = '6px';
            iconSpan.style.fontSize = '14px';
            labelContainer.appendChild(iconSpan);
            
            const optionLabel = document.createElement('div');
            optionLabel.textContent = option.label;
            optionLabel.style.fontWeight = '500';
            optionLabel.style.fontSize = '14px';
            optionLabel.style.color = '#444';
            labelContainer.appendChild(optionLabel);
            
            optionDiv.appendChild(labelContainer);
            
            // 创建美化的输入框
            const optionInput = document.createElement('input');
            optionInput.type = 'text';
            optionInput.id = `chan-${option.id}`;
            optionInput.placeholder = option.placeholder;
            optionInput.style.width = '100%';
            optionInput.style.padding = '12px 15px';
            optionInput.style.boxSizing = 'border-box';
            optionInput.style.borderRadius = '10px';
            optionInput.style.border = '1px solid #e1e1e1';
            optionInput.style.fontSize = '14px';
            optionInput.style.backgroundColor = 'white';
            optionInput.style.transition = 'all 0.2s ease';
            optionInput.style.height = '48px';
            optionInput.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.03)';
            
            // 添加图标到输入框内部
            const inputContainer = document.createElement('div');
            inputContainer.style.position = 'relative';
            
            // 将输入框添加到容器
            inputContainer.appendChild(optionInput);
            
            // 添加焦点效果
            optionInput.addEventListener('focus', () => {
                optionInput.style.borderColor = '#FF5B2E';
                optionInput.style.outline = 'none';
                optionInput.style.boxShadow = '0 0 0 3px rgba(255, 91, 46, 0.15)';
                optionInput.style.transform = 'translateY(-1px)';
            });
            
            optionInput.addEventListener('blur', () => {
                optionInput.style.borderColor = '#e1e1e1';
                optionInput.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.03)';
                optionInput.style.transform = 'translateY(0)';
            });
            
            optionDiv.appendChild(inputContainer);
            chanOptionsGrid.appendChild(optionDiv);
        });
        
        // 根据当前活动标签显示对应选项
        if (activeTabId === 'b-icon') {
            iconOptionsContainer.style.display = 'block';
        } else if (activeTabId === 'chan-ip') {
            chanOptionsContainer.style.display = 'block';
        }

        // 加载状态区域
        const loadingContainer = document.createElement('div');
        loadingContainer.style.display = 'none';
        loadingContainer.style.maxHeight = '180px';
        loadingContainer.style.overflowY = 'auto';
        loadingContainer.style.fontSize = '14px';
        loadingContainer.style.color = '#555';
        modal.appendChild(loadingContainer);

        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.marginTop = '20px';
        modal.appendChild(buttonContainer);
        
        // 设置按钮宽度变量，确保两个按钮宽度一致
        const buttonWidth = '140px';
        
        // 创建生成提示词按钮
        const generateButton = document.createElement('button');
        generateButton.textContent = '生成提示词';
        generateButton.style.padding = '10px 24px';
        generateButton.style.backgroundColor = '#FF5B2E';
        generateButton.style.color = 'white';
        generateButton.style.border = 'none';
        generateButton.style.borderRadius = '6px';
        generateButton.style.cursor = 'pointer';
        generateButton.style.fontWeight = '600';
        generateButton.style.fontSize = '15px';
        generateButton.style.boxShadow = '0 2px 5px rgba(255, 91, 46, 0.3)';
        generateButton.style.transition = 'background-color 0.2s ease';
        generateButton.style.width = buttonWidth; // 设置固定宽度
        
        generateButton.addEventListener('mouseover', () => {
            generateButton.style.backgroundColor = '#ff4415';
        });
        
        generateButton.addEventListener('mouseout', () => {
            generateButton.style.backgroundColor = '#FF5B2E';
        });
        
        buttonContainer.appendChild(generateButton);
        
        // 添加优化提示词按钮（原语义优化按钮）
        const semanticOptimizeButton = document.createElement('button');
        semanticOptimizeButton.textContent = '优化提示词'; // 更改按钮文本
        semanticOptimizeButton.style.padding = '10px 24px';
        semanticOptimizeButton.style.backgroundColor = 'transparent';
        semanticOptimizeButton.style.color = '#444';
        semanticOptimizeButton.style.border = '1px solid #666';
        semanticOptimizeButton.style.borderRadius = '6px';
        semanticOptimizeButton.style.cursor = 'pointer';
        semanticOptimizeButton.style.fontWeight = '600';
        semanticOptimizeButton.style.fontSize = '15px';
        semanticOptimizeButton.style.marginLeft = '10px';
        semanticOptimizeButton.style.transition = 'all 0.2s ease';
        semanticOptimizeButton.style.width = buttonWidth; // 设置固定宽度
        
        semanticOptimizeButton.addEventListener('mouseover', () => {
            semanticOptimizeButton.style.backgroundColor = '#f0f0f0';
            semanticOptimizeButton.style.transform = 'translateY(-1px)';
        });
        
        semanticOptimizeButton.addEventListener('mouseout', () => {
            semanticOptimizeButton.style.backgroundColor = 'transparent';
            semanticOptimizeButton.style.transform = 'translateY(0)';
        });
        
        // 语义优化按钮点击事件
        semanticOptimizeButton.addEventListener('click', async () => {
            const userDescription = inputField.value.trim();
            if (!userDescription) {
                alert('请先输入您希望的语义场景描述');
                return;
            }
            
            // 显示加载状态
            loadingContainer.style.display = 'block';
            loadingContainer.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="font-weight: 500; color: #444;">正在进行提示词优化分析，请稍候...</div>
            </div>
            `;
            
            // 禁用按钮
            setButtonDisabled(generateButton, true, {
                defaultBgColor: '#FF5B2E',
                defaultTextColor: 'white'
            });
            
            setButtonDisabled(semanticOptimizeButton, true, {
                defaultBgColor: 'transparent',
                defaultTextColor: '#444',
                isOutlineButton: true
            });
            
            try {
                // 首先从文本框中获取当前的提示词
                const currentPrompt = {
                    positive: '',
                    negative: ''
                };
                
                // 尝试获取当前填写的提示词
                const textareas = document.querySelectorAll('textarea');
                if (textareas.length >= 2) {
                    // 获取正向提示词
                    const positiveTextarea = Array.from(textareas).find(t => t.placeholder === '请输入正向提示词 Prompt') || textareas[0];
                    currentPrompt.positive = positiveTextarea.value.trim();
                    
                    // 获取负向提示词
                    const negativeTextarea = Array.from(textareas).find(t => t.placeholder === '请输入负向提示词 Negative Prompt') || textareas[1];
                    currentPrompt.negative = negativeTextarea.value.trim();
                }
                
                // 如果没有现有提示词，提示用户
                if (!currentPrompt.positive) {
                    loadingContainer.innerHTML += `<div style="color: orange;">警告：未检测到现有提示词，将根据您的描述生成新的提示词。</div>`;
                    
                    // 调用普通的提示词生成
                    const result = await callDeepSeekAPI(userDescription, loadingContainer, activeTabId);
                    
                    // 关闭模态框并填充结果
                    document.body.removeChild(overlay);
                    fillPromptFields(result);
                } else {
                    // 有现有提示词，进行语义优化
                    loadingContainer.innerHTML += `<div>检测到现有提示词，正在进行语义优化...</div>`;
                    loadingContainer.innerHTML += `<div style="margin-top: 8px; font-size: 13px; color: #666;">当前正向提示词: ${currentPrompt.positive.substring(0, 100)}${currentPrompt.positive.length > 100 ? '...' : ''}</div>`;
                    
                    // 调用语义优化功能
                    const optimizedResult = await semanticOptimizePrompt(userDescription, currentPrompt, loadingContainer);
                    
                    // 关闭模态框并填充优化后的结果
                    document.body.removeChild(overlay);
                    fillPromptFields(optimizedResult);
                }
            } catch (error) {
                loadingContainer.innerHTML += `
                <div style="background-color: #fff2f2; padding: 10px; margin-top: 8px; border-radius: 8px; border-left: 3px solid #f44336;">
                    <div style="font-weight: 500; color: #d32f2f; margin-bottom: 5px;">发生错误: ${error.message}</div>
                </div>`;
                
                // 恢复按钮状态
                setButtonDisabled(generateButton, false, {
                    defaultBgColor: '#FF5B2E',
                    defaultTextColor: 'white'
                });
                
                setButtonDisabled(semanticOptimizeButton, false, {
                    defaultBgColor: 'transparent',
                    defaultTextColor: '#444',
                    isOutlineButton: true
                });
            }
        });
        
        buttonContainer.appendChild(semanticOptimizeButton);
        
        // 检查是否在physton-gradio-container环境中
        const isInPhystonContainer = !!document.querySelector('.physton-gradio-container');
        const isInTabsContent = !!document.querySelector('.el-tabs__content');

        // 根据容器类型添加第二个按钮
        if (isInPhystonContainer) {
            // 移除优化提示词按钮代码
            // const optimizeButton = document.createElement('button');
            // optimizeButton.textContent = '优化提示词';
            // optimizeButton.style.padding = '12px 16px';
            // optimizeButton.style.backgroundColor = 'transparent';
            // optimizeButton.style.color = '#333333';
            // optimizeButton.style.border = '1px solid #333333';
            // optimizeButton.style.borderRadius = '10px';
            // optimizeButton.style.cursor = 'pointer';
            // optimizeButton.style.flex = '1';
            // optimizeButton.style.height = '52px';
            // optimizeButton.style.fontWeight = 'bold';
            // optimizeButton.style.fontSize = '15px';
            // optimizeButton.style.transition = 'all 0.2s ease';
            // optimizeButton.style.boxShadow = 'none';
            // optimizeButton.addEventListener('mouseover', () => {
            //     optimizeButton.style.backgroundColor = 'rgba(51, 51, 51, 0.05)';
            //     optimizeButton.style.transform = 'translateY(-2px)';
            //     optimizeButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            // });
            // optimizeButton.addEventListener('mouseout', () => {
            //     optimizeButton.style.backgroundColor = 'transparent';
            //     optimizeButton.style.transform = 'translateY(0)';
            //     optimizeButton.style.boxShadow = 'none';
            // });
            // buttonContainer.appendChild(optimizeButton);

            // 移除优化提示词按钮点击事件
            // optimizeButton.addEventListener('click', () => {
            //    ...
            // });
            
        } else if (isInTabsContent) {
            // 在el-tabs__content环境中添加两个按钮：开始生图和优化提示词
            const buttonGroup = document.createElement('div');
            buttonGroup.style.display = 'flex';
            buttonGroup.style.gap = '12px';
            buttonGroup.style.flex = '1';
            
            // 开始生图按钮
            const startGenerateButton = document.createElement('button');
            startGenerateButton.textContent = '开始生图';
            startGenerateButton.style.padding = '12px 16px';
            startGenerateButton.style.backgroundColor = '#333333';
            startGenerateButton.style.color = 'white';
            startGenerateButton.style.border = 'none';
            startGenerateButton.style.borderRadius = '10px';
            startGenerateButton.style.cursor = 'pointer';
            startGenerateButton.style.flex = '1';
            startGenerateButton.style.height = '52px';
            startGenerateButton.style.fontWeight = 'bold';
            startGenerateButton.style.fontSize = '15px';
            startGenerateButton.style.transition = 'all 0.2s ease';
            startGenerateButton.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.15)';
            startGenerateButton.addEventListener('mouseover', () => {
                startGenerateButton.style.backgroundColor = '#222222';
                startGenerateButton.style.transform = 'translateY(-2px)';
                startGenerateButton.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.2)';
            });
            startGenerateButton.addEventListener('mouseout', () => {
                startGenerateButton.style.backgroundColor = '#333333';
                startGenerateButton.style.transform = 'translateY(0)';
                startGenerateButton.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.15)';
            });
            buttonGroup.appendChild(startGenerateButton);
            
            // 删除优化提示词按钮
            // const optimizeButton = document.createElement('button');
            // optimizeButton.textContent = '优化提示词';
            // optimizeButton.style.padding = '12px 16px';
            // optimizeButton.style.backgroundColor = 'transparent';
            // optimizeButton.style.color = '#8A2BE2';
            // optimizeButton.style.border = '2px solid #8A2BE2';
            // optimizeButton.style.borderRadius = '10px';
            // optimizeButton.style.cursor = 'pointer';
            // optimizeButton.style.flex = '1';
            // optimizeButton.style.height = '52px';
            // optimizeButton.style.fontWeight = 'bold';
            // optimizeButton.style.fontSize = '15px';
            // optimizeButton.style.transition = 'all 0.2s ease';
            // optimizeButton.style.boxShadow = 'none';
            // optimizeButton.addEventListener('mouseover', () => {
            //     optimizeButton.style.backgroundColor = 'rgba(138, 43, 226, 0.05)';
            //     optimizeButton.style.transform = 'translateY(-2px)';
            //     optimizeButton.style.boxShadow = '0 4px 8px rgba(138, 43, 226, 0.1)';
            // });
            // optimizeButton.addEventListener('mouseout', () => {
            //     optimizeButton.style.backgroundColor = 'transparent';
            //     optimizeButton.style.transform = 'translateY(0)';
            //     optimizeButton.style.boxShadow = 'none';
            // });
            // buttonGroup.appendChild(optimizeButton);
            
            buttonContainer.appendChild(buttonGroup);
            
            // 开始生图按钮点击事件
            startGenerateButton.addEventListener('click', () => {
                // 关闭对话框
                document.body.removeChild(overlay);
                // 调用精确查找并触发生成按钮的函数
                findAndTriggerGenerateButton();
            });
            
            // 删除优化提示词按钮点击事件
            // optimizeButton.addEventListener('click', () => {
            //    ...
            // });
        } else {
            // 在其他环境中添加"开始生图"按钮
            const startGenerateButton = document.createElement('button');
            startGenerateButton.textContent = '开始生图';
            startGenerateButton.style.padding = '12px 16px';
            startGenerateButton.style.backgroundColor = '#333333';
            startGenerateButton.style.color = 'white';
            startGenerateButton.style.border = 'none';
            startGenerateButton.style.borderRadius = '10px';
            startGenerateButton.style.cursor = 'pointer';
            startGenerateButton.style.flex = '1';
            startGenerateButton.style.height = '52px';
            startGenerateButton.style.fontWeight = 'bold';
            startGenerateButton.style.fontSize = '15px';
            startGenerateButton.style.transition = 'all 0.2s ease';
            startGenerateButton.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.15)';
            startGenerateButton.addEventListener('mouseover', () => {
                startGenerateButton.style.backgroundColor = '#222222';
                startGenerateButton.style.transform = 'translateY(-2px)';
                startGenerateButton.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.2)';
            });
            startGenerateButton.addEventListener('mouseout', () => {
                startGenerateButton.style.backgroundColor = '#333333';
                startGenerateButton.style.transform = 'translateY(0)';
                startGenerateButton.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.15)';
            });
            buttonContainer.appendChild(startGenerateButton);

            // 点击开始生图按钮
            startGenerateButton.addEventListener('click', () => {
                // 关闭对话框
                document.body.removeChild(overlay);
                // 调用精确查找并触发生成按钮的函数
                findAndTriggerGenerateButton();
            });
        }

        generateButton.addEventListener('click', () => {
            const input = inputField.value.trim();

            if (!input) {
                alert('请输入图像描述');
                return;
            }

            // 初始化 API 调用选项
            let apiOptions = {};

            // 获取各个特定标签的选项值
            let additionalPrompt = '';
            
            // B端图标特定选项
            if (activeTabId === 'b-icon') {
                // 获取"不要底座"选项状态
                const noBaseChecked = document.getElementById('b-icon-no-base')?.checked || false;
                apiOptions.noBase = noBaseChecked;
            }
            
            // 蝉蝉IP特定选项
            else if (activeTabId === 'chan-ip') {
                const holding = document.getElementById('chan-holding').value.trim();
                const emotion = document.getElementById('chan-emotion').value.trim();
                const viewpoint = document.getElementById('chan-viewpoint').value.trim();
                const action = document.getElementById('chan-action').value.trim();
                const scene = document.getElementById('chan-scene').value.trim();
                const style = document.getElementById('chan-style').value.trim();
                
                let chanDetails = [];
                if (holding) chanDetails.push(`手拿着${holding}`);
                if (emotion) chanDetails.push(`情绪：${emotion}`);
                if (viewpoint) chanDetails.push(`视角：${viewpoint}`);
                if (action) chanDetails.push(`动作：${action}`);
                if (scene) chanDetails.push(`场景：${scene}`);
                if (style) chanDetails.push(`风格：${style}`);
                
                if (chanDetails.length > 0) {
                    additionalPrompt = `（${chanDetails.join('，')}）`;
                }
            }
            
            // 将额外提示词添加到主输入
            const finalInput = additionalPrompt ? `${input} ${additionalPrompt}` : input;

            // 显示加载状态
            loadingContainer.style.display = 'block';
            loadingContainer.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="width: 20px; height: 20px; border: 3px solid rgba(255, 91, 46, 0.3); border-radius: 50%; border-top-color: #FF5B2E; animation: spin 1s linear infinite; margin-right: 10px;"></div>
                <div style="font-weight: 500; color: #444;">正在调用AI生成提示词，请稍候...</div>
            </div>
            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>`;
            setButtonDisabled(generateButton, true, {
                defaultBgColor: '#FF5B2E',
                defaultTextColor: 'white'
            });

            // 禁用第二个按钮（无论是优化还是开始生图）
            const secondButton = buttonContainer.children[1];
            if (secondButton) {
                const isOutlineButton = secondButton.textContent.includes('优化');
                setButtonDisabled(secondButton, true, {
                    defaultBgColor: isOutlineButton ? 'transparent' : '#333333',
                    defaultTextColor: isOutlineButton ? '#444' : 'white',
                    isOutlineButton: isOutlineButton
                });
            }

            // 调用DeepSeek API，传递选项
            callDeepSeekAPI(finalInput, loadingContainer, activeTabId, apiOptions)
                .then(data => {
                    // 关闭模态框
                    document.body.removeChild(overlay);

                    // 填充表单
                    fillPromptFields(data);
                })
                .catch(error => {
                    loadingContainer.innerHTML += `
                    <div style="background-color: #fff2f2; padding: 10px; margin-top: 8px; border-radius: 8px; border-left: 3px solid #f44336;">
                        <div style="font-weight: 500; color: #d32f2f; margin-bottom: 5px;">发生错误: ${error.message}</div>
                    </div>`;
                    setButtonDisabled(generateButton, false, {
                        defaultBgColor: '#FF5B2E',
                        defaultTextColor: 'white'
                    });
                    
                    // 恢复第二个按钮
                    if (secondButton) {
                        const isOutlineButton = secondButton.textContent.includes('优化');
                        setButtonDisabled(secondButton, false, {
                            defaultBgColor: isOutlineButton ? 'transparent' : '#333333',
                            defaultTextColor: isOutlineButton ? '#444' : 'white',
                            isOutlineButton: isOutlineButton
                        });
                    }
                });
        });

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // 调用DeepSeek API
    async function callDeepSeekAPI(input, loadingContainer, tabId = 'general', options = {}) {
        const systemPrompt = getSystemPrompt(tabId, options);
        const userPrompt = `请根据以下描述生成适合Stable Diffusion F.1模型的提示词："${input}"。${
            tabId === 'chan-ip' ? '必须包含"chan"相关元素。' : ''
        }`;

        return new Promise((resolve, reject) => {
            loadingContainer.innerHTML += `<div>发送请求到DeepSeek API...</div>`;

            GM_xmlhttpRequest({
                method: "POST",
                url: DEEPSEEK_API_URL,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                },
                data: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: userPrompt
                        }
                    ],
                    temperature: 0.7,
                    stream: true
                }),
                onloadstart: function() {
                    loadingContainer.innerHTML += `<div style="display: flex; align-items: center; margin: 8px 0;">
                        <div class="loading-spinner" style="
                            width: 18px;
                            height: 18px;
                            border: 2px solid rgba(255, 91, 46, 0.3);
                            border-radius: 50%;
                            border-top-color: #FF5B2E;
                            margin-right: 10px;
                            animation: spin 1s linear infinite;
                        "></div>
                        <style>
                            @keyframes spin {
                                to { transform: rotate(360deg); }
                            }
                        </style>
                        <span>开始接收数据...</span>
                    </div>`;
                },
                onprogress: function(response) {
                    // 处理流式响应
                    const newData = response.responseText;
                    try {
                        // 显示正在生成的内容（粗略处理，实际需要正确解析SSE格式）
                        const latestChunk = newData.split('data: ').pop().trim();
                        if (latestChunk && latestChunk !== '[DONE]') {
                            const parsedChunk = JSON.parse(latestChunk);
                            if (parsedChunk.choices && parsedChunk.choices[0].delta.content) {
                                loadingContainer.innerHTML += `<span>${parsedChunk.choices[0].delta.content}</span>`;
                                // 自动滚动到底部
                                loadingContainer.scrollTop = loadingContainer.scrollHeight;
                            }
                        }
                    } catch (e) {
                        // 忽略解析错误，继续处理流
                    }
                },
                onload: function(response) {
                    try {
                        loadingContainer.innerHTML += `<div>数据接收完成，正在处理...</div>`;
                        
                        // 记录原始响应用于调试
                        logDebug("API响应原始数据:", response.responseText);
                        
                        // 新的JSON提取逻辑
                        const extractJson = function(text) {
                            // 提取所有可能的JSON对象
                            let result = null;
                            
                            // 方法1: 直接尝试从SSE响应中提取最后一个完整的JSON对象
                            try {
                                const lines = text.split('\n');
                                for (let i = lines.length - 1; i >= 0; i--) {
                                    const line = lines[i].trim();
                                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                                        const jsonStr = line.substring(6);
                                        const parsed = JSON.parse(jsonStr);
                                        if (parsed.choices && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                                            const content = parsed.choices[0].delta.content;
                                            // 尝试从内容中提取最完整的JSON
                                            if (content.includes('{') && content.includes('}')) {
                                                // 寻找最外层的完整JSON对象
                                                const matches = [...content.matchAll(/(\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\})/g)];
                                                for (const match of matches) {
                                                    try {
                                                        const obj = JSON.parse(match[0]);
                                                        if (obj.positive) { // 验证是否包含必要字段
                                                            result = obj;
                                                            logDebug("方法1成功提取JSON:", result);
                                                            return result;
                                                        }
                                                    } catch (e) {
                                                        // 继续尝试下一个匹配
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } catch (e) {
                                logError("方法1提取JSON失败:", e);
                            }
                            
                            // 方法2: 拼接所有内容片段，然后尝试提取JSON
                            if (!result) {
                                try {
                                    const fullContent = text.split('\n')
                                        .filter(line => line.startsWith('data: ') && line !== 'data: [DONE]')
                                        .map(line => {
                                            try {
                                                const parsed = JSON.parse(line.substring(6));
                                                return parsed.choices[0].delta.content || '';
                                            } catch {
                                                return '';
                                            }
                                        })
                                        .join('');
                                        
                                    logDebug("组装的完整内容:", fullContent);
                                    
                                    // 使用更复杂的正则表达式匹配嵌套的JSON
                                    const jsonRegex = /(\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\})/g;
                                    const matches = [...fullContent.matchAll(jsonRegex)];
                                    
                                    // 首先检查是否有包含positive字段的JSON
                                    for (const match of matches) {
                                        try {
                                            const obj = JSON.parse(match[0]);
                                            if (obj.positive) { // 验证是否包含必要字段
                                                result = obj;
                                                logDebug("方法2成功提取JSON (有positive字段):", result);
                                                return result;
                                            }
                                        } catch (e) {
                                            // 继续尝试
                                        }
                                    }
                                    
                                    // 如果没有找到，尝试按大小排序并解析
                                    if (matches.length > 0) {
                                        const sortedMatches = matches
                                            .map(m => m[0])
                                            .sort((a, b) => b.length - a.length); // 优先尝试最长的JSON
                                            
                                        for (const jsonStr of sortedMatches) {
                                            try {
                                                const obj = JSON.parse(jsonStr);
                                                result = obj;
                                                logDebug("方法2成功提取JSON (最长匹配):", result);
                                                return result;
                                            } catch (e) {
                                                // 继续尝试
                                            }
                                        }
                                    }
                                } catch (e) {
                                    logError("方法2提取JSON失败:", e);
                                }
                            }
                            
                            // 方法3: 尝试修复和清理不完整的JSON
                            if (!result) {
                                try {
                                    const fullContent = text.split('\n')
                                        .filter(line => line.startsWith('data: ') && line !== 'data: [DONE]')
                                        .map(line => {
                                            try {
                                                return JSON.parse(line.substring(6)).choices[0].delta.content || '';
                                            } catch {
                                                return '';
                                            }
                                        })
                                        .join('');
                                    
                                    // 查找最可能的JSON开始和结束位置
                                    const startIdx = fullContent.indexOf('{');
                                    let endIdx = fullContent.lastIndexOf('}');
                                    
                                    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
                                        // 提取可能的JSON并尝试修复常见错误
                                        let jsonStr = fullContent.substring(startIdx, endIdx + 1);
                                        
                                        // 尝试修复常见JSON错误
                                        // 1. 移除尾部逗号
                                        jsonStr = jsonStr.replace(/,\s*}/g, '}');
                                        jsonStr = jsonStr.replace(/,\s*]/g, ']');
                                        
                                        // 2. 转义未转义的引号
                                        jsonStr = jsonStr.replace(/([^\\])"/g, '$1\\"');
                                        jsonStr = jsonStr.replace(/^"/, '\\"');
                                        
                                        // 3. 修复键值对格式
                                        jsonStr = jsonStr.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
                                        
                                        try {
                                            const obj = JSON.parse(jsonStr);
                                            if (obj) {
                                                result = obj;
                                                logDebug("方法3成功提取并修复JSON:", result);
                                                return result;
                                            }
                                        } catch (e) {
                                            // 尝试更激进的修复方法，构造一个有效的JSON
                                            try {
                                                // 尝试提取positive内容，即使JSON格式不正确
                                                const positiveMatch = fullContent.match(/["']positive["']\s*:\s*["']([^"']*)["']/);
                                                if (positiveMatch && positiveMatch[1]) {
                                                    result = { positive: positiveMatch[1] };
                                                    logDebug("方法3成功构造简化JSON:", result);
                                                    return result;
                                                }
                                            } catch (e2) {
                                                // 继续尝试其他方法
                                            }
                                        }
                                    }
                                } catch (e) {
                                    logError("方法3提取JSON失败:", e);
                                }
                            }
                            
                            // 方法4: 最后的尝试，使用简单的正则表达式
                            if (!result) {
                                try {
                                    const simpleJsonMatch = text.match(/\{[^{]*"positive"[^}]*\}/);
                                    if (simpleJsonMatch) {
                                        try {
                                            const jsonStr = simpleJsonMatch[0].replace(/,\s*}/g, '}');
                                            const obj = JSON.parse(jsonStr);
                                            result = obj;
                                            logDebug("方法4成功提取简单JSON:", result);
                                            return result;
                                        } catch (e) {
                                            // 继续尝试
                                        }
                                    }
                                } catch (e) {
                                    logError("方法4提取JSON失败:", e);
                                }
                            }
                            
                            // 所有方法都失败，尝试构造一个基本的JSON对象
                            if (!result) {
                                try {
                                    const fullContent = text.split('\n')
                                        .filter(line => line.startsWith('data: ') && line !== 'data: [DONE]')
                                        .map(line => {
                                            try {
                                                return JSON.parse(line.substring(6)).choices[0].delta.content || '';
                                            } catch {
                                                return '';
                                            }
                                        })
                                        .join('');
                                    
                                    // 检查是否包含任何提示词内容
                                    if (fullContent.length > 10) {
                                        // 清理内容，移除明显的非提示词内容
                                        let cleanContent = fullContent.replace(/```json|```/g, '');
                                        cleanContent = cleanContent.replace(/\{|\}|"positive":|"negative":/g, '');
                                        cleanContent = cleanContent.trim();
                                        
                                        if (cleanContent.length > 0) {
                                            // 构造一个基本的JSON作为最后的手段
                                            result = { 
                                                positive: cleanContent,
                                                _note: "由于解析错误自动构建的简化版本"
                                            };
                                            logDebug("构造基本JSON结果:", result);
                                            return result;
                                        }
                                    }
                                } catch (e) {
                                    logError("构造基本JSON失败:", e);
                                }
                            }
                            
                            return null;
                        };
                        
                        // 执行JSON提取
                        const jsonData = extractJson(response.responseText);
                        
                        if (jsonData) {
                            loadingContainer.innerHTML += `<div style="color: green;">成功提取优化后的提示词！</div>`;
                            resolve(jsonData);
                        } else {
                            // 最后的备用方案 - 尝试提取任何有用的文本作为提示词
                            try {
                                const textContent = response.responseText.split('\n')
                                    .filter(line => line.startsWith('data: ') && line !== 'data: [DONE]')
                                    .map(line => {
                                        try {
                                            return JSON.parse(line.substring(6)).choices[0].delta.content || '';
                                        } catch {
                                            return '';
                                        }
                                    })
                                    .join('');
                                
                                // 检查是否有足够的内容
                                if (textContent.length > 20) {
                                    const fallbackJson = {
                                        positive: textContent.trim().split('\n')[0],
                                        _recovered: true
                                    };
                                    loadingContainer.innerHTML += `<div style="color: orange;">无法提取完整JSON，使用备用文本作为提示词。</div>`;
                                    resolve(fallbackJson);
                                    return;
                                }
                            } catch (e) {
                                // 继续到错误处理
                            }
                            
                            reject(new Error('无法从响应中提取有效的JSON数据'));
                        }
                    } catch (error) {
                        logError("处理API响应时出错:", error);
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(new Error('API请求失败'));
                }
            });
        });
    }

    // 优化提示词函数
    function optimizePrompt(currentPrompt, loadingContainer) {
        return new Promise((resolve, reject) => {
            // 判断当前激活的标签页
            const activeTabId = document.querySelector('.ub-tab.active')?.dataset.tabId || 'general';
            
            // 设置系统提示词
            let optimizeSystemPrompt = '';
            
            // 根据标签类型选择不同的系统提示词
            if (activeTabId === 'chan-ip') {
                // 蝉蝉IP专用优化提示词
                optimizeSystemPrompt = `你是一个专业的提示词优化专家，专注于优化Stable Diffusion的提示词。请遵循以下规则：

1. 保持提示词中"chan"相关元素不变，必须保持在提示词最前面
2. 分析提示词的主题和意图，保持其核心内容
3. 识别用户的核心需求关键词，将其放在"chan"元素之后、提示词最前面，增加权重(1.2)到(1.5)
4. 提示词顺序应按照相关性排序：chan > 用户核心需求 > 蝉蝉角色关键词 > 动作/情绪/场景 > 风格 > 技术描述
5. 移除冗余或效果不佳的关键词
6. 返回格式必须是JSON，包含positive字段
7. 不要添加解释，直接返回优化后的提示词
8. 所有提示词必须使用英文
9. 确保保留以下关键元素的权重设置：
   - 用户核心需求关键词权重(1.2)到(1.5)
   - 手持物品的权重(holding xxx:1.3)
   - 情绪表达的权重(happy:1.2)等
   - 动作描述的权重(jumping:1.2)等

返回的JSON格式示例：
{
  "positive": "chan, astronaut chan(1.4), space chan(1.3), cute, adorable, chibi, cartoon, anime style, [保持原有提示词，维持关键词优先级和权重]"
}`;
            } else if (activeTabId === 'b-icon') {
                // B端图标优化提示词
                optimizeSystemPrompt = `你是一个专业的提示词优化专家，专注于优化Stable Diffusion的图标提示词。请遵循以下规则：

1. 分析提示词的主题和意图，保持其核心内容
2. 识别用户的核心需求关键词（图标主题），将其放在提示词最前面，增加权重(1.2-1.5)
3. 提示词顺序应按照相关性排序：核心需求图标 > 商务图标关键词 > UI设计场景 > 风格描述 > 技术描述
4. 移除冗余或效果不佳的关键词
5. 返回格式必须是JSON，包含positive字段
6. 不要添加解释，直接返回优化后的提示词
7. 所有提示词必须使用英文
8. 确保提示词中包含以下UI设计常见场景提示词：
   - "clean background" (干净背景)
   - "studio lighting" (演播室照明)
   - "3D rendering" (3D渲染)
   - "octane render" (辛烷值渲染)
   - "axially symmetric" (轴对称)
   - "minimalism" (极简主义)
   - "professional UI" (专业UI)
   - "vector graphics" (矢量图形)
9. 确保保留用户核心需求关键词的权重(1.2)到(1.5)

返回的JSON格式示例：
{
  "positive": "email icon(1.4), mail icon(1.3), icon, business icon, simple, [保持原有提示词，维持关键词优先级和权重]"
}`;
            } else {
                // 通用优化提示词
                optimizeSystemPrompt = `你是一个专业的提示词优化专家，专注于优化Stable Diffusion的提示词。请遵循以下规则：

1. 分析提示词的主题和意图，保持其核心内容
2. 识别用户的核心需求关键词，将其放在提示词最前面，增加权重(1.2)到(1.5)
3. 提示词顺序应按照相关性排序：核心需求 > 重要特征 > 场景描述 > 风格 > 辅助描述
4. 移除冗余或效果不佳的关键词
5. 返回格式必须是JSON，包含positive字段
6. 不要添加解释，直接返回优化后的提示词
7. 所有提示词必须使用英文
8. 确保保留用户核心需求关键词的权重(1.2)到(1.5)

返回的JSON格式示例：
{
  "positive": "rocket(1.4), space rocket(1.3), detailed character, [保持原有提示词，维持关键词优先级和权重]"
}`;
            }

            const userPrompt = `请优化以下Stable Diffusion提示词，保持其主题和关键元素，但使其更加精炼有效：

${currentPrompt}`;

            loadingContainer.innerHTML += `<div>发送优化请求到DeepSeek API...</div>`;

            GM_xmlhttpRequest({
                method: "POST",
                url: DEEPSEEK_API_URL,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                },
                data: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: optimizeSystemPrompt
                        },
                        {
                            role: "user",
                            content: userPrompt
                        }
                    ],
                    temperature: 0.7,
                    stream: true
                }),
                onloadstart: function() {
                    loadingContainer.innerHTML += `<div>开始接收数据...</div>`;
                },
                onprogress: function(response) {
                    // 处理流式响应
                    const newData = response.responseText;
                    try {
                        // 显示正在生成的内容（粗略处理，实际需要正确解析SSE格式）
                        const latestChunk = newData.split('data: ').pop().trim();
                        if (latestChunk && latestChunk !== '[DONE]') {
                            const parsedChunk = JSON.parse(latestChunk);
                            if (parsedChunk.choices && parsedChunk.choices[0].delta.content) {
                                loadingContainer.innerHTML += `<span>${parsedChunk.choices[0].delta.content}</span>`;
                                // 自动滚动到底部
                                loadingContainer.scrollTop = loadingContainer.scrollHeight;
                            }
                        }
                    } catch (e) {
                        // 忽略解析错误，继续处理流
                    }
                },
                onload: function(response) {
                    try {
                        loadingContainer.innerHTML += `<div>数据接收完成，正在处理...</div>`;
                        
                        // 记录原始响应用于调试
                        logDebug("API响应原始数据:", response.responseText);
                        
                        // 新的JSON提取逻辑
                        const extractJson = function(text) {
                            // 提取所有可能的JSON对象
                            let result = null;
                            
                            // 方法1: 直接尝试从SSE响应中提取最后一个完整的JSON对象
                            try {
                                const lines = text.split('\n');
                                for (let i = lines.length - 1; i >= 0; i--) {
                                    const line = lines[i].trim();
                                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                                        const jsonStr = line.substring(6);
                                        const parsed = JSON.parse(jsonStr);
                                        if (parsed.choices && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                                            const content = parsed.choices[0].delta.content;
                                            // 尝试从内容中提取最完整的JSON
                                            if (content.includes('{') && content.includes('}')) {
                                                // 寻找最外层的完整JSON对象
                                                const matches = [...content.matchAll(/(\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\})/g)];
                                                for (const match of matches) {
                                                    try {
                                                        const obj = JSON.parse(match[0]);
                                                        if (obj.positive) { // 验证是否包含必要字段
                                                            result = obj;
                                                            logDebug("方法1成功提取JSON:", result);
                                                            return result;
                                                        }
                                                    } catch (e) {
                                                        // 继续尝试下一个匹配
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } catch (e) {
                                logError("方法1提取JSON失败:", e);
                            }
                            
                            // 方法2: 拼接所有内容片段，然后尝试提取JSON
                            if (!result) {
                                try {
                                    const fullContent = text.split('\n')
                                        .filter(line => line.startsWith('data: ') && line !== 'data: [DONE]')
                                        .map(line => {
                                            try {
                                                const parsed = JSON.parse(line.substring(6));
                                                return parsed.choices[0].delta.content || '';
                                            } catch {
                                                return '';
                                            }
                                        })
                                        .join('');
                                        
                                    logDebug("组装的完整内容:", fullContent);
                                    
                                    // 使用更复杂的正则表达式匹配嵌套的JSON
                                    const jsonRegex = /(\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\})/g;
                                    const matches = [...fullContent.matchAll(jsonRegex)];
                                    
                                    // 首先检查是否有包含positive字段的JSON
                                    for (const match of matches) {
                                        try {
                                            const obj = JSON.parse(match[0]);
                                            if (obj.positive) { // 验证是否包含必要字段
                                                result = obj;
                                                logDebug("方法2成功提取JSON (有positive字段):", result);
                                                return result;
                                            }
                                        } catch (e) {
                                            // 继续尝试
                                        }
                                    }
                                    
                                    // 如果没有找到，尝试按大小排序并解析
                                    if (matches.length > 0) {
                                        const sortedMatches = matches
                                            .map(m => m[0])
                                            .sort((a, b) => b.length - a.length); // 优先尝试最长的JSON
                                            
                                        for (const jsonStr of sortedMatches) {
                                            try {
                                                const obj = JSON.parse(jsonStr);
                                                result = obj;
                                                logDebug("方法2成功提取JSON (最长匹配):", result);
                                                return result;
                                            } catch (e) {
                                                // 继续尝试
                                            }
                                        }
                                    }
                                } catch (e) {
                                    logError("方法2提取JSON失败:", e);
                                }
                            }
                            
                            // 方法3: 尝试修复和清理不完整的JSON
                            if (!result) {
                                try {
                                    const fullContent = text.split('\n')
                                        .filter(line => line.startsWith('data: ') && line !== 'data: [DONE]')
                                        .map(line => {
                                            try {
                                                return JSON.parse(line.substring(6)).choices[0].delta.content || '';
                                            } catch {
                                                return '';
                                            }
                                        })
                                        .join('');
                                    
                                    // 查找最可能的JSON开始和结束位置
                                    const startIdx = fullContent.indexOf('{');
                                    let endIdx = fullContent.lastIndexOf('}');
                                    
                                    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
                                        // 提取可能的JSON并尝试修复常见错误
                                        let jsonStr = fullContent.substring(startIdx, endIdx + 1);
                                        
                                        // 尝试修复常见JSON错误
                                        // 1. 移除尾部逗号
                                        jsonStr = jsonStr.replace(/,\s*}/g, '}');
                                        jsonStr = jsonStr.replace(/,\s*]/g, ']');
                                        
                                        // 2. 转义未转义的引号
                                        jsonStr = jsonStr.replace(/([^\\])"/g, '$1\\"');
                                        jsonStr = jsonStr.replace(/^"/, '\\"');
                                        
                                        // 3. 修复键值对格式
                                        jsonStr = jsonStr.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
                                        
                                        try {
                                            const obj = JSON.parse(jsonStr);
                                            if (obj) {
                                                result = obj;
                                                logDebug("方法3成功提取并修复JSON:", result);
                                                return result;
                                            }
                                        } catch (e) {
                                            // 尝试更激进的修复方法，构造一个有效的JSON
                                            try {
                                                // 尝试提取positive内容，即使JSON格式不正确
                                                const positiveMatch = fullContent.match(/["']positive["']\s*:\s*["']([^"']*)["']/);
                                                if (positiveMatch && positiveMatch[1]) {
                                                    result = { positive: positiveMatch[1] };
                                                    logDebug("方法3成功构造简化JSON:", result);
                                                    return result;
                                                }
                                            } catch (e2) {
                                                // 继续尝试其他方法
                                            }
                                        }
                                    }
                                } catch (e) {
                                    logError("方法3提取JSON失败:", e);
                                }
                            }
                            
                            // 方法4: 最后的尝试，使用简单的正则表达式
                            if (!result) {
                                try {
                                    const simpleJsonMatch = text.match(/\{[^{]*"positive"[^}]*\}/);
                                    if (simpleJsonMatch) {
                                        try {
                                            const jsonStr = simpleJsonMatch[0].replace(/,\s*}/g, '}');
                                            const obj = JSON.parse(jsonStr);
                                            result = obj;
                                            logDebug("方法4成功提取简单JSON:", result);
                                            return result;
                                        } catch (e) {
                                            // 继续尝试
                                        }
                                    }
                                } catch (e) {
                                    logError("方法4提取JSON失败:", e);
                                }
                            }
                            
                            // 所有方法都失败，尝试构造一个基本的JSON对象
                            if (!result) {
                                try {
                                    const fullContent = text.split('\n')
                                        .filter(line => line.startsWith('data: ') && line !== 'data: [DONE]')
                                        .map(line => {
                                            try {
                                                return JSON.parse(line.substring(6)).choices[0].delta.content || '';
                                            } catch {
                                                return '';
                                            }
                                        })
                                        .join('');
                                    
                                    // 检查是否包含任何提示词内容
                                    if (fullContent.length > 10) {
                                        // 清理内容，移除明显的非提示词内容
                                        let cleanContent = fullContent.replace(/```json|```/g, '');
                                        cleanContent = cleanContent.replace(/\{|\}|"positive":|"negative":/g, '');
                                        cleanContent = cleanContent.trim();
                                        
                                        if (cleanContent.length > 0) {
                                            // 构造一个基本的JSON作为最后的手段
                                            result = { 
                                                positive: cleanContent,
                                                _note: "由于解析错误自动构建的简化版本"
                                            };
                                            logDebug("构造基本JSON结果:", result);
                                            return result;
                                        }
                                    }
                                } catch (e) {
                                    logError("构造基本JSON失败:", e);
                                }
                            }
                            
                            return null;
                        };
                        
                        // 执行JSON提取
                        const jsonData = extractJson(response.responseText);
                        
                        if (jsonData) {
                            loadingContainer.innerHTML += `<div style="color: green;">成功提取优化后的提示词！</div>`;
                            resolve(jsonData);
                        } else {
                            // 最后的备用方案 - 尝试提取任何有用的文本作为提示词
                            try {
                                const textContent = response.responseText.split('\n')
                                    .filter(line => line.startsWith('data: ') && line !== 'data: [DONE]')
                                    .map(line => {
                                        try {
                                            return JSON.parse(line.substring(6)).choices[0].delta.content || '';
                                        } catch {
                                            return '';
                                        }
                                    })
                                    .join('');
                                
                                // 检查是否有足够的内容
                                if (textContent.length > 20) {
                                    const fallbackJson = {
                                        positive: textContent.trim().split('\n')[0],
                                        _recovered: true
                                    };
                                    loadingContainer.innerHTML += `<div style="color: orange;">无法提取完整JSON，使用备用文本作为提示词。</div>`;
                                    resolve(fallbackJson);
                                    return;
                                }
                            } catch (e) {
                                // 继续到错误处理
                            }
                            
                            reject(new Error('无法从响应中提取有效的JSON数据'));
                        }
                    } catch (error) {
                        logError("处理API响应时出错:", error);
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(new Error('API请求失败'));
                }
            });
        });
    }

    // 语义优化提示词函数
    function semanticOptimizePrompt(userDescription, currentPrompt, loadingContainer) {
        return new Promise((resolve, reject) => {
            // 判断当前激活的标签页
            const activeTabId = document.querySelector('.ub-tab.active')?.dataset.tabId || 'general';
            
            // 检测用户描述中可能的修改意图
            const colorKeywords = ['颜色', '色彩', '变成', '改成', '换成', '变为', '改为', '换为', 'color', 'change to'];
            const subjectKeywords = ['主体', '改主体', '换主体', '主题', '改主题', '换主题', '内容', '改内容', '换内容', 'subject', 'theme', 'content'];
            const styleKeywords = ['风格', '改风格', '换风格', '样式', '改样式', '换样式', 'style', 'look'];
            const sceneKeywords = ['场景', '改场景', '换场景', '背景', '改背景', '换背景', 'scene', 'background', 'setting'];
            
            // 确定用户的主要修改意图
            const isColorChange = colorKeywords.some(keyword => userDescription.includes(keyword));
            const isSubjectChange = subjectKeywords.some(keyword => userDescription.includes(keyword));
            const isStyleChange = styleKeywords.some(keyword => userDescription.includes(keyword));
            const isSceneChange = sceneKeywords.some(keyword => userDescription.includes(keyword));
            
            // 设置系统提示词
            let semanticOptimizeSystemPrompt = `你是一个专业的提示词语义优化专家，专注于分析用户描述和现有提示词之间的语义差异，并优化提示词使其更符合用户的真实意图。请遵循以下规则：

1. 仔细分析用户描述的真实意图和语义场景
2. 评估当前提示词与用户意图的匹配程度
3. 识别当前提示词中与用户意图不匹配的部分
4. 修改或替换不匹配的关键词，使其更符合用户描述的语义场景
5. 保持提示词的整体结构和格式不变
6. 保留原有提示词中的权重设置格式
7. 确保核心意图关键词位于提示词前部，并具有较高权重(1.2-1.5)
8. 返回格式必须是JSON，包含positive和negative两个字段
9. 所有提示词必须使用英文`;

            // 根据识别出的意图，添加特殊处理规则
            if (isColorChange) {
                semanticOptimizeSystemPrompt += `\n\n特别注意 - 颜色处理规则：
1. 如果用户描述中包含颜色替换需求（例如"变成红色"、"改为蓝色"等），你应该：
   a. 首先识别用户想要的新颜色（例如"红色"、"蓝色"、"黄色"等）
   b. 在提示词中查找所有与颜色相关的术语（color, red, blue, yellow, green, black, white, purple, orange, pink等）
   c. 将这些颜色词全部替换为用户要求的新颜色对应的英文词汇
   d. 如果原提示词中没有颜色相关词汇，则在主体词后添加新的颜色词汇，并赋予适当权重（如1.2）
   e. 确保新的颜色词汇不会成为最大权重词，应保持与原提示词中颜色词汇相同的权重，或略低于主体词的权重
2. 例如：
   - 如果用户输入"改成黄色"，而当前提示词包含"red space rocket"
   - 应将其更改为"yellow space rocket"，保持原有词汇权重
   - 如果原提示词中没有颜色词，则适当添加 "yellow(1.1)" 到主体词附近`;
            }
            
            if (isSubjectChange) {
                semanticOptimizeSystemPrompt += `\n\n特别注意 - 主体替换规则：
1. 如果用户描述中包含主体替换需求（例如"主体改为汽车"、"换成猫"等），你应该：
   a. 识别用户想要的新主体（例如"汽车"、"猫"等）
   b. 查找并替换提示词中的当前主体词及其紧密相关的描述词
   c. 新主体词应成为最高权重词汇(1.3-1.5)，保持在提示词的前部
   d. 保留与主体无关的风格词、场景词和质量词
   e. 如果新主体与原主体风格不兼容，适当调整风格词以确保整体协调
2. 例如：
   - 如果用户输入"把火箭换成汽车"，而当前提示词为"space rocket(1.4), launching pad, red, futuristic"
   - 应将其更改为"sports car(1.4), red, futuristic"，保留颜色和风格，但移除与火箭特定相关的"launching pad"`;
            }
            
            if (isStyleChange) {
                semanticOptimizeSystemPrompt += `\n\n特别注意 - 风格替换规则：
1. 如果用户描述中包含风格替换需求（例如"改为卡通风格"、"换成写实风格"等），你应该：
   a. 识别用户想要的新风格（例如"卡通"、"写实"、"水彩"等）
   b. 查找并替换提示词中的风格相关词汇（如cartoon, realistic, watercolor, sketch, oil painting等）
   c. 保持主体词和其他非风格词汇不变
   d. 适当调整与特定风格相关的质量词和技术词
   e. 新风格词应赋予适当权重(1.1-1.3)，但通常低于主体词
2. 例如：
   - 如果用户输入"改为水彩风格"，而当前提示词为"mountain landscape(1.4), realistic, detailed"
   - 应将其更改为"mountain landscape(1.4), watercolor style(1.2), flowing colors, soft edges"，保持主体"山脉风景"不变`;
            }
            
            if (isSceneChange) {
                semanticOptimizeSystemPrompt += `\n\n特别注意 - 场景替换规则：
1. 如果用户描述中包含场景替换需求（例如"改为海滩场景"、"换成办公室背景"等），你应该：
   a. 识别用户想要的新场景（例如"海滩"、"办公室"、"森林"等）
   b. 查找并替换提示词中的场景相关词汇
   c. 保持主体词、风格词和质量词不变
   d. 添加与新场景相关的辅助描述词以增强场景感
   e. 场景词应赋予适当权重(1.1-1.3)，通常低于主体词
2. 例如：
   - 如果用户输入"换成雪山背景"，而当前提示词为"person standing(1.4), desert, hot sun, sandy"
   - 应将其更改为"person standing(1.4), snowy mountains(1.2), cold, winter scene, snow covered peaks"`;
            }
            
            // 如果没有明确识别出特定意图，添加通用修改规则
            if (!isColorChange && !isSubjectChange && !isStyleChange && !isSceneChange) {
                semanticOptimizeSystemPrompt += `\n\n特别注意 - 通用修改规则：
1. 由于无法明确判断用户具体的修改意图，请采用更全面的分析方法：
   a. 对比用户描述与当前提示词的核心差异
   b. 推断用户最可能希望修改的方面（可能是主体、风格、颜色、场景、质量等）
   c. 根据推断进行适当的修改，保持提示词结构和权重体系
   d. 在不确定的情况下，优先保留当前提示词的主体和核心特征，谨慎添加新元素
2. 特别关注用户描述中包含的新信息，这通常是用户希望添加或修改的内容`;
            }

            semanticOptimizeSystemPrompt += `\n\n返回的JSON格式示例：
{
  "positive": "[优化后的正向提示词，保持关键词优先级和权重，但修改为符合用户描述的语义场景]",
  "negative": "[优化后的负向提示词，保持原有格式，但修改为符合用户描述的语义场景]"
}`;

            // 根据不同的标签页进行微调
            if (activeTabId === 'chan-ip') {
                semanticOptimizeSystemPrompt += `\n\n请特别注意：
1. 保持"chan"元素作为提示词的开头
2. 确保用户描述中的语义场景在"chan"元素之后立即体现出来
3. 特别关注角色的动作、场景、情绪等元素，确保它们与用户描述的语义场景匹配`;
                
                // 针对蝉蝉IP的特殊处理规则
                if (isSubjectChange) {
                    semanticOptimizeSystemPrompt += `\n4. 对于蝉蝉IP的主体变更：
   a. 保持"chan"元素不变，但调整角色特征
   b. 例如：从"chan cat(1.4), playful"变为"chan rabbit(1.4), floppy ears, carrot"
   c. 保持角色的可爱和卡通风格不变`;
                }
            } else if (activeTabId === 'b-icon') {
                semanticOptimizeSystemPrompt += `\n\n请特别注意：
1. 保持图标的商务和专业风格不变
2. 确保用户描述的图标主题在提示词开头，并具有较高权重
3. 保留所有关于UI设计场景的提示词，如"clean background"、"studio lighting"等`;
                
                // 针对B端图标的特殊处理规则
                if (isColorChange) {
                    semanticOptimizeSystemPrompt += `\n4. 对于B端图标的颜色变更：
   a. 不要将颜色词作为最高权重的词汇
   b. 主体词（如"rocket"、"house"等）应保持最高权重
   c. 颜色词应添加在主体词后，并赋予适中权重（1.1-1.2）
   d. 如果有多个颜色词，应全部替换为新颜色，保持一致性`;
                }
                
                if (isSubjectChange) {
                    semanticOptimizeSystemPrompt += `\n5. 对于B端图标的主体变更：
   a. 确保新主体符合商务图标的风格要求
   b. 保持图标的简洁、专业和现代感
   c. 保留所有"icon"、"business icon"、"flat design"等关键词
   d. 新主体应获得最高权重，但整体风格不变`;
                }
            }

            const userPrompt = `用户描述：${userDescription}\n\n当前提示词：\n正向提示词：${currentPrompt.positive || ''}\n负向提示词：${currentPrompt.negative || ''}\n\n请分析用户描述的语义场景，并优化当前提示词使其更匹配用户的意图。`;

            loadingContainer.innerHTML += `<div>发送语义优化请求到DeepSeek API...</div>`;
            
            // 显示系统检测到的修改意图
            let detectedIntents = [];
            if (isColorChange) detectedIntents.push("颜色修改");
            if (isSubjectChange) detectedIntents.push("主体更换");
            if (isStyleChange) detectedIntents.push("风格转换");
            if (isSceneChange) detectedIntents.push("场景切换");
            
            if (detectedIntents.length > 0) {
                loadingContainer.innerHTML += `
                <div style="
                    margin-top: 12px;
                    padding: 10px 14px;
                    border-radius: 8px;
                    background: linear-gradient(135deg, rgba(25,118,210,0.05) 0%, rgba(25,118,210,0.1) 100%);
                    font-size: 13px;
                    color: #1565C0;
                    display: flex;
                    align-items: center;
                    animation: fadeIn 0.3s ease;
                ">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#1565C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 16V12" stroke="#1565C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 8H12.01" stroke="#1565C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>检测到修改意图: ${detectedIntents.join(", ")}，将进行特殊处理</span>
                </div>`;
            } else {
                loadingContainer.innerHTML += `
                <div style="
                    margin-top: 12px;
                    padding: 10px 14px;
                    border-radius: 8px;
                    background: linear-gradient(135deg, rgba(25,118,210,0.05) 0%, rgba(25,118,210,0.1) 100%);
                    font-size: 13px;
                    color: #1565C0;
                    display: flex;
                    align-items: center;
                    animation: fadeIn 0.3s ease;
                ">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#1565C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 16V12" stroke="#1565C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 8H12.01" stroke="#1565C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>未检测到特定修改类型，将进行综合语义分析</span>
                </div>`;
            }

            GM_xmlhttpRequest({
                method: "POST",
                url: DEEPSEEK_API_URL,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                },
                data: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: semanticOptimizeSystemPrompt
                        },
                        {
                            role: "user",
                            content: userPrompt
                        }
                    ],
                    temperature: 0.7,
                    stream: true
                }),
                onloadstart: function() {
                    loadingContainer.innerHTML += `<div>开始接收数据...</div>`;
                },
                onprogress: function(response) {
                    // 处理流式响应
                    const newData = response.responseText;
                    try {
                        // 显示正在生成的内容（粗略处理，实际需要正确解析SSE格式）
                        const latestChunk = newData.split('data: ').pop().trim();
                        if (latestChunk && latestChunk !== '[DONE]') {
                            const parsedChunk = JSON.parse(latestChunk);
                            if (parsedChunk.choices && parsedChunk.choices[0].delta.content) {
                                loadingContainer.innerHTML += `<span>${parsedChunk.choices[0].delta.content}</span>`;
                                // 自动滚动到底部
                                loadingContainer.scrollTop = loadingContainer.scrollHeight;
                            }
                        }
                    } catch (e) {
                        // 忽略解析错误，继续处理流
                    }
                },
                onload: function(response) {
                    try {
                        loadingContainer.innerHTML += `<div>数据接收完成，正在处理...</div>`;

                        // 处理最终的完整响应
                        const lines = response.responseText.split('\n');
                        let jsonData = null;

                        // 提取最后一个有效的数据块
                        for (let i = lines.length - 1; i >= 0; i--) {
                            const line = lines[i].trim();
                            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                                const jsonStr = line.substring(6);
                                const parsed = JSON.parse(jsonStr);
                                if (parsed.choices && parsed.choices[0].delta.content) {
                                    // 尝试从内容中提取JSON
                                    const content = parsed.choices[0].delta.content;
                                    if (content.includes('{') && content.includes('}')) {
                                        const jsonMatch = content.match(/\{[\s\S]*\}/);
                                        if (jsonMatch) {
                                            jsonData = JSON.parse(jsonMatch[0]);
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        // 如果上面没提取到，尝试从整个响应中提取
                        if (!jsonData) {
                            const fullContent = lines
                                .filter(line => line.startsWith('data: ') && line !== 'data: [DONE]')
                                .map(line => {
                                    try {
                                        return JSON.parse(line.substring(6)).choices[0].delta.content || '';
                                    } catch (e) {
                                        return '';
                                    }
                                })
                                .join('');

                            try {
                                // 尝试查找完整的JSON对象，处理可能存在的多个JSON
                                let potentialJson = fullContent.match(/\{[\s\S]*?\}/g);
                                if (potentialJson && potentialJson.length > 0) {
                                    // 尝试每个匹配到的JSON字符串
                                    for (let i = 0; i < potentialJson.length; i++) {
                                        try {
                                            const parsed = JSON.parse(potentialJson[i]);
                                            // 验证是否包含必要字段
                                            if (parsed.positive || (parsed.positive && parsed.negative)) {
                                                jsonData = parsed;
                                                break;
                                            }
                                        } catch (e) {
                                            // 继续尝试下一个
                                            console.log("JSON解析尝试失败:", e);
                                        }
                                    }
                                }
                                
                                // 如果上面方法失败，尝试查找最长的JSON字符串
                                if (!jsonData && potentialJson) {
                                    // 按长度排序，尝试最长的可能JSON
                                    potentialJson.sort((a, b) => b.length - a.length);
                                    for (let i = 0; i < Math.min(potentialJson.length, 3); i++) {
                                        try {
                                            const parsed = JSON.parse(potentialJson[i]);
                                            jsonData = parsed;
                                            break;
                                        } catch (e) {
                                            // 继续尝试
                                        }
                                    }
                                }
                            } catch (e) {
                                console.error("JSON提取过程中出错:", e);
                            }
                            
                            // 备用方案：如果仍然没有找到，尝试简单的正则提取
                            if (!jsonData) {
                                const jsonMatch = fullContent.match(/\{[\s\S]*?\}/);
                                if (jsonMatch) {
                                    try {
                                        jsonData = JSON.parse(jsonMatch[0]);
                                    } catch (e) {
                                        // 放弃，将使用后续错误处理
                                    }
                                }
                            }
                        }

                        if (jsonData) {
                            loadingContainer.innerHTML += `
                            <div style="color: green;">成功提取语义优化后的提示词！</div>`;
                            resolve(jsonData);
                        } else {
                            reject(new Error('无法从响应中提取有效的JSON数据'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(new Error('API请求失败'));
                }
            });
        });
    }

    // 设置按钮禁用状态的函数
    function setButtonDisabled(button, isDisabled, options = {}) {
        if (!button) return;
        
        const defaultOptions = {
            defaultBgColor: '#FF5B2E',            // 默认背景色
            defaultTextColor: 'white',            // 默认文字颜色
            defaultBorderColor: 'none',           // 默认边框颜色
            disabledBgOpacity: 0.4,               // 禁用时背景透明度
            disabledTextOpacity: 0.7,             // 禁用时文字透明度
            isOutlineButton: false                 // 是否是轮廓按钮
        };
        
        const config = {...defaultOptions, ...options};
        
        button.disabled = isDisabled;
        
        if (isDisabled) {
            if (config.isOutlineButton) {
                // 轮廓按钮禁用样式
                button.style.backgroundColor = 'rgba(240, 240, 240, 0.4)'; 
                button.style.color = 'rgba(136, 136, 136, 0.7)';
                button.style.border = '1px solid rgba(204, 204, 204, 0.5)';
            } else {
                // 普通按钮禁用样式
                button.style.backgroundColor = config.defaultBgColor.replace(/rgb|rgba/, 'rgba').replace(/\)/, `, ${config.disabledBgOpacity})`);
                if (config.defaultBgColor.indexOf('rgba') === -1 && config.defaultBgColor.indexOf('rgb(') === -1) {
                    // 处理十六进制颜色
                    button.style.backgroundColor = `${config.defaultBgColor}${config.disabledBgOpacity * 100}`;
                }
                button.style.color = `rgba(255, 255, 255, ${config.disabledTextOpacity})`;
            }
            button.style.cursor = 'not-allowed';
            button.style.transform = 'none';
            button.style.boxShadow = 'none';
        } else {
            // 恢复正常样式
            button.style.backgroundColor = config.defaultBgColor;
            button.style.color = config.defaultTextColor;
            if (config.isOutlineButton) {
                button.style.border = '1px solid #666'; 
            } else {
                button.style.border = config.defaultBorderColor;
            }
            button.style.cursor = 'pointer';
        }
    }

    // 创建页面主按钮 - 懒加载实现
    function createMainButton() {
        // 防止重复创建按钮的标记
        if (window.libulib_button_created) {
            return;
        }
        
        // 预先添加样式，减少重排
        addPlaceholderStyles();
        
        // 检查容器并添加按钮的函数（加入节流控制）
        let containerCheckCount = 0;
        const MAX_CHECK_ATTEMPTS = 10; // 最多检查10次，避免无限循环
        
        function checkForContainer() {
            // 增加检查计数
            containerCheckCount++;
            
            // 如果已经超过最大尝试次数，停止检查
            if (containerCheckCount > MAX_CHECK_ATTEMPTS) {
                return;
            }
            
            // 只查找physton-gradio-container
            const container = document.querySelector('.physton-gradio-container');
                              
            if (!container) {
                // 如果没找到容器，随着检查次数增加，逐渐增加检查间隔
                const nextCheckDelay = Math.min(300 * (1 + containerCheckCount / 5), 2000);
                safeSetTimeout(checkForContainer, nextCheckDelay);
                return;
            }
            
            logDebug('找到physton-gradio-container容器');
            
            // 检查按钮是否已存在
            if (document.getElementById('libulib-prompt-helper-btn')) {
                window.libulib_button_created = true;
                return;
            }
            
            // 创建按钮容器 - 使用文档片段减少重排
            const fragment = document.createDocumentFragment();
            const button = document.createElement('div');
            button.id = 'libulib-prompt-helper-btn';
            
            // 设置按钮样式
            Object.assign(button.style, {
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '0',
                backgroundColor: '#FF5B2E',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                zIndex: '1000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(255, 91, 46, 0.3)',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            });
            
            // 图标 + 文本布局
            const buttonInner = document.createElement('div');
            buttonInner.style.display = 'flex';
            buttonInner.style.alignItems = 'center';
            buttonInner.style.padding = '10px 18px';
            
            // 魔棒图标 (使用Unicode字符)
            const icon = document.createElement('span');
            icon.textContent = '✨';
            icon.style.marginRight = '8px';
            icon.style.fontSize = '16px';
            buttonInner.appendChild(icon);
            
            // 文本内容
            const text = document.createElement('span');
            text.textContent = '蝉之助';
            buttonInner.appendChild(text);
            button.appendChild(buttonInner);
            fragment.appendChild(button);
            
            // 事件监听器（使用事件委托减少事件监听器数量）
            const handleButtonState = (e) => {
                if (button.disabled) return; // 如果按钮禁用，不响应鼠标事件
                
                switch(e.type) {
                    case 'mouseover':
                        button.style.backgroundColor = '#E94A1E';
                        button.style.transform = 'translateY(-2px)';
                        button.style.boxShadow = '0 6px 16px rgba(255, 91, 46, 0.4)';
                        break;
                    case 'mouseout':
                        button.style.backgroundColor = '#FF5B2E';
                        button.style.transform = 'translateY(0)';
                        button.style.boxShadow = '0 4px 12px rgba(255, 91, 46, 0.3)';
                        break;
                    case 'mousedown':
                        button.style.transform = 'translateY(1px)';
                        button.style.boxShadow = '0 2px 8px rgba(255, 91, 46, 0.3)';
                        break;
                    case 'mouseup':
                        button.style.transform = 'translateY(-2px)';
                        button.style.boxShadow = '0 6px 16px rgba(255, 91, 46, 0.4)';
                        break;
                    case 'click':
                        e.stopPropagation();
                        // 使用异步函数处理
                        (async () => {
                            try {
                                // 先加载用户数据并检查登录状态
                                await loadUserData();
                                if (checkLoginStatus()) {
                                    // 已登录，直接打开蝉之助
                                    logDebug('[用户] 已登录，用户名:', currentUser.username);
                                    createUserInputModal();
                                } else {
                                    // 未登录，显示登录/注册界面
                                    logDebug('[用户] 未登录，显示登录界面');
                                    createAuthModal();
                                }
                            } catch (error) {
                                logError('[用户] 检查登录状态时出错:', error);
                                createAuthModal(); // 出错时默认显示登录界面
                            }
                        })();
                        break;
                }
            };
            
            // 使用被动事件监听器提升性能
            safeAddEventListener(button, 'mouseover', handleButtonState, {passive: true});
            safeAddEventListener(button, 'mouseout', handleButtonState, {passive: true});
            safeAddEventListener(button, 'mousedown', handleButtonState, {passive: true});
            safeAddEventListener(button, 'mouseup', handleButtonState, {passive: true});
            safeAddEventListener(button, 'click', handleButtonState);

            // 将按钮添加到容器中
            if (!container.style.position || container.style.position === 'static') {
                container.style.position = 'relative';
            }
            
            // 异步添加DOM元素，减少主线程阻塞
            requestAnimationFrame(() => {
                container.appendChild(fragment);
                // 设置全局标记，防止重复创建
                window.libulib_button_created = true;
                logDebug('蝉之助按钮已添加到physton-gradio-container');
            });
        }
        
        // 使用requestIdleCallback或者requestAnimationFrame在浏览器空闲时执行，减少主线程阻塞
        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => checkForContainer());
        } else {
            requestAnimationFrame(checkForContainer);
        }
    }

    // 填充提示词到文本框的函数
    function fillPromptFields(data) {
        logDebug('[填充提示词] 开始填充提示词数据:', data);
        if (!data || (!data.positive && !data.negative)) {
            logError('[错误] 提示词数据无效，无法填充');
            return;
        }
        
        try {
            // 查找提示词输入框的策略
            const textareas = document.querySelectorAll('textarea');
            logDebug(`[填充提示词] 找到 ${textareas.length} 个文本区域`);
            
            // 策略1: 尝试通过physton-prompt类名找到提示词输入框
            logDebug('[查找策略] 策略1: 通过physton-prompt类名直接找到提示词输入框');
            const phystonPositive = document.querySelector('.physton-prompt-positive');
            const phystonNegative = document.querySelector('.physton-prompt-negative');
            
            if (phystonPositive && phystonNegative) {
                logDebug('[查找成功] 通过类名physton-prompt找到提示词输入框');
                if (data.positive) {
                    phystonPositive.value = data.positive;
                    phystonPositive.dispatchEvent(new Event('input', { bubbles: true }));
                    logDebug('[填充成功] 正向提示词已填充到physton-prompt-positive');
                }
                
                if (data.negative) {
                    phystonNegative.value = data.negative;
                    phystonNegative.dispatchEvent(new Event('input', { bubbles: true }));
                    logDebug('[填充成功] 负向提示词已填充到physton-prompt-negative');
                }
                return;
            }
            
            // 策略2: 尝试通过高度找到大的文本区域（通常提示词输入框较大）
            logDebug('[查找策略] 策略2: 通过文本区域大小识别提示词输入框');
            if (textareas.length >= 2) {
                // 按高度排序
                const sortedByHeight = Array.from(textareas).sort((a, b) => {
                    const aHeight = a.clientHeight || a.offsetHeight;
                    const bHeight = b.clientHeight || b.offsetHeight;
                    return bHeight - aHeight; // 从大到小排序
                });
                
                // 取前两个最大的
                const positiveTextarea = sortedByHeight[0];
                const negativeTextarea = sortedByHeight[1];
                
                if (positiveTextarea && negativeTextarea) {
                    logDebug('[查找成功] 通过大小找到可能的提示词输入框');
                    if (data.positive) {
                        positiveTextarea.value = data.positive;
                        positiveTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                        logDebug('[填充成功] 正向提示词已填充到第一个大文本区域');
                    }
                    
                    if (data.negative) {
                        negativeTextarea.value = data.negative;
                        negativeTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                        logDebug('[填充成功] 负向提示词已填充到第二个大文本区域');
                    }
                    return;
                }
            }
            
            // 策略3: 找不到特定框，使用常规方法
            logDebug('[查找策略] 策略3: 使用常规文本区域');
            if (textareas.length >= 2) {
                // 尝试通过placeholder判断
                const positiveTextarea = Array.from(textareas).find(t => 
                    t.placeholder && (
                        t.placeholder.includes('正向') || 
                        t.placeholder.includes('Prompt') ||
                        t.placeholder.toLowerCase().includes('positive')
                    )
                ) || textareas[0];
                
                const negativeTextarea = Array.from(textareas).find(t => 
                    t.placeholder && (
                        t.placeholder.includes('负向') || 
                        t.placeholder.includes('Negative') ||
                        t.placeholder.toLowerCase().includes('negative')
                    )
                ) || textareas[1];
                
                logDebug('[查找结果] 找到常规文本区域');
                if (data.positive) {
                    positiveTextarea.value = data.positive;
                    positiveTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                    logDebug('[填充成功] 正向提示词已填充到常规文本区域1');
                }
                
                if (data.negative) {
                    negativeTextarea.value = data.negative;
                    negativeTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                    logDebug('[填充成功] 负向提示词已填充到常规文本区域2');
                }
                return;
            }
            
            logError('[错误] 未找到合适的提示词输入框');
        } catch (error) {
            logError('[错误] 填充提示词时发生错误:', error);
        }
    }

    // 优化的脚本初始化过程
    async function initScript() {
        // 加载用户数据
        await loadUserData();
        
        // 添加样式（异步）
        if (document.readyState === 'loading') {
            // 如果DOM还在加载中，等待DOMContentLoaded事件
            document.addEventListener('DOMContentLoaded', function() {
                safeSetTimeout(addPlaceholderStyles, 0);
            }, {once: true, passive: true});
        } else {
            // 如果DOM已加载完成，异步添加样式
            safeSetTimeout(addPlaceholderStyles, 0);
        }
        
        // 使用MutationObserver监听DOM变化，等页面准备好再创建按钮，替代轮询
        const observer = new MutationObserver((mutations, obs) => {
            // 检查是否存在目标容器
            if (document.querySelector('.physton-gradio-container')) {
                // 找到目标容器，创建按钮并停止观察
                createMainButton();
                obs.disconnect();
            }
        });
        
        // 开始观察文档变化
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        
        // 设置备份计时器，确保在MutationObserver可能失败的情况下仍能创建按钮
        safeSetTimeout(() => {
            if (!window.libulib_button_created) {
                createMainButton();
            }
        }, 2000);
        
        // 监听页面卸载，清理资源
        window.addEventListener('beforeunload', cleanupResources, {once: true, passive: true});
    }

    // 使用requestIdleCallback启动初始化，在浏览器空闲时执行
    if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
            // 使用异步IIFE包装初始化
            (async () => {
                try {
                    await initScript();
                } catch (error) {
                    logError('[初始化] 脚本初始化失败:', error);
                }
            })();
        });
    } else {
        // 降级方案：使用setTimeout替代requestIdleCallback
        safeSetTimeout(() => {
            // 使用异步IIFE包装初始化
            (async () => {
                try {
                    await initScript();
                } catch (error) {
                    logError('[初始化] 脚本初始化失败:', error);
                }
            })();
        }, 50);
    }

    // 用户注册功能
    async function registerUser(email, password) {
        // 检查邮箱格式
        if (!isValidEmail(email)) {
            return { success: false, message: '请输入有效的邮箱地址' };
        }
        
        // 检查邮箱是否已存在
        if (registeredUsers.some(user => user.username === email)) {
            return { success: false, message: '该邮箱已被注册' };
        }
        
        // 创建新用户对象
        const newUser = {
            username: email,
            password,
            isAdmin: false,
            createdAt: new Date().toISOString()
        };
        
        // 添加到用户列表并保存
        registeredUsers.push(newUser);
        await saveUserData();
        
        // 返回成功
        return { success: true, message: '注册成功' };
    }
    
    // 用户登录功能
    function loginUser(email, password) {
        // 检查邮箱格式
        if (!isValidEmail(email)) {
            return { success: false, message: '请输入有效的邮箱地址' };
        }
        
        // 特殊处理 @limayao.com 邮箱
        if (email.toLowerCase().endsWith('@limayao.com')) {
            const prefix = email.split('@')[0];
            if (prefix === password) {
                // 检查用户是否已存在
                let user = registeredUsers.find(u => u.username === email);
                
                if (!user) {
                    // 创建新用户并保存
                    user = {
                        username: email,
                        password: prefix, // 保存前缀作为密码
                        isAdmin: false,
                        createdAt: new Date().toISOString()
                    };
                    registeredUsers.push(user);
                    // 异步保存用户数据
                    saveUserData().catch(error => {
                        logError('[用户] 保存@limayao.com用户数据失败:', error);
                    });
                }
                
                // 更新登录状态
                isLoggedIn = true;
                currentUser = user;
                
                // 保存登录状态到本地存储
                localStorage.setItem('libulib_current_user', JSON.stringify({
                    username: user.username,
                    isAdmin: user.isAdmin,
                    loginTime: new Date().toISOString()
                }));
                
                // 新增：保存登录状态缓存
                localStorage.setItem(LOGIN_STATUS_KEY, JSON.stringify({
                    username: user.username,
                    time: new Date().toISOString()
                }));
                
                return { success: true, message: '登录成功', user };
            }
            return { success: false, message: '密码不正确' };
        }
        
        // 查找用户
        const user = registeredUsers.find(u => u.username === email);
        
        // 检查用户是否存在
        if (!user) {
            return { success: false, message: '该邮箱未注册' };
        }
        
        // 验证密码
        if (user.password !== password) {
            return { success: false, message: '密码不正确' };
        }
        
        // 更新登录状态
        isLoggedIn = true;
        currentUser = user;
        
        // 保存登录状态到本地存储
        localStorage.setItem('libulib_current_user', JSON.stringify({
            username: user.username,
            isAdmin: user.isAdmin,
            loginTime: new Date().toISOString()
        }));
        
        // 新增：保存登录状态缓存
        localStorage.setItem(LOGIN_STATUS_KEY, JSON.stringify({
            username: user.username,
            time: new Date().toISOString()
        }));
        
        return { success: true, message: '登录成功', user };
    }
    
    // 检查当前登录状态
    function checkLoginStatus() {
        try {
            // 首先检查登录状态缓存
            const loginStatus = localStorage.getItem(LOGIN_STATUS_KEY);
            if (loginStatus) {
                const loginData = JSON.parse(loginStatus);
                // 检查登录是否在24小时内
                const loginTime = new Date(loginData.time);
                const now = new Date();
                const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
                
                if (hoursDiff < 24 && loginData.username) {
                    // 验证用户是否存在于已注册用户中
                    const user = registeredUsers.find(u => u.username === loginData.username);
                    if (user) {
                        isLoggedIn = true;
                        currentUser = user;
                        return true;
                    }
                }
            }
            
            // 如果登录状态缓存无效，检查用户数据
            const storedUser = localStorage.getItem('libulib_current_user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                const user = registeredUsers.find(u => u.username === userData.username);
                
                if (user) {
                    isLoggedIn = true;
                    currentUser = user;
                    // 更新登录状态缓存
                    localStorage.setItem(LOGIN_STATUS_KEY, JSON.stringify({
                        username: user.username,
                        time: new Date().toISOString()
                    }));
                    return true;
                }
            }
        } catch (error) {
            logError('[用户] 检查登录状态失败:', error);
        }
        
        isLoggedIn = false;
        currentUser = null;
        localStorage.removeItem(LOGIN_STATUS_KEY);
        return false;
    }
    
    // 注销用户
    function logoutUser() {
        isLoggedIn = false;
        currentUser = null;
        localStorage.removeItem('libulib_current_user');
        localStorage.removeItem(LOGIN_STATUS_KEY);
        return { success: true, message: '已退出登录' };
    }
    
    // 保存用户数据到本地存储
    async function saveUserData() {
        try {
            logDebug('[用户] 开始保存用户数据');
            
            // 保存到本地存储作为备份
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(registeredUsers));
            logDebug('[用户] 用户数据已保存到本地存储');
            
            // 如果JSONBin.io配置正确，保存到远程
            if (JSONBIN_BIN_ID && JSONBIN_BIN_ID !== 'YOUR_BIN_ID_HERE') {
                try {
                    await saveUsersToJSONBin();
                    logDebug('[用户] 用户数据已成功保存到JSONBin.io');
                    return true;
                } catch (error) {
                    logError('[用户] 保存到JSONBin.io失败，但已保存到本地:', error);
                    return false;
                }
            } else {
                logDebug('[用户] 未配置JSONBin.io Bin ID，仅保存到本地');
                return true;
            }
        } catch (error) {
            logError('[用户] 保存用户数据失败:', error);
            return false;
        }
    }

    // 创建登录注册模态框
    function createAuthModal() {
        logDebug('[用户] 开始创建登录/注册模态框');
        
        // 确保样式已加载
        addAuthModalStyles();
        
        // 检查模态框是否已存在，防止重复创建
        if (document.getElementById('libulib-auth-modal-overlay')) {
            logDebug('[用户] 模态框已存在，不重复创建');
            return;
        }
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'libulib-auth-modal-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
        overlay.style.zIndex = '10000';
        overlay.style.backdropFilter = 'blur(5px)';
        overlay.style.animation = 'libulibFadeIn 0.3s ease';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        
        // 移除此处重复的样式定义

        // 修改遮罩层点击事件，允许点击遮罩层关闭模态框
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                // 检查是否有未保存的输入
                const loginForm = document.getElementById('login-form');
                const registerForm = document.getElementById('register-form');
                
                // 修复选择器以匹配实际的输入类型
                let hasLoginInput = false;
                let hasRegisterInput = false;
                
                try {
                    hasLoginInput = loginForm && (
                        (loginForm.querySelector('input[type="email"]')?.value.trim()) ||
                        (loginForm.querySelector('input[type="password"]')?.value.trim())
                    );
                } catch (e) {
                    console.error("检查登录表单输入时出错:", e);
                }
                
                try {
                    hasRegisterInput = registerForm && (
                        (registerForm.querySelector('input[type="text"]')?.value.trim()) ||
                        (registerForm.querySelector('input[type="password"]')?.value.trim())
                    );
                } catch (e) {
                    console.error("检查注册表单输入时出错:", e);
                }
                
                if (hasLoginInput || hasRegisterInput) {
                    const confirmClose = confirm('当前输入的内容尚未提交，确定要关闭吗？');
                    if (!confirmClose) {
                        return;
                    }
                }
                document.body.removeChild(overlay);
            }
        });

        const modal = document.createElement('div');
        modal.id = 'libulib-auth-modal';
        modal.style.backgroundColor = 'white';
        modal.style.borderRadius = '12px';
        modal.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        modal.style.width = '360px';
        modal.style.maxWidth = '90%';
        modal.style.padding = '30px';
        modal.style.position = 'relative';
        modal.style.animation = 'libulibSlideUp 0.3s ease';
        modal.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        
        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '15px';
        closeButton.style.right = '15px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.color = '#999';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '5px';
        closeButton.style.lineHeight = '1';
        closeButton.style.transition = 'all 0.2s ease';
        closeButton.style.borderRadius = '4px';

        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = '#f5f5f5';
            closeButton.style.color = '#666';
        });

        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = 'transparent';
            closeButton.style.color = '#999';
        });

        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            // 检查是否有未保存的输入
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            
            // 修复选择器以匹配实际的输入类型
            let hasLoginInput = false;
            let hasRegisterInput = false;
            
            try {
                hasLoginInput = loginForm && (
                    (loginForm.querySelector('input[type="email"]')?.value.trim()) ||
                    (loginForm.querySelector('input[type="password"]')?.value.trim())
                );
            } catch (e) {
                console.error("检查登录表单输入时出错:", e);
            }
            
            try {
                hasRegisterInput = registerForm && (
                    (registerForm.querySelector('input[type="text"]')?.value.trim()) ||
                    (registerForm.querySelector('input[type="password"]')?.value.trim())
                );
            } catch (e) {
                console.error("检查注册表单输入时出错:", e);
            }
            
            if (hasLoginInput || hasRegisterInput) {
                const confirmClose = confirm('当前输入的内容尚未提交，确定要关闭吗？');
                if (!confirmClose) {
                    return;
                }
            }
            document.body.removeChild(overlay);
        });

        modal.appendChild(closeButton);
        
        // 创建标题
        const title = document.createElement('h2');
        title.textContent = '蝉之助 - 用户登录';
        title.style.textAlign = 'center';
        title.style.margin = '0 0 25px 0';
        title.style.color = '#333';
        title.style.fontSize = '20px';
        modal.appendChild(title);
        
        // 创建选项卡容器
        const tabContainer = document.createElement('div');
        tabContainer.style.display = 'flex';
        tabContainer.style.justifyContent = 'center';
        tabContainer.style.borderBottom = '1px solid #eee';
        tabContainer.style.marginBottom = '20px';
        modal.appendChild(tabContainer);
        
        // 登录选项卡
        const loginTab = document.createElement('div');
        loginTab.textContent = '登录';
        loginTab.className = 'auth-tab active';
        loginTab.dataset.tab = 'login';
        tabContainer.appendChild(loginTab);
        
        // 注册选项卡
        const registerTab = document.createElement('div');
        registerTab.textContent = '注册';
        registerTab.className = 'auth-tab';
        registerTab.dataset.tab = 'register';
        tabContainer.appendChild(registerTab);
        
        // 创建表单容器
        const formContainer = document.createElement('div');
        modal.appendChild(formContainer);
        
        // 登录表单
        const loginForm = document.createElement('div');
        loginForm.id = 'login-form';
        loginForm.style.display = 'block';
        
        // 添加提示信息
        const limayaoTip = document.createElement('div');
        limayaoTip.style.backgroundColor = '#f0f9ff';
        limayaoTip.style.border = '1px solid #bae6fd';
        limayaoTip.style.borderRadius = '8px';
        limayaoTip.style.padding = '12px';
        limayaoTip.style.marginBottom = '15px';
        limayaoTip.style.fontSize = '13px';
        limayaoTip.style.color = '#0369a1';
        limayaoTip.innerHTML = '💡 使用 <strong>@limayao.com</strong> 后缀的邮箱可以直接登录，密码为邮箱前缀。<br>例如：邮箱为 test@limayao.com，密码为 test';
        loginForm.appendChild(limayaoTip);
        
        // 用户名输入
        const usernameInput = document.createElement('input');
        usernameInput.type = 'email';
        usernameInput.placeholder = '邮箱地址';
        usernameInput.className = 'auth-input-field';
        usernameInput.autocomplete = 'email';
        loginForm.appendChild(usernameInput);
        
        // 密码输入
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.placeholder = '密码';
        passwordInput.className = 'auth-input-field';
        passwordInput.autocomplete = 'current-password';
        loginForm.appendChild(passwordInput);
        
        // 消息显示区域
        const messageBox = document.createElement('div');
        messageBox.id = 'login-message';
        messageBox.style.display = 'none';
        loginForm.appendChild(messageBox);
        
        // 登录按钮
        const loginButton = document.createElement('button');
        loginButton.textContent = '登录';
        loginButton.className = 'auth-btn auth-primary-btn';
        loginForm.appendChild(loginButton);
        
        // 添加登录表单到容器
        formContainer.appendChild(loginForm);
        
        // 注册表单
        const registerForm = document.createElement('div');
        registerForm.id = 'register-form';
        registerForm.style.display = 'none';
        
        // 注册用户名
        const regUsernameInput = document.createElement('input');
        regUsernameInput.type = 'text';
        regUsernameInput.placeholder = '请输入注册邮箱';
        regUsernameInput.className = 'auth-input-field';
        regUsernameInput.autocomplete = 'username';
        registerForm.appendChild(regUsernameInput);
        
        // 注册密码
        const regPasswordInput = document.createElement('input');
        regPasswordInput.type = 'password';
        regPasswordInput.placeholder = '设置密码';
        regPasswordInput.className = 'auth-input-field';
        regPasswordInput.autocomplete = 'new-password';
        registerForm.appendChild(regPasswordInput);
        
        // 确认密码
        const confirmPasswordInput = document.createElement('input');
        confirmPasswordInput.type = 'password';
        confirmPasswordInput.placeholder = '确认密码';
        confirmPasswordInput.className = 'auth-input-field';
        confirmPasswordInput.autocomplete = 'new-password';
        registerForm.appendChild(confirmPasswordInput);
        
        // 注册消息显示
        const regMessageBox = document.createElement('div');
        regMessageBox.id = 'register-message';
        regMessageBox.style.display = 'none';
        registerForm.appendChild(regMessageBox);
        
        // 注册按钮
        const registerButton = document.createElement('button');
        registerButton.textContent = '注册';
        registerButton.className = 'auth-btn auth-primary-btn';
        registerForm.appendChild(registerButton);
        
        // 添加注册表单到容器
        formContainer.appendChild(registerForm);
        
        // 添加选项卡切换功能
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            messageBox.style.display = 'none';
            regMessageBox.style.display = 'none';
        });
        
        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
            messageBox.style.display = 'none';
            regMessageBox.style.display = 'none';
        });
        
        // 登录按钮点击事件
        loginButton.addEventListener('click', async () => {
            const email = usernameInput.value.trim();
            const password = passwordInput.value;
            
            // 重置消息框
            messageBox.className = '';
            messageBox.textContent = '';
            messageBox.style.display = 'none';
            
            // 输入验证
            if (!email || !password) {
                messageBox.textContent = '请输入邮箱和密码';
                messageBox.className = 'auth-msg auth-error';
                messageBox.style.display = 'block';
                return;
            }
            
            // 显示加载中
            messageBox.textContent = '登录中...';
            messageBox.className = 'auth-msg';
            messageBox.style.display = 'block';
            
            // 确保用户数据是最新的
            await loadUserData();
            
            // 尝试登录
            const result = loginUser(email, password);
            
            if (result.success) {
                // 登录成功
                messageBox.textContent = '登录成功！';
                messageBox.className = 'auth-msg auth-success';
                messageBox.style.display = 'block';
                
                // 更新用户信息显示
                const userInfoContainer = document.getElementById('libulib-user-info');
                const usernameDisplay = document.getElementById('libulib-username-display');
                if(userInfoContainer && usernameDisplay) {
                    usernameDisplay.textContent = currentUser.username;
                    userInfoContainer.style.display = 'flex';
                }
                
                // 延迟关闭登录窗口并打开蝉之助
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    createUserInputModal();
                }, 1000);
            } else {
                // 登录失败
                messageBox.textContent = result.message || '登录失败';
                messageBox.className = 'auth-msg auth-error';
                messageBox.style.display = 'block';
            }
        });
        
        // 注册按钮点击事件
        registerButton.addEventListener('click', async () => {
            const email = regUsernameInput.value.trim();
            const password = regPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            // 重置消息框
            regMessageBox.className = '';
            regMessageBox.textContent = '';
            regMessageBox.style.display = 'none';
            
            // 输入验证
            if (!email || !password) {
                regMessageBox.textContent = '请输入邮箱和密码';
                regMessageBox.className = 'auth-msg auth-error';
                regMessageBox.style.display = 'block';
                return;
            }
            
            if (password !== confirmPassword) {
                regMessageBox.textContent = '两次输入的密码不一致';
                regMessageBox.className = 'auth-msg auth-error';
                regMessageBox.style.display = 'block';
                return;
            }
            
            // 显示加载中
            regMessageBox.textContent = '注册中...';
            regMessageBox.className = 'auth-msg';
            regMessageBox.style.display = 'block';
            
            // 确保用户数据是最新的
            await loadUserData();
            
            // 尝试注册
            const result = await registerUser(email, password);
            
            if (result.success) {
                // 注册成功
                regMessageBox.textContent = '注册成功！正在自动登录...';
                regMessageBox.className = 'auth-msg auth-success';
                regMessageBox.style.display = 'block';
                
                // 自动登录
                const loginResult = loginUser(email, password);
                
                if (loginResult.success) {
                    // 登录成功
                    messageBox.textContent = '登录成功！';
                    messageBox.className = 'auth-msg auth-success';
                    messageBox.style.display = 'block';
                    
                    // 延迟关闭登录窗口并打开蝉之助
                    setTimeout(() => {
                        document.body.removeChild(overlay);
                        createUserInputModal();
                    }, 1000);
                }
            } else {
                // 注册失败
                regMessageBox.textContent = result.message || '注册失败';
                regMessageBox.className = 'auth-msg auth-error';
                regMessageBox.style.display = 'block';
            }
        });
        
        // 将模态框添加到遮罩层
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // 自动聚焦用户名输入框
        setTimeout(() => {
            usernameInput.focus();
        }, 100);
    }

    // 添加登录/注册模态框的特定样式
    function addAuthModalStyles() {
        // 检查样式是否已添加
        if (document.getElementById('libulib-auth-modal-styles')) {
            return;
        }
        
        const styleElement = document.createElement('style');
        styleElement.id = 'libulib-auth-modal-styles';
        styleElement.textContent = `
            @keyframes libulibFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes libulibSlideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .auth-input-field {
                width: 100%;
                padding: 12px 15px;
                margin-bottom: 15px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                box-sizing: border-box;
            }
            .auth-input-field:focus {
                border-color: #FF5B2E;
                box-shadow: 0 0 0 2px rgba(255, 91, 46, 0.2);
                outline: none;
            }
            .auth-btn {
                width: 100%;
                padding: 12px;
                border: none;
                border-radius: 8px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .auth-primary-btn {
                background-color: #FF5B2E;
                color: white;
            }
            .auth-primary-btn:hover {
                background-color: #E94A1E;
                transform: translateY(-2px);
                box-shadow: 0 4px 10px rgba(255, 91, 46, 0.3);
            }
            .auth-secondary-btn {
                background-color: #f5f5f5;
                color: #333;
                margin-top: 10px;
            }
            .auth-secondary-btn:hover {
                background-color: #e9e9e9;
                transform: translateY(-2px);
            }
            .auth-tab {
                padding: 12px 20px;
                cursor: pointer;
                font-weight: 600;
                border-bottom: 2px solid transparent;
                transition: all 0.3s ease;
                color: #666; /* 默认颜色 */
            }
            .auth-tab.active {
                border-bottom: 2px solid #FF5B2E;
                color: #FF5B2E;
            }
            .auth-msg {
                margin: 15px 0;
                padding: 10px;
                border-radius: 6px;
                font-size: 14px;
                text-align: center;
            }
            .auth-error {
                background-color: #fff2f2;
                color: #d32f2f;
                border-left: 3px solid #f44336;
            }
            .auth-success {
                background-color: #f0f9f0;
                color: #2e7d32;
                border-left: 3px solid #4caf50;
            }
        `;
        document.head.appendChild(styleElement);
        logDebug('[样式] Auth Modal 样式已添加');
    }

    // 创建用户管理模态框
    function createUserManagementModal() {
        logDebug('[用户] 开始创建用户管理模态框');
        
        // 检查是否为管理员
        if (!currentUser || !currentUser.isAdmin) {
            alert('权限不足，无法访问用户管理');
            return;
        }
        
        // 检查模态框是否已存在
        if (document.getElementById('libulib-user-manage-overlay')) {
            logDebug('[用户] 用户管理模态框已存在，不重复创建');
            return;
        }
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'libulib-user-manage-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
        overlay.style.zIndex = '10000';
        overlay.style.backdropFilter = 'blur(5px)';
        overlay.style.animation = 'libulibFadeIn 0.3s ease';
        
        // 点击遮罩关闭对话框
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
        
        // 创建模态框
        const modal = document.createElement('div');
        modal.id = 'libulib-user-manage-modal';
        modal.style.position = 'absolute';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.borderRadius = '12px';
        modal.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        modal.style.width = '600px';
        modal.style.maxWidth = '90%';
        modal.style.maxHeight = '85vh';
        modal.style.overflow = 'hidden';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.animation = 'libulibSlideUp 0.3s ease';
        modal.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        
        // 阻止点击事件冒泡
        modal.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // 模态框头部
        const modalHeader = document.createElement('div');
        modalHeader.style.display = 'flex';
        modalHeader.style.justifyContent = 'space-between';
        modalHeader.style.alignItems = 'center';
        modalHeader.style.padding = '20px 25px';
        modalHeader.style.borderBottom = '1px solid #eee';
        modal.appendChild(modalHeader);
        
        // 标题
        const title = document.createElement('h3');
        title.textContent = '用户管理';
        title.style.margin = '0';
        title.style.fontSize = '18px';
        title.style.fontWeight = '600';
        title.style.color = '#333';
        modalHeader.appendChild(title);
        
        // 关闭按钮
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = '#999';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.transition = 'color 0.2s ease';
        
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.color = '#333';
        });
        
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.color = '#999';
        });
        
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        modalHeader.appendChild(closeButton);
        
        // 内容区域
        const contentContainer = document.createElement('div');
        contentContainer.style.padding = '20px 25px';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.maxHeight = 'calc(85vh - 140px)';
        modal.appendChild(contentContainer);
        
        // 操作工具栏
        const toolbar = document.createElement('div');
        toolbar.style.display = 'flex';
        toolbar.style.justifyContent = 'space-between';
        toolbar.style.marginBottom = '20px';
        contentContainer.appendChild(toolbar);
        
        // 添加用户按钮
        const addUserBtn = document.createElement('button');
        addUserBtn.textContent = '+ 添加用户';
        addUserBtn.style.padding = '8px 16px';
        addUserBtn.style.backgroundColor = '#FF5B2E';
        addUserBtn.style.color = 'white';
        addUserBtn.style.border = 'none';
        addUserBtn.style.borderRadius = '6px';
        addUserBtn.style.cursor = 'pointer';
        addUserBtn.style.fontWeight = '500';
        addUserBtn.style.transition = 'all 0.2s ease';
        
        addUserBtn.addEventListener('mouseover', () => {
            addUserBtn.style.backgroundColor = '#E94A1E';
        });
        
        addUserBtn.addEventListener('mouseout', () => {
            addUserBtn.style.backgroundColor = '#FF5B2E';
        });
        
        // 添加用户按钮点击事件
        addUserBtn.addEventListener('click', async () => {
            const email = prompt('请输入新用户邮箱:');
            if (!email) return;
            
            if (!isValidEmail(email)) {
                alert('请输入有效的邮箱地址');
                return;
            }
            
            const password = prompt('请输入新用户密码:');
            if (!password) return;
            
            const result = await registerUser(email, password);
            if (result.success) {
                alert('用户添加成功！');
                // 刷新用户列表
                renderUserList();
            } else {
                alert(`添加失败: ${result.message}`);
            }
        });
        
        toolbar.appendChild(addUserBtn);
        
        // 搜索框
        const searchContainer = document.createElement('div');
        searchContainer.style.display = 'flex';
        searchContainer.style.alignItems = 'center';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '搜索邮箱...';
        searchInput.style.padding = '8px 12px';
        searchInput.style.border = '1px solid #ddd';
        searchInput.style.borderRadius = '6px';
        searchInput.style.width = '200px';
        searchInput.style.fontSize = '14px';
        
        searchContainer.appendChild(searchInput);
        toolbar.appendChild(searchContainer);
        
        // 用户列表表格
        const tableContainer = document.createElement('div');
        tableContainer.style.width = '100%';
        tableContainer.style.overflowX = 'auto';
        contentContainer.appendChild(tableContainer);
        
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '14px';
        tableContainer.appendChild(table);
        
        // 表头
        const thead = document.createElement('thead');
        thead.style.backgroundColor = '#f5f5f5';
        table.appendChild(thead);
        
        const headerRow = document.createElement('tr');
        thead.appendChild(headerRow);
        
        const headers = ['邮箱', '创建时间', '管理员', '操作'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.padding = '12px 15px';
            th.style.textAlign = 'left';
            th.style.borderBottom = '1px solid #ddd';
            headerRow.appendChild(th);
        });
        
        // 表格主体
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);
        
        // 渲染用户列表的函数
        function renderUserList(filter = '') {
            // 清空表格
            tbody.innerHTML = '';
            
            // 筛选用户
            const filteredUsers = registeredUsers.filter(user => 
                !filter || user.username.toLowerCase().includes(filter.toLowerCase())
            );
            
            if (filteredUsers.length === 0) {
                const emptyRow = document.createElement('tr');
                const emptyCell = document.createElement('td');
                emptyCell.textContent = filter ? '没有找到匹配的用户' : '暂无用户';
                emptyCell.colSpan = 4;
                emptyCell.style.padding = '20px 15px';
                emptyCell.style.textAlign = 'center';
                emptyCell.style.color = '#999';
                emptyRow.appendChild(emptyCell);
                tbody.appendChild(emptyRow);
                return;
            }
            
            // 添加用户行
            filteredUsers.forEach((user, index) => {
                const row = document.createElement('tr');
                row.style.borderBottom = '1px solid #eee';
                if (index % 2 === 1) {
                    row.style.backgroundColor = '#fafafa';
                }
                
                // 用户名单元格
                const usernameCell = document.createElement('td');
                usernameCell.textContent = user.username;
                usernameCell.style.padding = '12px 15px';
                row.appendChild(usernameCell);
                
                // 创建时间单元格
                const createdAtCell = document.createElement('td');
                createdAtCell.textContent = user.createdAt ? new Date(user.createdAt).toLocaleString() : '未知';
                createdAtCell.style.padding = '12px 15px';
                row.appendChild(createdAtCell);
                
                // 管理员单元格
                const isAdminCell = document.createElement('td');
                isAdminCell.textContent = user.isAdmin ? '是' : '否';
                isAdminCell.style.padding = '12px 15px';
                row.appendChild(isAdminCell);
                
                // 操作单元格
                const actionCell = document.createElement('td');
                actionCell.style.padding = '12px 15px';
                
                // 重置密码按钮
                const resetPwdBtn = document.createElement('button');
                resetPwdBtn.textContent = '重置密码';
                resetPwdBtn.style.marginRight = '10px';
                resetPwdBtn.style.padding = '5px 10px';
                resetPwdBtn.style.backgroundColor = '#f0f0f0';
                resetPwdBtn.style.border = '1px solid #ddd';
                resetPwdBtn.style.borderRadius = '4px';
                resetPwdBtn.style.cursor = 'pointer';
                
                resetPwdBtn.addEventListener('click', async () => {
                    const newPassword = prompt(`请为用户 "${user.username}" 输入新密码:`);
                    if (newPassword) {
                        // 更新用户密码
                        user.password = newPassword;
                        await saveUserData();
                        alert('密码重置成功');
                    }
                });
                
                actionCell.appendChild(resetPwdBtn);
                
                // 删除按钮
                if (user.username !== 'admin') { // 防止删除主管理员
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = '删除';
                    deleteBtn.style.padding = '5px 10px';
                    deleteBtn.style.backgroundColor = '#fff2f2';
                    deleteBtn.style.border = '1px solid #ffcccc';
                    deleteBtn.style.borderRadius = '4px';
                    deleteBtn.style.cursor = 'pointer';
                    deleteBtn.style.color = '#d32f2f';
                    
                    deleteBtn.addEventListener('click', async () => {
                        const confirmDelete = confirm(`确定要删除用户 "${user.username}" 吗？此操作不可恢复。`);
                        if (confirmDelete) {
                            // 从用户列表中移除用户
                            const index = registeredUsers.findIndex(u => u.username === user.username);
                            if (index !== -1) {
                                registeredUsers.splice(index, 1);
                                await saveUserData();
                                renderUserList(filter);
                            }
                        }
                    });
                    
                    actionCell.appendChild(deleteBtn);
                }
                
                row.appendChild(actionCell);
                tbody.appendChild(row);
            });
        }
        
        // 初始渲染用户列表
        renderUserList();
        
        // 搜索功能
        searchInput.addEventListener('input', (e) => {
            renderUserList(e.target.value);
        });
        
        // 模态框底部
        const modalFooter = document.createElement('div');
        modalFooter.style.padding = '15px 25px';
        modalFooter.style.borderTop = '1px solid #eee';
        modalFooter.style.display = 'flex';
        modalFooter.style.justifyContent = 'flex-end';
        modal.appendChild(modalFooter);
        
        // 返回按钮
        const backButton = document.createElement('button');
        backButton.textContent = '返回蝉之助';
        backButton.style.padding = '8px 16px';
        backButton.style.backgroundColor = '#333';
        backButton.style.color = 'white';
        backButton.style.border = 'none';
        backButton.style.borderRadius = '6px';
        backButton.style.cursor = 'pointer';
        backButton.style.transition = 'all 0.2s ease';
        
        backButton.addEventListener('mouseover', () => {
            backButton.style.backgroundColor = '#555';
        });
        
        backButton.addEventListener('mouseout', () => {
            backButton.style.backgroundColor = '#333';
        });
        
        backButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            createUserInputModal();
        });
        
        modalFooter.appendChild(backButton);
        
        // 添加到页面
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // AI系统提示词配置
    const SYSTEM_PROMPTS = {
        // 通用提示词生成
        general: {
            name: '通用提示词',
            systemPrompt: `你是一个专业的 Stable Diffusion F.1 提示词工程师。请遵循以下规则生成高质量的英文提示词：

1.  **输出格式:** 始终返回 JSON 格式，包含 "positive" 和 "negative" 两个字段。不要包含任何额外的解释或 markdown 标记。
2.  **语言:** 所有提示词必须是英文。
3.  **核心需求:** 理解用户输入的核心主题和意图。
4.  **关键词排序:** 遵循结构：[核心主体/概念], [关键细节/动作/状态], [环境/背景], [构图/视角], [艺术风格/媒介], [灯光/氛围], [质量提升词]。
5.  **权重使用 (重要):**
    *   优先通过将最重要的关键词放在提示词**最前面**来强调它们。
    *   **谨慎地**对最关键、最核心的用户指定元素使用**适度**的权重 (例如 1.1-1.3)。**避免过度使用高权重**，因为这可能导致图像失真或细节丢失。
    *   默认情况下，大多数关键词不需要特殊权重。
6.  **负向提示词:** 包含通用的负面词以提高质量，例如：low quality, worst quality, blurry, jpeg artifacts, ugly, deformed, mutation, mutilated, extra limbs, missing limbs, disconnected limbs, malformed hands, bad hands, missing fingers, extra fingers, liquid fingers, text, signature, watermark, username。并根据需要添加与主题冲突的负面词。
7.  **简洁性:** 保持提示词清晰、简洁，同时包含足够的细节。

返回格式示例：
{
  "positive": "core subject (1.2), key details, action, in detailed environment, specific art style, specific lighting, masterpiece, best quality, highly detailed",
  "negative": "low quality, worst quality, blurry, jpeg artifacts, ugly, deformed, mutation, mutilated, extra limbs, missing limbs, disconnected limbs, malformed hands, bad hands, missing fingers, extra fingers, liquid fingers, text, signature, watermark, username, style conflicts"
}`
        },
        
        // B端图标提示词
        bIcon: {
            name: 'B端图标',
            systemPrompt: `你是一个专业的 UI/UX 图标提示词工程师，为 Stable Diffusion F.1 生成 B 端图标提示词。请遵循以下规则：

1.  **输出格式:** 始终返回 JSON 格式，包含 "positive" 和 "negative" 两个字段。不要包含任何额外的解释或 markdown 标记。
2.  **语言:** 所有提示词必须是英文。
3.  **核心风格:** 专注于现代、简洁、专业、清晰的商务/企业应用图标。
4.  **必须包含关键词:** 正向提示词中**必须包含** "icon, business icon, simple, clean, flat design, minimalist, professional UI"。
5.  **常见 UI 场景:** 正向提示词中应包含常见场景，如 "clean background, studio lighting, 3D rendering (if appropriate), octane render (if appropriate), vector graphics, axially symmetric"。
6.  **用户需求:** 理解用户指定的核心图标元素 (例如 "用户图标", "邮件图标")。
7.  **关键词排序:** [核心图标元素], [必须包含的关键词], [UI场景/技术描述], [风格补充], [质量提升词]。
8.  **权重使用 (重要):**
    *   优先通过将最重要的**核心图标元素**放在提示词**最前面**来强调。
    *   **非常谨慎地**对最关键的用户指定核心元素使用**适度**权重 (例如 1.1-1.2)，因为图标设计对权重很敏感。**避免过度使用高权重**。
    *   强制包含的关键词和场景词通常不需要权重。
9.  **负向提示词:** 必须包含 "complex design, overly detailed, intricate details, photorealistic, realistic, shadows, gradients (unless requested), text, words, letters, signature, watermark, blurry, low quality, ugly, cluttered, multiple objects, background elements"。
10. **简洁性:** 图标提示词应非常精炼。

返回格式示例：
{
  "positive": "user icon (1.1), icon, business icon, simple, clean, flat design, minimalist, professional UI, vector graphics, clean background, studio lighting, masterpiece",
  "negative": "complex design, overly detailed, intricate details, photorealistic, realistic, shadows, gradients, text, words, letters, signature, watermark, blurry, low quality, ugly, cluttered, multiple objects, background elements"
}`
        },
        
        // 新增：无底座B端图标提示词
        bIconNoBase: {
            name: '无底座B端图标',
            systemPrompt: `你是一个专业的 UI/UX 图标提示词工程师，为 Stable Diffusion F.1 生成 **无底座、悬浮效果** 的 B 端图标提示词。请遵循以下规则：

1.  **输出格式:** 始终返回 JSON 格式，包含 "positive" 和 "negative" 两个字段。不要包含任何额外的解释或 markdown 标记。
2.  **语言:** 所有提示词必须是英文。
3.  **核心风格:** 专注于现代、简洁、专业、清晰、**无底座、悬浮**的商务/企业应用图标。
4.  **正向必须包含:** "icon, business icon, simple, clean, flat design, minimalist, professional UI, **without base, no base, no pedestal, floating icon**"。
5.  **常见 UI 场景:** 正向提示词中应包含常见场景，如 "clean background, studio lighting, 3D rendering (if appropriate), octane render (if appropriate), vector graphics, axially symmetric"。
6.  **用户需求:** 理解用户指定的核心图标元素 (例如 "用户图标", "邮件图标")。
7.  **关键词排序:** [核心图标元素], [必须包含的无底座关键词], [其他必须包含的关键词], [UI场景/技术描述], [风格补充], [质量提升词]。
8.  **权重使用 (重要):**
    *   优先通过将最重要的**核心图标元素**放在提示词**最前面**来强调。
    *   **非常谨慎地**对最关键的用户指定核心元素使用**适度**权重 (例如 1.1-1.2)。
    *   强制包含的关键词和场景词通常不需要权重。
9.  **负向必须包含:** "complex design, overly detailed, intricate details, photorealistic, realistic, shadows, gradients (unless requested), text, words, letters, signature, watermark, blurry, low quality, ugly, cluttered, multiple objects, background elements, **(with base:1.2), (on a pedestal:1.2), (base:1.2), (pedestal:1.2), (stand:1.2)**"。
10. **简洁性:** 图标提示词应非常精炼。

返回格式示例：
{
  "positive": "user icon (1.1), without base, no base, floating icon, icon, business icon, simple, clean, flat design, minimalist, professional UI, vector graphics, clean background, studio lighting, masterpiece",
  "negative": "complex design, overly detailed, intricate details, photorealistic, realistic, shadows, gradients, text, words, letters, signature, watermark, blurry, low quality, ugly, cluttered, multiple objects, background elements, (with base:1.2), (on a pedestal:1.2), (base:1.2), (pedestal:1.2), (stand:1.2)"
}`
        },
        
        // 蝉蝉IP提示词
        chanIp: {
            name: '蝉蝉IP',
            systemPrompt: `你是一个专业的蝉蝉 IP 角色概念设计师，为 Stable Diffusion F.1 生成提示词。请遵循以下规则：

1.  **输出格式:** 始终返回 JSON 格式，包含 "positive" 和 "negative" 两个字段。不要包含任何额外的解释或 markdown 标记。
2.  **语言:** 所有提示词必须是英文。
3.  **核心元素:** 正向提示词**必须以 "chan," 开头**。
4.  **角色风格:** 必须包含 "cute, adorable, chibi, cartoon, anime style, chan character, mascot"。
5.  **画面要求:** 必须包含 "full body, full shot" 确保生成全身像。
6.  **用户需求:** 理解用户指定的核心主题、动作、情绪、服装等。
7.  **关键词排序:** "chan,", [用户核心主题/动作/情绪 (例如 astronaut chan)], [角色风格关键词], [服装/细节], [背景/场景], [构图/视角], [灯光], [质量提升词]。
8.  **权重使用 (重要):**
    *   优先通过将最重要的**用户核心主题/动作/情绪**紧跟在 "chan," 之后来强调。
    *   **谨慎地**对最关键的用户指定元素使用**适度**权重 (例如 1.1-1.3)。**避免过度使用高权重**。
    *   "chan" 和固定的风格关键词通常不需要权重。
9.  **负向提示词:** 必须包含 "cropped, lowres, worst quality, low quality, blurry, jpeg artifacts, deformed, mutation, mutilated, bad anatomy, bad hands, missing fingers, extra fingers, liquid fingers, bad feet, extra limbs, missing limbs, disconnected limbs, realistic, photorealistic, realistic face, text, signature, watermark, username, fused with background"。
10. **细节平衡:** 保持可爱的风格，同时根据用户需求添加细节。

返回格式示例：
{
  "positive": "chan, astronaut chan (1.2), jumping happily (1.1), wearing space suit, cute, adorable, chibi, cartoon, anime style, chan character, mascot, full body, full shot, in space station, stars background, bright lighting, masterpiece, best quality",
  "negative": "cropped, lowres, worst quality, low quality, blurry, jpeg artifacts, deformed, mutation, mutilated, bad anatomy, bad hands, missing fingers, extra fingers, liquid fingers, bad feet, extra limbs, missing limbs, disconnected limbs, realistic, photorealistic, realistic face, text, signature, watermark, username, fused with background"
}`
        }
    };

    function getSystemPrompt(tabId, options = {}) {
        let promptKey = tabId;
        if (tabId === 'b-icon' && options.noBase) {
            promptKey = 'bIconNoBase';
        }
        const keyMap = {
            'general': 'general',
            'b-icon': 'bIcon',
            'bIconNoBase': 'bIconNoBase',
            'chan-ip': 'chanIp'
        };
        const selectedKey = keyMap[promptKey] || 'general';
        return SYSTEM_PROMPTS[selectedKey].systemPrompt;
    }
})(); 