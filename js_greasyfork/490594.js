// ==UserScript==
// @name 2014 Cosmic Panda Player
// @namespace github.com/openstyles/stylus
// @namespace userstyles.world/user/tersiswilvin
// @version 1.0.2
// @description Recreates the cosmic panda player for 2014 player.
// @author TersisWilvin
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/490594/2014%20Cosmic%20Panda%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/490594/2014%20Cosmic%20Panda%20Player.meta.js
// ==/UserScript==

(function() {
let css = `
    @-webkit-keyframes ytp-fade {
        0% {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @keyframes ytp-fade {
        0% {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    .html5-video-player {
        cursor: pointer;
    }
    .html5-video-controls {
        position: absolute;
        width: 100%;
        bottom: 0;
        min-height: 26px;
        z-index: 930;
        -moz-transition: bottom 0.05s ease-in;
        -ms-transition: bottom 0.05s ease-in;
        -o-transition: bottom 0.05s ease-in;
        -webkit-transition: bottom 0.05s ease-in;
        transition: bottom 0.05s ease-in;
    }
    .autohide-controls:not(.ytp-block-autohide):not(.ad-interrupting) .html5-video-controls, .ideal-aspect.autohide-controls-aspect:not(.ytp-block-autohide):not(.ad-interrupting) .html5-video-controls, html[data-player-size=fullscreen] .autohide-controls-fullscreen:not(.ytp-block-autohide):not(.ad-interrupting) .html5-video-controls {
        bottom: -35px;
        -moz-transition: bottom 0.5s ease-in;
        -ms-transition: bottom 0.5s ease-in;
        -o-transition: bottom 0.5s ease-in;
        -webkit-transition: bottom 0.5s ease-in;
        transition: bottom 0.5s ease-in;
        opacity: 1;
    }

    .html5-progress-bar {
        margin-top: 8px;
        background: rgba(0, 0, 0, 0);
        overflow: visible;
        position: relative;
        width: 100%;
        z-index: 760;
    }

    .ytp-progress-bar-padding,
    .ytp-scrubber-pull-indicator,
    .ytp-unloaded-progress {
        display: none;
    }

    .html5-scrubber-button {
        -ms-touch-action: none;
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-common-vfloYYly0.png) -38px -233px;
        height: 17px !important;
        width: 16px;
        border: none;
        overflow: hidden;
        top: -5px;
        left: 0;
        position: absolute;
        cursor: pointer;
        z-index: 936;
        margin-left: -8px;
        border-radius: 0;
        -moz-transform: none;
        -ms-transform: none;
        -webkit-transform: none;
        transform-origin: unset !important;
        transform: none;
        transition: height 0.5s,top 0.5s,transform 0.5s;
        -moz-transition: height 0.5s,top 0.5s,-moz-transform 0.5s;
        -ms-transition: height 0.5s,top 0.5s,-ms-transform 0.5s;
        -o-transition: height 0.5s,top 0.5s,-o-transform 0.5s;
        -webkit-transition: height 0.5s,top 0.5s,-webkit-transform 0.5s;
    }
    .disabled-control-seek .html5-scrubber-button, .autominimize-progress-bar:not(.ytp-block-autohide) .html5-scrubber-button, html:not([data-player-size=fullscreen]) :not(.ideal-aspect).autominimize-progress-bar-non-aspect:not(.ytp-block-autohide) .html5-scrubber-button, html[data-player-size=fullscreen] .html5-video-player:not(.ytp-block-autohide) .html5-scrubber-button {
        top: -8px;
        -moz-transform: scale(0);
        -ms-transform: scale(0);
        -o-transform: scale(0);
        -webkit-transform: scale(0);
        transform: scale(0);
        transition: height 0.5s,top 0.5s,transform 0.5s;
        -moz-transition: height 0.5s,top 0.5s,-moz-transform 0.5s;
        -ms-transition: height 0.5s,top 0.5s,-ms-transform 0.5s;
        -o-transition: height 0.5s,top 0.5s,-o-transform 0.5s;
        -webkit-transition: height 0.5s,top 0.5s,-webkit-transform 0.5s;
    }

    .seeking-mode .html5-scrubber-button,
    .html5-progress-bar:focus .html5-scrubber-button,
    .html5-scrubber-button:active,
    .html5-scrubber-button:hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-common-vfloYYly0.png) 0 -97px;
    }

    .ytp-progress-list {
        width: 100%;
        z-index: 760;
        background: #1e1f1f;
        background-image: -moz-linear-gradient(bottom, rgba(30, 31, 31, .75) 89%, #2f2f2f 90%);
        background-image: -ms-linear-gradient(bottom, rgba(30, 31, 31, .75) 89%, #2f2f2f 90%);
        background-image: -o-linear-gradient(bottom, rgba(30, 31, 31, .75) 89%, #2f2f2f 90%);
        background-image: -webkit-gradient(linear, left bottom, left top, color-stop(89%, rgba(30, 31, 31, .75)), color-stop(90%, #2f2f2f));
        background-image: -webkit-linear-gradient(bottom, rgba(30, 31, 31, .75) 89%, #2f2f2f 90%);
        background-image: linear-gradient(to top, rgba(30, 31, 31, .75) 89%, #2f2f2f 90%);
        -moz-transition: height 0.05s ease-in;
        -ms-transition: height 0.05s ease-in;
        -o-transition: height 0.05s ease-in;
        -webkit-transition: height 0.05s ease-in;
        transition: height 0.05s ease-in;
    }
    .html5-video-player:focus .ytp-progress-list, .html5-video-player:hover .ytp-progress-list, .ytp-progress-list {
        transition: height 0.5s,top 0.5s,transform 0.5s;
        -moz-transition: height 0.5s,top 0.5s,-moz-transform 0.5s;
        -ms-transition: height 0.5s,top 0.5s,-ms-transform 0.5s;
        -o-transition: height 0.5s,top 0.5s,-o-transform 0.5s;
        -webkit-transition: height 0.5s,top 0.5s,-webkit-transform 0.5s;
    }
    .disabled-control-seek .ytp-progress-list, .autominimize-progress-bar:not(.ytp-block-autohide) .ytp-progress-list, html:not([data-player-size=fullscreen]) .autominimize-progress-bar-non-aspect:not(.ideal-aspect):not(.ytp-block-autohide) .ytp-progress-list, html[data-player-size=fullscreen] .html5-video-player:not(.ytp-block-autohide) .ytp-progress-list {
        -moz-transform: none;
        -ms-transform: none;
        -webkit-transform: none;
        transform: none;
        height: 3px;
        transition: height 0.5s;
        -moz-transition: height 0.5s;
        -ms-transition: height 0.5s;
        -o-transition: height 0.5s;
        -webkit-transition: height 0.5s;
    }
    .ytp-progress-bar-container {
        transition: height 0.5s;
        -moz-transition: height 0.5s;
        -ms-transition: height 0.5s;
        -o-transition: height 0.5s;
        -webkit-transition: height 0.5s;
    }
    .autominimize-progress-bar-non-aspect:not(.ideal-aspect):not(.ytp-block-autohide) .ytp-progress-bar-container, html[data-player-size=fullscreen] .html5-video-player:not(.ytp-block-autohide) .ytp-progress-bar-container {
        height: 3px !important;
    }

    .ytp-play-progress {
        z-index: 933;
        background-image: -moz-linear-gradient(top, #c00 0, #600 100%);
        background-image: -ms-linear-gradient(top, #c00 0, #600 100%);
        background-image: -o-linear-gradient(top, #c00 0, #600 100%);
        background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #c00), color-stop(100%, #600));
        background-image: -webkit-linear-gradient(top, #c00 0, #600 100%);
        background-image: linear-gradient(to bottom, #c00 0, #600 100%);
        filter: progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr=#cc0000, EndColorStr=#660000);
    }

    .ytp-load-progress {
        z-index: 932;
        background-image: -moz-linear-gradient(bottom, #5a5a5a 89%, #666 90%);
        background-image: -ms-linear-gradient(bottom, #5a5a5a 89%, #666 90%);
        background-image: -o-linear-gradient(bottom, #5a5a5a 89%, #666 90%);
        background-image: -webkit-gradient(linear, left bottom, left top, color-stop(89%, #5a5a5a), color-stop(90%, #666));
        background-image: -webkit-linear-gradient(bottom, #5a5a5a 89%, #666 90%);
        background-image: linear-gradient(to top, #5a5a5a 89%, #666 90%);
        filter: progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr=#2f2f2f, EndColorStr=#5a5a5a);
    }

    .ytp-progress-tooltip {
        position: absolute;
        left: 0;
        bottom: 18px;
        top: unset;
        width: 50px;
        height: 20px;
        background-color: rgba(22, 22, 22, 0.8);
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
        border-radius: 4px;
        margin: 0;
        padding: 2px;
        overflow: visible;
    }

    .ytp-progress-tooltip.with-thumbnail {
        width: 108px;
        height: 72px;
        top: unset;
        bottom: 18px;
    }

    .ytp-progress-tooltip-timestamp-container,
    .ytp-progress-tooltip-timestamp {
        display: block;
        width: 50px;
        height: 20px;
        margin: 0;
        padding: 0;
        font-size: 11px;
        line-height: 20px;
        color: #e3e3e3;
        text-align: center;
    }

    .ytp-progress-tooltip.with-thumbnail .ytp-progress-tooltip-timestamp-container,
    .ytp-progress-tooltip.with-thumbnail .ytp-progress-tooltip-timestamp {
        width: 108px;
        height: 12px;
        line-height: 12px;
        background: transparent;
    }

    .ytp-progress-tooltip-arrow {
        border-top: 5px solid rgba(22, 22, 22, 0.8);
    }

    .ytp-tooltip {
        animation: ytp-fade 0.2s ease-in-out;
    }

    .ytp-tooltip-body {
        padding: .35em .75em;
        color: #fff;
        white-space: nowrap;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        -moz-box-shadow: 0 0 3px #333;
        -ms-box-shadow: 0 0 3px #333;
        -webkit-box-shadow: 0 0 3px #333;
        box-shadow: 0 0 3px #333;
        background-image: -moz-linear-gradient(top, #4a4a4a 0, #000 100%);
        background-image: -ms-linear-gradient(top, #4a4a4a 0, #000 100%);
        background-image: -o-linear-gradient(top, #4a4a4a 0, #000 100%);
        background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #4a4a4a), color-stop(100%, #000));
        background-image: -webkit-linear-gradient(top, #4a4a4a 0, #000 100%);
        background-image: linear-gradient(to bottom, #4a4a4a 0, #000 100%);
        filter: progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr=#4a4a4a, EndColorStr=#000000);
    }

    .ytp-text-tooltip {
        padding: 0;
    }

    .ytp-tooltip-arrow {
        z-index: 1000001;
        bottom: 0;
        width: 0;
        height: 0;
        border: 1px solid transparent;
        border-width: 5px 5px 0 5px;
        border-top-color: #000
    }

    .html5-player-chrome {
        width: 100%;
        padding-bottom: 1px;
        cursor: auto;
        overflow: hidden;
        height: 26px;
        z-index: 750;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAdCAYAAABrAQZpAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAABAAAAHQAh4gKwAAAAMUlEQVQI12OQlJD4x2Sgr8/I9OTZs5dM//79Y2T6//8/IyqLAcLClEBjYahDKCHSKADN5VNQpdTxzgAAAABJRU5ErkJggg==);
        background-repeat: repeat-x;
    }

    .ytp-button-play,
    .ytp-button-pause,
    .ytp-button-replay,
    .ytp-volume-control,
    .ytp-button-watch-on-youtube,
    .ytp-settings-button,
    .ytp-settings-button-active,
    .ytp-subtitles-button,
    .ytp-subtitles-button-active {
        border-right: 1px solid #222;
        padding-right: 1px;
    }

    .ytp-button-play {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -96px -232px;
        height: 26px;
        width: 55px;
    }

    .ytp-button-play:focus .yt-uix-button-icon,
    .ytp-button-play:hover,
    .ytp-button-play:not(.ytp-disabled):focus,
    .ytp-button-play:not(.ytp-disabled):hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -121px -43px;
    }

    .ytp-button-pause {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -64px -178px;
        height: 26px;
        width: 55px
    }

    .ytp-button-pause:focus,
    .ytp-button-pause:hover,
    .ytp-button-pause:not(.ytp-disabled):focus,
    .ytp-button-pause:not(.ytp-disabled):hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -64px -259px;
    }

    .ytp-button-stop {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) 0 -124px;
        height: 25px;
        width: 55px;
    }
    .ytp-button-stop:focus,
    .ytp-button-stop:not(.ytp-disabled):focus,
    .ytp-button-stop:hover,
    .ytp-button-stop:not(.ytp-disabled):hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -96px -151px;
    }

    .ytp-button-replay {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -96px -286px;
        height: 25px;
        width: 55px;
    }

    .ytp-button-replay:not(.ytp-disabled):focus,
    .ytp-button-replay:not(.ytp-disabled):hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -32px -16px;
        height: 25px;
        width: 55px;
    }

    .ytp-button-prev, .ytp-button-next {
        display: none !important;
    }

    .ytp-volume-panel,
    .ytp-volume-control-hover .ytp-volume-panel,
    .ytp-volume-slider-active .ytp-volume-panel {
        -ms-touch-action: none;
        display: inline-block;
        width: 1px;
        overflow: hidden;
        -webkit-transition: width 0.5s ease-in 0.5s;
        -moz-transition: width 0.5s ease-in 0.5s;
        -o-transition: width 0.5s ease-in 0.5s;
        -ms-transition: width 0.5s ease-in 0.5s;
    }

    .ytp-volume-panel:focus,
    .ytp-volume-control:hover .ytp-volume-panel {
        width: 56px;
        -webkit-transition: width 0.1s linear 0s;
        -moz-transition: width 0.1s linear 0s;
        -o-transition: width 0.1s linear 0s;
        -ms-transition: width 0.1s linear 0s;
    }

    .ytp-volume-slider {
        display: block;
        height: 13px;
        width: 51px;
        margin: 7px 6px 0 1px;
        padding: 1px 3px 0 0;
        cursor: pointer;
    }

    .ytp-volume-control {
        padding-right: 4px;
    }

    .ytp-volume-slider-foreground {
        background: transparent;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAAAOCAYAAADdeGlVAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABmAAAADgBV/HzAAAABW0lEQVRYw+2YsWqDQBjH/3dcBZekWCFk71KcsnQSksU36Bt06wP0ITqXkjfofqsZkrUUnNwKHbJYUKdSiUquQ1sxTYfESzkv+IOD78S7+//9+JRPIoSAbhBCqlgIMQZwB+ASwBOAW0LIQkdfGx5lDHiet/O9i/n8YKKLsqziLMsSwzCsn3me56lpmmcnjG2sGU8me53h+/7B9DaByW/RjMfhsPHaq+WyiimlVllLFKXUarJn2yAXpql1zT/H8da1035ftSxp2P1goFqDFPVqOSbYx3qtWoMURVGolvAvsPcuMa2EvXWJaSXsdbVSrUGKo01MOBqp1iDFXx//fXuWNqKswbzu9RqfO03TKg7DcMuA4zikazB35PeDeZHZbDarwiiKYNt2NY+/+xrtq0YIod2o47puwjkXQRAIzrlwXTfR1Vd9SL3KVFH/iQnAA/AA4BxfhXgDwNfRV51Pa+CPkys0tRoAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC);
        background-repeat: no-repeat;
        background-position: -48px 0;
        bottom: unset;
        height: 14px;
        width: 5px;
    }

    .ytp-volume-slider-foreground:before {
        background: transparent;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAOCAYAAAHiaRFqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAF9SURBVGhD7dkxa8JAFAfwu0mcLCSDFRWxgy1ZuxQEC7FfoF9DaL9Kl/QrdE/n7FaL4pCpXyEOTpIhXHPyQpz0yj3Ktfx/8Lj3ku1iLu9O4Sr57HmKcmuvux1lDlFKfVBqjW22nhYLcT0aUWVHJoMB2yPkcrvZCN/zqIKT4jh27gE6i/N95oTX8AdYPztcOBflfw9r1h+X57nSQSWcId+6XUyWgfvl8jD2e73DCMAiTVOlg0oAe+V2YlKGNqFLcIakEU447q0ajQbmzICTe2jX6D19BUdsZtC8G6gadw3NuxknD7Jcow/WKjhgM4N+wcDxbjAIAswZ8BiPx9v1eq30SJcA4Lfs9/ttURSqCl3TLQAW8qbZRO8OLD6zjLLaRatFGYA9+d7vY8ECFnerFWW1y3abMgB78qXTwYIFLB7nc8pqV8MhZQD25HQ6xYIFLKIooqw2m80oA7CHv7yATZIkyvd9qoTIskyEYYjfGAA46aGMrzJ0165HXQMwEeIbL1mI2ftk/oMAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==);
        background-repeat: no-repeat;
        top: 0;
        height: 13px;
        width: 55px;
    }

    .ytp-volume-slider-foreground:after {
        background: transparent;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAOCAYAAAHiaRFqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAF9SURBVGhD7dkxa8JAFAfwu0mcLCSDFRWxgy1ZuxQEC7FfoF9DaL9Kl/QrdE/n7FaL4pCpXyEOTpIhXHPyQpz0yj3Ktfx/8Lj3ku1iLu9O4Sr57HmKcmuvux1lDlFKfVBqjW22nhYLcT0aUWVHJoMB2yPkcrvZCN/zqIKT4jh27gE6i/N95oTX8AdYPztcOBflfw9r1h+X57nSQSWcId+6XUyWgfvl8jD2e73DCMAiTVOlg0oAe+V2YlKGNqFLcIakEU447q0ajQbmzICTe2jX6D19BUdsZtC8G6gadw3NuxknD7Jcow/WKjhgM4N+wcDxbjAIAswZ8BiPx9v1eq30SJcA4Lfs9/ttURSqCl3TLQAW8qbZRO8OLD6zjLLaRatFGYA9+d7vY8ECFnerFWW1y3abMgB78qXTwYIFLB7nc8pqV8MhZQD25HQ6xYIFLKIooqw2m80oA7CHv7yATZIkyvd9qoTIskyEYYjfGAA46aGMrzJ0165HXQMwEeIbL1mI2ftk/oMAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==);
        background-repeat: no-repeat;
        background-position: -251px 0;
        top: 0;
        height: 13px;
        width: 55px;
    }

    .ytp-button-volume[data-value=max],
    .ytp-button-volume[data-value=loud] {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -153px -259px;
        height: 26px;
        width: 30px;
    }

    .ytp-button-volume[data-value=max]:focus,
    .ytp-button-volume[data-value=max]:hover,
    .ytp-button-volume[data-value=loud]:focus,
    .ytp-button-volume[data-value=loud]:hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -121px -124px;
        height: 26px;
        width: 30px;
    }

    .ytp-button-volume[data-value=normal],
    .ytp-button-volume[data-value=quiet] {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -121px -259px;
        height: 26px;
        width: 30px;
    }

    .ytp-button-volume[data-value=normal]:focus,
    .ytp-button-volume[data-value=normal]:hover,
    .ytp-button-volume[data-value=quiet]:focus,
    .ytp-button-volume[data-value=quiet]:hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -96px -205px;
        height: 26px;
        width: 30px;
    }

    .ytp-button-volume[data-value=min] {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -153px -232px;
        height: 26px;
        width: 30px;
    }

    .ytp-button-volume[data-value=min]:focus,
    .ytp-button-volume[data-value=min]:hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -32px -97px;
        height: 26px;
        width: 30px;
    }

    .ytp-button-volume[data-value=off] {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -121px -16px;
        height: 26px;
        width: 30px;
    }

    .ytp-button-volume[data-value=off]:focus,
    .ytp-button-volume[data-value=off]:hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) 0 -43px;
        height: 26px;
        width: 30px;
    }

    .ytp-time-display {
        line-height: 28px;
    }

    .ytp-time-live-badge {
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
    }

    .ytp-time-live-badge:before {
        width: 4px;
        height: 4px;
        margin: 0 2px 1px 0;
        border: 1px solid rgba(0, 0, 0, 0.2);
        background: #b3362d;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.2), inset -1px -1px 1px 0 rgba(0, 0, 0, 0.2);
        -ms-box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.2), inset -1px -1px 1px 0 rgba(0, 0, 0, 0.2);
        -webkit-box-shadow: 0 1px 0 0 rgb(255 255 255 / 20%), inset -1px -1px 1px 0 rgb(0 0 0 / 20%);
        box-shadow: 0 1px 0 0 rgb(255 255 255 / 20%), inset -1px -1px 1px 0 rgb(0 0 0 / 20%);
    }

    .ytp-button-fullscreen-enter {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -89px -124px;
        height: 26px;
        width: 30px;
    }

    .ytp-button-fullscreen-enter:focus,
    .ytp-button-fullscreen-enter:hover,
    .ytp-button-fullscreen-enter:not(.ytp-disabled):focus,
    .ytp-button-fullscreen-enter:not(.ytp-disabled):hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -96px -97px;
        height: 26px;
        width: 30px;
    }

    .ytp-button-fullscreen-exit {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) 0 -70px;
        height: 26px;
        width: 30px;
    }

    .ytp-button-fullscreen-exit:focus,
    .ytp-button-fullscreen-exit:hover,
    .ytp-button-fullscreen-exit:not(.ytp-disabled):focus,
    .ytp-button-fullscreen-exit:not(.ytp-disabled):hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -64px -151px;
        height: 26px;
        width: 30px;
    }

    .ytp-size-toggle-large {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -89px -16px;
        height: 26px;
        width: 30px;
    }

    .ytp-size-toggle-large:focus,
    .ytp-size-toggle-large:hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -32px -205px;
        height: 26px;
        width: 30px;
    }

    .ytp-size-toggle-small {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -57px -124px;
        height: 26px;
        width: 30px;
    }

    .ytp-size-toggle-small:focus,
    .ytp-size-toggle-small:hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -32px -232px;
        height: 26px;
        width: 30px;
    }

    .ytp-button-watch-on-youtube {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-common-vfloYYly0.png) -38px -192px;
        height: 26px;
        width: 52px;
    }

    .ytp-button-watch-on-youtube:focus,
    .ytp-button-watch-on-youtube:hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-common-vfloYYly0.png) 0 -25px;
        height: 26px;
        width: 52px;
    }

    .ytp-button-watch-later {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) 0 -259px;
        height: 26px;
        width: 30px;
    }

    .ytp-button-watch-later:focus,
    .ytp-button-watch-later:hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -64px -232px;
        height: 26px;
        width: 30px;
    }

    .ytp-settings-button {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -153px -124px;
        height: 26px;
        width: 30px;
    }

    .ytp-settings-button-active {
        filter: none;
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -153px -124px #141414;
        cursor: default;
        -moz-box-shadow: inset 0 -5px 5px #000;
        -ms-box-shadow: inset 0 -5px 5px #000;
        -webkit-box-shadow: inset 0 -5px 5px #000;
        box-shadow: inset 0 -5px 5px #000;
    }

    .ytp-settings-button:focus,
    .ytp-settings-button:hover,
    .ytp-settings-button:not(.ytp-disabled):focus,
    .ytp-settings-button:not(.ytp-disabled):hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -128px -205px;
        height: 26px;
        width: 30px;
    }

    .ytp-settings-button-active:focus,
    .ytp-settings-button-active:hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -128px -205px #141414;
        height: 26px;
        width: 30px;
    }

    .ytp-subtitles-button {
        background: no-repeat url(//s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -64px -205px;
        height: 26px;
        width: 30px;
    }
    .ytp-subtitles-button:focus, .ytp-subtitles-button:hover {
        background: no-repeat url(//s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -64px -286px;
        height: 26px;
        width: 30px;
    }
    .ytp-subtitles-button-active, .ytp-subtitles-button-active:focus, .ytp-subtitles-button-active:hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -32px -151px;
        background-size: auto;
        height: 26px;
        width: 30px;
    }
    .cc-international .ytp-subtitles-button {
        background: no-repeat url(//s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -153px -286px;
        height: 26px;
        width: 30px;
    }
    .cc-international .ytp-subtitles-button:focus, .cc-international .ytp-subtitles-button:hover {
        background: no-repeat url(//s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) 0 -286px;
        height: 26px;
        width: 30px;
    }
    .cc-international .ytp-subtitles-button-active, .cc-international .ytp-subtitles-button-active:focus, .cc-international .ytp-subtitles-button-active:hover {
        background: no-repeat url(//s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -32px -286px;
        background-size: auto;
        height: 26px;
        width: 30px;
    }

    .ytp-button-playlist {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -64px -97px;
        height: 26px;
        width: 30px;
    }

    .ytp-button-playlist:focus,
    .ytp-button-playlist:hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) -32px -259px;
        height: 26px;
        width: 30px;
    }

    .playlist-loaded .ytp-button-playlist, .playlist-loaded .ytp-button-playlist:focus, .playlist-loaded .ytp-button-playlist:hover {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-dark-vfllzTuHQ.png) 0 -16px;
        background-size: auto;
        height: 26px;
        width: 30px;
    }

    .html5-video-info-panel {
        position: absolute;
        background: rgba(0, 0, 0, .85);
        width: 80%;
        font-size: 10px;
        color: #aaa;
        text-align: left;
        cursor: default;
        -moz-border-radius: 3px;
        -webkit-border-radius: 3px;
        border-radius: 3px;
    }

    .html5-video-element-info-table th,
    .html5-video-element-info-table td {
        padding: 0
    }

    .html5-video-info-table th {
        padding: 0 3px 0 0;
        text-align: center;
    }

    .html5-video-info-table td {
        padding: 0;
    }

    .html5-video-info-panel-close {
        font-size: 0;
        top: 0;
        right: 0
    }

    .html5-video-info-panel-close:after {
        content: 'Close';
        position: absolute;
        top: 2px;
        right: 5px;
        color: #999;
        cursor: pointer;
        font-size: 10px;
        display: inline-block
    }

    .html5-video-info-panel-close:hover:after {
        color: #fff;
    }

    .html5-context-menu {
        font-size: 12px;
        padding: 0;
        margin: 0;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }

    .html5-bezel {
        -moz-border-radius: 10px;
        -webkit-border-radius: 10px;
        border-radius: 10px;
    }

    .html5-bezel-fade {
        -moz-transition: all .25s linear;
        -webkit-transition: all .25s linear;
        transition: all .25s linear;
    }

    .html5-bezel div {
        position: relative;
        top: 15px;
        margin: 0 auto;
    }

    .html5-bezel-play {
        width: 0;
        height: 0;
        border-top: 15px solid transparent;
        border-bottom: 15px solid transparent;
        border-left: 20px solid white;
    }

    .html5-bezel-pause {
        width: 10px;
        height: 30px;
        border-right: 10px solid #fff;
        border-left: 10px solid #fff;
    }

    .el-embedded .html5-info-bar,
    .el-profilepage .html5-info-bar,
    .ended-mode .html5-info-bar,
    .hide-info-bar.ended-mode .html5-info-bar,
    body[data-player-size=fullscreen] .html5-info-bar {
        display: block;
    }

    .html5-video-player:not(.ytp-block-autohide) .html5-info-bar,
    .html5-video-player:not(.ytp-block-autohide) .html5-info-bar:not(.show-share) {
        top: -45px;
        opacity: 1;
        -moz-transition: top 0.5s ease-in;
        -ms-transition: top 0.5s ease-in;
        -o-transition: top 0.5s ease-in;
        -webkit-transition: top 0.5s ease-in;
        transition: top 0.5s ease-in;
    }

    .html5-info-bar {
        position: absolute;
        display: none;
        top: 0;
        width: 100%;
        height: 28px;
        background: rgba(0, 0, 0, .8);
        cursor: pointer;
        overflow: hidden;
        -moz-transition: top 0.05s ease-in;
        -ms-transition: top 0.05s ease-in;
        -o-transition: top 0.05s ease-in;
        -webkit-transition: top 0.05s ease-in;
        transition: top 0.05s ease-in;
    }
    .html5-title {
        font-size: 16px;
        line-height: 29px;
        padding-left: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .html5-info-bar .html5-title:hover {
        text-decoration: underline;
    }
    .html5-title-text-wrapper {
        overflow: visible;
        white-space: revert;
        word-wrap: revert;
        *zoom: 1;
        -o-text-overflow: revert;
        text-overflow: revert;
        float: left;
    }
    .html5-title-text {
        color: #fff;
        font-size: 16px;
        line-height: 29px;
    }
    .html5-title-text-wrapper:hover .html5-title-text {
        text-decoration: underline;
    }
    .html5-info-bar .ytp-button, .html5-info-bar .ytp-button:focus, .html5-info-bar .ytp-button:hover {
        background-image: none;
        opacity: 1;
        padding: 0 9px;
        height: 28px;
        border-left: 1px solid #222;
    }
    .ytp-button-info {
        margin-right: 7px;
    }
    .ytp-button-info:before {
        content: '';
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-common-vfloYYly0.png) 0 0;
        width: 22px;
        height: 23px;
        margin-top: 3px;
        display: inline-block;
    }
    .ytp-button-info:hover:before {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-common-vfloYYly0.png) -52px -93px;
        width: 22px;
        height: 23px;
    }
    .ytp-button-share:before {
        content: '';
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-common-vfloYYly0.png) -28px -68px;
        width: 22px;
        height: 23px;
        margin-top: 3px;
        display: inline-block;
    }
    .ytp-button-share:hover:before  {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-common-vfloYYly0.png) -66px -68px;
        width: 22px;
        height: 23px;
    }
    .html5-info-bar .ytp-button-dislike, .html5-info-bar .ytp-button-dislike:hover, .html5-info-bar .ytp-button-dislike:focus {
        padding-left: 0;
        border-left: none;
        margin-right: 0;
    }
    .html5-info-bar .ytp-button-like, .html5-info-bar .ytp-button-like:hover, .html5-info-bar .ytp-button-like:focus {
        padding-right: 0;
    }
    .ytp-button-dislike:before {
        content: '';
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-common-vfloYYly0.png) -54px -30px;
        width: 22px;
        height: 23px;
        margin-top: 3px;
        margin-left: 3px;
        display: inline-block;
    }
    .ytp-button-dislike:hover:before {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-common-vfloYYly0.png) 0 -227px;
        width: 22px;
        height: 23px;
    }
    .ytp-button-like:before {
        content: '';
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-common-vfloYYly0.png) -64px -337px;
        width: 22px;
        height: 23px;
        margin-top: 4px;
        margin-right: 5px;
        display: inline-block;
    }
    .ytp-button-like:hover:before {
        background: no-repeat url(http://s.ytimg.com/yts/imgbin/player-common-vfloYYly0.png) -28px -93px;
        width: 22px;
        height: 23px;
    }
    .show-share .ytp-button-share, .show-more-info .ytp-button-info {
        border-bottom: 0;
        -webkit-box-sizing: unset;
        -moz-box-sizing: unset;
        -ms-box-sizing: unset;
        box-sizing: unset;
    }
    .show-share .ytp-button-share:before, .show-more-info .ytp-button-info:before {
        border-bottom: 3px solid #b91f1f
    }
    .html5-info-bar.show-more-info {
        height: 100%;
        bottom: 0
    }
    .html5-info-panel {
        position: absolute;
        top: 27px;
        background: rgba(0,0,0,.7);
        text-align: left;
        width: 100%;
        height: 100%;
        z-index: 880;
        opacity: 0;
        border-top: 1px solid #222;
    }
    .html5-info-bar.show-more-info .html5-info-panel {
        opacity: 1;
    }
    .ytp-button-playlist-text {
        padding: 1px 10px 0 2px;
    }
    .ytp-playlist-tray-index-length {
        margin-top: 0
    }

    .ytp-menu-content {
        border-spacing: 1px
    }

    .ytp-menu-container {
        background: #141414;
        border-radius: 3px 3px 0 0;
    }

    .ytp-menu {
        background: #141414;
        border-radius: 3px 3px 0 0;
        padding: 0
    }

    .ytp-drop-down-menu {
        display: inline-block!important;
        position: relative;
        background: none;
        border: none;
        bottom: 0!important
    }

    .ytp-drop-down-menu-button {
        color: #aaa;
        padding: 4px 7px
    }

    .ytp-drop-down-menu-button-selected {
        color: #fff;
    }

    .ytp-drop-down-menu-button-checked .ytp-drop-down-menu-button-check,
    .ytp-drop-down-menu-button-checked:hover:not(.ytp-disabled) .ytp-drop-down-menu-button-check {
        background: none #fff;
        border-radius: 50%;
        height: 3px;
        width: 3px;
        margin: 0 11px 1px -1px
    }

    .ytp-drop-down-menu-button-check {
        height: 3px;
        width: 3px;
        margin: 0 11px 1px -1px
    }

    .ytp-drop-down-menu-button:hover:not(.ytp-disabled) {
        background: #601212
    }

    .ytp-menu-container .ytp-drop-down-menu-button.ytp-drop-down-menu-button-checked {
        list-style: disc inside none;
        color: #fff;
        background-color: #0f0f0f;
        -moz-border-radius: 12px;
        -webkit-border-radius: 12px;
        border-radius: 12px;
        -moz-box-shadow: 0 1px #292929, 0 -1px #000;
        -ms-box-shadow: 0 1px #292929, 0 -1px #000;
        -webkit-box-shadow: 0 1px #292929, 0 -1px #000;
        box-shadow: 0 1px #292929, 0 -1px #000;
    }

    .ytp-menu-row {
        display: inline-block;
        vertical-align: top;
        box-shadow: 1px 0 0 0 #2b2b2b inset;
        border-left: 1px solid #000;
        padding: 0 3px;
        min-height: 135px
    }

    .ytp-menu-row:first-child {
        border-left: transparent;
        box-shadow: none
    }

    .ytp-menu-cell {
        display: block
    }

    .ytp-drop-down-label {
        display: none
    }

    .ytp-menu-title {
        text-align: left;
        padding: 4px 7px 4px 16px
    }

    .ytp-drop-down, .ytp-drop-down[style="min-width: 100px;"] {
        min-width: 0!important
    }

    .ytp-segmented-control {
        margin-left: 16px
    }

    .ytp-drop-down-menu-button-separated-above {
        border: none;
    }

    .ytp-menu-cell:has(.ytp-menu-more-options) {
        text-align: center;
    }
    .ytp-menu-more-options {
        vertical-align: middle;
        float: none;
        display: inline-block;
    }

    .yt-uix-button-menu .yt-uix-button-menu-item {
        line-height: 1;
        display: block;
        margin: 0;
        padding: 6px 20px;
        color: #555;
        text-decoration: none;
        white-space: nowrap;
        word-wrap: normal;
        cursor: pointer;
    }
    .yt-uix-button-menu .yt-uix-button-menu-item.selected,
    .yt-uix-button-menu .yt-uix-button-menu-item-highlight .yt-uix-button-menu-item,
    .yt-uix-button-menu .yt-uix-button-menu-item:hover {
        background-color: #555;
        color: #fff;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
