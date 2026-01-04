// ==UserScript==
// @name         emby
// @namespace    mjj
// @version      0.1
// @description  EMBY和Goindex挂载同一个谷歌网盘，目录结构基本一样。替换emby视频路径，直接调用potplayer播放网盘内的视频。
// @author       beiona
// @include      *:8096/*
// @match        *://emby.beiona.fun/*
// @match        *://test001.beiona.fun/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/415106/emby.user.js
// @updateURL https://update.greasyfork.org/scripts/415106/emby.meta.js
// ==/UserScript==

var embyUrl = "/rclone/tjsp/";
var goindexUrl = "https://tj.beiona.fun/";



//potplayer按钮。按钮
var timer = setInterval(function() {
    var potplayer = $("div[is='emby-scroller']:not(.hide) .potplayer")[0];
    if(!potplayer){
        var mainDetailButtons = $("div[is='emby-scroller']:not(.hide) .mainDetailButtons")[0];
        if(mainDetailButtons){
              var html = mainDetailButtons.innerHTML;
              mainDetailButtons.innerHTML = html+'<button is="emby-button" id="potPlayer" type="button" class="detailButton detailButton-hidemobile emby-button potplayer" > <div class="detailButton-content"> <i class="md-icon detailButton-icon"></i>  <div class="detailButton-text">PotPlayer</div> </div> </button>';
        }
    }
}, 1)

//potplayer按钮。功能
$(document).on('click', '#potPlayer', function(e) {
	var leixing = $("div[is='emby-scroller']:not(.hide) span.mediaInfoAttributeLabel:contains('容器')").siblings('span')[0];
	var leixing1 = leixing.innerHTML
if (leixing1 === "bluray" ){
	window.alert("当前视频格式为蓝光原盘目录，无法直接播放。即将打开网盘页面，请根据目录内的【正片0000X.txt】,手动进入/BDMV/STREAM/子文件夹内，选择视频文件播放")
	var mediaUrl = $("div[is='emby-scroller']:not(.hide) span.mediaInfoAttributeLabel:contains('路径')").siblings('span')[0];
    var url= mediaUrl.innerHTML;

	var oldurl1 = url.replaceAll("https://", "https///");
	var oldurl2 = oldurl1.replaceAll(":", "：");
	var oldurl3 = oldurl2.replaceAll("?", "？");
	var oldurl4 = oldurl3.replaceAll("&amp;", "%26");
	var oldurl100 = oldurl4.replaceAll("https///", "https://");

    var newurl = oldurl100.replaceAll("\\", "/")+"?s";
    var ULTurl = newurl.replace(embyUrl,goindexUrl);
		window.open(ULTurl)
	}
else {
//获取emby视频路径
	var mediaUrl = $("div[is='emby-scroller']:not(.hide) span.mediaInfoAttributeLabel:contains('路径')").siblings('span')[0];
//拼接potplayer头部，调用外部播放器
    var url=mediaUrl.innerHTML;

	var oldurl1 = url.replaceAll("https://", "https///");
	var oldurl2 = oldurl1.replaceAll(":", "：");
	var oldurl3 = oldurl2.replaceAll("?", "？");
	var oldurl4 = oldurl3.replaceAll("&amp;", "%26");
	var oldurl100 = oldurl4.replaceAll("https///", "https://");

//第一次变化\换成/（emby搭在win主机的情况）
    var newurl = "potplayer://"+oldurl100.replaceAll("\\", "/");
//第二次变化将emby地址头部，替换成goindex地址头部，生成最终地址
    var ULTurl = newurl.replace(embyUrl,goindexUrl);
    window.open(ULTurl)
}
})


//由于emby无法索引蓝光目录，所以增加了一个直接打开网盘地址的按钮。按钮
var timer2 = setInterval(function() {
    var blueray = $("div[is='emby-scroller']:not(.hide) .blueray")[0];
    if(!blueray){
        var mainDetailButtons = $("div[is='emby-scroller']:not(.hide) .mainDetailButtons")[0];
        if(mainDetailButtons){
              var html = mainDetailButtons.innerHTML;
              mainDetailButtons.innerHTML = html+'<button is="emby-button" id="blueray" type="button" class="detailButton emby-button blueray" > <div class="detailButton-content"> <i class="md-icon detailButton-icon"></i> <div class="detailButton-text">打开网盘</div> <div class="detailButton-text"></div> </div> </button>';
        }
    }
}, 1000)

//由于emby无法索引蓝光目录，所以增加了一个直接打开网盘地址的按钮。功能
$(document).on('click', '#blueray', function(e) {
//获取emby视频路径
    var mediaUrl = $("div[is='emby-scroller']:not(.hide) span.mediaInfoAttributeLabel:contains('路径')").siblings('span')[0];
//转换一下格式。最后的【+""】解释一下，OneManager-php后面可以加上+"?preview"或者oneindex后面可以加+"?s"，打开视频文件可以进入预览页面，避免直接下载。
    var url= mediaUrl.innerHTML;

	var oldurl1 = url.replaceAll("https://", "https///");
	var oldurl2 = oldurl1.replaceAll(":", "：");
	var oldurl3 = oldurl2.replaceAll("?", "？");
	var oldurl4 = oldurl3.replaceAll("&amp;", "%26");
	var oldurl100 = oldurl4.replaceAll("https///", "https://");

//第一次变化\换成/（emby搭在win主机的情况）
    var newurl = oldurl100.replaceAll("\\", "/") +"?s";
//第二次变化将emby地址头部，替换成goindex地址头部，生成最终地址
    var ULTurl = newurl.replace(embyUrl,goindexUrl);
    window.open(ULTurl)
})