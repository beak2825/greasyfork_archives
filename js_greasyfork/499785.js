// ==UserScript==
// @name         微信推文克隆工具
// @namespace    http://szrshhh.com/
// @version      2.0
// @description  微信推文克隆工具,仅用于相同主体的不同账号间克隆推文，不同主体的账号，克隆推文请标注转载。免责声明：本脚本仅用于学习交流，请勿用于非法用途。
// @author       白马非马
// @match        *://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499785/%E5%BE%AE%E4%BF%A1%E6%8E%A8%E6%96%87%E5%85%8B%E9%9A%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/499785/%E5%BE%AE%E4%BF%A1%E6%8E%A8%E6%96%87%E5%85%8B%E9%9A%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // 全局变量定义
    var suffix = ``;
    var gongzhonghao = ``;
    var declaration = ``;
    var version = '版本V2.0';
    // 从单个JSON文件获取所有变量内容的函数
    function fetchAllVariablesFromNetwork(maxRetries = 3, retryDelay = 1000, timeout = 10000) {
        const jsonUrl = 'https://gitee.com/szrszr/wechat-official-account/raw/master/wechat_variables.json';

        // 默认值定义
        const defaultValues = {
            suffix: `<p>这是默认的尾缀内容，请在脚本中手动设置suffix变量或确保网络连接正常。</p>`,
            gongzhonghao: `<p>这是默认的公众号信息，请在脚本中手动设置gongzhonghao变量或确保网络连接正常。</p>`,
            declaration: `<p>这是默认的声明内容，请在脚本中手动设置declaration变量或确保网络连接正常。</p>`
        };

        return new Promise((resolve, reject) => {
            let retries = 0;

            function attemptRequest() {
                retries++;
                console.log(`正在从网络获取所有变量内容... (尝试 ${retries}/${maxRetries})`);

                try {
                    if (typeof GM_xmlhttpRequest !== 'undefined') {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: jsonUrl,
                            timeout: timeout,
                            headers: {
                                'Accept': 'application/json; charset=utf-8'
                            },
                            onload: function(response) {
                                console.log(`请求状态码: ${response.status}`);
                                if (response.status >= 200 && response.status < 300) {
                                    try {
                                        // 1. 清理响应内容
                                        let cleanResponse = response.responseText;
                                        console.log('原始响应内容长度:', cleanResponse.length);

                                        // 移除BOM
                                        cleanResponse = cleanResponse.replace(/^\uFEFF/, '');
                                        // 移除控制字符
                                        cleanResponse = cleanResponse.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
                                        // 移除多余的换行和空白字符
                                        cleanResponse = cleanResponse.trim();

                                        // 2. 尝试修复常见的JSON格式问题
                                        // 确保以{开始，以}结束
                                        if (cleanResponse && !cleanResponse.startsWith('{')) {
                                            const firstBraceIndex = cleanResponse.indexOf('{');
                                            if (firstBraceIndex >= 0) {
                                                cleanResponse = cleanResponse.substring(firstBraceIndex);
                                                console.log('修复了JSON开始位置');
                                            }
                                        }

                                        if (cleanResponse && !cleanResponse.endsWith('}')) {
                                            const lastBraceIndex = cleanResponse.lastIndexOf('}');
                                            if (lastBraceIndex >= 0) {
                                                cleanResponse = cleanResponse.substring(0, lastBraceIndex + 1);
                                                console.log('修复了JSON结束位置');
                                            }
                                        }

                                        console.log('清理后的响应内容前100字符:', cleanResponse.substring(0, 100) + '...');

                                        // 3. 尝试解析JSON数据
                                        const jsonData = JSON.parse(cleanResponse);

                                        // 4. 验证JSON结构
                                        if (typeof jsonData !== 'object' || jsonData === null) {
                                            throw new Error('JSON数据不是有效的对象');
                                        }

                                        // 更新所有变量
                                        // 安全地更新变量，确保内容非空
                                        if (jsonData.suffix && typeof jsonData.suffix === 'string') {
                                            suffix = jsonData.suffix;
                                            console.log(`suffix变量已更新，内容长度: ${suffix.length} 字符`);
                                        } else {
                                            suffix = defaultValues.suffix;
                                            console.warn('JSON中未包含有效的suffix字段，使用默认值');
                                        }

                                        if (jsonData.gongzhonghao && typeof jsonData.gongzhonghao === 'string') {
                                            gongzhonghao = jsonData.gongzhonghao;
                                            console.log(`gongzhonghao变量已更新，内容长度: ${gongzhonghao.length} 字符`);
                                        } else {
                                            gongzhonghao = defaultValues.gongzhonghao;
                                            console.warn('JSON中未包含有效的gongzhonghao字段，使用默认值');
                                        }

                                        if (jsonData.declaration && typeof jsonData.declaration === 'string') {
                                            declaration = jsonData.declaration;
                                            console.log(`declaration变量已更新，内容长度: ${declaration.length} 字符`);
                                        } else {
                                            declaration = defaultValues.declaration;
                                            console.warn('JSON中未包含有效的declaration字段，使用默认值');
                                        }

                                        showNotification('已成功从网络获取所有变量内容', false);
                                        resolve({ suffix, gongzhonghao, declaration });
                                    } catch (parseError) {
                                        console.error('JSON解析失败详情:', parseError);
                                        console.error('解析失败的JSON内容片段:', cleanResponse.substring(0, 200) + '...');

                                        // 详细分析错误位置
                                        if (parseError instanceof SyntaxError && parseError.message.includes('position')) {
                                            const match = parseError.message.match(/at position (\d+)/);
                                            if (match && match[1]) {
                                                const errorPos = parseInt(match[1]);
                                                const contextStart = Math.max(0, errorPos - 20);
                                                const contextEnd = Math.min(cleanResponse.length, errorPos + 20);
                                                console.error('错误上下文:', cleanResponse.substring(contextStart, contextEnd));
                                            }
                                        }

                                        handleError(new Error(`JSON解析失败: ${parseError.message}`));
                                    }
                                } else {
                                    handleError(new Error(`网络请求失败: ${response.status} ${response.statusText || '未知状态'}`));
                                }
                            },
                            onerror: function(error) {
                                handleError(new Error(`网络请求错误: ${error.message || '未知错误'}`));
                            },
                            ontimeout: function() {
                                handleError(new Error('请求超时'));
                            }
                        });
                    } else {
                        handleError(new Error('GM_xmlhttpRequest API不可用'));
                    }
                } catch (e) {
                    handleError(e);
                }
            }

            function handleError(error) {
                console.error(`获取变量内容失败 (尝试 ${retries}/${maxRetries}):`, error);

                if (retries < maxRetries) {
                    console.log(`将在${retryDelay}ms后重试...`);
                    setTimeout(attemptRequest, retryDelay);
                } else {
                    console.error('所有重试都失败，将使用默认值');
                    // 使用默认值
                    suffix = defaultValues.suffix;
                    gongzhonghao = defaultValues.gongzhonghao;
                    declaration = defaultValues.declaration;
                    showNotification(`获取变量内容失败: ${error.message}，已使用默认内容`, true);
                    resolve(defaultValues);
                }
            }

            attemptRequest();
        });
    }


    const versionElement = document.createElement("span");
    versionElement.textContent = version;
    versionElement.style.fontSize = "13px"; // 增大字体，提高可读性
    versionElement.style.marginBottom = "6px"; // 保持间距不变

    const app = document.createElement("div"); //外部div
    // 按钮将在后面使用createButton函数创建，无需提前声明

    // 创建一个容器 div - 可爱风格版本信息（缩小版）
    const versionContainer = document.createElement("div");
    versionContainer.style.display = "flex";
    versionContainer.style.flexDirection = "column";
    versionContainer.style.justifyContent = "center";
    versionContainer.style.alignItems = "center";
    versionContainer.style.width = "100%";
    versionContainer.style.textAlign = "center";
    versionContainer.style.marginBottom = "10px"; // 减少间距
    versionContainer.style.padding = "8px"; // 减少内边距
    versionContainer.style.borderRadius = "12px"; // 适度圆角
    versionContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    versionContainer.style.border = "none"; // 移除边框，保持可爱风格

    // 创建版本图标装饰（缩小版）
    const versionIcon = document.createElement('div');
    versionIcon.textContent = '🎀';
    versionIcon.style.fontSize = '14px'; // 缩小图标
    versionIcon.style.marginBottom = '3px'; // 减少间距
    versionContainer.appendChild(versionIcon);

    // 添加更新时间显示 - 可爱风格（缩小版）
    const updateTimeElement = document.createElement("span");
    updateTimeElement.style.fontSize = "12px"; // 增大字体，提高可读性
    updateTimeElement.style.color = "#ff6b9d";
    updateTimeElement.style.marginTop = "4px"; // 保持间距不变
    updateTimeElement.style.fontWeight = "bold";
    updateTimeElement.style.fontFamily = "'Comic Sans MS', 'Arial Rounded MT Bold', '幼圆', sans-serif";
    updateTimeElement.textContent = "未更新 🍬";

    // 从localStorage中获取并显示上次更新时间
    const lastUpdated = localStorage.getItem('wechatScriptLastUpdated');
    if (lastUpdated) {
        updateTimeElement.textContent = `更新: ${new Date(parseInt(lastUpdated)).toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })} 🌈`;
    }

    // 更新更新时间显示的函数 - 可爱风格
        window.updateTimeDisplay = function() {
            const lastUpdated = localStorage.getItem('wechatScriptLastUpdated');
            if (lastUpdated) {
                updateTimeElement.textContent = `更新: ${new Date(parseInt(lastUpdated)).toLocaleString('zh-CN', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })} 🌈`;
            }
        };

        // 配置常量
        const POEM_CONFIG = {
            STORAGE_KEY: 'wechatScriptInspirationalPoems',
            API_URL: 'https://v1.jinrishici.com/all.json',
            TIMEOUT: 3000,
            MAX_POEMS_COUNT: 20,
            POEM_EXPIRY_TIME: 7 * 24 * 60 * 60 * 1000, // 7天过期
            INITIAL_POEMS_TO_FETCH: 5
        };

        // 备用诗词列表（当API请求失败时使用）
        const backupPoems = [
            '腹有诗书气自华',
            '天生我材必有用',
            '长风破浪会有时',
            '一寸光阴一寸金',
            '千磨万击还坚劲',
            '任尔东西南北风',
            '读书破万卷，下笔如有神'
        ];

        // 诗词管理器模块
        const PoemManager = {
            // 获取今日诗词API内容
            fetchQuote: function() {
                return new Promise((resolve) => {
                    // 确保使用GM_xmlhttpRequest以避免跨域问题
                    if (typeof GM_xmlhttpRequest !== 'undefined') {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: POEM_CONFIG.API_URL,
                            timeout: POEM_CONFIG.TIMEOUT,
                            headers: {
                                'Accept': 'application/json'
                            },
                            onload: function(response) {
                                try {
                                    // 尝试解析JSON响应
                                    const data = JSON.parse(response.responseText);
                                    console.log('今日诗词API响应:', data);

                                    // 检查响应格式并提取内容
                                    let quote = '加载中...';
                                    if (data && data.content) {
                                        quote = data.content;
                                        // 自动存储获取到的诗词
                                        PoemManager.storePoem(quote);
                                    }

                                    resolve(quote);
                                } catch (e) {
                                    console.error('解析今日诗词API响应失败:', e);
                                    // 使用备用诗词
                                    const randomBackup = PoemManager.getRandomBackupPoem();
                                    resolve(randomBackup);
                                }
                            },
                            onerror: function(error) {
                                console.error('今日诗词API请求失败:', error);
                                // 使用备用诗词
                                const randomBackup = PoemManager.getRandomBackupPoem();
                                resolve(randomBackup);
                            },
                            ontimeout: function() {
                                console.error('今日诗词API请求超时');
                                // 使用备用诗词
                                const randomBackup = PoemManager.getRandomBackupPoem();
                                resolve(randomBackup);
                            }
                        });
                    } else {
                        // 如果GM_xmlhttpRequest不可用，尝试使用fetch
                        fetch(POEM_CONFIG.API_URL, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json'
                            },
                            timeout: POEM_CONFIG.TIMEOUT
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('今日诗词API响应:', data);

                            // 检查响应格式并提取内容
                            let quote = '加载中...';
                            if (data && data.content) {
                                quote = data.content;
                                // 自动存储获取到的诗词
                                PoemManager.storePoem(quote);
                            }

                            resolve(quote);
                        })
                        .catch(error => {
                            console.error('今日诗词API请求失败:', error);
                            // 使用备用诗词
                            const randomBackup = PoemManager.getRandomBackupPoem();
                            resolve(randomBackup);
                        });
                    }
                });
            },

            // 获取随机备用诗句
            getRandomBackupPoem: function() {
                const randomIndex = Math.floor(Math.random() * backupPoems.length);
                return backupPoems[randomIndex];
            },

            // 获取本地存储的诗词
            getLocalPoems: function() {
                try {
                    const stored = localStorage.getItem(POEM_CONFIG.STORAGE_KEY);
                    if (!stored) return [];

                    const poemsData = JSON.parse(stored);
                    // 过滤过期的诗词
                    const now = Date.now();
                    const validPoems = poemsData.filter(poem =>
                        !poem.expiry || poem.expiry > now
                    );

                    // 如果过滤后数据有变化，更新本地存储
                    if (validPoems.length < poemsData.length) {
                        localStorage.setItem(POEM_CONFIG.STORAGE_KEY, JSON.stringify(validPoems));
                    }

                    return validPoems;
                } catch (error) {
                    console.error('读取本地诗词失败:', error);
                    return [];
                }
            },

            // 存储诗词到本地
            storePoem: function(poem) {
                try {
                    const poems = this.getLocalPoems();
                    const now = Date.now();

                    // 添加过期时间
                    poems.push({
                        content: poem,
                        timestamp: now,
                        expiry: now + POEM_CONFIG.POEM_EXPIRY_TIME
                    });

                    // 去重
                    const uniquePoems = poems.filter((poem, index, self) =>
                        index === self.findIndex(p => p.content === poem.content)
                    );

                    // 如果诗词数量超过限制，保留最新的
                    if (uniquePoems.length > POEM_CONFIG.MAX_POEMS_COUNT) {
                        uniquePoems.sort((a, b) => b.timestamp - a.timestamp);
                        uniquePoems.splice(POEM_CONFIG.MAX_POEMS_COUNT);
                    }

                    localStorage.setItem(POEM_CONFIG.STORAGE_KEY, JSON.stringify(uniquePoems));
                    return true;
                } catch (error) {
                    console.error('存储诗词失败:', error);
                    return false;
                }
            },

            // 批量获取并存储诗词
            fetchAndStorePoems: async function(count = POEM_CONFIG.INITIAL_POEMS_TO_FETCH) {
                const fetchPromises = [];

                for (let i = 0; i < count; i++) {
                    fetchPromises.push(this.fetchQuote());
                }

                try {
                    const poems = await Promise.all(fetchPromises);
                    // 去重存储
                    const uniquePoems = [...new Set(poems)];
                    uniquePoems.forEach(poem => this.storePoem(poem));
                    console.log(`成功获取并存储 ${uniquePoems.length} 条诗词`);
                    return uniquePoems.length;
                } catch (error) {
                    console.error('批量获取诗词失败:', error);
                    return 0;
                }
            },

            // 从本地获取一条诗词并移除
            getAndRemoveLocalPoem: function() {
                try {
                    const poems = this.getLocalPoems();
                    if (poems.length === 0) return null;

                    // 随机选择一条诗词
                    const randomIndex = Math.floor(Math.random() * poems.length);
                    const selectedPoem = poems[randomIndex].content;

                    // 从数组中移除
                    poems.splice(randomIndex, 1);

                    // 更新本地存储
                    localStorage.setItem(POEM_CONFIG.STORAGE_KEY, JSON.stringify(poems));

                    return selectedPoem;
                } catch (error) {
                    console.error('获取并移除本地诗词失败:', error);
                    return null;
                }
            }
        };

        // 初始化诗词存储
        (async function initializePoems() {
            const poems = PoemManager.getLocalPoems();
            // 如果本地诗词数量不足，预加载一些
            if (poems.length < POEM_CONFIG.INITIAL_POEMS_TO_FETCH / 2) {
                console.log('本地诗词数量不足，开始预加载...');
                await PoemManager.fetchAndStorePoems(POEM_CONFIG.INITIAL_POEMS_TO_FETCH);
            }
        })();

        // 兼容原有的函数名
        function fetchInspirationalQuote() {
            // 优先从本地获取，如果没有再调用API
            const localPoem = PoemManager.getAndRemoveLocalPoem();
            if (localPoem) {
                // 异步预加载新的诗词
                PoemManager.fetchAndStorePoems(1).catch(err => {
                    console.warn('预加载诗词失败:', err);
                });
                return Promise.resolve(localPoem);
            }
            return PoemManager.fetchQuote();
        }

        // 面板收起/展开控制函数
        window.togglePanelCollapse = async function(forceCollapse = false) {
            const contentContainer = document.getElementById('wechatScriptContent');
            const toggleButton = document.getElementById('wechatScriptToggleButton');
            let quoteElement = null;

            if (!contentContainer || !toggleButton) return;

            // 切换或强制设置收起状态
            const isCollapsed = forceCollapse || contentContainer.style.display !== 'none';

            if (isCollapsed) {
                // 收起面板 - 卷动动画效果
                // 先创建并准备quote元素，但不立即显示
                quoteElement = document.getElementById('wechatScriptQuote');
                if (!quoteElement) {
                    quoteElement = document.createElement('div');
                    quoteElement.id = 'wechatScriptQuote';
                    // 基本样式设置
                    quoteElement.style.position = 'absolute';
                    quoteElement.style.top = '28px';
                    quoteElement.style.left = '5px';
                    quoteElement.style.right = '5px';
                    quoteElement.style.width = 'auto';
                    quoteElement.style.display = 'flex';
                    quoteElement.style.flexDirection = 'column';
                    quoteElement.style.justifyContent = 'center';
                    quoteElement.style.alignItems = 'center';
                    quoteElement.style.padding = '10px 8px';
                    quoteElement.style.opacity = '0'; // 初始透明
                    app.appendChild(quoteElement);
                }

                // 为整个应用容器应用卷动动画，包括内部所有元素
                app.style.perspective = '1000px';
                app.style.transformStyle = 'preserve-3d';
                app.style.backfaceVisibility = 'hidden';
                app.style.animation = 'rollUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                app.style.transformOrigin = 'top center';

                // 延迟隐藏contentContainer并显示quoteElement
                setTimeout(() => {
                    contentContainer.style.display = 'none';
                    app.style.animation = ''; // 清除外层容器动画

                    // 同步quoteElement到收起状态
                    showPoemQuote(); // 显示诗词内容

                    // 计算并设置准确高度
                    const topBarHeight = 28;
                    const quoteHeight = quoteElement.offsetHeight;
                    app.style.height = (topBarHeight + quoteHeight + 10) + 'px';
                    app.style.minHeight = 'auto';
                }, 400);

                // 为收起状态添加统一的边框，确保底部两条线对齐
                app.style.border = '2px solid #ffb6c1'; // 添加统一边框
                toggleButton.innerHTML = '🌸';
                toggleButton.title = '展开面板 🌸';
                toggleButton.style.fontSize = '16px'; // 调整图标大小
                // 确保收起状态下展开按钮始终可见
                toggleButton.style.zIndex = '10';
                toggleButton.style.position = 'relative';

                // 获取并显示励志语句 - 可爱云朵风格（优化布局版）
                // 使用已声明的quoteElement变量，不再重复声明
                if (!quoteElement) {
                    const newQuoteElement = document.createElement('div');
                    newQuoteElement.id = 'wechatScriptQuote';
                    // 小女生可爱风格设计（优化收起状态，确保紧密贴合边框）
                    newQuoteElement.style.position = 'absolute';
                    newQuoteElement.style.top = '28px'; // 直接设置在拖拽句柄下方，紧密贴合
                    newQuoteElement.style.left = '5px'; // 左边紧密贴合，留出少量边距
                    newQuoteElement.style.right = '5px'; // 右边紧密贴合，留出少量边距
                    newQuoteElement.style.width = 'auto'; // 自动宽度，填充左右空间
                    newQuoteElement.style.display = 'flex';
                    newQuoteElement.style.flexDirection = 'column';
                    newQuoteElement.style.justifyContent = 'center';
                    newQuoteElement.style.alignItems = 'center';
                    newQuoteElement.style.padding = '10px 8px'; // 适当内边距
                    newQuoteElement.style.textAlign = 'center';
                    newQuoteElement.style.fontSize = '13px'; // 保持字体大小
                    newQuoteElement.style.color = '#ff6b9d';
                    newQuoteElement.style.lineHeight = '1.5';
                    newQuoteElement.style.overflow = 'visible';
                    newQuoteElement.style.fontFamily = "'Comic Sans MS', 'Arial Rounded MT Bold', '幼圆', sans-serif";
                    newQuoteElement.style.letterSpacing = '0.6px';
                    newQuoteElement.style.wordWrap = 'break-word';
                    newQuoteElement.style.borderRadius = '16px'; // 保持圆角
                    newQuoteElement.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    newQuoteElement.style.boxShadow = '0 3px 10px rgba(255,107,157,0.15)';
                    newQuoteElement.style.border = '1px dashed #ffb6c1';

                    // 添加装饰元素 - 顶部小云朵（缩小版）
                    const decoratorTop = document.createElement('div');
                    decoratorTop.textContent = '☁️';
                    decoratorTop.style.fontSize = '16px'; // 缩小图标
                    decoratorTop.style.marginBottom = '6px';
                    decoratorTop.style.animation = 'float 3s ease-in-out infinite';

                    // 添加装饰元素 - 底部小花（缩小版）
                    const decoratorBottom = document.createElement('div');
                    decoratorBottom.textContent = '🌼';
                    decoratorBottom.style.fontSize = '14px'; // 缩小图标
                    decoratorBottom.style.marginTop = '4px';

                    // 创建内容容器
                    const contentWrapper = document.createElement('div');
                    contentWrapper.id = 'wechatScriptQuoteContent';
                    contentWrapper.style.userSelect = 'none'; // 禁止复制文本
                    contentWrapper.style.fontWeight = 'bold';

                    // 组装元素
                    newQuoteElement.appendChild(decoratorTop);
                    newQuoteElement.appendChild(contentWrapper);
                    newQuoteElement.appendChild(decoratorBottom);

                    app.appendChild(newQuoteElement);
                }

                // 显示诗词的辅助函数，添加动画效果
                async function showPoemQuote() {
                    const quote = await fetchInspirationalQuote();

                    // 确保quoteElement存在并且有装饰元素
                    if (quoteElement) {
                        // 检查是否有装饰元素，如果没有则添加
                        let decoratorTop = quoteElement.querySelector(':scope > div:nth-child(1)');
                        let contentWrapper = quoteElement.querySelector(':scope > div:nth-child(2)');
                        let decoratorBottom = quoteElement.querySelector(':scope > div:nth-child(3)');

                        // 如果缺少必要的子元素，重新创建完整结构
                        if (!decoratorTop || !contentWrapper || !decoratorBottom) {
                            // 清空现有内容
                            quoteElement.innerHTML = '';

                            // 重新添加装饰元素 - 顶部小云朵
                            decoratorTop = document.createElement('div');
                            decoratorTop.textContent = '☁️';
                            decoratorTop.style.fontSize = '16px';
                            decoratorTop.style.marginBottom = '6px';
                            decoratorTop.style.animation = 'float 3s ease-in-out infinite';

                            // 重新创建内容容器
                            contentWrapper = document.createElement('div');
                            contentWrapper.id = 'wechatScriptQuoteContent';
                            contentWrapper.style.userSelect = 'none';
                            contentWrapper.style.fontWeight = 'bold';

                            // 重新添加装饰元素 - 底部小花
                            decoratorBottom = document.createElement('div');
                            decoratorBottom.textContent = '🌼';
                            decoratorBottom.style.fontSize = '14px';
                            decoratorBottom.style.marginTop = '4px';

                            // 重新组装元素
                            quoteElement.appendChild(decoratorTop);
                            quoteElement.appendChild(contentWrapper);
                            quoteElement.appendChild(decoratorBottom);
                        }

                        // 优化诗词内容处理：智能换行，保持美观
                        let processedQuote = quote;

                        // 首先移除所有标点符号
                        processedQuote = processedQuote.replace(/[，。！？；：，\.!\?;:]/g, '');

                        // 智能换行算法：根据长度决定换行位置
                        if (processedQuote.length > 8) {
                            // 对于较长的诗句，寻找最佳换行位置
                            const midPoint = Math.floor(processedQuote.length / 2);
                            processedQuote = processedQuote.substring(0, midPoint) + '<br>' +
                                             processedQuote.substring(midPoint);
                        } else if (processedQuote.includes('，')) {
                            // 对于包含逗号的诗句
                            processedQuote = processedQuote.replace('，', '<br>');
                        } else if (processedQuote.includes(',')) {
                            // 对于包含英文逗号的诗句
                            processedQuote = processedQuote.replace(',', '<br>');
                        }

                        // 更新内容
                        contentWrapper.innerHTML = processedQuote;
                        // 确保文本不可复制
                        contentWrapper.style.userSelect = 'none';
                        // 确保文本水平和垂直居中
                        contentWrapper.style.textAlign = 'center';
                        contentWrapper.style.display = 'flex';
                        contentWrapper.style.flexDirection = 'column';
                        contentWrapper.style.justifyContent = 'center';
                        contentWrapper.style.alignItems = 'center';
                        contentWrapper.style.whiteSpace = 'pre-line'; // 允许换行符生效

                        // 预先设置样式以确保正确获取高度
                        quoteElement.style.visibility = 'hidden'; // 暂时隐藏但保留布局
                        quoteElement.style.height = 'auto';

                        // 强制重排以获取准确高度
                        quoteElement.offsetHeight; // 触发重排

                        const topBarHeight = 28; // 顶部状态栏高度
                        const quoteHeight = quoteElement.offsetHeight;
                        // 设置底部高度等于白色内容区域高度加上顶部状态栏高度
                        app.style.height = (topBarHeight + quoteHeight + 10) + 'px'; // 加10px作为安全边距
                        app.style.minHeight = 'auto'; // 移除最小高度限制，确保精确计算

                        // 显示元素 - 添加淡入动画
                        setTimeout(() => {
                            quoteElement.style.visibility = 'visible';
                            quoteElement.style.opacity = '0';
                            quoteElement.style.transform = 'translateY(5px) scale(0.95)';
                            quoteElement.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

                            // 强制重排
                            quoteElement.offsetHeight;

                            // 触发动画
                            setTimeout(() => {
                                quoteElement.style.opacity = '1';
                                quoteElement.style.transform = 'translateY(0) scale(1)';
                            }, 10);
                        }, 0);
                    }
                }
            } else {
                // 展开面板 - 平滑动画效果
                app.style.height = 'auto';
                app.style.minHeight = '350px'; // 调整最小高度
                // 恢复为无边框样式
                app.style.border = 'none';
                toggleButton.innerHTML = '🌼';
                toggleButton.title = '收起面板';
                toggleButton.style.fontSize = '14px'; // 调整图标大小

                // 移除诗词元素（无动画，直接移除）
                // 首先尝试移除本地变量引用的元素
                if (quoteElement && quoteElement.parentNode) {
                    quoteElement.parentNode.removeChild(quoteElement);
                }
                // 再尝试通过ID获取并移除，确保彻底清除
                const quoteById = document.getElementById('wechatScriptQuote');
                if (quoteById && quoteById.parentNode) {
                    quoteById.parentNode.removeChild(quoteById);
                }
                // 重置本地变量
                quoteElement = null;

                // 显示内容容器
                contentContainer.style.display = 'flex';
                contentContainer.style.flexDirection = 'column';
                contentContainer.style.alignItems = 'center';

                // 重置所有变换样式，确保干净的起始状态
                app.style.transform = 'none';
                app.style.animation = '';

                // 为整个应用容器应用卷动展开动画，包括内部所有元素
                app.style.perspective = '1000px';
                app.style.transformStyle = 'preserve-3d';
                app.style.backfaceVisibility = 'hidden';
                // 强制重排以确保正确应用动画
                app.offsetHeight;
                app.style.animation = 'unroll 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                app.style.transformOrigin = 'top center';

                // 动画完成后清除外层容器动画
                setTimeout(() => {
                    app.style.animation = '';
                }, 400);

                // 确保在动画期间所有内部元素保持静止，不单独变换
                const allChildren = contentContainer.querySelectorAll('*');
                allChildren.forEach(child => {
                    child.style.transform = 'none';
                    child.style.transition = 'none';
                });

                // 确保内容容器样式正确
                contentContainer.style.width = '100%';
                contentContainer.style.alignItems = 'center';
                contentContainer.style.gap = '6px'; // 保持紧凑间距
            }

            // 保存状态到localStorage
            localStorage.setItem('wechatScriptIsCollapsed', isCollapsed.toString());
        };

    // 将元素添加到容器中
    versionContainer.appendChild(versionElement);
    versionContainer.appendChild(updateTimeElement);

    // 实用函数：显示通知消息
    // 显示通知，可配置是否显示弹窗
    // 通知消息显示函数 - 可爱风格设计
    function showNotification(message, isError = false, showAlert = true) {
        // 无论是否弹窗，都在控制台显示日志
        if (isError) {
            console.error(message);
        } else {
            console.log(message);
        }

        // 只有在需要显示弹窗且不是普通提示信息时才弹窗
        if (showAlert && (isError || message.includes("成功"))) {
            // 创建自定义可爱风格通知元素，替代默认alert
            const notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.top = '50%';
            notification.style.left = '50%';
            notification.style.transform = 'translate(-50%, -50%)';
            notification.style.padding = '18px 22px';
            notification.style.borderRadius = '20px'; // 更大的圆角更可爱
            notification.style.boxShadow = '0 6px 20px rgba(255,182,193,0.25)';
            notification.style.zIndex = '999999';
            notification.style.fontSize = '14px';
            notification.style.fontWeight = 'bold';
            notification.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, -50%) scale(0.9)';
            notification.style.fontFamily = "'Comic Sans MS', 'Arial Rounded MT Bold', '幼圆', sans-serif";
            notification.style.display = 'flex';
            notification.style.alignItems = 'center';
            notification.style.justifyContent = 'center';
            notification.style.minWidth = '200px';
            notification.style.maxWidth = '90%';
            notification.style.textAlign = 'center';
            notification.style.letterSpacing = '0.5px';

            // 装饰角元素
            function createCornerDecorator(emoji, position) {
                const decorator = document.createElement('div');
                decorator.textContent = emoji;
                decorator.style.position = 'absolute';
                decorator.style.fontSize = '16px';
                decorator.style.transform = 'translate(-50%, -50%) scale(0.8)';
                decorator.style.animation = 'float 3s ease-in-out infinite';

                if (position === 'top-left') {
                    decorator.style.top = '0';
                    decorator.style.left = '15px';
                } else if (position === 'bottom-right') {
                    decorator.style.bottom = '0';
                    decorator.style.left = 'auto';
                    decorator.style.right = '15px';
                }

                return decorator;
            }

            // 创建内容容器
            const contentWrapper = document.createElement('div');
            contentWrapper.style.display = 'flex';
            contentWrapper.style.alignItems = 'center';
            contentWrapper.style.gap = '10px';

            // 根据类型设置样式和图标
            let icon, bgColor, textColor, borderColor, decorators;

            if (isError) {
                // 错误消息 - 粉色系
                bgColor = '#ffe6e6'; // 浅粉色背景
                textColor = '#cc5c5c'; // 粉红色文字
                borderColor = '#ffcccc'; // 浅粉边框
                icon = '🌸'; // 花朵图标
                decorators = ['💖', '💖']; // 爱心装饰
            } else {
                // 成功消息 - 鹅黄色系
                bgColor = '#fffacd'; // 浅鹅黄色背景
                textColor = '#a87c39'; // 暖棕色文字
                borderColor = '#ffecb3'; // 浅黄边框
                icon = '✅'; // 完成图标
                decorators = ['🌟', '🌟']; // 星星装饰
            }

            // 设置样式
            notification.style.backgroundColor = bgColor;
            notification.style.color = textColor;
            notification.style.border = `2px dashed ${borderColor}`;

            // 添加图标
            const iconSpan = document.createElement('span');
            iconSpan.textContent = icon;
            iconSpan.style.fontSize = '18px';

            // 添加消息文本
            const textSpan = document.createElement('span');
            textSpan.textContent = message;

            // 组装内容
            contentWrapper.appendChild(iconSpan);
            contentWrapper.appendChild(textSpan);
            notification.appendChild(contentWrapper);

            // 添加角落装饰
            notification.appendChild(createCornerDecorator(decorators[0], 'top-left'));
            notification.appendChild(createCornerDecorator(decorators[1], 'bottom-right'));

            // 添加点击关闭事件
            notification.addEventListener('click', function() {
                notification.style.opacity = '0';
                notification.style.transform = 'translate(-50%, -55%) scale(0.95)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            });

            // 添加到文档
            document.body.appendChild(notification);

            // 显示动画 - 上浮+淡入效果
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translate(-50%, -55%) scale(1.05)'; // 轻微上浮
            }, 10);

            // 自动消失
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translate(-50%, -55%) scale(0.95)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            }, 3000); // 3秒显示时间
        }
    }

    // 实用函数：创建按钮并设置样式 - 小女生可可爱爱风（优化尺寸版）
    function createButton(text, onClick) {
        const button = document.createElement("button");

        // 添加可爱图标前缀
        const iconMap = {
            "复制该篇推文": "💖",
            "粘贴该篇推文": "🌟",
            "插入公众号": "🌸",
            "插入声明": "🍬",
            "插入尾缀": "🍭",
            "清空编辑器": "🍦",
            "更新变量": "🌈"
        };

        const icon = iconMap[text] || "✨";
        button.innerHTML = `${icon} ${text}`;

        // 基础样式 - 糖果风格（调整宽度避免文字换行）
        button.style.color = "#ff6b9d";
        button.style.border = "2px solid #ffb6c1";
        button.style.backgroundColor = "#ffffff";
        button.style.width = "130px"; // 调整宽度适应背景区域
        button.style.margin = "6px auto"; // 减少边距，让按钮更紧凑
        button.style.height = "40px"; // 保持按钮高度不变
        button.style.cursor = "pointer";
        button.style.borderRadius = "25px"; // 适度圆角保持可爱
        button.style.transition = "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        button.style.fontSize = "14px"; // 保持字体大小
        button.style.fontWeight = "bold";
        button.style.whiteSpace = "nowrap"; // 确保文字不换行
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center"; // 整体居中
        button.style.boxShadow = "0 3px 12px rgba(255,107,157,0.2)"; // 保持阴影
        button.style.fontFamily = "'Comic Sans MS', 'Arial Rounded MT Bold', '幼圆', sans-serif";
        button.style.letterSpacing = '0.4px';
        button.style.userSelect = "none";

        // 确保按钮内布局：图标靠左，文字居中，整体居中
        if (button.innerHTML.includes(' ') && !button.innerHTML.includes('<span>')) {
            const parts = button.innerHTML.split(' ');
            if (parts.length >= 2) {
                const icon = parts[0];
                const text = parts.slice(1).join(' ');
                button.innerHTML = `
                    <div style="display: block; position: relative; width: 100%; height: 100%; padding: 0;">
                        <span style="position: absolute; top: 2px; left: 2px; font-size: 20px;">${icon}</span>
                        <span style="display: block; text-align: center; line-height: 38px; white-space: nowrap; margin: 0; padding: 0;">${text}</span>
                    </div>
                `;
            }
        }

        // 重置按钮样式函数
        const resetButtonStyle = function() {
            this.style.color = "#ff6b9d";
            this.style.border = "2px solid #ffb6c1";
            this.style.backgroundColor = "#ffffff";
            this.style.boxShadow = "0 4px 15px rgba(255,107,157,0.2)";
            this.style.transform = "scale(1) translateY(0)";
        };

        // 鼠标悬停效果 - 轻微放大+颜色加深+小心跳
        button.addEventListener("mouseenter", function() {
            this.style.backgroundColor = "#ffb6c1";
            this.style.color = "#ffffff";
            this.style.transform = "scale(1.05) translateY(-2px)";
            this.style.boxShadow = "0 6px 20px rgba(255,107,157,0.4)";

            // 添加小心跳动画
            this.style.animation = "heartbeat 0.6s ease-in-out";
            setTimeout(() => {
                this.style.animation = "";
            }, 600);
        });

        button.addEventListener("mouseleave", function() {
            resetButtonStyle.call(this);
        });

        // 设置按钮事件处理 - 点击时轻微缩小
        button.addEventListener("mousedown", function () {
            this.style.color = "#fff";
            this.style.border = "2px solid #ff6b9d";
            this.style.backgroundColor = "#ff6b9d";
            this.style.transform = "scale(0.98) translateY(0)";
            this.style.boxShadow = "0 3px 10px rgba(255,107,157,0.6)";

            // 延迟执行点击事件，让视觉反馈更明显
            setTimeout(() => {
                onClick();
            }, 50);
        });

        // 鼠标释放时重置样式
        button.addEventListener("mouseup", resetButtonStyle);

        return button;
    }

    // 获取编辑器元素
    function getEditorElement() {
        // 尝试不同的选择器以提高兼容性
        let editor = document.querySelector("#ueditor_0 > div > div > div > div");
        if (!editor) {
            editor = document.querySelector(".ProseMirror");
        }
        return editor;
    }
    // 设置应用容器样式 - 小女生可可爱爱风（优化尺寸版）
    app.style.backgroundColor = "#fff";
    app.style.borderRadius = "20px"; // 适度圆角保持可爱
    app.style.position = "fixed";
    app.style.top = "30%";
    app.style.right = "80px";
    app.style.width = "160px"; // 缩小宽度
    app.style.height = "auto";
    app.style.minHeight = "350px"; // 缩小最小高度
    app.style.padding = "15px"; // 减少内边距
    app.style.boxSizing = "border-box";
    app.style.zIndex = "9999";
    app.style.display = "flex";
    app.style.justifyContent = "center";
    app.style.flexDirection = "column";
    app.style.alignItems = "center";
    app.style.boxShadow = "0 6px 20px rgba(255,107,157,0.2)"; // 调整阴影
    app.style.border = "none"; // 移除边框，保持可爱风格
    app.style.backgroundImage = "linear-gradient(135deg, #fff0f5 0%, #f0f8ff 100%)"; // 保留渐变背景
    app.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"; // 保留过渡动画
    app.style.fontFamily = "'Comic Sans MS', 'Arial Rounded MT Bold', '幼圆', sans-serif"; // 保留圆润字体

    // 添加拖拽功能
    makeDraggable(app);

    // 添加全局CSS动画样式
    function addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 小心跳动画 */
            @keyframes heartbeat {
                0% { transform: scale(1.05) translateY(-2px); }
                25% { transform: scale(1.08) translateY(-2px); }
                50% { transform: scale(1.05) translateY(-2px); }
                75% { transform: scale(1.08) translateY(-2px); }
                100% { transform: scale(1.05) translateY(-2px); }
            }

            /* 小浮动动画 */
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-5px); }
                100% { transform: translateY(0px); }
            }

            /* 卷动展开动画 */
            @keyframes unroll {
                0% { transform: rotateX(80deg) scale(0.95); opacity: 0; }
                60% { transform: rotateX(-5deg) scale(1.01); }
                100% { transform: rotateX(0deg) scale(1); opacity: 1; }
            }

            /* 卷动收起动画 */
            @keyframes rollUp {
                0% { transform: rotateX(0deg) scale(1); opacity: 1; }
                100% { transform: rotateX(80deg) scale(0.95); opacity: 0; }
            }

            /* 为了确保内部元素不会有自己的变换，重置所有子元素的变换 */
            #wechatScriptContent * {
                transform: none !important;
                backface-visibility: hidden;
                transform-style: preserve-3d;
            }

            /* 轻微发光效果 */
            .glow {
                box-shadow: 0 0 15px rgba(255,182,193,0.6);
            }

            /* 禁止文字复制的全局样式 */
            #wechatScript, #wechatScript *, #wechatScriptQuote, #wechatScriptQuote *,
            #wechatScriptContent, #wechatScriptContent *, #wechatScriptQuoteContent,
            #wechatScriptQuoteContent *, .wechatScriptButton {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
                -webkit-touch-callout: none !important;
                -webkit-user-drag: none !important;

                /* 防止复制粘贴的额外措施 */
                pointer-events: auto;
            }

            /* 防止通过右键菜单复制 */
            #wechatScript, #wechatScriptQuote {
                -webkit-context-menu: none !important;
                -moz-context-menu: none !important;
                -ms-context-menu: none !important;
                context-menu: none !important;
            }

            /* 确保应用容器具有平滑的过渡效果 */
            #wechatScript {
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* 按钮悬停效果增强 */
            .wechatScriptButton:hover {
                transition: all 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // 添加全局样式
    addGlobalStyles();

    // 添加收起/展开功能
    makeCollapsible(app);

    // 拖拽功能实现
    function makeDraggable(element) {
        // 添加拖拽句柄 - 可爱蝴蝶结风格（缩小版）
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '100%';
        dragHandle.style.height = '28px'; // 缩小高度
        dragHandle.style.cursor = 'move';
        dragHandle.style.position = 'absolute';
        dragHandle.style.top = '0';
        dragHandle.style.left = '0';
        dragHandle.style.borderTopLeftRadius = '18px';
        dragHandle.style.borderTopRightRadius = '18px';
        dragHandle.style.backgroundColor = '#ffb6c1';
        dragHandle.title = '拖动调整位置 💖';
        dragHandle.style.display = 'flex';
        dragHandle.style.alignItems = 'center';
        dragHandle.style.justifyContent = 'space-between';
        dragHandle.style.padding = '0 12px'; // 减少内边距
        dragHandle.style.boxSizing = 'border-box';
        dragHandle.style.boxShadow = '0 2px 8px rgba(255,107,157,0.3)';
        dragHandle.style.backgroundImage = 'linear-gradient(90deg, #ffb6c1 0%, #ffccd5 100%)';
        dragHandle.style.borderBottom = 'none'; // 移除边框

        // 添加拖拽图标（隐藏但保持布局）
        const dragIcon = document.createElement('div');
        dragIcon.style.display = 'flex';
        dragIcon.style.justifyContent = 'center';
        dragIcon.style.alignItems = 'center';
        dragIcon.innerHTML = '⋮⋮';
        dragIcon.style.color = 'transparent'; // 透明化图标
        dragIcon.style.fontSize = '12px';
        dragIcon.style.visibility = 'hidden'; // 隐藏但保持空间

        // 添加收起/展开按钮
        const toggleButton = document.createElement('button');
        toggleButton.id = 'wechatScriptToggleButton';
        toggleButton.innerHTML = '▲';
        toggleButton.style.width = '20px';
        toggleButton.style.height = '20px';
        toggleButton.style.border = 'none';
        toggleButton.style.backgroundColor = 'transparent';
        toggleButton.style.color = '#909399';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontSize = '12px';
        toggleButton.style.padding = '0';
        toggleButton.style.display = 'flex';
        toggleButton.style.justifyContent = 'center';
        toggleButton.style.alignItems = 'center';
        toggleButton.title = '收起面板';

        // 绑定收起/展开事件
        toggleButton.addEventListener('click', function(e) {
            e.stopPropagation(); // 防止触发拖拽
            if (window.togglePanelCollapse) {
                window.togglePanelCollapse();
            }
        });

        dragHandle.appendChild(dragIcon);
        dragHandle.appendChild(toggleButton);
        element.insertBefore(dragHandle, element.firstChild);

        // 调整内容容器的padding-top以避免内容被拖拽句柄遮挡
        element.style.paddingTop = '28px';

        let isDragging = false;
        let offsetX, offsetY;

        dragHandle.addEventListener('mousedown', function(e) {
            isDragging = true;

            // 计算鼠标相对于元素左上角的偏移量
            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            // 设置拖动时的样式
            element.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
            element.style.transform = 'scale(1.02)';
            element.style.transition = 'none';

            // 防止文本选择
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            // 计算新位置
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;

            // 限制在可视区域内
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;

            const boundedX = Math.max(0, Math.min(newX, maxX));
            const boundedY = Math.max(0, Math.min(newY, maxY));

            // 应用新位置
            element.style.left = boundedX + 'px';
            element.style.top = boundedY + 'px';
            // 清除right属性，避免冲突
            element.style.right = 'auto';
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;

                // 恢复正常样式
                element.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                element.style.transform = 'scale(1)';
                element.style.transition = 'all 0.3s ease';

                // 恢复文本选择
                document.body.style.userSelect = '';

                // 保存位置到localStorage
                localStorage.setItem('wechatScriptPositionX', element.style.left);
                localStorage.setItem('wechatScriptPositionY', element.style.top);
            }
        });
    }

    // 使用实用函数创建按钮
    const copyButton = createButton("复制推文", save);
    const pasteButton = createButton("粘贴推文", paste);
    const insertGzhButton = createButton("插入公众号", insertGongZhongHao);
    const insertDeclarationButton = createButton("插入声明", insertDeclaration);
    const insertSuffixButton = createButton("插入尾缀", insertSuffix);

    // 添加清空编辑器按钮
    const clearEditorButton = createButton("清空编辑器", clearEditor);
    clearEditorButton.style.color = "#f56c6c";
    clearEditorButton.style.borderColor = "#f56c6c";

    // 清空编辑器函数
    function clearEditor() {
        try {
            const editorElement = getEditorElement();
            if (editorElement) {
                // 确认操作
                if (confirm("确定要清空编辑器内容吗？此操作不可撤销。")) {
                    editorElement.innerHTML = '';
                    showNotification("编辑器已清空", false, true);
                }
            } else {
                showNotification("未找到编辑器元素", true);
            }
        } catch (err) {
            showNotification(`清空编辑器失败: ${err.message}`, true);
        }
    }

    function save() {
        try {
            // 获取标题元素
            var titleElement = document.querySelector(".js_title_place.edui-default");
            if (!titleElement) {
                showNotification("未找到标题元素", true);
                return;
            }

            var titleText = titleElement.textContent;

            // 获取描述元素
            var descriptionElement = document.getElementById("js_description");
            if (!descriptionElement) {
                showNotification("未找到描述元素", true);
                return;
            }

            var descriptionText = descriptionElement.value;

            // 获取编辑器内容
            var editorElement = getEditorElement();
            if (!editorElement) {
                showNotification("未找到编辑器元素", true);
                return;
            }

            var editorHTML = editorElement.innerHTML;

            // 准备数据并复制到剪贴板
            var clipboardData = {
                title: titleText,
                content: editorHTML,
                description: descriptionText
            };

            let jsonString = JSON.stringify(clipboardData);

            // 检查剪贴板API支持
            if (!navigator.clipboard || !navigator.clipboard.writeText) {
                showNotification("您的浏览器不支持剪贴板API，请更新浏览器", true);
                return;
            }

            navigator.clipboard.writeText(jsonString)
                .then(() => {
                    showNotification("复制成功");
                })
                .catch(err => {
                    showNotification(`复制失败: ${err.message}`, true);
                });
        } catch (err) {
            showNotification(`保存过程中发生错误: ${err.message}`, true);
        }
    }

    function paste() {
        try {
            // 检查剪贴板API支持
            if (!navigator.clipboard || !navigator.clipboard.readText) {
                showNotification("您的浏览器不支持剪贴板API，请更新浏览器", true);
                return;
            }

            navigator.clipboard.readText()
                .then((result) => {
                    try {
                        // 尝试解析JSON数据
                        var jsonData;

                        // 兼容旧格式（数组）和新格式（对象）
                        const parsedData = JSON.parse(result);
                        if (Array.isArray(parsedData)) {
                            // 旧格式：[title, content, description]
                            jsonData = {
                                title: parsedData[0],
                                content: parsedData[1],
                                description: parsedData[2]
                            };
                        } else {
                            // 新格式：对象
                            jsonData = parsedData;
                        }

                        // 获取并设置编辑器内容
                        var editorElement = getEditorElement();
                        if (editorElement) {
                            editorElement.innerHTML = jsonData.content || '';
                        } else {
                            showNotification("未找到编辑器元素", true);
                        }

                        // 获取并设置标题
                        var titleElement = document.querySelector(".js_title_place.edui-default");
                        if (titleElement) {
                            // 针对contentEditable元素设置内容
                            if (titleElement.isContentEditable) {
                                titleElement.textContent = jsonData.title || '';
                            } else {
                                titleElement.value = jsonData.title || '';
                            }
                        } else {
                            showNotification("未找到标题元素", true);
                        }

                        // 获取并设置描述
                        var descriptionElement = document.getElementById("js_description");
                        if (descriptionElement) {
                            descriptionElement.value = jsonData.description || '';
                        } else {
                            showNotification("未找到描述元素", true);
                        }

                        showNotification("粘贴成功");
                    } catch (parseErr) {
                        showNotification(`剪贴板内容格式错误，无法解析: ${parseErr.message}`, true);
                    }
                })
                .catch(err => {
                    showNotification(`读取剪贴板内容失败: ${err.message}`, true);
                });
        } catch (err) {
            showNotification(`粘贴过程中发生错误: ${err.message}`, true);
        }
    }

    // 通用插入内容函数
    function insertContent(content, contentType) {
        try {
            // 检查内容是否为空
            if (!content || content.trim() === ``) {
                showNotification(`${contentType}内容为空，请在脚本开头设置相应变量`, true);
                return;
            }

            // 获取编辑器元素
            var editorElement = getEditorElement();
            if (!editorElement) {
                showNotification("未找到编辑器元素", true);
                return;
            }

            // 插入内容
            editorElement.innerHTML += content;
            // 插入成功时不再显示弹窗，只在控制台记录日志
            showNotification(`${contentType}插入成功`, false, false);
        } catch (err) {
            // 只有发生错误时才显示弹窗
            showNotification(`${contentType}插入失败: ${err.message}`, true);
        }
    }

    // 插入尾缀
    function insertSuffix() {
        insertContent(suffix, "尾缀");
    }

    // 插入公众号信息
    function insertGongZhongHao() {
        insertContent(gongzhonghao, "公众号信息");
    }

    // 插入声明
    function insertDeclaration() {
        insertContent(declaration, "声明");
    }
    // 添加手动更新按钮，使用特殊颜色标识
    const updateButton = createButton("更新变量", updateVariables);
    updateButton.style.color = "#67c23a";
    updateButton.style.borderColor = "#67c23a";

    // 创建内容容器，用于收起/展开控制
    const contentContainer = document.createElement('div');
    contentContainer.id = 'wechatScriptContent';
    contentContainer.style.display = 'flex';
    contentContainer.style.flexDirection = 'column';
    contentContainer.style.alignItems = 'center';
    contentContainer.style.justifyContent = 'center'; // 确保展开状态下按钮水平居中
    contentContainer.style.width = '100%';
    contentContainer.style.textAlign = 'center'; // 确保整体文本居中
    contentContainer.style.padding = '0 5px'; // 添加少量内边距，避免边缘紧贴
    contentContainer.style.gap = '6px'; // 缩小按钮间距，更紧凑

    // 添加所有元素到内容容器
    contentContainer.appendChild(versionContainer);
    contentContainer.appendChild(copyButton);
    contentContainer.appendChild(pasteButton);
    contentContainer.appendChild(insertGzhButton);
    contentContainer.appendChild(insertDeclarationButton);
    contentContainer.appendChild(insertSuffixButton);
    contentContainer.appendChild(updateButton);
    contentContainer.appendChild(clearEditorButton);

    // 将内容容器添加到应用容器
    app.appendChild(contentContainer);

    // 添加收起/展开功能实现
    function makeCollapsible(element) {
        // 收起/展开功能已经在makeDraggable中通过toggleButton实现
        // 这里可以添加额外的收起相关逻辑
    }

    // 添加到页面
    document.body.appendChild(app);

    // 手动更新变量函数
    function updateVariables() {
        console.log("开始手动更新变量内容...");
        fetchAllVariablesFromNetwork(true).then(() => {
            // 更新成功后记录时间戳
            localStorage.setItem('wechatScriptLastUpdated', new Date().getTime().toString());
            // 更新时间显示
            if (window.updateTimeDisplay) {
                window.updateTimeDisplay();
            }
            showNotification("变量更新成功", false, true);
        }).catch(err => {
            showNotification(`更新失败: ${err.message}`, true, true);
        });
    }

    // 检查是否首次加载或需要更新
    function checkAndInitializeVariables() {
        const isFirstLoad = !localStorage.getItem('wechatScriptFirstLoaded');

        if (isFirstLoad) {
            // 首次加载，获取网络内容并标记
            console.log("首次加载，开始获取变量内容...");
            localStorage.setItem('wechatScriptFirstLoaded', 'true');
            fetchAllVariablesFromNetwork().then(() => {
                localStorage.setItem('wechatScriptLastUpdated', new Date().getTime().toString());
            }).catch(err => {
                console.error("首次获取网络内容失败，使用默认值:", err);
                // 首次加载失败也可以接受，使用默认值
            });
        } else {
            // 非首次加载，尝试从localStorage恢复上次成功获取的值
            const savedSuffix = localStorage.getItem('wechatScriptSuffix');
            const savedGongzhonghao = localStorage.getItem('wechatScriptGongzhonghao');
            const savedDeclaration = localStorage.getItem('wechatScriptDeclaration');

            if (savedSuffix) suffix = savedSuffix;
            if (savedGongzhonghao) gongzhonghao = savedGongzhonghao;
            if (savedDeclaration) declaration = savedDeclaration;

            const lastUpdated = localStorage.getItem('wechatScriptLastUpdated');
            if (lastUpdated) {
                console.log(`已从本地恢复变量，上次更新时间: ${new Date(parseInt(lastUpdated)).toLocaleString()}`);
            } else {
                console.log("已从本地恢复变量，但没有更新时间记录");
            }
        }
    }

    // 页面加载完成后的初始化
    console.log("微信推文克隆工具已加载，版本: " + version);

    // 检查并初始化变量（只在首次加载时自动获取网络内容）
    checkAndInitializeVariables();

    // 从localStorage恢复面板位置
    const savedX = localStorage.getItem('wechatScriptPositionX');
    const savedY = localStorage.getItem('wechatScriptPositionY');
    if (savedX && savedY) {
        app.style.left = savedX;
        app.style.top = savedY;
        app.style.right = 'auto';
    }

    // 从localStorage恢复面板收起状态
    const isCollapsed = localStorage.getItem('wechatScriptIsCollapsed') === 'true';
    if (isCollapsed && window.togglePanelCollapse) {
        // 延迟执行以确保DOM已完全加载，从而正确显示励志语句
        setTimeout(() => window.togglePanelCollapse(true), 100);
    }

    // 扩展fetchAllVariablesFromNetwork函数，添加是否强制更新的参数和本地存储功能
    const originalFetchAllVariablesFromNetwork = fetchAllVariablesFromNetwork;
    fetchAllVariablesFromNetwork = async function(forceUpdate = false) {
        try {
            const result = await originalFetchAllVariablesFromNetwork();

            // 保存成功获取的变量到localStorage
            if (result.suffix) {
                localStorage.setItem('wechatScriptSuffix', result.suffix);
                suffix = result.suffix;
            }
            if (result.gongzhonghao) {
                localStorage.setItem('wechatScriptGongzhonghao', result.gongzhonghao);
                gongzhonghao = result.gongzhonghao;
            }
            if (result.declaration) {
                localStorage.setItem('wechatScriptDeclaration', result.declaration);
                declaration = result.declaration;
            }

            console.log("变量内容更新成功并已保存到本地");
            return result;
        } catch (error) {
            // 非错误信息，避免过多弹窗
            console.error("获取网络内容失败:", error);
            throw error;
        }
    };
})();
