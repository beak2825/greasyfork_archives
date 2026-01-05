// ==UserScript==
// @name        Youtube UI Fix
// @namespace   YtUIFix
// @description Moves the controls under the video and makes the UI look like it was before august 2015
// @author      Roy Scheerens
// @homepageURL https://greasyfork.org/en/scripts/11485
// @include     https://www.youtube.com*
// @include     https://youtube.com*
// @include     https://youtube.googleapis.com/embed*
// @include     https://www.youtube-nocookie.com/embed*
// @version     2.4.16
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/11485/Youtube%20UI%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/11485/Youtube%20UI%20Fix.meta.js
// ==/UserScript==
var YtNewUIFix = /** @class */ (function () {
    function YtNewUIFix() {
        var _this = this;
        this.prefix = "ytfix::";
        this.isEmbedded = window.top !== window.self;
        this.isSettingsPage = window.location.href.toLowerCase().match("(\\.com\\/embed|\\.com)\\/ui_fix_options") !== null;
        document.body.classList.add("yt-ui-fix");
        this.readOptions();
        addEventListener("storage", function (e) {
            if (e.key && e.key.indexOf(_this.prefix) >= 0) {
                _this.readOptions();
                _this.showOptions();
                _this.addCSS();
                _this.handleWatchLater();
            }
        });
    }
    YtNewUIFix.prototype.readOptions = function () {
        this.setOption("addWatchLater", true);
        this.setOption("showControlsFullscreen", true);
        this.setOption("showControlsNonFullscreen", true);
        this.setOption("changeColorsFullscreen", true);
        this.setOption("changeColorsNonFullscreen", true);
        this.setOption("removeAnimations", false);
        this.setOption("optionsReversed", false);
        this.setOption("progressBigger", false);
        this.setOption("alwaysVolume", false);
    };
    YtNewUIFix.prototype.applyFix = function () {
        var _this = this;
        if (document.body.innerHTML.length === 0) {
            // empty page can be ignored (in share tab before it's active)
            return;
        }
        if (!this.isSettingsPage) {
            this.addCSS();
            this.checkMoviePlayer();
            window.setInterval(function () {
                _this.checkMoviePlayer();
                _this.handleWatchLater();
            }, 1000);
        }
        this.addOptions();
    };
    YtNewUIFix.prototype.setOption = function (key, defaultVal) {
        if (!localStorage) {
            this[key] = defaultVal;
        }
        var result = this.getSetting(key);
        if (result) {
            this[key] = (result === "true");
        }
        else {
            this[key] = defaultVal;
        }
    };
    YtNewUIFix.prototype.getSetting = function (key) {
        return localStorage.getItem(this.prefix + key);
    };
    YtNewUIFix.prototype.setSetting = function (key, value) {
        localStorage.setItem(this.prefix + key, String(value));
    };
    YtNewUIFix.prototype.checkMoviePlayer = function () {
        if (!this.moviePlayer || !this.moviePlayer.parentNode) {
            this.moviePlayer = document.querySelector(".html5-video-player");
        }
        if (this.moviePlayer && this.moviePlayer.parentNode) {
            if (!this.moviePlayer.classList.contains("seeking-mode") &&
                !this.moviePlayer.classList.contains("dragging-mode") &&
                (this.showControlsNonFullscreen && !this.moviePlayer.classList.contains("ytp-fullscreen") || this.showControlsFullscreen && this.moviePlayer.classList.contains("ytp-fullscreen"))) {
                var video = this.moviePlayer.querySelector("video");
                var progressBarWidthsCollection_1 = this.moviePlayer.querySelectorAll(".ytp-progress-bar-padding");
                if (video && progressBarWidthsCollection_1) {
                    var totalProgressBarWidth = 0;
                    for (var i = 0; i < progressBarWidthsCollection_1.length; i++) {
                        totalProgressBarWidth += progressBarWidthsCollection_1[i].offsetWidth;
                    }
                    var durationWidthRatio_1 = video.duration / totalProgressBarWidth;
                    var updateProgress = function (progressBarChaptersCollection, progress) {
                        if (progressBarChaptersCollection) {
                            // loop inside chapters
                            var chaptersPixelWidthUntilCurrentChapter = 0;
                            for (var i = 0; i < progressBarWidthsCollection_1.length; i++) {
                                if (progress > durationWidthRatio_1 * (chaptersPixelWidthUntilCurrentChapter + progressBarWidthsCollection_1[i].offsetWidth)) {
                                    progressBarChaptersCollection[i].style.transform = "scaleX(1)";
                                    chaptersPixelWidthUntilCurrentChapter += progressBarWidthsCollection_1[i].offsetWidth;
                                }
                                else {
                                    var currentTimeInChapterInSeconds = progress - (durationWidthRatio_1 * chaptersPixelWidthUntilCurrentChapter);
                                    var currentChapterLengthInSeconds = durationWidthRatio_1 * progressBarWidthsCollection_1[i].offsetWidth;
                                    var currentChapterTimeRatio = currentTimeInChapterInSeconds / currentChapterLengthInSeconds;
                                    progressBarChaptersCollection[i].style.transform = "scaleX(" + currentChapterTimeRatio + ")";
                                    break;
                                }
                            }
                        }
                    };
                    var buff = video.buffered;
                    updateProgress(this.moviePlayer.querySelectorAll(".ytp-play-progress"), video.currentTime);
                    if (buff.length > 0) {
                        updateProgress(this.moviePlayer.querySelectorAll(".ytp-load-progress"), buff.end(buff.length - 1));
                    }
                    else {
                        updateProgress(this.moviePlayer.querySelectorAll(".ytp-load-progress"), 0);
                    }
                    var currentTime = this.moviePlayer.querySelector(".ytp-time-current");
                    if (currentTime) {
                        currentTime.innerText = this.prettifyVideoTime(video);
                    }
                }
            }
        }
    };
    YtNewUIFix.prototype.prettifyVideoTime = function (video) {
        var seconds = "" + Math.floor(video.currentTime % 60);
        var minutes = "" + Math.floor((video.currentTime % 3600) / 60);
        var hours = "" + Math.floor(video.currentTime / 3600);
        if (video.currentTime / 60 > 60) {
            return hours + ":" + minutes.padStart(2, '0') + ":" + seconds.padStart(2, '0');
        }
        else {
            return minutes + ":" + seconds.padStart(2, '0');
        }
    };
    YtNewUIFix.prototype.handleWatchLater = function () {
        if (!this.watchLaterbutton || !this.settingsButton) {
            this.watchLaterbutton = document.querySelector(".ytp-chrome-top .ytp-watch-later-button");
            if (!this.watchLaterbutton)
                return;
            this.settingsButton = document.querySelector(".ytp-settings-button");
            if (this.watchLaterbutton && this.watchLaterbutton.parentElement) {
                this.oldWatchParent = this.watchLaterbutton.parentElement;
            }
        }
        if (this.watchLaterbutton && this.settingsButton) {
            if (this.addWatchLater && this.settingsButton.parentNode) {
                if (this.watchLaterbutton.parentNode !== this.settingsButton.parentNode) {
                    this.settingsButton.parentNode.insertBefore(this.watchLaterbutton, this.settingsButton);
                }
            }
            else {
                this.oldWatchParent.appendChild(this.watchLaterbutton);
            }
        }
    };
    YtNewUIFix.prototype.addCSS = function () {
        var css = "";
        var StyleId = "YoutubeNewUIFix-Style";
        css = this.fixColors(css);
        css = this.fixControls(css);
        css = this.fixBigMode(css);
        css = this.addExtras(css);
        var style = document.getElementById(StyleId);
        if (style && style.parentNode) {
            style.parentNode.removeChild(style);
        }
        style = document.createElement("style");
        style.id = StyleId;
        style.textContent = css;
        document.head.appendChild(style);
    };
    YtNewUIFix.prototype.fixControls = function (css) {
        // options
        css += "h3.optionChanged::after { content: 'Refresh page to save changes'; color: red; position: relative; left: 15px; }\n\n";
        css += ".account-content-on-player { top: 0px; left: 0px; position: absolute; padding: 0; margin: 0; width: 100%; height: 100% }";
        css += ".account-content-on-player account-section { top: 50px; left: 50px; z-index: 100; background-color: white; padding: 10px 25px 30px; margin: 0; }";
        css += ".html5-video-player.ytp-fullscreen .html5-video-container { height: 100vh; }";
        css += ".html5-video-player:not(.ytp-fullscreen) .html5-video-container { height: 100%; }";
        css += ".ytp-chrome-bottom { left: 0 !important; }\n";
        css += ".ytp-chrome-controls { margin: 0 -12px; }\n";
        css += "body:not(.ytwp-window-player) #page:not(.watch-stage-mode) #watch7-sidebar { transform: translateY(-35px); }\n";
        css += "body:not(.ytwp-window-player) #page.watch-stage-mode #watch-appbar-playlist { margin-top: 35px; }\n";
        css += ".html5-main-video { top: 0!important; }\n";
        //  move content below video down in the material layout
        css += "ytd-watch-flexy[theater] #columns { margin-top: 35px!important; }";
        css += "ytd-watch-flexy:not([theater]) #below { margin-top: 35px!important; }";
        // remove stupid border rounding
        css += "ytd-player { overflow: visible!important; border-radius: 0!important; }";
        // width correction of the controls in the material layout
        css += ".html5-main-video { max-width: 100%; }";
        if (this.isEmbedded) {
            css += ".ytp-watch-later-button { transform: translateY(-3.5px); }";
            css += ".html5-main-video { object-fit: contain!important; }";
        }
        else {
            css += "ytd-watch-flexy[theater] .html5-main-video { object-fit: contain!important; }";
        }
        css += ".ytp-chrome-bottom { max-width: calc(100% - 24px); width: calc(100% - 24px); }";
        // progressbar
        css += ".ytp-progress-bar-container:not(.ytp-pulling) { height: 5px!important; bottom: 30px!important;  }\n";
        css += ".ytp-progress-list { transform-origin: center top; }\n\n";
        css += ".ytp-big-mode .ytp-progress-list { transform: scaleY(0.6); }\n\n";
        // scale down
        css += ".ytp-chrome-bottom { height: 35px!important; padding: 0!important; }\n";
        css += ".ytp-chrome-controls .ytp-button:not(.ytp-chapter-title):not(.ytp-watch-later-button) { width: 33px!important; }\n";
        css += ".ytp-chrome-controls .ytp-watch-later-icon { width: 24px!important; height: 24px!important; }\n";
        css += ".ytp-chrome-controls .ytp-watch-later-button { opacity: 1!important; width: 24px!important; display: inline-block!important; }\n";
        css += ".ytp-left-controls { margin-left: 5px }\n";
        css += ".ytp-time-display { height: 31px; line-height: 32px!important; font-size: 12px!important; }\n";
        css += ".ytp-left-controls, .ytp-right-controls { height: 32px!important; margin-top: 3px; line-height: 36px; }\n\n";
        // badges
        css += ".ytp-settings-button.ytp-hd-quality-badge::after,.ytp-settings-button.ytp-4k-quality-badge::after,.ytp-settings-button.ytp-5k-quality-badge::after,.ytp-settings-button.ytp-8k-quality-badge::after { content:''!important; top:6px!important; right:4px!important; height:9px!important; width:13px!important; padding: 0!important; }\n";
        css += ".ytp-settings-button.ytp-hd-quality-badge:after { background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAwJSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTMgOSIgd2lkdGg9IjEwMCUiPjxwYXRoIGQ9Ik01LDcgTDYsNyBMNiw4IEw1LDggTDUsNyBaIE0xMCwzIEwxMCw0IEw4LDQgTDgsMyBMMTAsMyBaIE0zLDYgTDMsNSBMNSw1IEw1LDYgTDMsNiBaIE0yLDcgTDMsNyBMMyw4IEwyLDggTDIsNyBaIE03LDcgTDEwLDcgTDEwLDggTDcsOCBMNyw3IFogTTEwLDYgTDExLDYgTDExLDcgTDEwLDcgTDEwLDYgWiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjY0NzEiIGZpbGwtcnVsZT0iZXZlbm9kZCIgLz48cGF0aCBkPSJNNSw3IEw1LDYgTDUsNSBMMyw1IEwzLDYgTDMsNyBMMiw3IEwyLDIgTDMsMiBMMyw0IEw1LDQgTDUsMiBMNiwyIEw2LDcgTDUsNyBaIE0xMSw2IEwxMCw2IEwxMCw3IEw3LDcgTDcsMiBMMTAsMiBMMTAsMyBMMTEsMyBMMTEsNiBaIE0xMCw0IEwxMCwzIEw4LDMgTDgsNCBMOCw2IEwxMCw2IEwxMCw0IFoiIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgLz48L3N2Zz4=)!important; }";
        css += ".ytp-settings-button.ytp-4k-quality-badge:after { background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAwJSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTMgOSIgd2lkdGg9IjEwMCUiPjxwYXRoIGQ9Ik0xMCw0IEwxMSw0IEwxMSw1IEwxMCw1IEwxMCw0IFogTTEwLDcgTDExLDcgTDExLDggTDEwLDggTDEwLDcgWiBNOCw1IEwxMCw1IEwxMCw2IEw4LDYgTDgsNSBaIE03LDcgTDgsNyBMOCw4IEw3LDggTDcsNyBaIE01LDYgTDYsNiBMNiw3IEw1LDcgTDUsNiBaIE00LDcgTDUsNyBMNSw4IEw0LDggTDQsNyBaIE0yLDYgTDQsNiBMNCw3IEwyLDcgTDIsNiBaIE0zLDQgTDQsNCBMNCw1IEwzLDUgTDMsNCBaIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuNjQ3MSIgZmlsbC1ydWxlPSJldmVub2RkIiAvPjxwYXRoIGQ9Ik0xMSw1IEwxMSw3IEwxMCw3IEwxMCw2IEwxMCw1IEwxMSw1IFogTTEwLDUgTDgsNSBMOCw2IEw4LDcgTDcsNyBMNywyIEw4LDIgTDgsNCBMMTAsNCBMMTAsNSBaIE00LDQgTDMsNCBMMyw1IEw0LDUgTDQsNCBaIE00LDcgTDQsNiBMMiw2IEwyLDQgTDMsNCBMMywzIEw0LDMgTDQsMiBMNSwyIEw1LDUgTDYsNSBMNiw2IEw1LDYgTDUsNyBMNCw3IFogTTEwLDIgTDExLDIgTDExLDQgTDEwLDQgTDEwLDIgWiIgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==)!important; }";
        css += ".ytp-settings-button.ytp-5k-quality-badge:after { background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAwJSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTMgOSIgd2lkdGg9IjEwMCUiPjxwYXRoIGQ9Ik0xMCw0IEwxMSw0IEwxMSw1IEwxMCw1IEwxMCw0IFogTTEwLDcgTDExLDcgTDExLDggTDEwLDggTDEwLDcgWiBNOCw1IEwxMCw1IEwxMCw2IEw4LDYgTDgsNSBaIE03LDcgTDgsNyBMOCw4IEw3LDggTDcsNyBaIE01LDYgTDYsNiBMNiw3IEw1LDcgTDUsNiBaIE0yLDcgTDUsNyBMNSw4IEwyLDggTDIsNyBaIE0yLDUgTDUsNSBMNSw2IEwyLDYgTDIsNSBaIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuNjQ3MSIgZmlsbC1ydWxlPSJldmVub2RkIiAvPjxwYXRoIGQ9Ik0xMSw1IEwxMSw3IEwxMCw3IEwxMCw2IEwxMCw1IEwxMSw1IE0xMCw1IEw4LDUgTDgsNiBMOCw3IEw3LDcgTDcsMiBMOCwyIEw4LDQgTDEwLDQgTDEwLDUgTTEwLDIgTDExLDIgTDExLDQgTDEwLDQgTDEwLDIgTTIsNiBMNSw2IEw1LDcgTDIsNyBNNSw1IEw2LDUgTDYsNiBMNSw2IE01LDQgTDMsNCBMMywzIEw2LDMgTDYsMiBMMiwyIEwyLDUgTDUsNSBMNSw0IFoiIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgLz48L3N2Zz4=)!important; }";
        css += ".ytp-settings-button.ytp-8k-quality-badge:after { background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAwJSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTMgOSIgd2lkdGg9IjEwMCUiPjxwYXRoIGQ9Ik0xMCw0IEwxMSw0IEwxMSw1IEwxMCw1IEwxMCw0IFogTTEwLDcgTDExLDcgTDExLDggTDEwLDggTDEwLDcgWiBNOCw1IEwxMCw1IEwxMCw2IEw4LDYgTDgsNSBaIE03LDcgTDgsNyBMOCw4IEw3LDggTDcsNyBaIE01LDYgTDYsNiBMNiw3IEw1LDcgTDUsNiBaIE0zLDUgTDUsNSBMNSw2IEwzLDYgTDMsNSBaIE0zLDMgTDUsMyBMNSw0IEwzLDQgTDMsMyBaIE01LDQgTDYsNCBMNiw1IEw1LDUgTDUsNCBaIE0yLDQgTDMsNCBMMyw1IEwyLDUgTDIsNCBaIE0yLDYgTDMsNiBMMyw3IEwyLDcgTDIsNiBaIE0zLDcgTDUsNyBMNSw4IEwzLDggTDMsNyBaIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuNjQ3MSIgZmlsbC1ydWxlPSJldmVub2RkIiAvPjxwYXRoIGQ9Ik0xMSw1IEwxMSw3IEwxMCw3IEwxMCw2IEwxMCw1IEwxMSw1IE0xMCw1IEw4LDUgTDgsNiBMOCw3IEw3LDcgTDcsMiBMOCwyIEw4LDQgTDEwLDQgTDEwLDUgTTEwLDIgTDExLDIgTDExLDQgTDEwLDQgTDEwLDIgTTMsNiBMNSw2IEw1LDcgTDMsNyBNMywyIEw1LDIgTDUsMyBMMywzIEwzLDIgWiBNNSw1IEw2LDUgTDYsNiBMNSw2IEw1LDUgWiBNMyw0IEw1LDQgTDUsNSBMMyw1IEwzLDQgWiBNNSwzIEw2LDMgTDYsNCBMNSw0IEw1LDMgWiBNMiw1IEwzLDUgTDMsNiBMMiw2IEwyLDUgWiBNMiwzIEwzLDMgTDMsNCBMMiw0IEwyLDMgWiIgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==)!important; }";
        css += ".ytp-settings-button.ytp-3d-badge-grey:after,.ytp-settings-button.ytp-3d-badge:after { background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAwJSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTMgOSIgd2lkdGg9IjEwMCUiPjxwYXRoIGQ9Ik0yIDJoNHY1aC00di0xaDN2LTFoLTN2LTFoM3YtMWgtM3pNNyAyaDN2MWgtMnYzaDJ2MWgtM3pNMTAgM2gxdjNoLTF6IiBmaWxsPSIjZmZmIiAvPjxwYXRoIGQ9Ik0yIDNoM3YxaC0zek04IDNoMnYxaC0yek0yIDVoM3YxaC0zek0xMCA2aDF2MWgtMXpNMiA3aDR2MWgtNHpNNyA3aDN2MWgtM3oiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC42NDcxIiAvPjwvc3ZnPg==)!important; }";
        css += ".ytp-color-white .ytp-settings-button.ytp-hd-quality-badge:after { background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAwJSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTMgOSIgd2lkdGg9IjEwMCUiPjxwYXRoIGQ9Ik01LDcgTDUsNiBMNSw1IEwzLDUgTDMsNiBMMyw3IEwyLDcgTDIsMiBMMywyIEwzLDQgTDUsNCBMNSwyIEw2LDIgTDYsNyBMNSw3IFogTTExLDYgTDEwLDYgTDEwLDcgTDcsNyBMNywyIEwxMCwyIEwxMCwzIEwxMSwzIEwxMSw2IFogTTEwLDQgTDEwLDMgTDgsMyBMOCw0IEw4LDYgTDEwLDYgTDEwLDQgWiIgZmlsbC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==)!important; }";
        css += ".ytp-color-white .ytp-settings-button.ytp-4k-quality-badge:after { background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAwJSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTMgOSIgd2lkdGg9IjEwMCUiPjxwYXRoIGQ9Ik0xMSw1IEwxMSw3IEwxMCw3IEwxMCw2IEwxMCw1IEwxMSw1IFogTTEwLDUgTDgsNSBMOCw2IEw4LDcgTDcsNyBMNywyIEw4LDIgTDgsNCBMMTAsNCBMMTAsNSBaIE00LDQgTDMsNCBMMyw1IEw0LDUgTDQsNCBaIE00LDcgTDQsNiBMMiw2IEwyLDQgTDMsNCBMMywzIEw0LDMgTDQsMiBMNSwyIEw1LDUgTDYsNSBMNiw2IEw1LDYgTDUsNyBMNCw3IFogTTEwLDIgTDExLDIgTDExLDQgTDEwLDQgTDEwLDIgWiIgZmlsbC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==)!important; }";
        css += ".ytp-color-white .ytp-settings-button.ytp-5k-quality-badge:after { background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAwJSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTMgOSIgd2lkdGg9IjEwMCUiPjxwYXRoIGQ9Ik0xMSw1IEwxMSw3IEwxMCw3IEwxMCw2IEwxMCw1IEwxMSw1IE0xMCw1IEw4LDUgTDgsNiBMOCw3IEw3LDcgTDcsMiBMOCwyIEw4LDQgTDEwLDQgTDEwLDUgTTEwLDIgTDExLDIgTDExLDQgTDEwLDQgTDEwLDIgTTIsNiBMNSw2IEw1LDcgTDIsNyBNNSw1IEw2LDUgTDYsNiBMNSw2IE01LDQgTDMsNCBMMywzIEw2LDMgTDYsMiBMMiwyIEwyLDUgTDUsNSBMNSw0IFoiIGZpbGwtcnVsZT0iZXZlbm9kZCIgLz48L3N2Zz4=)!important; }";
        css += ".ytp-color-white .ytp-settings-button.ytp-8k-quality-badge:after { background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAwJSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTMgOSIgd2lkdGg9IjEwMCUiPjxwYXRoIGQ9Ik0xMSw1IEwxMSw3IEwxMCw3IEwxMCw2IEwxMCw1IEwxMSw1IE0xMCw1IEw4LDUgTDgsNiBMOCw3IEw3LDcgTDcsMiBMOCwyIEw4LDQgTDEwLDQgTDEwLDUgTTEwLDIgTDExLDIgTDExLDQgTDEwLDQgTDEwLDIgTTMsNiBMNSw2IEw1LDcgTDMsNyBNMywyIEw1LDIgTDUsMyBMMywzIEwzLDIgWiBNNSw1IEw2LDUgTDYsNiBMNSw2IEw1LDUgWiBNMyw0IEw1LDQgTDUsNSBMMyw1IEwzLDQgWiBNNSwzIEw2LDMgTDYsNCBMNSw0IEw1LDMgWiBNMiw1IEwzLDUgTDMsNiBMMiw2IEwyLDUgWiBNMiwzIEwzLDMgTDMsNCBMMiw0IEwyLDMgWiIgZmlsbC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==)!important; }";
        css += ".ytp-color-white .ytp-settings-button.ytp-3d-badge-grey:after,.ytp-color-white .ytp-settings-button.ytp-3d-badge:after { background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAwJSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTMgOSIgd2lkdGg9IjEwMCUiPjxwYXRoIGQ9Ik0yIDJoNHY1aC00di0xaDN2LTFoLTN2LTFoM3YtMWgtM3pNNyAyaDN2MWgtMnYzaDJ2MWgtM3pNMTAgM2gxdjNoLTF6IiBmaWxsPSIjMDAwIiAvPjwvc3ZnPg==)!important; }";
        // closed captions (line under the button, and position of captions)
        css += ".ytp-chrome-controls .ytp-button[aria-pressed='true']::after { width: 18px; left: 8px; }\n";
        css += ".caption-window.ytp-caption-window-bottom {	margin-bottom:40px!important }\n";
        css += ".ytp-player-content { top: 48px !important; bottom: 49px !important; }\n";
        // fix watch later messing up embedded
        css += ".ytp-chrome-bottom .ytp-watch-later-title { display: none; }\n";
        if (this.isEmbedded && this.addWatchLater) {
            css += ".ytp-watch-later-button { margin: 0!important; }\n";
        }
        return css;
    };
    YtNewUIFix.prototype.fixBigMode = function (css) {
        /* big mode: smaller scrubber */
        css += ".ytp-big-mode .ytp-scrubber-button { height: 13px!important; width: 13px!important; border-radius: 6.5px!important; }\n";
        css += ".ytp-big-mode .ytp-scrubber-container { top: -4px; left: -6.5px; }\n\n";
        /* big mode: 24px edges instead of 12px */
        css += ".ytp-big-mode .ytp-left-controls { margin-left: -7px }\n";
        css += ".ytp-big-mode .ytp-fullscreen-button { margin-right: -7px }\n\n";
        /* big mode: smaller volume slider */
        css += ".ytp-big-mode .ytp-volume-slider-handle { width: 12px; height: 12px; border-radius: 6px; margin-top: -6px; }\n";
        css += ".ytp-big-mode .ytp-volume-slider-active .ytp-volume-panel { width: 72px; }\n\n";
        /* big mode: smaller auto nav */
        css += ".ytp-big-mode .ytp-autonav-toggle-button { height: 14.4px!important; width: 36px!important; border-radius: 14.4px!important; }\n";
        css += ".ytp-big-mode .ytp-autonav-toggle-button::after { height: 20.4px!important; width: 20.4px!important; border-radius: 20.4px!important; margin-top: -3px!important; }\n\n";
        /* padding around volume should be 0 2 */
        css += ".ytp-button.ytp-mute-button { padding: 0 2px!important; }\n\n";
        return css;
    };
    YtNewUIFix.prototype.fixColors = function (css) {
        if (this.changeColorsNonFullscreen) {
            css += ".html5-video-player:not(.ytp-big-mode) .ytp-chrome-bottom { background-color: #1B1B1B; border-left: 12px solid #1B1B1B; border-right: 12px solid #1B1B1B; }\n";
            css += ".html5-video-player:not(.ytp-big-mode) .ytp-gradient-bottom { display: none!important; }\n";
            css += ".html5-video-player:not(.ytp-big-mode) .ytp-chrome-controls svg path { fill: #8E8E8E }\n";
        }
        else {
            css += ".html5-video-player:not(.ytp-big-mode) .ytp-chrome-bottom { border-left: 12px solid transparent; border-right: 12px solid transparent; }\n";
            if (this.showControlsNonFullscreen) {
                css += ".html5-video-player:not(.ytp-fullscreen) .ytp-gradient-bottom { display: none!important; }\n";
            }
        }
        if (this.changeColorsFullscreen) {
            css += ".ytp-big-mode .ytp-chrome-bottom { background-color: #1B1B1B; border-left: 24px solid #1B1B1B; border-right: 24px solid #1B1B1B; }\n";
            css += ".ytp-big-mode .ytp-gradient-bottom { display: none!important; }\n";
            css += ".ytp-big-mode .ytp-chrome-controls svg path { fill: #8E8E8E }\n";
        }
        else {
            css += ".ytp-big-mode .ytp-chrome-bottom { border-left: 24px solid transparent; border-right: 24px solid transparent; }\n";
            if (this.showControlsFullscreen) {
                css += ".html5-video-player.ytp-fullscreen .ytp-gradient-bottom { display: none!important; }\n";
            }
        }
        css += ".ytp-gradient-top { display: none!important; }\n";
        css += "\n";
        return css;
    };
    YtNewUIFix.prototype.addExtras = function (css) {
        if (this.showControlsFullscreen) {
            css += "html:not(.floater):not(.iri-always-visible) .html5-video-player.ytp-fullscreen:not(.ytp-hide-controls) .html5-main-video  { height: calc(100% - 35px)!important; min-height: calc(100% - 35px) !important; max-height: calc(100% - 35px) !important; }\n";
            css += ".html5-video-player.ytp-fullscreen:not(.ytp-hide-controls) .ytp-chrome-bottom { opacity: 1!important; display: block!important; }\n";
        }
        if (this.showControlsNonFullscreen) {
            css += "html:not(.floater):not(.iri-always-visible) .html5-video-player:not(.ytp-fullscreen):not(.ytp-hide-controls) .html5-main-video  { height: calc(100% - 35px)!important; min-height: calc(100% - 35px) !important; max-height: calc(100% - 35px) !important; }\n";
            css += ".html5-video-player:not(.ytp-fullscreen):not(.ytp-hide-controls) .ytp-chrome-bottom { opacity: 1!important; display: block!important; }\n";
            if (!this.isEmbedded) {
                css += "html:not(.floater):not(.iri-always-visible):not(.part_fullbrowser) #movie_player:not(.ytp-fullscreen):not(.ytp-hide-controls) { height: calc(100% + 35px)!important; }\n";
            }
            css += "html.floater .html5-video-player, html.iri-always-visible .html5-video-player { padding-bottom: 35px; }\n";
            css += "#theater-background { padding-bottom: 35px; }\n\n";
            css += "#placeholder-player { padding-bottom: 35px; }\n";
        }
        if (!this.showControlsFullscreen && !this.showControlsNonFullscreen) {
            css += ".html5-video-player .html5-main-video  { height: 100%!important; }\n";
        }
        if (this.removeAnimations) {
            css += ".ytp-bezel { display: none!important; }\n";
            css += ".html5-endscreen *, .html5-video-player div { transition-property: none !important; animation: none !important; }\n";
        }
        if (this.optionsReversed) {
            css += ".ytp-panel { display: -webkit-flex; -webkit-flex-direction: column; display: flex; flex-direction: column; }\n";
            css += ".ytp-panel-header { order: 2; border-top: 1px solid #444; border-bottom: none; }\n";
            css += ".ytp-panel-content { order: 1; }\n";
        }
        if (this.alwaysVolume) {
            /* Have the volume slider always be visible */
            css += ".ytp-volume-panel { width: 52px; margin-right: 3px; } .ytp-big-mode .ytp-volume-panel { width: 78px; }";
        }
        if (this.progressBigger) {
            /* Make the progressbar fill up the entire space when not hovering over (thanks to Takato) */
            css += "              .ytp-progress-bar-container:not(:hover):not(.ytp-pulling) .ytp-chapter-hover-container:not(.ytp-exp-chapter-hover-container) .ytp-progress-list { width: calc(100% + 24px); left: -12px; }";
            css += ".ytp-big-mode .ytp-progress-bar-container:not(:hover):not(.ytp-pulling) .ytp-chapter-hover-container:not(.ytp-exp-chapter-hover-container) .ytp-progress-list { width: calc(100% + 48px); left: -24px; }";
        }
        return css;
    };
    YtNewUIFix.prototype.showOptions = function () {
        var options = document.querySelectorAll("#YoutubeNewUIFix-Options input");
        if (options.length > 0) {
            for (var i = 0; i < options.length; i++) {
                options[i].checked = (this.getSetting(options[i].name) === "true");
            }
        }
    };
    YtNewUIFix.prototype.addOptions = function () {
        var _this = this;
        if (localStorage) {
            var accSection_1 = document.createElement("div");
            accSection_1.id = "YoutubeNewUIFix-Options";
            accSection_1.classList.add("account-section");
            var header = document.createElement("h3");
            header.classList.add("account-section-header");
            header.textContent = "Youtube UI Fix Options";
            accSection_1.appendChild(header);
            {
                accSection_1.appendChild(this.createOption("addWatchLater", "Add the watch later button to the controls"));
                accSection_1.appendChild(this.createOption("changeColorsNonFullscreen", "Change the colors back to their original gray (in non-full-screen mode)"));
                accSection_1.appendChild(this.createOption("changeColorsFullscreen", "Change the colors back to their original gray in full-screen mode"));
                accSection_1.appendChild(this.createOption("showControlsNonFullscreen", "Always show the controls (in non-full-screen mode)"));
                accSection_1.appendChild(this.createOption("showControlsFullscreen", "Always show the controls in full-screen mode"));
                accSection_1.appendChild(this.createOption("removeAnimations", "Remove all animations"));
                accSection_1.appendChild(this.createOption("optionsReversed", "Move the 'go back' button in the settings menus to the bottom"));
                accSection_1.appendChild(this.createOption("progressBigger", "Make the progressbar take up the whole width (but not when hovering over)"));
                accSection_1.appendChild(this.createOption("alwaysVolume", "Have the volume slider be always visible"));
            }
            var content = document.querySelector(".account-content");
            var footer = document.querySelector(".account-footer");
            var selectedItem = document.querySelector(".creator-sidebar-item.selected");
            if (!content) {
                content = document.querySelector("#contents");
                if (!content) {
                    return;
                }
            }
            if (!selectedItem) {
                selectedItem = document.querySelector(".ytd-settings-sidebar-renderer[active]");
            }
            if (this.isSettingsPage) {
                document.head.innerHTML = document.body.innerHTML = "";
                document.body.appendChild(accSection_1);
            }
            else if (content && selectedItem.innerHTML.indexOf("Playback") >= 0) {
                if (footer) {
                    content.insertBefore(accSection_1, footer);
                }
                else {
                    content.appendChild(accSection_1);
                }
            }
            var exportBtn_1 = document.createElement("button");
            exportBtn_1.classList.add("yt-uix-button", "yt-uix-button-size-default", "yt-uix-button-primary", "account-action-button");
            exportBtn_1.type = "button";
            exportBtn_1.textContent = "Export Settings";
            exportBtn_1.onclick = function () {
                var settingsScript = "// ==UserScript==\n";
                settingsScript += "// @name        Youtube UI Fix Settings\n";
                settingsScript += "// @namespace   YtUIFix\n";
                settingsScript += "// @description Sets the settings for Youtube UI Fix\n";
                settingsScript += "// @author      Roy Scheerens\n";
                settingsScript += "// @homepageURL https://greasyfork.org/en/scripts/11485\n";
                settingsScript += "// @include     https://www.youtube.com*\n";
                settingsScript += "// @include     https://youtube.googleapis.com/embed*\n";
                settingsScript += "// @include     https://www.youtube-nocookie.com/embed*\n";
                settingsScript += "// @version     0.0.1\n";
                settingsScript += "// @grant       none\n";
                settingsScript += "// ==/UserScript==\n";
                settingsScript += "\n";
                settingsScript += "localStorage.setItem('ytfix::addWatchLater',              String(" + String(_this["addWatchLater"]) + "));\n";
                settingsScript += "localStorage.setItem('ytfix::showControlsFullscreen',     String(" + String(_this["showControlsFullscreen"]) + "));\n";
                settingsScript += "localStorage.setItem('ytfix::showControlsNonFullscreen',  String(" + String(_this["showControlsNonFullscreen"]) + "));\n";
                settingsScript += "localStorage.setItem('ytfix::changeColorsFullscreen',     String(" + String(_this["changeColorsFullscreen"]) + "));\n";
                settingsScript += "localStorage.setItem('ytfix::changeColorsNonFullscreen',  String(" + String(_this["changeColorsNonFullscreen"]) + "));\n";
                settingsScript += "localStorage.setItem('ytfix::removeAnimations',           String(" + String(_this["removeAnimations"]) + "));\n";
                settingsScript += "localStorage.setItem('ytfix::optionsReversed',            String(" + String(_this["optionsReversed"]) + "));\n";
                settingsScript += "localStorage.setItem('ytfix::progressBigger',             String(" + String(_this["progressBigger"]) + "));\n";
                settingsScript += "localStorage.setItem('ytfix::alwaysVolume',               String(" + String(_this["alwaysVolume"]) + "));\n";
                var hiddenText = accSection_1.getElementsByTagName("textarea")[0] || document.createElement("textarea");
                hiddenText.textContent = settingsScript;
                accSection_1.appendChild(hiddenText);
                hiddenText.select();
                document.execCommand("cut");
                accSection_1.removeChild(hiddenText);
                exportBtn_1.innerHTML = "Settings Userscipt Copied";
            };
            if (footer) {
                footer.appendChild(exportBtn_1);
            }
            else {
                content.appendChild(exportBtn_1);
            }
        }
    };
    YtNewUIFix.prototype.createOption = function (name, description) {
        var _this = this;
        var accDiv = document.createElement("div");
        accDiv.classList.add("account-section-setting");
        accDiv.innerHTML = "\n\t\t    <label style=\"font-size: 13px\">\n\t\t\t    <span class='yt-uix-form-input-checkbox-container " + (this[name] ? "checked" : "") + "'>\n                    <input class='yt-uix-form-input-checkbox' name='" + name + "' " + (this[name] ? "checked='checked'" : "") + " type='checkbox'>\n                    <span class='yt-uix-form-input-checkbox-element'></span>\n                </span>\n\t\t\t    " + description + "\n\t\t    </label>";
        var accInput = accDiv.querySelector("input[name='" + name + "']");
        accInput.onclick = function () {
            _this.setSetting(name, accInput.checked);
            _this[name] = accInput.checked;
        };
        return accDiv;
    };
    return YtNewUIFix;
}());
new YtNewUIFix().applyFix();
