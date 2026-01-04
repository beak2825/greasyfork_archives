// ==UserScript==
// @name         emby-404
// @namespace    mjj
// @version      1.0
// @description  EMBY和Goindex挂载同一个谷歌网盘，目录结构基本一样。替换emby视频路径，直接调用potplayer播放网盘内的视频。
// @author       beiona
// @include	     *:8096/*
// @match        *://emby.beiona.fun/*
// @match        *://test001.beiona.fun/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/415104/emby-404.user.js
// @updateURL https://update.greasyfork.org/scripts/415104/emby-404.meta.js
// ==/UserScript==

var domain404 = "https://emby1.beiona.fun/"

//potplayer按钮。按钮
var timer = setInterval(function() {
    var potplayer = $("div[is='emby-scroller']:not(.hide) .potplayer")[0];
    if(!potplayer){
        var mainDetailButtons = $("div[is='emby-scroller']:not(.hide) .mainDetailButtons")[0];
        if(mainDetailButtons){
              var html = mainDetailButtons.innerHTML;
              mainDetailButtons.innerHTML = html+'<button is="emby-button" id="potPlayer" type="button" class="detailButton emby-button potplayer" > <div class="detailButton-content"> <i class="md-icon detailButton-icon"></i>  <div class="detailButton-text">外链播放</div> </div> </button>';
        }
    }
}, 1)

//potplayer按钮。功能
$(document).on('click', '#potPlayer', function(e) {
    var mediaUrl = $("div[is='emby-scroller']:not(.hide) span.mediaInfoAttributeLabel:contains('路径')").siblings('span')[0];
	var leixing = $("div[is='emby-scroller']:not(.hide) span.mediaInfoAttributeLabel:contains('容器')").siblings('span')[0];
	var leixing1 = leixing.innerHTML
    var url = domain404 + mediaUrl.innerHTML;
	if (leixing1 === "bluray" ){
		url = domain404 + "==bluray==" + mediaUrl.innerHTML;
		window.open(url)
	}
	else{
//获取emby视频路径
//拼接potplayer头部，调用外部播放器
        window.open(url)
    }
})