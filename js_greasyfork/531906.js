// ==UserScript==
// @name         小红书点赞数高亮和动态过滤
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  动态高亮笔记和按点赞数过滤内容，点击选择显示大于特定点赞数的内容，不选中的变模糊，支持一键下载所有浏览过的内容
// @author       Your name
// @match        https://www.xiaohongshu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531906/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%82%B9%E8%B5%9E%E6%95%B0%E9%AB%98%E4%BA%AE%E5%92%8C%E5%8A%A8%E6%80%81%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/531906/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%82%B9%E8%B5%9E%E6%95%B0%E9%AB%98%E4%BA%AE%E5%92%8C%E5%8A%A8%E6%80%81%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储所有已加载的笔记数据，使用Map以支持高效去重
    const allLoadedNotes = new Map();

    // 将带"万"的数字转换为实际数值
    function parseCount(str) {
        if (typeof str !== 'string') return 0;
        if (str.includes('万')) {
            return parseFloat(str.replace('万', '')) * 10000;
        }
        return parseInt(str) || 0;
    }

    // 定义颜色阈值和对应的颜色以及发光效果
    const colorRules = [
        { threshold: 10000, color: '#FF4500', glow: '0 0 15px #FF4500, 0 0 30px #FF4500' },
        { threshold: 5000, color: '#FF6347', glow: '0 0 15px #FF6347, 0 0 30px #FF6347' },
        { threshold: 1000, color: '#FFD700', glow: '0 0 15px #FFD700, 0 0 30px #FFD700' },
        { threshold: 500, color: '#32CD32', glow: '0 0 15px #32CD32, 0 0 30px #32CD32' },
        { threshold: 100, color: '#00BFFF', glow: '0 0 15px #00BFFF, 0 0 30px #00BFFF' },
        { threshold: 0, color: '#00CED1', glow: '0 0 15px #00CED1, 0 0 30px #00CED1' }
    ];

    // 当前选中的点赞数阈值
    let currentThreshold = 0;

    // 添加样式
    function addGlobalStyle() {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
            .xhs-note-filtered {
                filter: blur(3px);
                opacity: 0.5;
                transition: all 0.3s ease;
                pointer-events: none;
            }

            .xhs-note-active {
                filter: none;
                opacity: 1;
                transition: all 0.3s ease;
                pointer-events: auto;
            }

            .xhs-filter-container {
                position: fixed;
                top: 70px;
                right: 20px;
                z-index: 9999;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 0 8px rgba(0,0,0,0.3);
                padding: 10px;
                font-size: 14px;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .xhs-download-button {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background-color: #ff2442;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 10px 15px;
                font-size: 14px;
                cursor: pointer;
                box-shadow: 0 0 8px rgba(0,0,0,0.3);
                transition: all 0.2s;
            }

            .xhs-download-button:hover {
                background-color: #e61e3c;
                box-shadow: 0 0 12px rgba(0,0,0,0.4);
            }

            .xhs-counter {
                position: fixed;
                top: 20px;
                right: 180px;
                z-index: 9999;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                border-radius: 4px;
                padding: 10px 15px;
                font-size: 14px;
                pointer-events: none;
            }
        `;
        document.head.appendChild(styleElement);
    }

    function applyFilter() {
        const items = document.querySelectorAll('.note-item');

        items.forEach(item => {
            const countElement = item.querySelector('.count');
            const likes = parseCount(countElement?.textContent || '0');

            // 不隐藏元素，只应用模糊效果
            if (likes >= currentThreshold) {
                item.classList.add('xhs-note-active');
                item.classList.remove('xhs-note-filtered');
            } else {
                item.classList.add('xhs-note-filtered');
                item.classList.remove('xhs-note-active');
            }
        });
    }

    // 添加或更新已加载笔记计数器
    function updateNotesCounter() {
        let counter = document.querySelector('.xhs-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'xhs-counter';
            document.body.appendChild(counter);
        }

        counter.textContent = `已捕获 ${allLoadedNotes.size} 条笔记`;
    }

    // 创建过滤控件
    function createFilterControl() {
        // 检查是否已存在过滤器
        if (document.querySelector('.xhs-filter-container')) {
            return;
        }

        const filterContainer = document.createElement('div');
        filterContainer.className = 'xhs-filter-container';

        const filters = [
            { label: '显示全部 (0+)', value: 0 },
            { label: '100+ 点赞', value: 100 },
            { label: '500+ 点赞', value: 500 },
            { label: '1000+ 点赞', value: 1000 },
            { label: '5000+ 点赞', value: 5000 },
            { label: '10000+ 点赞', value: 10000 }
        ];

        const title = document.createElement('div');
        title.textContent = '按点赞数过滤';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '5px';
        title.style.textAlign = 'center';
        filterContainer.appendChild(title);

        filters.forEach(filter => {
            const button = document.createElement('button');
            button.textContent = filter.label;
            button.style.cssText = `
                padding: 5px 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                background-color: ${filter.value === currentThreshold ? '#ff2442' : 'white'};
                color: ${filter.value === currentThreshold ? 'white' : 'black'};
                cursor: pointer;
                transition: all 0.2s;
                margin-bottom: 3px;
                width: 100%;
            `;

            button.onclick = () => {
                currentThreshold = filter.value;
                // 更新所有按钮的样式
                filterContainer.querySelectorAll('button').forEach(btn => {
                    const btnValue = parseInt(btn.dataset.value);
                    btn.style.backgroundColor = btnValue === currentThreshold ? '#ff2442' : 'white';
                    btn.style.color = btnValue === currentThreshold ? 'white' : 'black';
                });
                applyFilter();
            };

            button.dataset.value = filter.value;
            filterContainer.appendChild(button);
        });

        document.body.appendChild(filterContainer);
        console.log("过滤控件已创建");
    }

    // 捕获笔记信息并存储到集合中
    function captureNoteData(noteElement) {
        try {
            // 提取用户名
            let username = '未知用户';
            const nameElement = noteElement.querySelector('.name, .author-name');
            if (nameElement) {
                username = nameElement.textContent.trim();
            }

            // 提取点赞数
            let likes = '0';
            const countElement = noteElement.querySelector('.count, .like-count');
            if (countElement) {
                likes = countElement.textContent.trim();
            }

            // 提取描述/标题
            let description = '无描述';
            const titleElement = noteElement.querySelector('.title span, .desc, .description');
            if (titleElement) {
                description = titleElement.textContent.trim();
            }

            // 提取笔记ID (替代笔记链接)
            let noteId = '';
            // 从隐藏链接中提取ID
            const hiddenLinkElement = noteElement.querySelector('a[href^="/explore/"][style*="display: none"], a[href^="/search_result/"][style*="display: none"]');
            if (hiddenLinkElement && hiddenLinkElement.getAttribute('href')) {
                const href = hiddenLinkElement.getAttribute('href');
                noteId = href.split('/')[2]?.split('?')[0] || '';
            }

            // 如果没找到隐藏链接，尝试可见链接
            if (!noteId) {
                const visibleLinkElement = noteElement.querySelector('a.cover[href^="/search_result/"], a.cover[href^="/explore/"]');
                if (visibleLinkElement && visibleLinkElement.getAttribute('href')) {
                    const href = visibleLinkElement.getAttribute('href');
                    noteId = href.split('/')[2]?.split('?')[0] || '';
                }
            }

            // 提取用户资料链接
            let userProfileLink = '';
            const authorElement = noteElement.querySelector('a.author[href^="/user/profile/"]');
            if (authorElement && authorElement.getAttribute('href')) {
                const href = authorElement.getAttribute('href');
                const userId = href.split('/')[3]?.split('?')[0];
                if (userId) {
                    userProfileLink = `https://www.xiaohongshu.com/user/profile/${userId}`;
                }
            }

            // 提取封面图链接
            let coverImageUrl = '';
            const imageElement = noteElement.querySelector('img[data-xhs-img]');
            if (imageElement && imageElement.getAttribute('src')) {
                coverImageUrl = imageElement.getAttribute('src');
            }

            // 判断是否为视频
            const isVideo = !!noteElement.querySelector('.play-icon');

            if (description !== '无描述' || username !== '未知用户') {
                // 存储数据时，用noteId替代noteLink
                allLoadedNotes.set(noteId, {
                    username,
                    likes,
                    description,
                    noteId,  // 使用ID代替链接
                    userProfileLink,
                    coverImageUrl,
                    isVideo: isVideo ? '是' : '否',
                    likesCount: parseCount(likes)
                });
            }
        } catch (error) {
            console.error('捕获笔记数据时出错:', error);
        }
    }


    // 扫描页面上的所有笔记
    function scanAllNotes() {
        // 尝试多种可能的笔记元素选择器
        const possibleNoteSelectors = [
            '.note-item',
            '.feed-item',
            '[data-v-a264b01a]',
            '.feed-card',
            '.note',
            '.explore-feed-card',
            '.card'
        ];

        let notesFound = false;

        for (const selector of possibleNoteSelectors) {
            const notes = document.querySelectorAll(selector);
            if (notes.length > 0) {
                notes.forEach(note => captureNoteData(note));
                notesFound = true;
                // 继续尝试其他选择器，以确保捕获所有可能的笔记
            }
        }

        if (notesFound) {
            updateNotesCounter();
        }
    }

    // 高亮点赞数
    function highlightLikes() {
        const items = document.querySelectorAll('.note-item');

        items.forEach(item => {
            const countElement = item.querySelector('.count');
            if (!countElement) return;

            const likes = parseCount(countElement.textContent || '0');

            // 高亮处理
            for (let rule of colorRules) {
                if (likes >= rule.threshold) {
                    item.style.boxShadow = rule.glow;
                    item.style.border = `2px solid ${rule.color}`;
                    item.style.borderRadius = '10px';
                    item.style.transition = 'box-shadow 0.3s ease-in-out, border 0.3s ease-in-out';

                    // 增强显示点赞数
                    countElement.style.fontWeight = 'bold';
                    countElement.style.color = rule.color;
                    break;
                }
            }
        });
    }

    // 创建下载按钮
    function createDownloadButton() {
        // 检查是否已存在下载按钮
        if (document.querySelector('.xhs-download-button')) {
            return;
        }

        const downloadButton = document.createElement('button');
        downloadButton.className = 'xhs-download-button';
        downloadButton.textContent = '下载所有笔记';
        downloadButton.addEventListener('click', downloadCapturedNotes);
        document.body.appendChild(downloadButton);
    }

    // 下载已捕获的所有笔记
    function downloadCapturedNotes() {
        if (allLoadedNotes.size === 0) {
            alert('还没有捕获到任何笔记数据。请滚动页面以加载更多内容。');
            return;
        }

        let notesToExport = Array.from(allLoadedNotes.values());

        // 应用当前的过滤条件（如果有）
        if (currentThreshold > 0) {
            notesToExport = notesToExport.filter(note => note.likesCount >= currentThreshold);

            if (notesToExport.length === 0) {
                alert(`没有找到符合当前过滤条件（${currentThreshold}+ 点赞）的笔记。`);
                return;
            }
        }

        // 按点赞数从高到低排序
        notesToExport.sort((a, b) => b.likesCount - a.likesCount);

        // 在downloadCapturedNotes函数中修改CSV头和内容处理部分
        let csvContent = '用户名,点赞数(原始),点赞数(数值),描述,笔记ID,用户主页,是否视频,封面图链接\n';
        notesToExport.forEach(note => {
            // 处理CSV中的特殊字符，确保不会破坏CSV格式
            const username = `"${note.username.replace(/"/g, '""')}"`;
            const description = `"${note.description.replace(/"/g, '""')}"`;

            // 添加两列点赞数：原始文本形式和数值形式
            csvContent += `${username},${note.likes},${note.likesCount},${description},${note.noteId},${note.userProfileLink},${note.isVideo},${note.coverImageUrl}\n`;
        });

        // 添加UTF-8 BOM以支持中文
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        // 创建下载链接并触发下载
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `小红书内容_${currentThreshold}+点赞_${notesToExport.length}条_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 释放URL对象
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);

        console.log(`已下载 ${notesToExport.length} 条笔记数据`);
    }

    // 初始化
    function init() {
        console.log("小红书点赞数高亮和动态过滤脚本初始化中...");
        // 添加全局样式
        addGlobalStyle();

        // 添加一些延迟以确保页面元素已加载
        setTimeout(() => {
            createFilterControl();
            createDownloadButton();
            updateNotesCounter();
            highlightLikes();
            applyFilter();

            // 初始扫描
            scanAllNotes();
        }, 1000);

        // 监听页面滚动，用于捕获动态加载的笔记
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            // 使用节流技术减少处理频率
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                scanAllNotes();
            }, 300);
        });

        // 观察DOM变化以处理动态内容
        const observer = new MutationObserver((mutations) => {
            // 性能优化：检查是否有相关元素变化
            let hasRelevantChanges = false;
            let newNotes = [];

            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            // 收集所有可能的笔记元素
                            if (node.classList &&
                                (node.classList.contains('note-item') ||
                                 node.classList.contains('feed-item'))) {
                                newNotes.push(node);
                                hasRelevantChanges = true;
                            } else {
                                // 检查子元素
                                const childNotes = node.querySelectorAll('.note-item, .feed-item, [data-v-a264b01a]');
                                if (childNotes.length > 0) {
                                    newNotes.push(...childNotes);
                                    hasRelevantChanges = true;
                                }
                            }
                        }
                    }
                }
            }

            if (hasRelevantChanges) {
                highlightLikes();
                applyFilter();

                // 捕获新加载的笔记数据
                newNotes.forEach(note => captureNoteData(note));

                // 如果找到了新笔记，更新计数器
                if (newNotes.length > 0) {
                    updateNotesCounter();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 定期扫描页面，确保不会漏掉任何笔记
        setInterval(scanAllNotes, 5000);
    }

    // 等待页面加载完毕
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
