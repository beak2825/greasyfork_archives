// ==UserScript==
// @name         Auto Load Next Page
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动加载下一页内容和图片
// @author       mr.p@email
// @match        *://misskon.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532198/Auto%20Load%20Next%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/532198/Auto%20Load%20Next%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        // 需要监听滚动的容器元素选择器
        containerSelector: 'body',
        // 下一页按钮的选择器
        nextPageSelector: '.post-page-numbers:not(.current)',
        // 分页数字选择器
        pageNumbersSelector: '.post-page-numbers',
        // 内容容器的选择器
        contentSelector: '.entry',
        // 滚动到页面高度的百分比时触发加载（0.3表示30%）
        scrollThresholdPercent: 0.3,
        // 检查间隔（毫秒）
        checkInterval: 1000,
        // 图片选择器
        imageSelector: 'img.aligncenter.lazy:not(.loaded)',
        // 是否启用连续加载（加载完一页后自动检查并加载下一页）
        continuousLoading: true,
        // 是否自动探测总页数（如果为false，则使用maxPageNumber作为总页数）
        autoDetectTotalPages: true,
        // 最大页数（如果autoDetectTotalPages为false，则使用此值作为总页数）
        maxPageNumber: 10
    };

    // 状态标记
    let isLoading = false;
    let checkTimer = null;
    // 页面计数器
    let currentPageNumber = 1;
    // 总页数
    let totalPageNumber = null;

    // 处理页面可见性变化
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            startAutoCheck();
        } else {
            stopAutoCheck();
        }
    });

    // 启动定时检查
    function startAutoCheck() {
        if (!checkTimer) {
            // 先探测总页数
            detectTotalPages();
            
            checkTimer = setInterval(function() {
                if (isNearBottom()) {
                    loadNextPage();
                }
            }, config.checkInterval);
        }
    }
    
    // 探测总页数
    function detectTotalPages() {
        if (!config.autoDetectTotalPages) {
            totalPageNumber = config.maxPageNumber;
            console.log(`[Debug] 使用配置的最大页数: ${totalPageNumber}`);
            return;
        }
        
        try {
            // 获取所有分页链接
            const pageLinks = document.querySelectorAll(config.pageNumbersSelector);
            if (pageLinks && pageLinks.length > 0) {
                // 找出最大页码
                let maxPage = 1;
                pageLinks.forEach(link => {
                    const pageNum = parseInt(link.textContent.trim());
                    if (!isNaN(pageNum) && pageNum > maxPage) {
                        maxPage = pageNum;
                    }
                });
                
                totalPageNumber = maxPage;
                console.log(`[Debug] 探测到总页数: ${totalPageNumber}`);
            } else {
                // 如果没有找到分页链接，使用配置的最大页数
                totalPageNumber = config.maxPageNumber;
                console.log(`[Debug] 未找到分页链接，使用配置的最大页数: ${totalPageNumber}`);
            }
        } catch (error) {
            console.error('[Error] 探测总页数时出错:', error);
            totalPageNumber = config.maxPageNumber;
            console.log(`[Debug] 探测出错，使用配置的最大页数: ${totalPageNumber}`);
        }
    }

    // 停止定时检查
    function stopAutoCheck() {
        if (checkTimer) {
            clearInterval(checkTimer);
            checkTimer = null;
        }
    }

    // 检查是否滚动到触发加载的位置
    function isNearBottom() {
        try {
            const scrollHeight = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight
            );
            const scrollTop = window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop;
            const clientHeight = window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight;
            
            // 计算已滚动的百分比
            const scrolledPercent = scrollTop / (scrollHeight - clientHeight);
            // 检查是否已滚动到设定的阈值百分比
            const reachedThreshold = scrolledPercent >= config.scrollThresholdPercent;
            const hasNextPage = getNextPageUrl() !== null;
            // 检查是否已达到最大页数
            const notReachedMaxPage = totalPageNumber === null || currentPageNumber < totalPageNumber;
            
            return reachedThreshold && hasNextPage && !isLoading && notReachedMaxPage;
        } catch (error) {
            console.error('[Error] 滚动检测出错:', error);
            return false;
        }
    }

    // 获取下一页URL
    function getNextPageUrl() {
        const nextPageLink = document.querySelector(config.nextPageSelector);
        return nextPageLink ? nextPageLink.href : null;
    }

    // 加载下一页内容
    function loadNextPage() {
        try {
            if (isLoading) {
                console.log('[Debug] 正在加载中，跳过新的加载请求');
                return;
            }
            
            const nextPageUrl = getNextPageUrl();
            if (!nextPageUrl) {
                console.log('[Debug] 没有找到下一页URL');
                return;
            }

            // 检查是否已达到最大页数
            if (totalPageNumber !== null && currentPageNumber >= totalPageNumber) {
                console.log(`[Debug] 已达到最大页数 ${totalPageNumber}，停止加载`);
                return;
            }
            
            currentPageNumber++;
            console.log(`[Debug] 开始加载第 ${currentPageNumber}/${totalPageNumber || '?'} 页:`, nextPageUrl);
            isLoading = true;

            GM_xmlhttpRequest({
                method: 'GET',
                url: nextPageUrl,
                onload: function(response) {
                    try {
                        console.log('[Debug] 页面内容加载成功，开始解析');
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const content = doc.querySelector(config.contentSelector);

                        if (content) {
                            const container = document.querySelector(config.contentSelector);
                            container.appendChild(content);
                            console.log(`[Debug] 第 ${currentPageNumber} 页内容已添加到页面`);

                            // 加载新添加内容中的图片
                            const images = content.querySelectorAll(config.imageSelector);
                            console.log(`[Debug] 第 ${currentPageNumber} 页: 找到 ${images.length} 张待加载的图片`);
                            images.forEach((img, index) => {
                                try {
                                    img.loading = 'eager';
                                    if (img.dataset.src) {
                                        console.log(`[Debug] 第 ${currentPageNumber} 页: 加载第 ${index + 1}/${images.length} 张图片:`, img.dataset.src);
                                        img.src = img.dataset.src;
                                    }
                                    img.classList.remove('lazy');
                                    img.classList.add('loaded');
                                    img.style.display = 'block';
                                } catch (imgError) {
                                    console.error(`[Error] 处理第 ${index + 1} 张图片时出错:`, imgError);
                                }
                            });
                        } else {
                            console.warn('[Warning] 未找到内容容器');
                        }
                    } catch (parseError) {
                        console.error('[Error] 解析页面内容时出错:', parseError);
                    } finally {
                        isLoading = false;
                        console.log(`[Debug] 第 ${currentPageNumber}/${totalPageNumber || '?'} 页加载完成，重置加载状态`);
                        
                        // 如果启用了连续加载，检查是否需要继续加载下一页
                        if (config.continuousLoading && getNextPageUrl()) {
                            console.log('[Debug] 启用连续加载，检查是否需要加载更多页面');
                            // 使用setTimeout避免可能的递归调用堆栈溢出
                            setTimeout(function() {
                                if (isNearBottom()) {
                                    loadNextPage();
                                }
                            }, 500);
                        }
                    }
                },
                onerror: function(error) {
                    console.error('[Error] 加载下一页失败:', error);
                    isLoading = false;
                }
            });
        } catch (error) {
            console.error('[Error] 加载下一页过程中出错:', error);
            isLoading = false;
        }
    }

    // 监听滚动事件
    window.addEventListener('scroll', function() {
        if (isNearBottom()) {
            loadNextPage();
        }
    });

    // 初始化自动检查
    startAutoCheck();
})();