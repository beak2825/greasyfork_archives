// ==UserScript==
// @name         全网VIP视频免费破解去广告%；【百度文库破解】内容复制|文档下载；知乎使用增强、链接提醒、回答时间标注、广告标注、视频下载等；Fuck链接中间跳转页等
// @namespace    fengdiansanren_video_text_helper
// @version      2.1.2
// @description  常用功能专属集合: 一、百度文库文档内容自由复制，文档免费下载；二、爱奇艺|腾讯视频|优酷|芒果TV等VIP视频在线看，解析接口贵在稳定够用。支持：Tampermonkey|Violentmonkey|Greasymonkey，版本4.0+以上最佳（每个网站解析按钮位置可自定义，避免遮挡）； 三、知乎使用增强：为知乎视频播放器添加下载功能、为提回和回答添加时间戳、显示提问人、广告标注等；四、Fuck网站中间跳转页，链接直达(当前适配：书签地球、知乎、CSDN等更多适配请留言)；五、YouTube油管播放助手；六、服务器活动集锦 
// @author       人鬼情未了、王超、crud-boy
// @copyright    人鬼情未了, 王超 、crud-boy
// @include      *://wenku.baidu.com/*
// @include      https://*.youku.com/v_*
// @include      https://*.youku.com/alipay_*
// @include      https://*.iq.com/v_*
// @include      https://*.iq.com/w_*
// @include      https://*.iq.com/a_*
// @include      https://*.le.com/ptv/vplay/*
// @include      https://v.qq.com/x/cover/*
// @include      https://v.qq.com/x/page/*
// @include      https://*.tudou.com/listplay/*
// @include      https://*.tudou.com/albumplay/*
// @include      https://*.tudou.com/programs/view/*
// @include      https://*.mgtv.com/b/*
// @include      https://film.sohu.com/album/*
// @include      https://tv.sohu.com/v/*
// @include      https://*.baofeng.com/play/*
// @include      https://vip.pptv.com/show/*
// @include      https://v.pptv.com/show/*
// @include      *://v.vzuu.com/video/*
// @include      *://www.youtube.com/watch?v=*
// @include      *://www.aliyun.com**
// @include      *://cloud.tencent.com** 
// @include      *://www.hostwinds.com**
// @include      *://www.west.cn**
// @include      *://bandwagonhost.com**
// @include      *://www.vultr.com**
// @include      *://*.zhihu.com**
//--------------------------------
// @include      https://show.bookmarkearth.com/view/*
// @include      https://www.jianshu.com/go-wild?ac=2&url=*
// @include      https://link.csdn.net/?target=*

// @connect      zhihu.com
// @connect      vzuu.com
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @grant        GM_info
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @run-at       document-end
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/443851/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%25%EF%BC%9B%E3%80%90%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E7%A0%B4%E8%A7%A3%E3%80%91%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6%7C%E6%96%87%E6%A1%A3%E4%B8%8B%E8%BD%BD%EF%BC%9B%E7%9F%A5%E4%B9%8E%E4%BD%BF%E7%94%A8%E5%A2%9E%E5%BC%BA%E3%80%81%E9%93%BE%E6%8E%A5%E6%8F%90%E9%86%92%E3%80%81%E5%9B%9E%E7%AD%94%E6%97%B6%E9%97%B4%E6%A0%87%E6%B3%A8%E3%80%81%E5%B9%BF%E5%91%8A%E6%A0%87%E6%B3%A8%E3%80%81%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E7%AD%89%EF%BC%9BFuck%E9%93%BE%E6%8E%A5%E4%B8%AD%E9%97%B4%E8%B7%B3%E8%BD%AC%E9%A1%B5%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/443851/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%25%EF%BC%9B%E3%80%90%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E7%A0%B4%E8%A7%A3%E3%80%91%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6%7C%E6%96%87%E6%A1%A3%E4%B8%8B%E8%BD%BD%EF%BC%9B%E7%9F%A5%E4%B9%8E%E4%BD%BF%E7%94%A8%E5%A2%9E%E5%BC%BA%E3%80%81%E9%93%BE%E6%8E%A5%E6%8F%90%E9%86%92%E3%80%81%E5%9B%9E%E7%AD%94%E6%97%B6%E9%97%B4%E6%A0%87%E6%B3%A8%E3%80%81%E5%B9%BF%E5%91%8A%E6%A0%87%E6%B3%A8%E3%80%81%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E7%AD%89%EF%BC%9BFuck%E9%93%BE%E6%8E%A5%E4%B8%AD%E9%97%B4%E8%B7%B3%E8%BD%AC%E9%A1%B5%E7%AD%89.meta.js
// ==/UserScript==

