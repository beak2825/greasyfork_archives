// ==UserScript==
// @name         FSDVD - 飞书文档视频下载
// @license      GPL License
// @namespace    https://bytedance.com
// @version      0.1
// @description  飞书文档视频下载工具
// @author       906051999
// @match        *://*.feishu.cn/*
// @match        *://*.larkoffice.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533566/FSDVD%20-%20%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/533566/FSDVD%20-%20%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取所有视频元素
    function getAllVideoElements() {
        const videoBlocks = document.querySelectorAll('div[data-block-type="view"]');

        const videos = [];
        videoBlocks.forEach(block => {
            const fileNameElement = block.querySelector('.file-name');
            if (fileNameElement) {
                videos.push({
                    element: block,
                    name: fileNameElement.textContent.trim(),
                });
            }
        });

        return videos;
    }

    // 创建视频列表弹窗
    // 在createVideoListPopup函数中添加复选框和批量操作栏
    function createVideoListPopup(videos) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.width = '500px';
        popup.style.maxHeight = '80vh';
        popup.style.backgroundColor = 'white';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        popup.style.padding = '20px';
        popup.style.zIndex = '9999';
        popup.style.overflow = 'auto';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.right = '15px';
        closeBtn.style.top = '15px';
        closeBtn.style.border = 'none';
        closeBtn.style.background = 'none';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', () => document.body.removeChild(popup));
        popup.appendChild(closeBtn);

        const title = document.createElement('h3');
        title.textContent = `文档中的视频文件 (共 ${videos.length} 个)`;  // 添加总数量
        title.style.marginBottom = '20px';
        popup.appendChild(title);

        // 添加批量操作工具栏
        const batchToolbar = document.createElement('div');
        batchToolbar.style.display = 'flex';
        batchToolbar.style.justifyContent = 'space-between';
        batchToolbar.style.marginBottom = '15px';
        batchToolbar.style.alignItems = 'center';

        const selectedCount = document.createElement('span');
        selectedCount.textContent = '已选 0 个视频';
        selectedCount.id = 'selectedCount';

        const btnGroup = document.createElement('div');

        // 批量操作按钮
        const selectAllBtn = document.createElement('button');
        selectAllBtn.textContent = '全选';
        selectAllBtn.style.marginRight = '5px';

        const invertBtn = document.createElement('button');
        invertBtn.textContent = '反选';
        invertBtn.style.marginRight = '5px';

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '取消';
        clearBtn.style.marginRight = '5px';

        const exportBtn = document.createElement('button');
        exportBtn.textContent = '导出链接';
        exportBtn.style.backgroundColor = '#3370ff';
        exportBtn.style.color = 'white';

        btnGroup.append(selectAllBtn, invertBtn, clearBtn, exportBtn);
        batchToolbar.append(selectedCount, btnGroup);
        popup.appendChild(batchToolbar);

        const list = document.createElement('ul');
        list.style.listStyle = 'none';
        list.style.padding = '0';
        list.style.margin = '0';

        videos.forEach((video, index) => {  // 添加index参数
            const item = document.createElement('li');
            item.style.padding = '10px';
            item.style.borderBottom = '1px solid #eee';
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';

            // 添加复选框
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.index = index;
            checkbox.style.marginRight = '10px';
            item.appendChild(checkbox);

            // 添加序号
            const indexSpan = document.createElement('span');
            indexSpan.textContent = `${index + 1}. `;
            indexSpan.style.marginRight = '5px';
            item.appendChild(indexSpan);

            const name = document.createElement('span');
            name.textContent = video.name;
            item.appendChild(name);

            // 修改这里：调用createDownloadButton而不是直接创建按钮
            const downloadBtn = createDownloadButton(video);
            item.appendChild(downloadBtn);

            list.appendChild(item);
        });

        // 在popup.appendChild(list);之后添加批量操作功能
        popup.appendChild(list);
        document.body.appendChild(popup);

        // 批量操作功能实现
        const checkboxes = popup.querySelectorAll('input[type="checkbox"]');

        function updateSelectedCount() {
            const selected = popup.querySelectorAll('input[type="checkbox"]:checked').length;
            selectedCount.textContent = `已选 ${selected} 个视频`;
        }

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectedCount);
        });

        selectAllBtn.addEventListener('click', () => {
            checkboxes.forEach(checkbox => checkbox.checked = true);
            updateSelectedCount();
        });

        invertBtn.addEventListener('click', () => {
            checkboxes.forEach(checkbox => checkbox.checked = !checkbox.checked);
            updateSelectedCount();
        });

        clearBtn.addEventListener('click', () => {
            checkboxes.forEach(checkbox => checkbox.checked = false);
            updateSelectedCount();
        });

        exportBtn.addEventListener('click', async () => {
            const selectedIndexes = Array.from(popup.querySelectorAll('input[type="checkbox"]:checked'))
                .map(checkbox => parseInt(checkbox.dataset.index));

            if (selectedIndexes.length === 0) {
                alert('请至少选择一个视频');
                return;
            }

            // 创建结果展示弹窗
            const resultPopup = document.createElement('div');
            resultPopup.style.position = 'fixed';
            resultPopup.style.top = '50%';
            resultPopup.style.left = '50%';
            resultPopup.style.transform = 'translate(-50%, -50%)';
            resultPopup.style.width = '600px';
            resultPopup.style.maxHeight = '70vh';
            resultPopup.style.backgroundColor = 'white';
            resultPopup.style.borderRadius = '8px';
            resultPopup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            resultPopup.style.padding = '20px';
            resultPopup.style.zIndex = '10000';
            resultPopup.style.overflow = 'auto';

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '×';
            closeBtn.style.position = 'absolute';
            closeBtn.style.right = '15px';
            closeBtn.style.top = '15px';
            closeBtn.style.border = 'none';
            closeBtn.style.background = 'none';
            closeBtn.style.fontSize = '20px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.addEventListener('click', () => document.body.removeChild(resultPopup));
            resultPopup.appendChild(closeBtn);

            const title = document.createElement('h3');
            title.textContent = '视频下载链接';
            title.style.marginBottom = '15px';
            resultPopup.appendChild(title);

            // 添加状态栏
            const statusBar = document.createElement('div');
            statusBar.style.marginBottom = '10px';
            statusBar.style.padding = '8px';
            statusBar.style.backgroundColor = '#f5f5f5';
            statusBar.style.borderRadius = '4px';
            statusBar.textContent = '准备获取下载链接...';
            resultPopup.appendChild(statusBar);

            const textarea = document.createElement('textarea');
            textarea.style.width = '100%';
            textarea.style.height = '300px';
            textarea.style.marginBottom = '15px';
            textarea.style.padding = '10px';
            textarea.style.border = '1px solid #ddd';
            textarea.style.borderRadius = '4px';
            textarea.readOnly = true;
            resultPopup.appendChild(textarea);

            const btnGroup = document.createElement('div');
            btnGroup.style.display = 'flex';
            btnGroup.style.justifyContent = 'flex-end';
            btnGroup.style.gap = '10px';

            const copyBtn = document.createElement('button');
            copyBtn.textContent = '复制链接';
            copyBtn.style.padding = '8px 16px';
            copyBtn.style.backgroundColor = '#3370ff';
            copyBtn.style.color = 'white';
            copyBtn.style.border = 'none';
            copyBtn.style.borderRadius = '4px';
            copyBtn.style.cursor = 'pointer';
            copyBtn.addEventListener('click', () => {
                textarea.select();
                document.execCommand('copy');
                alert('链接已复制到剪贴板');
            });

            btnGroup.append(copyBtn);
            resultPopup.appendChild(btnGroup);
            document.body.appendChild(resultPopup);

            // 实时获取并显示下载链接
            for (const index of selectedIndexes) {
                const video = videos[index];
                statusBar.textContent = `正在获取: ${video.name}...`;

                try {
                    const options = await getVideoDownloadOptions(video.element);
                    if (options && options.length > 0) {
                        const bestQuality = options.find(o => o.quality === '原画') ||
                            options[options.length - 1];
                        textarea.value += `${bestQuality.url}\n`;
                        statusBar.textContent = `获取成功: ${video.name}`;
                    } else {
                        statusBar.textContent = `获取失败: ${video.name} (未找到下载链接)`;
                    }
                } catch (e) {
                    statusBar.textContent = `获取失败: ${video.name} (${e.message})`;
                }

                // 滚动到底部
                textarea.scrollTop = textarea.scrollHeight;
                await new Promise(resolve => setTimeout(resolve, 300)); // 添加短暂延迟
            }

            statusBar.textContent = `已完成 ${selectedIndexes.length} 个视频的链接获取`;
        });
    }

    // 主函数
    function main() {
        // 创建主按钮
        const mainBtn = document.createElement('button');
        mainBtn.textContent = '显示视频列表';
        mainBtn.style.position = 'fixed';
        mainBtn.style.bottom = '20px';
        mainBtn.style.left = '20px';  // 从right改为left
        mainBtn.style.padding = '10px 20px';
        mainBtn.style.backgroundColor = '#3370ff';
        mainBtn.style.color = 'white';
        mainBtn.style.border = 'none';
        mainBtn.style.borderRadius = '4px';
        mainBtn.style.cursor = 'pointer';
        mainBtn.style.zIndex = '9998';

        // 创建引导提示
        const guideTip = document.createElement('div');
        guideTip.innerHTML = '请滑动列表等待文档中所有视频元素加载完毕 <br> 重复打开关闭界面可以刷新加载内容 <br> 然后点击此按钮即可下载和获取视频地址 <button id="closeGuide" style="margin-left:10px;background:none;border:none;color:#3370ff;cursor:pointer;">我知道了</button>';
        guideTip.style.position = 'fixed';
        guideTip.style.bottom = '60px';
        guideTip.style.left = '20px';
        guideTip.style.padding = '10px 15px';
        guideTip.style.backgroundColor = '#f0f7ff';
        guideTip.style.border = '1px solid #3370ff';
        guideTip.style.borderRadius = '4px';
        guideTip.style.zIndex = '9997';
        guideTip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';

        // 关闭引导提示
        document.body.appendChild(guideTip);
        guideTip.querySelector('#closeGuide').addEventListener('click', () => {
            document.body.removeChild(guideTip);
        });

        mainBtn.addEventListener('click', () => {
            const videos = getAllVideoElements();
            createVideoListPopup(videos);
        });

        document.body.appendChild(mainBtn);
    }

    // 页面加载完成后执行
    window.addEventListener('load', main);

    // 获取视频下载选项
    async function getVideoDownloadOptions(videoElement) {
        // 点击视频元素展开选项
        const previewBtn = videoElement.querySelector('.btn-preview');
        if (previewBtn) previewBtn.click();

        // 等待选项列表出现
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                const optionsList = document.querySelector('.xg-options-list:not(.hide)');
                if (optionsList) {
                    clearInterval(checkInterval);

                    // 提取所有下载选项
                    const options = Array.from(optionsList.querySelectorAll('.option-item')).map(item => ({
                        text: item.getAttribute('showtext'),
                        url: item.getAttribute('url'),
                        quality: item.getAttribute('definition')
                    }));

                    // 关闭选项列表
                    const closeBtn = document.querySelector('.xg-options-list:not(.hide) .close-btn');
                    if (closeBtn) closeBtn.click();

                    resolve(options);
                }
            }, 200);
        });
    }

    // 创建下载按钮
    function createDownloadButton(video) {
        const btn = document.createElement('button');
        btn.textContent = '下载';
        btn.style.padding = '5px 10px';
        btn.style.backgroundColor = '#3370ff';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';

        btn.addEventListener('click', async () => {
            const options = await getVideoDownloadOptions(video.element);
            if (options && options.length > 0) {
                const optionPopup = document.createElement('div');
                optionPopup.style.position = 'fixed';
                optionPopup.style.top = '50%';
                optionPopup.style.left = '50%';
                optionPopup.style.transform = 'translate(-50%, -50%)';
                optionPopup.style.backgroundColor = 'white';
                optionPopup.style.padding = '20px';
                optionPopup.style.borderRadius = '8px';
                optionPopup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                optionPopup.style.zIndex = '10000';

                // 添加关闭按钮
                const popupCloseBtn = document.createElement('button');
                popupCloseBtn.textContent = '×';
                popupCloseBtn.style.position = 'absolute';
                popupCloseBtn.style.right = '5px';
                popupCloseBtn.style.top = '5px';
                popupCloseBtn.style.border = 'none';
                popupCloseBtn.style.background = 'none';
                popupCloseBtn.style.fontSize = '20px';
                popupCloseBtn.style.cursor = 'pointer';
                popupCloseBtn.addEventListener('click', () => {
                    document.body.removeChild(optionPopup);
                });
                optionPopup.appendChild(popupCloseBtn);

                const title = document.createElement('h4');
                title.textContent = `选择下载清晰度: ${video.name}`;
                optionPopup.appendChild(title);

                options.forEach(option => {
                    const optionBtn = document.createElement('button');
                    optionBtn.textContent = option.text;
                    optionBtn.style.display = 'block';
                    optionBtn.style.width = '100%';
                    optionBtn.style.margin = '5px 0';
                    optionBtn.style.padding = '8px 16px';
                    optionBtn.style.backgroundColor = '#3370ff';
                    optionBtn.style.color = 'white';
                    optionBtn.style.border = 'none';
                    optionBtn.style.borderRadius = '4px';

                    optionBtn.addEventListener('click', () => {
                        window.open(option.url, '_blank');
                        document.body.removeChild(optionPopup);
                    });

                    optionPopup.appendChild(optionBtn);
                });

                document.body.appendChild(optionPopup);
            }
        });

        return btn;
    }
})();