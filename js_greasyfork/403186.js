 // ==UserScript==
// @namespace    https://www.eeo.cn
// @name         USTC eeo 机构界面增加直播链接
// @description  巡课界面增加直达直播地址的链接
// @version      0.1
// @license      MIT
// @icon         https://www.eeo.cn/favicon.ico
// @author       old9@ustc
// @match        *://www.eeo.cn/saas/school/index.html
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/403186/USTC%20eeo%20%E6%9C%BA%E6%9E%84%E7%95%8C%E9%9D%A2%E5%A2%9E%E5%8A%A0%E7%9B%B4%E6%92%AD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/403186/USTC%20eeo%20%E6%9C%BA%E6%9E%84%E7%95%8C%E9%9D%A2%E5%A2%9E%E5%8A%A0%E7%9B%B4%E6%92%AD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
GM_addStyle(`
	.lessonlist_image_content>.el-col .lesson_content .lessonlist_Info .lesson_info .lesson_name {
	 cursor: pointer;
	}
`);
(function() {
	'use strict';
	var binded = false;
	var clickhandle = function(e) {
		try {
			let $lessonName = $(this);
			let $container = $('.lessonlist_image');
			let index = $container.find('.lesson_name').index(this);
			let key = $container.get(0).__vue__._props.lessonList[index].lessonKey;
			let isInteractive = $lessonName.text().indexOf('✱') > 0
			let $enterClassBtn = $lessonName.parents('.lessonlist_Info').find('.enterClassBtn');
			if (isInteractive){
				$enterClassBtn.click();
			} else {
				window.open('https://www.eeo.cn/live.php?lessonKey='+key);
			}
		} catch(e){
		}
	}
	var setup = function(){
		if (!binded) {
			$(document).on('click','.lesson_name',clickhandle);
			binded = true;
		}
	}
	var cleanup = function(){
		$(document).off('click',clickhandle);
		binded = false;
	}
	var checkHash = function() {
		location.hash === '#/fullPage/LessonMonitor' ? setup() : cleanup();
	}
	checkHash();
	window.addEventListener('hashchange', checkHash, false);
})();