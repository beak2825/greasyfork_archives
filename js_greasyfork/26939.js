// ==UserScript==
// @name         bilibili H5播放器快捷操作
// @namespace    https://github.com/jeayu/bilibili-quickdo
// @version      0.9.9.9
// @description  快捷键设置,回车快速发弹幕,双击全屏,自动选择最高清画质、播放、全屏、关闭弹幕、自动转跳和自动关灯等
// @author       jeayu
// @license      MIT
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/video/bv*
// @match        *://www.bilibili.com/video/BV*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/26939/bilibili%20H5%E6%92%AD%E6%94%BE%E5%99%A8%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/26939/bilibili%20H5%E6%92%AD%E6%94%BE%E5%99%A8%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const q = function (selector) {
        let nodes = [];
        if (typeof selector === 'string') {
            Object.assign(nodes, document.querySelectorAll(selector));
            nodes.selectorStr = selector;
        } else if (selector instanceof NodeList) {
            Object.assign(nodes, selector);
        } else if (selector instanceof Node) {
            nodes = [selector];
        }
        nodes.click = function (index = 0) {
            nodes.length > index && nodes[index].click();
            return this;
        }
        nodes.addClass = function (classes, index = 0) {
            nodes.length > index && nodes[index].classList.add(classes);
            return this;
        }
        nodes.removeClass = function (classes, index = 0) {
            nodes.length > index && nodes[index].classList.remove(classes);
            return this;
        }
        nodes.text = function (index = 0) {
            return nodes.length > index && nodes[index].textContent || '';
        }
        nodes.css = function (name, value, index = 0) {
            nodes.length > index && nodes[index].style.setProperty(name, value);
            return this;
        }
        nodes.getCss = function (name, index = 0) {
            return nodes.length > index && nodes[index].ownerDocument.defaultView.getComputedStyle(nodes[index], null).getPropertyValue(name);
        }
        nodes.mouseover = function (index = 0) {
            return this.trigger('mouseover', index);
        }
        nodes.mouseout = function (index = 0) {
            return this.trigger('mouseout', index);
        }
        nodes.attr = function (name, index = 0) {
            const result = nodes.length > index ? nodes[index].attributes[name] : undefined;
            return result && result.value;
        }
        nodes.hasClass = function (className, index = 0) {
            return nodes.length > index && nodes[index].className.match && (nodes[index].className.match(new RegExp(`(\\s|^)${className}(\\s|$)`)) != null);
        }
        nodes.append = function (text, where = 'beforeend', index = 0) {
            nodes.length > index && nodes[index].insertAdjacentHTML(where, text);
            return this;
        }
        nodes.find = function (name, index = 0) {
            return q(nodes[index].querySelectorAll(name));
        }
        nodes.toggleClass = function (className, flag, index = 0) {
            return flag ? this.addClass(className, index) : this.removeClass(className, index);
        }
        nodes.next = function (index = 0) {
            return nodes.length > index && nodes[index].nextElementSibling ? q(nodes[index].nextElementSibling) : [];
        }
        nodes.prev = function (index = 0) {
            return nodes.length > index && nodes[index].previousElementSibling ? q(nodes[index].previousElementSibling) : [];
        }
        nodes.trigger = function (event, index = 0) {
            if (nodes.length > index) {
                const evt = document.createEvent('Event');
                evt.initEvent(event, true, true);
                nodes[index].dispatchEvent(evt);
            }
            return this;
        }
        nodes.last = function () {
            return q(nodes[nodes.length - 1]);
        }
        nodes.on = function (event, fn, useCapture=false, index = 0) {
            nodes.length > index && nodes[index].addEventListener(event, fn, useCapture);
            return this;
        }
        nodes.select = function (index = 0) {
            nodes.length > index && nodes[index].select();
            return this;
        }
        nodes.blur = function (index = 0) {
            nodes.length > index && nodes[index].blur();
            return this;
        }
        nodes.val = function (value, index = 0) {
            if (value) {
                nodes[index].value = value;
                return this;
            }
            return nodes[index].value;
        }
        nodes.offset = function (index = 0) {
            if (nodes.length <= index) {
                return {top: 0, left: 0};
            }
            const rect = nodes[index].getBoundingClientRect();
            return {top: rect.top + document.body.scrollTop, left: rect.left + document.body.scrollLeft}
        }
        nodes.parseFloat = function (css, index = 0) {
            return (parseFloat(this.getCss(css, index)) || 0);
        }
        nodes.after = function (node, index = 0) {
            nodes.length > index && node instanceof Node && nodes[index].parentNode.insertBefore(node, nodes[index]);
            return this;
        }
        return nodes;
    }
    const SELECTOR = {
        h5Player: "#bilibili-player video",
        playerContainer: ".bpx-player-container",
        playerControl: ".bpx-player-control-wrap",
        senderBarArea: ".bpx-player-sending-area",
        playerFull: ".bpx-player-ctrl-full",
        playerWeb: ".bpx-player-ctrl-web",
        playerWide: ".bpx-player-ctrl-wide",
        dmInput: "input.bpx-player-dm-input",
        dmInputFocus: "input.bpx-player-dm-input:focus",
        playerCurrentTime: ".bpx-player-ctrl-time-current",
        mirror: ".bpx-player-ctrl-setting-mirror input",
        lightOff: ".bpx-player-ctrl-setting-lightoff input",
        jumpContent: ".bpx-player-electric-jump",
        dmSwitch: ".bpx-player-dm-switch input",
        dmTypeScroll: ".bpx-player-block-typeScroll",
        dmTypeTop: ".bpx-player-block-typeTop",
        dmTypeBottom: ".bpx-player-block-typeBottom",
        dmTypeColor: ".bpx-player-block-typeColor",
        dmTypeSpecial: ".bpx-player-block-typeSpecial",
        videoQuality: ".bpx-player-ctrl-quality-menu-item",
        vipVideoQuality: ".bpx-player-ctrl-quality-badge-bigvip",
        moreDescribe: "#v_desc .toggle-btn",
        playerVideoArea: ".bpx-player-video-area",
        playerCtrlPrev: ".bpx-player-ctrl-prev",
        playerCtrlNext: ".bpx-player-ctrl-next",
    };
    const [ON, OFF] = [1, 0];
    const [FULLSCREEN, WEBFULLSCREEN, WIDESCREEN, DEFAULT, MINI] = ["full", "web", "wide", "normal", "mini"];
    const KEY_BOARD = {
        keyCode: {
            'enter': 13,
            'esc': 27,
            '=': 187,
            '-': 189,
            '0': 48,
            '1': 49,
            '2': 50,
            '3': 51,
            '4': 52,
            '5': 53,
            '6': 54,
            '7': 55,
            '8': 56,
            '9': 57,
            'a': 65,
            'b': 66,
            'c': 67,
            'd': 68,
            'e': 69,
            'f': 70,
            'g': 71,
            'h': 72,
            'i': 73,
            'j': 74,
            'k': 75,
            'l': 76,
            'm': 77,
            'n': 78,
            'o': 79,
            'p': 80,
            'q': 81,
            'r': 82,
            's': 83,
            't': 84,
            'u': 85,
            'v': 86,
            'w': 87,
            'x': 88,
            'y': 89,
            'z': 90,
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40,
            'space': 32,
            '[': 219,
            ']': 221,
            '\\': 220,
            ';': 186,
            "'": 222,
            ',': 188,
            '.': 190,
            '/': 191,
            '`': 192,
        },
        defaultShortCut: {
            f: { text: 'f键', status: ON, bindKey: 'f' },
            leftSquareBracket: { text: '[键', status: ON, bindKey: '[' },
            rightSquareBracket: { text: ']键', status: ON, bindKey: ']' },
            enter: { text: '回车键', status: OFF, bindKey: 'enter' },
            up: { text: '↑键', status: OFF, bindKey: 'up' },
            down: { text: '↓键', status: OFF, bindKey: 'down' },
            right: { text: '←键', status: OFF, bindKey: 'left' },
            left: { text: '→键', status: OFF, bindKey: 'right' },
            space: { text: '空格键播放/暂停', status: OFF, bindKey: 'space' },
            q: { text: 'q键-点赞', status: ON, bindKey: 'q' },
            w: { text: 'w键-投币', status: ON, bindKey: 'w' },
            e: { text: 'e键-收藏', status: ON, bindKey: 'e' },
            r: { text: 'r键-长按三连', status: ON, bindKey: 'r' },
            d: { text: 'd键-关闭弹幕', status: ON, bindKey: 'd' },
            m: { text: 'm键-静音', status: ON, bindKey: 'm' },
        },
        getKeyCode(key) {
            return this.keyCode[key];
        },
        isGlobalHotKey(keyCode) {
            return ["left", "up", "right", "down", "space"].find(key => this.getKeyCode(key) == keyCode);
        },
        isNumberKeyCode(keyCode) {
            return keyCode >= this.getKeyCode('0') && keyCode <= this.getKeyCode('9');
        },
        getDefaultShortCutStatus(key) {
            return STORAGE.getDefaultShortCutStatus(key, this.defaultShortCut[key].status);
        },
        checkDefaultShortCut(keyCode) {
            return Object.entries(this.defaultShortCut)
                .some(([key, { text, status, bindKey }]) => this.getKeyCode(bindKey) == keyCode && this.getDefaultShortCutStatus(key)== ON);
        },
    };
    const H5_PLAYER = {
        variable: {
            speed: { text: '播放速度调整倍数', value: 0.25 },
            minSpeed: { text: '最小播放速度倍数', value: 0.25 },
            maxSpeed: { text: '最大播放速度倍数', value: 4 },
            volume: { text: '音量调整百分比', value: 1 },
            videoProgress: { text: '快进/快退调整秒数', value: 1 },
        },
        getVarSetting(key) {
            return this.variable[key].value;
        },
        init() {
            this.h5Player = q(SELECTOR.h5Player);
            this.control = q(SELECTOR.playerControl);
            this.senderBar = q(SELECTOR.senderBarArea);
            this.played = false;
            console.log('H5_PLAYER done');
        },
        addEventListener(event, func) {
            this.h5Player.on(event, func);
        },
        addPlayingEvent(func) {
            this.addEventListener('playing', func);
        },
        addPauseEvent(func) {
            this.addEventListener('pause', func);
        },
        addEndedEvent(func) {
            this.addEventListener('ended', func);
        },
        getDuration() {
            return this.h5Player[0].duration;
        },
        getCurrentTime() {
            return this.h5Player[0].currentTime;
        },
        setVideoCurrentTime(time) {
            if (time > -1 && time <= this.h5Player[0].duration) {
                this.h5Player[0].currentTime = time;
            }
        },
        play() {
            this.h5Player[0].play();
        },
        pause() {
            this.h5Player[0].pause();
        },
        isPaused(){
            return this.h5Player[0].paused;
        },
        playAndPause() {
            this.isPaused() ? this.play() : this.pause();
        },
        subSpeed() {
            this.h5Player[0].playbackRate = Math.max(this.h5Player[0].playbackRate - this.getVarSetting('speed'), this.getVarSetting('minSpeed'));
        },
        addSpeed() {
            this.h5Player[0].playbackRate = Math.min(this.h5Player[0].playbackRate + this.getVarSetting('speed'), this.getVarSetting('maxSpeed'));
        },
        resetSpeed() {
            this.h5Player[0].playbackRate = 1;
        },
        getPlaybackRate() {
            return this.h5Player[0].playbackRate;
        },
        getVolume() {
            return this.h5Player[0].volume;
        },
        setVolume(volume) {
            this.h5Player[0].volume = volume;
        },
        mute() {
            this.h5Player[0].muted = !this.h5Player[0].muted;
        },
        subVolume() {
            this.setVolume(Math.max(this.getVolume() - (this.getVarSetting('volume') / 100), 0));
        },
        addVolume() {
            this.setVolume(Math.min(this.getVolume() + (this.getVarSetting('volume') / 100), 1));
        },
        subProgress() {
            this.h5Player[0].currentTime -= this.getVarSetting('videoProgress');
        },
        addProgress() {
            this.h5Player[0].currentTime += this.getVarSetting('videoProgress');
        },
        offsetTop() {
            return this.h5Player.offset().top;
        }
    };
    const UI = {
        addStyle(css, id) {
            id = id ? `id=${id}` : '';
            q('head').append(`<style ${id} type="text/css">${css}</style>`);
        },
        removeStyle(styleId) {
            const styleNode = q(styleId)[0];
            styleNode && styleNode.parentNode.removeChild(styleNode);
        },
        showHint(info, hideVolumeIcon=true) {
            clearTimeout(this.hintTimer);
            q('div.bpx-player-volume-hint').length || this.initShowHint();
            q('div.bpx-player-volume-hint').css('opacity', 1).css('display', '');

            q('span.bpx-player-volume-hint-icon').css('display', hideVolumeIcon ? 'none' : '');
            q('span.bpx-player-volume-hint-text')[0].innerHTML = info;
            this.hintTimer = setTimeout(() => {
                q('div.bpx-player-volume-hint').css('opacity', 0).css('display', 'none');
                q('span.bpx-player-volume-hint-icon').css('display', '');
            }, 1E3);
        },
        initShowHint() {
            const html = `
            <div class="bpx-player-volume-hint" style="opacity: 0; display: none;">
                <span class="bpx-player-volume-hint-icon"><span class="bpx-common-svg-icon">
                    <svg viewBox="0 0 22 22">
                        <use xlink:href="#bpx-svg-sprite-volume"></use>
                    </svg>
                </span>
            <span class="bpx-common-svg-icon" style="display: none;">
                <svg viewBox="0 0 22 22">
                    <use xlink:href="#bpx-svg-sprite-volume-off"></use>
                </svg>
            </span>
            </span>
                <span class="bpx-player-volume-hint-text">70%</span>
            </div>
            `;
            q(SELECTOR.playerVideoArea).append(html);
        },
        hideSenderBar() {
            this.hideSenderBarCss();
        },
        hideSenderBarCss() {
            const css = `${SELECTOR.senderBarArea}{opacity: 0!important;display: none!important}`;
            this.addStyle(css, 'qd-hideSenderBar');
        },
        showSenderBar() {
            H5_PLAYER.senderBar.css('opacity', 1).css('display', '');
            this.removeStyle('#qd-hideSenderBar');
        },
        h5PlayerRotate(flag, rotationDeg=90) {
            const h5Player = H5_PLAYER.h5Player[0];
            const deg = this.getRotationDeg(H5_PLAYER.h5Player) + rotationDeg * flag;
            let transform = `rotate(${deg}deg)`;
            if (deg == 0 || deg == 180 * flag) {
                transform += ` scale(1)`;
            } else {
                transform += ` scale(${h5Player.videoHeight / h5Player.videoWidth})`;
            }
            this.setH5PlayerRransform(transform);
        },
        setH5PlayerRransform(transform) {
            H5_PLAYER.h5Player.css('-webkit-transform', transform)
                .css('-moz-transform', transform)
                .css('-ms-transform', transform)
                .css('-o-transform', transform)
                .css('transform', transform);
        },
        getTransformCss(e) {
            return e.getCss('-webkit-transform') || e.getCss('-moz-transform') || e.getCss('-ms-transform') || e.getCss('-o-transform') || 'none';
        },
        getRotationDeg(e) {
            const transformCss = this.getTransformCss(e);
            let matrix = transformCss.match('matrix\\((.*)\\)');
            if (matrix) {
                matrix = matrix[1].split(',');
                if (matrix) {
                    const rad = Math.atan2(matrix[1], matrix[0]);
                    return (rad * 180 / Math.PI) | 0;
                }
            }
            return 0;
        },
        isWide() {
            return q(SELECTOR.playerContainer).attr('data-screen') == WIDESCREEN || q(SELECTOR.playerWide).hasClass('bpx-state-entered');
        },
        ultraWidescreenCss() {
            this.removeStyle('#qd-ultraWidescreen');
            const clientWidth = document.body.clientWidth;
            const marginLeft = q('#bilibili-player ').offset().left;
            const css = `
            .bpx-player-container[data-screen=wide] {
                width:${clientWidth}px!important;margin-left:-${marginLeft}px!important;z-index: 1000!important;
            }
            `;
            this.addStyle(css, 'qd-ultraWidescreen');
        },
        rConCss() {
            this.removeStyle('#qd-rCon');
            if (!this.isBottomTitle || !this.isWide()) {
                return;
            }
            const top = H5_PLAYER.h5Player.parseFloat('height');
            const css = `
            .r-con{margin-top:${top}px!important}
            .right-container{margin-top:${top}px!important}
            `;
            this.addStyle(css, 'qd-rCon');
        },
        bottomTitle() {
            q('#viewbox_report').after(q('#playerWrap')[0]);
            if (!this.isBottomTitle) {
                const css = `#viewbox_report {height:auto!important;}`;
                this.addStyle(css, 'qd-bottomTitle');
                this.isBottomTitle = true;
            }
        },
        removeFixedHeader() {
            q('.bili-header').removeClass('fixed-header');
        },
    };
    const REPEAT_CONTROLLER = {
        repeatStart: undefined,
        repeatEnd: undefined,
        setRepeatStart() {
            this.repeatStart = H5_PLAYER.getCurrentTime();
            UI.showHint(`起点 ${q(SELECTOR.playerCurrentTime).text()}`);
        },
        setRepeatEnd() {
            this.repeatEnd = H5_PLAYER.getCurrentTime();
            UI.showHint(`终点 ${q(SELECTOR.playerCurrentTime).text()}`);
        },
        resetRepeat() {
            this.repeatEnd = this.repeatStart = undefined;
            UI.showHint(`清除循环点`)
        },
        check() {
            return this.repeatEnd && this.repeatStart && this.repeatEnd <= H5_PLAYER.getCurrentTime();
        },
        start() {
            H5_PLAYER.setVideoCurrentTime(this.repeatStart);
        }
    };
    const CONTROLLER = {
        keydownFn: undefined,
        hintTimer: undefined,
        config: {
            globalHotKey: { text: '快捷键设置全局', status: OFF, tips: '上下左右空格不会滚动页面' },
        },
        quickDo: {
            settingPanel: { value: '`', text: '设置面板', },
            fullscreen: { value: 'f', text: '全屏', },
            webFullscreen: { value: 'w', text: '网页全屏', },
            widescreen: { value: 'q', text: '宽屏', },
            subSpeed: { value: '[', text: '减少速度', },
            addSpeed: { value: ']', text: '增加速度', },
            resetSpeed:  { value: '\\', text: '重置速度', },
            danmu: { value: 'd', text: '弹幕', },
            playAndPause: { value: 'p', text: '暂停播放', },
            prevPart: { value: 'k', text: '上一P', },
            nextPart: { value: 'l', text: '下一P', },
            showDanmuInput: { value: 'enter', text: '发弹幕', },
            mirror: { value: 'j', text: '镜像', },
            danmuTop: { value: 't', text: '顶部弹幕', },
            danmuBottom: { value: 'b', text: '底部弹幕', },
            danmuScroll: { value: 's', text: '滚动弹幕', },
            danmuSpecial: { value: '', text: '高级弹幕', },
            danmuColor: { value: 'c', text: '彩色弹幕', },
            rotateRight: { value: 'o', text: '向右旋转', },
            rotateLeft: { value: 'i', text: '向左旋转', },
            lightOff: { value: 'y', text: '灯', },
            mute: { value: 'm', text: '静音', },
            scroll2Top: { value: ';', text: '回到顶部', },
            jumpContent: { value: 'g', text: '跳过鸣谢', },
            playerSetOnTop: { value: "'", text: '播放器置顶', },
            setRepeatStart: { value: ',', text: '循环起点', },
            setRepeatEnd: { value: '.', text: '循环终点', },
            resetRepeat: { value: '/', text: '清除循环点', },
            subVolume: { value: '', text: '减少音量', },
            addVolume: { value: '', text: '增加音量', },
            subProgress: { value: '', text: '快退', },
            addProgress: { value: '', text: '快进', },
        },
        initKeyDown() {
            this.keydownFn = this.keydownFn || (e=> !q('input:focus, textarea:focus').length && this.keyHandler(e));
            q(document).on('keydown', this.keydownFn, true);
            console.log('initKeyDown done');
        },
        keyHandler(e) {
            const {keyCode, ctrlKey, shiftKey, altKey} = e;
            if (ctrlKey || shiftKey || altKey) {
                return;
            }
            if (KEY_BOARD.checkDefaultShortCut(keyCode)) {
                e.stopPropagation();
            }
            if (this.getControllerConfigStatus('globalHotKey') === ON) {
                if (KEY_BOARD.isGlobalHotKey(keyCode)) {
                    this.focusPlayer();
                    e.preventDefault();
                }
            }

            Object.keys(this.quickDo)
                .some(quickDoKey => keyCode === this.getQuickDoKeyCode(quickDoKey) && (!this[quickDoKey]() || !e.preventDefault())) ||
                this.numberKeySkip(keyCode);
            e.defaultPrevented;
        },
        bindDanmuInputKeydown() {
            q(SELECTOR.dmInput).on('keydown', e => {
                e.keyCode === KEY_BOARD.keyCode.enter && this.hideDanmuInput();
            });
        },
        getControllerConfigStatus(key) {
            return STORAGE.getControllerConfigStatus(key, this.config[key].status);
        },
        getQuickDoKeyCode(quickDoKey) {
            return KEY_BOARD.getKeyCode(STORAGE.getQuickDoKey(quickDoKey, this.quickDo[quickDoKey].value));
        },
        focusPlayer() {
            H5_PLAYER.control.click();
        },
        numberKeySkip(keyCode) {
            if (KEY_BOARD.isNumberKeyCode(keyCode)) {
                const multiple = keyCode - KEY_BOARD.getKeyCode('0');
                H5_PLAYER.setVideoCurrentTime(H5_PLAYER.getDuration()/ 10 * multiple);
            }
        },
        triggerSleep(el, event='click', ms=100) {
            return new Promise((resolve, reject) => {
                if (el && el[0]) {
                    el.trigger(event);
                    setTimeout(resolve, ms);
                } else {
                    reject();
                }
            });
        },
        mode(mode, check=true) {
            const curMode = q(SELECTOR.playerContainer).attr('data-screen');
            if (check && mode == curMode) {
                return;
            }
            switch (mode) {
                case FULLSCREEN: return this.fullscreen();
                case WEBFULLSCREEN: return this.webFullscreen();
                case WIDESCREEN: return this.widescreen();
                case MINI: return q(SELECTOR.playerContainer)[0].setAttribute('data-screen', 'mini');
                case DEFAULT: return curMode == MINI ? q(SELECTOR.playerContainer)[0].setAttribute('data-screen', DEFAULT) : this.mode(curMode, false);
                default: return;
            }
        },
        ultraWidescreen() {
            this.mode(WIDESCREEN);
            UI.ultraWidescreenCss();
        },
        // ---------------
        settingPanel() {
            SETTING_PANEL.switch();
        },
        fullscreen() {
            q(SELECTOR.playerFull).click();
        },
        webFullscreen() {
            q(SELECTOR.playerWeb).click();
        },
        widescreen() {
            q(SELECTOR.playerWide).click();
        },
        subSpeed() {
            H5_PLAYER.subSpeed();
            UI.showHint("速度: " + H5_PLAYER.getPlaybackRate() + "x");
        },
        addSpeed() {
            H5_PLAYER.addSpeed();
            UI.showHint("速度: " + H5_PLAYER.getPlaybackRate() + "x");
        },
        resetSpeed() {
            H5_PLAYER.resetSpeed();
            UI.showHint("速度: " + H5_PLAYER.getPlaybackRate() + "x");
        },
        danmu() {
            q(SELECTOR.dmSwitch).click();
        },
        playAndPause() {
            H5_PLAYER.playAndPause();
        },
        prevPart() {
            q(SELECTOR.playerCtrlPrev).click()
        },
        nextPart() {
            q(SELECTOR.playerCtrlNext).click();
        },
        showDanmuInput() {
            UI.showSenderBar();
            const danmuInput = q(SELECTOR.dmInput);
            if (!q(SELECTOR.dmInputFocus).length) {
                this.triggerSleep(danmuInput, 'mouseover').then(() => {
                    danmuInput.select().click();
                }).catch(() => {});
            }
        },
        hideDanmuInput() {
            UI.hideSenderBar();
            const danmuInput = q(SELECTOR.dmInput);
            this.triggerSleep(danmuInput, 'mouseout').then(() => {
                danmuInput.blur();
                this.focusPlayer();
            }).catch(() => {});
        },
        mirror() {
            UI.setH5PlayerRransform('');
            q(SELECTOR.mirror).click();
        },
        danmuType(selector) {
            q(selector).click();
            const text = q(`${selector} .bpx-player-block-filter-label`).text();
            if (q(`${selector}.bpx-player-active`).length) {
                UI.showHint(`开启${text}`);
            } else {
                UI.showHint(`关闭${text}`);
            }
        },
        danmuTop() {
            this.danmuType(SELECTOR.dmTypeTop);
        },
        danmuBottom() {
            this.danmuType(SELECTOR.dmTypeBottom);
        },
        danmuScroll() {
            this.danmuType(SELECTOR.dmTypeScroll);
        },
        danmuColor() {
            this.danmuType(SELECTOR.dmTypeColor);
        },
        danmuSpecial() {
            this.danmuType(SELECTOR.dmTypeSpecial);
        },
        rotateRight() {
            UI.h5PlayerRotate(1);
        },
        rotateLeft() {
            UI.h5PlayerRotate(-1);
        },
        isLightOff() {
            return q(SELECTOR.lightOff)[0].checked;
        },
        lightOff() {
            q(SELECTOR.lightOff).click();
        },
        light(status) {
            if (status == ON && this.isLightOff()) {
                q(SELECTOR.lightOff).click();
            } else if (status == OFF && !this.isLightOff()) {
                q(SELECTOR.lightOff).click();
            }
        },
        mute() {
            H5_PLAYER.mute();
        },
        scroll2Top() {
            window.scrollTo(0, 0);
        },
        jumpContent() {
            q(SELECTOR.jumpContent).click();
        },
        playerSetOnTop() {
            this.scroll2Top();
            window.scrollTo(0, H5_PLAYER.offsetTop());
        },
        setRepeatStart() {
            REPEAT_CONTROLLER.setRepeatStart();
        },
        setRepeatEnd() {
            REPEAT_CONTROLLER.setRepeatEnd();
        },
        resetRepeat() {
            REPEAT_CONTROLLER.resetRepeat();
        },
        subVolume() {
            H5_PLAYER.subVolume();
            UI.showHint(`${Math.ceil(H5_PLAYER.getVolume() * 100)}%`, false);
        },
        addVolume() {
            H5_PLAYER.addVolume();
            UI.showHint(`${Math.ceil(H5_PLAYER.getVolume() * 100)}%`, false);
        },
        subProgress() {
            H5_PLAYER.subProgress();
        },
        addProgress() {
            H5_PLAYER.addProgress();
        },
        // ---------------
    };
    const AUTOMATON = {
        playerCheckbox: {
            options: {
                hideSenderBar: { text: '隐藏弹幕栏', status: ON, fn: 'hideOrShowSenderBar', tips: '发弹幕快捷键可显示' },
                widescreenScroll2Top: { text: '宽屏时回到顶部', status: OFF, ban:['widescreenPlayerSetOnTop'], fn: 'setWidescreenPos' },
                widescreenPlayerSetOnTop: { text: '宽屏时播放器置顶部', status: ON, ban:['widescreenScroll2Top'], fn: 'setWidescreenPos' },
                lightOffWhenPlaying: { text: '播放时自动关灯', status: OFF, },
                lightOnWhenPause: { text: '暂停时自动开灯', status: OFF, },
                screenWhenPause: { text: '暂停还原屏幕', status: OFF, },
                ultraWidescreen: { text: '超宽屏', status: ON, fn: 'ultraWidescreen', tips: '宽屏模式宽度和窗口一样'},
                bottomTitle: { text: '标题位于播放器下方', status: ON, tips: '刷新生效' },
            },
            btn: '播放器设置',
        },
        startCheckbox: {
            options: {
                lightOff: { text: '自动关灯', status: OFF },
                webFullscreen: { text: '自动网页全屏', status: OFF, ban:['widescreen'] },
                widescreen: { text: '自动宽屏', status: ON, ban:['webFullscreen'] },
                highQuality: { text: '自动最高画质', status: ON, ban:['vipHighQuality'] },
                vipHighQuality: { text: '自动最高画质(大会员使用)', status: OFF, ban:['highQuality'] },
                vipHighQualityNot4K: { text: '自动最高画质不选择4K', status: OFF },
                moreDescribe: { text: '自动展开视频简介', status: ON },
            },
            btn: '播放前自动设置',
        },
        endCheckbox: {
            options: {
                lightOn: { text: '播放结束自动开灯', status: ON, tips: '还有下一P不触发' },
                exitScreen: { text: '播放结束还原屏幕', status: ON, ban:['exit2WideScreen'], tips: '还有下一P不触发' },
                exit2WideScreen: { text: '播放结束还原宽屏', status: OFF, ban:['exitScreen'], tips: '还有下一P不触发' },
                autoJumpContent: { text: '跳过充电鸣谢', status: ON },
            },
            btn: '播放结束自动设置',
        },
        checkPlayingSetting(key) {
            return STORAGE.checkPlayingSetting(key, this.startCheckbox.options[key].status);
        },
        checkPlayerSetting(key) {
            return STORAGE.checkPlayerSetting(key, this.playerCheckbox.options[key].status);
        },
        checkEndedSetting(key) {
            return STORAGE.checkEndedSetting(key, this.endCheckbox.options[key].status);
        },
        trigger(mutation, target) {
            if (target.hasClass('bpx-player-control-bottom-right')) {
                if (mutation.addedNodes[0].className == 'bpx-player-ctrl-btn bpx-player-ctrl-quality') {
                    this.videoQuality();
                } else if (mutation.addedNodes.length == 1 && mutation.addedNodes[0].className.indexOf('bpx-player-ctrl-full') > 0) {
                    this.playStartMode();
                }
            } else if (target.hasClass('bpx-player-state-buff-icon')) {
                UI.rConCss();
            }
        },
        attributesTrigger() {
            this.adjustUI();
        },
        adjustUI() {
            this.checkPlayerSetting('ultraWidescreen') && UI.ultraWidescreenCss();
            if (this.checkPlayerSetting('widescreenScroll2Top') && UI.isWide()) {
                CONTROLLER.scroll2Top();
            } else if (this.checkPlayerSetting('widescreenPlayerSetOnTop') && UI.isWide()) {
                CONTROLLER.playerSetOnTop();
            }
            UI.rConCss();
        },
        init() {
            window.addEventListener('resize', () => {
                this.adjustUI();
            });

            H5_PLAYER.addEventListener('loadeddata', () => {
                this.checkPlayerSetting('hideSenderBar') && UI.hideSenderBar();
                this.checkPlayerSetting('bottomTitle') && UI.bottomTitle();
                this.checkPlayingSetting('moreDescribe') && this.moreDescribe();
                this.playStartMode();
            });
            H5_PLAYER.addEventListener('timeupdate', () => {
                REPEAT_CONTROLLER.check() && REPEAT_CONTROLLER.start();
            });
            H5_PLAYER.addPlayingEvent(() => {
                if (!H5_PLAYER.played) {
                    this.checkPlayingSetting('lightOff') && CONTROLLER.light(OFF);
                }
                this.checkPlayerSetting('lightOffWhenPlaying') && CONTROLLER.light(OFF);
                H5_PLAYER.played = true;
            });

            H5_PLAYER.addPauseEvent(() => {
                this.checkPlayerSetting('lightOnWhenPause') && CONTROLLER.light(ON);
                this.checkPlayerSetting('screenWhenPause') && CONTROLLER.mode(DEFAULT);
            });

            H5_PLAYER.addEndedEvent(() => {
                this.checkEndedSetting('lightOn') && CONTROLLER.light(ON);
                this.checkEndedSetting('autoJumpContent') && CONTROLLER.jumpContent();

                if (this.checkEndedSetting('exitScreen')) {
                    CONTROLLER.mode(DEFAULT);
                } else if (this.checkEndedSetting('exit2WideScreen')) {
                    CONTROLLER.mode(WIDESCREEN);
                }
            });

        },
        playStartMode() {
            if (this.checkPlayingSetting('webFullscreen')) {
                CONTROLLER.mode(WEBFULLSCREEN);
            } else if (this.checkPlayingSetting('widescreen')) {
                CONTROLLER.mode(WIDESCREEN);
            }
        },
        videoQuality() {
            if (!this.checkPlayingSetting('highQuality') && !this.checkPlayingSetting('vipHighQuality')) {
                return;
            }
            const btn = q(SELECTOR.videoQuality);
            let index = -1;
            if (this.checkPlayingSetting('highQuality')) {
                index = btn.findIndex(e => !q(e).find(SELECTOR.vipVideoQuality)[0]);
            } else if (this.checkPlayingSetting('vipHighQualityNot4K')) {
                index = btn.findIndex(e => !e.textContent.includes('4K'))
            }
            index > -1 && btn[index].click();
        },
        moreDescribe() {
            q(SELECTOR.moreDescribe).click();
        }
    };
    const STORAGE = {
        version: 'v1',
        getDefaultShortCutStatus(key, defaultValue) {
            return this.get('defaultShortCut', key, defaultValue);
        },
        getQuickDoKey(quickDoKey, defaultValue) {
            return this.get('quickDo', quickDoKey, defaultValue);
        },
        getControllerConfigStatus(key, defaultValue) {
            return this.get('controllerConfig', key, defaultValue);
        },
        checkPlayingSetting(key, defaultValue) {
            return this.get('startCheckbox', key, defaultValue) === ON;
        },
        checkPlayerSetting(key, defaultValue) {
            return this.get('playerCheckbox', key, defaultValue) === ON;
        },
        checkEndedSetting(key, defaultValue) {
            return this.get('endCheckbox', key, defaultValue) === ON;
        },
        gmKey(configName, key) {
            return `${this.version}:${configName}:${key}`;
        },
        get(configName, key, defaultValue) {
            if (GM_getValue(this.gmKey(configName, key)) == undefined) {
                return defaultValue;
            }
            return GM_getValue(this.gmKey(configName, key));
        },
        save(configName, key, value) {
            GM_setValue(this.gmKey(configName, key), value);
        },
    };
    const SETTING_PANEL = {
        init() {
            this.newSettingPanel();
            ['playerCheckbox', 'startCheckbox', 'endCheckbox'].forEach(configName => {
                for (let [key, { text, status, ban, fn, tips }] of Object.entries(AUTOMATON[configName].options)) {
                    this.addCheckboxSettingItem(configName, key, text, status, ban, fn, tips);
                }
            });
            for (let [key, { value, text }] of Object.entries(CONTROLLER.quickDo)) {
                this.addInputSettingItem('quickDo', key, value, text);
            }
            for (let [key, { text, status, tips }] of Object.entries(CONTROLLER.config)) {
                this.addCheckboxSettingItem('controllerConfig', key, text, status, null, null, null);
            }
            for (let [key, { text, status, bindKey }] of Object.entries(KEY_BOARD.defaultShortCut)) {
                this.addCheckboxSettingItem("defaultShortCut", key, `屏蔽${text}`, status, null, null, null);
            }

        },
        newSettingPanel() {
            const id = 'qd-setting-panel';
            const araeId = id + '-area'
            const colseId = id + '-close'
            const html = `
            <div id='${id}' style="height: 500px;width: 800px;color: #fff;border-radius: 4px;position: absolute;text-align: center;z-index: 80;-webkit-font-smoothing: antialiased;background-color: rgba(33,33,33,.9);left: 50%;top: 50%;-webkit-transform: translate(-50%,-50%);transform: translate(-50%,-50%);">
                <div style="font-size: 16px;text-align: center;line-height: 40px;border-bottom: 1px solid hsla(0,0%,100%,.1);">
                    bilibili H5播放器快捷操作设置 <span id='${colseId}' style="float: right;margin-right: 10px;"> X </span>
                </div>
                <div id='${araeId}' class="bpx-player-hotkey-panel-area" style="touch-action: pan-x; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);min-height: 430px;padding-left: 35px;">
                    <div class="bpx-player-hotkey-panel-content" style="transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1); transition-duration: 0ms; transform: translate(0px, 0px) scale(1) translateZ(0px);">
                    </div>
                </div>
            </div>
            `;
            q(SELECTOR.playerVideoArea).append(html);
            this.settingPanel = q(`#${id}`);
            this.settingPanelArea = q(`#${araeId}`);
            q(`#${colseId}`).on('click', () => {
                this.close();
            })
            this.close();
        },
        addCheckboxSettingItem(configName, key, text, status, ban, fn, tips) {
            const checked = STORAGE.get(configName, key, status) == ON ? 'checked' : '';
            const checkboxId = `${configName}-${key}-box`;
            let item = `
            <div style="min-width: 185px;float: left;height: 24px;line-height: 24px;text-align: left;">
                <span>
                <input id="${checkboxId}" type="checkbox" ${checked}></input>
                </span>
                <span>${text}</span>
            </div>`
            this.settingPanelArea.append(item);
            q(`#${checkboxId}`).on('click', function(e) {
                STORAGE.save(configName, key, this.checked ? ON : OFF);
            });
        },
        addInputSettingItem(configName, key, value, text) {
            const inputId = `${configName}-${key}-input`;
            const val = STORAGE.get(configName, key, value);
            let item = `
            <div style="min-width: 185px;float: left;height: 24px;line-height: 24px;text-align: left;">
                <span>
                <input id="${inputId}" type="input" value="${val}" style="width: 35px;height: 12px;color: black;text-align: center;"></input>
                </span>
                <span>${text}</span>
            </div>`
            this.settingPanelArea.append(item);
            const input = q(`#${inputId}`);
            input.on('keydown', e => {
                const isGlobalHotKey = KEY_BOARD.isGlobalHotKey(e.keyCode);
                const key = isGlobalHotKey || e.key.toLowerCase();
                const isA2Z = e.keyCode >= 65 && e.keyCode <= 90;
                const isSymbol = "[]\\;',./-=".indexOf(key) > -1;
                if ((isGlobalHotKey || isA2Z || isSymbol || e.keyCode === KEY_BOARD.keyCode.enter) && KEY_BOARD.getKeyCode(key)) {
                    input.val(key);
                }
                const isDelete = e.keyCode == 8 || e.keyCode == 46;
                (!isDelete || isGlobalHotKey) && e.preventDefault();
            }).on('keyup', e => {
                STORAGE.save(configName, key, input.val());
            }).on('click', e => {
                input.select();
                e.preventDefault();
            });
        },
        show() {
            this.settingPanel.css('display', '');
        },
        close() {
            this.settingPanel.css('display', 'none');
        },
        switch() {
            this.settingPanel.getCss('display') == 'none' ? this.show() : this.close();
        }
    };
    new MutationObserver((mutations, observer) => {
        mutations.forEach(mutation => {
            const target = q(mutation.target);
            if (target.hasClass('fixed-header')) {
                UI.removeFixedHeader();
            }
            if (target.hasClass('header-v2')) {
                if (H5_PLAYER.h5Player) {
                    H5_PLAYER.played = false;
                    return;
                }
                try {
                    H5_PLAYER.init();
                    CONTROLLER.initKeyDown();
                    AUTOMATON.init();
                    SETTING_PANEL.init();
                    console.log('bilibili-quickdo done');
                } catch (e) {
                    console.error('bilibili-quickdo init error:', e);
                }
            } else if (target.hasClass('bpx-player-sending-bar') && mutation.addedNodes.length) {
                CONTROLLER.bindDanmuInputKeydown();
            } else {
                AUTOMATON.trigger(mutation, target);
            }
        });
    }).observe(document.body, {
        childList: true,
        subtree: true,
    });
    new MutationObserver((mutations, observer) => {
        AUTOMATON.attributesTrigger();
    }).observe(document.body, {
        attributes: true,
    });
})();