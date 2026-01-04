// ==UserScript==
// @name         阿里巴巴国际站AI产品标题生成器
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在阿里巴巴国际站发品页面生成AI产品标题和关键词组，支持纯英文输出、谷歌搜索和AI API集成
// @author       You
// @license      You
// @match        https://post.alibaba.com/*
// @match        https://www.alibaba.com/product/post*
// @match        https://seller.alibaba.com/product/post*
// @connect      api.deepseek.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/545407/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99AI%E4%BA%A7%E5%93%81%E6%A0%87%E9%A2%98%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/545407/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99AI%E4%BA%A7%E5%93%81%E6%A0%87%E9%A2%98%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // AI API配置
    const AI_CONFIG = {
        volcengine: {
            name: '火山引擎',
            urls: [
                'https://open.volcengineapi.com/v1/chat/completions',
                'https://api.volcengine.com/v1/chat/completions',
                'https://open.volcengineapi.com.cn/v1/chat/completions'
            ],
            model: 'doubao-v1.5-32k'
        },
        deepseek: {
            name: 'DeepSeek',
            urls: ['https://api.deepseek.com/v1/chat/completions'],
            model: 'deepseek-reasoner'
        },
        baidu: {
            name: '百度文心一言',
            urls: ['https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions'],
            model: 'ernie-bot-4'
        },
        aliyun: {
            name: '阿里云通义千问',
            urls: ['https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'],
            model: 'qwen-turbo'
        },
        openai: {
            name: 'OpenAI',
            urls: ['https://api.openai.com/v1/chat/completions'],
            model: 'gpt-3.5-turbo'
        },
        siliconflow: {
            name: '硅基流动',
            urls: ['https://api.siliconflow.cn/v1/chat/completions'],
             model: 'deepseek-ai/DeepSeek-R1'
        }
    };

    // 等待页面加载完成
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                } else {
                    setTimeout(check, 100);
                }
            }

            check();
        });
    }

    // 创建生成按钮
    function createGenerateButton() {
        const button = document.createElement('button');
        button.id = 'ai-title-generator-btn';
        button.innerHTML = '🤖 AI生成标题-树洞先生';
        button.style.cssText = `
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            z-index: 10000;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            white-space: nowrap;
        `;

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-50%) scale(1.05)';
            button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(-50%) scale(1)';
            button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        });

        return button;
    }

    // 查找商品名称标签并定位按钮
    function findProductNameLabel() {
        // 首先尝试查找包含"商品名称"文本的label
        const allLabels = document.querySelectorAll('label');
        for (const label of allLabels) {
            const text = label.textContent || label.innerText || '';
            if (text.includes('商品名称')) {
                return label;
            }
        }

        // 尝试查找包含帮助图标的label
        const labelsWithHelp = document.querySelectorAll('label:has(.next-icon-help), label .next-icon-help');
        for (const element of labelsWithHelp) {
            const label = element.closest('label') || element;
            if (label) {
                return label;
            }
        }

        // 尝试查找特定的类名组合
        const selectors = [
            'label.oly-label-container.sell-o-addon-label',
            '.oly-label-container.sell-o-addon-label',
            'label.oly-label-container',
            '.sell-o-addon-label',
            'label[class*="oly-label"]',
            'label[class*="sell-o"]'
        ];

        for (const selector of selectors) {
            try {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    const text = element.textContent || element.innerText || '';
                    if (text.includes('商品名称') || text.includes('产品名称') ||
                        text.includes('Product Name') || text.includes('Title') ||
                        element.querySelector('.next-icon-help')) {
                        return element;
                    }
                }
            } catch (e) {
                // 忽略不支持的选择器
                continue;
            }
        }

        // 最后尝试查找包含"商品名称"的任何元素
        const allElements = document.querySelectorAll('*');
        for (const element of allElements) {
            const text = element.textContent || element.innerText || '';
            if (text.includes('商品名称') && (element.tagName === 'LABEL' || element.closest('label'))) {
                const label = element.tagName === 'LABEL' ? element : element.closest('label');
                return label;
            }
        }

        return null;
    }

    // 定位按钮到商品名称标签右侧
    function positionButtonToProductName() {
        let tryCount = 0;
        const maxTries = 25; // 最多查找5秒
        function tryInsert() {
            const targetLabel = document.querySelector('label.oly-label-container.left.sell-o-addon-label.required');
            if (targetLabel) {
                const actionsWrapper = targetLabel.querySelector('.actions-wrapper');
                if (actionsWrapper) {
                    // 保持actions-wrapper原有布局不变
                    const parent = actionsWrapper.parentElement;
                    parent.style.position = 'relative';

                    const existingButton = document.getElementById('ai-title-generator-btn');
                    if (existingButton) existingButton.remove();
                    const button = createGenerateButton();
                    button.style.position = 'absolute';
                    button.style.right = '0';
                    button.style.top = '50%';
                    button.style.transform = 'translateY(-50%)';
                    button.style.height = actionsWrapper.offsetHeight + 'px';
                    button.style.lineHeight = actionsWrapper.offsetHeight + 'px';
                    button.style.fontSize = '14px';
                    button.style.boxSizing = 'border-box';
                    button.style.padding = '0 16px';
                    button.style.margin = '0';
                    button.style.zIndex = 10;
                    parent.appendChild(button);
                    button.addEventListener('click', () => {
                        const modal = document.getElementById('ai-title-modal');
                        if (modal) {
                            modal.style.display = 'flex';
                            if (typeof loadAPIConfig === 'function') loadAPIConfig();
                            if (typeof setupEventListeners === 'function') setupEventListeners(modal);
                        }
                    });
                    return true;
                }
            }
            tryCount++;
            if (tryCount < maxTries) {
                setTimeout(tryInsert, 200);
            } else {
                return false;
            }
            return false;
        }
        return tryInsert();
    }

    // 备用定位方案：直接查找包含"商品名称"的容器
    function positionButtonToProductNameBackup() {
        // 直接查找包含"商品名称"文本的oly-row-container
        const containers = document.querySelectorAll('.oly-row-container');
        for (const container of containers) {
            const text = container.textContent || container.innerText || '';
            if (text.includes('商品名称')) {
                container.style.position = 'relative';

                // 移除已存在的按钮
                const existingButton = document.getElementById('ai-title-generator-btn');
                if (existingButton) {
                    existingButton.remove();
                }

                // 创建并添加新按钮
                const button = createGenerateButton();
                container.appendChild(button);

                return true;
            }
        }

        return false;
    }

    // 创建弹窗
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'ai-title-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
            display: none;
            justify-content: center;
            align-items: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            width: 700px;
            max-width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            position: relative;
        `;

        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="margin: 0; color: #333; font-size: 20px;">AI产品标题生成器-树洞先生</h2>
                <button id="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">&times;</button>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">输入关键词（中文/英文）：</label>
                <input type="text" id="keyword-input" placeholder="请输入产品关键词，如：风扇、连衣裙、充电器..." style="
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e1e5e9;
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                    transition: border-color 0.3s ease;
                " />
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">AI API配置：</label>
                <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 10px;">
                    <select id="ai-provider" style="
                        padding: 8px 12px;
                        border: 2px solid #e1e5e9;
                        border-radius: 6px;
                        font-size: 14px;
                        background: white;
                    ">
                        <option value="local">本地生成（无需API）</option>
                        <option value="volcengine">火山引擎 API</option>
                        <option value="deepseek">DeepSeek API</option>
                        <option value="baidu">百度文心一言</option>
                        <option value="aliyun">阿里云通义千问</option>
                        <option value="openai">OpenAI API</option>
                        <option value="siliconflow">硅基流动 API</option>
                    </select>
                    <!-- 新增模型选择下拉框 -->
                    <select id="ai-model-select" style="
                        padding: 8px 12px;
                        border: 2px solid #e1e5e9;
                        border-radius: 6px;
                        font-size: 14px;
                        background: white;
                        min-width: 180px;
                    "></select>
                    <input type="text" id="api-key" placeholder="请输入API Key（可选）" style="
                        flex: 1;
                        padding: 8px 12px;
                        border: 2px solid #e1e5e9;
                        border-radius: 6px;
                        font-size: 14px;
                        box-sizing: border-box;
                    " />
                    <button id="test-api-btn" style="
                        background: #2196f3;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-size: 13px;
                        cursor: pointer;
                        margin-left: 4px;
                        transition: all 0.3s ease;
                    ">测试API</button>
                </div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">
                    <h5>💡支持硅基流动Kwai-Kolors/Kolors模型，官方免费使用，受邀好友作为新用户完成账号注册，立刻获得2000万 Tokens。注册地址：<a href="https://cloud.siliconflow.cn/i/qxNq11us" target="_blank" style="color:#2196f3;text-decoration:underline;">https://cloud.siliconflow.cn/i/qxNq11us</a></h5>
                    <b>本地生成规则：</b>可以根据自己产品的行业,去修改场景词,属性词等,还可以把关键词库弄上来<br>
                    <b>AI大模型生成规则：</b>大模型根据写的提示词生成标题和关键词,可以自己修改提示词,在1080行const prompt后面,也可更改每个AI的模型,比如选择OpenAI可以选择gpt-3.5-turbo或者gpt-4.o等等

                </div>
            </div>
            <!-- 自定义AI提示词输入区 start -->
            <div id="custom-prompt-area" style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">
                    自定义AI提示词（可选）：
                    <button id="toggle-prompt-visibility" style="margin-left:10px;font-size:12px;">隐藏/显示</button>
                </label>
                <textarea id="custom-prompt-input" placeholder="可自定义AI提示词，留空则用默认提示词" style="
                    width: 100%;
                    height: 60px;
                    padding: 10px;
                    border: 2px solid #e1e5e9;
                    border-radius: 6px;
                    font-size: 14px;
                    resize: vertical;
                    box-sizing: border-box;
                    background-color: #f8f9fa;
                    margin-bottom: 8px;
                "></textarea>
                <div style="display:flex;gap:8px;align-items:center;">
                    <button id="save-prompt-template-btn" style="font-size:12px;">保存为模板</button>
                    <select id="prompt-template-select" style="flex:1;font-size:12px;"></select>
                    <button id="delete-prompt-template-btn" style="font-size:12px;">删除模板</button>
                </div>
            </div>
            <!-- 自定义AI提示词输入区 end -->
            <div style="display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; margin-bottom: 8px;">
                <button id="generate-btn" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 6px 14px;
                    border-radius: 4px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">🤖 生成</button>
                <button id="import-to-form-btn" style="
                    background: #00bcd4;
                    color: white;
                    border: none;
                    padding: 6px 14px;
                    border-radius: 4px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">⏬ 一键导入标题关键词</button>
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">生成的标题：</label>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <textarea id="generated-title" readonly placeholder="AI生成的英文标题将显示在这里...\n如：Wireless Earbuds Bluetooth 5.3 Headphones, 40Hrs Playback Stereo Ear Buds with LED Display Charging Case IPX7 Waterproof in-Ear Earphones with Mic for Phone Tablet Laptop Sports, White" style="
                        width: 100%;
                        height: 80px;
                        padding: 12px;
                        border: 2px solid #e1e5e9;
                        border-radius: 6px;
                        font-size: 14px;
                        resize: vertical;
                        box-sizing: border-box;
                        background-color: #f8f9fa;
                    "></textarea>
                    <button id="copy-title-btn" style="
                        background: #28a745;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-size: 13px;
                        cursor: pointer;
                        margin-left: 4px;
                        transition: all 0.3s ease;
                    ">复制</button>
                </div>
                <div id="title-char-count" style="text-align: right; font-size: 12px; color: #666; margin-top: 5px;">0/125 字符</div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">生成的副标题：</label>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <textarea id="generated-subtitle" readonly placeholder="AI生成的英文副标题将显示在这里...\n如：Stylish Animal Print Dress For Night Out, Perfect For Clubbing, Cocktail Parties, And Summer Events With An Alluring Touch" style="
                        width: 100%;
                        height: 60px;
                        padding: 12px;
                        border: 2px solid #e1e5e9;
                        border-radius: 6px;
                        font-size: 14px;
                        resize: vertical;
                        box-sizing: border-box;
                        background-color: #f8f9fa;
                    "></textarea>
                    <button id="copy-subtitle-btn" style="
                        background: #ff9800;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-size: 13px;
                        cursor: pointer;
                        margin-left: 4px;
                        transition: all 0.3s ease;
                    ">复制</button>
                </div>
                <div id="subtitle-char-count" style="text-align: right; font-size: 12px; color: #666; margin-top: 5px;">0/125 字符</div>
            </div>

            <div style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">生成的关键词组：</label>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <textarea id="generated-keywords" readonly placeholder="AI生成的英文关键词组将显示在这里...\n如：wireless earbuds bluetooth headphones sports earphones waterproof earbuds stereo headset" style="
                        width: 100%;
                        height: 100px;
                        padding: 12px;
                        border: 2px solid #e1e5e9;
                        border-radius: 6px;
                        font-size: 14px;
                        resize: vertical;
                        box-sizing: border-box;
                        background-color: #f8f9fa;
                    "></textarea>
                    <button id="copy-keywords-btn" style="
                        background: #17a2b8;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-size: 13px;
                        cursor: pointer;
                        margin-left: 4px;
                        transition: all 0.3s ease;
                    ">复制</button>
                </div>
                <div id="keywords-char-count" style="text-align: right; font-size: 12px; color: #666; margin-top: 5px;">0/350 字符</div>
            </div>


            <div style="display: flex; gap: 10px; justify-content: flex-end; flex-wrap;">
                <button id="google-search-btn" style="
                    background: #4285f4;
                    color: white;
                    border: none;
                    padding: 6px 14px;
                    border-radius: 4px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">🔍 谷歌搜索</button>
                <button id="clear-attr-btn" style="
                    background: #f44336;
                    color: white;
                    border: none;
                    padding: 6px 14px;
                    border-radius: 4px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">🧹 清空属性区</button>
                <input id="product-link-input" type="text" placeholder="请输入参考产品链接" style="flex: 1; padding: 6px 10px; border: 2px solid #e1e5e9; border-radius: 4px; font-size: 13px; min-width: 120px;" />
                <button id="fill-attr-btn" style="font-size:13px; background: #00bcd4; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-weight: 500; cursor: pointer;">⏬ 一键填写属性区</button>
            </div>
        `;

        modal.appendChild(modalContent);
        return modal;
    }

    // 初始化脚本
    async function init() {
        try {
            // 等待页面主要内容加载
            await waitForElement('body');

            // 创建并添加弹窗（确保只插入一次）
            let modal = document.getElementById('ai-title-modal');
            if (!modal) {
                modal = createModal();
                document.body.appendChild(modal);
            }

            // 加载API配置（自动填充上次保存的Provider和密钥）
            loadAPIConfig();

            // 尝试定位按钮到商品名称标签右侧
            let buttonPositioned = false;

            // 等待页面完全加载后再尝试定位v
            setTimeout(() => {
                // 首先尝试主要定位方案
                buttonPositioned = positionButtonToProductName();

                // 如果主要方案失败，尝试备用方案
                if (!buttonPositioned) {
                    buttonPositioned = positionButtonToProductNameBackup();
                }

                // 如果所有方案都失败，使用默认定位
                if (!buttonPositioned) {
                    const button = createDefaultButton();
                    document.body.appendChild(button);
                    // 绑定弹窗事件
                    button.addEventListener('click', () => {
                        const modal = document.getElementById('ai-title-modal');
                        if (modal) {
                            modal.style.display = 'flex';
                            if (typeof loadAPIConfig === 'function') loadAPIConfig();
                        } else {
                            alert('弹窗未正确加载，请刷新页面重试');
                        }
                    });
                }
            }, 1000);

            // 绑定关闭弹窗事件（只绑定一次）
            if (modal) {
                const closeBtn = modal.querySelector('#close-modal');
                if (closeBtn && !closeBtn.hasAttribute('data-inited')) {
                    closeBtn.addEventListener('click', () => {
                        modal.style.display = 'none';
                    });
                    closeBtn.setAttribute('data-inited', '1');
                }
                // 点击背景关闭弹窗
                if (!modal.hasAttribute('data-inited')) {
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            modal.style.display = 'none';
                        }
                    });
                    modal.setAttribute('data-inited', '1');
                }
            }

        } catch (error) {
            console.error('脚本初始化失败:', error);
        }
    }

    // 创建默认定位的按钮（备用方案）
    function createDefaultButton() {
        const button = document.createElement('button');
        button.id = 'ai-title-generator-btn';
        button.innerHTML = '🤖 AI生成标题';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });

        return button;
    }

    // 设置事件监听器
    function setupEventListeners(modal) {
        // 打开弹窗按钮已在外部绑定

        // 关闭弹窗
        const closeBtn = modal.querySelector('#close-modal');
        if (closeBtn && !closeBtn.hasAttribute('data-inited')) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            closeBtn.setAttribute('data-inited', '1');
        }

        // 点击背景关闭弹窗
        if (!modal.hasAttribute('data-inited')) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
            modal.setAttribute('data-inited', '1');
        }

        // 输入框焦点效果
        const keywordInput = modal.querySelector('#keyword-input');
        if (keywordInput && !keywordInput.hasAttribute('data-inited')) {
            keywordInput.addEventListener('focus', () => {
                keywordInput.style.borderColor = '#667eea';
            });
            keywordInput.addEventListener('blur', () => {
                keywordInput.style.borderColor = '#e1e5e9';
            });
            keywordInput.setAttribute('data-inited', '1');
        }

        // API配置保存
        const aiProviderSelect = modal.querySelector('#ai-provider');
        const aiModelSelect = modal.querySelector('#ai-model-select');
        const apiKeyInput = modal.querySelector('#api-key');
        const testApiBtn = modal.querySelector('#test-api-btn');
        if (aiProviderSelect && !aiProviderSelect.hasAttribute('data-inited')) {
            aiProviderSelect.addEventListener('change', () => {
                // 切换大模型时清空API Key
                const apiKeyInput = document.querySelector('#api-key');
                if (apiKeyInput) {
                    apiKeyInput.value = '';
                    apiKeyInput.setAttribute('data-real-key', '');
                    GM_setValue('api_key_' + aiProviderSelect.value, '');
                }
                saveAPIConfig(); // 先保存当前 provider
                // 切换后自动加载对应Provider的API Key
                loadAPIConfig();
            });
            aiProviderSelect.setAttribute('data-inited', '1');
        }
        if (apiKeyInput && !apiKeyInput.hasAttribute('data-inited')) {
            // 用户输入时更新明文缓存
            apiKeyInput.addEventListener('input', () => {
                apiKeyInput.setAttribute('data-real-key', apiKeyInput.value);
            });
            // 失焦时保存并打码
            apiKeyInput.addEventListener('blur', () => {
                let realKey = apiKeyInput.value;
                if (realKey.includes('*')) {
                    realKey = apiKeyInput.getAttribute('data-real-key') || '';
                }
                GM_setValue('api_key_' + document.querySelector('#ai-provider').value, realKey);
                apiKeyInput.value = maskApiKey(realKey);
                apiKeyInput.setAttribute('data-real-key', realKey);
            });
            apiKeyInput.setAttribute('data-inited', '1');
        }
        // API密钥打码功能
        if (apiKeyInput && !apiKeyInput.hasAttribute('data-mask-inited')) {
            let realApiKey = apiKeyInput.getAttribute('data-real-key') || apiKeyInput.value;
            // 失焦时显示打码（已在上面blur事件实现）
            // 不再有聚焦时显示明文的逻辑
            // 初始加载时打码
            apiKeyInput.value = maskApiKey(realApiKey);
            apiKeyInput.setAttribute('data-real-key', realApiKey);
            apiKeyInput.setAttribute('data-mask-inited', '1');
        }

        // 字符计数
        const titleTextarea = modal.querySelector('#generated-title');
        const subtitleTextarea = modal.querySelector('#generated-subtitle');
        const keywordsTextarea = modal.querySelector('#generated-keywords');
        const titleCharCount = modal.querySelector('#title-char-count');
        const keywordsCharCount = modal.querySelector('#keywords-char-count');
        if (titleTextarea && !titleTextarea.hasAttribute('data-inited')) {
            titleTextarea.addEventListener('input', () => {
                const count = titleTextarea.value.length;
                titleCharCount.textContent = `${count}/125 字符`;
                titleCharCount.style.color = count > 125 ? '#dc3545' : '#666';
            });
            titleTextarea.setAttribute('data-inited', '1');
        }
        if (keywordsTextarea && !keywordsTextarea.hasAttribute('data-inited')) {
            keywordsTextarea.addEventListener('input', () => {
                const count = keywordsTextarea.value.length;
                keywordsCharCount.textContent = `${count}/350 字符`;
                keywordsCharCount.style.color = count > 350 ? '#dc3545' : '#666';
            });
            keywordsTextarea.setAttribute('data-inited', '1');
        }

        // 谷歌搜索按钮
        const googleBtn = modal.querySelector('#google-search-btn');
        if (googleBtn && !googleBtn.hasAttribute('data-inited')) {
            googleBtn.addEventListener('click', () => {
                const keyword = keywordInput.value.trim();
                if (!keyword) {
                    showNotification('请先输入关键词', 'warning');
                    return;
                }
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
                window.open(searchUrl, '_blank');
                showNotification('已在新窗口打开谷歌搜索', 'success');
            });
            googleBtn.setAttribute('data-inited', '1');
        }

        // 生成按钮
        const generateBtn = modal.querySelector('#generate-btn');
        if (generateBtn && !generateBtn.hasAttribute('data-inited')) {
            generateBtn.addEventListener('click', generateContent);
            generateBtn.setAttribute('data-inited', '1');
        }

        // 导入到发品表单按钮
        const importBtn = modal.querySelector('#import-to-form-btn');
        if (importBtn && !importBtn.hasAttribute('data-inited')) {
            importBtn.addEventListener('click', importToForm);
            importBtn.setAttribute('data-inited', '1');
        }

        // 复制按钮
        const copyTitleBtn = modal.querySelector('#copy-title-btn');
        if (copyTitleBtn && !copyTitleBtn.hasAttribute('data-inited')) {
            copyTitleBtn.addEventListener('click', () => {
                copyToClipboard(titleTextarea.value, '标题已复制到剪贴板');
            });
            copyTitleBtn.setAttribute('data-inited', '1');
        }
        const copySubtitleBtn = modal.querySelector('#copy-subtitle-btn');
        if (copySubtitleBtn && !copySubtitleBtn.hasAttribute('data-inited')) {
            copySubtitleBtn.addEventListener('click', () => {
                copyToClipboard(subtitleTextarea.value, '副标题已复制到剪贴板');
            });
            copySubtitleBtn.setAttribute('data-inited', '1');
        }
        const copyKeywordsBtn = modal.querySelector('#copy-keywords-btn');
        if (copyKeywordsBtn && !copyKeywordsBtn.hasAttribute('data-inited')) {
            copyKeywordsBtn.addEventListener('click', () => {
                copyToClipboard(keywordsTextarea.value, '关键词已复制到剪贴板');
            });
            copyKeywordsBtn.setAttribute('data-inited', '1');
        }

        // 回车键生成
        if (keywordInput && !keywordInput.hasAttribute('data-enter-inited')) {
            keywordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    generateContent();
                }
            });
            keywordInput.setAttribute('data-enter-inited', '1');
        }

        // 清空属性区按钮
        const clearAttrBtn = modal.querySelector('#clear-attr-btn');
        if (clearAttrBtn && !clearAttrBtn.hasAttribute('data-inited')) {
            clearAttrBtn.addEventListener('click', () => {
                clearAttributeArea();
                showNotification('属性区已清空', 'success');
            });
            clearAttrBtn.setAttribute('data-inited', '1');
        }

        // 根据链接生成属性按钮
        const fillAttrBtn = modal.querySelector('#fill-attr-btn');
        if (fillAttrBtn && !fillAttrBtn.hasAttribute('data-inited')) {
            fillAttrBtn.addEventListener('click', async () => {
                const linkInput = modal.querySelector('#product-link-input');
                const link = linkInput.value.trim();
                if (!link) {
                    showNotification('请先输入产品链接', 'warning');
                    return;
                }
                showNotification('正在抓取产品属性，请稍候...', 'info');
                try {
                    await fetchProductAttributesFromLink(link);
                } catch (e) {
                    showNotification('属性抓取失败: ' + (e.message || e), 'error');
                }
            });
            fillAttrBtn.setAttribute('data-inited', '1');
        }

        // 测试API按钮
        if (testApiBtn && !testApiBtn.hasAttribute('data-inited')) {
            testApiBtn.addEventListener('click', async () => {
                const provider = aiProviderSelect.value;
                let apiKey = apiKeyInput.getAttribute('data-real-key') || apiKeyInput.value;
                if (!apiKey.trim()) {
                    showNotification('请先输入API Key', 'warning');
                    return;
                }
                testApiBtn.disabled = true;
                testApiBtn.textContent = '测试中...';
                try {
                    const result = await testAIAPIConnection(provider, apiKey);
                    showNotification('API测试成功: ' + result, 'success');
                } catch (e) {
                    showNotification('API测试失败: ' + (e.message || e), 'error');
                } finally {
                    testApiBtn.disabled = false;
                    testApiBtn.textContent = '测试API';
                }
            });
            testApiBtn.setAttribute('data-inited', '1');
        }

        const promptInput = modal.querySelector('#custom-prompt-input');
        const savePromptBtn = modal.querySelector('#save-prompt-template-btn');
        const promptSelect = modal.querySelector('#prompt-template-select');
        const deletePromptBtn = modal.querySelector('#delete-prompt-template-btn');
        const togglePromptBtn = modal.querySelector('#toggle-prompt-visibility');

        // 加载模板到下拉框
        function loadPromptTemplates() {
            const templates = GM_getValue('ai_prompt_templates', []);
            promptSelect.innerHTML = '';
            templates.forEach((tpl, idx) => {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = tpl.slice(0, 30).replace(/\n/g, ' ') + (tpl.length > 30 ? '...' : '');
                promptSelect.appendChild(opt);
            });
        }
        // 选择模板自动填充
        promptSelect && promptSelect.addEventListener('change', () => {
            const templates = GM_getValue('ai_prompt_templates', []);
            if (promptSelect.value && templates[promptSelect.value]) {
                promptInput.value = templates[promptSelect.value];
            }
        });
        // 保存为模板
        savePromptBtn && savePromptBtn.addEventListener('click', () => {
            const val = promptInput.value.trim();
            if (!val) { showNotification('提示词不能为空', 'warning'); return; }
            let templates = GM_getValue('ai_prompt_templates', []);
            if (!templates.includes(val)) {
                templates.push(val);
                GM_setValue('ai_prompt_templates', templates);
                loadPromptTemplates();
                showNotification('模板已保存', 'success');
            } else {
                showNotification('模板已存在', 'info');
            }
        });
        // 删除模板
        deletePromptBtn && deletePromptBtn.addEventListener('click', () => {
            let templates = GM_getValue('ai_prompt_templates', []);
            if (promptSelect.value && templates[promptSelect.value]) {
                templates.splice(promptSelect.value, 1);
                GM_setValue('ai_prompt_templates', templates);
                loadPromptTemplates();
                showNotification('模板已删除', 'success');
            }
        });
        // 隐藏/显示输入框
        let promptVisible = true;
        togglePromptBtn && togglePromptBtn.addEventListener('click', () => {
            promptVisible = !promptVisible;
            promptInput.style.display = promptVisible ? '' : 'none';
        });
        // 初始化加载模板
        loadPromptTemplates();

        // provider => 模型列表
        const MODEL_OPTIONS = {
            volcengine: [
                { value: 'doubao-v1.5-32k', label: 'doubao-v1.5-32k' }
            ],
            deepseek: [
                { value: 'deepseek-chat', label: 'deepseek-chat' },
                { value: 'deepseek-reasoner', label: 'deepseek-reasoner' }
            ],
            baidu: [
                { value: 'ernie-bot-4', label: 'ernie-bot-4' }
            ],
            aliyun: [
                { value: 'qwen-turbo', label: 'qwen-turbo' }
            ],
            openai: [
                { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
                { value: 'gpt-4', label: 'gpt-4' }
            ],
            siliconflow: [
                { value: 'deepseek-ai/DeepSeek-R1', label: 'deepseek-ai/DeepSeek-R1' }
            ]
        };
        function updateModelOptions(provider) {
            aiModelSelect.innerHTML = '';
            const options = MODEL_OPTIONS[provider] || [];
            options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                aiModelSelect.appendChild(option);
            });
        }
        // 初始化模型下拉框
        updateModelOptions(aiProviderSelect.value);
        // 切换 provider 时刷新模型下拉框
        aiProviderSelect.addEventListener('change', () => {
            updateModelOptions(aiProviderSelect.value);
        });
    }

    // 保存API配置
    function saveAPIConfig() {
        const aiProvider = document.querySelector('#ai-provider').value;
        // 始终用明文保存
        const apiKeyInput = document.querySelector('#api-key');
        let realKey = apiKeyInput.getAttribute('data-real-key') || apiKeyInput.value;
        GM_setValue('ai_provider', aiProvider);
        GM_setValue('api_key_' + aiProvider, realKey); // 按 provider 存储
    }

    // 加载API配置
    function loadAPIConfig() {
        const aiProvider = GM_getValue('ai_provider', 'local');
        const aiProviderSelect = document.querySelector('#ai-provider');
        if (aiProviderSelect) {
            aiProviderSelect.removeAttribute('disabled');
            aiProviderSelect.removeAttribute('readonly');
            aiProviderSelect.value = aiProvider;
        }
        // 加载对应Provider的API Key
        const apiKeyInput = document.querySelector('#api-key');
        if (apiKeyInput) {
            let realKey = GM_getValue('api_key_' + aiProvider, '');
            apiKeyInput.value = maskApiKey(realKey);
            apiKeyInput.setAttribute('data-real-key', realKey);
        }
    }

    // API密钥打码功能和聚焦还原明文
    function setupApiKeyMaskEvents() {
        const apiKeyInput = document.querySelector('#api-key');
        if (!apiKeyInput) return;
        if (!apiKeyInput.hasAttribute('data-mask-inited')) {
            // 聚焦时显示明文
            apiKeyInput.addEventListener('focus', () => {
                const realKey = apiKeyInput.getAttribute('data-real-key') || '';
                apiKeyInput.value = realKey;
            });
            // 失焦时打码并保存明文
            apiKeyInput.addEventListener('blur', () => {
                let realKey = apiKeyInput.value;
                GM_setValue('api_key_' + document.querySelector('#ai-provider').value, realKey);
                apiKeyInput.value = maskApiKey(realKey);
                apiKeyInput.setAttribute('data-real-key', realKey);
            });
            // 初始加载时打码
            let realApiKey = apiKeyInput.getAttribute('data-real-key') || apiKeyInput.value;
            apiKeyInput.value = maskApiKey(realApiKey);
            apiKeyInput.setAttribute('data-real-key', realApiKey);
            apiKeyInput.setAttribute('data-mask-inited', '1');
        }
    }

    // 复制到剪贴板
    function copyToClipboard(text, message) {
        if (!text.trim()) {
            showNotification('没有内容可复制', 'warning');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showNotification(message, 'success');
        }).catch(() => {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification(message, 'success');
        });
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        // 新增：全局通知容器，纵向堆叠
        let container = document.getElementById('ai-notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ai-notification-container';
            container.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10002;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.style.cssText = `
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            margin-bottom: 0;
            pointer-events: auto;
        `;

        switch (type) {
            case 'success':
                notification.style.background = '#28a745';
                break;
            case 'warning':
                notification.style.background = '#ffc107';
                notification.style.color = '#212529';
                break;
            case 'error':
                notification.style.background = '#dc3545';
                break;
            default:
                notification.style.background = '#17a2b8';
        }

        notification.textContent = message;
        container.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // AI生成内容的核心函数
    async function generateAIContent(keyword, customPrompt = '') {
        const aiProvider = document.querySelector('#ai-provider').value;
        let apiKey = document.querySelector('#api-key').getAttribute('data-real-key') || document.querySelector('#api-key').value;
        // 如果是打码内容，强制聚焦还原明文
        if (apiKey.includes('*')) {
            const apiKeyInput = document.querySelector('#api-key');
            apiKeyInput.focus();
            apiKey = apiKeyInput.value;
        }

        // 如果选择了AI API且有API Key，则使用AI API
        if (aiProvider !== 'local' && apiKey.trim()) {
            try {
                return await generateWithAIAPI(keyword, aiProvider, apiKey, customPrompt);
            } catch (error) {
                console.error('AI API调用失败，回退到本地生成:', error);
                showNotification('AI API调用失败，使用本地生成', 'warning');
                // 回退到本地生成
                return await generateLocalContent(keyword);
            }
        } else {
            // 使用本地生成
            return await generateLocalContent(keyword);
        }
    }

    // 使用AI API生成内容
    async function generateWithAIAPI(keyword, provider, apiKey, customPrompt = '') {
        const config = AI_CONFIG[provider];
        if (!config) {
            throw new Error(`不支持的AI提供商: ${provider}`);
        }
        // 获取当前选择的模型
        let model = config.model;
        const aiModelSelect = document.querySelector('#ai-model-select');
        if (aiModelSelect && aiModelSelect.value) {
            model = aiModelSelect.value;
        }

        // 优化后的提示词，强制只输出指定格式内容
        const prompt = `请为以下产品关键词生成英文产品标题、副标题和关键词组，严格用于阿里巴巴国际站2025年商品发布，需完全符合平台最新规范：
你是一位经验丰富的阿里巴巴国际站运营专家和SEO优化师。你的任务是为我的一款产品生成高质量、SEO友好且吸引海外买家的产品标题。

请遵循以下规则：
1. 标题必须包含核心关键词，并尽量靠前。
2. 合理组合产品的属性、用途、材质和营销词。
3. 标题总长度不超过125个字符。
4. 语言风格专业，符合B2B采购商的搜索习惯。
5. 标题需要有变化，不要只是简单地堆砌词语。
生成的关键词。请为我提供：
1.  10个核心关键词 (Core Keywords)。
2.  15个长尾关键词 (Long-tail Keywords)，包含材质、特性或用途。
3.  5个B2B采购商可能会用的搜索词 (B2B Buyer Search Terms)。

产品关键词: ${keyword}
要求：
1. 标题必须是纯英文，包含产品核心词、重要属性词、场景词，推荐包含同义词、变体词，结构建议：重要属性词+产品中心词+属性/同义/变体词+场景词。每个单词首字母大写（介词、连词、冠词除外），禁止冗余、联系方式、特殊字符、关键词堆砌、与图片/属性不符、低俗词汇。
2. 副标题与主标题规范一致，需补充说明、扩展卖点或使用场景，避免与主标题、属性内容重复，最大化利用副标题。必须包含核心产品词，确保上下文一致性，推荐换说法、拓展卖点或适用场景，严禁夸大、虚假或违规内容，长度不超过128字符。
3. 关键词组为5-10个英文关键词，紧密围绕产品核心词、属性词、场景词，结合买家常用搜索词，避免无关、堆砌、重复、低俗、联系方式等违规词汇。关键词之间用英文逗号分隔，每个关键词不宜过长，总长度不超过350字符。
4. 输出内容必须专业、合规、适合跨境电商平台，吸引国际买家。

请严格只输出如下格式，不要输出任何解释或分析：

标题: [生成的英文标题]
副标题: [生成的英文副标题]
关键词: [生成的英文关键词组]

不要输出其它内容。`;

        // 构建请求数据
        const requestData = {
            model: model,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 500,
            temperature: 0.7,
            stream: false
        };

        // 尝试所有可用的API地址
        const errors = [];

        for (let i = 0; i < config.urls.length; i++) {
            const url = config.urls[i];
            console.log(`尝试API地址 ${i + 1}/${config.urls.length}: ${url}`);

            try {
                const result = await makeAPIRequest(url, requestData, provider, apiKey, customPrompt);
                return result;
            } catch (error) {
                errors.push(`地址${i + 1}: ${error.message}`);

                // 如果不是最后一个地址，继续尝试下一个
                if (i < config.urls.length - 1) {
                    console.log('尝试下一个API地址...');
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒再重试
                }
            }
        }

        // 所有地址都失败了
        const errorMessage = `所有API地址都请求失败:\n${errors.join('\n')}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    // 发送单个API请求
    function makeAPIRequest(url, requestData, provider, apiKey, customPrompt = '') {
        return new Promise((resolve, reject) => {
            // 构建请求头
            let headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };

            // 火山引擎需要特殊请求头
            if (provider === 'volcengine') {
                headers['X-Volc-Domain'] = 'open.volcengineapi.com';
                headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
            }
            // 硅基流动特殊处理（如有）
            if (provider === 'siliconflow') {
                // 可根据API文档补充特殊header
            }
            // OpenAI特殊处理（如有）
            if (provider === 'openai') {
                // 可根据API文档补充特殊header
            }

            // === 调试输出请求内容 ===
            function maskApiKeyForLog(apiKey) {
                if (!apiKey) return '';
                if (apiKey.length <= 8) return apiKey[0] + '****' + apiKey[apiKey.length - 1];
                return apiKey.slice(0, 4) + '****' + apiKey.slice(-4);
            }
            console.log('【调试】请求URL:', url);
            console.log('【调试】请求Header:', headers);
            console.log('【调试】请求体:', requestData);
            console.log('【调试】API Key（打码）:', maskApiKeyForLog(apiKey));
            // === 调试输出结束 ===

            console.log('发送API请求:', {
                url: url,
                method: 'POST',
                headers: headers,
                dataSize: JSON.stringify(requestData).length
            });

            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: headers,
                data: JSON.stringify(requestData),
                timeout: 30000, // 30秒超时
                onload: function(response) {
                    // 新增：打印 DeepSeek 原始返回内容
                    console.log('DeepSeek原始返回:', response.responseText);
                    try {
                        const data = JSON.parse(response.responseText);

                        if (response.status === 200 && data.choices && data.choices[0]) {
                            let content = data.choices[0].message.content;
                            if ((!content || content.trim() === '') && data.choices[0].message.reasoning_content) {
                                content = data.choices[0].message.reasoning_content;
                            }
                            // 解析AI返回的内容
                            const result = parseAIResponse(content);
                            if (result) {
                                resolve(result);
                            } else {
                                reject(new Error('AI返回的内容格式不正确'));
                            }
                        } else {
                            // 新增：打印错误内容并友好提示
                            console.error('DeepSeek API错误返回:', data);
                            let errorMessage = '未知错误';
                            if (data.error && data.error.message) {
                                errorMessage = data.error.message;
                            } else if (data.message) {
                                errorMessage = data.message;
                            } else if (data.error) {
                                errorMessage = JSON.stringify(data.error);
                            }
                            reject(new Error(`API错误 (${response.status}): ${errorMessage}`));
                        }
                    } catch (error) {
                        console.error('解析响应失败:', error);
                        console.error('原始响应:', response.responseText);
                        reject(new Error('解析AI响应失败: ' + error.message));
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败: ' + (error.error || '未知错误')));
                },
                ontimeout: function() {
                    reject(new Error('请求超时 (30秒)'));
                }
            });
        });
    }

    // 解析AI API返回的内容
    function parseAIResponse(content) {
        // 新增：英文标题规范化（介词、冠词、连词小写，其余首字母大写）
        function normalizeTitleCase(str) {
            if (!str) return '';
            const lowerCaseWords = [
                'a', 'an', 'the',
                'and', 'but', 'or', 'nor', 'for', 'so', 'yet',
                'at', 'by', 'for', 'in', 'of', 'on', 'to', 'up', 'with', 'as', 'from', 'into', 'like', 'near', 'off', 'onto', 'over', 'per', 'plus', 'than', 'till', 'upon', 'via', 'down', 'out', 'about', 'after', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'during', 'except', 'inside', 'outside', 'since', 'through', 'under', 'within', 'without', 'over', 'under', 'against', 'along', 'among', 'around', 'because', 'although', 'if', 'unless', 'until', 'while', 'where', 'when', 'once', 'since', 'though', 'even', 'whereas'
            ];
            const words = str.split(/\s+/);
            return words.map((word, idx) => {
                const w = word.toLowerCase();
                if (idx === 0 || idx === words.length - 1) {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }
                if (lowerCaseWords.includes(w)) {
                    return w;
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(' ');
        }

        // 新增：关键词组清理（将所有标点符号全部换成空格，仅保留字母、数字和空格）
        function cleanKeywords(str) {
            if (!str) return '';
            // 替换所有标点符号为" "
            let s = str.replace(/[，,.;:!！。？?、\-_=+~`@#$%^&*()\[\]{}|\\/<>'\"""“"‘' ]/g, ' ');
            // 只保留字母、数字和空格
            s = s.replace(/[^a-zA-Z0-9 ]/g, '');
            // 多余空格合并
            s = s.replace(/\s+/g, ' ');
            // 去除首尾空格
            s = s.trim();
            return s;
        }

        if (!content || content.trim() === '') {
            // 只要 content 为空，直接返回 null，不再兜底提取
            return null;
        }

        // 兼容 markdown 粗体、空格、冒号、中文冒号等多种格式
        const titleMatch = content.match(/(?:\*\*|__)?标题(?:\*\*|__)?[：:：\s]*([^\n]+?)(?=\n|副标题|关键词|$)/i);
        const subtitleMatch = content.match(/(?:\*\*|__)?副标题(?:\*\*|__)?[：:：\s]*([^\n]+?)(?=\n|关键词|$)/i);
        const keywordsMatch = content.match(/(?:\*\*|__)?关键词(?:\*\*|__)?[：:：\s]*([^\n]+?)(?=\n|$)/i);

        if (titleMatch && keywordsMatch) {
            let title = titleMatch[1].trim();
            let subtitle = subtitleMatch ? subtitleMatch[1].trim() : '';
            let keywords = keywordsMatch[1].trim();

            // 清理内容
            title = title.replace(/^[*]{2,}/, '').replace(/^[\[\]【】]/g, '').trim();
            subtitle = subtitle.replace(/^[*]{2,}/, '').replace(/[\[\]【】]/g, '').trim();
            keywords = keywords.replace(/[\[\]【】]/g, '').trim();

            // 确保内容符合要求
            title = title.replace(/[\u4e00-\u9fa5]/g, '').replace(/\s+/g, ' ').trim();
            subtitle = subtitle.replace(/[\u4e00-\u9fa5]/g, '').replace(/\s+/g, ' ').trim();
            keywords = keywords.replace(/[\u4e00-\u9fa5]/g, '').replace(/\s+/g, ' ').trim();

            // 新增：规范化标题/副标题，清理关键词
            title = normalizeTitleCase(title);
            subtitle = normalizeTitleCase(subtitle);
            keywords = cleanKeywords(keywords);

            // 限制长度
            if (title.length > 128) {
                title = title.substring(0, 128).trim();
                const lastSpaceIndex = title.lastIndexOf(' ');
                if (lastSpaceIndex > 100) {
                    title = title.substring(0, lastSpaceIndex);
                }
            }
            if (subtitle.length > 128) {
                subtitle = subtitle.substring(0, 128).trim();
                const lastSpaceIndex = subtitle.lastIndexOf(' ');
                if (lastSpaceIndex > 100) {
                    subtitle = subtitle.substring(0, lastSpaceIndex);
                }
            }
            if (keywords.length > 350) {
                keywords = keywords.substring(0, 350).trim();
                const lastCommaIndex = keywords.lastIndexOf(',');
                if (lastCommaIndex > 300) {
                    keywords = keywords.substring(0, lastCommaIndex);
                }
            }
            return { title, subtitle, keywords };
        }

        // 如果无法解析，直接返回 null
        return null;
    }

    // 本地生成内容（原有的生成逻辑）
    async function generateLocalContent(keyword) {
        // 定义营销词库
        const marketingWords = [
            'Premium', 'High Quality', 'Professional', 'Advanced', 'Superior', 'Excellent',
            'Top Grade', 'Best Selling', 'Popular', 'Hot Sale', 'New Design', 'Latest',
            'Innovative', 'Smart', 'Efficient', 'Reliable', 'Durable', 'Heavy Duty'
        ];

        // 定义属性词库
        const attributeWords = [
            'Stainless Steel', 'Aluminum Alloy', 'Carbon Steel', 'Plastic', 'Metal',
            'Waterproof', 'Anti-corrosion', 'Heat Resistant', 'Lightweight', 'Portable',
            'Adjustable', 'Foldable', 'Rechargeable', 'Wireless', 'Digital', 'Manual'
        ];

        // 定义修饰词库
        const modifierWords = [
            'Industrial', 'Commercial', 'Heavy Duty', 'Multi-function', 'Multi-purpose',
            'High Performance', 'Energy Saving', 'Eco-friendly', 'User-friendly',
            'Cost-effective', 'Long-lasting', 'Maintenance-free', 'Easy Installation'
        ];

        // 定义应用场景词库
        const applicationWords = [
            'for Home Use', 'for Industrial Use', 'for Commercial Use', 'for Office',
            'for Factory', 'for Workshop', 'for Construction', 'for Automotive',
            'for Medical', 'for Food Industry', 'for Agriculture', 'for Mining',
            'for Marine', 'for Outdoor', 'for Indoor', 'for Professional Use'
        ];

        // 翻译中文关键词为英文（简单映射）
        const chineseToEnglish = {
            '手机': 'Mobile Phone',
            '电脑': 'Computer',
            '汽车': 'Car',
            '机器': 'Machine',
            '设备': 'Equipment',
            '工具': 'Tool',
            '产品': 'Product',
            '零件': 'Parts',
            '配件': 'Accessories',
            '材料': 'Material',
            '钢材': 'Steel',
            '塑料': 'Plastic',
            '金属': 'Metal',
            '电子': 'Electronic',
            '机械': 'Mechanical',
            '化工': 'Chemical',
            '纺织': 'Textile',
            '服装': 'Clothing',
            '鞋子': 'Shoes',
            '包包': 'Bag',
            '家具': 'Furniture',
            '灯具': 'Lighting',
            '五金': 'Hardware',
            '建材': 'Building Material',
            '食品': 'Food',
            '医疗': 'Medical',
            '美容': 'Beauty',
            '运动': 'Sports',
            '玩具': 'Toy',
            '礼品': 'Gift'
        };

        // 处理关键词
        let processedKeyword = keyword.trim();
        let centerWord = processedKeyword;
        let productInfo = '';
        let usedAmazon = false;
        // 如果是中文，进行完整翻译
        if (/[\u4e00-\u9fa5]/.test(processedKeyword)) {
            for (const [chinese, english] of Object.entries(chineseToEnglish)) {
                if (processedKeyword.includes(chinese)) {
                    processedKeyword = processedKeyword.replace(new RegExp(chinese, 'g'), english);
                }
            }
            processedKeyword = await translateToEnglish(processedKeyword);
        }
        processedKeyword = processedKeyword.replace(/[\u4e00-\u9fa5]/g, '').trim();
        if (!processedKeyword) {
            processedKeyword = 'Product';
        }
        centerWord = processedKeyword.split(' ')[0] || processedKeyword;

        // 检查本地词库是否能识别产品信息，否则抓取亚马逊
        if (processedKeyword.toLowerCase() === 'product' || processedKeyword.length < 3) {
            // 自动抓取亚马逊商品标题
            productInfo = await fetchAmazonProductInfo(keyword);
            if (productInfo) {
                processedKeyword = productInfo;
                centerWord = productInfo.split(' ')[0] || productInfo;
                usedAmazon = true;
            }
        }

        // 随机选择组合元素
        const randomMarketing = marketingWords[Math.floor(Math.random() * marketingWords.length)];
        const randomAttribute = attributeWords[Math.floor(Math.random() * attributeWords.length)];
        const randomModifier1 = modifierWords[Math.floor(Math.random() * modifierWords.length)];
        const randomModifier2 = modifierWords[Math.floor(Math.random() * modifierWords.length)];
        const randomApplication = applicationWords[Math.floor(Math.random() * applicationWords.length)];

        // 生成标题，副标题，确保包含关键词和中心词，且长度不低于90字符
        let title = `${randomMarketing} ${randomAttribute} ${randomModifier1} ${processedKeyword} ${randomModifier2} ${randomApplication}`;
        // 标题规范化
        title = title.replace(/[.,\-/&]/g, ' ')
                     .replace(/\s+/g, ' ').trim();
        // 介词列表
        const prepositions = [
            'in','on','at','for','with','by','to','from','of','as','about','after','before','under','over','between','among','into','through','during','without','within','along','across','behind','beyond','but','except','like','near','off','onto','out','outside','past','per','plus','regarding','since','than','till','toward','towards','upon','via','while','within','without','down','up','around','against','amid','amongst','beside','besides','concerning','despite','inside','opposite','round','throughout','toward','underneath','unlike','until','upon','versus','aboard','alongside','apart','astride','atop','barring','circa','despite','excepting','excluding','following','minus','notwithstanding','pending','re','save','than','versus','vs','worth'
        ];
        // 首字母大写，介词小写
        title = title.split(' ').map(word => {
            if (prepositions.includes(word.toLowerCase())) {
                return word.toLowerCase();
            } else {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
        }).join(' ');
        // 修正单词粘连
        title = title.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s+/g, ' ').trim();

        // 生成副标题，确保包含关键词和中心词，且长度不低于90字符，最大125字符
        let subtitle = `${randomModifier1} ${processedKeyword} With ${randomAttribute} Perfect ${randomApplication}`;
        subtitle = subtitle.replace(/[.,\-/&]/g, ' ')
                           .replace(/\s+/g, ' ').trim();
        subtitle = subtitle.split(' ').map(word => {
            if (prepositions.includes(word.toLowerCase())) {
                return word.toLowerCase();
            } else {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
        }).join(' ');
        // 修正单词粘连
        subtitle = subtitle.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s+/g, ' ').trim();
        if (!subtitle.toLowerCase().includes(processedKeyword.toLowerCase())) {
            subtitle += ' ' + processedKeyword;
        }
        if (!subtitle.toLowerCase().includes(centerWord.toLowerCase())) {
            subtitle += ' ' + centerWord;
        }
        while (subtitle.length < 90) {
            subtitle += ' ' + modifierWords[Math.floor(Math.random() * modifierWords.length)];
            if (subtitle.length > 125) break;
        }
        if (subtitle.length > 125) {
            subtitle = subtitle.substring(0, 125).trim();
            const lastSpaceIndex = subtitle.lastIndexOf(' ');
            if (lastSpaceIndex > 100) {
                subtitle = subtitle.substring(0, lastSpaceIndex);
            }
        }

        // 生成关键词组，首位插入输入关键词，确保包含中心词，无任何标点符号，仅空格分隔
        const keywordVariations = [
            processedKeyword,
            centerWord,
            processedKeyword.toLowerCase(),
            randomAttribute.toLowerCase(),
            randomModifier1.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ''),
            randomModifier2.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ''),
            'quality',
            'supplier',
            'manufacturer',
            'factory',
            'wholesale',
            'custom',
            'oem',
            'odm',
            'professional',
            'industrial',
            'commercial',
            'durable',
            'reliable',
            'efficient',
            'cost effective',
            'high performance',
            'best price',
            'good quality',
            'fast delivery'
        ];
        const uniqueKeywords = [...new Set(keywordVariations)]
            .filter(kw => kw && kw.length > 1)
            .map(kw => kw.replace(/[^a-zA-Z0-9\s]/g, '').trim())
            .map(kw => kw.replace(/[\u4e00-\u9fa5]/g, '').trim())
            .filter(kw => kw.length > 0);
        let keywords = uniqueKeywords.join(' ');
        keywords = keywords.replace(/[^a-zA-Z0-9 ]/g, ' '); // 再次去除所有标点，仅保留空格
        keywords = keywords.replace(/\s+/g, ' ').trim(); // 合并多余空格
        if (!keywords.toLowerCase().includes(processedKeyword.toLowerCase())) {
            keywords = processedKeyword + ' ' + keywords;
        }
        if (!keywords.toLowerCase().includes(centerWord.toLowerCase())) {
            keywords = centerWord + ' ' + keywords;
        }
        if (keywords.length > 350) {
            keywords = keywords.substring(0, 350).trim();
            const lastSpaceIndex = keywords.lastIndexOf(' ');
            if (lastSpaceIndex > 300) {
                keywords = keywords.substring(0, lastSpaceIndex);
            }
        }
        return {
            title: title.trim(),
            subtitle: subtitle.trim(),
            keywords: keywords.trim(),
            subtitleLength: subtitle.trim().length,
            usedAmazon: usedAmazon
        };
    }

    // 新增：抓取亚马逊商品标题并翻译
    async function fetchAmazonProductInfo(keyword) {
        return new Promise((resolve) => {
            const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: searchUrl,
                onload: async function(response) {
                    try {
                        // 提取商品标题（亚马逊页面结构可能变化，优先找 h2.a-size-mini/a.a-link-normal 或 h2.a-size-base/a.a-link-normal）
                        const html = response.responseText;
                        let matches = [];
                        // 先找常见的商品标题结构
                        const regex = /<span class="a-size-medium a-color-base a-text-normal">(.*?)<\/span>/g;
                        let match;
                        while ((match = regex.exec(html)) !== null) {
                            matches.push(match[1]);
                            if (matches.length >= 3) break;
                        }
                        // 如果没找到，尝试其他结构
                        if (matches.length === 0) {
                            const regex2 = /<h2[^>]*>\s*<a[^>]*>(.*?)<\/a>\s*<\/h2>/g;
                            while ((match = regex2.exec(html)) !== null) {
                                matches.push(match[1].replace(/<[^>]+>/g, ''));
                                if (matches.length >= 3) break;
                            }
                        }
                        if (matches.length > 0) {
                            // 合并前3个商品标题
                            let productInfo = matches.join(' ');
                            // 去除HTML实体
                            productInfo = productInfo.replace(/&[a-z]+;/g, ' ');
                            // 翻译为英文（如果是中文）
                            productInfo = await translateToEnglish(productInfo);
                            resolve(productInfo);
                        } else {
                            resolve('Product');
                        }
                    } catch (e) {
                        resolve('Product');
                    }
                },
                onerror: function() { resolve('Product'); },
                ontimeout: function() { resolve('Product'); }
            });
        });
    }

    // 增强的中文到英文翻译函数
    async function translateToEnglish(chineseText) {
        // 扩展的中英文词汇映射表
        const commonTranslations = {
            // 基础词汇
            '产品': 'Product',
            '设备': 'Equipment',
            '机器': 'Machine',
            '工具': 'Tool',
            '零件': 'Parts',
            '配件': 'Accessories',
            '材料': 'Material',

            // 质量相关
            '高质量': 'High Quality',
            '优质': 'Premium',
            '专业': 'Professional',
            '精密': 'Precision',
            '耐用': 'Durable',
            '可靠': 'Reliable',

            // 应用场景
            '工业': 'Industrial',
            '商业': 'Commercial',
            '家用': 'Home Use',
            '办公': 'Office',
            '户外': 'Outdoor',
            '室内': 'Indoor',
            '医疗': 'Medical',
            '汽车': 'Automotive',

            // 电子产品
            '手机': 'Mobile Phone',
            '电脑': 'Computer',
            '平板': 'Tablet',
            '电视': 'Television',
            '音响': 'Speaker',
            '耳机': 'Headphone',
            '充电器': 'Charger',
            '电池': 'Battery',
            '显示器': 'Monitor',
            '键盘': 'Keyboard',
            '鼠标': 'Mouse',

            // 照明产品
            '灯': 'Light',
            '灯具': 'Lighting',
            '台灯': 'Desk Lamp',
            '吊灯': 'Pendant Light',
            '射灯': 'Spotlight',
            '筒灯': 'Downlight',

            // 机械设备
            '泵': 'Pump',
            '阀门': 'Valve',
            '电机': 'Motor',
            '轴承': 'Bearing',
            '齿轮': 'Gear',
            '传动': 'Transmission',
            '液压': 'Hydraulic',
            '气动': 'Pneumatic',

            // 材料
            '钢材': 'Steel',
            '不锈钢': 'Stainless Steel',
            '铝合金': 'Aluminum Alloy',
            '塑料': 'Plastic',
            '橡胶': 'Rubber',
            '玻璃': 'Glass',
            '陶瓷': 'Ceramic',
            '金属': 'Metal',
            '木材': 'Wood',
            '纤维': 'Fiber',

            // 纺织服装
            '服装': 'Clothing',
            '衬衫': 'Shirt',
            '裤子': 'Pants',
            '裙子': 'Dress',
            '外套': 'Jacket',
            '鞋子': 'Shoes',
            '帽子': 'Hat',
            '包包': 'Bag',
            '背包': 'Backpack',
            '手提包': 'Handbag',

            // 家具用品
            '家具': 'Furniture',
            '桌子': 'Table',
            '椅子': 'Chair',
            '沙发': 'Sofa',
            '床': 'Bed',
            '柜子': 'Cabinet',
            '书架': 'Bookshelf',

            // 五金工具
            '五金': 'Hardware',
            '螺丝': 'Screw',
            '螺母': 'Nut',
            '垫圈': 'Washer',
            '扳手': 'Wrench',
            '钳子': 'Pliers',
            '锤子': 'Hammer',
            '钻头': 'Drill Bit',

            // 化工产品
            '化工': 'Chemical',
            '涂料': 'Paint',
            '胶水': 'Adhesive',
            '溶剂': 'Solvent',
            '清洁剂': 'Cleaner',

            // 食品相关
            '食品': 'Food',
            '饮料': 'Beverage',
            '茶叶': 'Tea',
            '咖啡': 'Coffee',
            '调料': 'Seasoning',

            // 美容护理
            '美容': 'Beauty',
            '护肤': 'Skincare',
            '化妆品': 'Cosmetics',
            '洗发水': 'Shampoo',
            '护发素': 'Conditioner',

            // 运动用品
            '运动': 'Sports',
            '健身': 'Fitness',
            '球类': 'Ball',
            '器械': 'Equipment',

            // 玩具礼品
            '玩具': 'Toy',
            '礼品': 'Gift',
            '装饰': 'Decoration',
            '工艺品': 'Craft',

            // 建材
            '建材': 'Building Material',
            '瓷砖': 'Tile',
            '地板': 'Flooring',
            '门窗': 'Door Window',
            '管道': 'Pipe',
            '电线': 'Wire',
            '开关': 'Switch',
            '插座': 'Socket',

            // 汽车配件
            '汽配': 'Auto Parts',
            '轮胎': 'Tire',
            '刹车': 'Brake',
            '发动机': 'Engine',
            '变速箱': 'Gearbox',

            // 农业用品
            '农业': 'Agriculture',
            '种子': 'Seed',
            '肥料': 'Fertilizer',
            '农药': 'Pesticide',
            '农具': 'Farm Tool'
        };

        let result = chineseText;

        // 按长度排序，优先匹配长词汇
        const sortedTranslations = Object.entries(commonTranslations)
            .sort(([a], [b]) => b.length - a.length);

        for (const [chinese, english] of sortedTranslations) {
            result = result.replace(new RegExp(chinese, 'g'), english);
        }

        // 处理剩余的中文字符
        if (/[\u4e00-\u9fa5]/.test(result)) {
            // 将剩余中文字符替换为通用英文词汇
            result = result.replace(/[\u4e00-\u9fa5]+/g, 'Product');
            // 清理多余的空格和重复的Product
            result = result.replace(/\s+/g, ' ')
                          .replace(/Product\s+Product/g, 'Product')
                          .trim();
        }

        return result;
    }

    // 生成内容（替换原有的占位函数）
    async function generateContent() {
        const keywordInput = document.querySelector('#keyword-input');
        const titleTextarea = document.querySelector('#generated-title');
        const subtitleTextarea = document.querySelector('#generated-subtitle');
        const keywordsTextarea = document.querySelector('#generated-keywords');
        const generateBtn = document.querySelector('#generate-btn');
        const aiProvider = document.querySelector('#ai-provider').value;
        const apiKey = document.querySelector('#api-key').getAttribute('data-real-key') || document.querySelector('#api-key').value;
        const subtitleCharCount = document.querySelector('#subtitle-char-count');

        const keyword = keywordInput.value.trim();
        const customPrompt = document.getElementById('custom-prompt-input')?.value?.trim() || '';

        if (!keyword) {
            showNotification('请输入关键词', 'warning');
            return;
        }

        // 检查AI API配置
        if (aiProvider !== 'local' && !apiKey.trim()) {
            showNotification('请先配置API Key', 'warning');
            return;
        }

        // 显示加载状态
        generateBtn.disabled = true;
        const originalText = generateBtn.textContent;

        if (aiProvider === 'local') {
            generateBtn.textContent = '🔄 本地生成中...';
            showNotification('正在使用本地算法生成...', 'info');
        } else {
            const providerName = AI_CONFIG[aiProvider]?.name || aiProvider;
            generateBtn.textContent = `🔄 ${providerName}生成中...`;
            showNotification(`正在使用${providerName} AI生成...`, 'info');
        }

        try {
            const result = await generateAIContent(keyword, customPrompt);

            titleTextarea.value = result.title;
            if (subtitleTextarea) subtitleTextarea.value = result.subtitle || '';
            keywordsTextarea.value = result.keywords;

            // 更新字符计数
            titleTextarea.dispatchEvent(new Event('input'));
            if (subtitleTextarea) subtitleTextarea.dispatchEvent(new Event('input'));
            keywordsTextarea.dispatchEvent(new Event('input'));
            // 更新副标题字符数
            if (subtitleCharCount && result.subtitleLength !== undefined) {
                subtitleCharCount.textContent = `${result.subtitleLength}/125 字符`;
                subtitleCharCount.style.color = result.subtitleLength > 125 ? '#dc3545' : '#666';
            }

            // 显示成功消息
            if (aiProvider === 'local') {
                showNotification('本地生成完成！', 'success');
            } else {
                const providerName = AI_CONFIG[aiProvider]?.name || aiProvider;
                showNotification(`${providerName} AI生成完成！`, 'success');
            }

        } catch (error) {
            let errorMessage = '生成失败，请重试';
            if (error.message.includes('API错误')) {
                errorMessage = 'AI API调用失败，请检查API Key和网络连接';
            } else if (error.message.includes('网络请求失败')) {
                errorMessage = '网络连接失败，请检查网络设置';
            } else if (error.message.includes('不支持的AI提供商')) {
                errorMessage = '不支持的AI提供商，请选择其他选项';
            }

            showNotification(errorMessage, 'error');
        } finally {
            // 恢复按钮状态
            generateBtn.disabled = false;
            generateBtn.textContent = originalText;
            // 生成后自动让API密钥输入框失焦并打码
            const apiKeyInput = document.querySelector('#api-key');
            if (apiKeyInput) {
                apiKeyInput.blur(); // 触发失焦，自动打码
            }
        }
    }

    // 清空属性区所有输入框和文本域
    function clearAttributeArea() {
        const attrDiv = document.querySelector('#struct-icbuCatProp');
        if (attrDiv) {
            const inputs = attrDiv.querySelectorAll('input');
            const textareas = attrDiv.querySelectorAll('textarea');
            // 清空输入框和文本域
            inputs.forEach(input => {
                if (!input.readOnly && !input.disabled && input.type !== 'checkbox' && input.type !== 'radio') {
                    input.value = '';
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            textareas.forEach(textarea => {
                if (!textarea.readOnly && !textarea.disabled) {
                    textarea.value = '';
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    textarea.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            // 清空checkbox（包括多选下拉）
            const checkboxes = attrDiv.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (!checkbox.disabled && checkbox.checked) {
                    checkbox.checked = false;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            // 清空select多选下拉
            const selects = attrDiv.querySelectorAll('select');
            selects.forEach(select => {
                if (select.multiple) {
                    Array.from(select.options).forEach(option => {
                        option.selected = false;
                    });
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    select.selectedIndex = 0;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            // 清空自定义下拉多选标签（如 next-select-values）
            function clearAllTags() {
                const attrDiv = document.querySelector('#struct-icbuCatProp');
                if (attrDiv) {
                    attrDiv.querySelectorAll('input, textarea, select').forEach(el => {
                        if (el.tagName === 'SELECT') {
                            el.selectedIndex = 0;
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                            el.blur && el.blur();
                        } else {
                            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(el.__proto__, 'value').set;
                            nativeInputValueSetter.call(el, '');
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                            el.focus();
                            el.select && el.select();
                            try {
                                document.execCommand('selectAll', false, null);
                                document.execCommand('delete', false, null);
                            } catch (e) {}
                            el.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
                            el.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
                            el.blur && el.blur();
                            el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
                        }
                    });
                }
                const tagCloseBtns = attrDiv ? attrDiv.querySelectorAll('.next-select-values .next-tag-close-btn') : [];
                if (tagCloseBtns.length === 0) return;
                let idx = 0;
                const interval = setInterval(() => {
                    const btns = attrDiv.querySelectorAll('.next-select-values .next-tag-close-btn');
                    if (btns.length === 0) {
                        clearInterval(interval);
                        return;
                    }
                    btns[0].click();
                }, 100);
            }
            clearAllTags();
        }
    }

    // 导入到发品表单
    function importToForm() {
        // clearAttributeArea(); // 移除这行，不再清空属性区
        const title = document.getElementById('generated-title').value.trim();
        const subtitle = document.getElementById('generated-subtitle').value.trim();
        const keywords = document.getElementById('generated-keywords').value.trim();

        // 标题
        var titleInput = document.querySelector('input#productTitle');
        if (titleInput) {
            var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            titleInput.focus();
            nativeInputValueSetter.call(titleInput, '');
            nativeInputValueSetter.call(titleInput, title);
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
            titleInput.dispatchEvent(new Event('change', { bubbles: true }));
            titleInput.blur();
        }

        // 副标题（如有）
        var subtitleInput = document.querySelector('input#productSubTitle');
        if (subtitleInput) {
            var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            subtitleInput.focus();
            nativeInputValueSetter.call(subtitleInput, '');
            nativeInputValueSetter.call(subtitleInput, subtitle);
            subtitleInput.dispatchEvent(new Event('input', { bubbles: true }));
            subtitleInput.dispatchEvent(new Event('change', { bubbles: true }));
            subtitleInput.blur();
        }

        // 关键词（兼容双缓冲/影子节点机制：同时操作所有相关textarea）
        var keywordTextareas = document.querySelectorAll('textarea[role="input"][placeholder*="修饰词+产品中心词+应用场景"]');
        keywordTextareas.forEach(function(textarea) {
            textarea.value = '';
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            textarea.blur();
        });
        // 赋值新内容
        keywordTextareas.forEach(function(textarea) {
            textarea.value = keywords;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            textarea.blur();
        });

        showNotification('已自动导入到发品表单', 'success');
    }

    // 新增：API密钥打码函数
    function maskApiKey(apiKey) {
        if (!apiKey) return '';
        if (apiKey.length <= 8) return apiKey[0] + '****' + apiKey[apiKey.length - 1];
        return apiKey.slice(0, 4) + '****' + apiKey.slice(-4);
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 在setupEventListeners外部添加：
    async function fetchProductAttributesFromLink(link) {
        // 1. 用GM_xmlhttpRequest抓取页面内容
        // 2. 解析常见电商详情页的属性（如表格、ul/li、json等）
        // 3. 遍历#struct-icbuCatProp下所有输入框/下拉/多选，按属性名自动填充
        // 这里只做结构，具体解析规则可根据实际页面结构补充
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: link,
                onload: function(response) {
                    try {
                        const html = response.responseText;
                        const attrMap = {};
                        // 1. 尝试抓取表格属性
                        const tableMatch = html.match(/<table[\s\S]*?<\/table>/i);
                        if (tableMatch) {
                            const tableHtml = tableMatch[0];
                            const rowRegex = /<tr[\s\S]*?<\/tr>/gi;
                            let rowMatch;
                            while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
                                const row = rowMatch[0];
                                const cols = row.replace(/<[^>]+>/g, '\n').split('\n').map(s => s.trim()).filter(Boolean);
                                if (cols.length >= 2) {
                                    attrMap[cols[0]] = cols[1];
                                }
                            }
                        }
                        // 2. 尝试抓取ul/li属性
                        const ulMatch = html.match(/<ul[\s\S]*?<\/ul>/i);
                        if (ulMatch) {
                            const ulHtml = ulMatch[0];
                            const liRegex = /<li[\s\S]*?<\/li>/gi;
                            let liMatch;
                            while ((liMatch = liRegex.exec(ulHtml)) !== null) {
                                const li = liMatch[0].replace(/<[^>]+>/g, '').trim();
                                const parts = li.split(/[:：]/);
                                if (parts.length >= 2) {
                                    attrMap[parts[0].trim()] = parts[1].trim();
                                }
                            }
                        }
                        // 3. 新增：抓取 class 包含 id-grid 的属性对
                        const div = document.createElement('div');
                        div.innerHTML = html;
                        const gridDivs = Array.from(div.querySelectorAll('.id-grid')).filter(
                            el => el.className.includes('id-grid-cols-[2fr_3fr]')
                        );
                        gridDivs.forEach(grid => {
                            // 修正：只取最外层的两个直接子div作为属性名和属性值
                            const children = Array.from(grid.children).filter(child => child.tagName === 'DIV');
                            if (children.length >= 2) {
                                const key = children[0].innerText.trim();
                                const value = children[1].innerText.trim();
                                // 只在 key 和 value 不相等时才采集，防止属性名和属性值都为属性名
                                if (key && value && key !== value) {
                                    attrMap[key] = value;
                                }
                            }
                        });
                        // 调试输出
                        console.log('抓取到的属性映射:', attrMap);
                        // 4. 遍历属性区自动填充，兼容中英文详情页
                        // 内置常用中英词典
                        const CN2EN_DICT = {
                            "电池容量": "battery capacity",
                            "原产地": "place of origin",
                            "适用类型": "application",
                            "种类": "type",
                            "品牌": "brand",
                            "品牌名称": "brand name",
                            "型号": "model number",
                            "材质": "material",
                            "能效等级": "energy efficiency rating",
                            "售后服务体系": "after-sales service provided",
                            "质保服务": "warranty",
                            "单个包装尺寸": "single package size",
                            "功率": "power",
                            "电压": "voltage",
                            "重量": "weight",
                            "风速": "wind speed",
                            "操作语言": "operating language",
                            "手机APP控制": "mobile app control",
                            "私模": "private mold",
                            "电机": "motor",
                            "安装方式": "installation",
                            "噪音": "noise",
                            "转叶数量": "number of blades",
                            "工作时长": "working time",
                            "功能": "function",
                            "产品类型": "product type",
                            "特性": "feature",
                            "DPI精准度": "dpi",
                            "接口类型": "interface type",
                            "适用手类型": "applicable type",
                            "定位方式": "positioning method",
                            "按键数": "number of keys",
                            "电源方式": "power supply",
                            "感应型": "sensor type",
                            "是否是感应型": "sensor type",
                            "背光": "backlit",
                            "滚轮数": "number of rollers",
                            "人体工学": "ergonomics",
                            // ...如有更多英文key，后续可补充...
                        };
                        // 反向映射
                        const EN2CN_DICT = {};
                        Object.entries(CN2EN_DICT).forEach(([cn, en]) => {
                            EN2CN_DICT[en] = cn;
                        });
                        // 属性名映射表（英文->中文，可持续补充）
                        const ATTR_NAME_MAP = {
                            'type': '类型',
                            'brand': '品牌',
                            'brand name': '品牌',
                            'style': '风格',
                            'power supply': '电源方式',
                            'power type': '电源方式',
                            'private mold': '私模',
                            'ergonomics': '人体工学',
                            'backlit': '背光',
                            'origin': '原产地',
                            'place of origin': '原产地',
                            'dpi': 'DPI精准度',
                            'interface type': '接口类型',
                            'applicable type': '适用手类型',
                            'hand type': '适用手类型',
                            'positioning method': '定位方式',
                            'positioning': '定位方式',
                            'number of rollers': '滚轮数',
                            'number of keys': '按键数',
                            'key count': '按键数',
                            'sensor type': '是否是感应型',
                            'is sensor': '是否是感应型',
                            'feature': '特性',
                            'function': '功能',
                            'material': '材质',
                            'model number': '型号',
                            'warranty': '质保服务',
                            'weight': '重量',
                            'installation': '安装方式',
                            'motor': '电机',
                            'noise': '噪音',
                            'number of blades': '转叶数量',
                            'mobile app control': '手机APP控制',
                            'energy efficiency rating': '能效等级',
                            'battery capacity': '电池容量',
                            'single package size': '单个包装尺寸',
                            'wind speed': '风速',
                            'operating language': '操作语言',
                            // ...可补充更多
                        };
                        // 反向映射表（中文->英文）
                        const ATTR_NAME_MAP_REV = {};
                        Object.entries(ATTR_NAME_MAP).forEach(([en, cn]) => {
                            ATTR_NAME_MAP_REV[cn] = en;
                        });
                        // 归一化函数
                        function normalizeKey(str) {
                            return (str || '')
                                .toLowerCase()
                                .replace(/\s+/g, '') // 去掉空格
                                .replace(/[_\-]+/g, '') // 去掉下划线、连字符
                                .replace(/[^\w]/g, '');   // 只保留字母数字
                        }
                        // 优化的 getAllPossibleKeys，支持模糊匹配
                        function getAllPossibleKeys(label) {
                            const keys = [];
                            const normLabel = normalizeKey(label);
                            keys.push(normLabel);
                            // 中→英
                            if (CN2EN_DICT[label]) keys.push(normalizeKey(CN2EN_DICT[label]));
                            // 英→中
                            if (EN2CN_DICT[label]) keys.push(normalizeKey(EN2CN_DICT[label]));
                            // label 本身如果是英文
                            if (/^[a-zA-Z\s]+$/.test(label)) {
                                keys.push(normalizeKey(label));
                            }
                            // 英文属性名映射到中文
                            if (ATTR_NAME_MAP[label]) keys.push(normalizeKey(ATTR_NAME_MAP[label]));
                            // 中文属性名映射到英文
                            if (ATTR_NAME_MAP_REV[label]) keys.push(normalizeKey(ATTR_NAME_MAP_REV[label]));
                            // 模糊匹配：遍历映射表，凡是包含label的都加进来
                            Object.keys(CN2EN_DICT).forEach(cn => {
                                if (label.includes(cn) || cn.includes(label)) keys.push(normalizeKey(CN2EN_DICT[cn]));
                            });
                            Object.keys(ATTR_NAME_MAP).forEach(en => {
                                if (label.toLowerCase().includes(en) || en.includes(label.toLowerCase())) keys.push(normalizeKey(en));
                            });
                            Object.keys(ATTR_NAME_MAP_REV).forEach(cn => {
                                if (label.includes(cn) || cn.includes(label)) keys.push(normalizeKey(ATTR_NAME_MAP_REV[cn]));
                            });
                            return Array.from(new Set(keys));
                        }
                        // 记录已用过的key
                        const usedKeys = new Set();
                        const attrDiv = document.querySelector('#struct-icbuCatProp');
                        if (!attrDiv) {
                            showNotification('未找到属性区，请确认页面结构', 'error');
                            reject(new Error('属性区未找到'));
                            return;
                        }
                        const propItems = attrDiv.querySelectorAll('.sell-catProp-item');
                        propItems.forEach(item => {
                            // 获取主label文本（去掉span等子节点）
                            let labelNode = item.querySelector('.label');
                            let label = '';
                            if (labelNode) {
                                // 只取第一个文本节点内容
                                label = Array.from(labelNode.childNodes)
                                    .filter(n => n.nodeType === 3) // TEXT_NODE
                                    .map(n => n.textContent.trim())
                                    .join('');
                            }
                            // 只处理商品属性区的 input/textarea/select
                            const el = item.querySelector('input, textarea, select');
                            if (!el) return;
                            // 跳过自定义属性输入框
                            if (
                                (el.tagName === 'INPUT' && (el.placeholder === '请输入自定义属性标题' || el.placeholder === '请输入')) ||
                                (el.name === 'text' || el.name === 'value')
                            ) {
                                return;
                            }
                            // 新增：中英文同义词归一化匹配
                            let value;
                            let matchedKey = '';
                            // 归一化 attrMap 的 key
                            const attrMapKeys = Object.keys(attrMap).map(k => normalizeKey(k));
                            const possibleKeys = getAllPossibleKeys(label);
                            for (const possibleKey of possibleKeys) {
                                const idx = attrMapKeys.indexOf(possibleKey);
                                if (idx !== -1) {
                                    value = attrMap[Object.keys(attrMap)[idx]];
                                    matchedKey = Object.keys(attrMap)[idx];
                                    usedKeys.add(matchedKey);
                                    break;
                                }
                            }
                            // 调试输出
                            console.log('表单控件:', el, 'label:', label, '所有可能key:', possibleKeys, '模糊匹配到属性:', matchedKey, '应填写属性值:', value);
                            if (value !== undefined) {
                                if (el.tagName === 'SELECT') {
                                    // 原生 select 处理
                                    for (const opt of el.options) {
                                        if (opt.text.trim() === value || opt.value.trim() === value) {
                                            el.value = opt.value;
                                            el.dispatchEvent(new Event('change', { bubbles: true }));
                                            break;
                                        }
                                    }
                                } else if (el.getAttribute('role') === 'combobox' || el.getAttribute('uitype') === 'sequentialCombobox') {
                                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                                    // 区分单选和多选逻辑
                                    if (label === '产品类型' || label.toLowerCase().includes('product type')) {
                                        // 单选：只选第一个
                                        const firstValue = value.split(',')[0].trim();
                                        el.focus();
                                        nativeInputValueSetter.call(el, firstValue);
                                        el.dispatchEvent(new Event('input', { bubbles: true }));
                                        setTimeout(() => {
                                            let menu = document.querySelector('.next-overlay-wrapper .next-menu');
                                            if (menu) {
                                                let items = Array.from(menu.querySelectorAll('.next-menu-item'));
                                                let match = items.find(item => item.textContent.trim() === firstValue);
                                                if (!match) {
                                                    match = items.find(item => item.textContent.trim().includes(firstValue) || firstValue.includes(item.textContent.trim()));
                                                }
                                                if (match) {
                                                    match.click();
                                                } else if (items.length > 0) {
                                                    items[0].click();
                                                }
                                            }
                                            el.blur();
                                        }, 400);
                                    } else {
                                        // 多选：依次输入并选中
                                        const values = value.split(',').map(v => v.trim()).filter(Boolean);
                                        let idx = 0;
                                        function selectNext() {
                                            if (idx >= values.length) {
                                                el.blur();
                                                return;
                                            }
                                            el.focus();
                                            nativeInputValueSetter.call(el, values[idx]);
                                            el.dispatchEvent(new Event('input', { bubbles: true }));
                                            setTimeout(() => {
                                                let menu = document.querySelector('.next-overlay-wrapper .next-menu');
                                                if (menu) {
                                                    let items = Array.from(menu.querySelectorAll('.next-menu-item'));
                                                    let match = items.find(item => item.textContent.trim() === values[idx]);
                                                    if (!match) {
                                                        match = items.find(item => item.textContent.trim().includes(values[idx]) || values[idx].includes(item.textContent.trim()));
                                                    }
                                                    if (match) {
                                                        match.click();
                                                    } else if (items.length > 0) {
                                                        items[0].click();
                                                    }
                                                }
                                                // 清空输入框，防止下次输入被拼接
                                                nativeInputValueSetter.call(el, '');
                                                el.dispatchEvent(new Event('input', { bubbles: true }));
                                                idx++;
                                                setTimeout(selectNext, 500);
                                            }, 500);
                                        }
                                        selectNext();
                                    }
                                } else {
                                    // 普通 input，使用原生 setter
                                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(el.__proto__, 'value').set;
                                    nativeInputValueSetter.call(el, value);
                                    el.dispatchEvent(new Event('input', { bubbles: true }));
                                    el.dispatchEvent(new Event('change', { bubbles: true }));
                                    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
                                    setTimeout(() => { el.blur && el.blur(); }, 50);
                                    // 自动点选下拉菜单第一个选项（如有）
                                    setTimeout(() => {
                                        let menu = document.querySelector('.next-overlay-wrapper .next-menu');
                                        if (menu) {
                                            let firstItem = menu.querySelector('.next-menu-item');
                                            if (firstItem) firstItem.click();
                                        }
                                    }, 100);
                                }
                            }
                        });
                        // 新增：自动填充自定义属性区
                        const customTitleInputs = Array.from(attrDiv.querySelectorAll('input[placeholder="请输入自定义属性标题"]'));
                        const customValueInputs = Array.from(attrDiv.querySelectorAll('input[placeholder="请输入"]'));
                        const unusedKeys = Object.keys(attrMap).filter(k => !usedKeys.has(k));

                        // 只分配有值的属性，防止 undefined
                        let customIdx = 0;
                        for (let i = 0; i < unusedKeys.length; i++) {
                            const key = unusedKeys[i];
                            // 跳过 Quantity (sets)、Lead time (days)、Quantity (pieces)、number of rollers
                            if (
                                key.trim().toLowerCase() === 'quantity (sets)'.toLowerCase() ||
                                key.trim().toLowerCase() === 'lead time (days)'.toLowerCase() ||
                                key.trim().toLowerCase() === 'quantity (pieces)'.toLowerCase() ||
                                key.trim().toLowerCase() === 'number of rollers'.toLowerCase()
                            ) {
                                continue;
                            }
                            const value = attrMap[key];
                            // 跳过敏感联系方式相关属性
                            const contactKeywords = [
                                '电话', 'phone', 'mobile', 'contact', '联系方式', '微信', 'qq', 'email', '邮箱', 'whatsapp', 'WhatsApp', 'line', 'skype', '传真', 'fax', 'wechat', 'WeChat'
                            ];
                            const keyLower = key.trim().toLowerCase();
                            const valueLower = (value || '').toString().trim().toLowerCase();
                            if (contactKeywords.some(word => keyLower.includes(word.toLowerCase()) || valueLower.includes(word.toLowerCase()))) {
                                continue;
                            }
                            if (value !== undefined && value !== null && value !== '') {
                                if (customIdx < customTitleInputs.length && customIdx < customValueInputs.length) {
                                    // 使用原生 setter + 事件派发写入标题
                                    const titleInput = customTitleInputs[customIdx];
                                    const titleProto = Object.getPrototypeOf(titleInput);
                                    const titleSetter = Object.getOwnPropertyDescriptor(titleProto, 'value').set;
                                    titleSetter.call(titleInput, key);
                                    titleInput.dispatchEvent(new Event('input', { bubbles: true }));
                                    titleInput.dispatchEvent(new Event('change', { bubbles: true }));
                                    titleInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
                                    titleInput.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
                                    setTimeout(() => { titleInput.blur(); }, 30); // 失焦，确保内容被保存
                                    // 使用原生 setter + 事件派发写入值
                                    const valueInput = customValueInputs[customIdx];
                                    const valueProto = Object.getPrototypeOf(valueInput);
                                    const valueSetter = Object.getOwnPropertyDescriptor(valueProto, 'value').set;
                                    valueSetter.call(valueInput, value);
                                    valueInput.dispatchEvent(new Event('input', { bubbles: true }));
                                    valueInput.dispatchEvent(new Event('change', { bubbles: true }));
                                    valueInput.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
                                    setTimeout(() => { valueInput.blur(); }, 30);
                                    customIdx++;
                                }
                            }
                        }
                        showNotification('属性抓取并填写完成', 'success');
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(e) { reject(e); },
                ontimeout: function() { reject(new Error('请求超时')); }
            });
        });
    }

    // 新增：API连通性测试函数
    async function testAIAPIConnection(provider, apiKey) {
        const config = AI_CONFIG[provider];
        if (!config) throw new Error('不支持的AI提供商');
        // 构建简单测试prompt
        let prompt = 'Say hello world.';
        if (provider === 'baidu') {
            prompt = '用英文回复：hello world';
        }
        const requestData = {
            model: config.model,
            messages: [
                { role: 'user', content: prompt }
            ],
            max_tokens: 10,
            temperature: 0.1,
            stream: false
        };
        // 只测第一个API地址
        const url = config.urls[0];
        return new Promise((resolve, reject) => {
            let headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            if (provider === 'volcengine') {
                headers['X-Volc-Domain'] = 'open.volcengineapi.com';
                headers['User-Agent'] = 'Mozilla/5.0';
            }
            // 其他特殊header可补充
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: headers,
                data: JSON.stringify(requestData),
                timeout: 15000,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (response.status === 200 && data.choices && data.choices[0]) {
                            const content = data.choices[0].message.content;
                            resolve(content);
                        } else {
                            let errorMessage = '未知错误';
                            if (data.error && data.error.message) errorMessage = data.error.message;
                            else if (data.message) errorMessage = data.message;
                            reject(new Error(errorMessage));
                        }
                    } catch (e) {
                        reject(new Error('解析响应失败: ' + e.message));
                    }
                },
                onerror: function(e) { reject(new Error('网络请求失败')); },
                ontimeout: function() { reject(new Error('请求超时')); }
            });
        });
    }

    // 在 fetchProductAttributesFromLink 相关函数前面添加：
    function setInputValueSmart(el, value) {
        // 1. 操作自身
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(el.__proto__, 'value').set;
        nativeInputValueSetter.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
        setTimeout(() => { el.blur && el.blur(); }, 50);

        // 2. 如果有 next-input 包裹，也操作
        const parentSpan = el.closest('.next-input');
        if (parentSpan) {
            const innerInput = parentSpan.querySelector('input');
            if (innerInput && innerInput !== el) {
                const setter = Object.getOwnPropertyDescriptor(innerInput.__proto__, 'value').set;
                setter.call(innerInput, value);
                innerInput.dispatchEvent(new Event('input', { bubbles: true }));
                innerInput.dispatchEvent(new Event('change', { bubbles: true }));
                innerInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
                setTimeout(() => { innerInput.blur && innerInput.blur(); }, 50);
            }
        }
        // 自动点选下拉菜单
        setTimeout(() => {
            let menu = document.querySelector('.next-overlay-wrapper .next-menu');
            if (menu) {
                let firstItem = menu.querySelector('.next-menu-item');
                if (firstItem) firstItem.click();
            }
        }, 100);
    }

})();

