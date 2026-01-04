// ==UserScript==
// @name         海豚学习
// @namespace    http://tampermonkey.net/
// @match        https://university.cpic.com.cn/*
// @grant        none
// @version      5.4
// @grant        GM_openInTab
// @description  Fetch specific content from a web page and print it to the console.
// @connect      *
// @license MIT
// @author       You
// @downloadURL https://update.greasyfork.org/scripts/472231/%E6%B5%B7%E8%B1%9A%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/472231/%E6%B5%B7%E8%B1%9A%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
 
 
let currentlyPlaying = localStorage.getItem('currentlyPlaying');  // 缓存记录是否在播放。
let currentlyCourse = localStorage.getItem('currentlyCourse');  // 缓存记录当前方面课程。
var foundExam = false; // 定义考试标志
//决策课程是否需要学习
function JudgeVideo(courseTypeElement, progressElement,courseIdElement){
	if (courseTypeElement.textContent.trim() === '课程' && progressElement.textContent.trim() !== '重新学习' && !currentlyPlaying) {
		progressElement.click();
		console.log("条件成立播放视频")
		currentlyPlaying = 'currentlyPlaying';
		currentlyCourse =  courseIdElement
		localStorage.setItem('currentlyPlaying', currentlyPlaying)
		localStorage.setItem('currentlyCourse', currentlyCourse)
	}
}
 
//每隔3分钟刷新一次，重新获取信息，比如课程进度。
function CheckVideo() {
	if (!window.location.href.startsWith('https://university.cpic.com.cn/#/study/subject/detail/')) {
		return;
	}
	var checkExist = setInterval(function() {
		if (foundExam) return; // 检查考试标志，如果为 true 则退出
		let sections = document.querySelectorAll('section[data-current="study/subject/detail/views/content"]');
		if (sections.length) {
			//console.log("Sections 存在!");
			clearInterval(checkExist);
 
			// 获取并打印"专题内容"
			sections.forEach(section => {
				let subjectContentElement = section.querySelector('.h3.strong');
				if (foundExam) return; // 检查考试标志，如果为 true 则退出
				if (subjectContentElement) {
					console.log('已获取到' + subjectContentElement.textContent.trim());
				}
 
				// 获取并打印每一件事
				let listItems = section.querySelectorAll('li');
				listItems.forEach(item => {
					let titleStateElement = item.querySelector('.title-state');
					if (foundExam) return; // 检查考试标志，如果为 true 则退出
					if (titleStateElement) {
						//console.log('已获取到' + titleStateElement.textContent.trim());
 
						// Get and print each course within the item
						let courses = item.querySelectorAll('.item.current-hover');
						courses.forEach(course => {
							// 获取并打印课程信息
							let courseTypeElement = course.querySelector('.section-type');  // 获取课程/考试
							let courseIdElement = course.getAttribute('data-resource-id');   // 获取data-resource-id
							let isRequiredElement = course.querySelector('.m-left.default-skin.is-required');  // 获取必修状态
							let titleElement = course.querySelector('.inline-block.name-des');  // 获取课程名称
							let durationElement = course.querySelector('.sub-text.pull-left');  // 获取课程时间
							let progressElement = course.querySelector('.small.inline-block');  // 获取是否重新学习，继续学习，开始学习
							let completionPercentElement = course.querySelector('.finished-status.m-right');  // modified selector, it is assumed that this selector is used to find the course completion percentage
							let completionStatusElement = course.querySelector('.text-overflow.inline-block.m-left .finished-status:not(.m-right)');  // modified selector, it is assumed that this selector is used to find the course completion status text
							let completionPercent = completionPercentElement ? completionPercentElement.textContent.trim() : '';  //  获取进度
							let completionStatus = completionStatusElement ? completionStatusElement.textContent.trim() : '';  // 获取进度标签
                            if (courseTypeElement.textContent.trim() === '考试' && !currentlyCourse) {
									console.log("考试项目，无需播放！");
									foundExam = true;
									return;
								}
							if (courseTypeElement && isRequiredElement && titleElement && durationElement) {
								JudgeVideo(courseTypeElement, progressElement,courseIdElement);
								if (courseIdElement === currentlyCourse){
									console.log("目前课程: "+ titleElement.textContent.trim() + "  进度: " + completionPercent  + "  状态标签: " + completionStatus)
									if (completionPercent === '100%' && completionStatus === '已完成'){
										localStorage.removeItem('currentlyPlaying')
										localStorage.removeItem('currentlyCourse')
 
									}
									return;
								}
 
							}
						});
					}
				});
			});
		}
	}, 1000); // check every 1000ms
 
	setInterval(function(){
        location.reload()
	},20000)
};

function AutoPlayVideo() {
	// 只在预期的页面上运行此函数
	if (!window.location.href.startsWith('https://university.cpic.com.cn/#/study/course/detail/')) {
		return;
	}

	const video = document.getElementsByTagName('video')[0]
	const body = document.getElementsByTagName('body')[0]
	body.addEventListener('click', function() {
		video.muted = false;
	});
	body.click()
	video.setAttribute('muted','muted')
	video.play()

	// 设置一个延时，然后每秒检查一次视频的播放状态
	setInterval(() => {
		// 找到播放按钮
		let playButton = document.querySelector('.vjs-play-control');

		// 获取进度元素
		let progressElement = document.querySelector('.progress');

		// 找到 "重新播放" 按钮
		let replayButton = document.querySelector('.videojs-referse-btn');

		// 检查元素是否存在
		if (progressElement) {
			// 获取进度值并移除百分号
			let progress = progressElement.textContent.replace('%', '');

			// 检查进度是否达到100%
			if (progress === '100') {
				// 如果进度达到100%，关闭标签页
				window.close();
			}
		}

		// 如果播放按钮存在并且视频未播放，点击重新播放按钮
		if (playButton && playButton.title === '播放' && replayButton) {
			replayButton.click();
			//video.play()

			// 重新获取播放按钮的状态
			playButton = document.querySelector('.vjs-play-control');

			// 如果播放按钮的状态已变为 "暂停"，说明视频已经开始播放
			if (playButton && playButton.title === '暂停') {
				console.log('视频已开始播放');
			}
		}
	}, 20000);
};


//运行
setTimeout(()=>{
	CheckVideo();
	AutoPlayVideo();
},6000)
