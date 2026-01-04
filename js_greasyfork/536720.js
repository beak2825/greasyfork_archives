// ==UserScript==
// @name         网盘助手工具箱
// @namespace    https://www.so1st.com
// @version      0.6.4
// @license      GPL-3.0
// @description  网盘助手工具箱，播放视频时外挂本地字幕/导出分享链接等功能不断完善中...
// @author       awkee
// @include      https://pan.quark.cn/*
// @match        https://www.alipan.com/*
// @match        https://www.aliyundrive.com/*
// @match        https://pan.baidu.com/*
// @match        https://pan.xunlei.com/*
// @match        https://www.iqiyi.com/*
// @match        https://v.youku.com/*
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536720/%E7%BD%91%E7%9B%98%E5%8A%A9%E6%89%8B%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/536720/%E7%BD%91%E7%9B%98%E5%8A%A9%E6%89%8B%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 样式配置
    const styleConfig = {
        fontFamily: "Microsoft YaHei, SimHei, WenQuanYi Micro Hei, sans-serif",
        fontSize: "32px",
        foregroundColor: "#00FF00",
        backgroundColor: "rgba(0, 0, 0, 0)", // 初始透明背景（rgba 0不透明）
        displayMode: "horizontal",
        horizontalAlign: "left",
        verticalAlign: "bottom",
        writingMode: "horizontal-tb",
        subtitlePadding: "100px", // 字幕边距
        verticalTextSpacing: "0.5em", // 垂直文字间距
        verticalTextOrientation: "upright", // 文字方向
        verticalLineHeight: "1.8", // 垂直线高度
        forceVerticalMode: false, // 强制垂直模式

    };

    // 检测是否为夸克网盘
    function isQuarkPan() {
        return location.host === "pan.quark.cn";
    }

    // 获取指定页的分享链接
    async function fetchQuarkShareLinksByPage(page = 1, pageSize = 50) {
        if (!isQuarkPan()) return [];
        const urlBase = "https://drive-pc.quark.cn/1/clouddrive/share/mypage/detail?pr=ucpro&fr=pc&uc_param_str=&_order_field=created_at&_order_type=desc&_fetch_total=1&_fetch_notify_follow=1";
        const pageUrl = `${urlBase}&_page=${page}&_size=${pageSize}`;
        const res = await fetch(pageUrl, {
            credentials: "include",
            headers: {
                "accept": "application/json, text/plain, */*",
                "referer": "https://pan.quark.cn/",
                "origin": "https://pan.quark.cn"
            }
        });
        const data = await res.json();
        if (data && data.data && Array.isArray(data.data.list)) {
            return { list: data.data.list, metadata: data.metadata || {} };
        }
        return { list: [], metadata: data.metadata || {} };
    }

    // 获取所有页的分享链接
    async function fetchQuarkShareLinksAll() {
        if (!isQuarkPan()) return [];
        const allData = [];
        const pageSize = 50;
        // 先获取第一页和meta
        const { list: firstList, metadata } = await fetchQuarkShareLinksByPage(1, pageSize);
        allData.push(...firstList);
        let totalPages = 1;
        if (metadata && typeof metadata._total === "number") {
            totalPages = Math.ceil(metadata._total / pageSize);
        }
        // 依次请求剩余页面
        for (let page = 2; page <= totalPages; page++) {
            const { list } = await fetchQuarkShareLinksByPage(page, pageSize);
            allData.push(...list);
            await new Promise(resolve => setTimeout(resolve, 500)); // 防止请求过快
            console.log(`已获取 ${page}/${totalPages} 页， 当前 ${allData.length} 条数据`);
        }
        return allData;
    }

    // 用于按钮：获取当前页分享链接
    function exportShareLinksCurrentPage() {
        showSnackbar("正在获取当前页分享链接...");
        fetchQuarkShareLinksByPage(1, 50).then(({ list }) => {
            if (!list || list.length === 0) {
                showSnackbar("未获取到分享链接");
                return;
            }
            exportShareLinksFormatAndCopy(list);
        }).catch(e => {
            showSnackbar("获取分享链接失败");
            console.error(e);
        });
    }

    // 用于按钮：获取所有页分享链接
    function exportShareLinksAllPages() {
        showSnackbar("正在获取所有页分享链接...");
        fetchQuarkShareLinksAll().then(list => {
            if (!list || list.length === 0) {
                showSnackbar("未获取到分享链接");
                return;
            }
            exportShareLinksFormatAndCopy(list);
        }).catch(e => {
            showSnackbar("获取分享链接失败");
            console.error(e);
        });
    }

    // 格式化并复制
    function exportShareLinksFormatAndCopy(list) {
        const header = "标题|,|url类型|,|分享链接|,|分享code|,|占用存储|,|创建时间|,|更新时间|,|核查类型|,|点击数";
        const text = list.map(item =>
            `${item.title}|,|${item.url_type}|,|${item.share_url}|,|${item.passcode || ''}|,|${item.size}|,|${item.created_at}|,|${item.updated_at}|,|${item.audit_status}|,|${item.click_pv}`
        ).join('\n');
        const result = `${header}\n${text}`;
        copyToClipboard(result);
        showSnackbar("分享链接已复制到剪贴板: " + list.length + "条");
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
    }

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement("div");
        panel.id = "subtitle-control-panel";
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 9999;
            display: flex;
            align-items: center;
            background-color: ` + styleConfig.backgroundColor + `;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: move;
        `;

        // 创建设置图标按钮
        const settingsIcon = createButton("⚙", "settings-icon", toggleButtonsVisibility);
        panel.appendChild(settingsIcon);

        // 创建文件选择器
        const fileInput = document.createElement("input");
        fileInput.type = 'file';
        fileInput.accept = '.srt,.vtt,.ass,.ssa';
        fileInput.style.cssText = 'display: none;';
        fileInput.id = 'subtitle-file-input';
        panel.appendChild(fileInput);

        // 加载按钮
        const loadBtn = createButton("加载字幕", "load-btn");
        loadBtn.addEventListener('click', () => fileInput.click());
        panel.appendChild(loadBtn);

        // 重置按钮
        const resetBtn = createButton("重置字幕", "reset-btn");
        resetBtn.addEventListener('click', resetSubtitles);
        panel.appendChild(resetBtn);

        // 插入导出分享链接按钮（夸克网盘）
        if (isQuarkPan()) {
            panel.appendChild(createButton("导出最近分享链接", "export-share-btn-cur", exportShareLinksCurrentPage));
            panel.appendChild(createButton("导出所有分享链接", "export-share-btn-all", exportShareLinksAllPages));
        }

        // 样式设置按钮
        const styleBtn = createButton("样式设置", "style-btn");
        styleBtn.addEventListener('click', toggleStyleMenu);
        panel.appendChild(styleBtn);

        // 样式菜单
        const styleMenu = createStyleMenu();
        panel.appendChild(styleMenu);

        // 添加鼠标拖拽事件
        setupDragging(panel);

        return panel;
    }

    // 设置拖拽功能(当菜单折叠时才支持拖拽)
    function setupDragging(element) {
        let keyPressed = false;
        let offsetX, offsetY;

        // 长按3s才会触发拖拽
        setTimeout(() => {
            element.addEventListener('mousedown', (e) => {
                if (document.getElementById('load-btn').style.display!== 'none') {
                    return;
                } // 当菜单折叠时才支持拖拽
                keyPressed = true;
                offsetX = e.clientX - parseInt(element.style.left);
                offsetY = e.clientY - parseInt(element.style.top);
            });
        }, 3000);

        document.addEventListener('mousemove', (e) => {
            if (keyPressed) {
                element.style.left = (e.clientX - offsetX) + 'px';
                element.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        document.addEventListener('mouseup', (e) => {
            e.preventDefault(); // 阻止默认行为
            keyPressed = false;
        })
    }

    // 创建按钮
    function createButton(text, id, clickHandler) {
        const container = document.createElement("div");
        container.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
        `;
        const btn = document.createElement("button");
        btn.id = id;
        btn.textContent = text;
        btn.style.cssText = `
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        `;
        btn.addEventListener('mouseover', () => btn.style.backgroundColor = '#45a049');
        btn.addEventListener('mouseout', () => btn.style.backgroundColor = '#4CAF50');
        if (clickHandler) {
            btn.addEventListener('click', clickHandler);
        }
        container.appendChild(btn);
        return container;
    }

    // 创建样式菜单
    function createStyleMenu() {
        const menu = document.createElement("div");
        menu.id = "subtitle-style-menu";
        menu.style.cssText = `
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 5px;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 10px;
            border-radius: 6px;
            width: 300px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;

        // 字体选择
        const fontFamilySelect = createStyleSelect(
            "font-family",
            ["Microsoft YaHei", "SimHei", "WenQuanYi Micro Hei", "Arial", "sans-serif"],
            "字体"
        );
        menu.appendChild(fontFamilySelect);

        // 字体大小滑块
        const fontSizeSelect = createSlidebar("font-size", "字体大小", "12", "100", "32", "1");
        menu.appendChild(fontSizeSelect);
        // 边距滑块
        const subtitlePaddingSelect = createSlidebar("padding", "边距", "0", "300", "100", "1");
        menu.appendChild(subtitlePaddingSelect);

        // 前景色
        const foregroundColorSelect = createColorPicker("foreground-color", "前景色", "100");
        menu.appendChild(foregroundColorSelect);

        // 背景色
        const backgroundColorSelect = createColorPicker("background-color", "背景色", "0");
        menu.appendChild(backgroundColorSelect);


        // 显示模式
        const displayModeSelect = createStyleSelect(
            "display-mode",
            ["horizontal", "vertical"],
            "显示模式"
        );
        menu.appendChild(displayModeSelect);

        // 垂直文字配置组
        const verticalGroup = document.createElement("div");
        verticalGroup.style.cssText = "margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2);";

        const verticalLabel = document.createElement("h4");
        verticalLabel.textContent = "垂直文字设置";
        verticalLabel.style.cssText = "color: white; margin-bottom: 10px;";
        verticalGroup.appendChild(verticalLabel);

        // 垂直文字间距
        const verticalTextSpacing = createSlidebar(
            "verticalTextSpacing",
            "文字间距",
            "0",
            "2",
            "0.5",
            "0.1"
        );
        verticalGroup.appendChild(verticalTextSpacing);

        // 垂直线高
        const verticalLineHeight = createSlidebar(
            "verticalLineHeight",
            "行高",
            "1",
            "3",
            "1.8",
            "0.1"
        );
        verticalGroup.appendChild(verticalLineHeight);

        // 文字方向
        const textOrientationSelect = createStyleSelect(
            "verticalTextOrientation",
            ["mixed", "upright", "sideways"],
            "文字方向"
        );
        verticalGroup.appendChild(textOrientationSelect);

        // 强制垂直模式
        const forceVerticalMode = document.createElement("div");
        forceVerticalMode.style.cssText = "margin-top: 10px;";

        const forceVerticalLabel = document.createElement("label");
        forceVerticalLabel.style.cssText = "color: white;";

        const forceVerticalCheckbox = document.createElement("input");
        forceVerticalCheckbox.type = "checkbox";
        forceVerticalCheckbox.id = "subtitle-force-vertical-mode";
        forceVerticalCheckbox.checked = styleConfig.forceVerticalMode;

        forceVerticalLabel.appendChild(forceVerticalCheckbox);
        forceVerticalLabel.appendChild(document.createTextNode(" 强制垂直模式（解决覆盖问题）"));
        forceVerticalMode.appendChild(forceVerticalLabel);

        verticalGroup.appendChild(forceVerticalMode);

        // 添加到菜单
        menu.appendChild(verticalGroup);


        // 对齐(根据display-mode动态显示)
        const alignmentContainer = document.createElement("div");
        alignmentContainer.id = "alignment-container";
        menu.appendChild(alignmentContainer);
        // 水平对齐
        const horizontalAlignSelect = createStyleSelect(
            "horizontal-align",
            ["left", "center", "right"],
            "水平对齐"
        );
        horizontalAlignSelect.style.display = 'none'; // 初始隐藏
        alignmentContainer.appendChild(horizontalAlignSelect);

        // 垂直对齐
        const verticalAlignSelect = createStyleSelect(
            "vertical-align",
            ["top", "middle", "bottom"],
            "垂直对齐"
        );

        verticalAlignSelect.style.display = 'none'; // 初始隐藏
        alignmentContainer.appendChild(verticalAlignSelect);

        // 监听显示模式变化
        displayModeSelect.addEventListener('change', () => {
            const selectedMode = displayModeSelect.querySelector('select').value;
            horizontalAlignSelect.style.display = selectedMode === 'vertical' ? 'block' : 'none';
            verticalGroup.style.display = selectedMode ==='vertical'? 'block' : 'none';
            verticalAlignSelect.style.display = selectedMode === 'horizontal' ? 'block' : 'none';
        });
        // 初始设置
        displayModeSelect.querySelector('select').value = styleConfig.displayMode;
        displayModeSelect.dispatchEvent(new Event('change'));
        // 应用初始对齐设置
        horizontalAlignSelect.querySelector('select').value = styleConfig.horizontalAlign;
        verticalAlignSelect.querySelector('select').value = styleConfig.verticalAlign;

        // 应用按钮
        const applyBtn = document.createElement("button");
        applyBtn.textContent = "应用样式";
        applyBtn.style.cssText = `
            background-color: #2196F3;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
            width: 100%;
            transition: background-color 0.3s;
        `;
        applyBtn.addEventListener('mouseover', () => applyBtn.style.backgroundColor = '#0b7dda');
        applyBtn.addEventListener('mouseout', () => applyBtn.style.backgroundColor = '#2196F3');
        applyBtn.addEventListener('click', applyStyleSettings);
        menu.appendChild(applyBtn);

        return menu;
    }

    // 创建样式选择器
    function createStyleSelect(type, options, labelText) {
        const container = document.createElement("div");
        container.style.cssText = "margin-bottom: 10px;";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.cssText = "display: block; margin-bottom: 5px; color: white;";
        container.appendChild(label);

        const select = document.createElement("select");
        select.id = `subtitle-${type}`;
        select.style.cssText = "width: 100%; padding: 5px; border-radius: 4px;";

        // 将连字符命名转换为驼峰式（如 "font-family" → "fontFamily"）
        const camelKey = type.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option;
            opt.textContent = option;
            if (styleConfig[camelKey] === option) {  // 关键修复：使用驼峰键匹配
                opt.selected = true;
            }
            select.appendChild(opt);
        });

        container.appendChild(select);
        return container;
    }
    function createSlidebar(id, labelText, min, max, defaultValue, step) {
        const container = document.createElement("div");
        container.style.cssText = "margin-bottom: 10px;";

        // 选择器容器
        const slidWrapper = document.createElement("div");
        slidWrapper.style.display = "flex";
        slidWrapper.style.gap = "10px";
        slidWrapper.style.alignItems = "center";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.cssText = "display: block; margin-bottom: 5px; color: white;";
        container.appendChild(label);
        const slidebar = document.createElement("input");
        slidebar.type = "range";
        slidebar.min = min;
        slidebar.max = max;
        slidebar.step = step;
        slidebar.value = defaultValue;
        slidebar.style.cssText = "width: 100%;";
        slidebar.id = `subtitle-${id}`;

        slidWrapper.appendChild(slidebar);
        container.appendChild(slidWrapper);
        return container;
    }

    function createColorPicker(type, labelText, alpha) {
        const container = document.createElement("div");
        container.style.cssText = "margin-bottom: 10px;";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.cssText = "display: block; margin-bottom: 5px; color: white;";
        container.appendChild(label);

        // 颜色选择器容器
        const colorWrapper = document.createElement("div");
        colorWrapper.style.display = "flex";
        colorWrapper.style.gap = "10px";
        colorWrapper.style.alignItems = "center";

        // 颜色预览块
        const preview = document.createElement("div");
        preview.style.width = "30px";
        preview.style.height = "30px";
        preview.style.borderRadius = "4px";
        preview.style.border = "2px solid #fff";

        // 颜色选择输入
        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.style.flex = "1";

        // 透明度滑块
        const alphaInput = document.createElement("input");
        alphaInput.type = "range";
        alphaInput.min = "0";
        alphaInput.max = "100";
        alphaInput.value = alpha;
        alphaInput.style.width = "80px";
        alphaInput.style.accentColor = "#4CAF50";

        // 初始化颜色值
        const initialColor = type === "foreground-color" ? "#00FF00" : "#000000";
        colorInput.value = initialColor;
        preview.style.backgroundColor = `${initialColor}${Math.round(alphaInput.value * 255 / 100).toString(16).padStart(2, '0')}`;

        // 事件监听
        const updateColor = () => {
            const alpha = parseInt(alphaInput.value) / 100;
            preview.style.backgroundColor = `${colorInput.value}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
        };
        colorInput.addEventListener("input", updateColor);
        alphaInput.addEventListener("input", updateColor);

        colorWrapper.appendChild(preview);
        colorWrapper.appendChild(colorInput);
        colorWrapper.appendChild(alphaInput);
        container.appendChild(colorWrapper);

        // 存储元素的引用
        container._colorInput = colorInput;
        container._alphaInput = alphaInput;
        container.id = `subtitle-${type}`;

        return container;
    }

    // 切换加载、重置和样式设置按钮的显示与隐藏
    function toggleButtonsVisibility() {
        const loadBtn = document.getElementById('load-btn');
        const resetBtn = document.getElementById('reset-btn');
        const styleBtn = document.getElementById('style-btn');
        const subtitleStyleMenu = document.getElementById('subtitle-style-menu');
        const exportShareBtnCur = document.getElementById('export-share-btn-cur');
        const exportShareBtnAll = document.getElementById('export-share-btn-all');

        const isVisible = loadBtn.style.display !== 'none';
        loadBtn.style.display = isVisible ? 'none' : 'block';
        resetBtn.style.display = isVisible ? 'none' : 'block';
        styleBtn.style.display = isVisible ? 'none' : 'block';
        exportShareBtnCur.style.display = isVisible? 'none' : 'block';
        exportShareBtnAll.style.display = isVisible? 'none' : 'block';
        if (isVisible) {
            subtitleStyleMenu.style.display = 'none';
        }
    }

    // 切换样式菜单显示/隐藏
    function toggleStyleMenu() {
        const menu = document.getElementById("subtitle-style-menu");
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    }

    // 应用样式设置
    function applyStyleSettings() {
        const fontFamily = document.getElementById("subtitle-font-family").value;
        const fontSize = document.getElementById("subtitle-font-size").value + "px";
        const padding = document.getElementById("subtitle-padding").value + "px";

        const displayMode = document.getElementById("subtitle-display-mode").value;
        const horizontalAlign = document.getElementById("subtitle-horizontal-align").value;
        const verticalAlign = document.getElementById("subtitle-vertical-align").value;

        console.log("应用样式设置:", styleConfig);
        const getRGBA = (colorPicker) => {
            const color = colorPicker._colorInput.value;
            const alpha = parseInt(colorPicker._alphaInput.value) / 100;
            return `rgba(${parseInt(color.substr(1, 2), 16)},${parseInt(color.substr(3, 2), 16)},${parseInt(color.substr(5, 2), 16)},${alpha})`;
        };

        const foregroundColor = getRGBA(document.getElementById("subtitle-foreground-color"));
        const backgroundColor = getRGBA(document.getElementById("subtitle-background-color"));

        // 更新配置
        styleConfig.fontFamily = fontFamily;
        styleConfig.fontSize = fontSize;
        styleConfig.foregroundColor = foregroundColor;
        styleConfig.backgroundColor = backgroundColor;
        styleConfig.displayMode = displayMode;
        styleConfig.horizontalAlign = horizontalAlign;
        styleConfig.verticalAlign = verticalAlign;
        styleConfig.subtitlePadding = padding;

        styleConfig.verticalTextSpacing = document.getElementById("subtitle-verticalTextSpacing").value + "em";
        styleConfig.verticalTextOrientation = document.getElementById("subtitle-verticalTextOrientation").value;
        styleConfig.verticalLineHeight = document.getElementById("subtitle-verticalLineHeight").value;
        styleConfig.forceVerticalMode = document.getElementById("subtitle-force-vertical-mode").checked;

        // 应用到字幕元素
        if (subtitleElement) {
            subtitleElement.style.fontFamily = fontFamily;
            subtitleElement.style.fontSize = fontSize;
            subtitleElement.style.color = foregroundColor;
            subtitleElement.style.backgroundColor = backgroundColor;

            // 应用显示模式和对齐方式
            applyDisplayMode();
        }

        showSnackbar("字幕样式已更新");
    }

    // 应用显示模式和对齐方式
    function applyDisplayMode() {
        if (!subtitleElement || !videoElement) return;

        const videoRect = videoElement.getBoundingClientRect();

        // 重置样式
        subtitleElement.style.removeProperty('writing-mode');
        subtitleElement.style.removeProperty('text-orientation');
        subtitleElement.style.removeProperty('left');
        subtitleElement.style.removeProperty('right');
        subtitleElement.style.removeProperty('top');
        subtitleElement.style.removeProperty('bottom');
        subtitleElement.style.removeProperty('transform');
        subtitleElement.style.removeProperty('text-align');
        subtitleElement.style.removeProperty('white-space');
        subtitleElement.style.removeProperty('letter-spacing');
        subtitleElement.style.removeProperty('line-height');

        // 根据显示模式调整边距
        if (styleConfig.displayMode === 'horizontal') {
            if (styleConfig.verticalAlign === 'top') {
                subtitleElement.style.top = styleConfig.subtitlePadding;
            } else if (styleConfig.verticalAlign === 'bottom') {
                subtitleElement.style.bottom = styleConfig.subtitlePadding;
            } else {
                // 居中对齐
                subtitleElement.style.top = '50%';
                subtitleElement.style.transform = 'translateY(-50%)';
            }
            // 水平显示时，居中对齐
            subtitleElement.style.left = '50%';
            subtitleElement.style.transform = 'translate(-50%, -50%)';
            subtitleElement.style.textAlign = 'center';
            subtitleElement.style.writingMode = 'horizontal-tb';
            subtitleElement.style.whiteSpace = 'pre-wrap';
            // 水平文字的默认样式
            subtitleElement.style.letterSpacing = 'normal';
            subtitleElement.style.lineHeight = 'normal';
            subtitleElement.style.display = 'block';

        } else { // 垂直显示
            if (styleConfig.horizontalAlign === 'left') {
                subtitleElement.style.left = styleConfig.subtitlePadding;
            } else if (styleConfig.horizontalAlign === 'right') {
                // 靠右侧显示时，需要调整边距
                subtitleElement.style.right = styleConfig.subtitlePadding;
            } else {
                // 居中显示时，需要调整边距
                subtitleElement.style.left = '50%';
                subtitleElement.style.transform = 'translateX(-50%)';
            }
            // 垂直显示时，居中对齐
            subtitleElement.style.top = '50%';
            subtitleElement.style.transform = 'translate(-50%, -50%)';
            subtitleElement.style.textAlign = 'center';
            subtitleElement.style.writingMode = 'vertical-rl';
            subtitleElement.style.whiteSpace = 'pre-wrap';
            // 针对垂直文字添加特殊样式
            subtitleElement.style.textOrientation = styleConfig.verticalTextOrientation;
            subtitleElement.style.lineHeight = styleConfig.verticalLineHeight;
            subtitleElement.style.letterSpacing = styleConfig.verticalTextSpacing;

            // 强制垂直模式（解决某些浏览器的布局问题）
            if (styleConfig.forceVerticalMode) {
                subtitleElement.style.display = 'flex';
                subtitleElement.style.flexDirection = styleConfig.writingMode === 'vertical-rl' ? 'column-reverse' : 'column';
            }
        }
    }


    // 状态变量
    let isFirstFile = false;
    let isNewFile = false;
    let isSubtitleVisible = true;
    let timeDelay = 0;

    // DOM 元素
    let videoElement, timeDisplayElement, subtitleElement, snackbarElement;
    let subtitleObserver;
    let subtitleData = [];

    // 重置字幕
    function resetSubtitles() {
        if (subtitleElement) {
            subtitleElement.innerHTML = "";
            subtitleElement.style.opacity = "0";
        }
        subtitleData = [];
        timeDelay = 0;
        showSnackbar("字幕已重置");
    }

    // 内联字幕解析器
    const SubtitleParser = {
        parseSRT: function (content) {
            const srtRegex = /(\d+)\r?\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\r?\n([\s\S]*?)(?:\r?\n\r?\n|$)/g;
            const subtitles = [];

            let match;
            while ((match = srtRegex.exec(content)) !== null) {
                const index = parseInt(match[1]);
                const startTime = this.timeToMS(match[2]);
                const endTime = this.timeToMS(match[3]);
                const text = match[4].trim();

                subtitles.push({
                    index,
                    start: startTime,
                    end: endTime,
                    text: text.replace(/\n/g, '<br>')
                });
            }

            return subtitles;
        },

        parseVTT: function (content) {
            // 移除WEBVTT头部
            content = content.replace(/^WEBVTT\r?\n/, '');

            const vttRegex = /^(\d{2}:\d{2}:\d{2}.\d{3}) --> (\d{2}:\d{2}:\d{2}.\d{3})(?: [^\r\n]*)?\r?\n([\s\S]*?)(?:\r?\n\r?\n|$)/gm;
            const subtitles = [];
            let index = 1;

            let match;
            while ((match = vttRegex.exec(content)) !== null) {
                const startTime = this.timeToMS(match[1].replace(',', '.'));
                const endTime = this.timeToMS(match[2].replace(',', '.'));
                const text = match[3].trim();

                subtitles.push({
                    index: index++,
                    start: startTime,
                    end: endTime,
                    text: text.replace(/\n/g, '<br>')
                });
            }

            return subtitles;
        },

        parseASS: function (content) {
            // 优化正则表达式：支持Dialogue行前空格，更灵活匹配字段
            // Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
            // Example: Dialogue: 0,0:00:00.00,0:00:00.00,Default,,0,0,0,,{\\i1}Hello, World!{\\i0}
            const assRegex = /Dialogue:\s*[^,]*,([^,]*),([^,]*),[^,]*,[^,]*,[^,]*,[^,]*,[^,]*,[^,]*,(.*)$/gm;
            const subtitles = [];
            let index = 1;

            let match;
            while ((match = assRegex.exec(content)) !== null) {
                const startTime = this.timeToMS(this.assTimeToSRT(match[1]));
                const endTime = this.timeToMS(this.assTimeToSRT(match[2]));
                let text = match[3].trim();

                // 增强文本处理：支持更多换行符转义，优化标签清理
                text = text.replace(/{[^}]*}/g, '');       // 清理ASS样式标签
                text = text.replace(/\\[Nn]/g, '<br>');    // 同时处理\N和\n换行符（大小写不敏感）
                text = text.replace(/\\\{/g, '{');         // 恢复转义的{符号（如果有）
                text = text.replace(/\\\}/g, '}');         // 恢复转义的}符号（如果有）

                subtitles.push({
                    index: index++,
                    start: startTime,
                    end: endTime,
                    text: text
                });
            }

            return subtitles;
        },


        timeToMS: function (timeString) {
            // 支持两种格式: 00:00:00,000 和 00:00:00.000
            const parts = timeString.replace(',', ':').replace('.', ':').split(':');
            if (parts.length < 3) return 0;

            const hours = parseInt(parts[0]) * 3600000;
            const minutes = parseInt(parts[1]) * 60000;
            const seconds = parseInt(parts[2]) * 1000;
            const milliseconds = parts.length > 3 ? parseInt(parts[3]) : 0;

            return hours + minutes + seconds + milliseconds;
        },

        assTimeToSRT: function (assTime) {
            // 将ASS时间格式 (0:00:00.00) 转换为SRT格式 (00:00:00,000)
            const parts = assTime.split(':');
            if (parts.length < 3) return assTime;

            const hours = parts[0].padStart(2, '0');
            const minutes = parts[1].padStart(2, '0');
            const secondsAndMillis = parts[2].replace('.', ',');

            return `${hours}:${minutes}:${secondsAndMillis.padEnd(6, '0')}`;
        },

        parse: function (content) {
            if (/^\s*WEBVTT/.test(content)) {
                return this.parseVTT(content);
            } else if (/Dialogue:/.test(content)) {
                return this.parseASS(content);
            } else {
                return this.parseSRT(content);
            }
        }
    };

    // 初始化
    function initialize() {
        // 创建控制面板
        const controlPanel = createControlPanel();
        document.body.prepend(controlPanel);

        // 文件选择事件
        document.getElementById('subtitle-file-input').onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (isFirstFile) {
                isNewFile = true;
                if (subtitleObserver) subtitleObserver.disconnect();
            } else {
                setupUIElements();
                setupKeyboardShortcuts();
            }

            isFirstFile = true;
            loadSubtitles(file);
            toggleButtonsVisibility();
        };

        // 页面加载完成后检查是否有视频
        window.addEventListener('load', () => {
            // 如果页面已经有视频，尝试初始化
            if (document.querySelector('video')) {
                // 延迟一下，确保页面完全加载
                setTimeout(() => {
                    if (!isFirstFile) {
                        showSnackbar('请选择字幕文件 (.srt, .vtt, .ass)');
                    }
                }, 1000);
            }
        });
    }

    // 设置UI元素
    function setupUIElements() {
        // 查找视频元素
        videoElement = document.querySelector('video');
        if (!videoElement) {
            showSnackbar('未找到视频元素');
            return;
        }

        // 创建字幕元素
        subtitleElement = document.createElement('div');
        subtitleElement.id = 'quark-custom-subtitle';
        subtitleElement.style.cssText = `
            position: absolute;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2147483647;
            text-align: center;
            font-size: ${styleConfig.fontSize};
            font-weight: bold;
            color: ${styleConfig.foregroundColor};
            text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
            transition: opacity 0.3s ease;
            pointer-events: none;
            max-width: 80%;
            background-color: ${styleConfig.backgroundColor};
            font-family: ${styleConfig.fontFamily};
            white-space: pre-wrap;
        `;

        // 创建提示条
        snackbarElement = document.createElement('div');
        snackbarElement.id = 'quark-subtitle-snackbar';
        snackbarElement.style.cssText = `
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2147483647;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 16px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            font-family: ${styleConfig.fontFamily};
        `;

        // 将元素添加到页面
        document.body.appendChild(subtitleElement);
        document.body.appendChild(snackbarElement);

        // 监听全屏变化
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        // 初始定位
        updateSubtitlePosition();
    }

    // 处理全屏变化
    function handleFullscreenChange() {
        updateSubtitlePosition();

        // 检查是否在全屏模式下
        const isFullscreen = document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;

        // 如果是全屏模式，确保字幕容器在视频上方
        if (isFullscreen && videoElement && subtitleElement) {
            // 将字幕元素移到视频元素的父容器中，确保与视频在同一层级
            const videoParent = videoElement.parentElement;
            if (videoParent && subtitleElement.parentElement !== videoParent) {
                videoParent.appendChild(subtitleElement);
            }

            // 更新字幕位置，相对于视频元素
            updateSubtitlePosition();
        } else if (subtitleElement && subtitleElement.parentElement !== document.body) {
            // 如果退出全屏，将字幕元素放回body中
            document.body.appendChild(subtitleElement);
            updateSubtitlePosition();
        }
    }

    // 设置键盘快捷键
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toUpperCase();

            // 忽略输入框中的按键
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (key === 'Q') {
                timeDelay += 100;
                showSnackbar(`时间偏移: +${timeDelay}ms`);
            } else if (key === 'W') {
                timeDelay -= 100;
                showSnackbar(`时间偏移: ${timeDelay}ms`);
            } else if (key === 'E') {
                isSubtitleVisible = !isSubtitleVisible;
                subtitleElement.style.opacity = isSubtitleVisible ? '1' : '0';
                showSnackbar(isSubtitleVisible ? '字幕已显示' : '字幕已隐藏');
            } else if (key === 'R') {
                resetSubtitles();
            }
        });
    }

    // 显示提示条
    function showSnackbar(message) {
        if (!snackbarElement) return;

        snackbarElement.textContent = message;
        snackbarElement.style.opacity = '1';

        setTimeout(() => {
            snackbarElement.style.opacity = '0';
        }, 2000);
    }

    // 加载字幕文件 - 优化编码检测
    function loadSubtitles(file) {
        detectEncoding(file).then(encoding => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    subtitleData = SubtitleParser.parse(e.target.result);
                    if (subtitleData.length === 0) {
                        throw new Error('未解析到字幕内容');
                    }

                    showSnackbar(`字幕加载成功: ${file.name} (${subtitleData.length} 条，编码: ${encoding})`);
                    startSubtitleDisplay();
                } catch (error) {
                    showSnackbar(`字幕解析失败: ${error.message}`);
                    console.error('字幕解析错误:', error);
                }
            };
            reader.onerror = () => showSnackbar('文件读取失败');

            // 根据检测到的编码读取文件
            reader.readAsText(file, encoding);
        }).catch(error => {
            showSnackbar(`编码检测失败: ${error.message}，尝试使用默认编码`);
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    subtitleData = SubtitleParser.parse(e.target.result);
                    if (subtitleData.length === 0) {
                        throw new Error('未解析到字幕内容');
                    }

                    showSnackbar(`字幕加载成功: ${file.name} (${subtitleData.length} 条，使用默认编码)`);
                    startSubtitleDisplay();
                } catch (error) {
                    showSnackbar(`字幕解析失败: ${error.message}`);
                    console.error('字幕解析错误:', error);
                }
            };
            reader.onerror = () => showSnackbar('文件读取失败');
            reader.readAsText(file);
        });
    }

    // 改进的编码检测
    function detectEncoding(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const buffer = e.target.result;

                // 检测BOM标记
                const view = new DataView(buffer);
                if (view.byteLength >= 3 && view.getUint8(0) === 0xEF && view.getUint8(1) === 0xBB && view.getUint8(2) === 0xBF) {
                    resolve('utf-8');
                    return;
                }

                // 转换为文本进行字符分析
                let content = '';
                try {
                    content = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
                    resolve('utf-8');
                    return;
                } catch (e) {
                    // 不是有效的UTF-8，尝试GBK
                }

                try {
                    // 尝试使用GBK解码
                    content = new TextDecoder('gbk').decode(buffer);

                    // 检查是否包含中文字符
                    const chineseChars = /[\u4e00-\u9fa5]/;
                    if (chineseChars.test(content)) {
                        resolve('gbk');
                        return;
                    }
                } catch (e) {
                    // 不是有效的GBK
                }

                // 默认使用UTF-8
                resolve('utf-8');
            };
            reader.onerror = () => reject(new Error('无法读取文件'));

            // 读取前4096字节进行编码检测
            reader.readAsArrayBuffer(file.slice(0, 4096));
        });
    }


    // 开始显示字幕
    function startSubtitleDisplay() {
        if (!videoElement || subtitleData.length === 0) return;

        // 停止之前的观察者
        if (subtitleObserver) subtitleObserver.disconnect();

        // 创建基于时间的更新机制
        let lastTime = -1;
        setInterval(() => {
            if (!videoElement || !isSubtitleVisible) return;

            const currentTime = videoElement.currentTime * 1000 + timeDelay;

            // 只有时间变化时才更新字幕
            if (Math.abs(currentTime - lastTime) > 50) {
                updateSubtitles(currentTime);
                lastTime = currentTime;
            }
        }, 100);

        // 初始更新
        updateSubtitles(videoElement.currentTime * 1000 + timeDelay);
    } 1


    // 更新字幕显示
    function updateSubtitles(currentTime) {
        if (!subtitleElement || subtitleData.length === 0) return;

        // 二分查找当前时间对应的字幕
        let index = binarySearchSubtitles(currentTime);

        if (index >= 0) {
            subtitleElement.innerHTML = subtitleData[index].text;
            subtitleElement.style.opacity = isSubtitleVisible ? '1' : '0';
        } else {
            subtitleElement.style.opacity = '0';
        }
    }

    // 二分查找字幕
    function binarySearchSubtitles(time) {
        let low = 0;
        let high = subtitleData.length - 1;

        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            let subtitle = subtitleData[mid];

            if (time >= subtitle.start && time <= subtitle.end) {
                return mid; // 找到匹配的字幕
            } else if (time < subtitle.start) {
                high = mid - 1; // 时间在左侧
            } else {
                low = mid + 1; // 时间在右侧
            }
        }

        return -1; // 没有找到匹配的字幕
    }

    // 更新字幕位置
    function updateSubtitlePosition() {
        if (!subtitleElement || !videoElement) return;

        // 应用显示模式和对齐方式
        applyDisplayMode();
    }

    initialize();
})();
