// ==UserScript==
// @name         b站直播样式,粉丝牌子样式优化
// @namespace    http://tampermonkey.net/
// @version      1.3.5
// @description  重置b站粉丝牌子的颜色样式，隐藏项目管理的任务
// @author       aotmd
// @match        https://live.bilibili.com/*
// @match        https://link.bilibili.com/p/center/*
// @match        https://www.bilibili.com/blackboard/live/*
// @match       
// @noframes
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/397043/b%E7%AB%99%E7%9B%B4%E6%92%AD%E6%A0%B7%E5%BC%8F%2C%E7%B2%89%E4%B8%9D%E7%89%8C%E5%AD%90%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/397043/b%E7%AB%99%E7%9B%B4%E6%92%AD%E6%A0%B7%E5%BC%8F%2C%E7%B2%89%E4%B8%9D%E7%89%8C%E5%AD%90%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
	var setting={
		聊天上下间距:0,
        直播界面调整:true,
        活动页面跳转原始页面:true,
        粉丝牌子样式更改:true,
        粉丝牌子圆角:true
	};
    //1.1.0更新内容,当发现有活动主题时,跳转到原始页面
    var Removeactivetopics=function Removeactivetopics(){
        var dot=document.getElementsByTagName("iframe");
        var regex=/live\.bilibili\.com\/blanc\/.+?liteVersion=true/;
        for(var i=0;i<dot.length;i++){
            if(regex.test(dot[i].src)){
            	window.location.href=dot[i].src;
            }
        }
    };
    if(setting.活动页面跳转原始页面){
        setTimeout(Removeactivetopics,0);
        setTimeout(Removeactivetopics,5000);
    }

    setInterval(() => {
    //1.2.3 删除因调整窗口导致无法正常隐藏的反馈按钮。
        var Feedback=document.querySelector("#js-player-decorator > div > div.bilibili-live-player-video-area > img");
        if(Feedback!=null)Feedback.remove();
    },1000);
    //自动下拉窗口
    window.onload=function (){
    	setTimeout(function(){
    		window.scrollTo(0,64);
    	},0);
	};
    /*样式调整*/
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
if(setting.直播界面调整){
    addStyle(`
/*1.0.0*/
/*聊天栏宽度调整*/
#aside-area-vm {
    width: 400px !important;
    right: -150px !important;
}

/*调整排行榜:居中,元素宽度100%*/
.tabs.isHundred {
    text-align: center;
    margin: 0 auto;
}
#rank-list-ctnr-box {
    width: 100%!important;
}

/*调整视频区域位置与大小*/
.live-room-app .app-content .app-body .player-and-aside-area .left-container {
    width: calc(100% - 212px - 12px)!important;
    right: 50px;
}

/*----------下拉框调整----------*/

/*提示文字*/
.guard-rank-cntr .rank-cntr .btn-box .guard-daily-record .board-icon+.daily-text {
    margin-top: -63px !important;
}
/*上船按钮*/
button.bl-button.live-skin-highlight-text.live-skin-separate-area-hover.bl-button--primary.bl-button--size {
    left: -35px !important;
    top: -34px !important;
}
/*div位置调整*/
.guard-daily-record.live-skin-main-text {
    margin-left: 52px;
}
/*航海之旅文字*/
img.daily-record-title-img {
    left: 150px !important;
}
/*图标*/
.guard-rank-cntr .rank-cntr .btn-box .guard-daily-record .board-icon {
    top: -18px !important;
    left: -277px !important;
}

/*---------下拉框调整END---------*/

    	`);
}
if(setting.粉丝牌子样式更改){
if(!setting.粉丝牌子圆角){
    addStyle(`
    /*1.3.5 去除圆角*/
        .fans-medal-item,.fans-medal-item::after {
            border-radius: unset!important;
        }
    `);
}
addStyle(`
/*2233按钮位置调整*/
.avatar-btn.pointer.a-scale-in-ease.model-22 {
    left: 150px;
    position: relative;
}
.avatar-btn.pointer.a-scale-in-ease.model-33 {
    left: 150px;
    position: relative;
}

/*迷你播放器调整:删除圆角,全显示标题*/
.live-player-ctnr.minimal {
    border-radius: 0;
    width: 1280px;
    height: 720px;
}
.live-player-ctnr.minimal:before {
    width: auto !important;
}

/*背景高度调整*/
.room-bg.p-fixed {
    max-height: 1080px !important;
}

/*1.1.1优化辣条提示,不导致聊天区域上升*/
div#penury-gift-msg {
    max-height: 26px;
    bottom: 18px;
}
div#chat-history-list {
    height: 100%
}
/*1.1.3减慢礼物提示动画速度*/
.penury-gift-item.v-middle.a-move-in-top {
    -webkit-animation: move-in-top cubic-bezier(.22,.58,.12,.50) 0.8s;
    animation:move-in-top cubic-bezier(.22,.58,.12,.50) 0.8s;
}
/*1.1.4舰长margin、背景、标志、边框、名字高亮、padding消除*/
.chat-history-panel .chat-history-list .chat-item.danmaku-item.chat-colorful-bubble {
	margin: 0!important;
	background-color: transparent!important;
}
.fans-medal-item.medal-guard{
	margin-left:0px!important;
	border-color: #769fd2!important
}
i.medal-deco.medal-guard{
	display: none!important;
}
.fans-medal-item .fans-medal-label.medal-guard{
	padding-left: 4px!important;
}
.chat-colorful-bubble span.user-name.v-middle.pointer.open-menu{
	 color: #aaa!important;
}
/*1.1.5 屏蔽进场,关注,分享,特别关注等信息提示*/
.chat-item.important-prompt-item{
	 display: none;
}
/*1.1.6 屏蔽进场信息*/
div#brush-prompt {
	 display: none;
}

/*1.2.0覆盖牌子颜色*/
/*1-4级*/
.fans-medal-label[style*="#5c968e"],.fans-medal-label[style*="rgb(92, 150, 142)"]{
    background-image: linear-gradient(45deg, #268420 -50%, #3fef31 100%)!important;
}
.fans-medal-level[style*="#5c968e"],.fans-medal-level[style*="rgb(92, 150, 142)"]{
    color: #268420!important;
}
.fans-medal-item[style*="#5c968e"],.fans-medal-item[style*="rgb(92, 150, 142)"]{
    border-color:#268420!important;
}

/*5-8级*/
.fans-medal-label[style*="#5d7b9e"],.fans-medal-label[style*="rgb(93, 123, 158)"]{
    background-image: linear-gradient(45deg, #145fb5 0%, #5896DE 100%)!important;
}
.fans-medal-level[style*="#5d7b9e"],.fans-medal-level[style*="rgb(93, 123, 158)"]{
    color: #5896DE!important;
}
.fans-medal-item[style*="#5d7b9e"],.fans-medal-item[style*="rgb(93, 123, 158)"]{
    border-color:#5896DE!important;
}

/*9-12级*/
.fans-medal-label[style*="#8d7ca6"],.fans-medal-label[style*="rgb(141, 124, 166)"]{
    background-image: linear-gradient(45deg, #6a4c96 0%, #a068f1 100%)!important;
}
.fans-medal-level[style*="#8d7ca6"],.fans-medal-level[style*="rgb(141, 124, 166)"]{
    color: #a068f1!important;
}
.fans-medal-item[style*="#8d7ca6"],.fans-medal-item[style*="rgb(141, 124, 166)"]{
    border-color:#a068f1!important;
}

/*13-16级*/
.fans-medal-label[style*="#be6686"],.fans-medal-label[style*="rgb(190, 102, 134)"]{
    background-image: linear-gradient(45deg, #ef3c7b -50%, #FF86B2 100%)!important;
}
.fans-medal-level[style*="#be6686"],.fans-medal-level[style*="rgb(190, 102, 134)"]{
    color: #FF86B2!important;
}
.fans-medal-item[style*="#be6686"],.fans-medal-item[style*="rgb(190, 102, 134)"]{
    border-color:#FF86B2!important;
}

/*17-20级*/
.fans-medal-label[style*="#DC6B6B99"],.fans-medal-label[style*="rgb(199, 157, 36)"]{
    background-image: linear-gradient(45deg, #F6BE18 0%, #ffd045 100%)!important;
}
.fans-medal-level,.fans-medal-level[style*="rgb(199, 157, 36)"]{
    color: #F6BE18!important;
}
.fans-medal-item[style*="#DC6B6B99"],.fans-medal-item[style*="rgb(199, 157, 36)"]{
    border-color:#F6BE18!important;
    background-image: linear-gradient(45deg, #F6BE18 0%, #ffd045 100%)!important;
}
/*1.2.2 隐藏高能提示*/
.top3-notice.chat-item {
    display: none!important;
}
/*1.2.3 隐藏系统提示*/
.chat-item.convention-msg.border-box {
    display: none;
}
/*1.2.3 隐藏热榜提示*/
.chat-item.hot-rank-msg {
    display: none;
}
/*1.2.7 设置弹幕为全屏*/
.danmaku-item-container {
    width: auto!important;
    height: 100%!important;
}
/*1.2.8 补全粉丝牌子border*/
.fans-medal-item {
        border-left: 1px solid!important;
}
/*1.2.9 聊天列表闪动修复*/
div#chat-history-list {
    height: 100%!important;
}
/*1.3.1 屏蔽参加活动提示*/
.chat-item.common-danmuku-msg.border-box {
    display: none;
    height: 0px;
    margin: 0px!important;
}
/*1.3.2 屏蔽使用APP提示*/
.shop-popover {
    display: none;
}
/*1.3.3 屏蔽荣誉等级,在粉丝勋章左边*/
.wealth-medal-ctnr.fans-medal-item-target.dp-i-block.p-relative.v-middle {
    display: none;
}
`);
}
    /*1.1.2 调整聊天上下间距*/
    addStyle(".chat-history-panel .chat-history-list .chat-item{padding: "+setting.聊天上下间距+"px 5px !important;}");
})();