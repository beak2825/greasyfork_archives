// ==UserScript==
// @name Aozora Playlists for V3 and StarTube
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description A new userstyle
// @author Me
// @license DO NOT FLAG, REPORT OR STEAL!
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/521220/Aozora%20Playlists%20for%20V3%20and%20StarTube.user.js
// @updateURL https://update.greasyfork.org/scripts/521220/Aozora%20Playlists%20for%20V3%20and%20StarTube.meta.js
// ==/UserScript==

(function() {
let css = `
    #watch7-playlist-tray .video-list-item a {
    padding: 2px 0 2px 5px !important;
    margin: 5px 0 5px 20px;
}
#watch7-playlist-tray, #watch7-playlist-tray-mask {
    background: #ffffff;
}
#watch7-playlist-tray .video-list-item:hover {
    border-color: transparent;
    background: #fff;
}
#watch7-playlist-tray .video-list-item .count {
    position: absolute;
    visibility: hidden;
}
#watch7-playlist-tray-container {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    height: 389px;
}
#watch7-playlist-tray .video-list-item .video-thumb {
    background: #fff;
    border: 1px solid #d3d3d3;
    border-radius: 3px;
    padding: 4px;
    width: 64px !important;
}
#watch7-playlist-tray .video-list-item .title {
    margin-bottom: 0;
    margin-top: 0px;
}
    #watch7-playlist-tray .video-list-item a {
    padding: 2px 0 2px 5px !important;
    margin: 5px 0 5px 20px;
}
#watch7-playlist-tray, #watch7-playlist-tray-mask {
    background: #ffffff;
}
#watch7-playlist-tray .video-list-item:hover {
    border-color: transparent;
    background: #fff;
}
#watch7-playlist-tray .video-list-item .count {
    position: absolute;
    visibility: hidden;
}
#watch7-playlist-tray-container {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    height: 389px;
}
#watch7-playlist-tray .video-list-item .video-thumb {
    background: #fff;
    border: 1px solid #d3d3d3;
    border-radius: 3px;
    padding: 4px;
    width: 64px !important;
}
#watch7-playlist-tray .video-list-item .title {
    margin-bottom: 0;
    margin-top: 0px;
}
    #watch-playlist-privacy-icon.public img, #watch7-headline #watch-privacy-icon.public img {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflEXP50f.png) -47px -540px;
    background-size: auto;
    width: 24px;
    height: 20px;
    margin-bottom: 4px;
    }
    #watch-playlist-privacy-icon.public img, #watch7-headline #watch-privacy-icon.public img {
    background: no-repeat url(https://s.ytimg.com/yt/img/videomanager/vm-sprite-vflb_70nU.png) -57px 0px;
    background-size: auto;
    width: 13px;
    height: 13px;
    margin-bottom: 4px;
}
#watch-playlist-privacy-icon {
    padding-left: 5px;
}
#watch-playlist-privacy-icon.unlisted img, #watch7-headline #watch-privacy-icon.unlisted img {
    background: no-repeat url(https://s.ytimg.com/yt/img/videomanager/vm-sprite-vflb_70nU.png) -78px 0px;
    background-size: auto;
    width: 13px;
    height: 13px;
    margin-bottom: 4px;
}
#watch-playlist-privacy-icon.private img, #watch7-headline #watch-privacy-icon.private img {
    background: no-repeat url(https://s.ytimg.com/yt/img/videomanager/vm-sprite-vflb_70nU.png) -70px 0px;
    background-size: auto;
    width: 8px;
    height: 13px;
    margin-bottom:5px;
}
#watch7-playlist-bar-controls .yt-uix-button, .watch7-playlist-bar-right .yt-uix-button {
  height: 23px!important;
}
#page.watch .related-channel .video-thumb {
  background: #fff;
  border: 1px solid #d3d3d3;
  border-radius: 3px;
  padding: 4px;
}
.video-list .video-list-item a.related-channel {
  padding-left: 39px;
}
.playlist .paused .watch7-playlist-bar-notifications, .playlist .watch7-playlist-bar-left .yt-user-name {
  color: #666;
}
.playlist #watch7-playlist-bar-controls, .playlist .watch7-playlist-bar-left .title, .playlist .watch7-playlist-bar-left .yt-user-name:hover, .playlist .watch7-playlist-bar-notifications {
  color: #fcfcfc;
}
.watch7-playlist-bar-left {
  color: #000;
  background: #111;
}
.watch7-playlist-bar {
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
}
.watch7-playlist-bar-left {
  border-left: 1px solid #333;
}
.watch7-playlist-bar-notifications {
  background: #111;
}
#watch7-playlist-bar-controls {
  border-left: 1px solid #333;
  background: #111;
}
.watch7-playlist-bar-right {
  border-right: 1px solid #333;
}
.watch7-playlist-bar-secondary-controls {
  background: #111;
}
#watch7-playlist-tray .video-list-item {
  background: #111;
}
#watch7-playlist-tray, #watch7-playlist-tray-mask {
  background: #111;
}
#watch7-playlist-tray .video-list-item:hover {
  border-color: transparent;
  background: #111;
}
#watch7-playlist-tray .video-list-item a:hover {
  background: #1b293f;
}
#watch7-playlist-tray .playlist-bar-item-playing .stat, #watch7-playlist-tray .video-list-item .title {
  color: #497ceb;
}
.yt-uix-button-icon-playlist-bar-prev, .rtl .yt-uix-button-icon-playlist-bar-next {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2010.png) 0px -100px;
    background-size: auto;
    width: 13px;
    height: 15px;
}
.yt-uix-button-icon-playlist-bar-prev:hover, .rtl .yt-uix-button-icon-playlist-bar-next:hover {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2010.png) 0px -116px;
    background-size: auto;
    width: 13px;
    height: 15px;
}
.yt-uix-button-icon-playlist-bar-next, .rtl .yt-uix-button-icon-playlist-bar-prev {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2010.png) -14px -100px;
    background-size: auto;
    width: 13px;
    height: 15px;
}
.yt-uix-button-icon-playlist-bar-next:hover, .rtl .yt-uix-button-icon-playlist-bar-prev:hover {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2010.png) -14px -116px;
    background-size: auto;
    width: 13px;
    height: 15px;
}
.yt-uix-button .yt-uix-button-icon-playlist-bar-autoplay {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2010.png) -50px -100px;
    background-size: auto;
    width: 17px;
    height: 16px;
}
.yt-uix-button .yt-uix-button-icon-playlist-bar-autoplay:hover {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2010.png) -50px -116px;
    background-size: auto;
    width: 17px;
    height: 16px;
}
.yt-uix-button .yt-uix-button-icon-playlist-bar-shuffle {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2010.png) -68px -101px;
    background-size: auto;
    width: 17px;
    height: 13px;
}
.yt-uix-button .yt-uix-button-icon-playlist-bar-shuffle:hover {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2010.png) -68px -117px;
    background-size: auto;
    width: 17px;
    height: 13px;
}
.yt-uix-button-icon-playlist-bar-close {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2010.png) -109px -100px;
    height: 13px;
    width: 13px;
    filter: invert(0);
}
.yt-uix-button-icon-playlist-bar-close:hover {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2010.png) -109px -116px;
    height: 13px;
    width: 13px;
    filter: invert(0)
}
    #watch7-playlist-bar-controls .yt-uix-button, .watch7-playlist-bar-right .yt-uix-button {
  height: 23px!important;
}
#page.watch .related-channel .video-thumb {
  background: #fff;
  border: 1px solid #d3d3d3;
  border-radius: 3px;
  padding: 4px;
}
.video-list .video-list-item a.related-channel {
  padding-left: 39px;
}
#watch7-views-info .video-extras-sparkbars.yt-uix-tooltip {
  margin: 0px 0 1px 0;
}
#yt-masthead-user .sb-notif-on .yt-uix-button-content {
  display: inline;
}
#yt-masthead-user .sb-notif-on .yt-uix-button-content {
  position: initial;
}
#yt-masthead-user .sb-notif-on .yt-uix-button-content {
  border-bottom: 0;
  border-left: 0;
  background: transparent;
  color: #03c;
  line-height: 15px;
  text-align: center;
  font-size: 13px;
  font-weight: normal;
}
#yt-masthead-user .sb-notif-on .yt-uix-button-content:before {
  content: "(";
}
#yt-masthead-user .sb-notif-on .yt-uix-button-content:after {
  content: ")";
}
#yt-masthead-user .yt-uix-button-icon-bell {
  position: relative;
  left: 0;
  top: -3px;
}
.yt-uix-button-icon-wrapper {
  margin-right: 4px;
}
#yt-masthead-user #sb-button-notify {
  width: fit-content;
}
.livestream_chat .create_message .distiller_yt-sb .action_bar .jfk-button-action {
  padding: 0 6px !important;
  height: 25px !important;
  border: 1px solid #ccc !important;
  color: #000;
  background-image: linear-gradient(#fff 0%, #efefef 100%) !important;
  border-radius: 3px;
  font-weight: normal;
  font-size: 12px;
  box-shadow: none;
  opacity: 1;
}
.playlist #watch7-playlist-bar-controls, .playlist .watch7-playlist-bar-left .title, .playlist .watch7-playlist-bar-left .yt-user-name:hover, .playlist .watch7-playlist-bar-notifications {
    color: #000;
}

#watch7-playlist-tray .playlist-bar-item-playing {
    border-color: #d1e1fa;
    background: #d1e1fa;
}
#watch7-playlist-tray .video-list-item {
    background: #fff;
    border-top: 0;
    border-bottom: 0;
    text-shadow: none;
}
#watch7-playlist-tray .playlist-bar-item-playing .stat, #watch7-playlist-tray .video-list-item .title {
    color: #03c;
}
#watch7-playlist-tray .video-list-item .title {
    font-weight: normal;
    font-size: 13px;
}
#watch7-playlist-bar-controls {
    border-left: 1px solid #cccccc;
    background: #eeeeee;
}
.watch7-playlist-bar-left {
    color: #000;
    background: #eeeeee;
}
.watch7-playlist-bar-notifications {
    color: #000;
    background: #eeeeee;
}
.watch7-playlist-bar-secondary-controls {
    color: #000;
    background: #eeeeee;
}
.watch7-playlist-bar {
    border-top: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
}
.watch7-playlist-bar-left {
    border-left: 1px solid #cccccc;
}
.watch7-playlist-bar-right {
    border-right: 1px solid #cccccc;
}
a.spf-link:focus {
    background-color: #d1e1fa;
}
#watch7-playlist-tray .video-list-item a:hover {
    background: #d1e1fa;
}
.watch7-playlist-bar-left, .watch7-playlist-bar-right, .watch7-playlist-bar {
    height: 23px;
    line-height: 23px;
}
.watch7-playlist-bar-secondary-controls {
    height: 23px;
    line-height: 23px;
}
#watch7-playlist-bar-controls {
    height: 23px;
    line-height: 23px;
}
#watch7-playlist-bar-controls, .watch7-playlist-bar-left .title, .watch7-playlist-bar-secondary-controls {
    padding: 0 5px;
}
.playlist .watch7-playlist-bar-left .title {
    font-size: 14px;
    font-weight: bold;
}
.playlist .paused .watch7-playlist-bar-notifications, .playlist .watch7-playlist-bar-left .yt-user-name {
    color: #000;
}
.yt-uix-button-icon-playlist-bar-prev, .rtl .yt-uix-button-icon-playlist-bar-next {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2.png) 0px -100px;
    background-size: auto;
    width: 13px;
    height: 15px;
}
.yt-uix-button-icon-playlist-bar-prev:hover, .rtl .yt-uix-button-icon-playlist-bar-next:hover {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2.png) 0px -116px;
    background-size: auto;
    width: 13px;
    height: 15px;
}
.yt-uix-button-icon-playlist-bar-next, .rtl .yt-uix-button-icon-playlist-bar-prev {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2.png) -14px -100px;
    background-size: auto;
    width: 13px;
    height: 15px;
}
.yt-uix-button-icon-playlist-bar-next:hover, .rtl .yt-uix-button-icon-playlist-bar-prev:hover {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2.png) -14px -116px;
    background-size: auto;
    width: 13px;
    height: 15px;
}
.yt-uix-button .yt-uix-button-icon-playlist-bar-autoplay {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2.png) -50px -100px;
    background-size: auto;
    width: 17px;
    height: 16px;
}
.yt-uix-button .yt-uix-button-icon-playlist-bar-autoplay:hover {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2.png) -50px -116px;
    background-size: auto;
    width: 17px;
    height: 16px;
}
.yt-uix-button .yt-uix-button-icon-playlist-bar-shuffle {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2.png) -68px -101px;
    background-size: auto;
    width: 17px;
    height: 13px;
}
.yt-uix-button .yt-uix-button-icon-playlist-bar-shuffle:hover {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2.png) -68px -117px;
    background-size: auto;
    width: 17px;
    height: 13px;
}
.yt-uix-button-icon-playlist-bar-close {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2.png) -109px -100px;
    height: 13px;
    width: 13px;
    filter: invert(0);
}
.yt-uix-button-icon-playlist-bar-close:hover {
    background: no-repeat url(https://raw.githubusercontent.com/thxdeeply/tweaks/refs/heads/main/StarTubeYT2011/master-vfl181382_2.png) -109px -116px;
    height: 13px;
    width: 13px;
    filter: invert(0);
}
#watch7-playlist-tray .video-list-item a {
    padding: 2px 0 2px 5px !important;
    margin: 5px 0 5px 20px;
}
#watch7-playlist-tray, #watch7-playlist-tray-mask {
    background: #ffffff;
}
#watch7-playlist-tray .video-list-item:hover {
    border-color: transparent;
    background: #fff;
}
#watch7-playlist-tray .video-list-item .count {
    position: absolute;
    visibility: hidden;
}
#watch7-playlist-tray-container {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    height: 389px;
}
#watch7-playlist-tray .video-list-item .video-thumb {
    background: #fff;
    border: 1px solid #d3d3d3;
    border-radius: 3px;
    padding: 4px;
    width: 64px !important;
}
#watch7-playlist-tray .video-list-item .title {
    margin-bottom: 0;
    margin-top: 0px;
}
#watch7-playlist-tray .video-list-item a {
    padding: 2px 0 2px 5px !important;
    margin: 5px 0 5px 20px;
}
#watch7-playlist-tray, #watch7-playlist-tray-mask {
    background: #ffffff;
}
#watch7-playlist-tray .video-list-item:hover {
    border-color: transparent;
    background: #fff;
}
#watch7-playlist-tray .video-list-item .count {
    position: absolute;
    visibility: hidden;
}
#watch7-playlist-tray-container {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    height: 389px;
}
#watch7-playlist-tray .video-list-item .video-thumb {
    background: #fff;
    border: 1px solid #d3d3d3;
    border-radius: 3px;
    padding: 4px;
    width: 64px !important;
}
#watch-playlist-privacy-icon.public img, #watch7-headline #watch-privacy-icon.public img {
    background: no-repeat url(https://s.ytimg.com/yt/img/videomanager/vm-sprite-vflb_70nU.png) -57px 0px;
    background-size: auto;
    width: 13px;
    height: 13px;
    margin-bottom: 4px;
}
#watch-playlist-privacy-icon {
    padding-left: 5px;
}
#watch-playlist-privacy-icon.unlisted img, #watch7-headline #watch-privacy-icon.unlisted img {
    background: no-repeat url(https://s.ytimg.com/yt/img/videomanager/vm-sprite-vflb_70nU.png) -78px 0px;
    background-size: auto;
    width: 13px;
    height: 13px;
    margin-bottom: 4px;
}
#watch-playlist-privacy-icon.private img, #watch7-headline #watch-privacy-icon.private img {
    background: no-repeat url(https://s.ytimg.com/yt/img/videomanager/vm-sprite-vflb_70nU.png) -70px 0px;
    background-size: auto;
    width: 8px;
    height: 13px;
    margin-bottom:5px;
}
    .yt-scrollbar-dark ::-webkit-scrollbar-track {
  border-left-color:transparent;
  background:#ccc;
  -webkit-box-shadow:none;
}
.yt-scrollbar-dark ::-webkit-scrollbar-thumb {
  border-left-color:transparent;
  background:#777;
}
.yt-scrollbar-dark ::-webkit-scrollbar-track:hover {
  -webkit-box-shadow:none
}
.yt-scrollbar-dark ::-webkit-scrollbar-thumb:hover {
  background:#ccc;
}
#watch7-playlist-tray-trim {
    position: absolute;
    z-index: 3;
    bottom: 0;
    width: 100%;
    height: 27px;
    background: #ffffff;
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
