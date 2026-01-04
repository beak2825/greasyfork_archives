// ==UserScript==
// @name         不理解析专用插件
// @namespace    videoVIPParser
// @version      0.0.3
// @description  解析各大视频网站如优酷，腾讯，爱奇艺，芒果，哔哩哔哩会员视频。
// @author       不理为克
// @org-author   王然 https://greasyfork.org/zh-CN/scripts/455562-%E4%B8%8D%E7%90%86%E8%A7%A3%E6%9E%90%E4%B8%93%E7%94%A8%E6%8F%92%E4%BB%B6/code
// @match        *://*.iqiyi.com/v_*
// @match        *://v.youku.com/*
// @match        *://*.le.com/*
// @match        *://v.qq.com/*
// @match        *://*.tudou.com/*
// @match        *://*.mgtv.com/*
// @match        *://film.sohu.com/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/video/*
// @match        *://vip.1905.com/play/*
// @match        *://vip.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.fun.tv/vplay/*
// @match        *://*.wasu.cn/Play/show/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455562/%E4%B8%8D%E7%90%86%E8%A7%A3%E6%9E%90%E4%B8%93%E7%94%A8%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/455562/%E4%B8%8D%E7%90%86%E8%A7%A3%E6%9E%90%E4%B8%93%E7%94%A8%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

//日志函数
var debug = false;
var log_count = 1;
function slog(c1,c2,c3){
    c1 = c1?c1:'';
    c2 = c2?c2:'';
    c3 = c3?c3:'';
    if(debug) console.log('#'+ log_count++ +'-ScriptLog:',c1,c2,c3);
}

var theplayurl = window.location.href;

(function() {
    'use strict';
    GM_addStyle('#TManays{z-index:99999; position:absolute; left:0px; top:0px; width:170px; height:auto; border:0; margin:0;}'+
                '#TMul{position:fixed; left:-156px; top:145px;width:140px; background-color:#555; opacity:0.8; border:3px solid #555; list-style:none; margin:0; padding:5px;}'+
                '#TMul li{margin:0; padding:3px;} '+
                '#TMul li a{font-size:15px; margin:0; padding:3px; color:white;} '+
                '#TMGobtn{position:fixed; left:0; top:100px;cursor:pointer;outline:none; width:70px; height:40px; border-width:2px 4px 2px 0px; border-color:#ffff00; background-color:#ffff00; border-style:solid; font:12px "微软雅黑"; color:#ff0000; margin:0; padding:0;} '+
                '#TMbtn{position:fixed; left:0; top:145px;cursor:pointer;outline:none; width:70px; height:40px; border-width:2px 4px 2px 0px; border-color:#ffff00; background-color:#ffff00; border-style:solid; font:12px "微软雅黑"; color:#aaa; margin:0; padding:0;}');
    function btnTg(){
		var btn=document.getElementById("TMbtn");
		var ul=document.getElementById("TMul");
		if(btn.style.left===""||parseInt(btn.style.left)<10){btn.style.left=156+"px";ul.style.left=0; btn.innerText="◁";}else{btn.style.left=0;ul.style.left=-156+"px"; btn.innerText="▷";}
	}

    //添加爱奇艺VIP的解析方式
	function preload_all(){
		if(theplayurl.indexOf('iqiyi') > 0) preload_iqiyi();
	}

    function preload_iqiyi(){
        slog('albumId',Q.PageInfo.playPageInfo.albumId);
        if(Q.PageInfo.playPageInfo.albumId !== undefined ){
            var s = document.createElement("script"), el = document.getElementsByTagName("script")[0];
            s.async = false;
            s.src = document.location.protocol + "//cache.video.qiyi.com/jp/avlist/"+ Q.PageInfo.playPageInfo.albumId +"/1/50/";
            el.parentNode.insertBefore(s, el);
        }
	}
	function prego_all(){
		if(theplayurl.indexOf('iqiyi') > 0) prego_iqiyi();
	}
    function prego_iqiyi(){
		var ele = document.querySelectorAll('li[class="item selected"] > span').length ? document.querySelectorAll('li[class="item selected"] > span')[1] : document.querySelectorAll('li[class="item no selected"] > span')[1];
        if(ele !== undefined ){
            var pd = ele.parentNode.getAttribute('data-pd');
            if(pd > 0){
                var vinfo = tvInfoJs.data.vlist[pd-1];
                if(vinfo.vurl.length > 0){
                    theplayurl = vinfo.vurl;
                }
            }
        }
    }
    function btnGo(){
        prego_all();
        window.open('http://1.buliweike.top/?url='+theplayurl, "_blank");//默认使用mailseason，直接跳转
    }
    preload_all();
    var div=document.createElement("div");
    div.innerHTML='<div id="TManays">'+
  '<ul id="TMul">'+
        '<li><a href="http://1.buliweike.top/?url='+theplayurl+'" target="_blank">默认</a></li>'+
   '</ul>'+
	'<button id="TMGobtn">VIP播放 ▶</button>'+
	'<button id="TMbtn">备用 ▷</button>'+
  '</div>';
    document.body.appendChild(div);
    document.querySelector("#TMGobtn").addEventListener("click",btnGo,false);
    document.querySelector("#TMbtn").addEventListener("click",btnTg,false);
})();