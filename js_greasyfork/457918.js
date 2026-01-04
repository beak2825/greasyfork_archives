// ==UserScript==
// @name bilibili播放界面卡片ui
// @namespace https://greasyfork.org/users/1008796
// @version 0.0.1.20230109140508
// @description 初学css，简单修改了一些样式，主要是修改为卡片式UI
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bilibili.com/video/*
// @downloadURL https://update.greasyfork.org/scripts/457918/bilibili%E6%92%AD%E6%94%BE%E7%95%8C%E9%9D%A2%E5%8D%A1%E7%89%87ui.user.js
// @updateURL https://update.greasyfork.org/scripts/457918/bilibili%E6%92%AD%E6%94%BE%E7%95%8C%E9%9D%A2%E5%8D%A1%E7%89%87ui.meta.js
// ==/UserScript==

(function() {
let css = `
#comment {
	margin-top: 0px!important;
}
#comment * {
	background: none;
}
.reply-box {
	border-radius: 10px;
	background: #fff!important;
	display: flex;
	justify-content: center;
	height: 80px!important;
	padding-right: 20px
}
.reply-item {
	margin-bottom: 20px;
	border-radius: 10px;
	background: #fff!important;
	padding: 0px 20px 0 0px!important;
	text-align: justify;
}
.sub-reply-list {
	background-color: #f1f1f1a3!important;
	border-radius: 10px;
	margin: 8px
}
.view-more-default,.view-more-pagination{
	padding: 10px;
}

.reply-content {
	line-height: 1em!important;
	color: #545353!important
}
.icon.search-word{
	background-size: 11px!important;
}
.reply-box-warp {
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.reply-box-warp textarea {

	line-height: 38px!important;
}
.reply-box .box-normal .reply-box-send[data-v-11f17fb2] {

	flex-basis: 90px;

	border-radius: 888820px!important
}
.view-more-btn {
	background-color: #fb7299!important;
	color: #fff;
	padding: 5px 10px;
	border-radius: 5px;
	margin: 10px;
	transition: all .4s
}
.view-more-btn:hover {
	background-color: #6ebcff!important;
	color: #fff!important;
	transition: all 1.6s
}
#app {
	background-color: #dbdbdb36
}
#v_desc {
	margin-bottom: 15px;
	border-radius: 10px;
	background: #fff!important;
	padding: 10px 20px;
}
.desc-info.desc-v2 {
	background: url("https://s1.ax1x.com/2022/12/28/pSSFl8I.png") no-repeat right bottom;
	background-size: 20%;
	line-height: 1.8em;
	letter-spacing: 1px;
	min-height: 100px!important
}
.desc-info-text {
	line-height: 2em;
	color: #393939;
	text-align: justify-all!important;
	background-color: #ffffffe3
}
.tag-link.bgm-link {
    background: #afd6f778 !important;
    border-radius: 6px!important;
    color: #2897f7!important;
    letter-spacing: 0.5px;
}

.tag-area.clearfix a {
	background: #fff!important;
	border-radius: 6px!important;
}
#activity_vote {
	display: none;
}
.reply-box .box-normal .reply-box-warp .reply-box-textarea[data-v-11f17fb2] {

	line-height: 100%;
}

.base-video-sections-v1 {
	background-color: #fff!important;
	height: 300px;
	padding-top: 15px!important
}
.video-sections-content-list {
	max-height: 220px!important;
	height: 220px!important
}
.bui-collapse-header {
	background-color: #fff!important;
	border-radius: 3330px!important
}

.fixed-reply-box {
	display: none
}

.pagination-page-number,
.pagination-btn {
	background-color: #6ebcff!important;
	padding: 4px 8px;
	margin: 5px!important;
	border-radius: 4px;
	color: #fff;
}
.pagination-page-number.current-page {
	color: #fff!important;
	background-color: #fb7299!important
}

.card-box {
	background: #fff!important;
	padding: 8px 4px 8px 8px;
	border-radius: 6px;
}
.rec-footer {
	background: #fff!important;
	border-radius: 6px;
	font-size: 15px;
	font-weight: 600;
	color: #898989!important;
	letter-spacing: 15px
}
.reply-item .bottom-line[data-v-7df4d141] {
	margin-left: 80px;
	border-bottom: 1px solid #0000;
	margin-top: 14px;
}

.toolbar-left > span {
	margin-right: 15px!important;
	background-color: #fff;
	padding: 6px 14px;
	border-radius: 6px!important;
	transition: all 6s
}
.toolbar-left > span:hover {
	background-color: #d6ecff;
	transition: all 1s
}
.video-toolbar-v1 .toolbar-left .share .info-text {
	display: flex;
	align-items: center;
}
.video-toolbar-v1 .toolbar-left > span {
	width: auto;
}
#share-btn-outer > div {
	width: 90px!important;
}
#share-btn-outer {
	width: 70px!important;
	transition: width 1s
}
#share-btn-outer:hover {
	width: 130px!important;
	transition: width .7s
}
canvas {
	left: 10px!important;
	top: 3px!important;
}
.video-toolbar-v1 {
	border-bottom: none;
}
.video-desc-v1 {
	margin: 6px 0;
}
.video-info-v1 .video-data {
    height: 34px;
}

.video-data-list>span{
	margin: 0px 20px 0px 3px!important;
	transform: scale(1.05)
}
.video-title.tit{
	padding-left: 5px;
	font-size: 21px!important;
	font-weight: 600!important;
	letter-spacing: 1px;
	color: #4d4d4d!important;
	border-left: 0px solid #4d4d4d;
	
}

#danmukuBox div{
	border-radius: 6px!important
}
.bpx-player-dm-wrap{
	height: 340px!important
}
.bpx-player-auxiliary .bpx-player-dm-btn-history {
    margin: 8px auto;
}
#playerWrap *{
	border-radius: 6px!important;
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
