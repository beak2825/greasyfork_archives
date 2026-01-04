// ==UserScript==
// @name         岐黄天使刷课助手 - 远程同步模块
// @namespace    http://tampermonkey.net/qhtx-modules
// @version      1.3.0
// @description  岐黄天使刷课助手的远程同步模块，负责与远程服务器同步题库和配置信息。
// @author       AI助手
// ==/UserScript==

// 远程同步模块
(function() {
    'use strict';

    // 同步远程题库
    window.syncRemoteQuestionBank = function() {
        // 如果已经在同步中，则不重复执行
        if (window.qh.isSyncing) {
            console.log('题库同步已在进行中，跳过本次同步');
            return;
        }

        // 检查是否启用远程题库
        if (!window.qh.remoteQuestionBankConfig.enabled) {
            console.log('远程题库功能未启用，跳过同步');
            return;
        }

        // 检查是否需要同步（根据上次同步时间和同步间隔）
        const now = Date.now();
        const lastSyncTime = window.qh.remoteQuestionBankConfig.lastSyncTime || 0;
        const syncInterval = window.qh.remoteQuestionBankConfig.syncInterval || 3600000; // 默认1小时

        if (now - lastSyncTime < syncInterval) {
            console.log('距离上次同步时间不足，跳过本次同步');
            return;
        }

        // 设置同步状态
        window.qh.isSyncing = true;
        updateStatus('正在同步远程题库...');

        // 获取远程题库
        fetchRemoteQuestionBank();
    };

    // 获取远程题库
    function fetchRemoteQuestionBank(retryCount = 0) {
        try {
            const url = window.qh.remoteQuestionBankConfig.url;
            if (!url) {
                console.error('远程题库URL未设置');
                window.qh.isSyncing = false;
                updateStatus('远程题库URL未设置');
                return;
            }

            console.log('开始获取远程题库:', url);

            // 检查是否为HTTPS页面访问HTTP资源（混合内容问题）
            const isHttpsPage = window.location.protocol === 'https:';
            const isHttpResource = url.startsWith('http:');

            if (isHttpsPage && isHttpResource) {
                console.log('检测到混合内容问题，尝试使用本地存储的题库');

                // 如果有本地题库，直接使用
                if (window.qh.savedQuestionBank && window.qh.savedQuestionBank.length > 0) {
                    console.log('使用本地题库，题目数量:', window.qh.savedQuestionBank.length);

                    // 更新同步时间
                    window.qh.remoteQuestionBankConfig.lastSyncTime = Date.now();
                    GM_setValue('qh-remote-question-bank-config', window.qh.remoteQuestionBankConfig);

                    // 更新状态
                    updateStatus(`使用本地题库，共 ${window.qh.savedQuestionBank.length} 道题目`);

                    // 重置同步状态
                    window.qh.isSyncing = false;
                    return;
                }

                // 如果没有本地题库，提示用户
                console.warn('由于HTTPS安全限制，无法从HTTP服务器获取题库');
                updateStatus('由于安全限制，无法从HTTP服务器获取题库');
                window.qh.isSyncing = false;
                return;
            }

            // 使用fetch API获取远程题库
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应不正常: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('成功获取远程题库，题目数量:', data.length);
                    mergeQuestionBanks(data);
                })
                .catch(error => {
                    console.error('获取远程题库失败:', error);

                    // 如果是混合内容错误，尝试使用本地题库
                    if (error.message && (
                        error.message.includes('Mixed Content') ||
                        error.message.includes('blocked:mixed') ||
                        error.message.includes('Failed to fetch')
                    )) {
                        console.log('检测到混合内容错误，尝试使用本地题库');

                        // 如果有本地题库，直接使用
                        if (window.qh.savedQuestionBank && window.qh.savedQuestionBank.length > 0) {
                            console.log('使用本地题库，题目数量:', window.qh.savedQuestionBank.length);

                            // 更新同步时间
                            window.qh.remoteQuestionBankConfig.lastSyncTime = Date.now();
                            GM_setValue('qh-remote-question-bank-config', window.qh.remoteQuestionBankConfig);

                            // 更新状态
                            updateStatus(`使用本地题库，共 ${window.qh.savedQuestionBank.length} 道题目`);

                            // 重置同步状态
                            window.qh.isSyncing = false;
                            return;
                        }
                    }

                    // 重试逻辑
                    const maxRetries = window.qh.remoteQuestionBankConfig.maxRetries || 3;
                    const retryDelay = window.qh.remoteQuestionBankConfig.retryDelay || 5000;

                    if (retryCount < maxRetries) {
                        console.log(`将在 ${retryDelay/1000} 秒后进行第 ${retryCount + 1} 次重试`);
                        updateStatus(`远程题库同步失败，将在 ${retryDelay/1000} 秒后重试...`);

                        setTimeout(() => {
                            fetchRemoteQuestionBank(retryCount + 1);
                        }, retryDelay);
                    } else {
                        console.error(`已达到最大重试次数 ${maxRetries}，同步失败`);
                        window.qh.isSyncing = false;
                        updateStatus('远程题库同步失败，请检查网络连接');
                    }
                });
        } catch (e) {
            console.error('获取远程题库出错:', e);
            window.qh.isSyncing = false;
            updateStatus('远程题库同步出错: ' + e.message);
        }
    }

    // 合并题库
    function mergeQuestionBanks(remoteQuestions) {
        try {
            if (!remoteQuestions || !Array.isArray(remoteQuestions)) {
                console.error('远程题库格式不正确');
                window.qh.isSyncing = false;
                updateStatus('远程题库格式不正确');
                return;
            }

            // 统计新增和更新的题目数量
            let newCount = 0;
            let updatedCount = 0;

            // 合并题库
            remoteQuestions.forEach(remoteQuestion => {
                // 检查题目是否已存在
                const existingIndex = window.qh.savedQuestionBank.findIndex(q => q.id === remoteQuestion.id);

                if (existingIndex === -1) {
                    // 新题目
                    window.qh.savedQuestionBank.push(remoteQuestion);
                    newCount++;
                } else {
                    // 更新已有题目
                    const existingQuestion = window.qh.savedQuestionBank[existingIndex];

                    // 只有在远程题目有答案且本地题目没有答案，或者远程题目更新时间更新时才更新
                    if ((!existingQuestion.answer && remoteQuestion.answer) ||
                        (remoteQuestion.updateTime && (!existingQuestion.updateTime || remoteQuestion.updateTime > existingQuestion.updateTime))) {
                        window.qh.savedQuestionBank[existingIndex] = remoteQuestion;
                        updatedCount++;
                    }
                }
            });

            // 保存合并后的题库
            GM_setValue('qh-question-bank', window.qh.savedQuestionBank);

            // 更新同步时间
            window.qh.remoteQuestionBankConfig.lastSyncTime = Date.now();
            GM_setValue('qh-remote-question-bank-config', window.qh.remoteQuestionBankConfig);

            // 更新状态
            console.log(`题库同步完成: 新增 ${newCount} 道题目, 更新 ${updatedCount} 道题目, 总计 ${window.qh.savedQuestionBank.length} 道题目`);
            updateStatus(`题库同步完成: 新增 ${newCount} 道题目, 更新 ${updatedCount} 道题目`);

            // 更新题库状态显示
            const statusElement = document.getElementById('qh-question-status');
            if (statusElement) {
                statusElement.textContent = `题库状态: 已保存 ${window.qh.savedQuestionBank.length} 道题目`;
            }

            // 重置同步状态
            window.qh.isSyncing = false;
        } catch (e) {
            console.error('合并题库出错:', e);
            window.qh.isSyncing = false;
            updateStatus('合并题库出错: ' + e.message);
        }
    }

    // 上传题库
    window.uploadQuestionBank = function() {
        // 检查是否启用远程题库上传
        if (!window.qh.remoteQuestionBankConfig.enabled || !window.qh.remoteQuestionBankConfig.uploadEnabled) {
            console.log('远程题库上传功能未启用，跳过上传');
            return;
        }

        // 检查题库是否为空
        if (!window.qh.savedQuestionBank || window.qh.savedQuestionBank.length === 0) {
            console.log('本地题库为空，跳过上传');
            return;
        }

        try {
            const url = window.qh.remoteQuestionBankConfig.url;
            if (!url) {
                console.error('远程题库URL未设置');
                return;
            }

            // 检查是否为HTTPS页面访问HTTP资源（混合内容问题）
            const isHttpsPage = window.location.protocol === 'https:';
            const isHttpResource = url.startsWith('http:');

            if (isHttpsPage && isHttpResource) {
                console.warn('由于HTTPS安全限制，无法上传题库到HTTP服务器');
                updateStatus('由于安全限制，无法上传题库');

                // 提示用户可以导出题库
                if (confirm('由于浏览器安全限制，无法直接上传题库到HTTP服务器。是否要导出题库到本地？')) {
                    exportQuestionBank();
                }
                return;
            }

            console.log('开始上传题库:', url);
            updateStatus('正在上传题库...');

            // 使用fetch API上传题库
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(window.qh.savedQuestionBank)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应不正常: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('题库上传成功:', data);
                    updateStatus('题库上传成功');
                })
                .catch(error => {
                    console.error('题库上传失败:', error);

                    // 如果是混合内容错误，提示用户
                    if (error.message && (
                        error.message.includes('Mixed Content') ||
                        error.message.includes('blocked:mixed') ||
                        error.message.includes('Failed to fetch')
                    )) {
                        console.warn('由于HTTPS安全限制，无法上传题库到HTTP服务器');
                        updateStatus('由于安全限制，无法上传题库');

                        // 提示用户可以导出题库
                        if (confirm('由于浏览器安全限制，无法直接上传题库到HTTP服务器。是否要导出题库到本地？')) {
                            exportQuestionBank();
                        }
                    } else {
                        updateStatus('题库上传失败: ' + error.message);
                    }
                });
        } catch (e) {
            console.error('上传题库出错:', e);
            updateStatus('上传题库出错: ' + e.message);
        }
    };

    // 显示题库管理面板
    window.showQuestionManagePanel = function() {
        try {
            // 检查是否已存在题库管理面板
            if (document.getElementById('qh-question-manage-panel')) {
                document.getElementById('qh-question-manage-panel').style.display = 'block';
                document.getElementById('qh-question-manage-overlay').style.display = 'block';
                return;
            }

            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.className = 'qh-question-overlay';
            overlay.id = 'qh-question-manage-overlay';
            document.body.appendChild(overlay);

            // 创建题库管理面板
            const panel = document.createElement('div');
            panel.className = 'qh-question-panel';
            panel.id = 'qh-question-manage-panel';
            panel.innerHTML = `
                <div class="qh-question-title">
                    题库管理
                    <span class="qh-question-close" id="qh-question-manage-close">×</span>
                </div>
                <div class="qh-question-content" id="qh-question-manage-content">
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: bold; margin-bottom: 10px;">本地题库</div>
                        <div>题目数量: ${window.qh.savedQuestionBank.length} 道</div>
                        <div style="margin-top: 10px;">
                            <button class="qh-question-btn" style="width: 48%;" id="qh-export-btn">导出题库</button>
                            <button class="qh-question-btn" style="width: 48%;" id="qh-import-btn">导入题库</button>
                        </div>
                        <div style="margin-top: 10px;">
                            <button class="qh-question-btn" style="width: 48%;" id="qh-clear-btn">清空题库</button>
                            <button class="qh-question-btn" style="width: 48%;" id="qh-backup-btn">备份题库</button>
                        </div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: bold; margin-bottom: 10px;">远程题库设置</div>
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; margin-bottom: 5px;">远程题库URL:</label>
                            <input type="text" id="qh-remote-url" style="width: 100%; padding: 5px; box-sizing: border-box;" value="${window.qh.remoteQuestionBankConfig.url}">
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label style="display: flex; align-items: center;">
                                <input type="checkbox" id="qh-remote-enabled" ${window.qh.remoteQuestionBankConfig.enabled ? 'checked' : ''}>
                                <span style="margin-left: 5px;">启用远程题库</span>
                            </label>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label style="display: flex; align-items: center;">
                                <input type="checkbox" id="qh-auto-sync" ${window.qh.remoteQuestionBankConfig.autoSync ? 'checked' : ''}>
                                <span style="margin-left: 5px;">自动同步</span>
                            </label>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label style="display: flex; align-items: center;">
                                <input type="checkbox" id="qh-upload-enabled" ${window.qh.remoteQuestionBankConfig.uploadEnabled ? 'checked' : ''}>
                                <span style="margin-left: 5px;">启用上传</span>
                            </label>
                        </div>
                        <div style="margin-top: 10px;">
                            <button class="qh-question-btn" style="width: 48%;" id="qh-sync-btn">立即同步</button>
                            <button class="qh-question-btn" style="width: 48%;" id="qh-upload-btn">立即上传</button>
                        </div>
                    </div>
                </div>
                <div class="qh-question-btns">
                    <button class="qh-question-btn" id="qh-save-settings-btn">保存设置</button>
                </div>
            `;
            document.body.appendChild(panel);

            // 绑定关闭按钮事件
            document.getElementById('qh-question-manage-close').addEventListener('click', function() {
                document.getElementById('qh-question-manage-panel').style.display = 'none';
                document.getElementById('qh-question-manage-overlay').style.display = 'none';
            });

            // 绑定导出题库按钮事件
            document.getElementById('qh-export-btn').addEventListener('click', function() {
                exportQuestionBank();
            });

            // 绑定导入题库按钮事件
            document.getElementById('qh-import-btn').addEventListener('click', function() {
                importQuestionBank();
            });

            // 绑定清空题库按钮事件
            document.getElementById('qh-clear-btn').addEventListener('click', function() {
                clearQuestionBank();
            });

            // 绑定备份题库按钮事件
            document.getElementById('qh-backup-btn').addEventListener('click', function() {
                backupQuestionBank();
            });

            // 绑定立即同步按钮事件
            document.getElementById('qh-sync-btn').addEventListener('click', function() {
                syncRemoteQuestionBank();
            });

            // 绑定立即上传按钮事件
            document.getElementById('qh-upload-btn').addEventListener('click', function() {
                uploadQuestionBank();
            });

            // 绑定保存设置按钮事件
            document.getElementById('qh-save-settings-btn').addEventListener('click', function() {
                saveRemoteSettings();
            });

            // 显示面板
            document.getElementById('qh-question-manage-panel').style.display = 'block';
            document.getElementById('qh-question-manage-overlay').style.display = 'block';
        } catch (e) {
            console.error('显示题库管理面板出错:', e);
        }
    };

    // 导出题库
    function exportQuestionBank() {
        try {
            // 检查题库是否为空
            if (!window.qh.savedQuestionBank || window.qh.savedQuestionBank.length === 0) {
                alert('题库为空，无法导出');
                return;
            }

            // 将题库转换为JSON字符串
            const json = JSON.stringify(window.qh.savedQuestionBank, null, 2);

            // 创建Blob对象
            const blob = new Blob([json], { type: 'application/json' });

            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `qh-question-bank-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();

            // 清理
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);

            alert('题库导出成功');
        } catch (e) {
            console.error('导出题库出错:', e);
            alert('导出题库出错: ' + e.message);
        }
    }

    // 导入题库
    function importQuestionBank() {
        try {
            // 创建文件输入元素
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.style.display = 'none';
            document.body.appendChild(input);

            // 监听文件选择事件
            input.addEventListener('change', function() {
                if (input.files.length === 0) {
                    return;
                }

                const file = input.files[0];
                const reader = new FileReader();

                reader.onload = function(e) {
                    try {
                        const importedQuestions = JSON.parse(e.target.result);

                        if (!Array.isArray(importedQuestions)) {
                            throw new Error('导入的题库格式不正确');
                        }

                        // 合并题库
                        mergeQuestionBanks(importedQuestions);

                        alert(`题库导入成功，当前题库共有 ${window.qh.savedQuestionBank.length} 道题目`);
                    } catch (e) {
                        console.error('解析导入的题库出错:', e);
                        alert('解析导入的题库出错: ' + e.message);
                    }
                };

                reader.onerror = function() {
                    alert('读取文件出错');
                };

                reader.readAsText(file);
            });

            // 触发文件选择对话框
            input.click();

            // 清理
            setTimeout(() => {
                document.body.removeChild(input);
            }, 0);
        } catch (e) {
            console.error('导入题库出错:', e);
            alert('导入题库出错: ' + e.message);
        }
    }

    // 清空题库
    function clearQuestionBank() {
        try {
            if (confirm('确定要清空题库吗？此操作不可恢复！')) {
                // 清空题库
                window.qh.savedQuestionBank = [];
                GM_setValue('qh-question-bank', []);

                // 更新状态
                const statusElement = document.getElementById('qh-question-status');
                if (statusElement) {
                    statusElement.textContent = '题库状态: 题库为空';
                }

                alert('题库已清空');
            }
        } catch (e) {
            console.error('清空题库出错:', e);
            alert('清空题库出错: ' + e.message);
        }
    }

    // 备份题库
    function backupQuestionBank() {
        try {
            // 检查题库是否为空
            if (!window.qh.savedQuestionBank || window.qh.savedQuestionBank.length === 0) {
                alert('题库为空，无法备份');
                return;
            }

            // 创建备份
            const backup = {
                timestamp: Date.now(),
                questions: window.qh.savedQuestionBank
            };

            // 获取现有备份
            let backups = GM_getValue('qh-question-bank-backups', []);

            // 添加新备份
            backups.push(backup);

            // 最多保留10个备份
            if (backups.length > 10) {
                backups = backups.slice(-10);
            }

            // 保存备份
            GM_setValue('qh-question-bank-backups', backups);

            alert(`备份成功，当前共有 ${backups.length} 个备份`);
        } catch (e) {
            console.error('备份题库出错:', e);
            alert('备份题库出错: ' + e.message);
        }
    }

    // 保存远程设置
    function saveRemoteSettings() {
        try {
            // 获取设置
            const url = document.getElementById('qh-remote-url').value.trim();
            const enabled = document.getElementById('qh-remote-enabled').checked;
            const autoSync = document.getElementById('qh-auto-sync').checked;
            const uploadEnabled = document.getElementById('qh-upload-enabled').checked;

            // 更新设置
            window.qh.remoteQuestionBankConfig.url = url;
            window.qh.remoteQuestionBankConfig.enabled = enabled;
            window.qh.remoteQuestionBankConfig.autoSync = autoSync;
            window.qh.remoteQuestionBankConfig.uploadEnabled = uploadEnabled;

            // 保存设置
            GM_setValue('qh-remote-question-bank-config', window.qh.remoteQuestionBankConfig);

            alert('设置已保存');
        } catch (e) {
            console.error('保存远程设置出错:', e);
            alert('保存远程设置出错: ' + e.message);
        }
    }

    // 显示自动化设置面板
    window.showAutoFlowSettingsPanel = function() {
        try {
            // 检查是否已存在自动化设置面板
            if (document.getElementById('qh-auto-flow-panel')) {
                document.getElementById('qh-auto-flow-panel').style.display = 'block';
                document.getElementById('qh-auto-flow-overlay').style.display = 'block';
                return;
            }

            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.className = 'qh-question-overlay';
            overlay.id = 'qh-auto-flow-overlay';
            document.body.appendChild(overlay);

            // 创建自动化设置面板
            const panel = document.createElement('div');
            panel.className = 'qh-question-panel';
            panel.id = 'qh-auto-flow-panel';
            panel.innerHTML = `
                <div class="qh-question-title">
                    自动化设置
                    <span class="qh-question-close" id="qh-auto-flow-close">×</span>
                </div>
                <div class="qh-question-content" id="qh-auto-flow-content">
                    <div style="margin-bottom: 15px;">
                        <div style="margin-bottom: 10px;">
                            <label style="display: flex; align-items: center;">
                                <input type="checkbox" id="qh-auto-flow-enabled" ${window.qh.autoFlowConfig.enabled ? 'checked' : ''}>
                                <span style="margin-left: 5px;">启用自动化流程</span>
                            </label>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label style="display: flex; align-items: center;">
                                <input type="checkbox" id="qh-auto-start-next-course" ${window.qh.autoFlowConfig.autoStartNextCourse ? 'checked' : ''}>
                                <span style="margin-left: 5px;">自动开始下一课程</span>
                            </label>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label style="display: flex; align-items: center;">
                                <input type="checkbox" id="qh-auto-take-exams" ${window.qh.autoFlowConfig.autoTakeExams ? 'checked' : ''}>
                                <span style="margin-left: 5px;">自动参加考试</span>
                            </label>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label style="display: flex; align-items: center;">
                                <input type="checkbox" id="qh-prioritize-incomplete" ${window.qh.autoFlowConfig.prioritizeIncomplete ? 'checked' : ''}>
                                <span style="margin-left: 5px;">优先学习未完成课程</span>
                            </label>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; margin-bottom: 5px;">学习速度:</label>
                            <select id="qh-learning-speed" style="width: 100%; padding: 5px; box-sizing: border-box;">
                                <option value="slow" ${window.qh.autoFlowConfig.learningSpeed === 'slow' ? 'selected' : ''}>慢速</option>
                                <option value="normal" ${window.qh.autoFlowConfig.learningSpeed === 'normal' ? 'selected' : ''}>正常</option>
                                <option value="fast" ${window.qh.autoFlowConfig.learningSpeed === 'fast' ? 'selected' : ''}>快速</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="qh-question-btns">
                    <button class="qh-question-btn" id="qh-save-auto-flow-btn">保存设置</button>
                </div>
            `;
            document.body.appendChild(panel);

            // 绑定关闭按钮事件
            document.getElementById('qh-auto-flow-close').addEventListener('click', function() {
                document.getElementById('qh-auto-flow-panel').style.display = 'none';
                document.getElementById('qh-auto-flow-overlay').style.display = 'none';
            });

            // 绑定保存设置按钮事件
            document.getElementById('qh-save-auto-flow-btn').addEventListener('click', function() {
                saveAutoFlowSettings();
            });

            // 显示面板
            document.getElementById('qh-auto-flow-panel').style.display = 'block';
            document.getElementById('qh-auto-flow-overlay').style.display = 'block';
        } catch (e) {
            console.error('显示自动化设置面板出错:', e);
        }
    };

    // 保存自动化设置
    function saveAutoFlowSettings() {
        try {
            // 获取设置
            const enabled = document.getElementById('qh-auto-flow-enabled').checked;
            const autoStartNextCourse = document.getElementById('qh-auto-start-next-course').checked;
            const autoTakeExams = document.getElementById('qh-auto-take-exams').checked;
            const prioritizeIncomplete = document.getElementById('qh-prioritize-incomplete').checked;
            const learningSpeed = document.getElementById('qh-learning-speed').value;

            // 更新设置
            window.qh.autoFlowConfig.enabled = enabled;
            window.qh.autoFlowConfig.autoStartNextCourse = autoStartNextCourse;
            window.qh.autoFlowConfig.autoTakeExams = autoTakeExams;
            window.qh.autoFlowConfig.prioritizeIncomplete = prioritizeIncomplete;
            window.qh.autoFlowConfig.learningSpeed = learningSpeed;

            // 保存设置
            GM_setValue('qh-auto-flow-config', window.qh.autoFlowConfig);

            // 根据学习速度设置延迟时间
            switch (learningSpeed) {
                case 'slow':
                    window.qh.humanLikeDelay = { min: 3000, max: 6000 };
                    window.qh.autoSubmitDelay = { min: 10000, max: 15000 };
                    break;
                case 'normal':
                    window.qh.humanLikeDelay = { min: 1000, max: 3000 };
                    window.qh.autoSubmitDelay = { min: 5000, max: 10000 };
                    break;
                case 'fast':
                    window.qh.humanLikeDelay = { min: 500, max: 1500 };
                    window.qh.autoSubmitDelay = { min: 2000, max: 5000 };
                    break;
            }

            alert('设置已保存');
        } catch (e) {
            console.error('保存自动化设置出错:', e);
            alert('保存自动化设置出错: ' + e.message);
        }
    }
})();
