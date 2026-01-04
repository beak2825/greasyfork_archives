// ==UserScript==
// @name         GaoXiaoKaoShi高校考试网自动刷视频
// @namespace    https://github.com/AliubYiero/TemperScripts/GaoXiaoKaoShiVideoSkip
// @version      1.0.5
// @description  自动刷高校考试网视频
// @author       Yiero
// @match        http://www.gaoxiaokaoshi.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463301/GaoXiaoKaoShi%E9%AB%98%E6%A0%A1%E8%80%83%E8%AF%95%E7%BD%91%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/463301/GaoXiaoKaoShi%E9%AB%98%E6%A0%A1%E8%80%83%E8%AF%95%E7%BD%91%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

/* README
进入课程页面会自动运行，自动查找未学习视频

功能：
1. 自动打开未学习视频
2. 自动跳转到当前视频的学习进度
3. 自动页面跳转
4. 多个网页观看同步（见提示1） | 比如同时打开5个页面看5个视频，第一个页面观看完毕会跳转到未观看的第六个视频，而不会重复观看第二个视频。


提示：
1. 高校考试网没有视频观看检测，这意味着可以同时打开多个网页同时看多个视频，观看数据是可以同时提交到云端的。
但是不推荐同时打开超过5个网页，因为如果网速不行导致视频卡顿，可能会让视频观看进度停止（即使视频重新加载完毕开始观看了）。
2. 高校考试网的视频观看进度是根据实际时间计算而不是根据视频观看时间计算的，所以无法倍速观看。
与之对应的是，当窗口打开之后即使没有加载视频，也会累加观看时间。
3. 网页右端的观看记录是用来清除错误记录的。因为如果视频打开之后被手动关闭或者卡顿暂停观看进度，重新打开网页会忽略这个视频，可以通过清除错误记录将这个视频重新添加到观看列表中。
4. 观看记录记录当天的记录，隔天记录会清除。
*/

// 1 获取`localStorage`
let studyingLocalStorage = {
	localStudyingObj: null,
	get() {
		if (!localStorage.studying) {
			this.localStudyingObj = {}
		} else {
			this.localStudyingObj = JSON.parse(localStorage.studying)
		}
		return this.localStudyingObj
	},
	set(name, state=Object.keys(this.localStudyingObj).length+"") {
		if (!this.localStudyingObj) this.get()

		this.localStudyingObj[name] = state
		localStorage.studying = JSON.stringify(this.localStudyingObj)

	},
	removeItem(name) {
		const newLocalStudyingObj = {}
		for (const nameKey in this.localStudyingObj) {
			if (nameKey !== name) {
				newLocalStudyingObj[nameKey] =  this.localStudyingObj[nameKey]
			}
		}
		this.localStudyingObj = newLocalStudyingObj
		localStorage.studying = JSON.stringify(this.localStudyingObj)
	},
	clear(key='studying') {
		localStorage.removeItem(key)
	},
	isSameToday() {
		const dateObj = new Date()
		const today = `${dateObj.getFullYear()}-${dateObj.getMonth()+1}-${dateObj.getDay()}`
		// 第一次储存
		if (!localStorage.today) {
			localStorage.today = today
			return "0"
		}
		// 是同一天
		if (localStorage.today === today) {
			return 1
		}
		// 不是同一天
		localStorage.today = today
		return 0
	}
}


// 2.1 获取信息表格
let mainWindow
let videoInfoForm = {
	_self: null,
	getMainIframeWindow() {
		// 重定向内层mainIframeWindow对象
		const mainIframe = window.document.getElementById("mainIframe")
		mainWindow = mainIframe.contentWindow
	},
	get() {
		if (!mainWindow) this.getMainIframeWindow()
		// 绑定视频信息总表单
		this._self = mainWindow.document.querySelectorAll('tr')
	},
	// 跳转下一页
	jumpNextPage() {
		// 判断当前页是否为最后一页（结束递归）
		if (!mainWindow) this.getMainIframeWindow()
		const page = mainWindow.document.querySelectorAll('.page > .fright > ul > li')[0].innerText
		const pages = page.split('/')
		if (pages[0] === pages[1]) {
			console.log("已经是最后一页，全部视频观看完成")
			videoEvent.reloadVideo = () => console.log('finish')
			return 1
		}
		// 点击进入下一页
		mainWindow.document.getElementById('PageSplit1_BtnNext').click()
		console.log("进入下一页")

		// 初始化数据
		mainWindow = null
		videoInfoForm._self = null
	},
}

