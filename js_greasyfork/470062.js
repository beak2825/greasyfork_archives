// ==UserScript==
// @name         SingleFile-Archives检查是否保存
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  检查当前页面/当前网页，是否保存在了github的SingleFile-Archives中，避免重复保存，需要自己配置几个变量
// @author       You
// @include      *://*.cnblogs.com/*
// @include      *://*.zhihu.com/*
// @grant        GM_addElement
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/470062/SingleFile-Archives%E6%A3%80%E6%9F%A5%E6%98%AF%E5%90%A6%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/470062/SingleFile-Archives%E6%A3%80%E6%9F%A5%E6%98%AF%E5%90%A6%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==
function add_container() {
	let Container = document.createElement('div');
	Container.id = "container";
	Container.style.position = "fixed";
	Container.style.right = "150px";
	Container.style.top = "300px";
	document.body.appendChild(Container);
}

function add_button(count) {
	'use strict';
	add_container();

	var button1 = document.createElement("button");
	button1.textContent = "是否保存："+count;
	button1.style.display = "block";
	button1.style.fontSize = "1rem";
	button1.title = ""

	button1.onclick = function () {
		
		return;
	};

	///////////

	var contain_ = document.querySelector("#container")
	contain_.appendChild(button1);
}

(async () => {
	const { Octokit, App } = await import("https://esm.sh/octokit");
	debugger
	const octokit = new Octokit({ auth: `需要自己配置，以访问自己的私有仓库` });
	var res = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
		owner: '用户名',
		repo: 'SingleFile-Archives',
		path: '',
		headers: {
		  'X-GitHub-Api-Version': '2022-11-28'
		}
	})

	var count = 0
	for (const vvv of res.data) {
		// console.log(v);
		if (vvv.name.indexOf(document.title) != -1) {
			count++
		}
	}
	add_button(count)

  })();

//csp