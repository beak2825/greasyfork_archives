// ==UserScript==
// @name         张师傅高校邦修改
// @namespace    undefined
// @version      9.9.9
// @description  一键修改进度到100%
// @author       everybody
// @match        https://imooc.class.gaoxiaobang.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501661/%E5%BC%A0%E5%B8%88%E5%82%85%E9%AB%98%E6%A0%A1%E9%82%A6%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/501661/%E5%BC%A0%E5%B8%88%E5%82%85%E9%AB%98%E6%A0%A1%E9%82%A6%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

$(function(){
    ghost_init();
});

function ghost_init()
{
    alert("TIP：点击左侧按钮修改");
    var body=document.querySelector('body');
	var div=document.createElement('div');
	body.insertBefore(div,body.childNodes[0]);
	var exec=document.createElement('button');
	exec.style="position:relative;left:10px;width:100px;top:100px;background-color:#DC143C;color:#F8F8FF";
	exec.innerHTML="我用双手成就你的梦想";
    exec.onclick=f_exec;
	div.appendChild(exec);
}

function f_exec(){
    var video=document.querySelector('video');
    if (video)
    {
        //var obj=jwplayer(0);
        var obj=video;
        var href=window.location.href;
        var index=href.indexOf("chapterId=");
        var index2=href.indexOf('&',index);
        var arg1=href.substring(index+10,index2>0?index2:href.length);
		var arg2=href.substring(href.indexOf("class/")+6,href.indexOf("/unit"));
        var time=new Date().getTime();
        var duration=parseInt(obj.duration);
        //
        var infoUrl = "https://imooc.class.gaoxiaobang.com/class/"+arg2+"/chapter/"+arg1+"/api?"+time;
        $.post(infoUrl,function(result){
            var maxViewTime = result.userRecord.maxViewTime;
            if(!maxViewTime){
                maxViewTime = 0;
            }
            var url="https://imooc.class.gaoxiaobang.com/log/video/"+arg1+"/"+arg2+"/api?"+time;
            var data='[{"state":"listening","level":2,"ch":'+duration+',"mh":'+maxViewTime+',"ct":'+time+'}]';
            $.post(url,{rl:href,data:data},function(result){
                $('.gxb-next-blue').click();
                document.getElementsByClassName("gxb-next-blue").click();
            });
        });

    }
}

