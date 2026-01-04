// ==UserScript==
// @name         Amazon 自动OTP
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  即时生成 TOTP，无需等待完整周期，检测输入框后立即填充并显示 OTP。
// @match        *://*/*mfa.arb.key=arb
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/518561/Amazon%20%E8%87%AA%E5%8A%A8OTP.user.js
// @updateURL https://update.greasyfork.org/scripts/518561/Amazon%20%E8%87%AA%E5%8A%A8OTP.meta.js
// ==/UserScript==
/* global CryptoJS */

window.onload = async () => {
    'use strict';

    const secret = 'MB6MLWWU5T4WM7FH4TKTS27WSHILFI5K6YZRUQTLWWZPCTPOWA5Q'; // 从二维码解析的密钥
    const otpPeriod = 30; // TOTP 周期（默认 30 秒）
    let initialized = false;

    // 创建右上角显示容器
    function createDisplay() {
        const container = document.createElement('div');
        container.id = 'otp-container';
        container.style = `
            position: fixed; top: 10px; right: 10px; padding: 10px;
            background: rgba(0, 0, 0, 0.8); color: #fff; font-size: 14px;
            z-index: 10000; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        `;
        container.innerHTML = `
            <div id="otp-text">OTP: 生成中...</div>
            <div id="progress-bar" style="width: 100%; height: 5px; background: rgba(255, 255, 255, 0.3); border-radius: 5px; margin-top: 5px;">
                <div id="progress" style="height: 100%; width: 0%; background: #4caf50; border-radius: 5px;"></div>
            </div>
        `;
        document.body.appendChild(container);
    }

    // 更新右上角的 OTP 显示
    function updateDisplay(otp) {
        const otpText = document.getElementById('otp-text');
        if (otpText) {
            otpText.innerText = `当前 OTP: ${otp}`;
        }
    }

    // 更新进度条
    function updateProgressBar() {
        const epoch = Math.floor(Date.now() / 1000);
        const elapsed = epoch % otpPeriod;
        const percentage = (elapsed / otpPeriod) * 100;
        const progress = document.getElementById('progress');
        if (progress) {
            progress.style.width = `${percentage}%`;
        }
    }

    // Base32 转为十六进制
    function base32ToHex(base32) {
        const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let bits = "";

        for (let char of base32) {
            const val = base32chars.indexOf(char.toUpperCase());
            bits += val.toString(2).padStart(5, '0');
        }

        let hex = "";
        for (let i = 0; i + 4 <= bits.length; i += 4) {
            hex += parseInt(bits.substr(i, 4), 2).toString(16);
        }

        return hex;
    }

    // HMAC-SHA1 实现
    function hmacSHA1(key, message) {
        const cryptoKey = CryptoJS.enc.Hex.parse(key);
        const cryptoMessage = CryptoJS.enc.Hex.parse(message);
        const hash = CryptoJS.HmacSHA1(cryptoMessage, cryptoKey);
        return hash.toString(CryptoJS.enc.Hex);
    }

    // 生成 TOTP
    function generateTOTP(secret) {
        const key = base32ToHex(secret);
        const epoch = Math.floor(Date.now() / 1000);
        const timeHex = Math.floor(epoch / otpPeriod).toString(16).padStart(16, '0');

        const hash = hmacSHA1(key, timeHex);

        const offset = parseInt(hash.slice(-1), 16);
        const binary =
            ((parseInt(hash.substr(offset * 2, 2), 16) & 0x7f) << 24) |
            (parseInt(hash.substr(offset * 2 + 2, 2), 16) << 16) |
            (parseInt(hash.substr(offset * 2 + 4, 2), 16) << 8) |
            parseInt(hash.substr(offset * 2 + 6, 2), 16);

        return (binary % 1e6).toString().padStart(6, '0');
    }

    // 填充 OTP 到输入框并更新显示
    function fillOTPAndUpdateDisplay() {
        const otp = generateTOTP(secret);
        const otpInput = document.getElementById('auth-mfa-otpcode');
        if (otpInput) {
            otpInput.value = otp; // 自动填充 OTP
        }
        updateDisplay(otp); // 更新右上角显示
    }

    // 初始化脚本逻辑
    function initialize() {
        if (initialized) return; // 避免重复初始化
        initialized = true;

        createDisplay(); // 创建右上角显示窗口
        fillOTPAndUpdateDisplay(); // 立即生成并填充 OTP
        setInterval(() => {
            fillOTPAndUpdateDisplay(); // 每 30 秒生成和填充新的 OTP
        }, otpPeriod * 1000);
        setInterval(updateProgressBar, 1000); // 每秒更新进度条
    }

    // 使用 MutationObserver 检测 DOM 变化
    function observeDOM() {
        const observer = new MutationObserver(() => {
            const otpInput = document.getElementById('auth-mfa-otpcode');
            if (otpInput && !initialized) {
                console.log("检测到 OTP 输入框，开始初始化...");
                initialize(); // 初始化显示和填充逻辑
                observer.disconnect(); // 只检测一次，完成后断开观察
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 加载 CryptoJS 库
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js";
    script.onload = () => {
        console.log("CryptoJS 加载成功，开始监听 DOM...");
        observeDOM(); // 监听 DOM 变化
    };
    script.onerror = () => {
        console.error("CryptoJS 加载失败，请检查网络连接。");
    };
    document.head.appendChild(script);

    // 定期检查 OTP 输入框是否存在
    const checkInterval = setInterval(() => {
        const otpInput = document.getElementById('auth-mfa-otpcode');
        if (otpInput) {
            console.log("检测到 OTP 输入框，开始初始化...");
            clearInterval(checkInterval); // 清除定时器
            initialize(); // 启动初始化逻辑
        }
    }, 1000); // 每秒检查一次
};
