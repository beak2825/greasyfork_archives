// ==UserScript==
// @name               [Neko0] VRChat Limitless Favorite Avatar
// @name:zh-CN         [Neko0] VRChat 无限虚拟形象收藏夹
// @name:ja            [Neko0] VRChat 無制限の「Avatar」ブックマークフォルダ
// @description        More than 300! Expand your VRChat avatar collection to infinity!
// @description:zh-CN  不止300个！将您的VRChat Avatar虚拟形象收藏夹扩展到无限！
// @description:ja     300以上！あなたのVRChatアバターコレクションを無限に拡張しましょう！
// @version            1.2.1
// @author             Mitsuki Joe
// @namespace          neko0-web-tools
// @icon               https://assets.vrchat.com/www/favicons/favicon.ico
// @homepageURL        https://github.com/nekozero/neko0-web-tools
// @supportURL         https://t.me/+FANQrUGRV7A0YmM9
// @grant              GM_addStyle
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_xmlhttpRequest
// @grant              GM_getResourceText
// @run-at             document-idle
// @license            AGPL-3.0-or-later
// @require            https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/solid.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/fontawesome.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @require            https://cdn.jsdelivr.net/npm/axios@1.1.3/dist/axios.min.js
// @require            https://cdn.jsdelivr.net/npm/vue@2.7.14
// @require            https://cdn.jsdelivr.net/npm/vue-lazyload@1.3.3/vue-lazyload.min.js
// @require            https://unpkg.com/@popperjs/core@2
// @require            https://unpkg.com/tippy.js@6
// @require            https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/alertify.min.js
// @resource           IMPORTED_CSS_1 https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/alertify.rtl.min.css
// @match              *://vrchat.com/*
// @resource           IMPORTED_CSS_2 https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.2.2/convenience/vrchat/style.css
// @resource           html-avatar-btn https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.2.2/convenience/vrchat/html-avatar-btn.html
// @resource           html-avatar-list https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.2.2/convenience/vrchat/html-avatar-list.html
// @resource           html-btn-group https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.2.2/convenience/vrchat/html-btn-group.html
// @resource           language https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.2.2/convenience/vrchat/language.json
// @downloadURL https://update.greasyfork.org/scripts/461702/%5BNeko0%5D%20VRChat%20Limitless%20Favorite%20Avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/461702/%5BNeko0%5D%20VRChat%20Limitless%20Favorite%20Avatar.meta.js
// ==/UserScript==
/* jshint expr: true */

// #region 初始化设定
// 设置项默认值
let setting = {
	lang: 'en',
}

// 判断是否存在设定
if (GM_getValue('VLAF_setting') === undefined) {
	GM_setValue('VLAF_setting', setting)
} else {
	let store = GM_getValue('VLAF_setting')
	$.each(setting, function (i) {
		if (store[i] === undefined) {
			store[i] = setting[i]
		}
	})
	GM_setValue('VLAF_setting', store)
}

