// 實時重新排序標籤
// ==UserScript==
// @name         DLsite Record Enhanced Tag Manager
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  亮色系 DLsite 記錄工具，支援記錄時間、標籤管理和匯出匯入功能
// @author       Enhanced by Claude
// @match        https://www.dlsite.com/maniax/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529979/DLsite%20Record%20Enhanced%20Tag%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/529979/DLsite%20Record%20Enhanced%20Tag%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS 樣式
    const styles = `
        .dlsite-record-btn {
            margin: 5px;
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .dlsite-record-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .dlsite-record-btn svg {
            margin-right: 5px;
        }
        .dlsite-record-add {
            background-color: #1a73e8; /* 深藍色 */
        }
        .dlsite-record-toggle {
            background-color: #34a853; /* 綠色 */
        }
        .dlsite-record-export {
            background-color: #ea4335; /* 紅色 */
        }
        .dlsite-record-import {
            background-color: #fbbc05; /* 黃色 */
            color: #333;
        }
        .dlsite-record-info {
            display: inline-flex;
            align-items: center;
            padding: 5px 10px;
            margin: 5px;
            border-radius: 4px;
            background-color: #f0f8ff;
            color: #333;
            font-weight: bold;
            border: 1px solid #d0e5ff;
        }
        .dlsite-record-info svg {
            margin-right: 5px;
            color: #4285f4;
        }
        .dlsite-record-highlight {
            background-color: rgba(232, 240, 254, 0.5) !important; /* 非常淡的藍色背景 + 半透明 */
            border-left: 4px solid #4a86e8 !important; /* 淡藍色邊框 */
        }
        .dlsite-record-time {
            font-size: 12px;
            color: #666;
            margin-left: 8px;
            white-space: nowrap;
        }
        .dlsite-record-item-button {
            background-color: #ea4335;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            padding: 2px 8px;
            font-size: 12px;
            margin-left: 5px;
            transition: all 0.2s;
            font-weight: bold;
        }
        .dlsite-record-item-button:hover {
            background-color: #d73125;
            transform: translateY(-1px);
        }
        .dlsite-record-item-button.add {
            background-color: #1a73e8;
        }
        .dlsite-record-item-button.add:hover {
            background-color: #1967d2;
        }
        .dlsite-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: rgba(66, 133, 244, 0.9);
            color: white;
            border-radius: 4px;
            z-index: 10000;
            animation: fadeInOut 3s;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
        }
        .dlsite-record-controls {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background-color: #f9fcff; /* 非常淡的藍色背景 */
            border-radius: 4px;
            margin: 10px 0;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border: 1px solid #d0e5ff;
        }
        .dlsite-record-controls-left,
        .dlsite-record-controls-center,
        .dlsite-record-controls-right {
            display: flex;
            align-items: center;
        }
        .dlsite-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        }
        .dlsite-modal-content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            width: 80%;
            max-width: 600px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            color: #333;
        }
        .dlsite-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 10px;
        }
        .dlsite-modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #888;
        }
        .dlsite-modal-close:hover {
            color: #333;
        }
        .dlsite-modal-body {
            margin-bottom: 15px;
        }
        .dlsite-modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        .dlsite-modal textarea {
            width: 100%;
            height: 200px;
            background-color: #f5f5f5;
            color: #333;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 4px;
            resize: vertical;
            font-family: monospace;
        }
        .dlsite-modal-btn {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        .dlsite-modal-btn-primary {
            background-color: #1a73e8;
            color: white;
        }
        .dlsite-modal-btn-secondary {
            background-color: #e0e0e0;
            color: #333;
        }
        /* 新增的 Tag 和公司 相關樣式 */
        /* 標籤包裝容器 */
        .dlsite-tag-wrapper {
            display: inline-flex;
            align-items: stretch;
            margin-right: 8px;
            margin-bottom: 5px;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            position: relative;
        }
        /* 標籤樣式 */
        .dlsite-tag-wrapper a {
            display: inline-block;
            background-color: #e8f0ff;
            padding: 3px 8px;
            color: #2a5db0;
            text-decoration: none;
            transition: all 0.2s ease;
            font-size: 11px;
            border-radius: 4px;
        }
        .dlsite-tag-wrapper a:hover {
            background-color: #d4e4ff;
        }
        /* 按鈕樣式 */
        .dlsite-tag-toggle-btn {
            display: none; /* 默認隱藏 */
            align-items: center;
            justify-content: center;
            min-width: 20px;
            background-color: #4a86e8;
            color: white;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
            border-radius: 0 4px 4px 0;
            padding: 0;
        }
        /* 當滑鼠懸停在標籤上時顯示按鈕 */
        .dlsite-tag-wrapper:hover .dlsite-tag-toggle-btn {
            display: inline-flex;
        }
        /* 將被收藏標籤的按鈕始終顯示 */
        .dlsite-tag-toggle-btn.active {
            display: inline-flex;
        }
        .dlsite-tag-toggle-btn:hover {
            background-color: #3b78e0;
        }
        .dlsite-tag-toggle-btn.active {
            background-color: #ea4335;
        }
        .dlsite-tag-toggle-btn.active:hover {
            background-color: #d73125;
        }
        /* 高亮標籤樣式 */
        .dlsite-tag-highlight {
            background-color: #fff0d9 !important;
            color: #c05e11 !important;
        }
        .dlsite-maker-highlight {
            background-color: #e0f2ff !important;
            color: #0f5a9c !important;
        }
        /* 收藏標籤區域 */
        .dlsite-priority-tags {
            background-color: #f5f5f5;
            border-radius: 6px;
            padding: 8px 12px;
            margin-bottom: 12px;
        }
        /* 公司名稱與按鈕容器 */
        .dlsite-maker-wrapper {
            display: inline-flex;
            align-items: center;
            margin-right: 10px;
        }
        /* 公司按鈕特殊調整 */
        .dlsite-maker-btn {
            margin-left: 6px;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            font-size: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: #4a86e8;
            color: white;
            border: none;
            cursor: pointer;
        }
        .dlsite-maker-btn:hover {
            background-color: #3b78e0;
        }
        .dlsite-maker-btn.active {
            background-color: #ea4335;
        }
        .dlsite-maker-btn.active:hover {
            background-color: #d73125;
        }
    `;

    const reorderTags = (container) => {
        if (!container) return;

        // 獲取所有標籤包裝器
        const wrappers = Array.from(container.querySelectorAll('.dlsite-tag-wrapper'));

        // 分離收藏和未收藏的標籤
        const favWrappers = [];
        const nonFavWrappers = [];

        wrappers.forEach(wrapper => {
            const tagLink = wrapper.querySelector('a');
            if (tagLink && tagLink.classList.contains('dlsite-tag-highlight')) {
                favWrappers.push(wrapper.cloneNode(true));
            } else {
                nonFavWrappers.push(wrapper.cloneNode(true));
            }
        });

        // 清空容器
        container.innerHTML = '';

        // 先添加收藏的標籤
        if (favWrappers.length > 0) {
            favWrappers.forEach(wrapper => {
                // 重新綁定事件
                const btn = wrapper.querySelector('.dlsite-tag-toggle-btn');
                const tagLink = wrapper.querySelector('a');
                if (btn && tagLink) {
                    const tagName = tagLink.textContent.trim();
                    const tagHref = tagLink.getAttribute('href');
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const newState = toggleFavoriteTag(tagName, tagHref);
                        if (!newState) {
                            // 立即更新UI
                            reorderTags(container);
                            showToast(`已取消收藏標籤：${tagName}`);
                        }
                    });
                }
                container.appendChild(wrapper);
            });

            // 添加分隔符
            if (nonFavWrappers.length > 0) {
                const separator = document.createElement('div');
                separator.style.borderBottom = '1px dashed #ddd';
                separator.style.margin = '6px 0';
                separator.style.width = '100%';
                container.appendChild(separator);
            }
        }

        // 添加未收藏的標籤
        nonFavWrappers.forEach(wrapper => {
            // 重新綁定事件
            const btn = wrapper.querySelector('.dlsite-tag-toggle-btn');
            const tagLink = wrapper.querySelector('a');
            if (btn && tagLink) {
                const tagName = tagLink.textContent.trim();
                const tagHref = tagLink.getAttribute('href');
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newState = toggleFavoriteTag(tagName, tagHref);
                    if (newState) {
                        // 立即更新UI
                        reorderTags(container);
                        showToast(`已收藏標籤：${tagName}`);
                    }
                });
            }
            container.appendChild(wrapper);
        });
    };

    // 添加 CSS
    const addStyle = (css) => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    addStyle(styles);

    // 工具函數
    const getTableBody = () => {
        const table = document.querySelector('table.work_1col_table.n_worklist');
        if (table && table.tBodies.length > 0) {
            return table.tBodies[0];
        }
        return null;
    };

    const getRecord = () => {
        const recordStr = localStorage.getItem("record");
        if (recordStr) {
            try {
                return JSON.parse(recordStr);
            } catch (e) {
                return [];
            }
        }
        return [];
    };

    const setRecord = (record) => {
        localStorage.setItem("record", JSON.stringify(record));
    };

    // 標籤和公司收藏相關函數
    const getFavoriteTags = () => {
        const tagsStr = localStorage.getItem("dlsite-favorite-tags");
        if (tagsStr) {
            try {
                return JSON.parse(tagsStr);
            } catch (e) {
                return [];
            }
        }
        return [];
    };

    const setFavoriteTags = (tags) => {
        localStorage.setItem("dlsite-favorite-tags", JSON.stringify(tags));
    };

    const getFavoriteMakers = () => {
        const makersStr = localStorage.getItem("dlsite-favorite-makers");
        if (makersStr) {
            try {
                return JSON.parse(makersStr);
            } catch (e) {
                return [];
            }
        }
        return [];
    };

    const setFavoriteMakers = (makers) => {
        localStorage.setItem("dlsite-favorite-makers", JSON.stringify(makers));
    };

    const toggleFavoriteTag = (tagName, tagHref) => {
        const tags = getFavoriteTags();
        const existingIndex = tags.findIndex(t => t.name === tagName);

        if (existingIndex > -1) {
            // 移除
            tags.splice(existingIndex, 1);
            setFavoriteTags(tags);
            return false; // 返回當前狀態（未收藏）
        } else {
            // 添加
            tags.push({ name: tagName, href: tagHref });
            setFavoriteTags(tags);
            return true; // 返回當前狀態（已收藏）
        }
    };

    const toggleFavoriteMaker = (makerName, makerId) => {
        const makers = getFavoriteMakers();
        const existingIndex = makers.findIndex(m => m.name === makerName);

        if (existingIndex > -1) {
            // 移除
            makers.splice(existingIndex, 1);
            setFavoriteMakers(makers);
            return false; // 返回當前狀態（未收藏）
        } else {
            // 添加
            makers.push({ name: makerName, id: makerId });
            setFavoriteMakers(makers);
            return true; // 返回當前狀態（已收藏）
        }
    };

    const isTagFavorited = (tagName) => {
        const tags = getFavoriteTags();
        return tags.some(t => t.name === tagName);
    };

    const isMakerFavorited = (makerName) => {
        const makers = getFavoriteMakers();
        return makers.some(m => m.name === makerName);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'dlsite-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    };

    // 檢查ID是否在記錄中
    const isRecorded = (workId) => {
        const record = getRecord();
        return record.some(item => item.id === workId);
    };

    // 獲取ID的記錄時間
    const getRecordTime = (workId) => {
        const record = getRecord();
        const item = record.find(item => item.id === workId);
        return item ? item.time : null;
    };

    // 獲取當前頁面隱藏的作品數量
    const getHiddenCount = () => {
        const tableBody = getTableBody();
        if (!tableBody) return 0;

        const rows = Array.from(tableBody.rows);
        let hiddenCount = 0;

        rows.forEach(row => {
            const link = row.querySelector('dl dt a');
            if (!link) return;

            const url = link.href.split("/").filter(i => i !== '');
            const workId = url[url.length - 1];

            if (isRecorded(workId) && row.style.display === "none") {
                hiddenCount++;
            }
        });

        return hiddenCount;
    };

    // 更新隱藏計數顯示
    const updateHiddenCountDisplay = () => {
        const hiddenCount = getHiddenCount();
        const hiddenCountElem = document.getElementById('dlsite-record-hidden-count');
        if (hiddenCountElem) {
            hiddenCountElem.textContent = `本頁隱藏：${hiddenCount} 筆`;
        }
    };

    // 為 Tag 添加切換按鈕並將已收藏標籤移到前面
    const addTagToggleButtons = () => {
        // 選擇搜索頁的標籤
        const tagContainers = document.querySelectorAll('.search_tag');

        tagContainers.forEach(container => {
            // 獲取所有標籤
            const tagLinks = Array.from(container.querySelectorAll('a'));
            const favTagLinks = [];
            const nonFavTagLinks = [];

            // 清空容器
            container.innerHTML = '';

            // 根據收藏狀態分組並創建新的標籤+按鈕組合
            tagLinks.forEach(tagLink => {
                const tagName = tagLink.textContent.trim();
                const tagHref = tagLink.getAttribute('href');
                const isFavorited = isTagFavorited(tagName);

                // 創建包裝元素
                const wrapper = document.createElement('div');
                wrapper.className = 'dlsite-tag-wrapper';

                // 複製標籤
                const clonedLink = document.createElement('a');
                clonedLink.href = tagHref;
                clonedLink.textContent = tagName;
                if (isFavorited) {
                    clonedLink.classList.add('dlsite-tag-highlight');
                }

                // 創建按鈕
                const btn = document.createElement('button');
                btn.className = `dlsite-tag-toggle-btn ${isFavorited ? 'active' : ''}`;
                btn.textContent = isFavorited ? '-' : '+';
                btn.title = isFavorited ? '取消收藏標籤' : '收藏標籤';

                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const newState = toggleFavoriteTag(tagName, tagHref);
                    btn.textContent = newState ? '-' : '+';
                    btn.title = newState ? '取消收藏標籤' : '收藏標籤';
                    btn.className = `dlsite-tag-toggle-btn ${newState ? 'active' : ''}`;

                    // 更新標籤樣式
                    if (newState) {
                        clonedLink.classList.add('dlsite-tag-highlight');
                    } else {
                        clonedLink.classList.remove('dlsite-tag-highlight');
                    }

                    // 立即重新排序標籤，而不是刷新頁面
                    reorderTags(container);

                    showToast(newState ? `已收藏標籤：${tagName}` : `已取消收藏標籤：${tagName}`);
                });

                // 為了確保按鈕可點擊性，增加最小尺寸
                btn.style.minWidth = '22px';
                btn.style.minHeight = '22px';

                // 將標籤和按鈕添加到包裝元素
                wrapper.appendChild(clonedLink);
                wrapper.appendChild(btn);

                // 根據收藏狀態分組
                if (isFavorited) {
                    favTagLinks.push(wrapper);
                } else {
                    nonFavTagLinks.push(wrapper);
                }
            });

            // 如果有收藏的標籤，優先顯示並添加分隔線
            if (favTagLinks.length > 0) {
                // 優先顯示收藏的標籤
                favTagLinks.forEach(wrapper => {
                    container.appendChild(wrapper);
                });

                // 添加分隔符
                if (nonFavTagLinks.length > 0) {
                    const separator = document.createElement('div');
                    separator.style.borderBottom = '1px dashed #ddd';
                    separator.style.margin = '6px 0';
                    separator.style.width = '100%';
                    container.appendChild(separator);
                }
            }

            // 顯示其他標籤
            nonFavTagLinks.forEach(wrapper => {
                container.appendChild(wrapper);
            });
        });
    };

    // 為公司添加切換按鈕
    const addMakerToggleButtons = () => {
        const makerContainers = document.querySelectorAll('.maker_name');

        makerContainers.forEach(container => {
            const makerElements = container.querySelectorAll('a');

            makerElements.forEach(makerElement => {
                // 檢查公司名稱後面是否已有按鈕
                let nextNode = makerElement.nextSibling;
                let hasButton = false;
                while (nextNode) {
                    if (nextNode.classList && nextNode.classList.contains('dlsite-maker-toggle-btn')) {
                        hasButton = true;
                        break;
                    }
                    nextNode = nextNode.nextSibling;
                }

                if (hasButton) {
                    return; // 已經添加過按鈕，跳過
                }

                const makerName = makerElement.textContent.trim();
                const makerHref = makerElement.getAttribute('href');
                const makerId = makerHref.match(/maker_id\/([^.]+)\.html/)?.[1] || '';
                const isFavorited = isMakerFavorited(makerName);

                // 初始化公司樣式
                if (isFavorited) {
                    makerElement.classList.add('dlsite-maker-highlight');
                }

                // 建立按鈕
                const btn = document.createElement('button');
                btn.className = `dlsite-maker-toggle-btn dlsite-maker-btn ${isFavorited ? 'active' : ''}`;
                btn.textContent = isFavorited ? '-' : '+';
                btn.title = isFavorited ? '取消收藏公司' : '收藏公司';

                // 為了確保按鈕可點擊性，增加最小尺寸
                btn.style.minWidth = '20px';
                btn.style.minHeight = '20px';

                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const newState = toggleFavoriteMaker(makerName, makerId);
                    btn.textContent = newState ? '-' : '+';
                    btn.title = newState ? '取消收藏公司' : '收藏公司';
                    btn.className = `dlsite-maker-toggle-btn dlsite-maker-btn ${newState ? 'active' : ''}`;

                    // 更新公司樣式
                    if (newState) {
                        makerElement.classList.add('dlsite-maker-highlight');
                    } else {
                        makerElement.classList.remove('dlsite-maker-highlight');
                    }

                    showToast(newState ? `已收藏公司：${makerName}` : `已取消收藏公司：${makerName}`);
                });

                // 為了保持樣式一致，使用包裝元素
                const wrapper = document.createElement('span');
                wrapper.className = 'dlsite-maker-wrapper';
                wrapper.style.position = 'relative';
                wrapper.style.display = 'inline-block';

                // 複製公司鏈接到包裝元素
                const clonedMaker = makerElement.cloneNode(true);

                // 將原始元素替換為包裝元素
                makerElement.parentNode.replaceChild(wrapper, makerElement);

                // 將複製的鏈接和按鈕添加到包裝元素
                wrapper.appendChild(clonedMaker);
                wrapper.appendChild(btn);
            });
        });
    };

    // 隱藏已記錄的作品
    const hideRecorded = () => {
        const tableBody = getTableBody();
        if (!tableBody) return;

        const rows = Array.from(tableBody.rows);
        let hiddenCount = 0;

        rows.forEach(row => {
            const link = row.querySelector('dl dt a');
            if (!link) return;

            const url = link.href.split("/").filter(i => i !== '');
            const workId = url[url.length - 1];

            if (isRecorded(workId)) {
                row.style.display = "none";
                hiddenCount++;
            }
        });

        updateHiddenCountDisplay();
        return hiddenCount;
    };

    // 顯示/隱藏已記錄的作品
    const toggleRecorded = () => {
        const tableBody = getTableBody();
        if (!tableBody) return;

        const rows = Array.from(tableBody.rows);
        let visibleCount = 0;
        let hiddenCount = 0;

        rows.forEach(row => {
            const link = row.querySelector('dl dt a');
            if (!link) return;

            const url = link.href.split("/").filter(i => i !== '');
            const workId = url[url.length - 1];

            if (isRecorded(workId)) {
                row.style.display = row.style.display === "none" ? "table-row" : "none";
                if (row.style.display === "none") {
                    hiddenCount++;
                } else {
                    visibleCount++;
                }
            }
        });

        updateHiddenCountDisplay();

        if (hiddenCount > 0) {
            showToast(`已隱藏 ${hiddenCount} 筆已記錄的作品`);
        } else if (visibleCount > 0) {
            showToast(`已顯示 ${visibleCount} 筆已記錄的作品`);
        } else {
            showToast('沒有已記錄的作品可以隱藏或顯示');
        }
    };

    const highlightRecorded = () => {
        const tableBody = getTableBody();
        if (!tableBody) return;

        const rows = Array.from(tableBody.rows);

        rows.forEach(row => {
            const link = row.querySelector('dl dt a');
            if (!link) return;

            const url = link.href.split("/").filter(i => i !== '');
            const workId = url[url.length - 1];

            if (isRecorded(workId)) {
                row.classList.add('dlsite-record-highlight');

                // 添加取消記錄按鈕和時間
                const titleCell = row.querySelector('dl dt');
                if (titleCell) {
                    // 檢查是否已經有按鈕和時間標記，如果有則不重複添加
                    if (!titleCell.querySelector('.dlsite-record-item-button')) {
                        // 添加時間顯示
                        const recordTime = getRecordTime(workId);
                        const timeSpan = document.createElement('span');
                        timeSpan.className = 'dlsite-record-time';
                        timeSpan.textContent = recordTime ? `記錄於: ${formatDate(recordTime)}` : '';

                        // 添加取消記錄按鈕
                        const removeButton = document.createElement('button');
                        removeButton.className = 'dlsite-record-item-button';
                        removeButton.textContent = '取消記錄';
                        removeButton.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFromRecord(workId, row);
                        });

                        titleCell.appendChild(timeSpan);
                        titleCell.appendChild(removeButton);
                    }
                }
            } else {
                row.classList.remove('dlsite-record-highlight');

                // 移除時間標記
                const timeSpan = row.querySelector('.dlsite-record-time');
                if (timeSpan) {
                    timeSpan.remove();
                }

                // 添加記錄按鈕
                const titleCell = row.querySelector('dl dt');
                if (titleCell && !titleCell.querySelector('.dlsite-record-item-button')) {
                    const addButton = document.createElement('button');
                    addButton.className = 'dlsite-record-item-button add';
                    addButton.textContent = '記錄';
                    addButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToRecord(workId, row);
                    });
                    titleCell.appendChild(addButton);
                }
            }
        });

        // 添加標籤和公司切換按鈕
        addTagToggleButtons();
        addMakerToggleButtons();

        updateHiddenCountDisplay();
    };

    const addToRecord = (workId, row = null) => {
        const record = getRecord();
        if (isRecorded(workId)) return;

        const currentTime = new Date().toISOString();
        record.push({
            id: workId,
            time: currentTime
        });

        setRecord(record);

        if (row) {
            row.classList.add('dlsite-record-highlight');

            // 更新UI
            const titleCell = row.querySelector('dl dt');
            if (titleCell) {
                // 移除舊的記錄按鈕
                const oldButton = titleCell.querySelector('.dlsite-record-item-button');
                if (oldButton) {
                    oldButton.remove();
                }

                // 添加時間顯示
                const timeSpan = document.createElement('span');
                timeSpan.className = 'dlsite-record-time';
                timeSpan.textContent = `記錄於: ${formatDate(currentTime)}`;

                // 添加取消記錄按鈕
                const removeButton = document.createElement('button');
                removeButton.className = 'dlsite-record-item-button';
                removeButton.textContent = '取消記錄';
                removeButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFromRecord(workId, row);
                });

                titleCell.appendChild(timeSpan);
                titleCell.appendChild(removeButton);
            }

            // 不立即隱藏新記錄的行，等待頁面刷新後再隱藏
        }

        updateCountDisplay();
        updateHiddenCountDisplay();
        showToast(`已將作品 ${workId} 加入記錄`);
    };

    const removeFromRecord = (workId, row = null) => {
        const record = getRecord();
        const index = record.findIndex(item => item.id === workId);
        if (index === -1) return;

        record.splice(index, 1);
        setRecord(record);

        if (row) {
            row.classList.remove('dlsite-record-highlight');
            row.style.display = "table-row"; // 取消記錄後顯示該行

            // 更新UI
            const titleCell = row.querySelector('dl dt');
            if (titleCell) {
                // 移除時間顯示
                const timeSpan = titleCell.querySelector('.dlsite-record-time');
                if (timeSpan) {
                    timeSpan.remove();
                }

                // 移除舊的取消記錄按鈕
                const oldButton = titleCell.querySelector('.dlsite-record-item-button');
                if (oldButton) {
                    oldButton.remove();
                }

                // 添加記錄按鈕
                const addButton = document.createElement('button');
                addButton.className = 'dlsite-record-item-button add';
                addButton.textContent = '記錄';
                addButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToRecord(workId, row);
                });
                titleCell.appendChild(addButton);
            }
        }

        updateCountDisplay();
        updateHiddenCountDisplay();
        showToast(`已將作品 ${workId} 從記錄中移除`);
    };

    const addAllRecord = () => {
        const tableBody = getTableBody();
        if (!tableBody) return;

        const rows = Array.from(tableBody.rows);
        const record = getRecord();
        let newCount = 0;
        const currentTime = new Date().toISOString();

        rows.forEach(row => {
            const link = row.querySelector('dl dt a');
            if (!link) return;

            const url = link.href.split("/").filter(i => i !== '');
            const workId = url[url.length - 1];

            if (!isRecorded(workId)) {
                record.push({
                    id: workId,
                    time: currentTime
                });
                newCount++;

                // 更新UI
                row.classList.add('dlsite-record-highlight');

                const titleCell = row.querySelector('dl dt');
                if (titleCell) {
                    // 移除舊的記錄按鈕
                    const oldButton = titleCell.querySelector('.dlsite-record-item-button');
                    if (oldButton) {
                        oldButton.remove();
                    }

                    // 添加時間顯示
                    const timeSpan = document.createElement('span');
                    timeSpan.className = 'dlsite-record-time';
                    timeSpan.textContent = `記錄於: ${formatDate(currentTime)}`;

                    // 添加取消記錄按鈕
                    const removeButton = document.createElement('button');
                    removeButton.className = 'dlsite-record-item-button';
                    removeButton.textContent = '取消記錄';
                    removeButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromRecord(workId, row);
                    });

                    titleCell.appendChild(timeSpan);
                    titleCell.appendChild(removeButton);
                }
            }
        });

        if (newCount > 0) {
            setRecord(record);
            updateCountDisplay();
            updateHiddenCountDisplay();
            showToast(`已添加 ${newCount} 筆新記錄，共有 ${record.length} 筆記錄`);
        } else {
            showToast('沒有新的作品可以記錄');
        }
    };

    const updateCountDisplay = () => {
        const record = getRecord();
        const countElem = document.getElementById('dlsite-record-count');
        if (countElem) {
            countElem.textContent = `已記錄：${record.length} 筆`;
        }
    };

    // 匯出和匯入功能
    const exportRecord = () => {
        const record = getRecord();
        const favoriteTags = getFavoriteTags();
        const favoriteMakers = getFavoriteMakers();

        const exportData = JSON.stringify({
            record: record,
            favoriteTags: favoriteTags,
            favoriteMakers: favoriteMakers
        }, null, 2);

        const modal = document.createElement('div');
        modal.className = 'dlsite-modal';
        modal.innerHTML = `
            <div class="dlsite-modal-content">
                <div class="dlsite-modal-header">
                    <h3>匯出記錄</h3>
                    <button class="dlsite-modal-close">&times;</button>
                </div>
                <div class="dlsite-modal-body">
                    <p>以下是您的記錄資料（包含作品記錄、收藏標籤和收藏公司），請複製並保存：</p>
                    <textarea readonly>${exportData}</textarea>
                </div>
                <div class="dlsite-modal-footer">
                    <button class="dlsite-modal-btn dlsite-modal-btn-primary" id="dlsite-copy-btn">複製</button>
                    <button class="dlsite-modal-btn dlsite-modal-btn-secondary" id="dlsite-modal-close-btn">關閉</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 綁定事件
        modal.querySelector('.dlsite-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#dlsite-modal-close-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#dlsite-copy-btn').addEventListener('click', () => {
            const textarea = modal.querySelector('textarea');
            textarea.select();
            document.execCommand('copy');
            showToast('已複製到剪貼簿');
        });
    };

    const importRecord = () => {
        const modal = document.createElement('div');
        modal.className = 'dlsite-modal';
        modal.innerHTML = `
            <div class="dlsite-modal-content">
                <div class="dlsite-modal-header">
                    <h3>匯入記錄</h3>
                    <button class="dlsite-modal-close">&times;</button>
                </div>
                <div class="dlsite-modal-body">
                    <p>請貼上之前匯出的記錄資料：</p>
                    <textarea placeholder="在這裡貼上 JSON 格式的記錄資料..."></textarea>
                </div>
                <div class="dlsite-modal-footer">
                    <button class="dlsite-modal-btn dlsite-modal-btn-primary" id="dlsite-import-btn">匯入</button>
                    <button class="dlsite-modal-btn dlsite-modal-btn-secondary" id="dlsite-modal-close-btn">取消</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 綁定事件
        modal.querySelector('.dlsite-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#dlsite-modal-close-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#dlsite-import-btn').addEventListener('click', () => {
            const textarea = modal.querySelector('textarea');
            try {
                const importData = JSON.parse(textarea.value);

                // 支持新舊格式
                if (Array.isArray(importData)) {
                    // 舊格式（只有作品記錄）
                    handleImportedRecords(importData);
                } else if (typeof importData === 'object') {
                    // 新格式（同時包含作品記錄、標籤和公司）
                    if (importData.record) {
                        handleImportedRecords(importData.record);
                    }

                    if (importData.favoriteTags) {
                        setFavoriteTags(importData.favoriteTags);
                    }

                    if (importData.favoriteMakers) {
                        setFavoriteMakers(importData.favoriteMakers);
                    }
                } else {
                    throw new Error('匯入的資料格式不正確');
                }

                // 重新套用 UI
                highlightRecorded();
                updateCountDisplay();
                updateHiddenCountDisplay();

                document.body.removeChild(modal);
                showToast(`已成功匯入記錄資料`);
            } catch (error) {
                showToast(`匯入失敗：${error.message}`);
            }
        });
    };

    // 處理匯入的作品記錄
    const handleImportedRecords = (importData) => {
        // 檢查資料格式
        let validData = [];

        // 支持新舊兩種格式
        if (Array.isArray(importData)) {
            importData.forEach(item => {
                if (typeof item === 'string') {
                    // 舊格式，僅ID
                    validData.push({
                        id: item,
                        time: new Date().toISOString()
                    });
                } else if (typeof item === 'object' && item.hasOwnProperty('id')) {
                    // 新格式，包含ID和時間
                    validData.push({
                        id: item.id,
                        time: item.time || new Date().toISOString()
                    });
                }
            });
        }

        if (validData.length === 0) {
            throw new Error('匯入的資料不包含有效記錄');
        }

        // 合併現有記錄和匯入的記錄
        const currentRecord = getRecord();

        // 去重，保留時間較早的記錄
        const recordMap = new Map();

        // 先加入當前記錄
        currentRecord.forEach(item => {
            recordMap.set(item.id, item);
        });

        // 再加入匯入記錄，只有當ID不存在時才加入
        validData.forEach(item => {
            if (!recordMap.has(item.id)) {
                recordMap.set(item.id, item);
            }
        });

        // 轉換回陣列
        const mergedRecord = Array.from(recordMap.values());
        setRecord(mergedRecord);

        return mergedRecord;
    };

    // 創建控制面板
    const createControlPanel = () => {
        const controlPanel = document.createElement('div');
        controlPanel.className = 'dlsite-record-controls';

        // 左側區域：顯示信息
        const leftSection = document.createElement('div');
        leftSection.className = 'dlsite-record-controls-left';

        // 計數顯示
        const countDisplay = document.createElement('div');
        countDisplay.className = 'dlsite-record-info';
        countDisplay.id = 'dlsite-record-count';
        countDisplay.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
            </svg>
            已記錄：0 筆
        `;

        // 隱藏計數顯示
        const hiddenCountDisplay = document.createElement('div');
        hiddenCountDisplay.className = 'dlsite-record-info';
        hiddenCountDisplay.id = 'dlsite-record-hidden-count';
        hiddenCountDisplay.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
            本頁隱藏：0 筆
        `;

        leftSection.appendChild(countDisplay);
        leftSection.appendChild(hiddenCountDisplay);

        // 中間區域：功能按鈕
        const centerSection = document.createElement('div');
        centerSection.className = 'dlsite-record-controls-center';

        // 記錄當前頁按鈕
        const addButton = document.createElement('button');
        addButton.className = 'dlsite-record-btn dlsite-record-add';
        addButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            記錄此頁
        `;
        addButton.addEventListener('click', addAllRecord);

        // 顯示/隱藏按鈕
        const toggleButton = document.createElement('button');
        toggleButton.className = 'dlsite-record-btn dlsite-record-toggle';
        toggleButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
            隱藏/顯示已記錄
        `;
        toggleButton.addEventListener('click', toggleRecorded);

        centerSection.appendChild(addButton);
        centerSection.appendChild(toggleButton);

        // 右側區域：資料管理按鈕
        const rightSection = document.createElement('div');
        rightSection.className = 'dlsite-record-controls-right';

        // 匯出按鈕
        const exportButton = document.createElement('button');
        exportButton.className = 'dlsite-record-btn dlsite-record-export';
        exportButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            匯出記錄
        `;
        exportButton.addEventListener('click', exportRecord);

        // 匯入按鈕
        const importButton = document.createElement('button');
        importButton.className = 'dlsite-record-btn dlsite-record-import';
        importButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            匯入記錄
        `;
        importButton.addEventListener('click', importRecord);

        rightSection.appendChild(exportButton);
        rightSection.appendChild(importButton);

        // 組合所有區域
        controlPanel.appendChild(leftSection);
        controlPanel.appendChild(centerSection);
        controlPanel.appendChild(rightSection);

        // 插入到合適的位置
        const target = document.querySelector('.work_list_header, .work_1col_table');
        if (target) {
            target.parentNode.insertBefore(controlPanel, target);
        } else {
            // 如果找不到合適的位置，放在頁面頂部
            const header = document.getElementById('header');
            if (header) {
                header.parentNode.insertBefore(controlPanel, header.nextSibling);
            }
        }

        updateCountDisplay();
        updateHiddenCountDisplay();
    };

    // 檢查是否在作品詳情頁
    const addDetailPageButton = () => {
        const workId = window.location.pathname.match(/RJ(\d+)/i);
        if (!workId) return;

        const isWorkRecorded = isRecorded(workId[0]);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '15px';

        const recordButton = document.createElement('button');
        recordButton.className = `dlsite-record-btn ${isWorkRecorded ? 'dlsite-record-toggle' : 'dlsite-record-add'}`;
        recordButton.innerHTML = isWorkRecorded ?
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            取消記錄` :
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            記錄此作品`;

        recordButton.addEventListener('click', () => {
            if (isWorkRecorded) {
                removeFromRecord(workId[0]);
            } else {
                addToRecord(workId[0]);
            }
            // 重新載入以更新按鈕狀態
            location.reload();
        });

        buttonContainer.appendChild(recordButton);

        // 顯示記錄時間（如果有的話）
        if (isWorkRecorded) {
            const recordTime = getRecordTime(workId[0]);
            if (recordTime) {
                const timeInfo = document.createElement('div');
                timeInfo.style.marginTop = '5px';
                timeInfo.style.fontSize = '12px';
                timeInfo.style.color = '#666';
                timeInfo.textContent = `記錄於: ${formatDate(recordTime)}`;
                buttonContainer.appendChild(timeInfo);
            }
        }

        // 插入到作品購買按鈕附近
        const buySection = document.querySelector('.work_buy_section');
        if (buySection) {
            buySection.appendChild(buttonContainer);
        }

        // 在詳情頁也添加標籤和公司的收藏按鈕
        addDetailPageTagsButtons();
        addDetailPageMakerButtons();
    };

    // 在詳情頁添加標籤收藏按鈕
    const addDetailPageTagsButtons = () => {
        // 詳情頁中的標籤通常在 .main_genre 或 .work_genre 區域
        const tagContainers = document.querySelectorAll('.main_genre, .work_genre');

        tagContainers.forEach(container => {
            const tagElements = Array.from(container.querySelectorAll('a'));

            // 創建新的容器來保存修改後的標籤
            const newContainer = document.createElement('div');
            newContainer.className = container.className;
            newContainer.style.display = 'flex';
            newContainer.style.flexWrap = 'wrap';
            newContainer.style.gap = '6px';

            // 處理每個標籤
            tagElements.forEach(tagElement => {
                const tagName = tagElement.textContent.trim();
                const tagHref = tagElement.getAttribute('href');
                const isFavorited = isTagFavorited(tagName);

                // 建立包裝元素
                const wrapper = document.createElement('div');
                wrapper.className = 'dlsite-tag-wrapper';

                // 創建新標籤
                const newTag = document.createElement('a');
                newTag.href = tagHref;
                newTag.textContent = tagName;
                if (isFavorited) {
                    newTag.classList.add('dlsite-tag-highlight');
                }

                // 建立按鈕
                const btn = document.createElement('button');
                btn.className = `dlsite-tag-toggle-btn ${isFavorited ? 'active' : ''}`;
                btn.textContent = isFavorited ? '-' : '+';
                btn.title = isFavorited ? '取消收藏標籤' : '收藏標籤';

                // 為了確保按鈕可點擊性，增加最小尺寸
                btn.style.minWidth = '22px';
                btn.style.minHeight = '22px';

                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const newState = toggleFavoriteTag(tagName, tagHref);
                    btn.textContent = newState ? '-' : '+';
                    btn.title = newState ? '取消收藏標籤' : '收藏標籤';
                    btn.className = `dlsite-tag-toggle-btn ${newState ? 'active' : ''}`;

                    // 更新標籤樣式
                    if (newState) {
                        newTag.classList.add('dlsite-tag-highlight');
                    } else {
                        newTag.classList.remove('dlsite-tag-highlight');
                    }

                    // 立即重新排序標籤
                    reorderTags(newContainer);

                    showToast(newState ? `已收藏標籤：${tagName}` : `已取消收藏標籤：${tagName}`);
                });

                // 組合標籤和按鈕
                wrapper.appendChild(newTag);
                wrapper.appendChild(btn);
                newContainer.appendChild(wrapper);
            });

            // 用新容器替換原容器的內容
            container.innerHTML = '';
            container.appendChild(newContainer);

            // 立即排序
            reorderTags(newContainer);
        });
    };

    // 在詳情頁添加公司收藏按鈕
    const addDetailPageMakerButtons = () => {
        // 詳情頁中的公司通常在 .maker_name、.author、.circle_name 區域
        const makerContainers = document.querySelectorAll('.maker_name, .author, .circle_name');

        makerContainers.forEach(container => {
            const makerElements = container.querySelectorAll('a');

            makerElements.forEach(makerElement => {
                // 檢查公司名稱後面是否已有按鈕
                let nextNode = makerElement.nextSibling;
                let hasButton = false;
                while (nextNode) {
                    if (nextNode.classList && nextNode.classList.contains('dlsite-maker-toggle-btn')) {
                        hasButton = true;
                        break;
                    }
                    nextNode = nextNode.nextSibling;
                }

                if (hasButton) {
                    return; // 已經添加過按鈕，跳過
                }

                const makerName = makerElement.textContent.trim();
                const makerHref = makerElement.getAttribute('href');
                const makerId = makerHref.match(/maker_id\/([^.]+)\.html/)?.[1] || '';
                const isFavorited = isMakerFavorited(makerName);

                // 建立按鈕
                const btn = document.createElement('button');
                btn.className = `dlsite-maker-toggle-btn ${isFavorited ? 'active' : ''}`;
                btn.textContent = isFavorited ? '-' : '+';
                btn.title = isFavorited ? '取消收藏公司' : '收藏公司';

                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const newState = toggleFavoriteMaker(makerName, makerId);
                    btn.textContent = newState ? '-' : '+';
                    btn.title = newState ? '取消收藏公司' : '收藏公司';
                    btn.className = `dlsite-maker-toggle-btn ${newState ? 'active' : ''}`;

                    // 更新公司樣式
                    if (newState) {
                        makerElement.classList.add('dlsite-maker-highlight');
                    } else {
                        makerElement.classList.remove('dlsite-maker-highlight');
                    }

                    showToast(newState ? `已收藏公司：${makerName}` : `已取消收藏公司：${makerName}`);
                });

                // 初始化公司樣式
                if (isFavorited) {
                    makerElement.classList.add('dlsite-maker-highlight');
                }

                // 插入按鈕到公司名稱後面
                makerElement.parentNode.insertBefore(btn, makerElement.nextSibling);
            });
        });
    };

    // 初始化
    const init = () => {
        if (getTableBody()) {
            createControlPanel();
            highlightRecorded();

            // 頁面載入時自動隱藏已記錄的項目
            const hiddenCount = hideRecorded();
            if (hiddenCount > 0) {
                showToast(`已自動隱藏 ${hiddenCount} 筆已記錄的作品`);
            }
        } else {
            addDetailPageButton();
        }
    };

    // 頁面載入完成後執行
    window.addEventListener('load', init);

    // 如果已經載入完成，則立即執行
    if (document.readyState === 'complete') {
        init();
    }
})();