// ==UserScript==
// @name        BingSY
// @namespace   firefox
// @author     	GUOJIASHUAI
// @include 	*://www.baidu.com/
// @include 	*://www.baidu.com/home*
// @include 	*://www.baidu.com/?tn=*
// @include 	*://www.baidu.com/index.php*
// @version     2.2
// @run-at 	document-end
// @require http://code.jquery.com/jquery-latest.min.js
// @grant 	GM_xmlhttpRequest
// @grant	GM_registerMenuCommand
// @description 百度首页变成bing
// @downloadURL https://update.greasyfork.org/scripts/28744/BingSY.user.js
// @updateURL https://update.greasyfork.org/scripts/28744/BingSY.meta.js
// ==/UserScript==
//2017/04/06  	兼容新版百度首页
var _bing = {
		name : '_baiduLogo',
		X : 0,
		Y : 0,
		current:{idx:0,url:''},
		formerly:{idx:0,url:''},
		idx:0,
		defultOpacity:40,
		firstTime:"true"
	};
	
var loading = false;

//_bing 对象存储在本地
function save(_bing){
	localStorage._bing = JSON.stringify(_bing);
}
// 如果本地有存 _bing ,则在本地取
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

		$('#sh_cp').attr('href',image.copyrightlink.replace(new RegExp('.*\\?q=([^&]*).*', 'i'), 's?wd=$1')).attr('title',image.copyright);
        $('.soutu-btn').css("right","40px")
	}catch(error){
		console.log(error);return;
	}

	if(_bing.current.url!=imageUrl){
		changeBg(imageUrl,video);
	} else{
		console.log(JSON.stringify(_bing))
		if(_bing.firstTime){
			changeBg(imageUrl,video);
			_bing.firstTime = false;
		}else{
			openLoadingLock();
		}
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
	//save(_bing);
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
	var css = 'body{overflow-y:scroll;}\
	div.bing_bg{background-attachment: scroll;background-position: center 0;background-repeat: repeat-y;background-size: cover;height: 100%;left: 0;position: absolute;top: 0;width: 100%;}\
	.bing_video{position:fixed;width:'+width+'px;height:'+height+'px;left:'+left+'px;top:'+top+'px;}\
	div#sh_rdiv{position:fixed;right:15px;bottom:15px;}div#sh_rdiv A{position:relative;width:32px;height:32px;margin:0 5px;float:left}\
	a[id^="sh_"]{background:url(http://cn.bing.com/s/a/hpc12.png) no-repeat;}\
	#s_form_wrapper{position: absolute;top: 100px;}\
	#head_wrapper .s-p-top{position:absolute;top:-15px; left:-178px;width:175px;height: 45px !important;padding: 0px!important;margin: 0px!important;background-position: 0 0px;min-height:45px !important;}\
	#s_top_wrapper {position: absolute;top: 0;}\
	.s-center-box{display: none !important;}\
	#s_mancard_main{background:rgba(255,255,255,0.4);}\
	#lg img{display: none !important;}\
	#head_wrapper {position: absolute;height: 0;width: 0px;}\
	#s_wrap{width: 0%;}\
	.s_form_wrapper{height:50%;}\
	#lg{/*-moz-transition:all 1s ease;-webkit-transition:all 1s ease;*/background:url("http://imgsrc.baidu.com/forum/w%3D580/sign=108ffbc58644ebf86d716437e9fbd736/9fc170d12f2eb938e0bfb834d4628535e7dd6fc9.jpg") no-repeat;}\
	.s-skin-hasbg #kw{background:none !important;width:423px !important;box-shadow: none !important;height: 26px!important;line-height: 26px!important;padding: 4px 9px 4px 7px!important;}\
	#form .bdsug{width:421px!important;}#form .bdsug li{width:404px!important;}\
	#form .bdsug{border-left:0px!important;border-right:0px!important;top:32px!important;}\
	div#s_fm {margin: 0 0 0 200px;padding: 0;position: absolute;top: -15%;width: 421px;height:45px!important;min-height: 45px;}\
	#form{background-color: #FFFFFF;margin-top: 5px!important;top:-15px;}\
	.btn_wr {background: url("http://imgsrc.baidu.com/forum/pic/item/7da86b899e510fb3f9270773d833c895d0430cf9.jpg") no-repeat scroll -149px -37px rgba(0, 0, 0, 0) !important;}\
	#su{display: none !important;}\
	span.btn_wr {float: right;left: -1px;position: relative;top: -30px;width: 28px !important;height:28px!important;}\
	#nv a,#nv b{margin-left: 10px!important;}\
	#nv a, #tb_mr b { text-decoration: none!important;font-size: 13px!important;}\
	#nv{position: absolute;left:-30px;top:0px;width: 480px !important;}\
	.s-notify-pnl .s-pk-mod,.s-new-weather-pnl{left:450px!important;}\
	.s-mod-weather{left:450px!important;top: 6px;}/*新版本首页*/\
	#bottom_container{display: none !important;height:0px!important;}\
	#s_wrap.s-isindex-wrap{ padding-bottom: 0px!important;margin-top:250px !important;}\
	a#sh_igl{background-position:-192px -53px}\
	a#sh_igr{background-position: -160px -53px}\
	a#sh_cp{background-position: -64px -85px}\
	a#sh_igd{background-position: 0 -53px}\
	#s_mod_weather .s-mod-weather-bear,#wt_inst_1 .new-weather-bear{display: none !important;}\
	#hp_bottomCell{position:fixed;left:0px;bottom:0px;width:100%;height:60px;background:linear-gradient(rgba(0, 0, 0, 0.2) 0px, rgba(0, 0, 0, 0.2) 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)}\
	#hp_pgm{margin-left:20px;bottom:0px;}\
	#hp_pgm h3{text-align:left;color: rgb(255, 255, 255);font-size: 16px;font-weight: normal;margin: 0;padding: 0;}\
	#hp_pgm a{float:left;text-align:left;color: rgb(255, 255, 255);font-size: 14px;font-weight: normal;margin-top: 5px;padding: 0;text-decoration:none;}'
	;
	$("head").append('<style id="bingtu" type="text/css">'+css+'</style>');
	$("#head").append('<div id="bg1" class="bing_bg" style="z-index:-5"/><div id="bg2" class="bing_bg" style="z-index:-5"/><div id="bg3" class="bing_bg" style="z-index:-4"><video autoplay="true" class="bing_video"/></div>');
	$("#bg2,#bg1").css("background-color",'rgba(89, 83, 87, 0.3)');
	$("#form").css("height","34px")
	$(".s-p-top").css("width","175px")
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
		//_bing = load();
		if(_bing.current.url){
			$("#bg1").css("background-image",'url('+_bing.current.url+') !important');
		}
		loadBgJson(0,loadResponse);//_bing.idx
		
	}
	console.log(_bing.current.url)

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
	//save(_init_bing);
	_window.location.href=_window.location.href;
}
GM_registerMenuCommand("Bing图初始化",initBing);

$(".s-mancacrd-main").click(
			function(){
			setInterval(chk(),1500); 
			function chk(){
			var gaodu=$("#wrapper").outerHeight(true);
			$("#bg1").css("background-attachment","fixed");
			$("#bg1").css("background-position","center center");
			$("#bg1").css("background-size","auto");
			$("#head").css("height",gaodu*2.5);
		}});