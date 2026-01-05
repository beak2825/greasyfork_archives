// ==UserScript==
// @name        Mini Youtube New UI Fix
// @namespace   MiniYtNewUIFix
// @description Minimalistic version that fixes the new UI to one that resembles old one
// @author      Roy Scheerens
// @homepageURL https://greasyfork.org/en/scripts/11485-youtube-new-ui-fix
// @include     https://www.youtube.com/*
// @include     https://youtube.googleapis.com/embed/*
// @version     1.11.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20207/Mini%20Youtube%20New%20UI%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/20207/Mini%20Youtube%20New%20UI%20Fix.meta.js
// ==/UserScript==
/* Original typescript code: https://mega.nz/#!0MhlRQjY!airlmO84zO-C_a6YgO9U303YSHGi81clEpzwz98-c3E */
var YtNewUIFix = (function () {
    function YtNewUIFix(isEmbedded) {
        this.isEmbedded = isEmbedded;
        this.moviePlayer = document.querySelector("div.html5-video-player");
        var api = document.querySelector(".player-api");
        this.mouseMoveEvent = document.createEvent('Events');
        this.mouseMoveEvent.initEvent("mousemove", true, false);
    }
    YtNewUIFix.prototype.applyFix = function () {
        var _this = this;
        this.addCSS();
        setInterval(function () {
            _this.checkMoviePlayer();
        }, 3000);
    };
    YtNewUIFix.prototype.addCSS = function () {
        var css = document.createElement("style");
        css.id = "YoutubeNewUIFix-Style";
        css.textContent = "/* fixing the colors */\n            .ytp-chrome-bottom { background-color: #1B1B1B!important; opacity: 1!important; }\n            .ytp-chrome-controls svg path { fill: #8E8E8E!important; }\n            .html5-video-player { height: calc(100% + 35px)!important; }\n            .html5-video-content { background-color: black!important; }\n            .ytp-popup, .ytp-panelpopup { background: rgb(28, 28, 28) none repeat scroll 0% 0%!important; }\n\t\t\t.ytp-menuitem:hover:not([aria-disabled=\"true\"]) { background-color: rgb(40, 40, 40) !important; }\n\n\t\t\t/* Fix for youtube+ */\n\t\t\t.html5-video-container { height: unset!important; }\n\n\t\t\t/* fix the scrollbar in the quality menu */\n\t\t\t.ytp-menuitem { line-height: 2; }\n\n            /* moving the content below down, but not when the 'Resize YT To Window Size' script is active (.ytwp-window-player) */\n            body:not(.ytwp-window-player) #watch7-content, body:not(.ytwp-window-player) div.watch-stage-mode #watch7-sidebar { transform: translateY(35px)!important; }\n\n            /* move controls to the right place */\n            .ytp-gradient-bottom, .ytp-gradient-top { display: none!important; }\n            .ytp-chrome-controls { width: calc(100% + 24px)!important; transform: translateX(-12px)!important; }\n\n\t\t\t/* Make title a bit smaller and show on hover */\n\t\t\t.ytp-chrome-top { display: none!important; }\n\n            /* Fix the theater black bars */\n            .watch-stage-mode #theater-background::after { content: ''; height: 35px; bottom: -35px; left: 0px; position: absolute; background-color: black; width: 100%; }\n\n            /* scale down the controls */\n            .ytp-chrome-bottom { transform: translateY(5px)!important; }\n            .ytp-chrome-bottom::before {content: ''; bottom: 0px; top: -1px; left: -12px; right: -12px; position: absolute; background-color: #1B1B1B; z-index: -1000; }\n            .ytp-chrome-controls { height: 31px!important; line-height: 31px!important; font-size: 11px!important; }\n            .ytp-chrome-controls .ytp-button:not(.ytp-play-button):not(.ytp-watch-later-button) { width: 32px!important; }\n            .ytp-play-button { width: 41px!important; }\n            .ytp-progress-bar-container:not(.ytp-pulling) { height: 5px!important; bottom: 35px!important; }\n\t\t\t.ytp-progress-list { transform-origin: center top; }\n\t\t\t.ytp-scrubber-button { height: 13px!important; width: 13px!important; }\n\t\t\t.ytp-time-display { line-height: inherit!important; font-size: 100%!important; }\n\n            /* scale down the controls big mode */\n            .ytp-big-mode .ytp-chrome-bottom { transform: translateY(24px)!important; }\n            .ytp-big-mode .ytp-progress-bar-container { transform: translateY(-19px)!important; }\n            .html5-video-container .ytp-storyboard-framepreview { height: 100%!important; }\n            .ytp-cards-button { top: 0!important } /* needed or else focusing the card will move it under the controls */\n            .html5-main-video, .ytp-storyboard-framepreview-img { max-height: calc(100vh - 35px)!important; } /* vh instead of % because chrome is weird */\n            .ytp-big-mode .ytp-scrubber-button { top: -4px!important; transform: scale(0); }\n\t\t\t.ytp-big-mode ytp-progress-bar-container:hover .ytp-scrubber-button { top: -4px!important; transform: translateX(4px); }\n\t\t\t.ytp-big-mode .ytp-volume-slider-handle { width: 5px; height: 15px; margin-top: -7.5px; }\n\t\t\t.ytp-big-mode .ytp-menuitem-label { padding: 7px 10px; }\n\t\t\t.ytp-big-mode .ytp-contextmenu { font-size: 11px; }\n\n\t\t\t/* move the tooltips and settings down a bit */\n\t\t\t.ytp-tooltip.ytp-bottom, .ytp-settings-menu { bottom: 44px!important; }\n\n            /* Fix the quality badge (red HD rectangle) */\n            .ytp-settings-button.ytp-hd-quality-badge::after,.ytp-settings-button.ytp-4k-quality-badge::after,.ytp-settings-button.ytp-5k-quality-badge::after,.ytp-settings-button.ytp-8k-quality-badge::after\n            {\n    \t        content:''!important;\n    \t        position:absolute!important;\n    \t        top:6px!important;\n    \t        right:4px!important;\n    \t        height:9px!important;\n    \t        width:13px!important;\n    \t        background-color:#f12b24!important;\n    \t        border-radius:1px!important;\n    \t        line-height:normal!important;\n    \t        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTMgOSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4NCiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsLW9wYWNpdHk9IjAuNjQ3MSIgZmlsbD0iIzAwMDAwMCIgZD0iTTUsNyBMNiw3IEw2LDggTDUsOCBMNSw3IFogTTEwLDMgTDEwLDQgTDgsNCBMOCwzIEwxMCwzIFogTTMsNiBMMyw1IEw1LDUgTDUsNiBMMyw2IFogTTIsNyBMMyw3IEwzLDggTDIsOCBMMiw3IFogTTcsNyBMMTAsNyBMMTAsOCBMNyw4IEw3LDcgWiBNMTAsNiBMMTEsNiBMMTEsNyBMMTAsNyBMMTAsNiBaIj48L3BhdGg+DQogIDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI0ZGRkZGRiIgZD0iTTUsNyBMNSw2IEw1LDUgTDMsNSBMMyw2IEwzLDcgTDIsNyBMMiwyIEwzLDIgTDMsNCBMNSw0IEw1LDIgTDYsMiBMNiw3IEw1LDcgWiBNMTEsNiBMMTAsNiBMMTAsNyBMNyw3IEw3LDIgTDEwLDIgTDEwLDMgTDExLDMgTDExLDYgWiBNMTAsNCBMMTAsMyBMOCwzIEw4LDQgTDgsNiBMMTAsNiBMMTAsNCBaIj48L3BhdGg+DQo8L3N2Zz4NCg==')!important;\n    \t        padding: 0!important;\n            }\n\n            /* Fix the red line under the subtitle icon */\n            .ytp-chrome-controls .ytp-button[aria-pressed=\"true\"]::after\n            {\n                width: 17px!important;\n                height: 2px!important;\n                left: 8px!important;\n                bottom: 7px!important;\n            }\n\n            /* Makes sure the captions/subtitles are at the correct height and don't move up and down */\n            .ytp-player-content, .ytp-subtitles-player-content { bottom: 44px!important; }\n\n            /* rules for the options */\n            h3.optionChanged::after { content: 'Refresh page to save changes'; color: red; position: relative; left: 15px; }\n\n            /* no animations */\n            .ytp-bezel { display: none!important; }\n            .html5-endscreen *, .html5-video-player div { transition-property: none !important; animation: none !important; }\n            .videowall-still-image { transform: none !important; }\n\t\t\t";
        document.head.appendChild(css);
    };
    YtNewUIFix.prototype.checkMoviePlayer = function () {
        if (!this.moviePlayer || !this.moviePlayer.parentNode) {
            this.moviePlayer = document.querySelector("div.html5-video-player");
        }
        else if (!this.moviePlayer.classList.contains("seeking-mode")) {
            this.moviePlayer.dispatchEvent(this.mouseMoveEvent);
        }
    };
    return YtNewUIFix;
}());
new YtNewUIFix(window.top != window.self).applyFix();
//# sourceMappingURL=Youtube_New_UI_Fix.user.js.map