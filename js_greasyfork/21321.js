// ==UserScript==
// @name		grayBackgroundColor
// @namespace	https://github.com/sakuyaa/gm_scripts
// @author		sakuyaa
// @description	将网页背景色改为护眼灰
// @include		*
// @inject-into	auto
// @version		2024.4.1
// @compatible	firefox 74
// @grant		GM_addStyle
// @note		配合browser.display.background_color;#DCDCDC使用
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/21321/grayBackgroundColor.user.js
// @updateURL https://update.greasyfork.org/scripts/21321/grayBackgroundColor.meta.js
// ==/UserScript==
(function() {
	let grayValue = 225;
	let sleep = time => {
		return new Promise(resolve => setTimeout(resolve, time));
	};
	
	let grayElem = async elem => {   //将元素变灰
		await sleep(0);
		let rgbaValues = window.getComputedStyle(elem)?.getPropertyValue('background-color')?.match(/\d+(\.\d+)?/g);
		if (rgbaValues) {
			let [red, green, blue, alpha] = rgbaValues;
			if (red <= grayValue || green <= grayValue || blue <= grayValue || alpha == 0) {
				return;
			}
			//从225-255压缩到215-225
			elem.style.setProperty('background-color', (alpha ? 'rgba(' : 'rgb(') +
				Math.floor((red - grayValue) / 3 + grayValue - 10) + ', ' +
				Math.floor((green - grayValue) / 3 + grayValue - 10) + ', ' +
				Math.floor((blue - grayValue) / 3 + grayValue - 10) +
				(alpha ? (', ' + alpha + ')') : ')'), 'important');
		}
	}

	let grayBackgroundColor = async () => {
		await sleep(0);
		for (let elem of document.getElementsByTagName('*')) {
			grayElem(elem);
		}
	}

	let fixNotGray = () => {   //去除一些背景为空白图的网站
		switch (window.location.hostname) {
		case 'www.w3school.com.cn':
			GM_addStyle('#wrapper {background: #dcdcdc none !important;}');
			return;
		}
		let herf = window.location.href;
		if (/^https?:\/\/tieba\.baidu\.com\/f.+/i.test(herf)) {
			GM_addStyle('.forum_content {background: #dcdcdc none !important;}');
		}
	}

	grayBackgroundColor();
	let count = 0;
	let intervalId = setInterval(() => {
		for (let elem of document.getElementsByTagName('*')) {
			if (++count > 9) {
				break;   //次数过多也不再循环处理
			}
			let rgbaValues = window.getComputedStyle(elem)?.getPropertyValue('background-color')?.match(/\d+(\.\d+)?/g);
			if (rgbaValues) {
				let [red, green, blue, alpha] = rgbaValues;
				if (red > grayValue && green > grayValue && blue > grayValue && alpha != 0) {
					grayBackgroundColor();
					return;   //存在需要处理的元素，则处理后继续循环
				}
			}
		}
		clearInterval(intervalId);   //没有需要处理的元素，则不再循环处理
	}, 1234);
	
	(new MutationObserver(async mutations => {
		for (let mutation of mutations) {
			for (let elem of mutation.addedNodes) {
				if (elem.nodeType == 1) {   //元素节点
					grayElem(elem);
					for (let childNode of elem.getElementsByTagName('*')) {   //遍历所有子节点
						grayElem(childNode);
					}
				}
			}
		}
	})).observe(document.body, {
		childList: true,
		subtree: true
	});
	fixNotGray();
})();
