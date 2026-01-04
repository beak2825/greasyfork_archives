// ==UserScript==
// @name         妖火回帖引用显示（他到底说了啥）
// @namespace    https://www.yaohuo.me/bbs/userinfo.aspx?touserid=20740
// @version      1.1.6
// @description  在妖火论坛的回帖楼层中显示被引用楼层的内容，并可直接跳转到引用楼层
// @author       SiXi
// @match        https://www.yaohuo.me/bbs-*
// @match        https://www.yaohuo.me/bbs/book_*
// @match        https://yaohuo.me/bbs-*
// @match        https://yaohuo.me/bbs/book_*
// @icon         https://www.yaohuo.me/css/favicon.ico
// @license      Apache 2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526054/%E5%A6%96%E7%81%AB%E5%9B%9E%E5%B8%96%E5%BC%95%E7%94%A8%E6%98%BE%E7%A4%BA%EF%BC%88%E4%BB%96%E5%88%B0%E5%BA%95%E8%AF%B4%E4%BA%86%E5%95%A5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/526054/%E5%A6%96%E7%81%AB%E5%9B%9E%E5%B8%96%E5%BC%95%E7%94%A8%E6%98%BE%E7%A4%BA%EF%BC%88%E4%BB%96%E5%88%B0%E5%BA%95%E8%AF%B4%E4%BA%86%E5%95%A5%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储已加载的楼层内容
    const loadedFloors = new Map();
    // 记录正在加载的状态
    let isLoading = false;
    // 记录加载尝试次数
    let loadAttempts = 0;
    const MAX_ATTEMPTS = 5;

    // 添加日志函数
    function log(message, data = '') {
        console.log(`[引用显示] ${message}`, data);
    }

    // 节流函数
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 获取楼层描述
    function getFloorNumber(text) {
        const floorMap = {
            "沙发": 1,
            "椅子": 2,
            "板凳": 3
        };
        return floorMap[text] || parseInt(text);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitForNewContent() {
        const startCount = document.querySelectorAll('.forum-post, .list-reply').length;
        log('开始等待新内容加载，当前楼层数:', startCount);
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
            await sleep(800);
            const currentCount = document.querySelectorAll('.forum-post, .list-reply').length;
            log(`第${attempts + 1}次检查，当前楼层数:`, currentCount);

            if (currentCount > startCount) {
                log('检测到新内容');
                return true;
            }
            attempts++;
        }
        log('等待超时，未检测到新内容');
        return false;
    }

    // 获取引用内容和发帖妖友信息
    async function getQuotedContent(floorNumber, retryCount = 0) {
        log('开始获取引用内容，目标楼层:', floorNumber);

        if (loadedFloors.has(floorNumber)) {
            log('从缓存获取楼层内容');
            return loadedFloors.get(floorNumber);
        }

        if (isLoading) {
            log('其他请求正在加载中，等待重试');
            if (retryCount < 3) {
                await sleep(1000);
                return getQuotedContent(floorNumber, retryCount + 1);
            }
            // 返回错误信息时也使用对象格式
            return {
                text: '加载超时',
                isError: true
            };
        }

        const findFloorContent = () => {
            const floors = document.querySelectorAll('.forum-post, .list-reply');
            log('当前页面楼层数:', floors.length);

            for (const floor of floors) {
                const floorInfo = floor.querySelector('.floor-info, .floornumber');
                if (!floorInfo) continue;

                const currentFloor = getFloorNumber(floorInfo.textContent.replace(/[楼\s]/g, ''));
                if (currentFloor === floorNumber) {
                    log('找到目标楼层:', currentFloor);

                    // 修改内容获取逻辑
                    let content = '';
                    // 获取内容，优先使用 .retext
                    const contentElement = floor.querySelector('.retext') || floor.querySelector('.post-content');
                    if (contentElement) {
                        content = contentElement.innerHTML;
                        // 如果内容中包含引用，移除引用部分
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = content;
                        const quoteElement = tempDiv.querySelector('.replay-other, .reother');
                        if (quoteElement) {
                            quoteElement.remove();
                        }
                        content = tempDiv.innerHTML.trim();
                    }

                    // 获取用户信息（通常不会获取失败，以防万一设置初始值）
                    const userNick = floor.querySelector('.user-nick a, .renick a')?.textContent || '未知用户';
                    const userId = floor.querySelector('.user-id a, .reidlink .renickid')?.textContent.replace(/[()]/g, '') || '未知ID';

                    const result = {
                        userNick,
                        userId,
                        floorNumber: currentFloor,
                        content,
                        text: `<strong>${userNick}(${userId}) ${currentFloor}楼：</strong>${content}`
                    };
                    log('找到内容:', result);
                    return result;
                }
            }
            log('未找到目标楼层');
            return null;
        };

        let content = findFloorContent();
        if (content) {
            loadedFloors.set(floorNumber, content);
            return content;
        }

        if (loadAttempts >= MAX_ATTEMPTS) {
            log('达到最大尝试次数');
            return {
                text: '加载失败：已达到最大尝试次数',
                isError: true
            };
        }

        const loadMoreBtn = document.querySelector('#KL_show_tip, #YH_show_tip');// KL适用于book_re.aspx
        if (!loadMoreBtn || loadMoreBtn.textContent.includes('没有了')) {
            log('没有更多内容可加载');
            return {
                text: '未找到该楼层内容',
                isError: true
            };
        }

        log('点击加载更多按钮');
        isLoading = true;
        loadAttempts++;

        try {
            loadMoreBtn.click();
            const hasNewContent = await waitForNewContent();
            isLoading = false;

            if (!hasNewContent && loadAttempts >= MAX_ATTEMPTS) {
                log('加载新内容失败');
                return {
                    text: '加载失败：未能加载新内容',
                    isError: true
                };
            }

            log('递归查找内容');
            return await getQuotedContent(floorNumber);
        } catch (error) {
            console.error('加载失败:', error);
            isLoading = false;
            return {
                text: '加载失败',
                isError: true
            };
        } finally {
            isLoading = false;
        }
    }

    // 添加一个函数来给所有楼层添加锚点（跳转时使用）
    function addAnchorsToFloors() {
        const floors = document.querySelectorAll('.forum-post, .list-reply');
        floors.forEach(floor => {
            const floorInfo = floor.querySelector('.floor-info, .floornumber');
            if (!floorInfo) return;

            const floorNumber = getFloorNumber(floorInfo.textContent.replace(/[楼\s]/g, ''));
            if (!floor.id) {
                floor.id = `floor-${floorNumber}`;
                log(`添加锚点: floor-${floorNumber}`);
            }
        });
    }

    // 修改 scrollToFloor 函数
    function scrollToFloor(floorNumber) {
        // 查找目标楼层
        const floors = document.querySelectorAll('.forum-post, .list-reply');
        let targetFloor = null;

        // 遍历所有楼层查找目标
        for (const floor of floors) {
            const floorInfo = floor.querySelector('.floor-info, .floornumber');
            if (!floorInfo) continue;

            const currentFloor = getFloorNumber(floorInfo.textContent.replace(/[楼\s]/g, ''));
            if (currentFloor === floorNumber) {
                targetFloor = floor;
                break;
            }
        }

        if (targetFloor) {
            // 滚动方法
            targetFloor.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // 添加目标楼层高亮效果
            const originalBackground = targetFloor.style.backgroundColor;
            targetFloor.style.backgroundColor = '#fff3cd';
            targetFloor.style.transition = 'background-color 0.3s';

            // 2秒后恢复默认的背景色
            setTimeout(() => {
                targetFloor.style.backgroundColor = originalBackground;
            }, 2000);

            return true;
        }
        return false;
    }

    // 添加内容截断函数
    function truncateContent(content) {
        const maxLength = 70;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;

        // 处理图片缩放
        const images = tempDiv.getElementsByTagName('img');
        Array.from(images).forEach(img => {
            img.style.maxWidth = '200px';
            img.style.maxHeight = '120px';
            img.style.objectFit = 'contain';
        });

        const text = tempDiv.textContent;

        if (text.length <= maxLength) {
            return {
                content: content,
                fullContent: content,
                isShortened: false
            };
        }

        // 保存完整内容
        const fullContent = tempDiv.innerHTML;

        // 创建截断内容
        let truncatedContent = '';
        let currentLength = 0;

        function processNode(node) {
            if (currentLength >= maxLength) return;

            if (node.nodeType === Node.TEXT_NODE) {
                const remainingLength = maxLength - currentLength;
                const text = node.textContent;
                truncatedContent += text.slice(0, remainingLength);
                currentLength += text.length;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const clone = node.cloneNode(true);
                if (node.tagName === 'IMG') {
                    truncatedContent += clone.outerHTML;
                } else {
                    truncatedContent += `<${node.tagName.toLowerCase()}>`;
                    Array.from(node.childNodes).forEach(child => {
                        if (currentLength < maxLength) {
                            processNode(child);
                        }
                    });
                    truncatedContent += `</${node.tagName.toLowerCase()}>`;
                }
            }
        }

        Array.from(tempDiv.childNodes).forEach(node => {
            if (currentLength < maxLength) {
                processNode(node);
            }
        });

        return {
            content: truncatedContent,
            fullContent: fullContent,
            isShortened: true
        };
    }

    // 添加图片缩放函数
    function resizeImages(container) {
        const images = container.getElementsByTagName('img');
        for (let img of images) {
            img.onload = function() {
                const ratio = Math.min(
                    120 / this.naturalHeight,
                    200 / this.naturalWidth,
                    1
                );

                if (ratio < 1) {
                    this.style.width = Math.floor(this.naturalWidth * ratio) + 'px';
                    this.style.height = Math.floor(this.naturalHeight * ratio) + 'px';
                }
            };

            // 如果图片已经加载完成，直接调整大小
            if (img.complete) {
                img.onload();
            }
        }
    }

    // 修改 createQuoteBox 函数
    function createQuoteBox(quoteData) {
        const box = document.createElement('div');
        box.className = 'quoted-content';

        const contentDiv = document.createElement('div');
        contentDiv.style.flex = '1';

        // 处理内容
        let content = '';
        if (typeof quoteData === 'string') {
            content = quoteData;
        } else {
            content = quoteData.text;
        }

        // 处理内容截断
        const truncated = truncateContent(content);
        contentDiv.innerHTML = truncated.content;

        // 处理图片缩放
        resizeImages(contentDiv);

        // 如果内容被截断，添加展开按钮
        if (truncated.isShortened) {
            const expandWrapper = document.createElement('span');
            expandWrapper.className = 'expand-wrapper';
            expandWrapper.innerHTML = '... ';

            const expandButton = document.createElement('button');
            expandButton.className = 'bt4 quote-expand-btn';
            expandButton.setAttribute('data-action', 'expand');
            expandButton.type = 'button';
            expandButton.textContent = '展开';
            expandButton.style.cssText = `
                margin-left: 5px;
                cursor: pointer;
                width: 50px;
                vertical-align: middle;
                position: relative;
                z-index: 999;
                pointer-events: auto;
            `;

            // 使用委托方式处理点击事件
            const expandHandler = function(event) {
                if (event.target.classList.contains('quote-expand-btn')) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();

                    try {
                        const parentContent = event.target.closest('.quoted-content');
                        if (parentContent) {
                            const contentDiv = parentContent.querySelector('div');
                            if (contentDiv) {
                                contentDiv.innerHTML = truncated.fullContent;
                                resizeImages(contentDiv);
                                event.target.closest('.expand-wrapper').remove();

                                // 移除事件监听器
                                document.removeEventListener('click', expandHandler, true);
                            }
                        }
                    } catch (error) {
                        console.error('展开内容时出错:', error);
                    }

                    return false;
                }
            };

            // 使用事件委托，将事件监听器添加到父元素
            document.addEventListener('click', expandHandler, true);

            expandWrapper.appendChild(expandButton);
            contentDiv.appendChild(expandWrapper);
        }

        const jumpButton = document.createElement('a');
        jumpButton.textContent = '跳转';
        jumpButton.href = '#floor-' + quoteData.floorNumber;
        jumpButton.style.cssText = `
            margin-left: 10px;
            color: #4CAF50;
            cursor: pointer;
            white-space: nowrap;
            font-size: 12px;
            text-decoration: none;
        `;

        // 如果是错误信息，隐藏跳转按钮
        if (quoteData.isError) {
            jumpButton.style.display = 'none';
        }

        // 修改跳转逻辑，使用更强的事件处理
        jumpButton.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡

            if (typeof quoteData === 'object' && quoteData.floorNumber) {
                log('尝试跳转到楼层:', quoteData.floorNumber);

                // 尝试滚动到目标楼层
                if (!scrollToFloor(quoteData.floorNumber)) {
                    // 如果找不到目标楼层，尝试加载更多内容
                    const loadMoreBtn = document.querySelector('#KL_show_tip, #YH_show_tip');
                    if (loadMoreBtn && !loadMoreBtn.textContent.includes('没有了')) {
                        // 使用原生 alert 而不是自定义提示
                        window.alert('正在加载更多内容，请稍候...');

                        // 模拟真实的点击事件
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        loadMoreBtn.dispatchEvent(clickEvent);

                        // 等待新内容加载
                        const contentLoaded = await waitForNewContent();
                        if (!contentLoaded) {
                            window.alert('加载超时，请手动点击加载更多');
                            return;
                        }

                        // 再次尝试滚动
                        let retryCount = 0;
                        const maxRetries = 3;

                        const tryScroll = async () => {
                            if (scrollToFloor(quoteData.floorNumber)) {
                                return;
                            }

                            if (retryCount < maxRetries) {
                                retryCount++;
                                await sleep(800);
                                tryScroll();
                            } else {
                                window.alert('未找到目标楼层，可能在其他页面');
                            }
                        };

                        await tryScroll();
                    } else {
                        window.alert('未找到目标楼层，可能在其他页面');
                    }
                }
            }
            return false; // 阻止默认行为
        }, true); // 使用捕获阶段

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.appendChild(jumpButton);

        box.style.cssText = `
            margin: 5px 0;
            padding: 8px;
            background-color: #f5f5f5;
            border-left: 3px solid #4CAF50;
            border-radius: 3px;
            font-size: 14px;
            color: #666;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 10px;
        `;

        box.appendChild(contentDiv);
        box.appendChild(buttonContainer);
        return box;
    }

    // 修改 handleQuoteReplies 函数，在处理引用时也添加锚点
    const handleQuoteReplies = throttle(async () => {
        log('开始处理引用回复');
        addAnchorsToFloors();

        const replies = document.querySelectorAll('.forum-post, .list-reply');
        for (const reply of replies) {
            if (reply.dataset.processed) continue;

            const quoteElement = reply.querySelector('.replay-other, .reother');
            if (!quoteElement) continue;

            const quoteText = quoteElement.textContent;
            const floorMatch = quoteText.match(/回复(\d+)楼|回复(沙发|椅子|板凳)/);
            if (!floorMatch) continue;

            reply.dataset.processed = 'true';
            const floorNumber = getFloorNumber(floorMatch[1] || floorMatch[2]);
            log('处理引用，目标楼层:', floorNumber);

            try {
                const content = await getQuotedContent(floorNumber);
                if (!reply.querySelector('.quoted-content')) {
                    const quoteBox = createQuoteBox(content);
                    // 修改插入位置：确保引用内容显示在楼层内容的顶部
                    const replyContent = reply.querySelector('.retext') || reply.querySelector('.post-content');
                    if (replyContent) {
                        replyContent.insertBefore(quoteBox, replyContent.firstChild);
                    }
                }
            } catch (error) {
                console.error('处理引用内容时出错:', error);
            }
        }
    }, 500);

    // 优化后的MutationObserver
    const observer = new MutationObserver((mutations) => {
        const hasNewContent = mutations.some(mutation =>
            Array.from(mutation.addedNodes).some(node =>
                node.classList && (node.classList.contains('forum-post') || node.classList.contains('list-reply'))
            )
        );

        if (hasNewContent) {
            log('检测到新内容变化');
            handleQuoteReplies();
        }
    });

    // 限制观察范围，否则偶尔出现过度无限加载
    const container = document.querySelector('.forum-container, .recontent');
    if (container) {
        observer.observe(container, {
            childList: true,
            subtree: true
        });
    }

    // 初始处理
    handleQuoteReplies();
})();