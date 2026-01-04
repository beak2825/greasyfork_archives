// ==UserScript==
// @name              Small Window Preview - zscc
// @name:zh-CN        小窗预览-船仓UI美化版
// @description:zh-CN 拖拽链接时在弹出窗口中打开链接，并在打开前提供预览，使用 Edge 的预读技术。同时在小窗口打开时在背后添加亚克力效果,可设置为长按触发.自动记录每个站点的小窗口大小.
// @description       Drag a link to open it in a popup window with a preview before opening, using Edge's prerendering technology. Also, add an acrylic effect behind the window when it's open.
// @version           2.5.1.8
// @author            hiisme & zscc.in
// @match             *://*/*
// @require           https://greasyfork.org/scripts/379483-sweetalert2/code/SweetAlert2.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_info
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @namespace         https://github.com/ChinaGodMan/UserScripts
// @supportURL        https://github.com/ChinaGodMan/UserScripts/issues
// @homepageURL       https://github.com/ChinaGodMan/UserScripts
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEYklEQVR4nO3VW0yTZxzH8QI9ACbb4g3J3OR2Zm64uaVXu/BChkMUhAotUlrKUQUqqLhDRnDJLnZQoLvYxRLneQSB0tLSw1ugnE9KC7y05QwFVDxBdt/fUhhb2dS97+sLvEv4J89NE5rP98mfpzze9mzP9rxwxNe84shLrjnRhQFfUHE/gov6EFzUg+Az3QhRdyGksAMhBe3g57eBn28H/3QL+KeaIThpgyCPgCDXCmGuGcIcE4TZjRBlGSDKbIBIpYdIVY/QDC1ClXUIVdQgLP0OwuTVCJNXITztN7ymrPJFFusXPv6uNYbHZMS3vOLQr5y+oHMDCDp7F5sdEH7iNsJTb+INxW3f/m9bxbQDdl92z/HOO7DVATtkNxBZpPPSDhB+OejjSsDr8ls+2gG8Eie4ErBDeh20/V+MLONzchkXyCWUDC+hZOgZzg89xbnBpzg7+ATFzicocjxeOWcGHkE98AiF9xZRcG8R+XcfIr//IU73P8Cpvgc42Xcfeb33kduzsHJyuueR3T2PrK45ZHbOQdXpharDi4yOWSjbZ6Fom0F62zTSW6chb51Cmn2KfgCX8CdaJukHrMc/21J8KpMArtx8asskZM0TDAI4hJcxCeASXto0Tj+AS/gUG4MALuGTbWP0A7iEP04wCOASXkKMMgvgCl5iZRDAJXySxUM/gEv4RCYBXMIfM7vpB3AJn8Ak4J/4vJ555HTOIrt9ZuVktU0js20aqtYpZNinoLRPQtkyCUXLBNLtk6zi400uBgGBN9+7ALlpCOKfDfjoJx32a1bPh5p6fFD599n35zlwlUCqhWQNH88kIHBtcrq8OHTTDoFaQ/kc+JVAWvM4K/ijjSP0A9btfPc8MppGEVVeSzlgX6UWqbYxVvBHjAwC/vUP2zUHhc2DqApqEVEVWsiIUVbwcUaSfsBzX5tOL+RWN/ZeqqEQUAcpMcoK/rCBQcDznkpV+yxkRgd2f3ODUkCK1cMKPtYwzCyAKd5/3i9fDWADH9swRD/gVfBrAckWNyv4z/QMAl4FvxpQi+NmNyv4Q/pB+gFreKnBgbcvXn8pdlfZNez5vnrdZ+9droXE7GIFH6NjEKBqn6F087vKriJB2w+JwYl3f7yzLiDJ5GIF/6nOST9AanD8TuXmj2n7ILWNQtY0DkmDA3t+qP7rdyDRNMIKPrreuURPn18hivj6yiJl/NpTSYwhUT+AT36xIK62F0kWNxt4HNQ6qqjjS0uF/EKNjsrarMMHvDZJFhckFg8r+Git43FMjfOtTcOztfMHtc5l/82ziheoK0280iuhgX+WQkxEJNvGSNr4hmHPEa3rTeqrsQH4wAiJ1UP+L/GBEYlmN7m5eB6Px1dr6v7jV9Xof5WofFccMRGRYHaRm4b3D1+tmWEDvzZxxGBEvMlFbgreP8KiyncEhZoFJmvzsoijjSPkhuNfHMEcvzYS0/DOw0byYqyBLIs2De/kbfQICsr3+teJX1hZS3dttnL+AHpvNumR+ceNAAAAAElFTkSuQmCC
// @iconbak           https://github.com/ChinaGodMan/UserScripts/raw/main/docs/icon/Scripts%20Icons/icons8-POPUPWINDOW-48.png
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/522092/Small%20Window%20Preview%20-%20zscc.user.js
// @updateURL https://update.greasyfork.org/scripts/522092/Small%20Window%20Preview%20-%20zscc.meta.js
// ==/UserScript==
(function () {
    // 确保 SweetAlert2 样式正确加载
    const style = document.createElement('style');
    style.textContent = `
    .swal2-popup {
        font-size: 1rem;
    }
    /* 如果需要的话，这里可以添加更多自定义样式 */
`;
    document.head.appendChild(style);

    const userLang = (navigator.languages && navigator.languages[0]) || navigator.language || 'en'
    const translations = {
        'en': {
            actionMode: 'Select Trigger Mode',
            actionMode1: 'Long Press',
            actionMode2: 'Drag',
            actionMode0: 'Both',
            longPressEffective: 'Long press effective time',
            setLongPressEffective: 'Enter the long press effective time (milliseconds):',
            longPressDuration: 'Long Press Duration',
            blurEnabled: 'Toggle Blur Effect',
            blurIntensity: 'Set Blur Intensity',
            closeOnMouseClick: 'Toggle Close on Mouse Click',
            closeOnScroll: 'Toggle Close on Scroll',
            windowWidth: 'Set Window Width',
            windowHeight: 'Set Window Height',
            setLongPressDuration: 'Enter Long Press Duration (milliseconds):',
            setBlurIntensityprompt: 'Enter Blur Intensity (0-10):',
            toggleActionMode: 'Select Trigger Mode:\n1: Long Press\n2: Drag\n0: Both',
            setWindowSizeprompt: 'Enter Window Size (pixels):',
            showCountdown: 'Show countdown progress bar',
            saveWindowConfig: 'Record window position',
            showCountdowndrag: 'Show drag timeout progress bar',
            dragTimeOut: 'Drag timeout duration',
            settings: '⚙️ Settings',
            saveBtn: 'Save',
            cancelBtn: 'Cancel'
        },
        'zh-CN,zh,zh-SG': {
            actionMode: '选择触发方式',
            actionMode1: '长按',
            actionMode2: '拖拽',
            actionMode0: '两者都用',
            longPressEffective: '长按生效时间',
            setLongPressEffective: '输入长按生效时间（毫秒）:',
            longPressDuration: '长按触发时间',
            blurEnabled: '模糊效果',
            blurIntensity: '设置模糊强度',
            closeOnMouseClick: '点击关闭小窗',
            closeOnScroll: '滚动关闭小窗',
            windowWidth: '设置小窗宽度',
            windowHeight: '设置小窗高度',
            setLongPressDuration: '输入长按触发时间（毫秒）:',
            setBlurIntensityprompt: '输入模糊强度（0-10）:',
            toggleActionMode: '选择触发方式:\n1: 长按\n2: 拖拽\n0: 两者都用',
            setWindowSizeprompt: '輸入默认小窗口配置（像素）:',
            showCountdown: '显示长按倒计时进度条',
            saveWindowConfig: '记录窗口位置',
            showCountdowndrag: '显示拖拽超时进度条',
            dragTimeOut: '拖拽超时时间',
            settings: '⚙️ 配置界面',
            saveBtn: '保存',
            cancelBtn: '取消'
        },
        'zh-TW,zh-HK,zh-MO': {
            actionMode: '選擇觸發方式',
            actionMode1: '長按',
            actionMode2: '拖曳',
            actionMode0: '兩者都用',
            longPressEffective: '长按生效时间',
            setLongPressEffective: '输入长按生效时间（毫秒）:',
            longPressDuration: '長按觸發時間',
            blurEnabled: '切換模糊效果',
            blurIntensity: '設定模糊強度',
            closeOnMouseClick: '切換點擊關閉小窗',
            closeOnScroll: '切換滾動關閉小窗',
            windowWidth: '設定小窗寬度',
            windowHeight: '設定小窗高度',
            setLongPressDuration: '輸入長按觸發時間（毫秒）:',
            setBlurIntensityprompt: '輸入模糊強度（0-10）:',
            toggleActionMode: '選擇觸發方式:\n1: 長按\n2: 拖曳\n0: 兩者都用',
            setWindowSizeprompt: '輸入默认小窗口配置（像素）:',
            showCountdown: '顯示倒數計時進度條',
            saveWindowConfig: '記錄窗口位置',
            showCountdowndrag: '顯示拖曳逾時進度條',
            dragTimeOut: '拖曳逾時時間'
        },
        'ja': {
            actionMode: 'トリガーモードの選択',
            actionMode1: '長押し',
            actionMode2: 'ドラッグ',
            actionMode0: '両方',
            longPressDuration: '長押しの時間',
            blurEnabled: 'ぼかし効果の切り替え',
            blurIntensity: 'ぼかしの強度を設定',
            closeOnMouseClick: 'マウスクリックで閉じる切り替え',
            closeOnScroll: 'スクロールで閉じる切り替え',
            windowWidth: 'ウィンドウ幅の設定',
            windowHeight: 'ウィンドウ高さの設定',
            setLongPressDuration: '長押しの時間（ミリ秒）を入力:',
            setBlurIntensityprompt: 'ぼかしの強度（0-10）を入力:',
            toggleActionMode: 'トリガーモードの選択:\n1: 長押し\n2: ドラッグ\n0: 両方',
            setWindowSizeprompt: 'ウィンドウサイズ（ピクセル）を入力:',
            showCountdown: 'カウントダウン進行状況を表示',
            saveWindowConfig: 'ウィンドウの位置を記録',
            showCountdowndrag: 'ドラッグタイムアウトの進行状況バーを表示',
            dragTimeOut: 'ドラッグタイムアウト時間'
        },
        'vi': {
            actionMode: 'Chọn chế độ kích hoạt',
            actionMode1: 'Nhấn lâu',
            actionMode2: 'Kéo thả',
            actionMode0: 'Cả hai',
            longPressDuration: 'Thời gian nhấn lâu',
            blurEnabled: 'Bật hiệu ứng mờ',
            blurIntensity: 'Cài đặt độ mờ',
            closeOnMouseClick: 'Bật/tắt đóng cửa sổ bằng nhấp chuột',
            closeOnScroll: 'Bật/tắt đóng cửa sổ khi cuộn',
            windowWidth: 'Cài đặt chiều rộng cửa sổ',
            windowHeight: 'Cài đặt chiều cao cửa sổ',
            setLongPressDuration: 'Nhập thời gian nhấn lâu (mili giây):',
            setBlurIntensityprompt: 'Nhập độ mờ (0-10):',
            toggleActionMode: 'Chọn chế độ kích hoạt:\n1: Nhấn lâu\n2: Kéo thả\n0: Cả hai',
            setWindowSizeprompt: 'Nhập kích thước cửa sổ (pixel):',
            showCountdown: 'Hiển thị thanh tiến trình đếm ngược',
            saveWindowConfig: 'Ghi lại vị trí cửa sổ',
            showCountdowndrag: 'Hiển thị thanh tiến trình quá hạn khi kéo thả',
            dragTimeOut: 'Thời gian quá hạn khi kéo thả'
        }
    }
    const getTranslations = (lang) => {
        for (const key in translations) {
            if (key === lang || key.split(',').includes(lang)) {
                return translations[key]
            }
        }
        return translations['en']
    }
    const translate = new Proxy(
        function (key) {
            const lang = userLang
            const strings = getTranslations(lang)
            return strings[key] || translations['en'][key]
        },
        {
            get(target, prop) {
                const lang = userLang
                const strings = getTranslations(lang)
                return strings[prop] || translations['en'][prop]
            }
        }
    )
    'use strict'
    const state = {
        isDragging: false,
        linkToPreload: null,
        popupWindow: null,
        acrylicOverlay: null,
        progressBar: null,
        dragprogressBar: null,
        dragintervalId: null,
        startTime: null
    }
    function getWindowConfig() {
        const windowConfigs = GM_getValue('SitewindowConfigs', [
        ])
        GM_setValue('SitewindowConfigs', windowConfigs
        )
        const currentHostName = window.location.hostname
        // 顶级规则,查找当前域名是否在设置内.....
        for (const config of windowConfigs) {
            if (typeof config.hostName === 'string') {
                if (config.hostName === currentHostName) {
                    return {
                        width: config.width || 870,
                        height: config.height || 530,
                        top: config.top || (window.screen.height - (config.height || 530)) / 3,
                        left: config.left || (window.screen.width - (config.width || 870)) / 2
                    }
                }
            } else if (Array.isArray(config.hostName)) {
                if (config.hostName.includes(currentHostName)) {
                    return {
                        width: config.width || 870,
                        height: config.height || 530,
                        top: config.top || (window.screen.height - (config.height || 530)) / 3,
                        left: config.left || (window.screen.width - (config.width || 870)) / 2
                    }
                }
            }
        }
        // 二级规则,如果开启了自定义设置,使用自定义.
        const customWindowWidth = GM_getValue('custom_windowWidth', 0)
        const customWindowHeight = GM_getValue('custom_windowHeight', 0)
        const customScreenLeft = GM_getValue('custom_screenLeft', 0)
        const customScreenTop = GM_getValue('custom_screenTop', 0)
        if (GM_getValue('saveWindowConfig', false)) {
            if (customWindowWidth !== 0 && customWindowHeight !== 0 && customScreenLeft !== 0 && customScreenTop !== 0) {
                return {
                    width: customWindowWidth,
                    height: customWindowHeight,
                    top: customScreenTop,
                    left: customScreenLeft
                }
            }
        }
        //三级级规则 以上规则全部找不到,窗口使用默认设置.
        return {
            width: 870,
            height: 530,
            top: (window.screen.height - 530) / 3,
            left: (window.screen.width - 870) / 2
        }
    }
    function reWindowConfig() {
        const windowConfig = getWindowConfig()
        config.windowWidth = windowConfig.width,
            config.windowHeight = windowConfig.height,
            config.screenLeft = windowConfig.left,
            config.screenTop = windowConfig.top
    }
    let config = {
    }
    function updateConfig() {
        config = {
            windowWidth: 0,
            windowHeight: 0,
            screenLeft: 0,
            screenTop: 0,
            blurIntensity: GM_getValue('blurIntensity', 5),
            blurEnabled: GM_getValue('blurEnabled', true),
            closeOnMouseClick: GM_getValue('closeOnMouseClick', true),
            closeOnScroll: GM_getValue('closeOnScroll', true),
            longPressEffective: GM_getValue('longPressEffective', 200), // 长按生效时长 （毫秒）//STUB - 也就是长按打开小窗口时间=longPressEffective+longPressDuration
            longPressDuration: GM_getValue('longPressDuration', 500), // 长按持续时间（毫秒）
            dragTimeOut: GM_getValue('dragTimeOut', 2000), // 拖拽超时时间（毫秒）
            actionMode: GM_getValue('actionMode', 0), // 0: 两者都用, 1: 长按, 2: 拖拽
            showCountdown: GM_getValue('showCountdown', true), // 是否显示倒计时进度条
            showCountdowndrag: GM_getValue('showCountdowndrag', true), // 是否显示拖拽倒计时进度条
            saveWindowConfig: GM_getValue('saveWindowConfig', true)//记住窗口位置,没啥用
        }
    }
    updateConfig()
    reWindowConfig()
function openSettings() {
    Swal.fire({
        title: '⚙️ 小窗设置',
        width: 800, // 减小弹窗宽度
        padding: '1em',
        showCancelButton: true,
        confirmButtonText: translate('saveBtn'),
        cancelButtonText: translate('cancelBtn'),
        customClass: {
            popup: 'custom-popup',
            confirmButton: 'custom-confirm-btn',
            cancelButton: 'custom-cancel-btn',
            actions: 'custom-actions',
            container: 'custom-container'
        },
        html: `<style>
            /* 调整弹窗整体布局 */
            .custom-popup {
                margin: 0;
                display: flex;
                flex-direction: column;
                max-height: 85vh; /* 限制最大高度 */
            }

            .swal2-html-container {
                margin: 0;
                padding: 1em;
                overflow-y: auto; /* 内容过多时显示滚动条 */
                flex: 1;
            }

            /* 设置容器样式 */
            .settings-container {
                display: flex;
                gap: 15px;
                justify-content: space-between;
                flex-wrap: wrap;
                padding-bottom: 1em; /* 为底部按钮留出空间 */
            }

            /* 设置卡片样式 */
            .settings-section {
                flex: 1;
                min-width: 240px; /* 减小最小宽度 */
                background: #ffffff;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                margin-bottom: 10px;
            }

            /* 标题样式优化 */
            .settings-section-title {
                font-size: 1.1em;
                color: #2196F3;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 1px solid #e0e0e0;
            }

            /* 输入框和标签样式优化 */
            .settings-row {
                margin-bottom: 12px;
            }

            .settings-label {
                display: block;
                margin-bottom: 4px;
                color: #666;
                font-size: 0.9em;
            }

            .settings-input,
            select.settings-input {
                width: 100%;
                padding: 6px 10px;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                font-size: 0.9em;
                box-sizing: border-box;
            }

            /* 复选框容器样式优化 */
            .checkbox-wrapper {
                display: flex;
                align-items: center;
                margin: 8px 0;
            }

            /* 按钮容器固定在底部 */
            .custom-actions {
                padding: 1em;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
                margin-top: auto; /* 推到底部 */
                display: flex;
                justify-content: center;
                gap: 10px;
            }

            /* 按钮样式优化 */
            .custom-confirm-btn,
            .custom-cancel-btn {
                min-width: 80px !important;
                padding: 8px 20px !important;
                font-size: 0.95em !important;
                border-radius: 4px !important;
                height: 36px !important;
                line-height: 1 !important;
            }

            .custom-confirm-btn {
                background: #2196F3 !important;
                color: white !important;
                border: none !important;
            }

            .custom-cancel-btn {
                background: #f8f9fa !important;
                color: #333 !important;
                border: 1px solid #ddd !important;
            }

            /* 按钮悬停效果 */
            .custom-confirm-btn:hover,
            .custom-cancel-btn:hover {
                transform: translateY(-1px);
                transition: all 0.2s;
            }

            .custom-confirm-btn:hover {
                background: #1976D2 !important;
                box-shadow: 0 2px 5px rgba(33, 150, 243, 0.3);
            }

            .custom-cancel-btn:hover {
                background: #e9ecef !important;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }

            /* 响应式布局优化 */
            @media (max-width: 768px) {
                .settings-container {
                    flex-direction: column;
                }
            }
        </style>

        <div class="settings-container">
            <!-- 触发设置部分 -->
            <div class="settings-section trigger-section">
                <div class="settings-section-title">触发设置</div>
                <div class="settings-row">
                    <label class="settings-label">选择触发方式:</label>
                    <select class="settings-input" id="actionMode">
                        <option value="0" ${GM_getValue('actionMode', 0) == 0 ? 'selected' : ''}>两者都用</option>
                        <option value="1" ${GM_getValue('actionMode', 0) == 1 ? 'selected' : ''}>长按</option>
                        <option value="2" ${GM_getValue('actionMode', 0) == 2 ? 'selected' : ''}>拖拽</option>
                    </select>
                </div>
                <div class="settings-row">
                    <label class="settings-label">长按生效时间(毫秒):</label>
                    <input type="number" class="settings-input" id="longPressEffective" value="${GM_getValue('longPressEffective', 200)}">
                </div>
                <div class="settings-row">
                    <label class="settings-label">长按触发时间(毫秒):</label>
                    <input type="number" class="settings-input" id="longPressDuration" value="${GM_getValue('longPressDuration', 500)}">
                </div>
                <div class="settings-row">
                    <label class="settings-label">拖拽超时时间(毫秒):</label>
                    <input type="number" class="settings-input" id="dragTimeOut" value="${GM_getValue('dragTimeOut', 2000)}">
                </div>
            </div>

            <!-- 效果设置部分 -->
            <div class="settings-section effect-section">
                <div class="settings-section-title">效果设置</div>
                <div class="settings-row">
                    <label class="settings-label">模糊强度(0-10):</label>
                    <input type="number" class="settings-input" id="blurIntensity" value="${GM_getValue('blurIntensity', 5)}">
                </div>
                <div class="settings-row">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="blurEnabled" ${GM_getValue('blurEnabled', true) ? 'checked' : ''}>
                        <label for="blurEnabled">启用模糊效果</label>
                    </div>
                </div>
                <div class="settings-row">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="closeOnMouseClick" ${GM_getValue('closeOnMouseClick', true) ? 'checked' : ''}>
                        <label for="closeOnMouseClick">点击关闭小窗</label>
                    </div>
                </div>
                <div class="settings-row">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="closeOnScroll" ${GM_getValue('closeOnScroll', true) ? 'checked' : ''}>
                        <label for="closeOnScroll">滚动关闭小窗</label>
                    </div>
                </div>
                <div class="settings-row">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="showCountdown" ${GM_getValue('showCountdown', true) ? 'checked' : ''}>
                        <label for="showCountdown">显示长按倒计时进度条</label>
                    </div>
                </div>
                <div class="settings-row">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="showCountdowndrag" ${GM_getValue('showCountdowndrag', true) ? 'checked' : ''}>
                        <label for="showCountdowndrag">显示拖拽超时进度条</label>
                    </div>
                </div>
            </div>

            <!-- 窗口设置部分 -->
            <div class="settings-section window-section">
                <div class="settings-section-title">窗口设置</div>
                <div class="settings-row">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="saveWindowConfig" ${GM_getValue('saveWindowConfig', true) ? 'checked' : ''}>
                        <label for="saveWindowConfig">记录窗口位置</label>
                    </div>
                </div>
            </div>
        </div>`,
        preConfirm: () => {
            // 收集所有设置的值
            return {
                actionMode: parseInt(document.getElementById('actionMode').value),
                longPressEffective: parseInt(document.getElementById('longPressEffective').value),
                longPressDuration: parseInt(document.getElementById('longPressDuration').value),
                dragTimeOut: parseInt(document.getElementById('dragTimeOut').value),
                blurIntensity: parseInt(document.getElementById('blurIntensity').value),
                blurEnabled: document.getElementById('blurEnabled').checked,
                closeOnMouseClick: document.getElementById('closeOnMouseClick').checked,
                closeOnScroll: document.getElementById('closeOnScroll').checked,
                showCountdown: document.getElementById('showCountdown').checked,
                showCountdowndrag: document.getElementById('showCountdowndrag').checked,
                saveWindowConfig: document.getElementById('saveWindowConfig').checked
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // 保存所有设置
            const values = result.value;
            Object.entries(values).forEach(([key, value]) => {
                GM_setValue(key, value);
                config[key] = value; // 更新当前配置
            });

            // 更新配置并刷新界面
            updateConfig();
            updateMenuCommands();
            setupEventListeners(); // 重新设置事件监听器

            // 显示保存成功提示
            Swal.fire({
                title: '设置已保存!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    async function preloadLink(link, attributes = {}) {
        const preloadElement = document.createElement('link')
        preloadElement.rel = 'preload'
        preloadElement.href = link
        preloadElement.as = '*/*'
        Object.assign(preloadElement, attributes)
        document.head.appendChild(preloadElement)
        await delay(1)
    }
    function createAcrylicOverlay() {
        const acrylicOverlay = document.createElement('div')
        acrylicOverlay.style.position = 'fixed'
        acrylicOverlay.style.top = '0'
        acrylicOverlay.style.left = '0'
        acrylicOverlay.style.width = '100%'
        acrylicOverlay.style.height = '100%'
        acrylicOverlay.style.zIndex = '9999'
        acrylicOverlay.style.backdropFilter = config.blurEnabled ? `blur(${config.blurIntensity}px)` : 'none'
        if (config.closeOnMouseClick) {
            acrylicOverlay.addEventListener('click', handleAcrylicOverlayClick)
        }
        document.body.appendChild(acrylicOverlay)
        return acrylicOverlay
    }
    function handleAcrylicOverlayClick(event) {
        if (event.target === state.acrylicOverlay) {
            closePopupWindow()
        }
    }
    function removeAcrylicOverlay() {
        if (state.acrylicOverlay) {
            document.body.removeChild(state.acrylicOverlay)
            state.acrylicOverlay = null
        }
    }
    window.addEventListener('message', (event) => {
        const message = event.data
        if (message.type === 'qinwuyuan') {
            const width = window.innerWidth
            const height = window.innerHeight
            const left = window.screenX
            const top = window.screenY
            if (config.saveWindowConfig) {
                saveWindowConfig(width, height, left, top, message.hostname)
                //  console.log(width, height, left, top, message.hostname)
            }
        }
    })
    function openPopupWindow(link) {
        reWindowConfig()//FIXME - 跨域窗口如果自己刷新了配置,重新刷新下
        if (!state.popupWindow || state.popupWindow.closed) {
            state.acrylicOverlay = createAcrylicOverlay()
            state.popupWindow = window.open(link, '_blank', `width=${config.windowWidth},height=${config.windowHeight},left=${config.screenLeft},top=${config.screenTop}`)
            state.popupWindowChecker = setInterval(() => {
                if (state.popupWindow) {//保证窗口存在时才检测,兼容下原来脚本点击原窗口焦点关闭覆盖层
                    if (state.popupWindow.closed) {
                        removeAcrylicOverlay()
                        clearInterval(state.popupWindowChecker)
                    } else {
                        try {
                            const width = state.popupWindow.innerWidth
                            const height = state.popupWindow.innerHeight
                            const left = state.popupWindow.screenX
                            const top = state.popupWindow.screenY
                            if (config.saveWindowConfig) {
                                saveWindowConfig(width, height, left, top)
                            }
                        } catch (error) {
                            console.warn('访问跨源窗口属性失败,让弹出窗口自己设置窗口大小...:')
                            const message = {
                                type: 'qinwuyuan',
                                hostname: window.location.hostname
                            }
                            state.popupWindow.postMessage(message, '*')
                        }
                    }
                }
            }, 200)
        }
    }
    function closePopupWindow() {
        if (state.popupWindow && !state.popupWindow.closed) {
            state.popupWindow.close()
            state.popupWindow = null
            removeAcrylicOverlay()
            if (state.linkToPreload) {
                removePreloadedLink(state.linkToPreload)
            }
            window.removeEventListener('scroll', closePopupOnScroll)
        }
    }
    function removePreloadedLink(link) {
        const preloadElement = document.querySelector(`link[href="${link}"]`)
        if (preloadElement) {
            document.head.removeChild(preloadElement)
        }
    }
    function closePopupOnScroll() {
        if (state.popupWindow && !state.popupWindow.closed) {
            closePopupWindow()
        }
    }
    function toggleActionMode() {
        const mode = prompt(translate('toggleActionMode'), config.actionMode)
        if (mode !== null) {
            config.actionMode = parseInt(mode, 10)
            GM_setValue('actionMode', config.actionMode)
            setupEventListeners()
            updateMenuCommands()
        }
    }
    function setLongPressDuration() {
        const duration = prompt(translate('setLongPressDuration'), config.longPressDuration)
        if (duration !== null) {
            config.longPressDuration = duration
            GM_setValue('longPressDuration', duration)
            updateMenuCommands()
        }
    }
    function setLongPressEffective() {
        const duration = prompt(translate('setLongPressEffective'), config.longPressEffective)
        if (duration !== null) {
            config.longPressEffective = duration
            GM_setValue('longPressEffective', duration)
            updateMenuCommands()
        }
    }
    function setdragTimeOut() {
        const duration = prompt(translate('dragTimeOut'), config.dragTimeOut)
        if (duration !== null) {
            config.dragTimeOut = duration
            GM_setValue('dragTimeOut', duration)
            updateMenuCommands()
        }
    }
    function toggleBlurEffect() {
        config.blurEnabled = !config.blurEnabled
        GM_setValue('blurEnabled', config.blurEnabled)
        updateMenuCommands()
    }
    function setBlurIntensity() {
        const intensity = prompt(translate('setBlurIntensityprompt'), config.blurIntensity)
        if (intensity !== null) {
            config.blurIntensity = parseInt(intensity, 10)
            GM_setValue('blurIntensity', config.blurIntensity)
            updateMenuCommands()
        }
    }
    function toggleCloseOnMouseClick() {
        config.closeOnMouseClick = !config.closeOnMouseClick
        GM_setValue('closeOnMouseClick', config.closeOnMouseClick)
        updateMenuCommands()
    }
    function toggleCloseOnScroll() {
        config.closeOnScroll = !config.closeOnScroll
        handleScrollCommand()
        GM_setValue('closeOnScroll', config.closeOnScroll)
        updateMenuCommands()
    }
    function handleScrollCommand() {
        if (config.closeOnScroll) {
            window.addEventListener('scroll', closePopupOnScroll, { once: true })
        } else {
            window.removeEventListener('scroll', closePopupOnScroll)
        }
    }
    function setWindowSize(dimension) {//!SECTION-已无实际意义,开启记录窗口位置后,哪里还需要手动配置.
        const size = prompt(`${translate('setWindowSizeprompt')} (${dimension})`, config[dimension === 'width' ? 'windowWidth' : 'windowHeight'])
        if (size !== null) {
            config[dimension === 'width' ? 'windowWidth' : 'windowHeight'] = parseInt(size, 10)
            GM_setValue(dimension === 'width' ? 'windowWidth' : 'windowHeight', config[dimension === 'width' ? 'windowWidth' : 'windowHeight'])
            updateMenuCommands()
            if (state.popupWindow && !state.popupWindow.closed) {
                state.popupWindow.resizeTo(config.windowWidth, config.windowHeight)
            }
        }
    }
    let registeredMenuCommands = {}
    function registerMenuCommand(label, action) {
        const menuCommandId = GM_registerMenuCommand(label, action)
        registeredMenuCommands[label] = menuCommandId
        return menuCommandId
    }
    function saveWindowConfig(width, height, left, top, HostName = window.location.hostname) {
        config.windowWidth = width
        config.windowHeight = height
        config.screenLeft = left
        config.screenTop = top
        const currentHostName = HostName
        let windowConfigs = GM_getValue('SitewindowConfigs', []
        )
        let configUpdated = false
        for (let config of windowConfigs) {
            if (typeof config.hostName === 'string') {
                if (config.hostName === currentHostName) {
                    config.width = width
                    config.height = height
                    config.top = top
                    config.left = left
                    configUpdated = true
                    break
                }
            } else if (Array.isArray(config.hostName)) {
                if (config.hostName.includes(currentHostName)) {
                    config.width = width
                    config.height = height
                    config.top = top
                    config.left = left
                    configUpdated = true
                    break
                }
            }
        }
        if (!configUpdated) {
            windowConfigs.push({
                name: `${currentHostName}`,
                hostName: currentHostName,
                width: width,
                height: height,
                top: top,
                left: left
            })
        }
        //ANCHOR -  开启记录窗口位置时.无法找到配置时,会推送一个新配置,当其他的网站没有自定义配置的也同样使用这一次的窗口.大小.
        GM_setValue('SitewindowConfigs', windowConfigs)
        GM_setValue('custom_windowWidth', width)
        GM_setValue('custom_windowHeight', height)
        GM_setValue('custom_screenLeft', left)
        GM_setValue('custom_screenTop', top)
        updateMenuCommands()
    }
    function toggleSwitch(property) {
        if (property in config) {
            config[property] = !config[property]
            GM_setValue(property, config[property])
            updateMenuCommands()
        }
    }
    function updateMenuCommands() {//LINK -
        const menuCommands = [
            { label: translate('settings'), action: openSettings },
            { label: translate('actionMode') + ` (${config.actionMode === 1 ? translate('actionMode1') : config.actionMode === 2 ? translate('actionMode2') : translate('actionMode0')})`, action: toggleActionMode },
            { label: translate('longPressEffective') + ` (${config.longPressEffective}ms)`, action: setLongPressEffective },
            { label: translate('longPressDuration') + ` (${config.longPressDuration}ms)`, action: setLongPressDuration },
            { label: translate('dragTimeOut') + ` (${config.dragTimeOut}ms)`, action: setdragTimeOut },
            { label: translate('blurEnabled') + ` (${config.blurEnabled ? '✅' : '❌'})`, action: toggleBlurEffect },
            { label: translate('blurIntensity') + ` (${config.blurIntensity})`, action: setBlurIntensity },
            { label: translate('closeOnMouseClick') + ` (${config.closeOnMouseClick ? '✅' : '❌'})`, action: toggleCloseOnMouseClick },
            { label: translate('closeOnScroll') + ` (${config.closeOnScroll ? '✅' : '❌'})`, action: toggleCloseOnScroll },
            /*     { label: translate('windowWidth') + ` (${config.windowWidth})`, action: () => { setWindowSize('width') } },//!SECTION -已无实际意义,脚本不会使用
                { label: translate('windowHeight') + ` (${config.windowHeight})`, action: () => { setWindowSize('height') } },//!SECTION -已无实际意义,脚本不会使用 */
            { label: translate('showCountdown') + ` (${config.showCountdown ? '✅' : '❌'})`, action: () => { toggleSwitch('showCountdown') } },
            { label: translate('showCountdowndrag') + ` (${config.showCountdowndrag ? '✅' : '❌'})`, action: () => { toggleSwitch('showCountdowndrag') } },
            { label: translate('saveWindowConfig') + ` (${config.saveWindowConfig ? '✅' : '❌'})`, action: () => { toggleSwitch('saveWindowConfig') } }
        ]
        for (const label in registeredMenuCommands) {
            GM_unregisterMenuCommand(registeredMenuCommands[label])
        }
        registeredMenuCommands = {}
        menuCommands.forEach((command) => {
            registerMenuCommand(command.label, command.action)
        })
    }
    updateMenuCommands()
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
    }
    function setupEventListeners() {
        // 移除旧的事件监听器
        document.body.removeEventListener('dragstart', handleDragStart)
        document.body.removeEventListener('dragend', handleDragEnd)
        document.body.removeEventListener('mousedown', handleMouseDown)
        document.body.removeEventListener('mouseup', handleMouseUp)
        document.body.removeEventListener('mouseleave', handleMouseLeave)
        document.body.removeEventListener('wheel', handleWheel)
        document.body.removeEventListener('click', handleClick)
        // 根据 actionMode 配置添加事件监听器
        if (config.actionMode === 1 || config.actionMode === 0) {
            document.body.addEventListener('mousedown', handleMouseDown)
            document.body.addEventListener('mouseup', handleMouseUp)
            document.body.addEventListener('mouseleave', handleMouseLeave)
        }
        if (config.actionMode === 2 || config.actionMode === 0) {
            document.body.addEventListener('dragstart', handleDragStart)
            document.body.addEventListener('dragend', handleDragEnd)
        }
        document.body.addEventListener('wheel', handleWheel)
        document.body.addEventListener('click', handleClick)
    }
    // 事件处理函数
    function handleDragStart(event) {
        const linkElement = event.target.tagName === 'A' ? event.target : event.target.closest('a')
        if (linkElement) {
            if (config.showCountdowndrag && config.dragTimeOut != 0) {//超时选项,只要
                state.dragprogressBar = createProgressBar('#ff9800', '#f44336')
                state.dragprogressBar.style.display = 'block'
                state.dragprogressBar.style.width = '5%'
                state.startTime = Date.now()
                clearInterval(state.dragintervalId)
                state.dragintervalId = setInterval(function () {
                    const elapsed = Date.now() - state.startTime
                    const progress = Math.max(5 - (elapsed / config.dragTimeOut) * 5, 0) // 减小你妈
                    state.dragprogressBar.style.width = `${progress}%`
                    if (progress <= 0) {// 超时结束
                        state.isDragging = false
                        clearInterval(state.dragintervalId)
                        state.dragprogressBar.style.display = 'none'
                    }
                }, 100) //
                window.addEventListener('drag', function (event) {
                    // 保证进度条位置处于貂毛鼠标的下面
                    const x = event.clientX
                    const y = event.clientY + 30 // 偏移
                    state.dragprogressBar.style.left = `${x}px`
                    state.dragprogressBar.style.top = `${y}px`
                })
            }
            const link = linkElement.href
            state.isDragging = true
            state.linkToPreload = link
            preloadLink(state.linkToPreload, { importance: 'high' }).then(() => {
                if (config.closeOnScroll) {
                    window.addEventListener('scroll', closePopupOnScroll, { once: true })
                }
            })
        }
    }
    function handleDragEnd(event) {
        const x = event.clientX
        const y = event.clientY
        console.log(x, y)
        const elementAtPoint = document.elementFromPoint(x, y)
        if (state.dragprogressBar) {//显示超时进度条时
            clearInterval(state.dragintervalId)
            state.dragprogressBar.style.display = 'none'
        }
        if (y < 1) {//接近顶部
            state.isDragging = false
        }
        //if (!document.body.contains(elementAtPoint)) state.isDragging = false//移出到系统
        if (state.isDragging && state.linkToPreload) {
            state.isDragging = false
            openPopupWindow(state.linkToPreload)
            state.linkToPreload = null
        }
    }
    function createProgressBar(colorStart = '#4caf50', colorEnd = '#81c784') {
        if (!config.showCountdown && !config.showCountdowndrag) return null
        const progressBar = document.createElement('div')
        Object.assign(progressBar.style, {
            position: 'fixed',
            height: '6px',
            width: '5%',
            background: `linear-gradient(to right, ${colorStart}, ${colorEnd})`,
            borderRadius: '3px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
            zIndex: '9999'
        })
        document.body.appendChild(progressBar)
        return progressBar
    }
    let mouseDownTime = 0
    function handleMouseDown(event) {
    // 只响应鼠标左键 (0 表示左键)
    if (event.button !== 0) return;
    const linkElement = event.target.tagName === 'A' ? event.target : event.target.closest('a')
    if (linkElement) {
            let isDragging = false
            let isMouseDown = true
            const onMouseMove = () => {
                isDragging = true
                clearTimeout(state.pressTimer)
                progressBarremove()
            }
            const onMouseUp = () => {
                isMouseDown = false
                clearTimeout(state.pressTimer)
                progressBarremove()
            }
            document.addEventListener('dragstart', onMouseMove, { once: true })
            document.addEventListener('mouseup', onMouseUp, { once: true })
            document.addEventListener('keydown', onMouseUp, { once: true })
            setTimeout(() => {
                if (!isDragging && isMouseDown) { // 确保没有拖拽并且鼠标仍按下
                    state.progressBar = createProgressBar()
                    if (state.progressBar) {
                        const transitionDuration = Math.max(config.longPressDuration, 0) + 'ms'
                        state.progressBar.style.left = `${event.clientX}px`  // 设置进度条位置为鼠标下方
                        state.progressBar.style.top = `${event.clientY + 20}px`  // 偏移一点，避免挡住鼠标
                        state.progressBar.style.transition = `width ${transitionDuration} linear`
                        requestAnimationFrame(() => {
                            state.progressBar.style.width = '0'
                        })
                    }
                }
                /* //NOTE - 鼠标按下的时间才会触发子函数计时,
                长按触发打开预览窗口时长＝鼠标按下的时间+长按触发时间=打开小窗时间.
                */
                onProgres()
            }, config.longPressEffective)
            function onProgres(params) {
                state.pressTimer = setTimeout(() => {
                    if (!isDragging && isMouseDown) { // 确保没有拖拽并且鼠标仍按下
                        const link = linkElement.href
                        state.linkToPreload = link
                        preloadLink(state.linkToPreload, { importance: 'high' }).then(() => {
                            openPopupWindow(state.linkToPreload)
                        })
                    }
                    progressBarremove()
                }, config.longPressDuration)
            }
        }
    }
    function handleMouseUp() {
        clearTimeout(state.pressTimer)
        state.pressTimer = null
        progressBarremove()
    }
    function progressBarremove() {
        if (state.progressBar) {
            state.progressBar.remove()
        }
    }
    function handleMouseLeave() {
        clearTimeout(state.pressTimer)
        state.pressTimer = null
    }
    function handleWheel() {
        if (config.closeOnScroll) {
            closePopupWindow()
        }
    }
    function handleClick(event) {
        if (event.target === state.acrylicOverlay) {
            removeAcrylicOverlay()
        }
    }
    setupEventListeners()
})()
