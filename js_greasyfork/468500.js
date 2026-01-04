// ==UserScript==
// @name         删除标点
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  截天神器删除标点+繁体字转简体字
// @author       You
// @match        https://tool.jietiandi.net/vertdraw/
// @match        https://jtd.pages.dev/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jietiandi.net
// @grant        none
// @license      GPL-3.0 License
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/t2cn.js
// @downloadURL https://update.greasyfork.org/scripts/468500/%E5%88%A0%E9%99%A4%E6%A0%87%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/468500/%E5%88%A0%E9%99%A4%E6%A0%87%E7%82%B9.meta.js
// ==/UserScript==

setTimeout(() => {
	add_button()
}, 2000);


function add_button() {
	'use strict';
	const converter = OpenCC.Converter({ from: 'hk', to: 'cn' });
	// console.log(converter('漢語')); // output: 汉语

	let Container = document.createElement('div');
	Container.id = "container-id";
	Container.style.position="fixed"
	Container.style.right="0px"
	Container.style.top="0px"
	document.body.appendChild(Container);


	var button1 = document.createElement("button");
	button1.textContent = "点击该按钮，删除标点然后下载压缩包";
	button1.style.display = "block";
	button1.style.fontSize = "2rem";
	button1.style.backgroundColor = "#ffe000"
	button1.title = "删除标点并下载"
	button1.onclick = function () {
		let temp = document.querySelector("body > div.container > textarea").value
		let res = temp.replaceAll("，","").replaceAll("。","").replaceAll("‘","").replaceAll("’","").replaceAll("…","").replaceAll("、","").replaceAll("！","").replaceAll("？","").replaceAll("“","").replaceAll("”","").replaceAll("：","")
		res = converter(res)
		document.querySelector("body > div.container > textarea").value = res
		document.querySelector("body > div.container > div.progress-btn").click()
		return;
	};


	var contain_ = document.querySelector("#container-id")
	contain_.appendChild(button1);
}
