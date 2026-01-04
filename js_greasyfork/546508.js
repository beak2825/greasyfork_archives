// ==UserScript==
// @name         Pindiy论坛自动回复助手
// @namespace    Pindiy论坛自动回复助手
// @version      1.3
// @description  论坛自动回复，表单加载完成即回复，每个帖子仅回复一次，不同帖子间隔30秒
// @author       Circle
// @match        https://www.pindiy.com/thread-*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546508/Pindiy%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/546508/Pindiy%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const CONFIG = {
        // 预设评论列表
        presetComments: [
            "Thank  you  very  much  for  sharing！",
            "so cool, I like it.",
            "Thx for sharing.",
            "Thank you very much!",
            "Thank you! :)",
            "(❁´◡`❁)Great detailed tutorial!"
        ],
        // 回复间隔时间（毫秒）
        replyInterval: 30000,
        // 防重复评论的存储天数
        storeDays: 30
    };

    // 存储键名
    const STORAGE_KEYS = {
        repliedThreads: 'pindiy_replied_threads',
        settings: 'pindiy_auto_reply_settings',
        autoReplyEnabled: 'pindiy_auto_reply_enabled',
        lastReplyTime: 'pindiy_last_reply_time'
    };



    // 获取上次回复时间
    function getLastReplyTime() {
        return GM_getValue(STORAGE_KEYS.lastReplyTime, 0);
    }

    // 设置上次回复时间
    function setLastReplyTime(timestamp) {
        GM_setValue(STORAGE_KEYS.lastReplyTime, timestamp);
    }

    // 获取当前线程ID
    function getCurrentThreadId() {
        const urlMatch = window.location.href.match(/thread-(\d+)/);
        return urlMatch ? urlMatch[1] : null;
    }

    // 检查是否已回复过该帖子
    function hasRepliedBefore(threadId) {
        const repliedThreads = JSON.parse(GM_getValue(STORAGE_KEYS.repliedThreads, '{}'));
        const threadData = repliedThreads[threadId];

        if (!threadData) return false;

        // 检查是否在有效期内
        const now = Date.now();
        const expireTime = threadData.timestamp + (CONFIG.storeDays * 24 * 60 * 60 * 1000);

        if (now > expireTime) {
            // 过期了，删除记录
            delete repliedThreads[threadId];
            GM_setValue(STORAGE_KEYS.repliedThreads, JSON.stringify(repliedThreads));
            return false;
        }

        return true;
    }

    // 记录已回复的帖子
    function markAsReplied(threadId, comment) {
        const repliedThreads = JSON.parse(GM_getValue(STORAGE_KEYS.repliedThreads, '{}'));
        repliedThreads[threadId] = {
            timestamp: Date.now(),
            comment: comment,
            url: window.location.href
        };
        GM_setValue(STORAGE_KEYS.repliedThreads, JSON.stringify(repliedThreads));
    }

    // 随机选择一条预设评论
    function getRandomComment() {
        const comments = CONFIG.presetComments;
        if (comments.length === 0) return '';
        return comments[Math.floor(Math.random() * comments.length)];
    }



    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'auto-reply-panel';

        // 生成预设评论列表的HTML
        const presetCommentsHtml = CONFIG.presetComments.map((comment, index) => `
            <div style="margin-bottom: 8px;">
                <label style="display: flex; align-items: center; padding: 8px;
                             background: #f8f9fa; border-radius: 4px; cursor: pointer;
                             transition: background-color 0.2s;">
                    <input type="radio" name="preset-comment" value="${index}"
                           style="margin-right: 8px;" ${index === 0 ? 'checked' : ''}>
                    <span style="font-size: 13px; line-height: 1.4;">${comment}</span>
                </label>
            </div>
        `).join('');

        panel.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; z-index: 10000;
                        background: #fff; border: 2px solid #007acc; border-radius: 8px;
                        padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        font-family: Arial, sans-serif; min-width: 320px; max-width: 400px;">
                <h3 style="margin: 0 0 15px 0; color: #007acc; font-size: 16px; text-align: center;">
                    🤖 自动回复助手 (即时回复)
                </h3>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">
                        选择评论模式:
                    </label>
                    <select id="comment-mode" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="random">随机选择评论</option>
                        <option value="selected">使用选中评论</option>
                    </select>
                </div>

                <div id="preset-comments-section" style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">
                        预设评论列表:
                    </label>
                    <div style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd;
                               border-radius: 4px; padding: 8px;">
                        ${presetCommentsHtml}
                    </div>
                    <div style="margin-top: 5px; font-size: 11px; color: #666; text-align: center;">
                        共 ${CONFIG.presetComments.length} 条预设评论
                    </div>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                    <button id="manual-reply-btn" style="flex: 1; padding: 8px; background: #28a745;
                           color: white; border: none; border-radius: 4px; cursor: pointer;">
                        立即回复
                    </button>
                    <button id="preview-comment-btn" style="flex: 1; padding: 8px; background: #17a2b8;
                           color: white; border: none; border-radius: 4px; cursor: pointer;">
                        预览评论
                    </button>
                </div>

                <div style="display: flex; gap: 8px;">
                    <button id="clear-history-btn" style="flex: 1; padding: 8px; background: #ffc107;
                           color: #212529; border: none; border-radius: 4px; cursor: pointer;">
                        清除历史
                    </button>
                    <button id="refresh-comments-btn" style="flex: 1; padding: 8px; background: #6c757d;
                           color: white; border: none; border-radius: 4px; cursor: pointer;">
                        刷新列表
                    </button>
                </div>

                <div id="status-info" style="margin-top: 10px; padding: 8px; background: #f8f9fa;
                     border-radius: 4px; font-size: 12px; color: #666;">
                    状态: 即时回复模式已启用
                </div>

                <div id="preview-area" style="margin-top: 10px; padding: 8px; background: #e9ecef;
                     border-radius: 4px; font-size: 12px; color: #495057; display: none;">
                    <strong>当前将发送:</strong> <span id="preview-text"></span>
                </div>

                <button id="close-panel" style="position: absolute; top: 5px; right: 8px;
                        background: none; border: none; font-size: 18px; cursor: pointer;
                        color: #999; font-weight: bold;">×</button>
            </div>
        `;

        document.body.appendChild(panel);

        // 打开面板时，若当前帖子已回复过，则在状态栏显示提示
        try {
            const threadId = getCurrentThreadId();
            if (threadId && hasRepliedBefore(threadId)) {
                const repliedThreads = JSON.parse(GM_getValue(STORAGE_KEYS.repliedThreads, '{}'));
                const info = repliedThreads[threadId];
                if (info && info.timestamp) {
                    updateStatus(`该帖子已在 ${new Date(info.timestamp).toLocaleString()} 回复过`, 'warning');
                } else {
                    updateStatus('该帖子已回复过', 'warning');
                }
            }
        } catch (err) {
            // 忽略检查错误
        }

        // 绑定事件
        bindPanelEvents();
    }

    // 绑定面板事件
    function bindPanelEvents() {
        const commentMode = document.getElementById('comment-mode');
        const manualReplyBtn = document.getElementById('manual-reply-btn');
        const previewBtn = document.getElementById('preview-comment-btn');
        const clearHistoryBtn = document.getElementById('clear-history-btn');
        const refreshBtn = document.getElementById('refresh-comments-btn');
        const closeBtn = document.getElementById('close-panel');

        // 评论模式切换
        commentMode.addEventListener('change', function() {
            updatePreview();
        });

        // 预设评论选择
        const radioButtons = document.querySelectorAll('input[name="preset-comment"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', updatePreview);
        });

        // 预览评论按钮
        previewBtn.addEventListener('click', function() {
            updatePreview(true);
        });

        // 立即回复按钮
        manualReplyBtn.addEventListener('click', function() {
            const comment = getSelectedComment();
            if (comment) {
                performReply(comment, true); // 手动回复跳过时间检查
            }
        });

        // 清除历史按钮
        clearHistoryBtn.addEventListener('click', function() {
            if (confirm('确定要清除所有回复历史记录吗？')) {
                GM_setValue(STORAGE_KEYS.repliedThreads, '{}');
            }
        });

        // 刷新评论列表按钮
        refreshBtn.addEventListener('click', function() {
            // 重新创建面板以刷新评论列表
            document.getElementById('auto-reply-panel').remove();
            createControlPanel();
        });

        // 关闭面板
        closeBtn.addEventListener('click', function() {
            document.getElementById('auto-reply-panel').remove();
        });

        // 初始预览
        updatePreview();
    }

    // 预览更新函数
    function updatePreview(showArea = false) {
        const previewArea = document.getElementById('preview-area');
        const previewText = document.getElementById('preview-text');

        if (!previewArea || !previewText) return;

        const comment = getSelectedComment();
        if (comment) {
            previewText.textContent = comment;
            if (showArea) {
                previewArea.style.display = 'block';
                setTimeout(() => {
                    previewArea.style.display = 'none';
                }, 3000);
            }
        }
    }

    // 获取选中的评论内容
    function getSelectedComment() {
        const commentMode = document.getElementById('comment-mode');
        if (!commentMode) return getRandomComment();

        if (commentMode.value === 'random') {
            return getRandomComment();
        } else {
            // 获取选中的预设评论
            const selectedRadio = document.querySelector('input[name="preset-comment"]:checked');
            if (selectedRadio) {
                const index = parseInt(selectedRadio.value);
                return CONFIG.presetComments[index];
            }
            return getRandomComment(); // 兜底方案
        }
    }

    // 更新状态信息
    function updateStatus(message, type = 'info') {
        const statusElement = document.getElementById('status-info');
        if (statusElement) {
            const colors = {
                info: '#666',
                success: '#28a745',
                error: '#dc3545',
                warning: '#ffc107'
            };

            statusElement.textContent = `状态: ${message}`;
            statusElement.style.color = colors[type] || colors.info;
        }
    }

    // 执行回复操作
    function performReply(comment, skipTimeCheck = false) {
        const threadId = getCurrentThreadId();

        if (!threadId) {
            updateStatus('无法获取帖子ID', 'error');
            return;
        }

        if (hasRepliedBefore(threadId)) {
            return;
        }

        // 检查时间间隔（手动回复时跳过检查）
        if (!skipTimeCheck) {
            const now = Date.now();
            const lastReplyTime = getLastReplyTime();
            const timeDiff = now - lastReplyTime;

            if (timeDiff < CONFIG.replyInterval) {
                const remainingTime = Math.ceil((CONFIG.replyInterval - timeDiff) / 1000);
                updateStatus(`需等待 ${remainingTime} 秒后才能回复`, 'warning');
                return;
            }
        }

        const messageInput = document.getElementById('vmessage');
        const submitBtn = document.getElementById('vreplysubmit');

        if (!messageInput || !submitBtn) {
            updateStatus('找不到回复表单', 'error');
            return;
        }

        // 填充评论内容
        messageInput.value = comment;
        messageInput.style.color = '#000';

        setTimeout(() => {
            try {
                submitBtn.click();
                markAsReplied(threadId, comment);
                setLastReplyTime(Date.now());
                updateStatus('回复发送成功!', 'success');

                // 回复成功后自动返回顶部
                setTimeout(() => {
                    window.scrollTo('0','0');
                }, 1500);

            } catch (error) {
                updateStatus('回复发送失败', 'error');
                console.error('[自动回复] 自动回复错误:', error);
            }
        }, 1000);
    }



    // 检查并执行自动回复（表单加载完成后立即执行）
    function checkAndAutoReply() {
        const threadId = getCurrentThreadId();

        if (!threadId) return;

        // 检查是否已回复过该帖子
        if (hasRepliedBefore(threadId)) return;

        // 检查时间间隔
        const now = Date.now();
        const lastReplyTime = getLastReplyTime();
        const timeDiff = now - lastReplyTime;

        if (timeDiff < CONFIG.replyInterval) {
            const remainingTime = CONFIG.replyInterval - timeDiff;
            // 设置延迟执行
            setTimeout(() => {
                checkAndAutoReply();
            }, remainingTime);
            return;
        }

        // 立即执行回复
        const comment = getRandomComment();
        if (comment) {
            performReply(comment);
        }
    }

    // 创建快捷按钮
    function createQuickButton() {
        const quickBtn = document.createElement('button');
        quickBtn.innerHTML = '🤖';
        quickBtn.title = '打开自动回复面板';
        quickBtn.style.cssText = `
            position: fixed;
            top: 50%;
            right: 10px;
            z-index: 9999;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: #007acc;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 18px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;

        quickBtn.addEventListener('click', function() {
            const panel = document.getElementById('auto-reply-panel');
            if (panel) {
                // 如果面板已存在，则切换其显示状态
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            } else {
                // 如果面板不存在，则创建它
                createControlPanel();
            }
        });

        quickBtn.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1)';
        });

        quickBtn.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });

        document.body.appendChild(quickBtn);
    }

    // 初始化
    function init() {
        // 检查是否在帖子页面
        const threadId = getCurrentThreadId();
        if (!threadId) return;

        // 检查是否存在快速回复表单
        const replyForm = document.getElementById('vfastpostform');
        if (!replyForm) {
            // 如果表单不存在，等待一段时间后重试
            setTimeout(init, 500);
            return;
        }

        // 创建快捷按钮
        createQuickButton();

        // 表单加载完成后立即检查并执行自动回复
        setTimeout(() => {
            checkAndAutoReply();
        }, 500); // 给表单一点时间完全加载
    }

    // 注册油猴菜单
    GM_registerMenuCommand('打开自动回复面板', function() {
        if (!document.getElementById('auto-reply-panel')) {
            createControlPanel();
        }
    });

    GM_registerMenuCommand('清除回复历史', function() {
        if (confirm('确定要清除所有回复历史记录吗？')) {
            GM_setValue(STORAGE_KEYS.repliedThreads, '{}');
            alert('回复历史已清除！');
        }
    });

    // 启动脚本 - 立即尝试初始化
    init();

})();