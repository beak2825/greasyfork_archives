'use strict';
// ==UserScript==
// @name         虎牙Plus
// @namespace    http://tampermonkey.net/
// @icon         https://www.huya.com/favicon.ico
// @version      1.0.39
// @description  虎牙自动领取任务经验、开宝箱，复制直播流链接，简化页面，去广告, 夜间模式，自动进入剧场模式, 我的订阅页面视频预览
// @author       Francis
// @match        *://*.huya.com/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @require      https://cdn.bootcdn.net/ajax/libs/flv.js/1.6.1/flv.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/402279/%E8%99%8E%E7%89%99Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/402279/%E8%99%8E%E7%89%99Plus.meta.js
// ==/UserScript==

let $;

function addUi(){
    let style = document.createElement('style');
    style.appendChild(document.createTextNode(`
span.copy-stream-link:after {
    display: none;
    position: absolute;
    content: "";
    right: -20px;
    top: 6px;
    width: 18px;
    height: 18px;
    overflow: hidden;
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0YjMyYjVhNy1jMThjLTg2NDItYjRlMy04NzdmMjFiZjkzZTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MEJCNDhFNEIxMDZBMTFFN0IzQUNGNTM3RTZBMjEyRTQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEJCNDhFNEExMDZBMTFFN0IzQUNGNTM3RTZBMjEyRTQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MmFlNTQ3NDgtZjlmZS04NjQwLTg0ZTgtMmY4ZTcwYjc2YTkyIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NWE5YjI1YjQtZmE1ZC0xMWU2LWI1MmYtYWM2NWYxZGRlZjQ2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+KzIZ1wAAAz9JREFUeNqslm1IU1EYx5/dzSW+pWVZppimzV7pzZWVIhGFZiIEgmFlREGmH4qEJOhFqEVf+tCXviiCZC/4Icga0ocwIyURcmnO2ZIyM9+auqnb1NnzXM5sm7u719wffrC7c+7zP+fc55zzyDQN+0BEMiQNOYYcQBKRCNZmQr4iH5A6pBGZ8xVM4aONQwqRMmbiTVEMGkgpM9cgVYhDKKg3xSPNSIUPM29KZO80sxiSDDOQj0gK/L9SWIx0McMjSD0SCUsXxXiDHBUyVCG1iBL8JyWLqfI0lCPVSCj4WWtDN4ekxp6uZh7zWXpmid9sYfpzSkhbfwHU6/JBJuNSekZbCn+bOysUbJ+V+dNsTYgKspNvQmRQPMw4bKDt0gCaXcOmSgXLpER/GMnwC+2NLYD09eeBkylganoMajuuQt94u3PLpJNhlj/MgpUrISf5FsSF7+GfLfZheKIrhpHJ767dsshwv1gwGm3YstUwav3ltT0ufDea3eZNSeO2ATQrAdNUr2fXVDJM8j3yFZC76Q6sCk6AZ58vQ7/5i1u7OuYkZMQX4aD4JASzbRBq2i7h4Pq8hdvIuRzECxQdugUKd1ZB7PIdEKgIg/ztD/nfzizMSS6HQwkl82a2GQs8b78iZEaKEDy8t0ZlQmZSGci5gH+7WB4EedseQH33fdgVfYIfkFPTDismSCkMTRhB7LYwsRPfTQOWLrDOmPkldVUAFwjZqhseveegTl8OvWOfxNLBREva7a1laOIb1OiK+GwTU0PPI+gafislmQ1k2CTUSilNCUBZJ6SOwXpo6q2WunuayPCVrx5/pn6gaRGMWfth4bIbQGu4K3bJu+o1Gb5jN7WgaP89bruI++rn/H+UkS86r+PRZZdqRh6NHBvePbHetKz0TWnGJK1B4zYACSIPh/zw2Rh60LEjLtrXG/bZSdBjclhsQ6AbeLkYs1akmCbnvA9nkVN0BIq9OWEfgZa+p4sxo5gFzMPtxtcjeTQRP95UdhZTL1TTaJFcKTOVOLNcFtNn1aZlt3/rEsxaWQyt1LqUlkCNnEOMizAysnfUrssotfKmyrmSVdEHkePs7tzgUeobWalPafteqOJ26q8AAwB8rQG0tt5ioQAAAABJRU5ErkJggg==);
    background-size: 18px 18px;
}

span.copy-stream-link.copy-success:after {
    display: block;
}

.huya-plus-btn{
    display: block;
    font-size: 11px;
    padding:0 10px;
    color:#b08444;
    background:#FFD29E;
    border-radius:15px;
    user-select: none;
    transition:all .5s;
}

.huya-plus-btn:hover{
    color:#FFF;
    background:#ffa801;
}

#huya-ab,
.player-banner-gift,
#player-marquee-wrap,
.room-gg-chat,
.room-mod-ggTop,
#hy-nav-download,
.hy-nav-kaibo,
#J_roomGameBuy,
.jump-to-phone,
#week-star-btn,
.g-gift,
#J_bigStreamerStage,
#J_hySide,
.room-business-game,
#J_hostChannel,
#J_BusinessGameRoot,
#sidebarBanner,
.mod-news-section,
.mod-index-list>.live-box,
#J_adCategory,
#huya-ab-fixed,
#player-full-input
{
    display:none !important;
}

body,
.duya-header-wrap,
#main_col,
.room-hd-l,
.player-gift-wrap,
.chat-room__ft,
.jspPane,
#J_profileNotice>div,
.week-rank__btn,
.J_msg,
.chat-room__list,
.msg-nobleEnter,
.msg-nobleEnter>div,
.msg-nobleSpeak,
.player-face-arrow,
#player-gift-tip,
.jspVerticalBar,
.illegal-report,
.subscribe-hd.sub-on,
.huya-plus-btn,
#player-gift-tip bottom,
#player-gift-tip btn,
.fansBadge-box,
.nav-expand-list,
.tt-user-card,
.share-entrance,
.search-suggest,
.u-links,
.entrance-expand,
.gameBuy-bd,
.guide-to-app,
.chat-room__wrap,
#J_profileNotice,
.msg-onTVLottery,
.room-core,
.msg-noble,
#J_box_msgOfKing,
.msg-of-king,
.subscribe-hd.sub-on,
.nav-expand-game dd a,
.subscribe-hd.sub-on,
.match-item,
.hy-nav-link,
.hy-nav-title,
.nav-user-title,
#J_roomTitle,
.msg,
.subscribe-hd.sub-on,
.cont-item,
.week-rank__btn,
.week-rank-name,
.msg-nobleEnter,
.peo-name,
.search-item,
.history-bd .new-clickstat,
.from,
.to,
.nav-expand-game dd a,
.hy-header-match-preview-name,
#pub_msg_input,
#search-bar-input:focus,
.msg-noble,
#J_box_msgOfKing,
#J_hyUserCard .u-assets,
.room-sidebar,
.duya-header-wrap,
.week-rank__unit,
.chat-room__input,
.chatNotice,
#J_profileNotice,
.plaer-face-icon-bg,
.chat-room__ft__chat,
#tipsOrchat,
.week-rank__btn.active,
#pub_msg_input,
#search-bar-input,
.week-rank__bd li,
.subscribe-live-item,
.subscribe-live-item .txt .msg-row .nick,
.list-hd .title,
.match_body_wrap
{
    transition: background .3s, background-color .3s, color .3s, border-color .3s;
}

.live-box .box-hd .more-list li,
.live-box .box-hd .more-list li:hover,
.night-mode .mod-list .box-hd .filter dd .tag-layer,
.nav-expand-game dd a{
    border-color: #464646 !important;
}

body.night-mode,
.night-mode .duya-header-wrap,
.night-mode #main_col,
.night-mode .room-hd-l,
.night-mode .player-gift-wrap,
.night-mode .chat-room__ft,
.night-mode .jspPane,
.night-mode #J_profileNotice>div,
.night-mode .week-rank__btn,
.night-mode .J_msg,
.night-mode .chat-room__list,
.night-mode .msg-nobleEnter,
.night-mode .msg-nobleEnter>div,
.night-mode .msg-nobleSpeak,
.night-mode .player-face-arrow,
.night-mode #player-gift-tip,
.night-mode .jspVerticalBar,
.night-mode .illegal-report,
.night-mode .subscribe-hd.sub-on,
.night-mode #player-gift-tip bottom,
.night-mode #player-gift-tip btn,
.night-mode .fansBadge-box,
.night-mode .nav-expand-list,
.night-mode .tt-user-card,
.night-mode .share-entrance,
.night-mode .search-suggest,
.night-mode .u-links,
.night-mode .entrance-expand,
.night-mode .gameBuy-bd,
.night-mode .guide-to-app,
.night-mode .chat-room__wrap,
.night-mode #J_profileNotice,
.night-mode .msg-onTVLottery,
.night-mode .room-core,
.night-mode .msg-noble,
.night-mode .match_body_wrap,
.night-mode #J_roomHdR,
.night-mode .msg-watchTogetherVip,
.night-mode .room-weeklyRankList-content>div,
.night-mode .room-weeklyRankList-nav-item,
.night-mode .huya-footer,
.night-mode .program-preview-box,
.night-mode .program-preview-box .preview-bd,
.night-mode .star-box .star-content,
.night-mode div[class^="box-noble-level-"]
{
    background-color: rgb(47, 48, 53) !important;
}

.night-mode #J_box_msgOfKing,
.night-mode .msg-of-king
{
    background: rgb(47, 48, 53) !important;
}

.night-mode .subscribe-hd.sub-on,
.night-mode .nav-expand-game dd a,
.night-mode .subscribe-live-item,
.night-mode .room-weeklyRankList-nav-item.room-weeklyRankList-nav-item-active,
.night-mode .game-live-item,
.night-mode .game-live-item .txt .num,
.night-mode .j_anchor_label,
.night-mode .g-gameCard-item,
.night-mode .mod-list .box-hd .filter dd .tag-layer
{
    background-color: #464646 !important;
}

.night-mode .subscribe-hd.sub-on,
.night-mode .match-item,
.night-mode .mod-list .box-hd .title a,
.night-mode .game-live-item a.title,
.night-mode .j_index-game-title,
.night-mode .live-box .box-hd .more-list li a,
.night-mode .live-box_funny .box-hd .title span,
.night-mode .g-gameCard-fullName
{
    color: #8e8a8a !important;
}

.night-mode .hy-nav-link,
.night-mode .hy-nav-title,
.night-mode .nav-user-title,
.night-mode #J_roomTitle,
.night-mode .msg,
.night-mode .subscribe-hd.sub-on,
.night-mode .cont-item,
.night-mode .week-rank__btn,
.night-mode .week-rank-name,
.night-mode .msg-nobleEnter,
.night-mode .peo-name,
.night-mode .search-item,
.night-mode .history-bd .new-clickstat,
.night-mode .from,
.night-mode .to,
.night-mode .nav-expand-game dd a,
.night-mode .hy-header-match-preview-name,
.night-mode #pub_msg_input,
.night-mode #search-bar-input:focus,
.night-mode .msg-noble,
.night-mode #J_box_msgOfKing,
.night-mode #J_hyUserCard .u-assets,
.night-mode .follow-ctrl,
.night-mode .subscribe-live-item .txt .msg-row .nick,
.night-mode .list-hd .title,
.night-mode .nick,
.night-mode .fansBadge-hig,
.night-mode .room-weeklyRankList-nav-item,
.night-mode .room-weeklyRankList-content>div,
.night-mode .g-gameCard-fullName:hover,
.night-mode  #chat-room__list span[class^="msg-text-"]
{
    color: #E7E7E7 !important;
}

.night-mode .room-sidebar,
.night-mode .duya-header-wrap,
.night-mode .week-rank__unit,
.night-mode .chat-room__input,
.night-mode .chatNotice,
.night-mode #J_profileNotice,
.night-mode .plaer-face-icon-bg,
.night-mode .chat-room__ft__chat,
.night-mode #tipsOrchat
{
    border-color: #3e3e3e !important;
}

.night-mode .week-rank__btn.active,
.night-mode #pub_msg_input,
.night-mode #J_weekRankList li:hover,
.night-mode #J_fansRankList li:hover,
.night-mode .seat-item:hover,
.night-mode #search-bar-input,
.night-mode .search-item:hover,
.night-mode .video-link:hover,
.night-mode .history-bd .new-clickstat:hover,
.night-mode .video-item:hover,
.night-mode .match-item:hover,
.night-mode .hy-header-match-preview li:hover,
.night-mode .week-rank__bd li:hover,
.night-mode .follow-ctrl,
.night-mode #J_roomWeeklyRankListRoot ul>li:hover,
.night-mode [class^="seat-item-"]:hover
{
    background-color: #565656 !important;
}

.night-mode .msg-bubble
{
    background-image: none !important;
}

.night-mode .subscribe-live-item:hover{
   box-shadow: 2px 2px 10px #565656 !important;
}

.night-mode-btn-wrapper,.setting-btn-wrapper{
    position: fixed;
    right: 20px;
    margin-left: 10px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.night-mode-switch-btn,.setting-btn{
    width: 26px;
    height: 26px;
    border-radius: 13px;
}

.huyaplus-page-full-mode #player-wrap{
    height: 100% !important;
}

.huyaplus-page-full-mode #player-gift-wrap{
    position: relative;
    bottom: 0px !important;
    transition: all .5s;
}

.huyaplus-page-full-mode #player-ctrl-wrap{
    position: relative;
    bottom: 0 !important;
    transition: all .5s !important;
}

#player-ctrl-wrap.show, #player-gift-wrap.show{
    bottom: 100px !important;
}

.night-mode-icon,.setting-icon{
   fill: #8A8A8A;
}

.night-mode .night-mode-icon,.night-mode .setting-icon{
   fill: #AEAEAE;
}

.setting-panel-wrapper{
    visibility: hidden;
    width: 200px;
    height: 0;
    position: absolute;
    top: 100%;
    background: #777777;
    padding: 10px;
    transition: height .3s;
    border-bottom-right-radius:5px;
    border-bottom-left-radius:5px;
}

.setting-btn-wrapper:hover .setting-panel-wrapper{
    visibility: visible;
    height: 200px;
}

.video-previewing .item-mask,
.video-previewing .btn-link__hover_i{
    visibility: hidden;
}

.shield-keyword-pane{
    padding: 15px;
}

.shield-keyword-pane #shield-keyword{
   display: flex;
   align-items: center;
}

.shield-keyword-pane #shield-keyword-input{
   width: 100%;
   height: 75px;
   margin-top: 5px;
   resize: none;
   outline: none;
   background: #565656;
   color: #E7E7E7;
   padding: 2px 10px;
   box-sizing: border-box;
   overflow: overlay;
}

.shield-keyword-pane #shield-keyword-input:disabled{
   cursor: not-allowed;
}

.player-ctrl-wrap .player-danmu-pane .shield-keyword-pane .danmu-shield-cbox {
    display: inline-block;
    width: 10px;
    height: 10px;
    border: 1px solid #999;
}

::-webkit-scrollbar
{
    width:5px;
    height:5px;
    background-color:transparent;;
}

::-webkit-scrollbar-track
{
    -webkit-box-shadow:inset 0 0 1px rgba(0,0,0,0.3);
    border-radius:2px;
    background-color:transparent;
}

::-webkit-scrollbar-thumb
{
    border-radius:2px;
    -webkit-box-shadow:inset 0 0 1px rgba(0,0,0,.3);
    background-color: #df8300;
}

.huyaplus-player-control-btn{
    width:20px;
    height:20px;
    margin-left: 10px;
    background-size: 20px 20px;
}

#huyaplus-player-control{
    display:flex;
    align-items: center;
    width:90px;
    height:24px;
}

#player-mirror-btn{
   background-image: url(data:image/png;base64,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);
}

#player-mirror-btn:hover{
    background-image: url(data:image/png;base64,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);
}

#player-rotate-btn{
   background-image: url(data:image/png;base64,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);
}

#player-rotate-btn:hover{
   background-image: url(data:image/png;base64,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);
}

#player-video>#hy-video {
    transition: transform .5s;
    transform-origin: center;
}

.huyaplus-copy-stream-wrapper{
    height: 28px;
    cursor: pointer;
    display: flex;
    position: absolute;
    right: 90px;
    top: 30px;
    z-index: 1000;
    background: transparent;
}

.huyaplus-copy-stream-wrapper .copy-stream-link{
    position: relative;
}

.huyaplus-copy-stream-wrapper .huyaplus-copy-stream-btn
{
    line-height: 28px;
    margin-right: 20px;
    font-weight: 500;
    font-size: 12px;
    color: #FFF;
    background: rgba(34,34,34,.6);
}

.huyaplus-copy-stream-wrapper .huyaplus-copy-stream-btn:hover
{
    background: #ff9600;
}

.quick-chat-bar-wrapper{
    width: 100%;
    height: 40px;
    position: absolute;
    bottom: 200px;
    background: transparent;
    display: flex;
    justify-content:center;
}

.quick-chat-bar-wrapper .quick-chat-input-wrapper{
    width: 400px;
    height: 100%;
}

.quick-chat-bar-wrapper #quick-chat-input{
    display: block;
    width: 100%;
    height: 100%;
    background: #FFF;
    outline: none;
    border:none;
    padding: 5px 10px;
    box-sizing: border-box;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}

.quick-chat-bar-wrapper .quick-chat-input-count {
    background: #fff;
    padding: 0 10px;
    line-height: 40px;
    color: #a0a0a0;
}

.quick-chat-bar-wrapper .quick-chat-send-btn{
    width: 80px;
    height: 100%;
    line-height: 40px;
    text-align: center;
    background: #ff9600;
    color: #FFF;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

.ele-hide{
    display: none;
}

.quick-chat-send-btn.div-disabled{
    cursor: not-allowed;
    background: #919191;
}

#videoContainer{
    outline: none;
}

#player-joysound-btn{
    background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjIgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+am95c291bmQvbm9ybWFsPC90aXRsZT4KICAgIDxnIGlkPSJqb3lzb3VuZC9ub3JtYWwiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLnvJbnu4QiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIuNzg1NzUwLCAwLjcxNDIyNSkiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNi40Mjg2LDAgTDE2LjQyODYsOS42NDMgQzE2LjQyODYsMTQuMTM0NTUyNyAxMi44MjMzNjY3LDE3Ljc4NDI4OCA4LjM0ODkzNjE4LDE3Ljg1NjE2OTYgTDguMTg3MTgxNTMsMTcuODU3MjU2MSBMOC4xODcxODE1MywxNy44NTcyNTYxIEw3Ljg1NzEsMTcuODU3MjU2MSBMNy44NTcxMzg5NiwxNy44NDk2NDEgQzMuNDkyMzgwMTMsMTcuNjYyMDc0NCAwLDE0LjA1MzEzNDEgMCw5LjY0MzA1IEMwLDUuMTEzMTE1MDUgMy42ODQ0MDAyLDEuNDI4NTUgOC4yMTQyNSwxLjQyODU1IEM5LjcwMDc5OTEzLDEuNDI4NTUgMTEuMDk2Mjk4NSwxLjgyNTM1NTAyIDEyLjMwMDQxNTEsMi41MTg2MjMzMSBDMTIuNzQ5NTY4NywxLjA2MDE2NjAxIDE0LjEwODIyMzYsMCAxNS43MTQzNSwwIEwxNi40Mjg2LDAgWiBNOC4yMTQyNSwyLjQyODU1IEM0LjIzNjY5NDk2LDIuNDI4NTUgMSw1LjY2NTM4OTc4IDEsOS42NDMwNSBDMSwxMy41MDA3NTA4IDQuMDQ0NzczOCwxNi42NjE3MzMzIDcuODU3MDg4OTksMTYuODQ4NTY2OCBMNy44NTcwNjI1NCwxNC41NzUwMTcgQzYuNzcyOTg2NzEsMTQuNDk3MzEwMyA1Ljc4NDYxNzE5LDE0LjA2ODc0NzcgNS4wMDUxODMxMSwxMy40MDI1NTc4IEw0LjkyMjQ3Njk3LDEzLjMzMDI3NjIgTDQuODA0OTI0NjgsMTMuMjIxNzk0MSBDMy44NTkyOTc1OSwxMi4zMjA2MjgzIDMuMjY5MjUsMTEuMDQ5NTQ5NiAzLjI2OTI1LDkuNjQzMDI1IEMzLjI2OTI1LDYuOTE1ODgyNjMgNS40ODcxMDc2Myw0LjY5ODAyNSA4LjIxNDI1LDQuNjk4MDI1IEM5LjgxNDAwNzU2LDQuNjk4MDI1IDExLjIzODQ1MjcsNS40NjEyMTIzMyAxMi4xNDI3NjQ1LDYuNjQyNzEyMTUgTDEyLjE0Mjc2NDUsMy41OTQ2NDQ5MSBDMTEuMDExNTg5NiwyLjg1NzM2NzY1IDkuNjYxOTk0NDksMi40Mjg1NSA4LjIxNDI1LDIuNDI4NTUgWiBNOC4yMTQyNSw1LjY5ODAyNSBDNi4wMzkzOTIzNyw1LjY5ODAyNSA0LjI2OTI1LDcuNDY4MTY3MzcgNC4yNjkyNSw5LjY0MzAyNSBDNC4yNjkyNSwxMS42Njk1MzczIDUuODA2NDgyNjQsMTMuMzQ0NzQ5OCA3Ljc3NTg4ODE1LDEzLjU2MzU2NzIgTDcuODU3MSwxMy41NzE1IEw4LjIxNDM1LDEzLjU3MTUgQzEwLjM0OTYsMTMuNTcxNSAxMi4wODY4NSwxMS44NjggMTIuMTQxNiw5Ljc0NiBMMTIuMTQyNjQ2OCw5LjY0MyBMMTIuMTQyNjQ2OCw5LjI4MjMzMjMzIEMxMS45NTk4NTg1LDcuMjc1NzUwMjYgMTAuMjY3NDgyMyw1LjY5ODAyNSA4LjIxNDI1LDUuNjk4MDI1IFogTTguMjE0MjUsNy41MDAwMjUgQzkuMzk2MTkyODQsNy41MDAwMjUgMTAuMzU3LDguNDYwOTMzMDkgMTAuMzU3LDkuNjQzMDI1IEMxMC4zNTcsMTAuODI0OTE3NCA5LjM5NjE0MjM3LDExLjc4NTc3NSA4LjIxNDI1LDExLjc4NTc3NSBDNy4wMzIxODIxNSwxMS43ODU3NzUgNi4wNzE1LDEwLjgyNDk5MTkgNi4wNzE1LDkuNjQzMDI1IEM2LjA3MTUsOC40NjA4NTg1NSA3LjAzMjEzMTY5LDcuNTAwMDI1IDguMjE0MjUsNy41MDAwMjUgWiBNOC4yMTQyNSw4LjUwMDAyNSBDNy41ODQ0NjM0OCw4LjUwMDAyNSA3LjA3MTUsOS4wMTMwOTYyNyA3LjA3MTUsOS42NDMwMjUgQzcuMDcxNSwxMC4yNzI3MzA3IDcuNTg0NDkwNDIsMTAuNzg1Nzc1IDguMjE0MjUsMTAuNzg1Nzc1IEM4Ljg0Mzg1NzYzLDEwLjc4NTc3NSA5LjM1NywxMC4yNzI2MzI2IDkuMzU3LDkuNjQzMDI1IEM5LjM1Nyw5LjAxMzE5NDMzIDguODQzODg0NTcsOC41MDAwMjUgOC4yMTQyNSw4LjUwMDAyNSBaIiBpZD0i5b2i54q2Ij48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=");
    background-size: 24px;
    background-repeat: no-repeat;
}

#player-joysound-btn.active{
    background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjIgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+am95c291bmQvc2VsZWN0ZWQ8L3RpdGxlPgogICAgPGRlZnM+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSI1MCUiIHkxPSIwJSIgeDI9IjUwJSIgeTI9IjEwMCUiIGlkPSJsaW5lYXJHcmFkaWVudC0xIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0YwQ0I5NSIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjRTlCRTgwIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPGcgaWQ9ImpveXNvdW5kL3NlbGVjdGVkIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i57yW57uEIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyLjc4NTc1MCwgMC43MTQyMjUpIiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8cGF0aCBkPSJNMTYuNDI4NiwwIEwxNi40Mjg2LDkuNjQzIEMxNi40Mjg2LDE0LjEzNDU1MjcgMTIuODIzMzY2NywxNy43ODQyODggOC4zNDg5MzYxOCwxNy44NTYxNjk2IEw4LjE4NzE4MTUzLDE3Ljg1NzI1NjEgTDguMTg3MTgxNTMsMTcuODU3MjU2MSBMNy44NTcxLDE3Ljg1NzI1NjEgTDcuODU3MTM4OTYsMTcuODQ5NjQxIEMzLjQ5MjM4MDEzLDE3LjY2MjA3NDQgMCwxNC4wNTMxMzQxIDAsOS42NDMwNSBDMCw1LjExMzExNTA1IDMuNjg0NDAwMiwxLjQyODU1IDguMjE0MjUsMS40Mjg1NSBDOS43MDA3OTkxMywxLjQyODU1IDExLjA5NjI5ODUsMS44MjUzNTUwMiAxMi4zMDA0MTUxLDIuNTE4NjIzMzEgQzEyLjc0OTU2ODcsMS4wNjAxNjYwMSAxNC4xMDgyMjM2LDAgMTUuNzE0MzUsMCBMMTYuNDI4NiwwIFogTTguMjE0MjUsMi40Mjg1NSBDNC4yMzY2OTQ5NiwyLjQyODU1IDEsNS42NjUzODk3OCAxLDkuNjQzMDUgQzEsMTMuNTAwNzUwOCA0LjA0NDc3MzgsMTYuNjYxNzMzMyA3Ljg1NzA4ODk5LDE2Ljg0ODU2NjggTDcuODU3MDYyNTQsMTQuNTc1MDE3IEM2Ljc3Mjk4NjcxLDE0LjQ5NzMxMDMgNS43ODQ2MTcxOSwxNC4wNjg3NDc3IDUuMDA1MTgzMTEsMTMuNDAyNTU3OCBMNC45MjI0NzY5NywxMy4zMzAyNzYyIEw0LjgwNDkyNDY4LDEzLjIyMTc5NDEgQzMuODU5Mjk3NTksMTIuMzIwNjI4MyAzLjI2OTI1LDExLjA0OTU0OTYgMy4yNjkyNSw5LjY0MzAyNSBDMy4yNjkyNSw2LjkxNTg4MjYzIDUuNDg3MTA3NjMsNC42OTgwMjUgOC4yMTQyNSw0LjY5ODAyNSBDOS44MTQwMDc1Niw0LjY5ODAyNSAxMS4yMzg0NTI3LDUuNDYxMjEyMzMgMTIuMTQyNzY0NSw2LjY0MjcxMjE1IEwxMi4xNDI3NjQ1LDMuNTk0NjQ0OTEgQzExLjAxMTU4OTYsMi44NTczNjc2NSA5LjY2MTk5NDQ5LDIuNDI4NTUgOC4yMTQyNSwyLjQyODU1IFogTTguMjE0MjUsNS42OTgwMjUgQzYuMDM5MzkyMzcsNS42OTgwMjUgNC4yNjkyNSw3LjQ2ODE2NzM3IDQuMjY5MjUsOS42NDMwMjUgQzQuMjY5MjUsMTEuNjY5NTM3MyA1LjgwNjQ4MjY0LDEzLjM0NDc0OTggNy43NzU4ODgxNSwxMy41NjM1NjcyIEw3Ljg1NzEsMTMuNTcxNSBMOC4yMTQzNSwxMy41NzE1IEMxMC4zNDk2LDEzLjU3MTUgMTIuMDg2ODUsMTEuODY4IDEyLjE0MTYsOS43NDYgTDEyLjE0MjY0NjgsOS42NDMgTDEyLjE0MjY0NjgsOS4yODIzMzIzMyBDMTEuOTU5ODU4NSw3LjI3NTc1MDI2IDEwLjI2NzQ4MjMsNS42OTgwMjUgOC4yMTQyNSw1LjY5ODAyNSBaIE04LjIxNDI1LDcuNTAwMDI1IEM5LjM5NjE5Mjg0LDcuNTAwMDI1IDEwLjM1Nyw4LjQ2MDkzMzA5IDEwLjM1Nyw5LjY0MzAyNSBDMTAuMzU3LDEwLjgyNDkxNzQgOS4zOTYxNDIzNywxMS43ODU3NzUgOC4yMTQyNSwxMS43ODU3NzUgQzcuMDMyMTgyMTUsMTEuNzg1Nzc1IDYuMDcxNSwxMC44MjQ5OTE5IDYuMDcxNSw5LjY0MzAyNSBDNi4wNzE1LDguNDYwODU4NTUgNy4wMzIxMzE2OSw3LjUwMDAyNSA4LjIxNDI1LDcuNTAwMDI1IFogTTguMjE0MjUsOC41MDAwMjUgQzcuNTg0NDYzNDgsOC41MDAwMjUgNy4wNzE1LDkuMDEzMDk2MjcgNy4wNzE1LDkuNjQzMDI1IEM3LjA3MTUsMTAuMjcyNzMwNyA3LjU4NDQ5MDQyLDEwLjc4NTc3NSA4LjIxNDI1LDEwLjc4NTc3NSBDOC44NDM4NTc2MywxMC43ODU3NzUgOS4zNTcsMTAuMjcyNjMyNiA5LjM1Nyw5LjY0MzAyNSBDOS4zNTcsOS4wMTMxOTQzMyA4Ljg0Mzg4NDU3LDguNTAwMDI1IDguMjE0MjUsOC41MDAwMjUgWiIgaWQ9IuW9oueKtiI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+");
    background-size: 24px;
    background-repeat: no-repeat;
}
`));

    document.head.appendChild(style);
}

