// ==UserScript==
// @name         B站直播自动点赞
// @version      0.3
// @description  B站直播自动点赞脚本
// @namespace    http://tampermonkey.net/
// @author       Jeffz615
// @match        *://live.bilibili.com/*
// @sandbox      none
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510758/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/510758/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectCode() {
        if (!/^https?:\/\/live\.bilibili\.com\/\d+\??.*/.test(document.URL)) {
            return;
        }
        let intervalNum = -1;
        let click_time = 0;
        let like_cnt = '';
        let cnt_same = 0;

        // 创建按钮元素
        const button = document.createElement('button');
        button.innerText = '开启自动点赞'; // 按钮文本
        button.style.position = 'fixed'; // 固定位置
        button.style.bottom = '20px'; // 距离底部20px
        button.style.right = '20px'; // 距离右侧20px
        button.style.zIndex = '1000'; // 确保按钮在最上层
        const url = "https://api.live.bilibili.com/xlive/app-ucenter/v1/like_info_v3/like/likeReportV3";

        // 清理超过一天的localStorage
        const EXPECT_TIME = 24 * 60 * 60 * 1000;
        const LocalStorageKeys = Object.keys(localStorage).filter((x)=>{return x.startsWith('script_auto_like_save_')});
        for (let key of LocalStorageKeys) {
            try {
                const live_time = JSON.parse(localStorage.getItem(key)).live_time || 0;
                if (new Date().getTime() - live_time * 1000 >= EXPECT_TIME) {
                    localStorage.removeItem(key);
                }
            } catch (err) {
                console.error(err.message);
                localStorage.removeItem(key);
            }
        }

        // 添加按钮点击事件
        button.addEventListener('click', () => {
            like_cnt = '';
            cnt_same = 0;
            // 个人信息
            const cookies = document.cookie.split(';');
            const csrf = cookies.filter((x)=>{return x.trim().startsWith('bili_jct')})[0].split('=')[1];
            const uid = window.BilibiliLive.UID;
            // 房间信息
            const room_id = window.BilibiliLive.ROOMID;
            const anchor_id = window.BilibiliLive.ANCHOR_UID;
            if (!(csrf && uid && room_id && anchor_id)) {
                return;
            }
            let local_save = JSON.parse(localStorage.getItem('script_auto_like_save_' + room_id)) || {};

            if (intervalNum === -1) {
                const live_time = window.__NEPTUNE_IS_MY_WAIFU__.roomInitRes.data.live_time;
                if (local_save.live_time !== live_time || !local_save.local_cnt) {
                    local_save.live_time = live_time;
                    local_save.local_cnt = 0;
                }

                // 循环点赞
                intervalNum = setInterval(() => {
                    if (local_save.local_cnt >= 1000) {
                        clearInterval(intervalNum);
                        intervalNum = -1;
                        button.innerText = `开启自动点赞(${local_save.local_cnt || 0})`;
                        console.warn('点赞已满，关闭自动点赞');
                        return;
                    }
                    const now_like = document.getElementsByClassName('like-text')[0].innerText;
                    if (now_like === like_cnt) {
                        cnt_same = cnt_same + 1;
                        if (cnt_same >= 3) {
                            clearInterval(intervalNum);
                            intervalNum = -1;
                            button.innerText = `开启自动点赞(${local_save.local_cnt || 0})`;
                            console.warn('点赞已满，关闭自动点赞');
                            return;
                        }
                    } else {
                        cnt_same = 0;
                        like_cnt = now_like;
                    }
                    click_time = 15 + Math.floor(Math.random() * 10) - 5;
                    const bodyStr = `click_time=${click_time}&room_id=${room_id}&uid=${uid}&anchor_id=${anchor_id}&csrf_token=${csrf}&csrf=${csrf}&visit_id=`;
                    console.log(bodyStr);
                    fetch(url, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: bodyStr
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);
                        local_save.local_cnt += click_time;
                        localStorage.setItem('script_auto_like_save_' + room_id, JSON.stringify(local_save));
                        button.innerText = `关闭自动点赞(${local_save.local_cnt || 0})`;
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
                }, 6000);
                console.warn('已开启自动点赞');
                button.innerText = `关闭自动点赞(${local_save.local_cnt || 0})`;
            } else {
                clearInterval(intervalNum);
                intervalNum = -1;
                button.innerText = `开启自动点赞(${local_save.local_cnt || 0})`;
                console.warn('已关闭自动点赞');
            }
        });

        // 将按钮添加到页面
        document.body.appendChild(button);
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = `
        ${injectCode.toString()}
        injectCode();
    `;
    document.body.appendChild(script);
})();
