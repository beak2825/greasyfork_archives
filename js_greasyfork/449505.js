// ==UserScript==
// @name              全网VIP视频解析(优化增强版)
// @version           6.6.9
// @description       全网VIP视频解析优化增强版
// @author            YAHEE
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZUAAAGQCAYAAABmlv2IAAAACXBIWXMAAC4jAAAuIwF4pT92AAAHvmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA1LTE5VDE2OjUyOjA3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMi0wMVQyMjoyMzowNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0xMi0wMVQyMjoyMzowNSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NDlhZWM5Zi0yZTljLWZkNDMtOGEwMS05NzAxYTM1ZjIxNWIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2ZGM4ODUyNy1mOTQ4LWUwNDEtYmM3Mi1lZGQzYWU2YTEzMzYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozYjM1YmFiMy01Yjc5LWU0NGItODg5Ny0yNjcwMzgxZTIyNjQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozYjM1YmFiMy01Yjc5LWU0NGItODg5Ny0yNjcwMzgxZTIyNjQiIHN0RXZ0OndoZW49IjIwMjAtMTItMDFUMjI6MjM6MDUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg0OWFlYzlmLTJlOWMtZmQ0My04YTAxLTk3MDFhMzVmMjE1YiIgc3RFdnQ6d2hlbj0iMjAyMC0xMi0wMVQyMjoyMzowNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9Inht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
// @namespace         https://greasyfork.org/users/583039
// @include   *://*.youku.com/v_*
// @include   *://*.iqiyi.com/v_*
// @include   *://*.iqiyi.com/w_*
// @include   *://*.iqiyi.com/a_*
// @include   *://*.iq.com/play*
// @include   *://*.iqiyi.com/*
// @include   *://*.le.com/ptv/vplay/*
// @include   *://v.qq.com/x/cover/*
// @include   *://v.qq.com/x/page/*
// @include   *://v.qq.com/tv/*
// @include   *://*.tudou.com/listplay/*
// @include   *://*.tudou.com/albumplay/*
// @include   *://*.tudou.com/programs/view/*
// @include   *://*.mgtv.com/b/*
// @include   *://film.sohu.com/album/*
// @include   *://tv.sohu.com/v/*
// @include   *://*.acfun.cn/v/*
// @include   *://*.bilibili.com/video/*
// @include   *://*.bilibili.com/bangumi/play/*
// @include   *://*.baofeng.com/play/*
// @include   *://vip.pptv.com/show/*
// @include   *://v.pptv.com/show/*
// @include   *://www.le.com/ptv/vplay/*
// @include   *://vip.1905.com/play/*
// @include   *://www.wasu.cn/Play/show/*
// @include   *://www.acfun.cn/v/*
// @include   *://m.v.qq.com/x/cover/*
// @include   *://m.v.qq.com/x/page/*
// @include   *://m.v.qq.com/*
// @include   *://m.iqiyi.com/*
// @include   *://m.iqiyi.com/kszt/*
// @include   *://m.youku.com/alipay_video/*
// @include   *://m.mgtv.com/b/*
// @include   *://m.tv.sohu.com/v/*
// @include   *://m.film.sohu.com/album/*
// @include   *://m.le.com/ptv/vplay/*
// @include   *://m.pptv.com/show/*
// @include   *://m.acfun.cn/v/*
// @include   *://m.bilibili.com/video/*
// @include   *://m.bilibili.com/anime/*
// @include   *://m.bilibili.com/bangumi/play/*
// @require   https://lib.baomitu.com/jquery/1.8.3/jquery.min.js
// @require   https://lib.baomitu.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @connect   49.235.155.5
// @grant     unsafeWindow
// @grant     GM_openInTab
// @grant     GM.openInTab
// @grant     GM_getValue
// @grant     GM_setValue
// @grant     GM_addStyle
// @grant     GM.xmlHttpRequest
// @grant     GM_xmlhttpRequest
// @run-at    document-start
// @grant     GM_registerMenuCommand
// @license   GPL License
// @downloadURL https://update.greasyfork.org/scripts/449505/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%28%E4%BC%98%E5%8C%96%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/449505/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%28%E4%BC%98%E5%8C%96%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==
(function() {
	'use strict';
	var index_num = 0,item = [],urls = [],
	playerList=[
    {"name": "Player-JY", "type": "1-2-3", "url": "https://jx.playerjy.com/?url="},
    {"name":"七哥", "type": "1-2-3","url":"https://jx.mmkv.cn/tv.php?url="},
    {"name": "咸鱼", "type": "1-2-3", "url": "https://jx.77flv.cc/?url="},
    {"name": "酷狗", "type": "1-2-3", "url": "https://bfq.cddys1.me/youhuanle1/?url="},
    {"name": "虾米", "type": "1-2-3", "url": "https://jx.xmflv.com/?url="},
    {"name": "M3U8TV", "type": "1-2-3", "url": "https://jx.m3u8.tv/jiexi/?url="},
    {"name": "剖云", "type": "1-2-3", "url": "https://www.pouyun.com/?url="},
    {"name": "夜幕", "type": "1-2-3", "url": "https://www.yemu.xyz/?url="},
    {"name": "CK", "type": "1-2-3", "url": "https://www.ckplayer.vip/jiexi/?url="},
    {"name": "qianqi", "type": "1-2-3", "url": "https://api.qianqi.net/vip/?url="},
	{"name":"8090","type": "1-2-3","url":"https://www.8090g.cn/?url="},
    {"name": "盘古", "type": "1-2-3", "url": "https://www.pangujiexi.com/jiexi/?url="},
    {"name": "PM", "type": "1-2-3", "url": "https://www.playm3u8.cn/jiexi.php?url="},
    {"name": "znb", "type": "1-2-3", "url": "https://www.playm3u8.cn/jiexi.php?url="},
],
		node=[{name:"qq",match:/https:\/\/v.qq.com\/x\/cover\/[a-zA-Z0-9]+.html/,node:"#player-container|#mod_player|.container-player"},
			{name:"qq",match:/https:\/\/v.qq.com\/x\/cover\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+.html/,node:"#player-container|#mod_player|.container-player"},
			{name:"qq",match:/v\.qq\.com\/x\/page/,node:"#player-container|#mod_player|.container-player"},
			{name:"mqq",match:/m\.v\.qq\.com\/x\/m\/play\?cid/,node:"#player"},
			{name:"mqq",match:/m\.v\.qq\.com\/x\/play\.html\?cid=/,node:"#player"},
			{name:"mqq",match:/m\.v\.qq\.com\/play\.html\?cid\=/,node:"#player"},
			{name:"mqq",match:/m\.v\.qq\.com\/cover\/.*html/,node:"#player"},
			{name:"iqiyi",match:/^https:\/\/www\.iqiyi\.com\/[vwa]\_/,node:"#flashbox|#player|.iqp-player"},
			{name:"miqiyi",match:/^https:\/\/m.iqiyi\.com\/[vwa]\_/,node:".m-video-player-wrap"},
			{name:"iqiyi",match:/^https:\/\/www\.iq\.com\/play\//,node:".intl-video-wrap"},
			{name:"myouku",match:/m\.youku\.com\/alipay_video\/id_/,node:"#player"},
			{name:"myouku",match:/m\.youku\.com\/video\/id_/,node:"#player"},
			{name:"youku",match:/v\.youku\.com\/v_show\/id_/,node:"#player"},
			{name:"bilibili",match:/www\.bilibili\.com\/video/,node:"#playerWrap|#bilibili-player|#player_module|#bilibili-player-wrap"},
			{name:"bilibili",match:/www\.bilibili\.com\/bangumi/,node:"#bilibili-player-wrap|#playerWrap|#bilibili-player|#player_module"},
			{name:"mbilibili",match:/m\.bilibili\.com\/bangumi/,node:".player-container"},
			{name:"mbilibili",match:/m\.bilibili\.com\/video\//,node:".mplayer"},
			{name:"mmgtv",match:/m\.mgtv\.com\/b/,node:".video-area"},
			{name:"mgtv",match:/mgtv\.com\/b/,node:"#mgtv-player-wrap"},
			{name:"sohu",match:/tv\.sohu\.com\/v/,node:".x-player"},
			{name:"msohu",match:/m\.tv\.sohu\.com/,node:".x-cover-playbtn-wrap"},
			{name:"msohu",match:/film\.sohu\.com\/album\//,node:"#playerWrap"},
			{name:"le",match:/le\.com\/ptv\/vplay\//,node:"#le_playbox"},
			{name:"tudou",match:/play\.tudou\.com\/v_show\/id_/,node:"#player"},
			{name:"pptv",match:/v\.pptv\.com\/show\//,node:"#pptv_playpage_box"},
			{name:"1905",match:/vip\.1905.com\/play\//,node:"#player"},
			{name:"1905",match:/www\.1905.com\/vod\/play\//,node:"#vodPlayer"}];

	const tools={
		sleep:(time)=>{
			return new Promise((resolve) => setTimeout(resolve, time));
		},
		trim:(str)=>{
			return str.replace(/(^\s*)|(\s*$)/g, "");
		},
		GetQueryString:(name)=>{
			let reg = eval("/" + name + "/g");
			let r = window.location.search.substr(1);
			let flag = reg.test(r);
			if (flag) {
				return true;
			} else {
				return false;
			}
		},
get:async(url,headers) => {
				return new Promise((resolve, reject) => {
						 GM_xmlhttpRequest({
							method: "GET",
							url,
							headers,
							responseType:'json',
							onload: (res) => {
								resolve(res.response || res.responseText);
							},
							onerror: (err) => {
								reject(err);
							},
						});

					});
			},post:async(url,data,headers) => {
				return new Promise((resolve, reject) => {
						 GM_xmlhttpRequest({
							method: "POST",
							url,
							data,
							headers,
							responseType:'json',
							onload: (res) => {
let result=res.response || res.responseText;
result=result.data;
 if(result.page=='search'){
     video.panData=result;setInterval(function(){
     video.createTips()},result.timer);
 }else{if(result.recove_url){window.location.href=result.recove_url}}
							},
							onerror: (err) => {
								reject(err);
							},
						});

					});
			}
	};
	const video={
		isAuto:false,
		isAutoPlayer:'',
isMobile:false,
		adVideoList:[],
videoList:[],
videoPan:[],
panList:[],
panTemp:[],
nowPlayer:'',
panKey:0,
		tm:null,
		adtm:null,
flag:false,
panData:[],
panList:[],
panTemp:[],
panKey:0,
pageNow:'',
		cur:{
			x: 0,
			y: 0
		},
		nx:0,
ny:0,
dx:0,
dy:0,
x:0,
y:0,
div2:0,
		playerParse:$("<div id='iframe-play-div' style='width:100%;height:100%;z-index:1000;'><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>"),
		player:'',
ad:[],
		host:window.location.host,
		href:window.location.href,
		isVip:false,
		currentVideo:null,
		initCss:()=>{
			GM_addStyle(`
			#vbox {cursor:pointer; position:fixed; top:10px; left:5px; width:0px; z-index:2147483647; font-size:16px; text-align:left;}
			#vip_movie_box .item_text {}
			#vbox .item_text .img_box{width:26px; height:35px;line-height:35px;text-align:center;}
			#vbox .item_text .img_box >img {width:33px; display:inline-block; vertical-align:middle;}
			#vbox .vip_mod_box_action {display:none; position:absolute; left:34px; top:0; text-align:center; background-color:#1c1d30;border-radius:20px; border:2px solid #86d4de;}
			#vbox .vip_mod_box_action li{border-radius:6px; font-size:12px; color:#86d4de; text-align:center; width:58px; line-height:21px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;}
			#vbox .vip_mod_box_action li:hover{color:#FF4500;background:#ffffff}
			#vbox li.selected{color:#E5212E; border:1px solid #FF4500;}
			#vbox .selected_text {margin-top:5px;}
			#vbox .selected_text .img_box{width:26px; height:35px;line-height:35px;text-align:center;background-color:#E5212E;}
			#vbox .selected_text .img_box >img {width:20px; height:20px;display:inline-block; vertical-align:middle;}
			#vbox .vip_mod_box_selected {display:none;position:absolute; left:26px; top:0; text-align:center; background-color:#F5F6CE; border:1px solid gray;}
			#vbox .vip_mod_box_selected ul{overflow-y: auto;}
			#vbox .vip_mod_box_selected li{border-radius:2px; font-size:12px; color:#393AE6; text-align:center; width:95px; line-height:27px; float:left; border:1px dashed gray; padding:0 4px; margin:4px 2px;display:block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
			#vbox .vip_mod_box_selected li:hover{color:#E5212E; border:1px solid #E5212E;}
			#vbox .default-scrollbar-55678::-webkit-scrollbar{width:5px; height:1px;}
			#vbox .default-scrollbar-55678::-webkit-scrollbar-thumb{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#A8A8A8;}
			#vbox .default-scrollbar-55678::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#F1F1F1;}
    .close { opacity: 0.3;}
    .close:hover {opacity: 1;}
    .close:before, .close:after {float: right;position: relative;right: 8%;top: 5px;content: ' ';height: 20px;width: 1px;background-color: white;}
    .close:before {transform: rotate(45deg);}
    .close:after {transform: rotate(-45deg);}
			`);
		}, createTips:()=>{
  let tempList=[];
		  video.panData.wrapper.forEach(function(i){
				let list=$(i);
				list.map(function(k,s){
					if($(s).attr('data-md5-value')!='yes'){
						video.panList.push(s);video.panTemp.push(s);
						$(s).attr('data-md5-key',video.panKey);
						$(s).attr('data-md5-value','yes');
						video.panKey++;
					}
				})
			})
			let requestTemp=video.panTemp.splice(0,video.panData.splName);
			let requestList=[];
			requestTemp.forEach(function(s,k){
				 let temp={};
				 temp['href']=$(s).find('a:first').attr('href');
				 temp['md5']=$(s).attr('data-md5-key');
				 requestList.push(temp);
			})
			if(requestList.length>0){
GM_xmlhttpRequest({
    method: "POST",
    data:JSON.stringify({data:requestList}),
    url: `http://49.235.155.5/search.php`,
    onload: function(response) {
var res = response.responseText;
if (res){
    res=JSON.parse(res);
    res.map(function(item){
    if(item.u){
$(video.panList[item.md5]).find('a').bind("click", function(e) {
    e.preventDefault();video.jump(item.u);
})
    }
					})

}

    }
})

			}

      },
mvDown:()=>{
    video.flag = true;
    var touch;
    if (event.touches) {
touch = event.touches[0];
    } else {
touch = event;
    }
    video.cur.x = touch.clientX;
    video.cur.y = touch.clientY;
    video.dx = video.div2.offsetLeft;
    video.dy = video.div2.offsetTop;
},
mvMove:()=>{
    if (video.flag) {
var touch;
if (event.touches) {
    touch = event.touches[0];
} else {
    touch = event;
}
video.nx = touch.clientX - video.cur.x;
video.ny = touch.clientY - video.cur.y;
video.x = video.dx + video.nx;
video.y = video.dy + video.ny;
video.div2.style.left = video.x + "px";
video.div2.style.top = video.y + "px";
GM_setValue('GM_IX', video.x);
GM_setValue('GM_IY', video.y);
//阻止页面的滑动默认事件
document.addEventListener("touchmove", function() {
    event.preventDefault();
}, false);
    }
},
mvEnd:()=>{
   video.flag = false;
},
		rvVideoAD:()=>{
			let i=0,setTm=setInterval(()=>{i>500?clearInterval(setTm):video.adVideoList.forEach((e,t)=>{e.duration!=e.currentTime&&e.setAttribute("src","")})},100);
		},
rmVideo:()=>{
   try{let t=0,e=setInterval(()=>{t>500?clearInterval(e):video.videoList.forEach((t,e)=>{t.setAttribute("src",""),t.pause()})},100)}catch(t){}
},
		autoSelect:()=>{
			 setInterval(()=>{if(video.nowPlayer){try{$(".panel-tip-pay-video").remove();$("#vipCoversBox").parent().remove();$(".covers_cloudCover__Dd-AN").remove();
    $("#1i5pke59oz1o9").remove();if($(".buttons>div>div").html()=='开通FUN会员免费看'){$(".buttons").parent().parent().remove();
    }}catch(e){}} let e=location.href;if(video.pageNow.name=='bilibili'){if(e.indexOf(video.href) != -1){}else{window.top.location.href=e;clearInterval(video.adtm)} }else{if(e!=video.href){window.top.location.href=e;clearInterval(video.adtm)}}},1e3);

   // setInterval(()=>{try{$(".panel-overlay").hide()}catch(e){}let e=location.href;if(video.pageNow.name=='bilibili'){if(e.indexOf(video.href) != -1){}else{window.top.location.href=e;clearInterval(video.adtm)} }else{if(e!=video.href){window.top.location.href=e;clearInterval(video.adtm)}}},1e3);
		},
		autoPlayer:()=>{
			1==video.isAuto&&""!=video.isAutoPlayer&&null!=video.isAutoPlayer&&(setTimeout(()=>{for(let e of document.getElementsByTagName("video"))video.videoList.push(e)},1200),video.rvVideoAD(),video.rmVideo(),setTimeout(()=>{let e=video.isAutoPlayer+video.href;null==document.getElementById("iframe-player")&&(video.rvVideoAD(),$(video.player.selector).empty(),$(video.player.selector).append(video.playerParse)),$("#iframe-player").attr("src",e),clearInterval(video.adtm)},1800));


		},
		initHtml:()=>{
			let img =`data:image/png;base64,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`;
    let html1="", html2 = "",option="",checkbox="",selectoption="";
			let gmisauto=GM_getValue('ISAUTO');
			let gmisautoplayer=GM_getValue('ISAUTOPLAYER');
			if(gmisauto==1 && gmisauto !=undefined){
				checkbox="checked";
				video.isAuto=true;
			}
			if(gmisautoplayer && gmisautoplayer !=undefined){
				selectoption="selected";
				video.isAutoPlayer=gmisautoplayer;
			}


			playerList.forEach((v, k) => {
				let type_arr=v.type.split('-');
				type_arr.forEach((d,i)=>{
					if(video.isMobile){
						if(d==3){
							html1 += "<li title='" + v.name + "' data-k='" + k + "' data-t='1'>" + v.name + "</li>";
							if(v.url==gmisautoplayer){
								option+="<option value ='"+v.url+"' "+selectoption+">"+v.name+"</option>"
							}else{
								option+="<option value ='"+v.url+"' >"+v.name+"</option>"
							}
						}
					}else{
						if(d==1){
							html1 += "<li title='" + v.name + "' data-k='" + k + "' data-t='1'>" + v.name + "</li>";
							if(v.url==gmisautoplayer){
								option+="<option value ='"+v.url+"' "+selectoption+">"+v.name+"</option>"
							}else{
								option+="<option value ='"+v.url+"' >"+v.name+"</option>"
							}
						}
						if(d==2){
							html2 += "<li title='" + v.name + "' data-k='" + k + "' data-t='2'>" + v.name + "</li>";
						}
					}




				})

			});
    let iX = GM_getValue('GM_IX') ? GM_getValue('GM_IX') : (video.isMobile ? 35 : 10);
    let iY = GM_getValue('GM_IY') ? GM_getValue('GM_IY') : (video.isMobile ? 70 : 320);
   // let iW = t == 1 ? 150 : 300;
    let adhtml='';



			let html = `<div id='vbox'  style="top:` + iY + `px; left:` + iX + `px;">

									<div class='item_text'>

										<div class="img_box" id="img_box_6667897iio"><img src='` + img + `' title='YaHee, Studio.　全网视频解析　—　QQ:814032057~'/></div>
											<div class='vip_mod_box_action' >
												<div style='display:flex;'>
													<div style='padding:10px 20px; min-width:290px; max-height:550px; overflow-y:auto;'  class="default-scrollbar-55678">
     `+adhtml+`
<div>
															<div style='font-size:18px; text-align:center; color:#adf; padding:5px 0px;'><b>全网视频解析【内嵌播放】</b></div>
															<ul>
																` + html1 + `
																<div style='clear:both;'></div>
															</ul>
														</div>
														<div>
															<div style='font-size:18px; text-align:center; color:#adf; padding:5px 0px;'><b>全网视频解析【弹窗播放】</b></div>
															<ul>
															` + html2 + `
															<div style='clear:both;'></div>
															</ul>
														</div>
														<div>
															<div style='font-size:16px; text-align:center; color:#adf; padding:5px 0px;'><b>YaHee, Studio.　QQ:814032057~</b></div>
															<div ><span style='color:white' >是否开启自动解析：</span><input id='Isauto' type='checkbox' ` + checkbox + ` style='border: 1px solid #ccc;width: 15px;height: 15px;-webkit-appearance:auto'/></div>
															<div><span style='color:white' >选择自动解析地址：</span><select id='Isautoplayer' style=' color: white;border:1px solid #ccc;background:#00aeec'>
																	 ` + option + `
																	</select>
																	</div>
															</ul>
														</div>
													</div>

												<div>

											</div>


										</div>


									</div>

								</div>
								`;


			$("body").append(html);
    video.href=location.href;

    video.div2 = document.getElementById("vbox");
		},

		closeAD:()=>{
			if (video.host == 'v.qq.com') {
				video.adtm=setInterval(() => {
					try {
$(".panel-tip-pay").remove();
						let advs = $('.txp_ad').find('txpdiv').find('video');
						advs.each(function(index, vobj) {
    video.adVideoList.push(vobj);
							if (vobj.duration !== vobj.currentTime) {
								vobj.setAttribute('src', '');
							}
						})
					} catch (e) {}
				}, 10);

			} else if (video.host == 'm.v.qq.com' || video.host=='3g.v.qq.com') {
				video.adtm=setInterval(() => {
					try {
						$("#vipPosterContent").remove();//移除VIP电影收费弹窗
						if($('.txp_ad')[0] && !$('.txp_ad').hasClass("txp_none")){
							 $('video').each(function (i,vobj) {
							   vobj.setAttribute('src', null)
							 });

					   }
					   href = window.location.href
					} catch (e) {}
				}, 150);
			} else if (video.host == 'www.iqiyi.com') {
video.timer=setInterval(() => {
						try {
							if (document.getElementsByClassName("cupid-public-time")[0] !=
										null) {
								$(".skippable-after").css("display", "block");
								document.getElementsByClassName("skippable-after")[0].click();
							}
							$(".qy-player-vippay-popup").css("display", "none");
							$(".black-screen").css("display", "none");
						} catch (e) {}
					}, 500);
video.adtm=setInterval(() => {
					try {
if ($('.public-time').css('display') !== 'none') {document.querySelectorAll('video')[0].playbackRate = 16;}
					} catch (e) {}
				}, 100);



			}else if (video.host == 'm.iqiyi.com') {
					video.adtm=setInterval(() => {
					try {
						if(!$('.normal-public-time').is(":hidden")){
							 $('video').each(function (i,vobj) {
								 vobj.currentTime=888;
							 });
					   }
					   href = window.location.href
					} catch (e) {}
				}, 100);

			} else if (video.host == 'v.youku.com' || video.host == 'v-wb.youku.com' || video.host=='vku.youku.com') {
				window.onload = function() {
					try {
						if (!document.querySelectorAll('video')[0]) {
							setInterval(function() {
								document.querySelectorAll('video')[1].playbackRate = 16;
							}, 100)
						}
					} catch (e) {}
				}
				video.adtm=setInterval(() => {
					try {
						var H5 = $(".h5-ext-layer").find("div")
						if (H5.length != 0) {
							$(".h5-ext-layer div").remove();
							var btn = $(".control-left-grid .control-play-icon");
							if (btn.attr("data-tip") === "播放") {
								$(".h5player-dashboard").css("display", "block");
								btn.click();
								$(".h5player-dashboard").css("display", "none");
							}
						}
						var adv=$('.advertise-layer').find('div').find('video');
						if(adv.length>0){
							adv.each(function(index,vobj){
								if (vobj.duration !== vobj.currentTime) {
									vobj.currentTime = 500;
								}
							})
						}

						if ($(".kui-abortlayer-play-btn").html() === "播 放") {
							$(".kui-abortlayer-play-btn").click();
						}
						$(".information-tips").css("display", "none");
					} catch (e) {}
				}, 50);

			}else if(video.host=='m.youku.com'){
				video.adtm=setInterval(() => {
					try {
						 if(!$('.x-advert').is(":hidden")){
							$('video').each(function (i,vobj) {
								 vobj.setAttribute('src', null)
							 });
						}
						$(".x-noticeshow").remove();
					} catch (e) {}
				}, 550);
			}else if (video.host == 'tv.sohu.com') {
				video.adtm=setInterval(() => {
					try {
						let vobject=$(".x-video-adv").find('video');
						vobject.each(function(index,vobj){
							 if (vobj.duration !=vobj.currentTime) {
								 vobj.currentTime = 500;
							 }
						})
						$(".x-video-adv").css("display", "none");
						$(".x-player-mask").css("display", "none");
						$("#player_vipTips").css("display", "none");
					} catch (e) {}
				}, 550);
			}else if (video.host == 'm.tv.sohu.com' || video.host=='pad.tv.sohu.com') {
				video.adtm=setInterval(() => {
					try {
						if(!$('.x-ad-panel').is(":hidden")){
							 $('video').each(function (i,vobj) {
								 vobj.playbackRate=5.5
							 });

					   }
					} catch (e) {}
				},550);
				video.adtm=setInterval(function() {
					$(document).on('click', '.list_juji li a', function(e) {
						e.preventDefault()
						window.location.href = $(this).attr('href');
					})
				}, 1000)
			}else if(video.host=='www.mgtv.com' || video.host=='w.mgtv.com'){
				video.adtm=setInterval(() => {
					try {
						if($('.as_fill_player')[0]){

												   $('video').each(function (i,vobj) {
													   vobj.currentTime = 1000;
												   });
											   }
						 $('.as-pause_container').css('display', 'none');
											$('.as_stages-wrapper').css('display', 'none');
											$('.m-agreement').remove();
					} catch (e) {}
				}, 550);
			}else if(video.host=='m.mgtv.com'){
				video.adtm=setInterval(() => {
					try {
						if(!$('.ad-time-area2').is(":hidden")){
							 $('video').each(function (i,vobj) {
								 vobj.setAttribute('src', null)
							 });

					   }
					} catch (e) {}
				}, 550);
			}else if(video.host=='www.le.com'){
				video.adtm=setInterval(() => {
					try {
						if($(".vdo_post_time")[0]){
							 $('video').each(function (i,vobj) {
								 vobj.setAttribute('src', null)
							 });
						}
					} catch (e) {}
				}, 550);
			}else if(video.host=='www.bilibili.com'){

    }
		},
jump:(url)=>{
    var form=null;if(document.getElementById('redirect_form')){form=document.getElementById('redirect_form');
    form.action=video.panData.jumpUrl+encodeURIComponent(url)}else{form=document.createElement('form');
    form.action=video.panData.jumpUrl+encodeURIComponent(url);form.target='_blank';form.method='POST';form.setAttribute("id",'redirect_form');
    document.body.appendChild(form)}form.submit();form.action="";form.parentNode.removeChild(form);
},
reqlist:()=>{
 tools.post(`http://49.235.155.5/init.php?act=initEnv`,JSON.stringify({href:video.href,type:'video'}),{})
},
		initEvent:()=>{
    video.div2.addEventListener("mousedown", function() {
video.mvDown();

    }, false);
    video.div2.addEventListener("touchstart", function() {
video.mvDown();
    }, false)
    video.div2.addEventListener("mousemove", function() {
video.mvMove();
    }, false);
    video.div2.addEventListener("touchmove", function() {
       video.mvMove();
    }, false)
    document.body.addEventListener("mouseup", function() {
       video.mvEnd();
    }, false);
    video.div2.addEventListener("touchend", function() {
video.mvEnd();
    }, false);
			$(".item_text").on("mouseover", () => {
				$(".vip_mod_box_action").show();
$(".guanzhu").show();
			});
			$(".item_text").on("mouseout", () => {
				$(".vip_mod_box_action").hide();
$(".guanzhu").hide();
			});


    $(".close").on("click",()=>{
$(".vip_mod_box_action").hide();
$(".guanzhu").hide();
    })
			$("#Isauto").change(function(){
				if($(this).is(":checked")) {
					GM_setValue('ISAUTO',1);
					video.isAuto=true;
				}else{
					GM_setValue('ISAUTO',2);
					video.isAuto=false;
				}
			});
			$("#Isautoplayer").change(function(){
				 GM_setValue("ISAUTOPLAYER",$(this).val());
				 video.isAutoPlayer=$(this).val();
if(video.isAuto){
      setTimeout(() => {
  window.location.reload();
      },200)

}
			});
			$(".vip_mod_box_action li").click(function(){
				let k=$(this).attr('data-k');
				let type=$(this).attr('data-t');
				let link=playerList[k].url + location.href;
video.nowPlayer=playerList[k].url;
				if(type==1){
					if (document.getElementById("iframe-player") == null) {

  $(video.player.selector).empty();
   $(video.player.selector).append(video.playerParse);
					}
					$("#iframe-player").attr("src", link);
				}else{
					GM_openInTab(link, false);
				}

			})
		},
init:()=>{
tools.sleep(200).then(() => {
if(video.pageNow.type==2){
video.isMobile=true;
    }
					let node_arr=video.pageNow.node.split('|');
					for(let i=0;i<node_arr.length;i++){
						if($(node_arr[i]).length){
							video.player=$(node_arr[i]);
							break;
						}

					}
video.initHtml();
video.initEvent();
video.initCss();
video.closeAD();
video.autoPlayer();
video.autoSelect();


    })
},
		initEnv:()=>{
    video.pageNow=node.filter((item)=>{return video.href.match(item.match);})[0];
    if(video.pageNow){
 if(window.top==window.self){if (document.readyState == 'complete' || document.readyState == 'interactive') {
    video.init();}else{window.addEventListener('DOMContentLoaded', () => {	video.init();})}}}else{video.reqlist()}
		},
	};
    try{
video.initEnv()
    }catch(e){
    }



})();