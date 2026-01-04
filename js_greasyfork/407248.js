// ==UserScript==
// @name         Bj职业技能学习视频Auto学习脚本(自动快进版)
// @namespace    http://tampermonkey.net/
// @version      0.04
// @author       Greasyfork
// @description  声明:本脚本仅供学习和研究参考使用,请勿用于其它非法用途.使用本脚本所造成的任何影响,由用户自己负责!
// @match        https://www.bjjnts.cn/lessonStudy/*
// @Declare      声明:本脚本仅供学习和研究参考使用,请勿用于其它非法用途.使用本脚本所造成的任何影响,由用户自己负责!
// @downloadURL https://update.greasyfork.org/scripts/407248/Bj%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91Auto%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%28%E8%87%AA%E5%8A%A8%E5%BF%AB%E8%BF%9B%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407248/Bj%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91Auto%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%28%E8%87%AA%E5%8A%A8%E5%BF%AB%E8%BF%9B%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setTimeout(myTool, 3000);
	
	var chapter;
	var playInterval;

	function myTool()
	{
		console.log('myTool');
		createMyVideo();
		
		var myVideo = document.getElementById("myVideo");
		$(".change_chapter").unbind("click");
		// 视频播放
		$(".change_chapter").click(function () {
			var lock = $(this).data('lock');
			if(check_network_protocol_support() === false && lock == 1){
				return false;
			}
			chapter = $(this);
			$(this).parent(".course_study_sonmenu").addClass("on")
			$(this).parents("li").siblings().find(".course_study_sonmenu").removeClass("on")
			$(this).parent(".course_study_sonmenu").siblings().removeClass("on")
			lessonNum = $(this).data('lessonnum');
			lessonid = $(this).data('lessonid');
			isface = $(this).data('isface');
			faceTime = $(this).data('facetime');
			learnDuration = parseInt($(this).data('learnduration'));
			maxTime = parseInt($(this).data('learnduration'));
			faceSign = 0;
			faceSignTime = 0;
			currentTime = 0;
			oldTime = 0;

			$.post("/lessonStudy/" + courseid + "/" + lessonid, function(data){
				url = data.data.url;
				$("#myVideo").attr('src', url);	
				myVideo.src = url;				
		        console.log('maxTime',maxTime);
				myVideo.play();
				console.log(myVideo);
			});
		});		
		layer.alert('脚本初始化完成!<br\>' + '版本:Auto学习快速版<br\>' 
                + '声明:本脚本仅供学习和研究参考使用,请勿用于其它非法用途.使用本脚本所造成的任何影响,由用户自己负责!' 
                + '<br\><br\>点击课程目录开始播放', { icon: 6 });
	}
	
	function createMyVideo()
	{
		$("#studymovie").css('dispaly','none');
		$("#studymovie").hide();
		console.log('Disable old Video.Create MyVideo');
		var myVideo = document.createElement("VIDEO");
		console.log('myVideo',myVideo);
		myVideo.setAttribute("id", "myVideo");
		//myVideo.setAttribute("title", "myVideo");
		myVideo.setAttribute("width", "920");
		myVideo.setAttribute("height", "500");
		myVideo.setAttribute("display", "block");
		myVideo.setAttribute("disabled", "true");
		myVideo.setAttribute("controls", "false");
		
		var videoBox = document.getElementsByClassName("course_study_videobox");
		console.log(videoBox);
		videoBox[0].appendChild(myVideo);
		
		var showMsg = createShowMsg();
		videoBox[0].appendChild(showMsg);
				
		myVideo.onloadedmetadata = function () {
			var vLength = myVideo.duration;
			duration = parseInt(vLength);
			$.post("/editVideoChapter/" + courseid + "/" + lessonid, { duration: duration });
			
			//myVideo.currentTime = learnDuration;
			//currentTime = learnDuration;
			
			currentTime = duration - 10
			myVideo.currentTime = currentTime;
			//myVideo.pause();
			if(playInterval && playInterval != 0){
				clearInterval(playInterval);
			}			
		};
		
		// 禁止视频快进
		myVideo.addEventListener('timeupdate', timeupdate);
				
		// 播放事件
		myVideo.addEventListener('play', function (e) {
			//if(check_network_protocol_support() === false){
			//	myVideo.pause();
			//}else if(beginFaceSign == 1){
			//	myVideo.pause();
			//	canvas();
			//}			
			console.log('play Skip Check');
			console.log('myVideo Continue');
			//if(currentTime >= duration) return false;
			//if(currentTime == parseInt(myVideo.duration)){
			//	myVideo.currentTime = 0;
			//}else{
			//	myVideo.currentTime = currentTime;
			//}
		});

		// 暂停监听
		myVideo.addEventListener('pause', function (e) {
			currentTime = parseInt(myVideo.currentTime)
		});
		myVideo.addEventListener('seeked', function(e) {
			currentTime = parseInt(myVideo.currentTime)
		});

		// 播放结束
		myVideo.addEventListener('ended',playEnded);
	}
	
	//绑定play timeUpdate()
	function timeupdate(){
		if(currentTime - oldTime >= 60 && currentTime > learnDuration){
			console.log('myVideo timeupdate:Update learnTime ' + currentTime.toString());
			$.post("/addstudentTaskVer2/" + courseid + "/" + lessonid, { "learnTime": currentTime });
			oldTime = currentTime;
		}
		if(chapter){
			if(chapter.data('learnduration')<currentTime){
				chapter.data('learnduration',currentTime);
			}
		}
	}
	
	//绑定play ended
	function playEnded() {
		console.log('play ended.');
		maxTime = duration;
		learnDuration = duration;
		currentTime = duration;
		if (duration - maxTime > 1 && duration != learnDuration) {
			myVideo.currentTime = maxTime;
			return;
		}
		console.log('myVideo play end:Update learnTime ' + duration.toString());
		$('.lesson-'+lessonNum+' .course_study_menuschedule').html('已完成<br>100%');
		var nextLesson = lessonNum+1;
		$('.lesson-'+nextLesson+' .course_study_menuschedule').html('已完成<br>0%');
		$('.lesson-'+nextLesson).attr('data-lock','0');
		//learnTime = duration;
		$.cookie('lessonid', lessonid);
		$.post("/addstudentTaskVer2/" + courseid + "/" + lessonid, { "learnTime": duration });
		setTimeout(function(){
			$('.lesson-'+nextLesson).click();
		},1000);
		console.log('Update learnTime finished');
	}
	
	function createShowMsg()
	{
		console.log('Create label');
		var showMsg = document.createElement("label");
		console.log('label',showMsg);
		showMsg.setAttribute("id", "showMsg");
		showMsg.setAttribute("title", "双击停止观看");
		showMsg.onclick = clearPlayInterval;
		showMsg.style.cssText = "width:920px;height:20px;color:red;margin-left:15px;";
		showMsg.innerHTML = "声明:本脚本仅供学习和研究参考使用,请勿用于其它非法用途.使用本脚本所造成的任何影响,由用户自己负责!";
		return showMsg;
	}
	
	function clearPlayInterval(){		
		if(playInterval && playInterval != 0){
			clearInterval(playInterval);
		}
	}
	
	function timeFormatter(duration) {
      let secondTime = parseInt(duration);// 秒
      let minuteTime = 0;// 分
      let hourTime = 0;// 小时
      if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
        // 获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        // 获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60)
        // 如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          // 获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          // 获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      let result = secondTime > 9 ? secondTime : ('0' + secondTime);
      if (minuteTime > 0) {
        result = (minuteTime > 9 ? minuteTime : ('0' + minuteTime)) + ":" + result;
      } else {
        result = "00" + ":" + result;
      }
      if (hourTime > 0) {
        result = (hourTime > 9 ? hourTime : ('0' + hourTime)) + ":" + result;
      } else {
        result = "00" + ":" + result;
      }
      return result;
    }
	
})();


