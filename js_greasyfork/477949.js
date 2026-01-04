// ==UserScript==
// @name         bilibili视频合集倒序
// @namespace    http://tampermonkey.net/
// @version      0.62
// @description  bilibili视频合集增加倒序按钮，点击按钮后，合集支持倒序播放，方便从头开始追剧！
// @author       zyb
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @require https://update.greasyfork.org/scripts/479598/1311136/MyJSCodeLibrary.js
// @downloadURL https://update.greasyfork.org/scripts/477949/bilibili%E8%A7%86%E9%A2%91%E5%90%88%E9%9B%86%E5%80%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/477949/bilibili%E8%A7%86%E9%A2%91%E5%90%88%E9%9B%86%E5%80%92%E5%BA%8F.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // Your code here...

    /**
     * bilibili视频合集倒序，支持倒序播放视频
     */
    class BiliBliVideoCollectionReverse extends MyJSCodeLibrary{

        // 存储视频合集数据
        videoCollectionArr = [[]];
        // 当前正在播放的视频合集的下标
        videoCollectionArrIndex = 0;
        // 下一个播放的视频合集的下标
        nextVideoCollectionArrIndex = null;
        // 当前正在播放的视频下标
        videoIndex = 0;
        // 下一个播放的视频dom
        nextVideoDom = null;
        // 下一个播放的视频下标
        nextVideoIndex = null;

        // bilibili新样式className，方便后续替换
        classNameStrObj = {
            headDomClassName: ".base-video-sections-v1 .video-sections-head .video-sections-head_second-line",
            collectDataDomClassName: ".second-line_left",
            subscriptionCollectionBtnDomClassName: ".second-line_right",
            videoDomClassName: ".bpx-player-video-wrap video",
            videoSectionListClassName: ".video-section-list",
            videoEpisodeCardClassName: ".video-section-list .video-episode-card",
        }

        // 正在播放的合集视频className标识
        PLAYING_VIDEO_CLASSNAME = "video-episode-card__info-playing";

        constructor() {
            super();
            this.init();
        }

        async init() {
            // 存储this指针
            const _this = this;

            // 创建css样式
            const styleText = `
                .base-video-sections-v1 .video-sections-head_second-line .second-line_right {
                    width: 70px;
                    height: 24px;
                    border: 1px solid #00AEEC;
                    border: 1px solid var(--brand_blue);
                    text-align: center;
                    color: #00AEEC;
                    color: var(--brand_blue);
                    border-radius: 2px;
                    background: #F1F2F3;
                    background: var(--bg3);
                    outline: none;
                    cursor: pointer;
                }
            `;
            _this.createStyleFuc(styleText);

            // 异步获取当前正在播放的视频合集区域的顶部dom节点
            const headDom = await _this.getDomByTimeoutAsyncFuc(_this.classNameStrObj.headDomClassName, 3000);
            // 区分普通视频和合集视频
            if (!headDom) {
                console.log("视频不是合集模式");
                return;
            }
            const collectDataDom = headDom.querySelectorAll(_this.classNameStrObj.collectDataDomClassName)[0];
            const subscriptionCollectionBtnDom = headDom.querySelectorAll(_this.classNameStrObj.subscriptionCollectionBtnDomClassName)[0];
            // 创建倒序按钮
            const reverseBtnDom = document.createElement("button");
            reverseBtnDom.innerHTML = "倒序";
            reverseBtnDom.setAttribute("class", _this.classNameStrObj.subscriptionCollectionBtnDomClassName.slice(1));
            reverseBtnDom.onclick = () => {
                // 重置下一个播放的视频的数据
                _this.nextVideoCollectionArrIndex = null;
                _this.nextVideoIndex = null;
                _this.nextVideoDom = null;
                // 将视频合集倒序处理
                _this.reverseVideos();
                // 切换按钮
                reverseBtnDom.innerHTML = ("倒序" === reverseBtnDom.innerHTML) ? "还原" : "倒序";
            };
            // 按顺序插入倒序按钮
            headDom.innerHTML = "";
            headDom.appendChild(collectDataDom);
            headDom.appendChild(reverseBtnDom);
            headDom.appendChild(subscriptionCollectionBtnDom);

            // 异步获取当前正在播放的视频dom节点
            let videoDom = await _this.getDomByTimeoutAsyncFuc(_this.classNameStrObj.videoDomClassName, 3000);

            // 监听视频播放结束事件
            videoDom.addEventListener("ended", function () { //结束
                console.log("播放结束");

                if (!_this.nextVideoDom) {
                    return;
                }
                _this.nextVideoDom.click();
            }, false);

            // 监听视频播放开始事件
            videoDom.addEventListener("play", function () { //开始
                console.log("开始播放");

                // 获取视频合集dom，并转为数组
                const videoSectionsItemArr = Array.from(document.querySelectorAll(_this.classNameStrObj.videoSectionListClassName));
                videoSectionsItemArr.forEach((videoSectionsItem, itemIndex) => {
                    // 获取当前子项下的.video-section-list合集dom节点，并转为数组
                    const list = Array.from(videoSectionsItem.querySelectorAll(_this.classNameStrObj.videoEpisodeCardClassName));

                    list.forEach((dom, index) => {
                        // 判断当前正在播放的视频位置
                        _this.getItemAndVideoIndex(dom, index, itemIndex);
                    })
                })
                // 计算接下来要播放的视频下标
                _this.setNextVideoIndex();
            }, false);
        }

        /**
         * 将视频合集倒序
         */
        async reverseVideos() {
            // 存储this指针
            const _this = this;
            /**
             * 存储在windows中的合集视频数据
             * this.__INITIAL_STATE__.videoData.ugc_season.sections[0].episodes
             */

            // 获取视频合集dom，并转为数组
            let videoSectionsItemArr = Array.from(document.querySelectorAll(_this.classNameStrObj.videoSectionListClassName));

            /**
             * 若videoSectionsItemArr.length大于1
             * 则表明当前合集存在多个子项
             */
            videoSectionsItemArr.forEach((videoSectionsItem, itemIndex) => {
                // 获取当前子项下的.video-section-list合集dom节点，并转为数组
                let list = Array.from(videoSectionsItem.querySelectorAll(_this.classNameStrObj.videoEpisodeCardClassName));
                // 存储倒序处理后的合集视频dom数组
                _this.videoCollectionArr[itemIndex] = list.reverse();
                // 清空子项节点，并插入倒序处理后的视频dom节点
                videoSectionsItem.innerHTML = "";
                _this.videoCollectionArr[itemIndex].forEach((dom, index) => {
                    // 判断当前正在播放的视频位置
                    _this.getItemAndVideoIndex(dom, index, itemIndex);
                    videoSectionsItem.appendChild(dom);
                })
                // 计算接下来要播放的视频下标
                _this.setNextVideoIndex();
            })

        }

        /**
         * 获取当前正在播放的合集子项和视频的下标
         * @param {HTMLBodyElement} dom 视频dom节点
         * @param {number} index 对应的视频合集下标
         * @param {number} itemIndex 合集子项的下标
         */
        getItemAndVideoIndex(dom, index, itemIndex) {
            // 存储this指针
            const _this = this;

            // 判断当前正在播放的视频位置
            if (dom.childNodes[0].className.includes(_this.PLAYING_VIDEO_CLASSNAME)) {
                // 记录当前正在播放的视频合集下标
                _this.videoCollectionArrIndex = itemIndex;
                // 记录当前正在播放的视频下标
                _this.videoIndex = index
            }
        }

        /**
         * 计算接下来要播放的视频下标
         */
        setNextVideoIndex() {
            // 存储this指针
            const _this = this;

            /**
             * 如果下一个播放的视频下标超出当前视频合集子项内的视频数量
             * 则播放下一个合集子项的第一个视频
             * 否则播放当前视频合集子项的下一个视频
             */
            if ((_this.videoIndex + 1) >= _this.videoCollectionArr[_this.videoCollectionArrIndex].length) {

                /**
                 * 如果下一个播放的视频子项下标超出当前视频合集子项的数量
                 * 则停止播放
                 * 否则播放下一个合集子项的第一个视频
                 */
                if (_this.videoCollectionArrIndex + 1 >= _this.videoCollectionArr.length) {
                    _this.nextVideoIndex = 0;
                    _this.nextVideoCollectionArrIndex = 0;
                    _this.nextVideoDom = null;
                } else {
                    _this.nextVideoIndex = 0;
                    _this.nextVideoCollectionArrIndex = _this.videoCollectionArrIndex + 1;
                }
            } else {
                _this.nextVideoIndex = _this.videoIndex + 1;
                _this.nextVideoCollectionArrIndex = _this.videoCollectionArrIndex;
            }

            _this.nextVideoDom = _this.videoCollectionArr[_this.nextVideoCollectionArrIndex][_this.nextVideoIndex];

            console.log("----------setNextVideoIndex-----------");
            console.log("nextVideoDom", _this.nextVideoDom);
            console.log("nextVideoCollectionArrIndex:", _this.nextVideoCollectionArrIndex, ",nextVideoIndex:", _this.nextVideoIndex)
            console.log("----------setNextVideoIndex-----------");
        }
    }

    let biliBliVideoCollectionReverse = new BiliBliVideoCollectionReverse();
})();
