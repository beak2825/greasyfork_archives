// ==UserScript==
// @name         JavLibrary MissAV 早知道
// @namespace    https://sleazyfork.org/zh-CN/scripts/507734-javlibrary-missav-%E6%97%A9%E7%9F%A5%E9%81%93
// @version      1.1
// @description  针对javlibrary的AVID展示missav的链接，并判断是否已发布，已发布则展示视频预览，需要搭配jav老司机使用
// @match        *://*.javlibrary.com/*
// @grant        GM_xmlhttpRequest
//0.6:增加了对无码的判断
//0.7:增加预览视频，默认无码视频；如果不存在则显示默认有码视频
//0.8:优化展示位置
//0.9:修改missav.ws的链接
//1.0:增加解析无码m3u8链接（暂时找不到可用的播放器
//1.1:优化代码，优化显示，增加有码m3u8、中文字幕m3u8链接
// @downloadURL https://update.greasyfork.org/scripts/507734/JavLibrary%20MissAV%20%E6%97%A9%E7%9F%A5%E9%81%93.user.js
// @updateURL https://update.greasyfork.org/scripts/507734/JavLibrary%20MissAV%20%E6%97%A9%E7%9F%A5%E9%81%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 常量定义
    const MISSAV_BASE_URL = 'https://missav.ws';
    const LINK_TYPES = {
        UNCENSORED: 'uncensored-leak',
        CHINESE: 'chinese-subtitle',
        REGULAR: ''
    };
    const COLORS = {
        UNCENSORED: 'green',
        CHINESE: 'orange',
        REGULAR: 'blue',
        M3U8: 'purple'
    };

    // 工具函数
    function createVideoPlayer(videoSrc) {
        const videoPlayer = document.createElement('video');
        Object.assign(videoPlayer, {
            src: videoSrc,
            autoplay: true,
            loop: true,
            muted: true
        });
        Object.assign(videoPlayer.style, {
            width: '100%',
            maxWidth: '320px'
        });
        return videoPlayer;
    }

    function createLinkElement(text, url, color) {
        const element = document.createElement('div');
        element.textContent = text;
        Object.assign(element.style, {
            color: color,
            wordBreak: 'break-all',
            padding: '8px',
            borderRadius: '4px',
            backgroundColor: 'rgba(0, 0, 0, 0.03)'
        });
        if (url) {
            element.dataset.url = url;
            element.style.cursor = 'pointer';
        }
        return element;
    }

    async function fetchAndProcessM3U8(url, parentElement) {
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: resolve,
                    onerror: reject
                });
            });

            if (response.status !== 200) throw new Error(`HTTP错误: ${response.status}`);

            const evalLine = response.responseText
                .split('\n')
                .find(line => line.trim().startsWith('eval(function('));

            if (!evalLine) throw new Error('未找到eval代码行');

            const decodedResult = new Function('return ' + evalLine.trim())();

            if (typeof decodedResult === 'string' && decodedResult.endsWith('.m3u8')) {
                const m3u8Link = createLinkElement(
                    `M3U8地址: ${decodedResult}`,
                    null,
                    COLORS.M3U8
                );
                m3u8Link.style.wordBreak = 'break-all';
                parentElement.parentNode.insertBefore(m3u8Link, parentElement.nextSibling);
            }
        } catch (error) {
            console.error('处理M3U8地址时出错:', error);
        }
    }

    function buildMissAVUrl(avid, type = '') {
        return `${MISSAV_BASE_URL}/search/${avid}${type ? '-' + type : ''}`;
    }

    function extractLinks(responseText, avid) {
        const patterns = {
            chinese: new RegExp(`<a[^>]*href="(${MISSAV_BASE_URL}/[^"]*${avid}-${LINK_TYPES.CHINESE})"[^>]*>`, 'i'),
            uncensored: new RegExp(`<a[^>]*href="(${MISSAV_BASE_URL}/[^"]*${avid}-${LINK_TYPES.UNCENSORED})"[^>]*>`, 'i'),
            regular: new RegExp(`<a[^>]*href="(${MISSAV_BASE_URL}/(?:[a-z0-9]+/)?${avid})"[^>]*alt="${avid}"[^>]*>`, 'i')
        };

        return {
            chinese: responseText.match(patterns.chinese)?.[1],
            uncensored: responseText.match(patterns.uncensored)?.[1],
            regular: responseText.match(patterns.regular)?.[1]
        };
    }

    async function processVideoLinks(links, missAVLink) {
        // 创建链接容器
        const linksContainer = document.createElement('div');
        linksContainer.style.cssText = 'width: 580px; padding: 15px; margin-top: 10px; border: 1px solid #ddd; background-color: #f9f9f9;';

        // 添加标题
        const titleElement = document.createElement('h2');
        titleElement.textContent = '观看链接:';
        titleElement.style.cssText = 'margin: 0 0 15px 0; font-size: 15px; color: #333;';
        linksContainer.appendChild(titleElement);

        // 创建表格容器
        const tableContainer = document.createElement('div');
        tableContainer.style.cssText = 'display: grid; grid-template-columns: 1fr 2fr 2fr; gap: 10px;';

        // 添加表头
        const headers = ['链接类型', '页面链接', 'M3U8播放链接'];
        headers.forEach(header => {
            const headerCell = document.createElement('div');
            headerCell.textContent = header;
            headerCell.style.cssText = 'font-weight: bold; padding: 8px; background-color: #f0f0f0; border-radius: 4px; text-align: center;';
            tableContainer.appendChild(headerCell);
        });

        // 处理各种类型的链接
        const processLink = async (link, type, color) => {
            if (link) {
                // 添加类型单元格
                const typeCell = document.createElement('div');
                typeCell.textContent = type;
                typeCell.style.cssText = `color: ${color}; padding: 8px; border-radius: 4px; background-color: rgba(0, 0, 0, 0.03);`;
                tableContainer.appendChild(typeCell);

                // 添加页面链接单元格
                const linkCell = document.createElement('a');
                linkCell.textContent = link;
                linkCell.href = link;
                linkCell.target = '_blank';
                linkCell.style.cssText = `color: ${color}; padding: 8px; border-radius: 4px; background-color: rgba(0, 0, 0, 0.03); word-break: break-all; text-decoration: none; display: block;`;
                linkCell.style.cursor = 'pointer';
                tableContainer.appendChild(linkCell);

                // 添加M3U8链接占位符
                const m3u8Cell = document.createElement('div');
                m3u8Cell.style.cssText = 'padding: 8px; border-radius: 4px; background-color: rgba(0, 0, 0, 0.03);';
                tableContainer.appendChild(m3u8Cell);

                // 获取并处理M3U8链接
                try {
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: link,
                            onload: resolve,
                            onerror: reject
                        });
                    });

                    if (response.status === 200) {
                        const evalLine = response.responseText
                            .split('\n')
                            .find(line => line.trim().startsWith('eval(function('));

                        if (evalLine) {
                            const decodedResult = new Function('return ' + evalLine.trim())();
                            if (typeof decodedResult === 'string' && decodedResult.endsWith('.m3u8')) {
                                m3u8Cell.textContent = decodedResult;
                                m3u8Cell.style.color = COLORS.M3U8;
                                m3u8Cell.style.wordBreak = 'break-all';
                            }
                        }
                    }
                } catch (error) {
                    console.error('处理M3U8地址时出错:', error);
                    m3u8Cell.textContent = '获取M3U8地址失败';
                    m3u8Cell.style.color = 'red';
                }
            }
        };

        // 按顺序处理所有类型的链接
        await processLink(links.uncensored, '无码', COLORS.UNCENSORED);
        await processLink(links.regular, '有码', COLORS.REGULAR);
        await processLink(links.chinese, '中文字幕', COLORS.CHINESE);

        linksContainer.appendChild(tableContainer);

        // 插入链接容器到指定位置
        const videoWebplayer = document.querySelector('div#video_webplayer');
        const javwebJump = document.querySelector('div#javweb_jump');
        if (videoWebplayer && javwebJump) {
            videoWebplayer.parentNode.insertBefore(linksContainer, javwebJump);
        }
    }

    async function checkVideoAvailability(avid, missAVLink) {
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: buildMissAVUrl(avid),
                    onload: resolve,
                    onerror: reject
                });
            });

            if (response.status !== 200) throw new Error(`HTTP错误: ${response.status}`);

            const isAvailable = response.responseText.includes("event: 'videoSearch'");
            const links = extractLinks(response.responseText, avid);

            Object.assign(missAVLink.style, {
                backgroundColor: isAvailable ? 'blue' : 'gray',
                color: 'white'
            });

            missAVLink.textContent = `missav: ${avid} ${isAvailable ? '已发布' : '未发布'}`;

            if (isAvailable) {
                if (links.uncensored) missAVLink.textContent += ' 无码已流出';
                await processVideoLinks(links, missAVLink);

                // 查找并添加预览视频
                const videoMatch = response.responseText.match(/<video[^>]*data-src="([^"]*\.mp4)"[^>]*>/i);
                if (videoMatch?.[1]) {
                    const videoPlayer = createVideoPlayer(videoMatch[1]);
                    missAVLink.parentNode.appendChild(videoPlayer);
                }
            }
        } catch (error) {
            console.error('检查视频可用性时出错:', error);
            Object.assign(missAVLink.style, {
                backgroundColor: 'red',
                color: 'white'
            });
            missAVLink.textContent = `missav: ${avid} 链接错误`;
        }
    }

    function displayMissAVLink() {
        const videoWebplayer = document.querySelector('div#video_webplayer');
        if (!videoWebplayer) return;

        const avidElement = document.querySelector('td#avid');
        if (!avidElement) return;

        const avid = avidElement.getAttribute('avid');
        const missAVLink = document.querySelector('a[title="需解封印"]');
        if (!missAVLink) return;

        missAVLink.href = buildMissAVUrl(avid);
        missAVLink.textContent = `${avid} 检查中...`;
        Object.assign(missAVLink.style, {
            color: 'blue',
            textDecoration: 'underline'
        });

        checkVideoAvailability(avid, missAVLink);
    }

    // 等待页面加载完成后执行
    window.addEventListener('load', displayMissAVLink);
})();
