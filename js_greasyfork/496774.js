// ==UserScript==
// @name         B站♥视频评级
// @namespace    http://tampermonkey.net/
// @version      2.1.9
// @description  计算B站视频的加权互动播放比并显示，点击复制信息(含封面)并显示浮动特效，支持动态更新
// @author       Zola
// @match        https://www.bilibili.com/video/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496774/B%E7%AB%99%E2%99%A5%E8%A7%86%E9%A2%91%E8%AF%84%E7%BA%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/496774/B%E7%AB%99%E2%99%A5%E8%A7%86%E9%A2%91%E8%AF%84%E7%BA%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解析包含“万”或“亿”的数字
    function parseCount(text) {
        if (!text) return 0;
        if (text.includes('万')) return parseFloat(text) * 10000;
        if (text.includes('亿')) return parseFloat(text) * 100000000;
        return parseInt(text.replace(/,/g, '')) || 0;
    }

    // 获取评级HTML
    function getRating(ratio) {
        const r = parseFloat(ratio);
        const ratings = [
            [100, '满分视频', '#02c8d3'],
            [95, '好评如潮', 'green'],
            [80, '非常好评', 'limegreen'],
            [70, '多半好评', 'yellowgreen'],
            [40, '褒贬不一', 'orange'],
            [20, '多半差评', 'orangered'],
            [0, '差评如潮', 'red']
        ];
        const [_, text, color] = ratings.find(([min]) => r >= min) || ratings[ratings.length - 1];
        return `<span style="color:${color}">${text}</span>`;
    }

    // 获取纯文本评级
    function getPlainRating(ratio) {
        const r = parseFloat(ratio);
        if (r >= 100) return '满分视频';
        if (r >= 95) return '好评如潮';
        if (r >= 80) return '非常好评';
        if (r >= 70) return '多半好评';
        if (r >= 40) return '褒贬不一';
        if (r >= 20) return '多半差评';
        return '差评如潮';
    }

    // 显示浮动特效
    function showCopyEffect(event, textOverride) {
        const effect = document.createElement('div');
        const isCool = Math.random() > 0.5;
        Object.assign(effect.style, {
            position: 'absolute',
            left: `${event.pageX}px`,
            top: `${event.pageY - 30}px`,
            padding: '6px 12px',
            zIndex: '9999',
            pointerEvents: 'none',
            opacity: '1',
            transition: 'all 0.6s ease-out'
        });

        // 如果传入了 textOverride (通常是出错时)，则显示传入的文字
        // 否则显示原本的随机特效
        const displayText = textOverride || (isCool ? 'Copied!' : '复制啦～');

        if (isCool && !textOverride) {
            effect.textContent = displayText;
            Object.assign(effect.style, {
                background: 'linear-gradient(45deg, #ff00cc, #3333ff)',
                color: '#fff',
                borderRadius: '8px',
                fontFamily: 'monospace',
                boxShadow: '0 0 15px rgba(255, 0, 204, 0.8)'
            });
            setTimeout(() => effect.style.transform = 'translateY(-30px) rotate(-5deg)', 50);
        } else {
            effect.textContent = displayText;
            Object.assign(effect.style, {
                background: 'rgba(255, 182, 193, 0.9)',
                color: '#fff',
                border: '2px solid #ff69b4',
                borderRadius: '15px',
                fontFamily: 'Comic Sans MS, cursive'
            });
            setTimeout(() => effect.style.transform = 'translateY(-20px) scale(1.1)', 50);
        }

        setTimeout(() => effect.style.opacity = '0', 50);
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 650);
    }

    // 创建工具栏元素
    function createToolbarItem(className, title, content) {
        const wrapper = document.createElement('div');
        wrapper.className = `toolbar-left-item-wrap zola-${className}`;
        const item = document.createElement('div');
        item.className = `${className} video-toolbar-left-item zola-${className}`;
        item.title = title;
        item.innerHTML = `<span class="${className}-info video-toolbar-item-text">${content}</span>`;
        wrapper.appendChild(item);
        return { wrapper, item };
    }

    // 获取视频数据
    function getVideoData() {
        const danmakuText = document.querySelector('.dm-text')?.innerText.trim() ||
                            document.querySelector('.bpx-player-ctrl-dm-input')?.placeholder || '0';
        const danmakuCount = parseCount(danmakuText.replace('弹幕', '').replace('发个友善的', ''));

        const viewCount = parseCount(document.querySelector('.view-text')?.innerText.trim() || '0');
        const likeCount = parseCount(document.querySelector('.video-like-info.video-toolbar-item-text')?.innerText.trim().replace(/,/g, '') || '0');
        const coinCount = parseCount(document.querySelector('.video-coin-info.video-toolbar-item-text')?.innerText.trim().replace(/,/g, '') || '0');
        const favCount = parseCount(document.querySelector('.video-fav-info.video-toolbar-item-text')?.innerText.trim().replace(/,/g, '') || '0');
        const shareCount = parseCount(document.querySelector('.video-share-info-text')?.innerText.trim().replace(/,/g, '') || '0');
        return { viewCount, likeCount, coinCount, favCount, shareCount, danmakuCount };
    }

    // 核心算法逻辑
    function calculateScore(data) {
        const { viewCount, likeCount, coinCount, favCount, shareCount } = data;
        const weightedInteractions = (likeCount * 2) + (coinCount * 3) + (favCount * 5) + (shareCount * 3);
        let weightedRatio = viewCount < 1000 ? 0 : ((weightedInteractions / viewCount) * 100 * 3).toFixed(2);
        let displayRatio = weightedRatio;
        if (weightedRatio >= 75) {
            displayRatio = 90 + (weightedRatio - 75) * (10 / (200 - 75));
            displayRatio = parseFloat(displayRatio).toFixed(2);
        }
        return displayRatio;
    }

    // 获取封面图片URL
    function getCoverImageUrl() {
        const metaImg = document.querySelector('meta[property="og:image"]');
        if (metaImg) return metaImg.content.split('@')[0];

        const img = document.getElementById('wxwork-share-pic');
        if (img && img.src) {
            let src = img.src;
            if (src.startsWith('//')) src = 'https:' + src;
            return src.split('@')[0];
        }
        return null;
    }

    // 将图片URL转换为Base64 (使用GM_xmlhttpRequest绕过跨域)
    function urlToBase64(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                onload: (response) => {
                    if (response.status === 200) {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(response.response);
                    } else {
                        resolve(null);
                    }
                },
                onerror: (err) => resolve(null)
            });
        });
    }

    // 更新比率和评级
    function updateRatioDisplay() {
        const toolbar = document.querySelector('.video-toolbar-left-main');
        if (!toolbar) return;

        const videoData = getVideoData();
        const displayRatio = calculateScore(videoData);

        const displayText = videoData.viewCount < 1000 ? '播放不足' : `好评：${displayRatio}%`;
        const ratingText = videoData.viewCount < 1000 ? '' : getRating(displayRatio);

        let ratioElement = document.querySelector('.zola-video-like-ratio');
        let ratingElement = document.querySelector('.zola-video-like-rating');

        if (!ratioElement) {
            const { wrapper, item } = createToolbarItem('video-like-ratio', '互动播放比', displayText);
            toolbar.appendChild(wrapper);
            ratioElement = item;
        } else {
            ratioElement.querySelector('.video-like-ratio-info').innerHTML = displayText;
        }

        if (!ratingElement) {
            const { wrapper, item } = createToolbarItem('video-like-rating', '评价', ratingText);
            toolbar.appendChild(wrapper);
            ratingElement = item;
        } else {
            ratingElement.querySelector('.video-like-rating-info').innerHTML = ratingText;
        }

        // 绑定点击事件
        [ratioElement, ratingElement].forEach(element => {
            if (!element.hasAttribute('data-click-bound')) {
                element.addEventListener('click', async (event) => {
                    event.stopPropagation();

                    if (element.getAttribute('data-processing') === 'true') return;
                    element.setAttribute('data-processing', 'true');

                    const loadingTip = document.createElement('div');
                    loadingTip.textContent = '📥 ...';
                    Object.assign(loadingTip.style, {
                        position: 'absolute', left: `${event.pageX}px`, top: `${event.pageY - 30}px`,
                        background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '4px 8px',
                        borderRadius: '4px', zIndex: '10000', fontSize: '12px', pointerEvents: 'none'
                    });
                    document.body.appendChild(loadingTip);

                    try {
                        const currentData = getVideoData();
                        const currentRatio = calculateScore(currentData);
                        const currentText = currentData.viewCount < 1000 ? '播放不足' : `好评：${currentRatio}%`;
                        const plainRating = currentData.viewCount < 1000 ? '' : getPlainRating(currentRatio);
                        const cleanUrl = window.location.href.split('?')[0];
                        const cleanTitle = document.title.replace('_哔哩哔哩_bilibili', '');
                        const coverUrl = getCoverImageUrl();

                        // 修改点：移除 [] 和 【】，使用空格分隔，确保URL被正确识别
                        const textToCopy = `${cleanTitle} ${cleanUrl} 好评率: ${currentText.replace('好评：', '')}  ${plainRating}`;

                        let htmlContent = `<div>${textToCopy}</div>`;

                        if (coverUrl) {
                            const base64Data = await urlToBase64(coverUrl);
                            if (base64Data) {
                                htmlContent += `<img src="${base64Data}" style="max-width: 400px; border-radius: 4px; display: block; margin-top: 5px;" />`;
                            }
                        }

                        const items = {};
                        items['text/plain'] = new Blob([textToCopy], { type: 'text/plain' });
                        items['text/html'] = new Blob([htmlContent], { type: 'text/html' });

                        const clipboardItem = new ClipboardItem(items);
                        await navigator.clipboard.write([clipboardItem]);

                        // 修改点：调用时不传参，恢复默认的随机特效
                        showCopyEffect(event);

                    } catch (err) {
                        console.error('Copy failed', err);
                        // 降级处理
                        navigator.clipboard.writeText(textToCopy);
                        showCopyEffect(event, '仅复制文字');
                    } finally {
                        loadingTip.remove();
                        element.removeAttribute('data-processing');
                    }
                });
                element.setAttribute('data-click-bound', 'true');
            }
        });
    }

    // 初始化
    window.addEventListener('load', () => {
        setTimeout(() => {
            updateRatioDisplay();
            setInterval(updateRatioDisplay, 2000);
        }, 2000);
    });
})();