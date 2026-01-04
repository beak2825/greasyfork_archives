// ==UserScript==
// @name         购物优惠券省钱助手【淘宝】，【天猫】，【京东】，历史价格，购物比价， 一键领取隐藏优惠券，长期更新，放心下载
// @namespace    http://www.ergirl.com/
// @version      1.0.16
// @description  一键领取【淘宝】，【天猫】，【京东】隐藏优惠券，购物比价，查看商品历史价格，助您购物省钱
// @author       jares chiang
// @grant        none
// @include      *://*.tmall.com/*
// @include      *://*.taobao.com/*
// @include      *://*.tmall.hk/*
// @include      *://*.jd.com/*
// @include      *://*.jd.hk/*
// @exclude      *://passport.jd.com/*
// @exclude      *://uland.taobao.com/*
// @license      MIT
// @original-license MIT
// @license      MIT
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.ergirl.com
// @run-at       document-start
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.6.3/jquery.js
// @require      https://cdn.bootcdn.net/ajax/libs/echarts/5.1.1/echarts.js
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/1.0.1/js/md5.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/Swiper/5.4.5/js/swiper.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// basic
// @require https://greasyfork.org/scripts/441330-%E5%85%AC%E5%85%B1%E5%BA%93js/code/%E5%85%AC%E5%85%B1%E5%BA%93js.js?version=1049610
// @require https://greasyfork.org/scripts/441331-md5/code/md5.js?version=1026891
// ttList
// ttDetail
// ttTop
// @require https://greasyfork.org/scripts/441333-%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E8%AF%A6%E6%83%85%E5%A4%B4%E9%83%A8%E6%8E%A8%E8%8D%90js/code/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E8%AF%A6%E6%83%85%E5%A4%B4%E9%83%A8%E6%8E%A8%E8%8D%90js.js?version=1026914
// jdHome
// @require https://greasyfork.org/scripts/441334-%E4%BA%AC%E4%B8%9C%E9%A6%96%E9%A1%B5js/code/%E4%BA%AC%E4%B8%9C%E9%A6%96%E9%A1%B5js.js?version=1079218
// jdList
// @require https://greasyfork.org/scripts/441335-%E4%BA%AC%E4%B8%9C%E5%88%97%E8%A1%A8js/code/%E4%BA%AC%E4%B8%9C%E5%88%97%E8%A1%A8js.js?version=1079215
// jdDetail
// @require https://greasyfork.org/scripts/441336-%E4%BA%AC%E4%B8%9C%E8%AF%A6%E6%83%85js/code/%E4%BA%AC%E4%B8%9C%E8%AF%A6%E6%83%85js.js?version=1153213
// jdTopRec
// @antifeature  referral-link 此提示为GreasyFork代码规范要求含有查券功能的脚本必须添加，实际使用无任何强制跳转，代码可查，请知悉。
// @downloadURL https://update.greasyfork.org/scripts/436422/%E8%B4%AD%E7%89%A9%E4%BC%98%E6%83%A0%E5%88%B8%E7%9C%81%E9%92%B1%E5%8A%A9%E6%89%8B%E3%80%90%E6%B7%98%E5%AE%9D%E3%80%91%EF%BC%8C%E3%80%90%E5%A4%A9%E7%8C%AB%E3%80%91%EF%BC%8C%E3%80%90%E4%BA%AC%E4%B8%9C%E3%80%91%EF%BC%8C%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%EF%BC%8C%E8%B4%AD%E7%89%A9%E6%AF%94%E4%BB%B7%EF%BC%8C%20%E4%B8%80%E9%94%AE%E9%A2%86%E5%8F%96%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%8C%E9%95%BF%E6%9C%9F%E6%9B%B4%E6%96%B0%EF%BC%8C%E6%94%BE%E5%BF%83%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/436422/%E8%B4%AD%E7%89%A9%E4%BC%98%E6%83%A0%E5%88%B8%E7%9C%81%E9%92%B1%E5%8A%A9%E6%89%8B%E3%80%90%E6%B7%98%E5%AE%9D%E3%80%91%EF%BC%8C%E3%80%90%E5%A4%A9%E7%8C%AB%E3%80%91%EF%BC%8C%E3%80%90%E4%BA%AC%E4%B8%9C%E3%80%91%EF%BC%8C%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%EF%BC%8C%E8%B4%AD%E7%89%A9%E6%AF%94%E4%BB%B7%EF%BC%8C%20%E4%B8%80%E9%94%AE%E9%A2%86%E5%8F%96%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%8C%E9%95%BF%E6%9C%9F%E6%9B%B4%E6%96%B0%EF%BC%8C%E6%94%BE%E5%BF%83%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
;(function () {
	;('use strict')
	/**
	 * @description: 动态创建播放路径按钮
	 * @return {*}
	 */
	class CreatPlayerBtn {
		constructor(obj) {
			this.playList = obj.playList
			this.replaceNode = obj.replaceNode
		}
		// 创建DOM
		init() {
			let that = this
			let playerBtnBox = document.createElement('div')
			playerBtnBox.className = 'player-btn-box'
			getElement('body').then((res) => {
				document.body.appendChild(playerBtnBox)
			})
			let ul = document.createElement('ul')
			playerBtnBox.appendChild(ul)
			for (let i = 0; i < this.playList.length; i++) {
				let item = this.playList[i]
				let li = document.createElement('li')
				li.setAttribute('data-item', JSON.stringify(item))
				li.innerHTML = item.name
				ul.appendChild(li)
			}
			let tips = document.createElement('div')
			tips.className = 'tips'
			tips.innerHTML = '提示：所有资源来自互联网，如有侵权告知删除！'
			playerBtnBox.appendChild(tips)
			playerBtnBox.addEventListener('click', function (e) {
				// 兼容性处理
				var event = e || window.event
				var target = event.target || event.srcElement
				that.btnClick(target)
			})
		}
		// 动态创建节点点击事件;
		btnClick(node) {
			let obj = JSON.parse(node.getAttribute('data-item'))
			// 播放链接
			let playSrc = obj.url + window.location.href
			// 替换播放节点
			let playNode = document.querySelector(this.replaceNode)
			let play = new CreatPlayer({
				playSrc: playSrc,
				playNode: playNode,
			})
			play.init()
		}
	}
	/**
	 * @description: 创建播放器替换原来播放器组件
	 * @return {*}
	 */
	class CreatPlayer {
		constructor(obj) {
			this.playSrc = obj.playSrc
			this.playNode = obj.playNode
		}
		init() {
			this.creatPlayerBox()
		}
		// 创建播放器
		creatPlayerBox() {
			this.playNode.innerHTML = ''
			this.playNode.appendChild(this.creatElement())
		}
		// 创建iframe
		creatElement() {
			let iframe = document.createElement('iframe')
			iframe.src = this.playSrc
			iframe.style.width = '100%'
			iframe.style.height = '100%'
			iframe.style.border = '0'
			iframe.id = 'player-box-iframe'
			return iframe
		}
	}
	// 视频
	function videoInit() {
		// 播放路径
		let playLineList = [
			{ name: '纯净1', url: 'https://z1.m1907.top/?jx=' },
			{ name: 'B站1', url: 'https://jx.bozrc.com:4433/player/?url=' },
			{ name: '爱豆', url: 'https://jx.aidouer.net/?url=' },
			{ name: 'CHok', url: 'https://www.gai4.com/?url=' },
			{ name: 'OK', url: 'https://okjx.cc/?url=' },
			{ name: 'RDHK', url: 'https://jx.rdhk.net/?v=' },
			{ name: '人人迷', url: 'https://jx.blbo.cc:4433/?url=' },
			{ name: '思古3', url: 'https://jsap.attakids.com/?url=' },
			{ name: '听乐', url: 'https://jx.dj6u.com/?url=' },
			{ name: '分享网', url: 'https://www.ckmov.com/?url=' },
			{ name: '虾米视频', url: 'https://jx.xmflv.com/?url=' },
		]
		let platformList = [
			{
				host: 'v.youku.com',
				pathname: 'v_show',
				element: '#player',
				numNode: '.anthology-content',
			},
			{
				host: 'www.iqiyi.com',
				pathname: 'v_',
				element: '#flashbox',
				numNode: '.qy-episode-num',
			},
			{
				host: 'www.le.com',
				pathname: 'vplay',
				element: '#le_playbox',
				numNode: '.juji_grid',
			},
			{
				host: 'v.qq.com',
				pathname: 'cover',
				element: '.container-player',
				numNode: '.episode-list-rect',
			},
		]
		platformList.forEach((item) => {
			if (window.location.host === item.host) {
				if (window.location.pathname.indexOf(item.pathname) > -1) {
					// 创建播放器
					let playerBtn = new CreatPlayerBtn({
						playList: playLineList,
						replaceNode: item.element,
					})
					// 播放按钮初始化
					playerBtn.init()
				}
				getElement(item.numNode).then((res) => {
					res.onclick = function () {
						setTimeout(() => {
							location.reload()
						}, 1000)
					}
				})
			}
		})
	}
	// 音乐
	function musicInit() {
		setTimeout(() => {
			getMusicName()
		}, 2000)
	}
	// 获取音乐名称
	function getMusicName() {
		let name = ''
		// let platformList = [
		// 	{
		// 		host: 'music.163.com',
		// 		href: 'song',
		// 		element: '.f-ff2',
		// 		type: 'innerHTML',
		// 	},
		// 	{
		// 		host: 'y.qq.com',
		// 		href: 'songDetail',
		// 		element: '.data__name_txt',
		// 		type: 'title',
		// 	},
		// 	{
		// 		host: 'www.kugou.com',
		// 		href: 'song',
		// 		element: '.audioName',
		// 		type: 'title',
		// 	},
		// 	{
		// 		host: 'kuwo.cn',
		// 		href: 'play_detail',
		// 		element: '#songinfo-name',
		// 		type: 'value',
		// 	},
		// ]
		// for (let i = 0; i < platformList.length; i++) {
		// 	let item = platformList[i]
		// 	if (window.location.host === item.host) {
		// 		if (window.location.href.indexOf(item.href) > -1) {
		// 			let ele = document.querySelector(item.element)
		// 			if (ele) {
		// 				name = ele.type
		// 			}
		// 		}
		// 	}
		// }
		// getMusicList(name)
		// 网易云音乐
		if (
			window.location.host === 'music.163.com' &&
			window.location.href.indexOf('song') > -1
		) {
			let ele = document.querySelector('.f-ff2')
			name = ele.innerHTML
		} else if (
			// qq音乐
			window.location.host === 'y.qq.com' &&
			window.location.href.indexOf('songDetail') > -1
		) {
			let ele = document.querySelector('.data__name_txt')
			name = ele.title
		} else if (
			// 酷狗
			window.location.host === 'www.kugou.com' &&
			window.location.href.indexOf('song') > -1
		) {
			let ele = document.querySelector('.audioName')
			name = ele.title
		} else if (
			// 酷我
			window.location.host === 'kuwo.cn' &&
			window.location.href.indexOf('play_detail') > -1
		) {
			let ele = document.querySelector('#songinfo-name')
			name = ele.value
		} else {
			return false
		}
		getMusicList(name)
	}
	// 获取音乐列表
	function getMusicList(name) {
		let pageNum = 0
		let pageSize = 10
		let details = {
			method: 'GET',
			timeout: 10000,
			url:
				'https://api.ergirl.com/getMusic?name=' +
				name +
				'&pageNum=' +
				pageNum +
				'&pageSize=' +
				pageSize,
			responseType: 'json',
			onload: function (res) {
				if (res.status === 200) {
					let data = eval('(' + res.responseText + ')')
					let arr = data.abslist
					let newArr = []
					arr.forEach((item) => {
						let o = {
							id: item.MUSICRID,
							name: item.NAME,
							artist: item.ARTIST,
							album: item.ALBUM,
							img:
								'https://img2.kuwo.cn/star/albumcover/' +
								item.web_albumpic_short,
						}
						newArr.push(o)
					})
					let params = {
						playList: newArr,
					}
					let music = new CreateMusicPlayer(params)
					music.init()
				} else {
					console.error(res)
				}
			},
			ontimeout: (res) => {
				console.error(res)
			},
			onerror: (res) => {
				console.error(res)
			},
		}
		GM_xmlhttpRequest(details)
	}
	// 音乐类
	class CreateMusicPlayer {
		constructor(option) {
			this.audio = null
			this.playList = option.playList
		}
		init() {
			this.creatElement()
		}
		// 创建div
		creatElement() {
			let that = this
			let ele = document.createElement('div')
			ele.className = 'music-player'
			let ul = document.createElement('ul')
			ele.appendChild(ul)
			for (let i = 0; i < this.playList.length; i++) {
				// 名称
				let item = this.playList[i]
				let li = document.createElement('li')
				let nameEle = document.createElement('span')
				nameEle.className = 'name'
				nameEle.innerHTML = item.name + ' - ' + item.artist
				// 暂停
				let pauseEle = document.createElement('span')
				pauseEle.className = 'pause'
				pauseEle.setAttribute('data-id', item.id)
				pauseEle.innerHTML = '暂停'
				pauseEle.addEventListener('click', function (e) {
					// 兼容性处理
					var event = e || window.event
					var target = event.target || event.srcElement
					that.audio.pause()
					li.classList.remove('active')
				})
				// 播放
				let playEle = document.createElement('span')
				playEle.className = 'play'
				playEle.setAttribute('data-id', item.id)
				playEle.innerHTML = '试听'
				playEle.addEventListener('click', function (e) {
					// 兼容性处理
					var event = e || window.event
					var target = event.target || event.srcElement
					let id = target.getAttribute('data-id')
					let liList = document
						.querySelector('.music-player')
						.querySelectorAll('li')
					Array.prototype.forEach.call(liList, (el) => {
						el.classList.remove('active')
					})
					if (that.audio) {
						that.audio.pause()
					}
					li.classList.add('active')
					that.play(id)
				})
				// 下载
				let downEle = document.createElement('span')
				downEle.className = 'down'
				downEle.setAttribute('data-id', item.id)
				downEle.innerHTML = '下载'
				downEle.addEventListener('click', function (e) {
					// 兼容性处理
					var event = e || window.event
					var target = event.target || event.srcElement
					let id = target.getAttribute('data-id')
					that.download(id, item.name)
				})
				li.appendChild(nameEle)
				li.appendChild(pauseEle)
				li.appendChild(playEle)
				li.appendChild(downEle)
				ul.appendChild(li)
			}
			let tips = document.createElement('div')
			tips.className = 'tips'
			tips.innerHTML = '提示：所有资源来自互联网，如有侵权告知删除！'
			ele.appendChild(tips)
			document.body.appendChild(ele)
		}
		getUrl(id) {
			let url = 'https://api.ergirl.com/getMusicUrl'
			return new Promise(function (resolve, reject) {
				let details = {
					method: 'GET',
					timeout: 10000,
					url: url + '?id=' + id,
					responseType: 'json',
					onload: function (res) {
						if (res.status === 200) {
							resolve(res.response)
						} else {
							console.error(res)
						}
					},
					ontimeout: (res) => {
						console.error(res)
					},
					onerror: (res) => {
						console.error(res)
					},
				}
				GM_xmlhttpRequest(details)
			})
		}
		async play(id) {
			const { url } = await this.getUrl(id)
			if (this.audio) {
				this.audio.pause()
			}
			this.audio = new Audio()
			this.audio.src = url
			this.audio.play()
		}
		pause() {
			this.audio.pause()
		}
		async download(id, name) {
			const { url } = await this.getUrl(id)
			GM_download(url, name + '.mp3')
		}
	}
	// 短视频
	function shortVideoInit() {
		if (window.location.host === 'www.douyin.com') {
			if (window.location.href.indexOf('video') > -1) {
				let div = document.createElement('div')
				div.innerHTML = '下载'
				div.className = 'dy-down-btn'
				div.addEventListener('click', function (e) {
					let id = getDyId()
					getDyUrl(id)
				})
				document.querySelector('.xg-right-grid').appendChild(div)
			} else {
				dyAddBtn()
				scrollListener(() => {
					dyAddBtn()
				})
			}
		}
	}
	// 添加下载按钮
	function dyAddBtn() {
		// 移除下载按钮
		var oWrap = document.querySelector('.dy-down-btn')
		if (oWrap) {
			oWrap.remove()
		}
		let node = document.querySelector('.swiper-slide-active')
		let id = node
			.querySelector('.video-info-detail')
			.getAttribute('data-e2e-aweme-id')
		let div = document.createElement('div')
		div.innerHTML = '下载'
		div.className = 'dy-down-btn'
		div.setAttribute('data-id', id)
		div.addEventListener('click', function (e) {
			// 兼容性处理
			var event = e || window.event
			var target = event.target || event.srcElement
			let id = target.getAttribute('data-id')
			getDyUrl(id)
		})
		node.querySelector('.xg-right-grid').appendChild(div)
	}
	// 获取抖音ID
	function getDyId() {
		var href = window.location.href
		var index = href.lastIndexOf('/')
		id = href.substring(index + 1, href.length)
		return id
	}
	// 获取链接
	function getDyUrl(id) {
		id = id || getDyId()
		let url = 'https://api.ergirl.com/getDYInfo/web/api/v2/aweme/iteminfo/'
		let details = {
			method: 'GET',
			timeout: 10000,
			url: url + '?item_ids=' + id,
			responseType: 'json',
			onload: function (res) {
				if (res.status === 200) {
					let data = res.response
					let vid = data.item_list[0].video.vid
					let url = 'https://aweme.snssdk.com/aweme/v1/play/?video_id=' + vid
					let title = data.item_list[0].share_info.share_title
					GM_download(url, title + '.mp4')
				} else {
					console.error(res)
				}
			},
			ontimeout: (res) => {
				console.error(res)
			},
			onerror: (res) => {
				console.error(res)
			},
		}
		GM_xmlhttpRequest(details)
	}
	// 文库
	class Library {
		constructor() {
			this.arr = []
			this.html = ''
		}
		init() {
			let that = this
			document.addEventListener('DOMContentLoaded', () => {
				const originObj = {
					context2DPrototype: unsafeWindow.document
						.createElement('canvas')
						.getContext('2d').__proto__,
				}
				document.createElement = new Proxy(document.createElement, {
					apply: function (target, thisArg, argumentsList) {
						const ele = Reflect.apply(target, thisArg, argumentsList)
						const data = {
							canvas: ele,
							data: [],
						}
						if (argumentsList[0] === 'canvas') {
							ele.getContext('2d').fillText = function (...args) {
								data.data.push(args)
								originObj.context2DPrototype.fillText.apply(this, args)
							}
							that.arr.push(data)
						}
						return ele
					},
				})
				that.createCopy()
			})
		}
		createCopy() {
			let that = this
			let copy = document.createElement('div')
			copy.innerHTML = '复制'
			copy.class = 'copy'
			copy.style.position = 'absolute'
			copy.style.zIndex = '99999'
			copy.style.top = '50%'
			copy.style.padding = '10px'
			copy.style.backgroundColor = '#ccc'
			copy.style.cursor = 'pointer'
			document.body.appendChild(copy)
			copy.addEventListener('click', function (e) {
				// 兼容性处理
				var event = e || window.event
				var target = event.target || event.srcElement
				let copyBox = document.querySelector('.copy-box')
				if (copyBox) {
					copyBox.remove()
				}
				that.createHtml()
				that.createBox()
			})
		}
		createBox() {
			let that = this
			let box = document.createElement('div')
			box.innerHTML = ''
			box.className = 'copy-box'
			box.style.width = '60%'
			box.style.height = '600px'
			box.style.backgroundColor = '#fff'
			box.style.position = 'absolute'
			box.style.zIndex = '99999'
			box.style.top = '50%'
			box.style.left = '50%'
			box.style.transform = 'translate(-50%,-50%)'
			box.style.boxShadow = '0 0 10px #ccc'
			box.innerHTML =
				'<ul style="height: 100%;overflow: auto;position: relative;">' +
				that.html +
				'</ul>'
			let close = document.createElement('span')
			close.style.position = 'absolute'
			close.style.top = '10px'
			close.style.right = '30px'
			close.style.zIndex = '999999'
			close.style.cursor = 'pointer'
			close.innerHTML = '关闭'
			close.addEventListener('click', function (e) {
				// 兼容性处理
				var event = e || window.event
				var target = event.target || event.srcElement
				that.closeBox()
			})
			box.appendChild(close)
			document.body.appendChild(box)
		}
		closeBox() {
			let that = this
			that.arr = []
			let copyBox = document.querySelector('.copy-box')
			copyBox.remove()
		}
		createHtml() {
			let that = this
			that.html = ''
			let reader = document.querySelector('#reader-container')
			if (reader) {
				that.html = reader.innerHTML
			} else {
				let arr = that.arr.filter((item) => item.canvas.id)
				arr.forEach((item, index) => {
					item.data.forEach((child, idx) => {
						that.html +=
							'<p style="position:absolute;left: ' +
							child[1] +
							'px;top:' +
							child[2] +
							'px;">' +
							child[0] +
							'</p>'
					})
				})
			}
		}
	}
	function libraryInit() {
		if (window.location.host === 'wenku.baidu.com') {
			if (window.location.pathname.indexOf('/view') > -1) {
				let library = new Library()
				library.init()
				window.addEventListener('pushState', function (e) {
					library.closeBox()
				})
			}
		}
	}
	musicInit()
	setTimeout(() => {
		shortVideoInit()
	}, 2000)
	videoInit()
	libraryInit()
	// --------------------列表功能开始--------------------
	/**
	 * @description: 查询列表优惠券
	 * @param {*} appkey
	 * @param {*} sid
	 * @param {*} pid
	 * @param {*} num_iid
	 * @param {*} signurl
	 * @param {*} type
	 * @return {*}
	 */
	class TList {
		constructor(options) {
			this.params = {
				appkey: options.appkey,
				sid: options.sid,
				pid: options.pid,
				num_iid: options.num_iid,
				signurl: options.signurl,
				type: options.type,
			}
		}
		// 初始化
		init() {
			setTimeout(() => {
				this.getData()
			}, 1000)
		}
		// 获取数据
		getData() {
			let _this = this
			let list = $('.J_MouserOnverReq')
			if (_this.params.type === 'taobao') {
				list = $('.J_MouserOnverReq')
				list.each(function () {
					let that = $(this)
					that.css({ position: 'relative' })
					let params = {
						appkey: _this.params.appkey,
						tao_id: $(this).find('a').attr('data-nid'), // 接口更换了taoid
					}
					dtd(
						'https://api.zhetaoke.com:10002/api/api_detail.ashx',
						params,
						(res) => {
							let tao_id = JSON.parse(res).content[0].tao_id
							_this.params.num_iid = tao_id
							let url =
								'https://api.zhetaoke.com:10001/api/open_gaoyongzhuanlian.ashx'
							dtd(url, _this.params, (res) => {
								_this.addEle(that, res)
							})
						}
					)
				})
			} else if (_this.params.type === 'tmall') {
				list = $('.product')
				list.each(function () {
					let that = $(this)
					let params = {
						appkey: _this.params.appkey,
						tao_id: $(this).attr('data-id'), // 接口更换了taoid
					}
					dtd(
						'https://api.zhetaoke.com:10002/api/api_detail.ashx',
						params,
						(res) => {
							let tao_id = JSON.parse(res).content[0].tao_id
							_this.params.num_iid = tao_id
							let url =
								'https://api.zhetaoke.com:10001/api/open_gaoyongzhuanlian.ashx'
							dtd(url, _this.params, (res) => {
								_this.addEle(that, res)
							})
						}
					)
				})
			}
		}
		// 插入元素
		addEle(that, data) {
			let obj = JSON.parse(data)
			if (obj.tbk_privilege_get_response) {
				let result = obj.tbk_privilege_get_response.result
				if (result.data.coupon_info) {
					let html =
						"<div class='jar-list-coupon'><p><a target='_blank' href=https://api.ergirl.com/jump.html?url=" +
						result.data.shorturl +
						'>' +
						result.data.coupon_info +
						'</a></p></div>'
					that.append(html)
				}
			} else {
				// console.log("无");
			}
		}
	}

	/**
	 * @description: 列表头部推荐
	 * @param {*} type tb tm
	 * @param {*} data 数据源
	 * @return {*}
	 */
	class ListRec {
		constructor(options) {
			this.type = options.type
			this.data = options.data
		}
		// 初始化
		init() {
			this.addEle(this.data)
		}
		// 淘宝添加元素
		addEle(data) {
			let that = this
			let list = data
			let html = ''
			let html1 =
				'<div class="m-itemlist jar-list-rec">' +
				'<div class="grid g-clearfix">' +
				'<div class="swiper-container">' +
				'<div class="swiper-wrapper">'
			let html3 =
				'</div><div class="swiper-button-prev" style="width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)"></div>' +
				'<div class="swiper-button-next" style="width:45px;height:100px;color: #f40;margin-top:-50px;margin-right: 20px;background:rgba(0,0,0,0.4);"></div>' +
				'</div></div></div>'
			list.forEach((item) => {
				turnUrl(item.tao_id).then((res) => {
					that.recChangeUrl(res)
				})
				if (that.type === 'taobao') {
					let html2 =
						'<div class="swiper-slide">' +
						'<div class="items" data-id="' +
						item.tao_id +
						'">' +
						'<div class="item J_MouserOnverReq" style="height: 365px;">' +
						'<div class="pic-box J_MouseEneterLeave J_PicBox">' +
						'<div class="pic-box-inner">' +
						'<div class="pic">' +
						'<a class="pic-link J_ClickStat J_ItemPicA" data-nid="' +
						item.tao_id +
						'" href="' +
						item.item_url +
						'" target="_blank">' +
						'<img class="J_ItemPic img" src="' +
						item.pict_url +
						'" alt="' +
						item.tao_title +
						'">' +
						'</a></div></div></div>' +
						'<div class="ctx-box J_MouseEneterLeave J_IconMoreNew">' +
						'<div class="row row-1 g-clearfix">' +
						'<div class="price g_price g_price-highlight">' +
						'<span>¥</span><strong>' +
						item.quanhou_jiage +
						'</strong>' +
						'</div>' +
						'<div class="deal-cnt">' +
						item.volume +
						'人付款</div>' +
						'</div>' +
						'<div class="row row-2 title">' +
						'<a class="J_ClickStat" href="' +
						item.item_url +
						'" target="_blank">' +
						item.tao_title +
						'</a></div></div></div></div></div>'
					html += html2
				} else if (that.type === 'tmall') {
					let html2 =
						'<div class="swiper-slide">' +
						'<div class="items product" data-id="' +
						item.tao_id +
						'" style="width:100%;height:315px;">' +
						'<div class="product-iWrap">' +
						'<div class="productImg-wrap">' +
						'<a href="' +
						item.item_url +
						'" class="productImg" target="_blank">' +
						'<img src="' +
						item.pict_url +
						'">' +
						'</a>' +
						'</div>' +
						'<p class="productPrice">' +
						'<em title="' +
						item.quanhou_jiage +
						'"><b>¥</b>' +
						item.quanhou_jiage +
						'</em>' +
						'</p>' +
						'<p class="productTitle">' +
						'<a href="' +
						item.item_url +
						'">' +
						item.tao_title +
						'</a>' +
						'</p>' +
						'</div>' +
						'</div>' +
						'</div>'
					html += html2
				}
			})
			if (this.type === 'taobao') {
				$('#mainsrp-related').append(html1 + html + html3)
			} else if (this.type === 'tmall') {
				$('#J_NavAttrsForm').append(html1 + html + html3)
			}
			this.swiperInit()
		}
		// 淘宝推荐天猫推荐插入优惠券
		recChangeUrl(data) {
			let obj = data
			let node = $('.jar-list-rec .items[data-id="' + obj.item_id + '"]')
			if (obj.coupon_info) {
				let html =
					"<div class='jar-list-coupon' style='right:22px;bottom:0;'><p><a target='_blank' href=https://api.ergirl.com/jump.html?url=" +
					obj.shorturl +
					'>' +
					obj.coupon_info +
					'</a></p></div>'
				node.append(html)
			}
		}
		// 轮播图初始化
		swiperInit() {
			let num = 0
			if (this.type === 'taobao') {
				num = 4
			} else if (this.type === 'tmall') {
				num = 5
			}
			var mySwiper = new Swiper('.swiper-container', {
				slidesPerView: num,
				slidesPerGroup: num,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
			})
		}
	}
	// 列表初始化
	initTlist()

	/**
	 * @description: 淘宝天猫列表初始化入口
	 * @return {*}
	 */
	function initTlist() {
		if (host.indexOf('taobao') > -1) {
			if (host.indexOf('item.taobao') === -1) {
				setTimeout(() => {
					let node = $('#mainsrp-itemlist')[0] || $('#listsrp-itemlist')[0]
					domAddEventListener(node, () => {
						let tList = new TList({
							appkey: config.zhetaoke.appkey,
							sid: config.zhetaoke.sid,
							pid: config.zhetaoke.pid,
							num_iid: '',
							signurl: 4,
							type: 'taobao',
						})
						tList.init()
					})
				}, 3000)
				let tList = new TList({
					appkey: config.zhetaoke.appkey,
					sid: config.zhetaoke.sid,
					pid: config.zhetaoke.pid,
					num_iid: '',
					signurl: 4,
					type: 'taobao',
				})
				tList.init()
			}
			// 淘宝列表推荐
			listRecInit('taobao')
		} else if (host.indexOf('tmall') > -1) {
			let tmList = new TList({
				appkey: config.zhetaoke.appkey,
				sid: config.zhetaoke.sid,
				pid: config.zhetaoke.pid,
				num_iid: '',
				signurl: 4,
				type: 'tmall',
			})
			tmList.init()
			// 天猫列表推荐
			listRecInit('tmall')
		}
	}
	/**
	 * @description: 淘宝天猫列表推荐初始化
	 * @param {*} type 类别
	 * @return {*}
	 */
	async function listRecInit(type) {
		let q = getQueryVariable('q')
		if (!q) {
			return false
		}
		let url = 'https://api.zhetaoke.com:10003/api/api_quanwang.ashx'
		let params = {
			appkey: config.zhetaoke.appkey,
			page: '1',
			page_size: '20',
			sort: 'sale_num_desc',
			q: q,
			youquan: '1',
		}
		if (type === 'tmall') {
			let qq = ''
			try {
				//utf-8
				qq = decodeURI(q)
			} catch (err) {
				//gbk or 其他编码
				let pro = new Promise(function (resolve, reject) {
					urldecode(q, 'gbk', function (str) {
						if (str) {
							resolve(str)
						} else {
							reject('')
						}
					})
				})
				qq = await pro
			}
			params.q = qq
		}
		dtd(url, params, (res) => {
			let listRec = new ListRec({
				type: type,
				data: JSON.parse(res).content,
			})
			listRec.init()
		})
	}
	/**
	 * @description: 详情
	 * @param {*} appkey
	 * @param {*} sid
	 * @param {*} pid
	 * @param {*} num_iid
	 * @param {*} signurl
	 * @return {*}
	 */
	// --------------------列表功能结束--------------------
	// --------------------详情功能开始--------------------
    // 获取新ID
	class GetNewId {
		constructor(options) {
			this.id = ''
		}
		async getNewId() {
			let paramsDetail = {
				appkey: '52b273a5972949388ce7b57b84453aa4',
				tao_id: getQueryVariable('id'), // 接口更换了taoid
			}
			// 获取详情 拿coupon_id 判断
			const urlDetail = new URL(
				'https://api.zhetaoke.com:10002/api/api_detail.ashx'
			)
			urlDetail.search = new URLSearchParams(paramsDetail).toString()
			let resDetail = await fetch(urlDetail)
			const resDetailContent = await resDetail.json()
			let objDetail = resDetailContent.content[0]

			let paramsList = {
				appkey: '52b273a5972949388ce7b57b84453aa4',
				page_size: 120,
				sort: 'new',
				tj: objDetail.user_type,
				yunfeixian: objDetail.yunfeixian,
				pinpai: objDetail.pinpai,
				q: objDetail.shop_title + objDetail.tao_title,
			}
			const urlList = new URL('https://api.zhetaoke.com:10001/api/api_all.ashx')
			urlList.search = new URLSearchParams(paramsList).toString()
			let resList = await fetch(urlList)
			const resListContent = await resList.json()
			let newArr = resListContent.content.filter((item) => {
				return item.coupon_id === objDetail.coupon_id
			})
			if (newArr.length > 0) {
				this.id = newArr[0].tao_id
			}
			return this.id
		}
	}
	class Detail {
		constructor(options) {
			this.couParams = {
				appkey: options.appkey,
				sid: options.sid,
				pid: options.pid,
				num_iid: options.num_iid,
				signurl: options.signurl,
			}
			this.couParams.sign = makeSign(this.couParams)
		}
		// 获取淘宝天猫优惠券
		getCoupon() {
			let that = this
			let url = 'https://api.zhetaoke.com:10001/api/open_gaoyongzhuanlian.ashx'
			let params = this.couParams
			dtd(url, params, (res) => {
				let data = JSON.parse(res)
				if (data.tbk_privilege_get_response) {
					that.addCoupon(res)
				}
			})
		}
		// 插入基本元素
		addBasic() {
			let html =
				'<div class="jar-detail-coupon">' +
				'<div class="jar-tab" >' +
				'<ul>' +
				'<li class="active">领券</li>' +
				'<li>相似比价</li>' +
				'<li>价格趋势</li>' +
				'</ul><span class="jar-show">隐藏</span>' +
				'</div >' +
				'<div class="jar-body">' +
				'<ul>' +
				'<li>' +
				'<div class="jar-body-coupon">' +
				'<div class="jar-body-coupon-top"></div>' +
				'<div class="clear"></div>' +
				'<div class="jar-body-coupon-right">温馨提示: <br><span><a href="https://www.ergirl.com" rel="noreferrer nofollow" target="_blank">扫码小程序查询更多优惠券</a></span><img style="width: 118px;position: absolute;top: -10px;left:180px" src="https://api.ergirl.com/images/mp-code.jpg" />' +
				'</div>' +
				'</div>' +
				'</li>' +
				'<li>' +
				'<div class="jar-like-list">' +
				'</div> ' +
				'</li>' +
				'<li>' +
				'<div class="jar-history">' +
				'<div id="historyChart" style="width: 468px; height: 200px;"></div>' +
				'</div>' +
				'</li>' +
				'</ul>' +
				'</div>' +
				'</div >'
			if (host.indexOf('taobao') > -1) {
				// 插入淘宝
				$('#J_juValid').before(html)
			} else if (host.indexOf('tmall') > -1) {
				// 插入天猫
				if ($('.tb-action').length > 0) {
					$('.tb-action').before(html)
				} else if ($('.BasicContent--sku--6N_nw6c').length > 0) {
					$('.BasicContent--sku--6N_nw6c').before(html)
				}
			}
			$('.jar-detail-coupon .jar-tab li').click(function () {
				let index = $(this).index()
				$('.jar-detail-coupon .jar-tab li').removeClass('active')
				$(this).addClass('active')
				$('.jar-detail-coupon .jar-body li').hide()
				$('.jar-detail-coupon .jar-body li').eq(index).show()
			})
			$('.jar-show').click(function () {
				if ($('.jar-show').html() == '隐藏') {
					$('.jar-show').html('展开')
				} else {
					$('.jar-show').html('隐藏')
				}
				$('.jar-detail-coupon .jar-body').toggle()
			})
		}
		// 插入淘宝天猫优惠券
		addCoupon(data) {
			let obj = JSON.parse(data)
			if (obj.tbk_privilege_get_response) {
				let result = obj.tbk_privilege_get_response.result
				let shortUrl = result.data.shorturl
				if (result.data.coupon_info) {
					let couponInfo = result.data.coupon_info
					let couponEndTime = result.data.coupon_end_time.substring(0, 10)
					let couponRemainCount = result.data.coupon_remain_count
					let html =
						'<div class="jar-body-coupon-left">' +
						couponInfo +
						'</div>' +
						'<div div class="jar-body-coupon-center">' +
						'<div>优惠券结束时间: <span>' +
						couponEndTime +
						'</span></div>' +
						'<div>优惠券剩余量: <span>' +
						couponRemainCount +
						'</span></div>' +
						'</div >' +
						'<div id="jar-qrcode" style="float:right;"></div>' +
						'<span style="color: #ff0036;text-align: center;position: absolute;right:10px;top:100px;font-weight:bold;"><p>淘宝、天猫、支付宝扫一扫</p><p>领取优惠券</p></span>' +
						'<div class="jar-button">' +
						'<a href="https://api.ergirl.com/jump.html?url=' +
						shortUrl +
						'&id=' +
						getQueryVariable('id') +
						'" target="_blank">点击领取</a></div>'
					$('.jar-body-coupon-top').append(html)
					var qrcode = new QRCode('jar-qrcode', {
						text: shortUrl,
						width: 500,
						height: 500,
						colorDark: '#000000',
						colorLight: '#ffffff',
						correctLevel: QRCode.CorrectLevel.H,
					})
				} else {
					let html =
						'<div class="getAgain">' +
						'<div class="again-box">' +
						'<img src="https://gw.alicdn.com/tps/TB11KWxOVXXXXXHXXXXXXXXXXXX-190-150.png" alt="">' +
						'<p>正在查询...</p>' +
						'<p>随后将返回详情页</p>' +
						'</div>' +
						'</div>' +
						'<div class="jar-body-coupon-left">当前商品暂无优惠券</div>' +
						'<div div class="jar-body-coupon-center">' +
						'<div>优惠券结束时间: <span>0</span></div>' +
						'<div>优惠券剩余量: <span>0</span></div>' +
						'</div >' +
						'<div id="jar-qrcode" style="float:right;"></div>' +
						'<span style="color: #ff0036;text-align: center;position: absolute;right:10px;top:100px;font-weight:bold;"><p>淘宝、天猫、支付宝扫一扫</p><p>查看详情</p></span>' +
						'<div class="jar-button"><a href="https://api.ergirl.com/jump.html?url=' +
						shortUrl +
						'&id=' +
						getQueryVariable('id') +
						'" target="_blank">深度查询</a></div>'
					$('.jar-body-coupon-top').before(html)
					var qrcode = new QRCode('jar-qrcode', {
						text: shortUrl,
						width: 500,
						height: 500,
						colorDark: '#000000',
						colorLight: '#ffffff',
						correctLevel: QRCode.CorrectLevel.H,
					})
				}
			} else {
				let html =
					'<div class="jar-body-coupon-left">当前商品暂无优惠券</div>' +
					'<div div class="jar-body-coupon-center">' +
					'<div>优惠券结束时间: <span>0</span></div>' +
					'<div>优惠券剩余量: <span>0</span></div>' +
					'</div >'
				$('.jar-body-coupon-top').before(html)
			}
		}
	}
	// 初始化详情

	if (host.indexOf('item.taobao') > -1 || host.indexOf('detail.tmall') > -1) {
		let params = {
			appkey: '52b273a5972949388ce7b57b84453aa4',
			tao_id: getQueryVariable('id'), // 接口更换了taoid
		}
		let newId = new GetNewId()
		newId.getNewId().then((id) => {
			let detailParams = {
				appkey: '52b273a5972949388ce7b57b84453aa4',
				sid: '45532',
				pid: 'mm_55657354_2155900321_111019450222',
				num_iid: id,
				signurl: '4',
			}
			setTimeout(() => {
				let detail = new Detail(detailParams)
				detail.addBasic()
				detail.getCoupon()
			}, 1000)
		})
	}
	/**
	 * @description: 相似比价
	 * @param {*} appkey
	 * @param {*} item_id
	 * @param {*} page_size
	 * @return {*}
	 */
	class Like {
		constructor(options) {
			this.likeParams = {
				appkey: options.appkey,
				item_id: options.item_id,
				page_size: 10,
			}
		}
		getLike() {
			let that = this
			let url = 'https://api.zhetaoke.com:10001/api/open_item_guess_like.ashx'
			let params = this.likeParams
			dtd(url, params, (res) => {
				that.addLike(res)
			})
		}
		// 插入元素
		addLike(data) {
			let list = JSON.parse(data).content
			list.forEach((item) => {
				let html =
					'<dl>' +
					'<dd><a href="' +
					item.item_url +
					'" target="_blank">' +
					'<div class="img">' +
					'<img src="' +
					item.pict_url +
					'" alt="">' +
					'</div>' +
					'<div class="infor" >' +
					'<div>价格: <span>' +
					item.quanhou_jiage +
					'</span></div>' +
					'<div class="jar-like-coupon">优惠券: <span>' +
					item.coupon_info_money +
					'</span></div>' +
					'<div>销量: <span>' +
					item.sellCount +
					'</span></div>' +
					'</div>' +
					'<div class="clear"></div>' +
					'<div class="title">' +
					item.tao_title +
					'</div>' +
					'</a></dd>' +
					'</dl>'
				$('.jar-like-list').append(html)
			})
		}
	}
	let like = new Like({
		appkey: '52b273a5972949388ce7b57b84453aa4',
		item_id: getQueryVariable('id'),
		page_size: 10,
	})
	like.getLike()
	/**
	 * @description: 获取历史记录
	 * @param {*}
	 * @return {*}
	 */
	class History {
		constructor(options) {
			this.hisParams = {
				appKey: '5cfe247e623ce',
				version: 'v1.0.0',
				goodsId: options.id,
			}
			this.hisParams.sign = makeSign(this.hisParams)
		}
		// 获取数据
		getHistory() {
			let that = this
			let url = 'https://openapi.dataoke.com/api/goods/price-trend'
			let params = this.hisParams
			dtd(url, params, (res) => {
				setTimeout(() => {
					that.addHistory(res)
				}, 1000)
			})
		}
		// 插入历史数据
		addHistory(res) {
			if (res.code === 0) {
				let arr = []
				arr = res.data.historicalPrice
				let numArr = arr.map((item) => {
					return item.actualPrice
				})
				let timeArr = arr.map((item) => {
					return timeFormat(item.date, 1)
				})
				let obj = {
					time: timeArr,
					historyPrice: numArr,
					maxNum: getMaxMin(numArr)[0],
					minNum: getMaxMin(numArr)[1],
				}
				eachart(obj)
			} else {
				$('#historyChart').html('暂无历史数据')
			}
		}
	}
	/**
	 * @description: 转链
	 * @param {*} id
	 * @return {*}
	 */
	function turnUrl(id) {
		let params = {
			appkey: config.zhetaoke.appkey,
			sid: config.zhetaoke.sid,
			pid: config.zhetaoke.pid,
			signurl: 4,
			num_iid: id,
		}
		let url = 'https://api.zhetaoke.com:10001/api/open_gaoyongzhuanlian.ashx'
		return new Promise(function (resolve, reject) {
			dtd(url, params, (res) => {
				let data = JSON.parse(res)
				if (data.tbk_privilege_get_response) {
					resolve(data.tbk_privilege_get_response.result.data)
				} else {
					resolve({})
				}
			})
		})
	}
	/**
	 * @description: DOM监听
	 * @param {*} targetNode DOM节点
	 * @param {*} callback 回调函数
	 * @return {*}
	 */
	function domAddEventListener(targetNode, callback) {
		if (targetNode) {
			var observer = new MutationObserver(function (mutations) {
				callback()
			})
			observer.observe(targetNode, {
				attributes: true,
				childList: true,
			})
		}
	}
	// 历史记录
	let newId = new GetNewId()
	newId.getNewId().then((id) => {
		let his = new History({ id: id })
		if (host.indexOf('item.taobao') > -1 || host.indexOf('detail.tmall') > -1) {
			his.getHistory()
		}
	})
	// 监听滚动
	function scrollListener(handle) {
		//判断鼠标滚轮滚动方向
		if (window.addEventListener) {
			//FF,火狐浏览器会识别该方法
			window.addEventListener('DOMMouseScroll', wheel, false)
		}
		window.onmousewheel = document.onmousewheel = wheel //W3C
		//统一处理滚轮滚动事件
		var throldHold = 200 //两次scroll事件触发之间最小的事件间隔
		function wheel(event) {
			if (arguments.callee.timer) clearTimeout(arguments.callee.timer)
			arguments.callee.timer = setTimeout(function () {
				var delta = 0
				if (!event) event = window.event
				if (event.wheelDelta) {
					//IE、chrome浏览器使用的是wheelDelta，且值为“正负120”
					delta = event.wheelDelta / 120
					//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
					if (window.opera) delta = -delta
				} else if (event.detail) {
					//FF浏览器使用的是detail,其值为“正负3”
					delta = -event.detail / 3
				}
				if (delta) {
					//上下滚动时的具体处理函数
					handle(delta)
				}
			}, throldHold)
		}
	}
	// 延迟获取DOM节点
	function getElement(node) {
		let pro = new Promise((resolve, reject) => {
			let timer = setInterval(() => {
				let ele = document.querySelector(node)
				if (ele) {
					resolve(ele)
					clearInterval(timer)
				}
			}, 1000)
		})
		return pro
	}
	// 链接更换
	const bindHistoryEvent = function (type) {
		const historyEvent = history[type]
		return function () {
			const newEvent = historyEvent.apply(this, arguments) //执行history函数
			const e = new Event(type) //声明自定义事件
			e.arguments = arguments
			window.dispatchEvent(e) //抛出事件
			return newEvent //返回方法，用于重写history的方法
		}
	}
	history.pushState = bindHistoryEvent('pushState')
	history.replaceState = bindHistoryEvent('replaceState')
	// 插入css
	let videolistCss = `
    .player-btn-box {
        position:absolute;
        top: 20%;
        left: 20px;
        z-index: 999999;
        border-radius: 5px;
        background-color: #fff;
    }
    .player-btn-box ul {
        width: 250px;
        overflow:hidden;
    }
    .player-btn-box li{
        font-size: 14px;
        width: 25%;
        height: 35px;
        color:#333;
        float:left;
        line-height: 35px;
        text-align:center;
        cursor: pointer;
    }
    .player-btn-box li:hover {
        color: #16e07a;
    }
    .player-btn-box .tips{
        font-size: 12px;
        color: red;
        padding: 10px;
        box-sizing: border-box;
    }
    `
	let musiclistCss = `
        .music-player {
            position: fixed;
            top: 20%;
            left: 20px;
            z-index: 9999;
            padding: 20px;
            box-shadow: 0 0 10px #ccc;
            border-radius: 10px;
            background-color: #fff;
        }
        .music-player ul {
            overflow: hidden;
        }
        .music-player ul li {
            line-height: 35px
        }
        .music-player ul li .name {
            width: 400px;
            float: left;
        }
        .music-player ul li .pause {
            color: #31c27c;
            cursor: pointer;
            margin: 0 10px;
            display: none;
        }
        .music-player ul li .play {
            color: #31c27c;
            cursor: pointer;
            margin: 0 10px;
        }
        .music-player ul li .down {
            color: #00a9ff;
            cursor: pointer;
            margin: 0 10px;
        }
        .music-player ul .active .name {
            font-weight: bold;
        }
        .music-player ul .active .pause {
            display: inline;
        }
        .music-player ul .active .play {
            display: none;
        }
        .music-player .tips {
            font-size: 12px;
            color: red;
        }
    `
	let dyCss = `
    .dy-down-btn {
        font-size: 12px!important;
        color: #fff;
        margin: 5px 20px!important;
        padding: 2px 6px!important;
        background: #fe2c55;
        box-sizing: border-box;
        border-radius: 5px;
    }
    `
	// 插入css
	let listCss = `.jar-list-coupon{font-family:microsoft Yahei;font-size:14px;color:#fff;position:absolute;right:0px;bottom:-11px;z-index:1;background:url(https://api.ergirl.com/coupon-bg.png) 50% no-repeat;background-size:cover;overflow:hidden;}.jar-list-coupon:before{content:"";width:150px;height:5px;background-color:#fff;opacity:0.3;position:absolute;left:-85px;transform:rotate(-36deg) translate(0px,0px);animation:mymove 1s ease-in-out infinite;-webkit-transform:rotate(-36deg) translate(0px,0px);-moz-transform:rotate(-36deg) translate(0px,0px);-ms-transform:rotate(-36deg) translate(0px,0px);-o-transform:rotate(-36deg) translate(0px,0px);}.jar-list-coupon a{color:#fff;height:30px;display:block;line-height:30px;padding:0 15px;}.jar-list-coupon a:hover{color:#fff;}@keyframes mymove{from{transform:rotate(-36deg) translate(0px,0px);-webkit-transform:rotate(-36deg) translate(0px,0px);-moz-transform:rotate(-36deg) translate(0px,0px);-ms-transform:rotate(-36deg) translate(0px,0px);-o-transform:rotate(-36deg) translate(0px,0px);}to{top:200px;transform:rotate(-36deg) translate(200px,300px);}}`
	let swiperCss = `@font-face{font-family:swiper-icons;src:url('data:application/font-woff;charset=utf-8;base64, d09GRgABAAAAAAZgABAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAGRAAAABoAAAAci6qHkUdERUYAAAWgAAAAIwAAACQAYABXR1BPUwAABhQAAAAuAAAANuAY7+xHU1VCAAAFxAAAAFAAAABm2fPczU9TLzIAAAHcAAAASgAAAGBP9V5RY21hcAAAAkQAAACIAAABYt6F0cBjdnQgAAACzAAAAAQAAAAEABEBRGdhc3AAAAWYAAAACAAAAAj//wADZ2x5ZgAAAywAAADMAAAD2MHtryVoZWFkAAABbAAAADAAAAA2E2+eoWhoZWEAAAGcAAAAHwAAACQC9gDzaG10eAAAAigAAAAZAAAArgJkABFsb2NhAAAC0AAAAFoAAABaFQAUGG1heHAAAAG8AAAAHwAAACAAcABAbmFtZQAAA/gAAAE5AAACXvFdBwlwb3N0AAAFNAAAAGIAAACE5s74hXjaY2BkYGAAYpf5Hu/j+W2+MnAzMYDAzaX6QjD6/4//Bxj5GA8AuRwMYGkAPywL13jaY2BkYGA88P8Agx4j+/8fQDYfA1AEBWgDAIB2BOoAeNpjYGRgYNBh4GdgYgABEMnIABJzYNADCQAACWgAsQB42mNgYfzCOIGBlYGB0YcxjYGBwR1Kf2WQZGhhYGBiYGVmgAFGBiQQkOaawtDAoMBQxXjg/wEGPcYDDA4wNUA2CCgwsAAAO4EL6gAAeNpj2M0gyAACqxgGNWBkZ2D4/wMA+xkDdgAAAHjaY2BgYGaAYBkGRgYQiAHyGMF8FgYHIM3DwMHABGQrMOgyWDLEM1T9/w8UBfEMgLzE////P/5//f/V/xv+r4eaAAeMbAxwIUYmIMHEgKYAYjUcsDAwsLKxc3BycfPw8jEQA/gZBASFhEVExcQlJKWkZWTl5BUUlZRVVNXUNTQZBgMAAMR+E+gAEQFEAAAAKgAqACoANAA+AEgAUgBcAGYAcAB6AIQAjgCYAKIArAC2AMAAygDUAN4A6ADyAPwBBgEQARoBJAEuATgBQgFMAVYBYAFqAXQBfgGIAZIBnAGmAbIBzgHsAAB42u2NMQ6CUAyGW568x9AneYYgm4MJbhKFaExIOAVX8ApewSt4Bic4AfeAid3VOBixDxfPYEza5O+Xfi04YADggiUIULCuEJK8VhO4bSvpdnktHI5QCYtdi2sl8ZnXaHlqUrNKzdKcT8cjlq+rwZSvIVczNiezsfnP/uznmfPFBNODM2K7MTQ45YEAZqGP81AmGGcF3iPqOop0r1SPTaTbVkfUe4HXj97wYE+yNwWYxwWu4v1ugWHgo3S1XdZEVqWM7ET0cfnLGxWfkgR42o2PvWrDMBSFj/IHLaF0zKjRgdiVMwScNRAoWUoH78Y2icB/yIY09An6AH2Bdu/UB+yxopYshQiEvnvu0dURgDt8QeC8PDw7Fpji3fEA4z/PEJ6YOB5hKh4dj3EvXhxPqH/SKUY3rJ7srZ4FZnh1PMAtPhwP6fl2PMJMPDgeQ4rY8YT6Gzao0eAEA409DuggmTnFnOcSCiEiLMgxCiTI6Cq5DZUd3Qmp10vO0LaLTd2cjN4fOumlc7lUYbSQcZFkutRG7g6JKZKy0RmdLY680CDnEJ+UMkpFFe1RN7nxdVpXrC4aTtnaurOnYercZg2YVmLN/d/gczfEimrE/fs/bOuq29Zmn8tloORaXgZgGa78yO9/cnXm2BpaGvq25Dv9S4E9+5SIc9PqupJKhYFSSl47+Qcr1mYNAAAAeNptw0cKwkAAAMDZJA8Q7OUJvkLsPfZ6zFVERPy8qHh2YER+3i/BP83vIBLLySsoKimrqKqpa2hp6+jq6RsYGhmbmJqZSy0sraxtbO3sHRydnEMU4uR6yx7JJXveP7WrDycAAAAAAAH//wACeNpjYGRgYOABYhkgZgJCZgZNBkYGLQZtIJsFLMYAAAw3ALgAeNolizEKgDAQBCchRbC2sFER0YD6qVQiBCv/H9ezGI6Z5XBAw8CBK/m5iQQVauVbXLnOrMZv2oLdKFa8Pjuru2hJzGabmOSLzNMzvutpB3N42mNgZGBg4GKQYzBhYMxJLMlj4GBgAYow/P/PAJJhLM6sSoWKfWCAAwDAjgbRAAB42mNgYGBkAIIbCZo5IPrmUn0hGA0AO8EFTQAA') format('woff');font-weight:400;font-style:normal}:root{--swiper-theme-color:#007aff}.swiper-container{margin-left:auto;margin-right:auto;position:relative;overflow:hidden;list-style:none;padding:0;z-index:1}.swiper-container-vertical>.swiper-wrapper{flex-direction:column}.swiper-wrapper{position:relative;width:100%;height:100%;z-index:1;display:flex;transition-property:transform;box-sizing:content-box}.swiper-container-android .swiper-slide,.swiper-wrapper{transform:translate3d(0px,0,0)}.swiper-container-multirow>.swiper-wrapper{flex-wrap:wrap}.swiper-container-multirow-column>.swiper-wrapper{flex-wrap:wrap;flex-direction:column}.swiper-container-free-mode>.swiper-wrapper{transition-timing-function:ease-out;margin:0 auto}.swiper-slide{flex-shrink:0;width:100%;height:100%;position:relative;transition-property:transform}.swiper-slide-invisible-blank{visibility:hidden}.swiper-container-autoheight,.swiper-container-autoheight .swiper-slide{height:auto}.swiper-container-autoheight .swiper-wrapper{align-items:flex-start;transition-property:transform,height}.swiper-container-3d{perspective:1200px}.swiper-container-3d .swiper-cube-shadow,.swiper-container-3d .swiper-slide,.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top,.swiper-container-3d .swiper-wrapper{transform-style:preserve-3d}.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:10}.swiper-container-3d .swiper-slide-shadow-left{background-image:linear-gradient(to left,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-right{background-image:linear-gradient(to right,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-top{background-image:linear-gradient(to top,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-bottom{background-image:linear-gradient(to bottom,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-css-mode>.swiper-wrapper{overflow:auto;scrollbar-width:none;-ms-overflow-style:none}.swiper-container-css-mode>.swiper-wrapper::-webkit-scrollbar{display:none}.swiper-container-css-mode>.swiper-wrapper>.swiper-slide{scroll-snap-align:start start}.swiper-container-horizontal.swiper-container-css-mode>.swiper-wrapper{scroll-snap-type:x mandatory}.swiper-container-vertical.swiper-container-css-mode>.swiper-wrapper{scroll-snap-type:y mandatory}:root{--swiper-navigation-size:44px}.swiper-button-next,.swiper-button-prev{position:absolute;top:50%;width:calc(var(--swiper-navigation-size)/ 44 * 27);height:var(--swiper-navigation-size);margin-top:calc(-1 * var(--swiper-navigation-size)/ 2);z-index:10;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--swiper-navigation-color,var(--swiper-theme-color))}.swiper-button-next.swiper-button-disabled,.swiper-button-prev.swiper-button-disabled{opacity:.35;cursor:auto;pointer-events:none}.swiper-button-next:after,.swiper-button-prev:after{font-family:swiper-icons;font-size:var(--swiper-navigation-size);text-transform:none!important;letter-spacing:0;text-transform:none;font-variant:initial;line-height:1}.swiper-button-prev,.swiper-container-rtl .swiper-button-next{left:10px;right:auto}.swiper-button-prev:after,.swiper-container-rtl .swiper-button-next:after{content:'prev'}.swiper-button-next,.swiper-container-rtl .swiper-button-prev{right:10px;left:auto}.swiper-button-next:after,.swiper-container-rtl .swiper-button-prev:after{content:'next'}.swiper-button-next.swiper-button-white,.swiper-button-prev.swiper-button-white{--swiper-navigation-color:#ffffff}.swiper-button-next.swiper-button-black,.swiper-button-prev.swiper-button-black{--swiper-navigation-color:#000000}.swiper-button-lock{display:none}.swiper-pagination{position:absolute;text-align:center;transition:.3s opacity;transform:translate3d(0,0,0);z-index:10}.swiper-pagination.swiper-pagination-hidden{opacity:0}.swiper-container-horizontal>.swiper-pagination-bullets,.swiper-pagination-custom,.swiper-pagination-fraction{bottom:10px;left:0;width:100%}.swiper-pagination-bullets-dynamic{overflow:hidden;font-size:0}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{transform:scale(.33);position:relative}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active{transform:scale(1)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-main{transform:scale(1)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev{transform:scale(.66)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev-prev{transform:scale(.33)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next{transform:scale(.66)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next-next{transform:scale(.33)}.swiper-pagination-bullet{width:8px;height:8px;display:inline-block;border-radius:100%;background:#000;opacity:.2}button.swiper-pagination-bullet{border:none;margin:0;padding:0;box-shadow:none;-webkit-appearance:none;-moz-appearance:none;appearance:none}.swiper-pagination-clickable .swiper-pagination-bullet{cursor:pointer}.swiper-pagination-bullet-active{opacity:1;background:var(--swiper-pagination-color,var(--swiper-theme-color))}.swiper-container-vertical>.swiper-pagination-bullets{right:10px;top:50%;transform:translate3d(0px,-50%,0)}.swiper-container-vertical>.swiper-pagination-bullets .swiper-pagination-bullet{margin:6px 0;display:block}.swiper-container-vertical>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic{top:50%;transform:translateY(-50%);width:8px}.swiper-container-vertical>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{display:inline-block;transition:.2s transform,.2s top}.swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet{margin:0 4px}.swiper-container-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic{left:50%;transform:translateX(-50%);white-space:nowrap}.swiper-container-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{transition:.2s transform,.2s left}.swiper-container-horizontal.swiper-container-rtl>.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{transition:.2s transform,.2s right}.swiper-pagination-progressbar{background:rgba(0,0,0,.25);position:absolute}.swiper-pagination-progressbar .swiper-pagination-progressbar-fill{background:var(--swiper-pagination-color,var(--swiper-theme-color));position:absolute;left:0;top:0;width:100%;height:100%;transform:scale(0);transform-origin:left top}.swiper-container-rtl .swiper-pagination-progressbar .swiper-pagination-progressbar-fill{transform-origin:right top}.swiper-container-horizontal>.swiper-pagination-progressbar,.swiper-container-vertical>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite{width:100%;height:4px;left:0;top:0}.swiper-container-horizontal>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite,.swiper-container-vertical>.swiper-pagination-progressbar{width:4px;height:100%;left:0;top:0}.swiper-pagination-white{--swiper-pagination-color:#ffffff}.swiper-pagination-black{--swiper-pagination-color:#000000}.swiper-pagination-lock{display:none}.swiper-scrollbar{border-radius:10px;position:relative;-ms-touch-action:none;background:rgba(0,0,0,.1)}.swiper-container-horizontal>.swiper-scrollbar{position:absolute;left:1%;bottom:3px;z-index:50;height:5px;width:98%}.swiper-container-vertical>.swiper-scrollbar{position:absolute;right:3px;top:1%;z-index:50;width:5px;height:98%}.swiper-scrollbar-drag{height:100%;width:100%;position:relative;background:rgba(0,0,0,.5);border-radius:10px;left:0;top:0}.swiper-scrollbar-cursor-drag{cursor:move}.swiper-scrollbar-lock{display:none}.swiper-zoom-container{width:100%;height:100%;display:flex;justify-content:center;align-items:center;text-align:center}.swiper-zoom-container>canvas,.swiper-zoom-container>img,.swiper-zoom-container>svg{max-width:100%;max-height:100%;object-fit:contain}.swiper-slide-zoomed{cursor:move}.swiper-lazy-preloader{width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;transform-origin:50%;animation:swiper-preloader-spin 1s infinite linear;box-sizing:border-box;border:4px solid var(--swiper-preloader-color,var(--swiper-theme-color));border-radius:50%;border-top-color:transparent}.swiper-lazy-preloader-white{--swiper-preloader-color:#fff}.swiper-lazy-preloader-black{--swiper-preloader-color:#000}@keyframes swiper-preloader-spin{100%{transform:rotate(360deg)}}.swiper-container .swiper-notification{position:absolute;left:0;top:0;pointer-events:none;opacity:0;z-index:-1000}.swiper-container-fade.swiper-container-free-mode .swiper-slide{transition-timing-function:ease-out}.swiper-container-fade .swiper-slide{pointer-events:none;transition-property:opacity}.swiper-container-fade .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-fade .swiper-slide-active,.swiper-container-fade .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-container-cube{overflow:visible}.swiper-container-cube .swiper-slide{pointer-events:none;-webkit-backface-visibility:hidden;backface-visibility:hidden;z-index:1;visibility:hidden;transform-origin:0 0;width:100%;height:100%}.swiper-container-cube .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-cube.swiper-container-rtl .swiper-slide{transform-origin:100% 0}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-next,.swiper-container-cube .swiper-slide-next+.swiper-slide,.swiper-container-cube .swiper-slide-prev{pointer-events:auto;visibility:visible}.swiper-container-cube .swiper-slide-shadow-bottom,.swiper-container-cube .swiper-slide-shadow-left,.swiper-container-cube .swiper-slide-shadow-right,.swiper-container-cube .swiper-slide-shadow-top{z-index:0;-webkit-backface-visibility:hidden;backface-visibility:hidden}.swiper-container-cube .swiper-cube-shadow{position:absolute;left:0;bottom:0px;width:100%;height:100%;background:#000;opacity:.6;-webkit-filter:blur(50px);filter:blur(50px);z-index:0}.swiper-container-flip{overflow:visible}.swiper-container-flip .swiper-slide{pointer-events:none;-webkit-backface-visibility:hidden;backface-visibility:hidden;z-index:1}.swiper-container-flip .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-flip .swiper-slide-active,.swiper-container-flip .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-container-flip .swiper-slide-shadow-bottom,.swiper-container-flip .swiper-slide-shadow-left,.swiper-container-flip .swiper-slide-shadow-right,.swiper-container-flip .swiper-slide-shadow-top{z-index:0;-webkit-backface-visibility:hidden;backface-visibility:hidden}`
	let detailCss = `#jar-qrcode canvas {width:80px;height:80px;}#jar-qrcode img {width:80px;height:80px;}.getAgain{width:210px;height:210px;color:#fff;display:none;background:rgba(0,0,0,.7);border-radius:5px;text-align:center;position:fixed;top:50%;z-index:999;}.getAgain .again-box{width:100%;height:100%;}.getAgain .again-box img{width:60%;margin-top:20px;}.getAgain .again-box p{font-size:16px;}.jar-detail-coupon{font-family:microsoft Yahei;width:480px;position:relative;z-index:999999;}.jar-detail-coupon .jar-tab{font-size:14px;height:32px;line-height:30px;overflow:hidden;}.jar-detail-coupon .jar-tab ul{float:left;overflow:hidden;border-right:1px solid #c5c5c5;border-left:3px solid #f84e4e;}.jar-detail-coupon .jar-tab li{color:#666;padding:0 10px;float:left;border:1px solid #c5c5c5;border-right:0;cursor:pointer;}.jar-detail-coupon .jar-tab li.active{font-weight:bold;color:#f84e4e;}.jar-detail-coupon .jar-tab .jar-show{color:#666;float:left;margin-left:10px;cursor:pointer;}.jar-detail-coupon .jar-body{height:220px;margin-top:-1px;overflow:hidden;}.jar-detail-coupon .jar-body ul{position:absolute;z-index:4;background-color:#fff;}.jar-detail-coupon .jar-body li{width:478px;height:220px;display:none;border:1px solid #c5c5c5;}.jar-detail-coupon .jar-body li:first-child{display:block;}.jar-detail-coupon .jar-body .jar-body-coupon{padding:10px;}.jar-detail-coupon .jar-body .jar-body-coupon-left{font-size:14px;height:35px;color:#fff;padding:0 25px;float:left;line-height:35px;background:url('https://api.ergirl.com/coupon-bg.png') no-repeat;background-size:100% 100%;box-sizing:border-box;position:relative;overflow:hidden;}.jar-detail-coupon .jar-body .jar-body-coupon-left:before{content:"";width:150px;height:5px;background-color:#fff;opacity:0.3;position:absolute;left:-85px;transform:rotate(-36deg) translate(0px,0px);animation:mymove 1s ease-in-out infinite;-webkit-transform:rotate(-36deg) translate(0px,0px);-moz-transform:rotate(-36deg) translate(0px,0px);-ms-transform:rotate(-36deg) translate(0px,0px);-o-transform:rotate(-36deg) translate(0px,0px);}.jar-detail-coupon .jar-body .jar-body-coupon-center{font-size:14px;color:#666;margin:0 10px;float:left;}.jar-detail-coupon .jar-body .jar-body-coupon-center div{margin-bottom:10px;}.jar-detail-coupon .jar-body .jar-body-coupon-center div span{font-weight:bold;color:#f84e4e;}.jar-detail-coupon .jar-body .jar-body-coupon-right{font-size:14px;color:#666;margin-top:10px;position:relative}.jar-detail-coupon .jar-body .jar-body-coupon-right span a{font-weight:bold;color:#f84e4e!important;}.jar-detail-coupon .jar-body .jar-like-list{overflow:hidden;background: #fff;}.jar-detail-coupon .jar-body .jar-like-list dl{width:50%;float:left;}.jar-detail-coupon .jar-body .jar-like-list dd{padding:5px;}.jar-detail-coupon .jar-body .jar-like-list .img{width:100px;float:left;}.jar-detail-coupon .jar-body .jar-like-list img{max-width:100%;}.jar-detail-coupon .jar-body .jar-like-list .infor{margin-left:20px;float:left;}.jar-detail-coupon .jar-body .jar-like-list .infor div{font-size:14px;color:#666;display:block;margin-top:4px;}.jar-detail-coupon .jar-body .jar-like-list .infor div span{color:#f84e4e;}.jar-detail-coupon .jar-body .jar-like-list .infor .jar-like-coupon{color:#fff;padding:0 7px;background:url('https://api.ergirl.com/coupon-bg.png') no-repeat;background-size:100% 100%;}.jar-detail-coupon .jar-body .jar-like-list .infor .jar-like-coupon span{color:#fff;}.jar-detail-coupon .jar-body .jar-like-list .title{font-size:12px;height:35px;color:#333;overflow:hidden;}.jar-detail-coupon .jar-body .jar-like-list a:hover .title{color:red;}.jar-button{font-size:14px;width:90px;height:30px;float:left;line-height:30px;text-align:center;background-color:red;border-radius:3px;cursor:pointer;}.jar-button a{color:#fff!important;display:block;}.jar-history{font-size:16px;color:#f84e4e;text-align:center;line-height:100px;background:#fff;}.clear{clear:both;overflow:hidden;}@keyframes mymove{from{transform:rotate(-36deg) translate(0px,0px);-webkit-transform:rotate(-36deg) translate(0px,0px);-moz-transform:rotate(-36deg) translate(0px,0px);-ms-transform:rotate(-36deg) translate(0px,0px);-o-transform:rotate(-36deg) translate(0px,0px);}to{top:200px;transform:rotate(-36deg) translate(200px,300px);}}`
	let detailTop = `.detail-top{width:1190px}.detail-top .tab-top ul{width:505px;overflow:hidden;border-right:1px solid #b8b7bd}.detail-top .tab-top li{width:100px;float:left;line-height:30px;text-align:center;border:1px solid #b8b7bd;border-right:0;cursor:pointer}.detail-top .tab-top li.active{color:#fff;background-color:#f50}.detail-top .tab-body{height:360px}.detail-top .tab-body ul{margin:0 -10px;display:none}.detail-top .tab-body ul:first-child{display:block}.detail-top .tab-body li{height:360px;float:left;margin:0 10px;border:1px solid #ededed}.detail-top .tab-body li .pic img{width:220px;height:220px}.detail-top .tab-body li .info{font-size:18px;color:#F40;padding:0 10px;box-sizing:border-box}.detail-top .tab-body li .info .row{line-height:40px;overflow:hidden}.detail-top .tab-body li .info .price{float:left}.detail-top .tab-body li .info .price span{float:left}.detail-top .tab-body li .info .price strong{float:left}.detail-top .tab-body li .info .deal-cnt{font-size:16px;color:#888;float:right}.detail-top .tab-body li .info .title{font-size:14px;color:#3d3d3d}.detail-top .tab-body li .top-coupon{font-size:14px;color:#fff;padding:0 25px;line-height:35px;display:inline-block;background:url(https://api.ergirl.com/coupon-bg.png) no-repeat;background-size:100% 100%;position:absolute;right:11px;bottom:1px;overflow:hidden}.detail-top .tab-body li .top-coupon:before{content:"";width:150px;height:5px;background-color:#fff;opacity:.3;position:absolute;left:-85px;transform:rotate(-36deg) translate(0px,0px);animation:mymove 1s ease-in-out infinite}@keyframes mymove{from{transform:rotate(-36deg) translate(0px,0px)}to{top:200px;transform:rotate(-36deg) translate(200px,300px)}}`
	GMaddStyle(videolistCss)
	GMaddStyle(musiclistCss)
	GMaddStyle(dyCss)
	GMaddStyle(listCss)
	GMaddStyle(swiperCss)
	GMaddStyle(detailCss)
	GMaddStyle(detailTop)
	function GMaddStyle(cssText) {
		let a = document.createElement('style')
		a.type = 'text/css'
		a.textContent = cssText
		let doc = document.head || document.documentElement
		doc.appendChild(a)
	}
})()
