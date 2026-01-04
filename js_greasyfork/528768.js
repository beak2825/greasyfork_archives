// ==UserScript==
// @name         FSM 收藏夹链接提取
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Extract and convert FSM torrent links from all pages (on-demand authentication)
// @author       You
// @match        https://fsm.name/Torrents/mine?type=favorite*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/528768/FSM%20%E6%94%B6%E8%97%8F%E5%A4%B9%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/528768/FSM%20%E6%94%B6%E8%97%8F%E5%A4%B9%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let passkey = '';
    let authorization = '';
    let deviceId = '';
    let maxPage = 1;
    let currentPage = 1;
    let allLinks = [];

    // 创建加载覆盖层
    function createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'fsm-loading-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.color = 'white';
        overlay.style.fontSize = '24px';

        const loadingText = document.createElement('div');
        loadingText.id = 'fsm-loading-text';
        loadingText.textContent = '正在获取下载链接...';
        loadingText.style.marginBottom = '20px';

        const progressText = document.createElement('div');
        progressText.id = 'fsm-progress-text';
        progressText.textContent = '进度: 0/0 页';
        progressText.style.fontSize = '18px';

        overlay.appendChild(loadingText);
        overlay.appendChild(progressText);
        document.body.appendChild(overlay);

        return overlay;
    }

    // 获取凭证信息
    function getCredentials() {
        authorization = localStorage.getItem('token');
        deviceId = localStorage.getItem('DeviceId');

        if (!authorization || !deviceId) {
            showNotification('获取凭证失败，请确保已登录', 'error');
            return false;
        }

        return true;
    }

    // 获取 passkey
    async function fetchPasskey() {
        try {
            if (!getCredentials()) return false;

            const response = await fetch('https://fsm.name/api/Users/infos', {
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'authorization': authorization,
                    'deviceid': deviceId
                }
            });

            const data = await response.json();
            if (data.success && data.data.passkey) {
                passkey = data.data.passkey;
                return true;
            }

            showNotification('获取 passkey 失败: ' + (data.msg || '未知错误'), 'error');
            return false;
        } catch (error) {
            console.error('获取 passkey 失败:', error);
            showNotification('获取 passkey 失败: ' + error.message, 'error');
            return false;
        }
    }

    // 获取收藏种子列表
    async function fetchFavorites(page) {
        try {
            if (!getCredentials()) return null;

            const response = await fetch(`https://fsm.name/api/Torrents/listMyFavorite?page=${page}`, {
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'authorization': authorization,
                    'deviceid': deviceId
                }
            });

            const data = await response.json();
            if (data.success) {
                // 更新总页数
                if (data.data.maxPage > maxPage) {
                    maxPage = data.data.maxPage;
                }

                return data.data.list || [];
            }

            showNotification('获取收藏列表失败: ' + (data.msg || '未知错误'), 'error');
            return null;
        } catch (error) {
            console.error('获取收藏列表失败:', error);
            showNotification('获取收藏列表失败: ' + error.message, 'error');
            return null;
        }
    }

    // 更新进度文本
    function updateProgress(current, total) {
        const progressText = document.getElementById('fsm-progress-text');
        if (progressText) {
            progressText.textContent = `进度: ${current}/${total} 页`;
        }
    }

    // 显示通知
    function showNotification(message, type) {
        if (window.$notify) {
            window.$notify({
                message: message,
                type: type
            });
        } else {
            alert(message);
        }
    }

    // 获取当前页面的种子链接
    async function extractCurrentPageLinks() {
        if (!passkey) {
            const success = await fetchPasskey();
            if (!success) return [];
        }

        const links = document.querySelectorAll('.el-table__body-wrapper a');
        return Array.from(links)
            .map(link => {
                const tid = new URL(link.href).searchParams.get('tid');
                return `https://api.fsm.name/Torrents/download?tid=${tid}&passkey=${passkey}&source=direct`;
            });
    }

    // 提取单页的链接
    function extractLinksFromData(list) {
        return list.map(item => {
            return `https://api.fsm.name/Torrents/download?tid=${item.tid}&passkey=${passkey}&source=direct`;
        });
    }

    // 获取所有页面的链接
    async function extractAllPagesLinks() {
        const overlay = createLoadingOverlay();

        try {
            // 在按钮点击时获取 passkey
            if (!passkey) {
                const success = await fetchPasskey();
                if (!success) {
                    overlay.remove();
                    return;
                }
            }

            // 获取第一页数据，确定总页数
            const firstPageData = await fetchFavorites(1);
            if (!firstPageData) {
                overlay.remove();
                return;
            }

            // 添加第一页链接
            allLinks = extractLinksFromData(firstPageData);
            updateProgress(1, maxPage);

            // 获取剩余页面
            for (let page = 2; page <= maxPage; page++) {
                const pageData = await fetchFavorites(page);
                if (pageData) {
                    const pageLinks = extractLinksFromData(pageData);
                    allLinks = allLinks.concat(pageLinks);
                }

                updateProgress(page, maxPage);

                // 稍微延迟，避免请求过快
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // 复制到剪贴板
            GM_setClipboard(allLinks.join('\n'));
            showNotification(`已复制所有收藏链接 (共 ${allLinks.length} 个)`, 'success');
        } catch (error) {
            console.error('获取所有链接失败:', error);
            showNotification('获取所有链接失败: ' + error.message, 'error');
        } finally {
            overlay.remove();
        }
    }

    // 复制当前页面链接
    async function extractAndCopyCurrentPageLinks() {
        try {
            // 在按钮点击时获取 passkey
            if (!passkey) {
                const success = await fetchPasskey();
                if (!success) return;
            }
            
            const links = await extractCurrentPageLinks();

            if (links.length > 0) {
                GM_setClipboard(links.join('\n'));
                showNotification(`已复制当前页面链接 (共 ${links.length} 个)`, 'success');
            } else {
                showNotification('没有找到可复制的链接', 'warning');
            }
        } catch (error) {
            console.error('提取当前页链接失败:', error);
            showNotification('提取当前页链接失败: ' + error.message, 'error');
        }
    }

    // 添加按钮
    function addButtons() {
        // 检查是否已存在按钮
        if (document.getElementById('fsm-extract-buttons')) {
            return;
        }

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'fsm-extract-buttons';
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.right = '20px';
        buttonContainer.style.bottom = '20px';
        buttonContainer.style.zIndex = '9999';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';

        // 当前页面按钮
        const currentPageBtn = document.createElement('button');
        currentPageBtn.className = 'el-button el-button--primary el-button--small';
        currentPageBtn.innerHTML = '提取当前页链接';
        currentPageBtn.addEventListener('click', extractAndCopyCurrentPageLinks);

        // 所有页面按钮
        const allPagesBtn = document.createElement('button');
        allPagesBtn.className = 'el-button el-button--danger el-button--small';
        allPagesBtn.innerHTML = '提取所有页链接';
        allPagesBtn.addEventListener('click', extractAllPagesLinks);

        // 添加到容器
        buttonContainer.appendChild(currentPageBtn);
        buttonContainer.appendChild(allPagesBtn);

        // 添加到页面
        document.body.appendChild(buttonContainer);
    }

    // 使用 MutationObserver 确保在页面动态加载后添加按钮
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('.el-table__body-wrapper')) {
            addButtons();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载完成时也尝试添加按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButtons);
    } else {
        addButtons();
    }

    // 移除了初始获取 passkey 的部分
})();