// ==UserScript==
// @name        Bing图
// @namespace   firefox
// @author      林小鹿吧
// @include 	*://www.baidu.com/
// @include 	*://www.baidu.com/home*
// @include 	*://www.baidu.com/?tn=*
// @include 	*://www.baidu.com/index.php*
// @version     2015.10.20
// @icon	https://cn.bing.com/s/a/bing_p.ico
// @run-at 	document-end
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant 	GM_xmlhttpRequest
// @grant	GM_registerMenuCommand
// @description 百度首页变成bing
// @downloadURL https://update.greasyfork.org/scripts/5031/Bing%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/5031/Bing%E5%9B%BE.meta.js
// ==/UserScript==
var _bing = {
		name : '_baiduLogo',
		X : 0,
		Y : 0,
		current:{idx:0,url:''},
		formerly:{idx:0,url:''},
		idx:0,
		defultOpacity:40
	};
var loading = false;

function save(_bing){
	localStorage._bing = JSON.stringify(_bing);
}
function load(){
	localStorage._bing && (_bing = JSON.parse(localStorage._bing));
	return _bing;
}
function getIdx(type) {
	var idx = 0;
	"prev" == type ? idx = _bing.current.idx + 1 : "next" == type && (idx = _bing.current.idx - 1);
	return idx;
}
function loadResponse(e){
	console.log(e);

	try{
		var d = JSON.parse(e.responseText);
		var image = d.images[0];
		var imageUrl = image.url.replace(new RegExp('^(\w{3,5}:\/\/[^/]*)'), bing_uri);
		"/" == imageUrl[0] ? imageUrl=bing_uri+imageUrl : null;
		var	video = image.vid ? image.vid : null;
		//console.log(image.copyrightlink)
		//console.log(imageUrl)
		$('#sh_cp').attr('href',image.copyrightlink.replace(new RegExp('.*\\?q=([^&]*).*', 'i'), 's?wd=$1')).attr('title',image.copyright);
		changMsg(image.msg[0].title,image.msg[0].link,image.msg[0].text);
	}catch(error){
		console.log(error);return;
	}
	if(_bing.current.url != imageUrl){
		changeBg(imageUrl,video);
	} else{
		openLoadingLock();
	}
}
function prevImg(){
	loadBgJson(getIdx('prev'),loadResponse);
}
function nextImg(){
	loadBgJson(getIdx('next'),loadResponse);
}
function openLoadingLock(){
	loading = false;
	$("#sh_igl").attr('title','上一页');
	$("#sh_igr").attr('title','下一页');
}
function downloadImg(){
	var imageUrl = _bing.current.url;
	_window.open(imageUrl);
}
function changMsg(title,link,text){
	$('#hp_bottomCell #hp_pgm h3').text(title);
	$('#hp_bottomCell #hp_pgm a').attr('href',bing_uri + link).text(text);
}
function changeBg(imageUrl,video){
		var bg = new Image(),
		time = 2000,
		showV,
		hideV,
		a = $("#bg1").css("background-image"),
		b = $("#bg2").css("background-image");
	"none" == a && "none" == b && (time = 500, showV = $("#bg1"), hideV = $("#bg2"), showV.css("opacity", 0));
	"none" != a && "none" == b && (console.log('jin ru 2'),showV = $("#bg2"), hideV = $("#bg1"),showV.css("opacity", 0));
	"none" != a && "none" != b && (a = $("#bg1").css("opacity"), $("#bg2").css("opacity"), showV = a < 1 ? $("#bg1") : $("#bg2"), hideV = "bg1" == showV.attr("id") ? $("#bg2") : $("#bg1"));

	bg.addEventListener("load",function(e){
		var v = $('#bg3 video');
		if(video){
			v.attr('loop',video.loop).attr('src',bing_uri + video.codecs[0][1]);
			$('#bg3,#bg3 video').fadeIn(time)
		}else{
			$('#bg3,#bg3 video').fadeOut(time,function(){v.attr('loop',"").attr('src','')});
		}
		video==null&&showV.css("background-image",'url('+imageUrl+')');
		setTimeout(openLoadingLock,time/2);
		hideV.animate({opacity: '0'},time);  
		showV.animate({opacity: '1'},time);
	})
	bg.src = imageUrl;
	_bing.formerly = _bing.current;
	_bing.current = {idx:_bing.idx,url:imageUrl};
	save(_bing);
}

function loadBgJson(i/*1-7 | 0为当天 -1为明天*/,callback){
	if(loading == true){console.error('is loading '+_bing.idx)};
	if(i >= -1 && i <= 7 && loading == false){
		loading = true;
		$("#sh_igl,#sh_igr").attr('title','加载中...');
		_bing.idx = i;
		var url = bing_uri + '/HPImageArchive.aspx?format=js&idx=' + i + '&n=1&nc=' + new Date().getTime() + '&pid=hp&video=1';
		var opt = {
			method:'GET',
			url:url,
			onload:callback,
			onerror:function(e){console.log(e);ajax(opt);openLoadingLock()},
			onabort:function(e){console.log(e);ajax(opt);openLoadingLock()}
		}
		switch(i){
			case 7:{$('#sh_igl').css('opacity',0.3);break;}
			case -1:{$('#sh_igr').css('opacity',0.3);break;}
			case 6:{$('#sh_igl').css('opacity',1);break;}
			case 0:{$('#sh_igr').css('opacity',1);break;}
		}
		ajax(opt);
	}
}
function changHasBgStyle(){
	if(($('#head').attr('class')).indexOf('opacity')==-1)$("#head").addClass("s-skin-user s-skin-hasbg s-skin-dark opacity-40 white-logo");
	//新版本
	if(!$('#head').hasClass('s-skin-user')){
		$('#head').addClass('s-skin-user s-skin-hasbg s-skin-dark opacity-40 white-logo s-opacity-'+_bing.defultOpacity);
	}
}

