// ==UserScript==
// @name         jpnkn to Reddit Style (v1.1.1 Full)
// @name:en      jpnkn to Reddit Style (v1.1.1 Full)
// @name:ja      jpnkn を Reddit 風に (v1.1.1 完全版)
// @name:ko      jpnkn Reddit 스타일로 (v1.1.1 전체)
// @name:zh-CN   jpnkn 论坛转 Reddit 风格 (v1.1.1 完整版)
// @name:zh-TW   jpnkn 論壇轉 Reddit 風格 (v1.1.1 完整版)
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Transforms jpnkn threads into a Reddit-like nested view, with image blur, reply count filters (highlighting matched posts and showing full relevant trees), and auto-collapsing for posts with many images.
// @description:en Transforms jpnkn threads into a Reddit-like nested view, with image blur, reply count filters (highlighting matched posts and showing full relevant trees), and auto-collapsing for posts with many images.
// @description:ja jpnknのスレッドをRedditのようなネスト表示に変換し、画像ぼかし、返信数フィルター、多画像投稿の自動折りたたみなどの機能を提供します。
// @description:ko jpnkn 스레드를 Reddit과 유사한 중첩 보기로 변환하고, 이미지 블러, 답글 수 필터, 이미지가 많은 게시물 자동 축소 등의 기능을 제공합니다.
// @description:zh-CN 将 jpnkn 论坛帖子转换为类似 Reddit 的嵌套楼中楼视图，提供图片模糊、回复数筛选、多图帖自动折叠等功能。
// @description:zh-TW 將 jpnkn 論壇帖子轉換為類似 Reddit 的巢狀樓中樓檢視，提供圖片模糊、回覆數篩選、多圖帖自動摺疊等功能。
// @author       NBXX (Enhanced by AI)
// @match        https://bbs.jpnkn.com/test/read.cgi/*/*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535199/jpnkn%20to%20Reddit%20Style%20%28v111%20Full%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535199/jpnkn%20to%20Reddit%20Style%20%28v111%20Full%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const MAX_PREVIEW_HEIGHT = '400px';
    const INDENTATION_SIZE = 20;
    const LAZY_LOAD_OFFSET = '200px';
    const DEFAULT_BLUR_RADIUS = '10px';
    const MANY_IMAGES_THRESHOLD = 10; // NEW: 图片数量阈值

    let config = {
        enableImageFeatures: true,
        collapseManyImages: true, // NEW: 新功能默认开启
    };

    let postsDataMap = new Map();
    let currentActiveFilterButton = null;

    function loadSettings() {
        config.enableImageFeatures = GM_getValue('jpnknRedditStyle_enableImageFeatures', true);
        config.collapseManyImages = GM_getValue('jpnknRedditStyle_collapseManyImages', true); // NEW: 加载设置
    }

    function saveSettings() {
        GM_setValue('jpnknRedditStyle_enableImageFeatures', config.enableImageFeatures);
        GM_setValue('jpnknRedditStyle_collapseManyImages', config.collapseManyImages); // NEW: 保存设置
    }

    function setupMenu() {
        GM_registerMenuCommand(
            `${config.enableImageFeatures ? '✅ 画像プレビューとぼかしを無効化' : '❌ 画像プレビューとぼかしを有効化'}`,
            toggleImageFeaturesAndReload,
            'p'
        );
        // NEW: 为新功能添加菜单命令
        GM_registerMenuCommand(
            `${config.collapseManyImages ? '✅ 複数画像の非表示機能を無効化' : '❌ 複数画像の非表示機能を有効化'}`,
            toggleManyImagesCollapseAndRefresh,
            'c'
        );
    }

    function toggleImageFeaturesAndReload() {
        config.enableImageFeatures = !config.enableImageFeatures;
        saveSettings();
        alert(`画像プレビューとぼかし機能は ${config.enableImageFeatures ? '有効' : '無効'} になりました。ページをリロードします。`);
        location.reload();
    }

    // NEW: 新功能开关的执行函数
    function toggleManyImagesCollapseAndRefresh() {
        config.collapseManyImages = !config.collapseManyImages;
        saveSettings();
        // 不需要完全重载，只需要应用视图即可
        applyAllManyImageViews();
        // 更新按钮状态
        const btn = document.getElementById('toggle-many-images-btn');
        if (btn) {
             btn.textContent = `${config.collapseManyImages ? '✅' : '❌'} 複数の画像を非表示`;
             btn.classList.toggle('active-filter', config.collapseManyImages);
        }
    }

    GM_addStyle(`
        .reddit-style-container { padding: 10px; }
        .reddit-post {
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-bottom: 8px;
            background-color: #fff;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            transition: box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out;
        }
        .reddit-post > .original-post-content { padding: 8px; }
        .reddit-post > .original-post-content dt { font-size: 0.9em; color: #555; }
        .reddit-post > .original-post-content dd { margin-left: 1.5em; font-size: 1em; line-height: 1.4; }
        .replies-wrapper { margin-left: ${INDENTATION_SIZE}px; padding-left: 10px; border-left: 2px solid #e0e0e0; margin-top: 5px; }
        .media-preview-container { margin-top: 8px; }
        .media-preview-container img {
            max-width: 100%;
            max-height: ${MAX_PREVIEW_HEIGHT};
            display: block;
            border: 1px solid #ddd;
            border-radius: 3px;
            background-color: #f9f9f9;
            cursor: zoom-in;
            min-height: 50px;
        }
        .media-preview-container img.image-blurred {
            filter: blur(${DEFAULT_BLUR_RADIUS});
            transition: filter 0.2s ease-in-out;
        }
        .media-preview-container img.image-blurred:hover { filter: blur(0px); }
        .media-preview-container img.expanded { max-height: none; cursor: zoom-out; filter: blur(0px) !important; }
        .media-toggle-btn, .video-toggle-btn { font-size: 0.8em; color: #007bff; cursor: pointer; margin-left: 5px; text-decoration: underline; display: inline-block; }
        .toggle-replies-btn { cursor: pointer; color: #777; font-size: 0.8em; margin-left: 10px; }
        .toggle-content-btn { cursor: pointer; color: #dc3545; font-size: 0.9em; margin-left: 1.5em; font-weight: bold; } /* NEW: 新按钮的样式 */
        .original-link.broken-link { text-decoration: line-through; color: #d9534f; }
        .youtube-embed-container { margin-top: 8px; position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000; }
        .youtube-embed-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }

        nav.fixed-top .col-8 .mt-0.mx-1 button.jpnkn-filter-btn {
            margin-left: 8px;
            padding: 2px 8px;
            cursor: pointer;
            border: 1px solid #ccc;
            background-color: #e7e7e7;
            border-radius: 4px;
            font-size: inherit;
            color: #007bff;
            text-decoration: none;
            vertical-align: middle;
        }
        nav.fixed-top .col-8 .mt-0.mx-1 button.jpnkn-filter-btn:hover {
            background-color: #d7d7d7;
            border-color: #bbb;
            text-decoration: underline;
        }
        nav.fixed-top .col-8 .mt-0.mx-1 button.jpnkn-filter-btn.active-filter {
            background-color: #007bff;
            color: white;
            border-color: #0056b3;
            text-decoration: none;
        }
        .reddit-post.highlighted-post {
            border-color: rgba(255, 105, 180, 0.7) !important;
            box-shadow: 0 0 12px 4px rgba(255, 105, 180, 0.6),
                          0 0 20px 8px rgba(255, 105, 180, 0.4);
        }
    `);

    let imageObserver;
    function initializeImageObserver() {
        if (imageObserver) {
            imageObserver.disconnect();
        }
        imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: LAZY_LOAD_OFFSET });
    }

    function isImageLink(url) {
        if (!url) return false;
        try {
            const path = new URL(url).pathname.toLowerCase();
            return /\.(jpeg|jpg|gif|png|webp)$/.test(path);
        } catch (e) { return false; }
    }

    function getYouTubeVideoId(url) {
        if (!url) return null;
        try {
            const parsedUrl = new URL(url);
            let videoId = null;
            if (parsedUrl.hostname === 'youtu.be') { // Note: googleusercontent.com URLs are specific
                videoId = parsedUrl.pathname.slice(1);
            } else if (parsedUrl.hostname.includes('youtube.com') && parsedUrl.pathname === '/watch') {
                videoId = parsedUrl.searchParams.get('v');
            } else if (parsedUrl.hostname.includes('youtube.com') && parsedUrl.pathname.startsWith('/embed/')) {
                videoId = parsedUrl.pathname.split('/embed/')[1].split('?')[0];
            } else { // Basic support for direct YouTube links
                const directYoutubeHosts = ['www.youtube.com', 'youtube.com', 'm.youtube.com', 'youtu.be'];
                if (directYoutubeHosts.includes(parsedUrl.hostname)) {
                    if (parsedUrl.pathname === '/watch') {
                        videoId = parsedUrl.searchParams.get('v');
                    } else if (parsedUrl.pathname.startsWith('/embed/')) {
                        videoId = parsedUrl.pathname.split('/embed/')[1].split(/[?#]/)[0];
                    } else if (parsedUrl.hostname === 'youtu.be') { // youtu.be links might be proxied here
                        videoId = parsedUrl.pathname.slice(1).split(/[?#]/)[0];
                    }
                }
            }
            if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
                return videoId;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    function processPostContent(ddElement) {
        const links = ddElement.querySelectorAll('a');
        links.forEach(link => {
            const href = link.href;
            if (isImageLink(href)) {
                link.classList.add('original-link');
                const container = document.createElement('div');
                container.className = 'media-preview-container';
                const img = document.createElement('img');
                img.dataset.src = href;
                img.alt = 'Image Preview';
                const toggleBtn = document.createElement('span');
                toggleBtn.className = 'media-toggle-btn';

                function manageImageState() {
                    const isCurrentlyVisible = container.style.display !== 'none';
                    if (isCurrentlyVisible) {
                        if (config.enableImageFeatures) img.classList.add('image-blurred');
                        else img.classList.remove('image-blurred');
                        if (img.dataset.src && !img.src) imageObserver.observe(img); // Observe if visible and not loaded
                    } else {
                        img.classList.remove('image-blurred'); // Not visible, no blur
                    }
                }

                if (config.enableImageFeatures) {
                    container.style.display = 'block';
                    toggleBtn.textContent = '[画像を隠す]';
                    if (img.dataset.src) imageObserver.observe(img); // Observe if initially visible
                } else {
                    container.style.display = 'none';
                    toggleBtn.textContent = '[画像を表示]';
                }
                manageImageState(); // Apply initial blur state

                img.addEventListener('click', () => {
                    img.classList.toggle('expanded');
                    if (img.classList.contains('expanded')) {
                        img.classList.remove('image-blurred'); // Expanded image should not be blurred
                    } else {
                        manageImageState(); // Re-apply blur if collapsed and feature is on
                    }
                });
                img.onerror = () => {
                    container.style.display = 'none';
                    link.classList.add('broken-link');
                    link.title = '画像読み込み失敗';
                    if (toggleBtn) toggleBtn.style.display = 'none';
                };
                toggleBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isCurrentlyVisible = container.style.display !== 'none';
                    container.style.display = isCurrentlyVisible ? 'none' : 'block';
                    toggleBtn.textContent = isCurrentlyVisible ? '[画像を表示]' : '[画像を隠す]';
                    manageImageState(); // Re-evaluate state after toggling visibility
                });
                container.appendChild(img);
                link.insertAdjacentElement('afterend', toggleBtn);
                toggleBtn.insertAdjacentElement('afterend', container);

            } else { // Check for YouTube links
                const videoId = getYouTubeVideoId(href);
                if (videoId) {
                    link.classList.add('original-link');
                    const videoContainer = document.createElement('div');
                    videoContainer.style.display = 'none'; // Initially hidden
                    const toggleVideoBtn = document.createElement('span');
                    toggleVideoBtn.className = 'video-toggle-btn';
                    toggleVideoBtn.textContent = '[動画を再生]';

                    toggleVideoBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (videoContainer.style.display === 'none') {
                            if (!videoContainer.querySelector('iframe')) {
                                videoContainer.innerHTML = ''; // Clear previous
                                videoContainer.className = 'youtube-embed-container';
                                const iframe = document.createElement('iframe');
                                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                                iframe.setAttribute('frameborder', '0');
                                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                                iframe.setAttribute('allowfullscreen', '');
                                iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
                                videoContainer.appendChild(iframe);
                            }
                            videoContainer.style.display = 'block';
                            toggleVideoBtn.textContent = '[動画を隠す]';
                        } else {
                            videoContainer.style.display = 'none';
                            toggleVideoBtn.textContent = '[動画を再生]';
                        }
                    });
                    link.insertAdjacentElement('afterend', toggleVideoBtn);
                    toggleVideoBtn.insertAdjacentElement('afterend', videoContainer);
                }
            }
        });
    }

    function calculateRepliesBottomUp(post, visited) {
        visited.add(post.id);
        let count = 0;
        if (post.children && post.children.length > 0) {
            count = post.children.length; // Direct children count
            for (const childPost of post.children) {
                if (!visited.has(childPost.id)) { // Ensure child's count is done (should be via recursion order)
                    calculateRepliesBottomUp(childPost, visited);
                }
                count += (childPost.recursiveReplyCount || 0); // Add child's total sub-replies
            }
        }
        post.recursiveReplyCount = count;
    }

    function calculateAllRecursiveReplies(currentPostsDataMap) {
        const visited = new Set();
        currentPostsDataMap.forEach(post => {
            if (!visited.has(post.id)) {
                calculateRepliesBottomUp(post, visited);
            }
        });
    }

    function createFilterButtons(currentPostsDataMap) {
        const targetMenuLocation = document.querySelector('nav.fixed-top .col-8 .mt-0.mx-1');

        const existingButtons = targetMenuLocation ? targetMenuLocation.querySelectorAll('button.jpnkn-filter-btn') : [];
        existingButtons.forEach(btn => btn.remove());
        if (currentActiveFilterButton && !document.body.contains(currentActiveFilterButton)) {
            currentActiveFilterButton = null;
        }

        if (!targetMenuLocation) {
            console.warn("jpnkn Reddit Style: Target menu location for filter buttons not found.");
            return;
        }

        const thresholds = [5, 10, 15];
        thresholds.forEach(threshold => {
            const button = document.createElement('button');
            button.classList.add('jpnkn-filter-btn');
            button.textContent = `返信 >= ${threshold}`;
            button.dataset.threshold = threshold;
            button.addEventListener('click', (event) => {
                applyFilter(threshold, currentPostsDataMap, event.currentTarget);
            });
            targetMenuLocation.appendChild(button);
        });

        const showAllButton = document.createElement('button');
        showAllButton.classList.add('jpnkn-filter-btn');
        showAllButton.textContent = 'すべて表示';
        showAllButton.addEventListener('click', (event) => {
            applyFilter(0, currentPostsDataMap, event.currentTarget);
        });
        targetMenuLocation.appendChild(showAllButton);

        // NEW: 创建“多图折叠”的总开关按钮
        const collapseImagesButton = document.createElement('button');
        collapseImagesButton.id = 'toggle-many-images-btn';
        collapseImagesButton.classList.add('jpnkn-filter-btn');
        collapseImagesButton.textContent = `${config.collapseManyImages ? '✅' : '❌'} 複数の画像を非表示`;
        if (config.collapseManyImages) {
            collapseImagesButton.classList.add('active-filter');
        }
        collapseImagesButton.addEventListener('click', toggleManyImagesCollapseAndRefresh);
        targetMenuLocation.appendChild(collapseImagesButton);
    }

    // NEW: 应用“多图折叠”视图的总开关函数
    function applyAllManyImageViews() {
        const allPosts = document.querySelectorAll('.reddit-post[data-image-count]');
        allPosts.forEach(postEl => {
            const imageCount = parseInt(postEl.dataset.imageCount, 10);
            if (imageCount > MANY_IMAGES_THRESHOLD) {
                const ddElement = postEl.querySelector('dd');
                const toggleBtn = postEl.querySelector('.toggle-content-btn');
                if (ddElement && toggleBtn) {
                    const shouldBeCollapsed = config.collapseManyImages;
                    ddElement.style.display = shouldBeCollapsed ? 'none' : 'block';
                    toggleBtn.style.display = 'block'; // 按钮总是可见的，只是文本会变
                    toggleBtn.textContent = shouldBeCollapsed ? `[展开内容 (${imageCount} 张图片)]` : '[折叠内容]';
                }
            }
        });
    }

    function expandReplies(post) {
        if (post && post.domElement) {
            const repliesWrapper = post.domElement.querySelector('.replies-wrapper');
            if (repliesWrapper && post.children && post.children.length > 0) {
                repliesWrapper.style.display = 'block';
                const toggleBtn = post.dtElement.querySelector('.toggle-replies-btn');
                if (toggleBtn) {
                    toggleBtn.textContent = `[-] (${post.children.length} replies)`;
                }
            }
        }
    }

    function showAndExpandDescendantsRecursive(post) {
        if (post && post.domElement) {
            post.domElement.style.display = 'block';
            expandReplies(post);

            if (post.children) {
                for (const child of post.children) {
                    showAndExpandDescendantsRecursive(child);
                }
            }
        }
    }

    function applyFilter(minReplies, currentPostsDataMap, clickedButton) {
        if (currentActiveFilterButton) {
            currentActiveFilterButton.classList.remove('active-filter');
        }
        if (clickedButton && minReplies !== 0) { // "すべて表示" ボタンには active-filter を付けない
            clickedButton.classList.add('active-filter');
            currentActiveFilterButton = clickedButton;
        } else {
            currentActiveFilterButton = null;
        }

        currentPostsDataMap.forEach(post => {
            if (post.domElement) {
                post.domElement.style.display = 'none';
                post.domElement.classList.remove('highlighted-post');
            }
        });

        if (minReplies === 0) { // Show all
            currentPostsDataMap.forEach(post => {
                if (post.domElement) {
                    post.domElement.style.display = 'block';
                }
            });
            return;
        }

        const directlyMatchedPostIds = new Set();
        const ancestorIdsToShow = new Set();

        currentPostsDataMap.forEach(post => {
            if (post.recursiveReplyCount >= minReplies) {
                directlyMatchedPostIds.add(post.id);
                let current = post;
                while (current) {
                    ancestorIdsToShow.add(current.id);
                    current = current.parentElement;
                }
            }
        });

        ancestorIdsToShow.forEach(postId => {
            const post = currentPostsDataMap.get(postId);
            if (post && post.domElement) {
                post.domElement.style.display = 'block';
                expandReplies(post); // Expand direct replies of this ancestor/matched post

                if (directlyMatchedPostIds.has(post.id)) {
                    post.domElement.classList.add('highlighted-post');
                }
            }
        });

        directlyMatchedPostIds.forEach(postId => {
            const matchedPost = currentPostsDataMap.get(postId);
            if (matchedPost && matchedPost.children) {
                for (const child of matchedPost.children) {
                    showAndExpandDescendantsRecursive(child); // Show and expand all descendants
                }
            }
        });
    }

    function transformThread() {
        const threadElement = document.getElementById('thread');
        if (!threadElement) {
             console.error("jpnkn Reddit Style: #thread element not found. Cannot transform.");
             return;
        }

        if (threadElement.dataset.transformed === 'true') {
            const newRawPosts = document.body.querySelectorAll('div.res:not(.reddit-post div.res)');
            let hasNewUnprocessed = false;
            newRawPosts.forEach(rawPostNode => {
                if(!rawPostNode.closest('.reddit-style-container')){
                    hasNewUnprocessed = true;
                }
            });
            if (!hasNewUnprocessed) {
                return;
            }
        }

        const originalPosts = Array.from(threadElement.querySelectorAll('div.res'));
        if (originalPosts.length === 0) {
            if (threadElement.dataset.transformed !== 'true') {
                console.log("jpnkn Reddit Style: No posts found to transform initially.");
            }
            return;
        }
        console.log(`jpnkn Reddit Style: Processing ${originalPosts.length} posts.`);

        initializeImageObserver();
        postsDataMap.clear();

        originalPosts.forEach(postEl => {
            const resIndex = postEl.dataset.resIndex;
            if (!resIndex) return;
            const dtElement = postEl.querySelector('dt.info');
            const ddElement = postEl.querySelector('dd');
            if (!dtElement || !ddElement) return;
            postsDataMap.set(resIndex, {
                id: resIndex,
                dtElement: dtElement.cloneNode(true),
                ddElement: ddElement.cloneNode(true),
                children: [],
                replyToIds: [],
                parentElement: null,
                recursiveReplyCount: 0,
                domElement: null
            });
        });

        postsDataMap.forEach(post => {
            const replyLinks = post.ddElement.querySelectorAll('a');
            // MODIFIED: 使用上一版本已修复的、更健壮的逻辑
            replyLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.includes('read.cgi')) {
                    const parts = href.split('/');
                    const targetPart = parts[parts.length - 1];
                    if (targetPart) {
                        const match = targetPart.match(/^(\d+)$/);
                        if (match && match[1]) {
                            const targetId = match[1];
                            if (postsDataMap.has(targetId) && targetId !== post.id) {
                                post.replyToIds.push(targetId);
                            }
                        }
                    }
                }
            });
            if (post.replyToIds.length > 0) {
                const parentId = post.replyToIds[0];
                if (postsDataMap.has(parentId)) {
                   const parentPost = postsDataMap.get(parentId);
                   parentPost.children.push(post);
                   post.parentElement = parentPost;
                }
            }
        });

        calculateAllRecursiveReplies(postsDataMap);

        const newThreadContainer = document.createElement('div');
        newThreadContainer.className = 'reddit-style-container';

        function renderPostRecursive(post, parentDomElement) {
            const postWrapper = document.createElement('div');
            postWrapper.className = 'reddit-post';
            postWrapper.dataset.postId = post.id;
            post.domElement = postWrapper;

            const originalContentDiv = document.createElement('div');
            originalContentDiv.className = 'original-post-content';
            originalContentDiv.appendChild(post.dtElement);
            // MODIFIED: ddElement will be added later after checking for collapse
            postWrapper.appendChild(originalContentDiv);

            processPostContent(post.ddElement);

            // NEW: 实现多图折叠的核心逻辑
            const imageLinks = Array.from(post.ddElement.querySelectorAll('a')).filter(a => isImageLink(a.href));
            const imageCount = imageLinks.length;
            postWrapper.dataset.imageCount = imageCount; // 存储图片数量

            if (imageCount > MANY_IMAGES_THRESHOLD) {
                const toggleContentBtn = document.createElement('span');
                toggleContentBtn.className = 'toggle-content-btn';
                let isContentCollapsed = config.collapseManyImages; // 默认状态由全局配置决定

                toggleContentBtn.textContent = isContentCollapsed ? `[展开内容 (${imageCount} 张图片)]` : '[折叠内容]';
                post.ddElement.style.display = isContentCollapsed ? 'none' : 'block';

                toggleContentBtn.addEventListener('click', () => {
                    isContentCollapsed = !isContentCollapsed;
                    post.ddElement.style.display = isContentCollapsed ? 'none' : 'block';
                    toggleContentBtn.textContent = isContentCollapsed ? `[展开内容 (${imageCount} 张图片)]` : '[折叠内容]';
                });

                originalContentDiv.appendChild(toggleContentBtn); // 将按钮添加到 dt 和 dd 之间
            }
            originalContentDiv.appendChild(post.ddElement); // 将 dd 添加到最终位置
            // END NEW

            parentDomElement.appendChild(postWrapper);

            if (post.children.length > 0) {
                const repliesWrapper = document.createElement('div');
                repliesWrapper.className = 'replies-wrapper';
                repliesWrapper.style.display = 'block';

                const toggleRepliesBtn = document.createElement('span');
                toggleRepliesBtn.className = 'toggle-replies-btn';
                toggleRepliesBtn.textContent = `[-] (${post.children.length} replies)`;
                let repliesVisible = true;

                toggleRepliesBtn.addEventListener('click', () => {
                    repliesVisible = !repliesVisible;
                    repliesWrapper.style.display = repliesVisible ? 'block' : 'none';
                    toggleRepliesBtn.textContent = repliesVisible ? `[-] (${post.children.length} replies)` : `[+] (${post.children.length} replies)`;
                });

                const firstInfoNode = post.dtElement.firstChild;
                if (firstInfoNode && firstInfoNode.nextSibling) {
                    post.dtElement.insertBefore(document.createTextNode(' '), firstInfoNode.nextSibling);
                    post.dtElement.insertBefore(toggleRepliesBtn, firstInfoNode.nextSibling.nextSibling);
                } else if (firstInfoNode) {
                    post.dtElement.appendChild(document.createTextNode(' '));
                    post.dtElement.appendChild(toggleRepliesBtn);
                } else {
                    post.dtElement.appendChild(toggleRepliesBtn);
                }

                postWrapper.appendChild(repliesWrapper);
                post.children.sort((a, b) => parseInt(a.id) - parseInt(b.id));
                post.children.forEach(childPost => {
                    renderPostRecursive(childPost, repliesWrapper);
                });
            }
        }

        const rootPosts = [];
        postsDataMap.forEach(p => {
            if (!p.parentElement) {
                rootPosts.push(p);
            }
        });

        rootPosts.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        rootPosts.forEach(post => renderPostRecursive(post, newThreadContainer));

        threadElement.innerHTML = '';
        threadElement.appendChild(newThreadContainer);

        createFilterButtons(postsDataMap);

        threadElement.dataset.transformed = 'true';
        console.log("jpnkn Reddit Style: Transformation complete.");
    }

    // --- Main Execution ---
    loadSettings();
    setupMenu();

    const observerTarget = document.getElementById('thread');
    if (observerTarget) {
        let transformTimeout = null;
        const mainObserver = new MutationObserver((mutationsList, obs) => {
            let hasNewResElements = mutationsList.some(mutation =>
                mutation.type === 'childList' &&
                mutation.addedNodes.length > 0 &&
                Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === Node.ELEMENT_NODE &&
                    node.classList && node.classList.contains('res') &&
                    !node.closest('.reddit-style-container')
                )
            );

            if (hasNewResElements) {
                console.log("jpnkn Reddit Style: Detected new raw .res posts, preparing for re-transformation.");
                if(observerTarget.dataset.transformed === 'true'){
                    observerTarget.removeAttribute('data-transformed');
                }
                clearTimeout(transformTimeout);
                transformTimeout = setTimeout(() => {
                    transformThread();
                }, 500);
            }
        });

        mainObserver.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            if (observerTarget.dataset.transformed !== 'true' && observerTarget.querySelector('div.res')) {
                transformThread();
            }
        }, 200);
        setTimeout(() => { // Fallback
            if (observerTarget.dataset.transformed !== 'true' && observerTarget.querySelector('div.res')) {
                transformThread();
            }
        }, 1500);

    } else {
        console.error("jpnkn Reddit Style: #thread element not found for initial setup.");
    }

})();