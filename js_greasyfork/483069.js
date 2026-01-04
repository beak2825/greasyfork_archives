// ==UserScript==
// @name         夸克懒得点 (WebDAV同步+防重复+日志搜索+警告列表版)
// @namespace    https://greasyfork.org/users/158417
// @version      0.39
// @description  夸克懒得点.. 修复误判，精准屏蔽，自动记录日志，支持 WebDAV 同步，支持检测重复链接 (日志含搜索框)，新增警告(观察)列表
// @author       JIEMO
// @match        *://pan.quark.cn/*
// @icon         https://pan.quark.cn/favicon.ico
// @license      GPL-3.0 License
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/483069/%E5%A4%B8%E5%85%8B%E6%87%92%E5%BE%97%E7%82%B9%20%28WebDAV%E5%90%8C%E6%AD%A5%2B%E9%98%B2%E9%87%8D%E5%A4%8D%2B%E6%97%A5%E5%BF%97%E6%90%9C%E7%B4%A2%2B%E8%AD%A6%E5%91%8A%E5%88%97%E8%A1%A8%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/483069/%E5%A4%B8%E5%85%8B%E6%87%92%E5%BE%97%E7%82%B9%20%28WebDAV%E5%90%8C%E6%AD%A5%2B%E9%98%B2%E9%87%8D%E5%A4%8D%2B%E6%97%A5%E5%BF%97%E6%90%9C%E7%B4%A2%2B%E8%AD%A6%E5%91%8A%E5%88%97%E8%A1%A8%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    const STORAGE_KEY = "blocked_users_v2"; // 🔴 红名单：屏蔽列表
    const WARNING_KEY = "warning_users_v2"; // 🟠 橙名单：警告列表
    const LOG_KEY = "auto_save_logs";       // 日志存储
    const WEBDAV_CONF_KEY = "webdav_config"; // WebDAV配置
    const MAX_LOGS = 300;                   // 最大保留日志条数
    const CLOUD_FILE_NAME = "quark_script_data.json"; // 云端文件名
    const DEFAULT_LIST = [];
    // ===========================================

    // ============================================================
    // 1. 基础工具 & WebDAV 模块
    // ============================================================

    function getBlockedList() { return GM_getValue(STORAGE_KEY, DEFAULT_LIST); }
    function setBlockedList(list) { GM_setValue(STORAGE_KEY, list); }

    function getWarningList() { return GM_getValue(WARNING_KEY, DEFAULT_LIST); }
    function setWarningList(list) { GM_setValue(WARNING_KEY, list); }

    function getLogs() { return GM_getValue(LOG_KEY, []); }
    function setLogs(list) { GM_setValue(LOG_KEY, list); }

    function formatTime(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${y}-${m}-${d} ${h}:${min}:${s}`;
    }

    function computeStringHash(str) {
        if (!str) return "null";
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return "u" + Math.abs(hash);
    }

    // --- WebDAV 核心逻辑 ---
    const WebDAV = {
        getConfig: () => GM_getValue(WEBDAV_CONF_KEY, { url: "", user: "", pass: "" }),
        setConfig: (conf) => GM_setValue(WEBDAV_CONF_KEY, conf),

        pull: function(callback) {
            const conf = this.getConfig();
            if (!conf.url) { if(callback) callback(); return; }

            console.log("[夸克懒得点] 正在从云端拉取数据...");
            const fileUrl = conf.url.endsWith('/') ? conf.url + CLOUD_FILE_NAME : conf.url + '/' + CLOUD_FILE_NAME;

            GM_xmlhttpRequest({
                method: "GET",
                url: fileUrl,
                user: conf.user,
                password: conf.pass,
                headers: { "Cache-Control": "no-cache" },
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const cloudData = JSON.parse(response.responseText);
                            WebDAV.mergeData(cloudData);
                            console.log("[夸克懒得点] ✅ 云端同步成功");
                        } catch (e) {
                            console.error("[夸克懒得点] 解析云端数据失败", e);
                        }
                    } else if (response.status === 404) {
                        console.log("[夸克懒得点] 云端文件不存在，将在下次保存时创建");
                    }
                    if(callback) callback();
                },
                onerror: function(err) {
                    console.error("[夸克懒得点] 网络请求错误 (Pull)", err);
                    if(callback) callback();
                }
            });
        },

        push: function() {
            const conf = this.getConfig();
            if (!conf.url) return;

            const data = {
                blocked: getBlockedList(),
                warning: getWarningList(), // 新增同步警告列表
                logs: getLogs(),
                updated: new Date().getTime()
            };
            const fileUrl = conf.url.endsWith('/') ? conf.url + CLOUD_FILE_NAME : conf.url + '/' + CLOUD_FILE_NAME;

            console.log("[夸克懒得点] 正在上传数据到云端...", fileUrl);

            GM_xmlhttpRequest({
                method: "PUT",
                url: fileUrl,
                user: conf.user,
                password: conf.pass,
                data: JSON.stringify(data),
                headers: { "Content-Type": "application/json;charset=UTF-8" },
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        console.log("[夸克懒得点] ✅ 上传成功");
                    } else {
                        console.error(`[夸克懒得点] ❌ 上传失败: ${response.status}`);
                    }
                }
            });
        },

        mergeData: function(cloudData) {
            if (!cloudData) return;

            // 辅助合并函数
            const mergeList = (localGetter, localSetter, cloudList) => {
                let localList = localGetter();
                const localHashes = new Set(localList.map(u => u.hash));
                let hasChange = false;
                if (cloudList && Array.isArray(cloudList)) {
                    cloudList.forEach(u => {
                        if (!localHashes.has(u.hash)) {
                            localList.push(u);
                            hasChange = true;
                        }
                    });
                }
                if (hasChange) localSetter(localList);
            };

            // 1. 合并屏蔽列表
            mergeList(getBlockedList, setBlockedList, cloudData.blocked);

            // 2. 合并警告列表
            mergeList(getWarningList, setWarningList, cloudData.warning);

            // 3. 合并日志
            let localLogs = getLogs();
            if (cloudData.logs && Array.isArray(cloudData.logs)) {
                const uniqueSet = new Set(localLogs.map(l => l.url));
                cloudData.logs.forEach(l => {
                    if (!uniqueSet.has(l.url)) {
                        localLogs.push(l);
                        uniqueSet.add(l.url);
                    }
                });
                localLogs.sort((a, b) => new Date(b.time) - new Date(a.time));
                if (localLogs.length > MAX_LOGS) localLogs = localLogs.slice(0, MAX_LOGS);
                setLogs(localLogs);
            }
        }
    };

    // ============================================================
    // 2. 核心逻辑：提取信息
    // ============================================================

    function getTargetSharerInfo() {
        const shareContainer = document.querySelector('.share-info-wrap');
        if (!shareContainer) return null;

        const imgElement = shareContainer.querySelector('img');
        if (!imgElement || !imgElement.src) return null;
        const hashID = computeStringHash(imgElement.src);

        const nameElement = shareContainer.querySelector('.author-name');
        let nickName = "Unknown";
        if (nameElement) {
            nickName = nameElement.innerText.trim();
        } else {
            const possibleNames = shareContainer.querySelectorAll('div');
            if(possibleNames.length > 1) {
                nickName = possibleNames[1].innerText.trim();
            }
        }
        return { name: nickName, hash: hashID };
    }

    function getFileTitle() {
        const titleEl = document.querySelector('.filename-text');
        if (titleEl) {
            return titleEl.getAttribute('title') || titleEl.innerText.trim();
        }
        return document.title.replace(' - 夸克网盘', '') || "未知标题";
    }

    // ============================================================
    // 3. 日志记录逻辑
    // ============================================================

    function recordLog(user) {
        const fileName = getFileTitle();
        const currentTime = formatTime(new Date());
        const currentUrl = window.location.href;

        let logs = getLogs().filter(l => l.url !== currentUrl);

        const newLog = {
            time: currentTime,
            name: user.name,
            hash: user.hash,
            title: fileName,
            url: currentUrl
        };

        logs.unshift(newLog);
        if (logs.length > MAX_LOGS) logs = logs.slice(0, MAX_LOGS);
        setLogs(logs);

        console.log(`[夸克懒得点] 日志已记录: ${fileName}`);
        WebDAV.push();
    }

    // ============================================================
    // 4. UI 交互
    // ============================================================

    // 🔴 红色阻断：屏蔽
    function showBlockedOverlay(user) {
        var overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.95)', zIndex: '999999',
            display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
        });

        var text = document.createElement('h1');
        text.innerText = "⛔ 已屏蔽该分享者";
        text.style.cssText = "color: #ff4d4f; font-size: 60px; font-weight: bold; text-shadow: 2px 2px 10px black; margin: 0;";

        var subText = document.createElement('div');
        subText.innerHTML = `<p style='font-size:24px; color:white'>昵称：<span style='color:#ff6a00'>${user.name}</span></p>`;

        var unlockBtn = document.createElement('button');
        unlockBtn.innerText = "本次临时允许";
        unlockBtn.style.cssText = "margin-top: 30px; padding: 10px 20px; cursor: pointer; background: #333; color: #fff; border: 1px solid #666;";
        unlockBtn.onclick = function() { overlay.remove(); };

        overlay.appendChild(text);
        overlay.appendChild(subText);
        overlay.appendChild(unlockBtn);
        document.body.appendChild(overlay);
    }

    // 🟠 橙色警告：不阻断，仅提示
    function showWarningToast(user) {
        var toast = document.createElement('div');
        Object.assign(toast.style, {
            position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: '#faad14', color: '#fff', zIndex: '999999',
            padding: '15px 30px', borderRadius: '50px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', gap: '10px',
            fontSize: '18px', fontWeight: 'bold', pointerEvents: 'none' // 允许点击穿透
        });

        toast.innerHTML = `
            <span style="font-size: 24px;">⚠️</span>
            <span>注意：此分享者 (${user.name}) 在警告名单中</span>
        `;

        document.body.appendChild(toast);

        // 5秒后淡出消失
        setTimeout(() => {
            toast.style.transition = 'opacity 1s';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 1000);
        }, 5000);
    }

    // 🔁 重复提示
    function showDuplicateOverlay(log, callback) {
        var overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.90)', zIndex: '999999',
            display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
        });

        var text = document.createElement('h1');
        text.innerText = "🔁 此链接已保存过";
        text.style.cssText = "color: #FFD700; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 5px black; margin: 0;";

        var infoDiv = document.createElement('div');
        infoDiv.style.cssText = "margin-top:20px; color: #ddd; text-align:center; font-size: 16px; line-height: 1.6;";
        infoDiv.innerHTML = `
            <p>上次保存时间: <span style="color:white; font-weight:bold">${log.time}</span></p>
            <p>文件标题: ${log.title}</p>
        `;

        var btnContainer = document.createElement('div');
        btnContainer.style.marginTop = "40px";

        var cancelBtn = document.createElement('button');
        cancelBtn.innerText = "我知道了 (关闭页面)";
        cancelBtn.style.cssText = "padding: 10px 20px; cursor: pointer; background: #444; color: #fff; border: none; border-radius: 4px; margin-right: 20px;";
        cancelBtn.onclick = function() { window.close(); overlay.remove(); };

        var forceBtn = document.createElement('button');
        forceBtn.innerText = "强制再次保存";
        forceBtn.style.cssText = "padding: 10px 20px; cursor: pointer; background: #007bff; color: #fff; border: none; border-radius: 4px;";
        forceBtn.onclick = function() {
            overlay.remove();
            if (callback) callback();
        };

        btnContainer.appendChild(cancelBtn);
        btnContainer.appendChild(forceBtn);
        overlay.appendChild(text);
        overlay.appendChild(infoDiv);
        overlay.appendChild(btnContainer);
        document.body.appendChild(overlay);
    }

    function showLogViewer() {
        const logs = getLogs();

        var overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)', zIndex: '999999',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        });

        var box = document.createElement('div');
        Object.assign(box.style, {
            width: '90%', height: '85%', backgroundColor: '#fff', borderRadius: '8px',
            padding: '20px', display: 'flex', flexDirection: 'column', color: '#333'
        });

        var title = document.createElement('h2');
        title.innerText = `📜 保存记录 (共 ${logs.length} 条)`;
        title.style.margin = '0 0 10px 0';
        title.style.borderBottom = '2px solid #eee';
        title.style.paddingBottom = '10px';

        var searchInput = document.createElement('input');
        searchInput.placeholder = "🔍 搜索日志 (昵称/标题/网址)...";
        searchInput.style.cssText = "width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;";

        searchInput.oninput = function() {
            const val = this.value.toLowerCase();
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(val) ? '' : 'none';
            });
        };

        var contentBox = document.createElement('div');
        Object.assign(contentBox.style, {
            flex: '1', width: '100%', overflow: 'auto', border: '1px solid #ccc',
            backgroundColor: '#f9f9f9'
        });

        var table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '12px';
        table.style.fontFamily = 'monospace';

        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        ['时间', '昵称', '文件标题', '网址'].forEach(text => {
            var th = document.createElement('th');
            th.innerText = text;
            th.style.textAlign = 'left';
            th.style.padding = '8px';
            th.style.borderBottom = '2px solid #ddd';
            th.style.backgroundColor = '#eee';
            th.style.position = 'sticky';
            th.style.top = '0';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        logs.forEach((log, index) => {
            var tr = document.createElement('tr');
            tr.style.backgroundColor = index % 2 === 0 ? '#fff' : '#fcfcfc';
            tr.style.borderBottom = '1px solid #eee';

            var tdTime = document.createElement('td');
            tdTime.innerText = log.time;
            tdTime.style.padding = '6px 8px';
            tdTime.style.whiteSpace = 'nowrap';

            var tdName = document.createElement('td');
            tdName.innerText = log.name;
            tdName.style.padding = '6px 8px';
            tdName.style.whiteSpace = 'nowrap';
            tdName.style.maxWidth = '150px';
            tdName.style.overflow = 'hidden';
            tdName.style.textOverflow = 'ellipsis';

            var tdTitle = document.createElement('td');
            tdTitle.innerText = log.title;
            tdTitle.style.padding = '6px 8px';
            tdTitle.style.maxWidth = '300px';
            tdTitle.style.whiteSpace = 'nowrap';
            tdTitle.style.overflow = 'hidden';
            tdTitle.style.textOverflow = 'ellipsis';
            tdTitle.title = log.title;

            var tdUrl = document.createElement('td');
            var link = document.createElement('a');
            link.href = log.url;
            link.innerText = "🔗点击跳转";
            link.target = "_blank";
            link.style.color = '#1890ff';
            link.style.textDecoration = 'none';
            link.onmouseover = function() { this.style.textDecoration = 'underline'; };
            link.onmouseout = function() { this.style.textDecoration = 'none'; };

            tdUrl.appendChild(link);
            tdUrl.style.padding = '6px 8px';

            tr.appendChild(tdTime);
            tr.appendChild(tdName);
            tr.appendChild(tdTitle);
            tr.appendChild(tdUrl);
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        contentBox.appendChild(table);

        var btnContainer = document.createElement('div');
        btnContainer.style.marginTop = '15px';
        btnContainer.style.textAlign = 'right';

        var copyBtn = document.createElement('button');
        copyBtn.innerText = "复制纯文本日志";
        copyBtn.style.marginRight = "10px";
        copyBtn.onclick = function() {
            let logText = "时间\t\t\t昵称\t\t文件标题\t\t\t网址\n";
            logText += "--------------------------------------------------------------------------------------\n";
            logs.forEach(log => {
                logText += `[${log.time}]  ${log.name}  >>>  ${log.title}  >>>  ${log.url}\n`;
            });
            GM_setClipboard(logText);
            alert("✅ 已复制到剪贴板！");
        };

        var forceSyncBtn = document.createElement('button');
        forceSyncBtn.innerText = "☁️ 立即同步";
        forceSyncBtn.style.marginRight = "10px";
        forceSyncBtn.style.color = "blue";
        forceSyncBtn.onclick = function() {
            WebDAV.pull(() => {
                WebDAV.push();
                alert("同步指令已发送，请查看控制台或稍后重试");
                overlay.remove();
                showLogViewer();
            });
        };

        var clearBtn = document.createElement('button');
        clearBtn.innerText = "清空";
        clearBtn.style.color = "red";
        clearBtn.style.marginRight = "10px";
        clearBtn.onclick = function() {
            if(confirm("确定要清空？")) {
                setLogs([]);
                WebDAV.push();
                tbody.innerHTML = "";
                title.innerText = "📜 保存记录 (共 0 条)";
            }
        };

        var closeBtn = document.createElement('button');
        closeBtn.innerText = "关闭";
        closeBtn.onclick = function() { overlay.remove(); };

        btnContainer.appendChild(forceSyncBtn);
        btnContainer.appendChild(clearBtn);
        btnContainer.appendChild(copyBtn);
        btnContainer.appendChild(closeBtn);

        box.appendChild(title);
        box.appendChild(searchInput);
        box.appendChild(contentBox);
        box.appendChild(btnContainer);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    function showWebDAVConfig() {
        const conf = WebDAV.getConfig();
        const url = prompt("WebDAV 地址:", conf.url);
        if (url === null) return;
        const user = prompt("WebDAV 账号:", conf.user);
        if (user === null) return;
        const pass = prompt("WebDAV 密码:", conf.pass);
        if (pass === null) return;

        WebDAV.setConfig({ url, user, pass });
        alert("✅ 配置保存，正在尝试连接...");
        WebDAV.pull();
    }

    // 通用的列表管理函数
    function manageList(listGetter, listSetter, typeName) {
        const list = listGetter();
        let msg = `${typeName}列表:\n`;
        list.forEach((u, i) => msg += `【${i+1}】${u.name}\n`);
        const input = prompt(msg + "\n输入序号删除:");
        if (input) {
            const index = parseInt(input) - 1;
            if (index >= 0 && index < list.length) {
                list.splice(index, 1);
                listSetter(list);
                WebDAV.push();
                alert(`✅ 已从${typeName}移除`);
                location.reload();
            }
        }
    }

    function registerMenus() {
        // --- 屏蔽逻辑 (Red) ---
        GM_registerMenuCommand("🚫 屏蔽当前分享者 (红名单)", function() {
            const currentUser = getTargetSharerInfo();
            if (!currentUser) { alert("页面未加载完成"); return; }

            const blockedList = getBlockedList();
            const warningList = getWarningList();

            // 1. 检查是否已经在屏蔽列表
            if (blockedList.some(u => u.name === currentUser.name && u.hash === currentUser.hash)) {
                alert(`⛔ 该用户 [${currentUser.name}] 已经在屏蔽列表中了。`);
                return;
            }

            // 2. 检查是否在警告列表 (冲突处理)
            const warningIndex = warningList.findIndex(u => u.name === currentUser.name && u.hash === currentUser.hash);
            if (warningIndex !== -1) {
                // 已警告 -> 添加屏蔽
                // 选项1继续警告(Cancel) 2升级为屏蔽(OK)
                if (confirm(`⚠️ 该用户 [${currentUser.name}] 当前在【警告列表】中。\n\n是否将其【升级为屏蔽】？\n(确定=升级屏蔽，取消=保持警告)`)) {
                    // 移除警告
                    warningList.splice(warningIndex, 1);
                    setWarningList(warningList);
                    // 添加屏蔽
                    blockedList.push(currentUser);
                    setBlockedList(blockedList);
                    WebDAV.push();
                    alert(`✅ 已升级为屏蔽: ${currentUser.name}`);
                    location.reload();
                }
                return;
            }

            // 3. 正常添加屏蔽
            blockedList.push(currentUser);
            setBlockedList(blockedList);
            WebDAV.push();
            if(confirm(`⛔ 已屏蔽: ${currentUser.name}\n刷新？`)) location.reload();
        });

        // --- 警告逻辑 (Orange) ---
        GM_registerMenuCommand("⚠️ 警告当前分享者 (橙名单)", function() {
            const currentUser = getTargetSharerInfo();
            if (!currentUser) { alert("页面未加载完成"); return; }

            const blockedList = getBlockedList();
            const warningList = getWarningList();

            // 1. 检查是否已经在警告列表
            if (warningList.some(u => u.name === currentUser.name && u.hash === currentUser.hash)) {
                alert(`⚠️ 该用户 [${currentUser.name}] 已经在警告列表中了。`);
                return;
            }

            // 2. 检查是否在屏蔽列表 (冲突处理)
            const blockedIndex = blockedList.findIndex(u => u.name === currentUser.name && u.hash === currentUser.hash);
            if (blockedIndex !== -1) {
                // 已屏蔽 -> 添加警告
                // 选项1继续屏蔽(Cancel) 2切换为警告(OK)
                if (confirm(`⛔ 该用户 [${currentUser.name}] 当前在【屏蔽列表】中。\n\n是否将其【降级为警告】？\n(确定=切换为警告，取消=保持屏蔽)`)) {
                    // 移除屏蔽
                    blockedList.splice(blockedIndex, 1);
                    setBlockedList(blockedList);
                    // 添加警告
                    warningList.push(currentUser);
                    setWarningList(warningList);
                    WebDAV.push();
                    alert(`✅ 已切换为警告: ${currentUser.name}`);
                    location.reload();
                }
                return;
            }

            // 3. 正常添加警告
            warningList.push(currentUser);
            setWarningList(warningList);
            WebDAV.push();
            alert(`⚠️ 已加入警告观察列表: ${currentUser.name}\n下次遇到此人会自动保存，但会有弹窗提示。`);
        });

        GM_registerMenuCommand("⚙️ 管理屏蔽列表 (Red)", function() {
            manageList(getBlockedList, setBlockedList, "屏蔽");
        });

        GM_registerMenuCommand("⚙️ 管理警告列表 (Orange)", function() {
            manageList(getWarningList, setWarningList, "警告");
        });

        GM_registerMenuCommand("📜 查看日志", showLogViewer);
        GM_registerMenuCommand("☁️ WebDAV 设置", showWebDAVConfig);
    }

    registerMenus();

    // ============================================================
    // 5. 主程序执行
    // ============================================================

    function executeSaveAction(currentUser) {
        console.log("[夸克懒得点] 执行转存...");

        var checkboxElement = document.querySelector('.ant-checkbox-input');
        try { if (checkboxElement && !checkboxElement.checked) checkboxElement.click(); } catch (e) {}

        var saveButtonElement = document.querySelector('.share-save');
        if (saveButtonElement) {
            if (currentUser) recordLog(currentUser);
            saveButtonElement.click();
        } else {
            var saveButtonElement2 = document.querySelector('.file-info_r');
            if (saveButtonElement2) {
                if (currentUser) recordLog(currentUser);
                saveButtonElement2.click();
            }
        }

        setTimeout(function() {
            var confirmButtonElement = document.querySelector('.confirm-btn');
            if (confirmButtonElement) confirmButtonElement.click();

            var intervalId = setInterval(function() {
                var viewButtonElement = document.querySelector('.path');
                if (viewButtonElement) {
                    viewButtonElement.click();
                    clearInterval(intervalId);
                }
            }, 1000);
        }, 1000);
    }

    if (window.location.href.startsWith("https://pan.quark.cn/s/")) {
        window.onload = function() {
            WebDAV.pull(() => {
                setTimeout(function() {
                    const currentUser = getTargetSharerInfo();

                    if (currentUser) {
                        // 1. 检查屏蔽列表 (优先级最高)
                        const blockedList = getBlockedList();
                        if (blockedList.some(u => u.name === currentUser.name && u.hash === currentUser.hash)) {
                            console.warn(`[夸克懒得点] 已屏蔽: ${currentUser.name}`);
                            showBlockedOverlay(currentUser);
                            return; // 直接终止
                        }

                        // 2. 检查警告列表 (优先级次之)
                        const warningList = getWarningList();
                        if (warningList.some(u => u.name === currentUser.name && u.hash === currentUser.hash)) {
                            console.warn(`[夸克懒得点] 警告用户: ${currentUser.name}`);
                            showWarningToast(currentUser); // 显示提示，但继续往下执行
                        }
                    }

                    const currentUrl = window.location.href;
                    const logs = getLogs();
                    const existingLog = logs.find(l => l.url === currentUrl);

                    if (existingLog) {
                        console.warn("[夸克懒得点] 检测到重复链接，暂停保存");
                        showDuplicateOverlay(existingLog, function() {
                            executeSaveAction(currentUser);
                        });
                        return;
                    }

                    executeSaveAction(currentUser);

                }, 1000);
            });
        };
    }

    if (window.location.href.startsWith("https://pan.quark.cn/list")) {
        window.onload = function() {
            setTimeout(function() {
                var checkboxElement = document.querySelector('.ant-checkbox-wrapper');
                try { if(checkboxElement) checkboxElement.click(); } catch (error) {}
            }, 1000);
        };
    }

})();