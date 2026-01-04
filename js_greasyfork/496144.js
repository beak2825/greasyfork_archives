// ==UserScript==
// @name         bgm相关回复跳转
// @version      0.5
// @description  在web自动识别贴贴过的帖子，提供跳转。
// @match        https://bgm.tv/ep/*
// @match        https://bangumi.tv/ep/*
// @match        https://chii.in/ep/*
// @grant        none
// @license      MIT
// @namespace    bgm_jump_related_post
// @require      https://cdn.tailwindcss.com
// @downloadURL https://update.greasyfork.org/scripts/496144/bgm%E7%9B%B8%E5%85%B3%E5%9B%9E%E5%A4%8D%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/496144/bgm%E7%9B%B8%E5%85%B3%E5%9B%9E%E5%A4%8D%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==


// 几个todo，目前自己没这个需求，暂时简化。如果有人需要可以说一声：
// - [ ] 除了贴贴也支持回复过的跳转。
// 前期主要支持贴贴跳转
// 后续会增加回复跳转的，因为其实可以搜索，相对没那么着急
// - [ ] 暂时只支持番剧吐槽页面，主要是觉得别的页面也没必要。
// - [x] 暂时只处理每层回复的一楼，这个主要是暂时懒得做先简化一下。也就是不支持比如说第二楼的所有回复贴贴。
// - [ ] 看要不要支持这个框可拖动，要不就是现在这个折叠之后的样式有点小奇怪，就是不应该留东西太外面，这个动画有点太花哨了。整体其实可以更简单一点，写到后面有点后悔了，引入样式库其实已经是极限了，后续应该更精简一点

(function () {
    'use strict';

    // Load Tailwind CSS
    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindScript);

    const selfUserId = $('.avatar').attr('href').split('/').pop();
    // 先完成遍历处理第一层的逻辑
    const replyList = $('#comment_list>div');  // 得到所有首层回复
    let relatedPostIds = [];  // 筛选最终跟当前用户相关的id

    // replyList.slice(0, 2).each(function () {  // 调试场景只看前三个帖子
    replyList.each(function () {  // 逐个过滤
        const firstLevelId = $(this).attr('id');
        
        // 检查一楼
        if (checkReplyElementRelated(selfUserId, $(this))) {
            relatedPostIds.push(firstLevelId);
        }
        
        // 检查楼中楼（二级回复）
        const subReplies = $(this).find('.topic_sub_reply .sub_reply_bg');
        subReplies.each(function() {
            if (checkSubReplyRelated(selfUserId, $(this))) {
                const subReplyId = $(this).attr('id');
                relatedPostIds.push(subReplyId);
            }
        });
    });

    // console.log(relatedPostIds);
    const component = createJumpComponent(relatedPostIds);
    const columnEPB = $('#columnEpB')
    columnEPB.append(component);
    
    // Initialize component behavior after DOM insertion
    initializeComponent(relatedPostIds);
})();

// 检查当前回复元素的「贴贴」里边是否包含当前用户id
function checkReplyElementRelated(userId, element) {
    // 先在这个元素内继续选择 `a.item.selected`
    // const likesGridItem = element.find('a.item.selected');
    const innerDiv = element.children().eq(2)

    // 这个元素里的 title 包含所有 贴贴元素的 HTML 文本，每个 `<a>` 就是一种类型的贴贴
    const likesGridItemAs = innerDiv.find('.reply_content').children().eq(1).children();
    if (likesGridItemAs.length === 0) {
        return false;
    }

    let found = false;
    likesGridItemAs.each(function () {
        const title = $(this).attr('title');
        if (checkUserIdInTitle(userId, title)) {
            found = true;
            return false;  // break loop
            // ! 这里才是坑，里边有个回调函数，return true 会直接返回到这个回调函数，而不是外层的函数
        }
    });

    return found;
}

function checkUserIdInTitle(userId, title) {
    const regex = /\/user\/(\w+)/g;
    let match;
    while ((match = regex.exec(title)) !== null) {
        if (match[1] === userId) {
            return true;
        }
    }
    return false;
}

// 检查楼中楼（二级回复）是否包含当前用户的贴贴
function checkSubReplyRelated(userId, element) {
    // 二级回复的贴贴在 .likes_grid 中
    const likesGrid = element.find('.likes_grid');
    if (likesGrid.length === 0) {
        return false;
    }
    
    const likesGridItems = likesGrid.find('a.item');
    if (likesGridItems.length === 0) {
        return false;
    }
    
    let found = false;
    likesGridItems.each(function () {
        const title = $(this).attr('title');
        if (title && checkUserIdInTitle(userId, title)) {
            found = true;
            return false;  // break loop
        }
    });
    
    return found;
}