// 示例模型列表
// prettier-ignore
let avatars = [{"id":"avtr_bc6c06ec-fda2-4490-8db2-946f618dba2d","name":"贴贴小S-M子","description":"准备后续再更新几套衣服，还有道具，欢迎加群 80697161","authorId":"usr_6621262d-0005-4d37-8624-19ecd4c30a76","authorName":"铃月时雨","tags":[],"imageUrl":"https://api.vrchat.cloud/api/1/file/file_01d6551a-7cf6-4dcb-b93c-4aeaadba9815/2/file","thumbnailImageUrl":"https://api.vrchat.cloud/api/1/image/file_01d6551a-7cf6-4dcb-b93c-4aeaadba9815/2/256","releaseStatus":"public","version":30,"featured":false,"unityPackages":[{"id":"unp_8cbb9ab2-fa25-483f-8c73-850b8b993916","created_at":"2022-12-23T11:42:08.740Z","unityVersion":"2019.4.31f1c1","assetVersion":1,"platform":"standalonewindows","variant":"standard"},{"id":"unp_d1e81047-992a-4a3c-9959-c7dad0c3d246","created_at":"2023-01-04T03:08:05.858Z","assetVersion":1,"platform":"android","unityVersion":"2019.4.31f1c1","variant":"standard"}],"unityPackageUrl":"","unityPackageUrlObject":{},"created_at":"2022-12-23T11:42:08.741Z","updated_at":"2023-01-14T11:10:41.376Z","isPrivate":false,"isBroken":false,"fromWorld":{"id":"wrld_4d68dafc-8fb3-437d-9ed4-c1da29f27231","name":"M子模型房"},"labels":["Loli","Cute","Gun"],"addTime":"2022-05-01T00:00:00.000Z"},{"id":"avtr_a20ffadf-49e5-464a-86f7-c567c173d801","name":"M小龙娘ver2 -M子","description":"和ver1版本有点不一样（可能负优化所以分了两个版本，但是加了些别的功能）欢迎加群 80697161","authorId":"usr_6621262d-0005-4d37-8624-19ecd4c30a76","authorName":"铃月时雨","tags":[],"imageUrl":"https://api.vrchat.cloud/api/1/file/file_5141b6b1-c9f9-4fb2-ab33-f8a19af8fb43/2/file","thumbnailImageUrl":"https://api.vrchat.cloud/api/1/image/file_5141b6b1-c9f9-4fb2-ab33-f8a19af8fb43/2/256","releaseStatus":"public","version":11,"featured":false,"unityPackages":[{"id":"unp_1e6fe9b1-e269-4360-8ce2-966deba9f023","created_at":"2022-11-12T14:08:19.586Z","unityVersion":"2019.4.31f1c1","assetVersion":1,"platform":"standalonewindows","variant":"standard"},{"id":"unp_d8db6daf-72e3-4796-a839-12fdf51891f4","created_at":"2022-12-12T14:45:01.127Z","assetVersion":1,"platform":"android","unityVersion":"2019.4.31f1c1","variant":"standard"}],"unityPackageUrl":"","unityPackageUrlObject":{},"created_at":"2022-11-12T14:08:19.586Z","updated_at":"2023-01-02T14:13:50.273Z","isPrivate":false,"isBroken":false,"fromWorld":{"id":"wrld_4d68dafc-8fb3-437d-9ed4-c1da29f27231","name":"M子模型房"},"labels":[],"addTime":"2022-05-01T00:00:00.000Z"},{"id":"avtr_b895678c-690d-4163-8c7f-5c655c8a9492","name":"可爱小菲-M子","description":"加群加群，后续更新以后再说","authorId":"usr_6621262d-0005-4d37-8624-19ecd4c30a76","authorName":"铃月时雨","tags":[],"imageUrl":"https://api.vrchat.cloud/api/1/file/file_f0277fd4-6975-49c8-8dad-5fabefefc09c/2/file","thumbnailImageUrl":"https://api.vrchat.cloud/api/1/image/file_f0277fd4-6975-49c8-8dad-5fabefefc09c/2/256","releaseStatus":"public","version":12,"featured":false,"unityPackages":[{"id":"unp_93eabfce-7979-4c72-a0dd-527ce72e4ae3","created_at":"2023-03-26T08:57:49.023Z","unityVersion":"2019.4.31f1c1","assetVersion":1,"platform":"standalonewindows","variant":"standard"},{"id":"unp_7f09fccb-4997-4637-bcf1-f95d7a5c99c4","created_at":"2023-03-30T13:51:57.832Z","assetVersion":1,"platform":"android","unityVersion":"2019.4.31f1c1","variant":"standard"}],"unityPackageUrl":"","unityPackageUrlObject":{},"created_at":"2023-03-26T08:57:49.023Z","updated_at":"2023-04-14T10:46:13.121Z","isPrivate":false,"isBroken":false,"fromWorld":{"id":"wrld_4d68dafc-8fb3-437d-9ed4-c1da29f27231","name":"M子模型房"},"labels":["Loli"],"addTime":"2022-05-01T00:00:00.000Z"},{"id":"avtr_8b6da3f5-bd3d-4ce3-900e-7f92d40b554e","name":"M子小猫","description":"还是test阶段，有什么想加的功能可以喊我，交流群80697161","authorId":"usr_6621262d-0005-4d37-8624-19ecd4c30a76","authorName":"铃月时雨","tags":[],"imageUrl":"https://api.vrchat.cloud/api/1/file/file_416a230c-3d62-4af3-8856-5293490f2ae5/2/file","thumbnailImageUrl":"https://api.vrchat.cloud/api/1/image/file_416a230c-3d62-4af3-8856-5293490f2ae5/2/256","releaseStatus":"public","version":20,"featured":false,"unityPackages":[{"id":"unp_30d85467-9921-4c81-9338-926219c85d34","created_at":"2022-11-27T01:57:38.875Z","unityVersion":"2019.4.31f1c1","assetVersion":1,"platform":"standalonewindows","variant":"standard"},{"id":"unp_48a49a77-66f7-4e0c-b6f0-01e3346dae5d","created_at":"2022-12-11T13:08:59.003Z","assetVersion":1,"platform":"android","unityVersion":"2019.4.31f1c1","variant":"standard"}],"unityPackageUrl":"","unityPackageUrlObject":{},"created_at":"2022-11-27T01:57:38.875Z","updated_at":"2023-01-01T04:30:30.359Z","isPrivate":false,"isBroken":false,"fromWorld":{"id":"wrld_4d68dafc-8fb3-437d-9ed4-c1da29f27231","name":"M子模型房"},"labels":["Loli","Cute"],"addTime":"2022-05-01T00:00:00.000Z"},{"id":"avtr_3985e9d3-3af1-4f82-9b15-71d2d8ef02c5","name":"M理沙-M子","description":"密码加群哦~群号 80697161","authorId":"usr_6621262d-0005-4d37-8624-19ecd4c30a76","authorName":"铃月时雨","tags":[],"imageUrl":"https://api.vrchat.cloud/api/1/file/file_64c31eae-2df4-49a3-bf28-513ca0e66dd0/2/file","thumbnailImageUrl":"https://api.vrchat.cloud/api/1/image/file_64c31eae-2df4-49a3-bf28-513ca0e66dd0/2/256","releaseStatus":"public","version":23,"featured":false,"unityPackages":[{"id":"unp_99e840fd-962a-407c-954e-0f41edf173fe","created_at":"2023-01-26T14:07:58.703Z","unityVersion":"2019.4.31f1c1","assetVersion":1,"platform":"standalonewindows","variant":"standard"},{"id":"unp_3ef58cc9-6758-4960-adf1-7f9eada82539","created_at":"2023-02-22T14:43:58.158Z","assetVersion":1,"platform":"android","unityVersion":"2019.4.31f1c1","variant":"standard"}],"unityPackageUrl":"","unityPackageUrlObject":{},"created_at":"2023-01-26T14:07:58.704Z","updated_at":"2023-02-23T14:24:12.284Z","isPrivate":false,"isBroken":false,"fromWorld":{"id":"wrld_4d68dafc-8fb3-437d-9ed4-c1da29f27231","name":"M子模型房"},"labels":["Loli","Touhou"],"addTime":"2022-05-01T00:00:00.000Z"},{"id":"avtr_194c4d8e-58fe-408e-9c72-38b310250fde","name":"可爱小果冻 - M子","description":"随便改改，可以调发色大小之类的，大小需要重新载入下模型，有点bug，欢迎来群里玩 80697161","authorId":"usr_6621262d-0005-4d37-8624-19ecd4c30a76","authorName":"铃月时雨","tags":[],"imageUrl":"https://api.vrchat.cloud/api/1/file/file_ffeb727e-1fec-4376-98b0-7a801a0f6180/2/file","thumbnailImageUrl":"https://api.vrchat.cloud/api/1/image/file_ffeb727e-1fec-4376-98b0-7a801a0f6180/2/256","releaseStatus":"public","version":5,"featured":false,"unityPackages":[{"id":"unp_c8b796fa-7b07-40b1-ae3d-62dfe3e5ad05","created_at":"2022-09-30T12:54:22.956Z","unityVersion":"2019.4.31f1c1","assetVersion":1,"platform":"standalonewindows","variant":"standard"},{"id":"unp_371c8959-aca6-4f47-b1e0-3dfa434b7c62","created_at":"2022-12-11T14:22:30.390Z","assetVersion":1,"platform":"android","unityVersion":"2019.4.31f1c1","variant":"standard"}],"unityPackageUrl":"","unityPackageUrlObject":{},"created_at":"2022-09-30T12:54:22.956Z","updated_at":"2022-12-11T14:53:12.063Z","isPrivate":false,"isBroken":false,"fromWorld":{"id":"wrld_4d68dafc-8fb3-437d-9ed4-c1da29f27231","name":"M子模型房"},"labels":["Loli"],"addTime":"2022-05-01T00:00:00.000Z"}]
if (GM_getValue('VLAF_avatars') === undefined) {
	GM_setValue('VLAF_avatars', avatars)
}
// #endregion