async function addCopyStreamContent(){
    await waitLoad(()=>$("#videoContainer").length > 0);

    const openWithPlayerBtn = isMacOS() ? `<span class="huya-plus-btn open-with-iina huyaplus-copy-stream-btn">IINA打开</span>`: `<span class="huya-plus-btn open-with-potplayer huyaplus-copy-stream-btn">PotPlayer打开</span>`;
    let copyStreamHtml = `<div class="huyaplus-copy-stream-wrapper">
        <span class="huya-plus-btn copy-stream-link huyaplus-copy-stream-btn">直播流</span>
        ${openWithPlayerBtn}
    </div>`;
    $("#videoContainer").prepend(copyStreamHtml);

    document.querySelector('.copy-stream-link').onclick = async e=>{
        GM_setClipboard(await getStreamUrl());
        showCopySuccessIcon();
    };

    $(".open-with-iina").click(async ()=>{
        openStreamWithIINA(await getStreamUrl());
    });

    $(".open-with-potplayer").click(async ()=>{
        openStreamWithPotPlayer(await getStreamUrl());
    });
}

async function getStreamUrl(){
    let url = window.location.href;
    let streamUrl = sessionStorage.getItem(url)
    if(!streamUrl || streamUrl.length === 0){
        streamUrl = await doGetStreamUrl(url).catch(e=>{console.error(e)});
        if(streamUrl && streamUrl.length > 0){
            sessionStorage.setItem(url, streamUrl);
        } else {
            alert("获取直播流失败");
            throw new Error("获取直播流失败");
        }
    }

    let ibitrate = getCurrentIbitrate();
    return convertStreamIbitrate(streamUrl, ibitrate)
}

