// ==UserScript==
// @name         2025年暑期教师研修|国家智慧教育公共服务平台|职业教育专用|自动刷视频
// @namespace    自动刷视频 自动答题
// @version      2024.7.27.2106
// @description  课程首页（https://teacher.vocational.smartedu.cn/h/subject/summer2025/）登录即可，全自动操作，会自动播放，自动答题，答题会自动选择第一个（没做题库）。
// @author       武小【bug反馈+V：sw593358287】
// @match        https://core.teacher.vocational.smartedu.cn/p/course/*
// @match        https://teacher.vocational.smartedu.cn/h/subject/summer2025/
// @match        https://teacher.higher.smartedu.cn/h/subject/*
// @icon         https://teacher.vocational.smartedu.cn/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      CC BY-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/543776/2025%E5%B9%B4%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%7C%E8%81%8C%E4%B8%9A%E6%95%99%E8%82%B2%E4%B8%93%E7%94%A8%7C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/543776/2025%E5%B9%B4%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%7C%E8%81%8C%E4%B8%9A%E6%95%99%E8%82%B2%E4%B8%93%E7%94%A8%7C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==


//配置高等教育观看的视频的链接
var heighterLinks = [
	//思想铸魂
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_726987629091446784?itemId=726641870617784320&type=1&segId=726641816054083584&projectId=725191327228612608&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
	//固本强基
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_726987629116612608?itemId=726641973097213952&type=1&segId=726641920563556352&projectId=725191327228612608&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
	//以案促学
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_726987629129195520?itemId=726642071551070208&type=1&segId=726642024438136832&projectId=725191327228612608&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
	//数字素养提升
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742239030662164480?itemId=742246596144865280&type=1&segId=742246596136476672&projectId=725191327228612608&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
	//综合育人能力提升
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742239030691524608?itemId=742246596178419712&type=1&segId=742246596170031104&projectId=725191327228612608&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
	//科学素养提升
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742239030716690432?itemId=742246596228751360&type=1&segId=742246596216168448&projectId=725191327228612608&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
	//培养高校创新性教师队伍
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742239030733467648?itemId=742246596270694400&type=1&segId=742246596258111488&projectId=725191327228612608&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F"
];

//配置职业教育观看的视频的链接
var vocationalLinks=[
	//思想铸魂
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_726988209004306432?itemId=726640775149465600&type=1&segId=726640509203873792&projectId=725189097005613056&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
	//固本强基
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_726988209021083648?itemId=726641217988276224&type=1&segId=726640852905795584&projectId=725189097005613056&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
	//以案促学
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_726988209033666560?itemId=726641262505066496&type=1&segId=726640936993202176&projectId=725189097005613056&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
	//数字素养提升
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742238772369383424?itemId=742245601297899520&type=1&segId=742245601276928000&projectId=725189097005613056&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
	//综合育人能力提升
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742238772390354944?itemId=742245601365008384&type=1&segId=742245601344036864&projectId=725189097005613056&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
	//科学素养提升
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742238772415520768?itemId=742245601427922944&type=1&segId=742245601411145728&projectId=725189097005613056&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
	//匠人
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742238772436492288?itemId=742245601503420416&type=1&segId=742245601486643200&projectId=725189097005613056&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F"
];

//配置职业教育暑假提升观看的视频的链接
var sjvocationalLinks=[
	//2025-7-25
	//大力弘扬教育家精神
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077161279488?itemId=1003783402737631232&segId=1003783189381775360&projectId=1003782210250866688&orgId=571896669159477248&type=1&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F",
	//数字素养提升
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077178056704?itemId=1003783541964902400&segId=1003783492176969728&projectId=1003782210250866688&orgId=571896669159477248&type=1&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F",
	//科学素养提升
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077190639616?itemId=1003783661561286656&segId=1003783607545495552&projectId=1003782210250866688&orgId=571896669159477248&type=1&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F",
	//心理健康教育能力提升
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077203222528?itemId=1003783791077199872&segId=1003783745559068672&projectId=1003782210250866688&orgId=571896669159477248&type=1&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F",
	//“双师”能力提升
	"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077215805440?itemId=1003783955703631872&segId=1003783868238266368&projectId=1003782210250866688&orgId=571896669159477248&type=1&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F"
]


//暑假学时配置
var sjstudyTimes = [10, 13, 2, 7, 13];
//寒假学时配置
var hjstudyTimes = [9,3,3];

(function() {
	'use strict';

	// 获取当前网址
	var currentURL = window.location.href;
	//判断当前网址是否包含指定字符串
	if (currentURL.includes('https://teacher.vocational.smartedu.cn/h/subject/summer2025/')) {
		createLogBox();
		addTextToLogBox("脚本加载成功！");
		addTextToLogBox("有bug请反馈：微信：sw593358287");
		addTextToLogBox('职教脚本更新于2025-07-27');
		addTextToLogBox("开始执行")
        console.log("脚本加载成功！")
		setTimeout(function(){
			//全局数组下标
			let index = 0;
			GM_setValue("下标", index);
			GM_setValue("类别","职业");
			openNewWindow(sjvocationalLinks[index]);
		},5000)

	}

	if(currentURL.includes("https://teacher.higher.smartedu.cn/h/subject/teaching/")){
		createLogBox();
		addTextToLogBox("脚本加载成功！");
		addTextToLogBox("有bug请反馈：微信：sw593358287");
		addTextToLogBox('高教研修脚本更新于2023-08-04');
		addTextToLogBox("开始执行")

		setTimeout(function(){
			//全局数组下标
			let index = 0;
			GM_setValue("下标", index);
			GM_setValue("类别","高校");
			openNewWindow(heighterLinks[index]);
		},5000)

	}


	if(currentURL.includes("https://core.teacher.vocational.smartedu.cn/p/course/vocational")){
		createLogBox();
		setInterval(PagePlayingTimer,5000);
	}




})();


