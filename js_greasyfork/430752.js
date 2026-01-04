// ==UserScript==
// @name         文文錄影机
// @namespace    moe.moekai.aya.videorecorder
// @version      2.5
// @description  支持大部分网页视频、直播錄影 / 视频录制 / 录制视频
// @author       YIU
// @include      *
// @icon         https://any.moest.top/monkeydoc/res/ayavrec.ico
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      GPL-3.0
// @compatible   chrome 76+
// @compatible   firefox 70+
// @supportURL   https://github.com/usaginya/mkAppUpInfo/tree/master/monkeyjs
// @homepageURL  https://github.com/usaginya/mkAppUpInfo/tree/master/monkeyjs
// @downloadURL https://update.greasyfork.org/scripts/430752/%E6%96%87%E6%96%87%E9%8C%84%E5%BD%B1%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/430752/%E6%96%87%E6%96%87%E9%8C%84%E5%BD%B1%E6%9C%BA.meta.js
// ==/UserScript==

//-- 以下格式转换方式仅供参考、推荐使用小丸工具箱等其它转换工具
//- 可以使用下面的ffmpeg命令直接转换格式为mp4（非标准mp4）
//ffmpeg -i WebVideo.webm -strict -2 -c copy output.mp4

//- 转为一般恒定mp4（二次转换，-r限制帧率避免爆帧，-crf数值越小体积越大质量越好，建议为21左右）
//ffmpeg -i WebVideo.webm -r 60 -crf 21 output.mp4