function getCurrentIbitrate(){
    return $(".player-videotype-list>li.on").attr('ibitrate');
}

function convertStreamIbitrate(streamUrl, ibitrate){
    let ibit = parseInt(ibitrate);
    if(!isNaN(ibit)){
        if(ibit > 0){
            if(streamUrl.indexOf() != -1){
                streamUrl = streamUrl.replace(/(ratio=)(\d+)&/, `$1${ibit}&`);
            } else {
                streamUrl += `&ratio=${ibit}`
            }
        } else {
            streamUrl = streamUrl.replace(/(ratio=)(\d+)&/, '');
        }
    }
    return streamUrl;
}

async function doGetStreamUrl(url){
    try{
        let mobileHtml = await new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                method: 'GET',
                headers: {
                    'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
                },
                url: url,
                responseType: 'text',
                onload: resp=>{
                    resolve(resp.responseText);
                },
                onerror: e => {
                    reject(e);
                }
            })
        });
        let roomInfoJson = /\<script\>\s*window\.HNF_GLOBAL_INIT\s*=\s*(.+)\<\/script\>/.exec(mobileHtml)[1];
        let roomInfo = JSON.parse(roomInfoJson);
        let liveInfo = roomInfo.roomInfo.tLiveInfo.tLiveStreamInfo;
        let streamInfo = liveInfo.vStreamInfo.value.filter(sinfo => sinfo.sStreamName && sinfo.sStreamName.length > 0)[0];
        let bitrateInfo = liveInfo.vBitRateInfo.value;
        let streamUrl = buildStreamUrl(streamInfo, bitrateInfo);
        streamUrl = streamUrl.replace('http', 'https');
        return streamUrl;
    }catch(e){
        throw e;
    }
}

