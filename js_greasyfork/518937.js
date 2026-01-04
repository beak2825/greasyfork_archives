// ==UserScript==
// @name         宜宾智慧校园助手
// @namespace    智慧校园，解决宜宾学院智慧校园的题目，能够自动获取宜宾学院的智慧校园的作业的答案===来自计算机科学与技术学院--修改自若离智慧校园
// @version      12.22
// @description  智慧校园，解决宜宾学院智慧校园的题目，能够自动获取宜宾学院的智慧校园的作业的答案，能够跳过秒看教学视频，自动阅读文档
// @author       计算机科学与技术学院---软工
// @match        https://mooc.yibinu.edu.cn/*
// @icon         https://pic.imgdb.cn/item/673c85b1d29ded1a8ce8b97c.png
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/2.6.14/vue.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/ant-design-vue/1.7.8/antd.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/xlsx/0.18.5/xlsx.full.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js
// @resource     ANTD_CSS https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/ant-design-vue/1.7.8/antd.min.css
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/518937/%E5%AE%9C%E5%AE%BE%E6%99%BA%E6%85%A7%E6%A0%A1%E5%9B%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/518937/%E5%AE%9C%E5%AE%BE%E6%99%BA%E6%85%A7%E6%A0%A1%E5%9B%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 脚本设置对象
const setting = {
    logs: [
        '初始化脚本完成,',
        '当前脚本版本：V12.22',
        '由于国内无法访问greasyfork.org，可以进入 https://gf.qytechs.cn/zh-CN 和https://home.greasyfork.org.cn/ （版本更新较慢）下载更新脚本'
    ], // 日志数据
    datas: [], // 答案数据
    secretKey: '你好', // 默认密钥
    _vt: '274c8b3f2a8c63ffc960dd1e4e3f0eac',
    // 答题设置 - 默认值
    autoSubmit: false,  // 默认不自动提交答案
    autoEnterExam: true, // 默认自动进入考试
    // 学习进度
    learningProgress: {
        isLearning: false,
        currentChapter: null,
        currentContent: null,
        timestamp: null
    },
    // 初始化设置
    init() {
        // 尝试从localStorage加载设置
        try {
            const savedConfig = localStorage.getItem('examConfig');
            if (savedConfig) {
                const config = JSON.parse(savedConfig);
                this.autoSubmit = config.autoSubmit !== undefined ? config.autoSubmit : false;
                this.autoEnterExam = config.autoEnterExam !== undefined ? config.autoEnterExam : true;
            }
        } catch (e) {
            console.error('加载答题配置失败:', e);
            // 使用默认值
            this.autoSubmit = false;
            this.autoEnterExam = true;
        }
    }
};

// 初始化设置
setting.init();

// 资源加载管理器
const ResourceLoader = {
    resources: {
        styles: [
            {
                name: 'ANTD_CSS',
                type: 'resource'
            }
        ],
        scripts: [
            {
                name: 'vue',
                url: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/2.6.14/vue.min.js'
            },
            {
                name: 'antd',
                url: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/ant-design-vue/1.7.8/antd.min.js'
            },
            {
                name: 'xlsx',
                url: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/xlsx/0.18.5/xlsx.full.min.js'
            },
            {
                name: 'crypto-js',
                url: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js'
            }
        ]
    },

    // 资源加载状态
    loadStatus: new Map(),

    // 初始化加载
    async init() {
        try {
            // 先加载样式资源
            await this.loadStyles();
            // 再加载脚本资源
            await this.loadScripts();

            console.log('所有资源加载完成');
            return true;
        } catch (error) {
            console.error('资源加载失败:', error);
            return false;
        }
    },

    // 加载样式资源
    async loadStyles() {
        for (const style of this.resources.styles) {
            try {
                if (style.type === 'resource') {
                    // 使用GM_getResourceText加载资源
                    const cssContent = GM_getResourceText(style.name);
                    if (cssContent) {
                        GM_addStyle(cssContent);
                        this.loadStatus.set(style.name, true);
                        console.log(`样式资源 ${style.name} 加载成功`);
                    } else {
                        throw new Error(`无法获取样式资源 ${style.name}`);
                    }
                } else {
                    // 直接通过URL加载
                    await this.loadStyle(style.name, style.url);
                }
            } catch (error) {
                console.error(`加载样式 ${style.name} 失败:`, error);
                this.loadStatus.set(style.name, false);
            }
        }
    },

    // 加载脚本资源
    async loadScripts() {
        const promises = this.resources.scripts.map(script =>
            this.loadScript(script.name, script.url)
        );
        return Promise.all(promises);
    },

    // 加载单个样式
    loadStyle(name, url) {
        return new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;

                link.onload = () => {
                    this.loadStatus.set(name, true);
                console.log(`样式 ${name} 加载成功`);
                    resolve();
                };

            link.onerror = (error) => {
                console.error(`样式 ${name} 加载失败:`, error);
                    this.loadStatus.set(name, false);
                    reject(new Error(`样式 ${name} 加载失败`));
                };

                document.head.appendChild(link);
        });
    },

    // 加载单个脚本
    loadScript(name, url) {
        return new Promise((resolve, reject) => {
            // 检查是否已加载
            if (window[name]) {
                this.loadStatus.set(name, true);
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = url;
            script.async = true;

            script.onload = () => {
                this.loadStatus.set(name, true);
                console.log(`脚本 ${name} 加载成功`);
                resolve();
            };

            script.onerror = () => {
                // 加载失败时尝试备用CDN
                const backupUrl = this.getBackupUrl(url);
                if (backupUrl) {
                    script.src = backupUrl;
                    console.log(`尝试使用备用CDN加载 ${name}`);
                } else {
                    this.loadStatus.set(name, false);
                    console.error(`脚本 ${name} 加载失败`);
                    reject(new Error(`脚本 ${name} 加载失败`));
                }
            };

            document.head.appendChild(script);
        });
    },

    // 获取备用CDN地址
    getBackupUrl(url) {
        const cdnMap = {
            'lf26-cdn-tos.bytecdntp.com': 'cdn.jsdelivr.net/npm',
            'cdn.jsdelivr.net': 'cdnjs.cloudflare.com/ajax/libs',
            'cdnjs.cloudflare.com': 'unpkg.com'
        };

        for (const [current, backup] of Object.entries(cdnMap)) {
            if (url.includes(current)) {
                return url.replace(current, backup);
            }
        }
        return null;
    },

    // 检查资源是否都已加载
    checkAllLoaded() {
        return Array.from(this.loadStatus.values()).every(status => status);
    },

    // 获取加载失败的资源
    getFailedResources() {
        return Array.from(this.loadStatus.entries())
            .filter(([, status]) => !status)
            .map(([name]) => name);
    }
};

