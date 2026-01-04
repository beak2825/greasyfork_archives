// ==UserScript==
// @name         抖音直播间人数显示
// @namespace    https://www.phpnbw.com/
// @version      1.9.5
// @description  抖音直播超过10万怎么看人数 抖音怎么看10万以上在线人数 抖音直播间10万+怎么看具体人数 抖音直播间人数显示 抖音在线人数实时数据版本，显示人数的抖音版本，显示在线人数的抖音版本 显示抖音直播间实时观看人数 抖音直播粉丝统计平台 怎么查看抖音直播间人数 抖音直播粉丝 如何查看直播间的粉丝人数 如何查看主播直播数据记录 抖音直播 抖音直播间10万+显示 抖音直播间十万加显示 抖音直播间人数显示
// @author       phpnbw
// @match        https://live.douyin.com/*
// @match        https://www.douyin.com/*
// @exclude      https://www.douyin.com/channel*
// @grant        GM_xmlhttpRequest
// @license      Copyright phpnbw
// @connect      dyapi.phpnbw.com
// @downloadURL https://update.greasyfork.org/scripts/520050/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E9%97%B4%E4%BA%BA%E6%95%B0%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/520050/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E9%97%B4%E4%BA%BA%E6%95%B0%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 缓存 webcastId
    let cachedWebcastId = null;
    let cachedUrl = null;

    function getWebcastId() {
        const currentUrl = window.location.href;

        // 如果URL没有变化且已有缓存的webcastId，直接返回缓存值
        if (currentUrl === cachedUrl && cachedWebcastId !== null) {
            // console.log('使用缓存的直播间ID:', cachedWebcastId);
            return cachedWebcastId;
        }

        // 更新当前URL
        cachedUrl = currentUrl;

        // 如果是主页面，直接返回null
        if (currentUrl === 'https://live.douyin.com/' || currentUrl === 'https://live.douyin.com' || currentUrl ==='https://www.douyin.com/follow' || currentUrl === 'https://www.douyin.com/jingxuan' || currentUrl === 'https://live.douyin.com/?from_nav=1' ||
            currentUrl === 'https://www.douyin.com/follow/live' || currentUrl ==='https://www.douyin.com/discover' || currentUrl==='https://www.douyin.com/vs'|| currentUrl ==='https://www.douyin.com/aisearch' ||
            currentUrl==='https://www.douyin.com/series' || currentUrl==='https://www.douyin.com/recommend=1' ||
            currentUrl.startsWith('https://live.douyin.com/falcon/webcast_douyin')) {
            // console.log('当前是直播主页面，不显示观看人数');
            cachedWebcastId = null;
            return null;
        }

        // 尝试匹配三种格式的URL
        // 格式1: https://live.douyin.com/613217711064
        // 格式2: https://live.douyin.com/613217711064?from_tab_name=main
        // 格式3: https://www.douyin.com/follow/live/574023227986
        const match = currentUrl.match(/\/([a-zA-Z0-9]+)(?:\?|$)/) || currentUrl.match(/\/live\/([a-zA-Z0-9]+)(?:\?|$)/);

        if (match) {
            if (match[1]==='self' || match[1]==='friend' || match[1]==='discover' || match[1]==='jingxuan' || match[1]==='aisearch' || match[1]==='follow' || match[1]==='series' || match[1]==='vs'){
                cachedWebcastId = null;
            }else{
                if(match[1].length>15){
                    cachedWebcastId = null;
                }else{
                    // console.log('找到直播间ID:', match[1]);
                    cachedWebcastId = match[1];
                    return cachedWebcastId;
                }

            }

        }

        // console.log('未找到直播间ID');
        cachedWebcastId = null;
        return null;
    }

    async function fetchViewerCount() {
        const webcastId = getWebcastId();
        if (!webcastId) {
            throw new Error('未找到直播间ID');
        }

        //console.log("当前开始请求");

        // 当前时间戳（毫秒）
        const ts = Date.now();

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://dyapi.phpnbw.com/get_live_room_num?webcast_id=${webcastId}&version=194&platform=tampermonkey&ts=${ts}`,
                timeout: 5000,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        //console.log(
                         //   '当前API:',
                         //   `https://dyapi.phpnbw.com/get_live_room_num?webcast_id=${webcastId}&version=195&platform=tampermonkey&ts=${ts}`);
                    //console.log('当前API Response:', data);

                    const viewerCount =
                          data?.data?.data?.data?.[0]?.room_view_stats?.display_value || '未知';

                    console.log('=:', viewerCount);
                    resolve(viewerCount);
                } catch (error) {
                    console.error('解析数据失败:', error);
                    reject(error);
                }
            },
            onerror: function(error) {
                console.error('请求失败:', error);
                reject(error);
            },
            ontimeout: function() {
                reject(new Error('请求超时'));
            }
        });
    });
    }


    function showViewerCount(count) {
        // 移除旧的显示元素（如果存在）
        const oldDisplay = document.getElementById('viewer-count-display');
        if (oldDisplay) {
            oldDisplay.remove();
        }

        // 创建显示元素，改用 a 标签
        const display = document.createElement('a');
        display.id = 'viewer-count-display';

        // 设置链接地址
        const webcastId = getWebcastId();
        display.href = `https://douyin.phpnbw.com/?id=${webcastId}`;

        // 添加悬浮提示
        display.title = '点击查看详细观看数据统计';

        // 添加新的样式
        display.style.cssText = `
            display: inline-block;
            background-color: rgba(0, 0, 0, 0.7);
            color: red;
            padding: 3px 2px;
            border-radius: 5px;
            font-size: 16px;
            z-index: 9999;
            text-decoration: none;
            cursor: pointer;
        `;

        if (count !== '未知' && count !== '获取失败') {
            display.textContent = `观看人数: ${count}`;
        }

        // 添加鼠标悬停效果
        display.addEventListener('mouseover', () => {
            display.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            display.style.color = '#ff4444';
        });

        display.addEventListener('mouseout', () => {
            display.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            display.style.color = 'red';
        });

        // 打开新标签页
        display.target = '_blank';

        // 剩余的定位代码保持不变
        const xpath = "/html/body/div[2]/div[2]/div/main/div[2]/div/div/div/pace-island/div/div/div[1]/div[1]";
        const targetElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (targetElement) {
            targetElement.style.position = 'relative';
            display.style.marginLeft = '10px';
            targetElement.appendChild(display);
        } else {
            display.style.position = 'fixed';
            display.style.top = '75px';
            display.style.right = '50px';
            document.body.appendChild(display);
        }
    }

    async function updateViewerCount() {
        try {
            const count = await fetchViewerCount();
            showViewerCount(count);
        } catch (error) {
            console.error('获取观看人数失败:', error);
            // 获取失败时移除显示元素
            const display = document.getElementById('viewer-count-display');
            if (display) {
                display.remove();
            }
        }
    }

    function init() {
        const url = window.location.href;
        // console.log('当前URL====================================:', url);
        // console.log('====================================');
        // 如果是主页面，直接返回，不执行任何操作
        if (url === 'https://live.douyin.com/' || url === 'https://live.douyin.com' || url ==='https://www.douyin.com/follow' || url ==='https://www.douyin.com/aisearch' || url === 'https://www.douyin.com/jingxuan' ||
            url === 'https://www.douyin.com/follow/live' || url === 'https://www.douyin.com/discover' || url === 'https://www.douyin.com/vs'|| url === 'https://live.douyin.com/?from_nav=1' ||
            url==='https://www.douyin.com/series' || url==='https://www.douyin.com/recommend=1' ||
            url.startsWith('https://live.douyin.com/falcon/webcast_douyin')) {
            // console.log('当前是直播主页面，不显示观看人数1');
            return;
        }

        // 清除可能存在的旧定时器
        if (window.viewerCountTimer) {
            clearInterval(window.viewerCountTimer);
        }

        // 设置新的定时器并保存引用
        // console.log('开始初始化直播间观看人数显示');
        window.viewerCountTimer = setInterval(updateViewerCount, 7000);

        // 立即执行一次更新
        updateViewerCount();
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // URL 变化监听
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('URL changed, reinitializing...');
            init();
        }
    }).observe(document, {subtree: true, childList: true});
})();