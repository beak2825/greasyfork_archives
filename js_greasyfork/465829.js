// ==UserScript==
// @name         体育直播站增强脚本
// @namespace    http://www.nite07.com/
// @version      0.3
// @description  去广告链接，添加分类
// @author       Nite07
// @match        *://www.sjb.asia/*
// @match        *://*.ayqy.top/*
// @match        *://*.tdping.com/*
// @icon         http://youqiuyin.gy940830.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465829/%E4%BD%93%E8%82%B2%E7%9B%B4%E6%92%AD%E7%AB%99%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/465829/%E4%BD%93%E8%82%B2%E7%9B%B4%E6%92%AD%E7%AB%99%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
	'use strict';
	// 清除首页广告链接
	const liveTitleLTag = document.querySelectorAll('td.livetitle l');
	for (let l of liveTitleLTag) {
		l.remove();
	}
	const liveContentPTag = document.querySelectorAll('td.livecontent p');
	for (let p of liveContentPTag) {
		p.remove();
	}

	// 清除直播页广告按钮
	let adList = ['https://mmhy56.com'];
	for (let ad of adList) {
		let btn = document.querySelector(`a[href*="${ad}"]`);
		if (btn) {
			btn.parentElement.remove();
		}
	}

	// 添加主页分类
	const div = document.createElement('div');
	const body = document.body;
	const live = document.querySelector('.live_ol');
	if (live) {
		div.style.margin = '5px';
		div.innerHTML = '<span>分类：</span>';
		const selector = document.createElement('select');
		div.appendChild(selector);
		let allOption = document.createElement('option');
		allOption.innerText = 'All';
		allOption.value = 'All';
		selector.appendChild(allOption);
		live.parentElement.insertBefore(div, live);
		let categories = new Set();
		const statusElem = document.querySelectorAll('.status');
		for (let s of statusElem) {
			categories.add(s.previousElementSibling.innerText);
		}
		for (let c of categories) {
			const option = document.createElement('option');
			option.innerText = c;
			option.value = c;
			selector.appendChild(option);
		}
		selector.addEventListener('change', (e) => {
			const statusElem = document.querySelectorAll('.status');
			if (e.target.value === 'All') {
				for (let s of statusElem) {
					s.parentElement.style.display = 'table-row';
				}
				return;
			}
			for (let s of statusElem) {
				if (s.previousElementSibling.innerText !== e.target.value) {
					s.parentElement.style.display = 'none';
				} else {
					s.parentElement.style.display = 'table-row';
				}
			}
		});
	}
})();
