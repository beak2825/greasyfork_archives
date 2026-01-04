// ==UserScript==
// @name         AI插图数据读取器 (灯箱预览最终版)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  异步分页读取“通用ai插图脚本8”数据，实现“秒开”体验，并使用Lightbox(灯箱)模式在当前页预览大图。
// @author       Gemini
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542917/AI%E6%8F%92%E5%9B%BE%E6%95%B0%E6%8D%AE%E8%AF%BB%E5%8F%96%E5%99%A8%20%28%E7%81%AF%E7%AE%B1%E9%A2%84%E8%A7%88%E6%9C%80%E7%BB%88%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542917/AI%E6%8F%92%E5%9B%BE%E6%95%B0%E6%8D%AE%E8%AF%BB%E5%8F%96%E5%99%A8%20%28%E7%81%AF%E7%AE%B1%E9%A2%84%E8%A7%88%E6%9C%80%E7%BB%88%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局状态变量 ---
    let currentPage = 1;
    let itemsPerPage = 10;
    let totalPages = 0;
    let totalItems = 0;
    const dbName = 'tupian';
    const dbVersion = 1;
    const objectStoreName = 'tupianhuancun';

    // --- 延时执行主函数 ---
    setTimeout(main, 1000);

    function main() {
        // --- 添加CSS样式 ---
        GM_addStyle(`
            #image-browser-btn {
                position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
                padding: 10px 15px; background-color: #6366f1; color: white;
                border: none; border-radius: 5px; cursor: pointer;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2); font-size: 14px; font-family: sans-serif;
            }
            #image-browser-btn:disabled {
                background-color: #999; cursor: wait;
            }
            #image-browser-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.9); z-index: 2147483646;
                display: none; flex-direction: column; justify-content: center; align-items: center; gap: 10px;
            }
            #browser-footer {
                display: flex; justify-content: space-between; align-items: center;
                width: 90%; color: white;
            }
            #image-browser-gallery {
                width: 90%; height: 85%; background-color: #2c2c2c; border-radius: 8px;
                padding: 20px; overflow-y: scroll; display: flex; flex-wrap: wrap;
                gap: 15px; justify-content: center; align-items: center;
            }
            .gallery-image {
                max-width: 180px; max-height: 180px; width: auto; height: auto;
                border: 2px solid #555; border-radius: 4px; cursor: pointer;
                transition: transform 0.2s; object-fit: contain;
            }
            .gallery-image:hover {
                transform: scale(1.05); border-color: #8b5cf6;
            }
            #image-browser-close-btn {
                position: absolute; top: 10px; right: 25px; font-size: 35px;
                color: #fff; cursor: pointer; font-family: Arial, sans-serif;
            }
            #pagination-controls, #page-size-controls {
                display: flex; align-items: center; gap: 10px; font-size: 16px;
            }
            #pagination-controls button, #page-size-controls button {
                padding: 8px 12px; font-size: 14px; cursor: pointer;
                background-color: #4a4a4a; color: white; border: 1px solid #666; border-radius: 4px;
            }
            #pagination-controls button:disabled {
                background-color: #333; color: #777; cursor: not-allowed;
            }
            #items-per-page-input {
                width: 50px; padding: 5px; text-align: center; background: #333; color: white; border: 1px solid #666; border-radius: 4px;
            }
            /* 新增：灯箱(Lightbox)样式 */
            #image-lightbox-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.8); z-index: 2147483647; /* 确保在最顶层 */
                display: none; justify-content: center; align-items: center;
                cursor: pointer;
            }
            #lightbox-image {
                max-width: 90vw; max-height: 90vh;
                box-shadow: 0 0 30px rgba(0,0,0,0.5);
                border-radius: 4px;
            }
        `);

        // --- 创建UI元素 ---
        if (document.getElementById('image-browser-btn')) return;
        const openBtn = document.createElement('button');
        openBtn.id = 'image-browser-btn';
        openBtn.textContent = '查看AI图片库';
        document.body.appendChild(openBtn);

        // --- 异步初始化 ---
        async function initializeBrowser() {
            openBtn.disabled = true;
            openBtn.textContent = '正在初始化...';
            try {
                const db = await openDatabase();
                const count = await getStoreCount(db);
                totalItems = count;
                totalPages = Math.ceil(totalItems / itemsPerPage);
                db.close();

                if (totalItems === 0) return alert('图片库为空。');

                setupUI();
                await renderPage(1);

            } catch (error) {
                alert(`初始化失败: ${error}`);
            } finally {
                openBtn.disabled = false;
                openBtn.textContent = '查看AI图片库';
            }
        }

        // --- IndexedDB 辅助函数 ---
        function openDatabase() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(dbName, dbVersion);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
            });
        }
        function getStoreCount(db) {
            return new Promise((resolve, reject) => {
                const store = db.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);
                const countRequest = store.count();
                countRequest.onerror = () => reject(countRequest.error);
                countRequest.onsuccess = () => resolve(countRequest.result - 1);
            });
        }

        // --- UI创建 ---
        function setupUI() {
            if (document.getElementById('image-browser-overlay')) return;
            const overlay = document.createElement('div');
            overlay.id = 'image-browser-overlay';
            overlay.innerHTML = `
                <span id="image-browser-close-btn">&times;</span>
                <div id="image-browser-gallery"></div>
                <div id="browser-footer">
                    <div id="page-size-controls">
                        <label for="items-per-page-input">每页显示:</label>
                        <input type="number" id="items-per-page-input" value="${itemsPerPage}" min="1" max="200">
                        <button id="update-page-size-btn">更新</button>
                    </div>
                    <div id="pagination-controls">
                        <button id="prev-page-btn">&laquo; 上一页</button>
                        <span id="page-info"></span>
                        <button id="next-page-btn">下一页 &raquo;</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            // --- 绑定事件 ---
            document.getElementById('image-browser-close-btn').addEventListener('click', closeImageBrowser);
            document.getElementById('prev-page-btn').addEventListener('click', () => { if (currentPage > 1) renderPage(currentPage - 1); });
            document.getElementById('next-page-btn').addEventListener('click', () => { if (currentPage < totalPages) renderPage(currentPage + 1); });
            document.getElementById('update-page-size-btn').addEventListener('click', async () => {
                const input = document.getElementById('items-per-page-input');
                let newSize = parseInt(input.value, 10);
                if (isNaN(newSize) || newSize < 1) newSize = 10;
                input.value = newSize;
                itemsPerPage = newSize;
                totalPages = Math.ceil(totalItems / itemsPerPage);
                await renderPage(1);
            });
        }

        // --- 核心渲染 ---
        async function renderPage(pageNumber) {
            currentPage = Math.min(pageNumber, totalPages) || 1;
            const gallery = document.getElementById('image-browser-gallery');
            gallery.innerHTML = '<span style="color:white; font-size: 20px;">正在加载图片...</span>';
            document.getElementById('image-browser-overlay').style.display = 'flex';
            document.getElementById('image-browser-btn').style.display = 'none';

            const pageInfo = document.getElementById('page-info');
            const prevBtn = document.getElementById('prev-page-btn');
            const nextBtn = document.getElementById('next-page-btn');
            prevBtn.disabled = true;
            nextBtn.disabled = true;

            try {
                const db = await openDatabase();
                const store = db.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);
                const cursorRequest = store.openCursor();
                const pageData = [];
                let advanced = false;
                let countOnPage = 0;
                const startIndex = (currentPage - 1) * itemsPerPage;

                await new Promise((resolve, reject) => {
                    cursorRequest.onerror = reject;
                    cursorRequest.onsuccess = e => {
                        const cursor = e.target.result;
                        if (!advanced && startIndex > 0) {
                            advanced = true;
                            cursor.advance(startIndex);
                            return;
                        }
                        if (cursor && countOnPage < itemsPerPage) {
                            if(cursor.value.id !== 'tupianshuju') {
                                pageData.push(cursor.value);
                                countOnPage++;
                            }
                            cursor.continue();
                        } else {
                            resolve();
                        }
                    };
                });
                db.close();

                gallery.innerHTML = '';
                pageData.forEach(item => {
                    const img = document.createElement('img');
                    img.src = item.tupian;
                    img.className = 'gallery-image';
                    img.title = `ID: ${item.id}`;
                    // **修改点**: 点击缩略图时调用灯箱功能
                    img.onclick = () => openLightbox(item.tupian);
                    gallery.appendChild(img);
                });

            } catch (error) {
                gallery.innerHTML = `<span style="color:red;">加载页面失败: ${error}</span>`;
            } finally {
                pageInfo.textContent = `第 ${currentPage} / ${totalPages} 页 (共 ${totalItems} 张图片)`;
                prevBtn.disabled = currentPage === 1;
                nextBtn.disabled = currentPage === totalPages;
            }
        }

        // --- 新增：灯箱(Lightbox)功能 ---
        function openLightbox(base64Src) {
            let lightbox = document.getElementById('image-lightbox-overlay');
            if (!lightbox) {
                lightbox = document.createElement('div');
                lightbox.id = 'image-lightbox-overlay';
                const img = document.createElement('img');
                img.id = 'lightbox-image';

                // 点击背景或图片本身都会关闭灯箱
                lightbox.addEventListener('click', closeLightbox);

                lightbox.appendChild(img);
                document.body.appendChild(lightbox);
            }

            document.getElementById('lightbox-image').src = base64Src;
            lightbox.style.display = 'flex';
        }
        function closeLightbox() {
            const lightbox = document.getElementById('image-lightbox-overlay');
            if (lightbox) lightbox.style.display = 'none';
        }

        // --- UI关闭 ---
        function closeImageBrowser() {
            document.getElementById('image-browser-overlay').style.display = 'none';
            document.getElementById('image-browser-btn').style.display = 'block';
        }

        openBtn.addEventListener('click', initializeBrowser);
    }
})();