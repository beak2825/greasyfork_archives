// ==UserScript==
// @name         WestFast
// @namespace    https://www.xiaoz.me/
// @version      0.33
// @description  WestFast效率增强
// @author       xiaoz
// @match        https://www888.west.cn/SetInManager/question/*
// @match        https://www888.west.cn/setinmanager/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372029/WestFast.user.js
// @updateURL https://update.greasyfork.org/scripts/372029/WestFast.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //定义一个全局弹出层
    window.layerstart = '<div id = "layerwest" style = "box-shadow: 1px 1px 2px #888888;border-radius:5px;top:0em;left:0;width:80%;height:720px;background-color:#FFFFFF;position:fixed;z-index:999;display:none;border:1px solid #d2d2d2">';
    layerstart += '<div style="text-align:right;padding:0.8em;border-bottom:1px solid #d2d2d2;"><a href="javascript:;" onclick="closelayer()" style="color:#FFFFFF;background-color:#FF5722;width:80px;text-align:center;padding:0.5em;border-radius:2px;padding-left:1em;padding-right:1em;">关闭</a></div>';
    window.layerend = '</div>';

    //让层居中显示
    window.layerCenter = function(){
	    var bwidth = window.screen.availWidth;;
	    var bheight = window.screen.availHeight;
	    var layertop = (bheight - 720) / 2;
	    var layerleft = (bwidth - 1280) / 2;

	    if(layertop <= 70){
		    layertop = "1em";
	    }

	    //改变css
	    $("#layerwest").css({"top":layertop,"left":"10%"});
    }
    //创建一个遮罩层
    window.keepout = function(){
	    var fade = '<div id = "fade" style = "width:100%;height:100%;background:rgba(0, 0, 0, 0.5);position: fixed;left: 0;top: 0;z-index: 99;" onclick = "closelayer()"></div>';
	    $("body").append(fade);
	    $("#wfmenu").hide();
    }

    //关闭层
    window.closelayer = function(){
	    $("#layerwest").hide();
		showSidebar();
		$("#layerwest").remove();
		$("#fade").remove();
		$("#wfmenu").show();
    }
    //ESC键关闭层
    window.esckey = $(document).keyup(function(event){
        switch(event.keyCode) {
        case 27:
        closelayer();
        }
    });

    
	//批量隐藏侧边栏
	window.hideSidebar = function(){
		//隐藏侧边栏以免影响弹出层显示
	    $(".menu").hide();
	    $("#fixrightdiv").hide();
	    $(".moban_question").hide();
	    $(".answer_list").hide();
	}
	//批量显示侧边栏
	window.showSidebar = function(){
		$("#fixrightdiv").show();
	    $(".moban_question").show();
	    $(".answer_list").show();
	}
	//显示云主机工单
	window.showCloud = function(){
		var layer = layerstart;
		layer += '<div><iframe src = "https://west.ttt.sh/index/cloud/3/m/" width="100%" height="660px" frameborder="0"></iframe></div>';    
	    layer += layerend;
	    
	    $("#fixtop").append(layer);
	    $("#layerwest").show();
	    keepout();
		layerCenter();
	    hideSidebar();
	}
	//显示虚拟主机工单
	window.showVhost = function(){
		var layer = layerstart;
		layer += '<div><iframe src = "https://west.ttt.sh/index/vhost/2/m/" width="100%" height="660px" frameborder="0"></iframe></div>';    
	    layer += layerend;
	    
	    $("#fixtop").append(layer);
	    $("#layerwest").show();
	    keepout();
	    layerCenter();
	    hideSidebar();
	}
	//显示备案速查
	window.showbeian = function(){
		var layer = layerstart;
		layer += '<div><iframe src = "https://www888.west.cn/SetInManager/icpmanager/westicpcheck.asp" width="100%" height="660px" frameborder="0"></iframe></div>';    
	    layer += layerend;
	    
	    $("#fixtop").append(layer);
	    $("#layerwest").show();
	    keepout();
	    layerCenter();
	    hideSidebar();
	}
	//显示内部解析
	window.shownbdns = function(){
		var layer = layerstart;
		layer += '<div><iframe src = "https://www888.west.cn/SetInManager/cdndomain/default.asp" width="100%" height="660px" frameborder="0"></iframe></div>';    
	    layer += layerend;
	    
	    $("#fixtop").append(layer);
	    $("#layerwest").show();
	    keepout();
	    layerCenter();
	    hideSidebar();
	}
    //通用iframe弹出层
    window.showlayer = function(url){
	    var layer = layerstart;
		layer += '<div><iframe src = "' + url + '" width="100%" height="660px" frameborder="0"></iframe></div>';    
	    layer += layerend;
	    
	    $("#fixtop").append(layer);
	    $("#layerwest").show();
	    keepout();
	    layerCenter();
	    hideSidebar();
    }

    function westfast(){
	    var westfast = '<div id = "wfmenu" style = "background-color:#F0F0F0;padding:1em;">';
	    westfast += '<strong>WestFast :</strong> <a href="https://www888.west.cn/SetInManager/admin/whitelist.asp" rel="external nofollow" target = "_blank">黑白名单</a> | ';
	    westfast += '<a href="javascript:;" onclick = "showbeian()">备案速查</a> | ';
	    westfast += '<a href="https://whois.west.cn/" rel="external nofollow" target = "_blank">Whois查询</a> | ';
	    westfast += '<a href="javascript:;" onclick = "showCloud()">云主机工单</a> | ';
	    westfast += '<a href="javascript:;" onclick = "showVhost()">虚拟主机工单</a> | ';
	    westfast += '<a href="https://west.ttt.sh/index/toolkit" rel="external nofollow" target = "_blank">WEB工具</a> | ';
	    westfast += '<a href="https://west.ttt.sh/index/dnsquery" rel="external nofollow" target = "_blank">内部解析查询</a> | ';
	    westfast += '[官方]<a href="javascript:;" onclick = "shownbdns()">内部解析查询</a> | ';
	    westfast += '<a href="https://west.ttt.sh/index/hkvhost" rel="external nofollow" target = "_blank"">港台节点</a> | ';
	    //westfast += '<a href="https://ip.awk.sh/" rel="external nofollow" target = "_blank">IP查询</a>';
	    westfast += '<a href="javascript:;" onclick = "showlayer(\'https://west.ttt.sh/index/question\')">常见问题</a>';
	    westfast += '</div>';
	    $("#fixtop").append(westfast);
	    $("#wfmenu a").css("color","#42b983");
    }

    westfast();
    //topmenu();
    $('#wfmenu').scrollToFixed();
})();