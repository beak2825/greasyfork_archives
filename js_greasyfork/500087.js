// ==UserScript==
// @name         NGA优化摸鱼体验插件-自动双向同步数据WebDAV数据
// @namespace    https://gist.github.com/nulIptr/b2de9f49cf4f7c3803af9738ad20e1d5
// @version      1.0.0
// @author       nuliptr
// @description  通过WebDAV自动同步数据,每次同步还会合并远程数据
// @license      MIT
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @match        *://g.nga.cn/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/500087/NGA%E4%BC%98%E5%8C%96%E6%91%B8%E9%B1%BC%E4%BD%93%E9%AA%8C%E6%8F%92%E4%BB%B6-%E8%87%AA%E5%8A%A8%E5%8F%8C%E5%90%91%E5%90%8C%E6%AD%A5%E6%95%B0%E6%8D%AEWebDAV%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/500087/NGA%E4%BC%98%E5%8C%96%E6%91%B8%E9%B1%BC%E4%BD%93%E9%AA%8C%E6%8F%92%E4%BB%B6-%E8%87%AA%E5%8A%A8%E5%8F%8C%E5%90%91%E5%90%8C%E6%AD%A5%E6%95%B0%E6%8D%AEWebDAV%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

const CHECK_INFO_KEY = 'AutoSyncDataWithMergeRemote_lastCheckInfo';
(function (registerPlugin) {
	'use strict';

	//去除一些广告
	GM_addStyle('#bbs_ads9_add{display:none !important}');
	GM_addStyle('#toptopics+span{display:none !important}');
	GM_addStyle('.forumbox.postbox+span{display:none !important}');

	const AutoSyncDataWithMergeRemote = {
		name: 'AutoSyncDataWithMergeRemote',
		title: '双向同步数据',
		desc: '通过WebDAV自动同步数据',
		settings: [
			{
				key: 'url',
				title: 'WebDAV地址',
				default: '',
			},
			{
				key: 'username',
				title: 'WebDAV账号',
				default: '',
			},
			{
				key: 'password',
				title: 'WebDAV密码',
				default: '',
			},
			{
				key: 'backupFileName',
				title: '备份文件名',
				default: 'nga_bbs_script_auto_sync_rolling.json',
			},
			{
				key: 'checkInterval',
				title: '检查间隔（单位：分）',
				default: 60,
			},
		],
		buttons: [
			{
				title: '检查连接',
				action: 'testConnections',
			},
			{
				title: '备份',
				action: 'backup',
			},
			{
				title: '还原',
				action: 'restore',
			},
		],
		lastCheckInfo: {},
		beforeSaveSettingFunc(settings) {
			if (settings['checkInterval'] < 0) {
				return '检查间隔不能小于0。';
			}
			if (settings['keywordsListFileName'] == '') {
				return '关键词列表文件名不能为空。';
			}
			if (settings['banListFileName'] == '') {
				return '黑名单列表文件名不能为空。';
			}
			if (settings['markListFileName'] == '') {
				return '标记名单列表文件名不能为空。';
			}
			if (settings['metaFileName'] == '') {
				return '元数据文件名不能为空。';
			}
		},
		initFunc() {
			if (typeof this.pluginSettings['backupFileName'] !== 'string' || this.pluginSettings['backupFileName'] === '') {
				this.pluginSettings['backupFileName'] = 'nga_bbs_script_auto_sync_rolling.json';
			}
			if (typeof this.pluginSettings['checkInterval'] !== 'number' || this.pluginSettings['checkInterval'] < 0) {
				this.pluginSettings['checkInterval'] = 60;
			}
			try {
				this.lastCheckInfo = JSON.parse(this.mainScript.getValue(CHECK_INFO_KEY) ?? '{}');
			} catch (e) {
				this.printLog('读取上次检查信息失败', 'err');
				console.error(e);
			}
		},
		postProcFunc(...args) {
			console.log(args, 'postProcFunc(...args) {');
			if (this.pluginInputs['url'].val()) {
				const _this = this;
				const handler = async () => {
					const lastCheckTime = _this.lastCheckInfo['lastCheckTime'];

					try {
						if (typeof lastCheckTime !== 'number' || lastCheckTime + _this.pluginSettings['checkInterval'] * 60 * 1000 < Date.now()) {
							await _this.sync(true);
							_this.lastCheckInfo['lastCheckTime'] = Date.now();
						}
					} catch (e) {
						_this.mainScript.printLog('检查连接失败');
						console.log(e);
					} finally {
						try {
							_this.mainScript.setValue(CHECK_INFO_KEY, JSON.stringify(_this.lastCheckInfo));
						} catch (e) {
							_this.mainScript.printLog('保存检查信息失败');
							console.error(e);
						}
						setTimeout(handler, 1000);
					}
				};
				this.timeout = setTimeout(handler, 1000);
			}
		},
		// 请求构造
		request({ method, path = '', headers, ...config }) {
			// 获取输入框的当前的值
			let url = this.pluginInputs['url'].val().trim();
			url[url.length - 1] !== '/' && (url += '/');
			const username = this.pluginInputs['username'].val().trim();
			const password = this.pluginInputs['password'].val().trim();

			this.buttons.forEach((button) => button.$el.attr('disabled', true));
			return new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					method,
					url: url + path,
					headers: {
						authorization: 'Basic ' + btoa(`${username}:${password}`),
						'Cache-control': 'no-cache',
						...headers,
					},
					...config,
					onload: (response) => {
						this.buttons.forEach((button) => button.$el.removeAttr('disabled'));
						if (response.status >= 200 && response.status < 300) {
							resolve(response);
						} else {
							if (method == 'GET' && response.status == 404) {
								resolve(null);
								return;
							}
							this.mainScript.popMsg(`WebDAV请求失败! 状态码: ${response.status} ${response.statusText}`, 'err');
						}
					},
					onerror: (error) => {
						reject(error);
						this.buttons.forEach((button) => button.$el.removeAttr('disabled'));
						this.mainScript.popMsg(`WebDAV请求失败!${error}`);
					},
				});
			});
		},
		// 获取文件列表
		getFileList() {
			return new Promise((resolve, reject) => {
				this.request({
					method: 'PROPFIND',
					headers: { depth: 1 },
				}).then((res) => {
					let files = [];
					let path = res.responseText.match(/(?<=<d:href>).*?(?=<\/d:href>)/gi);
					path.forEach((p) => {
						const filename = p.split('/').pop();
						files.push(filename);
					});
					resolve(files);
				});
			});
		},

		// 下载配置
		async restore() {
			const filename = this.pluginSettings['backupFileName'];
			const res = await this.request({
				method: 'GET',
				path: filename,
			});

			this.mainScript.getModule('BackupModule').import(res.responseText, false);
		},
		// 测试连通性
		async testConnections() {
			await this.getFileList();
			this.mainScript.popMsg('连接成功！同步配置看起来没问题');
		},
		// 上传配置
		async sync() {
			const local = this.mainScript.getModule('BackupModule').export('*', false);

			const filename = this.pluginSettings['backupFileName'];
			let remote = null;

			try {
				let res = await this.request({
					method: 'GET',
					path: filename,
				});
				remote = res.responseText;
			} catch (error) {}

			const next = this.merge(local, remote);

			this.mainScript.getModule('BackupModule').import(next, false);
			await this.request({
				method: 'PUT',
				path: filename,
				data: next,
			});
		},

		merge(local, remote) {
			if (remote === null) {
				return local;
			}
			const l = JSON.parse(local);

			const r = JSON.parse(remote);

			//merge keywords_list
			(function () {
				const set = new Set(l.keywords_list);
				r.keywords_list.forEach((v) => {
					set.add(v);
				});
				l.keywords_list = Array.from(set);
			})();

			//merge ban_list
			(function () {
				const set = new Set(l.ban_list.map((v) => v.uid));
				r.ban_list.forEach((v) => {
					if (!set.has(v.uid)) {
						l.ban_list.push(v);
					}
				});
			})();

			//merge mark_list
			(function () {
				const set = new Set(l.mark_list.map((v) => v.uid));
				r.mark_list.forEach((v) => {
					if (!set.has(v.uid)) {
						l.mark_list.push(v);
					}
				});
			})();

			return JSON.stringify(l);
		},
	};
	registerPlugin(AutoSyncDataWithMergeRemote);
})(function (plugin) {
	plugin.meta = GM_info.script;
	unsafeWindow.ngaScriptPlugins = unsafeWindow.ngaScriptPlugins || [];
	unsafeWindow.ngaScriptPlugins.push(plugin);
});