// 2.2 获取视频状态
let videoInfoTable = {
	localCourse: [],
	isLastPage: false,

	rewriteStudyState(trObj) {
		let newTrObj = {}
		const tdList = trObj.children
		for (let i = 0; i < tdList.length; i++) {
			const element = tdList[i]
			switch (i) {
				// 课程小章节名称
				case 0:
					newTrObj.name = element.innerText
					break
				// 课程类型
				case 1:
					newTrObj.type = element.innerText
					break
				// 当前视频总时长
				case 2:
					newTrObj.totalTime = element.innerText
					break
				// 当前视频学习时长
				case 3:
					newTrObj.studiedTime = element.innerText
					break
				// 当前视频状态
				case 4:
					// 正在观看的视频
					if (studyingLocalStorage.get()[newTrObj.name]) {
						newTrObj.state = "正在学习"
						break
					}
					newTrObj.state = element.innerText
					break
				// 开始学习按钮
				case 5:
					newTrObj.studyBtn = element.children[0]
					newTrObj.id = newTrObj.type + newTrObj.studyBtn.onclick.toString().split(',')[1].split(')')[0]
					break
				// 开始练习按钮
				case 6:
					newTrObj.examBtn = element.children[0]
					break
			}
		}
		return newTrObj
	},

	getStudyState() {
		if (!videoInfoForm._self) videoInfoForm.get()
		let videoInfoFormLength = videoInfoForm._self.length
		for (let i = 1; i < videoInfoFormLength; i++) {
			const course = this.rewriteStudyState(videoInfoForm._self[i])

			if (course.state === "已完成" || course.state === "正在学习") continue
			// 返回格式化视频列
			this.localCourse.unshift(course)
			return
		}

		// 翻页获取
		this.isLastPage = videoInfoForm.jumpNextPage()

		setTimeout(() => {
			if (!this.isLastPage) {
				videoInfoTable.getStudyState()
				return
			}
		}, 300)

	}
}

/*
//test
setTimeout(()=> {
		videoInfoTable.getStudyState()
		console.log(videoInfoTable.localCourse)
},1000)
*/

// 3 视频事件
let videoEvent = {
	examViewWindow: null,	// 视频Iframe对象
	video: null,			// 视频对象

	checkVideoCounter: 0,
	timer: null,

	// 获取examViewWindow对象
	getExamViewIframeWindow() {
		// 重定向window到视频对象iframeWindow对象
		const examViewIframe = window.document.getElementById("ExamView")
		this.examViewWindow = examViewIframe.contentWindow
	},

	getVideoObj() {
		if (!videoInfoTable.localCourse[0]) {
			videoInfoTable.getStudyState()
		}

		// 点击视频
		setTimeout( () => {
			try	{
				videoInfoTable.localCourse[0].studyBtn.click()
			} catch (e) {
				console.log('finish')
			}
		}, 1000)

		let _this = this
		setTimeout(() => {
			if (!_this.examViewWindow) _this.getExamViewIframeWindow()
			_this.video = _this.examViewWindow.document.querySelector('video')
		}, 3000)
	},

	playVideo() {
		if (!this.video) this.getVideoObj()

		let _this = this
		this.timer = setInterval(_this.checkVideoPlay, 1000)

	},
	// 检查视频是否开始播放
	checkVideoPlay() {
		if (videoEvent.checkVideoCounter++ >= 8) {
			// 初始化定时器
			clearInterval(videoEvent.timer)
			videoEvent.timer = null

			// 刷新网页重新加载
			videoEvent.reloadVideo()
			return
		}

		const video = videoEvent.video
		if (video && video.paused) {
			video.play()	// 播放视频
			// 设置当前视频应该开始的时间（已学习学时(min)-1）
			const hasReadTime = videoInfoTable.localCourse[0].studiedTime.split("分钟")[0]
			setTimeout(() => video.currentTime = (hasReadTime) * 60, 1000)
			video.volume = 0	// 将音量设置为0

			videoEvent.examViewWindow.document.querySelector('#J_prismPlayer').click()	// 模拟点击聚焦视频，防止视频卡住
		} else if (video && !video.paused) {
			// 初始化定时器
			console.log(`开始自动播放视频 「${videoInfoTable.localCourse[0].name}」`)
			clearInterval(videoEvent.timer)
			videoEvent.timer = null

			// 初始化储存事件
			videoEvent.setStorageEvent()
			// 初始化视频事件
			videoEvent.setVideoEvent()
			videoEvent.checkVideoPlaying()
			// 添加观看记录
			watchingList.addItem(videoInfoTable.localCourse[0].id,videoInfoTable.localCourse[0].name)
		}
	},

	// 检查视频是否正在播放
	checkVideoPlaying() {
		// 每分钟检查一次
		let serveTimerStr1, serveTimerStr2
		videoEvent.timer = setInterval(() => {
			console.log("检查数据同步...")

			serveTimerStr1 = videoEvent.examViewWindow.document.getElementById('spTitle').innerText
			setTimeout(() => {
				serveTimerStr2 = videoEvent.examViewWindow.document.getElementById('spTitle').innerText

				if (serveTimerStr1 === serveTimerStr2) {
					videoEvent.reloadVideo()
					return
				}
			}, 1000)
		}, 1000 * 60)
	},

	reloadVideo() {
		// 刷新网页更新缓存
		location.reload();

		// 清除储存记录
		watchingList.removeItem(videoInfoTable.localCourse[0].name)

		// 清除视频信息
		videoEvent.checkVideoCounter = 0
		videoEvent.examViewWindow = null
		videoEvent.video = null
		videoEvent.timer = null

		// 播放下一个视频
		setTimeout(videoEvent.playVideo, 1000)
	},

	setVideoEvent() {
		const video = videoEvent.video

		video.addEventListener('ended', () => {
			this.reloadVideo()
			console.log(`「${videoInfoTable.localCourse[0].name}」视频结束`)
		})

		video.addEventListener('pause', () => {
			this.reloadVideo()
		})

	},

	setStorageEvent() {
		window.addEventListener('storage', e => {
			studyingLocalStorage.get()
		})
	},
}

