// ==UserScript==
// @name         智慧中小学视频学习（左手）
// @namespace    挂机刷课
// @version      2024.08.06
// @license      CC BY-NC-SA
// @description  适配中教学教师暑假研修：https://basic.smartedu.cn/training/2024sqpx
// @author       aluyunjie
// @match        https://basic.smartedu.cn/teacherTraining/courseDetail*
// @match        https://basic.smartedu.cn/training/*
// @match        https://basic.smartedu.cn/training/2024sqpx
// @match        https://basic.smartedu.cn/teacherTraining/courseIndex*
// @icon         https://www.zxx.edu.cn/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/502741/%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%EF%BC%88%E5%B7%A6%E6%89%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/502741/%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%EF%BC%88%E5%B7%A6%E6%89%8B%EF%BC%89.meta.js
// ==/UserScript==
//大类名称
var PrimaryAndSecondarySchoolsLinks =[
		//弘扬教育家精神 勇担强国建设使命
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0de67197-af6f-43ab-8d89-59a75aab289e&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
		//强化国家安全与文化自信
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=4eb65b2f-0b53-4d3f-8027-81d69dca7f18&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
		//数字素养与技能提升
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=c6ac438b-9c68-45ee-aa1f-a3754cdd5c89&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
		//科学素养提升
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=bc6232ef-1a1c-4da6-b53e-a929f9427e8a&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
		//心理健康教育能力提升
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0bbcd4e7-f227-47f8-b4f2-2fb339ac1edc&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
		//综合育人能力提升
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=f78d68fb-0386-4a26-aeb9-d0835b35bde2&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
		//幼儿社会情感学习
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=fa649a38-6284-4ee4-b4de-b9a77c5e5faa&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98"
	
	];
	
	//暑假学时配置
        //每个大类学习的视频数量，够时间就可以了
	var hjstudyTimes =[7,3,3,1,4,4,7];
(function() {
    'use strict';
 
    createLogBox();
	
    // 获取当前网址
    var currentURL = window.location.href;
 
    if (currentURL.includes("https://basic.smartedu.cn/training/2024sqpx")) {
		addTextToLogBox("脚本加载成功！");
		addTextToLogBox('脚本更新于2024-08-06');
		
	
		setTimeout(function(){
			//全局数组下标
			let index = 0;
			GM_setValue("下标", index);
			GM_setValue("类别","中小学");
			openNewWindow(PrimaryAndSecondarySchoolsLinks[index]);
		},5000)
		
    }
 
 
    if (currentURL.includes('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId')) {
        addTextToLogBox("脚本加载成功已经进入视频播放界面！");
        setInterval(PlayingPageTimer, 5000);
    }
 
 
    // Your code here...
})();
 
 
function PlayingPageTimer() {
 
	addTextToLogBox("请保持页面在前台！")
    jugeCurrentClassIsStudyDone();
    jugeVideoIsPlaying();
    jugePlayingPageIsNotPlay();
 
 
}
 
 
 
function jugePlayingPageIsNotPlay() {
	//换课逻辑
	var percentHound = 0;
	var GMindex = GM_getValue("下标");
	
	//setp01 判断视频播放页面有多少已经到达100%的
	percentHound =  document.getElementsByClassName('iconfont icon_checkbox_fill').length;
	
	
	//step02 从油猴脚本中取出对应下标的对应学时
	var studyedtimes = hjstudyTimes[GMindex];
	//stp03进行判断
	if(parseInt(percentHound)>= parseInt(studyedtimes)){
		var GMindex2 = GM_getValue("下标");
		let index = ++GMindex2;
		addTextToLogBox(index);
		GM_setValue("下标", index);
		
		window.location.href =  PrimaryAndSecondarySchoolsLinks[index];
		
		
	}else{
		addTextToLogBox("当前任务暂未完成课时，等待继续完成")
	}
	
 
}
 
function jugeVideoIsPlaying() {
    var trueOrFasle = document.querySelector("video").paused;
 
    if (trueOrFasle) {
        addTextToLogBox("视频未在播放");
 
        //检测是否有题，
        if (shiFouYouTi()) {
            //有题--业务逻辑
            doQuestionAnwser();
        } else {
            //无题--业务逻辑
            PlayVideoButton();
        }
 
    } else {
        addTextToLogBox("视频正在播放,设置倍速2倍");
        //用户可以来看这个，最高2倍速播放，因为有限制，如果不信，你可以把下面的数字3改为1-16中的任何数字，代表的是1-16倍
        document.querySelector("video").playbackRate = 2;
    }
}
 
 
function jugeCurrentClassIsStudyDone() {
    var titleText = document.getElementsByClassName('resource-item resource-item-train resource-item-active')[0].getElementsByTagName('i')[0].title
 
    if (titleText == '未开始') {
        addTextToLogBox("当前视频暂未看完");
    }
 
 
    if (titleText == '进行中') {
        addTextToLogBox("当前视频暂未看完。");
        addTextToLogBox("请保持在本页，要不会暂停播放视频");
    }
 
    if (titleText == '已学完') {
        addTextToLogBox("当前视频已经看完，选择下一个");
 
        findNextVideoPlay();
		setTimeout(function() {
		    window.location.reload();
		}, 2000)
    }
 
}
 
 
//找到下一个播放的视频
function findNextVideoPlay() {
    //stp01,先进行遍历点击，让iconfont icon_checkbox_linear   可以显示出来
    for (var i = 0; i < 10; i++) {
        var clickButton = document.getElementsByClassName('fish-collapse-header')[i];
        if (clickButton === undefined) {
            break;
        } else {
            clickButton.click();
        }
    }
    //stp02,先找进行中的视频观看，如果没有进行中的视频，则找未观看的视频
    for (var j = 0; i < 10; i++) {
        var nextVideo = document.getElementsByClassName('iconfont icon_processing_fill')[j];
        if (nextVideo === undefined) {
            continue;
        } else {
            nextVideo.click()
        }
 
    }
    //set03,找不到视频就点击未观看的视频进行点击观看
    document.getElementsByClassName('iconfont icon_checkbox_linear')[0].click();
 
 
    setTimeout(PlayVideoButton,2000)
}
 
