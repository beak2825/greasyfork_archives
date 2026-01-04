// ==UserScript==
// @name         BIliBili首页增强
// @namespace    https://www.ordosx.tech/
// @version      1.7
// @description  自用B站首页增强脚本，提供推送卡片净化、倍速悬停预览、预览进度继承、无痕复制链接、搜索净化等功能
// @author       OrdosX
// @license      MIT
// @match        https://www.bilibili.com/
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_setClipboard
// @note         1.7 修复：排除官方继承进度功能干扰
// @note         1.6 重构：完善预览增强逻辑
// @note         1.5 修复：搜索净化未能正常工作
// @note         1.4 更新：添加搜索净化功能，可删除搜索框默认内容与热搜
// @downloadURL https://update.greasyfork.org/scripts/518149/BIliBili%E9%A6%96%E9%A1%B5%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/518149/BIliBili%E9%A6%96%E9%A1%B5%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 悬停预览时的播放倍速
    const PLAYBACK_RATE = 3;

    // 通过正则表达式定义需要屏蔽的UP主关键词
    const BLOCKED_AUTHORS_REGEX = [
        /剪辑/,
        /话题/,
        /记录/,
        /纪录/,
        /兔警长/,
        /混合体主脑/,
        /BB姬/,
        /档案/
    ];

    /**
     * 将视频节点的播放进度绑定到其父锚点元素
     * @param {HTMLVideoElement} node - 视频元素节点
     * @param {HTMLAnchorElement} parent_anchor - 链接节点
     */
    function bind_progress_to_anchor(node, parent_anchor) {
        parent_anchor.dataset.previewDuration = node.duration; // 记录视频总时长
        node.addEventListener('timeupdate', () => {
            // 仅在播放到新位置时更新预览时间，避免循环播放后重置
            if (
                'previewTime' in parent_anchor.dataset &&
                parent_anchor.dataset.previewTime > node.currentTime
            ) return;
            parent_anchor.dataset.previewTime = node.currentTime;
        });
    }

    /**
     * 根据用户的预览时间继承进度到视频链接
     * @param {HTMLAnchorElement} node - 链接节点
     * @param {URL} url - 链接的 URL 对象
     */
    function inherit_preview_progress(node, url) {
        if (
            !('previewTime' in node.dataset) ||
            !('previewDuration' in node.dataset)
        ) return;
        const preview_time = Number(node.dataset.previewTime);
        const preview_duration = Number(node.dataset.previewDuration);
        if (
            // 如果预览时间小于5秒
            preview_time < 5 * PLAYBACK_RATE ||
            // 或者视频时长小于5分钟并且已经看完
            (preview_duration < 299 && preview_time + 3 > preview_duration)
        ) return;

        // 修改 URL 以继承更合理的预览进度
        url.searchParams.delete('t');
        url.searchParams.append('t', Math.floor(preview_time));
        node.href = url.toString();
    }

    /**
     * 提升预览体验，实现预览加速、进度继承功能
     * @param {HTMLVideoElement} node - 视频元素节点
     */
    function setup_preview_enhancement(node) {
        if (!(node instanceof HTMLVideoElement)) return;

        // 等待视频元数据加载完毕再执行操作
        node.addEventListener('loadedmetadata', () => {
            // 包含该视频的父级链接节点
            const parent_anchor = node.closest('a');
            if (!parent_anchor) return;

            node.playbackRate = PLAYBACK_RATE;

            bind_progress_to_anchor(node, parent_anchor);

            parent_anchor.addEventListener('click', () => {
                const url_object = new URL(parent_anchor.href);
                inherit_preview_progress(parent_anchor, url_object);
            });
        });
    }

    /**
     * 删除不需要的推荐卡片
     * @param {HTMLElement} node - 推荐卡片元素节点
     */
    function remove_unwanted_card(node) {
        if (!node.classList) return;
        if (
            // 移除直播卡片
            node.classList.contains('bili-live-card') ||
            // 移除分区卡片
            node.classList.contains('floor-single-card') ||
            // 移除广告卡片
            (node.classList.contains('bili-video-card') && node.querySelector('a')?.href.startsWith('https://cm')) ||
            // 移除没有链接的被屏蔽广告卡片
            (node.classList.contains('bili-video-card') && !node.querySelector('a'))
        ) {
            node.remove();
        }

        // 如果是屏蔽的UP主，移除相关视频卡片
        const authorNode = node.querySelector('.bili-video-card__info--author');
        if (authorNode && BLOCKED_AUTHORS_REGEX.some(regex => regex.test(authorNode.innerText))) {
            node.remove();
        }
    }

    /**
     * 添加"复制链接"按钮到每个视频卡片
     * @param {HTMLElement} node - 视频卡片节点
     */
    function add_copy_link_button(node) {
        // 确保节点是包含 bili-video-card__info--bottom 的视频卡片
        if (!(node.classList && node.classList.contains('bili-video-card'))) return;
        const bottomContainer = node.querySelector('.bili-video-card__info--bottom');
        if (!bottomContainer) return;

        // 创建并设置复制链接按钮的样式和事件
        const copyButton = document.createElement('a');
        copyButton.textContent = '复制链接';
        copyButton.style.position = 'absolute';
        copyButton.style.display = 'flex';
        copyButton.style.right = '0';
        copyButton.href = '#';
        bottomContainer.appendChild(copyButton);

        // 为复制按钮添加点击事件，点击时将链接复制到剪贴板
        copyButton.addEventListener('click', (event) => {
            event.preventDefault();
            const videoLinkElement = bottomContainer.previousElementSibling.querySelector('a');
            if (videoLinkElement) {
                const videoUrl = videoLinkElement.href;
                GM_setClipboard(videoUrl); // 使用 GM_setClipboard 将链接复制到剪贴板
                copyButton.textContent = '已复制';
                setTimeout(() => {
                    copyButton.textContent = '复制链接';
                }, 1000);
            }
        });
    }

    /**
     * 清理搜索框和热门搜索
     */
    function purify_search() {
        // 清空搜索框默认内容
        const searchBox = document.querySelector('.nav-search-input');
        if (searchBox) {
            searchBox.attributes.removeNamedItem('placeholder');
            searchBox.attributes.removeNamedItem('title');
        }

        // 清空热搜
        (new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 查找新添加的节点中是否包含 'trending' 类的元素
                        const trendingElements = node.classList.contains('trending')
                            ? [node]
                            : node.querySelectorAll('.trending');

                        // 删除所有找到的 'trending' 元素
                        trendingElements.forEach(trending => trending.remove());
                    }
                });
            });
        })).observe(document.querySelector('.search-panel'), {
            childList: true,
            subtree: true
        });
    }

    /**
     * 减少页边距，隐藏右下按钮组和“换一换”按钮
     */
    function remove_padding_and_buttons() {
        // 减少主页主容器的左右页边距
        const mainElement = document.querySelector('main.bili-feed4-layout');
        if (mainElement) {
            mainElement.style.padding = '0 20px';
        }

        // 隐藏右下角浮动按钮
        const paletteElement = document.querySelector('.palette-feed4');
        if (paletteElement) {
            paletteElement.style.display = 'none';
        }

        // 隐藏“换一换”按钮
        const switchElement = document.querySelector('.feed-roll-btn');
        if (switchElement) {
            switchElement.style.display = 'none';
        }
    }

    // 页面加载完成后执行的逻辑
    window.addEventListener('load', () => {
        // 处理所有现有的视频卡片，添加"复制链接"按钮
        const videoCards = document.querySelectorAll('.bili-video-card');
        videoCards.forEach(add_copy_link_button);

        purify_search();
        remove_padding_and_buttons();
    });

    // 使用 MutationObserver 监听页面上的节点变化
    (new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // 对新增节点进行处理：设置视频倍速预览、移除不需要的卡片、添加复制链接按钮
                setup_preview_enhancement(node);
                remove_unwanted_card(node);
                add_copy_link_button(node);
            });
        });
    })).observe(document.querySelector('.recommended-container_floor-aside'), {
        childList: true,
        subtree: true
    });
})();