function bing(){
	var clientHeight=document.body.clientHeight,
		clientWidth=document.body.clientWidth,
		width=clientHeight*clientWidth/720,
		height=clientHeight*clientWidth/1280,
		left=0-(width-clientWidth)/2,
		top=0-(height-clientHeight)/2;
	var css = 'div.bing_bg{background-attachment: fixed;background-position: center 0;background-repeat: no-repeat;background-size: cover;height: 100%;left: 0;position: absolute;top: 0;width: 100%;}\
	.bing_video{overflow:hidden;position:fixed;width:'+width+'px;height:'+height+'px;left:'+left+'px;top:'+top+'px;}\
	div#sh_rdiv{position:fixed;right:15px;bottom:15px;}div#sh_rdiv A{position:relative;width:32px;height:32px;margin:0 5px;float:left}\
	a[id^="sh_"]{background:url(http://cn.bing.com/s/a/hpc12.png) no-repeat;}\
	a#sh_igl{background-position:-192px -53px}\
	a#sh_igr{background-position: -160px -53px}\
	a#sh_cp{background-position: -64px -85px}\
	a#sh_igd{background-position: 0 -53px}\
#s_main{opacity: 0!important;-moz-transition: opacity .4s ease-in-out;-webkit-transition: opacity .25s ease-in-out;-o-transition: opacity .4s ease-in-out;}\
#s_main:hover{opacity:1 !important;}\
a.s-treasure,a.s-set-page{display: none!important;}\
#head_wrapper{padding-top:10px;}\
#lg{background:url(http://su.bdimg.com/static/superplus/img/logo_white.png?v=md5) no-repeat center / auto 100px !important;}\
#lg>img{opacity:0!important;}\
.s-skin-hasbg .s-top-wrap {background: transparent linear-gradient(rgba(0, 0, 0, 0.2) 0px, rgba(0, 0, 0, 0.2) 100%) repeat scroll 0% 0% !important;}\
body{height:auto!important;}\
	#hp_bottomCell{position:fixed;left:0px;bottom:0px;width:100%;height:60px;background:linear-gradient(rgba(0, 0, 0, 0.2) 0px, rgba(0, 0, 0, 0.2) 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)}\
	#hp_pgm{margin-left:20px;bottom:0px;}\
	#hp_pgm h3{text-align:left;color: rgb(255, 255, 255);font-size: 16px;font-weight: normal;margin: 0;padding: 0;}\
	#hp_pgm a{float:left;text-align:left;color: rgb(255, 255, 255);font-size: 14px;font-weight: normal;margin-top: 5px;padding: 0;text-decoration:none;}'
	;
	$("body").before('<style id="bingtu" type="text/css">'+css+'</style>');
	$("#head").append('<div id="bg1" class="bing_bg" style="z-index:-5"/><div id="bg2" class="bing_bg" style="z-index:-5"/><div id="bg3" class="bing_bg" style="z-index:-4"><video autoplay="true" class="bing_video"/></div>');
	$("#bg2,#bg1").css("background-color",'rgba(89, 83, 87, 0)');
	
		$(".s-skin-container")&&$(".s-skin-container").remove();
	$('body').append('<div id="hp_bottomCell"><div id="hp_pgm"><h3></h3><a  target="_blank"></a></div><div id="sh_rdiv"><a id="sh_igl" href="javascript:void(0)" title="上一页"/><a id="sh_igr" href="javascript:void(0)" title="下一页"/><a id="sh_cp" href="javascript:void(0)" target="_blank"/><a id="sh_igd" href="javascript:void(0)" title="下载壁纸"/></div></div>');
	(document.querySelector('.btn_wr')).addEventListener('click', function(event) {
		 (document.querySelector('#form')).submit();
	});
	(document.getElementById('sh_rdiv')).addEventListener('click', function(event) {
		switch (event.target.id) {
			case 'sh_igl':prevImg();break;
			case 'sh_igr':nextImg();break;
			case 'sh_igd':downloadImg();break;
		}
	});
	function removeStyle(){
	    $('#bingtu').empty();
	    $('#hp_bottomCell').empty();
	}
	$("#form").submit(function(event){
	  	removeStyle();
	});
	$("#kw").change(function(){
		$(".bdsug-overflow").click(removeStyle)
	});
}

try{
	if(document.documentElement.hasAttribute('xmlns')){
		var bing_uri = 'http://cn.bing.com';
		var _window = typeof unsafeWindow != 'undefined'?unsafeWindow:window;
		//var $ = _window.$;
		var ajax = GM_xmlhttpRequest;
		bing();
		changHasBgStyle();
		_bing = load();
		if(_bing.current.url){
			$("#bg1").css("background-image",'url('+_bing.current.url+')');
		}
		loadBgJson(0,loadResponse);//_bing.idx
		
	}
}catch(ee){
	console.log(ee)
}
function initBing () {
	var _init_bing = {
		name : '_baiduLogo',
		X : 0,
		Y : 0,
		current:{idx:0,url:''},
		formerly:{idx:0,url:''},
		idx:0,
		defultOpacity:40
	};
	save(_init_bing);
	_window.location.href=_window.location.href;
}
GM_registerMenuCommand("Bing图初始化",initBing);