async function doGetStreamUrlV2(){
    let config = unsafeWindow.hyPlayerConfig;
    let streamInfo = config.stream.data[0].gameStreamInfoList.filter(it=>it.sStreamName)[0]
    let bitrateInfo = config.stream.vMultiStreamInfo;
    let streamUrl = buildStreamUrl(streamInfo, bitrateInfo);
    streamUrl = streamUrl.replace('http://', 'https://').replace("&amp;", "&");
    return streamUrl;
}

function buildStreamUrl(streamInfo, bitrateInfo){
    let sortedBitrate = bitrateInfo.map(it=>it.iBitRate).filter(it=>it>0).sort((it1,it2)=>it1-it2);
    return `${streamInfo.sFlvUrl}/${streamInfo.sStreamName}.${streamInfo.sFlvUrlSuffix}?ratio=${sortedBitrate[0]}&${streamInfo.sFlvAntiCode}`;
}

function isMacOS(){
    var UserAgent = navigator.userAgent.toLowerCase();
    return /mac os/.test(UserAgent);
}

function showCopySuccessIcon(){
    $('span.copy-stream-link').addClass('copy-success');
    setTimeout(()=>{$('span.copy-stream-link').removeClass('copy-success');},1000)
}

function autoReceiveBoxReward(){
    let rewardBtns = $(".player-box-list .player-box-stat3").filter((i,it)=>$(it).css("visibility") === 'visible');
    if(rewardBtns.size() > 0){
        let btn = $(rewardBtns[0]);
        btn.click();
        let waitComplete = ()=>{
            if(btn.css("visibility") === 'hidden'){
                $("#player-box").hide();
                console.log("开启宝箱");
                autoReceiveBoxReward();
            } else {
                setTimeout(waitComplete,1000);
            }
        };
        setTimeout(waitComplete,1000);
    }
}

