// ==UserScript==
// @name         Bilibili Live Auto Gift
// @namespace    https://yinr.cc/
// @version      2.7.2
// @description  Auto get gift in bilibili live
// @author       Yinr
// @icon         https://www.bilibili.com/favicon.ico
// @include    /^https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+(\?.+)?/
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/403060/Bilibili%20Live%20Auto%20Gift.user.js
// @updateURL https://update.greasyfork.org/scripts/403060/Bilibili%20Live%20Auto%20Gift.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let MinTimeout = 1000, MaxTimeout = 60 * 1000;
    let logging = (msg, type = 'log') => {
        switch (typeof(msg)) {
            case 'string':
            case 'number':
                console[type]('BiliAutoGift: ' + msg);
                break;;
            default:
                if (Array.isArray(msg)) {
                    console[type]({by: 'BiliAutoGift', msg});
                } else {
                    console[type]({by: 'BiliAutoGift', ...msg});
                }
                break;;
        }
    };

    /**
     * @return {
     *     liveType,    // 位于直播播放器所在页面: 否[0] 是[1]
     *     nestType,    // 位于活动专用嵌套页面:  否[0] 是[1]
     *     lotteryType, // 由广播引导而来:       否[0] 送礼广播[1] 总督广播[2]
     *     msg
     * }
     */
    let getPageType = (context = document) => {
        let liveType, nestType, lotteryType, msg;
        let path = context.location.pathname;
        let qstring = context.location.search;
        if (qstring == '?live_lottery_type=1&broadcast_type=0') {
            lotteryType = 1;
        } else if (qstring == '?live_lottery_type=2&broadcast_type=') {
            lotteryType = 2;
        } else if (qstring.includes('broadcast_type=1')) {
            lotteryType = 1;
        } else {
            lotteryType = 0;
        }
        if (path.startsWith('/blanc/')) {
            [liveType, nestType, msg] = [1, 1, 'live in nested page'];
        } else {
            if (window.__initialState === undefined) {
                [liveType, nestType, msg] = [1, 0, 'live in main page'];
            } else {
                [liveType, nestType, msg] = [0, 1, 'main page in nested page'];
            }
        }
        return {liveType, nestType, lotteryType, msg}
    };
    let getDocument = () => {
        let pageType = getPageType();
        try {
            if (pageType.liveType === 0 && pageType.nestType === 1) {
                let doc = undefined;
                document.querySelectorAll('iframe').forEach(el => {
                    if (el.src.includes('//live.bilibili.com')) {
                        let eldoc = el.contentDocument || el.contentWindow.document;
                        if (eldoc.body.childElementCount > 0) {
                            doc = eldoc;
                        }
                    }
                });
                return doc;
            } else {
                return document;
            }
        } catch (e) {
            return undefined;
        }
    };
    let isLive = () => {
        try {
            return getDocument().querySelector("#head-info-vm span.live-status-label").innerText === '直播';
        } catch (e) {
            return true;
        }
    };

    // Auto Get Gift
    class biliGiftGather {
        constructor(t = 1000) {
            this.minTimeout = MinTimeout;
            this.maxTimeout = MaxTimeout;
            this.intervalId = undefined;
            this._timeout = t;
            this._context = getDocument();
            logging({at: "BiliGiftGather constructor", context: this}, 'debug');
        }
        get context() {
            if (!this._context) this._context = getDocument();
            return this._context;
        }
        get timeout() {return this._timeout;}
        set timeout(t = this.minTimeout) {
            if (t > 60 * 1000) logging("Timeout is longer than 1 min", 'warn');
            if (this.intervalId && t != this._timeout) {
                this.stop();
                this._timeout = t;
                this.start(this._timeout);
            }
        }
        gather() {
            logging({at: 'Gift Gather',el: this.context.querySelector("#chat-draw-area-vm")}, 'debug');
            let btnGet = this.context.querySelector("#chat-draw-area-vm div.function-bar.draw > span:nth-child(3)");
            if (!btnGet) {
                if (this.timeout < this.maxTimeout) {
                    this.timeout = this.timeout + 10**Math.floor(Math.log10(this.timeout));
                }
            } else if (btnGet.style.display === "") {
                btnGet.click();
                if (this.timeout > this.minTimeout) this.timeout = this.minTimeout;
            }
            return this;
        }

        stop() {
            if (this.intervalId !== undefined) {
                clearInterval(this.intervalId);
                logging("stopped gather: #" + this.intervalId, 'log');
                this.intervalId = undefined;
            }
            return this;
        }
        start(t = this.timeout) {
            logging("start gather: @" + t + "ms", 'log');
            if (this.intervalId) this.stop();
            this.intervalId = setInterval(() => this.gather(), t);
            return this;
        }
    }
    let startGiftGather = () => {
        if (window.biliAutoGift.enabled && window.biliAutoGift.enabled.giftGather) {
            return window.biliAutoGift.enabled.giftGather;
        } else {
            let bgg = new biliGiftGather(10 * 1000);
            window.biliAutoGift.enabled.giftGather = bgg;
            bgg.start();
            if (getPageType().lotteryType > 0) bgg.maxTimeout = 30 * 1000;
            return bgg;
        }
    };

    // Auto Open & Close Gift Page
    let giftTypeDict = {
        // 0: open with no wait
        "总榜第一": 0,
        "第7关": 0,
        "粉红时刻": 0,
        // 1: wait 10s before open
        "完成今日小电视地图历险": 1,
        "总督": 1,
        // 2: 全区广播: wait 20s before open
        // 3: 分区广播: wait 20s before open
        "小电视飞船": 2,
        "金牛座流星雨": 2,
        "1219蘑菇方舟": 2,
        "摩天大楼": 3,
        "砰然心动": 3,
    };
    class biliGiftWatcher {
        constructor(watchType = 1) {
            this._qstring = document.location.search;
            this._pageType = getPageType();
            this._context = getDocument();
            this.MaxOpened = 2;
            this.start(watchType);
        }
        get pageType() {
            if (!this._pageType) this._pageType = getPageType();
            return this._pageType;
        }
        get context() {
            if (!this._context) this._context = getDocument();
            return this._context;
        }
        get watchType() {
            if (this.type === 'autoWatch') {
                return this._watchType;
            } else {
                return undefined;
            }
        }
        set watchType(type) {
            if (this.type === 'autoWatch') {
                this._watchType = type;
            }
        }

        // Auto Close
        autoClose() {
            if (this.pageType.liveType + this.pageType.nestType === 1) {
                let that = this;
                setTimeout(() => {that.clearChat()}, 20 * 1000);
                that.autoCloseId = setInterval(() => {
                    if (that.context && that.context.querySelector("#chat-draw-area-vm").childElementCount === 0) {
                        logging('Auto Closeing', 'info');
                        window.close();
                    }
                }, 30 * 1000);
            }
            return this;
        }
        clearChat() {
            try {
                // this.context.querySelectorAll('.icon-clear')[0].click();
                if (this.context.querySelectorAll('.icon-lock-1').length === 0) {
                    this.context.querySelectorAll('.icon-unlock-1')[0].click();
                }
                logging('Clear Chatlist', 'info');
            } catch (e) {
                logging({at: 'Clear Chat', msg: 'Clear Chatlist with error', err: e}, 'debug');
                setTimeout(() => this.clearChat(), 20 * 1000);
            }
            return this;
        }

        // Auto Watch Gift
        autoWatchGift() {
            let that = this;
            let openGiftCallback = (mutationList, observer) => {
                mutationList.forEach((mutation) => { mutation.addedNodes.forEach(el => {
                    logging({mutation, el, text: el.innerText}, 'debug');
                    if (el.classList.contains('system-msg')) {
                        if (el.innerText.includes('抽奖')) {
                            // ==> 投喂抽奖
                            let url = el.querySelector('a').href;
                            let text = el.querySelector('a > span:nth-child(4)').innerText.split('，')[0];
                            that.openUrl(url, text);
                        } else if (el.innerText.includes('围观')) {
                            // ==> 总榜第一围观
                            let url = el.querySelector('a').href;
                            let text = el.querySelector('a > span:nth-child(4)').innerText.split('，')[0];
                            logging({at: "open watchby window", url, text}, 'log');
                            that.openUrl(url, text);
                        // } else if (el.classList.contains('superChat-card-detail')) {
                            // ==> SC
                        }
                    // } else if (el.classList.contains('misc-msg')) {
                        // el.classList.contains('user-block') ==> 用户被禁言
                        // el.classList.contains('guard-buy') ==> 用户购买
                    }
                }) });
            }
            if (this.observer) {
                try {this.observer.disconnect();} catch (e) {}
            } else {
                this.observer = new MutationObserver(openGiftCallback);
            }
            this.observer.observe(this.context.querySelector('#chat-items'), {childList: true});
            return this;
        }
        parseGift(txt) {
            if (!txt) return [];
            let [count, giftName] = txt.split('个');
            count = parseInt(count);
            if (isNaN(count)) {
                [count, giftName] = [0, txt];
                if (giftName.includes('开通了')) {
                    giftName = giftName.split('开通了')[1].split('并触发了')[0];
                }
            }
            let giftType = this.getGiftType(giftName);
            if (giftType === 0) count = 1;
            return [count, giftName, this.getGiftType(giftName)];
        }
        getGiftType(txt = "") {
            for (let [k, v] of Object.entries(giftTypeDict)) {
                if (txt.includes(k)) return v;
            }
            logging({at: "NOT FOUND GiftType", txt}, 'log');
            return txt;
        }
        openUrl(url, text, isDelay = false) {
            let [count, giftName, giftType] = this.parseGift(text);
            if (this.watchType && this.watchType > 1 && giftType < 3) return; // 仅分区处理广播
            logging({at: "open gift window", giftName, count, url, text}, 'log');
            let roomId = url;
            try {
                roomId = url.match(/.*\/(\d+)\/?(\?.*)?/)[1];
            } catch (e) {}
            if (!url.includes('?')) url += "?live_lottery_type=1&broadcast_type=0";
            if (this.openedCount >= this.MaxOpened && 0 < count && count < 4) {
                if (this.MaxOpened !== 0) {
                    // small gift while in busy task, then delay it once
                    if (isDelay) {
                        logging({at: 'Open Url', msg: 'Canceled with once delay', url, giftName, count}, 'log');
                    } else {
                        logging({at: 'Open Url', msg: 'Delay once', url, giftName, count}, 'log');
                        setTimeout(() => this.openUrl(url, text, true), 50 * 1000);
                    }
                }
            } else {
                let timeout = 2 * 1000, rmTimeout = 2 * 60 * 1000;
                let openId = undefined;
                switch (giftType) {
                    case 0:
                        timeout = 0;
                        rmTimeout = 1 * 60 * 1000
                        break;;
                    case 1:
                        timeout = 10 * 1000;
                        break;;
                    case 2:
                    case 3:
                        timeout = 20 * 1000;
                        break;;
                }
                if (!this.isOpened(roomId)) {
                    openId = setTimeout(window.open, timeout, url);
                }
                let rmId = setTimeout(() => {this.removeOpened(roomId)}, rmTimeout + timeout);
                this.addOpened(roomId, openId, rmId);
            }
            return this;
        }
        get openedRoomId() {
            return Object.keys(this.opened);
        }
        get openedCount() {
            return this.openedRoomId.length;
        }
        isOpened(roomId) {
            try {roomId = roomId.toString()} catch (e) {};
            return this.openedRoomId.includes(roomId);
        }
        addOpened(roomId, openId, rmId) {
            try {roomId = roomId.toString()} catch (e) {};
            if (this.isOpened(roomId)) {
                clearTimeout(this.opened[roomId].rmId);
                this.opened[roomId].rmId = rmId;
                return this.opened[roomId];
            } else {
                this.opened[roomId] = {openId, rmId};
                return {openId, rmId};
            }
        }
        removeOpened(roomId) {
            try {roomId = roomId.toString()} catch (e) {};
            if (this.isOpened(roomId)) {
                delete this.opened[roomId];
                return roomId;
            }
        }

        start(watchType = this.watchType) {
            switch (this.pageType.lotteryType) {
                case 1: // 送礼
                case 2: // 总督
                    this.autoClose();
                    this.type = 'autoClose';
                    break;;
                default:
                    this.autoWatchGift();
                    this.type = 'autoWatch';
                    this.watchType = watchType || 1;
                    this.opened = {};
                    break;;
            }
            logging(`Auto Gift Watcher @${this.type}${this.type === 'autoWatch' ? ` with type ${this.watchType}` : ''}`, 'log');
            try {
                this.context.getElementById('gift-screen-animation-vm').style.display = 'none';
            } catch (e) {logging({at: 'Auto Gift Watcher Starter', msg: 'hide gift animation failed', err: e});}
            return this;
        }
        stop() {
            switch (this.type) {
                case 'autoClose':
                    if (this.autoCloseId) {
                        clearInterval(this.autoCloseId);
                        this.autoCloseId = undefined;
                    }
                    break;;
                case 'autoWatch':
                    this.observer.disconnect();
                    this.observer = undefined;
                    break;;
            }
            return this;
        }
        changeWatchParam(watchType, maxOpened, clearChat = true) {
            if (clearChat) this.clearChat();
            if (watchType !== undefined) this.start(watchType);
            if (maxOpened !== undefined) this.MaxOpened = maxOpened;
            return this;
        }
    }
    let startGiftWatcher = () => {
        if (window.biliAutoGift.enabled && window.biliAutoGift.enabled.giftWatcher) {
            return window.biliAutoGift.enabled.giftWatcher;
        } else {
            let bgw = new biliGiftWatcher();
            window.biliAutoGift.enabled.giftWatcher = bgw;
            return bgw;
        }
    };

    function main() {
        // Auto Gather Gift
        let pageType = getPageType();
        logging({at: "main", pageType}, 'debug');
        if (pageType.liveType === 0 && pageType.nestType === 1) {
            // in the base frame of nest page
            logging({at: "main", frames: document}, 'debug');
            startGiftGather();
            setTimeout(() => {
                getDocument().body.scrollIntoView();
            }, 2000);
        }

        if (pageType.liveType + pageType.nestType === 1) {
            // Auto Open & Close Gift Page
            startGiftWatcher();
        }
    }

    window.biliAutoGift = {
        startGiftGather,
        stopGiftGather: () => {
            if (window.biliAutoGift.enabled && window.biliAutoGift.enabled.giftGather) {
                return window.biliAutoGift.enabled.giftGather.stop();
            }
        },
        startGiftWatcher,
        stopGiftWatcher: () => {
            if (window.biliAutoGift.enabled && window.biliAutoGift.enabled.giftWatcher) {
                return window.biliAutoGift.enabled.giftWatcher.stop();
            }
        },
        utils: {
            getPageType,
            getDocument,
            newGiftWatcher: () => {return new biliGiftWatcher()},
            newGiftGather: (t = 1000) => {return new biliGiftGather(t)},
        },
        enabled: {}
    };

    main();

})();