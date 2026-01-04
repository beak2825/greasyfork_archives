// ==UserScript==
// @name         洛谷比赛公告更新检测
// @namespace    https://greasyfork.org/zh-CN/users/1223216-znpdco
// @version      0.0.2
// @description  自动检测比赛的公告是否被更新，优化比赛体验
// @author       ZnPdCo
// @match        https://www.luogu.com.cn/*
// @icon         https://www.luogu.com.cn/favicon.ico
// @require      https://unpkg.com/jquery@3.4.1/dist/jquery.js
// @connect      cdn.bootcdn.net
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503847/%E6%B4%9B%E8%B0%B7%E6%AF%94%E8%B5%9B%E5%85%AC%E5%91%8A%E6%9B%B4%E6%96%B0%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/503847/%E6%B4%9B%E8%B0%B7%E6%AF%94%E8%B5%9B%E5%85%AC%E5%91%8A%E6%9B%B4%E6%96%B0%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function () {
	'use strict';
	async function xmlRequest(url, method, data) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				url: url,
				method: method,
				data: data,
				onload(f) {
					resolve(f);
				},
				onerror(e) {
					reject(e);
				}
			})
		});
	}

	async function getPid() {
		const url = location.pathname;
		if (url.startsWith('/contest/') && !url.startsWith('/contest/list')) {
			return parseInt(url.split('/').slice(-1)[0]);
		} else {
			const paramsStr = window.location.search
			const params = new URLSearchParams(paramsStr)
			if (params.has('contestId')) {
				return parseInt(params.get('contestId'));
			}
		}
		return -1;
	}

	async function checkUpdate() {
		const pid = await getPid();
		if (pid != -1) {
			const contest = await xmlRequest(`https://www.luogu.com.cn/contest/${pid}?_contentOnly`, "GET", {});
			const description = $.parseJSON(contest.responseText)['currentData']['contest']['description'];
			const storage_name = `contest_${pid}_description`;
			if (localStorage.getItem(storage_name) != null && localStorage.getItem(storage_name) != description) {
				$('head').append(`<script>
Swal.fire({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
	toast.onmouseenter = Swal.stopTimer;
	toast.onmouseleave = Swal.resumeTimer;
  },
  icon: "info",
  title: "比赛公告已被更新",
  footer: '<a href="https://www.luogu.com.cn/contest/${pid}">查看</a>'
});
                </script>`)
			}
			localStorage.setItem(storage_name, description)
		}
	}

	$(async function () {
		// load sweetalert
		const sweetalert = await xmlRequest('https://cdn.bootcdn.net/ajax/libs/sweetalert2/11.12.4/sweetalert2.all.min.js', "GET", {});
		const script = document.createElement('script');
		script.innerHTML = sweetalert.responseText;
		document.head.appendChild(script);

		setInterval(async function () {
			if (document.visibilityState == 'visible') {
				await checkUpdate();
			}
		}, 10000);
	});
})();