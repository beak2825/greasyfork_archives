// ==UserScript==
// @name         原神自动答题
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  派蒙的十万个为什么自动答题，修复了一些因chrome更新造成的bug
// @author       0xCaner
// @match        https://webstatic.mihoyo.com/ys/event/answer-question/index.html*
// @icon         https://ys.mihoyo.com/main/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      81.68.147.136
// @downloadURL https://update.greasyfork.org/scripts/435797/%E5%8E%9F%E7%A5%9E%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/435797/%E5%8E%9F%E7%A5%9E%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
var question;
var main;
var waitansw;

(function() {
	main = window.setInterval(a, 1000);
})();

function wait(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function a() {
	let a = document.querySelectorAll(".components-game-assets-qa-info___text--2hLUr");
	if (question != a[0].innerText) {
		question = a[0].innerText;
		GM_xmlhttpRequest({
				url: "http://81.68.147.136/question.php?q=" + a[0].innerText,
				method: "GET",
				headers: {
					"Content-type": "application/x-www-form-urlencoded"
				},
				onload: function(xhr) {
					let answer = xhr.responseText;
					console.log(answer);
					if (typeof(answer) != "undefined" && answer != "") {
						for (let i = 1; i < a.length; i++) {
							if (a[i].innerText.slice(3) == answer) {
								a[i].click();
								break
							}
						}
						wait(800).then();
					} else {
						waitansw = window.setInterval(waitforanswer, 300);
					}
			}
		});
}

}

function waitforanswer() {
	let a = document.querySelectorAll(".components-game-assets-qa-info___badge--1hjMn");
	for (let i = 0; i < a.length; i++) {
		console.log(a[i].innerHTML);
		if (a[i].innerHTML.indexOf("webstatic.mihoyo.com") != -1) {
			let answer = a[i].parentElement.innerText.slice(3);
			GM_xmlhttpRequest({
				url: "http://81.68.147.136/question.php",
				method: "POST",
				headers: {
					"Content-type": "application/x-www-form-urlencoded"
				},
				data: "q=" + question + "&a=" + answer
			});
			window.clearInterval(waitansw);
		}
	}
}
