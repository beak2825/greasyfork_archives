// ==UserScript==
// @icon             https://www.thfou.com/img/favicon.png
// @name             淘宝天猫阿里访问无线端详情
// @namespace        https://www.thfou.com/
// @version          2.1.4
// @description      添加淘宝天猫阿里巴巴直接访问无线端详情等功能
// @author           头号否
// @match            *://detail.1688.com/offer/*
// @match            *://item.taobao.com/*
// @match            *://detail.tmall.com/*
// @supportURL       https://www.thfou.com/liuyan
// @compatible	     Chrome
// @compatible	     Firefox
// @compatible	     Edge
// @compatible   	 Safari
// @compatible   	 Opera
// @compatible	     UC
// @license          GPL-3.0-only
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/392385/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%98%BF%E9%87%8C%E8%AE%BF%E9%97%AE%E6%97%A0%E7%BA%BF%E7%AB%AF%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/392385/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%98%BF%E9%87%8C%E8%AE%BF%E9%97%AE%E6%97%A0%E7%BA%BF%E7%AB%AF%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

var alicmz = '<div id="thfou_alicmz"></div>';
var getbody = document.getElementsByTagName('body')[0];
    getbody.insertAdjacentHTML('afterbegin', alicmz);

   var style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML="#thfou_alicmz, .aliwx{position:fixed;top:30%;right:50px;padding:10px;min-width:130px;text-align:center;z-index:99999;background-color:#fff;border:1px dotted #D9D9D9;}.alicmzbtn{background-color: #FFE4D0; color: #E5511D; border: 1px solid #F0CAB6;right:20em;top:40em;z-index:88;cursor:pointer;padding:5px 20px;border-radius:50px;margin-bottom:10px;transition:.3s;}.alicmzbtn:hover{color:#fff;background-color:#E5511D;}.close{color: #828282; background-color: #e6e6e6; width: 80px; text-align: center; padding: 0.5em; border-radius: 2px; padding-left: 1em; padding-right: 1em; text-decoration: none;transition: .3s;}.close:hover{color:#5d5d5d;background-color:#dcdcdc;text-decoration: none;}.alicmzbtn a{color:#E5511D;text-decoration: none;}.dmcss a{color:#d3d3d3;text-decoration: none;}.xflogo{width: 110px; padding: 15px 10px 15px 10px;}#gbxf{color:#E5511D;position:absolute;right:8px;top:6px;font-size:12px;cursor:pointer;transition:.3s;border:1px #E5511D solid;line-height:9px;border-radius:3px;padding:1px;}#gbxf:hover{color:#fff;border:1px #fa630a solid;background-color:#fa630a;opacity:0.8;}#smallxf{position:fixed;bottom:0px;right:36px;color:#fe4514;background-color: #fff; border: 1px dotted #D9D9D9;padding:8px;font-weight:bold;font-size:14px;cursor:pointer;z-index:999999999999999999;transition:.6s;}#smallxf:hover{bottom:5px;box-shadow: rgba(0, 0, 0, 0.04) 0 1px 5px 0px;}.smlogo{width: 100px; padding: 2px 5px 0px 5px;}";
   document.getElementsByTagName('HEAD').item(0).appendChild(style);
    //定义一个全局弹出层
    window.layerstart = '<div id = "layer" style = "border-radius:2px;top:0em;left:0;width:32%;height:92%;background-color:#FFFFFF;position:fixed;z-index:9999999999;display:none;border:1px solid #ffffff;overflow:hidden;padding-bottom:30px;border-radius:10px;">';
    layerstart += '<div style="text-align: right; padding: 15px; border-bottom: 1px solid #F8F8F8; height: 20px;background-color: #F8F8F8;"><a class="close" href="javascript:;" onclick="closelayer()">X</a><a href="https://www.thfou.com?spm=a261y.7663282.0.0.18f52a43zNdcy9" target="_blank"><img src="https://www.thfou.com/img/headnewlogo.svg" style="float: left;width: 100px;margin-top: -3px;"></a><div style="float: left; font-size: 17px; margin-top: -2px; margin-left: 10px; font-family: sans-serif; color: #333;">无线端详情</div></div>';
    window.layerend = '</div>';

    //让层居中显示
    window.layerCenter = function(){
	    var bwidth = window.screen.availWidth;
	    var bheight = window.screen.availHeight;
	    var layertop = (bheight - 720) / 2;
	    var layerleft = (bwidth - 1280) / 2;

	    if(layertop <= 70){
		    layertop = "1em";
	    }
	    else{
		    layertop = (layertop - 125) + "px";
	    }

	    //改变css
	    //$("#layer").css({"top":layertop,"left":layerleft});
	    //原生js改变css
	    //alert(layertop);
	    document.getElementById("layer").style.top = "20px";
	    document.getElementById("layer").style.left = "35%";
    }
    //创建一个遮罩层
    window.keepout = function(){
	    var fade = '<div id = "fade" style = "width:100%;height:100%;background:rgba(0, 0, 0, 0.5);position: fixed;left: 0;top: 0;z-index: 999999999;" onclick = "closelayer()"></div>';
	    //$("body").append(fade);
	    var div = document.createElement("div");
	    div.innerHTML = fade;
		document.body.appendChild(div);
    }

    //关闭层
    window.closelayer = function(){
	    //$("#layer").hide();
	    document.getElementById("layer").style.display = "none";
		//showSidebar();
		//$("#layer").remove();
		var layer = document.getElementById("layer");
		layer.parentNode.removeChild(layer);

		//$("#fade").remove();
		var fade = document.getElementById("fade");
		fade.parentNode.removeChild(fade);
    }

    //创建一个显示按钮
    function aliwxframe(){
	    //$("body").append('<div id = "alicmzbtn" style = "position:fixed;right:1em;bottom:1em;z-index:88;cursor:pointer;" onclick = "showaliwx()"><img src = "https://libs.xiaoz.top/material/image.png" width = "36px" height = "36px" /></div>');
	    //使用原生js添加按钮
	    var getkj = document.getElementById("thfou_alicmz");
	    getkj.innerHTML = '<div id="thwx" class= "alicmzbtn" onclick = "showaliwx()">查看无线端详情</div>';
	    document.body.appendChild(getkj);
    }
    //显示按钮
    var pdsite = document.domain.split('.')[1];
    function taobaoId() {
    var num = g_config.itemId;
        return num;
    }
    function aliId() {
    var num = document.getElementsByName('b2c_auction')[0].content;
        return num;
    }
    if ( pdsite == 'taobao' ) {
    var tbshopId = taobaoId();
     window.showaliwx = function(){
	    var up = layerstart;
	    up += '<iframe id="thfou_wx" src = "https://h5.m.taobao.com/awp/core/detail.htm?id=' + tbshopId + '" width="100%" height="100%" frameborder="0"></iframe>';
	    up += layerend;
	    //$("body").append(up);
	    var div = document.createElement("div");
	    div.innerHTML = up;
		document.body.appendChild(div);

	    //$("#layer").show();
	    document.getElementById("layer").style.display = "block";

	    //显示遮罩
	    keepout();
	    //居中显示层
	    layerCenter();
     }
    }
    else if ( pdsite == 'tmall' ) {
    var tmshopId = taobaoId();
     window.showaliwx = function(){
	    var up = layerstart;
	    up += '<iframe id="thfou_wx" src = "https://detail.m.tmall.com/item.htm?id=' + tmshopId + '" width="100%" height="97.5%" frameborder="0"></iframe>';
	    up += layerend;
	    //$("body").append(up);
	    var div = document.createElement("div");
	    div.innerHTML = up;
		document.body.appendChild(div);

	    //$("#layer").show();
	    document.getElementById("layer").style.display = "block";

	    //显示遮罩
	    keepout();
	    //居中显示层
	    layerCenter();
     }
    }
    else if ( pdsite == '1688' ) {
    var alishopId = aliId();
     window.showaliwx = function(){
	    var up = layerstart;
	    up += '<iframe id="thfou_wx" src = "https://m.1688.com/offer/' + alishopId + '.html?spm=b26110380.sw1688.mof001.397.7b9c2c5ePEj0Hb" width="100%" height="98%" frameborder="0"></iframe>';
	    up += layerend;
	    //$("body").append(up);
	    var div = document.createElement("div");
	    div.innerHTML = up;
		document.body.appendChild(div);

	    //$("#layer").show();
	    document.getElementById("layer").style.display = "block";

	    //显示遮罩
	    keepout();
	    //居中显示层
	    layerCenter();
     }
    }

    aliwxframe();

