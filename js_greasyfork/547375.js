
// ==UserScript==
// @name         B站收藏夹视频时长统计
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  交互式统计B站收藏夹内所有视频的总时长
// @author       吊打洛杉矶柠檬
// @match        https://www.bilibili.com/medialist/detail/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/547375/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/547375/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function getFavListDuration() {
        // 交互式获取收藏夹ID
        const mediaId = prompt('请输入B站收藏夹ID（在收藏夹页面URL中的数字）:', '');
        if (!mediaId) return;

        // 交互式获取SESSDATA
        const SESSDATA = prompt('请输入您的SESSDATA（从浏览器Cookie中获取）:', '');
        if (!SESSDATA) return;

        const pageSize = 20;
        let totalSeconds = 0;
        let videoCount = 0;
        let currentPage = 1;
        let hasMore = true;

        try {
            while (hasMore) {
                const data = await fetchFavList(mediaId, SESSDATA, currentPage, pageSize);
                
                data.medias.forEach(item => {
                    if (item.duration) {
                        totalSeconds += item.duration;
                        videoCount++;
                    }
                });

                hasMore = data.has_more && data.medias.length === pageSize;
                currentPage++;

                if (currentPage > 50) {
                    console.warn('已达到最大分页限制(50页)');
                    break;
                }
            }

            showResult(totalSeconds, videoCount);
        } catch (error) {
            GM_notification({
                title: '统计失败',
                text: error.message,
                timeout: 5000
            });
            console.error('统计错误:', error);
        }
    }

    async function fetchFavList(mediaId, SESSDATA, page, pageSize) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${mediaId}&pn=${page}&ps=${pageSize}`,
                headers: {
                    'Cookie': `SESSDATA=${encodeURIComponent(SESSDATA)}`,
                    'Referer': 'https://www.bilibili.com/'
                },
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    if (data.code !== 0) {
                        reject(new Error(data.message || 'API请求失败'));
                        return;
                    }
                    if (!data.data || !data.data.medias) {
                        reject(new Error('无效的API响应结构'));
                        return;
                    }
                    resolve(data.data);
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }

    function showResult(totalSeconds, videoCount) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const message = `共 ${videoCount} 个视频\n总时长: ${hours}小时 ${minutes}分钟 ${seconds}秒`;
        
        GM_notification({
            title: '统计完成',
            text: message,
            timeout: 8000
        });

        alert(message);
        console.log('统计结果:', message);
    }

    // 添加界面按钮
    function addUIButton() {
        const btn = document.createElement('button');
        btn.textContent = '统计收藏时长';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = '#fb7299';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

        btn.addEventListener('click', getFavListDuration);
        document.body.appendChild(btn);
    }

    // 页面加载完成后添加按钮
    window.addEventListener('load', addUIButton);
})();
