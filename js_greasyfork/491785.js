// ==UserScript==
// @name         保存fetch和xhr
// @namespace    http://tampermonkey.net/
// @version      2024-04-08
// @description  自动保存/备份 fetch/xhr/ajax请求响应的脚本，导出为json文件，可以用于多种用途，比如说自动保存浏览过的b站视频评论、收藏夹、知乎回答、知乎评论、知乎收藏、小红书评论、百度网盘文件列表等等。初始目的为弥补https://archive.org/无法保存动态加载的网页的问题。而且f12 network export har无法仅保存某些请求，且步骤比较繁琐，无法自动。
// @author       You
// @match        https://www.zhihu.com/collection/*
// @match        https://www.zhihu.com/people/*
// @match        https://*.bilibili.com/*
// @match        https://cloud.heytap.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @require https://update.greasyfork.org/scripts/472943/1320613/Itsnotlupus%27%20MiddleMan.js
// @run-at document-start
// @grant    GM_setValue
// @grant    GM_listValues
// @grant    GM_getValue
// @grant    GM_deleteValue
// @grant    GM_notification
// @license      LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/491785/%E4%BF%9D%E5%AD%98fetch%E5%92%8Cxhr.user.js
// @updateURL https://update.greasyfork.org/scripts/491785/%E4%BF%9D%E5%AD%98fetch%E5%92%8Cxhr.meta.js
// ==/UserScript==



newFunction("https://www.zhihu.com/api/v4/*");
newFunction("https://api.bilibili.com/x/v3/*");
newFunction("https://api.bilibili.com/x/space/wbi/arc/search*");
newFunction("https://ck-rest-cn.heytap.com/albumpc/v3/albumDetail");
newFunction("https://api.bilibili.com/x/v2/reply/wbi/*");



function newFunction(hookUrl) {
	middleMan.addHook(hookUrl, {
		async responseHandler(request, response, error) {
			// console.log("snooped on response:",request, response, error);
			// console.log(await response?.json())
			// let jsonString = JSON.stringify(await response?.json());
			let jsonString = await response.json(); // 可以是对象不转换为字符串


			// gpt，使用GM_setValue将response.url作为key把json存储起来
			if (jsonString && response.url) {
				GM_setValue(response.url, jsonString);
			}
		}
	});
}

// gpt，使用GM_listValues和GM_getValue函数，获取所有保存的键值对为一个对象
// 获取所有保存的键值对并组成一个对象
function savedJson() {
	let savedData = {};
	let keys = GM_listValues();
	keys.forEach(key => {
		let value = GM_getValue(key);
		savedData[key] = value;
	});
	// 将savedData对象下载为一个json文件
	downloadFunc(savedData)
}

function downloadFunc(params) {
	// 创建一个 JSON 字符串
	let jsonData = JSON.stringify(params);
	// 创建一个新的 Blob 对象
	let blob = new Blob([jsonData], {
		type: 'application/json'
	});
	// 创建一个临时 URL，用于下载 JSON 文件
	let url = URL.createObjectURL(blob);
	// 创建一个隐藏的链接
	let a = document.createElement('a');
	a.style.display = 'none';
	a.href = url;

	let currentDate = new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace(/[-T:/]/g, ''); // 获取当前日期和时间
	a.download = 'savedResponse_' + currentDate + '.json'; // 文件名包含当前日期和时间 // gpt，'savedResponse这里加上当前的日期和时间.json'


	document.body.appendChild(a);

	a.onclick = (e) => {
		e.stopPropagation();
	}
	// 触发点击事件来下载文件
	a.click();
	// 释放 URL 对象
	URL.revokeObjectURL(url);
}


// clearSavedData 函数用于执行清空操作
function clearSavedData() {
	// 获取所有保存的键值对
	let keys = GM_listValues();

	// 遍历所有键并删除对应的值
	keys.forEach(key => {
		GM_deleteValue(key);
	});

	// 提示用户清空完成（可选）
	// alert('保存的响应数据已清空');
	GM_notification({
		title: '数据已清空',
		text: '保存的数据已清空',
		timeout: 3000 // 通知显示时间，单位为毫秒
	});
}

let top = 0
// gpt，在页面右上方添加一个按钮，点击这个按钮，调用savedJson函数
function addButton(textContent, listener) {
	// 创建一个按钮
	let button = document.createElement('button');

	button.textContent = textContent;
	button.style.position = 'fixed';
	button.style.top = top + 50 + 'px';
	top += 50;
	button.style.right = '10px';
	button.style.zIndex = '9999';

	// 添加点击事件
	button.addEventListener('click', listener);

	// 添加鼠标悬停和离开事件处理
	button.addEventListener('mouseenter', function () {
		button.style.backgroundColor = '#ddd'; // 鼠标悬停时的颜色
	});

	button.addEventListener('mouseleave', function () {
		button.style.backgroundColor = ''; // 鼠标离开时恢复原色
	});

	// 将按钮添加到页面
	document.body.appendChild(button);

	// gpt，给这个按钮添加鼠标悬停变色的效果
}


// setTimeout(addButton('下载保存的所有请求数据', savedJson), 3000);
setTimeout(() => addButton('下载保存的所有请求数据', savedJson), 3000);
setTimeout(() => addButton('清空', clearSavedData), 3000);

console.log(123);