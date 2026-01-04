// ==UserScript==
// @name         wedata上报事件导出csv
// @version      0.3
// @author       sun
// @description  wedata上报事件页面，增加日志的导出csv按钮
// @match        https://wedata.weixin.qq.com/mp2/report-manage/event/event_monitor*
// @match        https://wedata.weixin.qq.com/mp2/event/data_quality*
// @grant        none
// @license      GPL-3.0
// @run-at       document-end
// @namespace https://greasyfork.org/users/1422627
// @downloadURL https://update.greasyfork.org/scripts/523598/wedata%E4%B8%8A%E6%8A%A5%E4%BA%8B%E4%BB%B6%E5%AF%BC%E5%87%BAcsv.user.js
// @updateURL https://update.greasyfork.org/scripts/523598/wedata%E4%B8%8A%E6%8A%A5%E4%BA%8B%E4%BB%B6%E5%AF%BC%E5%87%BAcsv.meta.js
// ==/UserScript==

;(function () {
	const enter_scene_map = {
		1000: '其他',
		1001: '发现页小程序「最近使用」列表（基础库2.2.4-2.29.0版本包含「我的小程序」列表，2.29.1版本起仅为「最近使用」列表）',
		1005: '微信首页顶部搜索框的搜索结果页',
		1006: '发现栏小程序主入口搜索框的搜索结果页',
		1007: '单人聊天会话中的小程序消息卡片',
		1008: '群聊会话中的小程序消息卡片',
		1010: '收藏夹',
		1011: '扫描二维码',
		1012: '长按图片识别二维码',
		1013: '扫描手机相册中选取的二维码',
		1014: '小程序订阅消息（与1107相同）',
		1017: '前往小程序体验版的入口页',
		1019: '微信钱包（微信客户端7.0.0版本改为支付入口）',
		1020: '公众号 profile 页相关小程序列表（已废弃）',
		1022: '聊天顶部置顶小程序入口（微信客户端6.6.1版本起废弃）',
		1023: '安卓系统桌面图标',
		1024: '小程序 profile 页',
		1025: '扫描一维码',
		1026: '发现栏小程序主入口，「附近的小程序」列表',
		1027: '微信首页顶部搜索框搜索结果页「使用过的小程序」列表',
		1028: '我的卡包',
		1029: '小程序中的卡券详情页',
		1030: '自动化测试下打开小程序',
		1031: '长按图片识别一维码',
		1032: '扫描手机相册中选取的一维码',
		1034: '微信支付完成页',
		1035: '公众号自定义菜单',
		1036: 'App 分享消息卡片',
		1037: '小程序打开小程序',
		1038: '从另一个小程序返回',
		1039: '摇电视',
		1042: '添加好友搜索框的搜索结果页',
		1043: '公众号模板消息',
		1044: '带 shareTicket 的小程序消息卡片 详情',
		1045: '朋友圈广告',
		1046: '朋友圈广告详情页',
		1047: '扫描小程序码',
		1048: '长按图片识别小程序码',
		1049: '扫描手机相册中选取的小程序码',
		1052: '卡券的适用门店列表',
		1053: '搜一搜的结果页',
		1054: '顶部搜索框小程序快捷入口（微信客户端版本6.7.4起废弃）',
		1056: '聊天顶部音乐播放器右上角菜单',
		1057: '钱包中的银行卡详情页',
		1058: '公众号文章',
		1059: '体验版小程序绑定邀请页',
		1060: '微信支付完成页（与1034相同）',
		1064: '微信首页连Wi-Fi状态栏',
		1065: 'URL scheme 详情',
		1067: '公众号文章广告',
		1068: '附近小程序列表广告（已废弃）',
		1069: '移动应用通过openSDK进入微信，打开小程序',
		1071: '钱包中的银行卡列表页',
		1072: '二维码收款页面',
		1073: '客服消息列表下发的小程序消息卡片',
		1074: '公众号会话下发的小程序消息卡片',
		1077: '摇周边',
		1078: '微信连Wi-Fi成功提示页',
		1079: '微信游戏中心',
		1081: '客服消息下发的文字链',
		1082: '公众号会话下发的文字链',
		1084: '朋友圈广告原生页',
		1088: '会话中查看系统消息，打开小程序',
		1089: '微信聊天主界面下拉，「最近使用」栏（基础库2.2.4-2.29.0版本包含「我的小程序」栏，2.29.1版本起仅为「最近使用」栏）',
		1090: '长按小程序右上角菜单唤出最近使用历史',
		1091: '公众号文章商品卡片',
		1092: '城市服务入口',
		1095: '小程序广告组件',
		1096: '聊天记录，打开小程序',
		1097: '微信支付签约原生页，打开小程序',
		1099: '页面内嵌插件',
		1100: '红包封面详情页打开小程序',
		1101: '远程调试热更新（开发者工具中，预览 -> 自动预览 -> 编译并预览）',
		1102: '公众号 profile 页服务预览',
		1103: '发现页小程序「我的小程序」列表（基础库2.2.4-2.29.0版本废弃，2.29.1版本起生效）',
		1104: '微信聊天主界面下拉，「我的小程序」栏（基础库2.2.4-2.29.0版本废弃，2.29.1版本起生效）',
		1106: '聊天主界面下拉，从顶部搜索结果页，打开小程序',
		1107: '订阅消息，打开小程序',
		1113: '安卓手机负一屏，打开小程序（三星）',
		1114: '安卓手机侧边栏，打开小程序（三星）',
		1119: '【企业微信】工作台内打开小程序',
		1120: '【企业微信】个人资料页内打开小程序',
		1121: '【企业微信】聊天加号附件框内打开小程序',
		1124: '扫“一物一码”打开小程序',
		1125: '长按图片识别“一物一码”',
		1126: '扫描手机相册中选取的“一物一码”',
		1129: '微信爬虫访问 详情',
		1131: '浮窗（8.0版本起仅包含被动浮窗）',
		1133: '硬件设备打开小程序 详情',
		1135: '小程序profile页相关小程序列表，打开小程序',
		1144: '公众号文章 - 视频贴片',
		1145: '发现栏 - 发现小程序',
		1146: '地理位置信息打开出行类小程序',
		1148: '卡包-交通卡，打开小程序',
		1150: '扫一扫商品条码结果页打开小程序',
		1151: '发现栏 - 我的订单',
		1152: '订阅号视频打开小程序',
		1153: '“识物”结果页打开小程序',
		1154: '朋友圈内打开“单页模式”',
		1155: '“单页模式”打开小程序',
		1157: '服务号会话页打开小程序',
		1158: '群工具打开小程序',
		1160: '群待办',
		1167: 'H5 通过开放标签打开小程序 详情',
		1168: '移动/网站应用直接运行小程序',
		1169: '发现栏小程序主入口，各个生活服务入口（例如快递服务、出行服务等）',
		1171: '微信运动记录（仅安卓）',
		1173: '聊天素材用小程序打开 详情',
		1175: '视频号主页商店入口',
		1176: '视频号直播间主播打开小程序',
		1177: '视频号直播商品',
		1178: '在电脑打开手机上打开的小程序',
		1179: '#话题页打开小程序',
		1181: '网站应用打开PC小程序',
		1183: 'PC微信 - 小程序面板 - 发现小程序 - 搜索',
		1184: '视频号链接打开小程序',
		1185: '群公告',
		1186: '收藏 - 笔记',
		1187: '浮窗（8.0版本起）',
		1189: '表情雨广告',
		1191: '视频号活动',
		1192: '企业微信联系人profile页',
		1193: '视频号主页服务菜单打开小程序',
		1194: 'URL Link 详情',
		1195: '视频号主页商品tab',
		1196: '个人状态打开小程序',
		1197: '视频号主播从直播间返回小游戏',
		1198: '视频号开播界面打开小游戏',
		1200: '视频号广告打开小程序',
		1201: '视频号广告详情页打开小程序',
		1202: '企微客服号会话打开小程序卡片',
		1203: '微信小程序压测工具的请求',
		1206: '视频号小游戏直播间打开小游戏',
		1207: '企微客服号会话打开小程序文字链',
		1208: '聊天打开商品卡片',
		1212: '青少年模式申请页打开小程序',
		1215: '广告预约打开小程序',
		1216: '视频号订单中心打开小程序',
		1218: '微信键盘预览打开小程序',
		1219: '视频号直播间小游戏一键上车',
		1220: '发现页设备卡片打开小程序',
		1223: '安卓桌面Widget打开小程序',
		1225: '音视频通话打开小程序',
		1226: '聊天消息在设备打开后打开小程序',
		1228: '视频号原生广告组件打开小程序',
		1230: '订阅号H5广告进入小程序',
		1231: '动态消息提醒入口打开小程序',
		1232: '搜一搜竞价广告打开小程序',
		1233: '小程序搜索页人气游戏模块打开小游戏',
		1238: '看一看信息流广告打开小程序',
		1242: '小程序发现页门店快送模块频道页进入小程序',
		1244: '#tag搜索结果页打开小程序',
		1245: '小程序发现页门店快送搜索结果页进入小程序',
		1248: '通过小程序账号迁移进入小程序',
		1252: '搜一搜小程序搜索页「小功能」模块进入小程序',
		1254: '发现页「动态」卡片 打开小程序',
		1255: '发现页「我的」卡片 打开小程序',
		1256: 'pc端小程序面板「最近使用」列表',
		1257: 'pc端小程序面板「我的小程序」列表',
		1258: 'pc端小程序面板「为电脑端优化」模块',
		1259: 'pc端小程序面板「小游戏专区」模块',
		1260: 'pc端小程序面板「推荐在电脑端使用」列表',
		1261: '公众号返佣商品卡片',
		1265: '小程序图片详情页打开小程序',
		1266: '小程序图片长按半屏入口打开小程序',
		1267: '小程序图片会话角标打开小程序',
		1271: '微信聊天主界面下拉，「我的常用小程序」栏',
		1272: '发现页「游戏」服务tab打开小程序',
		1273: '发现页「常用的小程序」列表',
		1278: '发现页「发现小程序」列表打开小程序',
		1279: '发现页「发现小程序」合集页打开小程序',
		1280: '下拉任务栏小程序垂搜「建议使用」打开小程序',
		1281: '下拉任务栏小程序垂搜「发现小程序」打开小程序',
		1282: '听一听播放器打开小程序',
		1285: '发现页「发现小程序」短剧合集打开小程序',
		1286: '明文scheme打开小程序',
		1287: '公众号短剧贴片打开小程序',
		1292: '发现页「发现小程序」poi 详情页打开小程序',
		1293: '发现页短剧卡片追剧页打开小程序',
		1295: '下拉任务栏小程序垂搜「发现小程序」广告打开小程序',
		1296: '视频号付费短剧气泡打开小程序',
		1297: '发现-小程序-搜索「发现小程序」打开小程序',
		1298: '下拉任务栏小程序垂搜「发现小程序」打开的合集访问小程序',
		1299: '下拉任务栏小程序垂搜「发现小程序」poi 详情页打开小程序',
		1300: '发现-小程序-搜索「发现小程序」打开的合集访问小程序',
		1301: '发现-小程序-搜索「发现小程序」poi 详情页打开小程序',
		1302: 'PC端面板「发现小程序」',
		1303: '发现页短剧卡片视频流打开小程序',
		1304: '手机负一屏打开小程序（比如oppo手机）',
		1305: '公众号播放结束页打开小程序',
		1306: '公众号短剧固定选集入口打开小程序',
		1307: '发现页附近服务境外专区打开小程序',
		1308: 'PC端面板小游戏专区页面',
		1309: '公众号文章打开小游戏CPS卡片',
	}
	const tableColumn = [
		{
			key: 'event_time',
		},
		{
			key: 'event_time_desc',
			template: ({ event_time }) => new Date(event_time * 1000).toLocaleString(),
		},
		{
			key: 'eventId',
		},
		{
			key: 'eventDesc',
		},
		{
			key: 'event_value',
		},
		{
			key: 'page_path',
		},
		{
			key: 'openid',
		},
		{
			key: 'appversion',
		},
		{
			key: 'clientversion',
		},
		{
			key: 'devicemodel',
		},
		{
			key: 'devicebrand',
		},
		{
			key: 'enter_scene',
		},
		{
			key: 'enter_scene_desc',
			template: ({ enter_scene }) => enter_scene_map[enter_scene] || '',
		},
		{
			key: 'networktype',
		},
		{
			key: 'os_name',
		},
		{
			key: 'os_version',
		},
		{
			key: 'networktype',
		},
	]
	let globalNode = null
	const observer = new MutationObserver(MutationObserverCallback)
	observer.observe(document.body, { childList: true, subtree: true })
	function MutationObserverCallback(mutationsList, observer) {
		mutationsList.forEach(mutation => {
			if (globalNode) {
				return
			}
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach(node => {
					if (globalNode) {
						return
					}
					if (node.nodeType === 1 && document.querySelector('#realtime-query-panel')) {
						globalNode = document.querySelector('#realtime-query-panel').parentNode
						setTimeout(() => {
							renderExportButton()
							renderAutoCollectButton()
						}, 100)
					}
				})
			}
		})
	}
	function renderExportButton() {
		const targetElement = document.getElementById('realtime-query-panel')
		if (!targetElement) {
			return
		}
		const button = document.createElement('button')
		button.innerText = '导出CSV'
		button.setAttribute('style', 'margin-left:16px;')
		button.className = `weui-desktop-btn weui-desktop-btn_default`
		button.onclick = function () {
			exportButtonClick()
		}
		targetElement.appendChild(button)
	}
	function exportButtonClick(jsonArray, basicStartTime, basicEndTime) {
		console.log('exportButtonClick:', globalNode.__vue__.logList.length)
		if (!jsonArray) {
			jsonArray = globalNode.__vue__.logList
		}
		if (!basicStartTime) {
			basicStartTime = globalNode.__vue__.basicStartTime
		}
		basicStartTime = new Date(basicStartTime).toLocaleString().split(' ').join('_')
		if (!basicEndTime) {
			basicEndTime = globalNode.__vue__.basicEndTime
		}
		basicEndTime = new Date(basicEndTime).toLocaleString().split(' ').join('_')
		if (jsonArray && jsonArray.length) {
			const csvString = jsonToCsv(jsonArray)
			let eventName = ''
			let elementEventName = Array.from(document.querySelectorAll('[class^="conditionKey_"]')).find(e => e.textContent.trim() === '事件名称')
			if (elementEventName && elementEventName.nextElementSibling) {
				const _value = elementEventName.nextElementSibling.querySelector('input').value
				if (_value) {
					eventName = _value.split(' ').join('_')
				}
			}
			if (!eventName) {
				//单一事件
				elementEventName = document.querySelector('.pageBase__pageTitle-current')
				if (elementEventName) {
					const _value = elementEventName.textContent
					if (_value) {
						eventName = _value.split(' ').join('_')
					}
				}
			}
			const csvName = `统计报表-${eventName}-${jsonArray.length}条-${basicStartTime}-${basicEndTime}.csv`.replace(/\//g, '-')
			downloadCsv(csvString, csvName)
		}
	}
	function renderAutoCollectButton() {
		const targetElement = document.getElementById('realtime-query-panel')
		if (!targetElement) {
			return
		}
		const button = document.createElement('button')
		button.innerText = '自动采集'
		button.id = 'auto-collect-button'
		button.setAttribute('style', 'margin-left:16px;')
		button.className = `weui-desktop-btn weui-desktop-btn_default`
		button.onclick = function () {
			renderDialog()
		}
		targetElement.appendChild(button)
	}
	function renderDialog() {
		const dialog = document.createElement('dialog')
		dialog.style.width = '480px'
		dialog.style.padding = '10px'
		dialog.innerHTML = `
    <form method="dialog">
			<br /><br />
      <label for="start-time">开始时间：</label>
      <input type="datetime-local" id="start-time">
			<br /><br />
      <label for="end-time">结束时间：</label>
      <input type="datetime-local" id="end-time">
			<br /><br />
      <label for="interval-input">间隔时间（秒）：</label>
      <input type="number" id="interval-input" min="1" value="86400">
			<br /><br /><br /><br />
      <label>进度与结果：</label>
      <pre id="result-pre" style="max-height: 100px;overflow-y: auto;padding: 10px;background-color: #f4f4f4;border: 1px solid #ccc;white-space: pre-wrap;"></pre>
			<br /><br /><br /><br />
      <div class="buttons">
        <button type="reset" id="cancel-btn">取消</button>
        <button type="submit" id="start-btn">开始</button>
      </div>
    </form>
  `
		document.body.appendChild(dialog)
		setTimeout(() => {
			handleDialogAction(dialog)
		}, 300)
	}
	function handleDialogAction(dialog) {
		dialog.showModal()
		const form = dialog.querySelector('form')
		const resultPre = dialog.querySelector('#result-pre')
		 const now = new Date();
    // 今天 00:00
    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0);
    // 昨天 00:00
    const yesterdayMidnight = new Date(todayMidnight);
    yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);
		dialog.querySelector('#start-time').value =  formatDate(yesterdayMidnight)
		dialog.querySelector('#end-time').value =  formatDate(todayMidnight)
		let result = []
		let loopSwitch = false

		function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
		// 新增辅助函数：获取指定日期的 0 点 0 分
		function getMinStartOfDay() {
			const d = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
			d.setHours(0, 0, 0, 0)
			return d.getTime()
		}

		// 新增辅助函数：获取指定日期的 24 点
		function getMaxEndOfDay() {
			const d = new Date()
			d.setHours(23, 59, 59, 999)
			return d.getTime()
		}
		// 处理表单提交
		form.addEventListener('submit', async e => {
			e.preventDefault()
			if (loopSwitch) {
				return
			}
      // 2025年6月9日 0点
    //   const date1 = new Date(2025, 5, 16, 0, 0, 0); // 注意：月份从0开始，5表示6月
    //   console.log("2025-06-09 00:00:00 时间戳:", date1.getTime());
      // 2025年6月14日 24点（即6月15日0点）
    //   const date2 = new Date(2025, 5, 23, 0, 0, 0);
    //   console.log("2025-06-14 24:00:00 时间戳:", date2.getTime());
			const startTimeInput = dialog.querySelector('#start-time').value
			const endTimeInput = dialog.querySelector('#end-time').value
			const intervalInput = parseInt(dialog.querySelector('#interval-input').value, 10)

			if (!startTimeInput || !endTimeInput || isNaN(intervalInput)) {
				alert('请填写完整信息')
				return
			}

			const start = new Date(startTimeInput).getTime()
			const end = new Date(endTimeInput).getTime()

			const minStart = getMinStartOfDay()
			if (start < minStart) {
				alert(`开始时间不能早于 ${new Date(minStart).toLocaleString()}`)
				return
			}

			// 设置 end 的最小值为今天的 24 点
			const maxEnd = getMaxEndOfDay()
			if (end > maxEnd) {
				alert(`结束时间不能晚于 ${new Date(maxEnd).toLocaleString()}`)
				return
			}

			if (start >= end) {
				alert('开始时间必须早于结束时间')
				return
			}

			const intervalMs = intervalInput * 1000 // 转为毫秒
			let currentTime = start

			resultPre.textContent = '任务已启动...\n'
			loopSwitch = true
			loopSearch()
			async function loopSearch() {
				if (!loopSwitch) {
					return
				}
				if (currentTime >= end) {
					resultPre.textContent += '\n✅ 所有时间段处理完成。\n'
					loopSwitch = false
					exportButtonClick(result, start, end)
					return
				}
				const endTime = Math.min(currentTime + intervalMs, end)
				console.groupCollapsed(`fetchSearch-${new Date(currentTime).toLocaleString()}-${new Date(endTime).toLocaleString()}`);
				try {
					const { logCount, logLimit, logList } = await fetchSearch(currentTime, endTime)
					result = result.concat(logList)
					resultPre.textContent += `[${new Date(currentTime).toLocaleString()} → ${new Date(endTime).toLocaleString()}] 成功: ${JSON.stringify({
						logCount,
						logLimit,
						logList: logList.length,
					})}\n`
				} catch (err) {
					resultPre.textContent += `[${new Date(currentTime).toLocaleString()} → ${new Date(endTime).toLocaleString()}] ❌ 错误: ${err.message}\n`
				}
				console.groupEnd();
				currentTime += intervalMs
				loopSearch()
			}
			async function fetchSearch(basicStartTime, basicEndTime, retry = 0) {
				globalNode.__vue__.basicStartTime = basicStartTime
				globalNode.__vue__.basicEndTime = basicEndTime
				await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1001) + 5000))
				try {
					await globalNode.__vue__.onsubmit(false)
					let { logLimit, logCount, logList } = globalNode.__vue__
					if (logCount > logLimit) {
						// 缩短间隔继续请求
						const intervalCount = Math.floor(logCount / logLimit) + 1
						const intervalMs = Math.floor((basicEndTime - basicStartTime) / intervalCount)
						console.warn('logCount > logLimit', {
							logCount,
							logLimit,
							basicStartTime: new Date(basicStartTime).toLocaleString(),
							basicEndTime: new Date(basicEndTime).toLocaleString(),
							intervalCount,
							intervalMs,
						})
						;(logCount = 0), (logList = [])
						for (let i = 0; i < intervalCount; i++) {
							let startTime = basicStartTime + i * intervalMs
							startTime = startTime < basicStartTime ? basicStartTime : startTime
							let endTime = basicStartTime + (i + 1) * intervalMs
							endTime = endTime > basicEndTime ? basicEndTime : endTime
							const { logCount: intervalLogCount, logList: intervalLogList } = await fetchSearch(startTime, endTime, 0)
							logCount += intervalLogCount
							logList = logList.concat(intervalLogList)
							console.warn('logCount > logLimit-', i, {
								intervalLogCount,
								startTime: new Date(startTime).toLocaleString(),
								endTime: new Date(endTime).toLocaleString(),
							})
						}
					}else{
						logList = [...logList].reverse()
					}
					return {
						logLimit,
						logCount,
						logList,
					}
				} catch (error) {
					if (retry >= 5) {
						throw error
					} else {
						return fetchSearch(basicStartTime, basicEndTime, retry + 1) // 重试
					}
				}
			}
		})

		// 取消按钮逻辑
		form.querySelector('#cancel-btn').addEventListener('click', () => {
			loopSwitch = false
			resultPre.textContent += '\n❌ 已取消当前任务。\n'
			dialog.close()
			//移除dialog
			setTimeout(() => {
				document.body.removeChild(dialog)
				dialog = null
			}, 300)
		})
	}

	function jsonToCsv(jsonArray) {
		const headers = tableColumn.map(e => e.key)
		const csvRows = []
		csvRows.push(headers.join(','))
		for (const row of jsonArray) {
			const values = tableColumn.map(column => {
				const value = column.template?.(row) || row[column.key]
				return `"${value}"` // 保证每个值都用双引号包裹，避免包含逗号等特殊字符
			})
			csvRows.push(values.join(','))
		}
		return csvRows.join('\n')
	}

	// 将 CSV 数据写入文件（考虑 UTF-8 编码）
	function downloadCsv(csvString, filename) {
		const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' })
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = filename
		link.click()
	}
})()
