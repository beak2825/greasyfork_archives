// ==UserScript==
// @name         漫画助手
// @namespace    http://tampermonkey.net/
// @version      3.6.1
// @description  多主页支持，全局导入导出，紧凑悬浮滑动菜单，适合多域名管理备份！
// @author       おかゆ&ChatGPT
// @license MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/542628/%E6%BC%AB%E7%94%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542628/%E6%BC%AB%E7%94%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const domain = location.hostname;
    let allLists = {};
    let mangaList = [];
    let ui;

    function loadData() {
        allLists = GM_getValue('mangaLists', {});
        mangaList = allLists[domain] || [];
    }

    function saveData() {
        allLists[domain] = mangaList;
        GM_setValue('mangaLists', allLists);
    }

    // 读取主页域名数组，兼容旧版字符串
    function getHomepageDomains() {
        let domains = GM_getValue('homepageDomains', []);
        if (!Array.isArray(domains)) {
            if (typeof domains === 'string' && domains) {
                domains = [domains];
            } else {
                domains = [];
            }
        }
        return domains;
    }

    // 判断当前域名是否主页之一
    function isHomepageDomain() {
        const domains = getHomepageDomains();
        return domains.includes(domain);
    }

    // 添加当前域名到主页数组（如果未包含）
    function addHomepage() {
        let domains = getHomepageDomains();
        if (!domains.includes(domain)) {
            domains.push(domain);
            GM_setValue('homepageDomains', domains);
            alert(`添加主页成功：${domain}`);
            location.reload();
        } else {
            alert(`主页已存在：${domain}`);
        }
    }

    // 从主页数组中删除当前域名，并删除该域名漫画数据
    function deleteHomepage() {
        let domains = getHomepageDomains();
        if (confirm(`确定要删除当前主页 ${domain} 吗？这将删除该域名所有漫画记录。`)) {
            domains = domains.filter(d => d !== domain);
            GM_setValue('homepageDomains', domains);

            loadData();
            delete allLists[domain];
            GM_setValue('mangaLists', allLists);

            alert('主页设置及漫画记录已清除');
            if (ui && ui.parentNode) ui.parentNode.removeChild(ui);
            location.reload();
        }
    }

    // 导出所有数据（含主页数组）
    function exportAllData() {
        const exportData = {
            homepageDomains: getHomepageDomains(),
            mangaLists: GM_getValue('mangaLists', {})
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'MangaAssistantBackup.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    // 导入数据，兼容新版数组和旧版字符串
    function importAllData() {
        let txt = prompt('粘贴JSON（全局数据）');
        if (!txt) return;
        try {
            let data = JSON.parse(txt);
            if (typeof data !== 'object' || Array.isArray(data)) throw new Error('格式错误：顶层应为对象');

            if (!data.mangaLists || typeof data.mangaLists !== 'object' || Array.isArray(data.mangaLists)) {
                throw new Error('格式错误：缺少或错误的 mangaLists');
            }

            let homepageDomains = [];
            if ('homepageDomains' in data) {
                if (!Array.isArray(data.homepageDomains)) {
                    throw new Error('格式错误：homepageDomains 应为数组');
                }
                homepageDomains = data.homepageDomains.filter(d => typeof d === 'string');
            } else if ('homepageDomain' in data) {
                if (typeof data.homepageDomain === 'string') {
                    homepageDomains = [data.homepageDomain];
                } else {
                    throw new Error('格式错误：homepageDomain 应为字符串');
                }
            }

            GM_setValue('mangaLists', data.mangaLists);
            GM_setValue('homepageDomains', homepageDomains);

            alert(`成功导入，主页：${homepageDomains.length ? homepageDomains.join(', ') : '无'}`);
            location.reload();

        } catch (e) {
            alert(`导入失败，${e.message || '格式错误'}`);
        }
    }

    // 添加当前页面漫画到列表
    function addCurrentManga() {
        loadData();
        let def = document.title.replace(/ -.*$/, '').slice(0, 16);
        let name = prompt('漫画名(最多18字符)', def);
        if (!name) return;
        mangaList.unshift({
            id: Date.now() + '',
            name: name.slice(0, 18),
            url: location.href,
            added: new Date().toISOString()
        });
        saveData();
        updateMenu();
    }

    // 注册右键菜单命令
    function registerMenu() {
        loadData();
        const isHomepage = isHomepageDomain();

        GM_registerMenuCommand('📥 导入全部（恢复数据）', importAllData);

        if (isHomepage) {
            GM_registerMenuCommand('📤 导出全部（备份数据）', exportAllData);
            GM_registerMenuCommand('➖ 删除主页', deleteHomepage);
        } else {
            GM_registerMenuCommand('⚙️ 添加为主页', addHomepage);
        }

        GM_registerMenuCommand('🔄 刷新', () => location.reload());
    }

    // UI 渲染
    function renderUI() {
        if (!isHomepageDomain()) return;

        loadData();

        if (!ui) {
            ui = document.createElement('div');
            ui.id = 'manga-assistant-ui';

            // 悬浮按钮
            const btn = document.createElement('div');
            btn.textContent = '📚';
            btn.style.cssText = `
                position:fixed;bottom:20px;right:20px;width:44px;height:44px;
                background:#06c;color:#fff;display:flex;
                align-items:center;justify-content:center;font-size:22px;
                cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.25);z-index:9999;
            `;
            btn.onclick = toggleMenu;
            ui.appendChild(btn);

            // 菜单
            const menu = document.createElement('div');
            menu.id = 'manga-menu';
            menu.style.cssText = `
                position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
                width:280px;height:360px;background:#fff;box-shadow:0 3px 8px rgba(0,0,0,0.25);
                padding:8px;font-family:sans-serif;display:none;z-index:9999;
                flex-direction:column;justify-content:flex-start;align-items:center;
            `;

            // 标题
            const title = document.createElement('div');
            title.textContent = '📚 漫画助手/漫画收藏';
            title.style.cssText = 'font-size:16px; margin-bottom:6px; font-weight:600;';
            menu.appendChild(title);

            // 内容区域（可滑动）
            const listC = document.createElement('div');
            listC.id = 'manga-list';
            listC.style.cssText = `
                flex:1; width:100%; overflow-y:auto; overflow-x:hidden;
                display:flex; flex-direction:column; justify-content:flex-start;
                margin-bottom:8px; font-size:12px;
            `;
            menu.appendChild(listC);

            // 添加漫画按钮
            const control = document.createElement('div');
            control.style.cssText = 'width:100%; text-align:center;';

            const addBtn = document.createElement('button');
            addBtn.textContent = '➕ 添加漫画';
            addBtn.style.cssText = 'margin:4px 0; font-size:13px; padding:4px 8px; cursor:pointer;';
            addBtn.onclick = addCurrentManga;

            control.appendChild(addBtn);
            menu.appendChild(control);

            ui.appendChild(menu);
            document.body.appendChild(ui);
        }

        updateMenu();
    }

    // 显示/隐藏菜单
    function toggleMenu() {
        const menu = document.getElementById('manga-menu');
        if (menu.style.display === 'none' || menu.style.display === '') {
            updateMenu();
            menu.style.display = 'flex';
        } else {
            menu.style.display = 'none';
        }
    }

    // 更新菜单内容
    function updateMenu() {
        const listC = document.getElementById('manga-list');
        listC.innerHTML = '';

        if (mangaList.length === 0) {
            listC.textContent = '📭 暂无收藏漫画';
            return;
        }

        mangaList.forEach((m, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.style.cssText = 'margin:4px 0; display:flex; align-items:center;';

            const renameBtn = document.createElement('button');
            renameBtn.textContent = '✏️';
            renameBtn.style.cssText = 'font-size:11px; border:none; background:none; cursor:pointer; margin-right:4px; padding:0;';
            renameBtn.onclick = () => {
                const newName = prompt('输入新名称(最多18字符)', m.name);
                if (newName) {
                    mangaList[index].name = newName.slice(0, 18);
                    saveData();
                    updateMenu();
                }
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '❌';
            deleteBtn.style.cssText = 'font-size:11px; border:none; background:none; cursor:pointer; margin-right:6px; padding:0;';
            deleteBtn.onclick = () => {
                if (confirm(`确定删除 "${m.name}" 吗？`)) {
                    mangaList.splice(index, 1);
                    saveData();
                    updateMenu();
                }
            };

            const a = document.createElement('a');
            a.textContent = m.name;
            a.href = m.url;
            a.target = '_blank';
            a.style.cssText = 'color:#06c; text-decoration:none; flex:1; text-align:left; font-size:13px;';

            itemDiv.appendChild(renameBtn);
            itemDiv.appendChild(deleteBtn);
            itemDiv.appendChild(a);

            listC.appendChild(itemDiv);
        });
    }

    // 主流程
    loadData();
    registerMenu();
    renderUI();

})();