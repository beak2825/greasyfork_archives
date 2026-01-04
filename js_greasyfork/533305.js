// ==UserScript==
// @name         🚀VSCode插件极速下载 | VSCode Extension VSIX Fast Downloader ⬇️ 一键直链/多版本/Marketplace/Extension
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  blocked download link for VS Code plugin? let'me do this!!
// @description  🚀VSCode Extension VSIX Fast Downloader for organization, team, enterprise, offline deployment, direct link from Marketplace! 一键获取 VSCode 插件 VSIX 包，支持多版本直链下载，适合组织/团队/企业批量离线部署，官方 Marketplace 直链，解决 VS Code 插件包下载受限难题！
// @match        https://marketplace.visualstudio.com/items?itemName=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533305/%F0%9F%9A%80VSCode%E6%8F%92%E4%BB%B6%E6%9E%81%E9%80%9F%E4%B8%8B%E8%BD%BD%20%7C%20VSCode%20Extension%20VSIX%20Fast%20Downloader%20%E2%AC%87%EF%B8%8F%20%E4%B8%80%E9%94%AE%E7%9B%B4%E9%93%BE%E5%A4%9A%E7%89%88%E6%9C%ACMarketplaceExtension.user.js
// @updateURL https://update.greasyfork.org/scripts/533305/%F0%9F%9A%80VSCode%E6%8F%92%E4%BB%B6%E6%9E%81%E9%80%9F%E4%B8%8B%E8%BD%BD%20%7C%20VSCode%20Extension%20VSIX%20Fast%20Downloader%20%E2%AC%87%EF%B8%8F%20%E4%B8%80%E9%94%AE%E7%9B%B4%E9%93%BE%E5%A4%9A%E7%89%88%E6%9C%ACMarketplaceExtension.meta.js
// ==/UserScript==

(function() {
    // 从URL参数获取插件唯一标识
    const urlParams = new URLSearchParams(window.location.search);
    const uniqueId = urlParams.get('itemName');
    if (!uniqueId) {
        return;
    }
    const [fieldA, fieldB] = uniqueId.split('.');

    function insertDownloadButtons() {
        const versionTable = document.querySelector('.version-history-table');
        if (!versionTable) return false;
        const rows = versionTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const versionTd = row.querySelector('td');
            if (!versionTd) return;
            if (versionTd.querySelector('.vsix-download-btn')) return;
            const version = versionTd.textContent.trim();
            const btn = document.createElement('button');
            btn.className = 'vsix-download-btn';
            btn.title = '下载此版本';
            btn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;">
                    <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" stroke="#1976d2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            btn.style.background = 'transparent';
            btn.style.border = 'none';
            btn.style.cursor = 'pointer';
            btn.style.padding = '0 0 0 8px';
            btn.style.verticalAlign = 'middle';
            btn.onmouseover = function() { btn.style.background = '#e3f2fd'; };
            btn.onmouseout = function() { btn.style.background = 'transparent'; };
            btn.onclick = function(e) {
                e.stopPropagation();
                const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${fieldA}/vsextensions/${fieldB}/${version}/vspackage`;
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = '';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
            versionTd.style.whiteSpace = 'nowrap';
            versionTd.appendChild(btn);
        });
        return true;
    }

    // 尝试直接插入按钮，否则监听DOM变化
    if (insertDownloadButtons()) {
        return;
    }

    const observer = new MutationObserver(() => {
        if (insertDownloadButtons()) {
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();