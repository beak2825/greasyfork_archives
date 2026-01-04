// ==UserScript==
// @name         求字体网站 字体下载
// @namespace    **
// @version      1.0.0
// @description  字体下载脚本
// @author       Lolis
// @connect      www.qiuziti.com
// @connect      f01.lianty.cn
// @include      *://*.qiuziti.com/download*
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439318/%E6%B1%82%E5%AD%97%E4%BD%93%E7%BD%91%E7%AB%99%20%E5%AD%97%E4%BD%93%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/439318/%E6%B1%82%E5%AD%97%E4%BD%93%E7%BD%91%E7%AB%99%20%E5%AD%97%E4%BD%93%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
	'use strict';
	console.log('%c ☘️: 脚本加载... ', 'font-size:16px;background-color:#4b5246;color:white;');
	const CONFIG = {
		FILE_NAME: '',
		POLLING_COUNT: 300 // 轮询次数

	};
	// 清空对应储存
	const clearStore = () => {
    console.log("%c 🏭: 清空储存 ", "font-size:16px;background-color:#700a6f;color:white;")
		localStorage.removeItem('QZT_TEST');
		Cookies.remove('Countdown');
	};
	// JSON格式转化
	const parse = (target) => {
		let o = null;
		try {
			if (typeof target === 'string') {
				o = JSON.parse(target);
			}
		} catch (error) {}
		return o;
	};
	// 下载流
	const doDownload = (blob) => {
		const fileName = CONFIG.FILE_NAME;
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = fileName;
		link.click();
		window.URL.revokeObjectURL(link.href);
	};
	// 请求封装
	const request = (url) =>
		new Promise((resolve) => {
			GM_xmlhttpRequest({
				method: 'GET',
				url,
				responseType: 'blob',
				onload: async (res) => {
					console.log('%c 📯: res ', 'font-size:16px;background-color:#9630d2;color:white;', res);
					const text = await res.response.text();
					const blob = parse(text);
					if (blob?.error_code != 101 && res.status === 200) {
						doDownload(res.response);
						return resolve('break');
					}
					resolve(res);
				},
				onerror: async (error) => {
					console.log(
						'%c 📟: parse -> error ',
						'font-size:16px;background-color:#818a1a;color:white;',
						error
					);
					resolve(null);
				}
			});
		});
	// 新增DOM
	const renderDOM = () => {
		$('#ptDownload')
			.clone()
			.attr('id', 'ptDownload-clone')
			.css({ padding: '0 15px', width: 'auto' })
			.find('.s')
			.text('轮询下载')
			.parent()
			.css({ 'background-color': '#eadd45', color: '#fff' })
			.appendTo($('.download-handle'));
	};
	// 递归轮询
	let downloadCount = 0;
	const recursionDownloadRequest = async (url) => {
		// console.log('done');
		console.log(
			'%c 👩‍💼: recursionDownloadRequest -> downloadCount ',
			'font-size:16px;background-color:#18df40;color:black;',
			downloadCount
		);
		$('#ptDownload-clone').find('.s').text(`轮询中 （${downloadCount}/300）`);
		if (downloadCount >= CONFIG.POLLING_COUNT) {
			$('#ptDownload-clone').find('.s').text(`轮询下载`);
			downloadCount = 0;
			return;
		}
		try {
			const result = await request(url);
			if (result === 'break') {
				$('#ptDownload-clone').find('.s').text(`轮询下载`);
				downloadCount = 0;
				return;
			}
			// console.log(
			// 	'%c 🐿️: recursionDownloadRequest -> result.responseText ',
			// 	'font-size:16px;background-color:#a0f63d;color:black;',
			// 	result.responseText
			// );
			setTimeout(() => {
				recursionDownloadRequest(url);
			}, 10);
		} catch (error) {
			console.log(
				'%c 🗻: recursionDownloadRequest -> error ',
				'font-size:16px;background-color:#1cd9a7;color:black;',
				error
			);
		}
		downloadCount++;
	};

	setTimeout(() => {
		// 渲染
		console.log('%c 🌽: 渲染 ', 'font-size:16px;background-color:#04b8c2;color:white;');
		renderDOM();

		// 点击沦陷下载
		$('#ptDownload-clone').click(function () {
			clearStore();
			const url = $(this).data('url');
			if (url) {
				const downloadUrl = HOST.DOWNLOAD + API.qztDownload + '?url=' + encodeURIComponent(url);
				CONFIG.FILE_NAME = url.split('/').pop();
				recursionDownloadRequest(downloadUrl);
			}
		});
	});
})();