//var hkjsc = '<div id="hkj"><a style="text-decoration:none;" target="_blank" href="https://greasyfork.org/zh-CN/scripts/395160-%E5%A4%B4%E5%8F%B7%E5%90%A6-%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E8%90%A5%E9%94%80%E9%BB%91%E7%A7%91%E6%8A%80"><div class="alicmzbtn">1688营销黑科技</div></a></div>';
//var hkj = document.getElementById('thfou_alicmz');
//    hkj.insertAdjacentHTML('beforeend',hkjsc);

var tbxf = '<div id="tbxf"><a style="text-decoration:none;" target="_blank" href="https://daima.thfou.com/tbxf/"><div class="alicmzbtn">淘宝悬浮生成</div></a></div>';
var tbxfg = document.getElementById('thfou_alicmz');
    tbxfg.insertAdjacentHTML('beforeend',tbxf);

var alixf = '<div id="alixf"><a style="text-decoration:none;" target="_blank" href="https://daima.thfou.com/alixf/"><div class="alicmzbtn">阿里悬浮生成</div></a></div>';
var txf = document.getElementById('thfou_alicmz');
    txf.insertAdjacentHTML('beforeend',alixf);

var alicode = '<div id="alilive"><a style="text-decoration:none;" target="_blank" href="https://daima.thfou.com/alizcode/"><div class="alicmzbtn">阿里代码生成</div></a></div>';
var tcode = document.getElementById('thfou_alicmz');
    tcode.insertAdjacentHTML('beforeend',alicode);

