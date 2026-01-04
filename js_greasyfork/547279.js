// ==UserScript==
// @name         OpenMindClub学习辅助
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  我要狠狠学！
// @match        https://m.openmindclub.com/stu
// @grant        none
// @run-at       document-start
// @license      MIT    
// @downloadURL https://update.greasyfork.org/scripts/547279/OpenMindClub%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/547279/OpenMindClub%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储API响应数据
    let apiData = {
        courses: {},
        rawResponses: [],
        lastUpdate: null
    };

    // 拦截Fetch API
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);

        // 检查是否是目标API
        if (response.url.includes('openmindclub.com/api')) {
            const clonedResponse = response.clone();

            try {
                const data = await clonedResponse.json();

                // 保存原始响应
                apiData.rawResponses.push({
                    url: response.url,
                    data: data,
                    timestamp: new Date().toISOString()
                });

                // 提取课程数据
                if (data?.data?.subscribedCourses?.edges) {
                    let newMappings = 0;
                    data.data.subscribedCourses.edges.forEach(edge => {
                        if (edge.node?.title && edge.node?.shortUrl) {
                            if (!apiData.courses[edge.node.title]) {
                                newMappings++;
                            }
                            apiData.courses[edge.node.title] = edge.node.shortUrl;
                        }
                    });
                    apiData.lastUpdate = new Date().toISOString();

                    // 保存到localStorage
                    localStorage.setItem('omc_course_mapping', JSON.stringify(apiData.courses));
                }
            } catch (e) {
                console.error('解析API响应失败:', e);
            }
        }

        return response;
    };

    // 拦截XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();

        xhr.addEventListener('load', function() {
            if (xhr.responseURL.includes('openmindclub.com/api')) {
                try {
                    const data = JSON.parse(xhr.responseText);

                    // 保存原始响应
                    apiData.rawResponses.push({
                        url: xhr.responseURL,
                        data: data,
                        timestamp: new Date().toISOString()
                    });

                    // 提取课程数据
                    if (data?.data?.subscribedCourses?.edges) {
                        let newMappings = 0;
                        data.data.subscribedCourses.edges.forEach(edge => {
                            if (edge.node?.title && edge.node?.shortUrl) {
                                if (!apiData.courses[edge.node.title]) {
                                    newMappings++;
                                }
                                apiData.courses[edge.node.title] = edge.node.shortUrl;
                            }
                        });
                        apiData.lastUpdate = new Date().toISOString();

                        // 保存到localStorage
                        localStorage.setItem('omc_course_mapping', JSON.stringify(apiData.courses));
                    }
                } catch (e) {
                    console.error('解析XHR响应失败:', e);
                }
            }
        });

        return xhr;
    };


    // 添加课程按钮功能
    function addCourseButtons() {
        const courseCards = document.querySelectorAll('.components-card-description');

        courseCards.forEach((card) => {
            // 避免重复处理
            if (card.getAttribute('data-omc-processed')) return;

            // 获取课程标题
            const titleElement = card.querySelector('.components-card-description-title');
            if (!titleElement) return;

            const courseTitle = titleElement.textContent.trim();
            const shortUrl = apiData.courses[courseTitle];

            // 查找现有按钮
            const existingButton = card.querySelector('.ant-btn');

            // 创建新的红色边框按钮
            const newButton = document.createElement('button');
            newButton.type = 'button';
            newButton.className = 'ant-btn ant-btn-danger ant-btn-background-ghost omc-course-btn';
            newButton.style.cssText = `
                margin-left: 10px;
                background-color: transparent !important;
                border-color: #ff4d4f !important;
                color: #ff4d4f !important;
                padding: 4px 15px;
                border-radius: 6px;
                border: 1px solid #ff4d4f;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                text-shadow: none;
                transition: all 0.3s;
            `;

            // 按钮内容和点击事件
            if (shortUrl) {
                newButton.innerHTML = '<span>进入课程</span>';
                newButton.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`https://m.openmindclub.com/stu/${shortUrl}`, '_blank');
                };

                // 悬停效果
                newButton.onmouseover = () => {
                    newButton.style.backgroundColor = '#ff4d4f !important';
                    newButton.style.color = '#ffffff !important';
                    newButton.style.transform = 'scale(1.05)';
                };
                newButton.onmouseout = () => {
                    newButton.style.backgroundColor = 'transparent !important';
                    newButton.style.color = '#ff4d4f !important';
                    newButton.style.transform = 'scale(1)';
                };
            } else {
                newButton.innerHTML = '<span>待映射</span>';
                newButton.style.backgroundColor = '#666666 !important';
                newButton.style.borderColor = '#666666 !important';
                newButton.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const userShortUrl = prompt(`请输入课程"${courseTitle}"的shortUrl:`);
                    if (userShortUrl) {
                        apiData.courses[courseTitle] = userShortUrl;
                        localStorage.setItem('omc_course_mapping', JSON.stringify(apiData.courses));
                        // 重新处理按钮
                        card.removeAttribute('data-omc-processed');
                        newButton.remove();
                        addCourseButtons();
                    }
                };
            }

            // 替换现有按钮
            if (existingButton) {
                existingButton.replaceWith(newButton);
            } else {
                card.appendChild(newButton);
            }

            card.setAttribute('data-omc-processed', 'true');
        });
    }

    // 监听DOM变化，自动处理新出现的课程卡片
    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            if (node.classList.contains('components-card-description') ||
                                node.querySelector('.components-card-description')) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }
            });

            if (shouldUpdate) {
                setTimeout(addCourseButtons, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后创建UI
    window.addEventListener('DOMContentLoaded', () => {
        // 从localStorage加载已保存的数据
        const savedData = localStorage.getItem('omc_course_mapping');
        if (savedData) {
            try {
                apiData.courses = JSON.parse(savedData);
            } catch (e) {
                console.error('加载保存数据失败:', e);
            }
        }


        // 开始监听和处理课程按钮
        observePageChanges();

        // 多次尝试添加按钮，应对动态加载
        setTimeout(addCourseButtons, 1000);
        setTimeout(addCourseButtons, 3000);
        setTimeout(addCourseButtons, 5000);
    });

    // 提供全局调试对象
    window.OMC_API = {
        getData: () => apiData,
        getCourses: () => apiData.courses,
        getRawResponses: () => apiData.rawResponses,
        refreshButtons: () => {
            // 清除所有处理标记，重新处理按钮
            document.querySelectorAll('[data-omc-processed]').forEach(el => {
                el.removeAttribute('data-omc-processed');
            });
            addCourseButtons();
        },
        clear: () => {
            apiData = { courses: {}, rawResponses: [], lastUpdate: null };
            localStorage.removeItem('omc_course_mapping');
            // 清除处理标记，重新处理按钮
            document.querySelectorAll('[data-omc-processed]').forEach(el => {
                el.removeAttribute('data-omc-processed');
            });
            addCourseButtons();
        }
    };


})();