// ==UserScript==
// @name         禁用VIKACG网址安全检查
// @version      1.2
// @description  自动解密并直跳外链，绕过 external 中转页
// @author       xsap
// @match        https://www.vikacg.com/p/*
// @match        https://www.vikacg.com/external*
// @grant        none
// @namespace    NoVikUrlBlock
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504407/%E7%A6%81%E7%94%A8VIKACG%E7%BD%91%E5%9D%80%E5%AE%89%E5%85%A8%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/504407/%E7%A6%81%E7%94%A8VIKACG%E7%BD%91%E5%9D%80%E5%AE%89%E5%85%A8%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 内置极简 CryptoJS AES CBC Pkcs7 实现 ---
    const CryptoJS = (function () {
        function base64ToBytes(base64) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            let str = base64.replace(/=+$/, '');
            let bytes = [];
            for (let bc = 0, bs, buffer, idx = 0;
                buffer = str.charAt(idx++);
                ~buffer &&
                (bs = bc % 4 ? bs * 64 + buffer : buffer,
                    bc++ % 4)
                    ? bytes.push(255 & bs >> (-2 * bc & 6))
                    : 0
            ) buffer = chars.indexOf(buffer);
            return bytes;
        }

        const Utf8 = {
            parse: str => new TextEncoder().encode(str),
            stringify: bytes => new TextDecoder().decode(bytes)
        };

        async function aesCbcDecrypt(base64, key, iv) {
            const data = new Uint8Array(base64ToBytes(base64));
            const cryptoKey = await crypto.subtle.importKey(
                "raw",
                key,
                { name: "AES-CBC" },
                false,
                ["decrypt"]
            );
            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-CBC", iv: iv },
                cryptoKey,
                data
            );
            return new Uint8Array(decrypted);
        }

        return { enc: { Utf8 }, AES: { decrypt: aesCbcDecrypt } };
    })();

    async function decrypt(encryptedUrl) {
        try {
            const key = CryptoJS.enc.Utf8.parse("7R75R3JZE2PZUTHH");
            const iv = CryptoJS.enc.Utf8.parse("XWO76NCVZM2X1UCU");
            const hex = encryptedUrl.match(/.{1,2}/g).map(b => parseInt(b, 16));
            const base64 = btoa(String.fromCharCode.apply(null, hex));
            const decryptedBytes = await CryptoJS.AES.decrypt(base64, key, iv);
            return new TextDecoder().decode(decryptedBytes).replace(/\x00+$/, '');
        } catch (e) {
            console.error('解密失败:', e);
            return null;
        }
    }

    // ===== 新增功能：external 页面自动直跳 =====
    async function autoRedirectExternal() {
        if (location.pathname !== '/external') return;

        const e = new URLSearchParams(location.search).get('e');
        if (!e) return;

        const url = await decrypt(e);
        if (url && /^https?:\/\//i.test(url)) {
            location.replace(url);
        }
    }

    // 原有功能：更新文章页中的链接
    async function updateLinks() {
        const links = document.querySelectorAll('a[href^="/external?e="]');
        for (const link of links) {
            const encryptedUrl = new URL(link.href, location.origin).searchParams.get('e');
            if (encryptedUrl) {
                const decryptedUrl = await decrypt(encryptedUrl);
                if (decryptedUrl && decryptedUrl.startsWith('http')) {
                    link.href = decryptedUrl;
                }
            }
        }
    }

    // 执行
    autoRedirectExternal();
    updateLinks();

    const observer = new MutationObserver(updateLinks);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href']
    });
})();
