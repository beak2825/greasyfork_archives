// ==UserScript==
// @name         国家智慧中小学教材下载
// @namespace    http://tampermonkey.net/
// @version      0.704
// @description  可以在国家智慧中小学的教材详情页下载PDF版本的教材
// @author       hydrachs
// @match        https://basic.smartedu.cn/*?*contentId=*
// @match        https://www.smartedu.cn/*?*contentId=*
// @match        https://teacher.vocational.smartedu.cn/*?*contentId=*
// @match        https://core.teacher.vocational.smartedu.cn/*?*contentId=*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      s-file-2.ykt.cbern.com.cn
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/486386/%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/486386/%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(10px); }
        }
    `;
    document.head.appendChild(style);

    function getContentId() {
        const urlParams = new URLSearchParams(window.location.search);
        const contentId = urlParams.get("contentId");
        if (!contentId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(contentId)) {
            return null;
        }
        return contentId;
    }

    function getAccessToken() {
        const maxRetries = 3;
        const retryDelay = 500;
        
        async function tryGetToken(retryCount) {
            const authKeys = Object.keys(localStorage).filter(key => 
                key.includes('ND_UC_AUTH') || key.includes('nd_uc_auth')
            );
            
            if (authKeys.length === 0) {
                if (retryCount < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    return tryGetToken(retryCount + 1);
                }
                console.error('未找到认证相关的localStorage键');
                return null;
            }

            for (const key of authKeys) {
                const tokenDataStr = localStorage.getItem(key);
                if (!tokenDataStr) continue;
                
                let tokenData;
                try {
                    tokenData = JSON.parse(tokenDataStr);
                } catch (e) {
                    console.error('解析tokenDataStr失败:', e);
                    continue;
                }
                
                if (!tokenData.value) continue;
                
                let parsedValue;
                try {
                    parsedValue = JSON.parse(tokenData.value);
                } catch (e) {
                    parsedValue = tokenData.value; // 若失败，直接使用value
                }
                
                if (parsedValue?.access_token) {
                    console.log('成功获取access_token');
                    return parsedValue.access_token;
                }
            }

            if (retryCount < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return tryGetToken(retryCount + 1);
            }
            console.error('所有认证键解析均失败');
            return null;
        }

        return tryGetToken(0);
    }

    function createTempAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: #e74c3c;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10001;
            animation: fadeOut 2s forwards;
        `;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 2000);
    }

    async function handleDownload() {
        const button = document.getElementById('download-textbook-btn');
        if (!button) return;

        button.disabled = true;
        button.textContent = '处理中...';

        const contentId = getContentId();
        if (!contentId) {
            createTempAlert("当前页面不是有效的教材详情页！");
            button.disabled = false;
            button.textContent = "下载教材";
            return;
        }

        const accessToken = await getAccessToken();
        if (!accessToken) {
            createTempAlert('未找到访问令牌，请确保已登录并刷新页面');
            button.disabled = false;
            button.textContent = "下载教材";
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://s-file-2.ykt.cbern.com.cn/zxx/ndrv2/resources/tch_material/details/${contentId}.json`,
            onload: function(response) {
                try {
                    if (response.status !== 200) {
                        throw new Error(`API请求失败: ${response.status}`);
                    }

                    const data = JSON.parse(response.responseText);
                    const sourceItem = data.ti_items?.find(item => item.ti_file_flag === 'source');
                    if (!sourceItem || !sourceItem.ti_storages || !Array.isArray(sourceItem.ti_storages)) {
                        throw new Error('未找到有效的教材存储信息');
                    }

                    const fileName = sourceItem.ti_file_name || '教材.pdf';
                    const parts = sourceItem.ti_storages.flatMap(storage =>
                        storage.split('`').map(part => part.replace(/\s+/g, ' ').trim()).filter(part => part)
                    );

                    let currentUrl = '';
                    const possibleUrls = [];
                    for (const part of parts) {
                        if (part.startsWith('http')) {
                            if (currentUrl) possibleUrls.push(currentUrl);
                            currentUrl = part;
                        } else {
                            currentUrl += part;
                        }
                    }
                    if (currentUrl) possibleUrls.push(currentUrl);

                    const pdfUrl = possibleUrls.find(url => url.toLowerCase().endsWith('.pdf'));
                    if (!pdfUrl) {
                        throw new Error('未找到有效的PDF下载链接');
                    }

                    const downloadUrl = `${pdfUrl}?accessToken=${accessToken}`;
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    button.textContent = '下载成功';
                    setTimeout(() => {
                        button.textContent = '下载教材';
                        button.disabled = false;
                    }, 2000);
                } catch (e) {
                    console.error('下载失败:', e);
                    createTempAlert(`获取下载链接失败: ${e.message}`);
                    button.textContent = '下载教材';
                    button.disabled = false;
                }
            },
            onerror: function(error) {
                console.error('网络错误:', error);
                createTempAlert(`获取下载链接失败: 网络请求错误 - ${error.message}`);
                button.disabled = false;
                button.textContent = '下载教材';
            }
        });
    }

    // 添加M键快捷键支持
    function setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // 检查是否按下了M键，且没有在输入框等元素中
            if (e.key.toLowerCase() === 'm' && 
                !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) &&
                !e.target.isContentEditable) {
                e.preventDefault();
                handleDownload();
            }
        });
    }

    function createDraggableButton() {
        const buttonWrapper = document.createElement('div');
        const savedPos = GM_getValue('downloadBtnPosition');
        const topPos = savedPos?.top || '20px';
        const rightPos = savedPos?.right || '20px';

        buttonWrapper.style.cssText = `
            position: fixed;
            top: ${topPos};
            right: ${rightPos};
            z-index: 10000;
            cursor: move;
        `;
        document.body.appendChild(buttonWrapper);

        const downloadButton = document.createElement('button');
        downloadButton.id = 'download-textbook-btn';
        downloadButton.textContent = '📚下载教材';
        downloadButton.style.cssText = `
            padding: 10px 15px;
            border: none;
            background: #26aaebff;
            color: white;
            font-weight: bold;
            cursor: pointer;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        `;
        downloadButton.addEventListener('click', handleDownload);
        buttonWrapper.appendChild(downloadButton);

        let isDragging = false;
        let startX, startY;
        let initialTop, initialRight;
        const EDGE_MARGIN = 40;

        buttonWrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialTop = parseInt(buttonWrapper.style.top);
            initialRight = parseInt(buttonWrapper.style.right);
            buttonWrapper.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const diffY = e.clientY - startY;
            const diffX = startX - e.clientX;

            const rawTop = initialTop + diffY;
            const rawRight = initialRight + diffX;

            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const buttonWidth = downloadButton.offsetWidth;

            const clampedTop = Math.max(EDGE_MARGIN, Math.min(rawTop, viewportHeight - EDGE_MARGIN));
            const clampedRight = Math.max(EDGE_MARGIN, Math.min(rawRight, viewportWidth - buttonWidth - EDGE_MARGIN));

            buttonWrapper.style.top = `${clampedTop}px`;
            buttonWrapper.style.right = `${clampedRight}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                buttonWrapper.style.cursor = 'move';
                GM_setValue('downloadBtnPosition', {
                    top: buttonWrapper.style.top,
                    right: buttonWrapper.style.right
                });
            }
        });

        const contentId = getContentId();
        downloadButton.disabled = !contentId;
    }

    createDraggableButton();
    setupKeyboardShortcut();
})();