// 在新窗口中打开一个网页
function openNewWindow(url) {
	window.open(url, "_blank");
}

//判断视频播放页面的正在播放的视频是否达到了百分之百
function jugePLayingPagePlayingVideoIsDone(){

    let dangqianshipinbaifenbi = document.getElementsByClassName('video-title clearfix on')[0].getElementsByClassName('four')[0].textContent;
    if(dangqianshipinbaifenbi === '100%'){

        let length  = document.getElementsByClassName('video-title clearfix').length;
        for (var i = 1; i < length; i++) {
            var four = document.getElementsByClassName('video-title clearfix')[i].getElementsByClassName('four')[0];

            if(four.textContent === '100%'){

            }else{
                four.click();
            }
        }

    }

}

function jugePlayingPageIsDoneAndSwepNextPlayPage(){
	var percentHound = 0;
	var lenth = document.getElementsByClassName('four').length;
	var GMindex = GM_getValue("下标");

	//setp01 判断视频播放页面有多少已经到达100%的
	for (var i = 0; i < lenth; i++) {
		var text = document.getElementsByClassName('four')[i].textContent;
		if(text === '100%'){
			console.log("percentHound:"+percentHound);
			percentHound++ ;
		}
	}

	//step02 从油猴脚本中取出对应下标的对应学时
	var studyedtimes = sjstudyTimes[GMindex];

	console.log("studyedtimes:"+studyedtimes);
	GM_setValue("percentHound", percentHound);
	GM_setValue("laststudyedtimes", studyedtimes);
	//stp03进行判断
	if(parseInt(percentHound)>= parseInt(studyedtimes)){
		console.log("判断本页面视频已经播放完毕")
		var GMindex2 = GM_getValue("下标");
		let index = ++GMindex2;
		addTextToLogBox(index);
		GM_setValue("下标", index);
		var leibei =  GM_getValue("类别");
		if(leibei === "高校"){
			window.location.href =  heighterLinks[index];
		}else{
			setTimeout(function(){
				//设置过快跳转，会导致多开警告与提醒，所以延迟0.5s再进行跳转
				window.location.href =  sjvocationalLinks[index];

			},500)

		}

	}else{
		addTextToLogBox("当前任务暂未完成课时，等待继续完成")
	}

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
	logBox.style.width = '200px';
	logBox.style.height = '200px';
	logBox.style.backgroundColor = 'black'; // 更改背景颜色为黑色
	logBox.style.color = 'green'; // 更改文本颜色为绿色
	logBox.style.overflow = 'auto';
	logBox.style.padding = '10px';
	logBox.style.fontFamily = 'Arial, sans-serif';
	logBox.style.whiteSpace = 'pre-wrap';
	document.body.appendChild(logBox);
}


function PagePlayingTimer() {

    jugePLayingPagePlayingVideoIsDone();
	jugePlayingPageIsDoneAndSwepNextPlayPage();
	//检测题目以及做单选题
	var shiFouYouTi = document.querySelector("#modal > div > div > div.question-header > div > h4")
	if (shiFouYouTi == null) {
		console.log("题目检测中。。。检测无题！")
		addTextToLogBox('题目检测中。。。检测无题！');
		document.querySelector("#video-Player > video").play();

		var video = document.querySelector("video");
		if (video === null) {

		} else {
			video.playbackRate = 1.0;
		}

	} else {

		var text = shiFouYouTi.textContent
		if (text == '课堂练习') {
			console.log("检测有题，正在做题")
			addTextToLogBox('检测有题，正在做题');
			var danXuanDuoXuan = document.querySelector(
				"#modal > div > div > div.question-body > div.question-title > span").textContent

			//题型
			if (danXuanDuoXuan == '【单选题】') {
				document.querySelector("#modal > div > div > div.question-body > ul > li:nth-child(1)").click()

				//答完题实现点击
				setTimeout(clickQueDingAnNiu(), 1000)



				setTimeout(clickQueDingAnNiu(), 1000)
			}

			if (danXuanDuoXuan == '【是非题】') {
				document.querySelector("#modal > div > div > div.question-body > ul > li:nth-child(1)").click()

				//答完题实现点击
				setTimeout(clickQueDingAnNiu(), 1000)



				setTimeout(clickQueDingAnNiu(), 1000)
			}
			if (danXuanDuoXuan == '【多选题】') {
				document.querySelector("#modal > div > div > div.question-body > ul > li:nth-child(1)").click()
				document.querySelector("#modal > div > div > div.question-body > ul > li:nth-child(2)").click()
				//答完题实现点击
				setTimeout(clickQueDingAnNiu(), 1000)

				setTimeout(clickQueDingAnNiu(), 1000)

			}

		}
	}


	//点击确定按钮
	for (var i = 0; i <= 50; i++) {
		var querySelectors = "#layui-layer" + i + " div.layui-layer-btn > a"
		var dianjiqueding = document.querySelector(querySelectors)
		if (dianjiqueding == null) {
			console.log("没找到确定按钮的button")
			continue;
		} else {
			//点击确定按钮
			dianjiqueding.click()

			setTimeout(playVideodianjianniu(), 1500)
		}
	}



}


function clickQueDingAnNiu() {
	document.querySelector("#submit").click()
}

function playVideodianjianniu() {
	//播放器点击播放按钮
	document.querySelector("#video-Player > xg-start > div.xgplayer-icon-play").click()
}