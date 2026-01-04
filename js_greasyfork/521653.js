// ==UserScript==
// @name         腾讯广告互选平台-达人详情页 导入数据
// @namespace    huxuan
// @version      1.3.9
// @description  采集数据
// @author       mtty.qiu
// @match        https://r.ruiplus.cn/api/daren*
// @include      *://huxuan.qq.com/trade/selection/*/finder_trade_detail*
// @icon         https://file.daihuo.qq.com/fe_free_trade/favicon.png
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant GM_addStyle
// @grant GM_listValues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521653/%E8%85%BE%E8%AE%AF%E5%B9%BF%E5%91%8A%E4%BA%92%E9%80%89%E5%B9%B3%E5%8F%B0-%E8%BE%BE%E4%BA%BA%E8%AF%A6%E6%83%85%E9%A1%B5%20%E5%AF%BC%E5%85%A5%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/521653/%E8%85%BE%E8%AE%AF%E5%B9%BF%E5%91%8A%E4%BA%92%E9%80%89%E5%B9%B3%E5%8F%B0-%E8%BE%BE%E4%BA%BA%E8%AF%A6%E6%83%85%E9%A1%B5%20%E5%AF%BC%E5%85%A5%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let appid, nickname, num, a60s, b60s, avatar, cityLabel, authProfession, avgReadCount, avgLikeCount, contactInfo, categoryLevel1, categoryLevel2, medianReadCount, playFinishRate, interactionRate, fansNumGrowthRate, expectedCpm, avgInteractionCount, fansNumIncrement, synopsis, mcnName, tags, identityLevels, finderSex, json, stat;
    let jsa = null, jsb = null;

    // 添加样式
    GM_addStyle(`
        .notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #4CAF50;
            color: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            opacity: 1;
            transition: opacity 0.5s ease-out;
            text-align: center;
            width: 300px;
        }
        .notification.error {
            background-color: #f44336;
        }
        .notification.hide {
            opacity: 0;
        }
    `);

    // 重写XMLHttpRequest的open方法
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (url.includes('finder_publisher/detail')) {
            console.log('POST request URL (XMLHttpRequest):', url);
            this.addEventListener('load', handleDetailResponse);
        } else if (url.includes('finder_publisher/near_videos')) {
            console.log('POST request URL (XMLHttpRequest):', url);
            this.addEventListener('load', handleNearVideosResponse);
        }
        originalOpen.call(this, method, url, ...args);
    };

    function handleDetailResponse() {
        if (this.responseType === '' || this.responseType === 'text') {
            try {
                jsa = JSON.parse(this.responseText);
                extractDetailData(jsa);
                console.log('获取到的 JSON 数据:', jsa);
            } catch (e) {
                console.error('无法解析 JSON 数据:', e);
                showNotification('无法解析 JSON 数据', true);
            }
        }
    }

    function handleNearVideosResponse() {
        if (this.responseType === '' || this.responseType === 'text') {
            try {
                jsb = JSON.parse(this.responseText);
                console.log('获取到的 JSON 数据:', jsb);
                if (jsb.data.near_videos.stat.length > 0) {
                    stat = jsb.data.near_videos.stat;
                }
                edit();
            } catch (e) {
                console.error('无法解析 JSON 数据:', e);
                showNotification('无法解析 JSON 数据', true);
            }
        }
    }

    function extractDetailData(data) {
        appid = data.data.item.appid;
        nickname = data.data.item.nickname;
        num = parseInt(data.data.item.fans_num_level.replace("万+", "").replace("\u003c", ""), 10);
        a60s = data.data.item.short_video_price;
        b60s = data.data.item.long_video_price;
        avatar = data.data.item.avatar;
        cityLabel = data.data.item.city_label;
        authProfession = data.data.item.auth_profession;
        avgReadCount = data.data.item.avg_read_count;
        avgLikeCount = data.data.item.avg_like_count;
        contactInfo = data.data.item.contact_info;
        categoryLevel1 = data.data.item.category_level1;
        categoryLevel2 = data.data.item.category_level2;
        medianReadCount = data.data.item.median_read_count;
        playFinishRate = data.data.item.play_finish_rate;
        interactionRate = data.data.item.interaction_rate;
        fansNumGrowthRate = data.data.item.fans_num_growth_rate;
        expectedCpm = data.data.item.expected_cpm;
        avgInteractionCount = data.data.item.avg_interaction_count;
        fansNumIncrement = data.data.item.fans_num_increment;
        synopsis = data.data.item.synopsis;
        mcnName = data.data.item.mcn_name;
        finderSex = data.data.item.finder_sex;
        identityLevels = data.data.item.identity_level2 ? `${data.data.item.identity_level1},${data.data.item.identity_level2}` : data.data.item.identity_level1;
        tags = data.data.item.tags.toString();
        json = data.data;
    }

    function edit() {
        setTimeout(() => {
            if (nickname) {
                sendRequest('https://r.ruiplus.cn/api/daren/addedit', {
                    appid, num, a60s, b60s, nickname, avatar, city_label: cityLabel, auth_profession: authProfession, avg_read_count: avgReadCount, avg_like_count: avgLikeCount,
                    contact_info: JSON.stringify(contactInfo), category_level1: categoryLevel1, category_level2: categoryLevel2, median_read_count: medianReadCount, play_finish_rate: playFinishRate,
                    interaction_rate: interactionRate, fans_num_growth_rate: fansNumGrowthRate, expected_cpm: expectedCpm, avg_interaction_count: avgInteractionCount, fans_num_increment: fansNumIncrement, synopsis, mcn_name: mcnName,
                    tags, finder_sex: finderSex, identity_levels: identityLevels, json: JSON.stringify(json)
                }, '达人信息写入成功');
            }
        }, 2000);

        setTimeout(() => {
            if (nickname) {
                sendRequest('https://r.ruiplus.cn/api/videos/addvideos', { appid, stat }, '视频信息写入成功');
            }
        }, 3000);
    }

    function sendRequest(url, data, successMessage) {
        GM_xmlhttpRequest({
            method: "post",
            url: url,
            headers: {
                "Content-Type": "application/json",
                "token": "DHowHmtkctK5KAmMLcXmPWycq9HKpzW8PVv5MNb5"
            },
            data: JSON.stringify(data),
            onload: function(response) {
                console.log(response.responseText);
                showNotification(successMessage);
            },
            onerror: function(response) {
                console.error('请求失败:', response);
                showNotification('请求失败', true);
            }
        });
    }

    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.className = `notification ${isError ? 'error' : ''}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 5000); // 显示5秒
    }
})();