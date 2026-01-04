// ==UserScript==
// @name         SPD测试脚本Mod
// @namespace    speedownload
// @version      2025-10-14
// @description  qwq
// @match        *://pan.baidu.com/disk/main*
// @icon         https://nd-static.bdstatic.com/m-static/v20-main/favicon-main.ico
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @connect      localhost
// @connect      127.0.0.1
// @connect      pcs.baidu.com
// @connect      baidupcs.com
// @connect      *.baidupcs.com
// @connect      speedownload.com
// @connect      *.speedownload.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/532997/SPD%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%ACMod.user.js
// @updateURL https://update.greasyfork.org/scripts/532997/SPD%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%ACMod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const defaultConfig = {
        method: 0, // 0 = 浏览器下载 | 1 = Aria2下载 | 2 = AB Download Manager
        aria2: {
            host: 'http://127.0.0.1:6800/jsonrpc',
            token: '',
            defaultDownloadPath: 'F:/',
        },
        abdmHost: 'http://localhost:15151',
        abdmSilent: false,
        accelerateUrl: "你的加速链接",
    };

    // 从存储中获取配置
    function getConfig() {
        const config = { ...defaultConfig };
        config.method = GM_getValue('method', defaultConfig.method);
        config.aria2.host = GM_getValue('aria2_host', defaultConfig.aria2.host);
        config.aria2.token = GM_getValue('aria2_token', defaultConfig.aria2.token);
        config.aria2.defaultDownloadPath = GM_getValue('aria2_path', defaultConfig.aria2.defaultDownloadPath);
        config.abdmHost = GM_getValue('abdm_host', defaultConfig.abdmHost),
        config.abdmSilent = GM_getValue('abdm_silent', defaultConfig.abdmSilent),
        config.accelerateUrl = GM_getValue('accelerate_url', defaultConfig.accelerateUrl);
        return config;
    }

    // 保存配置到存储
    function saveConfig(config) {
        GM_setValue('method', config.method);
        GM_setValue('aria2_host', config.aria2.host);
        GM_setValue('aria2_token', config.aria2.token);
        GM_setValue('aria2_path', config.aria2.defaultDownloadPath);
        GM_setValue('abdm_host', config.abdmHost);
        GM_setValue('abdm_silent', config.abdmSilent);
        GM_setValue('accelerate_url', config.accelerateUrl);
    }

    // 创建配置界面
    function createConfigDialog() {
        let Vue = this;
        const config = getConfig();

        // 移除已存在的配置窗口
        const existingDialog = document.getElementById('spd-config-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'spd-config-dialog';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // 创建配置窗口
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 20px;
            width: 500px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        dialog.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">SPD下载脚本配置</h2>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">下载方式:</label>
                    <select id="spd-method" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="0" ${config.method === 0 ? 'selected' : ''}>浏览器下载</option>
                        <option value="1" ${config.method === 1 ? 'selected' : ''}>Aria2下载</option>
                        <option value="2" ${config.method === 2 ? 'selected' : ''}>AB Download Manager</option>
                    </select>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">加速链接:</label>
                    <input type="text" id="spd-accelerate-url" value="${config.accelerateUrl}"
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"
                           placeholder="请输入加速链接">
                </div>

                <fieldset id="aria2-config" style="border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin-bottom: 15px; ${config.method === 1 ? 'display: block;' : 'display: none;'}">
                    <legend style="font-weight: bold; color: #666;">Aria2配置</legend>

                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">Aria2 RPC地址:</label>
                        <input type="text" id="spd-aria2-host" value="${config.aria2.host}"
                               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"
                               placeholder="http://127.0.0.1:6800/jsonrpc">
                    </div>

                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">Aria2 Token:</label>
                        <input type="text" id="spd-aria2-token" value="${config.aria2.token}"
                               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"
                               placeholder="留空如果没有设置token">
                    </div>

                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">默认下载路径:</label>
                        <input type="text" id="spd-aria2-path" value="${config.aria2.defaultDownloadPath}"
                               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"
                               placeholder="F:/">
                        <small style="color: #666; font-size: 12px;">注意：路径格式如 D:/ 或 /home/user/downloads/</small>
                    </div>
                </fieldset>

                <fieldset id="abdm-config" style="border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin-bottom: 15px; ${config.method === 2 ? 'display: block;' : 'display: none;'};">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">AB Download Manager 接口地址:</label>
                        <input type="text" id="spd-abdm-host" value="${config.abdmHost}"
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"
                            placeholder="http://localhost:15151/start-headless-download">
                    </div>

                    <div style="margin-bottom: 10px;">
                        <label>
                            <input type="checkbox" id="spd-abdm-silent" ${config.abdmSilent ? 'checked' : ''}> 启用静默下载（跳过确认界面）
                        </label>
                    </div>
                </fieldset>

                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="spd-config-cancel" style="padding: 8px 16px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;">取消</button>
                    <button id="spd-config-save" style="padding: 8px 16px; border: none; background: #007cff; color: white; border-radius: 4px; cursor: pointer;">保存</button>
                </div>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // 获取元素
        const methodSelect = document.getElementById('spd-method');
        const aria2Config = document.getElementById('aria2-config');
        const abdmConfig = document.getElementById('abdm-config');

        // 下载方式切换事件
        methodSelect.addEventListener('change', function() {
            const selectedMethod = parseInt(this.value);
            if(selectedMethod === 2){
                aria2Config.style.display = 'none';
                aria2Config.style.opacity = '0';

                abdmConfig.style.display = 'block';
                abdmConfig.style.opacity = '1';
            }else if (selectedMethod === 1) {
                abdmConfig.style.display = 'none';
                abdmConfig.style.opacity = '0';

                aria2Config.style.display = 'block';
                aria2Config.style.opacity = '1';
            } else {
                // 选择浏览器下载，隐藏Aria2配置
                aria2Config.style.opacity = '0';
                aria2Config.style.display = 'none';
                abdmConfig.style.opacity = '0';
                abdmConfig.style.display = 'none';

            }
        });

        // 绑定事件
        document.getElementById('spd-config-cancel').onclick = () => {
            overlay.remove();
        };

        document.getElementById('spd-config-save').onclick = () => {
            const newConfig = {
                method: parseInt(document.getElementById('spd-method').value),
                aria2: {
                    host: document.getElementById('spd-aria2-host').value.trim(),
                    token: document.getElementById('spd-aria2-token').value.trim(),
                    defaultDownloadPath: document.getElementById('spd-aria2-path').value.trim(),
                },
                abdmHost: document.getElementById('spd-abdm-host').value.trim(),
                abdmSilent: document.getElementById('spd-abdm-silent')?.checked ?? false,
                accelerateUrl: document.getElementById('spd-accelerate-url').value.trim()
            };

            // 验证配置
            if (!newConfig.accelerateUrl) {
                alert('请输入加速链接');
                return;
            }

            if (newConfig.method === 1) {
                if (!newConfig.aria2.host) {
                    alert('请输入Aria2 RPC地址');
                    return;
                }
                if (!newConfig.aria2.defaultDownloadPath) {
                    alert('请输入默认下载路径');
                    return;
                }
                // 验证RPC地址格式
                if (!newConfig.aria2.host.startsWith('http://') && !newConfig.aria2.host.startsWith('https://')) {
                    alert('Aria2 RPC地址必须以 http:// 或 https:// 开头');
                    return;
                }
            }

            if (newConfig.method === 2) {
                if (!newConfig.abdmHost) {
                    alert('请输入AB Download Manager API地址');
                    return;
                }
                // 验证RPC地址格式
                if (!newConfig.abdmHost.startsWith('http://') && !newConfig.abdmHost.startsWith('https://')) {
                    alert('Aria2 RPC地址必须以 http:// 或 https:// 开头');
                    return;
                }
            }

            saveConfig(newConfig);

            // 显示保存成功的样式提示
            const saveBtn = document.getElementById('spd-config-save');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '✓ 保存成功';
            saveBtn.style.background = '#28a745';
            
            
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.style.background = '#007cff';
                overlay.remove();
            }, 300);
        };

        // 点击遮罩层关闭
        // overlay.onclick = (e) => {
        //     if (e.target === overlay) {
        //         overlay.remove();
        //     }
        // };
    }

    // 创建设置按钮
    function createSettingsButton() {
        // 避免重复创建
        if (document.getElementById('spd-settings-btn')) {
            return;
        }

        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'spd-settings-btn';
        settingsBtn.innerHTML = '⚙️ SPD设置';
        settingsBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 8px 12px;
            background: #007cff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: background 0.3s ease;
        `;

        // 悬停效果
        settingsBtn.onmouseenter = () => {
            settingsBtn.style.background = '#0056cc';
        };
        settingsBtn.onmouseleave = () => {
            settingsBtn.style.background = '#007cff';
        };

        settingsBtn.onclick = createConfigDialog;
        document.body.appendChild(settingsBtn);
    }

    // 创建侧边栏设置按钮
    function createSidebarSettingsButton() {
        // 避免重复创建
        if (document.querySelector('.spd-settings-sidebar-btn')) {
            return;
        }
        // 等待侧边栏加载完成
        const checkSidebar = setInterval(() => {
            const sidebar = document.querySelector('.wp-s-aside-nav__main-top');
            if (sidebar) {
                clearInterval(checkSidebar);
                
                // 创建SPD设置按钮
                const settingsBtn = document.createElement('a');
                settingsBtn.href = 'javascript:;';
                settingsBtn.className = 'u-tooltip item wp-s-aside-nav__main-item wp-s-aside-nav__main-item spd-settings-sidebar-btn';
                settingsBtn.innerHTML = `
                    <div class="wp-s-aside-nav__main-item-wrap">
                        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzYwMTc2MDU2NDE2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI0NTUiIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHBhdGggZD0iTTQzOS4yNjQgMjA4YTE2IDE2IDAgMCAwLTE2IDE2djY3Ljk2OGEyMzkuNzQ0IDIzOS43NDQgMCAwIDAtNDYuNDk2IDI2Ljg5NmwtNTguOTEyLTM0YTE2IDE2IDAgMCAwLTIxLjg1NiA1Ljg1NmwtODAgMTM4LjU2YTE2IDE2IDAgMCAwIDUuODU2IDIxLjg1Nmw1OC44OTYgMzRhMjQyLjYyNCAyNDIuNjI0IDAgMCAwIDAgNTMuNzI4bC01OC44OCAzNGExNiAxNiAwIDAgMC02LjcyIDIwLjE3NmwwLjg0OCAxLjY4IDgwIDEzOC41NmExNiAxNiAwIDAgMCAyMS44NTYgNS44NTZsNTguOTEyLTM0YTIzOS43NDQgMjM5Ljc0NCAwIDAgMCA0Ni40OTYgMjYuODhWODAwYTE2IDE2IDAgMCAwIDE2IDE2aDE2MGExNiAxNiAwIDAgMCAxNi0xNnYtNjcuOTY4YTIzOS43NDQgMjM5Ljc0NCAwIDAgMCA0Ni41MTItMjYuODk2bDU4LjkxMiAzNGExNiAxNiAwIDAgMCAyMS44NTYtNS44NTZsODAtMTM4LjU2YTE2IDE2IDAgMCAwLTQuMjg4LTIwLjgzMmwtMS41NjgtMS4wMjQtNTguODk2LTM0YTI0Mi42MjQgMjQyLjYyNCAwIDAgMCAwLTUzLjcyOGw1OC44OC0zNGExNiAxNiAwIDAgMCA2LjcyLTIwLjE3NmwtMC44NDgtMS42OC04MC0xMzguNTZhMTYgMTYgMCAwIDAtMjEuODU2LTUuODU2bC01OC45MTIgMzRhMjM5Ljc0NCAyMzkuNzQ0IDAgMCAwLTQ2LjQ5Ni0yNi44OFYyMjRhMTYgMTYgMCAwIDAtMTYtMTZoLTE2MHogbTMyIDQ4aDk2djY3LjM3NmwyOC44IDEyLjU3NmMxMy4xNTIgNS43NiAyNS42MzIgMTIuOTc2IDM3LjE4NCAyMS41MmwyNS4yOCAxOC42ODggNTguNDQ4LTMzLjcyOCA0OCA4My4xMzYtNTguMzY4IDMzLjY4IDMuNDcyIDMxLjJhMTk0LjYyNCAxOTQuNjI0IDAgMCAxIDAgNDMuMTA0bC0zLjQ3MiAzMS4yIDU4LjM2OCAzMy42OC00OCA4My4xMzYtNTguNDMyLTMzLjcyOC0yNS4yOTYgMTguNjg4Yy0xMS41NTIgOC41NDQtMjQuMDMyIDE1Ljc2LTM3LjE4NCAyMS41MmwtMjguOCAxMi41NzZWNzY4aC05NnYtNjcuMzc2bC0yOC43ODQtMTIuNTc2Yy0xMy4xNTItNS43Ni0yNS42MzItMTIuOTc2LTM3LjE4NC0yMS41MmwtMjUuMjgtMTguNjg4LTU4LjQ0OCAzMy43MjgtNDgtODMuMTM2IDU4LjM2OC0zMy42OC0zLjQ3Mi0zMS4yYTE5NC42MjQgMTk0LjYyNCAwIDAgMSAwLTQzLjEwNGwzLjQ3Mi0zMS4yLTU4LjM2OC0zMy42OCA0OC04My4xMzYgNTguNDMyIDMzLjcyOCAyNS4yOTYtMTguNjg4YTE5MS43NDQgMTkxLjc0NCAwIDAgMSAzNy4xODQtMjEuNTJsMjguOC0xMi41NzZWMjU2eiBtNDcuMjggMTQ0YTExMiAxMTIgMCAxIDAgMCAyMjQgMTEyIDExMiAwIDAgMCAwLTIyNHogbTAgNDhhNjQgNjQgMCAxIDEgMCAxMjggNjQgNjQgMCAwIDEgMC0xMjh6IiBmaWxsPSIjNUE2MjZBIiBwLWlkPSIyNDU2Ij48L3BhdGg+PC9zdmc+" alt="" class="wp-s-aside-nav__main-item-img">
                        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzYwMTc2MDU2NDE2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI0NTUiIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHBhdGggZD0iTTQzOS4yNjQgMjA4YTE2IDE2IDAgMCAwLTE2IDE2djY3Ljk2OGEyMzkuNzQ0IDIzOS43NDQgMCAwIDAtNDYuNDk2IDI2Ljg5NmwtNTguOTEyLTM0YTE2IDE2IDAgMCAwLTIxLjg1NiA1Ljg1NmwtODAgMTM4LjU2YTE2IDE2IDAgMCAwIDUuODU2IDIxLjg1Nmw1OC44OTYgMzRhMjQyLjYyNCAyNDIuNjI0IDAgMCAwIDAgNTMuNzI4bC01OC44OCAzNGExNiAxNiAwIDAgMC02LjcyIDIwLjE3NmwwLjg0OCAxLjY4IDgwIDEzOC41NmExNiAxNiAwIDAgMCAyMS44NTYgNS44NTZsNTguOTEyLTM0YTIzOS43NDQgMjM5Ljc0NCAwIDAgMCA0Ni40OTYgMjYuODhWODAwYTE2IDE2IDAgMCAwIDE2IDE2aDE2MGExNiAxNiAwIDAgMCAxNi0xNnYtNjcuOTY4YTIzOS43NDQgMjM5Ljc0NCAwIDAgMCA0Ni41MTItMjYuODk2bDU4LjkxMiAzNGExNiAxNiAwIDAgMCAyMS44NTYtNS44NTZsODAtMTM4LjU2YTE2IDE2IDAgMCAwLTQuMjg4LTIwLjgzMmwtMS41NjgtMS4wMjQtNTguODk2LTM0YTI0Mi42MjQgMjQyLjYyNCAwIDAgMCAwLTUzLjcyOGw1OC44OC0zNGExNiAxNiAwIDAgMCA2LjcyLTIwLjE3NmwtMC44NDgtMS42OC04MC0xMzguNTZhMTYgMTYgMCAwIDAtMjEuODU2LTUuODU2bC01OC45MTIgMzRhMjM5Ljc0NCAyMzkuNzQ0IDAgMCAwLTQ2LjQ5Ni0yNi44OFYyMjRhMTYgMTYgMCAwIDAtMTYtMTZoLTE2MHogbTMyIDQ4aDk2djY3LjM3NmwyOC44IDEyLjU3NmMxMy4xNTIgNS43NiAyNS42MzIgMTIuOTc2IDM3LjE4NCAyMS41MmwyNS4yOCAxOC42ODggNTguNDQ4LTMzLjcyOCA0OCA4My4xMzYtNTguMzY4IDMzLjY4IDMuNDcyIDMxLjJhMTk0LjYyNCAxOTQuNjI0IDAgMCAxIDAgNDMuMTA0bC0zLjQ3MiAzMS4yIDU4LjM2OCAzMy42OC00OCA4My4xMzYtNTguNDMyLTMzLjcyOC0yNS4yOTYgMTguNjg4Yy0xMS41NTIgOC41NDQtMjQuMDMyIDE1Ljc2LTM3LjE4NCAyMS41MmwtMjguOCAxMi41NzZWNzY4aC05NnYtNjcuMzc2bC0yOC43ODQtMTIuNTc2Yy0xMy4xNTItNS43Ni0yNS42MzItMTIuOTc2LTM3LjE4NC0yMS41MmwtMjUuMjgtMTguNjg4LTU4LjQ0OCAzMy43MjgtNDgtODMuMTM2IDU4LjM2OC0zMy42OC0zLjQ3Mi0zMS4yYTE5NC42MjQgMTk0LjYyNCAwIDAgMSAwLTQzLjEwNGwzLjQ3Mi0zMS4yLTU4LjM2OC0zMy42OCA0OC04My4xMzYgNTguNDMyIDMzLjcyOCAyNS4yOTYtMTguNjg4YTE5MS43NDQgMTkxLjc0NCAwIDAgMSAzNy4xODQtMjEuNTJsMjguOC0xMi41NzZWMjU2eiBtNDcuMjggMTQ0YTExMiAxMTIgMCAxIDAgMCAyMjQgMTEyIDExMiAwIDAgMCAwLTIyNHogbTAgNDhhNjQgNjQgMCAxIDEgMCAxMjggNjQgNjQgMCAwIDEgMC0xMjh6IiBmaWxsPSIjNUE2MjZBIiBwLWlkPSIyNDU2Ij48L3BhdGg+PC9zdmc+" alt="" class="wp-s-aside-nav__main-item-img is-active-img">
                        <p class="wp-s-aside-nav__main-item-text text-ellip">
                            SPD设置
                        </p>
                    </div>
                `;
                settingsBtn.style.cssText = `
                    cursor: pointer;
                `;
                settingsBtn.onclick = createConfigDialog;
                
                // 插入到"消息"按钮后面
                sidebar.appendChild(settingsBtn);
            }
        }, 200);
    }

    // 立即注册菜单命令
    GM_registerMenuCommand('⚙️ 下载设置', createConfigDialog);

    // 获取当前配置
    function getCurrentConfig() {
        return getConfig();
    }

    function parseResponseHeaders(headersString) {
        const headers = {};
        if (!headersString) return headers;

        const headerPairs = headersString.split('\n');
        for (const header of headerPairs) {
            const index = header.indexOf(':');
            if (index > 0) {
                const key = header.substring(0, index).trim();
                const value = header.substring(index + 1).trim();
                headers[key] = value;
            }
        }
        return headers;
    }

    function downloadFile(method, url, info, ua) {
        let Vue = this;
        if(method == 0){
            let lastUpdateTime = 0;
            
            GM_download({
                url: url,
                name: decodeURIComponent(info.server_filename || info.fileName),
                headers: {
                    'User-Agent': ua
                },
                onprogress: function (progress) {
                    if (progress.total) {
                        const now = Date.now();
                        if (now - lastUpdateTime > 1000) { // 每秒更新一次
                            lastUpdateTime = now;
                            let percent = ((progress.loaded / progress.total) * 100).toFixed(2);
                            Vue.$svipMessage.closeAll(); // 关闭所有消息
                            Vue.$svipMessage({
                                message: `正在下载 ${info.server_filename}：${percent}%`,
                                type: "info",
                                duration: 0, // 不自动关闭
                                showClose: false // 显示关闭按钮
                            });
                        }
                    }
                },
                onload: function(response) {
                    // 关闭进度消息
                    Vue.$svipMessage.closeAll();
                    
                    Vue.$svipMessage({
                        message: `文件 ${info.server_filename} 下载完成`,
                        type: 'success',
                        duration: 2000,
                    });
                },
                onerror: function(error) {
                    // 关闭进度消息
                    Vue.$svipMessage.closeAll();
                    
                    Vue.$svipMessage({
                        message: `文件 ${info.server_filename} 下载失败: ${error.error}`,
                        type: 'error',
                        duration: 3000,
                    });
                }
            });
        } else if(method == 1){
            GM_xmlhttpRequest({
                method: "HEAD",
                url: url,
                onload: function (response) {
                    const config = getCurrentConfig();
                    let dirPath = info.path.split('/').slice(0, -1).join('/');
                    let downloadDir = config.aria2.defaultDownloadPath.replaceAll("\\", "/") + dirPath;
                    let data = {
                        id: new Date().getTime(),
                        jsonrpc: '2.0',
                        method: 'aria2.addUri',
                        params: [`token:${config.aria2.token}`, [response.finalUrl], {
                            'dir': downloadDir,
                            'out': decodeURIComponent(info.server_filename || info.fileName),
                            'max-connection-per-server': 16,
                            'header': [
                                `User-Agent: ${ua}`,
                            ]
                        }]
                    };

                    GM_xmlhttpRequest({
                        method: "POST",
                        url: config.aria2.host,
                        data: JSON.stringify(data),
                        onload: function () {
                            console.log("Aria2 下载任务已提交:", info.server_filename);
                        },
                        onerror: function (error) {
                            Vue.$svipMessage.closeAll();
                            Vue.$svipMessage({
                                message: "无法把文件推送至Aria2，请检查Aria2状态",
                                type: "error",
                                duration: 3000
                            });
                        }
                    });
                },
                onerror: function (error) {
                    Vue.$svipMessage.closeAll();
                    Vue.$svipMessage({
                        message: "无法获取 " + info.server_filename + " 的下载链接",
                        type: "error",
                        duration: 3000
                    });
                }
            });

        } else if (method == 2) {
            // AB Download Manager下载方式
            const config = getCurrentConfig()
            let abdmHost = config.abdmHost.replace(/\/+$/, '');
            let endpoint = config.abdmSilent ? '/start-headless-download' : '/add';
            // 构造请求体
            let data = null;
            if (config.abdmSilent) {
                data = {
                    downloadSource: [{
                        link: url,
                        headers: ua ? { "User-Agent": ua } : {}
                        // downloadPage: window.location.href
                    }],
                    // folder: '', // 可以允许用户配置，也可以留空
                    name: info.server_filename || '',
                    queueId: 0 // 可选，默认0即无队列
                };
            } else {
                data = [{
                        link: url,
                        headers: ua ? { "User-Agent": ua } : {}
                        // downloadPage: window.location.href
                    }];
            }
            GM_xmlhttpRequest({
                method: 'POST',
                url: abdmHost + endpoint,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data),
                onload: function (response) {
                    console.log("发送abdm", response)
                    if (response.status === 200) {
                        Vue.$svipMessage({
                            message: `任务已发送到 AB Download Manager: ${data.name}`,
                            type: 'success',
                            duration: 3000,
                        });
                    } else {
                        Vue.$svipMessage({
                            message: `发送到 AB Download Manager 失败，状态码：${response.status}`,
                            type: 'error',
                            duration: 3000,
                        });
                    }
                },
                onerror: function (error) {
                    console.log(error);
                    Vue.$svipMessage({
                        message: '无法连接 AB Download Manager，请确保其已启动并监听接口',
                        type: 'error',
                        duration: 3000,
                    });
                    
                }
            });
        } else {
            Vue.$svipMessage.closeAll();
            Vue.$svipMessage({
                type: "error",
                message: "无效的下载方式，请进入脚本编辑页重新设置",
                duration: 3000,
            });
            return;
        }
    }

    function accelerateDownload(file) {
        let Vue = this;
        const config = getCurrentConfig();

        Vue.dlinkIns.getSign().then(function () {
            GM_xmlhttpRequest({
                method: "POST",
                url: "/api/download?clienttype=8&app_id=250528&web=1&fidlist=["+file.fs_id+"]&type=dlink&sign=" + encodeURIComponent(Vue.dlinkIns.sign) + "&timestamp=" + Vue.dlinkIns.timestamp,
                onload: function (response) {
                    console.log("请求下载/api/download 响应",JSON.parse(response.response))
                    let dlink = JSON.parse(response.response).dlink[0].dlink
                    GM_xmlhttpRequest({
                        method: "HEAD",
                        url: dlink,
                        headers: {
                            "User-Agent": "pan.baidu.com"
                        },
                        onload: function (response) {
                            console.log("请求dlink链接的响应",response)
                            const headers = parseResponseHeaders(response.responseHeaders);
                            console.log(JSON.stringify({
                                    md5: headers['Content-MD5'],
                                    size: headers['Content-Length'],
                                    name: file.server_filename,
                                    id: file.fs_id.toString()
                                }))
                            GM_xmlhttpRequest({
                                method: "POST",
                                url: config.accelerateUrl,
                                data: JSON.stringify({
                                    md5: headers['Content-MD5'],
                                    size: headers['Content-Length'],
                                    name: file.server_filename,
                                    id: file.fs_id.toString()
                                }),
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                onload: function (response) {
                                    console.log("请求加速链接响应",response)
                                    let res = JSON.parse(response.response)
                                    if(res.code != 0) {
                                        Vue.$svipMessage.closeAll();
                                        Vue.$svipMessage({
                                            message: res.message,
                                            type: "error",
                                            duration: 2000,
                                        });
                                        return;
                                    }

                                    Vue.$svipMessage.closeAll();
                                    Vue.$svipMessage({
                                        message: res.message,
                                        type: "sucess",
                                        duration: 2000,
                                    });
                                    let url = res.data.urls[0].url
                                    let ua = res.data.ua
                                    downloadFile.call(Vue, config.method, url, file, ua);
                                },
                                onerror: function (error) {
                                    console.log("请求加速链接响应error",error)
                                    Vue.$svipMessage.closeAll();
                                    Vue.$svipMessage({
                                        message: "请求加速链接失败",
                                        type: "error",
                                        duration: 3000,
                                    });
                                }
                            });
                        },
                        onerror: function (error) {
                            Vue.$svipMessage.closeAll();
                            Vue.$svipMessage({
                                message: "无权限获取此文件信息",
                                type: "error",
                                duration: 3000
                            });
                        }
                    });
                },
                onerror: function () {
                    Vue.$svipMessage.closeAll();
                    Vue.$svipMessage({
                        message: "无法请求百度网盘下载服务器",
                        type: "error",
                        duration: 3000,
                    });
                }
            });
        });
    }

    function download(dir) {
        let Vue = this;
        if(dir != undefined) {
            GM_xmlhttpRequest({
                method: "GET",
                url: "/api/list?clienttype=0&app_id=250528&web=1&order=name&desc=1&dir=" + encodeURIComponent(dir.path) + "&num=100000&page=1",
                onload: function (response) {
                    let list = JSON.parse(response.response).list;
                    if(list.length < 1) {
                        Vue.$svipMessage.closeAll();
                        Vue.$svipMessage({
                            message: "这是一个空的文件夹！",
                            type: "error"
                        });
                        return;
                    }
                    list.forEach((file) => {
                        if(file.isdir == 1) {
                            download.call(Vue, file);
                        } else {
                            accelerateDownload.call(Vue,file);
                        }
                    });
                },
                onerror: function () {
                    Vue.$svipMessage.closeAll();
                    Vue.$svipMessage({
                        message: "无法获取 " + dir.server_filename + " 内的文件",
                        type: "error",
                        duration: 3000,
                    });
                }
            });
            return;
        }
        this.canShowFail = true;
        if(this.currentFileMetas.length < 1) {
            Vue.$svipMessage({
                message: "请至少选择一个文件进行下载",
                type: "error"
            });
            return;
        }
        if (this.currentFileMetas.length >= 1) {
            const fileName = this.currentFileMetas[0].server_filename;
            const msg = this.currentFileMetas.length === 1 ? `正在下载 ${fileName}` : `正在下载 ${fileName} 等其他文件...`;
            Vue.$svipMessage.closeAll();
            Vue.$svipMessage({
                message: msg,
                type: "success",
                duration: 2000,
            });

        }

        this.currentFileMetas.forEach(file => {
            if(file.isdir == 1) {
                download.call(Vue, file);
            } else {
                console.log(this.dlinkIns,file.md5,file.size,file.server_filename)
                accelerateDownload.call(Vue,file);
            }
        })
    }

    let HookBaiduNetdisk = new MutationObserver(mutationRecords => {
        for (let mr of mutationRecords) {
            for (let node of mr.addedNodes) {
                if (node.__vue__ !== undefined && node.__vue__ !== null) {
                    let Vue = node.__vue__;

                    if (Vue.$el.className == "nd-download") {
                        Vue.download = download;
                        Vue.$options.methods.download = download;
                    } // 重写下载方法

                }
            }
        }
    });

    HookBaiduNetdisk.observe(document, {
        childList: true,
        subtree: true
    });

    // 等待页面加载后创建设置按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSidebarSettingsButton);
    } else {
        setTimeout(createSidebarSettingsButton, 1000);
    }

})();
