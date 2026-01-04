// ==UserScript==
// @name         duerox hacking
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  add deploy button
// @author       nathan
// @match        https://duerox.dustess.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dustess.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456877/duerox%20hacking.user.js
// @updateURL https://update.greasyfork.org/scripts/456877/duerox%20hacking.meta.js
// ==/UserScript==

(function () {
	'use strict';
	function getElementsByXPath(xpath, parent) {
		let results = [];
		let query = document.evaluate(xpath, parent || document,
			null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for (let i = 0, length = query.snapshotLength; i < length; ++i) {
			results.push(query.snapshotItem(i));
		}
		return results;
	}
	var fun = function () {
		// 获取服务名
		var apps = getElementsByXPath('//div[contains(@class, "appItemWrapper")]/div[contains(@class, "app_content")]/div[contains(@class, "app_content_name")]', document);
		var env = ""
		var env1 = getElementsByXPath('//span[contains(text(), "部署环境")]', document)[0].parentElement.children[1].innerText;
		if (env1.startsWith("test")) {
			env = env1 + ":test"
		} else {
			return
		}
		var urlParams = new URLSearchParams(window.location.search);
		var project_id = urlParams.get('projectId');
		console.log(`found ${apps.length} apps. env: ${env}, project_id: ${project_id}`);
		for (let i = 0; i < apps.length; i++) {
			let app = getElementsByXPath('//div[contains(@class, "appItemWrapper")]/div[contains(@class, "app_content")]/div[contains(@class, "app_content_name")]', document)[i];
			let appname = app.innerText;
			let fuck = document.createElement("button");
			app.appendChild(fuck);
			fuck.innerText = "ff";
			fuck.onclick = function () {
				const req = new XMLHttpRequest();
				req.open("POST", "https://duerox.dustess.com/duerox-workbench-api/deploy/app");
				req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				req.setRequestHeader("Authorization", localStorage.getItem("duerox_token"));
				req.send(JSON.stringify({ "app_name": appname, "env": env, "project_id": project_id, "force_check": false }));
				alert("ok");
				getElementsByXPath('//div[contains(@class, "appItemWrapper")]/div[contains(@class, "app_top")]/button')[i].click();
			};
		}
	};
	var interval_fun = setInterval(function () {
		var env1 = getElementsByXPath('//span[contains(text(), "部署环境")]', document)[0].parentElement.children[1].innerText;
		if (env1.startsWith("test") && getElementsByXPath('//div[contains(@class, "appItemWrapper")]/div[contains(@class, "app_content")]/div[contains(@class, "app_content_name")]', document).length > 0) {
			fun();
			clearInterval(interval_fun);
		}
	}, 1000)
})();