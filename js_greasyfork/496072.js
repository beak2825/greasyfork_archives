// ==UserScript==
// @name         豆瓣短评评分
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  为豆瓣电影页面提供最新影评和热门影评评分
// @author       GreatNXY
// @match        https://movie.douban.com/subject/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496072/%E8%B1%86%E7%93%A3%E7%9F%AD%E8%AF%84%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/496072/%E8%B1%86%E7%93%A3%E7%9F%AD%E8%AF%84%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

function fetchAndCalculateRating(sort = 'time', limit = 200, commentGravity = 5) {
	// 获取当前页面的URL并移除可能存在的参数部分
	const currentUrl = new URL(window.location.href);
	const baseUrl = `${currentUrl.origin}${currentUrl.pathname}`;

	// 推断最新测评的URL
	const commentsUrl = `${baseUrl}comments?sort=${sort}&limit=${limit}`;

	// 发起fetch请求获取最新测评数据
	return fetch(commentsUrl)
	.then(response => response.text())
	.then(data => {
		// 创建一个DOM解析器
		const parser = new DOMParser();
		const doc = parser.parseFromString(data, 'text/html');

		// 找出所有的.comment-item
		const commentItems = doc.querySelectorAll('.comment-item');
		let totalWeight = 0;
		let weightedSum = 0;

		// 评分映射表
		const rateMapping = {
			"10": 0,
			"20": 25,
			"30": 50,
			"40": 75,
			"50": 100
		};

		commentItems.forEach((item, index) => {
			const ratingElement = item.querySelector('.rating');
			if (!ratingElement) {
				console.log('No rating found in comment item:', item);
				return;
			}

			const rateMatch = ratingElement.className.match(/allstar(\d+)/);
			if (!rateMatch) {
				console.log('No rate match found in rating element:', ratingElement);
				return;
			}

			const rate = rateMapping[rateMatch[1]];
			if (rate == null) {
				console.log('No rate found in rate mapping:', rateMatch[1]);
				return;
			}

			const voteElement = item.querySelector('.votes.vote-count');
			if (!voteElement) {
				console.log('No vote element found in comment item:', item);
				return;
			}
			const voteCount = commentGravity + (voteElement ? parseInt(voteElement.textContent.trim(), 10) : 0) * ((commentItems.length - index) / limit / 2 + 0.5);

			// 计算加权总评分
			totalWeight += voteCount;
			weightedSum += rate * voteCount;
		});

		// 计算总体评分（0-100）
		return totalWeight ? (weightedSum / totalWeight) : -1;
	});
}

function parseSteamRating(score) {
	score = Math.round(score);
	if (score === -1) {
		return '暂无评分';
	} else if (score < 10) {
		return '差评如潮';
	} else if (score < 20) {
		return '特别差评';
	} else if (score < 40) {
		return '多半差评';
	} else if (score < 70) {
		return '褒贬不一';
	} else if (score < 80) {
		return '多半好评';
	} else if (score < 90) {
		return '特别好评';
	} else {
		return '好评如潮';
	}
}

function onDOMReady(callback) {
	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		callback();
	} else {
		document.addEventListener('DOMContentLoaded', callback);
	}
}

(function () {
	// 等待页面加载完成
	onDOMReady(function () {
		const ratingRightElement = document.querySelector('.rating_right.not_showed');
		if (ratingRightElement) {
			ratingRightElement.style.marginBottom = '-15px';
		}

		// 查找class为"rating_right not_showed"的元素
		const ratingWrapElement = document.querySelector('.rating_wrap.clearbox');
		// 创建“豆瓣总评”行
		const doubanRow = document.createElement('div');
		const doubanLink = document.createElement('a');
		doubanLink.href = '#';
		doubanLink.innerText = '点此获取';
		doubanLink.style.marginLeft = '10px'; // 添加一些左边距

		doubanRow.innerText = '豆瓣总评：';
		doubanRow.style.lineHeight = '2'; // 设置行高
		doubanRow.style.marginTop = '15px'; // 添加一些上边距
		doubanRow.appendChild(doubanLink);

		// 创建“最新评测”行
		const latestRow = document.createElement('div');
		const latestLink = document.createElement('a');
		latestLink.href = '#';
		latestLink.innerText = '点此获取';
		latestLink.style.marginLeft = '10px'; // 添加一些左边距

		latestRow.innerText = '最新影评：';
		latestRow.style.lineHeight = '2'; // 设置行高
		latestRow.appendChild(latestLink);

		// 创建“最热评测”行
		const hottestRow = document.createElement('div');
		const hottestLink = document.createElement('a');
		hottestLink.href = '#';
		hottestLink.innerText = '点此获取';
		hottestLink.style.marginLeft = '10px'; // 添加一些左边距

		hottestRow.innerText = '热门影评：';
		hottestRow.style.lineHeight = '2'; // 设置行高
		hottestRow.appendChild(hottestLink);

		// 将行添加到元素中
		ratingWrapElement.appendChild(doubanRow);
		ratingWrapElement.appendChild(latestRow);
		ratingWrapElement.appendChild(hottestRow);

		// 添加链接的点击事件
		doubanLink.addEventListener('click', async function (event) {
			event.preventDefault();
			doubanLink.innerText = '';
			try {
				let rating = (parseFloat(document.querySelector('.rating_num').textContent) * 10 - 20) / 0.8;
				if (isNaN(rating)) {
					rating = -1;
				}
				doubanLink.innerText = `${parseSteamRating(rating)} (${Math.round(rating)}%)`;
			} catch (error) {
				doubanLink.innerText = '出错';
			}
		});
		doubanLink.click();

		latestLink.addEventListener('click', async function (event) {
			event.preventDefault();
			latestLink.innerText = '';
			try {
				const rating = await fetchAndCalculateRating("time", 200, 30);
				latestLink.innerText = `${parseSteamRating(rating)} (${Math.round(rating)}%)`;
			} catch (error) {
				latestLink.innerText = '出错';
			}
		});

		hottestLink.addEventListener('click', async function (event) {
			event.preventDefault();
			hottestLink.innerText = '';
			try {
				const rating = await fetchAndCalculateRating("new_score", 200, 5);
				hottestLink.innerText = `${parseSteamRating(rating)} (${Math.round(rating)}%)`;
			} catch (error) {
				hottestLink.innerText = '出错';
			}
		});
	});
})();
