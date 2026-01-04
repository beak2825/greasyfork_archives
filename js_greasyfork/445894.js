// ==UserScript==
// @name         国家开发大学刷课
// @namespace    http://tampermonkey.net/
// @version      20230406.01
// @description  可以复制答案、刷课的强大插件
// @author       xxx
// @match        https://*.ouchn.cn/*
// @license      GPL

// @downloadURL https://update.greasyfork.org/scripts/445894/%E5%9B%BD%E5%AE%B6%E5%BC%80%E5%8F%91%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/445894/%E5%9B%BD%E5%AE%B6%E5%BC%80%E5%8F%91%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

//检测url变化
window.onload = function()  {
	if(document.addEventListener){
	    document.addEventListener('DOMContentLoaded',answerCopy(),false)
        }
	nextButtonClick()
	window.onhashchange = function () {
		console.log('URL发生变化了');
		setTimeout(function(){
		    init();
		},7500);
	};
	// 初始化函数
	function init() {
		playVideo()
		

	}
	
	
	
	function previewcheck() {
		var viewbutton = $("a[previewer*='{uploads: uploads, currentFile: upload, activity: activity, canAddNote: true}']")[0];
		if(viewbutton != undefined) {
			viewbutton.click();
			setTimeout(function(){
			    if ($("a[close-popup*='file-previewer-with-note']")[0] != undefined) { $("a[close-popup*='file-previewer-with-note']")[0].click() }
			},3000);
		} 
	}
	
	//复制答案
	function answerCopy() {

		setTimeout(function(){
	    var url = window.location.pathname;
	    if(url.indexOf("exam") >= 0 ) { //判断url对象文件名中是否包含post
			//已答题
			if( $("input[checked*='checked']")[0] != undefined ) {
				$("input[checked*='checked']").parent().parent().css('background-color', 'red');
			} else if ($("label[class*='answered-option']")[0] != undefined) {
				//注册点击事件 
				// 单线程问题？ 所有需要用延时
				// $("label[style*='red']").css('background-color', '');
				$("label").css('background-color', '');
				//打上颜色
				$("label[class*='answered-option']").css('background-color', 'red');
				$('label').unbind('click').click(function() {    //表示阻止向父元素冒泡
				     setTimeout(function() {
						 //清除所有颜色
						 // $("label[style*='red']").css('background-color', '');
						 $("label").css('background-color', '');
						 //打上颜色
						 $("label[class*='answered-option']").css('background-color', 'red');
					 },50)
					 
				})
				
				
				// $('input.ng-valid').unbind('click').click(function() {    //表示阻止向父元素冒泡
				//      alert('xxxx')
				// })
			}
			 
			 
			 //未答题
			//  $("label[style*='red']").css('background-color', '');
			
			//  //现场选择
			//  $("label[class*='answered-option']").css('background-color', 'red');
			// $("lable").click(function(){
			//   $("label[class*='answered-option']").toggleClass('background-color', 'red');
			// });
			  
			  
	     
	        
	    } 
	},3000);
	
	}


	
	//视屏倍速播放
	function playVideo() {
		var clock = setInterval( function() {
			//界定快进范围
			// console.log('快进中')
			videoButtonCheck();
		}, 10000);	
		var video = document.getElementsByTagName("video");
		if(video.length>0){ //是视频的话就播放
			video[0].currentTime = 0;
		    document.querySelector('.mvp-fonts-play').click();
			console.log('视屏开始播放')
		     setTimeout(function(){
		        document.querySelectorAll('.mvp-play-rate')[0].click()
				//开始倍速播放
				speedControl()
		    },5500);
			video[0].addEventListener('pause', function () {
				//视屏播放结束、进入下一课时。
				 document.querySelector('.mvp-fonts-play').click();
				
			}, false);
			
			video[0].addEventListener('ended', function () { 
				//视屏播放结束、进入下一课时。
				console.log('视屏结束！');
				clearInterval(clock);
				nextButtonClick();
			}, false);
		} else {
			//没有发现视屏、5秒后将进入下一刻。
			console.log('没视频判断到我将点击下一课！');
			//预览检测
			clearInterval(clock);
			previewcheck()	
			scrollContent()
			nextButtonClick()
		}
	}
	
	//点击下一课程
	function nextButtonClick() {
		setTimeout(function(){
		    document.querySelector('.next').click();
		},5500);
	}
	
	//点击上一课
	function previousButtonClick() {
		setTimeout(function(){
		    document.querySelector('.pre').click();
		},2500);
	}

	// 下拉滚动条
	function scrollContent() {
		// 开始操作滚动条
		//下行
		$("html,body,.___content").animate({ scrollTop: 394 }, 1000)
		//上行
		$("html,body,.___content").animate({ scrollTop: 0 }, 1000)
	}
	
	
	function speedControl() {
		// 倍速播放 5倍速
		// video[0].playbackRate = 5;
		//利用setInterval的快进播放
		// var video = document.getElementsByTagName("video");
		var video = document.getElementsByTagName("video");
		var clock = setInterval( function() {
			//界定快进范围
			// console.log('快进中')
			
			if (video[0].currentTime < video[0].duration-10 ) {
				video[0].currentTime+=5;
			} else {
				clearInterval(clock);
				console.log('已清除')
			}
			
		}, 150)	


	}
	
	//80%按钮检测
	function videoButtonCheck() {
		if($('div.reveal-modal-bg')[0].style.cssText == 'display: block;') {
			$('div.popup-footer').find('button')[0].click();
			
			//返回上一个视频
			previousButtonClick();
		}
	}
}