function danjixiayitianniu() {
    //单击下一题按钮
    document.querySelector(
        "#root > div > div > div > div > div > div > div.index-module_detail-main_bdFS3 > div.index-module_detail-main-l_1b8KB > div.index-module_video-wrapper_22Dc0 > div > div.index-module_markerExercise_KM5bU > div > div.index-module_footer_3r1Yy > button"
    ).click()
}
 
 
function doQuestionAnwser() {
    addTextToLogBox("做题");
 
    var tixing = document.getElementsByClassName('_qti-title-prefix-qtype')[0].textContent;
    if (tixing == '单选题') {
        addTextToLogBox("题型为单选题")
        console.log("题型为单选题")
        console.log("开始做题")
        //选择第一项
        document.getElementsByClassName("nqti-check")[0].click()
 
        setTimeout(danjixiayitianniu(), 1000)
        setTimeout(danjixiayitianniu(), 1000)
    }
    if (tixing == '多选题') {
        addTextToLogBox("题型为多选")
        console.log("题型为多选")
        console.log("开始做题")
        //选择第一项
        document.getElementsByClassName("nqti-check")[0].click()
        //选择第二项
        document.getElementsByClassName("nqti-check")[1].click()
        document.querySelector(
            "#root > div > div > div > div > div > div > div.index-module_detail-main_bdFS3 > div.index-module_detail-main-l_1b8KB > div.index-module_video-wrapper_22Dc0 > div > div.index-module_markerExercise_KM5bU > div > div.index-module_footer_3r1Yy > button"
        ).click()
        setTimeout(danjixiayitianniu(), 1000)
        setTimeout(danjixiayitianniu(), 1000)
    }
    if (tixing == '判断题') {
        addTextToLogBox("题型为判断")
        console.log("题型为判断")
        console.log("开始做题")
        //选择第一项
        document.getElementsByClassName("nqti-check")[0].click()
 
        document.querySelector(
            "#root > div > div > div > div > div > div > div.index-module_detail-main_bdFS3 > div.index-module_detail-main-l_1b8KB > div.index-module_video-wrapper_22Dc0 > div > div.index-module_markerExercise_KM5bU > div > div.index-module_footer_3r1Yy > button"
        ).click()
        setTimeout(danjixiayitianniu(), 1000)
        setTimeout(danjixiayitianniu(), 1000)
    }
 
}
 
 
 
//检测是否有题，如果有题则返回true ，否则返回false
function shiFouYouTi() {
 
    var question = document.getElementsByClassName('question_player-container question_player')[0];
    if (question === undefined) {
        addTextToLogBox("检测无题")
        return false;
    } else {
        addTextToLogBox("检测有题");
        return true;
    }
 
}
 
 
 
function PlayVideoButton() {
 
    //切换新的视频进行点击我知道了/为空则为undefined
    var button = document.getElementsByClassName('fish-modal-body')[0];
    if(button === undefined){
 
    }else{
        button.getElementsByTagName('button')[0].click();
    }
 
	var video = document.querySelector("video");
    video.play();
	video.autoplay = true;
	
	
	//有些时候，点击按钮没反应。获取到本网页的焦点
	for (var i = 0; i < 10; i++) {
	    var clickButton = document.getElementsByClassName('fish-collapse-header')[i];
	    if (clickButton === undefined) {
	        break;
	    } else {
	        clickButton.click();
	    }
	}
	
 
    //点击播放按钮，为空则为undefined
    addTextToLogBox("点击按钮，如果长时间没反应，请点击一下当前页面");
    document.getElementsByClassName('vjs-big-play-button')[0].click();
	
 
 
    var iknow = document.querySelector(
        "#main-content > div.content > div.index-module_container_4pMtL > div > div > micro-app > micro-app-body > div:nth-child(7) > div > div.fish-modal-wrap > div > div.fish-modal-content > div > div > div.fish-modal-confirm-btns > button"
    );
    if (iknow === null) {
 
    } else {
        iknow.click();
    }
 
 
}
function openNewWindow(url) {
	window.open(url, "_blank");
}
//日志函数
function addTextToLogBox(TextLog) {
 
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
    logBox.style.width = '600px';
    logBox.style.height = '300px';
    logBox.style.backgroundColor = 'black'; // 更改背景颜色为黑色
    logBox.style.color = 'green'; // 更改文本颜色为绿色
    logBox.style.overflow = 'auto';
    logBox.style.padding = '10px';
    logBox.style.fontFamily = 'Arial, sans-serif';
    logBox.style.whiteSpace = 'pre-wrap';
    document.body.appendChild(logBox);
 
}