function cleanPage(){
    $(".room-gg-chat").remove();
    $(".room-footer").remove();
}

function chat(msg){
    $("#player-full-input-txt").val(msg);
    $("#player-full-input-btn").click();
    let sendTimeout = parseInt($("#chatRoom .msg_send_time").text());
    return isNaN(sendTimeout) ? 0 : sendTimeout;
}

function openStreamWithPotPlayer(streamUrl){
    openStreamWithPlayer("PotPlayer://", streamUrl);
}

function openStreamWithIINA(streamUrl){
    openStreamWithPlayer("iina://weblink?url=", encodeURIComponent(streamUrl))
}

function openStreamWithPlayer(playerUrlSchema, streamUrl){
    window.open(`${playerUrlSchema}${streamUrl}`, "_self")
}

function jqueryLoaded(){
    $ = unsafeWindow.$
    return $;
}

function pageLoaded(){
    if($(".tasks .status").size() == 0){
        $(".nav-user-title").mouseenter()
    }
    return $(".box-icon-word").size() > 0 && $(".tasks .status").size() > 0
}

async function waitLoad(conditionFunc, timeout = 10000){
    return new Promise(function(resolve,reject){
        let w = ()=>{
            if(conditionFunc()){
                resolve();
            } else {
                if(timeout > 0){
                    setTimeout(w, 1000);
                    timeout -= 1000;
                } else {
                    reject("wait load timeout");
                }
            }
        }
        w();
    });
}

