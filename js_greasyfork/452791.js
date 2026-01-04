// ==UserScript==
// @name         浙江师范大学-网络继续教育学院-视频连播
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  浙江师范大学-网络继续教育学院-视频连播！
// @author       You
// @run-at       document-end
// @match        https://web.uteacher.net/Project/CoursePlay/?*
// @match        https://web.uteacher.net/Project/Task/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/452791/%E6%B5%99%E6%B1%9F%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6-%E7%BD%91%E7%BB%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2-%E8%A7%86%E9%A2%91%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/452791/%E6%B5%99%E6%B1%9F%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6-%E7%BD%91%E7%BB%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2-%E8%A7%86%E9%A2%91%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.onload=function(){
	//获取当前页面的url

	var href = window.location.href;
	//console.log(href)
	if(href.indexOf("https://web.uteacher.net/Project/Task/")!=-1){
        GM_setValue("href",href);
		let course = document.querySelector("#vueCourse > div > div.layui-row.layui-col-space20.px-course-list > div:nth-child(1)");
		//let over = course.getElementsByClassName("progress-bar")[0];
		//获取课程标签
		kecheng(course);
		//console.log(over.getAttribute("style"));
		//console.log("在课程列表")
	}else if(href.indexOf("https://web.uteacher.net/Project/CoursePlay/?")!=-1){
		xuexi();
		//console.log("在视频列表页面，进入视频学习")
	}else{
		console.log("不在预先设定的网址中，或者播放地址有修改")
	}
	}

	function xuexi(){
       tanchuang();
        var videonode = document.getElementsByTagName("video")[0];
        videonode.muted=true;
         videonode.play();
    //播放视频
         videonode.addEventListener("ended",function () {
             if(document.getElementsByClassName("active")[0].nextSibling==null){
                 window.open( GM_getValue("href"),"_self");
                 //alert("学习完毕，手动点开下一个学习页面继续学习")
             }else{
                 document.getElementsByClassName("active")[0].nextSibling.getElementsByTagName("a")[0].click();
             }
         })
		}

	function kecheng(course){
		let over = course.getElementsByClassName("progress-bar")[0];
		//获取当前的学习课程是否已经学完
		if(over.getAttribute("style")=="width:100%"&&course.nextSibling!=null){
			//已经学完，切换下一个
			course=course.nextSibling;
            console.log("切换下一个");
			kecheng(course);
		}else if(over.getAttribute("style")!="width:100%"){
		var	studyurl=course.getElementsByTagName("a")[0].href;
			window.open(studyurl,"_self");
			//进入学习
		}else if(course.nextSibling==null){
			alert("已经全部学习完毕");
		}
	}

     function tanchuang(){
          setTimeout(function(){ if(document.getElementsByClassName("layui-layer-content")[0]){
       document.querySelector("#layui-layer1 > div > div > div.popup-btn-container > button:nth-child(1)").click();
           //用于处理页面的弹窗
       }},2000);
        setTimeout(function(){ if(document.getElementsByClassName("layui-layer-btn0")[0]){
       document.getElementsByClassName("layui-layer-btn0")[0].click();
           //用于处理页面的弹窗
       }},2000);
         }
    // Your code here...
})();