// #region 预设函数
// 打印相关
window.log = function (...args) {
	// if (ENV.PRODUCTION) {
	// 	return false
	// }
	// 设定样式
	let style = 'color:#fff;border-radius:4px;padding:2px 4px;'
	const colors = {
		log: '#39485c',
		warn: '#face51',
		error: '#ea3324',
		success: '#64b587',
	}
	const log_functions = {
		log: console.log,
		warn: console.warn,
		error: console.error,
		success: console.info,
	}
	// 设定打印内容
	if (args.length > 1 && args[0] in colors) {
		style += 'background:' + colors[args[0]] + ';'
		if (
			window.clientType === 'wechat' ||
			window.clientType === 'miniprogram' ||
			window.clientType === 'uapp' ||
			Window.clientType === 'screen'
		) {
			let log_function = args[0] in log_functions ? log_functions[args[0]] : log_functions['log']
			log_function('[' + args[1] + ']', ...args.slice(2))
		} else {
			console.log('%c' + args[1], style, ...args.slice(2))
		}
	} else {
		console.log(...args)
	}
}
window.logRes = function (response) {
	// if (ENV.PRODUCTION) {
	// 	return false
	// }
	console.log('============')
	console.log('请求URL: ' + response.request.responseURL)
	console.log('返回Data: ')
	console.log(response.data)
	console.log('============')
}
window.logError = function (error, alert) {
	// if (ENV.PRODUCTION) {
	// 	return false
	// }
	console.log('============')
	console.log('请求数据: ')
	console.log(error.request)
	console.log('返回Error: ')
	console.log(error)
	console.log('返回Data: ')
	console.log(error.response)
	console.log('============')
}

// 提示框位置
alertify.set('notifier', 'position', 'top-center')

// 实时获取最新设置
let getSet = () => {
	return GM_getValue('VLAF_setting')
}
// 更改设置
let setSet = (key, value) => {
	let store = GM_getValue('VLAF_setting')
	store[key] = value
	GM_setValue('VLAF_setting', store)
}
// 实时获取最新模型列表
let getAvtrs = () => {
	return GM_getValue('VLAF_avatars')
}
log('success', '模型列表', getAvtrs())

// 文本内容多语言替换
let text = JSON.parse(GM_getResourceText('language'))[getSet().lang]
log('success', '当前设定', getSet())
log('success', '语言文本', text)

// 置入Style
GM_addStyle(GM_getResourceText('IMPORTED_CSS_1'))
GM_addStyle(GM_getResourceText('IMPORTED_CSS_2'))

// 正则替换DOM内“变量”
// From: https://gist.github.com/cybercase/2298e242e82d32b15787
if (!String.prototype.format) {
	String.prototype.format = function (dict) {
		return this.replace(/{(\w+)}/g, function (match, key) {
			return typeof dict[key] !== 'undefined' ? dict[key] : match
		})
	}
}

