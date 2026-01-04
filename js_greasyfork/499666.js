// ==UserScript==
// @name         collocates分析
// @namespace    http://tampermonkey.net/
// @version      2024-07-12
// @description  类似coca和antconc的搭配词分析功能，由于没有找到ntlk ngram window_size的JavaScript版替代，所以自己简单写了一个。
// @author       You
// @include      *://*
// @icon         https://www.google.com/s2/favicons?domain=english-corpora.org
// @grant        GM_notification
// @grant    GM_setValue
// @grant    GM_listValues
// @grant    GM_getValue
// @grant    GM_deleteValue
// @license MIT
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @downloadURL https://update.greasyfork.org/scripts/499666/collocates%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/499666/collocates%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

let targetWord = GM_getValue('targetWord')
if (!targetWord) {
	targetWord = "the";
}

function countWordsNearAbout(text) {

	text = text.replace(/[.,!;:'()]/g,""); // 去除标点
	const words = text.split(/\s+/);  // 按照空格分割字符串成单词数组 包括换行
	const wordFrequency = {};

	// 遍历单词数组，查找targetWord并统计其附近5个单词
	for (let i = 0; i < words.length; i++) {
			if (words[i].toLowerCase() === targetWord) {
					// 统计"about"附近前5个和后5个单词
					const start = Math.max(0, i - 5);
					const end = Math.min(words.length, i + 6);
					
					for (let j = start; j < end; j++) {
							if (j !== i) {  // 排除"about"自身
									const word = words[j].toLowerCase();
									if (!wordFrequency[word]) {
											wordFrequency[word] = 0;
									}
									wordFrequency[word]++;
							}
					}
			}
	}

	return wordFrequency;
}

function sortAndFilterWordFrequency(wordFrequency) {
	// 将对象转换为数组，按频率排序并过滤掉频率小于5的单词
	let sortedWords = Object.entries(wordFrequency).sort((a, b) => b[1] - a[1]);
	let filteredWords = sortedWords.filter(([word, count]) => count >= 5);

	// 根据filteredWords的长度决定最终结果
	let finalResult = filteredWords.length < 15 ? sortedWords.slice(0, 15) : filteredWords;

	// 输出结果
	let swalString = "";
	finalResult.forEach(([word, count]) => {
			console.log(`${word}: ${count}`);
			swalString += `${word}: ${count}` + '\n';
	});
	console.log('输出完毕，仅输出频率大于5的')
	swal(swalString);
	navigator.clipboard.writeText(swalString)
}



// 示例文本
const text = "This is an aaa aaa example sentence about something aaa. Let's talk about what we know about JavaScript. How about we learn more about it?  for Garmann's Summer, written and illustrated by Stian Hole and translated from Norwegian by Don Bartlett; Amulet Books This is an aaa aaa example sentence about something aaa. Let's talk about what we know about JavaScript. How about we learn more about it?  for Garmann's Summer, written and illustrated by Stian Hole and translated from Norwegian by Don Bartlett; Amulet Books This is an aaa aaa example sentence about something aaa. Let's talk about what we know about JavaScript. How about we learn more about it?  for Garmann's Summer, written and illustrated by Stian Hole and translated from Norwegian by Don Bartlett; Amulet Books This is an aaa aaa example sentence about something aaa. Let's talk about what we know about JavaScript. How about we learn more about it?  for Garmann's Summer, written and illustrated by Stian Hole and translated from Norwegian by Don Bartlett; Amulet Books";




let keyProcess = (e) => {
	// if (location.href.includes("english-corpora")) { // 直接修改match了，不这样麻烦判断了
	// 	ifWindow = document.getElementsByName("x3")[0].contentWindow;
	// } else{
	// 	ifWindow = window;
	// }
	if (e.altKey && e.keyCode === 80) { // alt和80P
		let selectText = window.getSelection().toString();
		const wordFrequency = countWordsNearAbout(selectText);
		sortAndFilterWordFrequency(wordFrequency);
	}
	if (e.altKey && e.keyCode === 79) { // alt和O
		targetWord = window.getSelection().toString().toLowerCase();
		GM_setValue('targetWord', targetWord);
		GM_notification({
			text: '查找的词：' + targetWord,
			timeout: 2000 // 通知显示时间，单位为毫秒
		});
	}
}

document.addEventListener('keydown', keyProcess)

// // 特殊处理coca iframe
// setInterval(() => {
// 	document.getElementsByName("x3")[0].contentWindow.document.addEventListener('keydown', keyProcess)
// }, 3000);
