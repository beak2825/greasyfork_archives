// ==UserScript==
// @name         芯位教育自动刷课
// @namespace    https://gitee.com/CreativeNew/
// @version      1.0.2
// @description  芯位教育网课自动跳转到下一节课
// @author       XuTao.
// @match        https://teaching.51xinwei.com/*
// @icon         https://teaching.51xinwei.com/*
// @grant        none
// @run-at document-end
// @license AGPL-3.0 license
// @downloadURL https://update.greasyfork.org/scripts/454971/%E8%8A%AF%E4%BD%8D%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/454971/%E8%8A%AF%E4%BD%8D%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==


(function() {
	'use strict';

	const body = document.querySelector('body');

	let obServer = new MutationObserver(handler);

	const options = {
		childList: true
	}

	obServer.observe(body, options)


})();


function handler(mutationRecordList) {
	for (let i = 0; i < mutationRecordList.length; i++) {
		let addedNodes = mutationRecordList[i].addedNodes
		if (addedNodes) {
			for (let i = 0; i < addedNodes.length; i++) {
				let innerText = addedNodes[i].innerText
				if (innerText && innerText.indexOf('学习下一课节') >= 0) {
					obsClick('.layui-layer.layui-layer-dialog .layui-layer-btn0');
					break;
				}
			}
		}
	}

	obsDocumentPage()
}

function obsDocumentPage() {
	obsText('#page_learn_courseware_document .transcode-file-area.text-center', '该文档类型不支持预览，请点击 这里 下载文档')
		.then((res) => {
			let coursewareMenuItem = document.querySelectorAll('#menu_tarr_content .courseware_menu_item.pull-left.ng-scope')
			if (coursewareMenuItem.length > 2) {
				let activeCoursewareMenuItem = document.querySelector('#menu_tarr_content .courseware_menu_item.pull-left.ng-scope.active')
				let activeCoursewareMenuItemText = activeCoursewareMenuItem.innerText
				for (let i = 0; i < coursewareMenuItem.length; i++) {
					if (activeCoursewareMenuItemText == coursewareMenuItem[i].innerText) {
						let next = i + 1
						coursewareMenuItem[next].click()
						if (coursewareMenuItem.length > next+1) {
							obsDocumentPage()
							return
						}
						break;
					}
				}
			}

			let courseChapterItem = document.querySelectorAll('.course_chapter_item.user-no-select.ng-scope')
			let activeItem = document.querySelector('.course_chapter_item.user-no-select.ng-scope.active')

			let activeItemText = activeItem.innerText
			for (let i = 0; i < courseChapterItem.length; i++) {
				if (activeItemText == courseChapterItem[i].innerText) {
					courseChapterItem[i + 1].children[1].click()
					break;
				}
			}
		})
}

let obsClickTimer = null

function obsClick(selector) {
	return new Promise((resolve, reject) => {
		let startExecutionTime = new Date().getTime()
		if (obsClickTimer) {
			clearInterval(obsClickTimer)
		}
		obsClickTimer = setInterval(() => {
			let target = document.querySelector(selector)
			if (target) {
				clearInterval(obsClickTimer)
				target.click()
				resolve({
					element: selector,
					operation: 'click'
				})
			} else {
				return
			}

			let executionTime = new Date().getTime()
			if (startExecutionTime - executionTime > 1000 * 10) {
				clearInterval(obsClickTimer)
				reject('超时')
			}
		}, 500)
	})
}

function activation() {
	const localStorage = window.localStorage;
	const activationCodeKey = 'xinwei_activation_code';
	let activationCode = localStorage.getItem(activationCodeKey)
	if (!activationCode) {
		const str ='%u8BF7%u8F93%u5165%u6FC0%u6D3B%u7801%uFF08%u6FC0%u6D3B%u7801%u4E24%u5143%u6C38%u4E45%uFF0C%u53EF%u8054%u7CFB%u5FAE%u4FE1%uFF1Awuwang1873%uFF09%uFF1A'
		let code = prompt(unescape(str), '');
		if (window.atob(code).indexOf('xinweijiaoyu') >= 0) {
			localStorage.setItem(activationCodeKey, code)
            alert(unescape('%u6FC0%u6D3B%u6210%u529F'))
		} else {
            alert(unescape('%u6FC0%u6D3B%u5931%u8D25'))
			return false
		}
	}
	return true
}

let obsTextTimer = null

function obsText(selector, text) {
	return new Promise((resolve, reject) => {
		let startExecutionTime = new Date().getTime()
		if (obsTextTimer) {
			clearInterval(obsTextTimer)
		}
		obsTextTimer = setInterval(() => {
			let target = document.querySelector(selector)
			if (target && target.textContent.trim() == text) {
				clearInterval(obsTextTimer)
				resolve(selector)
			} else {
				return
			}

			let executionTime = new Date().getTime()
			if (startExecutionTime - executionTime > 1000 * 10) {
				clearInterval(obsTextTimer)
				reject('超时')
			}
		}, 500)
	})
}
