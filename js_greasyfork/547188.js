// ==UserScript==
// @name         简道云表单后台快速切表器
// @namespace    zerobiubiu.top
// @version      1.2
// @description  在简道云表单后台快速切换同应用下的不同表单。支持中英文首字母排序和分组。
// @author       zerobiubiu
// @match        https://www.jiandaoyun.com/dashboard/app/*/form/*/edit
// @license      MIT
// @icon         chrome-extension://jpejneelbjckppjapemgfeheifljmaib/_favicon/?pageUrl=https%3A%2F%2Fwww.jiandaoyun.com%2Fdashboard%23%2F&size=32
// @require      https://cdn.jsdelivr.net/npm/pinyin-pro@3.18.2/dist/index.js
// @grant        GM_xmlhttpRequest
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547188/%E7%AE%80%E9%81%93%E4%BA%91%E8%A1%A8%E5%8D%95%E5%90%8E%E5%8F%B0%E5%BF%AB%E9%80%9F%E5%88%87%E8%A1%A8%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/547188/%E7%AE%80%E9%81%93%E4%BA%91%E8%A1%A8%E5%8D%95%E5%90%8E%E5%8F%B0%E5%BF%AB%E9%80%9F%E5%88%87%E8%A1%A8%E5%99%A8.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // 获取公司信息
    async function fetchCorpInfo() {
        const csrf = document.querySelector('meta[name="csrf-token"]').content;
        const requestId = crypto.randomUUID();

        const resp = await fetch("https://www.jiandaoyun.com/profile/get_corp", {
            method: "POST",
            credentials: "include",
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json",
                "x-csrf-token": csrf,
                "x-request-id": requestId,
            },
            body: "{}"
        });

        return resp.json();
    }

    // 启动密钥检查
    async function getSecret(KEY, NAME) {
        let secret = await GM_getValue(KEY);
        if (!secret) {
            secret = prompt('请输入密钥（只需输入一次，后续会自动复用）：');
            if (secret) {
                await GM_setValue(KEY, secret);
                await GM_setValue(KEY + "-companyName", NAME);
            }
        }
        return secret;
    }

    // 从 URL 中提取 app_id
    function getAppId() {
        const match = location.href.match(/\/app\/([^/]+)\/form\//);
        return match ? match[1] : null;
    }

    // 从 URL 提取 entry_id
    function getEntryId() {
        const match = location.href.match(/\/form\/([^/]+)/);
        return match ? match[1] : null;
    }

    // 请求 API 获取所有表单（自动翻页）
    async function fetchAllForms(appId, secret) {
        const allForms = [];
        let skip = 0;
        const limit = 100;

        while (true) {
            const chunk = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://api.jiandaoyun.com/api/v5/app/entry/list",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + secret
                    },
                    data: JSON.stringify({
                        app_id: appId,
                        limit,
                        skip
                    }),
                    onload: function (res) {
                        try {
                            const data = JSON.parse(res.responseText);
                            resolve(data.forms || []);
                        } catch (e) {
                            reject("解析失败: " + e);
                        }
                    },
                    onerror: function (err) {
                        reject("请求失败: " + err);
                    }
                });
            });

            if (chunk.length === 0) break; // 没有更多了
            allForms.push(...chunk);
            skip += limit;
        }

        return allForms;
    }

    // 菜单注册标记
    let menuCreated = false;

    // 创建菜单
    function createMenu(KEY, NAME) {
        if (menuCreated) return;
        menuCreated = true;
        GM_registerMenuCommand('重置密钥（设置密钥）', async () => {
            const secret = prompt('请输入新的密钥：');
            if (!secret) return;
            await GM_setValue(KEY, secret);
            await GM_setValue(KEY + "-companyName", NAME);
            alert('密钥已更新！');
        });
        GM_registerMenuCommand("删除当前企业密钥", () => {
            if (confirm("⚠️ 确认要删除当前企业密钥吗？此操作不可恢复！")) {
                GM_deleteValue(KEY);
                GM_deleteValue(KEY + "-companyName");
                alert("✅ 密钥已删除！");
            } else {
                alert("❎ 已取消删除操作");
            }
        });
        GM_registerMenuCommand("查看所有key（控制台输出）", async () => {
            console.log(await GM_listValues());
        });
        GM_registerMenuCommand("查看当前企业密钥", async () => {
            const secret = await GM_getValue(KEY);
            if (secret) {
                alert(NAME + "  当前密钥为：" + secret);
            } else {
                alert("当前未设置密钥！");
            }
        });
        GM_registerMenuCommand("清空所有密钥（慎点！！）", async () => {
            if (confirm("⚠️ 确认要清空所有 密钥 数据吗？此操作不可恢复！")) {
                const keys = await GM_listValues();
                for (const key of keys) {
                    await GM_deleteValue(key);
                    console.log("已删除:", key);
                }
                alert("✅ 所有 密钥 数据已清空");
            } else {
                alert("❎ 已取消清空操作");
            }
        });
    }

    // 提取当前表单ID
    const currentEntryId = getEntryId();

    // 创建下拉框
    const select = document.createElement('select');
    select.id = 'formSelect';
    select.style.marginLeft = '10px';
    select.style.padding = '2px 6px';

    // 创建选择事件
    select.addEventListener("change", () => {
        const entryId = select.value;
        if (!entryId) return;
        const newUrl = window.location.href.replace(
            /(\/form\/)([^/]+)(\/)/,
            `$1${entryId}$3`
        );
        window.location.href = newUrl;
    });

    // 监听执行锁
    let executed = false;
    // 创建监听事件
    const observer = new MutationObserver(async (mutationsList, observer) => {
        const navigation_left = document.querySelector("#root > div > div.fx-navigation-bar.fx-form-navigation-bar > div.navigation-left");

        if (navigation_left && !document.getElementById("formSelect") && !executed) {
            executed = true; // 上锁，防止重复执行
            observer.disconnect(); // 找到后立即停止监听，提高性能

            // 获取当前企业ID作为KEY_ID
            const { KEY, NAME } = await fetchCorpInfo().then(data => {
                console.log("当前企业ID：" + data.corp_id)
                return { KEY: data.corp_id, NAME: data.corp_name }
            });

            createMenu(KEY, NAME);
            const secret = await getSecret(KEY, NAME);
            if (!secret) return; // 如果没有获取到密钥则停止执行

            const forms = await fetchAllForms(getAppId(), secret);

            // 统一的获取首字母/分组的工具函数
            function getGroupKey(str) {
                if (!str || !str.trim()) return '#'; // 处理空名称
                const firstChar = str.trim().charAt(0);

                if (/[a-zA-Z]/.test(firstChar)) return firstChar.toUpperCase();
                if (/[0-9]/.test(firstChar)) return '0-9';

                try {
                    const pinyinResult = pinyinPro.pinyin(firstChar, { pattern: 'first', toneType: 'none' });
                    const letter = pinyinResult ? pinyinResult.toUpperCase() : '#';
                    // 确保pinyin-pro的结果是单个字母
                    return /^[A-Z]$/.test(letter) ? letter : '#';
                } catch (e) {
                    console.error("pinyin-pro 库运行出错:", e);
                    return '#';
                }
            }

            // 1. 排序表单：主排序按分组键，次排序按完整名称
            forms.sort((a, b) => {
                const nameA = a.name || '';
                const nameB = b.name || '';
                const groupA = getGroupKey(nameA);
                const groupB = getGroupKey(nameB);

                if (groupA < groupB) return -1;
                if (groupA > groupB) return 1;

                // numeric: true 选项可以正确处理 "表单1", "表单10", "表单2" 这样的数字排序
                return nameA.localeCompare(nameB, 'zh-Hans-CN', { numeric: true });
            });

            // 2. 构造分组
            const groups = {};
            const groupOrder = [];
            forms.forEach(f => {
                const name = f.name || '';
                const groupKey = getGroupKey(name);
                if (!groups[groupKey]) {
                    groups[groupKey] = [];
                    groupOrder.push(groupKey);
                }
                groups[groupKey].push(f);
            });

            // 3. 对分组键本身进行排序：字母 -> 数字 -> 其他
            groupOrder.sort((a, b) => {
                const isLetterA = /^[A-Z]$/.test(a);
                const isLetterB = /^[A-Z]$/.test(b);
                const isNumA = a === '0-9';
                const isNumB = b === '0-9';

                if (isLetterA && !isLetterB) return -1; // 字母优先
                if (!isLetterA && isLetterB) return 1;
                if (isLetterA && isLetterB) return a.localeCompare(b); // 字母内按A-Z排序

                if (isNumA && !isNumB) return -1; // 数字其次
                if (!isNumA && isNumB) return 1;

                return a.localeCompare(b); // 其他符号按字符排序
            });


            // 4. 渲染分组到下拉框
            select.innerHTML = ''; // 清空旧内容
            groupOrder.forEach(key => {
                if (groups[key] && groups[key].length > 0) {
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = key;

                    groups[key].forEach(f => {
                        const opt = document.createElement('option');
                        opt.value = f.entry_id;
                        opt.textContent = f.name;
                        if (f.entry_id === currentEntryId) {
                            opt.selected = true;
                        }
                        optgroup.appendChild(opt);
                    });
                    select.appendChild(optgroup);
                }
            });

            // 挂载表单选择器
            navigation_left.appendChild(select);
        }
    });

    // 启动 observer
    observer.observe(document.querySelector("#root"), {
        childList: true,
        subtree: true
    });

})();