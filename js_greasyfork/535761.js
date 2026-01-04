// ==UserScript==
// @name        cryptoHook
// @namespace   qchook
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      cthousand
// @license MIT
// @description 2025/5/12 16:35:05
// @downloadURL https://update.greasyfork.org/scripts/535761/cryptoHook.user.js
// @updateURL https://update.greasyfork.org/scripts/535761/cryptoHook.meta.js
// ==/UserScript==

// Hook 加密方法
!function () {
    // 保存原始的解密方法
    const originalEncrypt = window.crypto.subtle.encrypt;
    window.crypto.subtle.encrypt = async function (algorithm, key, data) {
        console.log("检测到加密调用");
        console.log("Algorithm:", algorithm);

        // 根据算法名称区分加密类型
        console.log("加密算法:", algorithm.name);

        // 如果是 AES 加密,打印更多详细信息
        if (algorithm.name.startsWith("AES")) {
            console.log("AES 加密详细信息：");
            debugger
            // 打印初始化向量（IV,16进制）
            if (algorithm.iv) {
                console.log("AES 初始化向量（IV,16进制）:", arrayBufferToHex(algorithm.iv));
            }

            // 打印加密的明文（UTF-8）
            console.log("AES 加密的明文（UTF-8）:", new TextDecoder().decode(data));

            // 调用原始的加密方法
            const encryptedData = await originalEncrypt.apply(this, arguments);

            // 打印加密的密文（Base64）
            console.log("AES 加密的密文（Base64）:", arrayBufferToBase64(encryptedData));

            return encryptedData;
        }

        // 调用原始的加密方法
        return originalEncrypt.apply(this, arguments);
    };

    // 保存原始的解密方法
    const originalDecrypt = window.crypto.subtle.decrypt;
    // Hook 解密方法
    window.crypto.subtle.decrypt = async function (algorithm, key, data) {
        console.log("检测到解密调用");
        console.log("Algorithm:", algorithm);

        // 根据算法名称区分解密类型
        console.log("解密算法:", algorithm.name);

        // 如果是 AES 解密，打印更多详细信息
        if (algorithm.name.startsWith("AES")) {
            console.log("AES 解密详细信息：");
            // 打印初始化向量（IV，16进制）
            if (algorithm.iv) {
                console.log("AES 初始化向量（IV，16进制）:", arrayBufferToHex(algorithm.iv));
            }

            // 打印加密的密文（Base64）
            console.log("AES 加密的密文（Base64）:", arrayBufferToBase64(data));

            // 调用原始的解密方法
            try {
                const decryptedData = await originalDecrypt.apply(this, arguments);

                // 打印解密的明文（UTF-8）
                console.log("AES 解密的明文（UTF-8）:", new TextDecoder().decode(decryptedData));

                return decryptedData;
            } catch (error) {
                console.error("解密失败:", error);
                throw error;
            }
        }

        // 调用原始的解密方法
        return originalDecrypt.apply(this, arguments);
    };

        // 保存原始的 generateKey 方法
    const originalGenerateKey = window.crypto.subtle.generateKey;
    // Hook generateKey 方法
    window.crypto.subtle.generateKey = async function (algorithm, extractable, keyUsages) {
        console.log("检测到生成密钥调用");
        console.log("Algorithm:", algorithm);
        console.log("Extractable:", extractable);
        console.log("Key Usages:", keyUsages);

        // 调用原始的 generateKey 方法
        const key = await originalGenerateKey(algorithm, extractable, keyUsages);

        // 如果生成的是密钥对（如 RSA 或 ECC），打印公钥和私钥信息
        if (algorithm.name.startsWith("RSA") || algorithm.name.startsWith("EC")) {
            console.log("生成的密钥对：");
            console.log("公钥:", key.publicKey);
            console.log("私钥:", key.privateKey);

            // 导出公钥（如果需要）
            if (key.publicKey.extractable) {
                const exportedPublicKey = await crypto.subtle.exportKey("spki", key.publicKey);
                console.log("公钥（Base64）:", arrayBufferToBase64(exportedPublicKey));
            } else {
                console.warn("公钥不可导出");
            }
        } else {
            console.log("生成的密钥:", key);

            // 导出密钥（如果需要）
            if (key.extractable) {
                const exportedKey = await crypto.subtle.exportKey("raw", key);
                console.log("密钥（16进制）:", arrayBufferToHex(exportedKey));
            } else {
                console.warn("密钥不可导出");
            }
        }

        return key;
    };

    // 辅助函数：将 ArrayBuffer 转换为 16 进制字符串
    function arrayBufferToHex(buffer) {
        const uint8Array = new Uint8Array(buffer);
        return uint8Array.reduce((hexString, byte) => {
            return hexString + byte.toString(16).padStart(2, '0');
        }, '');
    }

    // 辅助函数：将 ArrayBuffer 转换为 Base64 字符串
    function arrayBufferToBase64(buffer) {
        const uint8Array = new Uint8Array(buffer);
        return btoa(String.fromCharCode.apply(null, uint8Array));
    }
}()

