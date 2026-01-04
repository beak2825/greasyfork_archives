// ==UserScript==
// @name         酒馆对话分角色导出器
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  智能分离角色对话并生成三个文件
// @author       Your Name
// @match        http://127.0.0.1:8000/*
// @grant        GM_download
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/531590/%E9%85%92%E9%A6%86%E5%AF%B9%E8%AF%9D%E5%88%86%E8%A7%92%E8%89%B2%E5%AF%BC%E5%87%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/531590/%E9%85%92%E9%A6%86%E5%AF%B9%E8%AF%9D%E5%88%86%E8%A7%92%E8%89%B2%E5%AF%BC%E5%87%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        containerClass: 'mes_text',
        nameSelector: '.ch_name .name_text',
        contentSelectors: ['content', 'p'],
        loadMoreButton: '.load-more',
        maxLoadAttempts: 15,
        separator: '\n\n' // 修改为双换行分隔
    };

    // 创建浮动按钮
    const exportBtn = document.createElement('button');
    Object.assign(exportBtn.style, {
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: 9999,
        padding: '12px 24px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontSize: '16px',
        transition: 'all 0.3s ease'
    });
    exportBtn.innerHTML = '📚 导出对话';

    // 主处理流程
    async function handleExport() {
        try {
            disableButton();
            await loadAllContents();

            const { fullContent, roleContents } = processMessages();

            if (Object.keys(roleContents).length === 0) {
                throw new Error('未检测到角色对话内容');
            }

            downloadAllFiles(fullContent, roleContents);
            showSuccessNotification(roleContents);

        } catch (error) {
            showError(error);
        } finally {
            enableButton();
        }
    }

    // 禁用按钮状态
    function disableButton() {
        exportBtn.disabled = true;
        exportBtn.style.opacity = '0.7';
        exportBtn.innerHTML = '⏳ 处理中...';
    }

    // 启用按钮状态
    function enableButton() {
        exportBtn.disabled = false;
        exportBtn.style.opacity = '1';
        exportBtn.innerHTML = '📚 导出对话';
    }

    // 加载全部内容
    async function loadAllContents() {
        let attempts = 0;
        while (attempts < config.maxLoadAttempts) {
            const loadBtn = document.querySelector(config.loadMoreButton);
            if (!loadBtn || loadBtn.disabled) break;

            await simulateButtonClick(loadBtn);
            attempts++;
            await new Promise(r => setTimeout(r, 1500));
        }
    }

    // 模拟按钮点击
    async function simulateButtonClick(button) {
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await new Promise(r => setTimeout(r, 500));
        button.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true
        }));
    }

    // 处理消息内容
    function processMessages() {
        const containers = document.querySelectorAll(`.${config.containerClass}`);
        const roleContents = {};
        let fullContent = '';

        containers.forEach(container => {
            const roleName = getRoleName(container) || '未知角色';
            const content = extractContent(container);

            if (content) {
                // 修改后的内容拼接
                fullContent += `${roleName}:\n${content}\n\n`;

                // 构建角色内容
                roleContents[roleName] = (roleContents[roleName] || '') + `${content}\n\n`;
            }
        });

        return { fullContent, roleContents };
    }

    // 获取角色名称
    function getRoleName(container) {
        // 向上找到mes_block容器
        const mesBlock = container.closest('.mes_block');
        if (!mesBlock) return '未知角色';

        // 在mes_block内精确查找名称
        const nameElement = mesBlock.querySelector(config.nameSelector);
        return nameElement?.textContent?.trim() || '未知角色';
    }

    // 提取容器内容
    function extractContent(container) {
        return config.contentSelectors
            .map(selector => {
                return Array.from(container.querySelectorAll(selector))
                    .map(el => cleanText(el.innerHTML))
                    .join('\n');
            })
            .join('\n')
            .trim();
    }

    // 清理文本内容
    function cleanText(html) {
        return html
            .replace(/<br\s?\/?>/gi, '\n')
            .replace(/<\/?[a-z][^>]*>/gi, '')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/^\s+|\s+$/g, '');
    }

    // 下载所有文件（新增文件名生成逻辑）
    function downloadAllFiles(fullContent, roleContents) {
        const roles = Object.keys(roleContents);

        // 生成角色名称组合
        const getRolePart = () => {
            if (roles.length >= 2) {
                const [first, second] = roles.sort();
                return `${safeName(first)}_和_${safeName(second)}`;
            }
            return roles.length === 1 ? safeName(roles[0]) : '对话';
        };

        // 下载完整对话
        downloadFile(
            `${getRolePart()}_完整对话.txt`,
            fullContent.trim()
        );

        // 下载各角色对话
        roles.forEach(role => {
            downloadFile(
                `${safeName(role)}_单独对话.txt`,
                roleContents[role].trim()
            );
        });
    }

    // 安全文件名处理函数
    function safeName(name) {
        return name
            .replace(/[\\/*?:"<>|]/g, '_')
            .substring(0, 30)
            .trim();
    }

    // 通用下载方法
    function downloadFile(filename, content) {
        GM_download({
            url: `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`,
            name: filename,
            saveAs: true
        });
    }

    // 成功通知
    function showSuccessNotification(roleContents) {
        GM_notification({
            title: '导出成功',
            text: `已生成 ${Object.keys(roleContents).length + 1} 个文件`,
            timeout: 4000,
            silent: false
        });
    }

    // 错误处理
    function showError(error) {
        GM_notification({
            title: '导出失败',
            text: error.message,
            timeout: 5000
        });
        console.error('导出错误:', error);
    }

    // 初始化
    exportBtn.addEventListener('click', handleExport);
    document.body.appendChild(exportBtn);
    window.addEventListener('load', () => exportBtn.style.display = 'block');
})();