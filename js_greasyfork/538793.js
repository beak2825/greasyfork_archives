// ==UserScript==
// @name         Multi Forum Read Marker
// @namespace    https://felixchristian.dev/userscripts/multi-forum-read-marker
// @version      2.3.3
// @description  多站点阅读标记 + 导出导入清除 + JSONBin云同步，彻底用GM存储，无localStorage冗余
// @author       Felix + ChatGPT + Gemini
// @license      MIT
// @match        https://soutong.men/forum.php?mod=forumdisplay&fid=*
// @match        https://soutong.men/forum.php?mod=viewthread&tid=*
// @match        https://stboy.net/forum.php?mod=forumdisplay&fid=*
// @match        https://stboy.net/forum.php?mod=viewthread&tid=*
// @match        https://74.222.3.60/forum.php?mod=forumdisplay&fid=*
// @match        https://74.222.3.60/forum.php?mod=viewthread&tid=*
// @match        https://www.tt1069.com/bbs/thread-*-*-*.html
// @match        https://www.tt1069.com/bbs/forum-*-*.html
// @match        https://www.tt1069.com/bbs/forum.php?mod=forumdisplay&fid=*
// @match        https://www.tt1069.com/bbs/forum.php?mod=viewthread&tid=*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/538793/Multi%20Forum%20Read%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/538793/Multi%20Forum%20Read%20Marker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 修改开始 ---

    // 域名别名设置: 将键（备用域名）的记录指向值（主域名）
    const hostnameAliases = {
        '74.222.3.60': 'soutong.men',
        'stboy.net': 'soutong.men'
    };

    // 获取当前域名，如果存在于别名设置中，则使用主域名
    const originalHostname = location.hostname;
    const hostname = hostnameAliases[originalHostname] || originalHostname;

    // --- 修改结束 ---

    const STORAGE_KEY = `visitedTids_${hostname}`;
    const DOMAIN_INDEX_KEY = 'visitedTids_index';

    const JSONBIN_BASE = 'https://api.jsonbin.io/v3/b';
    let visitedTids = {};

    const jsonbinId = GM_getValue('jsonbin_id', '');
    const jsonbinKey = GM_getValue('jsonbin_key', '');

    function formatDate(d = new Date()) {
        return d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0') + ' ' +
            String(d.getHours()).padStart(2, '0') + ':' +
            String(d.getMinutes()).padStart(2, '0') + ':' +
            String(d.getSeconds()).padStart(2, '0');
    }

    function getTidFromUrl(url) {
        try {
            const u = new URL(url, location.origin);
            let tid = u.searchParams.get('tid');
            if (!tid) {
                const match = url.match(/thread-(\d+)-/);
                tid = match ? match[1] : null;
            }
            return tid;
        } catch {
            return null;
        }
    }

    function loadVisited() {
        try {
            const data = GM_getValue(STORAGE_KEY, {});
            visitedTids = (typeof data === 'object' && data !== null) ? data : {};
        } catch {
            visitedTids = {};
        }
    }

    function saveVisited() {
        try {
            GM_setValue(STORAGE_KEY, visitedTids);
        } catch (e) {
            console.error('保存失败：', e);
        }
    }

    function getDomainIndex() {
        const idx = GM_getValue(DOMAIN_INDEX_KEY, []);
        return Array.isArray(idx) ? idx : [];
    }

    function updateDomainIndex() {
        let domainList = getDomainIndex();
        if (!domainList.includes(hostname)) {
            domainList.push(hostname);
            GM_setValue(DOMAIN_INDEX_KEY, domainList);
        }
    }

    function exportVisitedData() {
        let domainList = getDomainIndex();
        const exportData = {};

        domainList.forEach(domain => {
            const key = `visitedTids_${domain}`;
            try {
                const gmData = GM_getValue(key, {});
                const cleaned = {};
                for (const tid in gmData) {
                    if (gmData[tid]?.visitedAt) {
                        cleaned[tid] = { visitedAt: gmData[tid].visitedAt };
                    }
                }
                exportData[domain] = cleaned;
            } catch (e) {
                console.error(`导出 ${domain} 失败：`, e);
                exportData[domain] = {};
            }
        });

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `visitedTids_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importVisitedData(jsonText) {
        try {
            const newData = JSON.parse(jsonText);
            if (typeof newData === 'object' && newData !== null) {
                let domainList = getDomainIndex();
                for (const site in newData) {
                    const key = `visitedTids_${site}`;
                    const old = GM_getValue(key, {});
                    const merged = { ...old, ...newData[site] };
                    GM_setValue(key, merged);
                    if (!domainList.includes(site)) {
                        domainList.push(site);
                    }
                }
                GM_setValue(DOMAIN_INDEX_KEY, domainList);
                alert("导入成功！");
                location.reload();
            } else {
                alert("导入失败：格式错误");
            }
        } catch (e) {
            alert("导入失败：JSON解析错误");
        }
    }

    function clearVisitedData() {
        if (confirm("⚠️ 确定清除所有站点记录？此操作不可恢复！")) {
            let domainList = getDomainIndex();
            domainList.forEach(domain => {
                const key = `visitedTids_${domain}`;
                GM_setValue(key, {});
            });
            GM_setValue(DOMAIN_INDEX_KEY, []);
            alert("✅ 所有站点记录已清除！");
            location.reload();
        }
    }

    async function uploadToJsonBin() {
        if (!jsonbinId || !jsonbinKey) {
            alert('请先设置 JSONBin 的 Bin ID 和 API Key');
            return;
        }

        try {
            // 读取所有域名列表
            let domainList = getDomainIndex();
            let allData = {};

            // 收集每个域名的visitedTids
            for (const domain of domainList) {
                const key = `visitedTids_${domain}`;
                const data = GM_getValue(key, {});
                allData[domain] = data;
            }

            // 上传整个多域名数据
            const resp = await fetch(`${JSONBIN_BASE}/${jsonbinId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': jsonbinKey
                },
                body: JSON.stringify({
                    updatedAt: new Date().toISOString(),
                    visitedData: allData
                })
            });

            if (!resp.ok) throw new Error('上传失败');
            alert('✅ 云端备份成功！');
        } catch (e) {
            alert('❌ 云端备份失败：' + e.message);
        }
    }

    async function downloadFromJsonBin() {
        if (!jsonbinId || !jsonbinKey) {
            alert('请先设置 JSONBin 的 Bin ID 和 API Key');
            return;
        }

        try {
            const resp = await fetch(`${JSONBIN_BASE}/${jsonbinId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': jsonbinKey
                }
            });

            if (!resp.ok) throw new Error('记录不存在');

            const json = await resp.json();
            if (json.record && json.record.visitedData && typeof json.record.visitedData === 'object') {
                const allData = json.record.visitedData;

                // 清空本地域名索引，重建
                const domainList = Object.keys(allData);
                GM_setValue(DOMAIN_INDEX_KEY, domainList);

                // 按域名分别写入GM存储
                for (const domain of domainList) {
                    const key = `visitedTids_${domain}`;
                    const oldData = GM_getValue(key, {});
                    const newData = allData[domain];
                    // 合并，避免丢失本地未备份的数据
                    GM_setValue(key, { ...oldData, ...newData });
                }

                // 如果当前页面域名数据恢复了，更新当前变量
                if (visitedTids && domainList.includes(hostname)) {
                    visitedTids = GM_getValue(`visitedTids_${hostname}`, {});
                }

                alert('✅ 云端恢复成功！页面将刷新以应用数据');
                location.reload();
            } else {
                alert('❌ 云端数据格式错误');
            }
        } catch (e) {
            alert('❌ 云端恢复失败：' + e.message);
        }
    }

    function addImportExportUI() {
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.bottom = "10px";
        container.style.right = "10px";
        container.style.zIndex = "9999";
        container.style.backgroundColor = "#fff";
        container.style.border = "1px solid #888";
        container.style.padding = "5px";
        container.style.fontSize = "12px";

        const createButton = (text, handler) => {
            const btn = document.createElement("button");
            btn.textContent = text;
            btn.style.marginLeft = "5px";
            btn.onclick = handler;
            return btn;
        };

        container.appendChild(createButton("导出记录", exportVisitedData));
        container.appendChild(createButton("导入记录", () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = e => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => importVisitedData(reader.result);
                    reader.readAsText(file);
                }
            };
            input.click();
        }));
        container.appendChild(createButton("清除记录", clearVisitedData));
        container.appendChild(createButton("云端备份", uploadToJsonBin));
        container.appendChild(createButton("云端恢复", downloadFromJsonBin));
        container.appendChild(createButton("设置JSONBin", () => {
            const binId = prompt("请输入 JSONBin Bin ID", GM_getValue("jsonbin_id", ""));
            const apiKey = prompt("请输入 JSONBin API Key（私密）", GM_getValue("jsonbin_key", ""));
            if (binId && apiKey) {
                GM_setValue("jsonbin_id", binId.trim());
                GM_setValue("jsonbin_key", apiKey.trim());
                alert("✅ JSONBin 设置成功！");
            }
        }));

        document.body.appendChild(container);
    }

    function markReadThreads() {
        const threadLinks = document.querySelectorAll('a.s.xst');
        threadLinks.forEach(link => {
            if (link.dataset.markedVisited) return;
            const tid = getTidFromUrl(link.href);
            if (tid && visitedTids[tid]) {
                const tag = document.createElement('span');
                tag.textContent = '[已读] ';
                tag.style.color = 'red';
                tag.style.fontWeight = 'bold';
                tag.style.marginRight = '4px';
                link.insertBefore(tag, link.firstChild);
                link.dataset.markedVisited = 'true';
            }
        });
    }

    function attachClickListeners() {
        const threadLinks = document.querySelectorAll('a.s.xst');
        threadLinks.forEach(link => {
            if (link.dataset.clickListenerAdded) return;
            link.addEventListener('click', () => {
                const tid = getTidFromUrl(link.href);
                if (tid) {
                    visitedTids[tid] = { visitedAt: formatDate() };
                    saveVisited();
                }
            });
            link.dataset.clickListenerAdded = 'true';
        });
    }

    function handleThreadPage() {
        const tid = getTidFromUrl(location.href);
        if (tid) {
            visitedTids[tid] = { visitedAt: formatDate() };
            saveVisited();
        }
    }

    loadVisited();
    updateDomainIndex();

    if (location.href.includes('forumdisplay') || /forum-\d+-\d+\.html/.test(location.pathname)) {
        window.addEventListener('load', () => {
            markReadThreads();
            attachClickListeners();
            addImportExportUI();
        });

        const observer = new MutationObserver(() => {
            markReadThreads();
            attachClickListeners();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (location.href.includes('mod=viewthread') || /thread-\d+-/.test(location.pathname)) {
        handleThreadPage();
    }
})();