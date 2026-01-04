// ==UserScript==
// @name Youtube 2010-2011 HTML5 video player
// @namespace https://greasyfork.org/en/users/759797-lego-savant
// @version 1.1.0
// @description Makes youtube player look like it did in 2010
// @author legosavant
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/433525/Youtube%202010-2011%20HTML5%20video%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/433525/Youtube%202010-2011%20HTML5%20video%20player.meta.js
// ==/UserScript==

(function() {
let css = `
    /*player*/
/*general purpose player fix*/
.ytp-exp-bigger-button-like-mobile .ytp-chrome-controls .ytp-button:not(.ytp-chapter-title), .ytp-exp-bigger-button-like-mobile .ytp-replay-button {
    max-width:40px;
    padding:0;
    line-height:40px;
    height:40px
}
.ytp-exp-bigger-button-like-mobile .ytp-progress-bar-container {
    bottom:39px
}
.ytp-exp-bigger-button-like-mobile .ytp-chrome-bottom, .ytp-embed-mobile-exp .ytp-chrome-bottom, .ytp-embed-mobile-exp.ytp-small-mode .ytp-chrome-bottom, .ytp-embed-mobile-exp .ytp-chrome-bottom .ytp-chrome-controls, .ytp-embed-mobile-exp.ytp-small-mode .ytp-chrome-bottom .ytp-chrome-controls {
    height:40px
}
/*bigmode fixes*/
.ytp-big-mode .ytp-chrome-controls .ytp-button svg {
    display:block
}
.ytp-big-mode .ytp-chrome-bottom {
    padding:0;
}
.ytp-big-mode .ytp-subtitles-button {
    top:-14px
}
.ytp-big-mode .ytp-chrome-controls .ytp-settings-button svg {
    display:none
}
.ytp-big-mode .ytp-chrome-controls .ytp-settings-button:before {
    font-size:14px;
    padding-left:5px;
    top:0;
    margin-top:-3px
}
.ytp-big-mode .ytp-fullscreen-button {
    position:relative;
    top:-7px
}
.ytp-big-mode .ytp-time-display {
    line-height:24px
}

.ytp-big-mode .ytp-volume-panel .ytp-volume-slider .ytp-volume-slider-handle {
    background-position-y:-242px
}
.ytp-big-mode .ytp-scrubber-container {
    top:0
}
/*main*/
.ytp-gradient-bottom {
    display:none
}
.ytp-big-mode .ytp-play-button:not(.ytp-play-button-playlist)::before {
    content:none
}
.ytp-chrome-bottom, .ytp-chrome-controls {
    height:30px!important
}
.ytp-progress-bar-container, .ytp-exp-bigger-button-like-mobile.ytp-small-mode .ytp-progress-bar-container {
    bottom:31px!important;
    height:18px!important
}
.html5-video-player {
    background:#000
}
.ytp-chrome-bottom {
    background: -webkit-gradient(linear,left top,left bottom,from(#d6d6d6),to(white));
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    right:0!important;
    left:0!important;
    width:100%!important;
    padding-top:0;
    border-top:1px solid #000
}
/*scrub an progress*/
.ytp-chapters-container {
    height:4px;
    margin-top:14px;
    transform:scale(1)!important;
    background: rgba(255,255,255,.5);
}
.ended-mode .ytp-chapters-container  {
    background:#c80000
}
.ytp-progress-list {
    transform:scale(1)!important;
}
.ytp-progress-bar:hover .ytp-chapters-container, .ytp-progress-bar-container.ytp-drag .ytp-chapters-container{
    height:12px;
    margin-top:6px
}

.ytp-progress-list {
    background:transparent;
    left:0px
}
.ytp-scrubber-container {
    left:0;
    top:0px
}
.ytp-right-controls {
    margin-top:1px
}
.ytp-left-controls {
    margin-top:1px
}
.ytp-progress-linear-live-buffer, .ytp-swatch-background-color {
    background:#c80000
}
.ytp-scrubber-button {
    background-position: -14px -274px!important;
    height:15px!important;
    width:16px;
    z-index:999;
    top:0;
    margin-top:4px;
    border-radius:0;
    margin-left:-2px
}
.ytp-scrubber-button:hover {
    background-position: -34px -274px!important;
}
.ytp-progress-bar-container:hover:not([aria-disabled="true"]) .ytp-scrubber-button.ytp-scrubber-button-hover, .ytp-drag .ytp-scrubber-button.ytp-scrubber-button-hover, .ytp-drag .ytp-exp-chapter-hover-effect, .ytp-progress-bar-container:hover:not([aria-disabled="true"]) .ytp-exp-chapter-hover-effect, .ytp-exp-chapter-hover-container:hover {
    transform:none
}
/*tooltip*/
.ytp-tooltip-bg{
    transform:scale(.65);
    border:1px solid #ccc
}
.ytp-tooltip.ytp-preview:not(.ytp-text-detail) {
background:transparent;
    height:70px;
    margin-top:10px
}
/*main buttons*/
 .ytp-chrome-controls .ytp-left-controls .ytp-button:not(.ytp-chapter-title),  .ytp-chrome-controls .ytp-size-button,.ytp-chrome-controls .ytp-fullscreen-button,.ytp-chrome-controls .ytp-remote-button, .ytp-exp-bigger-button-like-mobile .ytp-chrome-controls .ytp-button:not(.ytp-settings-button):not(.ytp-subtitles-button):not(.ytp-chapter-title) {
    background: -webkit-gradient(linear,left top,left bottom,from(white),color-stop(0.5,white),to(#d8d8d8));
    background-color: #f7f7f7;
    border-right: 1px solid #ccc;
    padding: 3px 0 2px 1px;
    cursor: pointer;
    width:29px;
    height:24px;
    box-sizing:content-box
}
ytd-app  .ytp-chrome-controls .ytp-left-controls .ytp-button:active,ytd-app  .ytp-chrome-controls .ytp-size-button:active,ytd-app  .ytp-chrome-controls .ytp-fullscreen-button:active,ytd-app  .ytp-chrome-controls .ytp-remote-button {
    -webkit-box-shadow: inset 1px 1px 4px #aaa;
    -moz-box-shadow: inset 1px 1px 4px #c2c2c2;
    border-bottom: 1px solid #aaa;
    border-right: 1px solid #aaa;
}
/*time*/
.ytp-time-current, .ytp-time-separator, .ytp-time-duration {
    color:#000;
    text-shadow:none;
    font-size:11px
}
.ytp-time-display {
    line-height:28px!important
}
/*play*/

.ytp-chrome-controls .ytp-play-button svg {
    background-position:0 -24px
}
.ytp-chrome-controls .ytp-play-button:hover svg {
    background-position:-29px -24px
}
.paused-mode .ytp-chrome-controls .ytp-play-button svg {
    background-position:0 0
}
.paused-mode .ytp-chrome-controls .ytp-play-button:hover svg {
    background-position:-29px 0
}
/*dont like these*/
.ytp-next-button.ytp-button, .ytp-miniplayer-button, .ytp-button[data-tooltip-target-id="ytp-autonav-toggle-button"] {
    display:none!important
}
/*mute*/
.ytp-chrome-controls .ytp-mute-button svg {
    background-position: 0 -48px;
}
.ytp-chrome-controls .ytp-mute-button:hover svg {
    background-position: -29px -48px;
}
.ytp-chrome-controls .ytp-mute-button[aria-label="Unmute (m)"] svg{
    background-position: 0 -120px;
}
.ytp-chrome-controls .ytp-mute-button[aria-label="Unmute (m)"]:hover svg{
    background-position: -29px -120px;
}
/*volume*/
.ytp-volume-slider-active .ytp-volume-panel {
    margin-left:5px
}
.ytp-volume-panel .ytp-volume-slider .ytp-volume-slider-handle {
    background-position: -8px -244px;
    width:46.9px;
    height:30px;
    border-radius:0!Important;
    top:8px;
    margin-left:-40px
}
.ytp-volume-slider-handle:before, .ytp-volume-slider-handle:after {
    content:none
}
.ytp-volume-panel {
    background-position: -56px -241px!important;
    border-right:1px solid #ccc
}
    .ytp-chapter-title-prefix {
        display:none
    }
/*sub*/
.ytp-subtitles-button:after {
    content:none!important
}
.ytp-subtitles-button svg {
    background-position: -76px -276px!important;
    width: 17px;
    height: 12px;
    border:0;
    margin:0;
    position:static;
    display:block;
}
.ytp-subtitles-button:hover svg, .ytp-subtitles-button[aria-pressed="true"] svg {
    background-position: -54px -276px!important;
}
.ytp-subtitles-button {
    height:18px!important;
    width:27px!important;
    border:1px solid transparent;
    color: #c80000;
    border-radius: 4px;
    background:transparent;
    padding-left:4px!important;
    top:-7px;
    margin-right:3px!important
}
.ytp-subtitles-button:hover {
    background: -webkit-gradient(linear,left top,left bottom,from(white),to(#d6d6d6));
    border: 1px solid #bfbfbf;
}
/*settings*/
.ytp-settings-button {
    top:-10px;
    height:29px!important;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    width:36px!important
}
.ytp-settings-button svg {
    display:none
}
.ytp-settings-button:before {
    content:"SD";
    display:inline-block;
    position:absolute;
    padding:2px 4px;
    border:1px solid transparent;
    height:17px;
    width:30px;
    top:0!Important;
    color:#333;
    box-sizing:border-box;
    line-height:13px;
    margin-left:2px;
    margin-top:3px;
    padding-left:7px
}
.ytp-settings-button.ytp-hd-quality-badge:before {
    content:"HD"
}
.ytp-settings-button.ytp-hd-quality-badge:after {
    content:none
}
.ytp-settings-button:hover:before {
    border: 1px solid #bfbfbf;
    color: #c80000;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    background: -webkit-gradient(linear,left top,left bottom,from(white),to(#d6d6d6));
}
/*theater*/
.ytp-chrome-controls .ytp-size-button svg {
    background-position: 0 -144px; 
}
.ytp-chrome-controls .ytp-size-button:hover svg {
    background-position: -29px -144px;
}
#player-theater-container .ytp-chrome-controls .ytp-size-button svg {
    background-position: 0 -168px; 
}
#player-theater-container .ytp-chrome-controls .ytp-size-button:hover svg {
    background-position: -29px -168px;
}
/*fullscreen*/
.ytp-chrome-controls .ytp-fullscreen-button svg {
    background-position: 0 -192px;
}
.ytp-chrome-controls .ytp-fullscreen-button:hover svg {
    background-position: -29px -192px;
}
.ytp-fullscreen .ytp-chrome-controls .ytp-fullscreen-button svg {
    background-position: 0 -218px;
}
.ytp-fullscreen .ytp-chrome-controls .ytp-fullscreen-button:hover svg {
    background-position: -29px -218px;
}
.ytp-big-mode .ytp-fullscreen-button{
    width:30px!important
}
/*setting menu*/
.ytp-panel-menu {
    border-radius: 6px;
    background-color: black;
    opacity: 0.9;
    padding:6px 0
}
.ytp-panel {
    min-width:0!important;
}
#ytp-id-17 {
    bottom:35px!important
}
.ytp-menuitem, .ytp-panel-header {
    height:30px!important;
    min-height:0!important;
}
.ytp-panel-header {
    padding:0
}
.ytp-menuitem-label {
    padding-left:10px!important;
    font-size:100%
}
.ytp-menuitem[role="menuitemradio"][aria-checked="true"] .ytp-menuitem-label {
    background-position:55px 5px
}
.ytp-panel-footer {
    display:none
}
.ytp-menuitem-icon {
    display:none
}
.ytp-menuitem:not([aria-disabled="true"]):hover {
    background:#c80000;
}
/*share n wl*/
.ytp-big-mode .ytp-share-icon svg,.ytp-big-mode .ytp-watch-later-icon svg {
    display:none
}
.ytp-big-mode .ytp-title-text {
    font-size:18px
}
.ytp-big-mode .ytp-share-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -34px -1769px;
    background-size: auto;
    width: 26px;
    height: 30px;
    opacity: .9;
}
.ytp-big-mode .ytp-watch-later-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -59px -161px;
    background-size: auto;
    width: 26px;
    height: 30px;
    opacity: .9;
    margin-right: 8px;
}
    .ytp-chapter-title-content {
        width:auto;
        color:#000;
        height:30px;
        line-height:30px;
        font-size:11px;
    }

/*ohgod*/
.ytp-button svg path, .ytp-button svg use {
    display:none
}
.ytp-large-play-button svg {
    background:none!Important
}
.ytp-large-play-button svg path {
    d: path("M 88.34 9.698 c -1.09 -1.04 -2.43 -1.62 -3.92 -1.8 c -23.061 -1.44 -46.08 -1.44 -69.14 0 c -1.48 0.18 -2.72 0.76 -3.84 1.8 c -1.09 1.04 -1.81 2.27 -2.14 3.78 c -1.05 7.07 -1.56 14.17 -1.56 21.26 c 0 7.21 0.51 14.27 1.56 21.34 c 0.33 1.51 1.05 2.74 2.14 3.779 c 1.12 1.051 2.36 1.621 3.84 1.801 c 23.06 1.439 46.08 1.439 69.14 0 c 1.49 -0.18 2.83 -0.75 3.92 -1.801 c 1.12 -1.039 1.77 -2.34 2.1 -3.819 C 91.46 48.938 92 41.878 92 34.738 c 0 -7.09 -0.54 -14.16 -1.561 -21.22 C 90.109 12.038 89.46 10.818 88.34 9.698 Z")!important;
    display:block
}
    .ytp-chapter-title-chevron svg {
        display:none
    }
.ytp-button svg, .ytp-subtitles-button svg, .ytp-volume-slider .ytp-volume-slider-handle, .ytp-volume-panel, .ytp-scrubber-button  {
    background:url(data:image/png;base64,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)
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
