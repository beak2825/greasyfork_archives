/* eslint-disable no-multi-spaces */
/* eslint-disable no-implicit-globals */
/* eslint-disable userscripts/no-invalid-headers */
/* eslint-disable userscripts/no-invalid-grant */

// ==UserScript==
// @name               settings
// @displayname        设置界面
// @namespace          Wenku8++
// @version            0.3.12
// @description        轻小说文库++的脚本设置界面
// @author             PY-DNG
// @license            GPL-v3
// @regurl             https?://www\.wenku8\.net/.*
// @require            https://greasyfork.org/scripts/449412-basic-functions/code/Basic%20Functions.js?version=1085783
// @require            https://greasyfork.org/scripts/449583-configmanager/code/ConfigManager.js?version=1085836
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_deleteValue
// @grant              GM_listValues
// @grant              ML_listModules
// @grant              ML_getModule
// @grant              ML_disableModule
// @grant              ML_enableModule
// @grant              ML_uninstallModule
// @grant              ML_moduleLoaded
// @protect
// ==/UserScript==

/*
计划任务：
[ ] 模块列表排序显示
[o] 不可用按钮灰选
[x] 模块详细信息展示
[x] 模块运行状态展示
[?] 合并禁用/启用按钮
[x] 按钮点击反馈
[x] 更改设置图标位置
[x] 模块卸载后删除模块行
[ ] 删除无用旧版设置界面相关代码
[ ] 未安装模块列表与安装功能外壳
[ ] 模块更新功能外壳
*/

