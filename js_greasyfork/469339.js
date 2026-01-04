// ==UserScript==
// @name         全局工具箱
// @namespace    http://iapp.run
// @version      2.2.1
// @description  全能网页工具箱：解除复制限制 + 全页翻译 + 聚合搜索；浏览器必备效率神器！一键解决网页痛点：支持解除右键/复制限制、沉浸式翻译、二维码生成与夜间模式。内置强大的自定义搜索面板（支持 JSON 配置与自动抓取 Favicon），现代化暗色 UI，轻量拖拽，即装即用。
// @author       zero-ljz
// @homepage     https://github.com/zero-ljz/scripts/blob/main/greasemonkey/tools.js
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.4.4/qrcode.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469339/%E5%85%A8%E5%B1%80%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/469339/%E5%85%A8%E5%B1%80%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // --- 0. 核心修复：Trusted Types (针对 innerHTML 限制) ---
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            window.trustedTypes.createPolicy('default', {
                createHTML: string => string,
                createScript: string => string,
                createScriptURL: string => string,
            });
        } catch (e) {
            // 忽略策略已存在的错误
        }
    }

    // 辅助：安全设置 HTML
    const setHTML = (el, html) => {
        if (!el) return;
        el.innerHTML = html;
    };

    // 默认的搜索增强列表
    // 占位符说明: %s = 选中的文本/输入内容, %host% = 当前网站域名, %url% = 当前页面URL
    const DEFAULT_SEARCH_ENGINES = [
        { name: "谷歌搜索", icon: "", url: "https://www.google.com/search?q=%s" },
        { name: "百度搜索", icon: "", url: "https://www.baidu.com/s?wd=%s" },
        { name: "搜中文(谷歌)", icon: "", url: "https://www.google.com/search?lr=lang_zh-CN&q=%s" },
        { name: "站内搜索(谷歌)", icon: "", url: "https://www.google.com/search?q=site:%host%+%22%s%22" },
        { name: "维基百科", icon: "", url: "https://zh.wikipedia.org/wiki/%s" },
        { name: "GitHub", icon: "", url: "https://github.com/search?q=%s" },
        { name: "有道词典", icon: "", url: "http://dict.youdao.com/w/eng/%s" },
        {
            "name": "页面快照(谷歌)",
            "icon": "",
            "url": "http://www.google.com/search?q=cache:%url%"
        },
        {
            "name": "网页时光机",
            "icon": "",
            "url": "http://web.archive.org/%url%"
        },
        {
            "name": "翻译页面(谷歌)",
            "icon": "",
            "url": "https://translate.google.com/translate?sl=auto&tl=zh-CN&u=%url%"
        }
    ];

    // 配置系统 (GM_config) ---
    const DEFAULT_CONFIG = {
        btn_text: "⚡️",
        init_pos_top: "15%",
        init_pos_left: "10px",
        // 将默认数组转为格式化的JSON字符串
        custom_search_json: JSON.stringify(DEFAULT_SEARCH_ENGINES, null, 4)
    };

    const gmc = new GM_config({
        id: "ToolboxConfig",
        title: "工具箱设置",
        fields: {
            btn_text: { label: "按钮图标/文字", type: "text", default: DEFAULT_CONFIG.btn_text },
            show_button: { label: "显示悬浮球", type: "checkbox", default: true },
            // 新增：自定义搜索配置
            custom_search_json: {
                label: "自定义搜索列表 (JSON格式)",
                type: "textarea",
                default: DEFAULT_CONFIG.custom_search_json,
                css: "height: 300px; width: 100%; font-family: monospace; font-size: 12px;" // 样式优化
            }
        },
        events: {
            save: () => {
                gmc.close();
                updateButtonState();
                // 配置保存后刷新页面以应用新的搜索列表，或者重新渲染面板(稍微复杂点，刷新最简单)
                if (confirm("设置已保存。是否刷新页面以应用新的搜索列表？")) {
                    location.reload();
                }
            }
        }
    });

    // [核心修复] 必须显式初始化，否则 get() 会报错
    gmc.init();

    // 运行时状态
    const STATE = {
        isDarkMode: false,
        isEyeProtect: false
    };

    const Utils = {
        getSelection: () => {
            const text = window.getSelection().toString().trim();
            return text.length > 0 ? text : null;
        },
        prompt: (msg, defaultVal = "") => {
            return prompt(msg, defaultVal);
        },
        toast: (msg, duration = 3000) => {
            const toast = document.getElementById('gm-toast');
            toast.textContent = msg; // 纯文本用 textContent 很安全
            toast.classList.add('show');
            clearTimeout(toast.timer);
            toast.timer = setTimeout(() => toast.classList.remove('show'), duration);
        },
        modal: (title, content) => {
            const modal = document.getElementById('gm-result-modal');
            const overlay = document.getElementById('gm-result-overlay');
            const contentBox = document.getElementById('gm-result-content');

            document.getElementById('gm-result-title').textContent = title;

            // 智能判断：如果是字符串，使用安全HTML设置；如果是DOM元素，直接追加
            if (typeof content === 'string') {
                setHTML(contentBox, content);
            } else if (content instanceof Node) {
                contentBox.replaceChildren(); // 清空
                contentBox.appendChild(content);
            }

            modal.style.display = 'flex';
            overlay.style.display = 'block';
        },
        copy: (text) => {
            try {
                GM_setClipboard(text);
                Utils.toast('✅ 已复制到剪贴板');
            } catch (e) {
                navigator.clipboard.writeText(text).then(() => Utils.toast('✅ 已复制'));
            }
        }
    };


    // --- 辅助：构建搜索功能的函数 (自动图标版) ---
    const buildSearchTools = () => {
        let searchData = [];
        try {
            const jsonStr = gmc.get('custom_search_json');
            searchData = JSON.parse(jsonStr);
        } catch (e) {
            console.error("配置解析失败", e);
            searchData = DEFAULT_SEARCH_ENGINES;
        }

        return searchData.map(item => {
            // --- 核心逻辑：自动获取图标 ---
            let iconHtml = item.icon; // 默认用配置里的图标

            // 如果配置里 icon 为空，或者用户想强制用自动图标，则计算
            if (!iconHtml || iconHtml.trim() === "") {
                try {
                    // 1. 简单的占位符替换，防止 URL 解析报错
                    const cleanUrl = item.url.replace(/%s|%url%|%host%/g, 'example.com');
                    // 2. 提取主机名 (例如 www.google.com)
                    const hostname = new URL(cleanUrl).hostname;
                    // 3. 拼接 Google API (sz=32 获取高清一点的)
                    const faviconUrl = `https://p.520999.xyz/https://www.google.com/s2/favicons?sz=32&domain=${hostname}`;
                    // 4. 生成 img 标签
                    iconHtml = `<img src="${faviconUrl}" onerror="this.style.display='none'">`;
                } catch (e) {
                    iconHtml = "🔗"; // 解析失败的回退图标
                }
            }
            // ---------------------------

            return {
                name: item.name,
                // 这里我们稍微 hack 一下，因为原始逻辑是把 icon 当字符串拼进去的
                // 这里的 icon 属性现在可能包含 HTML 标签
                icon: iconHtml,
                action: () => {
                    let targetUrl = item.url;
                    targetUrl = targetUrl.replace(/%host%/g, location.hostname);
                    targetUrl = targetUrl.replace(/%url%/g, encodeURIComponent(location.href));

                    if (targetUrl.includes('%s')) {
                        const q = Utils.getSelection() || Utils.prompt(`请输入 [${item.name}] 内容：`);
                        if (!q) return;
                        targetUrl = targetUrl.replace(/%s/g, encodeURIComponent(q));
                    }

                    window.open(targetUrl);
                }

            };
        });
    };


    // --- 3. 功能定义 (保留所有原有功能) ---
    // 为了更好的UI，我们给功能加了图标和分类
    const TOOLS = {
        "常用工具": [
            {
                name: "朗读文本", icon: "🗣️",
                action: () => {
                    let q = Utils.getSelection() || Utils.prompt("请输入朗读文本：");
                    if (q) window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(q));
                }
            },
            {
                name: "生成二维码", icon: "📱",
                action: () => {
                    let q = Utils.getSelection() || window.location.href;
                    if (!q) return;

                    // 1. 创建 UI 容器
                    const wrapper = document.createElement('div');
                    wrapper.style.cssText = "display:flex; flex-direction:column; align-items:center; justify-content:center; padding:10px;";

                    const codeContainer = document.createElement('div');
                    // 使用 flex 居中
                    codeContainer.style.cssText = "background:white; padding:15px; border-radius:8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: flex; justify-content: center; align-items: center;";
                    wrapper.appendChild(codeContainer);

                    const textTip = document.createElement('div');
                    textTip.style.cssText = "text-align:center; font-size:12px; color:#999; margin-top:10px; word-break:break-all; max-width:250px; line-height: 1.4;";
                    textTip.textContent = q.length > 100 ? q.substring(0, 100) + '...' : q;
                    wrapper.appendChild(textTip);

                    // 2. 显示模态框
                    Utils.modal("📱 二维码生成", wrapper);

                    // 3. 延时调用库生成 (确保库已加载)
                    setTimeout(() => {
                        // node-qrcode 库加载后会暴露全局变量 QRCode
                        if (typeof QRCode !== 'undefined' && QRCode.toCanvas) {
                            // 创建 Canvas 元素
                            const canvas = document.createElement('canvas');
                            codeContainer.appendChild(canvas);

                            // 调用库绘制
                            // 优点：自动处理UTF-8中文，自动选择版本(不会overflow)
                            QRCode.toCanvas(canvas, q, {
                                width: 256,        // 宽度
                                margin: 0,         // 边距 (我们在外层容器控制了padding，这里设0)
                                color: {
                                    dark: '#000000',  // 前景色
                                    light: '#ffffff'  // 背景色
                                },
                                errorCorrectionLevel: 'M' // 中等容错率，平衡容量和清晰度
                            }, function (error) {
                                if (error) {
                                    console.error(error);
                                    codeContainer.replaceChildren(`<span style="color:red">生成失败: ${error.message}</span>`);
                                }
                            });
                        } else {
                            Utils.toast("❌ QRCode库未加载");
                        }
                    }, 50);
                }
            },
            {
                name: "翻译文本", icon: "🌐",
                action: () => {
                    let q = Utils.getSelection() || Utils.prompt("请输入翻译文本：");
                    if (!q) return;
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://translate.google.com/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=auto&tl=zh&q=" + encodeURIComponent(q),
                        onload: function (response) {
                            try {
                                const obj = JSON.parse(response.responseText);
                                let res = obj.sentences.map(s => s.trans).join("");
                                Utils.modal("翻译结果", res);
                            } catch (e) { Utils.toast("翻译解析失败"); }
                        }
                    });
                }
            },
            {
                name: "微信翻译", icon: "🟢",
                action: () => {
                    let q = Utils.getSelection() || Utils.prompt("请输入翻译文本：");
                    if (!q) return;

                    // 构造 URL 参数
                    const params = "source=auto&target=zh&platform=WeChat_APP&candidateLangs=en|zh&guid=cli_user&sourceText=" + encodeURIComponent(q);

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://wxapp.translator.qq.com/api/translate?" + params,
                        headers: {
                            "Content-Type": "application/json",
                            // 伪造 Referer 和 UA 是必须的
                            "Referer": "https://servicewechat.com/wxb1070eabc6f9107e/117/page-frame.html",
                            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.32(0x18002035) NetType/WIFI Language/zh_TW"
                        },
                        onload: function (response) {
                            try {
                                const obj = JSON.parse(response.responseText);
                                if (obj && obj.targetText) {
                                    Utils.modal("微信翻译结果", obj.targetText);
                                } else {
                                    Utils.toast("微信接口返回异常");
                                }
                            } catch (e) { Utils.toast("翻译解析失败"); }
                        },
                        onerror: (e) => Utils.toast("网络请求失败")
                    });
                }
            },
            {
                name: "翻译整页", icon: "🔄",
                action: () => {
                    Utils.toast("⏳ 开始分析并翻译页面，这可能需要一点时间...");
                    const googleTranslateAPI = (text) => {
                        return new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: "https://translate.googleapis.com/translate_a/single?" + new URLSearchParams({
                                    client: "gtx",
                                    dt: "t",
                                    sl: "auto",  // 源语言自动
                                    tl: "zh-CN", // 目标语言中文
                                    q: text
                                }).toString(),
                                onload: function (response) {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        // 解析逻辑参考了你的代码：result.data[0].map...
                                        if (data && data[0]) {
                                            const result = data[0].map(item => item[0]).join("");
                                            resolve(result);
                                        } else {
                                            resolve(text); // 失败返回原文
                                        }
                                    } catch (e) {
                                        reject(e);
                                    }
                                },
                                onerror: reject
                            });
                        });
                    };
                    async function translatePage() {
                        const walker = document.createTreeWalker(
                            document.body,
                            NodeFilter.SHOW_TEXT,
                            {
                                acceptNode: function (node) {
                                    const tag = node.parentElement.tagName;
                                    if (["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE"].includes(tag)) return NodeFilter.FILTER_REJECT;
                                    if (node.textContent.trim().length === 0) return NodeFilter.FILTER_REJECT;
                                    return NodeFilter.FILTER_ACCEPT;
                                }
                            }
                        );

                        const textNodes = [];
                        let node;
                        while (node = walker.nextNode()) {
                            textNodes.push(node);
                        }

                        Utils.toast(`🔍 发现 ${textNodes.length} 个文本段落，开始翻译...`);

                        // 3. 批量处理 (为了防止请求过快被封，每次处理一小批)
                        const BATCH_SIZE = 10; // 并发数
                        let completed = 0;

                        // 简单的队列处理
                        for (let i = 0; i < textNodes.length; i += BATCH_SIZE) {
                            const batch = textNodes.slice(i, i + BATCH_SIZE);
                            const promises = batch.map(async (textNode) => {
                                try {
                                    const originalText = textNode.textContent.trim();
                                    // 只有纯英文/非中文才翻译 (简单判断)
                                    if (!/[\u4e00-\u9fa5]/.test(originalText) && originalText.length > 2) {
                                        const translated = await googleTranslateAPI(originalText);
                                        if (translated && translated !== originalText) {
                                            textNode.textContent = translated;
                                            // 标记一下颜色，让人知道这里被翻译了
                                            if (textNode.parentElement) textNode.parentElement.style.backgroundColor = "rgba(255, 255, 0, 0.1)";
                                        }
                                    }
                                } catch (e) {
                                    console.error("翻译片段失败", e);
                                }
                            });

                            await Promise.all(promises);
                            completed += batch.length;

                            // 每完成50个节点提示一下进度
                            if (i % 50 === 0) {
                                Utils.toast(`正在翻译... ${Math.min(100, Math.round(completed / textNodes.length * 100))}%`);
                            }
                        }

                        Utils.toast("✅ 页面翻译完成");
                    }

                    translatePage();
                }
            },

        ],

        "搜索增强": [],

        "其他工具": [
            {
                name: "解除限制", icon: "🔓",
                action: () => {
                    // 增强版解除限制
                    const events = ["copy", "cut", "contextmenu", "selectstart", "mousedown", "mouseup", "mousemove", "keydown", "keypress", "keyup"];
                    events.forEach(e => document.documentElement.addEventListener(e, evt => { evt.stopPropagation(); }, { capture: true }));
                    const style = document.createElement('style');
                    style.replaceChildren(`* { user-select: text !important; -webkit-user-select: text !important; }`);
                    document.body.appendChild(style);
                    Utils.toast("🔓 已尝试解除右键和复制限制");
                }
            },
            {
                name: "显示密码", icon: "👀",
                action: () => {
                    document.querySelectorAll("input[type='password']").forEach(el => el.type = "text");
                    Utils.toast("👀 密码已明文显示");
                }
            },

            {
                name: "屏幕取色", icon: "🎨",
                action: async () => {
                    if (!window.EyeDropper) return Utils.toast("⚠️ 您的浏览器不支持取色 API (需 Chrome 95+)");
                    try {
                        const ed = new window.EyeDropper();
                        const result = await ed.open();
                        Utils.copy(result.sRGBHex);
                        Utils.toast(`🎨 颜色 ${result.sRGBHex} 已复制`);
                    } catch (e) {
                        if (!e.toString().includes('canceled')) Utils.toast("❌ 取色失败");
                    }
                }
            },
            {
                name: "护眼模式", icon: "👁️",
                action: (btn) => {
                    STATE.isEyeProtect = !STATE.isEyeProtect;
                    let mask = document.getElementById('gm-eye-protect');
                    if (!mask) {
                        mask = document.createElement('div');
                        mask.id = 'gm-eye-protect';
                        mask.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255, 240, 0, 0.15);mix-blend-mode:multiply;pointer-events:none;z-index:2147483647;display:none;";
                        document.body.appendChild(mask);
                    }
                    mask.style.display = STATE.isEyeProtect ? 'block' : 'none';
                    btn.classList.toggle('active', STATE.isEyeProtect);
                    Utils.toast(STATE.isEyeProtect ? "✅ 护眼模式已开启" : "🚫 护眼模式已关闭");
                },
                hasDot: true
            },
            {
                name: "暗黑模式", icon: "🌙",
                action: (btn) => {
                    STATE.isDarkMode = !STATE.isDarkMode;
                    let style = document.getElementById('gm-dark-mode-style');
                    if (!style) {
                        style = document.createElement('style');
                        style.id = 'gm-dark-mode-style';
                        style.replaceChildren(`html { filter: invert(1) hue-rotate(180deg) !important; } img, video, iframe { filter: invert(1) hue-rotate(180deg) !important; }`);
                        document.head.appendChild(style);
                        style.disabled = true;
                    }
                    style.disabled = !STATE.isDarkMode;
                    btn.classList.toggle('active', STATE.isDarkMode);
                    Utils.toast(STATE.isDarkMode ? "🌙 智能夜间模式已开启" : "☀️ 已恢复日间模式");
                },
                hasDot: true
            },
            {
                name: "编辑网页", icon: "✏️",
                action: () => {
                    const isEditable = document.body.contentEditable === 'true';
                    document.body.contentEditable = !isEditable;
                    document.designMode = !isEditable ? 'on' : 'off';
                    Utils.toast(isEditable ? "🔒 已关闭编辑模式" : "✏️ 网页可随意编辑");
                }
            },
            {
                name: "屏蔽元素", icon: "🚫",
                action: () => {
                    Utils.toast("请点击要屏蔽的元素 (按ESC取消)");
                    const handler = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.target.style.display = 'none';
                        document.removeEventListener('click', handler, true);
                        Utils.toast("🚫 元素已隐藏");
                    };
                    document.addEventListener('click', handler, true);
                }
            },

            {
                name: "网页标注(Spacing)", icon: "📏",
                action: () => {
                    // 使用动态导入，不阻塞主线程
                    const script = document.createElement('script');
                    script.src = "https://unpkg.com/spacingjs";
                    document.body.appendChild(script);
                    Utils.toast("📏 按住 Alt 键查看元素间距");
                }
            },
            {
                name: "执行JS", icon: "💻",
                action: () => {
                    let q = Utils.getSelection() || Utils.prompt("输入JavaScript代码：", "alert('Hello')");
                    if (q) {
                        try { eval(q); } catch (e) { Utils.modal("Error", e); }
                    }
                }
            },
            {
                name: "调试信息", icon: "🐞",
                action: () => {
                    const info = `
Title: ${document.title}
URL: ${location.href}
UserAgent: ${navigator.userAgent}
Screen: ${screen.width}x${screen.height}
Cookie: ${document.cookie}
LastModified: ${document.lastModified}
                    `.trim();
                    console.log(info);
                    Utils.modal("页面调试信息", info);
                }
            }
        ]
    };


    // 额外的设置项：脚本设置
    TOOLS["常用工具"].unshift({
        name: "脚本设置", icon: "⚙️",
        action: () => gmc.open()
    });
    TOOLS["常用工具"].unshift({
        name: "隐藏按钮", icon: "🙈",
        action: () => {
            const btn = document.getElementById('gm-float-btn');
            if (btn) {
                btn.style.setProperty('display', 'none', 'important');
            }
            Utils.toast("按钮已隐藏，请在脚本管理器菜单重新开启或刷新页面");
        }
    });




    //Config
    const CONSTANTS = {
        Z_INDEX: 2147483647,
        THEME_COLOR: '#007AFF', // iOS Blue
        GLASS_BG: 'rgba(255, 255, 255, 0.75)',
        GLASS_BG_DARK: 'rgba(30, 30, 30, 0.85)',
        ANIMATION_SPEED: '0.25s'
    };

    // --- 1. 样式系统 (CSS) ---
    GM_addStyle(`
        /* === 样式隔离与重置 (核心修复：防止网页样式污染) === */
        #gm-toolbox-panel, #gm-toolbox-panel * {
            box-sizing: border-box !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            line-height: 1.5 !important;
            -webkit-font-smoothing: antialiased;
        }
        
        /* 强制重置面板内的图片和SVG，防止网页全局样式(如 max-width: 100%)导致图标变形 */
        #gm-toolbox-panel img, #gm-toolbox-panel svg {
            max-width: none !important;
            max-height: none !important;
            vertical-align: middle !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
        }

        /* 悬浮球 (保持原样，微调) */
        #gm-float-btn {
            position: fixed;
            width: 44px !important;
            height: 44px !important;
            border-radius: 50% !important;
            background: ${CONSTANTS.GLASS_BG_DARK};
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: ${CONSTANTS.Z_INDEX};
            cursor: move;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
            font-size: 20px !important;
            user-select: none;
            transition: transform 0.1s, background ${CONSTANTS.ANIMATION_SPEED};
            border: 1px solid rgba(255,255,255,0.1) !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        #gm-float-btn:hover { transform: scale(1.1); background: #000; }
        #gm-float-btn:active { transform: scale(0.95); }

        /* 主菜单面板 */
        #gm-toolbox-panel {
            position: fixed;
            display: none; /* 配合 JS 的 toggle 逻辑 */
            width: 340px !important;
            max-height: 80vh !important;
            overflow: hidden !important;
            background: ${CONSTANTS.GLASS_BG_DARK};
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: 16px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.4) !important;
            z-index: ${CONSTANTS.Z_INDEX};
            padding: 16px !important;
            color: #fff !important;
            border: 1px solid rgba(255,255,255,0.08) !important;
            
            /* === 核心修复：隐藏状态 === */
            opacity: 0;
            transform: scale(0.95);
            
            /* 1. 禁止鼠标穿透：确保看不见的时候点不到 */
            pointer-events: none !important; 
            
            /* 2. 移除可见性：确保不会触发 hover 和 tooltip */
            visibility: hidden !important;   
            /* ========================= */

            transition: opacity ${CONSTANTS.ANIMATION_SPEED}, transform ${CONSTANTS.ANIMATION_SPEED}, visibility ${CONSTANTS.ANIMATION_SPEED};
            text-align: left !important;
            flex-direction: column;
        }

        /* 显示状态 */
        #gm-toolbox-panel.show { 
            opacity: 1; 
            transform: scale(1); 
            
            /* === 核心修复：显示状态 === */
            /* 恢复鼠标交互 */
            pointer-events: auto !important; 
            /* 恢复可见性 */
            visibility: visible !important;
            /* ========================= */
        }

        #gm-search-wrapper {
            margin-bottom: 12px !important;
            position: relative !important;
            flex-shrink: 0;
            width: 100% !important;
            height: 36px !important; /* 固定高度，防止塌陷 */
        }
        #gm-search-input {
            width: 100% !important;
            height: 100% !important;
            background: rgba(255,255,255,0.1) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            border-radius: 8px !important;
            padding: 0 34px 0 10px !important; /* 右侧留出图标位置 */
            color: #fff !important;
            font-size: 14px !important;
            outline: none !important;
            transition: background 0.2s;
            margin: 0 !important;
            line-height: normal !important; /* 修复文字垂直对齐 */
            appearance: none !important; /* 去除浏览器默认样式 */
        }
        #gm-search-input:focus { background: rgba(255,255,255,0.15) !important; border-color: ${CONSTANTS.THEME_COLOR} !important; }
        
        #gm-search-icon {
            position: absolute !important;
            right: 0 !important;
            top: 0 !important;
            width: 34px !important; /* 宽度与 input padding 对应 */
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: rgba(255,255,255,0.4) !important;
            pointer-events: none;
            font-size: 14px !important;
            line-height: 1 !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* 内容滚动区域 */
        #gm-content-scroll {
            overflow-y: auto !important;
            flex-grow: 1;
            padding-right: 2px;
            /* 修复滚动条样式 */
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.2) transparent;
        }
        #gm-content-scroll::-webkit-scrollbar { width: 4px; }
        #gm-content-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
        #gm-content-scroll::-webkit-scrollbar-track { background: transparent; }

        /* 分类标题 */
        .gm-category-title {
            font-size: 12px !important;
            color: rgba(255,255,255,0.5) !important;
            margin: 14px 0 6px 4px !important;
            padding: 0 !important;
            font-weight: 700 !important;
            text-transform: uppercase;
            letter-spacing: 0.5px !important;
            line-height: 1.2 !important;
        }
        .gm-category-title:first-child { margin-top: 0 !important; }

        /* 网格布局 */
        .gm-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* 功能按钮 */
        .gm-tool-btn {
            background: rgba(255,255,255,0.05) !important;
            border: none !important;
            color: #eee !important;
            padding: 8px 10px !important; /* 微调内边距 */
            margin: 0 !important;
            width: 100% !important;
            height: auto !important;
            min-height: 42px !important;
            border-radius: 8px !important;
            cursor: pointer;
            font-size: 13px !important;
            text-align: left !important;
            display: flex !important;
            align-items: center !important; /* 垂直居中 */
            justify-content: flex-start !important;
            transition: all 0.2s;
            user-select: none;
            position: relative !important;
            overflow: hidden !important; /* 防止内容溢出 */
        }
        .gm-tool-btn:hover { background: ${CONSTANTS.THEME_COLOR} !important; color: #fff !important; transform: translateY(-1px); }
        
        /* === 图标统一尺寸修复 (核心) === */
        .gm-tool-btn .icon {
            width: 24px !important;  /* 强制固定宽度 */
            height: 24px !important; /* 强制固定高度 */
            min-width: 24px !important;
            margin-right: 10px !important;
            font-size: 18px !important; /* Emoji 字体大小 */
            line-height: 1 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            flex-shrink: 0 !important; /* 防止被挤压 */
        }

        /* 强制约束图片图标 */
        .gm-tool-btn .icon img, .gm-tool-btn .icon svg {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important; /* 保持比例适应 */
            display: block !important;
            border-radius: 2px !important;
        }
        
        /* 收藏星星 */
        .gm-fav-star {
            position: absolute;
            top: 4px; right: 4px;
            font-size: 10px !important;
            line-height: 1 !important;
            color: #FFD60A;
            opacity: 0.8;
            text-shadow: 0 0 5px rgba(255, 214, 10, 0.5);
        }

        /* 状态圆点 */
        .gm-dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: #ccc; margin-left: auto; flex-shrink: 0;
        }
        .gm-tool-btn.active .gm-dot { background: #34C759; box-shadow: 0 0 5px #34C759; }

        /* 拖拽样式 */
        .gm-tool-btn.gm-dragging { opacity: 0.4; transform: scale(0.95); border: 1px dashed rgba(255,255,255,0.5) !important; }
        .gm-tool-btn.gm-drag-over { border-top: 2px solid ${CONSTANTS.THEME_COLOR} !important; transform: translateY(2px); }

        /* Toast & Modal (保持不变) */
        #gm-toast {
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100%);
            background: rgba(0,0,0,0.85); color: #fff; padding: 10px 20px !important; border-radius: 50px !important;
            z-index: ${CONSTANTS.Z_INDEX + 10}; font-size: 14px !important; opacity: 0; pointer-events: none;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55); backdrop-filter: blur(5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important; border: 1px solid rgba(255,255,255,0.1) !important;
            white-space: nowrap;
        }
        #gm-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
        
        #gm-result-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: ${CONSTANTS.Z_INDEX + 15}; display: none; backdrop-filter: blur(2px); }
        #gm-result-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 500px !important; max-width: 90vw !important; background: #fff !important; color: #333 !important; border-radius: 12px !important; padding: 20px !important; z-index: ${CONSTANTS.Z_INDEX + 20}; box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important; display: none; flex-direction: column !important; text-align: left !important; }
        #gm-result-header { display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 15px !important; border-bottom: 1px solid #eee !important; padding-bottom: 10px !important; }
        #gm-result-title { font-weight: bold !important; font-size: 16px !important; color: #000 !important; margin: 0 !important; }
        #gm-result-close { cursor: pointer; padding: 5px; font-weight: bold; color: #999; line-height: 1 !important; }
        #gm-result-content { max-height: 60vh !important; overflow-y: auto !important; white-space: pre-wrap !important; font-family: monospace !important; font-size: 14px !important; background: #f9f9f9 !important; padding: 10px !important; border-radius: 6px !important; border: 1px solid #eee !important; }
    `);


    // --- 2. 存储与辅助函数 ---

    // 收藏管理
    const FAV_KEY = 'tools_fav_list';
    const getFavorites = () => GM_getValue(FAV_KEY, []);
    const isFavorite = (name) => getFavorites().includes(name);
    const toggleFavorite = (name) => {
        let favs = getFavorites();
        if (favs.includes(name)) {
            favs = favs.filter(n => n !== name);
            Utils.toast(`已取消收藏: ${name}`);
        } else {
            favs.push(name);
            Utils.toast(`⭐ 已收藏: ${name}`);
        }
        GM_setValue(FAV_KEY, favs);
        return favs;
    };

    // 排序管理
    const getSavedOrder = () => GM_getValue('tools_order_map', {});
    const saveCategoryOrder = (categoryName, container) => {
        // 如果是“收藏”分类，不保存排序（或者你可以实现单独的收藏排序逻辑，这里为了简单跳过）
        if (categoryName === '⭐ 收藏置顶') return;

        const orderMap = getSavedOrder();
        const currentOrder = Array.from(container.children).map(btn => btn.dataset.name);
        orderMap[categoryName] = currentOrder;
        GM_setValue('tools_order_map', orderMap);
    };


    // --- 5. UI 构建与事件逻辑 ---

    function createUI() {
        // ... (Toast, Modal, Float Button 创建保持不变) ...
        const toast = document.createElement('div'); toast.id = 'gm-toast'; document.body.appendChild(toast);
        const overlay = document.createElement('div'); overlay.id = 'gm-result-overlay';
        const modal = document.createElement('div'); modal.id = 'gm-result-modal';
        setHTML(modal, `<div id="gm-result-header"><h3 id="gm-result-title">Title</h3><span id="gm-result-close">✕</span></div><div id="gm-result-content"></div>`);
        document.body.appendChild(overlay); document.body.appendChild(modal);
        const closeFn = () => { modal.style.display = 'none'; overlay.style.display = 'none'; };
        document.getElementById('gm-result-close').onclick = closeFn; overlay.onclick = closeFn;

        const btn = document.createElement('div');
        btn.id = 'gm-float-btn';
        setHTML(btn, gmc.get('btn_text'));
        btn.style.top = GM_getValue('pos_top', DEFAULT_CONFIG.init_pos_top);
        btn.style.left = GM_getValue('pos_left', DEFAULT_CONFIG.init_pos_left);
        if (!gmc.get('show_button')) btn.style.setProperty('display', 'none', 'important');
        document.body.appendChild(btn);

        // --- Panel 构建 ---
        const panel = document.createElement('div');
        panel.id = 'gm-toolbox-panel';

        // 搜索框区域
        const searchWrapper = document.createElement('div');
        searchWrapper.id = 'gm-search-wrapper';
        // 使用 type="search" 并禁止浏览器默认样式
        setHTML(searchWrapper, `
            <input type="text" id="gm-search-input" placeholder="搜索功能..." autocomplete="off" spellcheck="false">
            <div id="gm-search-icon">🔍</div>
        `);
        panel.appendChild(searchWrapper);

        // 内容滚动区域
        const contentScroll = document.createElement('div');
        contentScroll.id = 'gm-content-scroll';
        panel.appendChild(contentScroll);

        document.body.appendChild(panel);

        // --- 渲染逻辑 (Render Tool List) ---
        let dragSrcEl = null;

        function renderToolList() {
            contentScroll.replaceChildren(); // 清空内容区域

            TOOLS["搜索增强"] = buildSearchTools();

            const savedOrderMap = getSavedOrder();
            const favorites = getFavorites();
            const searchVal = panel.querySelector('#gm-search-input').value.toLowerCase().trim();

            let categoriesToRender = {};

            // 收藏置顶逻辑
            // 1. 收藏置顶逻辑 (修改版：支持排序)
            if (favorites.length > 0 && !searchVal) {
                let favTools = [];
                // 核心修改：遍历“收藏列表”而不是遍历“所有工具”，这样才能保证渲染顺序与存储顺序一致
                favorites.forEach(favName => {
                    // 在所有工具中查找对应的工具对象
                    for (const toolList of Object.values(TOOLS)) {
                        const foundTool = toolList.find(t => t.name === favName);
                        if (foundTool) {
                            favTools.push({ ...foundTool, isFavItem: true });
                            break; // 找到了就跳出当前分类循环
                        }
                    }
                });

                if (favTools.length > 0) categoriesToRender['⭐ 收藏置顶'] = favTools;
            }

            Object.assign(categoriesToRender, TOOLS);

            for (const [category, rawItems] of Object.entries(categoriesToRender)) {
                let items = [...rawItems];

                if (category !== '⭐ 收藏置顶' && savedOrderMap[category]) {
                    const orderList = savedOrderMap[category];
                    items.sort((a, b) => {
                        let indexA = orderList.indexOf(a.name); let indexB = orderList.indexOf(b.name);
                        if (indexA === -1) indexA = 9999; if (indexB === -1) indexB = 9999;
                        return indexA - indexB;
                    });
                }

                if (searchVal) {
                    items = items.filter(t => t.name.toLowerCase().includes(searchVal));
                    if (items.length === 0) continue;
                }

                const title = document.createElement('div');
                title.className = 'gm-category-title';
                title.innerText = category;
                contentScroll.appendChild(title);

                const grid = document.createElement('div');
                grid.className = 'gm-grid';
                grid.dataset.category = category;

                items.forEach(tool => {
                    const b = document.createElement('button');
                    b.className = 'gm-tool-btn';
                    b.dataset.name = tool.name;
                    b.setAttribute('draggable', 'true');
                    b.title = "左键运行，右键收藏/取消";

                    const isFav = isFavorite(tool.name);

                    // 这里 icon 容器已经被 CSS 强制锁定大小
                    let html = `<span class="icon">${tool.icon}</span><span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${tool.name}</span>`;
                    if (tool.hasDot) html += `<div class="gm-dot"></div>`;
                    if (isFav) html += `<span class="gm-fav-star">★</span>`;
                    setHTML(b, html);

                    b.onclick = (e) => {
                        e.stopPropagation();
                        if (!tool.hasDot) togglePanel(false);
                        try { tool.action(b); } catch (err) { console.error(err); Utils.toast("❌ Error: " + err.message); }
                        togglePanel(false);
                    };

                    b.oncontextmenu = (e) => {
                        e.preventDefault(); e.stopPropagation();
                        toggleFavorite(tool.name);
                        renderToolList();
                        return false;
                    };

                    // 拖拽逻辑 (保持不变)
                    b.addEventListener('dragstart', function (e) {
                        dragSrcEl = this;
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/html', this.innerHTML);
                        this.classList.add('gm-dragging');
                    });
                    b.addEventListener('dragend', function () {
                        this.classList.remove('gm-dragging');
                        grid.querySelectorAll('.gm-tool-btn').forEach(el => el.classList.remove('gm-drag-over'));
                    });
                    b.addEventListener('dragover', function (e) {
                        if (e.preventDefault) e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        return false;
                    });
                    b.addEventListener('dragenter', function () {
                        if (this !== dragSrcEl) this.classList.add('gm-drag-over');
                    });
                    b.addEventListener('dragleave', function () {
                        this.classList.remove('gm-drag-over');
                    });
                    b.addEventListener('drop', function (e) {
                        e.stopPropagation();

                        // 判断是否在同一个父容器内（同分类）
                        if (dragSrcEl !== this && dragSrcEl.parentNode === this.parentNode) {

                            // 1. DOM 操作：交换位置
                            this.parentNode.insertBefore(dragSrcEl, this);

                            // 2. 数据保存逻辑
                            if (category === '⭐ 收藏置顶') {
                                // === 核心修改：如果是收藏夹，直接更新收藏列表数据 ===
                                const newFavOrder = Array.from(this.parentNode.children).map(btn => btn.dataset.name);
                                GM_setValue(FAV_KEY, newFavOrder);
                                Utils.toast('收藏排序已更新');
                            } else {
                                // 普通分类，走原来的保存逻辑
                                saveCategoryOrder(category, this.parentNode);
                            }
                        }
                        return false;
                    });

                    grid.appendChild(b);
                });
                contentScroll.appendChild(grid);
            }

            if (contentScroll.children.length === 0 && searchVal) {
                const empty = document.createElement('div');
                empty.style.cssText = "text-align:center; color:#999; margin-top:20px; font-size:13px;";
                empty.innerText = "未找到相关功能";
                contentScroll.appendChild(empty);
            }
        }

        renderToolList();

        // 交互事件监听 (搜索框)
        const searchInput = panel.querySelector('#gm-search-input');
        searchInput.addEventListener('input', () => renderToolList());
        searchInput.addEventListener('click', (e) => e.stopPropagation()); // 防止点击输入框关闭面板

        // 交互事件监听 (悬浮球拖拽 & 面板开关 - 保持原逻辑)
        let isDragging = false, hasMoved = false, startX, startY, initLeft, initTop;
        btn.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isDragging = true; hasMoved = false;
            startX = e.clientX; startY = e.clientY;
            const rect = btn.getBoundingClientRect();
            initLeft = rect.left; initTop = rect.top;
            btn.style.transition = 'none';
            e.preventDefault();
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX; const dy = e.clientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
            let newLeft = initLeft + dx; let newTop = initTop + dy;
            const maxLeft = window.innerWidth - btn.offsetWidth; const maxTop = window.innerHeight - btn.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, maxLeft)); newTop = Math.max(0, Math.min(newTop, maxTop));
            btn.style.left = newLeft + 'px'; btn.style.top = newTop + 'px';
        });
        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            btn.style.transition = `transform 0.1s, background ${CONSTANTS.ANIMATION_SPEED}`;
            if (hasMoved) { GM_setValue('pos_top', btn.style.top); GM_setValue('pos_left', btn.style.left); }
        });

        btn.addEventListener('click', (e) => {
            // 1. 阻止默认行为和冒泡，防止触发页面其他点击事件
            e.preventDefault();
            e.stopPropagation();

            // 只有在没有拖动的情况下才视为“点击”
            if (!hasMoved) {
                togglePanel();

                // === 自动聚焦逻辑 ===
                // 使用 setTimeout 是为了等待面板从 display:none 变为可见
                setTimeout(() => {
                    const input = document.getElementById('gm-search-input');
                    const panel = document.getElementById('gm-toolbox-panel');

                    // 获取当前页面选中的文本
                    const selection = window.getSelection().toString();

                    // 逻辑判断：
                    // 1. 面板必须是显示状态 (含有 .show 类)
                    // 2. 页面上【没有】选中文本 (!selection)
                    //    原因：如果页面有选中文本，自动 focus 会导致选中文本丢失，无法使用"搜索选中"功能
                    if (panel.classList.contains('show') && !selection) {
                        input.focus();
                    }
                }, 50); // 50ms 延时足够让 CSS transition 开始生效
            }
        });

        // 同时也需要确保 mousedown 不会清除选中 (之前的代码已经包含了 e.preventDefault，这里再次确认)
        btn.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            // 这一行非常重要：阻止鼠标按下时浏览器默认清除选区的行为
            e.preventDefault();

            isDragging = true; hasMoved = false;
            startX = e.clientX; startY = e.clientY;
            const rect = btn.getBoundingClientRect();
            initLeft = rect.left; initTop = rect.top;
            btn.style.transition = 'none';
        });


        document.addEventListener('click', (e) => {
            if (panel.classList.contains('show') && !panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
                togglePanel(false);
            }
        });

        function togglePanel(forceState) {
            const isVisible = panel.classList.contains('show');
            const shouldShow = forceState !== undefined ? forceState : !isVisible;
            if (shouldShow) {
                const btnRect = btn.getBoundingClientRect();
                const panelWidth = 340;
                const panelHeight = Math.min(window.innerHeight * 0.8, 600);
                let left = btnRect.right + 15;
                let top = btnRect.top;
                if (left + panelWidth > window.innerWidth) left = btnRect.left - panelWidth - 15;
                if (top + panelHeight > window.innerHeight) top = window.innerHeight - panelHeight - 20;
                if (top < 10) top = 10;

                panel.style.left = left + 'px';
                panel.style.top = top + 'px';
                panel.style.height = panelHeight + 'px';
                panel.style.display = 'flex';

                requestAnimationFrame(() => panel.classList.add('show'));
            } else {
                panel.classList.remove('show');
                setTimeout(() => { if (!panel.classList.contains('show')) panel.style.display = 'none'; }, 300);
            }
        }
    }




    // 更新按钮状态（用于配置保存后）
    function updateButtonState() {
        let btn = document.getElementById('gm-float-btn');
        if (!btn) return;
        btn.replaceChildren(gmc.get('btn_text'));
        if (gmc.get('show_button')) {
            btn.style.setProperty('display', 'flex', 'important');
        } else {
            btn.style.setProperty('display', 'none', 'important');
        }
    }

    // 注册油猴菜单命令（作为备用入口）
    GM_registerMenuCommand("打开工具箱面板", () => {
        const panel = document.getElementById('gm-toolbox-panel');
        // 如果没有显示按钮，临时显示面板在屏幕中心
        if (!document.getElementById('gm-float-btn').offsetParent) {
            if (panel) {
                panel.style.top = '100px';
                panel.style.left = '50%';
                panel.style.transform = 'translateX(-50%)';
                panel.style.display = 'block';
                setTimeout(() => panel.classList.add('show'), 10);
            }
        } else {
            // 模拟点击按钮
            document.getElementById('gm-float-btn').click();
        }
    });

    GM_registerMenuCommand("打开脚本设置界面", () => {
        gmc.open();
    });

    GM_registerMenuCommand("重置悬浮球位置", () => {
        const btn = document.getElementById('gm-float-btn');
        if (btn) {
            btn.style.top = DEFAULT_CONFIG.init_pos_top;
            btn.style.left = DEFAULT_CONFIG.init_pos_left;
            GM_setValue('pos_top', DEFAULT_CONFIG.init_pos_top);
            GM_setValue('pos_left', DEFAULT_CONFIG.init_pos_left);
            Utils.toast("已重置位置");
        }
    });

    GM_registerMenuCommand("重置面板排序", () => {
        GM_setValue('tools_order_map', {});
        Utils.toast("排序已重置，请刷新页面");
    });


    // --- 启动脚本 ---
    // 延迟加载，确保页面主体渲染完成，减少冲突
    (function main() {
        setTimeout(createUI, 300);
    })();
})();