// ==UserScript==
// @name         YouTube视频批量修改标题描述
// @namespace    https://zhangzifan.com
// @version      0.1
// @description  YouTube视频批量快捷修改标题和描述说明。
// @match        https://studio.youtube.com/channel/*/videos/upload*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506250/YouTube%E8%A7%86%E9%A2%91%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E6%A0%87%E9%A2%98%E6%8F%8F%E8%BF%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/506250/YouTube%E8%A7%86%E9%A2%91%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E6%A0%87%E9%A2%98%E6%8F%8F%E8%BF%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保页面完全加载后执行操作
    window.addEventListener('load', () => {
        console.log('页面加载完成！');

        // 处理对话框中的修改操作
        function modifyDialog() {
            // 获取所有对话框元素
            const dialogs = document.querySelectorAll('ytcp-video-list-cell-video-edit-dialog');
            const lastDialog = dialogs[dialogs.length - 1];
            if (!lastDialog) return;

            let titleModified = false;
            let descriptionModified = false;

            // 修改标题
            const titleInput = lastDialog.querySelector('#title-input ytcp-social-suggestion-input div');
            if (titleInput) {
                const newTitle = titleInput.textContent.replace(/\s+泪雪网/, '');
                if (titleInput.textContent !== newTitle) {
                    titleInput.textContent = newTitle;
                    titleInput.dispatchEvent(new Event('input', { bubbles: true }));
                    titleModified = true;
                }
            }

            // 修改描述
            const descriptionTextarea = lastDialog.querySelector('#description-textarea ytcp-social-suggestion-input div');
            if (descriptionTextarea) {
                const title = lastDialog.querySelector('#title-input ytcp-social-suggestion-input div')?.textContent || '';
                const newDescription = descriptionTextarea.textContent
                .replace(new RegExp(`^${title}\s+`), '')
                .replace(/^.*-.*泪雪网\s+/, '')
                .replace('www.leixue.com', 'leixue.com');
                if (descriptionTextarea.textContent !== newDescription) {
                    descriptionTextarea.textContent = newDescription;
                    descriptionTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                    descriptionModified = true;
                }
            }

            // 根据修改情况点击保存或取消
            setTimeout(() => {
                const saveButton = lastDialog.querySelector('#save-button button');
                const cancelButton = lastDialog.querySelector('ytcp-button[label="取消"]');
                if (titleModified || descriptionModified) {
                    if (saveButton) {
                        saveButton.click();
                    }
                } else if (cancelButton) {
                    cancelButton.click();
                }
            }, 1000); // 等待一点时间以确保更改已处理
        }

        // 处理单个视频行
        function handleVideoRow(videoRow, index, callback) {
            setTimeout(() => {
                console.log('开始处理视频：' + (index + 1));
                // 给 ytvideo-row 元素中的 ytvideo-list-cell-video 元素添加 is-highlighted 属性
                const videoCell = videoRow.querySelector('ytcp-video-list-cell-video');
                if (videoCell) {
                    videoRow.click();
                    videoRow.scrollIntoView({ behavior: 'smooth', block: 'center' });//滚动
                    videoCell.setAttribute('is-highlighted', 'true');
                }

                setTimeout(() => {
                    // 点击打开菜单按钮
                    const openMenuButton = videoRow.querySelector('ytcp-video-list-cell-video .ytcp-video-list-cell-video ytcp-icon-button.open-menu-button');
                    if (openMenuButton) {
                        console.log('打开更多菜单：' + (index + 1));
                        openMenuButton.click();
                        // 点击特定菜单项
                        setTimeout(() => {
                            const menuItem = document.querySelector('#video-inline-actions-menu #dialog #paper-list #text-item-0');
                            if (menuItem) {
                                console.log('修改标题和说明：' + (index + 1));
                                menuItem.click();

                                // 等待对话框出现后进行修改
                                setTimeout(() => {
                                    modifyDialog(); // 修改最后一个对话框

                                    // 执行下一个视频行
                                    if (callback) {
                                        console.log('开始下个视频');
                                        callback(index + 1);
                                    }
                                }, 1500); // 调整延迟以确保对话框加载完毕
                            }
                        }, 500); // 等待菜单出现
                    }
                }, 500); // 等待菜单出现
            }, 500); // 每个视频行操作之间间隔
        }

        // 递归处理所有视频行
        function processVideoRows(index = 0) {
            const videoRows = document.querySelectorAll('#video-list ytcp-video-row');
            console.log('视频数量：' + videoRows.length);
            if (index < videoRows.length) {
                const videoRow = videoRows[index];
                handleVideoRow(videoRow, index, processVideoRows);
            }else if(index == videoRows.length){
                const nextpage = document.querySelector('#navigate-after');
                if (nextpage) {
                    console.log('下一页' );
                    nextpage.click();
                    setTimeout(() => {
                        // 滚动到视频行的顶部
                        nextpage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        processVideoRows();
                    }, 10000);
                }
            }else{
                console.log('处理完成');
            }
        }

        // 启动处理视频
        setTimeout(() => {
            processVideoRows();
        }, 1000);
    });
})();
