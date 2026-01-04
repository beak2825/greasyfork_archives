// ==UserScript==
// @name         豆瓣随机想读列表/Douban Wish List Random Picker
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  随机选择豆瓣想读列表中的一项并弹窗显示，带有固定在右下角的按钮
// @author       AnmoWu
// @match        https://book.douban.com/mine?status=wish
// @match        https://book.douban.com/people/*/wish*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/510632/%E8%B1%86%E7%93%A3%E9%9A%8F%E6%9C%BA%E6%83%B3%E8%AF%BB%E5%88%97%E8%A1%A8Douban%20Wish%20List%20Random%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/510632/%E8%B1%86%E7%93%A3%E9%9A%8F%E6%9C%BA%E6%83%B3%E8%AF%BB%E5%88%97%E8%A1%A8Douban%20Wish%20List%20Random%20Picker.meta.js
// ==/UserScript==

/*改进方向：
1.把弹窗换成模态框，方便进一步自定义
2.把div.pub中的作者分离出来加入输出防止同名书籍弄混
3.悬停展开后如果点击了就延长收缩时间，再增加5秒
4.整体的样式美化
5.兼容想看页面
6.弹窗增加按钮，链接本地的calibre，如果有当前随机到的书籍直接打开或者给出存在提示
7.按钮可以任意拖动，靠近窗口边缘20px就自动靠边
8.适配某些带插件功能的手机端浏览器，匹配移动端豆瓣页面（需要吗？）
*/

(function() {
	'use strict';

	// 创建固定在右下角的按钮
	const button = document.createElement('button');
	button.id = 'randomButton';
	button.style.position = 'fixed';
	button.style.bottom = '20px';
	button.style.right = '20px';
	button.style.width = '23px'; // 初始宽度
	button.style.height = '23px'; // 初始高度
	button.style.borderRadius = '50%'; // 圆形
	button.style.backgroundColor = '#83BF73';
	button.style.color = 'white';
	button.style.border = 'none';
	button.style.cursor = 'pointer';
	button.style.transition = 'width 0.3s, height 0.3s'; // 动画效果
	document.body.appendChild(button);

	// 鼠标悬停事件：展开按钮
	button.addEventListener('mouseenter', () => {
		button.style.width = '100px'; // 展开后的宽度
		button.style.height = '44px'; // 展开后的高度
		button.textContent = '随机一本'; // 展开后的内容
		button.style.borderRadius = '1px'; // 变为矩形

		// 10秒后自动收缩
		setTimeout(() => {
			button.style.width = '23px'; // 收缩后的宽度
			button.style.height = '23px'; // 收缩后的高度
			button.textContent = ''; // 收缩时的内容
			button.style.borderRadius = '50%'; // 变为圆形
		}, 5000); // 5秒
	});

	// 点击事件：触发随机选择
	button.addEventListener('click', () => {
		if (button.textContent === '随机一本') {
			pickRandomItem(); // 触发随机选择函数
		}
	});

	// 获取最后一个分页链接的计数
	function getStartCount() {
		const pagination = document.querySelector('.paginator');
		const links = pagination.querySelectorAll('a'); // 获取所有的分页链接
		const nextLinkIndex = Array.from(links).findIndex(link => link.textContent.includes('后页')); // 找到“下一页”的索引

		let startCount = 0;
		if (nextLinkIndex > 0) {
			const lastPageNum = parseInt(links[nextLinkIndex - 1].textContent.trim()); // 获取倒数第二个链接的文本
			console.log('总页数：', lastPageNum);
			startCount = (lastPageNum - 1) * 15; // 每页15本书
		}

		return startCount;
	}

	// 获取UID
	const uid = (() => {
		const link = document.querySelector('a[data-moreurl-dict]');
		if (link) {
			const data = link.getAttribute('data-moreurl-dict');
			const match = data.match(/"uid":"(\d+)"/);
			return match ? match[1] : null;
		}
		return null;
	})();

	// 获取所有分页的链接
	function getAllPages(startCount) {
		const links = [];
		for (let i = startCount; i >= 0; i -= 15) {
			links.push(
				`https://book.douban.com/people/${uid}/wish?start=${i}&sort=time&rating=all&filter=all&mode=grid`
			);
		}
		return links;
	}


	// 获取书名
	async function getBookTitles(pageUrl) {
		try {
			let response = await fetch(pageUrl);
			if (!response.ok) throw new Error('网络错误');
			let text = await response.text();
			let parser = new DOMParser();
			let doc = parser.parseFromString(text, 'text/html');
			let items = doc.querySelectorAll('ul.interest-list li.subject-item h2 a');
			return Array.from(items).map(item => item.textContent.trim().replace(/\s+/g, ' '));
		} catch (error) {
			console.error('获取书名失败:', error);
			return [];
		}
	}

	// 加载所有书名
	async function loadAllBookTitles() {
		let allTitles = [];
		let startCount = getStartCount();
		let pages = getAllPages(startCount);

		for (let page of pages) {
			let titles = await getBookTitles(page);
			allTitles = allTitles.concat(titles);
			console.log(`加载页面 ${page}，书名数量:`, titles.length); // 打印每页书名数量
		}

		console.log('获取到的书目总数:', allTitles.length); // 打印总数
		//console.log('前三本书的书名:', allTitles.slice(0, 3)); // 打印前三本书名

		return allTitles;
	}

	// 随机选择一项并显示
	async function pickRandomItem() {
		let titles = await loadAllBookTitles();

		if (titles.length === 0) {
			alert('未找到想读的书籍');
			return;
		}

		let randomIndex = Math.floor(Math.random() * titles.length);
		alert('随机选择的书籍名称是：' + titles[randomIndex]);
	}
})();