// 浏览器兼容性检查和处理
const BrowserCompatibility = {
    // 必需的特性列表
    requiredFeatures: {
        localStorage: {
            name: 'localStorage',
            test: () => typeof localStorage !== 'undefined',
            fallback: this.createMemoryStorage
        },
        promise: {
            name: 'Promise',
            test: () => typeof Promise !== 'undefined',
            fallback: () => this.loadPolyfill('promise-polyfill')
        },
        fetch: {
            name: 'fetch',
            test: () => typeof fetch !== 'undefined',
            fallback: () => this.loadPolyfill('whatwg-fetch')
        },
        customElements: {
            name: 'Custom Elements',
            test: () => 'customElements' in window,
            fallback: () => this.loadPolyfill('@webcomponents/custom-elements')
        }
    },

    // 浏览器信息
    browserInfo: {
        name: '',
        version: '',
        isSupported: false
    },

    // 初始化
    async init() {
        this.detectBrowser();
        const compatibility = await this.checkCompatibility();

        if (!compatibility.isCompatible) {
            this.showCompatibilityWarning(compatibility.unsupportedFeatures);
            await this.loadFallbacks(compatibility.unsupportedFeatures);
        }

        return compatibility.isCompatible;
    },

    // 检测浏览器信息
    detectBrowser() {
        const userAgent = navigator.userAgent;
        let browserName = "未知浏览器";
        let browserVersion = "未知版本";

        // 检测主流浏览器
        if (userAgent.indexOf("Chrome") > -1) {
            browserName = "Chrome";
            browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)[1];
        } else if (userAgent.indexOf("Firefox") > -1) {
            browserName = "Firefox";
            browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)[1];
        } else if (userAgent.indexOf("Safari") > -1) {
            browserName = "Safari";
            browserVersion = userAgent.match(/Version\/([0-9.]+)/)[1];
        } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
            browserName = "Internet Explorer";
            browserVersion = userAgent.match(/(?:MSIE |rv:)([0-9.]+)/)[1];
        }

        this.browserInfo = {
            name: browserName,
            version: browserVersion,
            isSupported: this.checkBrowserSupport(browserName, browserVersion)
        };
    },

    // 检查浏览器是否支持
    checkBrowserSupport(name, version) {
        const minVersions = {
            'Chrome': 49,
            'Firefox': 45,
            'Safari': 10,
            'Internet Explorer': 11
        };

        const majorVersion = parseInt(version.split('.')[0]);
        return majorVersion >= (minVersions[name] || 0);
    },

    // 检查特性兼容性
    async checkCompatibility() {
        const unsupportedFeatures = [];

        for (const [feature, {test}] of Object.entries(this.requiredFeatures)) {
            if (!test()) {
                unsupportedFeatures.push(feature);
            }
        }

        return {
            isCompatible: unsupportedFeatures.length === 0,
            unsupportedFeatures
        };
    },

    // 加载polyfill
    async loadPolyfill(packageName) {
        const polyfillUrl = `https://cdn.jsdelivr.net/npm/${packageName}`;
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = polyfillUrl;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    // 创建内存存储的fallback
    createMemoryStorage() {
        const storage = {};
        return {
            setItem: (key, value) => storage[key] = value,
            getItem: (key) => storage[key],
            removeItem: (key) => delete storage[key],
            clear: () => Object.keys(storage).forEach(key => delete storage[key])
        };
    },

    // 加载所有需要的fallback
    async loadFallbacks(unsupportedFeatures) {
        const fallbackPromises = unsupportedFeatures.map(feature => {
            const {fallback} = this.requiredFeatures[feature];
            return fallback();
        });

        try {
            await Promise.all(fallbackPromises);
            console.log('所有fallback加载完成');
        } catch (error) {
            console.error('加载fallback失败:', error);
        }
    },

    // 显示兼容性警告
    showCompatibilityWarning(unsupportedFeatures) {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #fff3cd;
            color: #856404;
            padding: 12px;
            text-align: center;
            z-index: 9999;
            border-bottom: 1px solid #ffeeba;
        `;

        warning.innerHTML = `
            <strong>浏览器兼容性警告</strong><br>
            您的浏览器 (${this.browserInfo.name} ${this.browserInfo.version}) 可能不完全支持本脚本的所有功能。<br>
            建议使用最新版本的Chrome、Firefox或Safari浏览器。
        `;

        document.body.appendChild(warning);
    }
};

// 在脚本初始化时使用
async function initScript() {
    try {
        // 检查浏览器兼容性
        await BrowserCompatibility.init();

        // 加载资源
        await ResourceLoader.init();

        // 如果所有检查都通过，继续初始化脚本
        if (BrowserCompatibility.browserInfo.isSupported && ResourceLoader.checkAllLoaded()) {
            initView();
            // 初始化全局静音功能
            setTimeout(() => {
                initGlobalMute();
            }, 1000); // 延迟1秒执行，确保页面已完全加载
        } else {
            console.error('脚本初始化失败：', {
                browser: BrowserCompatibility.browserInfo,
                failedResources: ResourceLoader.getFailedResources()
            });
        }
    } catch (error) {
        console.error('脚本初始化错误：', error);
    }
}

// 启动脚本
initScript();

// 时间值
function decryptValidDuration() {
    try {
        const validDurations = {

            'c51ce410c124a10e0db5e4b97fc2af39': 86400000,

            '274c8b3f2a8c63ffc960dd1e4e3f0eac': 172800000,

            'e2ef524fbf3d9fe611d5a8e90fefdc9c': 259200000,

            '069059b7ef840f0c74a814ec9237b6ec': 432000000,

            '7f6ffaa6bb0b408017b62254211691b5': 604800000,

            '149e9677a5989fd342ae44213df68868': 2592000000
        };

        return validDurations[setting._vt] || 172800000; // 默认返回2天
    } catch (e) {
        console.error('解密时间值出错：', e);
        return 172800000; // 解密出错时返回默认值（2天）
    }
}

// 简化的验证时间管理
function setValidTime() {
    try {
        const validDuration = decryptValidDuration();
        const validUntil = Date.now() + validDuration;
        const data = {
            time: validUntil,
            hash: CryptoJS.SHA256(validUntil.toString()).toString()
        };
        localStorage.setItem('scriptValidUntil', JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('设置验证时间出错：', e);
        return false;
    }
}

// 检查验证时间
function checkValidTime() {
    try {
        const data = localStorage.getItem('scriptValidUntil');
        if (!data) return false;

        const { time, hash } = JSON.parse(data);
        const now = Date.now();

        // 验证时间和哈希
        if (time && hash &&
            hash === CryptoJS.SHA256(time.toString()).toString() &&
            time > now) {
            return true;
        }

        localStorage.removeItem('scriptValidUntil');
        return false;
    } catch (e) {
        console.error('检查验证时间出错：', e);
        localStorage.removeItem('scriptValidUntil');
        return false;
    }
}

// 将验证函数定义为全局函数
window.verifySecret = function() {
    const input = document.getElementById('secretInput');
    if (!input) {
        console.error('找不到输入框元素');
        return;
    }

    const inputValue = input.value.trim();
    if (!inputValue) {
        input.style.borderColor = '#ff4d4f';
        input.style.animation = 'shake 0.5s';
        setTimeout(() => {
            input.style.borderColor = '#e8e8e8';
            input.style.animation = '';
        }, 1000);
        return;
    }

    if (inputValue !== setting.secretKey) {
        const modalDiv = document.querySelector('#secretModal > div');
        if (modalDiv) {
            modalDiv.style.animation = 'shake 0.5s';
            input.style.borderColor = '#ff4d4f';
            setTimeout(() => {
                modalDiv.style.animation = '';
                input.style.borderColor = '#e8e8e8';
            }, 1000);
        }
        return;
    }

    try {
        // 设置验证时间
        if (!setValidTime()) {
            throw new Error('设置验证时间失败');
        }

        // 添加关闭动画
        const modal = document.getElementById('secretModal');
        if (modal) {
            modal.style.animation = 'modalFadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();

                // 在验证成功后显示答题设置窗口
                setTimeout(() => {
                    // 创建答题设置窗口，传递true表示是首次使用
                    createInitialSettingsModal(true);
                }, 300);

                // 添加成功提示
                if (window.vue) {
                    window.vue.$message.success('验证成功！请先进行答题设置');
                }
            }, 300);
        }
    } catch (error) {
        console.error('验证过程出错：', error);
        if (window.vue) {
            window.vue.$message.error('验证过程出错，请刷新页面重试');
        }
    }
};

// 添加一个新的首次设置窗口函数
function createInitialSettingsModal(isFirstTime = true) {
    // 清除可能存在的旧模态框
    const oldModal = document.getElementById('settingsModal');
    if (oldModal) {
        document.body.removeChild(oldModal);
    }

    // 创建模态框容器
    const modalDiv = document.createElement('div');
    modalDiv.id = 'settingsModal';
    modalDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
    `;

    // 创建模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        width: 500px;
        max-width: 90%;
        position: relative;
    `;

    // 标题
    const modalHeader = document.createElement('div');
    modalHeader.style.cssText = `
        padding: 16px 24px;
        color: rgba(0, 0, 0, 0.85);
        background: #fff;
        border-bottom: 1px solid #f0f0f0;
        border-radius: 4px 4px 0 0;
        font-weight: 500;
        font-size: 18px;
    `;
    modalHeader.innerText = isFirstTime ? "首次使用 - 答题设置" : "答题设置";
    modalContent.appendChild(modalHeader);

    // 内容区域
    const modalBody = document.createElement('div');
    modalBody.style.cssText = `
        padding: 24px;
        font-size: 14px;
        line-height: 1.6;
        word-wrap: break-word;
    `;

    // 添加说明文字 (只在首次使用时显示)
    if (isFirstTime) {
        const description = document.createElement('div');
        description.style.cssText = `
            margin-bottom: 20px;
            padding: 12px;
            background-color: #f9f9f9;
            border-left: 4px solid #1890ff;
            border-radius: 2px;
        `;
        description.innerHTML = `
            <p>欢迎使用宜宾智慧校园助手！请先设置答题偏好，以下设置可稍后随时更改。</p>
        `;
        modalBody.appendChild(description);
    }

    // 创建设置项
    const autoSubmitDiv = document.createElement('div');
    autoSubmitDiv.style.cssText = `
        margin-bottom: 20px;
        padding: 15px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        background-color: #fafafa;
    `;

    const autoSubmitCheckbox = document.createElement('input');
    autoSubmitCheckbox.type = 'checkbox';
    autoSubmitCheckbox.id = 'autoSubmitSetting';
    autoSubmitCheckbox.checked = setting.autoSubmit;
    autoSubmitCheckbox.style.cssText = `
        margin-right: 8px;
        margin-top: 3px;
        transform: scale(1.2);
    `;

    const autoSubmitLabel = document.createElement('label');
    autoSubmitLabel.htmlFor = 'autoSubmitSetting';
    autoSubmitLabel.style.fontWeight = 'bold';
    autoSubmitLabel.innerHTML = `
        自动提交答案
        <div style="font-weight: normal; font-size: 13px; color: #666; margin-top: 8px; line-height: 1.5;">
            <p>启用后，脚本将在完成所有题目作答后<b>自动提交</b>答卷并处理确认对话框。</p>
            <p>关闭后，脚本会填写答案但<b>不会自动提交</b>，让您有机会检查答案后手动提交。</p>
            <p>推荐设置：关闭 <span style="color: #ff4d4f;">(默认已关闭)</span></p>
        </div>
    `;

    autoSubmitDiv.appendChild(autoSubmitCheckbox);
    autoSubmitDiv.appendChild(autoSubmitLabel);
    modalBody.appendChild(autoSubmitDiv);

    // 自动进入考试设置
    const autoEnterExamDiv = document.createElement('div');
    autoEnterExamDiv.style.cssText = `
        margin-bottom: 16px;
        padding: 15px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        background-color: #fafafa;
    `;

    const autoEnterExamCheckbox = document.createElement('input');
    autoEnterExamCheckbox.type = 'checkbox';
    autoEnterExamCheckbox.id = 'autoEnterExamSetting';
    autoEnterExamCheckbox.checked = setting.autoEnterExam;
    autoEnterExamCheckbox.style.cssText = `
        margin-right: 8px;
        margin-top: 3px;
        transform: scale(1.2);
    `;

    const autoEnterExamLabel = document.createElement('label');
    autoEnterExamLabel.htmlFor = 'autoEnterExamSetting';
    autoEnterExamLabel.style.fontWeight = 'bold';
    autoEnterExamLabel.innerHTML = `
        自动进入考试
        <div style="font-weight: normal; font-size: 13px; color: #666; margin-top: 8px; line-height: 1.5;">
            <p>启用后，脚本将自动点击"开始考试"或"继续答题"按钮，节省操作步骤。</p>
            <p>关闭后，需要手动点击按钮进入考试页面。</p>
            <p>推荐设置：开启 <span style="color: #52c41a;">(默认已开启)</span></p>
        </div>
    `;

    autoEnterExamDiv.appendChild(autoEnterExamCheckbox);
    autoEnterExamDiv.appendChild(autoEnterExamLabel);
    modalBody.appendChild(autoEnterExamDiv);

    modalContent.appendChild(modalBody);

    // 底部按钮
    const modalFooter = document.createElement('div');
    modalFooter.style.cssText = `
        padding: 10px 16px;
        text-align: right;
        background: transparent;
        border-top: 1px solid #f0f0f0;
        border-radius: 0 0 4px 4px;
    `;

    // 添加取消按钮(非首次使用时显示)
    if (!isFirstTime) {
        const cancelButton = document.createElement('button');
        cancelButton.className = 'ant-btn';
        cancelButton.style.cssText = `
            line-height: 1.5;
            display: inline-block;
            font-weight: 400;
            text-align: center;
            cursor: pointer;
            background-image: none;
            border: 1px solid #d9d9d9;
            white-space: nowrap;
            padding: 0 15px;
            font-size: 14px;
            border-radius: 4px;
            height: 32px;
            user-select: none;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            position: relative;
            color: rgba(0, 0, 0, 0.65);
            background-color: #fff;
            margin-right: 8px;
        `;
        cancelButton.innerText = "取消";
        cancelButton.onclick = function() {
            document.body.removeChild(modalDiv);
        };
        modalFooter.appendChild(cancelButton);
    }

    // 确定按钮
    const okButton = document.createElement('button');
    okButton.className = 'ant-btn ant-btn-primary';
    okButton.style.cssText = `
        line-height: 1.5;
        display: inline-block;
        font-weight: 400;
        text-align: center;
        cursor: pointer;
        background-image: none;
        border: 1px solid #1890ff;
        white-space: nowrap;
        padding: 0 15px;
        font-size: 14px;
        border-radius: 4px;
        height: 32px;
        user-select: none;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        position: relative;
        color: #fff;
        background-color: #1890ff;
    `;
    okButton.innerText = isFirstTime ? "确认并开始使用" : "保存设置";
    okButton.onclick = () => {
        try {
            // 获取设置值
            const autoSubmit = document.getElementById('autoSubmitSetting').checked;
            const autoEnterExam = document.getElementById('autoEnterExamSetting').checked;

            // 保存设置
            setting.autoSubmit = autoSubmit;
            setting.autoEnterExam = autoEnterExam;

            // 保存到localStorage
            localStorage.setItem('examConfig', JSON.stringify({
                autoSubmit,
                autoEnterExam
            }));

            // 首次使用时初始化脚本，否则显示成功提示
            if (isFirstTime) {
                // 继续初始化
                continueInit();

                // 成功提示
                if(window.vue) {
                    window.vue.$message.success('设置已保存，开始使用智慧校园助手');
                    log('首次设置已完成');
                }
            } else {
                // 正常使用时的提示
                if(window.vue) {
                    window.vue.$message.success('设置已保存');
                    log('已更新答题设置');
                }
            }

            // 关闭模态框
            document.body.removeChild(modalDiv);
        } catch (error) {
            console.error('保存设置出错:', error);
            // 出错提示
            if(window.vue) {
                window.vue.$message.error('保存失败，请刷新页面重试');
            }
            // 首次使用时，即使出错也继续初始化，使用默认设置
            if (isFirstTime) {
                continueInit();
            }
        }
    };

    modalFooter.appendChild(okButton);
    modalContent.appendChild(modalFooter);

    // 点击背景关闭模态框(非首次使用时才允许)
    if (!isFirstTime) {
        modalDiv.onclick = function(event) {
            if (event.target === modalDiv) {
                document.body.removeChild(modalDiv);
            }
        };
    }

    // 添加到body
    modalDiv.appendChild(modalContent);
    document.body.appendChild(modalDiv);

    // 添加动画效果
    modalContent.animate([
        { opacity: 0, transform: 'translateY(-20px)' },
        { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 300, easing: 'ease-out' });
}

// 添加键盘事件监听器的函数
function addKeyboardListener() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const secretInput = document.getElementById('secretInput');
            if (secretInput && document.activeElement === secretInput) {
                verifySecret();
            }
        }
    });
}

// 日志
function log(logText){
    // 限制日志数量，防止内存占用过大
    if (setting.logs.length > 100) {
        setting.logs = setting.logs.slice(0, 50);
    }

    setting.logs.unshift(logText);

    // 使用Vue的响应式更新机制
    if (window.vue) {
        window.vue.logs = [...setting.logs];
    }
}

// 添加一个清理HTML标签的函数
function cleanHtmlTags(text) {
    if (!text) return '';

    // 将HTML转换为纯文本
    let temp = document.createElement('div');
    temp.innerHTML = text;
    let cleanText = temp.textContent || temp.innerText;

    // 清理多余的空白字符
    cleanText = cleanText.replace(/\s+/g, ' ').trim();

    return cleanText;
}

// 从后台获取答案
function getAnswer(url, data){
    log('获取答案中');
    let id = url.match(/\/examSubmit\/(\d+)\/getExamPaper/)[1];
    GM_xmlhttpRequest({
        method: "post",
        url: url,
        data: data,
        dataType: 'json',
        headers: {
            'Origin': location.origin,
            'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Referer': `https://mooc.yibinu.edu.cn/examTest/stuExamList/${id}.mooc`
        },
        onload: function(res){
            if(res.status == 200){
                try {
                    let response = JSON.parse(res.responseText);
                    if (response && response.paper && response.paper.paperStruct) {
                        log("获取答案成功，正在格式化答案！");
                        formatAnswer(response.paper.paperStruct);
                    } else {
                        log("答案数据格式异常：" + JSON.stringify(response));
                        if (window.vue) {
                            window.vue.hasAnswer = false;
                        }
                    }
                } catch (error) {
                    log("解析答案数据失败：" + error.message);
                    if (window.vue) {
                        window.vue.hasAnswer = false;
                    }
                }
            } else {
                log("获取答案失败，状态码：" + res.status);
            }
        },
        onerror: function(error) {
            log("求答案失败：" + error.message);
        }
    });
}
//格式化答案
function formatAnswer(str) {
    try {
        setting.datas = []; // 清空之前的数据
        if (!Array.isArray(str)) {
            log("答案数据格式错误：期望数组类型");
            if (window.vue) {
                window.vue.hasAnswer = false;
            }
            return;
        }

        str.forEach((listItem, index) => {
            if (!listItem.quiz) {
                return;
            }

            // 使用cleanHtmlTags清理题目内容
            var question = cleanHtmlTags(listItem.quiz.quizContent) || "未知题目";
            var options = {};
            var optionContents = {};  // 存储选项内容
            var answer = [];
            const questionNum = (index + 1).toString();

            // 处理选择题
            if (listItem.quiz.quizOptionses && listItem.quiz.quizOptionses.length > 0) {
                listItem.quiz.quizOptionses.forEach((optionItem, idx) => {
                    if (optionItem && optionItem.optionId !== undefined) {
                        const optionLabel = String.fromCharCode(65 + idx);
                        options[optionItem.optionId] = optionLabel;
                        optionContents[optionItem.optionId] = optionItem.optionContent || '';
                    }
                });

                // 处理答案
                if (listItem.quiz.quizResponses) {
                    listItem.quiz.quizResponses.forEach(answerItem => {
                        if (answerItem && options[answerItem.optionId]) {
                            const label = options[answerItem.optionId];
                            const content = optionContents[answerItem.optionId];
                            answer.push(`${label}.${content}`);
                        }
                    });
                }

                // 并序号和选项标签
                const answerLabels = listItem.quiz.quizResponses
                    .map(item => options[item.optionId])
                    .join('');
                const idAndOptions = `${questionNum}.${answerLabels}`;

                setting.datas.push({
                    'key': index.toString(),
                    'idAndOptions': idAndOptions,
                    'question': question,
                    'answer': answer.join('\n'),  // 每个选项答案换行显示
                    'originalIndex': index // 保存原始索引，用于后续排序
                });
            } else {
                // 处理填空题
                if (listItem.quiz.quizResponses) {
                    const fillAnswers = [];
                    listItem.quiz.quizResponses.forEach(answerItem => {
                        if (answerItem && answerItem.responseContent) {
                            fillAnswers.push(answerItem.responseContent);
                        }
                    });

                    setting.datas.push({
                        'key': index.toString(),
                        'idAndOptions': `${questionNum}.(填空)`,
                        'question': question,
                        'answer': fillAnswers.join('\n'),  // 多个填空答案换行显示
                        'originalIndex': index // 保存原始索引，用于后续排序
                    });
                }
            }
        });

        // 提取题目编号信息（如果有）
        setting.datas.forEach(item => {
            // 尝试从题目中提取编号
            const numberMatch = item.question.match(/^(\d+)[、.．]\s*/);
            if (numberMatch) {
                item.questionNumber = numberMatch[1];
                // 存储不带编号的题目文本，用于后续匹配
                item.cleanQuestion = item.question.replace(/^\d+[、.．]\s*/, '').trim();
            } else {
                item.cleanQuestion = item.question;
            }
        });

        // 获取当前页面上的题目顺序
        const pageQuestions = [];
        const questionContainers = document.querySelectorAll('.view-test');
        if (questionContainers && questionContainers.length > 0) {
            questionContainers.forEach((container, idx) => {
                const textElement = container.querySelector('.test-text-tutami');
                if (textElement) {
                    const questionText = textElement.textContent.trim();
                    pageQuestions.push({
                        index: idx,
                        text: questionText
                    });
                }
            });

            log(`页面上找到 ${pageQuestions.length} 道题目，准备排序答案列表`);

            // 如果页面上有题目，则根据页面题目顺序排序答案列表
            if (pageQuestions.length > 0) {
                const sortedDatas = [];
                const usedAnswerIndices = new Set();

                // 第一轮：尝试为每个页面题目找到最匹配的答案
                pageQuestions.forEach((pageQuestion, pageIdx) => {
                    let bestMatchIndex = -1;
                    let bestMatchScore = 0;

                    // 遍历所有答案，找到最匹配的
                    setting.datas.forEach((answerData, answerIdx) => {
                        if (usedAnswerIndices.has(answerIdx)) return; // 跳过已使用的答案

                        const cleanPageQuestion = cleanHtmlTags(pageQuestion.text);
                        const cleanAnswerQuestion = answerData.cleanQuestion;

                        // 计算匹配分数
                        let matchScore = 0;
                        if (cleanPageQuestion.includes(cleanAnswerQuestion) ||
                            cleanAnswerQuestion.includes(cleanPageQuestion)) {
                            matchScore = Math.min(cleanPageQuestion.length, cleanAnswerQuestion.length) /
                                        Math.max(cleanPageQuestion.length, cleanAnswerQuestion.length);
                        }

                        // 如果是更好的匹配，则更新
                        if (matchScore > bestMatchScore) {
                            bestMatchScore = matchScore;
                            bestMatchIndex = answerIdx;
                        }
                    });

                    // 如果找到匹配，则添加到排序后的列表
                    if (bestMatchIndex !== -1 && bestMatchScore > 0.5) { // 设置一个阈值，确保匹配质量
                        sortedDatas.push(setting.datas[bestMatchIndex]);
                        usedAnswerIndices.add(bestMatchIndex);
                    }
                });

                // 第二轮：添加未匹配的答案到列表末尾
                setting.datas.forEach((answerData, idx) => {
                    if (!usedAnswerIndices.has(idx)) {
                        sortedDatas.push(answerData);
                    }
                });

                // 如果成功排序，则更新数据
                if (sortedDatas.length > 0) {
                    setting.datas = sortedDatas;
                    log(`答案列表已按当前题目顺序排序`);
                }
            }
        }

        // 更新 Vue 实例中的数据
        if (window.vue && setting.datas.length > 0) {
            // 更新idAndOptions以反映新的顺序
            setting.datas.forEach((item, idx) => {
                const questionNum = (idx + 1).toString();
                // 提取原始idAndOptions中的选项部分
                const optionsPart = item.idAndOptions.split('.').slice(1).join('.');
                item.idAndOptions = `${questionNum}.${optionsPart}`;
                item.key = idx.toString(); // 更新key以匹配新顺序
            });

            window.vue.answerList = [...setting.datas];
            window.vue.hasAnswer = true; // 设置答案获取状态为 true
        }

        log(`成功处理 ${setting.datas.length} 道题目`);
        log('答案获取完成，可以切换到答案列表查看');
    } catch (error) {
        log("格式化答案时出错：" + error.message);
        if (window.vue) {
            window.vue.hasAnswer = false;
        }
    }
}
//初始化界面
function initView(){
    // 检查验证是否有效
    if (checkValidTime()) {
        // 验证仍然有效，直接继续初始化
        continueInit();
        return;
    }

    // 创建验证界面的HTML
    const createModal = () => {
        const modalHtml = `
            <div id="secretModal" style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                    width: 320px;
                    text-align: center;
                    animation: modalFadeIn 0.3s ease;
                ">
                    <img src="https://pic.imgdb.cn/item/673c85b1d29ded1a8ce8b97c.png" style="
                        width: 64px;
                        height: 64px;
                        margin-bottom: 15px;
                    ">
                    <h2 style="
                        margin: 0 0 20px 0;
                        color: #333;
                        font-size: 20px;
                        font-weight: 500;
                    ">请输入暗号---你好</h2>
                    <input type="text" id="secretInput" style="
                        width: 100%;
                        padding: 12px;
                        margin-bottom: 15px;
                        border: 2px solid #e8e8e8;
                        border-radius: 8px;
                        font-size: 16px;
                        outline: none;
                        transition: all 0.3s;
                        box-sizing: border-box;
                    " placeholder="请输入暗号...">
                    <button id="verifyButton" style="
                        width: 100%;
                        padding: 12px;
                        border: none;
                        background-color: #1890ff;
                        color: white;
                        border-radius: 8px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.3s;
                        box-sizing: border-box;
                    ">验证</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // 添加事件监听器
        const button = document.getElementById('verifyButton');
        if (button) {
            button.addEventListener('click', window.verifySecret);
        }

        // 添加键盘事件监听
        addKeyboardListener();

        // 自动聚焦输入框
        setTimeout(() => {
            const input = document.getElementById('secretInput');
            if (input) {
                input.focus();
            }
        }, 100);
    };

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalFadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);

    createModal();
}

// 将原来的初始化代码移动到新的函数中
function continueInit() {
    var $div =$('<div class="rlBox minimized">' +
        '   <a-card title="宜宾学院智慧校园助手" style="width: 100%;height: 100%;">' +
        '       <template slot="extra">' +
        '           <span v-show="!close" style="margin-right: 10px; font-size: 12px; color: #999;">{{validTimeRemaining}}</span>' +
        '           <a-button :type="buttonColor" shape="circle" :icon="buttonIcon" @click="toClose" size="small"/>' +
        '       </template>' +
        '       <div style="margin-bottom: 15px;" v-show="!close">' +
        '           <div class="button-container">' +
        '               <a-button :type="autoLearning ? \'danger\' : \'warning\'" class="main-button" @click="startAutoLearning">{{autoLearning ? "停止学习" : "自动学习"}}</a-button>' +
        '               <a-button type="danger" class="main-button" @click="clearProgress">清除进度</a-button>' +
        '               <a-button type="default" class="main-button" @click="showMoreMenu">' +
        '                   <span>更多功能</span>' +
        '                   <a-icon type="down" />'+
        '               </a-button>' +
        '           </div>' +
        '       </div>' +
        '       <a-tabs default-active-key="1" @change="callback" v-show="!close">' +
        '           <a-tab-pane key="1" tab="运行日志">' +
        '               <div class="rl-panel log">' +
        '                   <p v-for="item in logs" class="log_content">' +
        '                       {{item}}' +
        '                   </p>' +
        '               </div>' +
        '           </a-tab-pane>' +
        '           <a-tab-pane key="2" :tab="answerTabTitle" :disabled="!hasAnswer">' +
        '               <div class="rl-panel">' +
        '                   <a-table id="rlTable"' +
        '                   :pagination="false" bordered size="small" :columns="columns" :data-source="answerList">' +
        '                   </a-table>' +
        '               </div>' +
        '           </a-tab-pane>' +
        '       </a-tabs>' +
        '   </a-card>' +
        '</div>');

    // 更新样式
    const customStyle = `
        .rlBox {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 400px;
            z-index: 9999;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 10px;
            transition: all 0.3s ease;
            transform: none !important;
            overflow: hidden;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            background-color: rgba(255, 255, 255, 0.95);
        }

        /* 卡片标题美化 */
        .ant-card-head {
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            padding: 0 12px;
            background: linear-gradient(to right, #f5f5f5, #ffffff);
            border-radius: 8px 8px 0 0;
        }

        .ant-card-head-title {
            font-weight: 600;
            color: #1890ff;
            font-size: 16px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        /* 按钮动画效果 */
        .main-button {
            width: 100%;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 0 rgba(0,0,0,0.05);
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }

        .main-button:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, 0.5);
            opacity: 0;
            border-radius: 100%;
            transform: scale(1, 1) translate(-50%);
            transform-origin: 50% 50%;
        }

        .main-button:hover:after {
            animation: ripple 0.6s ease-out;
        }

        @keyframes ripple {
            0% {
                transform: scale(0, 0);
                opacity: 0.5;
            }
            20% {
                transform: scale(25, 25);
                opacity: 0.3;
            }
            100% {
                opacity: 0;
                transform: scale(40, 40);
            }
        }

        /* 滚动条美化 */
        .rl-panel::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        .rl-panel::-webkit-scrollbar-thumb {
            background: #c0c0c0;
            border-radius: 3px;
            transition: all 0.3s;
        }

        .rl-panel::-webkit-scrollbar-thumb:hover {
            background: #a0a0a0;
        }

        .rl-panel::-webkit-scrollbar-track {
            background: #f0f0f0;
            border-radius: 3px;
        }

        /* 日志内容美化 */
        .log_content {
            margin: 6px 0;
            padding: 6px 10px;
            border-radius: 4px;
            background: #f9f9f9;
            border-left: 3px solid #1890ff;
            transition: all 0.2s;
            animation: fade-in-log 0.3s ease-out backwards;
        }

        .log_content:nth-child(odd) {
            background: #f5f5f5;
            border-left-color: #52c41a;
        }

        .log_content:hover {
            background: #f0f7ff;
            transform: translateX(2px);
        }

        @keyframes fade-in-log {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* 优化最小化状态 */
        .rlBox.minimized {
            width: 40px !important;
            height: 40px !important;
            padding: 0 !important;
            overflow: hidden;
            opacity: 0.8;
            cursor: pointer;
            border-radius: 50%;
            background: #1890ff;
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            transform: scale(1) !important;
        }

        /* 最小化状态悬停效果 */
        .rlBox.minimized:hover {
            opacity: 1;
            box-shadow: 0 6px 16px rgba(24, 144, 255, 0.5);
            transform: scale(1.1) !important;
        }

        /* 展开状态动画 */
        .rlBox:not(.minimized) {
            animation: expand-box 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(0, 0, 0, 0.06);
        }

        @keyframes expand-box {
            0% {
                opacity: 0.8;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                transform: scale(1);
            }
            60% {
                border-radius: 10px;
                opacity: 1;
            }
            100% {
                width: 400px;
                height: auto;
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes minimize-box {
            0% {
                width: 400px;
                height: auto;
                border-radius: 8px;
                opacity: 1;
            }
            40% {
                opacity: 0.9;
                border-radius: 25px;
            }
            100% {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                opacity: 0.8;
            }
        }

        /* 按钮容器样式 */
        .button-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            width: 100%;
            animation: fade-in 0.3s ease-out 0.1s backwards;
        }

        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* 主按钮样式 */
        .main-button {
            width: 100%;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 0 rgba(0,0,0,0.05);
            transition: all 0.3s;
        }

        /* 按钮样式优化 */
        .ant-btn-danger {
            background: #ff4d4f !important;
            border-color: #ff4d4f !important;
            color: white !important;
        }

        .ant-btn-danger:hover {
            background: #ff7875 !important;
            border-color: #ff7875 !important;
        }

        .ant-btn-primary {
            background: #1890ff !important;
            border-color: #1890ff !important;
        }

        .ant-btn-primary:hover {
            background: #40a9ff !important;
            border-color: #40a9ff !important;
        }

        .ant-btn-success {
            background: #52c41a !important;
            border-color: #52c41a !important;
            color: white !important;
        }

        .ant-btn-success:hover {
            background: #73d13d !important;
            border-color: #73d13d !important;
        }

        .ant-btn-warning {
            background: #faad14 !important;
            border-color: #faad14 !important;
            color: white !important;
        }

        .ant-btn-warning:hover {
            background: #ffc53d !important;
            border-color: #ffc53d !important;
        }

        /* 下拉菜单样式 */
        .more-menu {
            position: fixed;
            background: white;
            border-radius: 4px;
            box-shadow: 0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05);
            z-index: 10000;
            display: none;
            padding: 4px 0;
        }

        .more-menu.show {
            display: block;
            animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .menu-item {
            padding: 10px 16px;
            color: #333;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            width: 100%;
            box-sizing: border-box;
        }

        .menu-item:hover {
            background: #f5f5f5;
        }

        .menu-item i {
            margin-right: 8px;
            font-size: 14px;
        }

        .menu-divider {
            height: 1px;
            background: #f0f0f0;
            margin: 4px 0;
        }

        /* 最小化状态下的卡片样式 */
        .rlBox.minimized .ant-card {
            background: transparent;
            border: none;
            box-shadow: none;
        }

        /* 最小化状态下的标题隐藏 */
        .rlBox.minimized .ant-card-head-title {
            display: none;
        }

        /* 最小化状态下的开按钮样式 */
        .rlBox.minimized .ant-btn-circle {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: transparent !important;
            border: 2px solid white !important;
            color: white !important;
            box-shadow: none;
        }

        .rlBox.minimized .ant-btn-circle:hover {
            background: rgba(255, 255, 255, 0.2) !important;
        }

        /* 移动端适配 */
        @media screen and (max-width: 768px) {
            .rlBox {
                width: 300px;
            }

            .rlBox.minimized {
                width: 36px !important;
                height: 36px !important;
            }
        }

        /* 表格容器样式 */
        .rl-panel {
            height: auto;
            max-height: calc(100vh - 250px);
            overflow-y: auto;
            overflow-x: hidden;
        }

        /* 表格样式优化 */
        .ant-table-wrapper {
            overflow: visible;
        }

        .ant-table {
            min-width: 100%;
            background: transparent;
        }

        /* 美化滚动条样式 */
        .rl-panel::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        .rl-panel::-webkit-scrollbar-thumb {
            background: #d9d9d9;
            border-radius: 3px;
        }

        .rl-panel::-webkit-scrollbar-track {
            background: #f0f0f0;
            border-radius: 3px;
        }

        /* 表格单元格样式 */
        .ant-table-tbody > tr > td {
            white-space: normal;
            word-break: break-word;
            padding: 8px 16px;
            line-height: 1.5;
            max-width: 0;
        }

        /* 表格头部样式 */
        .ant-table-thead > tr > th {
            background: #f5f5f5;
            padding: 12px 16px;
            white-space: nowrap;
            position: sticky;
            top: 0;
            z-index: 2;
        }

        /* 保表格布局合理 */
        #rlTable {
            table-layout: fixed;
            width: 100%;
        }

        /* 移动端适配 */
        @media screen and (max-width: 768px) {
            .rl-panel {
                max-height: calc(100vh - 200px);
            }

            .ant-table-tbody > tr > td {
                padding: 6px 12px;
            }

            .ant-table-thead > tr > th {
                padding: 8px 12px;
            }
        }
    `;

    $("body").append($div);
    GM_addStyle(GM_getResourceText("cs1"));
    GM_addStyle(GM_getResourceText("cs2"));
    GM_addStyle(customStyle);

    // 创建更多菜单DOM
    const moreMenuHtml = `
        <div id="moreMenu" class="more-menu">
            <div class="menu-item" id="autoAnswerBtn">
                <i class="anticon anticon-check-circle"></i>自动答题
            </div>
            <div class="menu-item" id="videoSkipBtn">
                <i class="anticon anticon-forward"></i>秒过视频
            </div>
            <div class="menu-item" id="exportExcelBtn">
                <i class="anticon anticon-export"></i>导出题库
            </div>
            <div class="menu-item" id="clearLogsBtn">
                <i class="anticon anticon-delete"></i>清除日志
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item" id="tutorialBtn">
                <i class="anticon anticon-question-circle"></i>使用教程
            </div>
            <div class="menu-item" id="settingsBtn">
                <i class="anticon anticon-setting"></i>答题设置
            </div>
        </div>
    `;
    $("body").append(moreMenuHtml);

    // 创建辅助函数用于教程模态框
    function createVNode(tag, props = {}, children = []) {
        const element = document.createElement(tag);

        // 设置属性
        for (const key in props) {
            if (key === 'style' && typeof props[key] === 'object') {
                Object.assign(element.style, props[key]);
            } else {
                element.setAttribute(key, props[key]);
            }
        }

        // 添加子元素
        if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else {
                    element.appendChild(child);
                }
            });
        } else if (typeof children === 'string') {
            element.textContent = children;
        }

        return element;
    }

    function createText(text) {
        return document.createTextNode(text);
    }

    // Icon 组件简单实现
    function Icon(props) {
        const icon = document.createElement('i');
        icon.className = `anticon anticon-${props.type}`;
        if (props.theme) {
            icon.className += ` anticon-${props.type}-${props.theme}`;
        }
        if (props.style) {
            Object.assign(icon.style, props.style);
        }
        return icon;
    }

    // 手动定义直接绑定的事件处理函数
    window.autoAnswerHandler = function() {
        if (window.vue) window.vue.autoAnswer();
        document.getElementById('moreMenu').classList.remove('show');
    };

    window.videoSkipHandler = function() {
        if (window.vue) window.vue.videoSkip();
        document.getElementById('moreMenu').classList.remove('show');
    };

    window.exportExcelHandler = function() {
        if (window.vue) window.vue.exportExcel();
        document.getElementById('moreMenu').classList.remove('show');
    };

    window.clearLogsHandler = function() {
        if (window.vue) window.vue.clearLogs();
        document.getElementById('moreMenu').classList.remove('show');
    };

    window.openTutorialHandler = function() {
        if (window.vue) window.vue.showTutorial();
        document.getElementById('moreMenu').classList.remove('show');
    };

    window.openSettingsHandler = function() {
        if (window.vue) window.vue.openSettings();
        document.getElementById('moreMenu').classList.remove('show');
    };

    // 确保菜单项绑定了正确的事件处理函数
    const autoAnswerBtn = document.getElementById('autoAnswerBtn');
    const videoSkipBtn = document.getElementById('videoSkipBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const clearLogsBtn = document.getElementById('clearLogsBtn');
    const tutorialBtn = document.getElementById('tutorialBtn');
    const settingsBtn = document.getElementById('settingsBtn');

    if (autoAnswerBtn) autoAnswerBtn.addEventListener('click', window.autoAnswerHandler);
    if (videoSkipBtn) videoSkipBtn.addEventListener('click', window.videoSkipHandler);
    if (exportExcelBtn) exportExcelBtn.addEventListener('click', window.exportExcelHandler);
    if (clearLogsBtn) clearLogsBtn.addEventListener('click', window.clearLogsHandler);
    if (tutorialBtn) tutorialBtn.addEventListener('click', window.openTutorialHandler);
    if (settingsBtn) settingsBtn.addEventListener('click', window.openSettingsHandler);

    var vue = new Vue({
        el: '.rlBox',
        data:{
            logs: setting.logs,
            close: true,
            key: '1',
            columns:[
                {
                    title: '序号.选项',
                    dataIndex: 'idAndOptions',
                    key: 'idAndOptions',
                    width: '80px',
                    fixed: 'left',
                    align: 'center'
                },
                {
                    title: '题目',
                    dataIndex: 'question',
                    key: 'question',
                    width: '45%',
                    ellipsis: true
                },
                {
                    title: '答案',
                    dataIndex: 'answer',
                    key: 'answer',
                    width: '45%',
                    customRender: (text) => {
                        return text ? text.split('\n').join('<br/>') : '';
                    }
                }
            ],
            answerList: [],  // 初化为空数组
            isDragging: false,
            currentX: 0,
            currentY: 0,
            initialX: 0,
            initialY: 0,
            xOffset: 0,
            yOffset: 0,
            hasAnswer: false, // 添加答案获取状态标志
            validUntil: localStorage.getItem('scriptValidUntil') || null,
            autoLearning: false, // 添加自动学习状态标志
        },
        mounted() {
            window.vue = this;
            this.initDragEvents();

            // 修改初始化位置设置
            const box = document.querySelector('.rlBox');
            box.style.right = '0px';
            box.style.left = 'auto';
            box.setAttribute('data-expand-side', 'right');

            // 添加窗口大小改变监听
            window.addEventListener('resize', this.checkPosition);

            // 每分钟更新一次验证时间显示
            setInterval(() => {
                this.validUntil = localStorage.getItem('scriptValidUntil');
            }, 60000);

            // 检查是否需要恢复学习进度
            this.checkLearningProgress();

            // 添加页面URL变化监听
            this.initUrlChangeListener();
        },
        computed:{
            isShow(){
                return this.close ? 0.8 : 1.0;
            },
            buttonIcon(){
                return this.close ? 'plus' : 'minus';
            },
            buttonColor(){
                return this.close ? 'primary' : 'default';
            },
            answerTabTitle() {
                return this.hasAnswer ? '答案列表' : '答案列表 (等待获取...)';
            },
            validTimeRemaining() {
                const validTime = getValidTime();
                if (!validTime) return '未验证';

                const remaining = validTime - Date.now();
                if (remaining <= 0) return '验证已过期';

                const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
                const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                return `验证剩余: ${days}天${hours}小时`;
            }
        },
        methods: {
            callback(key) {
                if (key === '2' && !this.hasAnswer) {
                    this.$message.warning('请等待答案获取完成后再查看答案列表');
                    this.key = '1'; // 保持在日志页面
                    return;
                }
                this.key = key;
            },
            toClose() {
                this.close = !this.close;
                const box = document.querySelector('.rlBox');
                const rect = box.getBoundingClientRect();
                const windowWidth = window.innerWidth;

                if (this.close) {
                    // 最小化时，判断靠近哪边
                    const centerX = rect.left + rect.width / 2;

                    // 添加最小化动画类
                    box.style.animation = 'minimize-box 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';

                    // 在动画执行过程中保持原位置
                    box.style.transition = 'none';

                    if (centerX > windowWidth / 2) {
                        // 靠右
                        box.style.right = '10px';
                        box.style.left = 'auto';
                        box.setAttribute('data-side', 'right');
                    } else {
                        // 靠左
                        box.style.left = '10px';
                        box.style.right = 'auto';
                        box.setAttribute('data-side', 'left');
                    }

                    // 使用setTimeout确保类名在动画结束后添加
                    setTimeout(() => {
                        box.classList.add('minimized');
                        // 恢复transition以保证后续hover效果
                        box.style.animation = '';
                        box.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    }, 400);
                } else {
                    // 展开时，先移除最小化类，然后应用展开动画
                    box.classList.remove('minimized');

                    const side = box.getAttribute('data-side') || 'right';
                    if (side === 'right') {
                        box.style.right = '10px';
                        box.style.left = 'auto';
                    } else {
                        box.style.left = '10px';
                        box.style.right = 'auto';
                    }

                    // 为内部内容添加循序渐入效果
                    const tabs = box.querySelector('.ant-tabs');
                    const buttons = box.querySelector('.button-container');

                    if (tabs) {
                        tabs.style.opacity = '0';
                        tabs.style.transform = 'translateY(10px)';
                        tabs.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        tabs.style.display = '';

                        setTimeout(() => {
                            tabs.style.opacity = '1';
                            tabs.style.transform = 'translateY(0)';
                        }, 100);
                    }

                    if (buttons) {
                        buttons.style.opacity = '0';
                        buttons.style.transform = 'translateY(10px)';
                        buttons.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        buttons.style.display = '';

                        setTimeout(() => {
                            buttons.style.opacity = '1';
                            buttons.style.transform = 'translateY(0)';
                        }, 50);
                    }
                }
            },
            startAutoLearning() {
                if(this.autoLearning) {
                    this.autoLearning = false;
                    localStorage.removeItem('learningProgress');
                    log("已停止自动学习");
                    this.$message.info("已停止自动学习");
                    return;
                }

                this.autoLearning = true;
                this.$message.success({
                    content: "自动学习已启动",
                    duration: 3,
                    description: "系统将自动完成视频观看、文档阅读和测验答题"
                });
                log("开始自动学习...");
                this.processCurrentContent();
            },
            processCurrentContent() {
                if(!this.autoLearning) {
                    log("自动学习已停止");
                    return;
                }

                const pageType = checkPageType();
                if(!pageType) {
                    log("未识别到当前内容类型，等待加载...");
                    setTimeout(() => this.processCurrentContent(), 1000);
                    return;
                }

                const currentTab = document.querySelector('.tab-active .tab-inner');
                const itemName = currentTab.getAttribute('itemname');
                const currentChapter = document.querySelector('.nav-text.current');
                const chapterName = currentChapter ? currentChapter.querySelector('.node-text').textContent.trim() : '未知章节';

                // 显示当前学习内容提示
                this.$message.info({
                    content: `正在处理: ${itemName}`,
                    duration: 3,
                    description: `章节: ${chapterName}`
                });

                log(`正在处理 ${chapterName} - ${itemName} (${pageType})`);

                // 根据页面类型执行不同操作
                switch(pageType) {
                    case 'video':
                    this.handleVideo();
                        break;
                    case 'document':
                    this.handleDocument();
                        break;
                    case 'quiz':
                        // 使用全局函数而不是方法
                        handleQuiz();
                        break;
                }
            },
            handleVideo() {
                let video = document.getElementsByTagName("video")[0];
                if(!video) {
                    log("当前页面不存在视频，请确保视频已加载");
                    setTimeout(() => this.handleVideo(), 1000);
                    return;
                }

                // 显示视频处理提示
                this.$message.info({
                    content: "正在处理视频",
                    duration: 3,
                    description: "系统将自动完成视频观看"
                });

                // 尝试使用HTML5视频API静音
                video.muted = true;

                // 尝试使用JWPlayer API静音（如果存在）
                try {
                    if (typeof jwplayer === 'function' && jwplayer("mediaplayer")) {
                        jwplayer("mediaplayer").setMute(true);
                        log("已使用JWPlayer API静音视频");
                    } else {
                        log("已自动静音HTML5视频");
                    }
                } catch (error) {
                    log("JWPlayer静音尝试失败，使用HTML5静音: " + error.message);
                }

                video.addEventListener('ended', () => {
                    if(this.autoLearning) {
                        log("视频播放完成，准备切换下一个内容");
                        this.$message.success({
                            content: "视频学习完成",
                            duration: 2
                        });
                        this.switchToNextContent();
                    }
                });

                try {
                    if (video.duration && !isNaN(video.duration)) {
                        video.currentTime = video.duration - 0.1;
                        video.playbackRate = 1;
                        log("正在完成当前视频...");
                    } else {
                        log("等待视频加载...");
                        video.addEventListener('loadedmetadata', () => {
                            video.currentTime = video.duration - 0.1;
                            video.playbackRate = 1;
                            log("视频加载完成，正在处理...");
                        });
                    }
                } catch (error) {
                    log("处理视频时出错：" + error.message);
                }
            },
            handleDocument() {
                const totalPages = parseInt(document.querySelector('.flexpaper_lblTotalPages')?.textContent.replace('/ ', '')) || 0;

                if(totalPages === 0) {
                    log("未检测到文档页数，请确保文档已加载");
                    setTimeout(() => this.handleDocument(), 1000);
                    return;
                }

                // 计算阅读时间和翻页间隔
                let totalReadingTime, pageInterval;

                if(totalPages < 10) {
                    // 小于10页文档，使用固定1秒1页的速度
                    totalReadingTime = totalPages;
                    pageInterval = 1000; // 1秒1页
                } else if(totalPages > 50) {
                    // 超过50页文档，固定30秒完成
                    totalReadingTime = 30;
                    pageInterval = Math.max(totalReadingTime / totalPages * 1000, 300); // 每页间隔时间(毫秒)，最小300ms
                } else {
                    // 10-50页文档使用原有逻辑
                    totalReadingTime = totalPages > 20 ? 20 : 10; // 超过20页固定20秒，否则10秒
                    pageInterval = Math.max(totalReadingTime / totalPages * 1000, 300); // 每页间隔时间(毫秒)，最小300ms
                }

                // 显示文档阅读提示
                this.$message.info({
                    content: "开始阅读文档",
                    duration: 3,
                    description: `共 ${totalPages} 页，预计用时 ${totalReadingTime} 秒`
                });

                log(`正在阅读文档，共${totalPages}页，预计用时${totalReadingTime}秒，翻页间隔${Math.round(pageInterval)}毫秒`);
                let currentPage = 1;

                const readInterval = setInterval(() => {
                    if(!this.autoLearning || currentPage >= totalPages) {
                        clearInterval(readInterval);
                        if(this.autoLearning) {
                            log(`文档阅读完成，准备切换到下一个内容`);
                            this.$message.success({
                                content: "文档阅读完成",
                                duration: 2
                            });
                            this.switchToNextContent();
                        }
                        return;
                    }

                    try {
                        const nextButton = document.querySelector('.flexpaper_bttnPrevNext');
                        if(nextButton) {
                            nextButton.click();
                            // 每5页或翻页速度快时每10页显示一次进度
                            const progressInterval = pageInterval < 500 ? 10 : 5;
                            if(currentPage % progressInterval === 0) {
                                this.$message.info({
                                    content: `阅读进度: ${Math.round((currentPage/totalPages) * 100)}%`,
                                    duration: 1
                                });
                            }
                            log(`正在阅读第${currentPage}页，共${totalPages}页`);
                            currentPage++;
                        } else {
                            log("未找到翻页按钮，尝试重新加载");
                            setTimeout(() => this.handleDocument(), 1000);
                        }
                    } catch (error) {
                        log(`翻页过程出错: ${error.message}`);
                        clearInterval(readInterval);
                        setTimeout(() => this.handleDocument(), 1000);
                    }
                }, pageInterval);
            },
            switchToNextContent() {
                if(!this.autoLearning) return;

                // 获取所有标签页
                const tabs = document.querySelectorAll('.tab-inner');
                let currentTabIndex = -1;

                // 找到当前激活的标签页
                tabs.forEach((tab, index) => {
                    if(tab.parentElement.classList.contains('tab-active')) {
                        currentTabIndex = index;
                    }
                });

                // 检查是否还有下一个内容
                if(currentTabIndex < tabs.length - 1) {
                    // 还有下一个内容，继续在当前章节学习
                    const nextTab = tabs[currentTabIndex + 1];
                    const nextTabName = nextTab.getAttribute('itemname');
                    log(`切换到下一个内容: ${nextTabName}`);
                    nextTab.click();

                    setTimeout(() => this.processCurrentContent(), 1500);
                } else {
                    // 当前章节的所有内容已学习完成
                    const currentChapter = document.querySelector('.nav-text.current');
                    if (!currentChapter) {
                        log("无法识别当前章节，自动学习已停止");
                        this.autoLearning = false;
                        return;
                    }

                    const chapterName = currentChapter.querySelector('.node-text')?.textContent.trim() || '未知章节';
                    log(`章节 ${chapterName} 的所有内容已学习完成，检查是否有下一讲...`);

                    // 查找当前章节的父元素(sup-item)，然后检查是否有下一个讲
                    const currentSupItem = currentChapter.closest('.nav-item.sup-item');
                    if (!currentSupItem) {
                        log("无法找到当前章节的父元素，尝试切换到下一章节");
                        this.switchToNextChapter();
                        return;
                    }

                    // 获取当前章节下的子章节列表（二级菜单）
                    const subNav = currentSupItem.querySelector('.sub-nav');
                    if (!subNav || !subNav.children || subNav.children.length === 0) {
                        log("当前章节没有子章节，尝试切换到下一章节");
                        this.switchToNextChapter();
                        return;
                    }

                    // 检查子菜单是否已展开，如果没有则先展开
                    if (subNav.style.display === 'none') {
                        log("展开子菜单...");
                        subNav.style.display = 'block';
                        setTimeout(() => this.switchToNextContent(), 500);
                        return;
                    }

                    // 查找当前激活的讲次
                    const allLectures = Array.from(subNav.querySelectorAll('.sub-nav-text'));
                    if (allLectures.length === 0) {
                        log("未找到讲次列表，尝试切换到下一章节");
                        this.switchToNextChapter();
                        return;
                    }

                    // 查找当前激活的讲
                    let currentLectureIndex = -1;
                    for (let i = 0; i < allLectures.length; i++) {
                        if (allLectures[i].classList.contains('current')) {
                            currentLectureIndex = i;
                            break;
                        }
                    }

                    log(`当前是第 ${currentLectureIndex + 1} 讲，共 ${allLectures.length} 讲`);

                    // 检查是否有下一讲
                    if (currentLectureIndex < allLectures.length - 1) {
                        // 有下一讲，切换到下一讲
                        const nextLecture = allLectures[currentLectureIndex + 1];
                        const nextLectureName = nextLecture.textContent.trim();
                        log(`切换到下一讲: ${nextLectureName}`);

                        // 保存当前章节信息用于恢复
                        const progress = {
                            isLearning: true,
                            currentChapter: currentSupItem.getAttribute('id'),
                            nextLecture: nextLecture.getAttribute('id') || nextLecture.getAttribute('data-id'),
                            timestamp: Date.now(),
                            isPageSwitching: true
                        };
                        localStorage.setItem('learningProgress', JSON.stringify(progress));
                        setting.learningProgress = progress;

                        // 显示切换提示
                        this.$notification.info({
                            message: '准备切换讲次',
                            description: `即将切换到: ${nextLectureName}`,
                            duration: 3
                        });

                        // 点击下一讲
                        nextLecture.click();

                        // 等待内容加载完成后继续处理
                        setTimeout(() => {
                            try {
                                // 检查是否有内容标签
                                const tabList = document.querySelectorAll('.tab-inner');
                                if (!tabList || tabList.length === 0) {
                                    throw new Error("未找到可学习的内容");
                                }

                                const firstTab = tabList[0];
                                log(`开始学习新讲次内容: ${firstTab.getAttribute('itemname')}`);
                                firstTab.click();

                                // 确保自动学习状态保持开启
                                this.autoLearning = true;

                                // 保存新的学习进度
                                const newProgress = {
                                    isLearning: true,
                                    currentChapter: currentSupItem.getAttribute('id'),
                                    currentContent: firstTab.getAttribute('itemid'),
                                    timestamp: Date.now(),
                                    isPageSwitching: false
                                };
                                localStorage.setItem('learningProgress', JSON.stringify(newProgress));

                                // 等待内容加载完成后开始学习
                                setTimeout(() => {
                                    if (this.autoLearning) {
                                        log(`开始自动学习新讲次内容...`);
                                        this.processCurrentContent();
                                    }
                                }, 1500);
                            } catch (error) {
                                log(`加载讲次内容失败: ${error.message}`);
                        this.switchToNextChapter();
                            }
                        }, 2000);
                    } else {
                        // 已经是当前章节的最后一讲，切换到下一章节
                        log("当前章节的所有讲次已学习完成，准备切换到下一章节");
                        this.switchToNextChapter();
                    }
                }
            },
            switchToNextChapter() {
                try {
                    const allChapters = document.querySelectorAll('.sidebar .nav-list .nav-item.sup-item');
                    if (!allChapters.length) {
                        this.autoLearning = false;
                        log("未找到章节列表，自动学习已停止");
                        this.$message.warning("未找到章节列表");
                        return;
                    }

                    log(`共发现 ${allChapters.length} 个章节`);

                    let currentChapterIndex = -1;
                    allChapters.forEach((chapter, index) => {
                        if(chapter.querySelector('.nav-text.current')) {
                            currentChapterIndex = index;
                        }
                    });

                    if(currentChapterIndex < allChapters.length - 1) {
                        const nextChapter = allChapters[currentChapterIndex + 1];
                        const nextChapterLink = nextChapter.querySelector('.nav-text');
                        const nextChapterName = nextChapter.querySelector('.node-text').textContent.trim();

                        if (!nextChapterLink) {
                            throw new Error("无法找到章节链接");
                        }

                        const unitId = nextChapterLink.getAttribute('unitid');
                        if (!unitId) {
                            throw new Error("无法获取章节ID");
                        }

                        // 设置进度信息，标记正在切换章节
                        const progress = {
                            isLearning: true,
                            currentChapter: unitId, // 设置为要跳转的章节ID
                            currentContent: null,
                            timestamp: Date.now(),
                            isPageSwitching: true // 标记正在切换页面
                        };
                        localStorage.setItem('learningProgress', JSON.stringify(progress));
                        setting.learningProgress = progress;

                        // 显示章节切换提示
                        this.$notification.info({
                            message: '准备切换章节',
                            description: `即将切换到: ${nextChapterName}`,
                            duration: 3
                        });

                        log(`准备切换到下一章节: ${nextChapterName} (${currentChapterIndex + 2}/${allChapters.length})`);

                        // 直接点击章节链接
                        nextChapterLink.click();

                        // 等待页面加载完成
                        setTimeout(() => {
                            try {
                                // 展开子章节列表
                                const subNav = nextChapter.querySelector('.sub-nav');
                                if (!subNav) {
                                    throw new Error("未找到子章节列表");
                                }
                                subNav.style.display = 'block';

                                // 获取第一个子章节
                                const firstSubChapter = subNav.querySelector('.sub-nav-text');
                                if (!firstSubChapter) {
                                    throw new Error("未找到子章节");
                                }

                                // 点击第一个子章节
                                log(`点击第一个子章节...`);
                                firstSubChapter.click();

                                // 等待子章节内容加载
                                setTimeout(() => {
                                    try {
                                        // 获取并点击第一个内容标签
                                        const tabList = document.querySelectorAll('.tab-inner');
                                        if (!tabList || tabList.length === 0) {
                                            throw new Error("未找到可学习的内容");
                                        }

                                        const firstTab = tabList[0];
                                        log(`开始学习: ${firstTab.getAttribute('itemname')}`);
                                        firstTab.click();

                                        // 确保自动学习状态保持开启
                                        this.autoLearning = true;

                                        // 保存新的学习进度
                                        const newProgress = {
                                            isLearning: true,
                                            currentChapter: unitId,
                                            currentContent: firstTab.getAttribute('itemid'),
                                            timestamp: Date.now()
                                        };
                                        localStorage.setItem('learningProgress', JSON.stringify(newProgress));

                                        // 等待内容加载完成后开始学习
                                        setTimeout(() => {
                                            if (this.autoLearning) {
                                                log(`开始自动学习新章节内容...`);
                                                this.processCurrentContent();
                                            }
                                        }, 1500);
                                    } catch (error) {
                                        throw new Error(`加载内容失败: ${error.message}`);
                                    }
                                }, 1500);
                            } catch (error) {
                                throw new Error(`切换子章节失败: ${error.message}`);
                            }
                        }, 2000);
                    } else {
                        this.autoLearning = false;
                        log("已完成所有章节的学习！");
                        this.$notification.success({
                            message: '学习完成',
                            description: '恭喜！已完成所有章节的学习',
                            duration: 0
                        });
                    }
                } catch (error) {
                    this.autoLearning = false;
                    log(`切换章节失败: ${error.message}`);
                    this.$message.error("切换章节失败，请刷新页面重试");
                }
            },
            checkPosition() {
                const box = document.querySelector('.rlBox');
                const rect = box.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                // 检查并修正水平位置
                if (rect.right > windowWidth) {
                    box.style.right = '0px';
                    box.style.left = 'auto';
                }
                if (rect.left < 0) {
                    box.style.left = '0px';
                    box.style.right = 'auto';
                }

                // 检查并修正垂直位置
                if (rect.bottom > windowHeight) {
                    box.style.top = `${windowHeight - rect.height - 10}px`;
                }
                if (rect.top < 0) {
                    box.style.top = '10px';
                }
            },
            autoAnswer() {
                log("开始自动答题...");

                // 检查是否已获取答案
                if (!setting.datas || setting.datas.length === 0) {
                    log("未找到答案信息，请先获取答案");
                    return;
                }

                log(`共发现 ${setting.datas.length} 道题目的答案`);
                let answeredCount = 0;

                // 获取所有题目容器
                const allQuestionContainers = document.querySelectorAll('.view-test');
                if (!allQuestionContainers || allQuestionContainers.length === 0) {
                    log("未找到题目容器，请确认是否在答题页面");
                    return;
                }

                log(`页面上共有 ${allQuestionContainers.length} 道题目`);

                // 遍历所有题目容器，确保每个题目都能找到对应的答案
                allQuestionContainers.forEach((questionContainer, containerIndex) => {
                    try {
                        // 获取题目文本，用于匹配答案
                        const questionTextElement = questionContainer.querySelector('.test-text-tutami');
                        if (!questionTextElement) {
                            log(`第 ${containerIndex + 1} 题未找到题目文本`);
                            return;
                        }

                        const questionText = questionTextElement.textContent.trim();

                        // 在答案列表中查找匹配的题目
                        let matchedAnswerData = null;
                        let matchIndex = -1;

                        // 首先尝试按索引匹配
                        if (containerIndex < setting.datas.length) {
                            matchedAnswerData = setting.datas[containerIndex];
                            matchIndex = containerIndex;
                        }

                        // 如果索引匹配失败或题目不匹配，则尝试通过题目内容匹配
                        if (!matchedAnswerData || !questionText.includes(cleanHtmlTags(matchedAnswerData.question))) {
                            // 在答案列表中查找匹配的题目
                            for (let i = 0; i < setting.datas.length; i++) {
                                const answerData = setting.datas[i];
                                const cleanQuestion = cleanHtmlTags(answerData.question);

                                // 检查题目文本是否匹配
                                if (questionText.includes(cleanQuestion) || cleanQuestion.includes(questionText)) {
                                    matchedAnswerData = answerData;
                                    matchIndex = i;
                                    break;
                                }
                            }
                        }

                        if (!matchedAnswerData) {
                            log(`第 ${containerIndex + 1} 题未找到匹配的答案`);
                            return;
                        }

                        // 获取匹配到的答案
                        const answer = matchedAnswerData.answer;
                        if (!answer) {
                            log(`第 ${containerIndex + 1} 题答案为空`);
                            return;
                        }

                        log(`第 ${containerIndex + 1} 题匹配到答案列表中的第 ${matchIndex + 1} 题`);

                        // 判断题目类型
                        const isMultiChoice = questionContainer.querySelector('.input-c') !== null;
                        const isSingleChoice = questionContainer.querySelector('.input-r') !== null;
                        const isFillBlank = questionContainer.querySelector('.fillblank') !== null;

                        if (isMultiChoice || isSingleChoice) {
                            // 处理选择题
                            const answerLetters = answer.split('\n').map(a => a.trim().charAt(0));
                            const options = questionContainer.querySelectorAll('.t-option');

                            options.forEach((option, idx) => {
                                const letter = String.fromCharCode(65 + idx);
                                if (answerLetters.includes(letter)) {
                                    // 查找选项的点击元素
                                    const clickTarget = option.querySelector('a[href="javascript:void(0)"]') ||
                                                      option.querySelector(isMultiChoice ? '.input-c' : '.input-r');

                                    if (clickTarget) {
                                        // 检查是否已经选中
                                        const isChecked = option.querySelector(isMultiChoice ? '.input-c.selected' : '.input-r.selected');
                                        if (!isChecked) {
                                            clickTarget.click();
                                            log(`第 ${containerIndex + 1} 题选择了选项 ${letter}`);
                                        }
                                    }
                                }
                            });
                            answeredCount++;
                        } else if (isFillBlank) {
                            // 处理填空题
                            const input = questionContainer.querySelector('.fillblank');
                            if (input) {
                                input.value = answer.replace(/^.*?\./,'').trim(); // 移除可能的选项标记
                                // 触发必要的事件
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                log(`第 ${containerIndex + 1} 题填写了答案: ${answer}`);
                                answeredCount++;
                            }
                        }
                    } catch (error) {
                        log(`第 ${containerIndex + 1} 题自动答题出错: ${error.message}`);
                    }
                });

                // 显示完成提示
                log(`自动答题完成！成功答题 ${answeredCount} 道题目`);
                this.$message.success(`自动答题完成！成功答题 ${answeredCount} 道题目，请检查后手动提交。`);
            },
            exportExcel(){
                // 检查是否有答案数据
                if (!this.answerList || this.answerList.length === 0) {
                    this.$message.error('没有可导出的答案数！请等待答案获取完成。');
                    log('导出失败：没有答案数据');
                    return;
                }

                // 检查xlsx库是否加载成功
                if (typeof XLSX === 'undefined') {
                    this.$message.info('正在加载XLSX库，请稍候...');
                    log('正在加载XLSX库...');

                    // 使用中国境内常用CDN (将第二个CDN放在首位)
                    const cdnList = [
                        'https://lib.baomitu.com/xlsx/0.18.5/xlsx.full.min.js',  // 360 前端静态资源库 (移到首位)
                        'https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',  // BootCDN
                        'https://fastly.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js', // JSDelivr 的 Fastly CDN
                        'https://gcore.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js', // JSDelivr 的 Gcore CDN
                        'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/xlsx/0.18.5/xlsx.full.min.js' // 字节跳动 CDN
                    ];

                    let currentCdnIndex = 0;

                    const tryNextCDN = () => {
                        if (currentCdnIndex >= cdnList.length) {
                            log('所有CDN尝试失败，请刷新页面或稍后再试');
                            this.$message.error('加载失败，请刷新页面或稍后再试');
                            return;
                        }

                        const currentCdnUrl = cdnList[currentCdnIndex];
                        log(`尝试从 CDN (${currentCdnIndex + 1}/${cdnList.length}) 加载XLSX库...`);

                        const script = document.createElement('script');
                        script.src = currentCdnUrl;

                        script.onload = () => {
                            log('XLSX库加载成功，正在导出题库...');
                            // 库加载成功后直接执行导出，不需要用户再次点击
                            setTimeout(() => this.exportExcel(), 500);
                        };

                        script.onerror = () => {
                            log(`CDN ${currentCdnIndex + 1} 加载失败，尝试下一个...`);
                            currentCdnIndex++;
                            tryNextCDN();
                        };

                        document.head.appendChild(script);
                    };

                    // 开始尝试加载
                    tryNextCDN();
                    return;
                }

                // 提取题目开头的序号
                const extractQuestionNumber = (question) => {
                    // 匹配模式: 数字开头，后跟"、"或"."或"："等分隔符
                    const match = question.match(/^(\d+)[、.：:]/);
                    if (match) {
                        return parseInt(match[1], 10);
                    }
                    return null;
                };

                // 对答案数据按题目开头的序号排序
                const sortedAnswers = [...this.answerList].sort((a, b) => {
                    const numA = extractQuestionNumber(a.question);
                    const numB = extractQuestionNumber(b.question);

                    // 如果两个都有序号，按序号排序
                    if (numA !== null && numB !== null) {
                        return numA - numB;
                    }

                    // 如果只有一个有序号，有序号的排前面
                    if (numA !== null) return -1;
                    if (numB !== null) return 1;

                    // 否则保持原有顺序
                    return 0;
                });

                // 准备数据（只保留题目和答案两列，原始序号从题目中提取）
                const data = sortedAnswers.map(item => {
                    return {
                        '题目': item.question,
                        '答案': item.answer
                    };
                });

                try {
                    // 创建工作簿
                    const wb = XLSX.utils.book_new();
                    // 创建工作表
                    const ws = XLSX.utils.json_to_sheet(data);

                    // 设置列宽
                    const colWidths = {
                        '题目': 70,
                        '答案': 50
                    };

                    ws['!cols'] = Object.keys(colWidths).map(key => ({
                        wch: colWidths[key]
                    }));

                    // 从页面提取题目名称和章节信息
                    let examName = '';
                    let chapterNum = '';
                    let lectureNum = '';

                    // 1. 尝试从tab栏获取测试题名称
                    const activeTab = document.querySelector('.tabs .tab-active');
                    if (activeTab) {
                        const tabLink = activeTab.querySelector('.tab-inner');
                        if (tabLink && tabLink.getAttribute('itemname')) {
                            examName = tabLink.getAttribute('itemname');
                        } else if (activeTab.getAttribute('title')) {
                            examName = activeTab.getAttribute('title');
                        }
                    }

                    // 如果找不到，从页面标题提取
                    if (!examName) {
                        examName = document.title.replace(/\s*[-—]\s*智慧校园.*$/, '').trim();
                    }

                    // 2. 提取章节数和讲数
                    // 从各种可能的元素中提取章节数
                    const extractChapterNum = (text) => {
                        if (!text) return '';
                        const match = text.match(/第([0-9０-９一二三四五六七八九十]+)章/);
                        if (match) return match[1];
                        return '';
                    };

                    // 从各种可能的元素中提取讲数
                    const extractLectureNum = (text) => {
                        if (!text) return '';
                        const match = text.match(/第([0-9０-９一二三四五六七八九十]+)讲/);
                        if (match) return match[1];
                        return '';
                    };

                    // 尝试从导航菜单提取
                    const navItems = document.querySelectorAll('.nav-text, .node-text');
                    for (const item of navItems) {
                        if (item.textContent.includes('章')) {
                            const num = extractChapterNum(item.textContent);
                            if (num) {
                                chapterNum = num;
                                // 检查是否是当前章节
                                const parent = item.closest('.nav-item');
                                if (parent && (parent.classList.contains('current') ||
                                    item.classList.contains('current') ||
                                    parent.querySelector('.current'))) {
                                    break; // 找到当前章节后停止
                                }
                            }
                        }
                    }

                    // 尝试从讲次导航提取
                    const subNavItems = document.querySelectorAll('.sub-nav-text');
                    for (const item of subNavItems) {
                        if (item.textContent.includes('讲')) {
                            const num = extractLectureNum(item.textContent);
                            if (num && item.classList.contains('current')) {
                                lectureNum = num;
                                break;
                            }
                        }
                    }

                    // 备选方法：从面包屑提取
                    if (!chapterNum || !lectureNum) {
                        const breadcrumbs = document.querySelectorAll('.breadcrumb a, .breadcrumb span, .breadcrumb li');
                        for (const crumb of breadcrumbs) {
                            if (!chapterNum && crumb.textContent.includes('章')) {
                                chapterNum = extractChapterNum(crumb.textContent);
                            }
                            if (!lectureNum && crumb.textContent.includes('讲')) {
                                lectureNum = extractLectureNum(crumb.textContent);
                            }
                        }
                    }

                    // 备选方法：从标题元素提取
                    if (!chapterNum || !lectureNum) {
                        const titleElements = document.querySelectorAll('h1, h2, h3, h4, .title, .chapter-title');
                        for (const elem of titleElements) {
                            if (!chapterNum && elem.textContent.includes('章')) {
                                chapterNum = extractChapterNum(elem.textContent);
                            }
                            if (!lectureNum && elem.textContent.includes('讲')) {
                                lectureNum = extractLectureNum(elem.textContent);
                            }
                        }
                    }

                    // 组合文件名前缀
                    let fileNamePrefix = '';
                    if (chapterNum) {
                        fileNamePrefix += `第${chapterNum}章`;
                        if (lectureNum) {
                            fileNamePrefix += `第${lectureNum}讲 `;
                        } else {
                            fileNamePrefix += ' ';
                        }
                    }

                    // 如果找不到测试题名称，则使用默认值
                    if (!examName || examName.length < 2) {
                        examName = '智慧校园题库';
                    }

                    // 组合文件名
                    let fileName = fileNamePrefix + examName;

                    // 清理文件名中的非法字符
                    fileName = fileName.replace(/[\\/:*?"<>|]/g, '_');

                    // 将工作表添加到工作簿 (使用文件名前30个字符作为工作表名)
                    let sheetName = fileName;
                    if (sheetName.length > 30) {
                        sheetName = sheetName.substring(0, 30);
                    }
                    XLSX.utils.book_append_sheet(wb, ws, sheetName);

                    // 生成并下载文件
                    XLSX.writeFile(wb, fileName + '.xlsx');

                    log(`题库已导出为: ${fileName}.xlsx`);
                    this.$message.success('题库导出成功！');
                } catch (error) {
                    log(`导出Excel出错: ${error.message}`);
                    this.$message.error(`导出失败: ${error.message}`);
                }
            },
            clearLogs() {
                // 清空所有现有日志
                this.logs = [];
                setting.logs = [];

                // 添加清除提示
                const clearMessage = [
                    '日志已清除',
                    '------------------------',

                ];

                // 直接设置新的日志数组，而不是使用 log 函数
                this.logs = clearMessage;
                setting.logs = [...clearMessage];

                // 阻止其他日志添加
                setTimeout(() => {
                    // 确保清除状态保持
                    if (this.logs.length > clearMessage.length) {
                        this.logs = [...clearMessage];
                        setting.logs = [...clearMessage];
                    }
                }, 200);
            },
            // 视频快速完成
            videoSkip() {
                const pageType = checkPageType();
                if (pageType !== 'video') {
                    this.$message.warning('当前页面不是视频页面，请在视频页面使用此功能');
                    log('秒过视频功能仅在视频页面有效');
                    return;
                }

                log('正在尝试秒过视频...');
                try {
                    // 尝试使用JWPlayer API
                    if (typeof jwplayer === 'function' && jwplayer("mediaplayer")) {
                        const jwp = jwplayer("mediaplayer");
                        // 设置静音
                        jwp.setMute(true);
                        log("已通过JWPlayer API静音视频");

                        // 获取视频时长并跳至结尾
                        const duration = jwp.getDuration() || 0;
                        if (duration > 0) {
                            jwp.seek(duration - 1);
                            log(`已将JWPlayer视频进度设置为结束位置（${Math.floor(duration)}秒）`);

                            setTimeout(() => {
                                log('JWPlayer视频即将自动结束，请等待系统记录完成状态');
                                this.$message.success('视频已跳至结尾，即将自动完成');
                            }, 500);
                            return;
                        }
                    }

                    // 尝试找到HTML5视频元素
                    const videoPlayer = document.querySelector('video');
                    if (!videoPlayer) {
                        log('未找到视频元素，请确认页面已完全加载');
                        this.$message.error('未找到视频元素，请刷新页面重试');
                        return;
                    }

                    // 设置视频当前时间为接近结尾
                    const duration = videoPlayer.duration || 0;
                    if (duration <= 0) {
                        log('无法获取视频时长，请等待视频加载完成');
                        this.$message.warning('请等待视频加载完成后再试');
                        return;
                    }

                    // 设置为视频末尾前几秒
                    videoPlayer.muted = true;
                    videoPlayer.currentTime = duration - 1;
                    log(`已将HTML5视频进度设置为结束位置（${Math.floor(duration)}秒）`);

                    // 模拟视频播放完成事件
                    setTimeout(() => {
                        videoPlayer.play();
                        log('视频即将自动结束，请等待系统记录完成状态');
                        this.$message.success('视频已跳至结尾，即将自动完成');
                    }, 500);
                } catch (error) {
                    log('秒过视频时出错: ' + error.message);
                    this.$message.error('秒过视频失败: ' + error.message);
                }
            },
            // 显示更多功能菜单
            showMoreMenu() {
                const menu = document.getElementById('moreMenu');
                if (!menu) {
                    console.error('菜单元素不存在');
                    return;
                }

                // 切换显示状态
                if (menu.classList.contains('show')) {
                    menu.classList.remove('show');
                } else {
                    // 确保菜单显示在正确位置
                    const button = document.querySelector('.button-container .main-button:nth-child(3)');
                    if (button) {
                        const rect = button.getBoundingClientRect();

                        // 设置菜单位置属性
                        menu.style.position = 'fixed';
                        menu.style.top = (rect.bottom + 2) + 'px';
                        menu.style.left = rect.left + 'px'; // 左对齐
                        menu.style.width = rect.width + 'px'; // 设置精确宽度与按钮相同
                        menu.style.right = 'auto'; // 清除之前的right值

                        // 添加阴影和过渡效果，提升视觉体验
                        menu.style.boxShadow = '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)';
                        menu.style.transition = 'all 0.2s ease';

                        // 记录菜单位置，便于调试
                        console.log(`菜单位置: top=${menu.style.top}, left=${menu.style.left}, width=${menu.style.width}`);
                    }

                    // 先移除其他可能的事件监听器
                    document.removeEventListener('click', this.closeMenuHandler);

                    // 显示菜单
                    menu.classList.add('show');

                    // 存储关闭函数引用，以便之后可以正确移除
                    this.closeMenuHandler = (e) => {
                        if (!menu.contains(e.target) &&
                            !e.target.closest('.main-button:nth-child(3)')) {
                            menu.classList.remove('show');
                            document.removeEventListener('click', this.closeMenuHandler);
                        }
                    };

                    // 延迟添加事件监听，避免立即触发
                    setTimeout(() => {
                        document.addEventListener('click', this.closeMenuHandler);
                    }, 100);
                }
            },
            // 打开设置对话框
            openSettings() {
                // 直接调用详细设置对话框函数
                createInitialSettingsModal(false);
            },
            // 显示使用教程
            showTutorial() {
                try {
                    // 移除已有的模态框
                    const existingModals = document.querySelectorAll('#custom-tutorial-modal');
                    existingModals.forEach(modal => {
                        if (modal.parentNode) {
                            modal.parentNode.removeChild(modal);
                        }
                    });

                    // 创建自定义模态框（不依赖antd）
                    const modalHTML = `
                        <div id="custom-tutorial-modal" style="
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background-color: rgba(0, 0, 0, 0.5);
                            display: flex;
                            justify-content: center;
                            align-items: flex-start;
                            padding-top: 50px;
                            z-index: 100000;
                            animation: fadeIn 0.3s;
                        ">
                            <div style="
                                background-color: white;
                                width: 700px;
                                border-radius: 4px;
                                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                                display: flex;
                                flex-direction: column;
                                max-height: 80vh;
                                animation: slideDown 0.3s;
                            ">
                                <div style="
                                    padding: 16px;
                                    border-bottom: 1px solid #f0f0f0;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                ">
                                    <h3 style="margin: 0; font-size: 16px;">宜宾智慧校园助手使用教程</h3>
                                    <button id="close-tutorial-button" style="
                                        border: none;
                                        background: none;
                                        font-size: 16px;
                                        cursor: pointer;
                                        color: #999;
                                    ">×</button>
                                </div>
                                <div style="
                                    padding: 24px;
                                    overflow-y: auto;
                                    max-height: calc(80vh - 120px);
                                ">
                                    <div id="tutorial-content"></div>
                                </div>
                                <div style="
                                    padding: 12px 16px;
                                    border-top: 1px solid #f0f0f0;
                                    text-align: right;
                                ">
                                    <button id="ok-tutorial-button" style="
                                        padding: 8px 15px;
                                        background-color: #1890ff;
                                        color: white;
                                        border: none;
                                        border-radius: 4px;
                                        cursor: pointer;
                                    ">我知道了</button>
                                </div>
                            </div>
                        </div>
                    `;

                    // 添加动画样式
                    const style = document.createElement('style');
                    style.textContent = `
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes slideDown {
                            from { transform: translateY(-20px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                        #custom-tutorial-modal h3 {
                            margin-top: 20px;
                            margin-bottom: 10px;
                            font-weight: 500;
                            color: #333;
                        }
                        #custom-tutorial-modal ul, #custom-tutorial-modal ol {
                            padding-left: 20px;
                            margin-bottom: 16px;
                        }
                        #custom-tutorial-modal li {
                            margin-bottom: 8px;
                        }
                        #custom-tutorial-modal strong {
                            font-weight: 600;
                            color: #1890ff;
                        }
                        #ok-tutorial-button:hover {
                            background-color: #40a9ff;
                        }
                        #close-tutorial-button:hover {
                            color: #333;
                        }
                    `;
                    document.head.appendChild(style);

                    // 添加模态框到DOM
                    document.body.insertAdjacentHTML('beforeend', modalHTML);

                    // 获取内容容器
                    const contentContainer = document.getElementById('tutorial-content');
                    if (!contentContainer) {
                        throw new Error('教程内容容器不存在');
                    }

                    // 填充教程内容
                    const tutorialHTML = `
                        <h3>基本功能</h3>
                        <ul>
                            <li><strong>自动学习：</strong>点击"自动学习"按钮，脚本会自动完成视频观看和文档阅读，不需手动操作。再次点击可暂停学习。</li>
                            <li><strong>清除进度：</strong>清除已保存的学习进度，重新开始学习。</li>
                            <li><strong>更多功能：</strong>点击后弹出菜单，包含自动答题、秒过视频、导出题库、清除日志、使用教程和答题设置等功能。</li>
                            <li><strong>自动答题：</strong>在答题页面自动填写答案（需要先获取题库）。系统会自动识别题目并填入正确答案。</li>
                            <li><strong>秒过视频：</strong>立即完成当前视频学习，标记为已完成。适用于不想等待视频播放完成的情况。</li>
                            <li><strong>导出题库：</strong>将已获取的答案导出为Excel文件，方便离线查看。文件会按章节和讲次命名，题目按序号排序。</li>
                            <li><strong>清除日志：</strong>清空运行日志面板，保持界面整洁。</li>
                            <li><strong>答题设置：</strong>设置是否自动提交答案和是否自动进入考试。可以根据个人需求自定义答题行为。</li>
                        </ul>

                        <h3>视频静音功能</h3>
                        <ul>
                            <li><strong>全局自动静音：</strong>脚本在启动时自动为所有视频静音，包括HTML5视频和JWPlayer播放器。</li>
                            <li><strong>兼容多种播放器：</strong>支持HTML5标准视频元素和特定课程使用的JWPlayer播放器。</li>
                            <li><strong>静音监控：</strong>脚本会持续监控页面变化，对新加载的视频自动应用静音。</li>
                            <li><strong>播放完成跳转：</strong>视频播放完成后会自动切换到下一个学习内容，全程无声音打扰。</li>
                        </ul>

                        <h3>使用步骤</h3>
                        <ol>
                            <li>登录智慧校园平台后，脚本会自动加载并在页面右上角显示助手窗口。</li>
                            <li>首次使用时需要输入验证密钥完成验证（密钥有效期为2天）。</li>
                            <li>进入课程学习页面，点击【自动学习】开始自动完成视频观看和文档阅读任务。</li>
                            <li>如需暂停学习，再次点击【自动学习】按钮（此时按钮显示为【停止学习】）。</li>
                            <li>进入答题页面时，系统会自动获取答案并显示在答案列表中，点击顶部的【答案列表】标签可查看。</li>
                            <li>可以点击【更多功能】→【自动答题】自动填写答案，也可以手动查看答案进行填写。</li>
                            <li>完成答题后，可以点击【更多功能】→【导出题库】将答案保存为Excel文件，便于复习。</li>
                        </ol>

                        <h3>特别提示</h3>
                        <ul>
                            <li>验证密钥有效期默认为2天，到期后需重新验证。验证剩余时间显示在助手窗口标题栏右侧。</li>
                            <li>自动学习功能会保存进度，关闭页面后下次访问可以继续上次的学习进度。</li>
                            <li>为避免被系统检测，视频播放和文档阅读会模拟正常的学习行为，会有一定等待时间。</li>
                            <li>所有视频都会自动静音，避免多个视频同时播放造成声音干扰，可以安静学习。</li>
                            <li>导出的Excel文件会按题目序号自动排序，文件名包含章节和讲次信息，便于查找。</li>
                            <li>支持拖动插件窗口到合适位置，点击标题栏右侧的最小化按钮可隐藏插件，需要时再点击图标展开。</li>
                            <li>如果脚本运行不正常，请尝试刷新页面或重新安装最新版本的脚本。</li>
                        </ul>

                        <h3>界面说明</h3>
                        <ul>
                            <li><strong>运行日志：</strong>显示脚本执行过程中的操作记录和状态信息，帮助了解当前执行情况。</li>
                            <li><strong>答案列表：</strong>显示当前页面检测到的所有题目及答案，按序号排列，可直接查看正确答案。</li>
                            <li><strong>最小化按钮：</strong>点击标题栏右侧的按钮可以最小化助手窗口，再次点击可展开。</li>
                            <li><strong>更多功能菜单：</strong>点击【更多功能】按钮，展开包含自动答题、秒过视频等功能的下拉菜单。</li>
                        </ul>

                        <h3>快捷键</h3>
                        <ul>
                            <li><strong>Alt+A：</strong>自动答题 - 快速为当前页面的所有题目填写答案</li>
                            <li><strong>Alt+V：</strong>秒过视频 - 立即完成当前正在观看的视频</li>
                            <li><strong>Alt+L：</strong>开始/停止自动学习 - 切换自动学习状态</li>
                            <li><strong>Alt+E：</strong>导出题库 - 将答案导出为Excel文件</li>
                            <li><strong>Alt+H：</strong>显示/隐藏插件窗口 - 切换助手窗口的显示状态</li>
                        </ul>
                    `;

                    contentContainer.innerHTML = tutorialHTML;

                    // 添加ESC键关闭功能
                    function handleEscKey(e) {
                        if (e.key === 'Escape') {
                            closeModal();
                        }
                    }
                    document.addEventListener('keydown', handleEscKey);

                    // 添加关闭和确认按钮事件
                    function closeModal() {
                        const modal = document.getElementById('custom-tutorial-modal');
                        if (modal) {
                            modal.style.opacity = '0';
                            modal.style.transition = 'opacity 0.3s';
                            setTimeout(() => {
                                if (modal && modal.parentNode) {
                                    modal.parentNode.removeChild(modal);
                                }
                                // 移除样式以避免污染页面
                                if (style && style.parentNode) {
                                    style.parentNode.removeChild(style);
                                }
                            }, 300);
                        }
                        document.removeEventListener('keydown', handleEscKey);
                    }

                    // 绑定关闭按钮事件
                    const closeButton = document.getElementById('close-tutorial-button');
                    if (closeButton) {
                        closeButton.addEventListener('click', closeModal);
                    }

                    const okButton = document.getElementById('ok-tutorial-button');
                    if (okButton) {
                        okButton.addEventListener('click', closeModal);
                    }

                    // 点击背景关闭模态框
                    const modal = document.getElementById('custom-tutorial-modal');
                    if (modal) {
                        modal.addEventListener('click', function(e) {
                            if (e.target === this) {
                                closeModal();
                            }
                        });
                    }

                    // 记录日志
                    log('显示使用教程');

                } catch (error) {
                    console.error('打开教程模态框出错:', error);
                    alert('打开使用教程失败，请刷新页面后重试。\n错误信息: ' + error.message);
                }
            },
            // 优化拖动处理
            initDragEvents() {
                const box = document.querySelector('.rlBox');
                const dragZone = document.querySelector('.ant-card-head');
                let startX, startY, initialMouseX, initialMouseY;

                dragZone.addEventListener('mousedown', (e) => {
                    if (this.close) return; // 小化时禁止拖动
                    e.preventDefault();
                    this.isDragging = true;

                    const rect = box.getBoundingClientRect();
                    startX = rect.left;
                    startY = rect.top;
                    initialMouseX = e.clientX;
                    initialMouseY = e.clientY;

                    box.style.transition = 'none';
                    document.body.style.userSelect = 'none';
                });

                document.addEventListener('mousemove', (e) => {
                    if (!this.isDragging) return;

                    const dx = e.clientX - initialMouseX;
                    const dy = e.clientY - initialMouseY;

                    let newX = startX + dx;
                    let newY = startY + dy;

                    box.style.left = `${newX}px`;
                    box.style.top = `${newY}px`;
                    box.style.right = 'auto';

                    // 实时检查位置
                    this.checkPosition();
                });

                document.addEventListener('mouseup', () => {
                    if (this.isDragging) {
                        this.isDragging = false;
                        box.style.transition = 'all 0.2s';
                        document.body.style.userSelect = '';
                    }
                });

                // 添加摸支持
                dragZone.addEventListener('touchstart', (e) => {
                    const touch = e.touches[0];
                    const rect = box.getBoundingClientRect();
                    startX = rect.left;
                    startY = rect.top;
                    initialMouseX = touch.clientX;
                    initialMouseY = touch.clientY;
                    this.isDragging = true;
                });

                document.addEventListener('touchmove', (e) => {
                    if (!this.isDragging) return;
                    e.preventDefault();

                    const touch = e.touches[0];
                    const dx = touch.clientX - initialMouseX;
                    const dy = touch.clientY - initialMouseY;

                    let newX = startX + dx;
                    let newY = startY + dy;

                    const maxX = window.innerWidth - box.offsetWidth;
                    const maxY = window.innerHeight - box.offsetHeight;

                    newX = Math.min(Math.max(0, newX), maxX);
                    newY = Math.min(Math.max(0, newY), maxY);

                    box.style.left = `${newX}px`;
                    box.style.top = `${newY}px`;
                });

                document.addEventListener('touchend', () => {
                    this.isDragging = false;
                });
            },
            // 添加新方法
            saveLearningProgress() {
                try {
                    const currentChapter = document.querySelector('.nav-text.current');
                    const currentContent = document.querySelector('.tab-active .tab-inner');

                    if (currentChapter && this.autoLearning) {
                        // 获取当前页面URL和章节信息
                        const currentUrl = window.location.href;
                        const unitId = currentChapter.getAttribute('unitid');
                        const chapterName = currentChapter.querySelector('.node-text')?.textContent.trim() || '未知章节';

                        const progress = {
                            isLearning: this.autoLearning,
                            currentChapter: unitId,
                            currentContent: currentContent ? currentContent.getAttribute('itemid') : null,
                            currentContentName: currentContent ? currentContent.getAttribute('itemname') : null,
                            timestamp: Date.now(),
                            chapterName: chapterName,
                            currentUrl: currentUrl,
                            isPageSwitching: false
                        };

                        localStorage.setItem('learningProgress', JSON.stringify(progress));
                        setting.learningProgress = progress;

                        log(`学习进度已保存: ${chapterName}`);
                    }
                } catch (error) {
                    console.log('保存学习进度时出错:', error);
                }
            },
            checkLearningProgress() {
                try {
                    const savedProgress = localStorage.getItem('learningProgress');
                    if (savedProgress) {
                        const progress = JSON.parse(savedProgress);
                        const timeDiff = Date.now() - progress.timestamp;

                        // 如果保存时间在30分钟内且正在学习
                        if (timeDiff < 30 * 60 * 1000 && progress.isLearning) {
                            setting.learningProgress = progress;
                            log('检测到未完成的学习进度，准备恢复...');

                            // 设置自动学习状态
                            this.autoLearning = true;

                            // 等待页面完全加载
                            const waitForLoad = () => {
                                // 检查必要的DOM元素是否存在
                                const currentChapter = document.querySelector('.nav-text.current');
                                const tabInner = document.querySelector('.tab-inner');

                                if (!currentChapter || !tabInner) {
                                    log('等待页面加载...');
                                    setTimeout(waitForLoad, 1000);
                                    return;
                                }

                                // 获取当前章节信息
                                const chapterName = currentChapter.querySelector('.node-text')?.textContent.trim();
                                log(`恢复学习章节: ${chapterName || '未知章节'}`);

                                // 确保子章节列表展开
                                const subNav = currentChapter.closest('.nav-item.sup-item').querySelector('.sub-nav');
                                if (subNav) {
                                    subNav.style.display = 'block';
                                }

                                // 获取第一个内容标签
                                const firstTab = document.querySelector('.tab-inner');
                                if (firstTab) {
                                    log(`开始学习: ${firstTab.getAttribute('itemname')}`);
                                    firstTab.click();

                                    // 延迟启动学习
                                    setTimeout(() => {
                                        if (this.autoLearning) {
                                            log('开始自动学习...');
                                            this.processCurrentContent();
                                        }
                                    }, 1500);
                                } else {
                                    log('未找到可学习的内容，请刷新页面重试');
                                }
                            };

                            // 开始等待加载
                            setTimeout(waitForLoad, 2000);
                        } else {
                            localStorage.removeItem('learningProgress');
                        }
                    }
                } catch (error) {
                    console.error('检查学习进度时出错:', error);
                    log('恢复进度失败，请刷新页面重试');
                }
            },
            restoreLearningProgress() {
                try {
                    const progress = setting.learningProgress;
                    if (!progress || !progress.isLearning) return;

                    // 查找并点击对应章节
                    const chapterLink = document.querySelector(`.nav-text[unitid="${progress.currentChapter}"]`);
                    if (chapterLink) {
                        log('正在恢复上次的学习进度...');
                        chapterLink.click();

                        // 等待章节展开后点击对应内容
                        setTimeout(() => {
                            const contentLink = document.querySelector(`.tab-inner[itemid="${progress.currentContent}"]`);
                            if (contentLink) {
                                contentLink.click();

                                // 恢复自动学习状态
                                setTimeout(() => {
                                    this.autoLearning = true;
                                    this.processCurrentContent();
                                    log('学习进度已恢复，继续学习');
                                }, 1500);
                            }
                        }, 1000);
                    }
                } catch (error) {
                    console.log('恢复学习进度时出错:', error);
                }
            },
            // 添加清除进度方法
            clearProgress() {
                try {
                    localStorage.removeItem('learningProgress');
                    this.autoLearning = false;
                    log("已清除学习进度");
                    this.$message.success("学习进度已清除");
                } catch (error) {
                    log("清除进度失败: " + error.message);
                    this.$message.error("清除进度失败");
                }
            },
            // 新增方法：开始学习新章节
            startLearningNewChapter(chapter, chapterName) {
                const startLearning = () => {
                    const subNav = chapter.querySelector('.sub-nav');
                    if (!subNav) {
                        throw new Error("未找到子章节列表");
                    }

                    subNav.style.display = 'block';

                    // 获取第一个子章节
                    const firstSubChapter = subNav.querySelector('.sub-nav-text');
                    if (!firstSubChapter) {
                        throw new Error("未找到子章节");
                    }

                    log(`点击第一个子章节...`);
                    firstSubChapter.click();

                    // 等待子章节内容加载
                    setTimeout(() => {
                        // 获取并点击第一个内容标签
                        const tabList = document.querySelectorAll('.tab-inner');
                        if (!tabList || tabList.length === 0) {
                            throw new Error("未找到可学习的内容");
                        }

                        const firstTab = tabList[0];
                        log(`开始学习: ${firstTab.getAttribute('itemname')}`);
                        firstTab.click();

                        // 确保内容加载完成后开始学习
                        setTimeout(() => {
                            if (this.autoLearning) {
                                log(`开始自动学习新章节内容...`);
                                this.processCurrentContent();
                            }
                        }, 1500);
                    }, 1000);
                };

                // 重试机制
                let retryCount = 0;
                const maxRetries = 3;

                const tryStartLearning = () => {
                    try {
                        startLearning();
                    } catch (error) {
                        retryCount++;
                        if (retryCount < maxRetries) {
                            log(`启动学习失败，${maxRetries - retryCount}秒后重试...`);
                            setTimeout(tryStartLearning, 1000);
                        } else {
                            this.autoLearning = false;
                            log(`无法启动学习: ${error.message}`);
                            this.$message.error("无法启动学习，请手动点击内容或刷新页面");
                        }
                    }
                };

                // 延迟启动，确保DOM已更新
                setTimeout(tryStartLearning, 1000);
            },
            // 添加URL变化监听器
            initUrlChangeListener() {
                // 监听 popstate 事件
                window.addEventListener('popstate', () => {
                    this.handleUrlChange();
                });

                // 重写 pushState 和 replaceState 方法以捕获URL变化
                const originalPushState = window.history.pushState;
                const originalReplaceState = window.history.replaceState;

                window.history.pushState = function() {
                    originalPushState.apply(this, arguments);
                    window.vue.handleUrlChange();
                };

                window.history.replaceState = function() {
                    originalReplaceState.apply(this, arguments);
                    window.vue.handleUrlChange();
                };
            },

            // 处理URL变化
            handleUrlChange() {
                // 检查是否是章节页面
                if (location.pathname.includes('/study/unit/')) {
                    // 获取当前章节ID
                    const currentUnitId = location.pathname.match(/\/unit\/(\d+)/)?.[1];
                    if (currentUnitId) {
                        // 检查是否有保存的进度
                        const savedProgress = localStorage.getItem('learningProgress');
                        if (savedProgress) {
                            const progress = JSON.parse(savedProgress);

                            // 如果标记为页面正在切换状态，无论章节ID是否一致，都重新启动学习
                            if (progress.isLearning) {
                                if (progress.isPageSwitching || progress.currentChapter === currentUnitId) {
                                    log('检测到章节切换或URL变化，准备继续学习...');

                                    // 如果是切换页面状态，先更新进度状态，取消切换标记
                                    if (progress.isPageSwitching) {
                                        progress.isPageSwitching = false;
                                        progress.currentChapter = currentUnitId;
                                        localStorage.setItem('learningProgress', JSON.stringify(progress));
                                        setting.learningProgress = progress;
                                    }

                                    // 设置自动学习状态并启动学习
                                    this.autoLearning = true;
                                    setTimeout(() => {
                                        this.startLearningCurrentChapter();
                                    }, 2000); // 等待页面完全加载
                                }
                            }
                        }
                    }
                }
            },

            // 开始学习当前章节
            startLearningCurrentChapter() {
                try {
                    // 检查页面是否已加载完成
                    if (document.readyState !== 'complete') {
                        log("页面正在加载中，等待页面加载完成...");
                        setTimeout(() => {
                            if (this.autoLearning) {
                                this.startLearningCurrentChapter();
                            }
                        }, 1000);
                        return;
                    }

                    // 获取当前章节
                    const currentChapter = document.querySelector('.nav-text.current')?.closest('.nav-item.sup-item');
                    if (!currentChapter) {
                        log("未找到当前章节，等待DOM加载...");
                        setTimeout(() => {
                            if (this.autoLearning) {
                                this.startLearningCurrentChapter();
                            }
                        }, 2000);
                        return;
                    }

                    const chapterName = currentChapter.querySelector('.node-text')?.textContent.trim();
                    log(`准备学习章节: ${chapterName || '未知章节'}`);

                    // 展开子章节列表并开始学习
                    setTimeout(() => {
                        this.startLearningNewChapter(currentChapter, chapterName);
                    }, 1000); // 额外等待1秒确保DOM状态稳定
                } catch (error) {
                    log(`启动学习失败: ${error.message}`);
                    // 延迟重试
                    setTimeout(() => {
                        if (this.autoLearning) {
                            this.startLearningCurrentChapter();
                        }
                    }, 2000);
                }
            },
        }
    });
}

// 自动阅读文档功能
function autoReadDocument() {
    // 获取当前文档总页数
    const totalPages = parseInt(document.querySelector('.flexpaper_lblTotalPages')?.textContent.replace('/ ', '')) || 0;

    if(totalPages === 0) {
        log("未检测到文档页数，请确保文档已加载");
        return;
    }

    // 计算阅读时间和翻页间隔
    let totalReadingTime, pageInterval;

    if(totalPages < 10) {
        // 小于10页文档，使用固定1秒1页的速度
        totalReadingTime = totalPages;
        pageInterval = 1000; // 1秒1页
    } else if(totalPages > 50) {
        // 超过50页文档，固定30秒完成
        totalReadingTime = 30;
        pageInterval = Math.max(totalReadingTime / totalPages * 1000, 300); // 每页间隔时间(毫秒)，最小300ms
    } else {
        // 10-50页文档使用原有逻辑
        totalReadingTime = totalPages > 20 ? 20 : 10; // 超过20页固定20秒，否则10秒
        pageInterval = Math.max(totalReadingTime / totalPages * 1000, 300); // 每页间隔时间(毫秒)，最小300ms
    }

    log(`开始自动阅读文档，共${totalPages}页，预计用时${totalReadingTime}秒，翻页间隔${Math.round(pageInterval)}毫秒`);

    let currentPage = 1;
    const readInterval = setInterval(() => {
        if(currentPage > totalPages) {
            clearInterval(readInterval);
            log("文档阅读完成，准备切换到下一个内容");
            switchToNextContent();
            return;
        }

        // 模拟翻页
        const nextButton = document.querySelector('.flexpaper_bttnPrevNext');
        if(nextButton) {
            nextButton.click();
            log(`正在阅读第${currentPage}页，共${totalPages}页`);
            currentPage++;
        }
    }, pageInterval); // 使用计算出的翻页间隔
}

// 切换到下一个内容
function switchToNextContent() {
    // 获取所有标签页
    const tabs = document.querySelectorAll('.tab-inner');
    let currentTabIndex = -1;

    // 找到当前激活的标签页
    tabs.forEach((tab, index) => {
        if(tab.parentElement.classList.contains('tab-active')) {
            currentTabIndex = index;
        }
    });

    // 如果还有下一个标签页，则切换
    if(currentTabIndex < tabs.length - 1) {
        const nextTab = tabs[currentTabIndex + 1];
        log(`切换到下一个内容: ${nextTab.getAttribute('itemname')}`);

        // 根据内容类型执行不同操作
        const itemType = nextTab.getAttribute('itemtype');
        nextTab.click();

                        setTimeout(() => {
            if(itemType === '10') { // 视频类型
                passVideo();
            } else if(itemType === '20') { // 文档类型
                autoReadDocument();
            }
        }, 1500);
    } else {
        log("已完成所有内容学习");
    }
}

// 初始化获取答案，延迟5秒防止流程崩溃
function initGetAnswer(settings){
    var url = location.origin + settings.url;
    var data = settings.data.replace(/(testPaperId=).*?(&)/,'$1' + '1250' + '$2');
    console.log("=====")
    console.log(url,'url')
    console.log(data)
    getAnswer(url,data);
}

// 添加答案检查函数
function checkAnswers() {
    return new Promise((resolve) => {
        let checkCount = 0;
        const maxChecks = 30; // 最多等待30秒

        function check() {
            if (setting.datas && setting.datas.length > 0) {
                log("答案已获取完成，开始答题...");
                resolve(true);
            } else if (checkCount >= maxChecks) {
                log("等待答案超时，请确保答案已正确获取");
                resolve(false);
            } else {
                checkCount++;
                log(`等待答案获取中...(${checkCount}/${maxChecks})`);
                setTimeout(check, 1000);
            }
        }

        check();
    });
}

// 添加答案查找函数
function findAnswerForQuestion(questionText) {
    if (!setting.datas || setting.datas.length === 0) {
        return null;
    }

    // 清理题目文本
    const cleanedQuestionText = cleanHtmlTags(questionText).trim();

    // 在答案列表中查找匹配的题目
    for (const answerData of setting.datas) {
        const cleanedAnswerQuestion = cleanHtmlTags(answerData.question).trim();

        // 检查题目是否匹配
        if (cleanedQuestionText.includes(cleanedAnswerQuestion) ||
            cleanedAnswerQuestion.includes(cleanedQuestionText)) {
            return answerData.answer;
        }
    }

    return null;
}

// 修改自动答题函数
async function autoAnswerQuestions() {
    log("准备自动答题...");

  // 获取所有题目
  const questions = document.querySelectorAll('.view-test');
  if(!questions || questions.length === 0) {
        log("未找到题目，请确认是否在答题页面");
                    return;
                }

  log(`共发现 ${questions.length} 道题目`);
    let answeredCount = 0;

    // 遍历每个题目
    for (let index = 0; index < questions.length; index++) {
        const question = questions[index];
        try {
    // 获取题目类型
    const isMultiChoice = question.querySelector('.t-option .input-c') !== null; // 多选
    const isSingleChoice = question.querySelector('.t-option .input-r') !== null; // 单选
            const isFillBlank = question.querySelector('.fillblank') !== null; // 填空

            // 获取题目文本
            const questionText = question.querySelector('.test-text-tutami')?.textContent.trim();
            if(!questionText) {
                log(`第 ${index + 1} 题未找到题目文本`);
                continue;
            }

            // 查找答案
            const answer = findAnswerForQuestion(questionText);
            if(!answer) {
                log(`第 ${index + 1} 题未找到匹配的答案`);
                continue;
            }

            log(`正在答第 ${index + 1} 题...`);

            // 根据题型填写答案
    if(isMultiChoice) {
                // 处理多选题
                const answerLetters = answer.split('\n').map(a => a.trim().charAt(0));
        const options = question.querySelectorAll('.t-option');
        options.forEach((option, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    if(answerLetters.includes(letter)) {
            const checkbox = option.querySelector('.input-c');
            if(checkbox && !checkbox.classList.contains('selected')) {
              checkbox.click();
                            log(`  - 选择了选项 ${letter}`);
            }
          }
        });
                answeredCount++;
    } else if(isSingleChoice) {
                // 处理单选题
                const answerLetter = answer.trim().charAt(0);
      const options = question.querySelectorAll('.t-option');
      options.forEach((option, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    if(letter === answerLetter) {
          const radio = option.querySelector('.input-r');
          if(radio && !radio.classList.contains('selected')) {
            radio.click();
                            log(`  - 选择了选项 ${letter}`);
          }
        }
      });
                answeredCount++;
    } else if(isFillBlank) {
                // 处理填空题
                const input = question.querySelector('.fillblank');
      if(input) {
                    const fillAnswer = answer.replace(/^.*?\./, '').trim();
                    input.value = fillAnswer;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    log(`  - 填写答案: ${fillAnswer}`);
                    answeredCount++;
                }
            }
        } catch(error) {
            log(`第 ${index + 1} 题答题出错: ${error.message}`);
        }
    }

    log(`自动答题完成！成功答题 ${answeredCount} 道题目`);

    // 如果启用了自动提交
    if(setting.autoSubmit) {
        const submitBtn = document.querySelector('#submit_exam');
        if(submitBtn) {
            log("准备自动提交答案...");
                        setTimeout(() => {
                submitBtn.click();

                // 监听确认对话框并自动点击"坚持提交"
                log("等待确认对话框...");
                const checkConfirmDialog = setInterval(() => {
                    const confirmBtn = document.querySelector('.d-button.d-state-highlight[value="坚持提交"]');
                    if(confirmBtn) {
                        clearInterval(checkConfirmDialog);
                        log("检测到确认对话框，自动点击'坚持提交'");
                            setTimeout(() => {
                            confirmBtn.click();

                            // 监听页面变化，等待返回测验列表页
                            log("等待返回测验列表页...");
                            setTimeout(() => {
                                if(window.vue && window.vue.autoLearning) {
                                    log("检测自动学习状态，准备继续下一内容...");
                                    setTimeout(() => {
                                        // 尝试获取页面类型
                                        const pageType = checkPageType();
                                        // 如果已经回到测验页面，继续学习
                                        if(pageType === 'quiz') {
                                            window.vue.switchToNextContent();
                                        }
                                    }, 2000);
                                }
                            }, 3000);
                        }, 500);
                    }
                }, 500);

                // 5秒后清除定时器，避免无限循环
                setTimeout(() => {
                    clearInterval(checkConfirmDialog);
                }, 5000);
            }, 1000);
        } else {
            log("未找到提交按钮，请手动提交");
        }
    } else {
        if(window.vue) {
            window.vue.$message.info('答题完成，请检查后手动提交');
        }
    }
}

// 添加自动答题按钮
function addAutoAnswerButton() {
  const btnArea = document.querySelector('.practice-action');
  if(!btnArea) return;

  const btn = document.createElement('a');
  btn.innerText = '自动答题';
  btn.className = 'btn-public btn-min';
  btn.href = 'javascript:void(0)';
  btn.onclick = autoAnswerQuestions;

  btnArea.appendChild(btn);
  log("已添加自动答题按钮");
}

// 初始化
function initAutoAnswer() {
  if(location.href.includes('/examSubmit/')) {
    log("检测到答题页面");
    setTimeout(addAutoAnswerButton, 2000);
  }
}

initAutoAnswer();

// 脚本入口
initView();
//监听跳过视频按钮
$('#rl_passVideo').click(function(){passVideo();});
//监听url访问，当访问了加载题目的url时，将获取答案
$(document).ready(function(){
    $(document).ajaxComplete(function (evt, request, settings) {
        if(settings.url.search('getExamPaper') != -1){
            setting.logs.unshift("您已打开作业界面，5秒后将为您获取答案")
            setTimeout(initGetAnswer,5000, settings);
        }
    });
})

// 获取验证时间的函数
function getValidTime() {
    try {
        const data = localStorage.getItem('scriptValidUntil');
        if (!data) return null;

        const { time, hash } = JSON.parse(data);
        if (!time || !hash) return null;

        // 验证哈希值
        if (hash !== CryptoJS.SHA256(time.toString()).toString()) {
            localStorage.removeItem('scriptValidUntil');
            return null;
        }

        return time;
    } catch (e) {
        console.error('获取验证时间出错：', e);
        localStorage.removeItem('scriptValidUntil');
        return null;
    }
}

// 在界面中添加自动学习按钮
function addAutoLearnButton() {
    const buttonGroup = document.querySelector('.ant-btn-group');
    if(!buttonGroup) return;

    const autoLearnBtn = document.createElement('button');
    autoLearnBtn.className = 'ant-btn ant-btn-primary';
    autoLearnBtn.style.width = '25%';
    autoLearnBtn.innerHTML = '<span>自动学习</span>';
    autoLearnBtn.onclick = () => window.vue.startAutoLearning();

    buttonGroup.appendChild(autoLearnBtn);
}

// 添加自动答题相关功能
function initAutoExam() {
    // 先检查页面类型
    const pageType = checkPageType();

    // 如果不是测验页面，直接返回
    if(pageType !== 'quiz') {
        return;
    }

    log("检测到测验页面，初始化答题功能...");

    // 添加配置按钮到界面
    const configBtn = document.createElement('button');
    configBtn.className = 'ant-btn ant-btn-primary';
    configBtn.innerHTML = `
        <span>答题设置</span>
    `;
    configBtn.onclick = showExamConfig;

    // 找到按钮区域并添加配置按钮
    const btnArea = document.querySelector('.ant-btn-group');
    if(btnArea) {
        btnArea.appendChild(configBtn);
        log("已添加答题设置按钮");
    }

    // 自动处理测验
    handleQuiz();
}

// 显示答题配置对话框
function showExamConfig() {
    const configHtml = `
        <div class="exam-config" style="padding: 20px;">
            <h3>答题设置</h3>
            <div style="margin: 10px 0;">
                <label>
                    <input type="checkbox" ${setting.autoSubmit ? 'checked' : ''} id="autoSubmit">
                    自动提交答案
                </label>
            </div>
            <div style="margin: 10px 0;">
                <label>
                    <input type="checkbox" ${setting.autoEnterExam ? 'checked' : ''} id="autoEnterExam">
                    自动进入考试
                </label>
            </div>
            <div style="margin-top: 20px;">
                <button class="ant-btn ant-btn-primary" onclick="saveExamConfig()">保存设置</button>
            </div>
                    </div>
                `;

    // 使用 ant-design-vue 的对话框显示配置
    if(window.vue) {
        window.vue.$info({
            title: '答题设置',
            content: configHtml,
            width: 400
        });
    }
}

// 保存答题配置
window.saveExamConfig = function() {
    setting.autoSubmit = document.getElementById('autoSubmit').checked;
    setting.autoEnterExam = document.getElementById('autoEnterExam').checked;

    // 保存到localStorage
    localStorage.setItem('examConfig', JSON.stringify({
        autoSubmit: setting.autoSubmit,
        autoEnterExam: setting.autoEnterExam
    }));

    if(window.vue) {
        window.vue.$message.success('设置已保存');
    }
}

// 加载保存的配置
function loadExamConfig() {
    try {
        const savedConfig = localStorage.getItem('examConfig');
        if(savedConfig) {
            const config = JSON.parse(savedConfig);
            // 使用默认值作为后备
            setting.autoSubmit = config.autoSubmit !== undefined ? config.autoSubmit : false;
            setting.autoEnterExam = config.autoEnterExam !== undefined ? config.autoEnterExam : true;
            log("已加载答题设置");
        } else {
            // 如果没有保存的配置，设置默认值
            setting.autoSubmit = false;
            setting.autoEnterExam = true;

            // 保存默认设置
                        localStorage.setItem('examConfig', JSON.stringify({
                autoSubmit: false,
                autoEnterExam: true
            }));
            log("已设置默认答题选项");
        }
    } catch(e) {
        console.error('加载答题配置失败:', e);
        // 出错时使用默认值
        setting.autoSubmit = false;
        setting.autoEnterExam = true;
    }
}

// 修改自动答题函数
function autoAnswerQuestions() {
    log("开始自动答题...");

    // 获取所有题目
    const questions = document.querySelectorAll('.view-test');
    if(!questions || questions.length === 0) {
        log("未找到题目，请确认是否在答题页面");
        return;
    }

    log(`共发现 ${questions.length} 道题目`);
    let answeredCount = 0;

    questions.forEach((question, index) => {
        try {
            // 获取题目类型
            const isMultiChoice = question.querySelector('.t-option .input-c') !== null; // 多选
            const isSingleChoice = question.querySelector('.t-option .input-r') !== null; // 单选
            const isFillBlank = question.querySelector('.fillblank') !== null; // 填空

            // 获取题目文本用于匹配答案
            const questionText = question.querySelector('.test-text-tutami')?.textContent.trim();
            if(!questionText) {
                log(`第 ${index + 1} 题未找到题目文本`);
                return;
            }

            // 在答案列表中查找匹配的答案
            const answer = findAnswerForQuestion(questionText);
            if(!answer) {
                log(`第 ${index + 1} 题未找到匹配的答案`);
                return;
            }

            // 根据题型填写答案
            if(isMultiChoice) {
                // 处理多选题
                const answerLetters = answer.split('\n').map(a => a.trim().charAt(0));
                const options = question.querySelectorAll('.t-option');
                options.forEach((option, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    if(answerLetters.includes(letter)) {
                        const checkbox = option.querySelector('.input-c');
                        if(checkbox && !checkbox.classList.contains('selected')) {
                            checkbox.click();
                        }
                    }
                });
                answeredCount++;
            } else if(isSingleChoice) {
                // 处理单选题
                const answerLetter = answer.trim().charAt(0);
                const options = question.querySelectorAll('.t-option');
                options.forEach((option, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    if(letter === answerLetter) {
                        const radio = option.querySelector('.input-r');
                        if(radio && !radio.classList.contains('selected')) {
                            radio.click();
                        }
                    }
                });
                answeredCount++;
            } else if(isFillBlank) {
                // 处理填空题
                const input = question.querySelector('.fillblank');
                if(input) {
                    input.value = answer.replace(/^.*?\./, '').trim();
                    // 触发input事件
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    answeredCount++;
                }
            }
        } catch(error) {
            log(`第 ${index + 1} 题答题出错: ${error.message}`);
        }
    });

    log(`自动答题完成！成功答题 ${answeredCount} 道题目`);

    // 如果启用了自动提交
    if(setting.autoSubmit) {
        const submitBtn = document.querySelector('#submit_exam');
        if(submitBtn) {
            log("准备自动提交答案...");
            setTimeout(() => {
                submitBtn.click();

                // 监听确认对话框并自动点击"坚持提交"
                log("等待确认对话框...");
                const checkConfirmDialog = setInterval(() => {
                    const confirmBtn = document.querySelector('.d-button.d-state-highlight[value="坚持提交"]');
                    if(confirmBtn) {
                        clearInterval(checkConfirmDialog);
                        log("检测到确认对话框，自动点击'坚持提交'");
                        setTimeout(() => {
                            confirmBtn.click();

                            // 监听页面变化，等待返回测验列表页
                            log("等待返回测验列表页...");
                            setTimeout(() => {
                                if(window.vue && window.vue.autoLearning) {
                                    log("检测自动学习状态，准备继续下一内容...");
                                    setTimeout(() => {
                                        // 尝试获取页面类型
                                        const pageType = checkPageType();
                                        // 如果已经回到测验页面，继续学习
                                        if(pageType === 'quiz') {
                                            window.vue.switchToNextContent();
                                        }
                                    }, 2000);
                                }
                            }, 3000);
                        }, 500);
                    }
                }, 500);

                // 5秒后清除定时器，避免无限循环
                setTimeout(() => {
                    clearInterval(checkConfirmDialog);
                }, 5000);
            }, 1000);
        } else {
            log("未找到提交按钮，请手动提交");
        }
    } else {
                        if(window.vue) {
            window.vue.$message.info('答题完成，请检查后手动提交');
        }
    }
}

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loadExamConfig();
    initAutoExam();
    initPageChangeListener();
});

// 修改页面类型识别逻辑
function checkPageType() {
    // 获取当前打开的标签页信息
    const activeTab = document.querySelector('.tab-active .tab-inner');
    if (!activeTab) {
        return null;
    }

    // 获取页面信息
    const itemType = activeTab.getAttribute('itemtype');
    const itemName = activeTab.getAttribute('itemname') || '';

    // 测验页面的多重判断条件
    const isQuiz = (
        // 1. 通过标题关键词判断
        itemName.includes('测试题') ||
        itemName.includes('测验题') ||
        itemName.includes('练习题') ||
        // 2. 通过页面元素判断
        document.querySelector('.h-commit-tip') !== null ||
        document.querySelector('.exam_submit_score') !== null ||
        document.querySelector('.enter_exam') !== null ||
        document.querySelector('.doObjExam') !== null ||
        // 3. 通过URL判断
        location.href.includes('/examSubmit/') ||
        // 4. 通过图标判断
        activeTab.querySelector('.icon-edit02') !== null ||
        // 5. 通过itemType判断
        itemType === '50' ||
        // 6. 通过页面结构判断
        document.querySelector('.h-result-table') !== null ||
        // 7. 通过提交次数信息判断
        document.querySelector('.h-commit-info') !== null ||
        // 8. 通过测验成绩表格判断(测验完成后的页面)
        document.querySelector('.exam-record-table') !== null
    );

    if (isQuiz) {
        // 检测是否为测验完成后的结果页面
        const isResultPage = (
            document.querySelector('.exam-record-table') !== null ||
            document.querySelector('.h-result-table') !== null ||
            (document.querySelector('.h-commit-tip') &&
             document.querySelector('.h-commit-tip').textContent.includes('已提交'))
        );

        if (isResultPage) {
            log("识别到测验结果页面，准备继续学习");
            // 如果是自动学习模式，则继续到下一内容
            if (window.vue && window.vue.autoLearning) {
                setTimeout(() => window.vue.switchToNextContent(), 1500);
            }
        }

        // 输出详细的识别信息
        log(`识别到测验页面:`);
        log(`- 标题: ${itemName}`);
        log(`- 类型: ${itemType}`);
        if (document.querySelector('.h-commit-tip')) {
            const submitInfo = document.querySelector('.h-commit-tip').textContent;
            log(`- 提交信息: ${submitInfo.trim()}`);
        }
        return 'quiz';
    }

    // 其他页面类型判断
    if (itemType === '10') {
        return 'video';
    } else if (itemType === '20') {
        return 'document';
    }

    return null;
}

// 修改handleQuiz函数中的答题逻辑
function handleQuiz() {
    log("检测到测验页面，准备处理...");

    // 检测是否是测验结果页面
    const isResultPage = (
        document.querySelector('.exam-record-table') !== null ||
        document.querySelector('.h-result-table') !== null ||
        (document.querySelector('.h-commit-tip') &&
         document.querySelector('.h-commit-tip').textContent.includes('已提交'))
    );

    if (isResultPage) {
        log("检测到测验已完成，准备继续下一个学习内容");
        if (window.vue && window.vue.autoLearning) {
            setTimeout(() => window.vue.switchToNextContent(), 1500);
        }
        return;
    }

    // 获取测验信息
    const quizInfo = {
        title: document.querySelector('.tab-active .tab-inner')?.getAttribute('itemname') || '未知测验',
        submitLimit: document.querySelector('.h-commit-info')?.textContent.match(/可提交次数：(\d+)次/) || ['', '未知'],
        timeLimit: document.querySelector('.h-commit-info')?.textContent.includes('不限时') ? '不限时' :
                  document.querySelector('.h-commit-info')?.textContent.match(/限时：(\d+)分钟/) || ['', '未知']
    };

    log(`测验信息:`);
    log(`- 标题: ${quizInfo.title}`);
    log(`- 提交次数限制: ${quizInfo.submitLimit[1]}次`);
    log(`- 时间限制: ${quizInfo.timeLimit === '不限时' ? '不限时' : quizInfo.timeLimit[1] + '分钟'}`);

    // 检查是否有"继续"按钮（未完成的测验）
    const enterBtn = document.querySelector('a.link-action.enter_exam');
    if(enterBtn) {
        const examId = enterBtn.id || '';
        log(`发现未完成的测验 (ID: ${examId})，准备继续答题...`);

        // 确保自动进入答题功能已启用
        if(setting.autoEnterExam) {
            log("自动进入答题已启用，即将进入答题页面...");

            // 模拟点击事件
            try {
                // 先尝试直接触发点击事件
                enterBtn.click();
                log("已触发进入答题页面");

                // 等待页面加载和答案获取
                waitForAnswersAndQuestions();

            } catch(error) {
                log(`进入答题页面时出错: ${error.message}`);
                log("请尝试手动点击'继续'按钮");
            }
        } else {
            log("自动进入答题已禁用，请手动点击'继续'按钮");
        }
        return;
    }

    // 检查是否已在答题页面
    const questions = document.querySelectorAll('.view-test');
    if(questions && questions.length > 0) {
        log(`已在答题页面，等待答案获取...`);
        waitForAnswersAndQuestions();
        return;
    }

    // 检查是否有开始答题按钮
    const startBtn = document.querySelector('.doObjExam');
    if(startBtn) {
        log("发现新测验，准备开始答题...");
        if(setting.autoEnterExam) {
            setTimeout(() => {
                startBtn.click();
                log("已自动开始答题");
                // 等待页面加载和答案获取
                waitForAnswersAndQuestions();
            }, 1000);
        } else {
            log("自动进入答题已禁用，请手动点击开始按钮");
        }
        return;
    }

    log("等待页面加载完成...");
}

// 修改等待答案和题目加载的函数
function waitForAnswersAndQuestions() {
    let checkCount = 0;
    const maxChecks = 30; // 最多等待30秒

    function check() {
        // 检查题目是否加载
        const questions = document.querySelectorAll('.view-test');
        if (!questions || questions.length === 0) {
            if (checkCount >= maxChecks) {
                log("等待题目加载超时，请刷新页面重试");
                return;
            }
            checkCount++;
            setTimeout(check, 1000);
            return;
        }

        // 检查答案是否已获取
        if (!setting.datas || setting.datas.length === 0) {
            if (checkCount >= maxChecks) {
                log("等待答案获取超时，请确保答案已正确获取");
                return;
            }
            checkCount++;
            setTimeout(check, 1000);
            return;
        }

        // 检查答案匹配情况
        checkAnswerMatching(questions).then(matchResult => {
            if (matchResult.success) {
                log("答案匹配检查完成：");
                log(`- 题目总数：${matchResult.totalQuestions}道`);
                log(`- 成功匹配：${matchResult.matchedCount}道`);
                if (matchResult.unmatchedQuestions.length > 0) {
                    log(`- 未匹配题目：${matchResult.unmatchedQuestions.join(', ')}题`);
                }

                if (matchResult.matchedCount > 0) {
                    // 开始自动答题
                    setTimeout(() => {
                        autoAnswerQuestions();
                    }, 1000);
                } else {
                    log("没有找到任何可匹配的答案，请检查答案是否正确");
                }
            } else {
                log("答案匹配检查失败，请刷新页面重试");
            }
        });
    }

    // 开始检查
    check();
}

// 添加答案匹配检查函数
async function checkAnswerMatching(questions) {
    try {
        const result = {
            success: true,
            totalQuestions: questions.length,
            matchedCount: 0,
            unmatchedQuestions: []
        };

        // 遍历所有题目进行检查
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const questionText = question.querySelector('.test-text-tutami')?.textContent.trim();

            if (!questionText) {
                result.unmatchedQuestions.push(i + 1);
                continue;
            }

            // 清理题目文本
            const cleanedQuestionText = cleanHtmlTags(questionText).trim();
            let matched = false;

            // 在答案列表中查找匹配的题目
            for (const answerData of setting.datas) {
                const cleanedAnswerQuestion = cleanHtmlTags(answerData.question).trim();

                // 检查题目是否匹配
                if (cleanedQuestionText.includes(cleanedAnswerQuestion) ||
                    cleanedAnswerQuestion.includes(cleanedQuestionText)) {
                    result.matchedCount++;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                result.unmatchedQuestions.push(i + 1);
            }
        }

        return result;
                    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// 修改handleQuiz函数中的日志部分
function handleQuiz() {
    log("检测到测验页面，准备处理...");

    // 获取测验信息
    const quizInfo = {
        title: document.querySelector('.tab-active .tab-inner')?.getAttribute('itemname') || '未知测验',
        submitLimit: document.querySelector('.h-commit-info')?.textContent.match(/可提交次数：(\d+)次/) || ['', '未知'],
        timeLimit: document.querySelector('.h-commit-info')?.textContent.includes('不限时') ? '不限时' :
                  document.querySelector('.h-commit-info')?.textContent.match(/限时：(\d+)分钟/) || ['', '未知']
    };

    // 检查是否有"继续"按钮（未完成的测验）
    const enterBtn = document.querySelector('a.link-action.enter_exam');
    if(enterBtn) {
        const examId = enterBtn.id || '';
        log(`准备继续答题 (ID: ${examId})`);

        if(setting.autoEnterExam) {
            try {
                enterBtn.click();
                waitForAnswersAndQuestions();
            } catch(error) {
                log(`进入答题页面时出错: ${error.message}`);
                log("请尝试手动点击'继续'按钮");
            }
        } else {
            log("自动进入答题已禁用，请手动点击'继续'按钮");
        }
        return;
    }

    // 检查是否已在答题页面
    const questions = document.querySelectorAll('.view-test');
    if(questions && questions.length > 0) {
        waitForAnswersAndQuestions();
        return;
    }

    // 检查是否有开始答题按钮
    const startBtn = document.querySelector('.doObjExam');
    if(startBtn) {
        if(setting.autoEnterExam) {
            setTimeout(() => {
                startBtn.click();
                waitForAnswersAndQuestions();
            }, 1000);
        } else {
            log("自动进入答题已禁用，请手动点击开始按钮");
        }
        return;
    }
}

// 添加页面变化监听
function initPageChangeListener() {
    // 监听标签页切换
    const tabContainer = document.querySelector('.tabs');
    if(tabContainer) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if(mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const pageType = checkPageType();
                    if(pageType === 'quiz') {
                        log("检测到切换到测验页面");
                        handleQuiz();
                    }
                }
            });
        });

        observer.observe(tabContainer, {
            attributes: true,
            subtree: true,
            attributeFilter: ['class']
        });
    }
}

// 添加全局视频静音功能
function initGlobalMute() {
    log("初始化全局视频静音功能...");

    // 自动静音所有HTML5视频元素，处理已存在的视频
    function muteAllVideos() {
        const videos = document.getElementsByTagName('video');
        if (videos.length > 0) {
            for (let i = 0; i < videos.length; i++) {
                videos[i].muted = true;
                log(`已自动静音第${i+1}个HTML5视频`);
            }
        }

        // 尝试使用JWPlayer API静音
        try {
            if (typeof jwplayer === 'function' && jwplayer("mediaplayer")) {
                jwplayer("mediaplayer").setMute(true);
                log("已通过JWPlayer API静音视频");
            }
        } catch (error) {
            log("JWPlayer静音尝试失败，等待视频加载: " + error.message);
        }
    }

    // 初始执行一次静音
    muteAllVideos();

    // 监听视频DOM变化，对新加载的视频执行静音
    const videoObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // 检查新增节点中是否有视频
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    // 如果节点本身是视频
                    if (node.nodeName && node.nodeName.toLowerCase() === 'video') {
                        node.muted = true;
                        log("检测到新视频已加载，已自动静音");
                    }
                    // 如果是容器节点，检查其中的视频
                    else if (node.getElementsByTagName) {
                        const newVideos = node.getElementsByTagName('video');
                        if (newVideos.length > 0) {
                            for (let j = 0; j < newVideos.length; j++) {
                                newVideos[j].muted = true;
                                log("检测到容器中的新视频，已自动静音");
                            }
                        }
                    }
                }
            }
        });

        // 每次DOM变化都尝试使用JWPlayer API静音
        try {
            if (typeof jwplayer === 'function' && jwplayer("mediaplayer")) {
                jwplayer("mediaplayer").setMute(true);
            }
        } catch (error) {
            // 忽略错误，JWPlayer可能还未加载
        }
    });

    // 观察整个文档的变化
    videoObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 周期性检查以确保视频保持静音状态
    setInterval(muteAllVideos, 2000);

    log("全局视频静音功能已初始化");
}
