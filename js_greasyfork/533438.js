// ==UserScript==
// @name         Via 浏览器 404 和网络连接失败页面美化
// @namespace    https://viayoo.com/
// @version      2.1
// @license      MIT
// @description  为 Via 浏览器错误页面注入美化，404页面采用幻境风格，网络连接失败页面采用生命美学与科幻风格，支持日夜模式自动切换
// @author       是小白呀 & Grok & DeepSeek
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533438/Via%20%E6%B5%8F%E8%A7%88%E5%99%A8%20404%20%E5%92%8C%E7%BD%91%E7%BB%9C%E8%BF%9E%E6%8E%A5%E5%A4%B1%E8%B4%A5%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/533438/Via%20%E6%B5%8F%E8%A7%88%E5%99%A8%20404%20%E5%92%8C%E7%BD%91%E7%BB%9C%E8%BF%9E%E6%8E%A5%E5%A4%B1%E8%B4%A5%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        maxAttempts: 20,
        checkInterval: 50,
        injectionTimeout: 2000
    };

    // 页面错误类型检测
    function detectErrorType() {
        const bodyText = document.body?.innerText || '';
        const htmlContent = document.documentElement.innerHTML;
        
        // 404 页面检测标准
        const has404Title = /404/.test(document.title) || /not found/i.test(document.title);
        const has404Body = /404/.test(bodyText) || /not found/i.test(bodyText);
        const hasNginx = /nginx/i.test(bodyText);
        
        const is404 = has404Title && has404Body && hasNginx;
        
        // 网络连接失败页面检测标准
        const isNetworkError = isStrictChromeNetworkError(bodyText, htmlContent);
        
        if (is404 && isNetworkError) return 'both';
        if (is404) return '404';
        if (isNetworkError) return 'network';
        return 'none';
    }

    // Chrome 标准网络错误页面格式验证
    function isStrictChromeNetworkError(bodyText, htmlContent) {
        // 验证标准错误页面文本结构
        const hasExactFormat = 
            /网页无法打开/.test(bodyText) &&
            /位于\s*(https?:\/\/[^\s]+)\s*的网页无法加载，因为：/.test(bodyText) &&
            /net::ERR_[A-Z_]+/.test(bodyText);
        
        // 验证错误页面结构特征
        const isMinimalErrorPage = 
            htmlContent.trim() === '' || 
            document.body?.innerHTML.trim() === '' ||
            (document.body && document.body.children.length <= 3) ||
            /<html[^>]*>\s*<head>\s*<\/head>\s*<body>/.test(htmlContent);
        
        return hasExactFormat && isMinimalErrorPage;
    }

    // 页面错误信息提取
    function extractErrorInfo() {
        const bodyText = document.body?.innerText || '';
        
        // 错误代码提取
        const errorCodeMatch = bodyText.match(/(net::ERR_[A-Z_]+)/);
        
        // 目标地址提取
        let url = '未知地址';
        const urlMatch = bodyText.match(/位于\s*(https?:\/\/[^\s]+)\s*的网页无法加载/);
        if (urlMatch && urlMatch[1]) {
            url = urlMatch[1];
        } else {
            const fallbackUrlMatch = bodyText.match(/(https?:\/\/[^\s]+)/i);
            url = fallbackUrlMatch ? fallbackUrlMatch[0] : (window.location.href || '未知地址');
        }
        
        return {
            errorCode: errorCodeMatch?.[0] || 
                      (document.title.includes('404') ? '404 Not Found' : '网络连接错误'),
            server: /nginx/i.test(bodyText) ? 'nginx' : '',
            url: url
        };
    }

    // 404 错误页面替换（幻境主题）
    function replace404Page() {
        const { errorCode, server } = extractErrorInfo();
        document.documentElement.innerHTML = `
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>迷失幻境</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
                    }
                    body {
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        overflow: hidden;
                        position: relative;
                        margin: 0;
                    }
                    /* 夜间模式（幻境风格） */
                    @media (prefers-color-scheme: dark) {
                        body {
                            background: radial-gradient(ellipse at center, #1a1a3a 0%, #0a0a1a 70%, #000000 100%);
                        }
                        .fog-layer {
                            background: linear-gradient(45deg, rgba(74, 0, 224, 0.1), rgba(0, 210, 255, 0.1));
                            animation: fogFlow 20s infinite linear;
                        }
                        .mist {
                            background: radial-gradient(circle, rgba(74, 0, 224, 0.2) 0%, rgba(74, 0, 224, 0) 70%);
                            filter: blur(30px);
                        }
                        .fragment {
                            border: 1px solid rgba(100, 100, 255, 0.3);
                            box-shadow: 0 0 20px rgba(74, 0, 224, 0.4);
                        }
                        .star-dust {
                            background: #b8b8ff;
                        }
                        .ripple {
                            border: 2px solid rgba(100, 100, 255, 0.2);
                            box-shadow: 0 0 20px rgba(74, 0, 224, 0.3);
                        }
                        .btn-particle {
                            background: #b8b8ff;
                        }
                        h1, .icon, .error-code, .server {
                            background: linear-gradient(135deg, #8e2de2, #4a00e0, #00d2ff);
                            -webkit-background-clip: text;
                            background-clip: text;
                            color: transparent;
                            text-shadow: 0 0 15px rgba(74, 0, 224, 0.5);
                        }
                        p {
                            color: #b8b8ff;
                            text-shadow: 0 0 10px rgba(74, 0, 224, 0.3);
                        }
                        .btn {
                            background: linear-gradient(135deg, #4a00e0, #8e2de2);
                            box-shadow: 0 4px 15px rgba(74, 0, 224, 0.4);
                        }
                        .btn:hover {
                            box-shadow: 0 8px 20px rgba(74, 0, 224, 0.6);
                        }
                    }
                    /* 白天模式（幻境风格） */
                    @media (prefers-color-scheme: light) {
                        body {
                            background: radial-gradient(ellipse at center, #e6e6fa 0%, #f0f0ff 70%, #ffffff 100%);
                        }
                        .fog-layer {
                            background: linear-gradient(45deg, rgba(79, 209, 197, 0.1), rgba(246, 224, 94, 0.1));
                            animation: fogFlow 20s infinite linear;
                        }
                        .mist {
                            background: radial-gradient(circle, rgba(246, 224, 94, 0.3) 0%, rgba(246, 224, 94, 0) 70%);
                            filter: blur(25px);
                        }
                        .fragment {
                            border: 1px solid rgba(79, 209, 197, 0.3);
                            box-shadow: 0 0 20px rgba(246, 224, 94, 0.4);
                        }
                        .star-dust {
                            background: #f6e05e;
                        }
                        .ripple {
                            border: 2px solid rgba(79, 209, 197, 0.2);
                            box-shadow: 0 0 20px rgba(246, 224, 94, 0.3);
                        }
                        .btn-particle {
                            background: #f6e05e;
                        }
                        h1, .icon, .error-code, .server {
                            background: linear-gradient(135deg, #4fd1c5, #f6e05e, #63b3ed);
                            -webkit-background-clip: text;
                            background-clip: text;
                            color: transparent;
                            text-shadow: 0 0 15px rgba(246, 224, 94, 0.5);
                        }
                        p {
                            color: #2d3748;
                            text-shadow: 0 0 10px rgba(246, 224, 94, 0.3);
                        }
                        .btn {
                            background: linear-gradient(135deg, #4fd1c5, #f6e05e);
                            box-shadow: 0 4px 15px rgba(79, 209, 197, 0.3);
                        }
                        .btn:hover {
                            box-shadow: 0 8px 20px rgba(79, 209, 197, 0.5);
                        }
                    }
                    /* 幻境视觉元素 */
                    .fog-layer {
                        position: absolute;
                        width: 200%;
                        height: 200%;
                        top: -50%;
                        left: -50%;
                        opacity: 0.3;
                        z-index: 0;
                    }
                    .mist {
                        position: absolute;
                        width: 200px;
                        height: 200px;
                        border-radius: 50%;
                        animation: float 12s infinite ease-in-out;
                        opacity: 0.5;
                        z-index: 1;
                    }
                    .mist:nth-child(2) {
                        top: 20%;
                        left: 30%;
                        animation-delay: 0s;
                    }
                    .mist:nth-child(3) {
                        top: 50%;
                        left: 70%;
                        width: 150px;
                        height: 150px;
                        animation-delay: 4s;
                    }
                    .mist:nth-child(4) {
                        top: 80%;
                        left: 40%;
                        width: 180px;
                        height: 180px;
                        animation-delay: 8s;
                    }
                    .fragment {
                        position: absolute;
                        background: transparent;
                        opacity: 0.6;
                        animation: float 15s infinite ease-in-out, rotate 10s infinite linear;
                        z-index: 2;
                    }
                    .fragment.triangle {
                        width: 0;
                        height: 0;
                        border-left: 20px solid transparent;
                        border-right: 20px solid transparent;
                        border-bottom: 35px solid rgba(255, 255, 255, 0.2);
                    }
                    .fragment.pentagon {
                        width: 30px;
                        height: 30px;
                        clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
                        background: rgba(255, 255, 255, 0.2);
                    }
                    .star-dust {
                        position: absolute;
                        width: 2px;
                        height: 2px;
                        border-radius: 50%;
                        animation: drift 6s infinite ease-in-out;
                        animation-delay: calc(var(--delay) * 1s);
                    }
                    .ripple {
                        position: absolute;
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        opacity: 0;
                        animation: ripple 5s infinite ease-out;
                        z-index: 1;
                    }
                    .ripple:nth-child(2) { animation-delay: 0s; }
                    .ripple:nth-child(3) { animation-delay: 1.5s; }
                    .ripple:nth-child(4) { animation-delay: 3s; }
                    .btn-particle {
                        position: absolute;
                        width: 3px;
                        height: 3px;
                        border-radius: 50%;
                        animation: orbit 4s infinite ease-in-out;
                        z-index: 3;
                    }
                    .content {
                        position: relative;
                        z-index: 3;
                        text-align: center;
                        animation: fadeIn 1s ease-out;
                    }
                    .icon-wrapper {
                        position: relative;
                        display: inline-block;
                    }
                    .error-code, .server {
                        font-size: 18px;
                        margin: 8px 0;
                        animation: float 6s infinite ease-in-out;
                    }
                    .server {
                        font-size: 14px;
                    }
                    h1 {
                        font-size: 28px;
                        font-weight: 600;
                        margin: 0 0 12px;
                        animation: gradientShift 8s ease infinite;
                        background-size: 200% 200%;
                    }
                    p {
                        font-size: 16px;
                        line-height: 1.5;
                        margin: 0 0 20px;
                    }
                    .btn-wrapper {
                        position: relative;
                        display: inline-block;
                    }
                    .btn {
                        padding: 10px 24px;
                        font-size: 14px;
                        font-weight: 500;
                        color: #ffffff;
                        border: none;
                        border-radius: 30px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        animation: pulse 2s infinite;
                    }
                    .btn:hover {
                        transform: translateY(-3px);
                    }
                    .icon {
                        font-size: 48px;
                        margin-bottom: 16px;
                        animation: breathe 3s infinite ease-in-out;
                    }
                    @keyframes fogFlow {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    @keyframes float {
                        0% { transform: translate(0, 0); }
                        33% { transform: translate(5px, 10px); }
                        66% { transform: translate(-5px, -10px); }
                        100% { transform: translate(0, 0); }
                    }
                    @keyframes rotate {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes drift {
                        0% { transform: translate(0, 0); opacity: 0.3; }
                        50% { transform: translate(20px, -10px); opacity: 1; }
                        100% { transform: translate(0, 0); opacity: 0.3; }
                    }
                    @keyframes ripple {
                        0% { width: 100px; height: 100px; opacity: 0.5; transform: translate(-50%, -50%); }
                        100% { width: 300px; height: 300px; opacity: 0; transform: translate(-50%, -50%); }
                    }
                    @keyframes orbit {
                        0% { transform: translate(0, 0); opacity: 0.5; }
                        50% { transform: translate(15px, 10px); opacity: 1; }
                        100% { transform: translate(0, 0); opacity: 0.5; }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes breathe {
                        0% { opacity: 0.7; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.2); }
                        100% { opacity: 0.7; transform: scale(1); }
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                    @keyframes gradientShift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    @media (max-width: 600px) {
                        h1 {
                            font-size: 24px;
                        }
                        p {
                            font-size: 14px;
                        }
                        .btn {
                            padding: 8px 20px;
                            font-size: 13px;
                        }
                        .icon {
                            font-size: 40px;
                        }
                        .error-code {
                            font-size: 16px;
                        }
                        .server {
                            font-size: 12px;
                        }
                        .fragment.triangle {
                            border-left: 15px solid transparent;
                            border-right: 15px solid transparent;
                            border-bottom: 25px solid rgba(255, 255, 255, 0.2);
                        }
                        .fragment.pentagon {
                            width: 20px;
                            height: 20px;
                        }
                        .ripple {
                            width: 80px;
                            height: 80px;
                        }
                        @keyframes ripple {
                            0% { width: 80px; height: 80px; opacity: 0.5; transform: translate(-50%, -50%); }
                            100% { width: 200px; height: 200px; opacity: 0; transform: translate(-50%, -50%); }
                        }
                    }
                </style>
            </head>
            <body>
                <!-- 流动迷雾层 -->
                <div class="fog-layer"></div>
                <!-- 迷雾效果 -->
                <div class="mist"></div>
                <div class="mist"></div>
                <div class="mist"></div>
                <!-- 幻境碎片 -->
                <div class="fragment triangle" style="top: 15%; left: 20%; animation-delay: 0s;"></div>
                <div class="fragment pentagon" style="top: 25%; left: 80%; animation-delay: 2s;"></div>
                <div class="fragment triangle" style="top: 70%; left: 30%; animation-delay: 4s;"></div>
                <div class="fragment pentagon" style="top: 60%; left: 85%; animation-delay: 6s;"></div>
                <div class="fragment triangle" style="top: 40%; left: 10%; animation-delay: 8s;"></div>
                <div class="fragment pentagon" style="top: 20%; left: 50%; animation-delay: 10s;"></div>
                <div class="fragment triangle" style="top: 80%; left: 70%; animation-delay: 12s;"></div>
                <!-- 中心涟漪 -->
                <div class="ripple" style="top: 50%; left: 50%;"></div>
                <div class="ripple" style="top: 50%; left: 50%;"></div>
                <div class="ripple" style="top: 50%; left: 50%;"></div>
                <!-- 中心内容 -->
                <div class="content">
                    <div class="icon-wrapper">
                        <div class="icon">✨</div>
                        <div class="btn-particle" style="animation-delay: 0s;"></div>
                        <div class="btn-particle" style="animation-delay: 1s;"></div>
                        <div class="btn-particle" style="animation-delay: 2s;"></div>
                    </div>
                    <h1>迷失幻境</h1>
                    <div class="error-code">${errorCode}</div>
                    <div class="server">${server}</div>
                    <p>路径已断，迷雾笼罩，尝试返回现实吧。</p>
                    <div class="btn-wrapper">
                        <button class="btn" onclick="history.back()">返回现实</button>
                        <div class="btn-particle" style="animation-delay: 0s;"></div>
                        <div class="btn-particle" style="animation-delay: 1s;"></div>
                        <div class="btn-particle" style="animation-delay: 2s;"></div>
                    </div>
                </div>
                <script>
                    // 随机星尘粒子
                    function addStarDust() {
                        for (let i = 0; i < 50; i++) {
                            const dust = document.createElement('div');
                            dust.className = 'star-dust';
                            dust.style.left = Math.random() * 100 + '%';
                            dust.style.top = Math.random() * 100 + '%';
                            dust.style.setProperty('--delay', Math.random() * 4);
                            document.body.appendChild(dust);
                        }
                    }
                    addStarDust();
                    // 监听主题切换
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                        document.querySelectorAll('.star-dust').forEach(dust => dust.remove());
                        addStarDust();
                    });
                </script>
            </body>
            </html>
        `;
    }

    // 网络连接失败页面替换（科幻主题）
    function replaceConnectionErrorPage() {
        const { errorCode, url } = extractErrorInfo();
        document.documentElement.innerHTML = `
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>连接中断</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
                    }
                    body {
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: #e0e0ff;
                        overflow: hidden;
                        position: relative;
                        margin: 0;
                    }
                    /* 夜间模式（科幻风格） */
                    @media (prefers-color-scheme: dark) {
                        body {
                            background: radial-gradient(ellipse at center, #1a1a3a 0%, #0a0a1a 70%, #000000 100%);
                        }
                        .stars {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: transparent url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="0.5" fill="white" opacity="0.8"/></svg>') repeat;
                            z-index: 1;
                        }
                        .star {
                            position: absolute;
                            width: 2px;
                            height: 2px;
                            background: white;
                            border-radius: 50%;
                            animation: twinkle 4s infinite;
                            animation-delay: calc(var(--delay) * 1s);
                        }
                        .big-dipper {
                            position: fixed;
                            top: 10%;
                            left: 5%;
                            width: 100px;
                            height: 60px;
                            z-index: 1;
                        }
                        .big-dipper-star {
                            position: absolute;
                            width: 3px;
                            height: 3px;
                            background: #b8b8ff;
                            border-radius: 50%;
                            animation: twinkle 3s infinite;
                        }
                        .big-dipper-star:nth-child(1) { left: 20px; top: 10px; }
                        .big-dipper-star:nth-child(2) { left: 35px; top: 15px; }
                        .big-dipper-star:nth-child(3) { left: 50px; top: 20px; }
                        .big-dipper-star:nth-child(4) { left: 65px; top: 25px; }
                        .big-dipper-star:nth-child(5) { left: 55px; top: 40px; }
                        .big-dipper-star:nth-child(6) { left: 45px; top: 50px; }
                        .big-dipper-star:nth-child(7) { left: 35px; top: 60px; }
                        .tao-flow {
                            background: radial-gradient(circle, rgba(74, 0, 224, 0.3) 0%, rgba(74, 0, 224, 0) 70%);
                            filter: blur(20px);
                        }
                        .container {
                            background: rgba(10, 10, 30, 0.8);
                            backdrop-filter: blur(10px);
                            border: 1px solid rgba(100, 100, 255, 0.2);
                            box-shadow: 0 8px 30px rgba(74, 0, 224, 0.3);
                        }
                        h1, .icon {
                            background: linear-gradient(135deg, #8e2de2, #4a00e0, #00d2ff);
                            -webkit-background-clip: text;
                            background-clip: text;
                            color: transparent;
                        }
                        p {
                            color: #b8b8ff;
                        }
                        .btn {
                            background: linear-gradient(135deg, #4a00e0, #8e2de2);
                            box-shadow: 0 4px 15px rgba(74, 0, 224, 0.4);
                        }
                        .btn:hover {
                            box-shadow: 0 8px 20px rgba(74, 0, 224, 0.6);
                        }
                        .failed-url {
                            background: rgba(20, 20, 50, 0.5);
                            color: #b8b8ff;
                        }
                        .error-code {
                            color: #8888cc;
                        }
                    }
                    /* 白天模式（生命美学风格） */
                    @media (prefers-color-scheme: light) {
                        body {
                            background: radial-gradient(ellipse at center, #e8f5e9 0%, #f1f8e9 70%, #ffffff 100%);
                        }
                        .stars {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: transparent url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="0.5" fill="#c8e6c9" opacity="0.4"/></svg>') repeat;
                            z-index: 1;
                            animation: twinkle 6s infinite alternate;
                        }
                        .tao-flow {
                            background: radial-gradient(circle, rgba(165, 214, 167, 0.3) 0%, rgba(255, 245, 157, 0) 70%);
                            filter: blur(15px);
                        }
                        .tao-flow:nth-child(2) {
                            top: 20%;
                            left: 50%;
                            width: 150px;
                            height: 150px;
                            animation-delay: 3s;
                            transform: translateX(-50%);
                        }
                        .tao-flow:nth-child(3) {
                            top: 50%;
                            left: 50%;
                            width: 180px;
                            height: 180px;
                            animation-delay: 6s;
                            transform: translateX(-50%);
                        }
                        .container {
                            background: rgba(255, 255, 255, 0.85);
                            backdrop-filter: blur(12px);
                            border: 1px solid rgba(165, 214, 167, 0.3);
                            box-shadow: 0 8px 30px rgba(165, 214, 167, 0.2);
                        }
                        h1, .icon {
                            background: linear-gradient(135deg, #a5d6a7, #fff59d, #aed581);
                            -webkit-background-clip: text;
                            background-clip: text;
                            color: transparent;
                        }
                        p {
                            color: #37474f;
                        }
                        .btn {
                            background: linear-gradient(135deg, #a5d6a7, #fff59d);
                            box-shadow: 0 4px 15px rgba(165, 214, 167, 0.3);
                        }
                        .btn:hover {
                            box-shadow: 0 8px 20px rgba(165, 214, 167, 0.5);
                        }
                        .failed-url {
                            background: rgba(240, 244, 195, 0.5);
                            color: #455a64;
                        }
                        .error-code {
                            color: #78909c;
                        }
                    }
                    /* 通用样式（科幻风格） */
                    .tao-flow {
                        position: absolute;
                        width: 200px;
                        height: 200px;
                        border-radius: 50%;
                        animation: float 12s infinite ease-in-out;
                        opacity: 0.6;
                        z-index: 2;
                    }
                    .container {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 3;
                        text-align: center;
                        padding: 24px;
                        border-radius: 16px;
                        width: 90%;
                        max-width: 400px;
                        animation: fadeIn 0.6s ease-out;
                    }
                    h1 {
                        font-size: 26px;
                        font-weight: 600;
                        margin: 0 0 12px;
                        animation: gradientShift 8s ease infinite;
                        background-size: 200% 200%;
                    }
                    p {
                        font-size: 15px;
                        line-height: 1.5;
                        margin: 0 0 20px;
                    }
                    .btn {
                        display: inline-block;
                        padding: 10px 24px;
                        font-size: 14px;
                        font-weight: 500;
                        color: #ffffff;
                        border: none;
                        border-radius: 30px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    .btn:hover {
                        transform: translateY(-3px);
                    }
                    .failed-url {
                        font-size: 13px;
                        margin: 16px 0;
                        padding: 8px 12px;
                        border-radius: 8px;
                        word-break: break-all;
                    }
                    .error-code {
                        font-size: 12px;
                        margin-top: 12px;
                    }
                    .icon {
                        font-size: 48px;
                        margin-bottom: 16px;
                        animation: pulse 2s infinite;
                    }
                    @keyframes twinkle {
                        0% { opacity: 0.3; }
                        50% { opacity: 1; }
                        100% { opacity: 0.3; }
                    }
                    @keyframes float {
                        0% { transform: translate(0, 0); }
                        33% { transform: translate(30px, 30px); }
                        66% { transform: translate(-30px, -20px); }
                        100% { transform: translate(0, 0); }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                    @keyframes gradientShift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    @media (max-width: 600px) {
                        .container {
                            padding: 16px;
                            width: 90%;
                            max-width: 340px;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        h1 {
                            font-size: 22px;
                        }
                        p {
                            font-size: 14px;
                        }
                        .btn {
                            padding: 8px 20px;
                            font-size: 13px;
                        }
                        .icon {
                            font-size: 40px;
                        }
                        .big-dipper {
                            width: 80px;
                            height: 48px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="stars"></div>
                <div class="big-dipper">
                    <div class="big-dipper-star"></div>
                    <div class="big-dipper-star"></div>
                    <div class="big-dipper-star"></div>
                    <div class="big-dipper-star"></div>
                    <div class="big-dipper-star"></div>
                    <div class="big-dipper-star"></div>
                    <div class="big-dipper-star"></div>
                </div>
                <div class="tao-flow"></div>
                <div class="tao-flow"></div>
                <div class="container">
                    <div class="icon">⚡️</div>
                    <h1>连接中断</h1>
                    <p>无法感知星辰脉动，请检查网络或稍后重试。</p>
                    <button class="btn" onclick="window.location.reload()">重新连接</button>
                    <div class="failed-url">目标地址: ${url}</div>
                    <div class="error-code">错误代码: ${errorCode}</div>
                </div>
                <script>
                    // 随机星星闪烁
                    function addRandomStars() {
                        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                            for (let i = 0; i < 20; i++) {
                                const star = document.createElement('div');
                                star.className = 'star';
                                star.style.left = Math.random() * 100 + 'vw';
                                star.style.top = Math.random() * 100 + 'vh';
                                star.style.setProperty('--delay', Math.random() * 4);
                                document.body.appendChild(star);
                            }
                        }
                    }
                    addRandomStars();
                    // 监听主题切换
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                        document.querySelectorAll('.star').forEach(star => star.remove());
                        addRandomStars();
                    });
                </script>
            </body>
            </html>
        `;
    }

    // 脚本初始化流程
    function initialize() {
        let injected = false;
        let attempts = 0;
        
        const tryInject = () => {
            if (injected) return true;
            
            const errorType = detectErrorType();
            if (errorType === 'both') return true;
            
            if (errorType === '404') {
                replace404Page();
                injected = true;
                return true;
            }
            
            if (errorType === 'network') {
                replaceConnectionErrorPage();
                injected = true;
                return true;
            }
            
            return false;
        };

        // 立即执行检测
        if (tryInject()) return;

        // 早期检测循环
        const interval = setInterval(() => {
            if (tryInject() || attempts >= CONFIG.maxAttempts) {
                clearInterval(interval);
            }
            attempts++;
        }, CONFIG.checkInterval);

        // 检测超时保护
        setTimeout(() => clearInterval(interval), CONFIG.injectionTimeout);

        // DOM 变化监听
        const observer = new MutationObserver(() => tryInject());
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // DOM 加载完成检测
        document.addEventListener('DOMContentLoaded', () => tryInject(), { 
            once: true 
        });
    }

    // 脚本启动
    initialize();
})();