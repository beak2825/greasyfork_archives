// ==UserScript==
// @name         哔哩哔哩换一换反悔药
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       zyb
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488954/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%8D%A2%E4%B8%80%E6%8D%A2%E5%8F%8D%E6%82%94%E8%8D%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/488954/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%8D%A2%E4%B8%80%E6%8D%A2%E5%8F%8D%E6%82%94%E8%8D%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // const getVideoList = async () => {
    //     return new Promise((resolve, reject) => {
    //         return fetch("https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd?web_location=1430650&y_num=5&fresh_type=3&feed_version=V8&fresh_idx_1h=12&fetch_row=1&fresh_idx=25&brush=23&homepage_ver=1&ps=10&last_y_num=5&screen=1626-504", {
    //             "referrer": "https://www.bilibili.com/",
    //             "body": null,
    //             "method": "GET",
    //             "mode": "cors",
    //         }).then((res) => {
    //             return res.json()
    //         }).then((data) => {
    //             console.log(data.item);
    //             resolve(data);
    //         }).catch((error) => {
    //             console.error("Error:", error);
    //             reject(error);
    //         });
    //     })
    // };

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
        }

        // 获取视频卡片dom
        getVideoCardsDom() {
            return document.querySelectorAll('.feed-card') || [];
        }

        // 设置视频卡片dom
        setVideoCardsDom(domlist) {
            const list = [];
            Array.from(this.feedCardDoms).forEach((card, index) => {
                // 复制dom节点，并存储到list中，以便后续再点后悔按钮时可以恢复视频卡片
                const newNode = card.cloneNode(true);
                list.push(newNode);
                card.innerHTML = domlist[index].innerHTML;
            })

            // 记录最新的历史视频卡片列表
            Array.from(this.historyFeedCardDoms).forEach((card, index) => {
                card.innerHTML = list[index].innerHTML;
            })

        }

        // 获取换一换按钮dom
        getVideoRollBtnDom() {
            return document.querySelector('.roll-btn') || [];
        }

        // 创建后悔了按钮
        createGoBackBtn() {
            const _this = this;
            const goBackBtn = document.createElement('button');
            goBackBtn.classList.add('primary-btn');
            goBackBtn.classList.add('roll-btn');
            goBackBtn.style.marginTop = '10px';
            goBackBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="transform: rotate(8640deg);">
                <path d="M8.624933333333333 13.666666666666666C8.624933333333333 14.011849999999999 8.345125 14.291666666666666 7.999933333333333 14.291666666666666C4.525166666666666 14.291666666666666 1.7082933333333332 11.474791666666665 1.7082933333333332 8C1.7082933333333332 6.013308333333333 2.629825 4.2414233333333335 4.066321666666667 3.089385C4.335603333333333 2.8734283333333335 4.728959999999999 2.9166533333333335 4.944915 3.1859349999999997C5.160871666666666 3.4552099999999997 5.1176466666666665 3.848573333333333 4.848366666666666 4.0645283333333335C3.694975 4.98953 2.9582933333333328 6.40852 2.9582933333333328 8C2.9582933333333328 10.784416666666667 5.215528333333333 13.041666666666666 7.999933333333333 13.041666666666666C8.345125 13.041666666666666 8.624933333333333 13.321483333333333 8.624933333333333 13.666666666666666zM11.060475 12.810558333333333C10.844225000000002 12.541558333333331 10.887033333333335 12.148125 11.156041666666667 11.931875C12.306858333333333 11.006775 13.041599999999999 9.589424999999999 13.041599999999999 8C13.041599999999999 5.215561666666666 10.784408333333332 2.958333333333333 7.999933333333333 2.958333333333333C7.6548083333333325 2.958333333333333 7.374933333333333 2.6785083333333333 7.374933333333333 2.333333333333333C7.374933333333333 1.9881533333333332 7.6548083333333325 1.7083333333333333 7.999933333333333 1.7083333333333333C11.474725000000001 1.7083333333333333 14.291599999999999 4.525206666666667 14.291599999999999 8C14.291599999999999 9.984108333333333 13.372483333333332 11.753958333333332 11.939225 12.906125C11.670166666666663 13.122375 11.276725 13.079625 11.060475 12.810558333333333z" fill="currentColor"></path>
                <path d="M1.375 3.4130866666666666C1.375 3.0679066666666666 1.654825 2.7880866666666666 2 2.7880866666666666L4.333333333333333 2.7880866666666666C4.862608333333333 2.7880866666666666 5.291666666666666 3.2171449999999995 5.291666666666666 3.7464199999999996L5.291666666666666 6.079753333333334C5.291666666666666 6.424928333333334 5.011841666666666 6.704736666666666 4.666666666666666 6.704736666666666C4.321491666666667 6.704736666666666 4.041666666666666 6.424928333333334 4.041666666666666 6.079753333333334L4.041666666666666 4.038086666666667L2 4.038086666666667C1.654825 4.038086666666667 1.375 3.7582616666666664 1.375 3.4130866666666666z" fill="currentColor"></path>
                <path d="M14.625 12.5864C14.625 12.931591666666666 14.345183333333333 13.2114 14 13.2114L11.666666666666666 13.2114C11.137408333333335 13.2114 10.708333333333332 12.782383333333332 10.708333333333332 12.253066666666665L10.708333333333332 9.919733333333333C10.708333333333332 9.574608333333334 10.98815 9.294733333333333 11.333333333333332 9.294733333333333C11.678516666666667 9.294733333333333 11.958333333333332 9.574608333333334 11.958333333333332 9.919733333333333L11.958333333333332 11.9614L14 11.9614C14.345183333333333 11.9614 14.625 12.241275000000002 14.625 12.5864z" fill="currentColor"></path>
            </svg>
            <span>后悔了</span>
        `;
            const feedRollBtnBox = document.querySelector('.feed-roll-btn');
            feedRollBtnBox.appendChild(goBackBtn);

            goBackBtn.addEventListener('click', () => {
                console.log('后悔了');
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
                console.error("Error:", error);
            }
        }
    }

    window.onload = function(){
        console.log("DOM 完全加载和解析");
        new RandomVideos();
    }

})();