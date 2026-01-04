// ==UserScript==
// @name         森空岛ᴾˡᵘˢ
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skland.com
// @version      1.0.15
// @description  在板块页和搜索页增加一个的标签过滤器(支持多标签用空格分隔)(因为是边加载边过滤，不是全局搜索，所以较慢)，给文章详情页添加一个批量下载附件图片的按钮，如有错误请刷新页面
// @author       小旦
// @namespace    https://greasyfork.org/zh-CN/users/1002415-%E5%B0%8F%E6%97%A6
// @match        *://*.skland.com/
// @match        *://*.skland.com/game/*
// @match        *://*.skland.com/search*
// @match        *://*.skland.com/article?id=*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @supportURL   https://greasyfork.org/zh-CN/scripts/506756-%E6%A3%AE%E7%A9%BA%E5%B2%9B%E1%B4%BE%CB%A1%E1%B5%98%CB%A2/feedback
// @downloadURL https://update.greasyfork.org/scripts/506756/%E6%A3%AE%E7%A9%BA%E5%B2%9B%E1%B4%BE%CB%A1%E1%B5%98%CB%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/506756/%E6%A3%AE%E7%A9%BA%E5%B2%9B%E1%B4%BE%CB%A1%E1%B5%98%CB%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的URL
    const currentUrl = window.location.href;

    // 帖子过滤逻辑
    if (currentUrl.includes('/game/') || currentUrl.includes('/search') || !currentUrl.includes('/article')) {
        let searchTags = []; // 存储用户的输入标签数组
        let isRealTimeFiltering = false; // 标记是否开启了实时过滤

        // 检查并隐藏没有特定标签的帖子
        function checkAndHidePost(postDiv) {
            const tags = postDiv.querySelectorAll('span.tag-name');
            const postTags = Array.from(tags).map(tag => tag.textContent.trim().toLowerCase());

            // 检查帖子是否包含所有指定的标签
            const hasAllTags = searchTags.every(tag => postTags.includes(tag));

            if (!hasAllTags) {
                setTimeout(() => {
                    postDiv.style.display = 'none';
                    const nextDivider = postDiv.nextElementSibling;
                    if (nextDivider && (
                        nextDivider.classList.contains('sc-kTNzjB', 'ywBjc', 'FeedList__Divider-sc-prbdre-8', 'dTHlpX') ||
                        nextDivider.classList.contains('sc-hbGPBs', 'bOSbOD', 'SearchList__Divider-sc-ahmbpl-3', 'bJWzDd')
                    )) {
                        nextDivider.style.display = 'none';
                    }
                }, 500);
            } else {
                postDiv.style.display = '';
                const nextDivider = postDiv.nextElementSibling;
                if (nextDivider && (
                    nextDivider.classList.contains('sc-kTNzjB', 'ywBjc', 'FeedList__Divider-sc-prbdre-8', 'dTHlpX') ||
                    nextDivider.classList.contains('sc-hbGPBs', 'bOSbOD', 'SearchList__Divider-sc-ahmbpl-3', 'bJWzDd')
                )) {
                    nextDivider.style.display = '';
                }
            }
        }

        // 创建搜索框和确认按钮
        const createSearchBox = () => {
            const searchWrapper = document.createElement('div');
            searchWrapper.style.position = 'relative';
            searchWrapper.style.height = '40px';
            searchWrapper.style.padding = '0px 4px';
            searchWrapper.style.display = 'flex';
            searchWrapper.style.flexDirection = 'row';
            searchWrapper.style.border = '1px solid transparent';
            searchWrapper.style.borderRadius = '100px';
            searchWrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            searchWrapper.style.marginRight = '10px';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = '输入标签进行过滤';
            searchInput.style.caretColor = 'rgb(200, 235, 33)';
            searchInput.style.color = 'rgb(255, 255, 255)';
            searchInput.style.fontSize = '14px';
            searchInput.style.flex = '1 1 0%';
            searchInput.style.padding = '0 10px';

            const searchButton = document.createElement('div');
            searchButton.className = 'search-state';
            searchButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="search-icon" style="width: 18px; height: 18px; color: rgba(255, 255, 255, 0.45);">
                <path fill-rule="evenodd" d="M13.727 4.301a6.9 6.9 0 1 0-1.774 8.924l2.16 2.161a.9.9 0 1 0 1.273-1.273l-2.16-2.16q.17-.222.32-.456a.9.9 0 0 0-1.511-.976 5.05 5.05 0 0 1-1.734 1.647 5.1 5.1 0 1 1 2.54-4.751.9.9 0 1 0 1.797-.116 6.8 6.8 0 0 0-.307-1.631 7 7 0 0 0-.604-1.369" clip-rule="evenodd"></path>
            </svg>
        `;
            searchButton.style.lineHeight = '0';
            searchButton.style.cursor = 'pointer';
            searchButton.style.padding = '10px 12px';
            searchButton.style.marginLeft = '12px';

            searchWrapper.appendChild(searchInput);
            searchWrapper.appendChild(searchButton);

            return { searchWrapper, searchInput, searchButton };
        };

        // 插入搜索框和按钮
        function insertSearchBox(headerRight, { searchWrapper, searchInput, searchButton }) {
            if (headerRight) {
                headerRight.insertBefore(searchWrapper, headerRight.firstChild);

                // 添加搜索按钮点击事件监听器
                searchButton.addEventListener('click', () => onSearchButtonClick(searchInput));

                // 添加输入框事件监听器以实现实时搜索
                searchInput.addEventListener('input', (event) => onSearchInputChange(event, searchInput));
            } else {
                console.log("未找到目标 div");
            }
        }

        // 根据标签过滤帖子
        function filterPostsByTag() {
            const selector = currentUrl.includes('/search') ? 'div[data-event-name="search_result_post_imp"]' : 'div[data-event-name="feed_post_imp"]';
            document.querySelectorAll(selector).forEach(postDiv => {
                checkAndHidePost(postDiv);
            });
        }

        // 重置所有帖子的显示状态
        function resetPostsDisplay() {
            const feedSelectors = 'div[data-event-name="feed_post_imp"], div.sc-kTNzjB.ywBjc.FeedList__Divider-sc-prbdre-8.dTHlpX';
            const searchSelectors = 'div[data-event-name="search_result_post_imp"], div.sc-hbGPBs.bOSbOD.SearchList__Divider-sc-ahmbpl-3.bJWzDd';
            const selectors = currentUrl.includes('/search') ? searchSelectors : feedSelectors;
            document.querySelectorAll(selectors).forEach(div => {
                div.style.display = '';
            });
        }

        // 对于已经存在的节点进行检查（当用户输入标签后会重新过滤）
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const selector = currentUrl.includes('/search') ? 'div[data-event-name="search_result_post_imp"]' : 'div[data-event-name="feed_post_imp"]';
                            if (node.matches(selector)) {
                                if (isRealTimeFiltering && searchTags.length > 0) {
                                    checkAndHidePost(node);
                                }
                            }
                        }
                    });
                }
            });
        });

        // 开始观察
        observer.observe(document.body, { childList: true, subtree: true });


        // 搜索框的 input 事件监听器
        function onSearchInputChange(event, searchInput) {
            // 输入框文本发生变化时，暂停实时过滤
            isRealTimeFiltering = false;

            if (searchInput.value.trim() === '') {
                // 清空搜索框时重置所有帖子的显示状态
                resetPostsDisplay();
            }
        }

        // 当点击搜索按钮时
        function onSearchButtonClick(searchInput) {
            // 重置所有帖子的显示状态
            resetPostsDisplay();

            // 更新搜索标签
            searchTags = searchInput.value.trim().split(/\s+/).filter(Boolean).map(tag => tag.toLowerCase());

            // 重新开启实时过滤
            isRealTimeFiltering = true;

            // 应用新的过滤条件
            filterPostsByTag();
        }

        // 延迟执行函数
        const delayedExecution = () => {
            const targetDiv = document.querySelector('.header-right');
            if (targetDiv) {
                const { searchWrapper, searchInput, searchButton } = createSearchBox();
                insertSearchBox(targetDiv, { searchWrapper, searchInput, searchButton });
            } else {
                console.log("未找到目标 div");
            }
        };

        // 设置延迟时间
        setTimeout(delayedExecution, 5000);
    }

    // 图片下载按钮
    if (currentUrl.includes('/article?id=')) {
        const createDownloadButton = () => {
            // 创建按钮
            const downloadButton = document.createElement('button');
            downloadButton.textContent = '下载原图';
            downloadButton.style.position = 'relative';
            downloadButton.style.padding = '9px';
            downloadButton.style.display = 'inline-block';
            downloadButton.style.backgroundColor = 'rgb(55, 55, 55)';
            downloadButton.style.border = '5px solid rgb(200, 235, 33)';
            downloadButton.style.borderRadius = '37px';
            downloadButton.style.marginTop = '-2px';
            downloadButton.style.color = 'rgb(255, 255, 255)';
            downloadButton.style.fontSize = '12px';
            downloadButton.style.lineHeight = '16px';
            downloadButton.style.fontWeight = '700';
            downloadButton.style.fontFamily = 'akrobat, Arial, sans-serif';
            downloadButton.style.cursor = 'pointer';

            // 绑定点击事件到下载按钮
            downloadButton.addEventListener('click', function() {
                downloadImages();
            });

            return downloadButton;
        };

        const addTargetButton = (targetDiv) => {
            if (!targetDiv) return;
            const button = createDownloadButton();
            targetDiv.appendChild(button);
        };

        // 获取符合类名模式的元素 找到收藏按钮所在的 div
        const getTargetElement = () => {
            const relationGroupClassNamePattern = /RelationGroup__Wrapper-sc-\w+-\d+/;
            const elements = document.querySelectorAll('*');
            for (let element of elements) {
                if (element.classList && element.classList.value.match(relationGroupClassNamePattern)) {
                    return element;
                }
            }
            return null;
        };

        // 下载图片函数
        function downloadImages() {
            // 尝试获取所有 swiper-item 类的 div 元素
            const containers = document.querySelectorAll('.swiper-item');

            // 如果没有找到 .swiper-item 则尝试下载特定来源的 webp 图片
            if (!containers.length) {
                // 侧栏class
                const excludedClassNamesPattern = /Common__ToolbarStyle-sc-\w+-\d+/;

                // 获取所有符合条件的图片元素
                const allImgs = document.querySelectorAll('img.sc-fHslGR.flPNXF[src^="https://bbs.hycdn.cn/image/"]');

                // 新增article__ImageGallery和Image__Wrapper容器内的图片
                const galleryImgs = document.querySelectorAll('.article__ImageGallery-sc-fjni0c-0 img, .Image__Wrapper-sc-g5r8rn-2 img');
                const combinedImgs = [...allImgs, ...galleryImgs];

                // 使用Array.from转换为数组以便使用filter方法
                const imgs = Array.from(combinedImgs).filter(img => {
                    // 检查是否具有评论区图片的style属性
                    const styleAttr = img.getAttribute('style');
                    if (styleAttr && styleAttr.includes('object-fit: cover;')) return false;

                    // 检查是否位于侧栏下
                    const isExcluded = isImgExcludedByParentClass(img, excludedClassNamesPattern);
                    if (isExcluded) return false;

                    return true;
                });

                if (!imgs.length) {
                    console.error('未找到包含指定来源的 webp 或 gif 图片，或所有找到的图片都被排除');
                    return;
                }

                const now = new Date();
                const timestamp = now.toISOString().slice(0, 19).replace(/[-:T]/g, '');
                let count = 1;

                imgs.forEach(img => {
                    handleImageDownload(img, timestamp, count++);
                });
            } else {
                // 如果找到了 .swiper-item，则按原逻辑下载图片
                const now = new Date();
                const timestamp = now.toISOString().slice(0, 19).replace(/[-:T]/g, '');
                let count = 1;

                containers.forEach((container, index) => {
                    if (index === 0) {
                        const firstImage = container.querySelector('img');
                        if (firstImage) {
                            const images = Array.from(container.querySelectorAll('img')).slice(1); // 跳过第一个
                            images.forEach(img => {
                                handleImageDownload(img, timestamp, count++);
                            });
                        } else {
                            console.error('未找到首张图片');
                        }
                    } else {
                        container.querySelectorAll('img').forEach(img => {
                            handleImageDownload(img, timestamp, count++);
                        });
                    }
                });
            }
        }

        function isImgExcludedByParentClass(img, pattern) {
            let parentNode = img.parentNode;
            while (parentNode && parentNode !== document) {
                if (parentNode.classList && parentNode.classList.value.match(pattern)) {
                    return true;
                }
                parentNode = parentNode.parentNode;
            }
            return false;
        }

        // 处理单个图片下载
        function handleImageDownload(img, timestamp, count) {
            const src = img.src;

            // 统一处理所有图片下载
            const downloadImage = (url) => {
                // 处理Data URI
                if (url.startsWith('data:')) {
                    const mimeMatch = url.match(/^data:image\/(\w+);/);
                    const extension = mimeMatch?.[1] || 'webp';
                    return fetch(url).then(res => res.blob())
                        .then(blob => ({
                            blob,
                            filename: `${document.title.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim()}_${new URLSearchParams(window.location.search).get('id') || 'unknown_id'}_${count}.${extension}`
                        }));
                }

                // 从普通URL提取文件名
                const urlObj = new URL(url);
                const pathParts = urlObj.pathname.split('/');
                const originalName = pathParts.pop() || `image_${timestamp}_${count}`;
                const cleanName = originalName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\-_.]/g, '_'); // 允许中文字符

                // 统一使用GM_xmlhttpRequest获取Blob
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        responseType: "blob",
                        onload: function(response) {
                            const blob = response.response;
                            const contentType = response.responseHeaders.match(/content-type:\s*(image\/\w+)/i)?.[1];
                            const ext = contentType?.split('/')[1] || 'webp';
                            resolve({
                                blob,
                                // 获取页面标题并清理非法字符
                                filename: `${document.title.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim()}_${new URLSearchParams(window.location.search).get('id') || 'unknown_id'}_${count}.${ext}`
                            });
                        },
                        onerror: reject
                    });
                });
            };

            downloadImage(src)
                .then(({ blob, filename }) => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    console.log(`Downloaded: ${filename}`);
                })
                .catch(error => {
                    console.error(`Failed to download: ${filename}, error: ${error}`);
                });
        }

        // 延迟执行函数
        const delayedExecution = () => {
            const targetDiv = getTargetElement();
            if (targetDiv) {
                addTargetButton(targetDiv);
            } else {
                console.log("未找到目标 div");
            }
        };

        // 设置延迟时间
        setTimeout(delayedExecution, 5000);
    }

})();
