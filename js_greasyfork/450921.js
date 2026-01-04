// ==UserScript==
// @name        传智播客高教学习平台-我的预习视频(16倍速无人值守自动下一节)
// @namespace   CSDN_Plugin Scripts 
// @grant       none
// @license      luwenjie
// @match        *://*.ityxb.com/preview/detail/*
// @version     2.0
// @author      德宏大魔王
// @description 2022/09/07 09:15:14
// @downloadURL https://update.greasyfork.org/scripts/450921/%E4%BC%A0%E6%99%BA%E6%92%AD%E5%AE%A2%E9%AB%98%E6%95%99%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E6%88%91%E7%9A%84%E9%A2%84%E4%B9%A0%E8%A7%86%E9%A2%91%2816%E5%80%8D%E9%80%9F%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82%29.user.js
// @updateURL https://update.greasyfork.org/scripts/450921/%E4%BC%A0%E6%99%BA%E6%92%AD%E5%AE%A2%E9%AB%98%E6%95%99%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E6%88%91%E7%9A%84%E9%A2%84%E4%B9%A0%E8%A7%86%E9%A2%91%2816%E5%80%8D%E9%80%9F%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
         //我的个人博客https://blog.csdn.net/qq_35230125?spm=1010.2135.3001.5421
	// 传智播客自动播放加倍速脚本
	//程序5s后开始运行
	 
	setInterval(function(){
	run();
	},3000);
	
	
	function run(){
		//判断是不是习题
		//var check=document.getElementsByClassName("el-button el-button--primary el-button--big").length;
		//	if(check=='1'){
			//		console.log('=====习题======');
						//点击下一个播放
				 
			//		console.log("数组");
				//	document.getElementsByClassName("point-text-box")[window.iii].click();
					//console.log(demo);
				//document.getElementsByClassName("point-text-box")[2].click();
			//	}
	
					
			
				
	
		//

		//获取当前播放节点（视频名称）：
		var node_name=document.getElementsByClassName("playing-name")[0].innerHTML;
		//获取目录列表总数
		var mulu_length=document.getElementsByClassName("point-text-box").length;
		
		for (var i=0;i<mulu_length;i++)
{ 
    var array_name=document.getElementsByClassName('point-text ellipsis')[i].innerText;
	//跳过习题 自己做！！！！
	var check=document.getElementsByClassName("el-button el-button--primary el-button--big").length;
	console.log(check);
	if(check=='1'){
			//console.log('=====当前为习题======');
						//点击下一个播放
		document.getElementsByClassName("point-text-box")[i+2].click();
	}

		else if(array_name==node_name&&check=='0'){
			
			//console.log(i);
			//监测视频进度是否是100%
			//console.log(document.getElementsByClassName("point-progress-box")[i].innerHTML)
			if(document.getElementsByClassName("point-progress-box")[i].innerHTML=="100%"){
				//console.log("是");
				//点击下一个播放
				document.getElementsByClassName("point-text-box")[i+1].click();
				window.iii=i;
			}else{
					console.log('=====视频');
	console.log("传智播客自动播放加倍速脚本启动");
	document.getElementsByTagName("canvas")[0].click();
	console.log("静音模式");
	document.getElementsByTagName("canvas")[6].click();
	console.log("倍速模式");
	//16倍速模式（章鱼哥16倍速模式）
	document.querySelector('video').playbackRate=16.0;
  document.getElementsByTagName("p")[0].click();
	console.log("调试模式");
			//无作为
			}
			
		}
	

}
		//获取当前进度条是否为100% 是则下一个播放
	//document.getElementsByClassName("point-progress-box")[0]
	
	}
})();