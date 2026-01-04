// ==UserScript==
// @name         熊猫TV HTML5播放器自动网页全屏
// @name:zh-CN   熊猫TV HTML5播放器自动网页全屏
// @namespace    pandatv
// @version      0.3
// @description  缩进左栏、自动网页全屏、关闭弹幕、双击隐藏显示播放器控制栏、聊天框刷屏、关闭抽奖
// @author       Qing
// @match        https://www.panda.tv/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/38142/%E7%86%8A%E7%8C%ABTV%20HTML5%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/38142/%E7%86%8A%E7%8C%ABTV%20HTML5%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    $(function(){
        var url = window.location.href;
        if(!isNaN(url.substring(url.lastIndexOf("/")+1, url.length))){
            setTimeout(function(){
				autoclick();
				autoSendMessage();
			},500);
        }
    });
})();

function autoclick() {
    var side = $(".psbar__toggle");//左侧栏
	var player = $('div.room-player-swf-box');
    var control = $(".h5-control");//播放器控制栏
    var danmuBtn = $("div.h5player-control-circlebar-danmu");//弹幕按钮
    var fullscreenBtn = $("span.h5player-control-bar-fullscreen");//网页全屏按钮
    var roomBtn = $(".room-chat-expand-btn");//聊天框隐藏按钮
    var cleanmodel = $(".h5player-control-circlebar-cleanmodel");//清爽模式按钮

    if(side.length == 1 && player.length == 1 && control.length == 1 && danmuBtn.length == 1 && fullscreenBtn.length == 1 && roomBtn.length == 1 ) {
		if($("#room_matrix").hasClass("open-state")) {
            side.click();//缩进左栏
        }
        if(danmuBtn.hasClass("open-switch")) {
            danmuBtn.click();//关闭弹幕
        }
        if(!cleanmodel.hasClass("open-switch")){
            cleanmodel.click();//开启清爽模式
        }
        fullscreenBtn.click();//进入剧场模式
        roomBtn.click();//关闭聊天栏

		player.off('dblclick');//取消已注册的双击事件
		player.find('*').off('dblclick');//取消已注册的双击事件
		player.dblclick(function(){
			control.toggle();// 显示隐藏状态栏
		});
    }
    else if(side.length == 0 || player.length == 0 || danmuBtn.length == 0 || fullscreenBtn.length == 0 || roomBtn.length == 0) {
        setTimeout(function(){autoclick();},500);
    }
}
function autoSendMessage(){
	window._chat_id=window._chat_id?window.clearInterval(window._chat_id):window.setInterval(function(){
		window._chat_ta=window._chat_ta?window._chat_ta:$('.room-chat-texta');//聊天输入框
		window._chat_s=window._chat_s?window._chat_s:$('.room-chat-send');//聊天发送按钮
		window._chat_ta_v=window._chat_ta.val();//输入内容
		if(!$.isEmptyObject(window._chat_ta_v)&&window._chat_ta_v!=""&&window._chat_s.text()=="发送"&&!window._chat_ta.is(':focus')){
			window._chat_s.click();//发送内容
			window._chat_ta.val(window._chat_ta_v);//重置输入框内容
		}
	},500);
}