(function() {
	'use strict';	

    var window_url = window.location.href;
    var website_host = window.location.host;
	if(window.top != window.self){
    	return;
    }
	
	/****
	视频解析部分代码借鉴自：
		脚本：https://greasyfork.org/zh-CN/scripts/418804
		作者：爱画画的猫
		
		脚本：https://greasyfork.org/zh-CN/scripts/390952
		作者：橘子爱哭
	
		已经分别联系过原作者，并获得了原作者的同意，代码版权归原作者所有
	**/
	const fengdiansanren_object={};
	fengdiansanren_object.defaultSourceArray=[
		{"name":"纯净/B站","category":"1","url":"https://z1.m1907.cn/?jx="},
		{"name":"综合/B站1","category":"1","url":"https://vip.parwix.com:4433/player/?url="},
		{"name":"高速接口","category":"1","url":"https://jsap.attakids.com/?url="},
		{"name":"OK解析","category":"1","url":"https://okjx.cc/?url="},
		{"name":"乐多资源","category":"1","url":"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid="},
		{"name":"诺诺","category":"1","url":"https://www.ckmov.com/?url="},
		{"name":"虾米","category":"1","url":"https://jx.xmflv.com/?url="},
		{"name":"全民","category":"1","url":"https://jx.quanmingjiexi.com/?url="},
		{"name":"M3U8.TV","category":"1","url":"https://jx.m3u8.tv/jiexi/?url="},
		{"name":"人人迷","category":"1","url":"https://jx.blbo.cc:4433/?url="},
		{"name":"七哥","category":"1","url":"https://jx.mmkv.cn/tv.php?url="},
		{"name":"冰豆","category":"1","url":"https://api.qianqi.net/vip/?url="},
		{"name":"迪奥","category":"1","url":"https://123.1dior.cn/?url="},
		{"name":"CK","category":"1","url":"https://www.ckplayer.vip/jiexi/?url="},
		{"name":"LE","category":"1","url":"https://lecurl.cn/?url="},
		{"name":"ckmov","category":"1","url":"https://www.ckmov.vip/api.php?url="},
		{"name":"ccyjjd","category":"1","url":"https://ckmov.ccyjjd.com/ckmov/?url="},
		{"name":"RDHK","category":"1","url":"https://jx.rdhk.net/?v="},
		{"name":"爱豆","category":"1","url":"https://jx.aidouer.net/?url="},
		{"name":"H8","category":"1","url":"https://www.h8jx.com/jiexi.php?url="},
		{"name":"BL","category":"1","url":"https://vip.bljiex.com/?v="},
		{"name":"解析la","category":"1","url":"https://api.jiexi.la/?url="},
		{"name":"MUTV","category":"1","url":"https://jiexi.janan.net/jiexi/?url="},
		{"name":"MAO","category":"1","url":"https://www.mtosz.com/m3u8.php?url="},
		{"name":"老板","category":"1","url":"https://vip.laobandq.com/jiexi.php?url="},
		{"name":"盘古","category":"1","url":"https://www.pangujiexi.cc/jiexi.php?url="},
		{"name":"盖世","category":"1","url":"https://www.gai4.com/?url="},
		{"name":"小蒋","category":"1","url":"https://www.kpezp.cn/jlexi.php?url="},
		{"name":"YiTV","category":"1","url":"https://jiexi.us/?url="},
		{"name":"星空","category":"1","url":"http://60jx.com/?url="},
		{"name":"0523","category":"1","url":"https://go.yh0523.cn/y.cy?url="},
		{"name":"17云","category":"1","url":"https://www.1717yun.com/jx/ty.php?url="},
		{"name":"4K","category":"1","url":"https://jx.4kdv.com/?url="},
		{"name":"云析","category":"1","url":"https://jx.yparse.com/index.php?url="},
		{"name":"8090","category":"1","url":"https://www.8090g.cn/?url="},
		{"name":"江湖","category":"1","url":"https://api.jhdyw.vip/?url="},
		{"name":"诺讯","category":"1","url":"https://www.nxflv.com/?url="},
		{"name":"PM","category":"1","url":"https://www.playm3u8.cn/jiexi.php?url="},
		{"name":"奇米","category":"1","url":"https://qimihe.com/?url="},
		{"name":"思云","category":"1","url":"https://jx.ap2p.cn/?url="},
		{"name":"听乐","category":"1","url":"https://jx.dj6u.com/?url="},
		{"name":"aijx","category":"1","url":"https://jiexi.t7g.cn/?url="},
		{"name":"夜幕","category":"1","url":"https://www.yemu.xyz/?url="},
		{"name":"52","category":"1","url":"https://vip.52jiexi.top/?url="},
		{"name":"黑米","category":"1","url":"https://www.myxin.top/jx/api/?url="},
		{"name":"豪华啦","category":"1","url":"https://api.lhh.la/vip/?url="},
		{"name":"凉城","category":"1","url":"https://jx.mw0.cc/?url="},
		{"name":"33t","category":"1","url":"https://www.33tn.cn/?url="},
		{"name":"180","category":"1","url":"https://jx.000180.top/jx/?url="},
		{"name":"无名","category":"1","url":"https://www.administratorw.com/video.php?url="},
		{"name":"黑云","category":"1","url":"https://jiexi.380k.com/?url="},
		{"name":"九八","category":"1","url":"https://jx.youyitv.com/?url="},
	];
	fengdiansanren_object.iframePlayerNodes = [
		{ url:"v.qq.com", node:"#mod_player"},
		{ url:"www.iqiyi.com", node:"#flashbox"},
		{ url:"v.youku.com", node:"#player"},
		{ url:"w.mgtv.com", node:"#mgtv-player-wrap"},
		{ url:"www.mgtv.com", node:"#mgtv-player-wrap"},
		{ url:"tv.sohu.com", node:"#player"},
		{ url:"film.sohu.com", node:"#playerWrap"},
		{ url:"www.le.com", node:"#le_playbox"},
		{ url:"video.tudou.com", node:".td-playbox"},
		{ url:"v.pptv.com", node:"#pptv_playpage_box"},
		{ url:"vip.pptv.com", node:".w-video"},
		{ url:"www.wasu.cn", node:"#flashContent"},
		{ url:"www.acfun.cn", node:"#ACPlayer"},
		{ url:"vip.1905.com", node:"#player"},
		{url:"play.tudou.com",node:"#player"},
		{url:"www.bilibili.com/video",node:"#bilibiliPlayer"},
		{url:"www.bilibili.com/bangumi",node:"#player_module"},
	];
	fengdiansanren_object.isRun=function(){
		var host = window.location.host;
		var videoWebsites = ["iqiyi.com","v.qq.com","youku.com", "le.com","tudou.com","mgtv.com","sohu.com","acfun.cn","baofeng.com","pptv.com"];
		for(var b=0; b<videoWebsites.length; b++){
			if(host.indexOf(videoWebsites[b]) != -1){
				return true;
			}
		}
		return false;
	};
	fengdiansanren_object.getWebsiteName=function(){
		var name="other";
		if(website_host.indexOf("iqiyi.com")!=-1){
			name="iqiyi";
		}else if(website_host.indexOf("qq.com")!=-1){
			name="qq";
		}else if(website_host.indexOf("youku.com")!=-1){
			name="youku";
		}else if(website_host.indexOf("mgtv.com")!=-1){
			name="mgtv";
		}else if(website_host.indexOf("tudou.com")!=-1){
			name="tudou";
		}else if(website_host.indexOf("sohu.com")!=-1){
			name="sohu";
		}
		return name;
	};
	fengdiansanren_object.generateHtmlAndEvent = function(){
		var left=0;
		var top=300;
		//初始化位置信息
		var playerBoxPosition = GM_getValue("playerBoxPosition_"+this.getWebsiteName());
		if(!!playerBoxPosition){
			left=playerBoxPosition.left;
			top=playerBoxPosition.top;
		}
		var css = "#fengdiansanren_objectvideo_player_box{position:fixed; top:"+top+"px; left:"+left+"px; z-index:999; width:25px;background-color:red;};"
			css += "#fengdiansanren_objectvideo_player_box>div{width:100%; height:20px;}";
			css += "#fengdiansanren_objectvideo_player_box>div>img{width:90%;}";
			css += "#fengdiansanren_objectvideo_player_jump{cursor:pointer;text-align:center;padding-top:5px;}";
			css += "#fengdiansanren_objectvideo_player_box_move{cursor:move;margin-top:5px;text-align:center;padding:5px 0px;}";
			
			css += "#fengdiansanren_objectvideo_player_box .select_interface_box_outer{display:none;position:absolute;top:-60px;left:25px;padding:5px;}";
			css += "#fengdiansanren_objectvideo_player_box .select_interface_box{width:300px;height:350px;background-color:rgba(241,241,241,0.8);overflow-y:auto;border-radius:4px;}";
			css += "#fengdiansanren_objectvideo_player_box .select_interface_box::-webkit-scrollbar{width:5px; height:1px;}";
			css += "#fengdiansanren_objectvideo_player_box .select_interface_box::-webkit-scrollbar-thumb{border-radius: 4px;box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#A8A8A8;}";
			css += "#fengdiansanren_objectvideo_player_box .select_interface_box::-webkit-scrollbar-track{border-radius: 4px;box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#F1F1F1;}";
			
			css += "#fengdiansanren_objectvideo_player_box .select_interface_box >span{border-radius:3px;border-top:3px solid red; border-bottom:3px solid red;display:inline-block;width:calc(25% - 6px);width:-moz-calc(25% - 6px);width: -webkit-calc(25% - 6px);height:20px;line-height:20px;background-color:red;color:#FFF;cursor:pointer;margin:3px;text-align:center;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;font-size:12px!important;}";
			css += "#fengdiansanren_objectvideo_player_box .select_interface_box >span:hover{border-top:3px solid #FFF; border-bottom:3px solid #FFF;}";
			css += "#fengdiansanren_objectvideo_player_box .select_interface_box >span.hover-mark{border-top:3px solid #FFF; border-bottom:3px solid #FFF;}";
		$("head").append("<style>"+css+"</style>")
		
		
		var interfaceHtml = "";
		for(var i=0; i<this.defaultSourceArray.length; i++){
			var obj = this.defaultSourceArray[i];
			interfaceHtml += "<span data-url='"+obj.url+"'>"+obj.name+"</span>";
		}
		
		var moveImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADjUlEQVRoQ+2YTYiVVRjHf38ESQXXVhsHl4IIJRpumsGFWo2jtZnGtrqSMTC36SYQg/ADomiVXxs/SvyghTqroahAW7QbdJNKmyAwR0QfeeC5cubl3vuemXve5A73rO573/Oe8/+d85zn44g+b+pz/QwAXvUODnZg0e6AmU0CXwLPgQ2S/mgCthETMrONwC1gWYh+BGyR9HNpiOIAZjYMnAFer4h9CExIulkSoiiAmb0HnAVWdhD5b0BcKQVRDMDMtgOXgSUh7j9gefx+nJjTM+AjST+UgCgJ4Db/boiaBc4Du+P5tIsGXovnKUluaj23kgATgAu9B3wKrAc+D4WHgTvASeANB5Pk56TnVgzAlZjZakkO4L8PpQCS/HlOn57VQ3O5UCeAEqLTMYruQDrwYgD4BPg+oIYlTZVefR+vsR0Ie98G/C3p9ybEzwsg/PxnwHelPEgVysz2AOPAUUnXcqCzdiAi7I9JkBpqeZucSXL6uAcD7kZfD3Y7JF2t+7YWIHIbj5qt9OCepKG6gRfy3swcwEG8edoxJskDZMfWFSCyyktJYuYRdjwnDTCzncCB2LVJSb/UQZnZGHAuidgPgJ3dvu0IYGbrgGlgRUzsuc1FYKYixNOCOR7GzPYBxyv91kr6s+Jq3eY9MqdtDbAryaN83gOSvm63AN0AngBL61Yt3r+dehoz87zfa4K0/SRpa+sPMxsF/FzltKeS2mopBbBd0vVEXDuAaUmbkz6e+HW174RsVlKrOJoD3A1gP/BFkgZ7SnyhjQnNSDpVMY2DwJHK0u6S5OfpZTOzt4AP2pjQh8m8bkLvdCpJ6w7xJsAnXRWT+CH+uCqkagNm5qv7foj7xys0SSfqbCUOvhdErbTbqzg/xB1L0Rw3OhIQLTd6X9KbdWIW8t7M/koOtbtRF9+1BK0FcCFm5qvpsaBVbf0fgcxjQG3pmQUQEO6j/arknKRvF7LCdd8kqcSxnFjj42UD1E3e7n2chZWSvFZupDUGEB7mt1C9t6ldaxKgbUlZehsGAJXA1L9FfXiQb7pcq9wGvop0udiZKGZCZtb3F1vdrhbTa0avtkZzS8a6Q19sByLY5Vzuei5VWyrWCW+9LwoQEJ2u17268uv13BQ6i6E4QEB4MXOjUs2N5JSVWaqTTo0ABISXpL9GuuI1cduScL6Cq/0bA+hVWO73A4DclWqq32AHmlrZ3HH7fgdeAL7GSUBqsOkSAAAAAElFTkSuQmCC";
		var playerImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABtklEQVRoQ+2YTytFQRjGn+czKBtbK7u79jl8CFtLK3auhYWFJEmS5EY3KQtlIZIotyRJkhQLIUWRbkdT79RZUHf+n1Nz1jPz/n7vM9OZc4iaP6w5P7JA6gRzAjkBxw7kLeTYQOfpxgkURTECYBzAAIB1AFMkH51JLBewEbgBMFiqdycSC5YMTtNsBIp/Km6LyLETkeFknwKqdFdJiMiHIYvVcN8CGqIDoElSnZGgTygBDb0qaVyGsggtoLjfRGI6hEQMAc19ICK7PkViCmjuORF58CGSQkBx34vEvKtEKgHNvSMiR7YiqQUUt3oxNkXk3VSkCgKa+UIk1kwkqiSguSdJTvQqUUWBV5J9dRbokGzUVeAFwCjJVh0FVuQQX/UKr8ZV4QycC/iGCbgem1LgR74d1LX70wY+ZQJt6fqJLXiqBG4FfNEVPIXArMA/+YKPtYX2BXzPJ3iMBJ4FfCYEeGiBZYG/DgkfYgudCfhmaHDfCXyX/gd9xYK3TeAQwHAJcku6fhoT3CWBIQBjAPoBtEkupQC3FkgJ+1dt47tQFvDcgZyA54YaL5cTMG6Z5wk5Ac8NNV7uF+15tDGwBHN+AAAAAElFTkSuQmCC";
		var html = "<div id='fengdiansanren_objectvideo_player_box'>"+
					"<div id='fengdiansanren_objectvideo_player_jump' name='跳转到解析'><img src='"+playerImage+"'></div>"+
					"<div id='fengdiansanren_objectvideo_player_box_move' name='移动按钮'><img src='"+moveImage+"'></div>"+
					"<div class='select_interface_box_outer'>"+
					"<div class='select_interface_box'>"+
							interfaceHtml+
							"<div style='font-size:10px;margin-top:10px;'>"+
							"免责申明：<br>"+
							"1、VIP视频解析中所用到的解析接口全部收集自互联网（源码可见），版权问题请联系相关解析接口所有者，脚本不承担相关责任！<br>"+
							"2、为创造良好的创作氛围，请大家支持正版！<br>"+
							"3、脚本仅限个人学习交流，使用即已代表您已经充分了解相关问题，否则后果自负，特此声明！<br>"+
							"</div>"+
					"</div>"+
					"</div>"+
				"</div>";
		$("body").append(html);
		
		//接口显示
		const $playerBox = $("#fengdiansanren_objectvideo_player_box");
		const $playBoxOuter = $("#fengdiansanren_objectvideo_player_box .select_interface_box_outer");
		$playerBox.on("mouseover", () => {$playBoxOuter.show();});
		$playerBox.on("mouseout", () => {$playBoxOuter.hide();});
		
		$("#fengdiansanren_objectvideo_player_jump").on("click", function(){
			var playbackWebsite="https://www.shuoaini.xyz/v/m/s/?sv=7&url="+window_url;
			GM_openInTab(playbackWebsite, {active: true});
		});
		
		//点击接口播放
		const self = this;
		const playIframeId = "play-iframe-8dsdsdsd988771iix1kmd";
		$("body").on("click", "#fengdiansanren_objectvideo_player_box .select_interface_box>span", function(){
			var node = "";
			var iframePlayerNodes = self.iframePlayerNodes;
			for(var m in iframePlayerNodes) {
				var playUrl = window.location.href;
				if(playUrl.indexOf(iframePlayerNodes[m].url)!= -1){
					node = iframePlayerNodes[m].node;
				}
			}
			$("#fengdiansanren_objectvideo_player_box .select_interface_box>span").removeClass("hover-mark");
			$(this).addClass("hover-mark");
			
			$("#"+playIframeId).remove();
			var playUrl = window.location.href;
			var playHtml = "<div id='"+playIframeId+"' style='width:100%;height:100%;'><iframe allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play' style='height:100%;width:100%' id='"+playIframeId+"_iframe'></iframe></div>";
			$(node).html(playHtml);
			var iframeSrc= $(this).attr("data-url")+playUrl;
			$("#"+playIframeId+"_iframe").attr("src", iframeSrc);
		});
		
		this.listenerMouse();
	};
	fengdiansanren_object.point={"x":0,"y":0,"l":0,"t":0};
	fengdiansanren_object.isDown=false;
	fengdiansanren_object.$box=null;
	fengdiansanren_object.listenerMouse = function(){
		var that = this;
		
		this.$box = document.getElementById('fengdiansanren_objectvideo_player_box_move');
		this.$box.onmousedown = function(e) {
			//阻止默认事件
			e.preventDefault();
		    e.stopPropagation();
		    //获取x坐标和y坐标
		    that.point.x = e.clientX;
		    that.point.y = e.clientY;
		    //获取左部和顶部的偏移量
		    that.point.l = that.$box.parentNode.offsetLeft;
		    that.point.t = that.$box.parentNode.offsetTop;
		    //开关打开
		    that.isDown = true;
		    //设置样式  
		    that.$box.style.cursor = 'move';
		};
		window.onmousemove = function(e) {
			//阻止默认事件
			e.preventDefault();
			e.stopPropagation();
			if (that.isDown == false) {
				return;
			}
			//获取x和y
			var nx = e.clientX;
			var ny = e.clientY;
			//计算移动后的左偏移量和顶部的偏移量
			var nl = nx - (that.point.x - that.point.l);
			var nt = ny - (that.point.y - that.point.t);
			//更新位置
			that.$box.parentNode.style.left = nl + 'px';
			that.$box.parentNode.style.top = nt + 'px';
			GM_setValue("playerBoxPosition_"+that.getWebsiteName(),{"left":nl, "top":nt})
		}
		fengdiansanren_object.$box.onmouseup = function() {
			//开关关闭
			that.isDown = false;
			that.$box.style.cursor = 'move';
		}
	};
	fengdiansanren_object.removeAD = function(){
		var videoWebsiteADRemove_={};
		videoWebsiteADRemove_.youku=function(){
			
		};
		videoWebsiteADRemove_.iqiyi=function(){
		   
		};
		videoWebsiteADRemove_.qq=function(){

		};
		videoWebsiteADRemove_.start=function(){
			switch (website_host) {
		        case 'v.youku.com':
		            this.youku();
		            break
		        case 'v.qq.com' :
		            this.qq()
		            break
		        case 'www.iqiyi.com' :
		            this.iqiyi()
		            break
		        default :
		            break
		    }
		};
		videoWebsiteADRemove_.start();
	};
	fengdiansanren_object.start=function(){
		if(this.isRun()){
			this.generateHtmlAndEvent();
			this.removeAD();
		}
	};
	fengdiansanren_object.start();
	
	
	/**
	 * 百度文库开始
	 */
	const baiduwenkuHelper_={};
	baiduwenkuHelper_.wenkudownloadUrl = "http://www.tool77.com/tampermonkey/doc/download?docs=10?wenku_url=";
	baiduwenkuHelper_.isRun = function(){
		if(website_host.indexOf("wenku.baidu.com") != -1){
			return true;
		}
		return false;
	};
	baiduwenkuHelper_.removeAD=function(){
		if(website_host.indexOf("wenku.baidu.com") != -1){
		    setInterval(function(){
		    	$(".banner-ad").hide();
		    	$(".union-ad-bottom").hide();
		    	$("iframe").hide();
		    	
		    	//VIP去广告小按钮
		    	$(".ggbtm-vip-close").hide();
		    	$(".ad-vip-close-bottom").hide();
		    	$(".ad-vip-close").hide();
		    	
		    	//搜索页面
		    	$("#fengchaoad").hide();
		    	$(".search-aside-adWrap").hide();
		    },300);
	    }
	};
	baiduwenkuHelper_.generateHtml=function(){
		var $that = this;
		if((window_url.indexOf("wenku.baidu.com/view")==-1 && window_url.indexOf("wenku.baidu.com/link")==-1) 
			|| website_host!="wenku.baidu.com"){
			return;
		}
		var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:150px;left:0px;'>"+
						"<div id='baiduwenku_helper_download_btn' style='font-size:12px;padding:8px 2px;color:#FFF;background-color:#25AE84;'>下载</div>"+
				 	 "</div>";
		$("body").append(topBox);
		//解析下载
		$("body").on("click","#baiduwenku_helper_download_btn",function(){
			var wenkuUrl = $that.wenkudownloadUrl+encodeURIComponent(window_url);
			GM_openInTab(wenkuUrl, {active: true });
		});		
	};
	baiduwenkuHelper_.start=function(){
		if(this.isRun()){			
			this.generateHtml();
			this.removeAD();
		}
	};
	baiduwenkuHelper_.start();
	
	var serverNavigation_={};
	serverNavigation_.generateHtml = function(){
		const host = window.location.host
			, randomElementId = "a"+Math.ceil(Math.random()*100000000)+"jjlk";
		var backgroundColor = null;
		var serverPlatform = [
			{"host":"aliyun.com","color":"#ff6a00"},
			{"host":"cloud.tencent.com","color":"#00a4ff"},
			{"host":"huaweicloud.com","color":"#D64A52"},
			{"host":"hostwinds.com","color":"#1ea237"},
			{"host":"west.cn","color":"#ff6000"},
			{"host":"bandwagonhost.com","color":"#C18100"},
			{"host":"www.vultr.com","color":"#007bfc"}
		];
		for(var i=0;i<serverPlatform.length;i++){
			if(host.indexOf(serverPlatform[i].host)!=-1){
				backgroundColor = serverPlatform[i].color;
				break;
			}
		}
		if(backgroundColor==null) return;
		var innnerCss = `
			#`+randomElementId+`{				
				display: block;
				width: 30px;
				border-radius: 24px;
				font-size: 14px;
				color: #fff;
				text-align: center;
				letter-spacing: 4px;
				position:fixed;
				top:150px;
				left:15px;
				height: auto;
				text-decoration: none;
				writing-mode: vertical-rl;
				line-height: 2.2;
				cursor: pointer;
				z-index:9999999999999;
				padding: 10px 0px;
				background-color: `+backgroundColor+`;
			}
		`;
		var innerHTML = "<div target='_blank' id='"+randomElementId+"'>热门服务器厂商活动</div>";
		$("body").prepend("<style>"+innnerCss+"</style>");
		$("body").append(innerHTML);
		$("body").on("click", "#"+randomElementId+"", function(){
			GM_openInTab("https://www.bookmarkearth.com/activity/detail/server", {active:true});
		});
	};
	serverNavigation_.start = function(){
		this.generateHtml();
	};
	serverNavigation_.start();
	
	/**
	 * 知乎使用增强
	 */
	const zhihuObject = {};
	zhihuObject.markArticleOrQuestion = function(){ //首页标识文章or回答
		//此处代码借鉴自 - 知乎增强
		//原作者：X.I.U
		//https://greasyfork.org/zh-CN/scripts/419081-%E7%9F%A5%E4%B9%8E%E5%A2%9E%E5%BC%BA
		var questionsCss = `
			.AnswerItem .ContentItem-title a::before {
			    content: '问题';
			    color: #f68b83;
			    background-color: #f68b8333;
			    font-weight: bold;
			    font-size: 13px;
			    padding: 1px 4px 0px;
			    border-radius: 2px;
			    display: inline-block;
			    vertical-align: top;
			    margin: 4px 4px 4px 0px;
			}
			.ArticleItem .ContentItem-title a::before {
			    content: '文章';
			    color: #0066FF;
			    background-color: #E5EFFF;
			    font-weight: bold;
			    font-size: 13px;
			    padding: 1px 4px 0;
			    border-radius: 2px;
			    display: inline-block;
			    vertical-align: top;
			     margin: 4px 4px 4px 0px;
			}
			.TopstoryItem--advertCard{
				text-decoration:line-through;
			}
		`;
		$("body").prepend("<style>"+questionsCss+"</style>");
	};
	zhihuObject.addDateAnswerForQuestion = function(){ //为问题和回答添加时间
		function DateFormat(time, format) {  //
		    var o = {
		        "M+": time.getMonth() + 1, //月份 
		        "d+": time.getDate(), //日 
		        "h+": time.getHours(), //小时 
		        "m+": time.getMinutes(), //分 
		        "s+": time.getSeconds(), //秒 
		        "q+": Math.floor((time.getMonth() + 3) / 3), //季度 
		        "S": time.getMilliseconds() //毫秒 
		    };
		    if(/(y+)/.test(format)){
				format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
		    for(var k in o){
		        if(new RegExp("(" + k + ")").test(format)){
		            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
			}
		    return format;
		}
		function addDateQuestion() {
			var title = document.querySelector(".QuestionPage");
			if(!!title){
				var dateCreated = title.querySelector("[itemprop~=dateCreated][content]").content;
				var dateModified = title.querySelector("[itemprop~=dateModified][content]").content;
				var createDate = DateFormat(new Date(dateCreated), "yyyy-MM-dd hh:mm:ss");
				var editDate = DateFormat(new Date(dateModified), "yyyy-MM-dd hh:mm:ss");
				
				var side = title.querySelector(".QuestionHeader-side");
				var timeDiv = document.createElement('div');
				timeDiv.innerHTML = `<p>创建于:&nbsp;${createDate}</p><p>编辑于:&nbsp;${editDate}</p>`;
				timeDiv.style.cssText = 'color:#6f6f6f;font-size:13px;';
				side.appendChild(timeDiv);
			}
		}
		function addTimeAnswerItems() {
			var list = document.querySelectorAll(".AnswerItem");
			for (var i = 0; i < list.length; i++) {
				var item = list[i];
				if (item.getAttribute('zh_date_mk') === 'true') {
					continue;
				}
				item.setAttribute('zh_date_mk', 'true');
				try{					
					var dateCreated = item.querySelector("[itemprop~=dateCreated][content]").content;
					var dateModified = item.querySelector("[itemprop~=dateModified][content]").content;
					var createDate = DateFormat(new Date(dateCreated), "yyyy-MM-dd hh:mm:ss");
					var editDate = DateFormat(new Date(dateModified), "yyyy-MM-dd hh:mm:ss");
		
					var sideItem = item.querySelector(".ContentItem-meta");
					var timeDiv = document.createElement('div');
					timeDiv.innerHTML = `创建于:&nbsp;${createDate}&nbsp;&nbsp;&nbsp;编辑于:&nbsp;${editDate}`;
					timeDiv.class = "Voters";
					timeDiv.style.cssText = 'color:#6f6f6f;font-size:13px;display:block;padding:5px 0px;';
					sideItem.appendChild(timeDiv);
				}catch(e){}
			}
		}
		addDateQuestion();
		setInterval(function(){ //循环检查回答和修改时间
			addTimeAnswerItems();
		},400);
	};
	zhihuObject.changePicQuality = function(){ //图片自动高清
		setInterval(function(){
			$("body").find("img").each(function(){
				var dataoriginal = $(this).attr("data-original");
				if(!!dataoriginal){
					$(this).attr("src", dataoriginal);
				}
			});
		}, 500);
	};
	zhihuObject.showQuestionAuthor = function(){
		//此处代码借鉴自 - 知乎增强
		//原作者：X.I.U
		//https://greasyfork.org/zh-CN/scripts/419081-%E7%9F%A5%E4%B9%8E%E5%A2%9E%E5%BC%BA
		if (document.querySelector('.BrandQuestionSymbol, .QuestionAuthor')) return
		let qJson = JSON.parse(document.querySelector('#js-initialData').textContent).initialState.entities.questions[/\d+/.exec(location.pathname)[0]].author,
			html = `<div class="BrandQuestionSymbol"><a class="BrandQuestionSymbol-brandLink" href="/people/${qJson.urlToken}"><img role="presentation" src="${qJson.avatarUrl}" class="BrandQuestionSymbol-logo" alt=""><span class="BrandQuestionSymbol-name">${qJson.name}</span></a><div class="BrandQuestionSymbol-divider" style="margin-left: 5px;margin-right: 10px;"></div></div>`;
		document.querySelector('.QuestionHeader-topics').insertAdjacentHTML('beforebegin', html);
	};
	zhihuObject.start = function(){
		if(window.location.host.indexOf("zhihu.com")!=-1){
		    if(window_url.indexOf("https://www.zhihu.com/question/") != -1){
				this.addDateAnswerForQuestion();
				this.showQuestionAuthor();
		    }
			this.markArticleOrQuestion();
		}
	};
	zhihuObject.start ();
	
	/**
	 * 去除跳转中间页
	 */
	const fuckLink = {};
	fuckLink.start = function(){
		const rules = [
			{"match":"link\.zhihu\.com\/\?target=", "element":"p.link"},
			{"match":"show\.bookmarkearth\.com\/view\/", "element":"p.link"},
			{"match":"www\.jianshu\.com\/go-wild\?", "element":"p.link"},
			{"match":"link\.csdn\.net\/\?target=", "element":"a.loading-color2"}
		]
		const url = window.location.href;
		let loopOK = true, ruleSize = rules.length;
		const loopInterval = setInterval(()=>{
			if(loopOK){
				for(var i=0;i<rules.length; i++){
					loopOK = ruleSize-1 == i
					if(url.search("^(http|https):\/\/"+rules[i].match)){
						let $element =  document.querySelector(rules[i].element);
						if(!!$element){
							clearInterval(loopInterval);
							window.location.href = $element.innerText;
						}
					}
				}
			}
		},50);
	};
	fuckLink.start();
})();

/**
 * 作者备注：
 * 王超先生的知乎视频下载脚本代码非常精炼，我认为此功能不需要再二次编写了
 * 此部分代码已获得原作者授权同意，并符合MIT协议，请知悉！
 * 
 * 下载知乎视频，作者：王超， 脚本链接：https://greasyfork.org/zh-CN/scripts/39206
 * 版本：1.30
 * 版权归原作者所有
 */
(async () => {
  if (window.location.host == 'www.zhihu.com') return;
 
  const playlistBaseUrl = 'https://lens.zhihu.com/api/v4/videos/';
  // const videoBaseUrl = 'https://video.zhihu.com/video/';
  const videoId = window.location.pathname.split('/').pop(); // 视频id
  const menuStyle = 'transform:none !important; left:auto !important; right:-0.5em !important;';
  const playerId = 'player';
  const coverSelector = '#' + playerId + ' > div:first-child > div:first-child > div:nth-of-type(2)';
  const controlBarSelector = '#' + playerId + ' > div:first-child > div:first-child > div:last-child > div:last-child > div:first-child';
  const svgDownload = '<path d="M9.5,4 H14.5 V10 H17.8 L12,15.8 L6.2,10 H9.5 Z M6.2,18 H17.8 V20 H6.2 Z"></path>';
  const player = document.getElementById(playerId);
  // const resolutions = {'普清': 'ld', '标清': 'sd', '高清': 'hd', '超清': 'fhd'};
  const resolutions = [
    {ename: 'ld', cname: '普清'},
    {ename: 'sd', cname: '标清'},
    {ename: 'hd', cname: '高清'},
    {ename: 'fhd', cname: '超清'}
  ];
  let videos = []; // 存储各分辨率的视频信息
 
  function fetchRetry (url, options = {}, times = 1, delay = 1000, checkStatus = true) {
    return new Promise((resolve, reject) => {
      // fetch 成功处理函数
      function success (res) {
        if (checkStatus && !res.ok) {
          failure(res);
        }
        else {
          resolve(res);
        }
      }
 
      // 单次失败处理函数
      function failure (error) {
        if (--times) {
          setTimeout(fetchUrl, delay);
        }
        else {
          reject(error);
        }
      }
 
      // 总体失败处理函数
      function finalHandler (error) {
        throw error;
      }
 
      function fetchUrl () {
        return fetch(url, options)
          .then(success)
          .catch(failure)
          .catch(finalHandler);
      }
 
      fetchUrl();
    });
  }
 
  // 下载指定url的资源
  async function downloadUrl (url, name = (new Date()).valueOf() + '.mp4') {
    // Greasemonkey 需要把 url 转为 blobUrl
    if (GM_info.scriptHandler === 'Greasemonkey') {
      const res = await fetchRetry(url);
      const blob = await res.blob();
      url = URL.createObjectURL(blob);
    }
 
    // Chrome 可以使用 Tampermonkey 的 GM_download 函数绕过 CSP(Content Security Policy) 的限制
    if (window.GM_download) {
      GM_download({url, name});
    }
    else {
      // firefox 需要禁用 CSP, about:config -> security.csp.enable => false
      let a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.style.display = 'none';
      // a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
 
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  }
 
  // 格式化文件大小
  function humanSize (size) {
    let n = Math.log(size) / Math.log(1024) | 0;
    return (size / Math.pow(1024, n)).toFixed(0) + ' ' + (n ? 'KMGTPEZY'[--n] + 'B' : 'Bytes');
  }
 
  if (!player) return;
 
  // 获取视频信息
  const res = await fetchRetry(playlistBaseUrl + videoId, {
    headers: {
      'referer': 'refererBaseUrl + videoId',
      'authorization': 'oauth c3cef7c66a1843f8b3a9e6a1e3160e20' // in zplayer.min.js of zhihu
    }
  }, 3);
  const videoInfo = await res.json();
 
  // 获取不同分辨率视频的信息
  for (const [key, video] of Object.entries(videoInfo.playlist)) {
    video.name = key.toLowerCase();
    video.cname = resolutions.find(v => v.ename === video.name)?.cname
    if (!videos.find(v => v.size === video.size)) {
      videos.push(video);
    }
  }
 
  // 按格式大小排序
  videos = videos.sort(function (v1, v2) {
    const v1Index = resolutions.findIndex(v => v.ename === v1.name);
    const v2Index = resolutions.findIndex(v => v.ename === v2.name);
 
    return v1Index === v2Index ? 0 : (v1Index > v2Index ? 1 : -1);
    // return v1.size === v2.size ? 0 : (v1.size > v2.size ? 1 : -1);
  }).reverse();
 
  document.addEventListener('DOMNodeInserted', (evt) => {
    const domControlBar = evt.relatedNode.querySelector(':scope > div:last-child > div:first-child > div:nth-of-type(2)');
    if (!domControlBar || domControlBar.querySelector('.download')) return;
 
    const domButtonsBar = domControlBar.querySelector(':scope > div:last-child');
    const domFullScreenBtn = domButtonsBar.querySelector(':scope > div:nth-last-of-type(2)');
    const domResolutionBtn = Array.from(domButtonsBar.querySelectorAll(':scope > div')).filter(el => el.innerText.substr(1, 1) === '清')[0];
    let domDownloadBtn, defaultResolution, buttons;
    if (!domFullScreenBtn || !domFullScreenBtn.querySelector('button')) return;
 
    // 克隆分辨率菜单或全屏按钮为下载按钮
    domDownloadBtn = (domResolutionBtn && (domResolutionBtn.className === domFullScreenBtn.className))
      ? domResolutionBtn.cloneNode(true)
      : domFullScreenBtn.cloneNode(true);
 
    defaultResolution = domDownloadBtn.querySelector('button').innerText;
 
    // 生成下载按钮图标
    domDownloadBtn.querySelector('button:first-child').outerHTML = domFullScreenBtn.cloneNode(true).querySelector('button').outerHTML;
    domDownloadBtn.querySelector('svg').innerHTML = svgDownload;
    domDownloadBtn.className = domDownloadBtn.className + ' download';
 
    buttons = domDownloadBtn.querySelectorAll('button');
 
    // button 元素添加对应的下载地址属性
    buttons.forEach(dom => {
      const video = videos.find(v => v.cname === dom.innerText) || videos[videos.length - 1];
 
      dom.dataset.video = video.play_url;
      if (dom.innerText) {
        (dom.innerText = `${dom.innerText} (${humanSize(video.size)})`);
      }
      else if (buttons.length == 1) {
        dom.nextSibling.querySelector('div').innerText = humanSize(video.size);
      }
    });
 
    // 鼠标事件 - 显示菜单
    domDownloadBtn.addEventListener('pointerenter', () => {
      const domMenu = domDownloadBtn.querySelector('div:nth-of-type(1)');
      if (domMenu) {
        domMenu.style.cssText = menuStyle + 'opacity:1 !important; visibility:visible !important';
      }
    });
 
    // 鼠标事件 - 隐藏菜单
    domDownloadBtn.addEventListener('pointerleave', () => {
      const domMenu = domDownloadBtn.querySelector('div:nth-of-type(1)');
      if (domMenu) {
        domMenu.style.cssText = menuStyle;
      }
    });
 
    // 鼠标事件 - 选择菜单项
    domDownloadBtn.addEventListener('pointerup', event => {
      let e = event.srcElement || event.target;
 
      while (e.tagName !== 'BUTTON') {
        e = e.parentNode;
      }
 
      downloadUrl(e.dataset.video);
    });
 
    // 显示下载按钮
domButtonsBar.appendChild(domDownloadBtn);
  });
})();