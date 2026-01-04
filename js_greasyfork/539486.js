// ==UserScript==
// @name         Bangumi 视频链接展开
// @name:en      Bangumi Universal Video Expander
// @namespace    https://github.com/gemini/bangumi-video-embedder
// @version      1.0.4
// @description  通用嗅探 Bangumi 页面的视频链接(支持主流平台)，并在链接下方添加可展开/收起的播放器。
// @description:en  Universally sniffs video links on Bangumi and adds a collapsible player below the link.
// @author       wataame
// @match        *://bgm.tv/*
// @match        *://bangumi.tv/*
// @match        *://chii.in/*
// @license      MIT
// @icon         https://bgm.tv/img/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/539486/Bangumi%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/539486/Bangumi%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        const head = document.head || document.getElementsByTagName('head')[0];
        if (!head) { return; }
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        head.appendChild(style);
    }

    // --- 样式定义 ---
    addGlobalStyle(`
        .bve-wrapper {
            position: relative;
            height: 0;
            overflow: hidden;
            max-width: 100%;
            background: #000;
            margin: 10px 0;
            border-radius: 8px;
        }
        .bve-wrapper-horizontal {
            padding-bottom: 56.25%;
        }
        .bve-wrapper-vertical {
            padding-bottom: 100%;
            max-width: 320px;
            margin-left: auto;
            margin-right: auto;
        }
        .bve-wrapper iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }
        .bve-play-button {
            display: inline-block;
            margin: 0 5px;
            padding: 1px 7px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            line-height: 1.5;
            vertical-align: middle;
            user-select: none;
            transition: background-color 0.2s;
            background-color: #f09199;
            color: #fff;
        }
        .bve-play-button:hover {
            background-color: #e07179;
        }
        .bve-play-button.bve-expanded {
            background-color: #e07179;
        }
        .bve-play-button.bve-expanded:hover {
            background-color: #d16a71;
        }
    `);

    // --- 正则表达式 & 工具函数 ---
    const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
    const BILIBILI_BV_REGEX = /(?:bilibili\.com\/(?:video\/|player\.html\?.*?bvid=))(BV[a-zA-Z0-9_]+)/;
    const BILIBILI_AV_REGEX = /(?:bilibili\.com\/(?:video\/av|player\.html\?.*?aid=))(\d+)/;
    const NICONICO_REGEX = /(?:nicovideo\.jp\/watch\/|nico\.ms\/)((?:[a-z]{2})?\d+)/;
    const ACFUN_REGEX = /(?:acfun\.cn\/v\/)(ac\d+)/;
    const VIMEO_REGEX = /(?:vimeo\.com\/)(\d+)/;
    const TIKTOK_REGEX = /(?:tiktok\.com\/(?:@.+?\/video\/|v\/)|open\.tiktok\.com\/embed\/video\/)(\d+)/;
    const DOUYIN_REGEX = /(?:douyin\.com\/video\/|open\.douyin\.com\/player\/video\?vid=)(\d+)/;

    const isVideoUrl = (url) => url && (
        YOUTUBE_REGEX.test(url) ||
        BILIBILI_BV_REGEX.test(url) ||
        BILIBILI_AV_REGEX.test(url) ||
        NICONICO_REGEX.test(url) ||
        ACFUN_REGEX.test(url) ||
        VIMEO_REGEX.test(url) ||
        TIKTOK_REGEX.test(url) ||
        DOUYIN_REGEX.test(url)
    );

    /**
     * 创建播放器
     */
    function createPlayer(url) {
        let iframeSrc = null;
        let playerType = 'horizontal';

        const ytMatch = url.match(YOUTUBE_REGEX);
        const biliBvMatch = url.match(BILIBILI_BV_REGEX);
        const biliAvMatch = url.match(BILIBILI_AV_REGEX);
        const nicoMatch = url.match(NICONICO_REGEX);
        const acfunMatch = url.match(ACFUN_REGEX);
        const vimeoMatch = url.match(VIMEO_REGEX);
        const tiktokMatch = url.match(TIKTOK_REGEX);
        const douyinMatch = url.match(DOUYIN_REGEX);

        if (ytMatch && ytMatch[1]) {
            iframeSrc = `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&autoplay=1`;
        } else if (biliBvMatch && biliBvMatch[1]) {
            iframeSrc = `//player.bilibili.com/player.html?bvid=${biliBvMatch[1]}&page=1&as_wide=1&high_quality=1&danmaku=0&autoplay=1`;
        } else if (biliAvMatch && biliAvMatch[1]) {
            iframeSrc = `//player.bilibili.com/player.html?aid=${biliAvMatch[1]}&page=1&as_wide=1&high_quality=1&danmaku=0&autoplay=1`;
        } else if (nicoMatch && nicoMatch[1]) {
            iframeSrc = `https://embed.nicovideo.jp/watch/${nicoMatch[1]}?autoplay=1&oldScript=1`;
        } else if (acfunMatch && acfunMatch[1]) {
            iframeSrc = `https://www.acfun.cn/player/${acfunMatch[1]}`;
        } else if (vimeoMatch && vimeoMatch[1]) {
            iframeSrc = `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
        } else if (tiktokMatch && tiktokMatch[1]) {
            iframeSrc = `https://www.tiktok.com/embed/${tiktokMatch[1]}?autoplay=1`;
            playerType = 'vertical';
        } else if (douyinMatch && douyinMatch[1]) {
            iframeSrc = `https://open.douyin.com/player/video?vid=${douyinMatch[1]}&autoplay=1`;
            playerType = 'vertical';
        }

        if (iframeSrc) {
            const wrapper = document.createElement('div');
            wrapper.className = `bve-wrapper bve-wrapper-${playerType}`;
            const iframe = document.createElement('iframe');
            iframe.src = iframeSrc;
            iframe.setAttribute('allow', 'autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'no');
            wrapper.appendChild(iframe);
            return wrapper;
        }
        return null;
    }

    /**
     * 按钮点击事件处理
     */
    function togglePlayer(event) {
        const button = event.currentTarget;
        const currentState = button.dataset.state;
        if (currentState === 'expanded') {
            if (button.playerElement && button.playerElement.parentNode) {
                button.playerElement.remove();
            }
            delete button.playerElement;
            button.dataset.state = 'collapsed';
            button.textContent = '▶ 播放';
            button.classList.remove('bve-expanded');
        } else {
            const player = createPlayer(button.dataset.videoUrl);
            if (player) {
                button.after(player);
                button.playerElement = player;
                button.dataset.state = 'expanded';
                button.textContent = '▲ 收起';
                button.classList.add('bve-expanded');
            }
        }
    }

    /**
     * 核心处理函数
     */
    function processNode(node) {
        if (node.nodeType !== Node.ELEMENT_NODE || node.closest('.bve-wrapper, .bve-play-button')) {
            return;
        }
        const links = node.querySelectorAll('a:not(.bve-processed)');
        links.forEach(link => {
            link.classList.add('bve-processed');
            let urlToProcess = null;
            if (isVideoUrl(link.href)) {
                urlToProcess = link.href;
            } else {
                const text = link.textContent || '';
                const urlRegex = /https?:\/\/[^\s"'<>`]+/g;
                const urlsInText = text.match(urlRegex) || [];
                for (const url of urlsInText) {
                    if (isVideoUrl(url)) {
                        urlToProcess = url;
                        break;
                    }
                }
            }
            if (urlToProcess) {
                const button = document.createElement('span');
                button.className = 'bve-play-button';
                button.textContent = '▶ 播放';
                button.dataset.videoUrl = urlToProcess;
                button.dataset.state = 'collapsed';
                button.addEventListener('click', togglePlayer);
                link.after(button);
            }
        });
    }

    // --- 主执行逻辑 ---
    processNode(document.body);
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                processNode(node);
            });
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();