let switchDay = ()=>{
    document.body.classList.remove('night-mode');
    localStorage.setItem("night-mode",false);
}

let switchNight = ()=>{
    document.body.classList.add('night-mode');
    localStorage.setItem("night-mode",true);
}

function autoNightMode(){
    if(localStorage.getItem("night-mode") === 'true'){
        switchNight();
    }
}

function addNightModeSwitcher(){
    $(".duya-header-bd").append(`
<div class="night-mode-btn-wrapper" title="夜间模式">
    <div class="night-mode-switch-btn">
        <svg t="1594304048678" class="night-mode-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13479" width="26" height="26"><path d="M884.466526 372.574316v-226.357895h-222.585263L512 0 362.172632 146.216421H160.175158V362.172632L0 512l160.175158 149.827368v208.734316H362.172632L512 1024l149.827368-153.438316h222.639158V661.827368l139.587369-149.827368-139.587369-139.425684z m-362.172631 407.44421c-50.553263 3.610947-89.088-5.389474-123.472842-21.288421A271.845053 271.845053 0 0 0 557.271579 512c0-109.568-65.212632-203.722105-158.450526-246.730105a270.551579 270.551579 0 0 1 113.178947-24.899369c149.827368 0 271.629474 121.802105 271.629474 271.629474 0 149.827368-121.802105 268.018526-261.281685 268.018526z" p-id="13480"></path></svg>
    </div>
</div>
`)

    $(".night-mode-switch-btn").click(()=>{
        if(document.body.classList.contains("night-mode")){
            switchDay();
        } else {
            switchNight();
        }
    })
}

function settings(){
    $("#J_global_user_tips").before(`
<div class="setting-btn-wrapper" title="设置">
    <div class="setting-btn">
        <svg t="1594304610163" class="setting-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14953" width="26" height="26"><path d="M972.635487 631.216851L892.207069 548.741164a368.50839 368.50839 0 0 0 1.754802-37.216423 372.456694 372.456694 0 0 0-1.754802-37.216423l80.428418-82.18322a51.181721 51.181721 0 0 0 18.791004-69.82649l-76.699465-132.926241a51.181721 51.181721 0 0 0-69.82649-18.86412l-111.576152 28.73488a385.105891 385.105891 0 0 0-64.488968-37.289539L638.053267 51.181721a51.181721 51.181721 0 0 0-51.181721-51.181721h-153.545163a51.181721 51.181721 0 0 0-51.18172 51.181721l-30.78215 111.064334a384.082256 384.082256 0 0 0-64.488968 37.216423L175.297394 170.727597a51.181721 51.181721 0 0 0-69.826491 18.86412L29.063906 322.517958a51.181721 51.181721 0 0 0 18.86412 69.82649l80.428418 82.183221a368.50839 368.50839 0 0 0-1.754802 37.216422c0 12.502963 0.584934 24.859693 1.754802 37.216423l-80.428418 82.18322a51.181721 51.181721 0 0 0-18.86412 69.826491L105.76337 833.896466a51.181721 51.181721 0 0 0 69.826491 18.86412l111.576151-28.734881a385.252124 385.252124 0 0 0 64.488968 37.216423l30.78215 111.064334a51.181721 51.181721 0 0 0 51.18172 51.181721h153.545163a51.181721 51.181721 0 0 0 51.181721-51.181721l30.782149-111.064334a383.570439 383.570439 0 0 0 64.488968-37.216423l111.503035 28.734881a51.181721 51.181721 0 0 0 69.82649-18.86412l76.699465-132.926241a51.181721 51.181721 0 0 0-19.010354-69.753374z m-462.536522 59.663263a179.20914 179.20914 0 0 1-179.062906-179.062906 179.20914 179.20914 0 0 1 179.062906-179.062906 179.20914 179.20914 0 0 1 179.062906 179.062906 179.282256 179.282256 0 0 1-179.062906 179.062906z m0 0" p-id="14954"></path></svg>
    </div>
    <div class="setting-panel-wrapper">
        <div class="setting-panel">
            <label>直播流清晰度: </label>
            <input id="video-type-bd" type="radio" name="videoType"><label for="video-type-bd">超清</label>
            <input id="video-type-hd" type="radio" name="videoType"><label for="video-type-hd">高清</label>
            <input id="video-type-dvd" type="radio" name="videoType"><label for="video-type-dvd">流畅</label>
        </div>
    </div>
</div>
`)
}

// 自动领取礼物掉落的宝箱
let receiveTimer;
function autoReceiveTreasure(){
    if($("#J_treasureChestContainer .btn").size() === 0){
        return;
    }
    let alreadyChat = false;
    let receive = ()=>{
        if($("#J_treasureChestContainer .btn.usable").size() > 0){
            $("#J_treasureChestContainer .btn.usable").click()
            clearInterval(receiveTimer);
            receiveTimer = undefined;
        } else if($("#J_treasureChestContainer .btn").size() > 0) {
            if(!alreadyChat){
                //chat('666')
                alreadyChat = true;
            }
        } else {
            clearInterval(receiveTimer);
            receiveTimer = undefined;
        }
    }
    if(!receiveTimer){
        receiveTimer = setInterval(receive, 100);
    }
}

