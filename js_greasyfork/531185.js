// ==UserScript==
// @name         V2EX 回复跳转工具
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  在 V2EX 上添加一键跳转到特定回复或楼层的功能，支持跨页面跳转和@用户跳转
// @author       xiaomo1135
// @match        https://www.v2ex.com/t/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531185/V2EX%20%E5%9B%9E%E5%A4%8D%E8%B7%B3%E8%BD%AC%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/531185/V2EX%20%E5%9B%9E%E5%A4%8D%E8%B7%B3%E8%BD%AC%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 存储要跳转的目标楼层
    function saveTargetFloor(floor) {
        localStorage.setItem('v2ex_target_floor', floor);
    }
    
    // 获取要跳转的目标楼层
    function getTargetFloor() {
        return localStorage.getItem('v2ex_target_floor');
    }
    
    // 清除目标楼层
    function clearTargetFloor() {
        localStorage.removeItem('v2ex_target_floor');
    }
    
    // 存储要跳转的目标用户名
    function saveTargetUsername(username) {
        localStorage.setItem('v2ex_target_username', username);
    }
    
    // 获取要跳转的目标用户名
    function getTargetUsername() {
        return localStorage.getItem('v2ex_target_username');
    }
    
    // 清除目标用户名
    function clearTargetUsername() {
        localStorage.removeItem('v2ex_target_username');
    }
    
    // 获取当前页面的回复元素
    function getReplies() {
        return document.querySelectorAll('#Main .box .cell[id^="r_"]');
    }
    
    // 获取总回复数
    function getTotalReplies() {
        let totalReplies = 0;
        
        // 方法1：从页面顶部文本获取
        const topicInfo = document.querySelector('.topic_buttons');
        if (topicInfo) {
            const prevElement = topicInfo.previousElementSibling;
            if (prevElement) {
                const match = prevElement.textContent.match(/(\d+)\s*[条個]回[复覆]/);
                if (match && match[1]) {
                    totalReplies = parseInt(match[1]);
                    console.log('从顶部信息获取到楼层数:', totalReplies);
                }
            }
        }
        
        // 方法2：从页面其他位置获取
        if (totalReplies === 0) {
            const allElements = document.querySelectorAll('div, span, h1, h2, h3, p');
            for (const element of allElements) {
                const match = element.textContent.match(/(\d+)\s*[条個]回[复覆]/);
                if (match && match[1]) {
                    totalReplies = parseInt(match[1]);
                    console.log('从页面元素获取到楼层数:', totalReplies, element);
                    break;
                }
            }
        }
        
        return totalReplies;
    }
    
    // 获取当前页码
    function getCurrentPage() {
        let currentPage = 1;
        const pageMatch = window.location.href.match(/\?p=(\d+)/);
        if (pageMatch && pageMatch[1]) {
            currentPage = parseInt(pageMatch[1]);
        }
        return currentPage;
    }
    
    // 获取每页回复数量
    function getRepliesPerPage() {
        return getReplies().length;
    }
    
    // 获取主题的总页数
    function getTotalPages() {
        // 从分页控件获取总页数
        const pagination = document.querySelector('.page_input');
        if (pagination) {
            return parseInt(pagination.getAttribute('max')) || 1;
        }
        
        // 如果没有分页控件，尝试从其他元素获取
        const pageLinks = document.querySelectorAll('.page_normal, .page_current');
        if (pageLinks.length > 0) {
            let maxPage = 1;
            pageLinks.forEach(link => {
                const pageNum = parseInt(link.textContent);
                if (!isNaN(pageNum) && pageNum > maxPage) {
                    maxPage = pageNum;
                }
            });
            return maxPage;
        }
        
        return 1; // 默认为1页
    }
    
    // 查找用户名对应的回复
    function findReplyByUsername(username) {
        const replies = getReplies();
        const currentPage = getCurrentPage();
        const repliesPerPage = replies.length;
        
        for (let i = 0; i < replies.length; i++) {
            const reply = replies[i];
            const usernameElement = reply.querySelector('strong a.dark');
            
            if (usernameElement && usernameElement.textContent.trim() === username) {
                // 计算楼层号
                const floorNum = (currentPage - 1) * repliesPerPage + i + 1;
                return { reply, floorNum };
            }
        }
        
        return null;
    }
    
    // 系统地搜索用户回复
    function searchUserReplySystematically(username) {
        // 获取总页数
        const totalPages = getTotalPages();
        const currentPage = getCurrentPage();
        
        // 已经搜索过的页面
        const searchedPages = JSON.parse(localStorage.getItem('v2ex_searched_pages') || '[]');
        
        // 将当前页添加到已搜索页面
        if (!searchedPages.includes(currentPage)) {
            searchedPages.push(currentPage);
            localStorage.setItem('v2ex_searched_pages', JSON.stringify(searchedPages));
        }
        
        // 查找下一个要搜索的页面
        let nextPage = null;
        for (let i = 1; i <= totalPages; i++) {
            if (!searchedPages.includes(i)) {
                nextPage = i;
                break;
            }
        }
        
        // 如果找到了下一个要搜索的页面，跳转到该页面
        if (nextPage !== null) {
            const baseUrl = window.location.href.split('?')[0];
            window.location.href = `${baseUrl}?p=${nextPage}`;
        } else {
            // 如果所有页面都已搜索，清除搜索状态
            clearTargetUsername();
            localStorage.removeItem('v2ex_searched_pages');
        }
    }
    
    // 页面加载完成后检查是否需要滚动到特定楼层或用户
    function checkAndScrollToTarget() {
        // 检查是否有目标楼层
        const targetFloor = getTargetFloor();
        if (targetFloor) {
            console.log('找到目标楼层:', targetFloor);
            
            // 清除存储的目标楼层，防止刷新页面后再次跳转
            clearTargetFloor();
            
            // 获取当前页面所有回复
            const allReplies = getReplies();
            
            // 获取当前页码和每页回复数
            const currentPage = getCurrentPage();
            const repliesPerPage = allReplies.length;
            
            // 计算目标楼层在当前页面的索引
            const floorNum = parseInt(targetFloor);
            
            // 修正：计算在当前页面的准确索引
            const firstFloorInCurrentPage = (currentPage - 1) * repliesPerPage + 1;
            const indexInCurrentPage = floorNum - firstFloorInCurrentPage;
            
            console.log('当前页码:', currentPage);
            console.log('每页回复数:', repliesPerPage);
            console.log('当前页第一个楼层:', firstFloorInCurrentPage);
            console.log('目标楼层在当前页的索引:', indexInCurrentPage);
            
            // 如果索引有效，滚动到目标楼层
            if (indexInCurrentPage >= 0 && indexInCurrentPage < allReplies.length) {
                const targetReply = allReplies[indexInCurrentPage];
                
                // 延迟执行滚动操作，确保页面完全加载
                setTimeout(() => {
                    console.log('滚动到目标楼层元素:', targetReply);
                    targetReply.scrollIntoView({ behavior: 'smooth' });
                    
                    // 高亮显示目标楼层
                    const originalBg = targetReply.style.backgroundColor;
                    targetReply.style.backgroundColor = '#fffbcc';
                    setTimeout(() => {
                        targetReply.style.backgroundColor = originalBg;
                    }, 2000);
                }, 1000);
            } else {
                console.error('无法在当前页找到目标楼层，索引超出范围');
            }
        }
        
        // 检查是否有目标用户名
        const targetUsername = getTargetUsername();
        if (targetUsername) {
            console.log('找到目标用户名:', targetUsername);
            
            // 查找用户名对应的回复
            const result = findReplyByUsername(targetUsername);
            
            if (result) {
                // 找到了用户回复，清除搜索状态
                clearTargetUsername();
                localStorage.removeItem('v2ex_searched_pages');
                
                const { reply, floorNum } = result;
                
                // 延迟执行滚动操作，确保页面完全加载
                setTimeout(() => {
                    console.log('滚动到目标用户回复:', reply);
                    reply.scrollIntoView({ behavior: 'smooth' });
                    
                    // 高亮显示目标楼层
                    const originalBg = reply.style.backgroundColor;
                    reply.style.backgroundColor = '#fffbcc';
                    setTimeout(() => {
                        reply.style.backgroundColor = originalBg;
                    }, 2000);
                }, 1000);
            } else {
                // 如果当前页面没有找到，继续系统地搜索其他页面
                console.log('当前页面未找到用户回复，继续搜索其他页面');
                searchUserReplySystematically(targetUsername);
            }
        }
    }
    
    // 添加@用户跳转功能
    function addAtUserJumpButtons() {
        // 查找所有回复内容
        const replyContents = document.querySelectorAll('.reply_content');
        
        replyContents.forEach(content => {
            // 查找所有@用户的文本
            const atMatches = content.innerHTML.match(/@<a href="\/member\/([^"]+)"[^>]*>([^<]+)<\/a>/g);
            
            if (atMatches) {
                // 为每个@用户添加跳转按钮
                atMatches.forEach(match => {
                    // 提取用户名
                    const usernameMatch = match.match(/@<a href="\/member\/([^"]+)"[^>]*>([^<]+)<\/a>/);
                    if (usernameMatch && usernameMatch[2]) {
                        const username = usernameMatch[2];
                        
                        // 创建一个新的HTML字符串，包含原始@用户链接和新的跳转按钮
                        const jumpButton = `<a href="javascript:void(0);" class="at-user-jump" data-username="${username}" style="margin-left:5px;font-size:12px;color:#778087;">[查看]</a>`;
                        
                        // 替换原始@用户文本
                        content.innerHTML = content.innerHTML.replace(match, match + jumpButton);
                    }
                });
                
                // 为新添加的跳转按钮绑定事件
                const jumpButtons = content.querySelectorAll('.at-user-jump');
                jumpButtons.forEach(button => {
                    button.addEventListener('click', function(e) {
                        e.preventDefault();
                        const username = this.getAttribute('data-username');
                        
                        // 查找用户名对应的回复
                        const result = findReplyByUsername(username);
                        
                        if (result) {
                            const { reply, floorNum } = result;
                            
                            // 滚动到目标回复
                            reply.scrollIntoView({ behavior: 'smooth' });
                            
                            // 高亮显示目标楼层
                            const originalBg = reply.style.backgroundColor;
                            reply.style.backgroundColor = '#fffbcc';
                            setTimeout(() => {
                                reply.style.backgroundColor = originalBg;
                            }, 2000);
                        } else {
                            // 如果当前页面没有找到，直接开始系统地搜索，不显示确认框
                            // 保存目标用户名
                            saveTargetUsername(username);
                            
                            // 初始化已搜索页面列表
                            localStorage.setItem('v2ex_searched_pages', JSON.stringify([getCurrentPage()]));
                            
                            // 从第1页开始系统地搜索
                            const baseUrl = window.location.href.split('?')[0];
                            window.location.href = `${baseUrl}?p=1`;
                        }
                    });
                });
            }
        });
    }
    
    // 添加跳转到指定楼层的功能 - 固定在右下角
    function addJumpToFloorFunction() {
        const totalReplies = getTotalReplies();
        
        // 创建固定在右下角的跳转控件
        const jumpDiv = document.createElement('div');
        jumpDiv.className = 'v2ex-floor-jump';
        
        // 设置固定定位样式
        jumpDiv.style.position = 'fixed';
        jumpDiv.style.bottom = '20px';
        jumpDiv.style.right = '20px';
        jumpDiv.style.zIndex = '1000';
        jumpDiv.style.padding = '10px';
        jumpDiv.style.backgroundColor = '#f9f9f9';
        jumpDiv.style.borderRadius = '5px';
        jumpDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        jumpDiv.style.textAlign = 'center';
        
        // 创建一个可折叠的容器
        const collapsibleDiv = document.createElement('div');
        collapsibleDiv.style.display = 'none'; // 默认折叠
        
        // 创建输入框
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.max = totalReplies.toString();
        input.placeholder = '输入楼层数 (1-' + totalReplies + ')';
        input.style.width = '150px';
        input.style.marginRight = '10px';
        input.style.padding = '5px';
        input.style.marginBottom = '10px';
        
        // 创建跳转按钮
        const button = document.createElement('button');
        button.textContent = '跳转到楼层';
        button.style.padding = '5px 10px';
        button.style.display = 'block';
        button.style.margin = '0 auto';
        
        // 显示总楼层信息
        const infoSpan = document.createElement('span');
        infoSpan.style.display = 'block';
        infoSpan.style.marginTop = '5px';
        infoSpan.style.color = '#999';
        infoSpan.style.fontSize = '12px';
        infoSpan.textContent = totalReplies > 0 ? `共 ${totalReplies} 个楼层` : '无法获取楼层数';
        
        // 创建折叠/展开按钮
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '楼层跳转 ▲';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.backgroundColor = '#e2e2e2';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '3px';
        toggleButton.style.cursor = 'pointer';
        
        // 折叠/展开功能
        toggleButton.addEventListener('click', function() {
            if (collapsibleDiv.style.display === 'none') {
                collapsibleDiv.style.display = 'block';
                toggleButton.textContent = '楼层跳转 ▼';
            } else {
                collapsibleDiv.style.display = 'none';
                toggleButton.textContent = '楼层跳转 ▲';
            }
        });
        
        // 跳转按钮点击事件
        button.addEventListener('click', () => {
            const floor = parseInt(input.value);
            if (floor && floor > 0 && floor <= totalReplies) {
                // 计算目标楼层在哪一页
                const repliesPerPage = getRepliesPerPage();
                const targetPage = Math.ceil(floor / repliesPerPage);
                
                console.log('目标楼层:', floor);
                console.log('每页回复数:', repliesPerPage);
                console.log('目标页码:', targetPage);
                
                // 如果在当前页
                if (targetPage === getCurrentPage()) {
                    // 计算在当前页的位置
                    const firstFloorInCurrentPage = (targetPage - 1) * repliesPerPage + 1;
                    const indexInCurrentPage = floor - firstFloorInCurrentPage;
                    
                    console.log('当前页第一个楼层:', firstFloorInCurrentPage);
                    console.log('目标楼层在当前页的索引:', indexInCurrentPage);
                    
                    const allPosts = getReplies();
                    
                    if (indexInCurrentPage >= 0 && indexInCurrentPage < allPosts.length) {
                        const targetReply = allPosts[indexInCurrentPage];
                        if (targetReply) {
                            targetReply.scrollIntoView({ behavior: 'smooth' });
                            // 高亮显示目标楼层
                            const originalBg = targetReply.style.backgroundColor;
                            targetReply.style.backgroundColor = '#fffbcc';
                            setTimeout(() => {
                                targetReply.style.backgroundColor = originalBg;
                            }, 2000);
                        }
                    }
                } else {
                    // 需要跳转到其他页面
                    // 保存目标楼层，以便页面加载后滚动
                    saveTargetFloor(floor);
                    
                    // 跳转到目标页面
                    const baseUrl = window.location.href.split('?')[0];
                    window.location.href = `${baseUrl}?p=${targetPage}`;
                }
            }
        });
        
        // 组装DOM结构
        collapsibleDiv.appendChild(input);
        collapsibleDiv.appendChild(button);
        collapsibleDiv.appendChild(infoSpan);
        
        jumpDiv.appendChild(toggleButton);
        jumpDiv.appendChild(collapsibleDiv);
        
        // 添加到页面
        document.body.appendChild(jumpDiv);
    }
    
    // 为每个回复添加楼层标记和复制链接按钮
    function addFloorLabelsAndCopyButtons() {
        const replies = getReplies();
        const currentPage = getCurrentPage();
        const repliesPerPage = replies.length;
        
        replies.forEach((reply, index) => {
            // 计算当前回复的楼层号
            const floorNum = (currentPage - 1) * repliesPerPage + index + 1;
            
            // 添加楼层标记
            const floorLabel = document.createElement('div');
            floorLabel.textContent = `楼层: ${floorNum}`;
            floorLabel.style.color = '#999';
            floorLabel.style.fontSize = '12px';
            floorLabel.style.marginBottom = '5px';
            reply.insertBefore(floorLabel, reply.firstChild);
            
            // 创建复制链接按钮
            const jumpButton = document.createElement('a');
            jumpButton.textContent = '复制链接';
            jumpButton.href = 'javascript:void(0)';
            jumpButton.className = 'v2ex-jump-btn';
            jumpButton.style.marginLeft = '10px';
            jumpButton.style.fontSize = '12px';
            jumpButton.style.color = '#778087';
            
            // 获取回复ID
            if (reply.id) {
                const replyID = reply.id;
                
                // 点击事件 - 复制链接到剪贴板
                jumpButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    const url = `${window.location.origin}${window.location.pathname}#${replyID}`;
                    navigator.clipboard.writeText(url).then(() => {
                        // 临时改变按钮文字提示已复制
                        const originalText = jumpButton.textContent;
                        jumpButton.textContent = '已复制!';
                        setTimeout(() => {
                            jumpButton.textContent = originalText;
                        }, 1000);
                    });
                });
                
                // 添加按钮到回复操作区域
                const replyActions = reply.querySelector('.fr');
                if (replyActions) {
                    replyActions.appendChild(jumpButton);
                }
            }
        });
    }
    
    // 页面加载完成后执行
    window.addEventListener('load', function() {
        console.log('V2EX 跳转工具已加载');
        
        // 检查是否需要滚动到特定楼层或用户
        checkAndScrollToTarget();
        
        // 为每个回复添加楼层标记和复制链接按钮
        addFloorLabelsAndCopyButtons();
        
        // 添加@用户跳转功能
        addAtUserJumpButtons();
        
        // 添加固定在右下角的跳转功能
        addJumpToFloorFunction();
    });
})();