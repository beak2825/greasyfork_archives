// ==UserScript==
// @name         AllTheFallen Booru 缩略图搜索
// @namespace    http://tampermonkey.net/
// @version      0.7.1
// @description  使用小缩略图快速加载、支持搜索和分页，不卡顿！
// @author       Gemini
// @match        https://booru.allthefallen.moe/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @connect      booru.allthefallen.moe
// @downloadURL https://update.greasyfork.org/scripts/542473/AllTheFallen%20Booru%20%E7%BC%A9%E7%95%A5%E5%9B%BE%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/542473/AllTheFallen%20Booru%20%E7%BC%A9%E7%95%A5%E5%9B%BE%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ✅ 跳过帖子详情页（如 /posts/123456）
    if (location.pathname.startsWith('/posts/') && /^\d+$/.test(location.pathname.split('/')[2])) {
        return;
    }

    let currentPage = 1;
    let currentTags = '';
    let imageContainer;

    GM_addStyle(`
        .search-ui-container {
            padding: 10px 20px;
            background-color: #fafafa;
            border-bottom: 1px solid #ddd;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            position: sticky;
            top: 0;
            z-index: 9999;
        }
        #tag-input {
            flex-grow: 1;
            padding: 6px 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 14px;
            min-width: 200px;
        }
        #search-button {
            padding: 6px 12px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 3px;
            font-size: 14px;
            cursor: pointer;
        }
        #search-button:hover {
            background-color: #1976D2;
        }
        .image-container {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 6px;
            padding: 10px 20px 60px;
            background: #fff;
        }
        .image-item {
            width: 100%;
            aspect-ratio: 1 / 1;
            overflow: hidden;
            background: #f5f5f5;
            transition: transform 0.2s;
            border-radius: 4px;
            cursor: pointer;
        }
        .image-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            border-radius: 4px;
        }
        .image-item:hover {
            outline: 2px solid #1976D2;
            z-index: 10;
        }
        .loading {
            grid-column: span 7;
            text-align: center;
            padding: 20px;
            font-size: 16px;
            color: #666;
        }
        .load-more-button {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            font-size: 14px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .load-more-button:hover {
            background-color: #388E3C;
        }
    `);

    function initGalleryUI() {
        const mainContainer = document.createElement('div');
        document.body.insertBefore(mainContainer, document.body.firstChild);

        const searchUI = document.createElement('div');
        searchUI.className = 'search-ui-container';
        mainContainer.appendChild(searchUI);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'tag-input';
        input.placeholder = '输入标签，用空格分隔...';
        searchUI.appendChild(input);

        const searchButton = document.createElement('button');
        searchButton.id = 'search-button';
        searchButton.textContent = '搜索';
        searchUI.appendChild(searchButton);

        imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        mainContainer.appendChild(imageContainer);

        const loadMoreButton = document.createElement('button');
        loadMoreButton.textContent = '加载下一页';
        loadMoreButton.className = 'load-more-button';
        loadMoreButton.style.display = 'none';
        mainContainer.appendChild(loadMoreButton);

        // 默认标签
        currentTags = 'genshin_impact  order:score date:>=2020-02-29 -ai-generated -video';
        input.value = currentTags;

        searchButton.addEventListener('click', () => {
            currentTags = input.value.trim();
            currentPage = 1;
            imageContainer.innerHTML = '';
            loadImages(currentTags, currentPage, imageContainer, loadMoreButton);
        });

        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                searchButton.click();
            }
        });

        loadMoreButton.addEventListener('click', () => {
            currentPage++;
            loadImages(currentTags, currentPage, imageContainer, loadMoreButton);
        });

        // 初始化首次加载
        //loadImages(currentTags, currentPage, imageContainer, loadMoreButton);
    }

    function loadImages(tags, page, container, moreBtn) {
        const encodedTags = encodeURIComponent(tags);
        const apiUrl = `https://booru.allthefallen.moe/posts.json?limit=200&page=${page}&tags=${encodedTags}`;

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.textContent = '正在加载图片...';
        container.appendChild(loadingDiv);

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function (response) {
                try {
                    const posts = JSON.parse(response.responseText);
                    loadingDiv.remove();
                    displayImages(posts, container);

                    if (posts.length === 0 || posts.length < 200) {
                        moreBtn.style.display = 'none';
                    } else {
                        moreBtn.style.display = 'block';
                    }
                } catch (e) {
                    loadingDiv.textContent = '加载失败：解析数据出错。';
                }
            },
            onerror: function (error) {
                loadingDiv.textContent = `加载失败：${error.statusText}`;
            }
        });
    }

    function displayImages(posts, container) {
        if (!posts.length && currentPage === 1) {
            container.innerHTML = '<div class="loading">没有找到相关图片。</div>';
            return;
        }

        posts.forEach(post => {
            if (!post.md5) return;

            const thumbUrl = `https://booru.allthefallen.moe/data/180x180/${post.md5.substring(0,2)}/${post.md5.substring(2,4)}/${post.md5}.jpg`;
            const detailPageUrl = `https://booru.allthefallen.moe/posts/${post.id}`;

            const item = document.createElement('div');
            item.className = 'image-item';

            const img = document.createElement('img');
            img.src = thumbUrl;
            img.alt = post.tags || '无标签';
            img.loading = 'lazy';

            img.addEventListener('click', () => {
                window.open(detailPageUrl, '_blank');
            });

            item.appendChild(img);
            container.appendChild(item);
        });
    }

    // 初始化 UI
    window.addEventListener('load', initGalleryUI);
})();
