// ==UserScript==
// @name         审核后台优化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  优化审核后台操作体验
// @author       You
// @match        https://chanying-sam.limayao.com/digitalperson/aigc-community*
// @grant        none
// @run-at       document-end
// @charset      UTF-8
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534118/%E5%AE%A1%E6%A0%B8%E5%90%8E%E5%8F%B0%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/534118/%E5%AE%A1%E6%A0%B8%E5%90%8E%E5%8F%B0%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 记录当前处理的行索引
    let currentRowIndex = 0;
    // 标记是否已执行过筛选
    let hasFilteredContent = false;
    // 标记当前是否正在处理审核操作
    let isProcessingAction = false;

    // 创建通过和拒绝按钮
    function createButtons() {
        // 检查是否已存在按钮
        if (document.getElementById('tm-approve-btn') || document.getElementById('tm-reject-btn')) {
            return;
        }

        const dialogBody = document.querySelector('.el-dialog__body');
        if (!dialogBody) return;

        // 限制弹窗高度，使其不超过屏幕高度
        const dialogWrapper = document.querySelector('.el-dialog__wrapper');
        if (dialogWrapper) {
            const dialog = dialogWrapper.querySelector('.el-dialog');
            if (dialog) {
                // 设置对话框最大高度为屏幕高度的85%
                dialog.style.maxHeight = '85vh';
                dialog.style.margin = 'auto';
            }
            
            // 设置对话框body的样式，添加滚动条
            dialogBody.style.maxHeight = 'calc(85vh - 120px)'; // 减去头部和底部高度
            dialogBody.style.overflowY = 'auto';
            dialogBody.style.overflowX = 'hidden';
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'position: absolute; top: 10px; right: 10px; z-index: 9999; display: flex; gap: 10px;';
        buttonContainer.className = 'tm-button-container'; // 添加类名以便更精确的选择

        const approveBtn = document.createElement('button');
        approveBtn.id = 'tm-approve-btn';
        approveBtn.innerHTML = '通过 (←)';
        approveBtn.style.cssText = 'padding: 8px 16px; background-color: #67C23A; color: white; border: none; border-radius: 4px; cursor: pointer;';

        const rejectBtn = document.createElement('button');
        rejectBtn.id = 'tm-reject-btn';
        rejectBtn.innerHTML = '拒绝 (→)';
        rejectBtn.style.cssText = 'padding: 8px 16px; background-color: #F56C6C; color: white; border: none; border-radius: 4px; cursor: pointer;';

        buttonContainer.appendChild(approveBtn);
        buttonContainer.appendChild(rejectBtn);
        dialogBody.appendChild(buttonContainer);

        // 绑定点击事件
        approveBtn.addEventListener('click', () => handleAction('approve'));
        rejectBtn.addEventListener('click', () => handleAction('reject'));

        // 自动播放视频
        autoPlayVideo();
        
        // 调整视频尺寸
        adjustVideoSize();
    }
    
    // 调整视频尺寸
    function adjustVideoSize() {
        setTimeout(() => {
            const videoContainer = document.querySelector('.video-container');
            if (videoContainer) {
                // 设置视频容器高度
                videoContainer.style.maxHeight = 'calc(60vh - 150px)';
                videoContainer.style.overflow = 'hidden';
                
                const video = videoContainer.querySelector('video');
                if (video) {
                    // 调整视频尺寸
                    video.style.width = '100%';
                    video.style.height = 'auto';
                    video.style.maxHeight = 'calc(60vh - 150px)';
                    video.style.objectFit = 'contain';
                }
            }
        }, 500);
    }

    // 自动筛选待审核内容
    function autoFilterPendingContent() {
        if (hasFilteredContent) return;
        
        // 延迟执行，确保页面元素已加载
        setTimeout(() => {
            // 查找内容状态下拉框
            const statusSelectInputs = document.querySelectorAll('input[placeholder="请选择内容状态"]');
            if (statusSelectInputs.length > 0) {
                const statusSelect = statusSelectInputs[0];
                
                // 模拟点击下拉框
                statusSelect.click();
                
                // 等待下拉选项出现后选择"生成成功，等待审核"
                setTimeout(() => {
                    // 查找并点击"生成成功，等待审核"选项
                    const options = document.querySelectorAll('.el-select-dropdown__item');
                    let targetFound = false;
                    
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].textContent.includes('生成成功，等待审核')) {
                            options[i].click();
                            targetFound = true;
                            
                            // 点击搜索按钮
                            setTimeout(() => {
                                const searchButton = document.evaluate('//*[@id="app"]/div/div[2]/section/div/form/div[5]/div/button[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                if (searchButton) {
                                    searchButton.click();
                                    console.log('已自动筛选待审核内容');
                                    hasFilteredContent = true;
                                }
                            }, 500);
                            
                            break;
                        }
                    }
                    
                    // 如果没找到目标选项，关闭下拉框以防干扰页面
                    if (!targetFound) {
                        document.body.click();
                    }
                }, 500);
            }
        }, 1000);
    }

    // 自动播放视频
    function autoPlayVideo() {
        setTimeout(() => {
            const videoContainer = document.querySelector('.video-container');
            if (videoContainer) {
                const video = videoContainer.querySelector('video');
                if (video) {
                    video.play().catch(err => console.log('视频自动播放失败:', err));
                }
            }
        }, 500); // 延迟500ms确保视频元素已加载
    }

    // 找到当前预览项对应的行
    function findCurrentRow() {
        const rows = document.querySelectorAll('.el-table__row');
        for (let i = 0; i < rows.length; i++) {
            const previewButton = rows[i].querySelector('.video-preview');
            if (previewButton && window.getComputedStyle(previewButton).color === 'rgb(64, 158, 255)') {
                currentRowIndex = i; // 保存当前行的索引
                return rows[i];
            }
        }
        
        // 如果找不到高亮的预览按钮，则默认返回第一行
        currentRowIndex = 0;
        return document.querySelector('.el-table__row');
    }

    // 关闭预览弹窗 - 完全重写此函数
    function closePreviewDialog() {
        const dialogWrapper = document.querySelector('.el-dialog__wrapper');
        if (!dialogWrapper) return;

        // 方法1: 直接模拟点击遮罩层（mask）
        try {
            // 获取对话框尺寸和位置
            const dialog = dialogWrapper.querySelector('.el-dialog');
            if (dialog) {
                const rect = dialog.getBoundingClientRect();
                
                // 计算遮罩层上的一个点，这个点不在对话框内
                // 选择对话框左上角上方10px的位置，确保点击在遮罩层上而不是对话框上
                const x = rect.left - 10;
                const y = rect.top - 10;
                
                // 创建点击事件
                const clickEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: x,
                    clientY: y
                });
                
                // 在遮罩层上触发点击事件
                dialogWrapper.dispatchEvent(clickEvent);
                
                console.log('方法1: 尝试点击遮罩层关闭弹窗');
            }
        } catch (e) {
            console.error('方法1关闭弹窗失败:', e);
        }
        
        // 短暂延迟后检查弹窗是否已关闭，如果没有，尝试方法2
        setTimeout(() => {
            const stillOpenDialog = document.querySelector('.el-dialog__wrapper');
            if (stillOpenDialog && stillOpenDialog.style.display !== 'none') {
                try {
                    // 方法2: 模拟ESC键按下
                    const escEvent = new KeyboardEvent('keydown', {
                        bubbles: true,
                        cancelable: true,
                        key: 'Escape',
                        code: 'Escape',
                        keyCode: 27,
                        which: 27
                    });
                    
                    document.dispatchEvent(escEvent);
                    console.log('方法2: 尝试按ESC键关闭弹窗');
                } catch (e) {
                    console.error('方法2关闭弹窗失败:', e);
                }
            }
            
            // 再次短暂延迟后检查弹窗是否已关闭，如果没有，尝试方法3
            setTimeout(() => {
                const stillOpenDialog2 = document.querySelector('.el-dialog__wrapper');
                if (stillOpenDialog2 && stillOpenDialog2.style.display !== 'none') {
                    try {
                        // 方法3: 直接修改DOM和样式
                        stillOpenDialog2.style.display = 'none';
                        const modalMask = document.querySelector('.v-modal');
                        if (modalMask) modalMask.style.display = 'none';
                        console.log('方法3: 直接隐藏弹窗');
                    } catch (e) {
                        console.error('方法3关闭弹窗失败:', e);
                    }
                }
                
                // 无论弹窗是否成功关闭，都尝试打开下一条数据
                setTimeout(openNextItem, 500);
            }, 200);
        }, 200);
    }
    
    // 打开下一条数据
    function openNextItem() {
        const rows = document.querySelectorAll('.el-table__row');
        const nextIndex = currentRowIndex + 1 < rows.length ? currentRowIndex + 1 : 0;
        
        if (rows.length > 0) {
            const previewButton = rows[nextIndex].querySelector('.video-preview');
            if (previewButton) {
                // 将索引更新为下一条
                currentRowIndex = nextIndex;
                // 点击预览按钮
                previewButton.click();
                console.log('打开下一条数据, 索引:', nextIndex);
            }
        }
    }

    // 处理审核操作
    function handleAction(action) {
        // 如果当前正在处理审核操作，则不再重复处理
        if (isProcessingAction) return;
        isProcessingAction = true;

        const currentRow = findCurrentRow();
        if (!currentRow) {
            isProcessingAction = false;
            return;
        }

        const rowIndex = Array.from(document.querySelectorAll('.el-table__row')).indexOf(currentRow) + 1;
        
        if (action === 'approve') {
            // 点击通过按钮
            const approveButton = document.evaluate(`//*[@id="app"]/div/div[2]/section/div/div[2]/div[3]/table/tbody/tr[${rowIndex}]/td[13]/div/button[1]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (approveButton) approveButton.click();
        } else {
            // 点击拒绝按钮
            const rejectButton = document.evaluate(`//*[@id="app"]/div/div[2]/section/div/div[2]/div[3]/table/tbody/tr[${rowIndex}]/td[13]/div/button[2]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (rejectButton) rejectButton.click();
        }
        
        // 确保确认窗口显示在最前面
        setTimeout(() => {
            const confirmDialog = document.querySelector('.el-message-box__wrapper');
            if (confirmDialog) {
                confirmDialog.style.zIndex = '10000';
                
                // 监听确认框的按钮点击事件，等待用户确认后再继续
                const confirmButtons = confirmDialog.querySelectorAll('.el-button');
                
                // 为确认框中的所有按钮添加点击事件
                confirmButtons.forEach(button => {
                    button.addEventListener('click', onConfirmButtonClick, { once: true });
                });
                
                // 监控确认对话框的关闭
                setupConfirmDialogObserver(confirmDialog);
            } else {
                // 如果没有找到确认框，直接解除处理锁定
                isProcessingAction = false;
            }
        }, 100);
    }
    
    // 监听确认对话框关闭
    function setupConfirmDialogObserver(confirmDialog) {
        // 创建观察器实例
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                // 检查对话框是否被移除或隐藏
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (confirmDialog.style.display === 'none' || !document.body.contains(confirmDialog)) {
                        // 确认对话框关闭了，同时关闭审核弹窗
                        closePreviewDialog();
                        isProcessingAction = false;
                        observer.disconnect();
                        return;
                    }
                }
            }
        });
        
        // 配置观察选项
        observer.observe(confirmDialog, { 
            attributes: true,
            attributeFilter: ['style']
        });
        
        // 同时监听document，检测消息框是否从DOM中被移除
        const bodyObserver = new MutationObserver((mutations) => {
            if (!document.body.contains(confirmDialog)) {
                closePreviewDialog();
                isProcessingAction = false;
                bodyObserver.disconnect();
                observer.disconnect();
            }
        });
        
        bodyObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 确认按钮点击处理
    function onConfirmButtonClick() {
        // 等待一段时间后关闭审核弹窗
        setTimeout(() => {
            closePreviewDialog();
            isProcessingAction = false;
        }, 300);
    }

    // 监控页面刷新并自动打开下一条
    function setupPageRefreshMonitor() {
        // 使用MutationObserver监控表格内容变化
        const tableObserver = new MutationObserver(() => {
            // 延迟一段时间确保页面完全刷新 - 1.5秒
            setTimeout(() => {
                openNextPreview();
                tableObserver.disconnect(); // 完成后断开观察
            }, 1500);  // 延长等待时间到1.5秒
        });

        // 监控表格内容
        const table = document.querySelector('.el-table__body-wrapper');
        if (table) {
            tableObserver.observe(table, { childList: true, subtree: true });
        }
    }

    // 打开下一条预览
    function openNextPreview() {
        const rows = document.querySelectorAll('.el-table__row');
        // 尝试打开下一行的预览
        const nextIndex = currentRowIndex + 1;
        
        if (nextIndex < rows.length) {
            const nextPreviewButton = rows[nextIndex].querySelector('.video-preview');
            if (nextPreviewButton) {
                nextPreviewButton.click();
                currentRowIndex = nextIndex;
                return;
            }
        }
        
        // 如果没有下一行或点击失败，尝试点击第一行
        if (rows.length > 0) {
            const firstPreviewButton = rows[0].querySelector('.video-preview');
            if (firstPreviewButton) {
                firstPreviewButton.click();
                currentRowIndex = 0;
            }
        }
    }

    // 监听键盘事件
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!document.querySelector('.el-dialog__body')) return;
            
            // 左箭头 - 通过
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handleAction('approve');
            }
            // 右箭头 - 拒绝
            else if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleAction('reject');
            }
        });
    }

    // 监听dialog打开
    function setupDialogObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.classList && node.classList.contains('el-dialog__wrapper')) {
                            createButtons();
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 监听点击video-preview
    function setupVideoPreviewListener() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('video-preview') || 
                (e.target.parentElement && e.target.parentElement.classList.contains('video-preview'))) {
                setTimeout(() => {
                    createButtons();
                    adjustVideoSize(); // 确保视频尺寸得到调整
                }, 300);
            }
        }, true);
    }

    // 修复可能的字符编码问题
    function fixEncodingIssues() {
        // 添加一个临时的样式以覆盖可能导致问题的CSS
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            a, a:link, a:visited, a:hover, a:active {
                text-decoration: inherit;
                font-family: inherit;
                font-size: inherit;
                color: inherit;
                text-rendering: optimizeLegibility;
                -webkit-font-smoothing: antialiased;
            }
            
            /* 调整视频样式 */
            .el-dialog__body .video-container {
                max-height: calc(60vh - 150px) !important;
                overflow: hidden !important;
            }
            
            .el-dialog__body .video-container video {
                width: 100% !important;
                height: auto !important;
                max-height: calc(60vh - 150px) !important;
                object-fit: contain !important;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // 初始化
    function init() {
        setupDialogObserver();
        setupVideoPreviewListener();
        setupKeyboardShortcuts();
        
        // 尝试修复编码问题和调整视频尺寸
        fixEncodingIssues();
        
        // 自动筛选待审核内容
        setTimeout(autoFilterPendingContent, 1500);
    }

    // 页面加载完成后初始化
    window.addEventListener('load', init);
    
    // 也在DOMContentLoaded时尝试初始化，以防load事件已触发
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
