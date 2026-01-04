// ==UserScript==
// @name         知乎评论展开
// @namespace    http://tampermonkey.net/
// @version      2024-05-032
// @description  滚动到底部若干次，然后模拟点击展开所有评论，供singlefile保存用
// @author       You
// @match        https://www.zhihu.com/question/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/494012/%E7%9F%A5%E4%B9%8E%E8%AF%84%E8%AE%BA%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/494012/%E7%9F%A5%E4%B9%8E%E8%AF%84%E8%AE%BA%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

// setInterval(() => {
// 	// window.scrollTo(0, document.documentElement.scrollHeight - window.innerHeight);
// 	window.scrollTo(0, document.documentElement.scrollHeight);
// 	window.scrollBy(0,-100);
// }, 5000);

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

let count = 0; // 计数器，用于记录执行次数

const intervalId = setInterval(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    window.scrollBy(0,-100);
    count++; // 每次执行计数器加 1

    // 如果执行次数达到 10 次，则停止定时器
    if (count === 10) {
        clearInterval(intervalId); // 清除定时器
    }
}, 1000);


setTimeout(async () => {
	let nodelist = document.querySelectorAll("div.ContentItem-actions > button:nth-child(2)");
	nodelist.forEach(element => {
		element.click()
	});
	await sleep(3000)
	document.querySelector("div.css-1aq8hf9 > button").click()
}, 11000);