var alilive = '<div id="alicode"><a style="text-decoration:none;" target="_blank" href="https://daima.thfou.com/alilive/"><div class="alicmzbtn">阿里直播间</div></a></div>';
var tlive = document.getElementById('thfou_alicmz');
    tlive.insertAdjacentHTML('beforeend',alilive);

var morejb = '<div id="getplugs"><a style="text-decoration:none;" target="_blank" href="https://greasyfork.org/zh-CN/users/311567-%E5%A4%B4%E5%8F%B7%E5%90%A6"><div class="alicmzbtn">获取更多插件</div></a></div>';
var more = document.getElementById('thfou_alicmz');
    more.insertAdjacentHTML('beforeend',morejb);

var vers = GM_info.script.version;
var thfougw = '<div class="dmcss"><a target="_blank" href="https://greasyfork.org/zh-CN/scripts/392385-%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%98%BF%E9%87%8C%E8%AE%BF%E9%97%AE%E6%97%A0%E7%BA%BF%E7%AB%AF%E8%AF%A6%E6%83%85" title="检查更新">当前版本：' + vers + '</a></div>';
var thfou = document.getElementById('thfou_alicmz');
    thfou.insertAdjacentHTML('beforeend',thfougw);

var thflogo = '<div id="logo"><a target="_blank" href="https://www.thfou.com"><img class="xflogo" src="https://www.thfou.com/img/headnewlogo.svg"></a></div>';
var thf = document.getElementById('thfou_alicmz');
    thf.insertAdjacentHTML('afterbegin',thflogo);

var gbxf = '<div id="gbxf" onclick="hidexf();" title="点击隐藏">—</div>';
var xfkj = document.getElementById('thfou_alicmz');
    xfkj.insertAdjacentHTML('afterbegin',gbxf);

var hdxf = document.getElementById('gbxf');
    hdxf.addEventListener('click', hidexf, false);

var smallxf = '<div id="smallxf" style="display:none;" onclick="showcmz();" title="点击恢复"><img src="https://www.thfou.com/img/headnewlogo.svg" class="smlogo"></div>';
var getcmz = document.getElementById('thfou_alicmz');
    getcmz.insertAdjacentHTML('afterend',smallxf);

var showxf = document.getElementById('smallxf');
    showxf.addEventListener('click', showcmz, false);

function hidexf() {
 document.getElementById('thfou_alicmz').style.display = 'none';
 document.getElementById('smallxf').style.display = 'block';
}

function showcmz() {
 document.getElementById('thfou_alicmz').style.display = 'block';
 document.getElementById('smallxf').style.display = 'none';
}

//屏蔽AD
var sosoUrl = document.domain.split('.')[1];
var staobao = 'taobao';
var stmall = 'tmall';
if ( sosoUrl == staobao || sosoUrl == stmall ) {
   var adno = document.createElement('style');
   adno.type = 'text/css';
   adno.innerHTML=".dzt-notice-alert,.xds-course-img,.dzt-notice-alert,.dztbar-t-r{display:none!important;}";
   document.getElementsByTagName('HEAD').item(0).appendChild(adno);
}
var getdomain = document.domain;
var stb = 's.taobao.com';
var tm = 'list.tmall.com';
if ( getdomain == stb || getdomain == tm ) {
   var hidebtn = document.createElement('style');
   hidebtn.type = 'text/css';
   hidebtn.innerHTML="#thwx{display:none!important;}";
   document.getElementsByTagName('HEAD').item(0).appendChild(hidebtn);
}

})();