function createJumpComponent(postIds) {
    const isEmpty = postIds.length === 0;
    
    // Apple-inspired Bento Grid styling with Tailwind + Custom CSS
    const styles = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600;700&display=swap');
            
            /* Custom properties for Apple-style design */
            :root {
                --bento-bg: rgba(255, 255, 255, 0.72);
                --bento-border: rgba(0, 0, 0, 0.04);
                --bento-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
                --bento-text: #1d1d1f;
                --bento-text-secondary: #86868b;
                --bento-accent: #0071e3;
                --bento-accent-hover: #0077ed;
                --bento-item-bg: rgba(255, 255, 255, 0.5);
                --bento-item-hover: rgba(245, 245, 247, 0.9);
            }
            
            @media (prefers-color-scheme: dark) {
                :root {
                    --bento-bg: rgba(29, 29, 31, 0.72);
                    --bento-border: rgba(255, 255, 255, 0.1);
                    --bento-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    --bento-text: #f5f5f7;
                    --bento-text-secondary: #a1a1a6;
                    --bento-accent: #0a84ff;
                    --bento-accent-hover: #409cff;
                    --bento-item-bg: rgba(48, 48, 51, 0.5);
                    --bento-item-hover: rgba(58, 58, 60, 0.9);
                }
            }
            
            .jump-bento-container {
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
                position: fixed;
                top: 20%;
                right: 0;
                z-index: 9999;
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .jump-bento-container.collapsed {
                transform: translateX(calc(100% - 56px));
            }
            
            .jump-bento-container.collapsed .jump-bento-card {
                border-radius: 28px;
                min-width: 56px;
                max-width: 56px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            }
            
            .jump-bento-container.collapsed .jump-bento-header {
                padding: 0;
                border: none;
                background: transparent;
                justify-content: center;
            }
            
            .jump-bento-container.collapsed .jump-bento-title-wrapper {
                display: none;
            }
            
            .jump-bento-container.collapsed .jump-bento-content {
                display: none;
            }
            
            .jump-bento-container.collapsed .jump-bento-empty {
                display: none;
            }
            
            .jump-bento-container.collapsed .jump-bento-toggle {
                margin: 12px;
                width: 32px;
                height: 32px;
            }
            
            .jump-bento-card {
                min-width: 280px;
                max-width: 320px;
                background: var(--bento-bg);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                border: 1px solid var(--bento-border);
                border-radius: 20px;
                box-shadow: var(--bento-shadow);
                color: var(--bento-text);
                margin-right: 20px;
                overflow: hidden;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .jump-bento-header {
                padding: 16px 20px;
                border-bottom: 1px solid var(--bento-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, var(--bento-item-bg) 0%, transparent 100%);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .jump-bento-title-wrapper {
                display: flex;
                align-items: center;
                transition: opacity 0.3s ease;
            }
            
            .jump-bento-title {
                font-size: 15px;
                font-weight: 600;
                letter-spacing: -0.01em;
                color: var(--bento-text);
                margin: 0;
            }
            
            .jump-bento-count {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 22px;
                height: 22px;
                padding: 0 6px;
                background: var(--bento-accent);
                color: white;
                border-radius: 11px;
                font-size: 12px;
                font-weight: 600;
                margin-left: 8px;
            }
            
            .jump-bento-toggle {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: var(--bento-item-bg);
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                color: var(--bento-text);
            }
            
            .jump-bento-toggle:hover {
                background: var(--bento-item-hover);
                transform: scale(1.05);
            }
            
            .jump-bento-toggle:active {
                transform: scale(0.95);
            }
            
            .jump-bento-nav {
                display: flex;
                gap: 8px;
                padding: 12px;
                border-bottom: 1px solid var(--bento-border);
                background: var(--bento-item-bg);
            }
            
            .jump-bento-nav-btn {
                flex: 1;
                padding: 8px 12px;
                background: var(--bento-item-bg);
                border: 1px solid var(--bento-border);
                border-radius: 8px;
                color: var(--bento-text);
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
            }
            
            .jump-bento-nav-btn:hover {
                background: var(--bento-item-hover);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .jump-bento-nav-btn:active {
                transform: translateY(0);
            }
            
            .jump-bento-nav-btn:disabled {
                opacity: 0.4;
                cursor: not-allowed;
                transform: none;
            }
            
            .jump-bento-nav-btn:disabled:hover {
                background: var(--bento-item-bg);
                box-shadow: none;
            }
            
            .jump-bento-kbd {
                display: inline-block;
                padding: 2px 6px;
                background: var(--bento-border);
                border-radius: 4px;
                font-size: 11px;
                font-family: monospace;
                margin-left: 4px;
            }
            
            .jump-bento-content {
                max-height: 60vh;
                overflow-y: auto;
                padding: 12px;
                scrollbar-width: thin;
                scrollbar-color: var(--bento-text-secondary) transparent;
            }
            
            .jump-bento-content::-webkit-scrollbar {
                width: 6px;
            }
            
            .jump-bento-content::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .jump-bento-content::-webkit-scrollbar-thumb {
                background: var(--bento-text-secondary);
                border-radius: 3px;
            }
            
            .jump-bento-item {
                position: relative;
                display: flex;
                align-items: center;
                padding: 12px 16px;
                margin-bottom: 8px;
                background: var(--bento-item-bg);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                text-decoration: none;
                color: var(--bento-text);
                border: 1px solid transparent;
                overflow: hidden;
            }
            
            .jump-bento-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 3px;
                height: 100%;
                background: var(--bento-accent);
                transform: scaleY(0);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .jump-bento-item:hover {
                background: var(--bento-item-hover);
                border-color: var(--bento-border);
                transform: translateX(-4px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }
            
            .jump-bento-item:hover::before {
                transform: scaleY(1);
            }
            
            .jump-bento-item:active {
                transform: translateX(-2px) scale(0.98);
            }
            
            .jump-bento-icon {
                width: 32px;
                height: 32px;
                background: linear-gradient(135deg, var(--bento-accent) 0%, var(--bento-accent-hover) 100%);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 12px;
                font-size: 14px;
                font-weight: 600;
                color: white;
                flex-shrink: 0;
            }
            
            .jump-bento-item-text {
                font-size: 13px;
                font-weight: 500;
                letter-spacing: -0.01em;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .jump-bento-arrow {
                color: var(--bento-text-secondary);
                font-size: 16px;
                opacity: 0;
                transform: translateX(-8px);
                transition: all 0.3s ease;
            }
            
            .jump-bento-item:hover .jump-bento-arrow {
                opacity: 1;
                transform: translateX(0);
            }
            
            .jump-bento-empty {
                padding: 32px 20px;
                text-align: center;
            }
            
            .jump-bento-empty-icon {
                width: 64px;
                height: 64px;
                margin: 0 auto 16px;
                background: var(--bento-item-bg);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                opacity: 0.5;
            }
            
            .jump-bento-empty-text {
                font-size: 14px;
                color: var(--bento-text-secondary);
                line-height: 1.5;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .jump-bento-item {
                animation: fadeInUp 0.4s ease backwards;
            }
            
            .jump-bento-item:nth-child(1) { animation-delay: 0.05s; }
            .jump-bento-item:nth-child(2) { animation-delay: 0.1s; }
            .jump-bento-item:nth-child(3) { animation-delay: 0.15s; }
            .jump-bento-item:nth-child(4) { animation-delay: 0.2s; }
            .jump-bento-item:nth-child(5) { animation-delay: 0.25s; }
            .jump-bento-item:nth-child(n+6) { animation-delay: 0.3s; }
        </style>
    `;

    // Generate content based on whether there are posts
    let contentHtml;
    let navHtml = '';
    
    if (isEmpty) {
        contentHtml = `
            <div class="jump-bento-empty">
                <div class="jump-bento-empty-icon">💭</div>
                <div class="jump-bento-empty-text">
                    还没有任何"贴贴标记"<br>
                    <span style="font-size: 12px; opacity: 0.7;">去给感兴趣的回复点个贴贴吧</span>
                </div>
            </div>
        `;
    } else {
        // 添加导航按钮
        navHtml = `
            <div class="jump-bento-nav">
                <button class="jump-bento-nav-btn" id="jumpBentoPrev" title="上一个 (P)">
                    ← 上一个<span class="jump-bento-kbd">P</span>
                </button>
                <button class="jump-bento-nav-btn" id="jumpBentoNext" title="下一个 (N)">
                    下一个 →<span class="jump-bento-kbd">N</span>
                </button>
            </div>
        `;
        
        const linksHtml = postIds.map((postId, index) => `
            <a href="#${postId}" class="jump-bento-item" data-post-id="${postId}" data-index="${index}">
                <div class="jump-bento-icon">#${index + 1}</div>
                <span class="jump-bento-item-text">${postId}</span>
                <span class="jump-bento-arrow">→</span>
            </a>
        `).join('');
        
        contentHtml = `<div class="jump-bento-content">${linksHtml}</div>`;
    }

    // Complete component HTML
    const componentHtml = `
        <div class="jump-bento-container" id="jumpBentoContainer">
            <div class="jump-bento-card">
                <div class="jump-bento-header">
                    <div class="jump-bento-title-wrapper">
                        <span class="jump-bento-title">贴贴回复</span>
                        ${!isEmpty ? `<span class="jump-bento-count">${postIds.length}</span>` : ''}
                    </div>
                    <button class="jump-bento-toggle" id="jumpBentoToggle" title="收起/展开">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </button>
                </div>
                ${navHtml}
                ${contentHtml}
            </div>
        </div>
    `;
    
    return styles + componentHtml;
}

// Initialize component interactivity
function initializeComponent(postIds) {
    const container = document.getElementById('jumpBentoContainer');
    const toggleBtn = document.getElementById('jumpBentoToggle');
    
    if (!container || !toggleBtn) return;
    
    let currentIndex = -1; // 当前高亮的索引
    
    // Load saved state
    const isCollapsed = localStorage.getItem('jumpBentoCollapsed') === 'true';
    if (isCollapsed) {
        container.classList.add('collapsed');
        toggleBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
        `;
    }
    
    // Toggle collapse/expand
    toggleBtn.addEventListener('click', () => {
        const collapsed = container.classList.toggle('collapsed');
        localStorage.setItem('jumpBentoCollapsed', collapsed);
        
        // Animate icon rotation and change
        toggleBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            toggleBtn.innerHTML = collapsed ? `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
            ` : `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            `;
            toggleBtn.style.transform = '';
        }, 200);
    });
    
    if (postIds.length === 0) return; // 空状态不需要导航功能
    
    // 跳转到指定帖子的函数
    function jumpToPost(index) {
        if (index < 0 || index >= postIds.length) return;
        
        currentIndex = index;
        const postId = postIds[index];
        const targetElement = document.getElementById(postId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Highlight effect
            targetElement.style.transition = 'background-color 0.6s ease';
            const originalBg = targetElement.style.backgroundColor;
            targetElement.style.backgroundColor = 'rgba(0, 113, 227, 0.1)';
            setTimeout(() => {
                targetElement.style.backgroundColor = originalBg;
            }, 1500);
            
            // 更新列表中的活跃状态
            updateActiveItem(index);
            updateNavButtons();
        }
    }
    
    // 更新列表中的活跃项
    function updateActiveItem(index) {
        const items = document.querySelectorAll('.jump-bento-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.style.background = 'var(--bento-accent)';
                item.style.color = 'white';
                item.querySelector('.jump-bento-icon').style.background = 'rgba(255, 255, 255, 0.3)';
            } else {
                item.style.background = '';
                item.style.color = '';
                item.querySelector('.jump-bento-icon').style.background = '';
            }
        });
    }
    
    // 更新导航按钮状态
    function updateNavButtons() {
        const prevBtn = document.getElementById('jumpBentoPrev');
        const nextBtn = document.getElementById('jumpBentoNext');
        
        if (prevBtn && nextBtn) {
            prevBtn.disabled = currentIndex <= 0;
            nextBtn.disabled = currentIndex >= postIds.length - 1;
        }
    }
    
    // 上一个按钮
    const prevBtn = document.getElementById('jumpBentoPrev');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex <= 0) {
                currentIndex = 0;
            } else {
                jumpToPost(currentIndex - 1);
            }
        });
    }
    
    // 下一个按钮
    const nextBtn = document.getElementById('jumpBentoNext');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < 0) {
                jumpToPost(0);
            } else if (currentIndex < postIds.length - 1) {
                jumpToPost(currentIndex + 1);
            }
        });
    }
    
    // Add smooth scroll behavior to links
    const links = document.querySelectorAll('.jump-bento-item');
    links.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            jumpToPost(index);
        });
    });
    
    // 键盘快捷键监听
    document.addEventListener('keydown', (e) => {
        // 检查是否在输入框中
        const activeElement = document.activeElement;
        const isInputFocused = activeElement && (
            activeElement.tagName === 'INPUT' || 
            activeElement.tagName === 'TEXTAREA' || 
            activeElement.isContentEditable
        );
        
        // 如果在输入框中，不触发快捷键
        if (isInputFocused) return;
        
        // N - 下一个
        if (e.key === 'n' || e.key === 'N') {
            e.preventDefault();
            if (currentIndex < 0) {
                jumpToPost(0);
            } else if (currentIndex < postIds.length - 1) {
                jumpToPost(currentIndex + 1);
            }
        }
        
        // P - 上一个
        if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            if (currentIndex <= 0) {
                currentIndex = 0;
            } else {
                jumpToPost(currentIndex - 1);
            }
        }
    });
    
    // 初始化按钮状态
    updateNavButtons();
}

