// ==UserScript==
// @name         StarSea星海
// @version      0.3.5
// @description  洛克王国全屏、防止误操作等
// @author       星海
// @match        https://res.17roco.qq.com/h5/*
// @namespace https://17roco.qq.com/h5/
// @downloadURL https://update.greasyfork.org/scripts/517619/StarSea%E6%98%9F%E6%B5%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/517619/StarSea%E6%98%9F%E6%B5%B7.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    console.log('脚本已启动');

    const appContainer = document.createElement('div');
    appContainer.id = 'app';
    document.body.appendChild(appContainer);

    const meta = document.createElement('meta');
    meta.name = 'referrer';
    meta.content = 'no-referrer';
    document.head.appendChild(meta);

    // 添加 CSS 样式到页面
    function addStyle(cssText) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(cssText));
        document.head.appendChild(style);
    }

    // 动态加载 CSS
    async function loadCSS(urls) {
        for (const url of urls) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const cssText = await response.text();
                    addStyle(cssText);
                    console.log(`成功加载 CSS: ${url}`);
                    break;  // 成功加载后停止尝试
                }
            } catch (error) {
                console.warn(`加载 CSS 失败: ${url}`, error);
            }
        }
    }

    // 动态加载 JavaScript
    async function loadJS(urls) {
        for (const url of urls) {
            try {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.type = 'module';
                    script.src = url;
                    script.onload = () => {
                        console.log(`成功加载 JS: ${url}`);
                        resolve();
                    };
                    script.onerror = () => {
                        console.warn(`加载 JS 失败: ${url}`);
                        reject();
                    };
                    document.body.appendChild(script);
                });
                break;  // 成功加载后停止尝试
            } catch (error) {
                console.warn(`尝试加载 JS 失败: ${url}`, error);
            }
        }
    }

    // 1. 加载 settings.json
    async function loadSettings() {
        const randomString = Math.random().toString(36).substring(2) + Date.now();
        const settingsUrl = `https://vip.123pan.cn/1843426599/starsea/setting.json?r=${randomString}`;

        try {
            const response = await fetch(settingsUrl);
            if (response.ok) {
                const settings = await response.json();
                return settings;
            } else {
                throw new Error(`无法加载 settings.json，状态码: ${response.status}`);
            }
        } catch (error) {
            console.error('加载 settings.json 失败:', error);
            return null;
        }
    }

    // 2. 主逻辑
    const settings = await loadSettings();
    if (settings) {
        const { static: staticHosts, js: jsPath, css: cssPath } = settings;

        // 构建完整的链接
        const jsUrls = staticHosts.map(host => `https://${host}${jsPath}`);
        const cssUrls = staticHosts.map(host => `https://${host}${cssPath}`);

        // 加载 JS 和 CSS
        await Promise.all([loadJS(jsUrls), loadCSS(cssUrls)]);
    } else {
        console.error('未能加载配置，脚本终止。');
    }

})();