(function ($) {
	'use strict';

	//VV 全局变量定义 ---
	let initialIsDone;
	let gmMenuUiId;
	let selectedMimeTypeId;
	let supportedMimeTypes;
	let buttonShowMode;

	//## 注册脚本菜单 --
	if (!gmMenuUiId) {
		gmMenuUiId = GM_registerMenuCommand('设置 · Settings', gmMenuUiEvent);
	}

	//## 脚本菜单事件 - 创建菜单界面
	function gmMenuUiEvent() {
		// 切换编码类型菜单
		if (!supportedMimeTypes) { createSupportedMimeType(); }
		if (!initialIsDone) {
			selectedMimeTypeId = parseInt(GM_getValue('MimeTypeId'));
		}
		let menuMimeTypeItems = [];
		for (let id in supportedMimeTypes) {
			let item = {
				id: id,
				group: 'gmayavrradiobtn-mimetype',

				title: supportedMimeTypes[id].tips
				? (id < 1 ? supportedMimeTypes[id].type : supportedMimeTypes[id].tips)
				: supportedMimeTypes[id].type,

				tips: supportedMimeTypes[id].tips
				? (id < 1 ? supportedMimeTypes[id].tips : supportedMimeTypes[id].type)
				: null,

				selected: (selectedMimeTypeId && selectedMimeTypeId == id || !selectedMimeTypeId && id < 1),
				isLast: id < 1,
				onSelected: () => {
					selectedMimeTypeId = id;
					forwardCommandToIframe('changemimetypeid', selectedMimeTypeId);
				}
			};
			menuMimeTypeItems.push(item);
		}

		// 切换錄影按钮菜单
		if (!initialIsDone) { loadSiteButtonShowMode(); }
		let btnModes = [
			{id: 0 , title: '悬停显示', tips: '鼠标指针在视频上时显示'},
			{id: 1 , title: '总是显示'},
			{id: 2 , title: '不显示'},
			{group: 'gmayavrradiobtn-bsmlayer', id: 10 , title: '内层', tips: '按钮在影视同一层'},
			{group: 'gmayavrradiobtn-bsmlayer', id: 11 , title: '中层', tips: '按钮在影视相同的区域'},
			{group: 'gmayavrradiobtn-bsmlayer', id: 12 , title: '外层', tips: '按钮在影视区域外层、被什么遮挡的话可以尝试选择'}
		];
		let menuBottomShowModeItems = [];
		btnModes.forEach((mode) => {
			let item = {
				group: mode.group,
				id: mode.id,
				title: mode.title,
				tips: mode.tips,
				selected: () => {
					if (mode.group != 'gmayavrradiobtn-bsmlayer') {
						return buttonShowMode.mode && buttonShowMode.mode == mode.id || !buttonShowMode.mode && mode.id < 1;
					}
					return buttonShowMode.layer && buttonShowMode.layer == mode.id || !buttonShowMode.layer && mode.id < 11;
				},
				onSelected: () => {
					let btnSM = { mode: buttonShowMode.mode, layer: buttonShowMode.layer };
					let newBtnSM = {
						mode: mode.group != 'gmayavrradiobtn-bsmlayer' ? mode.id : btnSM.mode,
						layer: mode.group === 'gmayavrradiobtn-bsmlayer' ? mode.id : btnSM.layer
					};
					// 改变层之前先移除按钮
					if (mode.group === 'gmayavrradiobtn-bsmlayer') {
						buttonShowMode.mode = 2;
						initialization();
					}
					// 等待删除后再绑定按钮
					setTimeout(() => {
						buttonShowMode.mode = newBtnSM.mode;
						buttonShowMode.layer = newBtnSM.layer;
						initialization();
						saveSiteButtonShowMode();
						// 向子窗口页面发送重新绑定指令,必须延迟发送,否则保存设置有冲突
						forwardCommandToIframe('rebind', newBtnSM);
					}, 300);
				}
			};
			menuBottomShowModeItems.push(item);
		});

		// 构建菜单参数
		let menu = {
			title: {
				href: 'https://greasyfork.org/scripts/430752'
			},
			tabs: {
				'ButtonShowMode': {
					title: '錄影按钮显示',
					content: {
						radioButton: {
							column: 3,
							items: menuBottomShowModeItems
						}
					}
				},
				'MimeType': {
					title: '视频编码类型',
					content: {
						radioButton: {
							configName: 'MimeTypeId',
							column: 4,
							items: menuMimeTypeItems
						}
					}
				}
				//- tabs end -
			},
		};
		gmAyaUiCreate(menu);
	}

	//## 载入当前网站錄影按钮显示方式
	function loadSiteButtonShowMode() {
		if (!buttonShowMode) { buttonShowMode = { host: location.host, mode: 0, layer: 10 }; }
		let siteButtonShowMode = GM_getValue('siteButtonShowMode');
		siteButtonShowMode = !siteButtonShowMode ? [] : siteButtonShowMode;
		siteButtonShowMode = siteButtonShowMode.filter((btnsm) => btnsm.host == buttonShowMode.host);
		buttonShowMode = siteButtonShowMode.length > 0 ? siteButtonShowMode[0] : buttonShowMode;
	}

	//## 保存当前网站錄影按钮显示方式
	function saveSiteButtonShowMode() {
		if (!buttonShowMode || !buttonShowMode.host) { return; }
		let siteButtonShowMode = GM_getValue('siteButtonShowMode');
		siteButtonShowMode = !siteButtonShowMode ? [] : siteButtonShowMode;
		if (siteButtonShowMode == []) {
			siteButtonShowMode.push(buttonShowMode);
			GM_setValue('siteButtonShowMode', siteButtonShowMode);
			return;
		}
		siteButtonShowMode = siteButtonShowMode.filter((btnsm) => btnsm.host != buttonShowMode.host);
		if (buttonShowMode.mode > 0 || buttonShowMode.layer > 10){
			siteButtonShowMode.push(buttonShowMode);
		}
		GM_setValue('siteButtonShowMode', siteButtonShowMode);
	}

	/** 格式化编码类型
	* @param {array} type 被格式化的编码类型(webm/vp9)[1:编码格式(webm..), 2:编码类型(vp9..)]
	*/
	function formatSupportedMimeType(type) {
		return /^(.*?)\/(.*?)$/gi.exec(type);
	}

	//## 创建支持的编码类型 --
	function createSupportedMimeType() {
		let types = [
			{ id: 0, type: 'Default', tips: 'webm'},
			{ id: 1, type: 'webm/vp9' },{ id: 2, type: 'webm/vp8' },
			{ id: 3, type: 'webm/h265' },{ id: 4, type: 'webm/h264' },
			{ id: 5, type: 'webm/av1' },{ id: 6, type: 'webm/avc1' },
			{ id: 7, type: 'x-matroska/vp9', tips: 'mkv/vp9' },{ id: 8, type: 'x-matroska/vp8', tips: 'mkv/vp8' },
			{ id: 9, type: 'x-matroska/h265', tips: 'mkv/h265' },{ id: 10, type: 'x-matroska/h264', tips: 'mkv/h264' },
			{ id: 11, type: 'x-matroska/av1', tips: 'mkv/av1' },{ id: 12, type: 'x-matroska/avc1', tips: 'mkv/avc1' },
		];
		supportedMimeTypes = {};
		types.forEach(function(v){
			let type = formatSupportedMimeType(v.type);
			type = v.id < 1 ? '/webm' : `/${type[1]}\;codecs=${type[2]},opus`;
			if (MediaRecorder.isTypeSupported(`video${type}`)) {
				supportedMimeTypes[v.id] = v;
			}
		});
	}

	//## 获取当前的编码类型字符串
	function getSelectedMimeTypeString() {
		let selectedMimeType = 'video/webm';
		if (!supportedMimeTypes) {
			createSupportedMimeType();
		}
		if (!selectedMimeTypeId || selectedMimeTypeId < 1 || !supportedMimeTypes[selectedMimeTypeId]) {
			return selectedMimeType;
		}
		selectedMimeType = formatSupportedMimeType(supportedMimeTypes[selectedMimeTypeId].type);
		return `video/${selectedMimeType[1]}\;codecs=${selectedMimeType[2]},opus`;
	}

	/** ====== 文文GM设置界面窗口 ======
	* @param {object} menu.title { <string>text: 窗口标题(可选), <string>href: 链接(可选) }
	* @param {function} menu.onCloseing 窗口被关闭时执行的回调方法(可选)
	* @param {object} menu.tabs 选项卡页面组
	* @param {objectName} menu.tabs.tabId 选项卡页面索引(only)
	* @param {string} menu.tabs.tabId.title 选项卡标题文字
	* @param {string} menu.tabs.tabId.content 选项卡内容
	* -- 选项卡内容对象 ----------------------------
	* -- 单选按钮组 --------------------------
	* radioButton: {
	*   <Array> items: [{
	*     <int> id: 选项索引,
	*     <string> group: 选项分组(可选),
	*     <string> title: 选项标题,
	*     <string> tips: 选项提示(可选),
	*     <bool|int|function> selected: 选项是否选中(only/可选),
	*     <bool> isLast: 选项是否排在最后(only/可选),
	*     <function> onSelected: 选项被选中时执行的回调方法(可选)
	*   }],
    *   <int> column: 每行选项显示个数(1~5)(可选),
	*   <string> configName: 存储设置名 \ 将会根据 items[i].id 索引保存(可选)
	* }
	*/
	function gmAyaUiCreate(menu) {
		if (!menu || !menu.tabs) { return; }
		if ($('#gmayaui').length > 0) {
			gmAyaUiRemove(() => gmAyaUiCreate(menu));
			return;
		}
		let uiDom = $(`<div class="gmayauibg"><div id="gmayaui"><style>
		.gmayauibg{position:fixed;display:flex!important;width:100%;height:100%;top:0;left:0;right:0;bottom:0;
		 align-content:center;justify-content:center;flex-wrap:wrap;background-color:#fff1;z-index:666666!important}
		#gmayaui{margin:0 2vh;min-width:300px;min-height:300px;box-shadow:0 0 16px #2bf6;background-color:#fffc;display:none;
		 border-radius:5px;backdrop-filter:blur(6px);padding:12px;user-select:none;-webkit-user-select:none;
		 box-sizing:unset;-moz-user-select:none;-moz-box-sizing:unset;z-index:6}
		#gmayaui,#gmayaui div,#gmayaui label,#gmayaui li,#gmayaui span{outline:0!important;text-align:center!important;
		 font-weight:400!important;font-family:'Microsoft YaHei',Helvetica,'宋体',Tahoma,Arial,sans-serif!important;
		 font-size:12pt!important;border:0!important}
		#gmayaui a{color:unset!important;text-decoration:none!important;transition:color .3s}
		#gmayaui a:hover{color:#08a5ef!important}
		#gmayaui .head{position:relative;display:inline-block;width:100%}
		#gmayaui .head .title{margin:0 4vh;color:#666!important;font-size:14pt!important}
		#gmayaui .close{position:absolute;display:inline-block;width:18px;height:18px;right:2px;overflow:hidden}
		#gmayaui .close::before{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);transform:rotate(45deg)}
		#gmayaui .close::after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);transform:rotate(-45deg)}
		#gmayaui .close::after,#gmayaui .close::before{content:'';position:absolute;height:6px;width:100%;top:50%;left:0;
		 margin-top:-3px;background:#91989FCC;border-radius:4px 0;transition:background .5s}
		#gmayaui .close:focus::after,#gmayaui .close:focus::before,#gmayaui .close:hover::after,
		 #gmayaui .close:hover::before{background:#08a5ef;transition:background .5s}
		#gmayaui .body{margin-top:2vh}
		#gmayaui .wrap{position:relative;width:auto!important;height:auto!important;margin:5px;flex:1 0 50%}
		#gmayaui .wrap.w2{flex:1 0 40%}#gmayaui .wrap.w3{flex:1 0 30%}
		#gmayaui .wrap.w4{flex:1 0 20%}#gmayaui .wrap.w5{flex:1 0 10%}
		#gmayaui .item{color:#fff!important;background-color:#91989F77;position:relative;box-shadow:0 0 0 5px #0000;
		 padding:5px 8px;border-radius:5px;transition:.5s;cursor:pointer}
		#gmayaui .item:focus,#gmayaui .item:hover{background-color:#30547777}
		#gmayaui label{display:unset;margin:unset;padding:unset}
		#gmayaui input[type=radio]{display:none!important}
		#gmayaui input:checked+label .item{box-shadow:0 0 3px 1px #88ceff;background-color:#08a5ef}
		#gmayaui .content,#gmayaui .contenttips{line-height:normal!important}
		#gmayaui .contenttips::after{content:attr(tooltip);top:0;left:50%;width:100%;background-color:#ffffffe6;
		 border-radius:8px;color:#e07a22!important;padding:10px;position:absolute;text-align:center;z-index:66;
		 backdrop-filter:blur(2px);font-size:10pt!important;white-space:pre-wrap;box-shadow:0 0 8px #e827;opacity:0;
		 transition:.5s;-webkit-transform:translate(-50%,calc(-100% - 10px));
		 transform:translate(-50%,calc(-100% - 10px));pointer-events:none}
		#gmayaui .contenttips::before{content:'';position:absolute;display:none;top:0;left:50%;background-color:#0000;
		 width:0;height:0;z-index:66;backdrop-filter:blur(2px);border-left:solid 10px #0000;border-bottom:solid 10px #fffd;
		 -webkit-transform:translate(-50%,calc(-100% - 5px)) rotate(45deg);
		 transform:translate(-50%,calc(-100% - 5px)) rotate(45deg)}
		#gmayaui .contenttips:focus::after,#gmayaui .contenttips:focus::before,#gmayaui .contenttips:hover::after,
		 #gmayaui .contenttips:hover::before{opacity:1;transition:.5s}
		#gmayavruibgclose{position:absolute;width:100%;height:100%}
		#gmayaui .tabs{position:relative;margin:0 auto;width:100%;left:0!important;top:0!important;right:0!important;
		 bottom:0!important;padding:unset!important;display:block!important}
		#gmayaui .tabs nav{background:none!important;box-shadow:none!important;position: relative!important}
		#gmayaui .tabs nav ul{position:relative!important;display:flex!important;margin:0 auto!important;padding:0!important;list-style:none!important;
		 flex-flow:row wrap!important;justify-content:center!important}
		#gmayaui .tabs nav ul li{position:relative!important;display:block!important;color:#999!important;margin:0 .5em;flex:1;line-height:2.5;
		 -webkit-transition:color .3s;transition:color .3s}
		#gmayaui .tabs nav ul li:focus,#gmayaui .tabs nav ul li:hover{color:#779}
		#gmayaui .tabs nav ul li::before{content:'';position:absolute!important;top:0;left:0;z-index:-1;width:100%;height:100%;
		 background:#fff6;clip-path:inset(92% 0 0 0);-webkit-transition:background-color .3s;
		 transition:background-color .3s}
		#gmayaui .tabs nav ul li:focus::before,#gmayaui .tabs nav ul li:hover::before{background:#aab}
		#gmayaui .tabs nav ul li::after{content:'';position:absolute;left:48%;bottom:-2px;width:0;height:0;
		 margin-bottom:5px;z-index:-1;background:linear-gradient(135deg,#08a5ef 0,#08a5ef 50%,transparent 50%,transparent 100%);
		 transform:rotate(225deg);-webkit-transition:bottom .3s,width .3s,height .3s;transition:bottom .3s,width .3s,height .3s}
		#gmayaui .tabs nav ul li.tab-current,#gmayaui .tabs nav ul li.tab-current:focus,
		 #gmayaui .tabs nav ul li.tab-current:hover{color:#08a5ef}
		#gmayaui .tabs nav ul li.tab-current::before{background:#08a5ef}
		#gmayaui .tabs nav ul li.tab-current::after{bottom:-8px;width:10px;height:10px}
		#gmayaui .content-wrap section{display:none;margin:0 auto;padding-top:1em;text-align:center}
		#gmayaui .content-wrap section.content-current{display:block;animation:gmayauiani-show-tab-content ease .5s}
		#gmayaui .content-wrap{position:relative}
		#gmayaui .tab-content{display:flex!important;flex-wrap:wrap;flex-direction:row}
		@keyframes gmayauiani-show-tab-content{0%{opacity:0;clip-path:inset(0 0 60% 0)}100%{opacity:1;clip-path:inset(0)}}
		</style>
		<div class="head"><div class="title">
		<a href="${menu.title && menu.title.href ? menu.title.href : 'javascript:;'}" target="_blank">
		${menu.title && menu.title.text ? menu.title.text : GM_info.script.name}
		</a><span class="close" tabindex="0"></span></div></div>
		<div class="body"><div class="tabs"><nav><ul></ul></nav><div class="content-wrap"></div></div></div>
		</div><div id="gmayavruibgclose"></div></div>`);

		// 绑定窗口事件
		$([uiDom.find('#gmayavruibgclose'), uiDom.find('.close')]).each(function() {
			this.click(() => {
				gmAyaUiRemove();
				if (menu.onCloseing) { menu.onCloseing(); }
			});
		});

		// 构建选项卡页内容
		let fastTabId = Object.keys(menu.tabs)[0];
		for (let tabId in menu.tabs) {
			if (!menu.tabs.hasOwnProperty(tabId)){ continue; }

			// 选项卡栏
			let tabli = `<li${ fastTabId && tabId === fastTabId ? ' class="tab-current"' : '' }>
			             ${menu.tabs[tabId].title}</li>`;
			tabli = $(tabli);
			tabli.click(function () {
				uiDom.find('.tabs li.tab-current').removeClass('tab-current');
				$(this).addClass('tab-current');
				uiDom.find('section.content-current').removeClass('content-current');
				uiDom.find(`section#gmayaui-${tabId}`).addClass('content-current');
			});
			uiDom.find('.tabs>nav>ul').append(tabli);

			// 选项卡内容框架
			let tabSection = `<section id="gmayaui-${tabId}"`;
			if (fastTabId && tabId === fastTabId) {
				tabSection += ` class="content-current"`;
				fastTabId = undefined;
			}
			tabSection += `><div class="tab-content"></div></section>`
			tabSection = $(tabSection);

			// 生成选项卡内容
			for (let contentKey in menu.tabs[tabId].content) {
				let content = menu.tabs[tabId].content;
				if (!content.hasOwnProperty(contentKey)){ continue; }
				content = content[contentKey];

				// 单选按钮组
				if (/^radioButton$/i.test(contentKey)){
					let column = content.column;
					let configName = content.configName;
					let itemDom = undefined;
					let itemLastDom = undefined;
					let items = content.items;
					for (let i in items) {
						let item = items[i];
						let itemGroup = items[i].group ? items[i].group : 'gmayaui-radiobutton';
						let itemBtn = $(`<input type="radio" name="${itemGroup}" id="${itemGroup}${i}" />`);
						itemBtn.click(function () {
							if (item.onSelected) { item.onSelected(); }
							if (configName) { GM_setValue(configName, item.id); }
						});
						let itemBtnContent = $(`<label for="${itemGroup}${i}">
						    <div class="item ${item.tips ? 'contenttips' : 'content'}"
							${item.tips ? `tooltip="${item.tips}"` : ''}>${item.title}</div></label>`);
						if (item.selected) {
							if (/boolean|number/i.test(typeof(item.selected))) {
								itemBtn.prop('checked', item.selected);
							} else if (/function/i.test(typeof(item.selected))) {
								itemBtn.prop('checked', item.selected());
							}
						}
						itemDom = $(`<div class="wrap${ column > 1 && column < 6 ? ` w${column}` : '' }"></div>`);
						itemDom.append(itemBtn).append(itemBtnContent);
						if (item.isLast) {
							itemLastDom = itemDom;
							continue;
						}
						tabSection.find('.tab-content').append(itemDom);
					}
					tabSection.find('.tab-content').append(itemLastDom);
				}
				//- radioButton end -
			}
			//- 生成选项卡内容 end -

			// 装载选项卡内容
			uiDom.find('.content-wrap').append(tabSection);
		}

		// 显示界面
		$('body').append(uiDom);
		uiDom.children(':first').fadeIn('fast');
	}

	/** 移除设置界面窗口
	* @param {function} callback 关闭窗口后执行的回调方法
	*/
	function gmAyaUiRemove(callback) {
		$('#gmayaui').fadeOut('fast', function(){
			$(this).parent().remove();
			if (callback) { callback(); }
		});
	}
	//====== 文文GM设置界面窗口 END ======

	//## Catch error event
	function catchErrorEvent(err, videoObj){
		if (/NotSupportedError/gi.test(err.toString())) {
			alert(`${GM_info.script.name} - 錄影不支持\n请尝试在脚本设置中切换「视频编码类型」`);
			return;
		}
		if (/SecurityError/gi.test(err.toString())) {
			alert(`${GM_info.script.name} - 錄影权限不足\n无法对跨域的视频进行錄影`);

			if (!videoObj) { return; }

			let testVideoUri = videoObj.src;
			let testVideoSourceDom = $(videoObj).find('source:first')[0];

			if (!testVideoUri && testVideoSourceDom) {
				testVideoUri = testVideoSourceDom.src;
			}
			if (!testVideoUri || /^blob:/i.test(testVideoUri)) { return; }

			if (confirm(`${GM_info.script.name}\n发现源地址\n要尝试在新页面打开吗？`)) {
				let openUri = /\.m3u8$/gi.test(testVideoUri) ? `https://any.moest.top/m3u8get/?source=${testVideoUri}` : testVideoUri;
				openUrl(openUri);
			}

			setTimeout(() => videoObj.pause(), 100);
			return;
		}

		console.error('Aya Video Recorder', err);
		alert(`${GM_info.script.name} - 发生意外错误\n${err}`);
	}

	//## Video recording extension method
	function ExtensionVideoRecorder() {
		unsafeWindow.HTMLVideoElement.prototype.record = async function (duration_seconds = 60, btnDom = null) {
			let video;
			try {
				video = this instanceof unsafeWindow.HTMLVideoElement ? this : document.querySelector('video');
				video.captureStream = video.captureStream || video.mozCaptureStream;

				let stream = video.captureStream(60);

				let mimeType = getSelectedMimeTypeString();
				const recOption = { mimeType: mimeType };
				let recorder = new MediaRecorder(stream, recOption);

				let stopRecord = () => {
					if (recorder.state === 'recording' || recorder.state === 'paused') {
						recorder.stop();
					}
				};

				let pauseRecord = (setResume) => {
					if(!setResume && recorder.state === 'recording') {
						recorder.pause();
						return;
					}
					if(setResume && recorder.state === 'paused') {
						recorder.resume();
					}
				};

				let formatSeconds = (second) => {
					let h = Math.floor(second / 3600)
					let m = Math.floor(second / 60 % 60);
					let s = Math.floor(second % 60);
					return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
				};

				if (btnDom) {
					btnDom[0].recS = 0;
					btnChangeState(btnDom, 1);
					btnDom[0].recTimeCalc = setInterval(() => {
						if (recorder.state === 'paused') {
							btnChangeState(btnDom, 1, 1,
										   video.recordIsMuted
										   ? '由于静音錄影被迫暂停'
										   : `已暂停 ${formatSeconds(btnDom[0].recS)}`
										  );
							return;
						}
						btnDom[0].recS++;
						btnChangeState(btnDom, 1, 0,`停止 ${formatSeconds(btnDom[0].recS)}`);
					}, 1000);

					//-- listen video ended
					btnDom[0].videoEnded = () => {
						stopRecord();
						video.removeEventListener('ended', btnDom[0].videoEnded);
						btnDom[0].videoEnded = 6;
					};
					video.addEventListener('ended', btnDom[0].videoEnded);

					btnDom[0].recStop = () => {
						stopRecord();
						video.removeEventListener('ended', btnDom[0].videoEnded);
						btnDom[0].videoEnded = undefined;
					};
				}

				//-- listen video events
				video.recordPause = () => pauseRecord();
				video.recordResume = () => pauseRecord(1);
				video.videoVolumeChange = () => {
					if (video.muted || video.volume <=0) {
						pauseRecord();
						video.recordIsMuted = 1;
						return;
					}
					if (video.recordIsMuted) {
						pauseRecord(1);
						video.recordIsMuted = undefined;
					}
				}
				//- pause
				video.addEventListener('pause', video.recordPause);
				//- waiting
				video.addEventListener('waiting', video.recordPause);
				//- playing
				video.addEventListener('playing', video.recordResume);
				//- volumechange
				video.addEventListener('volumechange', video.videoVolumeChange);

				let blobs = [];
				await new Promise((resolve, reject) => {
					recorder.onstop = resolve;
					recorder.onerror = reject;
					recorder.ondataavailable = (event) => blobs.push(event.data);
					try {
						// Save the stream into memory every second to reduce the jam
						recorder.start(1000);
						return true;
					} catch(err) {
						// In FireFox
						if (btnDom) {
							clearInterval(btnDom[0].recTimeCalc);
							buttonAddOrDel(btnDom, btnDom[0].video, 1);
						}
						catchErrorEvent(err, video);
						return false;
					}
				});

				// Recording stopped
				video.removeEventListener('pause', video.recordPause);
				video.removeEventListener('waiting', video.recordPause);
				video.removeEventListener('playing', video.recordResume);
				video.removeEventListener('volumechange', video.videoVolumeChange);
				video.recordPause = video.recordResume = video.videoVolumeChange = undefined;

				if (btnDom) {
					btnDom[0].vblob = new Blob(blobs, {
						type: mimeType
					});
					btnDom[0].dlurl = URL.createObjectURL(btnDom[0].vblob);
					clearInterval(btnDom[0].recTimeCalc);
					btnChangeState(btnDom);
					if (btnDom[0].autoDL && btnDom[0].videoEnded > 5) {
						btnDom[0].videoEnded = undefined;
						createDownload(btnDom[0].dlurl);
					}
				}

				blobs = stream = recorder = undefined;
				return true;

			} catch(err) {
				catchErrorEvent(err, video);
				return false;
			}
		}
	}

	//## 新页面打开链接
	function openUrl(url){
		GM_openInTab(url, { active: true, insert: true, setParent :true });
	}

	//## 创建下载(blob链接, 下载后是否释放)
	function createDownload(dlurl, revoke) {
		let defaultFileName = `WebVideo${new Date().toLocaleString().replace(/\\|\/|:|\*|\?|\"|<|>|\|/ig, '')}`;
		let filename = ($('title').length > 0 ? $('title').text() : defaultFileName) + '.webm';
		let a = document.createElement('a');
		a.href = dlurl;
		a.download = filename;
		a.click();
		if (revoke) {
			window.URL.revokeObjectURL(dlurl);
		}
	}

	//## 向子窗口发送指令
	function sendCommandToWindow(winDom, command, parameter) {
		if (!winDom || !command) { return; }
		winDom.postMessage({
			gm : GM_info.script.namespace,
			action : command,
			value : parameter
		}, '*');
	}

	//## 转发指令 ---------------
	function forwardCommandToIframe(command, parameter) {
		$('iframe').each(function () {
			sendCommandToWindow(this.contentWindow, command, parameter);
		});
	}

	//-- 监听接收指令 --------------
	window.addEventListener('message', function(e) {
		if (!e.data || !e.data.gm || e.data.gm != GM_info.script.namespace || !e.data.action) {
			return;
		}
		switch (e.data.action) {
			case 'rebind' :
				if (!e.data.value) { break; }
				e.data.value.host = location.host;
				reBindVideoEvent(e.data.value, 1);
				break;

			case 'changemimetypeid' :
				if (!e.data.value) { break; }
				selectedMimeTypeId = e.data.value;
				GM_setValue('MimeTypeId', selectedMimeTypeId);
				break;
		}
		forwardCommandToIframe(e.data.action, e.data.value)
	});

	//-- 初始化 -------------------------------
	window.onload = function () {
		// 载入设置
		selectedMimeTypeId = parseInt(GM_getValue('MimeTypeId'));
		loadSiteButtonShowMode();

		// 5s尝试初始化
		let tryCount = 0;
		let timerInit = setInterval(() => {
			initialization();

			if (tryCount > 4 || $('style:contains(gmAyaRecBtn)').length > 0) {
				clearInterval(timerInit);
				tryCount = timerInit = undefined;
				return;
			}

			tryCount++;
		}, 1000);

		initialIsDone = !0;
	};

	//## 退出全屏时重新绑定 --------------
	$(window).resize(function () {
		let isFull = document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen;
		if (isFull === undefined || !isFull) {
			initialization();
		}
	});

	//## 初始化过程 --------------
	function initialization() {
		if ($('video').length < 1) { return; }
		if ($('style:contains(gmAyaRecBtn)').length < 1) {
			$('head').append($(`<style>
			.gmAyaRecBtn{position:absolute;left:0;top:0;display:inline-block;border-radius:4px;
			 background-color:#ff7728bb;border:none;color:#fff;text-align:center;font-size:12pt;padding:5px 10px;
			 cursor:pointer;margin:5px;font-family:"Microsoft YaHei",Arial,sans-serif;z-index:998!important;
			 transition:.5s!important;line-height:1!important}
			.gmAyaRecBtn:hover{background-color:#ff5520}
			.gmAyaRecBtn.dl{background-color:#56bb2cbb;padding-right:18px;transition:.5s}
			.gmAyaRecBtn.dl:hover{background-color:#2cbb80;transition:.5s}
			.gmAyaRecBtn span{display:inline-block;cursor:pointer;position:relative;color:#fff;transition:.5s}
			.gmAyaRecBtn span:after{content:attr(data-content-after);font-size:19pt;position:absolute;opacity:0;
			 top:-6px;margin-left:5px;color:#fff;transition:.5s}
			.gmAyaRecBtn span.rec{padding-right:18px;transition:.5s}
			.gmAyaRecBtn span.rec:after{animation:twinkle .5s infinite alternate}
			.gmAyaRecBtn span.dl,.gmAyaRecBtn span.pause{padding-right:12px;transition:.5s}
			.gmAyaRecBtn span.dl:after{font-size:12pt}
			.gmAyaRecBtn span.pause:after{font-size:10pt;font-weight:bold}
			.gmAyaRecBtn span.dl:after,.gmAyaRecBtn span.pause:after{opacity:1;top:0;animation:none}
			@keyframes twinkle{0%{opacity:.5}100%{opacity:1}}
			</style>`));
		}

		if (!unsafeWindow.HTMLVideoElement.prototype.record) {
			ExtensionVideoRecorder();
		}

		if (buttonShowMode.mode > 0) {
			bindVideoEvent(changeButtonShowMode);
			return;
		}
		bindVideoEvent();
	}

//## 绑定video hover事件
function bindVideoEventHover(videoDom) {
	videoDom.gmayavrhover = function () {
		switchButton($(videoDom));
	}
	videoDom.gmayavrunhover = function () {
		switchButton($(videoDom), 1);
	}
	videoDom.addEventListener('mouseenter', videoDom.gmayavrhover)
	videoDom.addEventListener('mouseleave', videoDom.gmayavrunhover);
	switchButton($(videoDom), 1);
}

//## 解除绑定video hover事件
function unBindVideoEventHover(videoDom) {
	if (videoDom.gmayavrhover) {
		videoDom.removeEventListener('mouseenter', videoDom.gmayavrhover);
		videoDom.gmayavrhover = undefined;
	}
	if (videoDom.gmayavrunhover) {
		videoDom.removeEventListener('mouseleave', videoDom.gmayavrunhover);
		videoDom.gmayavrunhover = undefined;
	}
}

//## 绑定video事件(每绑定一个video都会回调传入video jQuery dom)
function bindVideoEvent(callback) {
	let video = $('video');

	if (video.length > 0) {
		if (buttonShowMode.mode < 1) {
			video.each(function () {
				unBindVideoEventHover(this);
				bindVideoEventHover(this);
			});
			return;
		}

		if (buttonShowMode.mode > 0 && callback) { callback(video); }
	}
}

/*## 重新绑定video事件
	* @param {object} newButtonShowMode 新绑定的按钮模式对象
	* @param {bool} needToSave 保存按钮模式到配置
	*/
function reBindVideoEvent(newButtonShowMode, needToSave) {
	if (!newButtonShowMode) { return; }
	// 移除旧按钮
	if (buttonShowMode) {
		buttonShowMode.mode = 2;
		initialization();
	}

	// 等待删除后重新绑定
	setTimeout(() => {
		buttonShowMode = newButtonShowMode;
		initialization();
		if (needToSave) { saveSiteButtonShowMode(); }
	}, 300);
}

//## 定位按钮容器返回 jq dom
function positionButtonContainer(videoDom) {
	let inDom = videoDom[0].parentNode;
	if (buttonShowMode.layer < 11) { return $(inDom); }

	let	videoWidth = videoDom[0].clientWidth,
		videoHeight = videoDom[0].clientHeight;
	if (!videoWidth || !videoHeight) { return; }

	while (inDom && !/body|html/i.test(inDom.tagName)){
		if (inDom.clientWidth > videoWidth || inDom.clientHeight > videoHeight) {
			break;
		}
		inDom = inDom.parentNode;
	}
	inDom = buttonShowMode.layer > 11 ? (inDom.parentNode ? inDom.parentNode : inDom) : inDom;
	return $(inDom);
}

//## 显示或隐藏按钮
function switchButton(videoDom, hide) {
	if (!videoDom) { return; }
	let inDom = positionButtonContainer(videoDom);
	if (!inDom) { return; }
	let gmbtn = inDom.find('.gmAyaRecBtn');
	if (hide) {
		if (gmbtn.length < 1 || gmbtn[0].isRec || gmbtn[0].dlurl){
			return;
		}
		setTimeout(() => buttonAddOrDel(gmbtn, undefined, buttonShowMode.mode > 1), 100);
		return;
	}
	buttonAddOrDel(0, videoDom);
}

//## 改变按钮显示方式
function changeButtonShowMode(videoDom) {
	switch(buttonShowMode.mode) {
		case 1:
			videoDom.each(function(){
				switchButton($(this));
			});
			break;

		case 2:
			videoDom.each(function(){
				switchButton($(this), 1);
			});
			break;

		default:
			initialization();
			videoDom.each(function(){
				switchButton($(this), 1);
			});
	}
}

//## 添加或删除按钮(添加:无btnDom 有videoDom, 删除:有btnDom 无videoDom, 重新添加)
function buttonAddOrDel(btnDom, videoDom, reAdd) {
	// 删除
	if (!videoDom || reAdd) {
		if (!reAdd && (!btnDom || btnDom[0].hovered || btnDom[0].isRec || btnDom[0].dlurl || buttonShowMode.mode === 1)) {
			return false;
		}
		btnDom.remove();
		btnDom = undefined;
		// 删除后再添加
		if (reAdd && buttonShowMode.mode === 1) {
			buttonAddOrDel(0, videoDom)
		}
		return false;
	}

	//== 添加

	//- 定位按钮容器jq dom
	let inDom = positionButtonContainer(videoDom);

	if (!inDom || inDom.find('.gmAyaRecBtn').length > 0 || buttonShowMode.mode > 1) {
		return false;
	}

	let newBtn = $(`<a class="gmAyaRecBtn" href="javascript:;"><span>錄影</span></a>`);

	newBtn[0].video = videoDom;

	newBtn.hover(function () {
		this.hovered = 1;
	}, function () {
		this.hovered = 0;
	});

	newBtn.click(function () {
		//---- 下载
		if (this.dlurl) {
			if (confirm('要下载錄影吗？')) {
				createDownload(this.dlurl);
				return false;
			}
			if (!confirm('要重新开始錄影吗？')) {
				return false;
			}
			window.URL.revokeObjectURL(this.dlurl);
			buttonAddOrDel($(this), videoDom, 1);
			return false;
		}
		//---- 錄影
		let videoObj = videoDom[0];
		if (this.isRec) {
			//停止錄影
			videoObj.pause();
			this.recStop();
			return false;
		}
		//开始錄影
		let durs = videoObj.duration;
		if (!durs) {
			alert('无法取得视频长度');
			return false;
		}
		let videoIsPaused = videoObj.paused;
		videoObj.pause();
		if (!confirm('要开始錄影吗？')) {
			if (!videoIsPaused) {
				//延迟播放避免某些网站播放器逻辑冲突
				setTimeout(() => videoObj.play(), 800);
			}
			return false;
		}
		if (videoObj.duration != Infinity) {
			if (videoObj.currentTime > 0 && videoObj.currentTime <= videoObj.duration && confirm('要从头开始錄影吗？')) {
				videoObj.currentTime = 0;
			} else {
				durs -= videoObj.currentTime;
			}
			newBtn[0].autoDL = confirm('当錄影结束时弹出下载？');
		}

		if (videoObj.muted || videoObj.volume <= 0) {
			videoObj.muted = false;
			videoObj.volume = 0.0001;
		}

		let promise = videoObj.record(durs, newBtn);
		let promiseReturn = true;
		promise.then((result) => {
			promiseReturn = result;
		});
		setTimeout(() => {
			if (!promiseReturn) {
				if (!videoIsPaused) {
					setTimeout(() => videoObj.play(), 800);
				}
				return false;
			}
			videoObj.play();
		}, 100);

		return false;
	});
	inDom.append(newBtn);
	return false;
}

//## 改变按钮状态(按钮dom, 是否正在錄影, 錄影是否已暂停, 状态标题)
function btnChangeState(btnDom, isRecording, isPaused , title) {
	if (!btnDom) { return; }
	let btnSpan = btnDom.children(':first');
	//錄影暂停
	if (isPaused && btnDom[0].isRec > 0) {
		if (btnSpan.hasClass('pause')) { return; }
		btnSpan.text(title);
		btnSpan.attr('data-content-after', '||');
		btnDom.addClass('pause');
		btnSpan.removeClass('rec').addClass('pause');
		return;
	}
	//錄影状态
	if (isRecording) {
		btnDom[0].isRec = 1;
		btnSpan.text(title ? title : '錄影已开始');
		if (btnSpan.hasClass('rec')) { return; }
		btnSpan.attr('data-content-after', '●');
		btnDom.removeClass('pause');
		btnSpan.removeClass('pause').addClass('rec');
		return;
	}
	//停止錄影状态
	btnDom[0].isRec = 0;
	btnSpan.removeClass('rec').removeClass('pause');
	if (btnDom[0].dlurl) {
		btnSpan.text('下载錄影');
		btnSpan.attr('data-content-after', '▼');
		btnDom.addClass('dl');
		btnSpan.addClass('dl');
		return;
	}
}

})(jQuery);