// ==UserScript==
// @name         Bilibili Feed Card Rollback
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Save and restore Bilibili feed card information
// @author       GloryIsMine
// @license      MIT
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526397/Bilibili%20Feed%20Card%20Rollback.user.js
// @updateURL https://update.greasyfork.org/scripts/526397/Bilibili%20Feed%20Card%20Rollback.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 最大保存记录数
    const MAX_HISTORY = 10;
    const STORAGE_KEY = 'bilibili_feed_history';

    // 获取所有视频卡片信息的函数
    function getFeedCardInfo() {
        const feedCards = document.querySelectorAll('.feed-card');
        return Array.from(feedCards).map(card => {
            // 获取封面图片
            const coverImg = card.querySelector('.bili-video-card__cover img');
            const coverUrl = coverImg ? coverImg.src : '';

            // 获取视频标题
            const titleElement = card.querySelector('.bili-video-card__info--tit');
            const title = titleElement ? titleElement.textContent.trim() : '';

            // 获取播放次数和评论数
            const statsTexts = card.querySelectorAll('.bili-video-card__stats--text');
            const viewCount = statsTexts[0] ? statsTexts[0].textContent.trim() : '0';
            const commentCount = statsTexts[1] ? statsTexts[1].textContent.trim() : '0';

            // 获取视频时长
            const durationElement = card.querySelector('.bili-video-card__stats__duration');
            const duration = durationElement ? durationElement.textContent.trim() : '';

            // 获取UP主/频道信息
            const authorElement = card.querySelector('.bili-video-card__info--author');
            const author = authorElement ? authorElement.textContent.trim() : '';

            // 获取视频链接
            const linkElement = card.querySelector('.bili-video-card__info--tit a');
            const videoUrl = linkElement ? linkElement.href : '';

            // 获取inline-video元素
            const inlineVideoElement = card.querySelector('video');
            const inlineVideoUrl = inlineVideoElement ? inlineVideoElement.src : '';

            return {
                coverUrl,
                title,
                viewCount,
                commentCount,
                duration,
                author,
                videoUrl,
                inlineVideoUrl
            };
        });
    }

    // 保存feed-card信息到sessionStorage
    function saveFeedCards() {
        const currentInfo = getFeedCardInfo();
        let history = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
        
        // 添加新记录到开头
        history.unshift({
            timestamp: new Date().getTime(),
            cards: currentInfo
        });

        // 限制历史记录数量
        if (history.length > MAX_HISTORY) {
            history = history.slice(0, MAX_HISTORY);
        }

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }

    // 恢复feed-card信息
    function restoreFeedCards() {
        const history = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
        if (history.length === 0) {
            alert('没有可恢复的历史记录');
            return;
        }

        const lastRecord = history[0];
        const feedCards = document.querySelectorAll('.feed-card');
        
        // 确保有足够的卡片可以恢复
        if (feedCards.length !== lastRecord.cards.length) {
            alert('当前页面卡片数量与历史记录不匹配，无法恢复');
            return;
        }

        // 更新每个卡片的内容
        feedCards.forEach((card, index) => {
            const cardInfo = lastRecord.cards[index];
            
            // 更新封面图片（包括所有图片源）
            const picture = card.querySelector('.bili-video-card__cover');
            if (picture) {
                // 更新所有source标签的srcset
                const sources = picture.querySelectorAll('source');
                sources.forEach(source => {
                    const currentSrcset = source.srcset;
                    // 从当前srcset中提取图片格式后缀（.avif或.webp）
                    const formatMatch = currentSrcset.match(/\.(avif|webp)/);
                    if (formatMatch) {
                        const format = formatMatch[0];
                        // 构建新的srcset，保持原有的尺寸和格式
                        const newSrcset = cardInfo.coverUrl + format;
                        source.srcset = newSrcset;
                    }
                });

                // 更新img标签
                const img = picture.querySelector('img');
                if (img) {
                    img.src = cardInfo.coverUrl;
                    img.alt = cardInfo.title;
                }
            }

            // 更新视频标题和链接
            const titleElements = card.querySelectorAll('.bili-video-card__info--tit a');
            titleElements.forEach(element => {
                element.textContent = cardInfo.title;
                element.href = cardInfo.videoUrl;
                element.title = cardInfo.title;
            });

            // 更新播放次数和评论数
            const statsTexts = card.querySelectorAll('.bili-video-card__stats--text');
            if (statsTexts[0]) statsTexts[0].textContent = cardInfo.viewCount;
            if (statsTexts[1]) statsTexts[1].textContent = cardInfo.commentCount;

            // 更新视频时长
            const durationElement = card.querySelector('.bili-video-card__stats__duration');
            if (durationElement) durationElement.textContent = cardInfo.duration;

            // 更新UP主/频道信息
            const authorElement = card.querySelector('.bili-video-card__info--author');
            if (authorElement) authorElement.textContent = cardInfo.author;

            // 更新所有相关的链接
            const imageLink = card.querySelector('.bili-video-card__image--link');
            if (imageLink) imageLink.href = cardInfo.videoUrl;

            const inlineVideoElement = card.querySelector('video');
            if (inlineVideoElement) inlineVideoElement.src = cardInfo.inlineVideoUrl;
        });

        // 移除已使用的记录
        history.shift();
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }

    // 创建rollback按钮
    function createRollbackButton() {
        const feedRollBtn = document.querySelector('.feed-roll-btn');
        if (!feedRollBtn) return;

        const button = document.createElement('button');
        button.textContent = '回滚';
        button.className = 'feed-rollback-btn';
        button.style.cssText = `
            position: fixed;
            padding: 8px;
            background-color: #00a1d6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            z-index: ${getComputedStyle(feedRollBtn).zIndex};
            width: 54px;
        `;
        button.addEventListener('click', restoreFeedCards);
        
        // 将按钮添加到body中
        document.body.appendChild(button);

        // 更新按钮位置的函数
        function updateButtonPosition() {
            const feedRollBtnRect = feedRollBtn.getBoundingClientRect();
            button.style.left = `${feedRollBtnRect.left}px`;
            button.style.top = `${feedRollBtnRect.bottom + 8}px`;
        }

        // 初始化位置
        updateButtonPosition();

        // 监听可能影响位置的事件
        window.addEventListener('resize', updateButtonPosition);
        window.addEventListener('scroll', updateButtonPosition);
        
        // 监听页面缩放
        window.visualViewport?.addEventListener('resize', updateButtonPosition);
        window.visualViewport?.addEventListener('scroll', updateButtonPosition);

        // 创建MutationObserver来监听DOM变化
        const observer = new MutationObserver(updateButtonPosition);
        observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: true 
        });
    }

    // 监听roll-btn点击事件
    function setupRollButtonListener() {
        const observer = new MutationObserver((mutations) => {
            const rollBtn = document.querySelector('.roll-btn');
            // 确保roll按钮存在且未初始化
            if (rollBtn && !rollBtn.dataset.rollbackInitialized) {
                rollBtn.dataset.rollbackInitialized = 'true';
                rollBtn.addEventListener('click', saveFeedCards);
                // 创建rollback按钮
                createRollbackButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化
    function init() {
        setupRollButtonListener();
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();