// 格式化当前时间
let getNowDate = () => {
	// 定义一个函数来补齐两位数
	function pad(num) {
		return num < 10 ? '0' + num : num
	}

	// 获取当前时间的 Date 对象
	let date = new Date()

	// 获取年月日时分秒毫秒
	let year = date.getFullYear()
	let month = pad(date.getMonth() + 1)
	let day = pad(date.getDate())
	let hour = pad(date.getHours())
	let minute = pad(date.getMinutes())
	let second = pad(date.getSeconds())
	let millisecond = pad(date.getMilliseconds())

	// 拼接成 2022-07-19T20:50:50.033Z 这种格式
	let formatted = `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}Z`

	// 打印结果
	return formatted
}

// 分页功能
let pagination = function (currentPage, itemsPerPage, array) {
	var offset = (currentPage - 1) * itemsPerPage
	return offset + itemsPerPage >= array.length
		? array.slice(offset, array.length)
		: array.slice(offset, offset + itemsPerPage)
}

// Detect error types
let detectError = msg => {
	log('error', 'ERROR', msg)
	if (msg == "You already have 50 favorite avatars in group 'avatars1'") return alertify.error(text.avatars_full)
	if (msg == 'You already have that avatar favorited') return alertify.error(text.avatars_added)
	if (msg == 'This avatar is unavailableǃ') return alertify.error(text.error_unavailable)
	if (msg == "avatar isn't public and avatar is also not owned by you") return alertify.error(text.error_private)
	if (msg == "Can't find avatarǃ" || msg == 'Avatar Not Found') return alertify.error(text.error_deleted)
	return alertify.error(text.operation_failed)
}

// #endregion

// #region 左侧导航栏
;(function () {
	// 置入DOM
	function domBtnGroup() {
		let html = GM_getResourceText('html-btn-group')
		let output = html.format(text)
		$('.leftbar .btn-group-vertical').prepend(output)
	}

	// 检测页面内容置入插件DOM
	let timer_left = setInterval(detection, 300)
	detection()
	function detection() {
		var neko0 = document.querySelector('.limitless')
		if (!neko0) {
			domBtnGroup()
		} else {
			clearInterval(timer_left)
			alertify.success(text.mounted)
		}
	}

	// 检测页面内容置入插件DOM
	let timer_class = setInterval(detection_class, 100)
	detection_class()
	function detection_class() {
		// 获取具有 title="locations" 属性的元素
		if ($('[title="download"]').length > 0 && $('.limitless').length > 0) {
			// 获取第三个到最后一个类名
			var classNamesArray = $('[title="download"]').attr('class').split(' ')
			var startIndex = 2 // 第三个类名的索引
			var endIndex = classNamesArray.length // 最后一个类名的索引

			// 提取第三个到最后一个类名并拼接成字符串
			var extractedClassNames = classNamesArray.slice(startIndex, endIndex).join(' ')
			log('log', 'extractedClassNames', extractedClassNames)
			// 将提取的类名添加到 .limitless 元素上
			$('.limitless').eq(0).addClass(extractedClassNames)
			$('.limitless').eq(0).css('display', 'flex')
			clearInterval(timer_class)
		}
	}

	// 绑定点击事件
	// 打开设置窗口
	// $('.n-box .button.switch').click(() => {
	// 	$('.n-box').toggleClass('open')
	// })

	// setTimeout(() => {
	// alertify.success("You've clicked OK")
	// window.alertify = alertify
	// }, 1000)
})()
// #endregion

// #region 功能函数
// 判断已收藏
let isInVLAF = avtr_id => {
	let store = getAvtrs()
	return store.find(obj => obj.id === avtr_id)
}
// 马上切换
let select = avtr_id => {
	url = window.location.origin + '/api/1/avatars/' + avtr_id + '/select'
	axios
		.put(url)
		.then(function (response) {
			log('success', 'ƒ Select', response)
			alertify.success(text.operation_succeeded)
		})
		.catch(function (error) {
			log('error', 'ƒ Select', error)
			detectError(error.response.data.error.message)
		})
		.finally(function () {})
}
// 收藏到系统收藏夹
let favorites = avtr_id => {
	url = window.location.origin + '/api/1/favorites'
	val = {
		type: 'avatar',
		favoriteId: avtr_id,
		tags: ['avatars1'],
	}
	axios
		.post(url, val)
		.then(function (response) {
			log('success', 'ƒ Favorites', response)
			alertify.success(text.operation_succeeded)
		})
		.catch(function (error) {
			log('error', 'ƒ Favorites', error)
			detectError(error.response.data.error.message)
		})
		.finally(function () {})
}
// 收藏到无限收藏夹
let limitless = avtr_id => {
	log('log', 'ƒ Limitless', 'START')
	url = window.location.origin + '/api/1/avatars/' + avtr_id

	let store = getAvtrs()
	const result = isInVLAF(avtr_id)

	if (result) {
		log('log', 'ƒ Limitless', 'Avatar 已存在')
		store = store.filter(function (obj) {
			return obj.id !== avtr_id
		})
		GM_setValue('VLAF_avatars', store)
		if ($('#collect').length) {
			$('#collect').removeClass('text-danger confirm-delete').children('button').removeClass('border-danger')
			$('#collect span').eq(0).text(text.btn_collect)
		}
	} else {
		log('log', 'ƒ Limitless', 'Avatar 不存在')
		let data = null
		axios
			.get(url)
			.then(function (response) {
				log('success', 'ƒ Limitless', response)
				alertify.success(text.operation_succeeded)
				data = response.data
				data.isPrivate = false
				data.isBroken = false
				data.fromWorld = {
					id: '',
					name: '',
				}
				data.labels = []
				data.addTime = getNowDate()
				store.push(data)
				GM_setValue('VLAF_avatars', store)
				if ($('#collect').length) {
					$('#collect').addClass('text-danger').children('button').addClass('border-danger')
					$('#collect span').eq(0).text(text.btn_collect_r)
				}
			})
			.catch(function (error) {
				log('error', 'ƒ Limitless', error)
			})
			.finally(function () {})
	}
}
// #endregion

