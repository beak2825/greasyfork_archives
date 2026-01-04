// ==UserScript==
// @name         Danbooru Hover Preview
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  image preview for Danbooru
// @author       Claude 3.5 Sonnet & GPT-4o
// @match        https://danbooru.donmai.us/posts*
// @match        https://danbooru.donmai.us/
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/516205/Danbooru%20Hover%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/516205/Danbooru%20Hover%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Single preview element
    const preview = {
        container: null,
        img: null,
        loading: null,
        currentId: null,
        visible: false,
        targetX: 0,
        targetY: 0,
        currentX: 0,
        currentY: 0,
        animationFrame: null,
        opacity: 0,
        lastEvent: null,
        resizeObserver: null,
        initialPositionSet: false,

        init() {
            this.container = document.createElement('div');
            this.container.style.cssText = `
                position: fixed;
                z-index: 10000;
                background: white;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                opacity: 0;
                max-width: 800px;
                max-height: 800px;
                pointer-events: none;
                transform: translate3d(0,0,0);
                will-change: transform, opacity;
                transition: opacity 0.2s ease;
                display: none;
            `;

            this.img = new Image();
            this.img.style.cssText = 'max-width: 800px; max-height: 800px;';

            this.loading = document.createElement('div');
            this.loading.textContent = 'Loading...';
            this.loading.style.cssText = 'padding: 20px; text-align: center;';

            // 创建 ResizeObserver 来监听尺寸变化
            this.resizeObserver = new ResizeObserver(entries => {
                if (this.lastEvent && !this.initialPositionSet) {
                    const pos = this.calculatePosition(this.lastEvent);
                    this.currentX = this.targetX = pos.left;
                    this.currentY = this.targetY = pos.top;
                    this.container.style.transform = `translate3d(${pos.left}px,${pos.top}px,0)`;
                    this.initialPositionSet = true;
                }
            });

            this.resizeObserver.observe(this.container);
            document.body.appendChild(this.container);
            this.startAnimation();
        },

        startAnimation() {
            const animate = () => {
                if (this.visible) {
                    this.currentX += (this.targetX - this.currentX) * 0.3;
                    this.currentY += (this.targetY - this.currentY) * 0.3;

                    this.container.style.transform =
                        `translate3d(${this.currentX}px,${this.currentY}px,0)`;
                }
                this.animationFrame = requestAnimationFrame(animate);
            };
            animate();
        },

        show(e) {
            this.lastEvent = e;
            this.initialPositionSet = false;
            this.container.style.display = 'block';

            // 初始位置设置
            requestAnimationFrame(() => {
                const pos = this.calculatePosition(e);
                this.currentX = this.targetX = pos.left;
                this.currentY = this.targetY = pos.top;
                this.container.style.transform = `translate3d(${pos.left}px,${pos.top}px,0)`;
                this.container.style.opacity = '1';
                this.visible = true;
            });
        },

        hide() {
            this.container.style.opacity = '0';
            this.visible = false;
            this.currentId = null;
            this.lastEvent = null;
            this.initialPositionSet = false;
            setTimeout(() => {
                if (!this.visible) {
                    this.container.style.display = 'none';
                }
            }, 200);
        },

        setLoading() {
            this.container.innerHTML = '';
            this.container.appendChild(this.loading);
        },

        setImage(img) {
            this.container.innerHTML = '';
            this.container.appendChild(img);
            this.initialPositionSet = false;  // 重置位置标志
        },

        calculatePosition(e) {
            const rect = this.container.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // 根据可用空间自动判断显示位置
            let left;
            const spaceRight = viewportWidth - e.clientX - 20;
            const spaceLeft = e.clientX - rect.width - 20;

            // 优先选择右侧，如果右侧空间不够则选择左侧
            if (spaceRight >= rect.width) {
                left = e.clientX + 20;
            } else if (spaceLeft >= 0) {
                left = spaceLeft;
            } else {
                // 如果两侧都没有足够空间，选择空间较大的一侧
                left = (spaceRight > e.clientX) ?
                    viewportWidth - rect.width - 10 :
                    10;
            }

            // 确保顶部位置在视窗内
            let top = e.clientY;
            if (top + rect.height > viewportHeight) {
                top = Math.max(10, viewportHeight - rect.height - 10);
            }

            return { left, top };
        },

        updatePosition(e) {
            if (!this.visible) return;
            const pos = this.calculatePosition(e);
            this.targetX = pos.left;
            this.targetY = pos.top;
            this.lastEvent = e;
        }
    };

    // Request manager
    const requestManager = {
        queue: [],
        active: false,
        currentId: null,

        async process() {
            if (this.active || this.queue.length === 0) return;

            this.active = true;
            const task = this.queue.shift();

            try {
                await task();
            } catch (error) {
                console.error('Request error:', error);
            }

            this.active = false;
            this.process();
        },

        add(task) {
            this.queue.push(task);
            this.process();
        },

        clear() {
            this.queue.length = 0;
            this.active = false;
        }
    };

    // Cache manager
    const cache = {
        urls: new Map(),
        images: new Map(),
        loadFromStorage() {
            try {
                const stored = GM_getValue('urlCache', '{}');
                const data = JSON.parse(stored);
                const now = Date.now();
                const DAY = 24 * 60 * 60 * 1000;

                for (const [key, entry] of Object.entries(data)) {
                    if (now - entry.timestamp < DAY) {
                        this.urls.set(key, entry.url);
                    }
                }
            } catch (error) {
                console.error('Cache load error:', error);
            }
        },
        saveToStorage: debounce(() => {
            const data = {};
            cache.urls.forEach((url, key) => {
                data[key] = { url, timestamp: Date.now() };
            });
            GM_setValue('urlCache', JSON.stringify(data));
        }, 5000)
    };

    // Utilities
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Image loader
    async function loadImage(imgId, baseUrl) {
        if (cache.urls.has(imgId)) {
            return cache.urls.get(imgId);
        }

        for (const ext of ['jpg', 'jpeg', 'png']) {
            const url = `${baseUrl}.${ext}`;
            try {
                const response = await fetch(url, { method: 'HEAD' });
                if (response.ok) {
                    cache.urls.set(imgId, url);
                    cache.saveToStorage();
                    return url;
                }
            } catch (error) {
                continue;
            }
        }
        return null;
    }

    // Preview handler
    function handlePreview(e, thumbnail) {
        const img = thumbnail.querySelector('img');
        if (!img) return;

        const match = img.src.match(/\/(\w+)\.\w+$/);
        if (!match) return;

        const imgId = match[1];
        if (preview.currentId === imgId) {
            preview.updatePosition(e);
            return;
        }
        preview.currentId = imgId;

        preview.setLoading();
        preview.show(e);

        if (cache.images.has(imgId)) {
            preview.setImage(cache.images.get(imgId).cloneNode(true));
            return;
        }

        requestManager.clear();
        requestManager.add(async () => {
            const folder1 = imgId.substring(0, 2);
            const folder2 = imgId.substring(2, 4);
            const baseUrl = `https://cdn.donmai.us/original/${folder1}/${folder2}/${imgId}`;

            try {
                const url = await loadImage(imgId, baseUrl);
                if (!url || preview.currentId !== imgId) return;

                const img = new Image();
                img.style.cssText = 'max-width: 800px; max-height: 800px;';

                img.onload = () => {
                    if (preview.currentId === imgId) {
                        cache.images.set(imgId, img.cloneNode(true));
                        preview.setImage(img);
                    }
                };

                img.src = url;
            } catch (error) {
                console.error('Image load error:', error);
            }
        });
    }

    // Event handler setup
    function setupHandlers(thumbnail) {
        if (thumbnail.dataset.previewInitialized) return;
        thumbnail.dataset.previewInitialized = 'true';

        thumbnail.addEventListener('mouseenter', e => handlePreview(e, thumbnail));
        thumbnail.addEventListener('mouseleave', () => preview.hide());
        thumbnail.addEventListener('mousemove', e => preview.updatePosition(e));
    }

    // Initialize
    function init() {
        preview.init();
        cache.loadFromStorage();

        document.querySelectorAll('.post-preview-link').forEach(setupHandlers);

        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.classList?.contains('post-preview-link')) {
                        setupHandlers(node);
                    }
                });
            });
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Start the script
    init();
})();