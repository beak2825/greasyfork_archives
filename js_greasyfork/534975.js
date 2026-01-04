// ==UserScript==
// @name         影刀社区助手-极简版
// @namespace    DLjun
// @version      1.0
// @description  显示影刀社区用户的优质标记
// @author       过客&DLjun
// @match        https://www.yingdao.com/community/*
// @match        https://www.yingdao.com/community/discuss
// @connect      yingdao.com
// @grant        GM_xmlhttpRequest
// @license		 GPLv3
// @run-at		 document-idle
// @downloadURL https://update.greasyfork.org/scripts/534975/%E5%BD%B1%E5%88%80%E7%A4%BE%E5%8C%BA%E5%8A%A9%E6%89%8B-%E6%9E%81%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/534975/%E5%BD%B1%E5%88%80%E7%A4%BE%E5%8C%BA%E5%8A%A9%E6%89%8B-%E6%9E%81%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储数据
    const dataStore = {
        creatorIdsMap: {},
        userPublishDict: {},
        userAcceptRateDict: {}
    };

    // 添加CSS样式
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .yd-toast {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.7); color: white; padding: 10px 20px;
                border-radius: 4px; z-index: 10000; font-size: 14px; text-align: center;
            }
            .yd-tag-container { display: inline-block; margin-left: 10px; }
            .yd-tag {
                display: inline-block; margin-right: 8px; padding: 2px 6px;
                border-radius: 4px; font-size: 12px; color: white; line-height: 1.5;
                white-space: nowrap; box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            .yd-full { background-color: #52c41a; }
            .yd-high { background-color: #95de64; }
            .yd-medium { background-color: rgb(231, 194, 29); }
            .yd-low { background-color: #ff7875; }
            .yd-none { background-color: #f5222d; }
            .yd-newbie { background-color: rgb(241, 127, 207); }
        `;
        document.head.appendChild(style);
    }

    // Toast提示管理
    const Toast = {
        element: null,
        create(message, duration = 3000) {
            document.getElementById('yd-toast')?.remove();
            
            this.element = document.createElement('div');
            this.element.id = 'yd-toast';
            this.element.className = 'yd-toast';
            this.element.textContent = message;
            document.body.appendChild(this.element);
            
            if (duration > 0) {
                setTimeout(() => this.element?.remove(), duration);
            }
            
            return this.element;
        },
        update(message) {
            if (!this.element || !this.element.parentNode) {
                return this.create(message);
            }
            this.element.textContent = message;
            return this.element;
        }
    };

    // 获取当前页面的页码
    function getCurrentPageNumber() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const pageFromUrl = urlParams.get('page');
            if (pageFromUrl) return parseInt(pageFromUrl, 10);

            const activeItem = document.querySelector('.ant-pagination-item.ant-pagination-item-active');
            if (activeItem) return parseInt(activeItem.textContent.trim(), 10);
        } catch (error) {
            console.error('获取页码失败', error);
        }
        return 1;
    }

    // API请求
    const API = {
        async fetchQuestionData(page = 1, size = 20) {
            const toast = Toast.create("正在获取数据...");
            
            try {
                const url = `https://api.yingdao.com/api/noauth/v1/sns/forum/question/query?page=${page}&size=${size}&tags=%E9%97%AE%E7%AD%94&sort=createTime`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json;charset=UTF-8',
                        'origin': 'https://www.yingdao.com',
                        'referer': 'https://www.yingdao.com/community'
                    },
                    credentials: 'include'
                });
                
                if (!response.ok) throw new Error(`请求失败: ${response.status}`);
                
                const data = await response.json();
                Toast.update("数据获取成功，正在处理...", toast);
                
                if (!data) throw new Error('数据为空');
                
                // 提取问题列表
                let questionList = [];
                if (data.data && Array.isArray(data.data)) {
                    questionList = data.data;
                } else if (data.data && data.data.list && Array.isArray(data.data.list)) {
                    questionList = data.data.list;
                } else if (data.list && Array.isArray(data.list)) {
                    questionList = data.list;
                } else if (Array.isArray(data)) {
                    questionList = data;
                } else {
                    throw new Error('无法提取问题列表');
                }
                
                // 重置数据
                dataStore.creatorIdsMap = {};
                dataStore.userPublishDict = {};
                dataStore.userAcceptRateDict = {};
                
                // 提取创建者ID
                questionList.forEach(item => {
                    if (item?.creator && item?.uuid) {
                        dataStore.creatorIdsMap[item.creator] = {
                            creatorName: item.creatorName || '未知'
                        };
                    }
                });
                
                if (Object.keys(dataStore.creatorIdsMap).length === 0) {
                    throw new Error('未找到创建者信息');
                }

                Toast.update(`正在获取用户数据...`, toast);
                
                // 获取所有创建者的发布列表
                await this.fetchAllUserPublishList(Object.keys(dataStore.creatorIdsMap), toast);
            } catch (error) {
                console.error('获取数据出错', error);
                Toast.update(`获取数据出错: ${error.message}`, toast);
            }
        },
        
        async fetchAllUserPublishList(creatorIds, toast) {
            if (!creatorIds?.length) {
                Toast.update("没有找到用户ID", toast);
                return;
            }
            
            // 批处理用户请求，每次处理5个
            const batchSize = 5;
            const batches = [];
            
            for (let i = 0; i < creatorIds.length; i += batchSize) {
                batches.push(creatorIds.slice(i, i + batchSize));
            }
            
            let completedCount = 0;
            const totalCount = creatorIds.length;
            
            for (const batch of batches) {
                await Promise.all(batch.map(async (creatorId) => {
                    try {
                        const data = await this.fetchUserPublishListPromise(creatorId);
                        completedCount++;
                        const percentage = Math.round((completedCount / totalCount) * 100);
                        Toast.update(`正在处理数据 ${completedCount}/${totalCount} (${percentage}%)`, toast);
                    } catch (error) {
                        completedCount++;
                        console.error(`获取用户 ${creatorId} 数据失败`, error);
                    }
                }));
            }
            
            Toast.update(`数据处理完成，成功：${Object.keys(dataStore.userPublishDict).length}/${creatorIds.length}`, toast);
            
            // 计算采纳率并添加标签
            UserTagManager.calculateUserRates();
            
            // 关闭提示
            setTimeout(() => toast?.remove(), 2000);
        },
        
        async fetchUserPublishListPromise(userUuid) {
            const url = 'https://api.yingdao.com/api/noauth/v1/sns/forum/question/queryUserPublishList';
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json;charset=UTF-8',
                    'origin': 'https://www.yingdao.com',
                    'referer': 'https://www.yingdao.com/'
                },
                credentials: 'include',
                body: JSON.stringify({
                    userUuid: userUuid,
                    tags: "问答",
                    behavior: "publish",
                    sort: "createTime",
                    page: 1,
                    size: 50
                })
            });
            
            if (!response.ok) throw new Error(`请求失败: ${response.status}`);
            
            const responseData = await response.json();
            if (responseData && responseData.data && Array.isArray(responseData.data)) {
                dataStore.userPublishDict[userUuid] = responseData.data;
            } else {
                dataStore.userPublishDict[userUuid] = responseData;
            }
            
            return responseData;
        }
    };

    // 用户标签管理
    const UserTagManager = {
        // 计算所有用户的采纳率
        calculateUserRates() {
            dataStore.userAcceptRateDict = {};
            
            Object.keys(dataStore.userPublishDict).forEach(userUuid => {
                const userData = dataStore.userPublishDict[userUuid];
                
                if (!userData) return;
                
                let publishList = [];
                if (Array.isArray(userData)) {
                    publishList = userData;
                } else if (userData.data && Array.isArray(userData.data)) {
                    publishList = userData.data;
                } else {
                    return;
                }
                
                if (publishList.length > 0) {
                    const totalQuestions = publishList.length;
                    
                    // 计算采纳的问题数量
                    const acceptedQuestions = publishList.filter(item => 
                        item.isAccept === true || 
                        item.status === 'accepted' ||
                        item.status === 'ACCEPTED'
                    ).length;
                    
                    // 计算采纳率
                    const acceptRate = totalQuestions > 0 ? (acceptedQuestions / totalQuestions) : 0;
                    
                    // 存储采纳率信息
                    dataStore.userAcceptRateDict[userUuid] = {
                        userName: dataStore.creatorIdsMap[userUuid]?.creatorName || '未知',
                        totalQuestions,
                        acceptedQuestions,
                        acceptRate
                    };
                }
            });
            
            // 添加标签到页面
            this.addUserTags();
        },
        
        // 为用户添加标记
        addUserTags() {
            if (Object.keys(dataStore.userAcceptRateDict).length === 0) return;
            
            // 获取所有已知用户名
            const knownUserNames = new Set();
            for (const [, data] of Object.entries(dataStore.creatorIdsMap)) {
                if (data.creatorName) knownUserNames.add(data.creatorName);
            }
            
            // 查找可能的用户元素
            const selectors = [
                '.creator___12fdW > span:not([data-yd-tagged])',
                '.discuss___27Ane .creator___12fdW > span:not([data-yd-tagged])'
            ];
            
            let userElements = selectors.flatMap(sel => [...document.querySelectorAll(sel)]);
            
            // 如果没有通过选择器找到，则使用通用匹配方法
            if (userElements.length === 0) {
                const allTextElements = document.querySelectorAll('a:not([data-yd-tagged]), span:not([data-yd-tagged]), div:not([data-yd-tagged])');
                
                userElements = Array.from(allTextElements).filter(element => {
                    const text = element.textContent.trim();
                    return text.length >= 2 && text.length <= 20 && knownUserNames.has(text);
                });
            }
            
            // 处理找到的用户名元素
            userElements.forEach(element => {
                try {
                    const userName = element.textContent.trim();
                    
                    // 查找对应的用户ID
                    let userUuid = Object.entries(dataStore.creatorIdsMap)
                        .find(([, data]) => data.creatorName === userName)?.[0];
                    
                    if (userUuid) {
                        this.addTagToElement(element, userUuid);
                    }
                } catch (error) {
                    console.error('处理用户名元素出错', error);
                }
            });
            
            // 如果没有找到任何用户名或添加了标签，延迟再尝试一次
            if (userElements.length === 0 || document.querySelectorAll('.yd-tag-container').length === 0) {
                setTimeout(() => this.addUserTags(), 3000);
            }
        },
        
        // 向元素添加标记
        addTagToElement(element, userUuid) {
            try {
                if (element.getAttribute('data-yd-tagged')) return false;
                
                const askRateInfo = dataStore.userAcceptRateDict[userUuid] || {};
                
                const tagContainer = document.createElement('div');
                tagContainer.className = 'yd-tag-container';
                
                element.setAttribute('data-user-uuid', userUuid);
                
                // 计算质量标记
                const qualityInfo = this.calculateQualityTag(userUuid);
                if (qualityInfo) {
                    const qualityTag = document.createElement('span');
                    qualityTag.className = `yd-tag ${qualityInfo.className}`;
                    qualityTag.textContent = `${qualityInfo.text}: ${qualityInfo.rate} (${askRateInfo.acceptedQuestions}/${askRateInfo.totalQuestions})`;
                    tagContainer.appendChild(qualityTag);
                }
                
                if (tagContainer.children.length > 0) {
                    // 尝试插入标签
                    try {
                        if (element.nextSibling) {
                            element.parentNode.insertBefore(tagContainer, element.nextSibling);
                        } else {
                            element.parentNode.appendChild(tagContainer);
                        }
                        element.setAttribute('data-yd-tagged', 'true');
                        return true;
                    } catch (insertError) {
                        try {
                            element.insertAdjacentElement('afterend', tagContainer);
                            element.setAttribute('data-yd-tagged', 'true');
                            return true;
                        } catch (alternativeError) {
                            return false;
                        }
                    }
                }
            } catch (error) {
                return false;
            }
            return false;
        },
        
        // 计算用户标记
        calculateQualityTag(userUuid) {
            const askRateInfo = dataStore.userAcceptRateDict[userUuid] || {};
            
            // 提问数量和采纳率
            const askCount = askRateInfo.totalQuestions || 0;
            const askRate = askRateInfo.acceptRate || 0;
            
            // 检查是否为新人（只进行过一次提问）
            if (askCount === 1) {
                return {
                    level: 'newbie',
                    text: '新人',
                    rate: (askRate * 100).toFixed(0) + '%',
                    className: 'yd-newbie'
                };
            }
            
            // 计算标记等级
            const percentage = askRate * 100;
            
            if (percentage === 100) {
                return { level: 'full', text: '全采纳', rate: percentage.toFixed(0) + '%', className: 'yd-full' };
            } else if (percentage >= 90) {
                return { level: 'high', text: '高采纳', rate: percentage.toFixed(0) + '%', className: 'yd-high' };
            } else if (percentage >= 70) {
                return { level: 'medium', text: '中采纳', rate: percentage.toFixed(0) + '%', className: 'yd-medium' };
            } else if (percentage > 50 && percentage < 70) {
                return { level: 'medium', text: '中采纳', rate: percentage.toFixed(0) + '%', className: 'yd-medium' };
            } else if (percentage > 10 && percentage <= 50) {
                return { level: 'low', text: '低采纳', rate: percentage.toFixed(0) + '%', className: 'yd-low' };
            } else {
                return { level: 'none', text: '不采纳', rate: percentage.toFixed(0) + '%', className: 'yd-none' };
            }
        }
    };

    // 页面监控
    function setupPageMonitoring() {
        // 初始加载
        setTimeout(() => {
            API.fetchQuestionData(getCurrentPageNumber());
        }, 1000);
        
        // 监听翻页
        let currentPage = getCurrentPageNumber();
        
        // 检查页码变化
        const checkPageChange = () => {
            const newPage = getCurrentPageNumber();
            if (newPage !== currentPage) {
                currentPage = newPage;
                
                // 清除之前的标签
                document.querySelectorAll('.yd-tag-container').forEach(el => el.remove());
                document.querySelectorAll('[data-yd-tagged]').forEach(el => el.removeAttribute('data-yd-tagged'));
                
                // 重置数据并获取新数据
                API.fetchQuestionData(newPage);
                
                Toast.create(`正在获取数据...`, 2000);
            }
        };
        
        // 定期检查页码变化
        const pageInterval = setInterval(checkPageChange, 1000);
        
        // 5分钟后清除定时器，减少资源消耗
        setTimeout(() => clearInterval(pageInterval), 300000);
        
        // 节流函数
        function throttle(fn, delay) {
            let lastCall = 0;
            return function(...args) {
                const now = new Date().getTime();
                if (now - lastCall < delay) return;
                lastCall = now;
                return fn(...args);
            };
        }
        
        // 监听点击事件（使用事件委托和节流）
        document.addEventListener('click', throttle((e) => {
            let target = e.target;
            
            // 检查是否点击了分页元素
            while (target && target !== document) {
                if (
                    target.classList?.contains('ant-pagination-item') ||
                    target.classList?.contains('ant-pagination-next') ||
                    target.classList?.contains('ant-pagination-prev') ||
                    target.classList?.contains('ant-pagination-jump-next') ||
                    target.classList?.contains('ant-pagination-jump-prev')
                ) {
                    setTimeout(checkPageChange, 300);
                    break;
                }
                target = target.parentElement;
            }
        }, 200));
        
        // 使用 MutationObserver 监听DOM变化（降低频率）
        const observer = new MutationObserver(throttle(() => {
            UserTagManager.addUserTags();
            checkPageChange();
        }, 500));
        
        observer.observe(document.body, { 
            childList: true, 
            subtree: true
        });
        
        // 定期尝试添加标记，确保不遗漏，使用递减间隔
        let retryCount = 0;
        const maxRetries = 5;
        
        function retryAddTags() {
            if (retryCount < maxRetries) {
                UserTagManager.addUserTags();
                retryCount++;
                setTimeout(retryAddTags, 3000 - retryCount * 500); // 递减间隔
            }
        }
        
        // 初始加载后尝试添加标签
        setTimeout(retryAddTags, 3000);
    }

    // 初始化
    if (window.location.href.includes('https://www.yingdao.com/community')) {
        addStyles();
        Toast.create("影刀社区助手已启动", 2000);
        setupPageMonitoring();
    }
})(); 