(function __MAIN__() {
	const ASSETS = require('assets');
	const alertify = require('alertify');
	const tippy = require('tippy');
	const SPanel = require('SidePanel');
	const SettingPanel = require('SettingPanel');
	const mousetip = require('mousetip');
	const CONST = {
		Text: {
			Button: '设置',
			Title: '脚本设置',
			ModuleManage: '模块管理',
			OpenModuleDialog: '点此打开管理面板',
			ModuleSettings: '模块设置',
			Module: '模块',
			Operation: '操作',
			DisableModule: '禁用模块',
			EnableModule: '启用模块',
			NotDisablable: '不可禁用',
			UninstallModule: '卸载模块',
			NotUninstallable: '不可卸载',
			AlertTitle: '模块设置界面',
			NoLoadNoSettings: '模块并未在此页面上运行，无法获取设置',
			NoSettings: '该模块当前并没有提供设置选项',
			ModuleEnabled: '已启用</br>相关页面需要刷新后才能启动此模块',
			ModuleDisabled: '已禁用</br>相关页面需要刷新后才能停止此模块',
			ModuleUninstalled: '已卸载</br>相关页面需要刷新/关闭后才能彻底清除此模块',
			ModuleDisableFailed: '禁用失败</br>请检查该模块是否不可禁用',
			ModuleUninstallFailed: '卸载失败</br>请检查该模块是否不可卸载',
			RememberSaving: '修改设置/恢复设置后记得点击保存哦:)',
			ModuleMissing: '模块不见了？！</br>您似乎没有安装这个模块哦…是不是之前在别的标签页里把它卸载了？',
			ModuleDetail: '<span class="{CT}">名称：</span><span name="name"></span></br><span class="{CT}">描述：</span><span name="description"></span></br><span class="{CT}">版本：</span><span name="version"></span></br><span class="{CT}">作者：</span><span name="author"></span></br><span class="{CT}">版权：</span><span name="license"></span></br><span class="{CT}">来源：</span><span name="src"></span></br><span class="{CT}">是否已运行：</span><span name="loaded"></span></br><span class="{CT}">是否已启用：</span><span name="enabled"></span></br><span class="{CT}">是否可禁用：</span><span name="can_disable"></span></br><span class="{CT}">是否可卸载：</span><span name="can_uninstall"></span></br><span class="{CT}">是否为系统模块：</span><span name="system"></span>'.replaceAll('{CT}', ASSETS.ClassName.Text),
			Boolean: {
				'true': '是',
				'false': '否'
			},
		},
		Faicon: {
			Info: 'fa-solid fa-circle-info'
		},
		Config_Ruleset: {
			'version-key': 'config-version',
			'ignores': ["LOCAL-CDN"],
			'defaultValues': {
				//'config-key': {},
			},
			'updaters': {
				/*'config-key': [
					function() {
						// This function contains updater for config['config-key'] from v0 to v1
					},
					function() {
						// This function contains updater for config['config-key'] from v1 to v2
					}
				]*/
			}
		}
	};

	const UMManager = new UserModuleManager();
	SPanel.insert({
		index: 1,
		faicon: 'fa-solid fa-gear',
		tip: CONST.Text.Button,
		onclick: UMManager.show
	});

	exports = {
		isSettingPage: isSettingPage,
		insertLines: insertLines,
		registerSettings: UMManager.registerModuleSettings
	};

	function main() {
		// Get elements
		const content = $('#content');

		// Insert settings
		const title = [
			[{html: CONST.Text.Title, colSpan: 3, class: 'foot', key: 'settitle'}],
			[{html: CONST.Text.ModuleManage, colSpan: 1}, {html: CONST.Text.OpenModuleDialog, colSpan: 2, onclick: UMManager.show}],
			//[{html: CONST.Text.XXXX, colSpan: 1, key: 'xxxxxxxx'}, {html: CONST.Text.XXXX, colSpan: 2, key: 'xxxxxxxx'}],
		]
		const elements = insertLines(title);

		// scrollIntoView if need
		getUrlArgv('tosettings') === 'true' && elements.settitle.scrollIntoView();
	}

	// Module manager user interface
	function UserModuleManager() {
		const UMM = this;
		const moduleSettingFuncs = {};

		UMM.show = show;

		UMM.registerModuleSettings = registerModuleSettings;

		UMM.showModuleSettings = showModuleSettings;

		function show() {
			//box.set('message', 'No implemented yet!').show();
			const modules = ML_listModules();

			// Make panel
			const SetPanel = new SettingPanel.SettingPanel({
				header: CONST.Text.ModuleManage,
				tables: []
			});

			// Make table
			const table = new SetPanel.PanelTable({});

			// Make header
			table.appendRow({
				blocks: [{
					isHeader: true,
					colSpan: 1,
					width: '60%',
					innerText: CONST.Text.Module,
				},{
					isHeader: true,
					colSpan: 4,
					width: '40%',
					innerText: CONST.Text.Operation,
				}]
			});

			// Make module rows
			for (const module of modules) {
				const id = module.identifier;
				const row = new SetPanel.PanelRow({
					blocks: [{
						// Module info
						colSpan: 1,
						rowSpan: 1,
						children: [
							(() => {
								const icon = $CrE('i');
								icon.className = CONST.Faicon.Info;
								icon.style.marginRight = '0.5em';
								icon.classList.add(ASSETS.ClassName.Text);

								tippy(icon, {
									content: makeContent(),
									onTrigger: (instance, event) => {
										instance.setContent(makeContent());
									}
								});
								return icon;

								function makeContent() {
									const module = ML_getModule(id);
									if (!module) {
										alertify.alert(CONST.Text.AlertTitle, CONST.Text.ModuleMissing);
										row.remove();
										return false;
									}
									const status = {
										loaded: ML_moduleLoaded(id),
										system: !!(module.flags & ASSETS.FLAG.SYSTEM),
										can_uninstall: !(module.flags & ASSETS.FLAG.NO_UNINSTALL),
										can_disable: !(module.flags & ASSETS.FLAG.NO_DISABLE),
									}
									const tip = $CrE('div');
									tip.innerHTML = CONST.Text.ModuleDetail;
									tip.childNodes.forEach((elm) => {
										if (!elm instanceof HTMLElement) {return;}
										const name = elm.getAttribute('name');
										if (name && module.hasOwnProperty(name) || status.hasOwnProperty(name)) {
											const info = module.hasOwnProperty(name) ? module : status;
											elm.innerText = ({
												string: (s) => (s),
												boolean: (b) => (CONST.Text.Boolean[b.toString()])
											})[typeof info[name]](info[name]);
										}
									});

									return tip;
								}
							}) (),
							(() => {
								const span = $CrE('span');
								span.innerText = module.displayname || module.name;
								return span;
							}) (),
						],
					},{
						// Module settings
						colSpan: 1,
						rowSpan: 1,
						children: [makeBtn({
							text: CONST.Text.ModuleSettings,
							onclick: function() {
								if (!ML_getModule(id)) {
									alertify.alert(CONST.Text.AlertTitle, CONST.Text.ModuleMissing);
									row.remove();
									return false;
								}
								return showModuleSettings(id) ? 0 : 1;
							},
							alt: [CONST.Text.RememberSaving, null]
						})]
					},{
						// Diable module
						colSpan: 1,
						rowSpan: 1,
						children: [makeBtn({
							text: canDisable(module) ? CONST.Text.DisableModule : CONST.Text.NotDisablable,
							onclick: function() {
								if (!ML_getModule(id)) {
									alertify.alert(CONST.Text.AlertTitle, CONST.Text.ModuleMissing);
									row.remove();
									return false;
								}
								return ML_disableModule(id) ? 0 : 1;
							},
							disabled: !canDisable(module),
							alt: [CONST.Text.ModuleDisabled, CONST.Text.ModuleDisableFailed]
						})]
					},{
						// Enable module
						colSpan: 1,
						rowSpan: 1,
						children: [makeBtn({
							text: CONST.Text.EnableModule,
							onclick: function () {
								if (!ML_getModule(id)) {
									alertify.alert(CONST.Text.AlertTitle, CONST.Text.ModuleMissing);
									row.remove();
									return false;
								}
								ML_enableModule(id);
							},
							alt: CONST.Text.ModuleEnabled
						})]
					},{
						// Uninstall module
						colSpan: 1,
						rowSpan: 1,
						children: [makeBtn({
							text: canUninstall(module) ? CONST.Text.UninstallModule : CONST.Text.NotUninstallable,
							onclick: function() {
								if (!ML_getModule(id)) {
									alertify.alert(CONST.Text.AlertTitle, CONST.Text.ModuleMissing);
									row.remove();
									return false;
								}
								const success = ML_uninstallModule(id);
								success && row.remove();
								return success ? 0 : 1;
							},
							disabled: !canUninstall(module),
							alt: [CONST.Text.ModuleUninstalled, CONST.Text.ModuleUninstallFailed]
						})]
					}]
				});
				table.appendRow(row);
			}
			SetPanel.appendTable(table);

			function makeBtn(details) {
				// Get arguments
				let text, onclick, disabled, alt;
				text = details.text;
				onclick = details.onclick;
				disabled = details.disabled;
				alt = details.alt;

				const span = $CrE('span');
				span.innerText = text;
				onclick && span.addEventListener('click', _onclick);
				span.classList.add(ASSETS.ClassName.Button);
				disabled && span.classList.add(ASSETS.ClassName.Disabled);

				return span;

				function _onclick() {
					const result = !disabled && onclick ? onclick() : 0;
					const alt_content = alt && (Array.isArray(alt) ? alt[result] : alt);
					!disabled && ![null, false].includes(result) && alt_content && alertify.message(alt_content);
				}
			}

			function canUninstall(module) {
				return !(module.flags & ASSETS.FLAG.NO_UNINSTALL);
			}

			function canDisable(module) {
				return !(module.flags & ASSETS.FLAG.NO_DISABLE);
			}
		}

		function registerModuleSettings(id, func) {
			moduleSettingFuncs[id] = func;
		}

		function showModuleSettings(id) {
			const func = moduleSettingFuncs[id];
			if (typeof func === 'function') {
				func();
				return true;
			} else {
				if (!ML_moduleLoaded(id)) {
					alertify.alert(CONST.Text.AlertTitle, CONST.Text.NoLoadNoSettings);
				} else {
					alertify.alert(CONST.Text.AlertTitle, CONST.Text.NoSettings);
				}
				return false;
			}
		}
	}

	function insertLines(lines, tbody) {
		!tbody && (tbody = $(content, 'table>tbody'));
		const elements = {};
		for (const line of lines) {
			const tr = $CrE('tr');
			for (const item of line) {
				const td = $CrE('td');
				item.html && (td.innerHTML = item.html);
				item.colSpan && (td.colSpan = item.colSpan);
				item.class && (td.className = item.class);
				item.id && (td.id = item.id);
				item.tiptitle && mousetip.settip(td, item.tiptitle);
				item.key && (elements[item.key] = td);
				if (item.onclick) {
					td.style.color = 'grey';
					td.style.textAlign = 'center';
					td.addEventListener('click', item.onclick);
				}
				td.style.padding = '3px';
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		return elements;
	}

	function isSettingPage(callback) {
		const page = getAPI()[0] === 'userdetail.php';
		page && callback && callback();
		return page;
	}

	function htmlEncode(text) {
		const span = $CrE('div');
		span.innerText = text;
		return span.innerHTML;
	}

	// Change location.href without reloading using history.pushState/replaceState
	function setPageUrl() {
		let win, url, push;
		switch (arguments.length) {
			case 1:
				win = window;
				url = arguments[0];
				push = false;
				break;
			case 2:
				win = arguments[0];
				url = arguments[1];
				push = false;
				break;
			case 3:
				win = arguments[0];
				url = arguments[1];
				push = arguments[2];
		}
		return win.history[push ? 'pushState' : 'replaceState']({modified: true, ...history.state}, '', url);
	}
})();