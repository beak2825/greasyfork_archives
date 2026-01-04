// ==UserScript==
// @name         m3u8 批量提取器（可配置+鉴权）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  从网页中提取 m3u8 列表并发送到本地服务器
// @author       大黄蜂
// @match        *://missav.ws/*
// @match        *://missav.ai/*
// @match        *://jable.tv/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/534026/m3u8%20%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88%E5%8F%AF%E9%85%8D%E7%BD%AE%2B%E9%89%B4%E6%9D%83%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/534026/m3u8%20%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88%E5%8F%AF%E9%85%8D%E7%BD%AE%2B%E9%89%B4%E6%9D%83%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========== 🧩 配置模块 ==========
    const base = {
        registerMenuCommand() {
            GM_registerMenuCommand('⚙️ 设置', function () {
				base.showSetting();
			});
        },
        showSetting() {
            // 创建浮动设置面板
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5); z-index: 9999; display: flex;
                justify-content: center; align-items: center;
            `;

            const form = document.createElement('div');
            form.style.cssText = `
                background: white; padding: 20px; border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2); width: 300px;
                font-family: Arial, sans-serif;
            `;
            form.innerHTML = `
                <h3 style="margin-top: 0;">服务器设置</h3>
                <label style="display: block; margin-bottom: 8px;">
                    服务器地址:
                    <input type="text" id="server" placeholder="127.0.0.1" style="width: 100%; padding: 5px; margin-top: 4px;">
                </label>
                <label style="display: block; margin-bottom: 8px;">
                    端口:
                    <input type="number" id="port" placeholder="8088" style="width: 100%; padding: 5px; margin-top: 4px;">
                </label>
                <label style="display: block; margin-bottom: 16px;">
                    鉴权密钥（可选）:
                    <input type="text" id="auth" placeholder="请输入密钥" style="width: 100%; padding: 5px; margin-top: 4px;">
                </label>
                <div style="text-align: right;">
                    <button id="cancel" style="padding: 8px 16px; margin-right: 8px; background: #ccc; border: none; cursor: pointer;">取消</button>
                    <button id="save" style="padding: 8px 16px; background: #28a745; color: white; border: none; cursor: pointer;">保存</button>
                </div>
            `;

            overlay.appendChild(form);
            document.body.appendChild(overlay);

            // 加载现有配置
            const config = base.loadConfig();
            form.querySelector('#server').value = config.SERVER_ADDRESS || '127.0.0.1';
            form.querySelector('#port').value = config.SERVER_PORT || '8088';
            form.querySelector('#auth').value = config.AUTH_KEY || '';

            // 事件绑定
            form.querySelector('#save').addEventListener('click', () => {
                const server = form.querySelector('#server').value.trim();
                const port = form.querySelector('#port').value.trim();
                const auth = form.querySelector('#auth').value.trim();
                if (server && port) {
                    base.saveConfig({ SERVER_ADDRESS: server, SERVER_PORT: port, AUTH_KEY: auth });
                    alert('设置已保存，刷新页面后生效！');
                    document.body.removeChild(overlay);
                } else {
                    alert('服务器地址和端口不能为空！');
                }
            });

            form.querySelector('#cancel').addEventListener('click', () => {
                document.body.removeChild(overlay);
            });
        },
        saveConfig(cfg) {
            GM_setValue('m3u8_config', JSON.stringify(cfg));
        },
        loadConfig() {
            try {
                return JSON.parse(GM_getValue('m3u8_config', '{}')) || {};
            } catch (e) {
                return {};
            }
        }
    };

    base.registerMenuCommand();

    // ========== 📤 功能模块 ==========
    async function fetchVideoList(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP状态码: ${response.status}`);
            return await response.text();
        } catch (err) {
            console.error('获取m3u8内容失败:', err);
            throw err;
        }
    }

    function createUrlElement(fileInfo, filename) {
        const flexDiv = document.createElement('div');
        flexDiv.className = 'flex';
        flexDiv.style.cssText = 'height: auto; flex-wrap: wrap; padding: 5px;';
        flexDiv.innerHTML = `
            <a style="color: lightgreen; font-weight: bold; border: 2px solid lightgreen; flex: 1 1 auto; padding: 5px; text-decoration: none;">
                ${fileInfo.display}
            </a>
            <button class="send-url" style="margin-left: 10px; background-color: lightblue; color: black; flex: 1 1 auto; padding: 5px; border: none; cursor: pointer;">发送</button>
            <button class="copy-url" style="margin-left: 10px; background-color: lightblue; color: black; flex: 1 1 auto; padding: 5px; border: none; cursor: pointer;">复制url</button>
            <a class="open-potplayer" href="potplayer://${fileInfo.url}" style="margin-left: 10px; background-color: lightblue; color: black; flex: 1 1 auto; padding: 5px; border: none; cursor: pointer;">用potplayer播放</a>
            <style>
                @media (max-width: 600px) {
                    .flex { flex-direction: column; align-items: flex-start; }
                    a, button { width: 100%; margin-left: 0; margin-bottom: 5px; }
                }
            </style>
        `;

        flexDiv.querySelector('.copy-url').addEventListener('click', () => {
            const input = document.createElement('input');
            input.value = fileInfo.url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            alert('URL已复制到剪贴板！');
        });

        flexDiv.querySelector('.send-url').addEventListener('click', async () => {
            const config = base.loadConfig();
            if (!config.SERVER_ADDRESS || !config.SERVER_PORT) {
                alert('请先配置服务器地址和端口！');
                return;
            }

            const headers = { 'Content-Type': 'application/json' };
            if (config.AUTH_KEY) headers['Authorization'] = config.AUTH_KEY;

            const payload = { name: filename, url: fileInfo.url };

            try {
                const res = await fetch(`http://${config.SERVER_ADDRESS}:${config.SERVER_PORT}/`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    console.log('✅ 发送成功：', payload);
                    alert('发送成功！');
                } else {
                    console.error('❌ 发送失败，状态码：', res.status);
                    alert('发送失败，状态码：' + res.status);
                }
            } catch (err) {
                console.error('❌ 发送请求出错：', err);
                alert('发送失败，请检查服务器是否开启。');
            }
        });

        return flexDiv;
    }

    function generateSafeFileName(selector) {
        const element = document.querySelector(selector);
        if (!element) return 'default_video';
        const text = element.textContent.trim();
        return text.replace(/[\\/:*?"<>|]/g, '').substring(0, 100) || 'default_video';
    }

    function generateSafeFileName1(selector) {
        let elements = document.querySelectorAll(selector)
        let combinedText = Array.from(elements)
            .map(element => element.textContent.trim())
            .join(' ')
        let safeFileName = combinedText.replace(/[\\/:*?"<>|]/g, '').substring(0, 100) // 限制文件名长度为100字符
        return safeFileName
    }

    function createErrorElement(message) {
        const div = document.createElement('div');
        div.style.cssText = 'color: red; padding: 5px;';
        div.textContent = message;
        return div;
    }

    function tryJable(tools){
        const filename = generateSafeFileName('section.video-info.pb-3 h4');

        const scripts = document.querySelectorAll('section.pb-3.pb-e-lg-30 script');
        let targetScript = null;
        for (let script of scripts) {
            if (script.textContent.includes('hlsUrl')) {
                targetScript = script.textContent;
                break;
            }
        }

        if (!targetScript) {
            console.error('未找到包含"hlsUrl"的脚本');
            tools.appendChild(createErrorElement('未找到m3u8相关脚本'));
            return;
        }

        const urlMatch = targetScript.match(/hlsUrl\s*=\s*['"](https?:\/\/[^\s'"]+\.m3u8)['"]/);
        var url = null;
        if (urlMatch) {
            const url = urlMatch[1];
            const display = filename.slice(0, filename.indexOf(" "))

            const fileInfo = {
                            display: display,
                            url: url
            };
            tools.appendChild(createUrlElement(fileInfo, filename));

        } else {
            console.error('无法提取有效的m3u8地址');
            tools.appendChild(createErrorElement('无效的m3u8地址格式'));
            return;
        }

    }

    function tryMissAv(tools) {
        const filename = generateSafeFileName('div.mt-4 > h1');
        if (filename === 'default_video'){
            filename = generateSafeFileName1('span.font-medium');
        }
        const prefix = 'https://surrit.com/';
        const suffix = '/playlist.m3u8';

        // 动态查找脚本
        const scripts = document.querySelectorAll('script');
        let targetScript = null;
        for (let script of scripts) {
            if (script.textContent.includes('seek')) {
                targetScript = script.textContent;
                break;
            }
        }

        if (!targetScript) {
            console.error('未找到包含"seek"的脚本');
            tools.appendChild(createErrorElement('未找到m3u8相关脚本'));
            return;
        }

        const index = targetScript.indexOf('seek');
        if (index === -1 || index - 38 < 0) {
            console.error('无法提取有效的m3u8地址');
            tools.appendChild(createErrorElement('无效的m3u8地址格式'));
            return;
        }

        const first32Chars = targetScript.substring(index - 38, index - 2);
        const url = prefix + first32Chars + suffix;

        console.log('提取的m3u8 URL:', url);
        fetchVideoList(url)
            .then(text => {
                const lines = text.split('\n');
                lines.forEach(line => {
                    if (line.trim() && !line.startsWith('#')) {
                        const fileInfo = {
                            display: line.trim().split('/')[0],
                            url: prefix + first32Chars + '/' + line.trim()
                        };
                        tools.appendChild(createUrlElement(fileInfo, filename));
                    }
                });
            })
            .catch(() => {
                tools.appendChild(createErrorElement('无法加载m3u8内容'));
            });
    }

    // ========== 🚀 启动 ==========
    window.addEventListener('load', () => {
        const hostname = window.location.hostname;
        if (hostname.includes('missav')) {
            const tools = document.querySelector('.order-first .mt-4');
            if (!tools) {
                console.error('未找到容器元素');
                return;
            }

            const flexDiv = document.createElement('div');
            flexDiv.className = 'flex justify-center space-x-4 md:space-x-6 py-8 rounded-md shadow-sm';
            flexDiv.style.cssText = 'flex-direction: column; align-items: baseline;';
            if (tools.children[1]) tools.removeChild(tools.children[1]);
            tools.appendChild(flexDiv);
            tryMissAv(tools);
        }else if (hostname.includes('jable')){
            const tools = document.querySelector('.text-center .my-3');
            if (!tools) {
                console.error('未找到容器元素');
                return;
            }

            const flexDiv = document.createElement('div');
            flexDiv.className = 'flex justify-center space-x-4 md:space-x-6 py-8 rounded-md shadow-sm';
            flexDiv.style.cssText = 'flex-direction: column; align-items: baseline;';
            if (tools.children[1]) tools.removeChild(tools.children[1]);
            tools.appendChild(flexDiv);

            tryJable(tools);
        }
    });
})();