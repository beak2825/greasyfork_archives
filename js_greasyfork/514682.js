// ==UserScript==
// @name         网页字体替换增强器
// @namespace    https://greasyfork.org/scripts/514682
// @description  替换网页默认字体。可根据需求修改脚本中的字体设置。使用前需确保已安装所需字体。记得修改浏览器自带的字体设置。
// @version      10.3.1
// @license      Apache License 2.0
// @author       Ckrvxr
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @homepageURL  https://greasyfork.org/zh-CN/scripts/514682
// @downloadURL https://update.greasyfork.org/scripts/514682/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%E5%A2%9E%E5%BC%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/514682/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%E5%A2%9E%E5%BC%BA%E5%99%A8.meta.js
// ==/UserScript==
(function () {
    "use strict";

    const defaultConfig = {
        sans_latin: ["MiSans", "MiSans L3", "SF Pro"],
        sans_simplified: ["MiSans", "MiSans L3", "SF Pro"],
        sans_traditional: ["MiSans TC", "MiSans L3", "SF Pro"],
        serif_latin: ["Clear Han Serif", "", ""],
        serif_simplified: ["Clear Han Serif", "", ""],
        serif_traditional: ["Clear Han Serif", "", ""],
        mono_latin: ["Cascadia Next SC", "Cascadia Code", "SF Mono"],
    };

    function loadConfig() {
        return {
            sans_latin: GM_getValue("sans_latin", defaultConfig.sans_latin),
            sans_simplified: GM_getValue("sans_simplified",defaultConfig.sans_simplified),
            sans_traditional: GM_getValue("sans_traditional",defaultConfig.sans_traditional),
            serif_latin: GM_getValue("serif_latin", defaultConfig.serif_latin),
            serif_simplified: GM_getValue("serif_simplified",defaultConfig.serif_simplified),
            serif_traditional: GM_getValue("serif_traditional",defaultConfig.serif_traditional),
            mono_latin: GM_getValue("mono_latin", defaultConfig.mono_latin),
        };
    }

    function saveConfig(config) {
        Object.keys(config).forEach((key) => {GM_setValue(key, config[key]);});
    }

    function createConfigUI(config) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflowX = "hidden";
        document.documentElement.style.overflowY = "hidden";

        const panel = document.createElement("div");
        panel.id = "font-config-panel";
        panel.style.cssText = `
            z-index: 999999;
            position: fixed;
            inset: 0;
            background: #ffffff;
            overflow-y: auto;
            padding: 4rem;
            font-family: sans-serif;
        `;

        const title = document.createElement("h1");
        title.textContent = "字体替换增强器 · 配置面板";
        title.style.cssText = `
            margin: 0 0 1rem;
            font-size: 1.5rem;
            text-align: center;
            color: #333333;
            position: relative;
        `;

        const createInputGroup = (type, label) => {
            const container = document.createElement("div");
            container.style.marginBottom = "1rem";

            const titleLabel = document.createElement("label");
            titleLabel.textContent = label;
            titleLabel.style.cssText = `
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: #333333;
                font-size: 1rem;
            `;

            const inputContainer = document.createElement("div");
            inputContainer.style.cssText = `
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 2rem;
            `;

            config[type].forEach((value, index) => {
                const input = document.createElement("input");
                input.type = "text";
                input.value = value;
                input.dataset.type = type;
                input.dataset.index = index;
                input.placeholder = `备选字体 ${index + 1}`;
                input.style.cssText = `
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid #cccccc;
                    border-radius: 6px;
                    font-size: 0.875rem;
                    color: #333333;
                    background: #f9f9f9;
                `;
                inputContainer.appendChild(input);
            });

            container.appendChild(titleLabel);
            container.appendChild(inputContainer);
            return container;
        };

        const createButton = (text, colorScheme) => {
            const btn = document.createElement("button");
            btn.textContent = text;
            btn.style.cssText = `
                flex: 1;
                padding: 0.75rem;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                margin: 0.5rem 0;
                color: white;
                background: ${colorScheme.base};
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;

            btn.addEventListener("mouseover", () => {
                btn.style.background = colorScheme.hover;
                btn.style.transform = "translateY(-1px)";
            });

            btn.addEventListener("mouseout", () => {
                btn.style.background = colorScheme.base;
                btn.style.transform = "translateY(0)";
            });

            return btn;
        };

        const colorSchemes = {
            primary: {
                base: "#4f46e5",
                hover: "#4338ca",
            },
            secondary: {
                base: "#3b82f6",
                hover: "#2563eb",
            },
            success: {
                base: "#10b981",
                hover: "#0b8a5e",
            },
            warning: {
                base: "#f59e0b",
                hover: "#d97706",
            },
            danger: {
                base: "#ef4444",
                hover: "#dc2626",
            },
            info: {
                base: "#64748b",
                hover: "#475569",
            },
        };

        const importInput = document.createElement("input");
        importInput.type = "file";
        importInput.accept = ".json";
        importInput.style.display = "none";

        const importBtn = createButton("导入配置", colorSchemes.warning);
        importBtn.onclick = () => importInput.click();
        importInput.onchange = async () => {
            try {
                const file = importInput.files[0];
                const content = await file.text();
                const importedConfig = JSON.parse(content);
                Object.assign(config, importedConfig);
                saveConfig(config);
                alert("导入成功：请刷新页面生效");
                panel.remove();
                document.body.style.overflow = "";
                document.documentElement.style.overflowX = "";
                document.documentElement.style.overflowY = "";
            } catch (e) {
                alert("导入失败：无效的配置文件");
            }
        };

        const exportBtn = createButton("导出配置", colorSchemes.info);
        exportBtn.onclick = () => {
            const blob = new Blob([JSON.stringify(config, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "font-config.json";
            a.click();
            URL.revokeObjectURL(url);
        };

        const resetBtn = createButton("重置默认", colorSchemes.danger);
        resetBtn.onclick = () => {
            if (confirm("确定要重置所有配置为默认值吗？")) {
                Object.keys(defaultConfig).forEach((key) => {
                    config[key] = [...defaultConfig[key]];
                });
                saveConfig(config);
                alert("重置成功：请刷新页面生效");
                panel.remove();
                document.body.style.overflow = "";
                document.documentElement.style.overflowX = "";
                document.documentElement.style.overflowY = "";
            }
        };

        const saveBtn = createButton("保存配置", colorSchemes.success);
        saveBtn.onclick = () => {
            const inputs = panel.querySelectorAll("input");
            inputs.forEach((input) => {
                config[input.dataset.type][input.dataset.index] = input.value;
            });
            saveConfig(config);
            alert("保存成功：请刷新页面生效");
            panel.remove();
            document.body.style.overflow = "";
            document.documentElement.style.overflowX = "";
            document.documentElement.style.overflowY = "";
        };

        const closeBtn = createButton("关闭面板", colorSchemes.secondary);
        closeBtn.onclick = () => {
            panel.remove();
            document.body.style.overflow = "";
            document.documentElement.style.overflowX = "";
            document.documentElement.style.overflowY = "";
        };

        panel.appendChild(title);
        panel.appendChild(createInputGroup("sans_latin", "无衬线 拉丁文"));
        panel.appendChild(createInputGroup("sans_simplified", "无衬线 简化字形"));
        panel.appendChild(createInputGroup("sans_traditional", "无衬线 传统字形"));
        panel.appendChild(createInputGroup("serif_latin", "衬线 拉丁文"));
        panel.appendChild(createInputGroup("serif_simplified", "衬线 简化字形"));
        panel.appendChild(createInputGroup("serif_traditional", "衬线 传统字形"));
        panel.appendChild(createInputGroup("mono_latin", "等宽 拉丁文"));

        const actionRow1 = document.createElement("div");
        actionRow1.style.cssText = `
            display: flex;
            gap: 0.75rem;
            margin: 1rem 0;
        `;
        actionRow1.appendChild(importBtn);
        actionRow1.appendChild(exportBtn);
        actionRow1.appendChild(resetBtn);
        panel.appendChild(actionRow1);

        const actionRow2 = document.createElement("div");
        actionRow2.style.cssText = `
            display: flex;
            gap: 0.75rem;
            margin: 1rem 0;
        `;
        actionRow2.appendChild(saveBtn);
        actionRow2.appendChild(closeBtn);
        panel.appendChild(actionRow2);

        document.body.appendChild(panel);
    }


    function generateCSS(config) {
        const [sans_latin_1, sans_latin_2, sans_latin_3] = config.sans_latin;
        const [sans_simplified_1, sans_simplified_2, sans_simplified_3] = config.sans_simplified;
        const [sans_traditional_1, sans_traditional_2, sans_traditional_3] = config.sans_traditional;
        const [serif_latin_1, serif_latin_2, serif_latin_3] = config.serif_latin;
        const [serif_simplified_1, serif_simplified_2, serif_simplified_3] = config.serif_simplified;
        const [serif_traditional_1, serif_traditional_2, serif_traditional_3] = config.serif_traditional;
        const [mono_latin_1, mono_latin_2, mono_latin_3] = config.mono_latin;

        let additionalStyles = "";

        const currentUrl = window.location.href;

        if (currentUrl.startsWith("https://greasyfork.org/")) {
            additionalStyles += `
                pre {
                    font-family: "Consolas" , monospace !important;
                }
            `;
        }else if (currentUrl.startsWith("https://chat.qwen.ai/")) {
            additionalStyles += `
                .chat-item-drag-link-content-tip-text {
                    font-family: "Segoe UI" , monospace !important;
                }
                .markdown-prose {
                    font-family: "Segoe UI" , monospace !important;
                }
                .ͼ1 .cm-scroller {
                    font-family: "Consolas" , monospace !important;
                }
                `;
        }else if (currentUrl.startsWith("https://cplusplus.com/")) {
            additionalStyles += `
                pre, code, tt, samp, var, dfn, cite, kbd {
                    font-family: "Consolas" , monospace !important;
                }
            `;
        }else if (currentUrl.startsWith("https://www.cppreference.com/")) {
            additionalStyles += `
                code {
                    font-family: "Consolas" , monospace !important;
                }
            `;
        }else if (currentUrl.startsWith("https://www.wenxiaobai.com/")) {
            additionalStyles += `
                .markdown-body code *{
                    font-family: "Consolas" , monospace !important;
                }
                code {
                    font-family: "Consolas" , monospace !important;
                }
                * {
                    font-family: "Segoe UI" , sans-serif !important;
                }
            `;
        }

        return `
        /* 无衬线 拉丁文 */
        @font-face { font-family: "Arial"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Cambria"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Calibri"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Verdana"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Helvetica"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Helvetica Neue"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "HelveticaNeue"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Microsoft Sans Serif"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Segoe UI"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "San Francisco"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "San Francisco Pro"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "SF Pro"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "SF Pro Display"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Google Sans"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Google Sans Text"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Roboto"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Noto Sans"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Lucida Sans"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Lucida Grande"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "DejaVu Sans"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "DejaVuSans"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Liberation Sans"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "Open Sans"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        /* 无衬线 简化字形 */
        @font-face { font-family: "HarmonyOS Sans"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "HarmonyOS_Regular"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "Noto Sans SC"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "Noto Sans CJK SC"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "SimHei"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "黑体"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "Microsoft YaHei"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "微软雅黑"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "Microsoft YaHei UI"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "微软雅黑 UI"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "PingFang SC"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "Hiragino Sans GB"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "STHeiti"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "SF Pro SC"; src: local("${sans_simplified_1}"), local("${sans_simplified_1}"), local("${sans_simplified_1}"); }
        @font-face { font-family: "Heiti SC"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "Source Han Sans SC"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "Source Han Sans CN"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "WenQuanYi Micro Hei"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        /* 无衬线 传统字形 */
        @font-face { font-family: "Noto Sans TC"; src: local("${sans_traditional_1}"), local("${sans_traditional_2}"), local("${sans_traditional_3}"); }
        @font-face { font-family: "Noto Sans CJK TC"; src: local("${sans_simplified_1}"), local("${sans_simplified_2}"), local("${sans_simplified_3}"); }
        @font-face { font-family: "Microsoft JhengHei"; src: local("${sans_traditional_1}"), local("${sans_traditional_2}"), local("${sans_traditional_3}"); }
        @font-face { font-family: "微軟正黑體"; src: local("${sans_traditional_1}"), local("${sans_traditional_2}"), local("${sans_traditional_3}"); }
        @font-face { font-family: "Microsoft JhengHei UI"; src: local("${sans_traditional_1}"), local("${sans_traditional_2}"), local("${sans_traditional_3}"); }
        @font-face { font-family: "MHei"; src: local("${sans_traditional_1}"), local("${sans_traditional_2}"), local("${sans_traditional_3}"); }
        @font-face { font-family: "Source Han Sans TC"; src: local("${sans_traditional_1}"), local("${sans_traditional_2}"), local("${sans_traditional_3}"); }
        @font-face { font-family: "Source Han Sans TW"; src: local("${sans_traditional_1}"), local("${sans_traditional_2}"), local("${sans_traditional_3}"); }
        /* 衬线 拉丁文 */
        @font-face { font-family: "Times New Roman"; src: local("${serif_latin_1}"), local("${serif_latin_2}"), local("${serif_latin_3}"); }
        @font-face { font-family: "Georgia"; src: local("${serif_latin_1}"), local("${serif_latin_2}"), local("${serif_latin_3}"); }
        /* 衬线 简化字形 */
        @font-face { font-family: "SimSun"; src: local("${serif_simplified_1}"), local("${serif_simplified_2}"), local("${serif_simplified_3}"); }
        @font-face { font-family: "宋体"; src: local("${serif_simplified_1}"), local("${serif_simplified_2}"), local("${serif_simplified_3}"); }
        @font-face { font-family: "NSimSun"; src: local("${serif_simplified_1}"), local("${serif_simplified_2}"), local("${serif_simplified_3}"); }
        @font-face { font-family: "新宋体"; src: local("${serif_simplified_1}"), local("${serif_simplified_2}"), local("${serif_simplified_3}"); }
        @font-face { font-family: "FangSong"; src: local("${serif_simplified_1}"), local("${serif_simplified_2}"), local("${serif_simplified_3}"); }
        @font-face { font-family: "FangSong_GB2312"; src: local("${serif_simplified_1}"), local("${serif_simplified_2}"), local("${serif_simplified_3}"); }
        @font-face { font-family: "仿宋"; src: local("${serif_simplified_1}"), local("${serif_simplified_2}"), local("${serif_simplified_3}"); }
        @font-face { font-family: "STSong"; src: local("${serif_simplified_1}"), local("${serif_simplified_2}"), local("${serif_simplified_3}"); }
        @font-face { font-family: "STFangsong"; src: local("${serif_simplified_1}"), local("${serif_simplified_2}"), local("${serif_simplified_3}"); }
        @font-face { font-family: "STZhongsong"; src: local("${serif_simplified_1}"), local("${serif_simplified_2}"), local("${serif_simplified_3}"); }
        @font-face { font-family: "Songti SC"; src: local("${serif_simplified_1}"), local("${serif_simplified_2}"), local("${serif_simplified_3}"); }
        /* 等宽 拉丁文 */
        @font-face { font-family: "Menlo"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}"); }
        @font-face { font-family: "Monaco"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}"); }
        @font-face { font-family: "Consolas"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}"); }
        @font-face { font-family: "Courier"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}"); }
        @font-face { font-family: "Courier New"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}"); }
        @font-face { font-family: "Andale Mono"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}"); }
        @font-face { font-family: "Ubuntu Mono"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}"); }
        @font-face { font-family: "Fira Code"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}"); }
        @font-face { font-family: "Fira Mono"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}"); }
        @font-face { font-family: "DejaVu Sans Mono"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}"); }
        @font-face { font-family: "Liberation Mono"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}"); }
        @font-face { font-family: "Source Code Pro"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}"); }
        @font-face { font-family: "San Francisco Mono"; src: local("${sans_latin_1}"), local("${sans_latin_2}"), local("${sans_latin_3}"); }
        @font-face { font-family: "SF Mono"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}"); }
        @font-face { font-family: "SFMono-Regular"; src: local("${mono_latin_1}"), local("${mono_latin_2}"), local("${mono_latin_3}"); }
        /* 字体渲染优化 */
        body {
            -webkit-font-smoothing: subpixel-antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-smoothing: antialiased;
        }

        ${additionalStyles}
    `;
    }
    const config = loadConfig();
    GM_registerMenuCommand("配置面板", () => createConfigUI(config));
    GM_addStyle(generateCSS(config));
})();