function addEventListener(){
    $("#player-fullpage-btn").click(()=>{
        setTimeout(()=>{
            if($(".player-narrowpage").size() > 0){
                $("#videoContainer").addClass("huyaplus-page-full-mode");
            } else {
                $("#videoContainer").removeClass("huyaplus-page-full-mode");
                $("#player-ctrl-wrap, #player-gift-wrap").removeClass("show");
            }
        })
    })

    $("#player-fullscreen-btn").click(()=>{
        setTimeout(()=>{
            if($(".player-narrowscreen").size() > 0 && $(".player-narrowpage").size() > 0){
                $("#videoContainer").removeClass("huyaplus-page-full-mode");
                $("#player-ctrl-wrap, #player-gift-wrap").removeClass("show");
            } else if($(".player-narrowpage").size() > 0){
                $("#videoContainer").addClass("huyaplus-page-full-mode");
            }
        })
    })

    $("#player-video").dblclick(()=>{
        setTimeout(()=>{
            if($(".player-narrowpage").size() > 0){
                $("#videoContainer").addClass("huyaplus-page-full-mode");
            } else {
                $("#videoContainer").removeClass("huyaplus-page-full-mode");
                $("#player-ctrl-wrap, #player-gift-wrap").removeClass("show");
            }
        })
    })

    let copeStreamBtn = $(".huyaplus-copy-stream-wrapper .huyaplus-copy-stream-btn");
    let hideCopyStreamBtn = setTimeout(()=>{
        copeStreamBtn.hide();
    }, 2000);
    let shouldHideCopyStreamBtn = true;

    let hideTimeout, shouldHide = true;
    $(".room-player").on("mousemove",".huyaplus-page-full-mode", throttle(()=>{
        $("#player-ctrl-wrap, #player-gift-wrap").addClass("show");
        clearTimeout(hideTimeout);
        let hideFn = ()=>{
            if(shouldHide){
                $("#player-ctrl-wrap, #player-gift-wrap").removeClass("show");
            } else {
                hideTimeout = setTimeout(hideFn, 1000);
            }
        };
        hideTimeout = setTimeout(hideFn, 1000);
    },500)).on("mousemove", "#player-video", throttle(()=>{
        copeStreamBtn.show();
        clearTimeout(hideCopyStreamBtn)
        hideCopyStreamBtn = setTimeout(()=>{
            if(shouldHideCopyStreamBtn){
                copeStreamBtn.hide();
            }
        }, 1100)
    }, 500))

    $("#player-gift-wrap,#player-ctrl-wrap").mouseenter(()=>{
        shouldHide = false;
    }).mouseleave(()=>{
        shouldHide = true;
    })

    copeStreamBtn.mouseenter(()=>{
        shouldHideCopyStreamBtn = false;
    }).mouseleave(()=>{
        shouldHideCopyStreamBtn = true;
    })
}

function throttle(fn,delay){
    let valid = true;
    return function() {
        if(!valid){
            return false;
        }
        fn();
        valid = false;
        setTimeout(() => {
            valid = true;
        }, delay);
    }
}

function addStreamVideoPreview(){
    let previewTimeout,flvPlayer;
    $("body").on('mouseenter','.subscribe-live-item', function(e){
        previewTimeout = setTimeout(()=>{
            let streamUrl = $(e.target).parent().get(0).href;
            $(e.target).parent().prepend(`<video muted="true" id="video-preview" style='width: 100%;height: 100%;display:none;'></video>`)
            doGetStreamUrl(streamUrl).then(videoUrl=>{
                //if(Hls.isSupported()) {
                //    videoUrl = convertStreamIbitrate(videoUrl, 500);
                //    var video = document.getElementById('video-preview');
                //    hls = new Hls();
                //    hls.loadSource(videoUrl);
                //    hls.attachMedia(video);
                //    hls.on(Hls.Events.MANIFEST_PARSED,function() {
                //        let video = document.getElementById('video-preview');
                //        if(video){
                //            $(video).show();
                //            video.play();
                //            toggleLiveItemMask($(e.target).parent(), false)
                //        }
                //    });
                //}
                if (flvjs.isSupported()) {
                    var videoElement = document.getElementById('video-preview');
                    flvPlayer = flvjs.createPlayer({
                        type: 'flv',
                        isLive: true,
                        url: videoUrl
                    });
                    flvPlayer.attachMediaElement(videoElement);
                    flvPlayer.load();
                    flvPlayer.play();
                    $(videoElement).show();
                    toggleLiveItemMask($(e.target).parent(), false)
                }
            }).catch(e=>{
                console.log("Video Preview failed", e)
            })
        }, 1000)
    });

    $("body").on('mouseleave','.subscribe-live-item', function(e){
        clearTimeout(previewTimeout);
        $("#video-preview").remove();
        toggleLiveItemMask($(".video-previewing"), true)
        if(flvPlayer){
            flvPlayer.destroy();
        }
    });
}

function toggleLiveItemMask(liveItemEle, show){
    if(show){
        liveItemEle.removeClass('video-previewing')
    } else {
        liveItemEle.addClass('video-previewing')
    }
}

function autoMaxIbitrate(){
    let el = $('.player-videotype-list>li:first');
    if(el.length === 1){
        el.click();
    }
}

function getConfigKey(key){
    return `huya_plus_config_${key}`;
}

function setConfig(key, value){
    localStorage.setItem(getConfigKey(key), value || "");
}

function getConfig(key){
    return localStorage.getItem(getConfigKey(key)) || "";
}

let filterByKeyword = getConfig("filterByKeyword") === 'true';
let filterHistoryDanmu = localStorage.getItem("shieldHistoryDanmu") === '1';
let filterKeywordList = getConfig("filterKeywordList").split(',');

function addDanmuFilterUI(){
    let danmuSettingPane = $(".player-danmu-pane");
    danmuSettingPane.height(danmuSettingPane.height() + 110);
    $(".danmu-shield-area #shield-history").show();
    let html = `<div class="shield-keyword-pane">
        <div id="shield-keyword" class="shield-cked">
                    <div class="danmu-shield-cbox"></div>
                    <em>屏蔽关键词</em>
                </div>
                <textarea id="shield-keyword-input" placeholder="填写弹幕屏蔽关键词，每行一个"></textarea>
    </div>`
    danmuSettingPane.prepend(html);

    let keywordShieldSwitch = $("#shield-keyword");
    let keywordShieldInput = $("#shield-keyword-input");
    if(filterByKeyword !== keywordShieldSwitch.hasClass("shield-cked")){
        keywordShieldSwitch.toggleClass("shield-cked");
    }
    keywordShieldInput.attr("disabled", !filterByKeyword);

    if(filterKeywordList && filterKeywordList.length > 0){
        keywordShieldInput.val(filterKeywordList.join("\n"));
    }

    keywordShieldSwitch.click(()=>{
        keywordShieldSwitch.toggleClass("shield-cked");
        filterByKeyword = keywordShieldSwitch.hasClass("shield-cked");
        setConfig("filterByKeyword", filterByKeyword)
        keywordShieldInput.attr("disabled", !filterByKeyword);
    });

    keywordShieldInput.blur(()=>{
        let keywordInput = keywordShieldInput.val();
        filterKeywordList = keywordInput.split('\n').map(it=>it.trim()).filter(it=>it&&it.length > 0);
        setConfig("filterKeywordList", filterKeywordList.join(','));
    });

    let shieldHistorySwitch = $("#shield-history");
    shieldHistorySwitch.click(()=>{
        filterHistoryDanmu = !filterHistoryDanmu;
    })
}

