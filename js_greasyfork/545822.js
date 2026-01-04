// ==UserScript==
// @name         ZLibrary账号手动切换器（跨域存储版）
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  跨域共享账号Cookie，支持导入完整Cookie JSON数组，手动选择切换账号，自动写cookie并刷新页面，暗色美化UI。
// @include      *://*zlib*/*
// @match        *://zlibrary*/*
// @match        *://*.zlibrary*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545822/ZLibrary%E8%B4%A6%E5%8F%B7%E6%89%8B%E5%8A%A8%E5%88%87%E6%8D%A2%E5%99%A8%EF%BC%88%E8%B7%A8%E5%9F%9F%E5%AD%98%E5%82%A8%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545822/ZLibrary%E8%B4%A6%E5%8F%B7%E6%89%8B%E5%8A%A8%E5%88%87%E6%8D%A2%E5%99%A8%EF%BC%88%E8%B7%A8%E5%9F%9F%E5%AD%98%E5%82%A8%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解析cookie数组，按remix_userid分组生成账号对象数组
    function parseCookiesArrayByGrouping(rawArray) {
        const keyFields = ['selectedSiteMode','siteLanguage','remix_userid','remix_userkey'];
        // 过滤只保留zlib域名且所需字段的cookie
        const filtered = rawArray.filter(c => c.domain && c.domain.includes('zlib') && keyFields.includes(c.name));
        // 找所有 userid，作为账号分组基础
        const userIds = [...new Set(filtered.filter(c => c.name === 'remix_userid').map(c => c.value))];
        if (userIds.length === 0) {
            alert('导入的cookie中未发现 remix_userid，无法识别账号！');
            return [];
        }
        const accounts = {};
        userIds.forEach(uid => {
            accounts[uid] = { name: `账号-${uid}` };
        });
        filtered.forEach(cookie => {
            if (cookie.name === 'remix_userid') {
                accounts[cookie.value][cookie.name] = cookie.value;
            } else if (cookie.name === 'remix_userkey') {
                // remix_userkey对应userid赋值
                const uid = cookie.value; // 实际上应该从其它cookie匹配，暂用value
                // 这里不做uid匹配，先简单赋值到所有账号中存在对应userid的对象
                for (const key in accounts) {
                    if (accounts[key].remix_userid === cookie.value) {
                        accounts[key][cookie.name] = cookie.value;
                        return;
                    }
                }
                // 不匹配则赋给第一个账号
                accounts[userIds[0]][cookie.name] = cookie.value;
            } else {
                // 其余字段赋给所有账号（不精准，但只影响无关键数据）
                accounts[userIds[0]][cookie.name] = cookie.value;
            }
        });
        return Object.values(accounts);
    }

    // 使用GM_getValue异步加载账号
    async function loadAccounts() {
        const data = await GM_getValue('zlib_accounts', '[]');
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('账号数据解析失败', e);
            return [];
        }
    }

    // 使用GM_setValue异步保存账号
    async function saveAccounts(accounts) {
        await GM_setValue('zlib_accounts', JSON.stringify(accounts));
    }

    // 设置cookie函数，带domain通配
    function setCookie(name, value) {
        const domainParts = location.hostname.split('.');
        const domain = '.' + domainParts.slice(-2).join('.');
        document.cookie = `${name}=${value}; path=/; domain=${domain}; secure;`;
        console.log(`写入Cookie: ${name}=${value}; domain=${domain}`);
    }

    // 手动切换指定账号
    async function switchAccountByIndex(idx) {
        const accounts = await loadAccounts();
        if (accounts.length === 0) {
            alert('请先导入账号Cookie JSON！');
            return;
        }
        if (idx < 0 || idx >= accounts.length) {
            alert('选择的账号索引无效！');
            return;
        }
        const account = accounts[idx];
        for (const [name, value] of Object.entries(account)) {
            if (name === 'name') continue;
            setCookie(name, value);
        }
        alert(`已切换到账号：${account.name}，页面即将刷新`);
        setTimeout(() => location.reload(), 1000);
    }

    // 加载账号到下拉框
    async function loadAccountsToSelect(select) {
        const accounts = await loadAccounts();
        select.innerHTML = '';
        if (accounts.length === 0) {
            const opt = document.createElement('option');
            opt.textContent = '无账号，请先导入';
            opt.disabled = true;
            select.appendChild(opt);
            return;
        }
        accounts.forEach((acc, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = acc.name || `账号-${i+1}`;
            select.appendChild(opt);
        });
    }

    // 创建并插入控制面板
    function addControls() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.backgroundColor = '#1e1e2f';
        container.style.border = '2px solid #5c7cfa';
        container.style.borderRadius = '10px';
        container.style.padding = '15px 20px';
        container.style.boxShadow = '0 4px 12px rgba(92,124,250,0.6)';
        container.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        container.style.color = '#f0f0f5';
        container.style.minWidth = '280px';
        container.style.userSelect = 'none';

        const title = document.createElement('h3');
        title.textContent = 'ZLibrary账号切换';
        title.style.margin = '0 0 10px 0';
        title.style.fontWeight = '600';
        title.style.textAlign = 'center';
        container.appendChild(title);

        const importBtn = document.createElement('button');
        importBtn.textContent = '导入账号Cookie JSON';
        importBtn.style.marginBottom = '12px';
        importBtn.style.width = '100%';
        importBtn.style.padding = '10px 0';
        importBtn.style.border = 'none';
        importBtn.style.borderRadius = '6px';
        importBtn.style.backgroundColor = '#5c7cfa';
        importBtn.style.color = '#fff';
        importBtn.style.fontSize = '15px';
        importBtn.style.cursor = 'pointer';
        importBtn.style.transition = 'background-color 0.3s ease';
        importBtn.onmouseenter = () => importBtn.style.backgroundColor = '#495ce8';
        importBtn.onmouseleave = () => importBtn.style.backgroundColor = '#5c7cfa';

        const select = document.createElement('select');
        select.style.width = '100%';
        select.style.marginBottom = '12px';
        select.style.padding = '8px';
        select.style.borderRadius = '6px';
        select.style.border = '1px solid #5c7cfa';
        select.style.backgroundColor = '#2c2c48';
        select.style.color = '#f0f0f5';
        select.style.fontSize = '14px';
        select.style.cursor = 'pointer';

        const switchBtn = document.createElement('button');
        switchBtn.textContent = '切换选中账号';
        switchBtn.style.width = '100%';
        switchBtn.style.padding = '10px 0';
        switchBtn.style.border = 'none';
        switchBtn.style.borderRadius = '6px';
        switchBtn.style.backgroundColor = '#22c55e';
        switchBtn.style.color = '#fff';
        switchBtn.style.fontSize = '15px';
        switchBtn.style.cursor = 'pointer';
        switchBtn.style.transition = 'background-color 0.3s ease';
        switchBtn.onmouseenter = () => switchBtn.style.backgroundColor = '#16a34a';
        switchBtn.onmouseleave = () => switchBtn.style.backgroundColor = '#22c55e';

        container.appendChild(importBtn);
        container.appendChild(select);
        container.appendChild(switchBtn);
        document.body.appendChild(container);

        // 导入按钮事件
        importBtn.onclick = async () => {
            const input = prompt('请粘贴从浏览器导出的完整Cookie JSON数组：');
            if (!input) return;

            try {
                const raw = JSON.parse(input);
                if (!Array.isArray(raw)) {
                    alert('请输入有效的Cookie JSON数组！');
                    return;
                }
                const newAccounts = parseCookiesArrayByGrouping(raw);
                if (newAccounts.length === 0) {
                    alert('未解析出有效账号数据！');
                    return;
                }

                const existingAccounts = await loadAccounts();

                // 去重合并，防止重复账号
                const merged = [...existingAccounts];
                newAccounts.forEach(newAcc => {
                    if (!merged.some(acc => acc.remix_userid === newAcc.remix_userid)) {
                        merged.push(newAcc);
                    }
                });

                await saveAccounts(merged);
                alert(`成功导入 ${newAccounts.length} 个账号！当前共 ${merged.length} 个账号。`);
                loadAccountsToSelect(select);
            } catch(e) {
                alert('JSON解析失败，请检查格式！');
            }
        };

        // 切换按钮事件
        switchBtn.onclick = async () => {
            const idx = select.selectedIndex;
            if (idx < 0) {
                alert('请选择账号！');
                return;
            }
            await switchAccountByIndex(idx);
        };

        // 初始化下拉框
        loadAccountsToSelect(select);
    }

    window.addEventListener('load', () => {
        addControls();
    });

    // 方便调试暴露
    window.switchZlibAccountByIndex = switchAccountByIndex;

})();
