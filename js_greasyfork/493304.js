// ==UserScript==
// @name         b站 动态页添加稍后再看
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  动态页切换up并选择视频添加到稍后再看
// @author       WindOfCast
// @match        *://t.bilibili.com/*
// @icon         data:image/png;base64,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
// @grant        GM_notification
// @homepage     https://gitee.com/windofcast/
// @website      https://space.bilibili.com/367207503
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/493304/b%E7%AB%99%20%E5%8A%A8%E6%80%81%E9%A1%B5%E6%B7%BB%E5%8A%A0%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/493304/b%E7%AB%99%20%E5%8A%A8%E6%80%81%E9%A1%B5%E6%B7%BB%E5%8A%A0%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const common = (function () {
        class Common {
            #currentIconIndex;
            #currentVideoIndex;
            #previousVideoIndex;
            #upIconList;
            #dynList;
            #dynVideoList;
            #border = "1px solid #033eff";
            #upIconListPrevBtn;
            #upIconListNextBtn;
            #mainWidth;
            #upIconWidth;
            #pageIndex;

            constructor() {
                this.#currentIconIndex = -1;
                this.#currentVideoIndex = -1;
                this.#previousVideoIndex = -1;
                this.#upIconList = undefined;
                this.#dynList = [];
                this.#dynVideoList = [];
                this.#pageIndex = 0;
            }

            notification(messageObj) {
                GM_notification({
                    title: messageObj.title, text: messageObj.message, timeout: messageObj.timeout || 3000,
                });
            }

            backTop() {
                let backTop = document.querySelector('.back-top');
                if (backTop) {
                    backTop.click();
                }
            }

            pageJump(direction) {
                let index = direction ? this.#currentIconIndex + 1 : this.#currentIconIndex;
                if (index === 0) {
                    return;
                }
                let volume = index * this.#upIconWidth;
                let nextPage = volume / this.#mainWidth;
                console.info(volume, nextPage, this.#pageIndex)
                if (this.#pageIndex === Math.floor(nextPage)) {
                    return;
                }
                if (nextPage > this.#pageIndex && Math.ceil(nextPage) > this.#pageIndex) {
                    this.#upIconListNextBtn.click();
                    this.#pageIndex++;
                } else if (nextPage < this.#pageIndex && Math.floor(nextPage) < this.#pageIndex) {
                    this.#upIconListPrevBtn.click();
                    this.#pageIndex--;
                }
            }

            getItemWidthByAttributes(element, ...attributes) {
                let style = window.getComputedStyle(element);
                return attributes.reduce((acc, attr) => acc + parseInt(style[attr]), 0);
            }

            moveUpIcon(code) {
                let direction = false;
                if (code === "ArrowRight") {
                    direction = true;
                } else if (code !== "ArrowLeft") {
                    return;
                }
                if (direction && this.#currentIconIndex < this.#upIconList.length - 1) {
                    this.#upIconList[++this.#currentIconIndex].click()
                } else if (!direction && this.#currentIconIndex > 0) {
                    this.#upIconList[--this.#currentIconIndex].click()
                }
                this.pageJump(direction)
                this.backTop();
            }

            moveUpVideo(code) {
                let direction = false;
                if (code === "ArrowDown") {
                    direction = true;
                } else if (code !== "ArrowUp") {
                    return;
                }
                if (this.#dynVideoList.length === 0) {
                    this.notification({
                        title: '提示', message: 'UP最近没有更新视频'
                    })
                    return;
                }
                if (this.#currentVideoIndex === -1 && this.#previousVideoIndex === -1) {
                    this.#currentVideoIndex = 0;
                    this.border(this.#currentVideoIndex, this.#previousVideoIndex);
                    return;
                }
                this.#previousVideoIndex = this.#currentVideoIndex;
                let loadMoreVideo = false;
                if (direction && this.#currentVideoIndex + 1 > this.#dynVideoList.length - 1) {
                    this.loadVideoList(false, 100);
                    loadMoreVideo = true;
                }
                setTimeout(() => {
                    if (direction && this.#currentVideoIndex < this.#dynVideoList.length - 1) {
                        this.#currentVideoIndex++;
                        this.border(this.#currentVideoIndex, this.#previousVideoIndex);
                    } else if (!direction && this.#currentVideoIndex > 0) {
                        this.#currentVideoIndex--;
                        this.border(this.#currentVideoIndex, this.#previousVideoIndex);
                    } else if (!direction && this.#currentVideoIndex === 0) {
                        this.backTop();
                        this.#currentVideoIndex--;
                        this.border(this.#currentVideoIndex, this.#previousVideoIndex);
                    }
                }, loadMoreVideo ? 200 : 0);
            }

            addMark() {
                if (this.#currentVideoIndex === -1) {
                    return;
                }
                let dynVideoItem = this.#dynList[this.#dynVideoList[this.#currentVideoIndex]];
                let markItem = dynVideoItem.querySelector('.bili-dyn-card-video__mark');
                let messageObj = {
                    title: '提示', message: undefined
                };
                let title = dynVideoItem.querySelector('.bili-dyn-card-video__title').textContent;
                if (this.hasClass(markItem, 'active')) {
                    messageObj.message = `添加稍后再看 [${title}]`;
                } else {
                    messageObj.message = `移除稍后再看 [${title}]`;
                }
                this.notification(messageObj)
                markItem.click();
            }

            border(draw, clear) {
                if (draw !== -1) {
                    let dynVideoItem = this.#dynList[this.#dynVideoList[draw]];
                    dynVideoItem.style.border = this.#border;
                    dynVideoItem.scrollIntoView({behavior: 'auto', block: 'center'});
                }
                if (clear !== -1) {
                    this.#dynList[this.#dynVideoList[clear]].style.border = '';
                }
            }

            run() {
                this.keydownListener();
                this.loadDynList();
                this.loadVideoList();
                this.backTop();
            }

            keydownListener() {
                document.addEventListener("keydown", (evt) => {
                    let code = evt.code;
                    switch (code) {
                        case "ArrowRight":
                        case "ArrowLeft":
                            this.moveUpIcon(code);
                            break;
                        case "ArrowUp":
                        case "ArrowDown":
                            this.moveUpVideo(code);
                            break;
                        case "Enter":
                            this.addMark();
                            break;
                    }
                })
            }

            loadDynList() {
                this.#upIconList = document.querySelectorAll(".bili-dyn-up-list__item");
                this.#upIconList.forEach((item, index) => {
                    item.addEventListener('click', () => {
                        this.#currentIconIndex = index;
                        this.loadVideoList(true);
                    })
                })
                this.#currentIconIndex = 0;
                this.#upIconListPrevBtn = document.querySelector('.prev').querySelector('.bili-dyn-up-list__nav__btn');
                this.#upIconListNextBtn = document.querySelector('.next').querySelector('.bili-dyn-up-list__nav__btn');
                this.#mainWidth = this.getItemWidthByAttributes(document.querySelector('.bili-dyn-up-list__content'), "width");
                let noUp;
                let baseIcon = (noUp = this.#upIconList.length > 1) ? this.#upIconList[1] : this.#upIconList[0];
                this.#upIconWidth = this.getItemWidthByAttributes(baseIcon, "width", "marginLeft", "marginRight");
                if (!noUp) {
                    this.#upIconWidth += 3;
                }
            }

            loadVideoList(reload = false, timeout = 500) {
                if (reload) {
                    this.#previousVideoIndex = -1;
                    this.#currentVideoIndex = -1;
                }
                setTimeout(() => {
                    this.#dynVideoList = [];
                    this.#dynList = document.querySelectorAll(".bili-dyn-list__item");
                    for (let i = 0; i < this.#dynList.length; i++) {
                        let dynItem = this.#dynList[i];
                        if (dynItem.querySelector('a') && this.hasClass(dynItem.querySelector('.bili-dyn-content__orig'), 'reference')) {
                            this.#dynVideoList.push(i);
                        }
                    }
                    if (this.#dynVideoList.length > 0 && this.#dynVideoList[0] === 0) {
                        this.#currentVideoIndex = 0
                        this.border(this.#currentVideoIndex, this.#previousVideoIndex)
                    }
                }, timeout);
            }

            hasClass(element, cls) {
                let className = element.className;
                return className.indexOf(cls) === -1;
            }
        }

        let common = null;
        return (function () {
            if (!common) {
                common = new Common();
            }
            return common;
        })();
    })();

    window.addEventListener("load", () => {
        setTimeout(() => {
            console.log("[b站 动态页添加稍后再看]: 已加载!");
            common.run();
        }, 1000);
    })
})();