// ==UserScript==
// @name         🛠️屏蔽B站营销视频
// @name:zh-CN   🛠️屏蔽B站营销视频
// @name:zh-TW   🛠️屏蔽B站营销视频
// @name:en      🛠️Block Bilibili's marketing videos
// @namespace    https://greasyfork.org/scripts/467384
// @version      1.2
// @description  屏蔽部分B站（bilibili）主页推荐的视频卡片，屏蔽up主粉丝少于一定数量的，屏蔽直播与右侧推广，屏蔽带广告标签的
// @description:zh-CN  屏蔽部分B站（bilibili）主页推荐的视频卡片，屏蔽up主粉丝少于一定数量的，屏蔽直播与右侧推广，屏蔽带广告标签的
// @description:zh-TW  遮罩部分B站（bilibili）主頁推薦的視頻卡片，遮罩up主粉絲少於一定數量的，遮罩直播與右側推廣，遮罩帶廣告標籤的
// @description:en     Block some video cards recommended on the homepage of Bilibili. The rules are to block those from creators with a certain number of small fans, block live streams and right-hand promotion, and block those with advertising tags.
// @author       anonymous
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?spm_id_from=*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/467384/%F0%9F%9B%A0%EF%B8%8F%E5%B1%8F%E8%94%BDB%E7%AB%99%E8%90%A5%E9%94%80%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/467384/%F0%9F%9B%A0%EF%B8%8F%E5%B1%8F%E8%94%BDB%E7%AB%99%E8%90%A5%E9%94%80%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 定义需要屏蔽的两种视频卡片类名
    const BLOCKED_CLASSES = ['floor-single-card', 'bili-live-card is-rcmd'];
    // 定义需要屏蔽的最小的follower数
    const MIN_FOLLOWER = 10000;
    // 定义接口前缀
    const API_USERDATA = 'https://api.bilibili.com/x/relation/stat?vmid=';

    // 定义已处理卡片数量
    let processedCards = 0;
    // 防止多次调用blockCards
    let isBlockCardsRunning = false;


    function getUid(card) {
        // 传入一个视频卡片，获取其中的uid并转化为数字并返回

        const ownerLink = card.querySelector('.bili-video-card__info--owner');
        if (ownerLink) {
            const uid = ownerLink.href.split('/').pop();

            if (uid.match(/^\d+$/)) {
                return Number(uid);
                // return uid;
            } else {
                console.error(`getUid error, processedCards: ${processedCards}, uid: ${uid}`);
                return -1;
            }
        }

        console.error(`getUid error, ownerLink error, processedCards: ${processedCards}, ownerLink: ${ownerLink}`);
        return -1;
    }


    async function getFollower(uid) {
        // 传入uid，返回follower数
        const response = await fetch(`${API_USERDATA}${uid}`);
        const data = await response.json();
        if (data.code === 0) {
            return data.data.follower;
        } else {
            console.error(`getFollower error, uid: ${uid}, message: ${data.message}`);
            return -1;
        }
    }


    // 通过BLOCKED_CLASSES和MIN_FOLLOWER确定要屏蔽的视频卡片
    // 首先获取所有视频卡片，然后从processedCards开始遍历，直到遍历完成
    // 遍历过程中，如果是BLOCKED_CLASSES中的类名，就直接remove并continue
    // 如果不是，就获取uid，然后获取follower，如果follower小于MIN_FOLLOWER，就remove
    // 未能获取到uid或者follower的，也remove
    // 不满足上面需要remove的，就processedCards++
    async function blockCards() {

        if (isBlockCardsRunning) {
            return;
        }
        isBlockCardsRunning = true;

        const cards = document.querySelectorAll('.bili-video-card.is-rcmd, .floor-single-card, .bili-live-card.is-rcmd');
        for (let i = processedCards; i < cards.length; i++) {
            const card = cards[i];
            if (BLOCKED_CLASSES.includes(card.className)) {
                card.remove();
                continue;
            }

            // 获取uid，如果获取失败，就remove
            const uid = getUid(card);
            if (uid === -1) {
                console.error(`remove because getUid error, uid: ${uid}`);
                card.remove();
                continue;
            }

            // 如果follower小于MIN_FOLLOWER，就remove
            const follower = await getFollower(uid);
            if (follower < MIN_FOLLOWER) {
                card.remove();
                continue;
            }

            processedCards++;
        }
        isBlockCardsRunning = false;
    }


    // 节流函数，防止过于频繁的调用
    function throttle(fn, delay) {
        let timer = null;
        return function() {
            if (timer) {
                return;
            }
            timer = setTimeout(() => {
                fn.apply(this, arguments);
                timer = null;
            }, delay);
        };
    }


    window.addEventListener('scroll', throttle(blockCards, 400));

})();