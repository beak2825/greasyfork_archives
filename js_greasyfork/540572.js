// ==UserScript==
// @name         Discord Image Save
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Save actual Discord image and generate HTML link back to original message, then close image tab
// @match        https://discord.com/channels/*
// @match        https://media.discordapp.net/*
// @match        https://cdn.discordapp.com/*
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540572/Discord%20Image%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/540572/Discord%20Image%20Save.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = window.location.href;

    // 获取用户设置（或使用默认值）
    let subFolder = GM_getValue('subFolder', '');

    // ---------- Global Config Toggle ----------
    GM_registerMenuCommand("✅ 启用自定义名称", async () => {
        await GM_setValue('useCustomName', true);
        alert('已启用自定义名称');
    });
    GM_registerMenuCommand("❌ 禁用自定义名称", async () => {
        await GM_setValue('useCustomName', false);
        alert('已禁用自定义名称');
    });
    GM_registerMenuCommand("✅ 启用保存HTML", async () => {
        await GM_setValue('enableHtml', true);
        alert('已启用保存 HTML 跳转页');
    });
    GM_registerMenuCommand("❌ 禁用保存HTML", async () => {
        await GM_setValue('enableHtml', false);
        alert('已禁用保存 HTML 跳转页');
    });

    GM_registerMenuCommand("📁 设置子文件夹", async () => {
        const current = await GM_getValue('subFolder', '');
        const newVal = prompt(`请输入子文件夹名称（留空则不使用子文件夹），当前的子文件夹为${current || '无'}`, current);
        if (newVal !== null) {
            await GM_setValue('subFolder', newVal.trim());
            alert(`子文件夹设置为：${newVal.trim() || '无'}`);
        }
    });

    // ---------- STEP 1: In Discord preview page ----------
    if (currentUrl.includes('discord.com/channels/')) {
        const observer = new MutationObserver(() => {
            const modal = document.querySelector('[class*="carouselModal"]');
            const existing = document.querySelector('#save-discord-jump');
            const openBtn = [...document.querySelectorAll('button')].find(b => b.getAttribute('aria-label') === '在浏览器中打开');
            if (modal && openBtn && !existing) {
                injectButton(openBtn);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        function injectButton(referenceBtn) {
            const btn = document.createElement('button');
            btn.innerText = '⬇';
            btn.id = 'save-discord-jump';
            btn.style = `
                margin-left: 10px;
                padding: 6px 10px;
                background-color: #5865F2;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            `;

            btn.onclick = async () => {
                const useCustom = await GM_getValue('useCustomName', true);
                let customName = null;
                if (useCustom) {
                    const nameInput = prompt("请输入角色名称：", "");
                    if (!nameInput) return;
                    customName = nameInput.trim();
                }

                await GM_setValue('lastDiscordURL', window.location.href);
                await GM_setValue('customCharName', customName);

                // 在确认输入之后，立即跳转下载页面
                const openBtn = [...document.querySelectorAll('button')].find(b => b.getAttribute('aria-label') === '在浏览器中打开');
                if (openBtn) openBtn.click();
            };

            referenceBtn.parentElement?.appendChild(btn);
        }

        // ---------- STEP 1.5: 添加 JSON 文件下载增强按钮 ----------
        function enhanceJsonDownloadLinks() {
            const anchors = document.querySelectorAll('a[href*=".json"]:not([data-enhanced])');
            anchors.forEach(async anchor => {
                anchor.dataset.enhanced = "true";

                const href = anchor.href;
                const fileMatch = href.match(/\/([^\/?#]+\.json)/);
                if (!fileMatch) return;

                const filename = fileMatch[1];
                const subFolder = await GM_getValue('subFolder', '');
                const useCustom = await GM_getValue('useCustomName', true);

                let finalName = filename;
                if (useCustom) {
                    const customName = await GM_getValue('customCharName', 'file');
                    finalName = `${customName}.json`;
                }
                const fullName = subFolder ? `${subFolder}/${finalName}` : finalName;

                // 创建按钮
                const btn = document.createElement('button');
                btn.innerText = '⬇ JSON';
                btn.style = `
                    margin-left: 8px;
                    font-size: 12px;
                    padding: 2px 6px;
                    background-color: #5865F2;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                `;

                btn.onclick = () => {
                    GM_download(href, fullName);
                };

                anchor.parentElement?.appendChild(btn);
            });
        }

        // 启动 observer 动态检查 DOM 中是否有 JSON 链接加载出来
        const jsonObserver = new MutationObserver(() => {
            enhanceJsonDownloadLinks();
        });
        jsonObserver.observe(document.body, { childList: true, subtree: true });
    }

    // ---------- STEP 2: In image preview page ----------
    else if (currentUrl.includes('discordapp.com') || currentUrl.includes('discordapp.net')) {
        let downloaded = false;

        const tryDownload = async () => {
            if (downloaded) return;
            const trueImg = document.querySelector('img');
            if (!trueImg || !trueImg.src || !trueImg.src.startsWith('https://cdn.discordapp.com')) return;

            downloaded = true;

            const customName = await GM_getValue('customCharName', 'character');
            const subpath = await GM_getValue('subFolder', '');

            const imageUrl = trueImg.src.split('?')[0];
            const basename = customName ? `${customName}.png` : imageUrl.split('/').pop();
            const filename = subpath ? `${subpath}/${basename}` : basename;
            GM_download(trueImg.src, filename);

            const stem = basename.split('.')[0];
            const htmlname = `${stem}.html`
            const htmlfilename = subFolder ? `${subFolder}/${htmlname}` : htmlname;

            const enableHtml = await GM_getValue('enableHtml', true);
            if (enableHtml) {
                const jumpLink = await GM_getValue('lastDiscordURL', 'https://discord.com/channels/@me');
                const htmlContent = `<!DOCTYPE html><html><head><meta charset='utf-8'><meta http-equiv="refresh" content="0; url=${jumpLink}"></head><body><p><a href="${jumpLink}">前往 Discord 消息链接</a></p></body></html>`;
                const blob = new Blob([htmlContent], { type: 'text/html' });

                GM_download({
                    url: blob,
                    name: htmlfilename
                });
            }

            setTimeout(() => {
                window.close();
            }, 800);
        };

        const observer = new MutationObserver(() => {
            tryDownload();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();