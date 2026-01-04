// ==UserScript==
// @name         Comment feedback
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  用于在gitlab上提交评论反馈
// @author       fenghou
// @match        https://gitlab.qima-inc.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532396/Comment%20feedback.user.js
// @updateURL https://update.greasyfork.org/scripts/532396/Comment%20feedback.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const APP_TOKEN = 'S4W7b7pr7aYubvsa9sWcBEBTnxf';
    const API_URL = "https://edp.prod.qima-inc.com/api/feishu/proxy";
    const SUCCESS_MESSAGE = '反馈成功 👍';
    const ERROR_MESSAGE_PREFIX = '提交失败：';
    const WARNING_MESSAGE = '登录态失效，即将跳转登录...';

    // 配置参数
    const LIKE_BUTTON_TEXT = '👍';
    const DISLIKE_BUTTON_TEXT = '👎';
    const LIKE_BUTTON_CLASS = 'custom-like-btn';
    const DISLIKE_BUTTON_CLASS = 'custom-dislike-btn';
    const MODAL_STYLE = `
        .custom-modal-mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .custom-modal-content {
            background: white;
            padding: 16px;
            border-radius: 4px;
            min-width: 400px;
            max-width: 800px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .custom-modal-footer {
            margin-top: 16px;
            text-align: right;
        }
    `;
    const LOADING_STYLE = `
        .custom-loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .custom-loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    const TARGET_AUTHOR = 'fe-ops';
    const TARGET_AVATAR_ALT = 'fe-ops的头像';
    const MESSAGE_STYLE = `
        .custom-notification {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            padding: 12px 20px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
            z-index: 9999;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }
        .custom-notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        .custom-notification.success {
            background: #2ecc40;
        }
        .custom-notification.error {
            background: #ff4136;
        }
        .custom-notification.warning {
            background: #ff851b;
        }
        .custom-notification-icon {
            width: 20px;
            height: 20px;
        }
    `;

    // 创建自定义按钮
    function createCustomButton(commentElement, isLike = false) {
        const btn = document.createElement('span');
        btn.className = `btn-default btn-xs ${isLike ? LIKE_BUTTON_CLASS : DISLIKE_BUTTON_CLASS}`;
        btn.textContent = isLike ? LIKE_BUTTON_TEXT : DISLIKE_BUTTON_TEXT;
        btn.style.marginLeft = '5px';
        btn.style.cursor = 'pointer';

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleButtonClick(commentElement, isLike);
        });

        return btn;
    }

    function handleButtonClick(commentElement, isLike) {
        const { content: commentContent, noteId } = getCommentContent(commentElement);
        createCustomModal(commentContent, isLike).then(userInput => {
            if (userInput) {
                submitFeedback({
                    comment: commentContent,
                    feedback: userInput,
                    isLike,
                    noteId
                });
            }
        });
    }

    // 获取评论内容
    function getCommentContent(commentElement) {
        // 获取包含评论内容的元素
        const contentContainer = commentElement.querySelector('.note-text');
        if (!contentContainer) return { content: '', noteId: '' };
        // 获取 noteId
        const noteId = commentElement.closest('.notes')?.querySelector('[data-note-id]')?.dataset?.noteId || '';

        // 递归获取所有文本内容
        const getNestedText = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent.trim() + ' ';
            }
            return Array.from(node.childNodes).map(getNestedText).join('');
        };
        // 处理多个空白字符和换行
        return {
            content: getNestedText(contentContainer).replace(/\s+/g, ' ').trim(),
            noteId
        };
    }
    function showLoading() {
        const style = document.createElement('style');
        style.textContent = LOADING_STYLE;
        document.head.appendChild(style);

        const loading = document.createElement('div');
        loading.className = 'custom-loading';
        loading.innerHTML = '<div class="custom-loading-spinner"></div>';
        document.body.appendChild(loading);
        return { loading, style };
    }

    function hideLoading(elements) {
        elements.loading.remove();
        elements.style.remove();
    }

    function createNotification(type, text) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️'
        };

        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.innerHTML = `
            <span class="custom-notification-icon">${icons[type]}</span>
            <span>${text}</span>
        `;
        return notification;
    }

    const styleElement = document.createElement('style');
    styleElement.textContent = MESSAGE_STYLE;
    document.head.appendChild(styleElement);

    // 在 showMessage 函数中使用
    function showMessage(type, text, duration = 3000) {
        const notification = createNotification(type, text);
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);

        // 自动消失
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
    // 修改提交反馈部分
    function batchCreateReleaseData(param) {
        return window.axios({
            url: API_URL,
            method: "POST",
            data: {
              url: `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${param.tableId}/records/batch_create`,
              data: {
                records: param.data,
              },
              method: "POST",
            },
            withCredentials: true,
          })
          .then((res) => {
            if (res.status === 200) {
              if (res.data.code === 0) {
                showMessage('success', SUCCESS_MESSAGE);
              } else {
                // showMessage('error', `${ERROR_MESSAGE_PREFIX}${res.data.msg}`);
                showMessage('warning', WARNING_MESSAGE, 2000);
                setTimeout(() => {
                    location.href = 'https://edp.prod.qima-inc.com';
                }, 2000);
              }
            }
          }).catch((e) => {
            if (e.code === 'ERR_NETWORK') {
                showMessage('warning', WARNING_MESSAGE, 2000);
                setTimeout(() => {
                    location.href = 'https://edp.prod.qima-inc.com';
                }, 2000);
            } else {
                showMessage('error', `请求失败：${e.message}`);
            }
          });
    }

    // 提交反馈到API
    // 获取 GitLab 相关信息
    async function getGitLabInfo() {
        // 从 URL 中获取项目信息和 MR ID
        const pathMatch = window.location.pathname.match(/\/([^/]+)\/([^/]+)\/-\/merge_requests\/(\d+)/);
        if (!pathMatch) return null;
        
        const [, namespace, projectName, mrId] = pathMatch;
        const projectPath = `${namespace}/${projectName}`;
        
        try {
            // 获取项目信息
            const projectResponse = await window.axios.get(`https://gitlab.qima-inc.com/api/v4/projects/${encodeURIComponent(projectPath)}`);
            const projectData = projectResponse.data;
            
            // 获取 MR 信息
            const mrResponse = await window.axios.get(`https://gitlab.qima-inc.com/api/v4/projects/${projectData.id}/merge_requests/${mrId}`);
            const mrData = mrResponse.data;
            
            // 获取当前用户信息
            const userResponse = await window.axios.get('https://gitlab.qima-inc.com/api/v4/user');
            const userData = userResponse.data;
            
            return {
                projectId: projectData.id,
                projectName: projectData.name,
                mrId: mrId,
                authorName: mrData.author.name,
                currentUser: userData.name
            };
        } catch (error) {
            console.error('获取 GitLab 信息失败:', error);
            showMessage('error', `获取信息失败: ${error.message}`);
            return null;
        }
    }

    // 修改提交反馈函数
    async function submitFeedback(data) {
        const loadingElements = showLoading();
        try {
            const {comment, feedback, isLike, noteId} = data;
            // 使用新的正则表达式匹配完整格式
            let targetHash, newLineNumber, oldLineNumber;
            const fullMatch = comment.match(/\[([A-Za-z0-9]{16})\]\[(\d*)\]\[(\d*)\]/);
            if (fullMatch) {
                // 如果完整匹配成功，使用完整的信息
                targetHash = fullMatch[1];
                newLineNumber = fullMatch[2];
                oldLineNumber = fullMatch[3];
            } else {
                // 降级匹配：只匹配 hash 部分
                const simpleMatch = comment.match(/([A-Za-z0-9]{16})/);
                targetHash = simpleMatch ? simpleMatch[0] : '未找到标识符';
                newLineNumber = '';
                oldLineNumber = '';
            }
            
            // 获取 GitLab 相关信息
            const gitlabInfo = await getGitLabInfo();
            
            const day = 60 * 60 * 24 * 1000;
            const today = window.dayjs(new Date() - day * 1).format('YYYY-MM-DD');
            const records = [{
                fields: {
                    '唯一标识': targetHash,
                    '评论原文': comment,
                    [isLike ? '好评原因' : '差评原因']: feedback,
                    '反馈日期': today,
                    '审查标识': gitlabInfo ? String(gitlabInfo.mrId) : '未知',
                    '工程标识': gitlabInfo ? String(gitlabInfo.projectId) : '未知',
                    '工程名称': gitlabInfo ? gitlabInfo.projectName : '未知',
                    '审查提交人': gitlabInfo ? gitlabInfo.authorName : '未知',
                    '反馈人': gitlabInfo ? gitlabInfo.currentUser : '未知',
                    '新行号': newLineNumber,
                    '旧行号': oldLineNumber,
                    '链接': {
                        "link": window.location.href.split('#')[0] + `#note_${noteId}`,
                        "text": "点击跳转"
                    }
                }
            }];

            await batchCreateReleaseData({
                tableId: isLike ? 'tblhsrBtcfD9USch' : 'tblJYpW8ctnYMrqN',
                data: records
            });
        } finally {
            hideLoading(loadingElements);
        }
    }

    // 新增自定义弹窗函数
    function createCustomModal(commentContent, isLike) {
        return new Promise(resolve => {
            const mask = document.createElement('div');
            mask.className = 'custom-modal-mask';

            const modal = document.createElement('div');
            modal.className = 'custom-modal-content';

            // 样式注入
            const style = document.createElement('style');
            style.textContent = MODAL_STYLE;

            // 弹窗内容
            modal.innerHTML = `
                <div class="gl-font-weight-bold gl-mb-4" style="font-size: 16px;">
                    ${isLike ? '👍' : '🚨'} 请针对此AI评论的内容，给出${isLike ? '好评' : '意见'}（采纳后，后续AI会根据您的意见，进行修改）
                </div>
                <div class="gl-form-group">
                    <label class="gl-form-label gl-text-gray-600">AI评论内容：</label>
                    <div class="gl-mb-3" style="color: #666; background: #f5f5f5; padding: 8px; border-radius: 4px;">
                        ${commentContent || '无内容'}
                    </div>
                    <label class="gl-form-label gl-text-gray-600">您的${isLike ? '好评' : '反馈'}意见：</label>
                    <textarea id="custom-input"
                        class="gl-form-input"
                        rows="3"
                        placeholder="请在此输入您的专业意见（至少20字）"
                        style="width: 100%; margin: 8px 0;"></textarea>
                </div>
                <div class="custom-modal-footer">
                    <button class="gl-button btn btn-default btn-md gl-mr-3" id="custom-cancel">取消</button>
                    <button class="gl-button btn btn-confirm btn-md" id="custom-submit">确定</button>
                </div>
            `;

            // 事件处理
            const cleanup = () => {
                mask.remove();
                style.remove();
            };

            modal.querySelector('#custom-cancel').addEventListener('click', () => {
                cleanup();
                resolve(null);
            });

            modal.querySelector('#custom-submit').addEventListener('click', () => {
                const input = modal.querySelector('#custom-input').value.trim();
                cleanup();
                resolve(input || null);
            });

            // 添加到页面
            document.body.appendChild(style);
            mask.appendChild(modal);
            document.body.appendChild(mask);

            // 自动聚焦输入框
            modal.querySelector('#custom-input').focus();
        });
    }

    // 新增作者检测函数
    function isFeOpsComment(commentElement) {
        return commentElement.querySelector('.note-header-author-name')?.textContent?.trim() === TARGET_AUTHOR;
    }

    // 修改初始化函数
    function init() {
        // 添加结构验证
        const sampleComment = document.querySelector('.notes');
        if (!sampleComment || !sampleComment.querySelector('.note-text')) {
            console.warn('GitLab DOM结构可能已更新，请检查选择器');
            return;
        }

        document.querySelectorAll('.note-actions').forEach(actionsContainer => {
            const commentElement = actionsContainer.closest('.notes');
            const headerElement = commentElement.querySelector('.note-header');

            // 仅当是fe-ops的评论且没有已存在按钮时添加
            if (isFeOpsComment(headerElement)) {
                if (!actionsContainer.querySelector(`.${LIKE_BUTTON_CLASS}`)) {
                    actionsContainer.appendChild(createCustomButton(commentElement, true));
                }
                if (!actionsContainer.querySelector(`.${DISLIKE_BUTTON_CLASS}`)) {
                    actionsContainer.appendChild(createCustomButton(commentElement, false));
                }
            }
        });
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(mutations => {
        init();
    });

    // 开始观察目标节点
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行
    init();
})();