// #region 不同页面匹配逻辑
let page_is_avtr_own = () => {
	return document.location.pathname === '/home/avatars'
}
let page_is_avtr_details = () => {
	return document.location.pathname.indexOf('/home/avatar/avtr_') !== -1
}
let page_is_limitless = () => {
	return document.location.pathname === '/home/limitless'
}
let page_is_favorite_avtr = () => {
	return document.location.pathname.includes('/home/favorites/avatar')
}
// #endregion

let pluginInject = () => {
	if (!page_is_limitless() && $('.neko0.limitless-list.row')[0]) {
		$('.neko0.limitless-list.row')[0].remove()
	}
	if (page_is_avtr_own()) {
		// #region 个人Avatar页
		log('log', '个人Avatar页', 'START')
		// 当前使用Avatar
		// let current_avtr_id = document.querySelector('[data-scrollkey]').getAttribute('data-scrollkey')
		// console.log(current_avtr_id)
		// let current_avtr_info = null
		// ;(function () {
		// 	url =
		// 		'https://vrchat.com/api/1/users/' +
		// 		document.querySelector('[aria-label="User Status"]').getAttribute('href').substring(11) +
		// 		'/avatar'
		// 	axios
		// 		.get(url)
		// 		.then(function (response) {
		// 			console.log(response)
		// 			current_avtr_info = response.data
		// 		})
		// 		.catch(function (error) {
		// 			console.log(error)
		// 		})
		// 		.finally(function () {

		// 		})
		// })()
		// 算了暂时先不改这个
		// endregion
	} else if (page_is_avtr_details()) {
		// #region Avatar详情页
		// 当前浏览Avatar
		let current_avtr_id = window.location.pathname.substring(13)
		log('log', 'Avatar详情页', 'START', isInVLAF(current_avtr_id), getAvtrs())

		// 置入DOM
		let domAvatar = function () {
			let html = GM_getResourceText('html-avatar-btn')
			let output = html.format(text)

			$("h4:contains('Manage Avatar')").next().attr('id', 'neko0').prepend(output)
			// .children('div:nth-child(1)')
			// .remove()

			// 获取第下面 div 的 class 并复制到第一个 div
			var secondDivClass = $('#neko0 div:nth-child(3)').attr('class')
			$('#collect').attr('class', secondDivClass)

			// 获取第下面 div 里面 button 的第三和第四个 class
			var buttonClasses = $('#neko0 div:nth-child(3) button').attr('class').split(' ')
			var thirdAndFourthClass = buttonClasses.slice(0, 1).join(' ')

			// 将第三和第四个 class 复制给第一个 div 里面的 button
			$('#collect button').addClass(thirdAndFourthClass)

			if (isInVLAF(current_avtr_id)) {
				$('#collect').addClass('text-danger').children('button').addClass('border-danger')
				$('#collect span').eq(0).text(text.btn_collect_r)
			}

			tippy('#collect', {
				content: text.tippy_collect,
			})

			$('#collect').click(() => {
				const item = $('#collect')
				console.log(item)
				console.log(item.hasClass('text-danger') && !item.hasClass('confirm-delete'))

				if (item.hasClass('text-danger') && !item.hasClass('confirm-delete')) {
					item.addClass('confirm-delete')
					item.removeClass('text-danger')
					$('#collect span').eq(0).text(text.confirm_delete)
					console.log(4)
				} else {
					limitless(current_avtr_id)
				}
			})
			$('.confirm-delete-cancel').click(() => {
				$('#collect')
					.removeClass('confirm-delete')
					.addClass('text-danger')
					.children('button')
					.addClass('border-danger')
				$('#collect span').eq(0).text(text.btn_collect_r)
			})
		}

		// 检测页面内容置入插件DOM
		new MutationObserver((_, observer) => {
			if ($("h4:contains('Manage Avatar')").length > 0 && !$('#neko0').length) {
				domAvatar()
				// 调整布局让按钮更方便点击
				$('.container > div.tw-mb-3').eq(0).prependTo('.container > div.tw-flex-wrap > div:first-child')
				$('.home-content').addClass('page_is_avtr_details')
				observer.disconnect()
			}
		}).observe(document.body, { childList: true, subtree: true })

		log('log', 'Avatar详情页', 'END')
		// #endregion
	} else if (page_is_limitless()) {
		// #region 无限Avatar页面
		log('log', '无限Avatar页面', getAvtrs(), pagination(2, 12, getAvtrs()))

		// 置入DOM
		let domLimitless = function () {
			let html = GM_getResourceText('html-avatar-list')
			let output = html
			$('.home-content').append(output)

			Vue.use(VueLazyload, {
				preLoad: 1.6,
				attempt: 1,
				adapter: {
					error(listender, Init) {
						log('error', 'error', $(listender.el).attr('img-avtr-id'), listender.el, listender, Init)
						// 追加标识
						listender.el.parentElement.parentElement.parentElement.classList.add('broken')
						// 更改描述
						listender.el.parentElement.parentElement.nextElementSibling.querySelector(
							'.description .value'
						).textContent = text.broken_description
					},
					loaded({ bindType, el, naturalHeight, naturalWidth, $parent, src, loading, error, Init }) {
						// 删除标识
						el.parentElement.parentElement.parentElement.classList.remove('broken')
					},
				},
			})

			new Vue({
				el: '#neko0',
				data: {
					text: text,
					searchQuery: '', // 用户输入的搜索内容
					selectedSearchFields: ['name'], // 默认搜索 name 字段
					itemsAll: [],
					items: [],
					// 排序顺序
					order: 'desc',
					// 排序字段
					sortBy: 'addTime',
					// 选择的标签
					selectedTags: [],
					// 是否仅安卓平台
					androidOnly: false,
					// 标签列表
					allTags: ['tag1', 'tag2', 'tag3'],
					selectedTags: [],
					// 分页
					currentPage: 1,
					itemsPerPage: 12,
					totalPages: 0,
				},
				methods: {
					// 语言切换
					languageSwitch: function () {
						getSet().lang === 'en' ? setSet('lang', 'zh_cn') : setSet('lang', 'en')
						text = JSON.parse(GM_getResourceText('language'))[getSet().lang]
						location.reload()
					},

					// 格式化时间
					getFormattedDate: () => {
						// 使用现有的补齐两位数的函数
						function pad(num) {
							return num < 10 ? '0' + num : num
						}

						// 获取当前时间的 Date 对象
						let date = new Date()

						// 获取年月日时分
						let year = date.getFullYear()
						let month = pad(date.getMonth() + 1)
						let day = pad(date.getDate())
						let hour = pad(date.getHours())
						let minute = pad(date.getMinutes())

						// 拼接成 YYYY-MM-DD-HH-mm 这种格式
						let formatted = `${year}${month}${day}-${hour}${minute}`

						// 返回结果
						return formatted
					},

					// 导出导入
					exportList: function () {
						// 将 JSON 数据转换为字符串
						const jsonString = JSON.stringify(getAvtrs())
						// 创建一个 Blob 对象
						const blob = new Blob([jsonString], { type: 'application/json' })
						// 创建一个下载链接
						const link = document.createElement('a')
						link.href = URL.createObjectURL(blob)
						const time = this.getFormattedDate()
						link.download = `LimitlessAvatars-${time}.json`
						// 模拟点击链接下载文件
						document.body.appendChild(link)
						link.click()
					},
					importList: function () {
						log('log', 'ƒ importList')
						const fileInput = document.getElementById('file-input')
						fileInput.click()
					},
					fileUpload: function () {
						log('log', 'ƒ fileUpload', 'start')
						const fileInput = document.getElementById('file-input')
						const file = fileInput.files[0]
						const reader = new FileReader()

						reader.onload = event => {
							const fileContent = event.target.result
							const jsonData = JSON.parse(fileContent)

							log('log', 'ƒ fileUpload', 'import:', jsonData)

							const A = getAvtrs()
							const B = jsonData

							const diff = _.differenceBy(B, A, 'id')
							const merge = _.concat(A, diff)

							log('log', 'ƒ fileUpload', 'merge:', merge)

							GM_setValue('VLAF_avatars', merge)
							this.items = merge
						}

						reader.readAsText(file)
					},

					// 格式化时间
					formattedDate: function (str) {
						const dateStr = str
						const date = new Date(dateStr)
						const year = date.getFullYear()
						const month = date.getMonth() + 1
						const day = date.getDate()
						const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
							.toString()
							.padStart(2, '0')}`

						// log('log', 'ƒ formattedDate', formattedDate)
						return formattedDate
					},
					hasWindows: function (obj) {
						// 定义一个变量来存储检查结果
						let hasWindows = false

						// 遍历对象中的 unityPackages 数组
						for (let package of obj.unityPackages) {
							// 如果某个元素的 platform 属性等于 standalonewindows，就将结果设为 true，并跳出循环
							if (package.platform === 'standalonewindows') {
								hasWindows = true
								break
							}
						}

						return hasWindows
					},
					hasAndroid: function (obj) {
						return _.some(
							obj.unityPackages,
							pkg => pkg.platform === 'android' && pkg.variant === 'standard'
						)
					},
					favorites: function (avtr_id) {
						favorites(avtr_id)
					},
					select: function (avtr_id) {
						select(avtr_id)
					},
					limitless: function (event, avtr_id) {
						const button = event.currentTarget
						console.log(button)
						console.log(
							button.classList.contains('text-danger') && !button.classList.contains('confirm-delete')
						)

						if (button.classList.contains('text-danger') && !button.classList.contains('confirm-delete')) {
							button.classList.add('confirm-delete')
							button.classList.remove('text-danger')
							button.querySelector('span').textContent = text.confirm_delete
							console.log(4)
						} else {
							this.limitless_doit(button, avtr_id)
						}
					},
					limitless_doit: function (button, avtr_id) {
						// 执行删除数据操作
						limitless(avtr_id)
						// 在页面上刪除该元素
						button.closest('.avatar-li').remove()
					},
					limitless_cancel: function () {
						$('.confirm-delete').removeClass('confirm-delete').addClass('text-danger border-danger')
						$('.confirm-delete span').eq(0).text(text.btn_collect_r)
					},

					// #region 搜索栏函数

					searchData: function (searchQuery, searchFields = ['name']) {
						// 如果没有输入搜索关键词，则返回原始数据
						if (!searchQuery.trim()) {
							this.currentPage = 1 // 重置当前页数
							this.loadPageData()
							this.updateTotalPages()
							return
						}

						// 搜索条件的字段（默认是name）
						const fields = ['name', ...searchFields]

						// 使用lodash过滤数据
						const result = _.filter(getAvtrs(), item => {
							// 遍历字段进行匹配
							return fields.some(field => {
								if (item[field] && item[field].toLowerCase().includes(searchQuery.toLowerCase())) {
									return true // 如果匹配成功，返回true
								}
								return false
							})
						})

						return result
					},

					// 搜索框输入时的事件处理
					onSearchChange: function () {
						// 去掉多余的空格
						this.searchQuery = this.searchQuery.trim()
						// 调用搜索函数更新数据
						this.searchAndUpdate()
					},

					// 多选框变化时的事件处理
					onSearchFieldsChange: function () {
						// 如果字段选择变化，重新更新搜索
						this.searchAndUpdate()
					},

					// 调用搜索功能并更新分页
					searchAndUpdate: function () {
						// 执行搜索
						let searchResults = this.searchData(this.searchQuery, this.selectedSearchFields)

						// 更新结果并分页
						this.itemsAll = searchResults
						this.currentPage = 1 // 重置当前页数
						this.loadPageData(this.itemsAll)
						this.updateTotalPages()
					},
					// #endregion

					// #region 筛选栏函数
					/**
					 * 排序函数
					 * @param {Array} data - 数据数组
					 * @param {String} order - 排序顺序 ('asc'或'desc')
					 * @param {String} sortBy - 排序字段 ('addTime'、'updated_at'、'name'、'authorName')
					 * @return {Array} - 排序后的数据
					 */
					sortData: function (data, order = 'asc', sortBy = 'addTime') {
						return _.orderBy(data, [sortBy], [order])
					},

					/**
					 * 分类筛选函数
					 * @param {Array} data - 数据数组
					 * @param {Array} tags - 需要包含的tag列表
					 * @return {Array} - 筛选后的数据
					 */
					filterByTags: function (data, tags = []) {
						if (tags.length === 0) return data // 如果没有选择tag，则返回全部数据
						return _.filter(data, item => _.intersection(item.tags, tags).length > 0)
					},

					/**
					 * 安卓平台筛选函数
					 * @param {Array} data - 数据数组
					 * @param {Boolean} isAndroidSelected - 是否筛选安卓平台
					 * @return {Array} - 筛选后的数据
					 */
					filterByPlatform: function (data, isAndroidSelected = false) {
						if (!isAndroidSelected) return data // 如果未勾选安卓筛选，则返回全部数据
						return _.filter(data, item =>
							_.some(item.unityPackages, pkg => pkg.platform === 'android' && pkg.variant === 'standard')
						)
					},

					/**
					 * 组合函数：按条件筛选和排序数据
					 * @param {Array} data - 数据数组
					 * @param {Object} options - 筛选和排序选项
					 * @param {Array} options.tags - 多选的tags筛选列表
					 * @param {Boolean} options.isAndroidSelected - 是否筛选安卓平台
					 * @param {String} options.order - 排序顺序 ('asc'或'desc')
					 * @param {String} options.sortBy - 排序字段 ('addTime'、'updated_at'、'name'、'authorName')
					 * @return {Array} - 经过筛选和排序后的数据
					 */
					getFilteredAndSortedData: function (data, options = {}) {
						const { tags = [], isAndroidSelected = false, order = 'asc', sortBy = 'addTime' } = options

						let result = _.cloneDeep(data)

						// 按tags筛选
						result = this.filterByTags(result, tags)

						// 按平台筛选
						result = this.filterByPlatform(result, isAndroidSelected)

						// 排序
						result = this.sortData(result, order, sortBy)

						return result
					},

					loadPageData: function (list = getAvtrs()) {
						options = {
							tags: this.selectedTags, // 根据需要选择tag
							isAndroidSelected: this.androidOnly, // 筛选安卓平台数据
							order: this.order, // 排列
							sortBy: this.sortBy, // 排序
						}
						let res = this.getFilteredAndSortedData(list, options)
						this.itemsAll = res
						console.log('getFilteredAndSortedData', res)
						this.items = pagination(this.currentPage, this.itemsPerPage, res)
					},

					// #endregion

					// #region 分页功能
					// 更新总页数
					updateTotalPages() {
						this.totalPages = Math.ceil(this.itemsAll.length / this.itemsPerPage)
						if (this.currentPage > this.totalPages) this.currentPage = this.totalPages
					},
					// 改变页码
					changePage(page) {
						if (page >= 1 && page <= this.totalPages) {
							this.currentPage = page
						}
					},
					// 上一页
					prevPage() {
						if (this.currentPage > 1) {
							this.currentPage--
						}
					},
					// 下一页
					nextPage() {
						if (this.currentPage < this.totalPages) {
							this.currentPage++
						}
					},
					// 改变每页显示数量
					onItemsPerPageChange() {
						this.currentPage = 1 // 改变显示数量后回到第一页
						this.updateTotalPages()
					},
					// 分页函数（根据原始分页函数修改）
					pagination(currentPage, itemsPerPage, array) {
						const offset = (currentPage - 1) * itemsPerPage
						return offset + itemsPerPage >= array.length
							? array.slice(offset, array.length)
							: array.slice(offset, offset + itemsPerPage)
					},

					// #endregion
				},

				watch: {
					// 监听
					// 监听 selectedTags 的变化
					selectedTags: function () {
						this.loadPageData()
						this.updateTotalPages()
					},
					// 监听 androidOnly 的变化
					androidOnly: function () {
						this.loadPageData()
						this.updateTotalPages()
					},
					// 监听 order 的变化
					order: function () {
						this.loadPageData()
						this.updateTotalPages()
					},
					// 监听 sortBy 的变化
					sortBy: function () {
						this.loadPageData()
						this.updateTotalPages()
					},
					// 监听 currentPage 的变化
					currentPage: function () {
						this.loadPageData(this.itemsAll)
					},
					itemsPerPage() {
						this.loadPageData(this.itemsAll)
						this.updateTotalPages()
					},
				},

				created: function () {
					let _this = this
					window.add_data = _this.add_data
				},
				computed: {
					// 可见的页码列表
					visiblePages() {
						const pages = []
						const startPage = Math.max(1, this.currentPage - 2)
						const endPage = Math.min(this.totalPages, this.currentPage + 2)

						for (let i = startPage; i <= endPage; i++) {
							pages.push(i)
						}
						return pages
					},
				},

				mounted() {
					tippy('.transmit', {
						content: text.tippy_transmit,
					})
					tippy('.use', {
						content: text.tippy_use,
					})
					tippy('.collect', {
						content: text.tippy_collect,
					})
					tippy('.export', {
						content: text.tippy_export,
					})
					tippy('.import', {
						content: text.tippy_import,
					})
					tippy('.minus-five', {
						content: text.minus_five,
					})
					tippy('.plus-five', {
						content: text.plus_five,
					})

					// 获取模型列表
					this.loadPageData()
					this.updateTotalPages()
				},
			})
		}

		// 检测页面内容置入插件DOM
		let detection = function () {
			var neko0 = document.querySelector('.neko0')
			if (!neko0) {
				domLimitless()
			} else {
				clearInterval(timer)
			}
		}
		let timer = setInterval(detection, 300)
		detection()
		log('log', '无限Avatar页面', 'END')
		// #endregion
	} else if (page_is_favorite_avtr()) {
		// #region 系统Avatar收藏夹
		log('log', '系统Avatar收藏夹', 'START')

		function checkForAvatarCard() {
			const avatarCardElements = document.querySelectorAll('[aria-label="Avatar Card"]')
			if (avatarCardElements.length > 0) {
				// 存在 Avatar Card 元素，执行后续内容
				clearInterval(checkInterval) // 停止定时检测
				log('log', '个人Avatar页', '已经加载 Avatar Card，执行后续内容')

				// 获取页面中所有具有 aria-label="Avatar Card" 的元素
				const avatarCards = document.querySelectorAll('[aria-label="Avatar Card"]')

				// 给定的数组
				const dataArray = getAvtrs()
				// 遍历页面中的元素
				avatarCards.forEach(avatarCard => {
					// 获取当前元素的 data-scrollkey 值
					const scrollKey = avatarCard.getAttribute('data-scrollkey')

					// 检查 scrollKey 是否存在于给定数组中的对象 id 属性中
					const match = dataArray.some(item => item.id === scrollKey)

					// 如果匹配成功，则添加类名 "in-vlaf"
					if (match) {
						// 获取[aria-label="Avatar Image"]子元素
						const avatarImage = avatarCard.querySelector('[aria-label="Avatar Image"]')

						// 检查是否找到 avatarImage 元素
						if (avatarImage) {
							// 如果找到 avatarImage 元素，则添加类名 "in-vlaf"
							avatarImage.classList.add('in-vlaf')
						}
					}
				})
			} else {
				log('log', '个人Avatar页', '尚未加载出 Avatar Card')
			}
		}

		// 设置定时检测的时间间隔（毫秒）
		const checkIntervalMs = 1000 // 1秒钟
		const checkInterval = setInterval(checkForAvatarCard, checkIntervalMs)

		// 初始时执行一次检测
		checkForAvatarCard()

		log('log', '系统Avatar收藏夹', 'END')
		// #endregion
	}
}

pluginInject()

// 监测页面变换
const _historyWrap = function (type) {
	const orig = history[type]
	const e = new Event(type)
	return function () {
		const rv = orig.apply(this, arguments)
		e.arguments = arguments
		window.dispatchEvent(e)
		return rv
	}
}
history.pushState = _historyWrap('pushState')
history.replaceState = _historyWrap('replaceState')
window.addEventListener('pushState', function (e) {
	log('log', 'change pushState')
	pluginInject()
})
window.addEventListener('replaceState', function (e) {
	log('log', 'change replaceState')
})