let danmuFilterTimer;
function danmuFilter(){
    setTimeout(addDanmuFilterUI, 10000);

    if(danmuFilterTimer){
        clearInterval(danmuFilterTimer);
    }
    danmuFilterTimer = setInterval(()=>{
        let danmuList = $('#danmudiv>.danmu-item')
        let danmuTextList=[];
        for(let i = 0; i < danmuList.length; i++){
            let danmuItem = $(danmuList.get(i));
            let danmuText = danmuItem.find('span').get(0).innerText;
            if(filterHistoryDanmu && danmuTextList.indexOf(danmuText) > -1){
                console.log(`过滤重复弹幕：${danmuText}`)
                danmuItem.remove()
                continue;
            }
            danmuTextList.push(danmuText)
            if(filterByKeyword && filterKeywordList && filterKeywordList.length > 0){
                for(let keyword of filterKeywordList){
                    if(danmuText.indexOf(keyword) > -1){
                        console.log(`过滤关键词(${keyword})弹幕：${danmuText}`)
                        danmuItem.remove()
                    }
                }
            }
        }
    }, 100)
}

function addPlayerControlBtn(){
    let playerControlHtml = `<div id="huyaplus-player-control">
        <div class="huyaplus-player-control-btn" id="player-mirror-btn" title="视频镜像"/>
        <div class="huyaplus-player-control-btn" id="player-rotate-btn" title="视频旋转"/>
        <div class="huyaplus-player-control-btn" id="player-joysound-btn" title="joysound音效增强"></div>
    </div>`;
    $(".player-ctrl-btn").prepend(playerControlHtml);

    let rotateCount = 0;
    let mirror = false;
    let scale = "scale(1)";
    $("#videoContainer").on("click", "#player-mirror-btn", ()=>{
        let videoEle = $("#player-video>#hy-video");
        if(!videoEle.hasClass("huya-plus-transformed")){
            mirror = false;
            rotateCount = 0;
            scale = "scale(1)";
        }

        mirror = !mirror;
        let rotateY = mirror ? "rotateY(180deg)" : "rotateY(0deg)";
        $("#player-video>#hy-video").css("transform", `${rotateY}rotateZ(${rotateCount * 90}deg)${scale}`)
            .addClass("huya-plus-transformed");
    }).on("click", "#player-rotate-btn", ()=>{
        let videoEle = $("#player-video>#hy-video");
        if(!videoEle.hasClass("huya-plus-transformed")){
            mirror = false;
            rotateCount = 0;
        }

        let rotateY = mirror ? "rotateY(180deg)" : "rotateY(0deg)";
        if(rotateCount % 2 === 0){
            let scaleValue = videoEle.height() / videoEle.width();
            scale = `scale(${scaleValue})`;
        } else {
            scale = "scale(1)";
        }
        videoEle.css("transform", `${rotateY}rotateZ(${++rotateCount * 90}deg)${scale}`)
            .addClass("huya-plus-transformed");
    })

    if(localStorage.getItem("Ex_isJoysound") === '1'){
        $("#player-joysound-btn").addClass("active");
    }

    $("#player-joysound-btn").click(e=>{
        if(unsafeWindow.hasInstalledJoysound){
            let enabled = localStorage.getItem("Ex_isJoysound");
            if(enabled === '1'){
                unsafeWindow.disableJoysound();
                $("#player-joysound-btn").removeClass("active");
            } else {
                unsafeWindow.enableJoysound();
                $("#player-joysound-btn").addClass("active");
            }
        } else if(confirm("启用此功能需要安装Joysound视频音效增强脚本，是否前往安装？")){
            unsafeWindow.open("https://greasyfork.org/zh-CN/scripts/439845-joysound%E8%A7%86%E9%A2%91%E9%9F%B3%E6%95%88%E5%A2%9E%E5%BC%BA");
        }
    })
}

function addQuickChatBar(){
    let quickChatBarHtml = `
        <div class="quick-chat-bar-wrapper ele-hide">
            <div class="quick-chat-input-wrapper">
                <input id="quick-chat-input" type="text" autocomplete="off" placeholder="请输入弹幕,Enter键发送"/>
            </div>
            <div class="quick-chat-input-count">0/30</div>
            <div class="quick-chat-send-btn" id="quick-chat-send-btn">发送(enter)</div>
        </div>
    `;
    $("#videoContainer").append(quickChatBarHtml);
    let wrapper = $(".quick-chat-bar-wrapper");
    let input = $("#quick-chat-input");
    $("#videoContainer").attr("tabindex","999").focus().keyup(e=>{
        let isFullPage = $(".player-narrowpage").size() > 0 || $(".player-narrowscreen").size() > 0;
        if(e.keyCode === 13){
            if(!wrapper.hasClass("ele-hide")){
                wrapper.toggleClass("ele-hide");
            } else if(isFullPage){
                wrapper.toggleClass("ele-hide");
                if(!wrapper.hasClass("ele-hide")){
                    input.focus();
                }
            }
            e.stopPropagation();
        }
    });

    let tooFast = false;
    let countInput = true;
    input.keyup(e=>{
        if(e.keyCode === 13){
            let text = input.val();
            if(text && text.length > 0){
                if(!tooFast){
                    let sendTimeout = chat(text);
                    if(sendTimeout === 0){
                        wrapper.addClass("ele-hide");
                        $("#videoContainer").focus();
                        input.val("");
                        setInputCount(0);
                    } else {
                        tooFast = true;
                        $("#quick-chat-send-btn").toggleClass("div-disabled");
                        let disableTimer = setInterval(()=>{
                            if(sendTimeout > 0){
                                $("#quick-chat-send-btn").text(`倒计时:${sendTimeout}`);
                                sendTimeout--;
                            } else {
                                $("#quick-chat-send-btn").text("发送(enter)").toggleClass("div-disabled");
                                clearInterval(disableTimer);
                                tooFast = false;
                            }
                        }, 1000);
                    }
                }
            } else {
                wrapper.toggleClass("ele-hide");
                $("#videoContainer").focus();
            }
            e.stopPropagation();
        }
    }).on('compositionend', e => {
        checkInputCount();
        setInputCount(input.val().length);
        countInput = true;
    }).on('input', e => {
        if(countInput) {
            checkInputCount();
            setInputCount(input.val().length);
        }
    }).on('compositionstart', e => {
        countInput = false;
    })

    let setInputCount = cnt => $(".quick-chat-input-count").text(`${cnt}/30`);
    let checkInputCount = ()=>{
        let text = input.val();
        if(text.length >= 30) {
            input.val(text.substring(0, 30));
        }
    }
}

async function initPlayer(){
    await waitLoad(()=>$("#player-fullpage-btn").length > 0)
    setTimeout(autoMaxIbitrate, 100)
    setTimeout(()=>$("#player-fullpage-btn").click(), 1000)
    setTimeout(addPlayerControlBtn, 1000)
    setTimeout(addQuickChatBar, 1000)
}

let count = 0;
let timer,treasureTimer;
(async function() {
    await waitLoad(jqueryLoaded)
    cleanPage();
    autoNightMode();
    addNightModeSwitcher();
    //settings();
    addUi();
    addStreamVideoPreview();

    if($("#liveRoomObj").length > 0){
        await addCopyStreamContent();
        if(treasureTimer) clearInterval(treasureTimer)
        treasureTimer = setInterval(autoReceiveTreasure, 30000)

        await initPlayer();
        addEventListener();
        //danmuFilter();

        let intervalInMills = 60 * 1000;
        let task = ()=>{
            autoReceiveBoxReward();
        };
        task();
        if(timer) clearInterval(timer);
        timer = setInterval(task,intervalInMills);
    }
})();
