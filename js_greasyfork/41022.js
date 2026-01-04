// ==UserScript==
// @name         视达网-突破单次播放
// @namespace    http://www.c-xyyx.cn
// @version      1.2
// @description  突破视达网VIP
// @author       逍遥一仙
// @match        http://shida66.com/*.html
// @match        http://shida66.com/*.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41022/%E8%A7%86%E8%BE%BE%E7%BD%91-%E7%AA%81%E7%A0%B4%E5%8D%95%E6%AC%A1%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/41022/%E8%A7%86%E8%BE%BE%E7%BD%91-%E7%AA%81%E7%A0%B4%E5%8D%95%E6%AC%A1%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

$("#video-isPlay").unbind();
$('.open-tips').fadeOut();
$(".no-play-video").unbind();
$(".no-play-video")[0].innerText="显示M3U8链接";
for (var i=0;i<$("script").length;i++)
{
if($("script")[i].text.indexOf("m3u8")!==-1){
	var aa=$("script")[i].text;aa=aa.substring(aa.indexOf("play_url = '") + 12, aa.indexOf("m3u8'"))+"m3u8";
	break;}}
$(".no-play-video").click(function(){prompt("请手动复制M3U8链接", aa);});
var video_type = 'hls';
var play_url = aa;
$("#video-isPlay").click(function(){
if(video_type == 'hls'){
	        var flashvars={
	            f:'http://img.shida66.com/app/tool/ckplayer/m3u8.swf',
	            a:play_url,
	            s:4,
	            c:0,
	            p:1,
	            loaded: 'loadedHandler'
	        };

	        var video=[play_url];
	    }else{
	        var flashvars={
	            f:play_url,
	            c:0,
	            p:1,
	            loaded: 'loadedHandler'
	        };

	        var video=[play_url + '->video/mp4'];
	    }
CKobject.embed('http://img.shida66.com/app/tool/ckplayer/ckplayer.swf','shida-player-box','ckplayer-video-player-cont','100%', '100%',false,flashvars,video);
});