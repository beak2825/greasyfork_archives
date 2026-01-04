// ==UserScript==
// @name         Bj职业技能学习视频Auto学习脚本
// @namespace    http://tampermonkey.net/
// @version      0.24
// @author       Greasyfork
// @description  声明:本脚本仅供学习和研究参考使用,请勿用于其它非法用途.使用本脚本所造成的任何影响,由用户自己负责!
// @match        https://www.bjjnts.cn/lessonStudy/*
// @Declare      声明:本脚本仅供学习和研究参考使用,请勿用于其它非法用途.使用本脚本所造成的任何影响,由用户自己负责!
// @downloadURL https://update.greasyfork.org/scripts/407243/Bj%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91Auto%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/407243/Bj%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91Auto%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setTimeout(myTool, 3000);
	
	var chapter;
	var playInterval;

	function myTool()
	{
		//console.log('myTool');
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
			maxTime = parseInt($(this).data('learnduration'));
			faceSign = 0;
			faceSignTime = 0;
			currentTime = 0;
			oldTime = 0;

			$.post("/lessonStudy/" + courseid + "/" + lessonid, function(data){
				if(data.code == 200){
					url = data.data.url;
					learnDuration = data.data.learnDuration;
					duration = data.data.duration;
					maxTime = data.data.learnDuration;
				  
					currentTime = learnDuration;
					url = data.data.url;
					$("#myVideo").attr('src', url);	
					myVideo.src = url;			
				}	
		        //console.log('maxTime',maxTime);
				//myVideo.play();
				//console.log(myVideo);
			});
		});		
		layer.alert('脚本初始化完成!<br\>' + '版本:Auto学习普通版<br\>' 
                + '声明:本脚本仅供学习和研究参考使用,请勿用于其它非法用途.使用本脚本所造成的任何影响,由用户自己负责!' 
                + '<br\><br\>点击课程目录开始播放', { icon: 6 });
	}
	
	function createMyVideo()
	{
		$("#studymovie").css('dispaly','none');
		$("#studymovie").hide();
		console.log('Disable old Video.Create MyVideo');
		var myVideo = document.createElement("VIDEO");
		myVideo.setAttribute("id", "myVideo");
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
			//var vLength = myVideo.duration;
			//duration = parseInt(vLength);
			//$.post("/editVideoChapter/" + courseid + "/" + lessonid, { duration: duration });
			
			//myVideo.currentTime = learnDuration;
			//myVideo.pause();
			if(playInterval && playInterval != 0){
				clearInterval(playInterval);
			}
			showMsg.innerHTML = "正在观看视频,当前进度: " + timeFormatter(currentTime) + "		" + (currentTime*100.0/duration).toFixed(2) + "%";
			playInterval = setInterval(()=>{
				currentTime += 1;
				showMsg.innerHTML = "正在观看视频,当前进度: " + timeFormatter(currentTime) + "		" + (currentTime*100.0/duration).toFixed(2) + "%";
				timeupdate();
				if(currentTime>=duration){
					if(playInterval && playInterval != 0){
						clearInterval(playInterval);
					}
					playEnded();
				}
			},1000);
		};
		
		// 禁止视频快进
		myVideo.addEventListener('timeupdate', timeupdate);
				
		// 播放事件
		myVideo.addEventListener('play', function (e) {
			console.log('play Skip Check');
			console.log('myVideo Continue');
		});

		// 暂停监听
		myVideo.addEventListener('pause', function (e) {
			currentTime = parseInt(myVideo.currentTime)
		});
		myVideo.addEventListener('seeked', function(e) {
			currentTime = parseInt(myVideo.currentTime)
		});

		// 播放结束
		//myVideo.addEventListener('ended',playEnded);
	}
	
	//绑定play timeUpdate()
	function timeupdate(){
		if(currentTime - oldTime >= 60 && currentTime > learnDuration){
			console.log('myVideo timeupdate:Update learnTime ' + currentTime.toString());
			$.post("/addstudentTaskVer2/" + courseid + "/" + lessonid, { "learnTime": currentTime,"push_event":"update"});
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
		$.post("/addstudentTaskVer2/" + courseid + "/" + lessonid, { "learnTime": duration ,"push_event":"ended"},function(data){
      if(data.code == 200){
        $.cookie('lessonid', lessonid);
        setTimeout(function(){
          $('.lesson-'+nextLesson).click();
        },1000);
		    console.log('Update learnTime finished');
      }
    });
	}
	
	function createShowMsg()
	{
		console.log('Create label');
		var showMsg = document.createElement("label");
		showMsg.setAttribute("id", "showMsg");
		showMsg.setAttribute("title", "双击停止观看");
		showMsg.onclick = clearPlayInterval;
		showMsg.style.cssText = "width:920px;height:20px;color:red;margin-left:15px;";
		showMsg.innerHTML = "声明:本脚本仅供学习和研究参考使用,请勿用于其它非法用途.使用本脚本所造成的任何影响,由用户自己负责!    点击课程目录开始播放.";
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


