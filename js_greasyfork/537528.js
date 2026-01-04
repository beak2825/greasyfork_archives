// ==UserScript==
// @name         Hugging Face 中文化插件
// @namespace    https://github.com/your-username/hf-chinese
// @description  中文化 Hugging Face 界面的菜单及内容
// @copyright    2025
// @icon         https://huggingface.co/front/assets/huggingface_logo-noborder.svg
// @version      1.0.3
// @author       蛋定的文弱书生
// @license      GPL-3.0
// @match        https://huggingface.co/*
// @match        https://*.huggingface.co/*
// @match        https://hf-mirror.com/*
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @supportURL   https://github.com/1972074121/Youhou/issues
// @downloadURL https://update.greasyfork.org/scripts/537528/Hugging%20Face%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/537528/Hugging%20Face%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function (window, document, undefined) {
    'use strict';

    // 语言设置
    const lang = 'zh';

    // 词库配置
    const I18N = {
        zh: {
            // 公共词库（所有页面通用）
            public: {
                static: {
                    // 导航栏
                    "Models": "模型",
                    "Datasets": "数据集",
                    "Spaces": "空间",
                    "Docs": "文档",
                    "Solutions": "解决方案",
                    "Pricing": "价格",
                    "Sign in": "登录",
                    "Sign Up": "注册",
                    "Search": "搜索",

                    // 侧边栏
                    "Filters": "筛选器",
                    "All": "全部",
                    "Text": "文本",
                    "Image": "图像",
                    "Audio": "音频",
                    "Video": "视频",
                    "Multimodal": "多模态",
                    "Table": "表格",
                    "Fill-Mask": "掩码填充",
                    "Token Classification": "标记分类",
                    "Text Generation": "文本生成",
                    "Text2Text Generation": "文本到文本生成",
                    "Summarization": "摘要生成",
                    "Conversational": "对话",
                    "Feature Extraction": "特征提取",
                    "Translation": "翻译",
                    "Multiple Choice": "多项选择",
                    "Text Classification": "文本分类",
                    "Question Answering": "问答",
                    "Sentence Similarity": "句子相似度",
                    "Zero-Shot Classification": "零样本分类",
                    "Enterprise": "企业版",
                    "Audio-Text-to-Text": "音频文本转文本",
                    "Image-Text-to-Text": "图像文本转文本",
                    "Visual Question Answering": "视觉问答",
                    "Document Question Answering": "文档问答",
                    "Video-Text-to-Text": "视频文本转文本",
                    "Visual Document Retrieval": "视觉文档检索",
                    "Any-to-Any": "任意到任意",
                    "Computer Vision": "计算机视觉",
                    "Depth Estimation": "深度估计",
                    "Image Classification": "图像分类",
                    "Object Detection": "目标检测",
                    "Image Segmentation": "图像分割",
                    "Text-to-Image": "文本到图像",
                    "Image-to-Text": "图像到文本",
                    "Image-to-Image": "图像到图像",
                    "Image-to-Video": "图像到视频",
                    "Unconditional Image Generation": "无条件图像生成",
                    "Video Classification": "视频分类",
                    "Text-to-Video": "文本到视频",
                    "Zero-Shot Image Classification": "零样本图像分类",
                    "Mask Generation": "掩码生成",
                    "Zero-Shot Object Detection": "零样本目标检测",
                    "Text-to-3D": "文本到3D",
                    "Image-to-3D": "图像到3D",
                    "Image Feature Extraction": "图像特征提取",
                    "Keypoint Detection": "关键点检测",
                    "Natural Language Processing": "自然语言处理",
                    "Table Question Answering": "表格问答",
                    "Text Ranking": "文本排序",
                    "Text-to-Speech": "文本到语音",
                    "Text-to-Audio": "文本到音频",
                    "Automatic Speech Recognition": "自动语音识别",
                    "Audio-to-Audio": "音频到音频",
                    "Audio Classification": "音频分类",
                    "Voice Activity Detection": "语音活动检测",
                    "Tabular": "表格数据",
                    "Tabular Classification": "表格分类",
                    "Tabular Regression": "表格回归",
                    "Time Series Forecasting": "时间序列预测",
                    "Reinforcement Learning": "强化学习",
                    "Robotics": "机器人学",
                    "Other": "其他",
                    "Graph Machine Learning": "图机器学习",

                    // 按钮
                    "Load more": "加载更多",
                    "Subscribe": "订阅",
                    "Download": "下载",
                    "Upload": "上传",
                    "Create": "创建",
                    "Settings": "设置",
                    "Profile": "个人资料",
                    "Logout": "退出登录",

                    // 模型卡片
                    "Model card": "模型卡片",
                    "Files and versions": "文件与版本",
                    "Community": "社区",
                    "Training metrics": "训练指标",
                    "Training logs": "训练日志",
                    "Deploy": "部署",
                    "Use in Transformers": "在Transformers中使用",
                    "Hosted inference API": "托管推理API",
                    "Contributors": "贡献者",
                    "License": "许可证",

                    // 空间相关
                    "Duplicate this Space": "复制此空间",
                    "Embed this Space": "嵌入此空间",
                    "App": "应用",
                    "Files": "文件",
                    "Sessions": "会话",
                    "Hardware": "硬件",
                    "Storage": "存储",
                    "Variables": "变量",
                    "Logs": "日志",

                    // 文档
                    "Previous": "上一页",
                    "Next": "下一页",
                    "On this page": "本页内容",
                    "Table of contents": "目录",
                    "Getting Started": "入门指南",
                    "Tutorials": "教程",
                    "Conceptual Guides": "概念指南",
                    "How-to Guides": "操作指南",
                    "API Documentation": "API文档",

                    // 新增翻译内容
                    "Tasks": "任务",
                    "Libraries": "库",
                    "Languages": "语言",
                    "Licenses": "许可证",
                    "Website": "网站",
                    "HuggingChat": "Hugging聊天",
                    "Collections": "收藏集",
                    "Organizations": "组织",
                    "Blog": "博客",
                    "Posts": "帖子",
                    "Daily Papers": "每日论文",
                    "Learn": "学习",
                    "Discord": "Discord社区",
                    "Forum": "论坛",
                    "Github": "GitHub",
                    "Enterprise Hub": "企业中心",
                    "Expert Support": "专家支持",
                    "Inference Endpoints": "推理端点",
                    "Notifications": "通知",
                    "Inbox": "收件箱",
                    "New Model": "新建模型",
                    "New Dataset": "新建数据集",
                    "New Space": "新建空间",
                    "New Collection": "新建收藏集",
                    "Create organization": "创建组织",
                    "Usage Quota": "使用配额",
                    "Private Storage": "私有存储",
                    "Zero GPU": "零GPU",
                    "Inference Usage": "推理使用量",
                    "Subscribe to PRO": "订阅PRO版",
                    "Access Tokens": "访问令牌",
                    "Billing": "账单",
                    "Changelog": "更新日志",
                    "Sign Out": "退出登录",
                    "AI & ML interests": "AI与ML兴趣",
                    "Recent Activity": "最近活动",
                    "Account": "账户",
                    "Authentication": "认证",
                    "SSH and GPG Keys": "SSH和GPG密钥",
                    "Inference Providers": "推理提供商",
                    "Webhooks": "Webhooks",
                    "Papers": "论文",
                    "Local Apps and Hardware": "本地应用与硬件",
                    "Gated Repositories": "受限仓库",
                    "Content Preferences": "内容偏好",
                    "Connected Apps": "已连接应用",
                    "Theme": "主题",
                    "Discussions": "讨论",
                    "Pull requests": "拉取请求",
                    "Welcome to the community": "欢迎来到社区专区",
                    "The community tab is the place to discuss and collaborate with the HF community!": "此处是您与 HF 社区交流协作的专属空间！",
                    "New discussion": "发起新讨论",
                    "New pull request": "创建拉取请求",
                    "Watch all activity": "查看所有活动动态",
                    "View closed": "查看已关闭项",
                    "Discussions": "讨论",
                    "Short": "排序",
                    "Recently created": "最近创建",
                    "Most reactions": "最多互动",
                    "Trending": "热门内容",
                    "Filter by title": "按标题筛选",
                    "Resources": "资源",
                    "Search models, datasets, users...": "搜索模型、数据集、用户...",
                    "No model card": "无模型卡片",
                    "New: Create and edit this model card directly on the website!": "新功能：直接在线创建并编辑模型卡片！",
                    "Contribute a Model Card": "贡献模型卡片",
                    "Adapters": "适配器",
                    "Finetunes": "微调模型",
                    "Merges": "合并模型",
                    "Quantizations": "量化模型"
                },
                regexp: [
                    // 正则替换规则
                    [/(\d+) days? ago/, '$1天前'],
                    [/(\d+) hours? ago/, '$1小时前'],
                    [/(\d+) minutes? ago/, '$1分钟前'],
                    [/Just now/, '刚刚'],
                    [/(\d+) downloads?/, '$1次下载'],
                    [/(\d+) likes?/, '$1个点赞'],
                    [/View closed (\d+)?/, '查看已关闭项 $1'],
                ]
            },

            // 主页特定词库
            homepage: {
                static: {
                    "Models, datasets and Spaces": "模型、数据集与空间",
                    "Discover, explore and share ML resources": "发现、探索并分享机器学习资源",
                    "Trending": "热门",
                    "New": "最新",
                    "Top": "最佳",
                    "Top contributors": "顶级贡献者",
                    "Featured Spaces": "精选空间",
                    "All Spaces": "所有空间",
                    "Explore": "探索",
                    "Browse models": "浏览模型",
                    "Browse datasets": "浏览数据集",
                    "Browse Spaces": "浏览空间",
                }
            },

            // 模型列表页
            models: {
                static: {
                    "Browse models": "浏览模型",
                    "Sort:": "排序:",
                    "Most likes": "最多点赞",
                    "Most downloads": "最多下载",
                    "Recently updated": "最近更新",
                    "Task": "任务",
                    "Library": "库",
                    "Dataset": "数据集",
                    "Architecture": "架构",
                    "Languages": "语言",
                    "Licenses": "许可证",
                    "Model name or keyword": "模型名称或关键词",
                    "Search models": "搜索模型",
                }
            },

            // 数据集列表页
            datasets: {
                static: {
                    "Browse datasets": "浏览数据集",
                    "Sort:": "排序:",
                    "Most likes": "最多点赞",
                    "Most downloads": "最多下载",
                    "Recently updated": "最近更新",
                    "Task": "任务",
                    "Library": "库",
                    "Language": "语言",
                    "Licenses": "许可证",
                    "Dataset name or keyword": "数据集名称或关键词",
                    "Search datasets": "搜索数据集",
                }
            },

            // 空间列表页
            spaces: {
                static: {
                    "Browse Spaces": "浏览空间",
                    "Sort:": "排序:",
                    "Most likes": "最多点赞",
                    "Recently updated": "最近更新",
                    "SDK": "SDK",
                    "Hardware": "硬件",
                    "License": "许可证",
                    "Space name or keyword": "空间名称或关键词",
                    "Search Spaces": "搜索空间",
                }
            },

            // 文档页
            docs: {
                static: {
                    "Hugging Face Documentation": "Hugging Face 文档",
                    "Search the docs": "搜索文档",
                    "Edit this page": "编辑此页",
                    "Feedback": "反馈",
                }
            },

            // 模型详情页
            model_detail: {
                static: {
                    "Model description": "模型描述",
                    "Intended uses & limitations": "预期用途与限制",
                    "How to use": "如何使用",
                    "Limitations and bias": "限制与偏见",
                    "Training data": "训练数据",
                    "Training procedure": "训练过程",
                    "Evaluation results": "评估结果",
                    "Citation": "引用",
                    "Model card authors": "模型卡片作者",
                    "Model card contributors": "模型卡片贡献者",
                }
            },

            // 空间详情页
            space_detail: {
                static: {
                    "Running on": "运行于",
                    "Last updated": "最后更新",
                    "Created by": "创建者",
                    "App files": "应用文件",
                    "README.md": "自述文件",
                }
            }
        }
    };

    // 全局变量
    let page;
    let enable_RegExp = GM_getValue("enable_RegExp", 1);

    /**
     * watchUpdate 函数：监视页面变化，根据变化的节点进行翻译
     */
    function watchUpdate() {
        // 检测浏览器是否支持 MutationObserver
        const MutationObserver =
            window.MutationObserver ||
            window.WebKitMutationObserver ||
            window.MozMutationObserver;

        // 获取当前页面的 URL
        const getCurrentURL = () => location.href;
        getCurrentURL.previousURL = getCurrentURL();

        // 创建 MutationObserver 实例，监听 DOM 变化
        const observer = new MutationObserver((mutations, observer) => {
            const currentURL = getCurrentURL();

            // 如果页面的 URL 发生变化
            if (currentURL !== getCurrentURL.previousURL) {
                getCurrentURL.previousURL = currentURL;
                page = getPage(); // 当页面地址发生变化时，更新全局变量 page
                console.log(`链接变化 page= ${page}`);

                if (page) {
                    setTimeout(() => {
                        // 重新翻译页面
                        traverseNode(document.body);
                    }, 500);
                }
            }

            if (page) {
                // 使用 filter 方法对 mutations 数组进行筛选，
                // 返回 `节点增加、文本更新 或 属性更改的 mutation` 组成的新数组 filteredMutations。
                const filteredMutations = mutations.filter(mutation => mutation.addedNodes.length > 0 || mutation.type === 'attributes' || mutation.type === 'characterData');

                // 处理每个变化
                filteredMutations.forEach(mutation => traverseNode(mutation.target));
            }
        });

        // 配置 MutationObserver
        const config = {
            characterData: true,
            subtree: true,
            childList: true,
            attributeFilter: ['value', 'placeholder', 'aria-label', 'data-confirm'], // 仅观察特定属性变化
        };

        // 开始观察 document.body 的变化
        observer.observe(document.body, config);
    }

    /**
     * traverseNode 函数：遍历指定的节点，并对节点进行翻译。
     * @param {Node} node - 需要遍历的节点。
     */
    function traverseNode(node) {
        // 跳过忽略
        if (node.id && /react-.*|notification|toast|modal|dialog/i.test(node.id)) {
            return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) { // 元素节点处理

            // 元素节点属性翻译
            if (["INPUT", "TEXTAREA"].includes(node.tagName)) { // 输入框 按钮 文本域
                if (["button", "submit", "reset"].includes(node.type)) {
                    transElement(node, 'value');
                } else {
                    transElement(node, 'placeholder');
                }
            } else if (node.tagName === 'BUTTON') {
                if (node.hasAttribute('aria-label')) {
                    transElement(node, 'aria-label', true);
                }
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true);
                }
                if (node.hasAttribute('data-confirm')) {
                    transElement(node, 'data-confirm', true);
                }
            } else if (node.tagName === 'OPTGROUP') { // 翻译 <optgroup> 的 label 属性
                transElement(node, 'label');
            } else if (node.tagName === 'A') {
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true);
                }
            }

            let childNodes = node.childNodes;
            childNodes.forEach(traverseNode); // 遍历子节点

        } else if (node.nodeType === Node.TEXT_NODE) { // 文本节点翻译
            if (node.length <= 500) {
                transElement(node, 'data');
            }
        }
    }

    /**
     * getPage 函数：获取当前页面的类型。
     * @returns {string|boolean} 当前页面的类型，如果无法确定类型，那么返回 false。
     */
    function getPage() {
        const pathname = location.pathname; // 当前路径

        // 根据路径判断页面类型
        if (pathname === '/') {
            return 'homepage';
        } else if (pathname.startsWith('/models')) {
            return pathname.split('/').length > 2 ? 'model_detail' : 'models';
        } else if (pathname.startsWith('/datasets')) {
            return pathname.split('/').length > 2 ? 'dataset_detail' : 'datasets';
        } else if (pathname.startsWith('/spaces')) {
            return pathname.split('/').length > 2 ? 'space_detail' : 'spaces';
        } else if (pathname.startsWith('/docs')) {
            return 'docs';
        } else if (pathname.split('/').length === 2) {
            // 例如：/username/modelname
            return 'model_detail';
        }

        // 默认使用公共词库
        return 'public';
    }

    /**
     * transElement 函数：翻译指定元素的文本内容或属性。
     * @param {Element} el - 需要翻译的元素。
     * @param {string} field - 需要翻译的文本内容或属性的名称。
     * @param {boolean} isAttr - 是否需要翻译属性。
     */
    function transElement(el, field, isAttr = false) {
        let text = isAttr ? el.getAttribute(field) : el[field]; // 需要翻译的文本
        if (!text) return;

        let str = translateText(text); // 翻译后的文本

        // 替换翻译后的内容
        if (str) {
            if (!isAttr) {
                el[field] = str;
            } else {
                el.setAttribute(field, str);
            }
        }
    }

    /**
     * translateText 函数：翻译文本内容。
     * @param {string} text - 需要翻译的文本内容。
     * @returns {string|boolean} 翻译后的文本内容，如果没有找到对应的翻译，那么返回 false。
     */
    function translateText(text) {
        // 内容为空, 空白字符和或数字, 不存在英文字母和符号,. 跳过
        if (!text || !/[a-zA-Z,.]+/.test(text)) {
            return false;
        }

        let _key = text.trim(); // 去除首尾空格的 key
        let _key_neat = _key.replace(/\xa0|[\s]+/g, ' '); // 去除多余空白字符(&nbsp; 空格 换行符)

        let str = fetchTranslatedText(_key_neat); // 翻译已知页面 (局部优先)

        if (str && str !== _key_neat) { // 已知页面翻译完成
            return text.replace(_key, str); // 替换原字符，保留首尾空白部分
        }

        return false;
    }

    /**
     * fetchTranslatedText 函数：从特定页面的词库中获得翻译文本内容。
     * @param {string} key - 需要翻译的文本内容。
     * @returns {string|boolean} 翻译后的文本内容，如果没有找到对应的翻译，那么返回 false。
     */
    function fetchTranslatedText(key) {
        // 静态翻译
        let str = (I18N[lang][page]?.static?.[key]) ||
                  (I18N[lang].public?.static?.[key]); // 默认翻译 公共部分

        if (typeof str === 'string') {
            return str;
        }

        // 正则翻译
        if (enable_RegExp) {
            let res = (I18N[lang][page]?.regexp || []).concat(I18N[lang].public?.regexp || []); // 正则数组

            for (let [a, b] of res) {
                try {
                    let regex = new RegExp(a, 'g');
                    if (regex.test(key)) {
                        return key.replace(regex, b);
                    }
                } catch (e) {
                    console.error('正则表达式错误:', a, e);
                }
            }
        }

        return false; // 没有翻译条目
    }

    function registerMenuCommand() {
        const toggleRegExp = () => {
            enable_RegExp = !enable_RegExp;
            GM_setValue("enable_RegExp", enable_RegExp);
            GM_notification(`已${enable_RegExp ? '开启' : '关闭'}正则功能`);
            GM_unregisterMenuCommand(id);
            id = GM_registerMenuCommand(`${enable_RegExp ? '关闭' : '开启'}正则功能`, toggleRegExp);
            // 刷新页面以应用更改
            location.reload();
        };

        let id = GM_registerMenuCommand(`${enable_RegExp ? '关闭' : '开启'}正则功能`, toggleRegExp);
    }

    /**
     * init 函数：初始化翻译功能。
     */
    function init() {
        // 获取当前页面的翻译规则
        page = getPage();
        console.log(`开始page= ${page}`);

        if (page) {
            // 立即翻译页面
            traverseNode(document.body);
        }
        // 监视页面变化
        watchUpdate();

        // 添加菜单命令
        registerMenuCommand();
    }

    // 执行初始化
    setTimeout(init, 1000);

})(window, document);