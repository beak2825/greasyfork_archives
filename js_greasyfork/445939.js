// ==UserScript==
// @name        广东普法考试自动学习刷课, 可控制速度, 自动切换课程章节, 支持文本与视频
// @namespace   http://tampermonkey.net/
// @match       http://xfks-study.gdsf.gov.cn/study/*
// @grant       none
// @version     1.0
// @author      sdvsdc
// @description 广东普法考试自动学习, 可控制速度, 自动切换课程章节, 支持文本与视频
// @downloadURL https://update.greasyfork.org/scripts/445939/%E5%B9%BF%E4%B8%9C%E6%99%AE%E6%B3%95%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%88%B7%E8%AF%BE%2C%20%E5%8F%AF%E6%8E%A7%E5%88%B6%E9%80%9F%E5%BA%A6%2C%20%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%AF%BE%E7%A8%8B%E7%AB%A0%E8%8A%82%2C%20%E6%94%AF%E6%8C%81%E6%96%87%E6%9C%AC%E4%B8%8E%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/445939/%E5%B9%BF%E4%B8%9C%E6%99%AE%E6%B3%95%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%88%B7%E8%AF%BE%2C%20%E5%8F%AF%E6%8E%A7%E5%88%B6%E9%80%9F%E5%BA%A6%2C%20%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%AF%BE%E7%A8%8B%E7%AB%A0%E8%8A%82%2C%20%E6%94%AF%E6%8C%81%E6%96%87%E6%9C%AC%E4%B8%8E%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

var speed = 3; // 学习页面停留时间 单位秒

function sleep(timeOutMs) {
	return new Promise((resolve) => {
		setTimeout(resolve, timeOutMs);
	});
}

(async function() {

	if (window.location.pathname.search('chapter') > 0) {
    // 学习页面 延迟x秒提交完成请求
		let index = window.location.pathname.lastIndexOf('/');
		if (index > 0) {
			let chapter = window.location.pathname.substring(index + 1);
			if (!isNaN(parseInt(chapter))) {
				await sleep(speed * 1000);
				jQuery.post('/study/learn/' + chapter);
			}
		}
	} else if (window.location.pathname.search('course') > 0) {
    // 单个课程页面 每隔x+3秒打开下个学习页面
		let chapters = document.querySelectorAll('a[href*=course]');
		if (chapters) {
			chapters = Array.from(chapters);
			for (let i = 0; i < chapters.length - 1; ++i) {
				let chapter = chapters[i];
				chapter.target = 'new-page';
				chapter.click();
				await sleep((speed + 3) * 1000);
        if (i==chapters.length-2){
            // 返回平台首页
            window.location.href = 'http://xfks-study.gdsf.gov.cn/study/';
        }
			}
		}
	} else {
    // 平台首页 自动打开下个课程页面
    let courses = document.querySelectorAll('a[href*=course]');
    console.log(courses);
		if (courses) {
			courses = Array.from(courses);
			for (let i = 0; i < courses.length - 1; ++i) {
				let course = courses[i];
        if(course.text=='进入学习'){
				course.click();
        break;
        }
			}
		}
  }

})();