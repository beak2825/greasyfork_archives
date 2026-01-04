// ==UserScript==
// @name        网易CC复读弹幕禁止
// @namespace   https://github.com/AliubYiero/TemperScripts
// @version     1.0.0
// @description	移除网易CC复读弹幕
// @author      Yiero
// @match	https://cc.163.com/*
// @icon        https://cc.163.com/favicon.ico
// @license     GPL
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/466440/%E7%BD%91%E6%98%93CC%E5%A4%8D%E8%AF%BB%E5%BC%B9%E5%B9%95%E7%A6%81%E6%AD%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/466440/%E7%BD%91%E6%98%93CC%E5%A4%8D%E8%AF%BB%E5%BC%B9%E5%B9%95%E7%A6%81%E6%AD%A2.meta.js
// ==/UserScript==

/* 用户配置：弹幕白名单 */
// 添加新白名单，一对英文引号中间加白名单弹幕，引号后面加英文逗号
const danmuBlackList = [
	'？',
	'?',
	'草',
	'笑了',
]

function sleep(delay=1) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, delay * 1000);
	})
}

window.onload = async () => {
	const liveAddress = location.pathname.split('/')[1];
	// 其他非直播间页面
	if (isNaN(liveAddress)) {	// 其它界面
		return;
	}
	
	await sleep();
	removeRepeatDanmu();
}

class RecordDanmu {
	constructor() {
		this.danmuList = [];
		this.expectDanmu = danmuBlackList;
		this.maxRecord = 50;
		this.counter = 0;
	}
	
	addCounter() {
		if (this.counter >= this.maxRecord) {
			this.counter = 0;
		} else {
			this.counter++;
		}
	}
	
	add(text) {
		this.danmuList[this.counter] = text;
		this.addCounter();
	}
	
	isRepeat(text) {
		// 拦截白名单
		if (this.expectDanmu.includes(text)) {
			return;
		}
		return this.danmuList.includes(text);
	}
}

function removerObserver(observeNode, danmuType) {
	const recordDanmu = new RecordDanmu();
	
	const danmuList = observeNode;		// 右侧文本弹幕栏
	const danmuObserver = new MutationObserver(
		e => {
			e.forEach(record => {
				const Node = record.addedNodes[0];
				if (!Node) {
					return;
				}
				
				let fullDanmu = Node.innerText;
				let danmu;
				if (danmuType === 'float') {
					danmu = fullDanmu;
				} else {
					danmu = fullDanmu.slice(fullDanmu.indexOf('：') + 1);
				}
				
				if (recordDanmu.isRepeat(danmu)) {
					// 删除复读弹幕
					// console.log('删除复读弹幕\t' + danmu);
					Node.style.display = 'none';
					return;
				}
				recordDanmu.add(danmu);
			})
		}
	);
	danmuObserver.observe(danmuList, {
		childList: true,
	});
}
function removeRepeatDanmu() {
	removerObserver(document.querySelector('#js-chat-list-ul'), 'text');
	removerObserver(document.querySelector('.comment-canvas'), 'float');
}
