// ==UserScript==
// @name 超星尔雅/泛雅网课视频辅助
// @namespace https://tampermonkey.net/
// @author WildernessRanger
// @license MIT
// @version 0.5.1
// @description 本脚本用于超星学习通视频快速学习。
// @homepage https://github.com/WRtux
// @match https://mooc1.chaoxing.com/mycourse/studentstudy*
// @match https://mooc1-1.chaoxing.com/mycourse/studentstudy*
// @match https://mooc1-3.chaoxing.com/mycourse/studentstudy*
// @match https://mooc1.chaoxing.com/mooc-ans/mycourse/studentstudy*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/418731/%E8%B6%85%E6%98%9F%E5%B0%94%E9%9B%85%E6%B3%9B%E9%9B%85%E7%BD%91%E8%AF%BE%E8%A7%86%E9%A2%91%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/418731/%E8%B6%85%E6%98%9F%E5%B0%94%E9%9B%85%E6%B3%9B%E9%9B%85%E7%BD%91%E8%AF%BE%E8%A7%86%E9%A2%91%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
"use strict";

var currentElement, studySpeed;

function handleStudy() {
	if (studySpeed == null) {
		let v = Number(prompt("输入播放速度：", "2"));
		if (Number.isNaN(v) || v <= 0)
			return;
		studySpeed = v;
	}

	let doc = document.getElementById("iframe").contentDocument.getElementsByTagName("iframe")[0].contentDocument;
	let vid = doc.getElementsByTagName("video")[0];
	vid.pause = () => { throw "FxxK"; };
	vid.playbackRate = studySpeed;
	window.addEventListener("mouseout", (e) => e.stopImmediatePropagation(), true);
	let hndl = window.setInterval(() => {
		vid.playbackRate = studySpeed;
		var quiz = doc.getElementsByClassName("ans-videoquiz")[0];
		if (quiz != null) {
			var opts = quiz.getElementsByTagName("input");
			for (var i = 0; i < opts.length; i++) if (opts[i].value == "true")
				opts[i].click();
			quiz.getElementsByClassName("ans-videoquiz-submit")[0].click();
		}
	}, 1000);

	vid.addEventListener("ended", (e) => {
		window.clearInterval(hndl);
		window.setTimeout(nextStudy, 1000);
	});
	doc.getElementsByClassName("vjs-big-play-button")[0].click();
}

function nextStudy() {
	let nxt = currentElement.parentElement.nextElementSibling;
	if (nxt != null) {
		nxt.querySelectorAll("[onclick]")[0].click();
		currentElement = nxt.firstElementChild;
		window.setTimeout(handleStudy, 2000);
	} else {
		currentElement = null;
		alert("本章节已学习完成！");
	}
}

window.setTimeout(() => {
	let id = location.search.match(/(?<=(?:\?|&)(?:chapterId=))[^&]*(?=&|$)/)[0];
	currentElement = document.getElementById("cur" + id);
	let btn = document.createElement("button");
	btn.textContent = "快速学习";
	btn.addEventListener("click", (e) => handleStudy());
	document.querySelector(".content> :first-child").appendChild(btn);
	console.log("已加载超星尔雅网课视频辅助。");
}, 1000);
