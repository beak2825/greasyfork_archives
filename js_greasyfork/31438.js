// ==UserScript==
// @icon         https://api.47ks.com/favicon.ico
// @name		 VIP视频解析助手
// @namespace    318273996@qq.com
// @author		jukxiaoguai
// @description	 直接播放vip视频
// @match        *://v.youku.com/v_show/*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/dianying/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://*.tudou.com/listplay/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.tudou.com/programs/view/*
// @match        *://*.mgtv.com/b/*
// @match        *://film.sohu.com/album/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/video/*
// @match        *://vip.1905.com/play/*
// @match        *://vip.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.fun.tv/vplay/*
// @match        *://*.wasu.cn/Play/show/*
// @match        *://vip.ifkdy.com/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version      1.0.3
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/31438/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/31438/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	/******************************渲染组件-开始******************************/
	GM_addStyle('#deCodePanel{position:absolute;z-index:9999;text-align:center;border-radius:5px;background-color:hsla(0,0%,93%,.76);}' +
				'.toggleClass_opacity{opacity:0;}' +
				'#deCodePanel>ul>li:not(:last-child){border-bottom:1px solid #bdbcbc;}' + 
				'#deCodePanel>ul>li{line-height:25px;list-style:none;font-size: 14px;}' +
				'#deCodePanel>ul>li>a{color:red;}');
	
	/******************************VIP视频解析网址列表-开始******************************/
	/**
	 *name  : 网址标题
	 *url   : 解析接口
	 *title : 域名
	 */
	var deCodeJSON=[
		{"name":"47影视云(可内嵌)","url":"https://api.47ks.com/webcloud/?v=","title":"api.47ks.com"},
		{"name":"石头解析(可内嵌)","url":"https://jiexi.071811.cc/jx2.php?url=","title":"jiexi.071811.cc"},
		{"name":"妹儿云(可内嵌)","url":"https://www.yymeier.com/api.php?url=","title":"www.yymeier.com"},
		{"name":"旋风解析","url":"http://api.xfsub.com/index.php?url=","title":"api.xfsub.com"},
		{"name":"那片","url":"http://api.nepian.com/ckparse/?url=","title":"api.nepian.com"},
		{"name":"VIP看看","url":"http://q.z.vip.totv.72du.com/?url=","title":"q.z.vip.totv.72du.com"},
		{"name":"强强视频","url":"http://000o.cc/jx/ty.php?url=","title":"000o.cc"},
		{"name":"无名小站","url":"http://www.wmxz.wang/video.php?url=","title":"www.wmxz.wang"},
		{"name":"VIP视频解析","url":"http://www.vipjiexi.com/tong.php?url=","title":"www.vipjiexi.com"},
		{"name":"万能解析","url":"http://yyygwz.com/index.php?url=","title":"yyygwz.com"},
		{"name":"舞动秋天","url":"http://qtzr.net/s/?qt=","title":"qtzr.net"},
		{"name":"歪歪电影","url":"http://www.yydy8.com/common/?url=","title":"www.yydy8.com"},
		{"name":"爱看影院列表","url":"http://www.521804.com/www/jiexi.php?url=","title":"www.521804.com"},
		{"name":"YY影院","url":"http://www.chepeijian.cn/jiexi/vip.php?url=","title":"www.chepeijian.cn"},
		{"name":"百域阁","url":"http://api.svip.baiyug.cn/svip/index.php?url=","title":"api.svip.baiyug.cn"},
		{"name":"迷失之梦","url":"http://mt2t.com/yun?url=","title":"mt2t.com"},
		{"name":"65yw","url":"http://www.65yw.com/chaojikan.php?url=","title":"www.65yw.com"}
	];
	/******************************VIP视频解析网址列表-开始******************************/
	
	var currentSite = null;
	var videoSite = window.location.href;
    var reYk = /youku/i;
    var reAqy = /iqiyi/i;
    var reLS = /le/i;
    var reTX = /qq/i;
    var reTD = /tudou/i;
    var reMG = /mgtv/i;
    var reSH = /sohu/i;
    var reAF = /acfun/i;
    var reBL = /bilibili/i;
    var reYJ = /1905/i;
    var rePP = /pptv/i;
    var reYYT = /yinyuetai/i;
    var reFXW = /fun.tv/i;
    var vipBtn = '<div id="ul_div" style="display:inline-block;vertical-align: middle;">';
	vipBtn += '<div>';
	vipBtn += '<a href="javascript:void(0);" id="btn_vip" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">vip在线解析</a>';
	vipBtn += '<div style="display:inline-block;"><input style="vertical-align: middle;cursor: pointer;" id="auto_jx" type="checkbox"/><label for="auto_jx" style="vertical-align: middle;color: red;cursor: pointer;">自动解析-微信:jukxiaoguai</label></div>';
	vipBtn += '</div>';
	var deCodePanel = '<div id="deCodePanel" class="toggleClass_opacity"> <ul>';
	$.each(deCodeJSON,function(index,value){
		deCodePanel += '<li><a class="jx_" title="'+ value.title +'" data-api="' + value.url + '" href="javascript:void(0);">' + value.name + '</a></li>';
	});
	deCodePanel += '</ul></div>';
	vipBtn += deCodePanel;
	vipBtn += "</div>"
    
	// 优酷
    if(reYk.test(videoSite)){
		currentSite = "youku";
        var youkuTitle = $('#module_basic_phonewatch');
		youkuTitle.after(vipBtn);
        $('#btn_vip').css({'font-size':'17px','display':'inline-block','height':'22px','line-height':'22px','margin':'0 5px','vertical-align':'bottom'});
    }
	
    // 爱奇艺
    if(reAqy.test(videoSite)){
		currentSite = "iqiyi";
        var iqiyiTitle = $('#widget-videotitle');
        iqiyiTitle.parent('.mod-play-tit').append(vipBtn);
		$("#ul_div").css("margin-top","-10px");
        $('#btn_vip').css({'font-size':'17px','display':'inline-block','height':'24px','line-height':'24px','margin':'0 5px'});
    }
	
    // 乐视
    if(reLS.test(videoSite)){
		currentSite = "le";
        //var lsTitle = $('.j-video-name');
        var lsTitle = $("div.j-barrage");
        lsTitle.after(vipBtn);
		$("#ul_div").css("line-height","42px");
        lsTitle.css('float','left');
        $('#btn_vip').css({'font-size':'16px','display':'inline-block','height':'20px','line-height':'20px','margin':'0 5px'});
		$("div.j-barrage").remove();//移除弹幕发送
    }
	
    // 腾讯
    if(reTX.test(videoSite)){
		currentSite = "tx";
        //var qqTitle = $('.video_title');
        var qqTitle = $("div.action_wrap").empty();
        qqTitle.append(vipBtn);
        $('#btn_vip').css({'font-size':'24px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
		$("#ul_div").css("margin-top","7px");
		$("#deCodePanel").css("top","100%!important");
    }
	
    // 土豆
    if(reTD.test(videoSite)){
		currentSite = "tudou";
        //var tdTitle = $('#videoKw');
        var tdTitle = $("#shareWrap");
        tdTitle.after(vipBtn);
		$("#ul_div").css("margin-top","5px");
        $('#btn_vip').css({'font-size':'18px','display':'inline-block','height':'22px','line-height':'22px','margin':'14px 5px 0'});
    }
	
    // 芒果
    if(reMG.test(videoSite)){
		currentSite = "mgtv";
        var mgTitle = $('.v-panel-title');
        mgTitle.after(vipBtn);
        mgTitle.css({'float':'left','margin-right':'0'});
        $('#btn_vip').css({'font-size':'22px','display':'inline-block','height':'40px','line-height':'40px','margin':'0 5px'});
    }
	
    // 搜狐
    if(reSH.test(videoSite)){
		currentSite = "sohu";
        //var shTitle = $('.player-top-info-name');
        var shTitle = $("div.J_act_operation");
        shTitle.append(vipBtn);
		$("#ul_div").css("margin-top","-34px");
        //shTitle.find('h2').css({'float':'left'});
        $('#btn_vip').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
    }
	
    // acfun
    if(reAF.test(videoSite)){
		currentSite = "acfun";
        var acTitle = $('.head').find('.title');
        acTitle.append(vipBtn);
        $('#btn_vip').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'20px','line-height':'20px','margin':'0 5px'});
    }
	
    // bilibili
    if(reBL.test(videoSite)){
		currentSite = "bilibili";
        var biliTitle = $('div.app').empty();
        biliTitle.append(vipBtn);
        biliTitle.css({'float':'left','margin-right':'0'});
		$("#ul_div").css("margin-top","20px");
        $('#btn_vip').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
    }
	
    // 1905
    if(reYJ.test(videoSite)){
		currentSite = "1905";
        var yijiuTitle = $('.nav-title');
        yijiuTitle.parent('.player-nav').append(vipBtn);
        $('#btn_vip').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
    }
	
    // pptv
    if(rePP.test(videoSite)){
		currentSite = "pptv";
        var pptvTitle = $('.title_video').find('h3');
        pptvTitle.after(vipBtn);
        $('#btn_vip').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
    }
	
    // 音悦台
    if(reYYT.test(videoSite)){
		currentSite = "yinyuetai";
        var yytTitle = $('.videoName');
        yytTitle.append(vipBtn);
        $('#btn_vip').css({'font-weight':'bold','font-size':'14px','display':'inline-block','height':'32px','line-height':'32px','margin':'0 5px'});
    }
	
    // 风行网
    if(reFXW.test(videoSite)){
		currentSite = "fengxw";
        var fxwTitle = $('.cru-tit');
        fxwTitle.parent('a').after(vipBtn);
        $('#btn_vip').css({'font-weight':'bold','font-size':'14px','display':'inline-block','height':'22px','line-height':'22px','margin':'0 5px'});
    }
	
	$("#deCodePanel").css("width",$("#btn_vip").parent().width());
	/******************************渲染组件-结束******************************/
	
	/******************************事件-开始******************************/
	//展开解析api列表
	$("#btn_vip").click(function(){
		if (currentSite == "sohu"){
			$("#deCodePanel").css("width",$("#btn_vip").parent().width());
		}
		$("#deCodePanel").toggleClass("toggleClass_opacity");
	});
	
	//解析api列表单击事件
	$("#deCodePanel").on("click","a.jx_",function(){
		var decode_url = $(this).attr("data-api");
		var mod_player = null;
		var mod_player_height = 0;
		videoSite = window.location.href; //获取最新的地址栏信息
		if(decode_url.indexOf("https") != -1 && currentSite != null){
			
			//腾讯视频
			if (currentSite == "tx") {
				mod_player = $("#mod_player");
				mod_player.empty();
			}
			
			//优酷视频
			if (currentSite == "youku") {
				mod_player = $("#module_basic_player");
				mod_player.empty();
			}
			
			//爱奇艺
			if (currentSite == "iqiyi") {
				//暂停广告
				if($(".bottom-public_play") != null){
				  $(".bottom-public_play").click();
				}
				//暂停视频播放
				if($(".btn-video") != null){
				  $(".btn-video").click();
				}
				//mod_player = jQuery("#flashbox");
				//mod_player.empty();
			}
			
			//土豆视频
			if (currentSite == "tudou") {
				mod_player = $("#player");
				mod_player.empty();
			}
			
			//搜狐视频
			if (currentSite == "sohu") {
				mod_player = $("#playerWrap");
				mod_player.empty();
			}
			
			//乐视
			if (currentSite == "le") {
				mod_player = $("#fla_box");
				mod_player.empty();
			}
			
			//马桶台
			if (currentSite == "mgtv") {
				mod_player = $("#mgtv-player-wrap");
				mod_player.empty();
			}
			
			//pptv
			if(currentSite=="pptv"){
				mod_player = $("#pptv_playpage");
				mod_player.empty();
			}
			
			//acfun
			if(currentSite=="acfun"){
				mod_player = $("#player");
				mod_player.empty();
			}
			
			//bilibili
			if (currentSite =="bilibili"){
				mod_player = $("#bofqi");
				mod_player_height = mod_player.height();
				mod_player.empty();
			}
			
			//1905
			if (currentSite =="1905"){
				mod_player = $("#playBox");
				mod_player.empty();
			}
			
			//音悦台
			if (currentSite =="yinyuetai"){
				mod_player = $("#vPlay");
				mod_player.empty();
			}
			
			//风行网
			if (currentSite =="fengxw"){
				mod_player = $("#html-video-player-layout");
				mod_player.empty();
			}
			
			//生成解析视频页面
			var iframe = $("<iframe>");
			iframe.attr("src", (decode_url + videoSite)).css({
				"width": "100%",
				"height": "100%",
				"scrolling": "no",
				"frameborder": "0",
				"border": "0"
			});
				
			//优酷设置高度
			if (currentSite == "youku") {
				iframe.css("height",$("#player_sidebar").height());
			}
			
			//acfun设置高度
			if(currentSite=="acfun"){
				iframe.css("height",$("section.player").height());
			}
			
			//bilibili设置高度
			if(currentSite=="bilibili"){
				iframe.css("height",mod_player_height);
			}
			
			if (mod_player != null) {
				mod_player.append(iframe);
			} else {
				window.open((decode_url + videoSite));
			}
			
			$("#deCodePanel").toggleClass("toggleClass_opacity");
		}else {
            window.open((decode_url + videoSite));
        }
		
	});
	
	//自动解析复选框
	$("#auto_jx").click(function(){
		if ($(this).attr("checked") == "checked"){
			window.localStorage.setItem("isAutoPlay","true");
		}else{
			window.localStorage.setItem("isAutoPlay","false");
		}	
	});
	
	//当窗口发生变化时
	$(window).resize(function(){
	   //优酷设置高度
		if (currentSite == "youku") {
			iframe.css("height",$("#player_sidebar").height());
		}
		
		//acfun设置高度
		if(currentSite=="acfun"){
			iframe.css("height",$("section.player").height());
		}
		
	});

	$(function(){
		//判断是否自动解析
		var isAutoPlay = window.localStorage.getItem("isAutoPlay");
		if (isAutoPlay == "true"){
			//复选框回填选中状态
			$("#auto_jx").attr("checked","checked");
			//自动解析播放
			setTimeout(function(){
				$("#deCodePanel").toggleClass("toggleClass_opacity");
				$("a.jx_[title='api.47ks.com']").click();
				console.log("执行自动播放");
			},"1000");
		}
	});
	/******************************事件-结束******************************/
})();