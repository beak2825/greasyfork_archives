// ==UserScript==
// @name					绿联云 NAS 助手
// @namespace			http://tampermonkey.net/
// @version				0.21
// @description		直接通过浏览器使用绿联云功能, 免装绿联云客户端
// @author				cuteribs
// @include				*
// @grant					GM.xmlHttpRequest
// @grant					GM.notification
// @grant					GM.openInTab
// @grant					GM.registerMenuCommand
// @require				https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/core.min.js
// @require				https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/md5.min.js
// @downloadURL https://update.greasyfork.org/scripts/434086/%E7%BB%BF%E8%81%94%E4%BA%91%20NAS%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/434086/%E7%BB%BF%E8%81%94%E4%BA%91%20NAS%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 请自行修改下述配置
const config = {
	// baseUrl: 'http://192.168.6.100:9999'		// NAS 内网地址端口
	baseUrl: 'https://ugreen.kooldns.cn', // NAS 外网中转地址
	userName: 'paigu', // NAS 本地账号
	password: 'paigu', // NAS 本地账号密码
	downloadPath: '/' // 离线下载路径
};

// 实现代码
(function () {
	'use strict';

	const env = {
		title: '绿联云 NAS 助手',
		ugreen_no: null,
		api_token: null,
		partitions: []
	};

	async function login() {
		let passwordHash = CryptoJS.MD5(config.password).toString();
		passwordHash = CryptoJS.MD5(passwordHash).toString();

		const url = `${config.baseUrl}/v1/user/offline/login`;
		const data = {
			platform: 0,
			offline_username: config.userName,
			offline_password: passwordHash
		};

		try {
			const res = await post(url, null, JSON.stringify(data));
			env.ugreen_no = res.data.data.ugreen_no;
			env.api_token = res.data.api_token;
		} catch (error) {
			console.error(error);
		}

		return null;
	}

	async function heartbeat() {
		if (!env.api_token) {
			console.warn('绿联云 NAS 未登录');
			await login();
		}

		let url = `${config.baseUrl}/v1/file/storages?api_token=${env.api_token}`;
		let res = await get(url);

		if (res.code === 8013) {
			await login();
			res = await post(url);
		}

		if (res.code === 200) {
			env.partitions = res.data.storages
				.filter((s) => !s.isExternal)
				.map((s) => s.partitions)
				.flat();
			GM.registerMenuCommand('🚀 启动迅雷远程', launchXunlei);

			for (const p of env.partitions) {
				GM.registerMenuCommand(`🚀 离线下载到: ${p.label} (${calcSpace(p.size, p.used)})`, () =>
					remoteDownload(p.uuid)
				);
			}

			return true;
		}

		alert('绿联云 NAS 登录失败');
		return false;
	}

	async function launchXunlei(e) {
		console.warn('launchXunlei', e);
		if (!(await heartbeat())) return;

		let url = `${config.baseUrl}/thunder/bindcode/get?api_token=${env.api_token}`;
		let bindInfo;

		try {
			const res = await post(url);
			bindInfo = res.data;
		} catch (error) {
			console.error(error);
		}

		if (!bindInfo) return alert('迅雷远程绑定失败');

		url = `https://act-vip-ssl.xunlei.com/remote_zspace/index.html?biz=ug&sn=${bindInfo.sn}&bindcode=${bindInfo.bindcode}`;
		GM.openInTab(url);
	}

	async function remoteDownload(uuid) {
		const downloadUrl = prompt('输入下载连接');

		if (!downloadUrl) return;

		const url = `${config.baseUrl}/v1/dl/add?api_token=${env.api_token}`;
		const data = new FormData();
		data.append('uuid', uuid);
		data.append('path', `/.ugreen_nas/${env.ugreen_no}${config.downloadPath}`);
		data.append('type', 8);
		data.append('uri', downloadUrl);

		try {
			const res = await post(url, { 'Content-Type': undefined }, data);
			notify('离线下载添加成功', env.title);
			alert('离线下载添加成功');
		} catch (error) {
			console.error(error);
		}
	}

	function get(url, headers) {
		return new Promise((resolve, reject) => {
			console.log('get', url, headers);
			GM.xmlHttpRequest({
				url,
				headers,
				method: 'GET',
				responseType: 'json',
				onload: (res) => resolve(res.response),
				onerror: (res) => reject(res)
			});
		});
	}

	function post(url, headers, data) {
		return new Promise((resolve, reject) => {
			console.log('post', url, headers, data);
			GM.xmlHttpRequest({
				url,
				headers,
				data,
				method: 'POST',
				responseType: 'json',
				onload: (res) => resolve(res.response),
				onerror: (res) => reject(res)
			});
		});
	}

	function calcSpace(size, used) {
		const available = (size - used).getFileSize();
		const total = size.getFileSize();
		return `${available.size.toFixed(2)}/${total.size.toFixed(2)} ${total.unit}`;
	}

	function notify(text, title) {
		GM.notification(text, title);
	}

	Number.prototype.getFileSize = function () {
		const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		let size = this,
			index = 0;

		while (size >= 1024) {
			size /= 1024;
			index++;
		}

		return { size, unit: units[index] };
	};

	GM.registerMenuCommand('☁ 登录绿联云', heartbeat);
})();
