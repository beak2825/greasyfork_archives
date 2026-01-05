// ==UserScript==
// @name         广城选修高校邦修改视频进度脚本
// @namespace    undefined
// @version      0.0.4
// @description  一键修改进度到100%，妈妈再也不用担心的选修啦！
// @author       $(ghost)
// @match        http://gcp.class.gaoxiaobang.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24838/%E5%B9%BF%E5%9F%8E%E9%80%89%E4%BF%AE%E9%AB%98%E6%A0%A1%E9%82%A6%E4%BF%AE%E6%94%B9%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/24838/%E5%B9%BF%E5%9F%8E%E9%80%89%E4%BF%AE%E9%AB%98%E6%A0%A1%E9%82%A6%E4%BF%AE%E6%94%B9%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$(function(){
    ghost_init();
});

function ghost_init()
{
    //显示操作框，两个按钮
    var body=document.querySelector('body');
	var div=document.createElement('div');
	div.style="position:absolute;x:0;y:0;width:100px;height:150px;background-color:#4169E1;";
	body.insertBefore(div,body.childNodes[0]);
	var help=document.createElement('button');
	help.style="position:relative;left:10px;width:80px;top:30px;";
	help.innerHTML="帮助";
    help.onclick=f_help;
	div.appendChild(help);
	var exec=document.createElement('button');
	exec.style="position:relative;left:10px;width:80px;top:80px;";
	exec.innerHTML="修改进度";
    exec.onclick=f_exec;
	div.appendChild(exec);
}

function f_help(){
    alert("请等待视频开始播放后再点击修改，会直接跳到完成，效果不会立即出来，刷新页面或者直接进入下一节即可看到效果，如出现显示已完成但视频还没放完可尝试返回一次“我的课程”界面！’");
}

function f_exec(){
    var video=document.querySelector('video');
    //如果没有获取到video，则提示
    if (video==null)
        alert("未能成功获取到video，请等待视频开始播放后修改");
    //成功获取video，开始工作
    else
    {
        var obj=jwplayer(0);
        var href=window.location.href;
        var index=href.indexOf("chapterId=");
        var index2=href.indexOf('&',index);
        var arg1=href.substring(index+10,index2>0?index2:href.length);
		var arg2=href.substring(href.indexOf("class/")+6,href.indexOf("/unit"));
        var time=new Date().getTime();
        var duration=parseInt(obj.getDuration())+30;
        var url="http://gcp.class.gaoxiaobang.com/log/video/"+arg1+"/"+arg2+"/api?"+time;
        var data='[{"state":"listening","level":2,"ch":'+duration+',"mh":'+duration+',"ct":'+time+'}]';
        $.post(url,{rl:href,data:data},function(result){
            alert("修改完毕，请刷新页面或者直接进入下一节");
        });
    }
}

