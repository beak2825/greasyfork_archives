// ==UserScript==
// @name        iOS Eplus UA Workaround
// @name:zh-CN  iOS Eplus UA 访问脚本
// @namespace   https://greasyfork.org/zh-CN/scripts/497330-ios-eplus-ua-workaround
// @version     1.1
// @description Attempts to access eplus.jp on iOS by re-fetching the page with a desktop User-Agent.
// @description:zh-CN 在iOS环境下，通过使用桌面版UA重新获取页面内容，尝试访问eplus.jp。
// @author      Gemini
// @match       *://live.eplus.jp/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/540207/iOS%20Eplus%20UA%20Workaround.user.js
// @updateURL https://update.greasyfork.org/scripts/540207/iOS%20Eplus%20UA%20Workaround.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 由于是在 document-start 阶段执行，此时 DOM 可能还未完全形成
    // 我们需要确保我们的代码在文档元素可用后立即执行
    if (document.documentElement) {
        run();
    } else {
        // 如果文档元素还不可用，我们监听 DOMContentLoaded 事件
        // 但这可能太晚，所以这是一个备用方案
        window.addEventListener('DOMContentLoaded', run, { once: true });
    }

    function run() {
        // 1. 立即停止原始页面的加载，并显示提示信息
        // 这一步至关重要，防止浏览器用原始的 iOS UA 继续加载
        try {
            window.stop();
        } catch (e) {
            console.warn("window.stop() is not available.", e);
        }

        document.documentElement.innerHTML = `
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>正在加载...</title>
            </head>
            <body style="background-color:#1c1c1e; color:white; font-family:-apple-system, sans-serif; text-align:center; padding: 20vh 10vw;">
                <h1 style="font-size: 1.5em;">正在尝试使用桌面版UA加载</h1>
                <p style="font-size: 1em; color: #888;">请稍候，此过程可能需要几秒钟...</p>
            </body>
        `;

        const targetUrl = window.location.href;
        const edgeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.2572.58';

        // 2. 使用 fetch API 在后台发送带有伪造 UA 的请求
        fetch(targetUrl, {
            headers: {
                'User-Agent': edgeUA
            },
            // 在iOS上，某些网络环境可能需要明确的凭证策略
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                // 如果服务器返回错误（如 403 Forbidden），也显示出来
                throw new Error(`服务器响应错误: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            // 3. 用获取到的 HTML 内容完整替换当前页面
            // 这种方法可以确保新页面中的 <script> 标签能够被执行
            document.open();
            document.write(html);
            document.close();
        })
        .catch(error => {
            // 如果过程中出现任何错误，显示错误信息
            console.error('Eplus UA Workaround Error:', error);
            document.body.innerHTML = `
                <div style="color:#ff453a;">
                    <h1>加载失败</h1>
                    <p>无法使用自定义UA获取页面内容。</p>
                    <p style="font-size: 0.8em; color: #888; word-wrap: break-word;"><b>错误详情:</b> ${error.message}</p>
                    <p style="margin-top: 30px; font-size: 0.9em;">这可能是由于网络问题或网站的保护机制。您可以尝试刷新，或在桌面设备上访问。</p>
                </div>
            `;
        });
    }
})();