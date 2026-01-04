// ==UserScript==
// @name        Telegraph 批量插入图片链接+排版优化
// @namespace   http://tampermonkey.net/
// @version     13.7
// @license     Apache
// @author      Telegram@nsfwcoll_bot
// @description 批量插入图床图片链接+排版优化 (UI/手感保留V13.5，新增删除图片时的自动补位平滑动画)
// @match       https://telegra.ph/*
// @grant       GM_addStyle
// @run-at      document-end
// @namespace   http://tampermonkey.net/
// @license     Apache
// @match       https://telegra.ph/*
// @downloadURL https://update.greasyfork.org/scripts/532273/Telegraph%20%E6%89%B9%E9%87%8F%E6%8F%92%E5%85%A5%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%2B%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532273/Telegraph%20%E6%89%B9%E9%87%8F%E6%8F%92%E5%85%A5%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%2B%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let imageLinks = [];
    let thumbnailSize = 100;

    // --- 1. CSS 注入 (完全保持 V13.5 样式) ---
    const style = document.createElement('style');
    style.textContent = `
        /* ======= 13.0 UI 框架 ======= */
        .tg-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 10000;
            display: flex; justify-content: center; align-items: center;
            backdrop-filter: blur(4px);
        }
        .tg-box {
            background: #fff; padding: 25px; border-radius: 12px;
            width: calc(100% - 40px); max-width: 950px;
            height: 85vh; max-height: 800px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            display: flex; flex-direction: column;
            animation: tg-popIn 0.2s ease-out;
        }

        .tg-header {
            display: flex; justify-content: space-between; align-items: center;
            width: 100%; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;
            flex-shrink: 0;
        }

        .tg-textarea {
            width: 100%; flex-grow: 1; margin-bottom: 20px; padding: 15px;
            border: 1px solid #ddd; border-radius: 8px; resize: none;
            font-family: Consolas, monospace; font-size: 13px; line-height: 1.5;
            background: #fafafa; outline: none; transition: all 0.2s;
            box-sizing: border-box;
        }
        .tg-textarea:focus { border-color: #2196f3; background: #fff; }

        .tg-btn-row {
            display: flex; gap: 12px; width: 100%; justify-content: flex-end; align-items: center;
            flex-shrink: 0; margin-top: auto;
        }
        .tg-btn {
            padding: 8px 18px; color: white; border: none; border-radius: 6px;
            cursor: pointer; font-size: 14px; font-weight: 600;
            transition: transform 0.1s, filter 0.2s;
            display: flex; align-items: center; gap: 6px;
        }
        .tg-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .tg-btn:active { transform: translateY(0); }

        #tg-main-entry {
            position: fixed; top: 15px; left: 15px; z-index: 9999;
            padding: 10px 20px; background: #4caf50; color: white;
            border: none; border-radius: 30px; cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2); font-weight: bold;
            transition: all 0.3s; display: flex; align-items: center; gap: 5px;
        }
        #tg-main-entry:hover { transform: scale(1.05); box-shadow: 0 6px 15px rgba(0,0,0,0.3); }

        .tg-slider-container { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #666; }
        .tg-slider { cursor: pointer; }

        .tg-toast {
            position: fixed; bottom: 20px; right: 20px;
            background: #333; color: #fff; padding: 15px 20px;
            border-radius: 8px; z-index: 10002;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: tg-slideUp 0.3s ease-out;
            display: flex; align-items: center; gap: 8px;
        }
        .tg-dialog-box { display: flex; flex-direction: column; gap: 10px; }

        @keyframes tg-popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes tg-slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* ======= 核心动画逻辑 (11.7手感) ======= */
        #draggable-gallery {
            overflow-y: auto; flex-grow: 1; width: 100%;
            padding: 5px; box-sizing: border-box;
            border: 1px solid #eee; border-radius: 8px;
            display: grid; gap: 10px; justify-content: center;
            align-content: start;
        }

        #draggable-gallery .selected {
            outline: 3px solid #2196f3;
            transform: perspective(500px) rotateY(-15deg) rotateX(5deg) rotate(3deg) !important;
            z-index: 10;
        }
        #draggable-gallery .dragging { opacity: 0; }
        #draggable-gallery .dragover {
            box-shadow: 0 0 8px 2px rgba(33, 150, 243, 0.3);
            animation: pulse 0.5s infinite alternate;
            z-index: 5;
        }
        #draggable-gallery > div {
            transition: transform 0.2s ease, opacity 0.2s ease;
            position: relative;
            transform-style: preserve-3d;
        }
        #draggable-gallery > div:hover:not(.dragging) { transform: scale(1.02); }
        #draggable-gallery > div.avoid {
            transform: translateX(6px) scale(0.95) rotate(2deg) !important;
            opacity: 0.8;
            transition: transform 0.2s ease, opacity 0.2s ease;
        }
        @keyframes pulse {
            from { box-shadow: 0 0 8px 2px rgba(33, 150, 243, 0.3); }
            to { box-shadow: 0 0 12px 4px rgba(33, 150, 243, 0.7); }
        }

        /* ======= 删除按钮气泡 ======= */
        .item-delete-btn {
            position: absolute; top: -5px; right: -5px;
            width: 22px; height: 22px;
            background: #ff5252; color: white;
            border-radius: 50%;
            display: flex; justify-content: center; align-items: center;
            cursor: pointer;
            font-size: 14px; font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            opacity: 0; pointer-events: none; /* 默认隐藏且不响应点击 */
            transition: opacity 0.2s ease, transform 0.2s ease;
            z-index: 20;
        }
        .item-delete-btn:hover { background: #d32f2f; transform: scale(1.1); }

        /* 关键：悬停 OR 选中时 显示删除气泡 */
        #draggable-gallery > div:hover .item-delete-btn,
        #draggable-gallery > div.selected .item-delete-btn {
            opacity: 1;
            pointer-events: auto;
        }

        .ghost-wrapper { pointer-events: none; z-index: 10001; position: fixed; }
        .ghost-image-item {
            position: absolute; border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(style);

    // --- 入口按钮 ---
    const insertBtn = document.createElement('button');
    insertBtn.id = 'tg-main-entry';
    insertBtn.innerHTML = '<span>📷</span> 批量插入图片';
    document.body.appendChild(insertBtn);
    insertBtn.addEventListener('click', showInputBox);

    // --- 辅助函数 ---
    function createBtn(text, color = '#2196f3', icon = '') {
        const btn = document.createElement('button');
        btn.className = 'tg-btn';
        btn.style.background = color;
        btn.innerHTML = `${icon} ${text}`;
        return btn;
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'tg-overlay';
        return overlay;
    }

    function createBox() {
        const box = document.createElement('div');
        box.className = 'tg-box';
        return box;
    }

    // --- 界面 1: 输入链接 ---
    function showInputBox() {
        const overlay = createOverlay();
        const box = createBox();
        box.style.height = 'auto';
        box.style.minHeight = '500px';

        const textarea = document.createElement('textarea');
        textarea.className = 'tg-textarea';
        textarea.placeholder = '在此粘贴图片链接，每行一个...';
        if (localStorage.getItem('tg_last_links')) {
            textarea.value = localStorage.getItem('tg_last_links');
        }

        const buttonRow = document.createElement('div');
        buttonRow.className = 'tg-btn-row';

        const leftGroup = document.createElement('div');
        leftGroup.style.display = 'flex'; leftGroup.style.gap = '10px'; leftGroup.style.marginRight = 'auto';

        const clearBtn = createBtn('清空', '#ff5252', '🗑️');
        clearBtn.onclick = () => { if(confirm('确认清空？')) { textarea.value = ''; } };

        const uniqueBtn = createBtn('去重', '#ff9800', '🧹');
        uniqueBtn.onclick = () => {
            const raw = textarea.value.split('\n').map(l=>l.trim()).filter(l=>l);
            const unique = [...new Set(raw)];
            textarea.value = unique.join('\n');
            showToast(`已清理重复，剩余 ${unique.length} 张`, false);
        };

        const cleanLinesBtn = createBtn('删除空行', '#9c27b0', '🧹');
        cleanLinesBtn.onclick = () => {
            overlay.remove();
            startCountdown('删除空行', cleanEmptyLines);
        };

        leftGroup.append(clearBtn, uniqueBtn, cleanLinesBtn);

        const layoutBtn = createBtn('排版预览', '#2196f3', '🎨');
        layoutBtn.onclick = () => {
            const links = textarea.value.split('\n').map(line => line.trim()).filter(line => line);
            localStorage.setItem('tg_last_links', textarea.value);
            if (links.length) showLayoutEditor(links, overlay);
            else showToast('请输入图片链接', true);
        };

        const confirmBtn = createBtn('直接插入', '#4caf50', '✅');
        confirmBtn.onclick = () => {
            const links = textarea.value.split('\n').map(line => line.trim()).filter(line => line);
            localStorage.setItem('tg_last_links', textarea.value);
            if (!links.length) return showToast('请输入图片链接', true);
            overlay.remove();
            startCountdown('插入图片', () => insertImages(links));
        };

        const cancelBtn = createBtn('取消', '#9e9e9e');
        cancelBtn.onclick = () => overlay.remove();

        buttonRow.appendChild(leftGroup);
        buttonRow.appendChild(cancelBtn);
        buttonRow.appendChild(layoutBtn);
        buttonRow.appendChild(confirmBtn);

        box.appendChild(textarea);
        box.appendChild(buttonRow);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    // --- 界面 2: 排版编辑器 ---
    function showLayoutEditor(links, parentOverlay) {
        parentOverlay.innerHTML = '';
        const box = createBox();
        box.style.height = '85vh';

        const header = document.createElement('div');
        header.className = 'tg-header';

        const title = document.createElement('h3');
        title.style.margin = '0';
        title.innerHTML = `拖拽排序 <span style="font-size:13px;color:#999">(${links.length}张)</span>`;

        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'tg-slider-container';
        sliderContainer.innerHTML = '<span>🔍 缩放:</span>';
        const slider = document.createElement('input');
        slider.type = 'range'; slider.className = 'tg-slider';
        slider.min = 60; slider.max = 250; slider.value = thumbnailSize;
        slider.oninput = (e) => {
            thumbnailSize = parseInt(e.target.value);
            updateGrid();
        };
        sliderContainer.appendChild(slider);

        header.appendChild(title);
        header.appendChild(sliderContainer);
        box.appendChild(header);

        const gallery = document.createElement('div');
        gallery.id = 'draggable-gallery';
        box.appendChild(gallery);

        let draggedItems = [];
        let currentLinks = [...links];
        let ghostImageWrapper = null;
        let dragOffsetX = 0; let dragOffsetY = 0;
        let lastSelectedItem = null;

        const updateGrid = () => {
            gallery.style.gridTemplateColumns = `repeat(auto-fill, minmax(${thumbnailSize}px, 1fr))`;
            const items = gallery.querySelectorAll('div[data-index]');
            items.forEach(item => {
                item.style.width = `${thumbnailSize}px`;
                item.style.height = `${thumbnailSize}px`;
            });
        };

        const resetAnimationStates = () => {
            gallery.querySelectorAll('div[data-index]').forEach(item => {
                item.classList.remove('selected', 'dragging', 'dragover', 'avoid');
                item.style.transform = ''; item.style.transition = ''; item.style.opacity = '1';
                item.offsetHeight;
            });
        };

        const renderGallery = () => {
            gallery.innerHTML = '';
            gallery.style.gridTemplateColumns = `repeat(auto-fill, minmax(${thumbnailSize}px, 1fr))`;

            currentLinks.forEach((link, i) => {
                const div = document.createElement('div');
                Object.assign(div.style, {
                    border: '1px solid #ccc', borderRadius: '4px', overflow: 'visible',
                    background: '#f9f9f9',
                    width: `${thumbnailSize}px`, height: `${thumbnailSize}px`,
                    boxSizing: 'border-box', cursor: 'pointer', userSelect: 'none',
                    transformStyle: 'preserve-3d',
                });
                div.setAttribute('data-link', link);
                div.setAttribute('data-index', i);
                div.setAttribute('draggable', 'true');

                const img = document.createElement('img');
                img.src = link;
                Object.assign(img.style, { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', overflow:'hidden' });
                img.onerror = () => { img.src = ''; img.alt = '⚠️'; img.style.objectFit = 'contain'; };

                // 删除按钮
                const delBtn = document.createElement('div');
                delBtn.className = 'item-delete-btn';
                delBtn.innerHTML = '×';
                delBtn.onclick = (e) => {
                    e.stopPropagation();

                    // --- 关键：补位动画逻辑 (FLIP) ---

                    // 1. 记录所有[保留]图片的旧位置
                    const oldPositions = new Map();
                    gallery.querySelectorAll('div[data-index]').forEach(item => {
                        const idx = parseInt(item.getAttribute('data-index'));
                        if (idx !== i) { // 不记录即将删除的那个
                            oldPositions.set(idx, item.getBoundingClientRect());
                        }
                    });

                    // 2. 目标元素缩小消失
                    div.style.transition = 'all 0.3s ease';
                    div.style.transform = 'scale(0)';
                    div.style.opacity = '0';

                    // 3. 等待消失动画完成后，执行重排 + 补位
                    setTimeout(() => {
                        currentLinks.splice(i, 1);
                        renderGallery();
                        title.innerHTML = `拖拽排序 <span style="font-size:13px;color:#999">(${currentLinks.length}张)</span>`;

                        // 4. 计算并执行平滑补位
                        const newItems = gallery.querySelectorAll('div[data-index]');
                        newItems.forEach(newItem => {
                            const newIdx = parseInt(newItem.getAttribute('data-index'));
                            // 计算该元素之前对应的旧索引：
                            // 如果新索引 < 删除索引 i，说明它在删除元素之前，索引没变
                            // 如果新索引 >= 删除索引 i，说明它在删除元素之后，它之前的索引是 newIdx + 1
                            const oldIdx = newIdx < i ? newIdx : newIdx + 1;

                            const oldRect = oldPositions.get(oldIdx);
                            if (oldRect) {
                                const newRect = newItem.getBoundingClientRect();
                                const dx = oldRect.left - newRect.left;
                                const dy = oldRect.top - newRect.top;

                                if (dx !== 0 || dy !== 0) {
                                    // Invert: 瞬间移回旧位置
                                    newItem.style.transition = 'none';
                                    newItem.style.transform = `translate(${dx}px, ${dy}px)`;

                                    // Play: 动画滑到新位置
                                    requestAnimationFrame(() => {
                                        newItem.style.transition = 'transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)';
                                        newItem.style.transform = 'translate(0, 0)';
                                        // 动画结束后清理内联样式
                                        setTimeout(() => {
                                            newItem.style.transform = '';
                                            newItem.style.transition = '';
                                        }, 300);
                                    });
                                }
                            }
                        });
                    }, 300);
                };

                div.appendChild(img);
                div.appendChild(delBtn);
                gallery.appendChild(div);
            });
        };

        // --- 核心逻辑 ---
        gallery.addEventListener('click', (e) => {
            const item = e.target.closest('div[data-index]');
            if (!item) { gallery.querySelectorAll('.selected').forEach(el => el.classList.remove('selected')); lastSelectedItem = null; return; }
            const allItems = [...gallery.children];
            const currentIndex = allItems.indexOf(item);
            const lastSelectedIndex = lastSelectedItem ? allItems.indexOf(lastSelectedItem) : -1;
            if (e.ctrlKey || e.metaKey) { item.classList.toggle('selected'); }
            else if (e.shiftKey && lastSelectedItem) {
                const start = Math.min(currentIndex, lastSelectedIndex);
                const end = Math.max(currentIndex, lastSelectedIndex);
                allItems.forEach((div, i) => { if (i >= start && i <= end) div.classList.add('selected'); else div.classList.remove('selected'); });
            } else { allItems.forEach(div => div.classList.remove('selected')); item.classList.add('selected'); }
            lastSelectedItem = item;
        });

        gallery.addEventListener('dragstart', (e) => {
            const item = e.target.closest('div[data-index]');
            if (!item) return;
            if (!item.classList.contains('selected')) { gallery.querySelectorAll('.selected').forEach(el => el.classList.remove('selected')); item.classList.add('selected'); }
            draggedItems = Array.from(gallery.querySelectorAll('.selected'));
            const draggedIndices = draggedItems.map(el => parseInt(el.getAttribute('data-index')));
            e.dataTransfer.setData('text/plain', JSON.stringify(draggedIndices));
            e.dataTransfer.effectAllowed = 'move';
            const rect = item.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left; dragOffsetY = e.clientY - rect.top;
            if (ghostImageWrapper) ghostImageWrapper.remove();
            if (draggedItems.length > 0) {
                ghostImageWrapper = document.createElement('div');
                Object.assign(ghostImageWrapper.style, { position: 'fixed', pointerEvents: 'none', zIndex: '10001', top: `${rect.top}px`, left: `${rect.left}px` });
                ghostImageWrapper.classList.add('ghost-wrapper');
                document.body.appendChild(ghostImageWrapper);
                const maxGhosts = 3;
                draggedItems.slice(0, maxGhosts).forEach((draggedItem, i) => {
                    const ghost = document.createElement('div');
                    Object.assign(ghost.style, {
                        position: 'absolute', top: '0', left: '0', width: `${thumbnailSize}px`, height: `${thumbnailSize}px`,
                        background: `url(${draggedItem.querySelector('img').src}) center/cover no-repeat`, backgroundSize: 'cover', borderRadius: '4px',
                        transform: `translate(${i * 6}px, ${i * 6}px)`, zIndex: maxGhosts - i, opacity: '0'
                    });
                    ghost.classList.add('ghost-image-item');
                    ghostImageWrapper.appendChild(ghost);
                    setTimeout(() => { ghost.style.transition = 'transform 0.2s ease, opacity 0.2s ease'; ghost.style.opacity = '0.6'; }, 0);
                });
                if (draggedItems.length > 1) {
                    const countIndicator = document.createElement('div');
                    countIndicator.textContent = draggedItems.length;
                    Object.assign(countIndicator.style, {
                        position: 'absolute', top: `${(Math.min(draggedItems.length, maxGhosts) - 1) * 6 + 10}px`, left: `${(Math.min(draggedItems.length, maxGhosts) - 1) * 6 + 10}px`,
                        background: '#2196f3', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '50%', opacity: '0'
                    });
                    ghostImageWrapper.appendChild(countIndicator);
                    setTimeout(() => { countIndicator.style.transition = 'opacity 0.2s ease'; countIndicator.style.opacity = '1'; }, 0);
                }
            }
            e.dataTransfer.setDragImage(new Image(), 0, 0);
            draggedItems.forEach(el => { el.style.transition = 'transform 0.2s ease, opacity 0.2s ease'; el.style.opacity = '0'; el.style.transform = 'scale(0.8)'; });
        });

        document.addEventListener('drag', (e) => {
            if (!ghostImageWrapper || e.clientX === 0 || e.clientY === 0) return;
            ghostImageWrapper.style.left = `${e.clientX - dragOffsetX}px`; ghostImageWrapper.style.top = `${e.clientY - dragOffsetY}px`;
        });

        let currentDropTarget = null;
        gallery.addEventListener('dragover', (e) => {
            e.preventDefault(); e.dataTransfer.dropEffect = 'move';
            const target = e.target.closest('div[data-index]');
            gallery.querySelectorAll('.dragover').forEach(el => el.classList.remove('dragover'));
            gallery.querySelectorAll('.avoid').forEach(el => el.classList.remove('avoid'));
            if (target && !target.classList.contains('dragging')) {
                currentDropTarget = target; target.classList.add('dragover');
                const targetIndex = parseInt(target.getAttribute('data-index'));
                const draggedIndices = draggedItems.map(el => parseInt(el.getAttribute('data-index')));
                if (!draggedIndices.includes(targetIndex)) { target.classList.add('avoid'); }
            } else { currentDropTarget = null; }
        });

        gallery.addEventListener('dragleave', (e) => {
            const target = e.target.closest('div[data-index]');
            if (target && !gallery.contains(e.relatedTarget)) { gallery.querySelectorAll('.dragover, .avoid').forEach(el => el.classList.remove('dragover', 'avoid')); }
        });

        gallery.addEventListener('drop', (e) => {
            e.preventDefault();
            const target = currentDropTarget || e.target.closest('div[data-index]');
            if (ghostImageWrapper) {
                ghostImageWrapper.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
                ghostImageWrapper.style.opacity = '0'; ghostImageWrapper.style.transform = `scale(0.8)`;
            }
            try {
                const draggedIndices = JSON.parse(e.dataTransfer.getData('text/plain'));
                const draggedLinks = draggedIndices.map(i => currentLinks[i]);
                let targetIndex = 0;
                if (target && !target.classList.contains('dragging')) {
                    targetIndex = parseInt(target.getAttribute('data-index'));
                    const minDraggedIndex = Math.min(...draggedIndices);
                    if (targetIndex > minDraggedIndex) targetIndex = targetIndex - draggedIndices.length + 1;
                } else { targetIndex = currentLinks.length - draggedIndices.length; }
                const newLinks = []; const usedIndices = new Set(draggedIndices); let insertIndex = 0;
                for (let i = 0; i < currentLinks.length; i++) {
                    if (!usedIndices.has(i)) {
                        if (insertIndex === targetIndex) newLinks.push(...draggedLinks);
                        newLinks.push(currentLinks[i]); insertIndex++;
                    }
                }
                if (targetIndex >= insertIndex) newLinks.push(...draggedLinks);
                const oldPositions = new Map();
                gallery.querySelectorAll('div[data-index]').forEach((item) => {
                    const rect = item.getBoundingClientRect();
                    oldPositions.set(item.getAttribute('data-link'), { x: rect.left, y: rect.top });
                    item.style.transform = 'translate(0, 0)';
                });
                currentLinks = newLinks;
                renderGallery();
                const newGalleryItems = gallery.querySelectorAll('div[data-index]');
                newGalleryItems.forEach((item) => {
                    const itemLink = item.getAttribute('data-link');
                    const oldPos = oldPositions.get(itemLink);
                    if (oldPos) {
                        const newPos = item.getBoundingClientRect();
                        const dx = oldPos.x - newPos.x; const dy = oldPos.y - newPos.y;
                        if (dx !== 0 || dy !== 0) {
                             item.style.transition = 'none'; item.style.transform = `translate(${dx}px, ${dy}px)`;
                             setTimeout(() => { item.style.transition = 'transform 0.3s ease-out'; item.style.transform = 'translate(0, 0)'; setTimeout(() => { item.style.transform = ''; item.style.transition = ''; }, 300); }, 0);
                        }
                    }
                    if (draggedLinks.includes(itemLink)) {
                         item.style.transition = 'none'; item.style.transform = 'scale(0.8)'; item.style.opacity = '0';
                         setTimeout(() => { item.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in'; item.style.transform = 'scale(1)'; item.style.opacity = '1'; setTimeout(() => { item.style.transform = ''; item.style.transition = ''; item.style.opacity = ''; }, 300); }, 300);
                    }
                });
                setTimeout(resetAnimationStates, 700);
            } catch (error) { console.error(error); setTimeout(() => { renderGallery(); resetAnimationStates(); }, 300); }
        });

        gallery.addEventListener('dragend', (e) => {
            gallery.classList.remove('drag-active');
            gallery.querySelectorAll('.dragging, .dragover, .avoid').forEach(el => { el.classList.remove('dragging', 'dragover', 'avoid'); el.style.transform = ''; el.style.transition = ''; el.style.opacity = ''; });
            currentDropTarget = null;
            draggedItems.forEach(el => { el.style.opacity = '1'; el.style.transform = 'scale(1)'; setTimeout(() => { el.style.transform = ''; el.style.transition = ''; el.style.opacity = ''; }, 100); });
            if (ghostImageWrapper) ghostImageWrapper.remove();
        });

        renderGallery();

        // 底部按钮
        const btnRow = document.createElement('div');
        btnRow.className = 'tg-btn-row';

        const cancel = createBtn('取消', '#9e9e9e');
        cancel.onclick = () => { parentOverlay.remove(); showInputBox(); };

        const confirm = createBtn('确认并插入', '#4caf50', '✅');
        confirm.onclick = () => {
            imageLinks = [...currentLinks];
            parentOverlay.remove();
            startCountdown('插入图片', () => insertImages(imageLinks));
        };

        btnRow.appendChild(cancel);
        btnRow.appendChild(confirm);
        box.appendChild(btnRow);
        parentOverlay.appendChild(box);
    }

    // --- 执行器 ---
    function startCountdown(action, callback) {
        let count = 3;
        insertBtn.disabled = true; insertBtn.style.background = '#ff9800';
        const timer = setInterval(() => {
            insertBtn.textContent = `⏳ ${count}秒 点击编辑区`;
            count--;
            const editor = document.querySelector('[contenteditable="true"]');
            if((editor && document.activeElement === editor) || count < 0) {
                clearInterval(timer);
                insertBtn.textContent = `▶️ 正在${action}...`;
                callback();
            }
        }, 1000);
    }

    async function insertImages(links) {
        const editor = await waitForEditor();
        if (!editor) { showToast('❌ 找不到编辑器，请确保点击了文章内容区域', true); resetBtn(); return; }
        for (const link of links) {
            editor.focus(); document.execCommand('insertText', false, link);
            editor.dispatchEvent(new KeyboardEvent('keydown', {bubbles:true, keyCode:13}));
            await new Promise(r => setTimeout(r, 300));
        }
        showPostInsertDialog();
    }

    async function cleanEmptyLines() {
        const editor = await waitForEditor();
        if (!editor) { showToast('❌ 找不到编辑器', true); resetBtn(); return; }
        let count = 0;
        document.querySelectorAll('p').forEach(p => {
            if(p.textContent.trim() === '' && !p.querySelector('img')) { p.remove(); count++; }
        });
        showToast(`✅ 已清理 ${count} 个空行`);
        resetBtn();
    }

    // --- 右下角提示 (13.0) ---
    function showToast(msg, isError) {
        const div = document.createElement('div');
        div.className = 'tg-toast';
        if(isError) div.style.background = '#f44336';
        div.innerHTML = msg;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }

    function showPostInsertDialog() {
        const div = document.createElement('div');
        div.className = 'tg-toast tg-dialog-box';
        div.innerHTML = `<div style="font-weight:bold">✅ 插入完成</div><div>清理空行?</div>`;
        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex'; btnRow.style.gap = '10px';
        const clean = createBtn('清理', '#9c27b0'); clean.style.padding = '4px 10px'; clean.style.fontSize='12px';
        clean.onclick = () => { div.remove(); cleanEmptyLines(); };
        const close = createBtn('关闭', '#666'); close.style.padding = '4px 10px'; close.style.fontSize='12px';
        close.onclick = () => { div.remove(); resetBtn(); };
        btnRow.append(clean, close);
        div.appendChild(btnRow);
        document.body.appendChild(div);
    }

    function resetBtn() {
        insertBtn.innerHTML = '<span>📷</span> 批量插入图片';
        insertBtn.style.background = '#4caf50'; insertBtn.disabled = false;
    }

    function waitForEditor(timeout = 3000) {
        return new Promise(resolve => {
            let t = 0; const int = setInterval(() => {
                const ed = document.querySelector('[contenteditable="true"]');
                if(ed) { clearInterval(int); resolve(ed); }
                else if((t+=100) >= timeout) { clearInterval(int); resolve(null); }
            }, 100);
        });
    }
})();