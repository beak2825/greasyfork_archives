/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               GM_xmlhttpRequest 测试3
// @name:zh-CN         GM_xmlhttpRequest 测试3
// @name:en            GM_xmlhttpRequest Test3
// @namespace          GM_xmlhttpRequest-Test-3
// @version            0.1
// @description        虽然作者懒得写描述，但是他至少记得添加过一个默认描述……
// @description:zh-CN  虽然作者懒得写描述，但是他至少记得添加过一个默认描述……
// @description:en     try to take over the world!
// @author             PY-DNG
// @license            GPL-license
// @match              http*://p.sda1.dev/*
// @icon               none
// @grant              GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/474140/GM_xmlhttpRequest%20%E6%B5%8B%E8%AF%953.user.js
// @updateURL https://update.greasyfork.org/scripts/474140/GM_xmlhttpRequest%20%E6%B5%8B%E8%AF%953.meta.js
// ==/UserScript==

(function() {
    'use strict';

	let url = 'https://p.sda1.dev/api_dup$backendid$/v1/upload_noform?ts=$time$&rand=$random$&filename=$filename$&batch_size=1';
	url = url.replace('$time$', (new Date()).getTime().toString());
	url = url.replace('$random$', Math.random().toString());
	url = url.replace('$filename$', 'image.jpg');
	url = url.replace('$backendid$', parseInt(Math.random() * 1000000007) % 10);
	const file = dataURLtoFile('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAbBJREFUOE+Vk7GKGlEUhr8pAiKKDlqpCDpLUCzWBxCENBa+hBsL9wHsLWxXG4tNtcGH0MIiWopY7JSGEUWsbESwUDMw4Z7siLsZDbnlPff/7n/+e67G38sA6sAXIPVWXgA/gCdgfinRPuhfCoXCw3Q65XA4eLBl6zvw1S2eAZqmvTqOc5/NZhkMBqRSKWzbvgYxgbwquoAX4MGyLHK5HIlEgtFo9C+IOFEAo1gsWsvlUmyPx2MymYxAhsMh6XT6lpM7BXjWdf1xNpuRz+fl8GQywTAMGo0G1WpVnJxOJ692vinADPgcDAaZz+cCOR6PmKZJPB4XUb/fp1wuewF+KoBCf1JVBVE5dDodms3mWdDtdqlUKl6AX+8ALmS9XgtM0/5kvNlspKX9fv8RIgBp4bISCoXo9XqsVitKpRK6rrPb7STQ7XZ7eVRaeAYerz14OBxGOfL7/eIgmUwKzHEcJZEQ1eha1wBqPxqNihufzyeQWCzmtiPPqJYM0jWIyiISibBYLAgEAtTrdVqt1nmQXN0rcH/LicqmVqvRbrdN27bfjbKru+nk7ZD3Z7q4+b++82/YPKIrXsKZ3AAAAABJRU5ErkJggg==');

	try {
		GM_xmlhttpRequest({
			method: 'POST',
			url: url,
			responseType: 'json',
			data: file,
			onload: function(response) {
				console.log('Json response got');
				console.log(response);
				console.log('image url: ' + response.response.data.url);
			},
			onerror: function(err) {
				console.log('Error during request', err);
			},
			ontimeout: function() {
				console.log('Timeout during request');
			},
			onabort: function() {
				console.log('Request aborted');
			},
		});
	} catch(err) {
		console.log('error while sending request');
		console.error(err);
	}

	/**
	 * @description: 将base64转换为文件对象
	 * @param {*} dataUrl base64
	 * @param {*} fileName 文件名
	 * @Date: 2021-06-30 14:33:47
	 * @Author: mulingyuer
	 */
	function dataURLtoFile(dataUrl, fileName) {
		const arr = dataUrl.split(";base64,"); //[data:image/png,xxx]
		const mime = arr[0].replace("data:", ""); //mime后端识别用的文件格式数据
		const fileType = mime.split("/").pop(); //获取文件格式
		const bstr = atob(arr[1]); //base64解码
		//创建Unicode编码的数组对象，每个值都是Unicode
		const u8arr = new Uint8Array(bstr.split("").map(str => str.charCodeAt(0)));
		return new File([u8arr], `${fileName ?? "file"}.${fileType}`, { type: mime });
	}
})();