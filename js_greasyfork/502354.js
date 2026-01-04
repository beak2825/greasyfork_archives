// ==UserScript==
// @name         哔哩哔哩换一换反悔药（改）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  哔哩哔哩点击换一换后可以换回来
// @author       coccvo
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?spm_id_from*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502354/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%8D%A2%E4%B8%80%E6%8D%A2%E5%8F%8D%E6%82%94%E8%8D%AF%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/502354/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%8D%A2%E4%B8%80%E6%8D%A2%E5%8F%8D%E6%82%94%E8%8D%AF%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class RandomVideos {
        feedCardDoms = [];
        historyFeedCardDoms = [];
        videoList = [];
        rollBtn = undefined;
        timeId = undefined;

        constructor() {
            this.init();
        }

        // 初始化
        init() {
            this.createGoBackBtn();
            this.getVideoList().then(() => {
                this.feedCardDoms = this.getVideoCardsDom();
                this.historyFeedCardDoms = this.feedCardDoms;
                this.rollBtn = this.getVideoRollBtnDom();

                this.rollBtn.addEventListener('click', () => {
                    if (this.timeId) {
                        clearTimeout(this.timeId);
                    }
                    this.timeId = setTimeout(() => {
                        this.historyFeedCardDoms = this.feedCardDoms;
                        this.feedCardDoms = this.getVideoCardsDom();
                    }, 500);
                });
            }).catch(error => {
                console.error("Failed to fetch video list:", error);
            });
        }

        // 获取视频卡片dom
        getVideoCardsDom() {
            return document.querySelectorAll('.feed-card') || [];
        }

        // 设置视频卡片dom
        setVideoCardsDom(domlist) {
            const list = [];
            Array.from(this.feedCardDoms).forEach((card, index) => {
                const newNode = card.cloneNode(true);
                list.push(newNode);
                card.innerHTML = domlist[index].innerHTML;
            });

            Array.from(this.historyFeedCardDoms).forEach((card, index) => {
                card.innerHTML = list[index].innerHTML;
            });
        }

        // 获取换一换按钮dom
        getVideoRollBtnDom() {
            return document.querySelector('.roll-btn') || [];
        }

        // 创建换回来按钮
        createGoBackBtn() {
            const _this = this;
            const goBackBtn = document.createElement('button');
            goBackBtn.classList.add('primary-btn');
            goBackBtn.classList.add('roll-btn');
            goBackBtn.style.marginTop = '10px';
            goBackBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="transform: rotate(8640deg);">
                    <path d="M8.625 13.6667C8.625 14.0118 8.34513 14.2917 8 14.2917C4.52517 14.2917 1.70829 11.4748 1.70829 8C1.70829 6.01331 2.62983 4.24142 4.06632 3.08939C4.3356 2.87343 4.72896 2.91665 4.94492 3.18593C5.16087 3.45521 5.11765 3.84857 4.84837 4.06453C3.69498 4.98953 2.95829 6.40852 2.95829 8C2.95829 10.7844 5.21553 13.0417 8 13.0417C8.34513 13.0417 8.625 13.3215 8.625 13.6667ZM11.0605 12.8106C10.8442 12.5416 10.887 12.1481 11.156 11.9319C12.3069 11.0068 13.0416 9.58942 13.0416 8C13.0416 5.21556 10.7844 2.95833 8 2.95833C7.65481 2.95833 7.37493 2.67851 7.37493 2.33333C7.37493 1.98815 7.65481 1.70833 8 1.70833C11.4747 1.70833 14.2916 4.52521 14.2916 8C14.2916 9.98411 13.3725 11.754 11.9392 12.9061C11.6702 13.1224 11.2767 13.0796 11.0605 12.8106Z" fill="currentColor"/>
                    <path d="M1.375 3.41309C1.375 3.06791 1.65483 2.78809 2 2.78809L4.33333 2.78809C4.86261 2.78809 5.29167 3.21714 5.29167 3.74642L5.29167 6.07975C5.29167 6.42493 5.01184 6.70474 4.66667 6.70474C4.32149 6.70474 4.04167 6.42493 4.04167 6.07975L4.04167 4.03809L2 4.03809C1.65483 4.03809 1.375 3.75826 1.375 3.41309Z" fill="currentColor"/>
                    <path d="M14.625 12.5864C14.625 12.9316 14.3452 13.2114 14 13.2114L11.6667 13.2114C11.1374 13.2114 10.7083 12.7824 10.7083 12.2531L10.7083 9.91973C10.7083 9.57461 10.9882 9.29473 11.3333 9.29473C11.6785 9.29473 11.9583 9.57461 11.9583 9.91973L11.9583 11.9614L14 11.9614C14.3452 11.9614 14.625 12.2413 14.625 12.5864Z" fill="currentColor"/>
                </svg>
                <span>换回来</span>
            `;
            const feedRollBtnBox = document.querySelector('.feed-roll-btn');
            feedRollBtnBox.appendChild(goBackBtn);

            goBackBtn.addEventListener('click', () => {
                console.log('换回来');
                _this.setVideoCardsDom(_this.historyFeedCardDoms);
            });
        }

        // 随机获取视频列表
        async getVideoList() {
            try {
                const res = await fetch("https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd?web_location=1430650&y_num=5&fresh_type=3&feed_version=V8&fresh_idx_1h=12&fetch_row=1&fresh_idx=25&brush=23&homepage_ver=1&ps=10&last_y_num=5&screen=1626-504", {
                    "referrer": "https://www.bilibili.com/",
                    "body": null,
                    "method": "GET",
                    "mode": "cors",
                });

                const data = await res.json();
                console.log(data.item);
                this.videoList = data.item;
            } catch (error) {
                console.error("Error fetching video list:", error);
                throw error;
            }
        }
    }

    // 直接执行脚本
    new RandomVideos();

})();