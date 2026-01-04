// ==UserScript==
// @name         STEAM 一键清库存 Steam Free License Auto Remover
// @namespace    https://github.com/PeiqiLi-Github
// @version      2.0
// @description  改进：首次随机约1秒删除，触发84后改3~5分钟随机删除，失败重试，剩余时间更准确
// @author       PeiqiLi + 
// @match        https://store.steampowered.com/account/licenses/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542653/STEAM%20%E4%B8%80%E9%94%AE%E6%B8%85%E5%BA%93%E5%AD%98%20Steam%20Free%20License%20Auto%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/542653/STEAM%20%E4%B8%80%E9%94%AE%E6%B8%85%E5%BA%93%E5%AD%98%20Steam%20Free%20License%20Auto%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function insertButton() {
        const titleElem = document.querySelector('.page_content > h2');
        if (!titleElem) {
            console.warn('找不到元素，请检查是否位于 https://store.steampowered.com/account/licenses/');
            return;
        }

        const btn = document.createElement('button');
        btn.textContent = '🧹开始清理';
        btn.style.backgroundColor = '#FFD700';
        btn.style.color = '#000';
        btn.style.border = 'none';
        btn.style.padding = '5px 12px';
        btn.style.marginLeft = '15px';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '4px';
        btn.style.fontWeight = 'bold';

        const statusDiv = document.createElement('pre');
        statusDiv.style.border = '1px solid #ccc';
        statusDiv.style.padding = '10px';
        statusDiv.style.marginTop = '10px';
        statusDiv.style.maxHeight = '300px';
        statusDiv.style.overflowY = 'auto';
        statusDiv.style.whiteSpace = 'pre-wrap';
        statusDiv.style.backgroundColor = '#FFD700';
        statusDiv.style.color = '#000';

        btn.addEventListener('click', () => {
            btn.disabled = true;
            statusDiv.textContent = '';
            startCleaning(statusDiv).then(() => {
                statusDiv.textContent += '\n🎉 所有操作完成！\n';
                btn.disabled = false;
            });
        });

        titleElem.parentNode.insertBefore(btn, titleElem.nextSibling);
        titleElem.parentNode.insertBefore(statusDiv, btn.nextSibling);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function randomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function scanRemovableGames() {
        const rows = document.querySelectorAll('.account_table tr');
        const games = [];

        rows.forEach(row => {
            const removeLink = row.querySelector('a[href^="javascript:RemoveFreeLicense"]');
            if (removeLink) {
                const cells = row.querySelectorAll('td');
                const itemName = cells[1] ? cells[1].textContent.trim() : '未知游戏名';

                const href = removeLink.getAttribute('href');
                const match = href.match(/RemoveFreeLicense\(\s*(\d+)\s*,/);
                const packageId = match ? match[1] : null;

                if (packageId) {
                    games.push({
                        packageId,
                        itemName,
                        removeLink
                    });
                }
            }
        });

        return games;
    }

    async function removeGame(packageId) {
        try {
            const response = await fetch('https://store.steampowered.com/account/removelicense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `sessionid=${encodeURIComponent(g_sessionID)}&packageid=${encodeURIComponent(packageId)}`
            });

            if (!response.ok) {
                return { success: false, error: `HTTP状态 ${response.status}` };
            }

            const data = await response.json();
            if (data.success === 1) {
                return { success: true };
            } else {
                let msg = `返回错误代码: ${data.success}`;
                if (data.success === 2) {
                    msg += '（操作受限，可能触发了限速，请稍后重试）';
                } else if (data.success === 84) {
                    msg += '（Steam 拒绝请求，可能限流或请求无效）';
                } else if (data.success === 24) {
                    msg += '（会话已失效，请重新登录）';
                }
                return { success: false, error: msg, code: data.success };
            }
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    async function startCleaning(statusDiv) {
        const games = scanRemovableGames();
        const total = games.length;

        if (total === 0) {
            statusDiv.textContent = '✅ 没有找到可删除的游戏。';
            return;
        }

        let hasError84 = false; 

        statusDiv.textContent += `🚀 开始自动删除可删除游戏...\n共找到 ${total} 个可删除游戏\n\n`;

        for (let i = 0; i < total; ) { 
            const g = games[i];
            const remainingCount = total - i;

     
            const avgDelay = hasError84 ? 420000 : 1000;; 
            const remainingTimeMs = remainingCount * avgDelay;
            const remainingMinutes = Math.floor(remainingTimeMs / 60000);
            const remainingDays = (remainingMinutes / 1440).toFixed(2);

            statusDiv.textContent += `🗑️ 正在删除第 ${i + 1} 个游戏：${g.itemName} (包ID: ${g.packageId})\n`;
            statusDiv.textContent += `进度：${i} / ${total} (${((i / total)*100).toFixed(2)}%)\n`;
            statusDiv.textContent += `预计剩余时间：${remainingMinutes} 分钟 ≈ ${remainingDays} 天\n`;

            const result = await removeGame(g.packageId);

            if (result.success) {
                statusDiv.textContent += `✅ 删除成功\n\n`;
                i++;  
            } else {
                statusDiv.textContent += `❌ 删除失败，原因：${result.error}\n\n`;
                if (result.code === 84) {
                    hasError84 = true;
                }
            }

            statusDiv.scrollTop = statusDiv.scrollHeight;

            if (i < total) {
                const delay = hasError84 ? randomDelay(360000, 480000) : randomDelay(500, 1500);
                statusDiv.textContent += `⏳ 等待 ${Math.floor(delay/1000)} 秒后继续...\n\n`;
                statusDiv.scrollTop = statusDiv.scrollHeight;
                await sleep(delay);
            }
        }
    }

    function waitForPage() {
        return new Promise(resolve => {
            if (document.querySelector('.page_content > h2')) {
                resolve();
            } else {
                const observer = new MutationObserver(() => {
                    if (document.querySelector('.page_content > h2')) {
                        observer.disconnect();
                        resolve();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
        });
    }

    waitForPage().then(() => {
        insertButton();
    });
})();
