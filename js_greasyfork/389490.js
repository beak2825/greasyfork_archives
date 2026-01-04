// ==UserScript==
// @name         GT学院恢复进度条和倍速播放
// @version      0.3.0
// @description  帮助我们更好的学习！！
// @author       gcc（guocc1993@gmail.com）
// @include      *://training.gt-china.com.cn/teelms/study.shtml?*
// @grant        none
// @namespace https://greasyfork.org/users/17224
// @downloadURL https://update.greasyfork.org/scripts/389490/GT%E5%AD%A6%E9%99%A2%E6%81%A2%E5%A4%8D%E8%BF%9B%E5%BA%A6%E6%9D%A1%E5%92%8C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/389490/GT%E5%AD%A6%E9%99%A2%E6%81%A2%E5%A4%8D%E8%BF%9B%E5%BA%A6%E6%9D%A1%E5%92%8C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

//V0.3 学习了一下js原生的发送和处理GET/POST请求，增加了一个彩蛋。
//V0.2 终于上手JavaScript了，作为第一个练手项目也不错。

(function() {
    'use strict';
    var object2 = document.getElementById('courseBox2');//通过id获取遮罩层元素
    if (object2 != null){
        object2.parentNode.removeChild(object2);//删除遮罩层
	}

	addButton();
	//加速按钮功能
	document.getElementById('bt1').addEventListener("click",function(){
		var myvid=document.getElementById('courseBox').contentWindow.document.querySelector("video");
		myvid.playbackRate=myvid.playbackRate+0.1;
		document.getElementById('Vspeed').value=myvid.playbackRate.toFixed(1);
	});
	document.getElementById('bt2').addEventListener("click",function(){
		var myvid=document.getElementById('courseBox').contentWindow.document.querySelector("video");
		myvid.playbackRate=myvid.playbackRate-0.1;
		document.getElementById('Vspeed').value= myvid.playbackRate.toFixed(1);
	});
	document.getElementById('bt3').addEventListener("click",function(){
		var myvid=document.getElementById('courseBox').contentWindow.document.querySelector("video");
		myvid.playbackRate=1;
		document.getElementById('Vspeed').value= myvid.playbackRate.toFixed(1);
	});
    var ClickTimes = 1;
    document.getElementById('bt4').addEventListener("click",function(){
    //点击六次，触发彩蛋
        ClickTimes ++;
        if(ClickTimes==7){
           var pid = getQueryVariable('pid'); //用户id
           var id = getQueryVariable('id');  //课程id
           var httpRequest = new XMLHttpRequest();
           httpRequest.open('GET', "https://training.gt-china.com.cn/teelms/do/study_do.php?pid="+pid+"&task=setTime&id="+id+"&totalSessionTime=15000&s="+Date.parse(new  Date()), true);//打开连接
           httpRequest.send();
           httpRequest.onreadystatechange = function () {
               if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                   var r = httpRequest.responseText;//获取结果
                   alert("Surprise！！！！！！已完成:"+r);
               }
           };
       }
	});

	//添加按钮
	function addButton(){
		var btpos = document.getElementById('bottomBox');
		var newtext = document.createElement('div');
		newtext.style.cssText += 'text-align:center';
        newtext.innerHTML ="<input type=\"button\" id=\"bt4\" value=\"当前速度：\"><input type=\"text\" id=\"Vspeed\" size =\"1\" readonly=\"readonly\" value=\"1.0\"><input type=\"button\" id=\"bt1\" value=\"加0.1\"><input type=\"button\" id=\"bt2\" value=\"减0.1\"><input type=\"button\" id=\"bt3\" value=\"还 原\">";
		document.body.insertBefore(newtext,btpos);
 	}
    function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }
})();