// 4 观看记录
let watchingList = {
	watchingListContainer: null,

	// 创建观看容器
	createContainer() {
		this.watchingListContainer = document.createElement('div')
		this.watchingListContainer.id = 'container__watching-list'

		// 添加观看记录文字
		this.watchingListContainer.innerHTML = `
		<div style="border-bottom: 1px #D8D8D8 solid;width: 200px;text-align: center">
			观看记录
		</div>
		`

		// 添加容器样式
		const watchingListContainerStyle = `
		.aside__list-is-watching {
			width: 200px;

			position: fixed;
			right: 200px;
			top: 135px;

			border: 1px #D8D8D8 solid;
			border-radius: 5px;
		}
		`
		this.addGlobalStyle(watchingListContainerStyle)
		this.watchingListContainer.classList.add('aside__list-is-watching')

		// 添加容器到网页
		window.document.body.appendChild(this.watchingListContainer)

		// 初始化观看列表
		this.initWatchingList()

		// 设置监听事件
		this.setGlobalChangeEvent()
	},

	// 初始化观看列表
	initWatchingList() {
		// 获取本地缓存
		studyingLocalStorage.get()
		let localCourse = studyingLocalStorage.localStudyingObj

		for (const watchingVideoName in localCourse) {
			const watchingVideoId = localCourse[watchingVideoName]

			this.addItem(watchingVideoId, watchingVideoName)
		}
	},

	// 创建全局样式
	addGlobalStyle(styleString) {
		// 创建CSS样式
		let style = window.document.createElement('style')
		style.innerHTML = styleString
		// 添加CSS样式
		window.document.querySelector('head').appendChild(style)
	},

	// 添加记录
	addItem(videoId, videoName) {
		if (!this.watchingListContainer) this.createContainer()
		// 添加本地储存
		studyingLocalStorage.set(videoName, videoId)

		// 添加容器列表
		const inputItem = window.document.createElement('div')
		inputItem.id = `container__watching-item-${videoId}`
		inputItem.innerHTML = `
		<input type="checkbox" class="item__is-watching" id="watching-item-${videoId}" name=${videoName} checked="checked"/>
		<label for="watching-item-${videoId}">${videoName}</label>
		`

		// 附加到主容器中
		this.watchingListContainer.appendChild(inputItem)
	},

	// 移除记录
	removeItem(element) {
		if (typeof element === 'string') {
			element = window.document.querySelector(`[name="${element}"]`)
		}

		// 移除本地储存
		studyingLocalStorage.removeItem(element.name)

		// 移除容器列表
		window.document.querySelector(`#container__${element.id}`).remove()
	},

	// 设置监听
	setGlobalChangeEvent() {
		const watchingListContainer = window.document.querySelector('#container__watching-list')

		// 清除记录
		watchingListContainer.addEventListener('change', e => {
			const element = e.target

			if (!element.checked) {
				this.removeItem(element)
			}
		})

		window.addEventListener('storage', e => {
			if (e.key !== 'studying') return

			// 刷新观看记录列表
			const inputItemList = window.document.querySelectorAll('[id^="container__watching-item"]')
			for (const inputItemListElement of inputItemList) {
				inputItemListElement.remove()
			}
			this.initWatchingList()
		})
	},
}

// 入口
setTimeout(() => {
	// 拦截非指定iframe应用脚本
	if (window.document.URL.includes('Study')) return

	// 清除本地记录
	if (!studyingLocalStorage.isSameToday()) {
		studyingLocalStorage.clear()
	}
	// 播放视频
	videoEvent.playVideo()

	// 添加观看记录监听
	watchingList.createContainer()
}, 1000)


