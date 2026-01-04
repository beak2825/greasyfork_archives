// ==UserScript==
// @name                     Make-GitHub-Great-Again!
// @name:en                Make-GitHub-Great-Again!
// @namespace            https://github.com
// @version                  3.1
// @description           为 Release Assets 每条条目添加交替的背景色
// @description:en       Add alternating background colors to each item in the Release Assets list
// @author                  https://github.com/HumanMus1c
// @match                   https://github.com/*/releases*
// @grant                    GM_addStyle
// @grant                    GM_registerMenuCommand
// @grant                    GM_getValue
// @grant                    GM_setValue
// @grant                    unsafeWindow
// @license                  MIT
// @downloadURL https://update.greasyfork.org/scripts/537852/Make-GitHub-Great-Again%21.user.js
// @updateURL https://update.greasyfork.org/scripts/537852/Make-GitHub-Great-Again%21.meta.js
// ==/UserScript==

(function() {
    // 更可靠的主题检测函数
    function getCurrentTheme() {
        // 检测GitHub的显式主题设置
        const explicitTheme = document.documentElement.getAttribute('data-color-mode');
        if (explicitTheme === 'light' || explicitTheme === 'dark') {
            return explicitTheme;
        }

        // 检测GitHub的类名主题设置
        if (document.documentElement.classList.contains('dark')) {
            return 'dark';
        }

        // 检测系统级主题设置
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // 默认颜色配置（亮色主题）
    const defaultColorsLight = {
        oddRowColor: "#f8f9fa",
        evenRowColor: "#ffffff",
        hoverColor: "#e9ecef"
    };

    // 默认颜色配置（暗色主题）
    const defaultColorsDark = {
        oddRowColor: "#161b22",
        evenRowColor: "#0d1117",
        hoverColor: "#30363d"
    };

    // 获取当前主题的默认颜色
    function getDefaultColors() {
        return getCurrentTheme() === 'dark' ? defaultColorsDark : defaultColorsLight;
    }

    // 创建样式元素并添加到文档头部
    const styleElement = document.createElement('style');
    styleElement.id = 'Make-GitHub-Great-Again-style';
    document.head.appendChild(styleElement);

    // 应用颜色的函数 - 根据当前主题动态更新样式
    function applyColors() {
        const theme = getCurrentTheme();
        const themeKey = `customColors${theme.charAt(0).toUpperCase() + theme.slice(1)}`;
        const customColors = GM_getValue(themeKey, null);
        const colors = customColors || getDefaultColors();

        // 动态更新样式
        styleElement.textContent = `
            .Box.Box--condensed.mt-3 li.Box-row:nth-child(odd) {
                background-color: ${colors.oddRowColor} !important;
            }
            .Box.Box--condensed.mt-3 li.Box-row:nth-child(even) {
                background-color: ${colors.evenRowColor} !important;
            }
            .Box.Box--condensed.mt-3 li.Box-row:hover {
                background-color: ${colors.hoverColor} !important;
            }
        `;

        // 如果对话框是打开的，更新对话框中的颜色
        const dialog = document.querySelector('.color-picker-dialog.visible');
        if (dialog) {
            updateDialogColors();
        }
    }

    // 更新对话框中的颜色显示
    function updateDialogColors() {
        const dialog = document.querySelector('.color-picker-dialog');
        if (!dialog) return;

        const currentTheme = getCurrentTheme();
        const themeKey = `customColors${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}`;
        const customColors = GM_getValue(themeKey, null);
        const colors = customColors || (currentTheme === 'dark' ? defaultColorsDark : defaultColorsLight);

        // 更新标题
        const title = dialog.querySelector('.color-picker-title');
        if (title) {
            title.textContent = `颜色选择器 (${currentTheme === 'dark' ? '暗色主题' : '亮色主题'})`;
        }

        // 更新颜色按钮
        const oddRowColorBtn = dialog.querySelector('#oddRowColorBtn');
        const evenRowColorBtn = dialog.querySelector('#evenRowColorBtn');
        const hoverColorBtn = dialog.querySelector('#hoverColorBtn');

        if (oddRowColorBtn) oddRowColorBtn.style.backgroundColor = colors.oddRowColor;
        if (evenRowColorBtn) evenRowColorBtn.style.backgroundColor = colors.evenRowColor;
        if (hoverColorBtn) hoverColorBtn.style.backgroundColor = colors.hoverColor;

        // 更新颜色选择器值
        const oddRowColorPicker = dialog.querySelector('#oddRowColorPicker');
        const evenRowColorPicker = dialog.querySelector('#evenRowColorPicker');
        const hoverColorPicker = dialog.querySelector('#hoverColorPicker');

        if (oddRowColorPicker) oddRowColorPicker.value = colors.oddRowColor;
        if (evenRowColorPicker) evenRowColorPicker.value = colors.evenRowColor;
        if (hoverColorPicker) hoverColorPicker.value = colors.hoverColor;
    }

    // 初始应用颜色
    applyColors();

    // 监听主题变化并动态更新样式
    function setupThemeObserver() {
        // 监听HTML元素的属性变化
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'data-color-mode' ||
                    mutation.attributeName === 'class') {
                    applyColors();
                    break;
                }
            }
        });

        // 监听系统主题变化
        const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
        systemThemeMedia.addEventListener('change', applyColors);

        // 开始观察文档元素
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-color-mode', 'class']
        });
    }

    // 设置主题观察器
    setupThemeObserver();

    // 添加CSS样式 - 对话框样式（固定不变）
    GM_addStyle(`
        /* 对话框样式 - 修复主题跟随问题 */
        .color-picker-dialog {
            position: fixed;
            top: 50%; /* 垂直居中 */
            left: 15px; /* 距离左侧15px */
            transform: translateY(-50%) translateX(-100%);
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            min-width: 300px !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            max-height: 300px; /* 最大高度为视口的90% */
            overflow-y: auto;

            /* 初始状态 - 不可见 */
            opacity: 0;
            visibility: hidden;
            pointer-events: none;

            /* 过渡动画设置 */
            transition: opacity 0.5s ease, visibility 0.5s ease, transform 0.5s ease;
        }

        /* 明亮主题样式 */
        @media (prefers-color-scheme: light) {
            .color-picker-dialog {
                background: #ffffff;
                border: 1px solid #d0d7de;
                color: #24292f;
            }

            .color-picker-header {
                border-bottom: 1px solid #d8dee4;
            }

            .color-picker-title {
                color: #24292f;
            }

            .color-picker-close {
                color: #57606a;
            }

            .color-picker-close:hover {
                color: #24292f;
            }

            .menu-command {
                color: #24292f;
            }

            .color-button {
                border: 1px solid #d0d7de;
                background: #f6f8fa;
            }
        }

        /* 暗色主题样式 */
        @media (prefers-color-scheme: dark) {
            .color-picker-dialog {
                background: #0d1117;
                border: 1px solid #30363d;
                color: #c9d1d9;
            }

            .color-picker-header {
                border-bottom: 1px solid #21262d;
            }

            .color-picker-title {
                color: #c9d1d9;
            }

            .color-picker-close {
                color: #8b949e;
            }

            .color-picker-close:hover {
                color: #c9d1d9;
            }

            .menu-command {
                color: #c9d1d9;
            }

            .color-button {
                border: 1px solid #30363d;
                background: #161b22;
            }
        }

        /* 对话框可见状态 */
        .color-picker-dialog.visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: translateY(-50%) translateX(0);
        }

        .color-picker-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
        }

        .color-picker-title {
            font-weight: bold;
            margin: 0;
            font-size: 18px;
        }

        .color-picker-close {
            cursor: pointer;
            padding: 5px 10px;
            font-size: 24px;
            transition: all 0.3s ease;
        }

        .color-picker-close:hover {
            transform: scale(1.1);
        }

        .color-picker-content {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .color-picker-row {
            display: flex;
            align-items: center;
            gap: 10px;
            justify-content: space-between;
        }

        .menu-command {
            font-size: 16px;
            font-weight: 500;
            min-width: 120px;
        }

        .button-row {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 10px;
        }

        .dialog-button {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        }

        /* 按钮颜色保持不变 */
        .cancel-button {
            background-color: #007bff; /* 蓝色背景 */
            color: white;
        }

        .cancel-button:hover {
            background-color: #0069d9;
            transform: translateY(-2px);
        }

        .confirm-button {
            background-color: #ffa500; /* 橙黄色背景 */
            color: black;
        }

        .confirm-button:hover {
            background-color: #e69500;
            transform: translateY(-2px);
        }

        /* 新添加的重置按钮样式 */
        .reset-button {
            background-color: #ff6b6b; /* 浅红色背景 */
            color: white;
        }

        .reset-button:hover {
            background-color: #ff5252; /* 悬停时加深红色 */
            transform: translateY(-2px);
        }

        .color-button {
            width: 30px;
            height: 30px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .color-button:hover {
            transform: scale(1.1);
            box-shadow: 0 0 5px rgba(0,0,0,0.1);
        }

        .color-picker-container {
            position: relative;
            display: inline-block;
        }

        .color-picker-container input[type="color"] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }
    `);

    // 创建颜色选择器对话框
    function createColorPickerDialog() {
        // 如果对话框已存在，则显示它并更新颜色
        let dialog = document.querySelector('.color-picker-dialog');
        if (dialog) {
            updateDialogColors();
            openDialog(dialog);
            return;
        }

        // 获取当前主题
        const currentTheme = getCurrentTheme();

        // 获取当前主题的自定义颜色（如果存在）
        let customColors = GM_getValue(`customColors${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}`, null);

        // 如果没有自定义颜色，使用当前主题的默认颜色
        if (!customColors) {
            customColors = currentTheme === 'dark' ? defaultColorsDark : defaultColorsLight;
        }

        // 创建新的对话框
        dialog = document.createElement('div');
        dialog.className = 'color-picker-dialog';
        dialog.innerHTML = `
            <div class="color-picker-header">
                <h3 class="color-picker-title">颜色选择器 (${currentTheme === 'dark' ? '暗色主题' : '亮色主题'})</h3>
                <span class="color-picker-close" title="关闭">&times;</span>
            </div>
            <div class="color-picker-content">
                <div class="color-picker-row">
                    <span class="menu-command">⚙️ 设置奇数行颜色</span>
                    <div class="color-picker-container">
                        <button class="color-button" id="oddRowColorBtn" style="background-color: ${customColors.oddRowColor}"></button>
                        <input type="color" id="oddRowColorPicker" value="${customColors.oddRowColor}">
                    </div>
                </div>
                <div class="color-picker-row">
                    <span class="menu-command">⚙️ 设置偶数行颜色</span>
                    <div class="color-picker-container">
                        <button class="color-button" id="evenRowColorBtn" style="background-color: ${customColors.evenRowColor}"></button>
                        <input type="color" id="evenRowColorPicker" value="${customColors.evenRowColor}">
                    </div>
                </div>
                <div class="color-picker-row">
                    <span class="menu-command">⚙️ 设置悬停颜色</span>
                    <div class="color-picker-container">
                        <button class="color-button" id="hoverColorBtn" style="background-color: ${customColors.hoverColor}"></button>
                        <input type="color" id="hoverColorPicker" value="${customColors.hoverColor}">
                    </div>
                </div>
                <div class="button-row">
        <button class="dialog-button reset-button" title="重置为当前主题默认颜色">重置</button>
          <div style="margin-left: auto; display: flex; gap: 10px;">
            <button class="dialog-button cancel-button">取消</button>
            <button class="dialog-button confirm-button">确认</button>
          </div>
        </div>
        `;

        document.body.appendChild(dialog);

        // 打开对话框并应用滑入动画
        openDialog(dialog);

        // 获取元素引用
        const closeBtn = dialog.querySelector('.color-picker-close');
        const cancelBtn = dialog.querySelector('.cancel-button');
        const confirmBtn = dialog.querySelector('.confirm-button');
        const resetBtn = dialog.querySelector('.reset-button');

        const oddRowColorBtn = dialog.querySelector('#oddRowColorBtn');
        const evenRowColorBtn = dialog.querySelector('#evenRowColorBtn');
        const hoverColorBtn = dialog.querySelector('#hoverColorBtn');

        const oddRowColorPicker = dialog.querySelector('#oddRowColorPicker');
        const evenRowColorPicker = dialog.querySelector('#evenRowColorPicker');
        const hoverColorPicker = dialog.querySelector('#hoverColorPicker');

        // 设置颜色按钮点击事件 - 打开颜色选择器
        [oddRowColorBtn, evenRowColorBtn, hoverColorBtn].forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡

                // 找到对应的颜色选择器
                const picker = btn.nextElementSibling;
                if (picker && picker.tagName === 'INPUT' && picker.type === 'color') {
                    picker.click();
                }
            });
        });

        // 颜色选择器变化事件 - 只更新按钮颜色
        oddRowColorPicker.addEventListener('input', (e) => {
            oddRowColorBtn.style.backgroundColor = e.target.value;
        });

        evenRowColorPicker.addEventListener('input', (e) => {
            evenRowColorBtn.style.backgroundColor = e.target.value;
        });

        hoverColorPicker.addEventListener('input', (e) => {
            hoverColorBtn.style.backgroundColor = e.target.value;
        });

        // 关闭按钮功能 - 应用滑出动画
        closeBtn.addEventListener('click', () => {
            closeDialog(dialog);
        });

        // 取消按钮功能 - 应用滑出动画
        cancelBtn.addEventListener('click', () => {
            closeDialog(dialog);
        });

        // 新增的重置按钮功能
        resetBtn.addEventListener('click', () => {
            const resetTheme = getCurrentTheme(); // 动态获取当前主题

            if (confirm(`确定要重置${resetTheme === 'dark' ? '暗色' : '亮色'}主题的自定义颜色吗？`)) {
                // 删除当前主题的自定义颜色设置
                GM_setValue(`customColors${resetTheme.charAt(0).toUpperCase() + resetTheme.slice(1)}`, null);

                // 关闭对话框并更新颜色
                closeDialog(dialog);
                applyColors();
            }
        });

        // 确认按钮功能 - 修复：只保存到当前主题
        confirmBtn.addEventListener('click', () => {
            // 动态获取当前主题
            const saveTheme = getCurrentTheme();

            // 从颜色选择器获取值
            const newOddColor = oddRowColorPicker.value;
            const newEvenColor = evenRowColorPicker.value;
            const newHoverColor = hoverColorPicker.value;

            // 保存为当前主题的自定义颜色
            const newCustomColors = {
                oddRowColor: newOddColor,
                evenRowColor: newEvenColor,
                hoverColor: newHoverColor
            };

            // 保存到对应主题的存储键
            GM_setValue(`customColors${saveTheme.charAt(0).toUpperCase() + saveTheme.slice(1)}`, newCustomColors);

            closeDialog(dialog);
            applyColors(); // 动态更新颜色
        });

        // 添加ESC键关闭支持
        document.addEventListener('keydown', function handleEsc(e) {
            if (e.key === 'Escape') {
                closeDialog(dialog);
            }
        });

        // 点击外部关闭
        document.addEventListener('click', function handleOutsideClick(e) {
            if (dialog && !dialog.contains(e.target)) {
                closeDialog(dialog);
            }
        });
    }

    // 打开对话框并应用滑入动画
    function openDialog(dialog) {
        // 确保对话框在DOM中
        if (!document.body.contains(dialog)) {
            document.body.appendChild(dialog);
        }

        // 触发重绘
        void dialog.offsetHeight;

        // 添加可见类触发动画
        dialog.classList.add('visible');
    }

    // 关闭对话框并应用滑出动画
    function closeDialog(dialog) {
        // 移除可见类触发滑出动画
        dialog.classList.remove('visible');

        // 动画完成后移除对话框
        setTimeout(() => {
            if (dialog && dialog.parentNode) {
                dialog.parentNode.removeChild(dialog);
            }
        }, 500); // 500ms是动画持续时间
    }

    // 注册油猴菜单选项
    GM_registerMenuCommand("🎨 取色器", createColorPickerDialog);

    // 独立的菜单命令
    GM_registerMenuCommand("⚙️ 设置奇数行颜色", () => {
        const currentTheme = getCurrentTheme();
        const themeKey = `customColors${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}`;
        const customColors = GM_getValue(themeKey, null);
        const defaultColors = currentTheme === 'dark' ? defaultColorsDark : defaultColorsLight;

        const currentColor = customColors ? customColors.oddRowColor : defaultColors.oddRowColor;

        const newColor = prompt("请输入奇数行背景色（HEX格式，如#f8f9fa）:", currentColor);
        if (newColor) {
            // 获取或创建当前主题的自定义颜色
            const updatedColors = customColors ? {...customColors} : {...defaultColors};
            updatedColors.oddRowColor = newColor;

            // 保存更新
            GM_setValue(themeKey, updatedColors);
            applyColors(); // 动态更新颜色
        }
    });

    GM_registerMenuCommand("⚙️ 设置偶数行颜色", () => {
        const currentTheme = getCurrentTheme();
        const themeKey = `customColors${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}`;
        const customColors = GM_getValue(themeKey, null);
        const defaultColors = currentTheme === 'dark' ? defaultColorsDark : defaultColorsLight;

        const currentColor = customColors ? customColors.evenRowColor : defaultColors.evenRowColor;

        const newColor = prompt("请输入偶数行背景色（HEX格式，如#ffffff）:", currentColor);
        if (newColor) {
            // 获取或创建当前主题的自定义颜色
            const updatedColors = customColors ? {...customColors} : {...defaultColors};
            updatedColors.evenRowColor = newColor;

            // 保存更新
            GM_setValue(themeKey, updatedColors);
            applyColors(); // 动态更新颜色
        }
    });

    GM_registerMenuCommand("⚙️ 设置悬停颜色", () => {
        const currentTheme = getCurrentTheme();
        const themeKey = `customColors${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}`;
        const customColors = GM_getValue(themeKey, null);
        const defaultColors = currentTheme === 'dark' ? defaultColorsDark : defaultColorsLight;

        const currentColor = customColors ? customColors.hoverColor : defaultColors.hoverColor;

        const newColor = prompt("请输入鼠标悬停颜色（HEX格式，如#e9ecef）:", currentColor);
        if (newColor) {
            // 获取或创建当前主题的自定义颜色
            const updatedColors = customColors ? {...customColors} : {...defaultColors};
            updatedColors.hoverColor = newColor;

            // 保存更新
            GM_setValue(themeKey, updatedColors);
            applyColors(); // 动态更新颜色
        }
    });

    // 重置为当前主题的默认颜色
    GM_registerMenuCommand("🔄 重置为默认颜色", () => {
        const currentTheme = getCurrentTheme();

        if (confirm(`确定要重置${currentTheme === 'dark' ? '暗色' : '亮色'}主题的自定义颜色吗？`)) {
            // 删除当前主题的自定义颜色设置
            GM_setValue(`customColors${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}`, null);
            applyColors(); // 动态更新颜色
        }
    });
})();