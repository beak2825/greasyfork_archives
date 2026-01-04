// ==UserScript==
// @name         中国海峡人才市场|福建省人才测评中心|国家级专业技术人员继续教育基地|多课
// @namespace    http://tampermonkey.net/
// @version      2023.8.3
// @description  破除多课限制，最多开3个，bug+V：aluyunjiesmile，如果不想看，我这里有偿帮你看
// @author       aluyunjie
// @license      CC BY-NC-SA
// @match        https://fj.rcpxpt.com/classModule/video/*
// @match        https://fj.rcpxpt.com/classPackage/classPackageDetail/*
// @match        https://fj.rcpxpt.com/sysConfigItem/selectDetail/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/472330/%E4%B8%AD%E5%9B%BD%E6%B5%B7%E5%B3%A1%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%7C%E7%A6%8F%E5%BB%BA%E7%9C%81%E4%BA%BA%E6%89%8D%E6%B5%8B%E8%AF%84%E4%B8%AD%E5%BF%83%7C%E5%9B%BD%E5%AE%B6%E7%BA%A7%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9F%BA%E5%9C%B0%7C%E5%A4%9A%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/472330/%E4%B8%AD%E5%9B%BD%E6%B5%B7%E5%B3%A1%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%7C%E7%A6%8F%E5%BB%BA%E7%9C%81%E4%BA%BA%E6%89%8D%E6%B5%8B%E8%AF%84%E4%B8%AD%E5%BF%83%7C%E5%9B%BD%E5%AE%B6%E7%BA%A7%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9F%BA%E5%9C%B0%7C%E5%A4%9A%E8%AF%BE.meta.js
// ==/UserScript==


	

(function() {
   	
   	
	for (var i = 0; i < 1000; i++) {
		player.j2s_pauseVideo();
	}
	
	GM_setValue("flage","0");//为0则替换失败，为1则替换成功
   	var url = window.location.href;
   	
   	if(url.includes("https://fj.rcpxpt.com/classPackage/classPackageDetail")){
   		createLogBox();
   		addTextToLogBox("脚本加载成功，请选择课程")
   		addTextToLogBox("from V:aluyunjiesmile")
   	}
   	
   	if(url.includes("https://fj.rcpxpt.com/sysConfigItem/selectDetail/")){
   		createLogBox();
   		addTextToLogBox("脚本加载成功，请在此页面按住ctrl键，然后再点击课程，进行多开")
   		addTextToLogBox("from V:aluyunjiesmile")
   	}
   
   for (var i = 0; i < 50; i++) {
   	console.log("执行创建")
   	const forbiddenMultiCoursewarePlayProxy = new Proxy(forbiddenMultiCoursewarePlay, {
   	  apply: function(target, thisArg, argumentsList) {
   	    console.log("forbiddenMultiCoursewarePlay 函数实现");
   		GM_setValue("flage","1");
   		
   	  },
   	});
   	
   	// 替换原始函数为代理
   	forbiddenMultiCoursewarePlay = forbiddenMultiCoursewarePlayProxy;
   	
   }
   
   player.j2s_resumeVideo();
   	

	

		
		
	

 
       
	   
})();

   function addTextToLogBox(TextLog){
   	// 获取目标 <div> 元素
   	var targetDiv = document.getElementById('logBox'); // 替换为你的目标 <div> 元素的 ID
   	targetDiv.appendChild(document.createElement('br'));
   	// 创建文本节点
   	var textNode = document.createTextNode(TextLog);
   	
   	// 添加文本节点到目标 <div> 元素
   	targetDiv.appendChild(textNode);
   	targetDiv.scrollTop = targetDiv.scrollHeight;
   }
   
   //创建日志框
   function createLogBox() {
     var logBox = document.createElement('div');
     logBox.id = 'logBox';
     logBox.style.position = 'fixed';
     logBox.style.bottom = '0';
     logBox.style.left = '0';
     logBox.style.width = '200px';
     logBox.style.height = '200px';
     logBox.style.backgroundColor = 'black'; // 更改背景颜色为黑色
     logBox.style.color = 'green'; // 更改文本颜色为绿色
     logBox.style.overflow = 'auto';
     logBox.style.padding = '10px';
     logBox.style.fontFamily = 'Arial, sans-serif';
     logBox.style.whiteSpace='pre-wrap';
     document.body.appendChild(logBox);
   }