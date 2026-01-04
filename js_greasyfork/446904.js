// ==UserScript==
// @name         1688 查排名
// @namespace    https://s.1688.com/
// @version	1.0.6
// @description	 1688 查排名,,,,
// @author       Leo
// @homepage
// @match        https://s.1688.com/*
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant			   GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/446904/1688%20%E6%9F%A5%E6%8E%92%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/446904/1688%20%E6%9F%A5%E6%8E%92%E5%90%8D.meta.js
// ==/UserScript==
/*jshint multistr:true */

let isSearching = false;

(function () {
	'use strict';
	/*
	* 1688 查关键词排名
	*  在页面生成两个 input 框,一个关键词，一个店铺名称
	*  在页面生成一个 button
	*  生成一个 停止按钮
	*  button 点击时，查询关键词排名，查找是否有店铺名，没有找到则下一页(找到下一页按钮，并点击)
	*  如果找到了，则 alert 排名
	* */

	// 创建一个 input 框
	const Box = document.createElement('div');
	Box.style.cssText = 'position: fixed; bottom: 0; left: 0; width: 100%; height: 20%; background: rgba(0,0,0,0.5); z-index: 9999;display: flex;justify-content: center;align-items: center;';
	const Input2 = document.createElement('input');
	Input2.style.cssText = 'width: 300px; height: 30px; border: 1px solid #ccc; border-radius: 5px; margin: 10px;';
	Input2.placeholder = '请输入店铺名称';

	// 从本地获取上次的店铺名称
	Input2.value = GM_getValue('company') || '';

	// 将 input2 数据保存到本地
	Input2.onchange = (e)=>{
		GM_setValue('company', e.target.value);
	}

	Box.appendChild(Input2);
	const startButton = document.createElement('button');
	startButton.style.cssText = 'width: 100px; height: 30px; border: 1px solid #ccc; border-radius: 5px; margin: 10px;';
	startButton.innerText = '查询';
	Box.appendChild(startButton);
	document.body.appendChild(Box);
	// 添加事件
	// 加一个收起展开按钮
	const expandButton = document.createElement('button');
	expandButton.style.cssText = 'width: 100px; height: 30px; border: 1px solid #ccc; border-radius: 5px; margin: 10px;';
	expandButton.innerText = '收起';
	Box.appendChild(expandButton);
	expandButton.onclick = () => {
		Box.style.display = 'none'
	}

	startButton.onclick = () => {
		// 获取 input 的值
		const company = Input2.value;
		// 判断是否为空
		if (!company) return alert('请输入店铺名称');
		// 判断是否已经开始
		if (isSearching) {
			isSearching = false;
			startButton.innerText = '查询';
			return alert('已停止');
		}
		isSearching = true;
		// 开始查询
		startButton.innerText = '停止';

		search(company);
	}


})();

const toBottom = ()=>new Promise(resolve => {
	setTimeout(() => {
		if (!isSearching) return resolve();
		window.scrollTo(0, window.scrollY + 500);
		resolve();
	}, 100)
})

const sleep = (ms)=>new Promise(resolve => {
	if (!isSearching) return resolve();
	setTimeout(() => {
		resolve();
	}, ms)
})
 
// 查询函数
async function search( company) {
	// 通过给页面中添加 style 标签，强行使图片不加载
	GM_addStyle(`
		img {
			display: none !important;
		}
		* {
			background-image: none !important;
		}
	`)

	// 直接将页面缩放到最小，保证查询完整性
	window.devicePixelRatio = 0.25
	
	console.log('开始查询');
	console.log( company);
	for (let i = 0; i < 10; i++) {
		if (!isSearching) return;
		await toBottom();
	}
	await sleep(500);
	for (let i = 0; i < 10; i++) {
		if (!isSearching) return;
		await toBottom();
	}
	await sleep(500);

	console.log('滚动到底部');

	const shopList = document.querySelectorAll('#sm-offer-list > div > div > div.mojar-element-company > div.company-name > a > div');
	// 遍历检查 shopList 是否包含 company
	for (let i = 0; i < shopList.length; i++) {
		if (shopList[i].innerText.includes(company)) {
			// 通过 url 的 beginPage 参数 获取页码
			const page = window.location.href.match(/beginPage=(\d+)/)?.[1] || 1;
			alert(
				`店铺名称: ${company}, 页码: ${page}, 排名: ${i + 1}`
			)
			// 将当前这个等于的店铺名称的的字的间隔加上 - ，方便用户跳过此栏继续搜索
			let str = ''
			for (let j = 0; j < company.length; j++) {
				str += company[i] + '-'
			}
			shopList[i].innerHTML = shopList[i].innerHTML.replace(company, `<span style="color: red;">${str}</span>`);
			return;
		}
	}

	if (!isSearching) return;
	// 没有找到店铺，继续查询
	// 点击下一页
	const nextPage = document.querySelector('#app > div > div.space-common-pagination > div > div > span > a.fui-next')
	if (nextPage) {
		nextPage.click();
	}
	// 继续查询
	search(company);
}
