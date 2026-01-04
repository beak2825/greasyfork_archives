// ==UserScript==
// @name        Geely VDI Assistant
// @namespace   https://github.com/zcteo
// @version     1.0.7
// @description 自动填写 Geely VDI 一次性验证码。使用唯一设备密钥加密 TOTP 密钥，并存储在 localStorage, 支持通过菜单重新输入 TOTP 密钥。仅供学习研究使用，作者不对该脚本产生的任何行为负责。
// @author      zcteo.cn@gmail.com, www@cnzxo.com
// @include     https://*vdi.geely.com/*
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @license     GPL-3.0-only
// @copyright   2025, https://github.com/zcteo
// @downloadURL https://update.greasyfork.org/scripts/531320/Geely%20VDI%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/531320/Geely%20VDI%20Assistant.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    // 防止插件和油猴脚本重复运行
    if (document.documentElement.dataset.__geely_vdi_totp_running__ === "true") {
        console.log("检测到 TOTP 插件已运行，该脚本不执行！");
        return;
    }
    document.documentElement.dataset.__geely_vdi_totp_running__ = "true";
    const SITE_KEY = "geely_vdi_totp_encrypted";      // 存储加密 TOTP 密钥的键
    const KEY_STORAGE = "geely_vdi_device_encryption_key"; // 存储设备密钥的键
    const USER_KEY = "geely_vdi_username"; // 存储用户名的键
    const PASS_KEY = "geely_vdi_password"; // 存储密码的键

    // 判断运行环境（Chrome 扩展 vs 油猴）
    const isTamperMonkey = typeof GM_registerMenuCommand !== "undefined";
    const isChromeExtension = typeof chrome !== "undefined" && chrome.storage;

    // **存储适配层**
    async function storageGet(key) {
        if (isChromeExtension) {
            const result = await chrome.storage.local.get(key);
            return result[key];
        } else {
            return GM_getValue(key, null);
        }
    }

    async function storageSet(key, value) {
        if (isChromeExtension) {
            await chrome.storage.local.set({ [key]: value });
        } else {
            GM_setValue(key, value);
        }
    }

    // 获取或生成设备密钥（用于加密 TOTP 密钥）
    async function getDeviceKeyForEncryption() {
        let stored = await storageGet(KEY_STORAGE);
        if (stored) {
            const keyArray = stored; // 已存储的为数组
            return await crypto.subtle.importKey(
                "raw",
                new Uint8Array(keyArray),
                { name: "AES-GCM" },
                true,
                ["encrypt", "decrypt"]
            );
        } else {
            console.log("生成新设备密钥...");
            const key = await crypto.subtle.generateKey(
                { name: "AES-GCM", length: 256 },
                true,
                ["encrypt", "decrypt"]
            );
            const exportedKey = await crypto.subtle.exportKey("raw", key);
            await storageSet(KEY_STORAGE, Array.from(new Uint8Array(exportedKey)));
            return key;
        }
    }

    // 获取设备密钥（用于解密时，不生成新密钥）
    async function getDeviceKeyForDecryption() {
        const stored = await storageGet(KEY_STORAGE);
        if (!stored) {
            throw new Error("设备密钥不存在，请先重新输入 TOTP 密钥");
        }
        const keyArray = stored;
        return await crypto.subtle.importKey(
            "raw",
            new Uint8Array(keyArray),
            { name: "AES-GCM" },
            false,
            ["decrypt"]
        );
    }

    // 加密数据，返回包含 IV 与密文的 JSON 字符串
    async function encrypt(secret) {
        const key = await getDeviceKeyForEncryption();
        const encoder = new TextEncoder();
        const iv = crypto.getRandomValues(new Uint8Array(12)); // 随机生成 IV

        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encoder.encode(secret)
        );

        return JSON.stringify({
            iv: Array.from(iv),
            data: Array.from(new Uint8Array(encrypted))
        });
    }

    // 解密
    async function decrypt(encryptedData) {
        try {
            const key = await getDeviceKeyForDecryption();
            const { iv, data } = JSON.parse(encryptedData);
            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: new Uint8Array(iv) },
                key,
                new Uint8Array(data)
            );
            return new TextDecoder().decode(decrypted);
        } catch (e) {
            console.error("❌ 解密失败", e);
            return null;
        }
    }

    // Base32 转 十六进制
    function base32ToHex(base32) {
        const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let bits = "";
        let hex = "";
        for (let i = 0; i < base32.length; i++) {
            let val = base32Chars.indexOf(base32[i].toUpperCase());
            bits += val.toString(2).padStart(5, '0');
        }
        for (let i = 0; i + 4 <= bits.length; i += 4) {
            hex += parseInt(bits.substring(i, i + 4), 2).toString(16);
        }
        return hex;
    }

    // 使用 HMAC-SHA1 计算 OTP
    async function hmacSha1(key, time) {
        const keyData = new Uint8Array(key.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        const timeData = new Uint8Array(time.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        const importedKey = await crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "HMAC", hash: { name: "SHA-1" } },
            false,
            ["sign"]
        );
        const signature = await crypto.subtle.sign("HMAC", importedKey, timeData);
        const hmac = new Uint8Array(signature);
        const offset = hmac[hmac.length - 1] & 0xf;
        const otp = ((hmac[offset] & 0x7f) << 24 |
            (hmac[offset + 1] & 0xff) << 16 |
            (hmac[offset + 2] & 0xff) << 8 |
            (hmac[offset + 3] & 0xff)) % 1000000;
        return otp.toString().padStart(6, '0');
    }

    // 根据 TOTP 密钥生成 OTP
    async function generateTOTP(secret) {
        const key = base32ToHex(secret);
        const time = Math.floor(Date.now() / 1000 / 30).toString(16).padStart(16, '0');
        return await hmacSha1(key, time);
    }

    // 手动输入 TOTP 密钥（Base32 编码），并存储加密后的数据
    async function inputKey() {
        const totpKey = prompt("🔑 请输入您的 TOTP 密钥（Base32 编码）：");
        if (!totpKey) {
            alert("❌ 未输入密钥，操作终止！");
            return false;
        }
        let encryptedData = await encrypt(totpKey);
        await storageSet(SITE_KEY, encryptedData);
        alert("✅ TOTP 密钥已加密存储！");
        return true;
    }


    // 自动填写信息，每秒更新 OTP 并填入输入框
    async function fillInfo(userInput, passInput) {
        let encryptedData = await storageGet(SITE_KEY);
        if (!encryptedData) {
            const success = await inputKey();
            if (!success) return;
            encryptedData = await storageGet(SITE_KEY);
        }
        let userData = await storageGet(USER_KEY);
        if (userData) {
            userData = await decrypt(userData);
            userInput.value = userData;
        }
        let passData = await storageGet(PASS_KEY);
        if (passData) {
            passData = await decrypt(passData);
            passInput.value = passData;
        }
        const totpKey = await decrypt(encryptedData);
        if (!totpKey) return alert("❌ 解密失败，无法生成 TOTP！");
        const fill = async () => {
            const otpInput = document.getElementById("passwd1");
            const otpValue = await generateTOTP(totpKey);
            otpInput.value = otpValue;
            if (isTamperMonkey) {
                console.log("🔢 TamperMonkey 生成 OTP:", otpValue);
            } else {
                console.log("🔢 ChromeExtension 生成 OTP:", otpValue);
            }
        };
        await fill();
        setInterval(fill, 1000);
    }

    // 保存用户信息
    async function saveUserInfo(userInput, passInput) {
        console.log("🔢 已保存用户信息");
        if (userInput && passInput) {
            if (userInput.value !== "" && passInput.value !== "") {
                const userData = await encrypt(userInput.value);
                const passData = await encrypt(passInput.value);
                await storageSet(USER_KEY, userData);
                await storageSet(PASS_KEY, passData);
            }
        }
        return true;
    }

    // 等待页面加载完成
    async function waitForLoad() {
        let attempts = 0;
        const interval = setInterval(async () => {
            const userInput = document.getElementById("login");
            const passInput = document.getElementById("passwd");
            const otpInput = document.getElementById("passwd1");
            const loginButton = document.getElementById("Logon");
            if (userInput && passInput && otpInput && loginButton) {
                clearInterval(interval);
                // 监听表单提交事件
                document.addEventListener("click", async (e) => {
                    if (e.target.id === "Logon") {
                        await saveUserInfo(
                            document.getElementById("login"),
                            document.getElementById("passwd")
                        );
                    }
                });
                await fillInfo(userInput, passInput);
                if (userInput.value !== "" && passInput.value !== "" && otpInput.value !== "") {
                    loginButton.click();
                }
            } else if (attempts > 10) {
                clearInterval(interval);
                console.warn("❌ 超时");
            }
            attempts++;
        }, 500);
    }

    if (isTamperMonkey) {
        GM_registerMenuCommand("重新输入 TOTP 密钥", inputKey);
    } else {
        window.addEventListener("resetTOTP", inputKey);
    }
    // 页面加载完毕后自动执行 TOTP 填充
    if (window.location.pathname === '/logon/LogonPoint/tmindex.html') {
        window.addEventListener("load", waitForLoad);
    }
})();
