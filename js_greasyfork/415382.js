// ==UserScript==
// @name         自由改变bilibili视频播放速度
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bilibili视频播放速度自定义
// @author       aSmileBoyxxx
// @match        https://www.bilibili.com/video/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415382/%E8%87%AA%E7%94%B1%E6%94%B9%E5%8F%98bilibili%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/415382/%E8%87%AA%E7%94%B1%E6%94%B9%E5%8F%98bilibili%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
function createMyPlace(){
		var str = '	<form id="form" style="display:none;"><input id="speed" type="text" style="width: 70px;height: 20px;font-size:16px"/></form>'
		var div = document.createElement("div");
		div.setAttribute("id", "myArea");
		var text = document.createElement("div");
		text.innerText = "设置播放速度"
		div.appendChild(text);
		document.getElementsByClassName("bilibili-player-video-control-bottom")[0].appendChild(div);
		document.getElementById("myArea").innerHTML = document.getElementById("myArea").innerHTML + str;
		var ulStyle = document.getElementById("form").style;
		ulStyle.setProperty("position", "absolute");
		ulStyle.setProperty("left", "-3px");
		ulStyle.setProperty("top", "-20px");
		// document.getElementById("myArea").innerHTML =  document.getElementById("myArea").innerHTML;
		var myStyle = document.getElementById("myArea").style;
		myStyle.setProperty("color", "#00F");
		myStyle.setProperty("position", "absolute");
        myStyle.setProperty("left", "170px");
		// 实现悬浮表单
		$("#myArea").hover(function (){
			$("#form").show();
		},
		function(){
			$("#form").hide();
		}
		);
	}
	 function myListener(){
		 var nowVal;
		 document.getElementById("speed").addEventListener("blur", function(){
			 var val = document.getElementById("speed").value;
			 if(val != '' && nowVal != val){
				 nowVal = val;
				 document.getElementsByTagName("video")[0].playbackRate = val;
                 document.getElementById("speed").value = "";
				 console.log(val);
			 }
		 })
	 }
	function initMain(){
		createMyPlace();
		myListener();
	}
	var start = setInterval(
	function (){
		if(document.getElementById("myArea") == null){
			initMain();
		}else{
			console.log("成功初始化");
			window.clearInterval(start);
		}
	}, 1000)
})();