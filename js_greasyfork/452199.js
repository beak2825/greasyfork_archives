// ==UserScript==
// @name       BOSS
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  获取BOSS直聘简历信息
// @author       You
// @match       https://www.zhipin.com/web*
// @match       https://zhipin.com/web*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452199/BOSS.user.js
// @updateURL https://update.greasyfork.org/scripts/452199/BOSS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

	var getlist = null;


	var iframe = '';
	var ifr_document = '';
	var geek = '';
	var btn = '';
	var url = 'https://h.kingdom.net.cn';

	if (/recommend/.test(window.location.href)) {
		setTimeout(function(){
			iframe = document.getElementsByTagName('iframe')[0];
			ifr_document = iframe.contentWindow.document;
			var list = ifr_document.querySelectorAll('#recommend-list');
			$(ifr_document).on('click','.recommend-card-list li',function(){
				geek = $(this).find('.card-inner').data('geek')
			})
			getlist = setInterval(recommend,500);
		},2000);
	} else if (/index/.test(window.location.href)) {
		setTimeout(function(){
			// iframe = document.getElementsByTagName('iframe')[0];
			// ifr_document = iframe.contentWindow.document;
			getlist = setInterval(boss,500);
		},1000);
	}

	function recommend(){
		var page = ifr_document.querySelectorAll('#recommendContent .resume-dialog #resume-page .resumeGreet .button-list');
		if (page.length > 0) {
			var textarea = '<textarea id="all"></textarea>';

			btn = '<div data-v-6dc67dde class="button-list" style="margin-top:3px;"><button data-v-6dc67dde type="button" class="btn" id="info">获取</button></div>';

			var resume = ifr_document.querySelectorAll('#recommendContent .resume-dialog');
			$(resume).find('.resume-item-detail').css('paddingTop','210px');
			$(resume).after(textarea);

			$(page).after(btn);
			clearInterval(getlist);
			$(ifr_document.querySelectorAll('.resume-custom-close')).bind('click',function(){
				getlist = setInterval(recommend,500);
			})
			var avatar = '';
			var name = '';
			var active = '';
			var sex = '';
			var age = '';
			var exp = '';
			var grade = '';
			var state = '';
			var profession = '';
			var industry = '';
			var salary = '';
			var describe = '';
			var certificate = [];
			var post = [];
			var jobs = [];
			var edus = [];
			var works = {};

			var items = $(resume).find('#resume-page .resume-item');
			$.each(items,function(c,d){
				var title = $(d).find('.title').text().replace(/\s/g,"");
				if ($(d).hasClass('item-base')) {
					avatar = $(resume).find('#resume-page .item-base .figure img').attr('src');
					name = $(resume).find('#resume-page .item-base .item-right .name .geek-name').text();
					active = $(resume).find('#resume-page .item-base .item-right .name span').text();
					if ($(resume).find('#resume-page .item-base .item-right .name i').hasClass('iboss-icon_women')) {
						sex = 2;
					} else {
						sex = 1;
					}
					age = $(resume).find('#resume-page .item-base .item-right .info-labels .fz-age').next().text();
					exp = $(resume).find('#resume-page .item-base .item-right .info-labels .fz-experience').parent().text().replace(/\s/g,"");
					grade = $(resume).find('#resume-page .item-base .item-right .info-labels .fz-degree').parent().text().replace(/\s/g,"");
					state = $(resume).find('#resume-page .item-base .item-right .info-labels .fz-status').parent().text().replace(/\s/g,"");
					describe = $(resume).find('#resume-page .item-base .item-right .selfDescription').text();
				} else if (title == '期望职位') {
					profession = $(d).find('.info-labels .label-text').eq(0).text();
					industry = $(d).find('.info-labels .label-text').eq(1).text();
					salary = $(d).find('.info-labels .label-text').eq(2).text();
				} else if (title == '岗位经验') {
					var station = $(d).find('.tags span');
					if (station.length > 0) {
						$.each(station,function(k,v){
							post.push($(v).text().replace(/\s/g,""));
						})
					}
				} else if (title == '工作经历') {
					var job_list = $(d).find('.history-list .history-item');
					if (job_list.length > 0) {
						$.each(job_list,function(k,v){
							if ($(v).find('.item-text').length > 1) {
								var content1 = $(v).find('.item-text').eq(0).text();
								var content2 = $(v).find('.item-text').eq(1).find('.text').text();
								var content = content1+'内容：'+content2;
							} else {
								var content = $(v).find('.item-text').find('.text').text();
							}
							var tag = [];
							var tag_list = $(v).find('.item-text .tags span');
							$.each(tag_list,function(a,b){
								tag.push($(b).text().replace(/\s/g,""));
							})
							var temp = {
								'date': $(v).find('.period').text(),
								'name': $(v).find('.name span').first().text(),
								'job': $(v).find('.name span').last().text(),
								'content': content,
								'tag': tag,
							}
							jobs.push(temp);
						})
					}
				} else if (title == '教育经历') {
					var edu_list = $(d).find('.history-list .history-item');
					if (edu_list.length > 0) {
						$.each(edu_list,function(k,v){
							var time = $(v).find('.period').text();
							var school = $(v).find('.name b').first().text();
							var pro = $(v).find('.name b').last().text();
							var type = $(v).find('.name').text().replace(/\s/g,"").replace(school,'').replace(pro,'');
							var temp = {
								'date': time,
								'school': school,
								'pro': pro,
								'type': type,
							}
							edus.push(temp);
						})
					}
				} else if (title == '资格证书') {
					var ul = $(d).find('ul li');
					$.each(ul,function(k,v){
						certificate.push($(v).text());
					})
				} else if (title == '我的作品') {
					var work_img = [];
					var work_text = $(d).find('.pre-content').text();
					var work_img_list = $(d).find('.design-works img');
					if (work_img_list.length > 0) {
						$.each(work_img_list,function(k,v){
							var temp = $(v).attr('src');
							work_img.push(temp);
						})
					}
					works = {
						text: work_text,
						img: work_img
					}
				}
			})
			$(ifr_document.querySelectorAll('#info')).bind('click',function(){
				var param = {
					avatar: avatar,
					name: name,
					active: active,
					sex: sex,
					age: age,
					exp: exp,
					grade: grade,
					state: state,
					describe: describe,
					profession: profession,
					industry: industry,
					salary: salary,
					post: post,
					jobs: jobs,
					edus: edus,
					works: works,
					geek: geek,
					certificate: certificate,
				}
				var res = JSON.stringify(param);
				var all = ifr_document.querySelectorAll('#all');
				$(all).val(res);
				all[0].select(); // 选择对象
				ifr_document.execCommand("Copy");
			})
		}
	}

	function boss(){
		var page = document.querySelectorAll('.resume-container');
		var info = document.querySelectorAll('#info');
		if (page.length > 0 && info.length == 0) {
			var textarea = '<textarea id="all" style="position:absolute;left:-9999px;"></textarea>';

			btn = '<button data-v-6dc67dde type="button" class="btn" id="info" style="padding: 0 16px;margin-left:10px">获取</button>';

			var resume = document.querySelectorAll('.resume-container');
			if ($('#all').length == 0) {
				$('body').after(textarea);
			}

			$('h2.name').after(btn);
			// clearInterval(getlist);

			var avatar = '';
			var name = '';
			var active = '';
			var sex = '';
			var age = '';
			var exp = '';
			var grade = '';
			var state = '';
			var profession = '';
			var industry = '';
			var salary = '';
			var describe = '';
			var certificate = [];
			var post = [];
			var jobs = [];
			var edus = [];
			var works = {};

			var items = $(resume).find('.resume-detail .resume-item');
			$.each(items,function(c,d){
				var title = $(d).find('.title').text().replace(/\s/g,"");
				// console.log(title)
				if ($(d).hasClass('item-base')) {
					console.log(1);
					avatar = $(d).find('.figure img').attr('src');
					name = $(d).find('.item-right .name .geek-name').text();
					active = $(d).find('.item-right .name span').text();
					if ($(d).find('.item-right .name i').hasClass('iboss-icon_women')) {
						sex = 2;
					} else {
						sex = 1;
					}
					age = $(d).find('.item-right .info-labels .fz-age').next().text();
					exp = $(d).find('.item-right .info-labels .fz-experience').parent().text().replace(/\s/g,"");
					grade = $(d).find('.item-right .info-labels .fz-degree').parent().text().replace(/\s/g,"");
					state = $(d).find('.item-right .info-labels .fz-status').parent().text().replace(/\s/g,"");
					describe = $(d).find('.item-right .selfDescription').text();
				} else if (title == '期望职位') {
					profession = $(d).find('.info-labels .label-text').eq(0).text();
					industry = $(d).find('.info-labels .label-text').eq(1).text();
					salary = $(d).find('.info-labels .label-text').eq(2).text();
				} else if (title == '岗位经验') {
					var station = $(d).find('.tags span');
					if (station.length > 0) {
						$.each(station,function(k,v){
							post.push($(v).text().replace(/\s/g,""));
						})
					}
				} else if (title == '工作经历') {
					var job_list = $(d).find('.history-list .history-item');
					if (job_list.length > 0) {
						$.each(job_list,function(k,v){
							if ($(v).find('.item-text').length > 1) {
								var content1 = $(v).find('.item-text').eq(0).text();
								var content2 = $(v).find('.item-text').eq(1).find('.text').text();
								var content = content1+'内容：'+content2;
							} else {
								var content = $(v).find('.item-text').find('.text').text();
							}
							var tag = [];
							var tag_list = $(v).find('.item-text .tags span');
							$.each(tag_list,function(a,b){
								tag.push($(b).text().replace(/\s/g,""));
							})
							var temp = {
								'date': $(v).find('.period').text(),
								'name': $(v).find('.name span').first().text(),
								'job': $(v).find('.name span').last().text(),
								'content': content,
								'tag': tag,
							}
							jobs.push(temp);
						})
					}
				} else if (title == '教育经历') {
					var edu_list = $(d).find('.history-list .history-item');
					if (edu_list.length > 0) {
						$.each(edu_list,function(k,v){
							var time = $(v).find('.period').text();
							var school = $(v).find('.name b').first().text();
							var pro = $(v).find('.name b').last().text();
							var type = $(v).find('.name').text().replace(/\s/g,"").replace(school,'').replace(pro,'');
							var temp = {
								'date': time,
								'school': school,
								'pro': pro,
								'type': type,
							}
							edus.push(temp);
						})
					}
				} else if (title == '资格证书') {
					var ul = $(d).find('ul li');
					$.each(ul,function(k,v){
						certificate.push($(v).text());
					})
				} else if (title == '我的作品') {
					var work_img = [];
					var work_text = $(d).find('.pre-content').text();
					var work_img_list = $(d).find('.design-works img');
					if (work_img_list.length > 0) {
						$.each(work_img_list,function(k,v){
							var temp = $(v).attr('src');
							work_img.push(temp);
						})
					}
					works = {
						text: work_text,
						img: work_img
					}
				}
			})
			$(document.querySelectorAll('#info')).bind('click',function(){
				var param = {
					avatar: avatar,
					name: name,
					active: active,
					sex: sex,
					age: age,
					exp: exp,
					grade: grade,
					state: state,
					describe: describe,
					profession: profession,
					industry: industry,
					salary: salary,
					post: post,
					jobs: jobs,
					edus: edus,
					works: works,
					geek: geek,
					certificate: certificate,
				}
				console.log(param)
				var res = JSON.stringify(param);
				var all = document.querySelectorAll('#all');
				$(all).val(res);
				all[0].select(); // 选择对象
				document.execCommand("Copy");
			})
		}
	}
})();