// ==UserScript==
// @name         BilibiliTimer - B站H5播放器全屏下实时显示当前系统时间和播放进度
// @version      3.4.4
// @description  B站H5播放器全屏模式下实时显示当前系统时间和播放进度
// @author       AnnAngela
// @namespace    https://greasyfork.org/users/129402
// @mainpage     https://greasyfork.org/zh-CN/scripts/30367-bilibilitimer
// @supportURL   https://greasyfork.org/zh-CN/scripts/30367-bilibilitimer/feedback
// @license      GNU General Public License v3.0 or later
// @compatible   chrome 80
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/video/BV*
// @match        *://www.bilibili.com/html/*layer.htm*
// @match        *://www.bilibili.com/blackboard/*layer.htm*
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://www.bilibili.com/medialist/play/watchlater*
// @match        *://live.bilibili.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @icon         https://public.annangela.cn/script/Bilibili.png
// @icon64       https://public.annangela.cn/script/Bilibili.png
// @downloadURL https://update.greasyfork.org/scripts/30367/BilibiliTimer%20-%20B%E7%AB%99H5%E6%92%AD%E6%94%BE%E5%99%A8%E5%85%A8%E5%B1%8F%E4%B8%8B%E5%AE%9E%E6%97%B6%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E7%B3%BB%E7%BB%9F%E6%97%B6%E9%97%B4%E5%92%8C%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/30367/BilibiliTimer%20-%20B%E7%AB%99H5%E6%92%AD%E6%94%BE%E5%99%A8%E5%85%A8%E5%B1%8F%E4%B8%8B%E5%AE%9E%E6%97%B6%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E7%B3%BB%E7%BB%9F%E6%97%B6%E9%97%B4%E5%92%8C%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6.meta.js
// ==/UserScript==
/* eslint-disable require-atomic-updates */
"use strict";
(() => {
    /* 防止重复加载 */
    if (unsafeWindow.BilibiliTimer) { return; }

    const multiValueKeys = ["exclude", "grant", "include", "match", "require", "resource"];
    const booleanValueKeys = ["noframes"];
    const script = {
        scriptMeta: {},
    };
    let GM4Detected = false;
    try {
        if (Object.prototype.toString.bind(GM)() === "[object Object]") {
            GM4Detected = true;
        } else {
            GM4Detected = false;
        }
    } catch (_) {
        GM4Detected = false;
    }
    script.scriptMetaStr = (GM4Detected ? GM.info : GM_info).scriptMetaStr;
    script.scriptMetaStr.split(/\n+/).forEach((str) => {
        const string = str.replace(/^\s*\/\/\s*/, "");
        const _temp = string.match(/^@([a-z\d:-]+) +(.+)$/i);
        if (!_temp) { return; }
        const key = _temp[1],
            value = _temp[2].trim();
        if (multiValueKeys.includes(key)) {
            if (script.scriptMeta[key]) {
                script.scriptMeta[key].push(value);
            } else {
                script.scriptMeta[key] = [value];
            }
        } else if (booleanValueKeys.includes(key)) {
            script.scriptMeta[key] = true;
        } else {
            script.scriptMeta[key] = value;
        }
    });
    /* eslint-disable require-await */
    script.addStyle = GM4Detected ? GM.addStyle : async (...args) => { return GM_addStyle(...args); };
    script.getValue = GM4Detected ? GM.getValue : async (...args) => { return GM_getValue(...args); };
    script.setValue = GM4Detected ? GM.setValue : async (...args) => { return GM_setValue(...args); };
    /* eslint-enable require-await */

    unsafeWindow.BilibiliTimerUninit = false;
    unsafeWindow.BilibiliTimer = {};
    const code = async function code() {
        if (unsafeWindow.BilibiliTimerUninit || !unsafeWindow.jQuery) { return false; }
        if (!String.prototype.includes) {
            String.prototype.includes = function includes(s) {
                return this.indexOf(s) !== -1;
            };
        }
        unsafeWindow.BilibiliTimer = {};
        unsafeWindow.BilibiliTimer._loop_count = 0;
        unsafeWindow.BilibiliTimer.date = function bilibiliPlayerDate() {
            const _date = new Date();
            ["getDate", "getFullYear", "getHours", "getMilliseconds", "getMinutes", "getMonth", "getSeconds", "getTime", "getUTCDate", "getUTCFullYear", "getUTCHours", "getUTCMilliseconds", "getUTCMinutes", "getUTCMonth", "getUTCSeconds", "getYear"].forEach((key) => {
                _date[key] = (...a) => {
                    let result = Date.prototype[key].apply(_date, a);
                    if (key.includes("Month")) { result++; }
                    if (typeof result === "number" && `${result}`.length === 1) { return `0${result}`; }
                    return `${result}`;
                };
            });
            return _date;
        };
        let isEmbedded;
        try {
            isEmbedded = location.host === "www.bilibili.com" && ["/blackboard/html5player.html", "/blackboard/player.html"].includes(location.pathname) && top !== window && top.location.host.includes("bilibili.com");
        } catch (_) {
            isEmbedded = false;
        }
        unsafeWindow.BilibiliTimer.isEmbedded = isEmbedded;
        unsafeWindow.BilibiliTimer.realWindow = isEmbedded ? top : window;
        unsafeWindow.BilibiliTimer.isNewPlayPage = (location.pathname.match(/\/video\/av(\d+)/) || [0, -1])[1] !== -1 && parseInt((document.cookie.match(/stardustvideo=(-?[0-9]+)/i) || [0, "-1"])[1]) > 0 || (location.pathname.match(/\/bangumi\/play\/ep(\d+)/) || [0, -1])[1] !== -1 && document.cookie.includes("stardustpgcv") && document.cookie.match(/stardustpgcv=(-?\d+)/)[1] === "0606";
        unsafeWindow.BilibiliTimer.isNewBangumiPlayPage = (location.pathname.match(/\/bangumi\/play\/ep(\d+)/) || [0, -1])[1] !== -1 && document.cookie.includes("stardustpgcv") && document.cookie.match(/stardustpgcv=(-?\d+)/)[1] === "0606";
        unsafeWindow.BilibiliTimer.isLive = function bilibiliIsLive(a, b) {
            return location.host === "live.bilibili.com" ? a !== undefined ? a : true : b !== undefined ? b : false;
        };
        unsafeWindow.BilibiliTimer.selector = unsafeWindow.BilibiliTimer.isLive(
            {
                container: ".bilibili-live-player-video-area",
                controller: ".bilibili-live-player-video-controller",
                fullscreenSendbar: null,
                autoHideCheck: null,
            },
            {
                container: ".bilibili-player-video-wrap, .bpx-player-video-wrap",
                controller: ".bilibili-player-video-control, .squirtle-controller",
                fullscreenSendbar: ".bilibili-player-video-sendbar.active, .bpx-player-sending-bar.active",
                autoHideCheck: ".bilibili-player-no-cursor, .bpx-state-no-cursor",
            },
        );
        unsafeWindow.BilibiliTimer.selector.fullscreen = (function () {
            try {
                unsafeWindow.document.querySelector(":fullscreen"); // Let's try the standard selector
                return ":fullscreen";
            } catch {
                // Just keep going
            }
            try {
                unsafeWindow.document.querySelector(":-webkit-full-screen"); // Maybe we should try webkit prefix
                return ":-webkit-full-screen";
            } catch {
                // Just keep going
            }
            try {
                unsafeWindow.document.querySelector(":-moz-full-screen"); // Or firefox prefix
                return ":-moz-full-screen";
            } catch {
                // Just keep going
            }
            try {
                unsafeWindow.document.querySelector(":-ms-fullscreen"); // Why you still using IE¿
                return ":-ms-fullscreen";
            } catch {
                // Well, I think we should give up
                console.error("BilibiliTimer: Believe it or not, there's no selector which can bring us the fullscreen node.");
                if (unsafeWindow.BilibiliTimer && unsafeWindow.BilibiliTimer.uninit) { unsafeWindow.BilibiliTimer.uninit(); }
                unsafeWindow.BilibiliTimerUninit = true;
            }
        })();
        unsafeWindow.BilibiliTimer.classList = unsafeWindow.BilibiliTimer.isLive(
            {
                timer: "bilibili-live-player-video-info-container",
                closeButton: "bilibili-live-player-video-info-close",
                panel: "bilibili-live-player-video-info-panel",
                restartButton: "live-icon-reload",
            },
            {
                timer: "bilibili-player-video-info-container bpx-player-info-container",
                closeButton: "bilibili-player-video-info-close bpx-player-info-close",
                panel: "bilibili-player-video-info-panel bpx-player-info-panel",
                restartButton: "bilibili-player-iconfont icon-24repeaton",
            },
        );
        unsafeWindow.BilibiliTimer.setting = await script.getValue("setting", {
            on: ["SystemTime", "Track", "BufferTime", "CurrentPageAndWatchlater", "Watchlater"],
            off: [],
        });
        $("body").attr("data-bilibiliTimerSettingOn", unsafeWindow.BilibiliTimer.setting.on.join(","));
        unsafeWindow.BilibiliTimer.closeButtonText = unsafeWindow.BilibiliTimer.isLive("x", "[×]");
        unsafeWindow.BilibiliTimer.smallModeButtonText = unsafeWindow.BilibiliTimer.isLive("_", "[＿]");
        unsafeWindow.BilibiliTimer.globallock = false;
        unsafeWindow.BilibiliTimer.widthSet = false;
        unsafeWindow.BilibiliTimer.onResizing = 0;
        if (unsafeWindow.BilibiliTimer.selector.autoHideCheck) { unsafeWindow.BilibiliTimer.mousemoveCount = 0; }
        unsafeWindow.BilibiliTimer.getControllerTop = function BilibiliTimerGetControllerTop() {
            const controller = $(unsafeWindow.BilibiliTimer.selector.controller);
            if (controller.closest(".mode-miniscreen")[0]) { return $(window).height(); }
            let _top = $(window).height() - controller.height();
            const fullscreenSendbar = $(unsafeWindow.BilibiliTimer.selector.fullscreenSendbar);
            if (fullscreenSendbar[0]) { _top -= fullscreenSendbar.outerHeight(true); }
            return _top;
        };
        $(window).on("resize.BilibiliTimer", () => {
            try {
                unsafeWindow.BilibiliTimer.onResizing = 1;
            } catch (e) { /* */ }
        });
        $(document).on({
            "mousemove.BilibiliTimer": function (e) {
                if (unsafeWindow.BilibiliTimer && unsafeWindow.BilibiliTimer.timer) {
                    if (unsafeWindow.BilibiliTimer.onMousedown) {
                        const maxTop = unsafeWindow.BilibiliTimer.getControllerTop() - unsafeWindow.BilibiliTimer.timer.outerHeight() - 10;
                        const maxLeft = $(window).width() - unsafeWindow.BilibiliTimer.timer.outerWidth() - 10;
                        unsafeWindow.BilibiliTimer.timer.css({
                            left: Math.max(Math.min(unsafeWindow.BilibiliTimer.timer.data("baseOffset").left + e.clientX, maxLeft), 10),
                            top: Math.max(Math.min(unsafeWindow.BilibiliTimer.timer.data("baseOffset").top + e.clientY, maxTop), 10),
                        });
                        unsafeWindow.getSelection().removeAllRanges();
                    }
                    if (unsafeWindow.BilibiliTimer.selector.autoHideCheck) { unsafeWindow.BilibiliTimer.mousemoveCount = 0; }
                }
            },
            "mouseup.BilibiliTimer": function () {
                if (unsafeWindow.BilibiliTimer && unsafeWindow.BilibiliTimer.timer && unsafeWindow.BilibiliTimer.onMousedown) {
                    unsafeWindow.BilibiliTimer.onMousedown = false;
                    unsafeWindow.BilibiliTimer.timer.removeClass("dragging");
                    script.setValue("offset", {
                        top: unsafeWindow.BilibiliTimer.timer.css("top"),
                        left: unsafeWindow.BilibiliTimer.timer.css("left"),
                    });
                }
            },
        });
        unsafeWindow.BilibiliTimer.template = {};
        const timer = unsafeWindow.BilibiliTimer.template.timer = $("<div/>");
        timer.attr("id", "BilibiliTimer").addClass(unsafeWindow.BilibiliTimer.classList.timer);
        const closeButton = unsafeWindow.BilibiliTimer.template.closeButton = $("<a/>");
        closeButton.text(unsafeWindow.BilibiliTimer.closeButtonText).attr({
            href: "javascript:void(0);",
            id: "BilibiliTimerCloseButton",
        });
        closeButton.addClass(unsafeWindow.BilibiliTimer.classList.closeButton);
        const restartButton = unsafeWindow.BilibiliTimer.template.restartButton = $("<a/>");
        restartButton.attr({
            href: "javascript:void(0);",
            id: "BilibiliTimerRestartButton",
            title: "如果发现浮窗出现问题，\n例如无法正常拖动，无法正常显示时间等，\n请点击该按钮重建浮窗尝试修复！",
        });
        restartButton.addClass(unsafeWindow.BilibiliTimer.classList.closeButton).addClass(unsafeWindow.BilibiliTimer.classList.restartButton);
        const smallModeButton = unsafeWindow.BilibiliTimer.template.smallModeButton = $("<a/>");
        smallModeButton.text(unsafeWindow.BilibiliTimer.smallModeButtonText).attr({
            href: "javascript:void(0);",
            id: "BilibiliTimerSmallModeButton",
            title: "点击切换显示模式",
        });
        smallModeButton.addClass(unsafeWindow.BilibiliTimer.classList.closeButton);
        const panel = unsafeWindow.BilibiliTimer.template.panel = $("<div/>");
        panel.addClass(unsafeWindow.BilibiliTimer.classList.panel);
        panel.append('<div class="info-line BilibiliTimerDisplayInlineInSmallMode" id="BilibiliTimerSystemTime"><span class="info-title">系统时间：</span><span class="info-data" id="BilibiliTimerNowTime"> - </span></div>');
        panel.append(unsafeWindow.BilibiliTimer.isLive('<div class="info-line BilibiliTimerDisplayInlineInSmallMode" id="BilibiliTimerTrack"><span class="info-title">缓冲质量：</span><span class="info-data">当前缓冲时长 <span id="BilibiliTimerVideoBufferedTimeRange"> - </span>s</span></div>', '<div class="info-line BilibiliTimerDisplayInlineInSmallMode" id="BilibiliTimerTrack"><span class="info-title">播放进度：</span><span class="info-data"><span id="BilibiliTimerVideoTime"> - </span><span class="BilibiliTimerHideInSmallMode">（已播放<span id="BilibiliTimerVideoTimePercents"> - </span>%）</span></span></div><div class="info-line BilibiliTimerDisplayInlineInSmallMode" id="BilibiliTimerBufferTime"><span class="info-title">加载进度：</span><span class="info-data"><span class="BilibiliTimerHideInSmallMode"><span id="BilibiliTimerVideoBufferedTime"> - </span>（剩余</span>缓冲时长 <span id="BilibiliTimerVideoBufferedTimeRange"> - </span>s<span class="BilibiliTimerHideInSmallMode">，已缓冲<span id="BilibiliTimerVideoBufferedTimePercents"> - </span>%）</span></span></div>'));
        unsafeWindow.BilibiliTimer.init = async function BilibiliTimerInit() {
            if (unsafeWindow.BilibiliTimerUninit) { return false; }
            if (!$(unsafeWindow.BilibiliTimer.selector.container)[0] && ++unsafeWindow.BilibiliTimer._loop_count > 150) { return unsafeWindow.BilibiliTimer.uninit(); }
            unsafeWindow.BilibiliTimer.onResizing = 0;
            unsafeWindow.BilibiliTimer.widthSet = false;
            unsafeWindow.BilibiliTimer.timer = unsafeWindow.BilibiliTimer.template.timer.clone();
            unsafeWindow.BilibiliTimer.closeButton = unsafeWindow.BilibiliTimer.template.closeButton.clone();
            unsafeWindow.BilibiliTimer.restartButton = unsafeWindow.BilibiliTimer.template.restartButton.clone();
            unsafeWindow.BilibiliTimer.smallModeButton = unsafeWindow.BilibiliTimer.template.smallModeButton.clone();
            unsafeWindow.BilibiliTimer.panel = unsafeWindow.BilibiliTimer.template.panel.clone();
            unsafeWindow.BilibiliTimer.timer.append(unsafeWindow.BilibiliTimer.closeButton).append(unsafeWindow.BilibiliTimer.restartButton).append(unsafeWindow.BilibiliTimer.smallModeButton).append(unsafeWindow.BilibiliTimer.panel);
            (function loop(BilibiliTimer, $) {
                if (BilibiliTimer.isNewPlayPage && [
                    $("#arc_toolbar_report > .ops > .like").text(),
                    $("#arc_toolbar_report > .ops > .coin, #toolbar_module .coin-info span").text(),
                    $("#arc_toolbar_report > .ops > .collect").text(),
                ].includes("--")) {
                    return setTimeout(loop, 200, BilibiliTimer, $);
                }
            })(unsafeWindow.BilibiliTimer, $);
            unsafeWindow.BilibiliTimer.timer.on("mousedown", (e) => {
                const baseX = Math.max(e.clientX, 0);
                const baseY = Math.max(e.clientY, 0);
                const baseOffsetX = Math.max(parseInt(unsafeWindow.BilibiliTimer.timer.css("left")), 0);
                const baseOffsetY = Math.max(parseInt(unsafeWindow.BilibiliTimer.timer.css("top")), 0);
                unsafeWindow.BilibiliTimer.timer.data("baseOffset", {
                    left: baseOffsetX - baseX,
                    top: baseOffsetY - baseY,
                });
                unsafeWindow.BilibiliTimer.onMousedown = true;
                unsafeWindow.BilibiliTimer.timer.addClass("dragging");
            });
            unsafeWindow.BilibiliTimer.closeButton.on("click", () => {
                unsafeWindow.BilibiliTimer.globallock = true;
                unsafeWindow.BilibiliTimer.timer.dequeue().clearQueue().css({
                    opacity: "0",
                    "pointer-events": "none",
                }).delay(370).queue(() => {
                    timer.hide().dequeue();
                });
                return false;
            });
            unsafeWindow.BilibiliTimer.restartButton.on("click", () => {
                unsafeWindow.BilibiliTimer.restart("User order", "");
                return false;
            });
            unsafeWindow.BilibiliTimer.smallModeButton.on("click", () => {
                $("body").toggleClass("BilibiliTimerSmallMode");
                localStorage.setItem("BilibiliTimerSmallMode", $("body").is(".BilibiliTimerSmallMode") ? "true" : "false");
                return false;
            });
            if (localStorage.getItem("BilibiliTimerSmallMode") === "true") {
                $("body").addClass("BilibiliTimerSmallMode");
            }
            if (!await script.getValue("offset")) {
                unsafeWindow.BilibiliTimer.timer.css({
                    left: "auto",
                    right: "10px",
                    top: "10px",
                });
            } else { unsafeWindow.BilibiliTimer.timer.css(await script.getValue("offset")); }
            $(unsafeWindow.BilibiliTimer.selector.container).append(unsafeWindow.BilibiliTimer.timer);
            $(window).resize();
        };
        unsafeWindow.BilibiliTimer.globalWatcher = async function BilibiliTimerGlobalWatcher() {
            if (unsafeWindow.BilibiliTimerUninit) { return false; }
            const timer = unsafeWindow.BilibiliTimer.timer;
            if (!timer || !timer[0]) {
                unsafeWindow.BilibiliTimer.init();
                return;
            }
            if ($("object#player_placeholder, object#player_object")[0]) {
                unsafeWindow.BilibiliTimer.uninit();
                return;
            }
            if (!timer.closest("body")[0]) {
                unsafeWindow.BilibiliTimer.restart("Timer did not exist in document.body", timer.closest("body")[0]);
                return;
            }
            if (unsafeWindow.BilibiliTimer.realWindow.document.querySelector(unsafeWindow.BilibiliTimer.selector.fullscreen)) {
                if (await script.getValue("autoHidden") && (unsafeWindow.BilibiliTimer.selector.autoHideCheck ? $(unsafeWindow.BilibiliTimer.selector.autoHideCheck)[0] : unsafeWindow.BilibiliTimer.mousemoveCount >= 3)) { unsafeWindow.BilibiliTimer.autoHidden = true; }
                else { unsafeWindow.BilibiliTimer.autoHidden = false; }
                if (!unsafeWindow.BilibiliTimer.globallock && !unsafeWindow.BilibiliTimer.autoHidden) {
                    if (!timer.is(":visible") || timer.css("opacity") !== "1") {
                        timer.dequeue().clearQueue().show().css({
                            opacity: "1",
                            "pointer-events": "auto",
                        });
                    }
                    if (unsafeWindow.BilibiliTimer.onResizing === 2) {
                        unsafeWindow.BilibiliTimer.onResizing = 0;
                        const maxTop = unsafeWindow.BilibiliTimer.getControllerTop() - timer.outerHeight() - 10;
                        const maxLeft = $(window).width() - timer.outerWidth() - 10;
                        timer.css({
                            left: Math.max(Math.min(parseInt(timer.css("left")), maxLeft), 10),
                            top: Math.max(Math.min(parseInt(timer.css("top")), maxTop), 10),
                        });
                        script.setValue("offset", {
                            top: timer.css("top"),
                            left: timer.css("left"),
                        });
                    } else if (unsafeWindow.BilibiliTimer.onResizing === 1) {
                        unsafeWindow.BilibiliTimer.onResizing = 2;
                    }
                    const date = unsafeWindow.BilibiliTimer.date();
                    timer.find("#BilibiliTimerNowTime").html(`<span class="BilibiliTimerHideInSmallMode BilibiliTimerWhiteSpacePre">${date.getFullYear()}-${date.getMonth()}-${date.getDate()} </span>${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
                    if (!unsafeWindow.BilibiliTimer.widthSet) { unsafeWindow.BilibiliTimer.heightCalc(); }
                }
            } else {
                unsafeWindow.BilibiliTimer.onResizing = 0;
                unsafeWindow.BilibiliTimer.globallock = false;
                timer.dequeue().clearQueue().css("opacity", "0").delay(370).queue(() => {
                    timer.hide().dequeue();
                });
            }
            const video = $("video")[0];
            if (!video) {
                unsafeWindow.BilibiliTimer.restart("No Video", null);
                return;
            }
            if (!video.dataset.isTrusted) {
                video.dataset.isTrusted = "true";
                video.addEventListener("timeupdate", unsafeWindow.BilibiliTimer.videoPlayListener);
                video.addEventListener("progress", unsafeWindow.BilibiliTimer.videoProgressListener);
            }
            if ((timer.find("#BilibiliTimerVideoTimePercents").text() + timer.find("#BilibiliTimerVideoBufferedTimeRange").text() + timer.find("#BilibiliTimerVideoTime").text()).includes("-")) {
                unsafeWindow.BilibiliTimer.videoPlayListener({
                    target: video[0],
                });
                unsafeWindow.BilibiliTimer.videoProgressListener({
                    target: video[0],
                });
            }
        };
        unsafeWindow.BilibiliTimer.autoHideWatcher = async function BilibiliTimerAutoHideWatcher() {
            if (!await script.getValue("autoHidden")) { return; }
            if (unsafeWindow.BilibiliTimer.selector.autoHideCheck ? $(unsafeWindow.BilibiliTimer.selector.autoHideCheck)[0] : unsafeWindow.BilibiliTimer.mousemoveCount >= 3) {
                unsafeWindow.BilibiliTimer.autoHidden = true;
                unsafeWindow.BilibiliTimer.timer.dequeue().clearQueue().css("opacity", "0").delay(370).queue(() => {
                    timer.hide().dequeue();
                });
            }
            if (unsafeWindow.BilibiliTimer.selector.autoHideCheck) { unsafeWindow.BilibiliTimer.mousemoveCount++; }
        };
        unsafeWindow.BilibiliTimer.lazyWatcher = function BilibiliTimerLazyWatcher() {
            if (!unsafeWindow.BilibiliTimer || !unsafeWindow.BilibiliTimer.timer) { return; }
            unsafeWindow.BilibiliTimer.heightCalc();
        };
        unsafeWindow.BilibiliTimer.heightCalc = function BilibiliTimerWidthCalc() {
            if (!unsafeWindow.BilibiliTimer || !unsafeWindow.BilibiliTimer.timer) { return; }
            const timer = unsafeWindow.BilibiliTimer.timer;
            timer.find(".info-line").each(function () {
                if ($(this).css("height", "unset").height() === 0) { return; }
                let maxHeight = 0;
                $(this).css("height", "unset").children().each(function () {
                    const _height = $(this).height();
                    if (maxHeight < _height) { maxHeight = _height; }
                });
                $(this).height(maxHeight);
            });
            unsafeWindow.BilibiliTimer.widthSet = true;
            $(window).resize();
        };
        unsafeWindow.BilibiliTimer.timeParse = function BilibiliTimerTimeParse(_time) {
            const time = parseInt(_time);
            let sec = time % 60;
            const min = (time - sec) / 60;
            if (sec < 10) { sec = `0${sec}`; }
            return `${min}:${sec}`;
        };
        unsafeWindow.BilibiliTimer.videoPlayListener = function BilibiliTimerVideoPlayListener(e) {
            if (!e.target) { return; }
            const video = e.target;
            const curTime = video.currentTime || 0;
            const durTime = video.duration || 0;
            if (!curTime && !durTime) { return; }
            if (!unsafeWindow.BilibiliTimer || !unsafeWindow.BilibiliTimer.timer) { return; }
            const timer = unsafeWindow.BilibiliTimer.timer;
            timer.find("#BilibiliTimerVideoTime").text(`${unsafeWindow.BilibiliTimer.timeParse(curTime)} / ${unsafeWindow.BilibiliTimer.timeParse(durTime)}`);
            if (timer.find("#BilibiliTimerVideoBufferedTime")[0]) {
                let end;
                try {
                    end = video.buffered.end(video.buffered.length - 1);
                } catch (_) {
                    try {
                        end = video.buffered.end(0);
                    } catch (_) {
                        return;
                    }
                }
                if (timer.find("#BilibiliTimerVideoBufferedTime").text() === " - ") { $(video).trigger("progress"); }
                timer.find("#BilibiliTimerVideoBufferedTimeRange").text((end - curTime).toFixed(0));
            }
            timer.find("#BilibiliTimerVideoTimePercents").text((curTime * 100 / durTime).toFixed(2));
        };
        unsafeWindow.BilibiliTimer.videoProgressListener = function BilibiliTimerVideoProgressListener(e) {
            if (!e.target) { return; }
            let video = e.target;
            const curTime = video.currentTime || 0;
            const durTime = video.duration || 0;
            if (!curTime && !durTime) { return; }
            if (!unsafeWindow.BilibiliTimer || !unsafeWindow.BilibiliTimer.timer) { return; }
            const timer = unsafeWindow.BilibiliTimer.timer;
            if (timer.find("#BilibiliTimerVideoBufferedTimeRange")[0]) {
                video = e.target;
                let end;
                try {
                    end = video.buffered.end(video.buffered.length - 1);
                } catch (_) {
                    try {
                        end = video.buffered.end(0);
                    } catch (_) {
                        return;
                    }
                }
                if (timer.find("#BilibiliTimerVideoBufferedTimeRange").text() === " - ") { unsafeWindow.BilibiliTimer.widthSet = false; }
                if (timer.find("#BilibiliTimerVideoTime").text() === " - ") { $(video).trigger("timeupdate"); }
                timer.find("#BilibiliTimerVideoBufferedTime").text(unsafeWindow.BilibiliTimer.timeParse(end));
                unsafeWindow.BilibiliTimer.timer.find("#BilibiliTimerVideoBufferedTimeRange").text((end - video.currentTime).toFixed(0));
                timer.find("#BilibiliTimerVideoBufferedTimePercents").text((end * 100 / video.duration).toFixed(2));
            }
            timer.find("#BilibiliTimerVideoTimePercents").text((curTime * 100 / durTime).toFixed(2));
        };
        unsafeWindow.BilibiliTimer.start = function BilibiliTimerStart() {
            if (unsafeWindow.BilibiliTimerUninit) { return false; }
            if (location.host === "bangumi.bilibili.com") { return false; }
            if (!unsafeWindow.BilibiliTimer.interval) { unsafeWindow.BilibiliTimer.interval = {}; }
            if (!unsafeWindow.BilibiliTimer.interval.globalWatcher) { unsafeWindow.BilibiliTimer.interval.globalWatcher = unsafeWindow.setInterval(unsafeWindow.BilibiliTimer.globalWatcher, 100); }
            if (!unsafeWindow.BilibiliTimer.interval.autoHideWatcher) { unsafeWindow.BilibiliTimer.interval.autoHideWatcher = unsafeWindow.setInterval(unsafeWindow.BilibiliTimer.autoHideWatcher, 1e3); }
            if (!unsafeWindow.BilibiliTimer.interval.lazyWatcher) { unsafeWindow.BilibiliTimer.interval.lazyWatcher = unsafeWindow.setInterval(unsafeWindow.BilibiliTimer.lazyWatcher, 5e3); }
            try {
                const video = $("video");
                setTimeout(() => {
                    unsafeWindow.BilibiliTimer.videoPlayListener({
                        target: video[0],
                    });
                    unsafeWindow.BilibiliTimer.videoProgressListener({
                        target: video[0],
                    });
                }, 100);
            } catch (_) {
                return;
            }
        };
        unsafeWindow.BilibiliTimer.restart = function BilibiliTimerRestart(reason, node) {
            for (const i in unsafeWindow.BilibiliTimer.interval) {
                if (unsafeWindow.BilibiliTimer.interval[i]) { unsafeWindow.clearInterval(unsafeWindow.BilibiliTimer.interval[i]); }
            }
            if (unsafeWindow.BilibiliTimerUninit) { return false; }
            const timer = $("#BilibiliTimer");
            if (timer[0]) {
                timer.dequeue().clearQueue().css("opacity", "0").delay(370).queue(() => {
                    unsafeWindow.BilibiliTimer.rebuild(reason, node);
                    timer.hide().dequeue();
                });
            } else { unsafeWindow.BilibiliTimer.rebuild(reason, node); }
        };
        unsafeWindow.BilibiliTimer.rebuild = function BilibiliTimerRebuild(reason, node) {
            console.groupCollapsed("BilibiliTimerRebuildTrace:", reason, node);
            console.trace();
            console.groupEnd();
            unsafeWindow.BilibiliTimer = undefined;
            $("#BilibiliTimer").remove();
            if (unsafeWindow.BilibiliTimerUninit) { return false; }
            setTimeout(() => {
                code();
            }, 0);
        };
        unsafeWindow.BilibiliTimer.uninit = function BilibiliTimerUninit() {
            for (const i in unsafeWindow.BilibiliTimer.interval) {
                if (unsafeWindow.BilibiliTimer.interval[i]) { unsafeWindow.clearInterval(unsafeWindow.BilibiliTimer.interval[i]); }
            }
            $("#BilibiliTimer").remove();
            unsafeWindow.BilibiliTimer = undefined;
            unsafeWindow.BilibiliTimerUninit = true;
        };
        unsafeWindow.BilibiliTimer.start();
    };
    const css = `
        #BilibiliTimer {
            cursor: move;
            display: block;
            width: auto;
            z-index: 68;
        }

        #BilibiliTimer:not(.dragging){            
            transition: all .37s ease-in-out;
        }

        #BilibiliTimer.bpx-player-info-container a {
            color: #fff;
        }

        #BilibiliTimer.bilibili-player-video-info-container .bilibili-player-video-info-panel .info-line,
        #BilibiliTimer.bpx-player-info-container .bpx-player-info-panel .info-line {
            min-width: auto;
            max-width: 320px;
            display: flex;
        }

        #BilibiliTimer.bilibili-player-video-info-container .bilibili-player-video-info-panel .info-line span,
        #BilibiliTimer.bpx-player-info-container .bpx-player-info-panel .info-line span {
            display: inline;
        }

        #BilibiliTimer.bilibili-player-video-info-container .bilibili-player-video-info-panel .info-line>span
        #BilibiliTimer.bpx-player-info-container .bpx-player-info-panel .info-line>span {
            display: inline-block;
        }

        .bilibili-player-no-cursor #BilibiliTimer,
        .bpx-state-no-cursor #BilibiliTimer {
            opacity: .73;
            cursor: none;
        }

        #BilibiliTimer .info-title {
            width: 6em;
            margin: 0;
        }

        #BilibiliTimer .info-data {
            white-space: normal;
            vertical-align: top;
        }

        #BilibiliTimer .info-line:not(.BilibiliTimerDisplayInlineInSmallMode) .info-data {
            width: calc(100% - 6em);
        }

        #BilibiliTimerCloseButton.bilibili-live-player-video-info-close {
            color: rgb(0, 0, 0);
            padding: 0px;
            height: 15px;
            background: rgb(221, 221, 221);
            width: 1em;
            text-align: center;
            top: 8px;
            z-index: 99;
        }

        #BilibiliTimerRestartButton {
            top: auto;
            bottom: 10px;
            z-index: 99;
        }

        .bpx-player-info-container #BilibiliTimerRestartButton {
            bottom: 3px;
            right: 11px;
        }

        .bgray-btn-wrap .BilibiliTimer-hr {
            border-style: inset;
            border-width: 1px;
            margin: 0.5em auto;
            overflow: hidden;
        }

        #arc_toolbar_report>.ops>.more>.more-ops-list {
            width: auto;
        }

        body:not([data-bilibilitimersettingon*="SystemTime"]) #BilibiliTimerSystemTime,
        body:not([data-bilibilitimersettingon*="Track"]) #BilibiliTimerTrack,
        body:not([data-bilibilitimersettingon*="BufferTime"]) #BilibiliTimerBufferTime {
            height: 0 !important;
            overflow: hidden;
            width: 0;
        }

        .bilibili-player-video-info-container .bilibili-player-video-info-close#BilibiliTimerSmallModeButton,
        .bilibili-live-player-video-info-container .bilibili-live-player-video-info-close#BilibiliTimerSmallModeButton {
            right: 28px;
            z-index: 99;
        }

        .bpx-player-info-container .bpx-player-info-close#BilibiliTimerSmallModeButton {
            right: 30px;
            z-index: 99;
        }

        .bpx-player-info-container .icon-24repeaton:before {
            content: "🔄"
        }

        .BilibiliTimerSmallMode #BilibiliTimer {
            padding-right: 54px;
        }

        .BilibiliTimerSmallMode .BilibiliTimerHideInSmallMode,
        .BilibiliTimerSmallMode .BilibiliTimerDisplayInlineInSmallMode .info-title {
            display: none !important;
        }

        .BilibiliTimerSmallMode .BilibiliTimerDisplayInlineInSmallMode {
            display: inline !important;
        }

        .BilibiliTimerSmallMode .BilibiliTimerDisplayInlineInSmallMode:first-child {
            padding-left: 1em;
        }

        .BilibiliTimerSmallMode .BilibiliTimerDisplayInlineInSmallMode+.BilibiliTimerDisplayInlineInSmallMode::before {
            content: " | ";
        }

        .BilibiliTimerWhiteSpacePre {
            white-space: pre;
        }
    `;
    const c = unsafeWindow.setInterval(async () => {
        if (!unsafeWindow.jQuery) { return false; }
        if (!unsafeWindow.document.querySelector(".bilibili-live-player-video-area, .bilibili-player-video-wrap, .bpx-player-video-wrap") || !unsafeWindow.document.querySelector(".bilibili-live-player-video-area, .bilibili-player-video-wrap, .bpx-player-video-wrap").querySelector("video")) { return; }
        if (unsafeWindow.BilibiliTimerUninit || unsafeWindow.BilibiliTimer && unsafeWindow.BilibiliTimer.start) { return unsafeWindow.clearInterval(c); }
        if (/^https:\/\/www\.bilibili\.com\/video\/[ab]v/i.test(location.href) && parseInt((unsafeWindow.document.cookie.match(/stardustvideo=(-?\d+)/) || [0, "-1"])[1]) > 0) {
            if ([
                unsafeWindow.document.querySelector("#arc_toolbar_report > .ops > .like")?.innerText || "--",
                unsafeWindow.document.querySelector("#arc_toolbar_report > .ops > .coin")?.innerText || "--",
                unsafeWindow.document.querySelector("#arc_toolbar_report > .ops > .collect")?.innerText || "--",
            ].includes("--")) { return false; }
        }
        unsafeWindow.console.info(`%c${script.scriptMeta.name}@${script.scriptMeta.version} by ${script.scriptMeta.author} is running!`, `padding: 34px 66px 34px 66px; line-height: 64px; background:url('${script.scriptMeta.icon64}') top left no-repeat; background-position-y: 4px;`);
        script.addStyle(css);
        if (unsafeWindow.top === unsafeWindow.window) {
            const div = document.createElement("div");
            div.id = "BilibiliTimerConfig";
            div.setAttribute("style", "position: fixed; right: 1em; bottom: 1em; background: white; border: 1px solid gray; border-radius: 0.2em; width: 4em; height: 3em; padding: 0.25em; line-height: 1; font-size: 16px; text-align: center; cursor: pointer; display: none;");
            let visibility = await script.getValue("visibility", true) !== false;
            div.innerText = visibility ? "关闭全屏时间进度浮窗" : "开启全屏时间进度浮窗";
            div.addEventListener("click", () => {
                visibility = !visibility;
                script.setValue("visibility", visibility);
                div.innerText = visibility ? "关闭全屏时间进度浮窗" : "开启全屏时间进度浮窗";
                if (visibility) {
                    unsafeWindow.BilibiliTimerUninit = false;
                    unsafeWindow.BilibiliTimer = {};
                    code();
                } else if (unsafeWindow.BilibiliTimer && unsafeWindow.BilibiliTimer.uninit) {
                    unsafeWindow.BilibiliTimer.uninit();
                }
            });
            document.body.append(div);
        }
        unsafeWindow.$("#BilibiliTimerConfig").show();
        code();
    }, 100);
})();