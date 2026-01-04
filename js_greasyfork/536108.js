// ==UserScript==
// @name         显示课程余量-复旦大学新本科选课系统
// @namespace    https://xk.fudan.edu.cn/
// @version      1.0
// @description  在「已选课程」中显示课程余量
// @author       Oneton
// @include      *://xk.fudan.edu.cn/course-selection/*
// @icon         https://www.fudan.edu.cn/_upload/tpl/00/0e/14/template14/images/favicon.ico
// @grant        none
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/536108/%E6%98%BE%E7%A4%BA%E8%AF%BE%E7%A8%8B%E4%BD%99%E9%87%8F-%E5%A4%8D%E6%97%A6%E5%A4%A7%E5%AD%A6%E6%96%B0%E6%9C%AC%E7%A7%91%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/536108/%E6%98%BE%E7%A4%BA%E8%AF%BE%E7%A8%8B%E4%BD%99%E9%87%8F-%E5%A4%8D%E6%97%A6%E5%A4%A7%E5%AD%A6%E6%96%B0%E6%9C%AC%E7%A7%91%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==



(function() {
    'use strict';
	var courseList = [];
	var courseRemain = [];

	function getCookieValue(name) {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? match[2] : null;
	}

	function getCourseList(uid, termId) {
		const token = getCookieValue('cs-course-select-student-token');
		if (!token) {
			console.error('未找到授权令牌');
			return Promise.reject('未找到授权令牌');
		}

		const url = `https://xk.fudan.edu.cn/api/v1/student/course-select/selected-lessons/${termId}/${uid}`;

		return fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': token,
				'Content-Type': 'application/json'
			}
		})
		.then(response => {
			if (!response.ok) {
				throw new Error(`请求失败: ${response.status} ${response.statusText}`);
			}
			return response.json();
		})
		.then(data => {
			console.log('获取课程列表成功:', data);
			return data;
		})
		.catch(error => {
			throw error;
		});
	}

	function getCourseRemain(courseList) {
		// 提取课程ID
		const lessonIds = courseList.map(course => course.id).join(',');
		if (!lessonIds) {
			console.error('没有课程ID');
			return Promise.reject('没有课程ID');
		}

		// 构建URL和参数
		const url = `https://xk.fudan.edu.cn/api/v1/student/course-select/std-count?lessonIds=${lessonIds}`;
		const token = getCookieValue('cs-course-select-student-token');

		if (!token) {
			console.error('未找到授权令牌');
			return Promise.reject('未找到授权令牌');
		}

		// 发送请求
		return fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': token,
				'Content-Type': 'application/json'
			}
		})
		.then(response => {
			if (!response.ok) {
				throw new Error(`请求失败: ${response.status} ${response.statusText}`);
			}
			return response.json();
		})
		.then(data => {
			console.log('获取课程余量成功:', data);
			return data;
		})
		.catch(error => {
			console.error('获取课程余量失败:', error);
			throw error;
		});
	}

	function displayCourseRemain(courseList, remainData) {
		if (!courseList || !remainData) {
			console.error('课程列表或余量数据为空');
			return;
		}

		console.log('准备显示课程余量');

		// 等待表格元素加载完成
		function waitForSelectedLessonTable() {
			return new Promise(resolve => {
				function checkTable() {
					// 选择已选课程表格
					const tableHeader = document.querySelector('#pane-selectedLesson .el-table__header-wrapper');
					const tableBody = document.querySelector('#pane-selectedLesson .el-table__body-wrapper');

					if (tableHeader && tableBody && tableBody.querySelectorAll('tbody tr').length > 0) {
						resolve({
							header: tableHeader,
							body: tableBody,
							rows: tableBody.querySelectorAll('tbody tr')
						});
					} else {
						setTimeout(checkTable, 100);
					}
				}
				checkTable();
			});
		}

		waitForSelectedLessonTable().then(({header, body, rows}) => {
			// 1. 修改表头 - 将"是否包含A+成绩"列改为"已选/人数上限"
			const headerRow = header.querySelector('thead tr');
			const headers = headerRow.querySelectorAll('th');

			// 查找"是否包含A+成绩"列的索引
			let targetColumnIndex = -1;
			headers.forEach((th, index) => {
				const cellText = th.textContent.trim();
				if (cellText.includes('是否含A+成绩') || cellText.includes('已选/人数上限') ) {
					targetColumnIndex = index;
					// 修改表头文本
					th.querySelector('.cell').textContent = '已选/人数上限';
				}
			});

			if (targetColumnIndex === -1) {
				console.error('未找到"是否含A+成绩"列');
				return;
			}
			console.log("A+成绩列:", targetColumnIndex);

			// 2. 修改每行的对应单元格
			rows.forEach(row => {
				// 获取课程ID
				const courseCodeDiv = row.querySelector('.lesson-code');
				if (!courseCodeDiv) return;

				// 从课程信息中提取ID
				const courseCode = courseCodeDiv.innerHTML.trim();

				// 获取该行的所有单元格
				const cells = row.querySelectorAll('td');
				if (cells.length <= targetColumnIndex) return;

				// 获取对应的单元格
				const targetCell = cells[targetColumnIndex];
				const cellDiv = targetCell.querySelector('.cell');
				if (!cellDiv) return;

				// 查找对应的余量信息
				const remain = remainData[courseList.find(course => course.code === courseCode).id];
				console.log("Remain", courseCode, remain);
				if (!remain) return;

				const r = parseInt(remain.split('-')[0])
				const limit = courseList.find(course => course.code === courseCode).limitCount
				const percentage = limit > 0 ? (r / limit * 100) : 0;

				cellDiv.innerHTML = `
                <div data-v-15fd4cd3="">${remain}/${limit}</div>
                <div data-v-15fd4cd3="" role="progressbar" aria-valuenow="${percentage}"
                     aria-valuemin="0" aria-valuemax="100" class="el-progress el-progress--line el-progress--without-text">
                    <div class="el-progress-bar">
                        <div class="el-progress-bar__outer" style="height: 6px; background-color: rgb(235, 238, 245);">
                            <div class="el-progress-bar__inner" style="width: ${percentage.toFixed(4)}%; background-color: ${r > limit ? "rgb(255, 107, 107)" : "rgb(6, 86, 139)"};">
                            </div>
                        </div>
                    </div>
                </div>
            `;
			});
		});
	}

	function main(uid, termId) {
		console.log(`处理已选课程`);

		getCourseList(uid, termId)
			.then(data => {
				courseList = data.data;
				getCourseRemain(courseList)
					.then(data => {
						courseRemain = data.data;
						displayCourseRemain(courseList, courseRemain);
					})
					.catch(error => {
						console.error('处理课程数据时出错:', error);
					});
			})
			.catch(error => {
				console.error('处理课程数据时出错:', error);
			});
	}

	function checkPath() {
        const hashPattern = /^#\/course-select\/(\d+)\/turn\/(\d+)\/select$/;
        const match = hashPattern.exec(window.location.hash);
        if (match) {
            return {
                isMatch: true,
                uid: match[1],
                termId: match[2]
            };
        }
        return { isMatch: false };
    }

	function waitSelectedLessonLoaded(uid, termId) {
		console.log(`Script loaded! UID: ${uid}, Term ID: ${termId}`);

		// 添加标志位，避免重复处理
		let isProcessing = false;

		// 等待页面元素加载完成
		function waitForElement(selector) {
			return new Promise(resolve => {
				if (document.querySelector(selector)) {
					return resolve(document.querySelector(selector));
				}

				const observer = new MutationObserver(() => {
					if (document.querySelector(selector)) {
						observer.disconnect();
						resolve(document.querySelector(selector));
					}
				});

				observer.observe(document.body, {
					childList: true,
					subtree: true
				});
			});
		}

		// 监听已选课程标签的点击事件
		waitForElement('#tab-selectedLesson').then(tabElement => {
			// 定义一个防抖函数
			function debounce(func, wait) {
				let timeout;
				return function() {
					const context = this;
					const args = arguments;
					clearTimeout(timeout);
					timeout = setTimeout(() => {
						func.apply(context, args);
					}, wait);
				};
			}

			// 使用防抖处理函数
			const debouncedHandler = debounce(() => {
				if (tabElement.getAttribute('aria-selected') === 'true' && !isProcessing) {
					isProcessing = true;
					main(uid, termId);
					// 设置延时重置状态，允许下次处理
					setTimeout(() => {
						isProcessing = false;
					}, 500);
				}
			}, 100);

			// 如果一开始就是激活状态，也执行一次（防抖）
			debouncedHandler();

			// 监听点击事件
			tabElement.addEventListener('click', debouncedHandler);

			// 监听标签页容器，因为有可能通过其他方式切换标签
			const tabsContainer = tabElement.parentElement;
			if (tabsContainer) {
				tabsContainer.addEventListener('click', debouncedHandler);
			}
		});

	}

    window.addEventListener('load', function() {
		const pathInfo = checkPath();
		if (pathInfo.isMatch) {
			waitSelectedLessonLoaded(pathInfo.uid, pathInfo.termId);
		}
    });
})();

