// ==UserScript==
// @name         快速创建禅道任务
// @namespace    http://tampermonkey.net/
// @version      2025-09-13-1
// @description  快速创建禅道任务，快点快点
// @author       You
// @match        zentao-dev.tangees.com/*
// @match        zentao.tangees.com/*
// @match        zentao.tgsu.cn/*
// @match        zentao.tungee-internal.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tangees.com
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503039/%E5%BF%AB%E9%80%9F%E5%88%9B%E5%BB%BA%E7%A6%85%E9%81%93%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/503039/%E5%BF%AB%E9%80%9F%E5%88%9B%E5%BB%BA%E7%A6%85%E9%81%93%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(function () {
	'use strict';

	function getQueryParams() {
		var search = new URLSearchParams(window.location.search);
		var params = {};
		search.forEach(function (value, key) {
			params[key] = value;
		});
		return params;
	}

	// 获取当前日期
	const currentDate = new Date();
	const year = currentDate.getFullYear();
	const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
	const day = ('0' + currentDate.getDate()).slice(-2);
	const formattedDate = year + '-' + month + '-' + day;

	const userList = [];
	$('#assignedTo')
		.children()
		.each(function () {
			if ($(this).text()) {
				userList.push({
					name: $(this).text(),
					value: $(this).attr('value'),
				});
			}
		});
	const parentDiv = $(
		'<div style="padding-bottom: 20px; margin-left: 94px"></div>',
	);
	const select = $('<select style="width:100px"></select>');
	userList.map((item) => {
		const option = $(
			`<option data-value="${item.value}">${item.name}</option>`,
		);
		select.append(option);
	});

    const demandSelect = $('<select style="width:100px"></select>');
    const demanList = []
    for(const key in window.stories){
        if(window.stories[key]){
            demanList.push({
                name: window.stories[key],
                value: window.stories[key].split(':')[0]
            })
        }
    }
	demanList.map((item) => {
		const option = $(
			`<option data-value="${item.value}">${item.name}</option>`,
		);
		demandSelect.append(option);
	});

	const textarea = $(
		'<textarea rows="10" style="width: 400px;margin-left: 8px" placeholder="请输入要创建的excel内容"></textarea>',
	);
	const submitBtn = $('<button style="margin-left:8px">提交</button>');
	const remainTaskDiv = $('<span  style="margin-left:8px"></span>');

	submitBtn.on('click', function () {
		const projectID = getQueryParams().projectID || getQueryParams().project;
		const taskValue = textarea.val();
		if (!taskValue) {
			alert('请复制粘贴任务内容');
			return;
		}
		const row = taskValue.split('\n');
		const taskList = row.map((item) => {
			const task = item.split('\t');
			return {
				name: task[0],
				estimate: task[1],
				estStarted: task[2],
				deadline: task[3],
				desc: task[4],
			};
		});
		let taskLength = 0;

		taskList.forEach((item) => {
			const userName = select.find('option:selected').attr('data-value');
			const story = demandSelect.find('option:selected').attr('data-value');
			const formData = new FormData();

			// 添加需要发送的数据
			formData.append('project', projectID);
			formData.append('type', 'devel');
			formData.append('module', '0');
			formData.append('assignedTo[]', userName);
			formData.append('story', story);
			formData.append('status', 'wait');
			formData.append('name', item.name);
			formData.append('pri', '3');
			formData.append('estimate', item.estimate);
			formData.append('desc', item.desc);
			formData.append('estStarted', formattedDate);
			formData.append('deadline', new Date(item.deadline) > new Date() ? item.deadline : formattedDate);
            remainTaskDiv.html(
					`创建中，总任务数：${taskList.length}，待创建任务数：${taskList.length - taskLength}`,
				);
			fetch(
				`${location.origin + location.pathname}?m=task&f=create&project=${projectID}&storyID=0&moduleID=0`,
				{
					method: 'POST',
					body: formData,
				},
			).finally(() => {
				taskLength++;
				remainTaskDiv.html(
					`创建中，总任务数：${taskList.length}，待创建任务数：${taskList.length - taskLength}`,
				);
			});
		});

		const interval = setInterval(() => {
			if (taskLength === taskList.length) {
				clearInterval(interval);
				remainTaskDiv.html(
					`总任务数${taskList.length}个，已全部创建完毕，2s后自动刷新页面。`,
				);
				setTimeout(() => {
					location.reload();
				}, 2000);
			}
		}, 50);
	});

    console.log(demandSelect)
	parentDiv.append(select);
	parentDiv.append(demandSelect);
	parentDiv.append(textarea);
	parentDiv.append(submitBtn);
	parentDiv.append(remainTaskDiv);
	$('#subHeader').append(parentDiv);
	// Your code here...
})();
