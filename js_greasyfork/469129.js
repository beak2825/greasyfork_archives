// ==UserScript==
// @name        mCollection资源捕获
// @namespace   mCollection
// @homepage    https://greasyfork.org/zh-CN/scripts/469129-mcollection%E8%B5%84%E6%BA%90%E6%8D%95%E8%8E%B7
// @match       *://*/*
// @icon        data:image/x-icon;base64,AAABAAEAQEAAAAEAIAAoQgAAFgAAACgAAABAAAAAgAAAAAEAIAAAAAAAAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlUAVDI9EDyKNQBI4i0ATRItAE0SLQBNEi0ATRI9AD0SPQA9Ej0APRI9AD0SNQBI4jzwPIpVAFQwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiUUUGoxAEFCLPxB9i0ESnotAEb+MQBHfjEAR94xAEf+MQBH/jEAR/4xAEf+MQBH/jEAR/4xAEf+NPxD/jT8Q/40/EP+NPxD/jT8Q/40/EP+NPxD/jT8P940/EN+OPxC+jT8QnY8/EH2OQRBPiTsUGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiTsUDYo/ElWLQBGji0AR44tAEf+LQBH/i0AR/4tAEf+LQBH/jEAR/4xAEf+MQBH/jEAR/4xAEf+MQBH/jEAR/4xAEf+MQBH/jT8Q/40/EP+NPxD/jT8Q/40/EP+NPxD/jT8Q/40/EP+NPxD/jj8Q/44/EP+OPxD/jj8Q/44/EP+OPxDjjj8Qo49AD1SJOxQNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIQRIriUAQnIpAEfeLQBH/i0AR/4tAEf+LQBH/i0AR/4tAEf+LQBH/i0AR/4xAEf+MQBH/jEAR/4xAEf+MQBH/jEAR/4xAEf+MQBH/jEAR/40/EP+NPxD/jT8Q/40/EP+NPxD/jT8Q/40/EP+NPxD/jT8Q/44/EP+OPxD/jj8Q/44/EP+OPxD/jj8Q/44/EP+OPxD/kD8P948/EJuSPRIqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJPxBhikAR+opAEf+KQBH/i0AR/4tAEf+LQBH/i0AR/4tAEf+LQBH/i0AR/4tAEf+MQBH/jEAR/4xAEf+MQBH/jEAR/4xAEf+MQBH/jEAR/4xAEf+NPxD/jT8Q/40/EP+NPxD/jT8Q/40/EP+NPxD/jT8Q/40/EP+OPxD/jj8Q/44/EP+OPxD/jj8Q/44/EP+OPxD/jj8Q/48/EP+PPxD/jz8Q+Y4+EF8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACMQQ8zikAR/opAEf+KQBH/ikAR/4tAEf+LQBH/i0AR/4tAEf+LQBH/i0AR/4tAEf+LQBH/jEAR/4xAEf+MQBH/jEAR/4xAEf+MQBH/jEAR/4xAEf+MQBH/jT8Q/40/EP+NPxD/jT8Q/40/EP+NPxD/jT8Q/40/EP+NPxD/jj8Q/44/EP+OPxD/jj8Q/44/EP+OPxD/jj8Q/44/EP+PPxD/jz8Q/48/EP+PPxD+jT4QMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAij8SVYpAEf+KQBH/ikAR/4pAEf+LQBH/i0AR/4tAEf+LQBH/i0AR/4tAEf+LQBH/i0AR/4xAEf+MQBH/jEAR/4xAEf+MQBH/jEAR/4xAEf+MQBH/jEAR/40/EP+NPxD/jT8Q/40/EP+NPxD/jT8Q/40/EP+NPxD/jT8Q/44/EP+OPxD/jj8Q/44/EP+OPxD/jj8Q/44/EP+OPxD/jz8Q/48/EP+PPxD/jz8Q/5A/D1UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIo/ElWKQBH/ikAR/4pAEf+KQBH/i0AR/4tAEf+LQBH/i0AR/4tAEf+LQBH/i0AR/4tAEf+MQBH/jEAR/4xAEf+MQBH/jEAR/4xAEf+MQBH/jEAR/4xAEf+NPxD/jT8Q/40/EP+NPxD/jT8Q/40/EP+NPxD/jT8Q/40/EP+OPxD/jj8Q/44/EP+OPxD/jj8Q/44/EP+OPxD/jj8Q/48/EP+PPxD/jz8Q/48/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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////gAAB//////AAAAAP////gAAAAAH///8AAAAAAP///gAAAAAAf//+AAAAAAB///4AAAAAAH///gAAAAAAf//+AAAAAAB///4AAAAAAH///gAAAAAAf//+AAAAAAB///4AAAAAAH///gAAAAAAf//+AAAAAAB///4AAAAAAH///gAAAAAAf//+AAAAAAB///wAAAAAAD///gAAAAAAf//+AAAAAAB///4AAAAAAH///gAAAAAAf//+AAAAAAB///4AAAAAAH///gAAAAAAf//+AAAAAAB///4AAAAAAH///gAAAAAAf//+AAAAAAB///4AAAAAAH///gAAAAAAf//8AAAAAAA///4AAAAAAH///gAAAAAAf//+AAAAAAB///4AAAAAAH///gAAAAAAf//+AAAAAAB///4AAAAAAH///gAAAAAAf//+AAAAAAB///4AAAAAAH///gAAAAAAf//+AAAAAAB///4AAAAAAH///gAAAAAAf///AAAAAAD////AAAAAA/////4AAAB/////////////////////////////////////////////////////////////////////////////8=
// @grant       unsafeWindow
// @grant       GM_addElement
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @version     0.2
// @author      hunmer
// @license      MIT
// @description 2023年7月8日 21点27分
// @downloadURL https://update.greasyfork.org/scripts/469129/mCollection%E8%B5%84%E6%BA%90%E6%8D%95%E8%8E%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/469129/mCollection%E8%B5%84%E6%BA%90%E6%8D%95%E8%8E%B7.meta.js
// ==/UserScript==

// ['GM_download'].forEach(method => unsafeWindow[method] = window[method])
var g_app = unsafeWindow._g_app = {
	resources: [],
	  cdn: 'https://neysummer2000.fun/',
	// cdn: 'http://127.0.0.1:8080/',
	init() {
		this.timer = setInterval(() => {
			let icon = this.icon = document.querySelector('#mc_float_icon')
			if(icon !== null) return

			GM_addStyle(`
			  #mc_float_icon:hover {
				right: 0px !important;
			  }
			`)
			icon = this.icon = document.createElement('div')
			icon.id = 'mc_float_icon'
			icon.style.cssText = `
				position: fixed;
				right: -25px;
				bottom: 50px;
				width: 50px;
				cursor: pointer;
				height: 50px;
				transition: right 0.3s ease-in-out;
			`
			icon.innerHTML = `
				<div id="draggable-header" style="width: 100%; height: 100%;background-image: url(${GM_info.script.icon});border-radius: 20px;background-size: contain;position: relative;">
			  		<a id="_badge" style="
					position: absolute;
					left: 0;
					bottom: 0;
					background-color: red;
					border-radius: 10px;
					color: white;
					font-size: 10px;
					min-width: 15px;
					padding: 1px;
					height: 15px;
					text-align: center;
    				line-height: 11px;
					">${this.resources.length}<a>
				</div>
			`
			let lastClick
			icon.onmouseup = () => Date.now() - lastClick < 150 && this.toggleShow()
			icon.onmousedown = () => lastClick = Date.now()
			document.body.appendChild(icon)
			initDraggableEles(icon)
		}, 1000)

		this.observer_start()
		window.onload = () => {
			// this.show()
		}
	},

	// 刷新资源展示列表
	resources_refresh() {
		let html = this.resources.map(item => this.buildImageContainer(item)).join('')
		this.$('#list_resources').html(html)
	},

	// 生成图片展示div
	buildImageContainer(item) {
		let { type, url, title, size, width, height } = item
		title ||= this.window.getFileName(url).split('?')[0]
		let cover = type == 'img' ? url : this.cdn + 'public/files.png'
		return `
			<div class="resource_item datalist-item" style="height: 100px;display: grid;" data-action="img_select" data-size="${size}" data-width="${width}" data-height="${height}" data-type="${type}" data-url="${url}">
				<img src="${cover}" alt="${cover}" class="mx-auto" height=80  data-hover="img_preview" data-out="img_unpreview" data-hoverTime=1000>
				<span class="text-nowrap text-center" style="width: 100px;" title="${title}">${title}</span>
			</div>`
	},

	resources_find(find_url, methid = 'find'){
		return this.resources[methid](({ url }) => url == find_url)
	},

	// 添加捕获资源
	resources_add(item) {
		let find = this.resources_find(item.url)
		if (find) {
			item = Object.assign(find, item)
		} else {
			let cnt = this.resources.push(item)
			if (this.inst.tabs) {
				this.inst.tabs.getButton('resources').find('span').text('资源(' + cnt + ')')
			}
			if(this.icon) this.icon.querySelector('#_badge').innerHTML = cnt
		}

		// console.log(item)
		if (this.isShowing() && this.$) {
			let div = this.getImageContainer(item.url)
			let el = this.$(this.buildImageContainer(item))
			this.applyFilter(el) // 判断是否可通过过滤器
			if (!div.length) return el.appendTo('#list_resources')
			div.replaceWith(el)
		}
	},

	// 移除资源
	resources_remove(url){
		this.getElement(url).remove()
		let index = this.resources_find(url, 'findIndex')
		if(index != -1){
			this.resources.splice(index, 1)
			return true
		}
	},

	getImageContainer(url) {
		return this.getImageElement(url).parents('.datalist-item')
	},

	getElement(url) {
		return this.$(`.datalist-item[data-url="${url}"]`)
	},

	getImageElement(url) {
		return this.$(`.datalist-item img[src="${url}"]`)
	},

	isShowing() {
		return this?.iframe?.style?.display != 'none'
	},

	queue: [],
	loadResources({ node, url, type, size }) {
		const self = this
		if (this.queue.includes(url)) return // 禁止重复请求，因为new资源对象会触发网络请求而造成死循环
		this.queue.push(url)

		let onLoad = function () {
			let url = this.src
			self.resources_add({ url, size, type, title: this.alt ?? this.title, width: this.naturalWidth, height: this.naturalHeight })
			this.remove()
		}
		if (node) return node.addEventListener('load', onLoad)

		let obj = type == 'img' ? new Image() : (type == 'video' ? new Video() : new Audio())
		obj.src = url
		obj.onload = onLoad
	},

	// 开始监听
	observer_start() {
		this.log('开启网络监听...')
		const request_observer = new PerformanceObserver((list) => {
			const entries = list.getEntries();
			for (const entry of entries) {
				let { entryType, initiatorType: type, name: url, transferSize: size } = entry
				if (entryType === 'resource' && ['img', 'video', 'audio'].includes(type)) {
					this.loadResources({ url, type, size })
					// this.resources_add({ url, size, type }) // 更新资源请求的大小以及一些协议头属性
				}
			}
		});
		request_observer.observe({ entryTypes: ['resource'] });

		// BUG 无法监听 insertAdjacentHTML
		const dom_observer = new MutationObserver((mutationsList) => {
			for (const mutation of mutationsList) {
				if (mutation.type === 'childList') {
					for (const node of mutation.addedNodes) {
						let tagName = (node.tagName || '').toLowerCase()
						let url = ''
						switch (tagName) {
							case 'video':
							case 'audio':
								url = node.src || node.querySelector('source').src
								break;

							case 'img':
								url = node.dataset.src || node.src
								break;
						}
						if (url.length) this.loadResources({ node })
					}
				}
			}
		});
		dom_observer.observe(document.body, { childList: true, subtree: true });
	},
	inst: {},

	show() {
		const self = this
		let { iframe, win, ifrmaeDoc } = createIframe({
			css: `
			border: 0;
			right: 10px;
			top: 10px;
			position: fixed;
			z-index: 99999;
			resize: both;
			max-height: 100vh;
			max-width: 100vw;
			width: 500px;
			height: 700px;
			`,
			html: `
			<main style="height: 100vh; width: 100vw;">
			  <div id='draggable-header' class="position-fixed top-0 left-0 w-full d-flex align-items-center" style="height: 30px;">
				<div id="header_start" class="me-auto"></div>
				  <div id="header_end" class="ms-auto">
				  <a class="btn btn-sm btn-outline-primary" data-action="min"><i class="ti ti-minus"></i></a>
				  <a class="btn btn-sm btn-outline-warning" data-action="max"><i class="ti ti-square"></i></a>
				  <a class="btn btn-sm btn-outline-danger" data-action="close"><i class="ti ti-x"></i></a>
				</div>
			  </div>
			  <div id="main_tabs"></div>
			</main>
			`
		})
		Object.assign(this, { iframe, window: win, ifrmaeDoc })
		ifrmaeDoc.location.baseURL = this.cdn // 自定义远程脚本加载源头
		loadRes(ifrmaeDoc, ['jquery.min.js', 'tabler.min.js', 'tabler.min.css', 'tabler-icons.min.css', 'index.css', 'until.js', 'action.js', 'preload.js', 'basedata.js', 'menu.js', 'tabler.helper.js', 'style.js', 'modal.js', 'input.js', 'toast.js', 'form.js', 'dropdown.js', 'plugins.js', 'tom-select.complete.min.js', 'tom-select.min.css', 'ping-pong.js', 'tabs1.js', 'selection.js', 'floatDiv.js'].map(url => {
			if (!url.startsWith('http')) {
				if (url.endsWith('.js')) {
					url = 'public/js/' + url
				} else
					if (url.endsWith('.css')) {
						url = 'public/css/' + url
					}
			}
			return this.cdn + url
		}), () => {
			this.$ = win.jQuery;
			this.$(() => ['initUntils', 'initSelection', 'initMenu', 'initActions', 'initTabs', 'initPlugins', 'initStyle'].map(method => self[method].call(self, win)))
		})
	},

	unselectAll() {
		this.getSelectedImage().removeClass('img_selected')
		this.window.g_selection.unset('selection_img')
	},
	// 更新过滤器
	applyFilter(imgs) {
		let v = this.window.g_form.getVals('resources_filter')
		v.size *= 1024

		// setConfig
		let ret = { hide: 0, show: 0 }
		let update = imgs == undefined
		imgs = update ? this.getAllImages() : [...imgs]

		for (let el of imgs) {
			let src = el.querySelector('img').src
			let { type, size, width, height } = el.dataset
			let hide = (
				(v.match != '' && src.match(v.match) == null) ||
				(v.exts != '' && !v.exts.split(',').some(ext => ext == 'all' || src.endsWith(ext))) ||
				(!v.types.includes('all') && !v.types.includes(type)) ||
				(v.size > size * 1 || v.width > width * 1 || v.height > height * 1) ||
				(v.ratio > 0 && v.ratio != '' && !v.ratio.split(',').some(i => i == 'all' || Math.abs(v.ratio - width / height) <= 0.15))
			)
			el.classList.toggle('hide1', hide)
			ret[hide ? 'hide' : 'show']++
		}
		update && this.window.getEle('showHidden').html(`已隐藏(${ret.hide})`)
		return ret
	},
	// 获取所有图片
	getAllImages(selector = '') {
		return this.$('.resource_item' + selector)
	},
	// 获取选中的图片
	getSelectedImage(cb) {
		let imgs = this.$('.resource_item.img_selected')
		if (!cb) return imgs

		let ret = []
		imgs.each((i, el) => {
			let val = cb(el, i)
			if (val !== false) ret.push(val)
		})
		return ret
	},
	// 更新选中信息
	updateSelected() {
		let cnt = this.getSelectedImage().length
		let hide = cnt == 0
		this.window.getEle('mc_send').toggleClass('hide', hide).html('添加【' + cnt + '】')
	},
	// 设置预览图片
	setPreviewImage(src) {
		const getDiv = () => document.querySelector('#mc_preview_img')

		let el = getDiv()
		let remove = !(src?.length)
		if (!el) {
			if (remove) return
			document.body.insertAdjacentHTML('beforeend', `
				<div id="mc_preview_img" style="
					position: fixed; z-index: 99999;
					bottom: 0; left: 0;
					width: calc(100vw);
					height: calc(100vh);
					pointer-events: none;
					background-color: rgba(0, 0, 0, .5)"
				>
				<div style="position: relative;text-align: center;height: 100%;">
					<img style="height: 100%;" >
				</div>
			</div>`)
			el = getDiv()
		} else
			if (remove) {
				return el.remove()
			}
		el.querySelector('img').src = getSourceImage(src)
	},


	initSelection({ g_selection }) {
		g_selection.register({
			name: 'selection_img',
			dbclickUnset: false,
			container: '.datalist-items',
			selector: '.datalist-item',
			selectedClass: 'img_selected',
			addSelect: true,
			multiSelect: true,
			callback: selected => this.updateSelected(),
			onUnset: clear => clear && this.updateSelected()
		})
	},

	cache_log: '',
	log(text) {
		text += "\n"
		if(!this.window){
			this.cache_log += text
		}else{
			text = `【${this.window.formatDate()}】` + text
			this.ifrmaeDoc.querySelector('#textarea_log').value += text
		}
	},

	log_clear() {
		this.cache_log = ''
		this.ifrmaeDoc.querySelector('#textarea_log').value = ''
	},

	initMenu({ g_menu }) {
		g_menu.registerMenu({
			name: 'datalist_item',
			selector: '.datalist-item',
			dataKey: 'data-md5',
			items: [{
				text: '设置封面',
				icon: 'photo',
				action: 'item_cover'
			}],
			async onShow() {
				// getEle('item_trash').toggleClass('hide', trashed)
			},
			onHide() {
				// g_preview.unpreview();
			}
		});
	},
	get_downlist(id){
		return this.downlist[id]
	},
	add_downlist(id){
		let now = Date.now()
		id ??= now
		if(this.get_downlist(id)) return false

		return this.downlist[id] = {
			start: now,
			cnt: 0
		}
	},
	remove_downlist(id){
		delete this.downlist[id]
	},

	toggleShow(show){
		if(!this.iframe) return this.show(true)

		if(show === undefined) show = !this.isShowing()
		this.iframe.style.display = show ? 'unset' : 'none'
	},

	downlist: {},
	initActions(win) {
		win.g_action.registerAction({
			min: () => this.toggleShow(false),
			show: () => this.toggleShow(true),
			close: () => {
				if(confirm('确定要退出吗？')){
					this.iframe.remove()
					this.icon.remove() & clearInterval(this.timer)
				}
			},
			max: () => {

			},
			download: () => {
				let info = this.add_downlist('download')
				if(info === false) return this.log('请等待下载队列完成', 'danger')

				this.loadScripts('filesaver', () => {
					let list = this.getSelectedImage(el => () => new Promise(reslove => {
						const next = args => badge.html(`[下载中] ${++info.cnt}/${info.max}`) & reslove(args)
						_request(getSourceImage(el.querySelector('img').src), {
							onload: ({finalUrl, response}) => next([finalUrl, response]),
							onerror: next
						})
					}))
					let max = list.length
					if(!max) return

					this.log('开始下载')
					info.max = max
					let badge = win.insertEl({ tag: 'span', text: '初始化...', props: { id: 'badge_download', class: 'badge bg-primary ms-1 me-1', 'data-action': 'stop_download' } }, { target: win.$('#header_start'), method: 'prependTo' })

					awaitPromises(list).then(ret => {
						let done = () => badge.remove() & this.remove_downlist('download')
						let items = ret.filter(item => Array.isArray(item))
						if(!items.length) return this.log('没有合法的下载内容！', 'danger') & done()

						badge.html('打包中...')
						let zip = new JSZip();
						items.forEach(([url, blob]) => {
							// TODO 文件名称
							zip.file(win.getFileName(url, true), blob);
						})
						zip.generateAsync({type: "blob"}).then(content => {
							saveAs(content, "images.zip") & done()
						})
					})
				})
			},
			log_clear: () => this.log_clear(),
			unsetAll: () => this.unselectAll(),
			selectAll: () => {
				this.getAllImages().toggleClass('img_selected', this.getSelectedImage().length == 0)
				this.updateSelected()
			},
			reveSelect: () => {
				this.getAllImages().toggleClass('img_selected')
				this.updateSelected()
			},
			removeSelect: () => {
				this.getSelectedImage().each((i, el) => this.resources_remove(el.dataset.url))
				this.updateSelected()
			},
			showHidden: () => {
				this.getAllImages('.hide1')
			},
			img_preview: dom => this.setPreviewImage(dom.src),
			img_unpreview: () => this.setPreviewImage(),
			mc_send: dom => {
				let btn = this.window.getEle('mc_send').addClass('btn-loading')
				this.window.arrayQueue(this.getSelectedImage(el => {
					let img = el.querySelector('img')
					let url = img.src
					let website = url
					let name = img.title || win.getFileName(url, false)
					let annotation = 'annotation'
					return {url, website, name, annotation}
				}), (item, i, max) => {
					return new Promise(reslove => {
						getImageBase64(item.url, getSourceImage(item.url)).then(imgData => {
							btn.removeClass('btn-loading').text(`${i} / ${max}`)
							reslove({...item, path: imgData})
						})
					})
				}, queue => {
					queue && Promise.all(queue).then(items => {
						btn.text('导入中')
						g_api.addFromPaths({ items }).then(ret => {
							btn.text('导入')
							ret && this.window.toast(JSON.stringify(ret, null, 2))
						})
					})
				})
			},
			mc_reset: () => {
				confirm('确定重置吗?').then(() => {
					this.unselectAll()
				})
			},
			// 设置过滤器
			setFilter: (dom, action) => {
				let { value } = dom
				// TODO 一次更新所有过滤器，而不是单独更新
				switch (action[1]) {
					case 'size':
						this.$(dom).prevUntil('.range_lable').find('.range_lable').text(this.window.renderSize(value * 1024))
						break

					case 'types':
					case 'ratio':
						let all = action[1] == 'types' ? 'all' : 0
						this.$(dom).parents('.form_input').find('input[type="checkbox"]').each((i, el) => {
							if (value == all) {
								if (el.value != all) el.checked = false
							} else
								if (el.value == all) el.checked = false
						})
						break;
				}
				win.g_pp.setTimeout('apply_filter', () => this.applyFilter(), 200)
			}
		})
	},

	initTabs(win) {
		const self = this
		let tabs = this.inst.tabs = win.g_tabs.register({
			name: 'main_tabs',
			container: '#main_tabs',
			class: 'show-icons',
			cardBody: 'p-0',
			moreItems: [],
			list: [{
				id: 'resources',
				icon: 'activity-heartbeat',
				title: '捕获',
				html: `
					<div class="position-relative" style="height: calc(100vh - 63px)">
						<div id="list_resources" class="datalist-items w-full d-flex flex-wrap justify-content-center overflow-y-scroll" style="padding-bottom: 50px;height: calc(100vh - 280px);grid-gap: 20px;" onscroll="clearEventBubble(event)"></div>

						<div id="resources_filter" style="max-height: 280px;" class=" position-absolute bottom-0 left-0 w-full overflow-y-auto">
						</div>
					</div>
					`
			},
			{
				id: 'import',
				icon: 'database-import',
				title: '导入',
				html: `计划中...`
			},
			{
				id: 'preset',
				icon: 'book',
				title: '预设',
				html: `计划中...`
			},
			{
				id: 'setting',
				icon: 'settings',
				title: '设置',
				html: `计划中...`
			},
			{
				id: 'log',
				icon: 'list',
				title: '日志',
				html: `
					<textarea id="textarea_log" class="form-control form-control-sm" readOnly rows=20 style="height: calc(100vh - 150px)">${self.cache_log}</textarea>
					<div class="d-flex w-full mt-2" style="height: 50px;">
						<div class="ms-auto">
							<button class="btn btn-primary" data-action="log_clear">清空</button>
						</div>
					</div>
				`
			}],
			event_init() {
				this.setActive('resources')
			},
			event_shown({ tab }) {
				switch (tab) {
					case 'resources':
						return self.initResourcesTab(win)
					case 'log':
						self.cache_log = ''
						return
				}
			}
		}).refresh()

	},

	initResourcesTab({ g_form, g_tabler }) {
		const self = this
		if (self.resources_inited) return
		self.resources_inited = true
		self.resources_refresh()

		// tom-select
		const toTomList = list => list.map(item => {
			let [value, text] = Array.isArray(item) ? item : [item]
			text ??= value
			return { value, text }
		})
		const onInit = function () {
			const removeValue = (search, val) => {
				let arr = (val ?? this.getValue()).split(',')
				let index = arr.indexOf(search)
				if (index != -1) {
					arr.splice(index, 1)
					this.setValue(arr)
				}
			}
			let last
			this.on('item_select', el => removeValue(el.dataset.value));
			this.on('change', val => {
				if (val == last) return
				last = val
				if (val == '') return this.setValue(['all'])

				let arr = val.split(',')
				if (arr.pop() == 'all') {
					this.setValue(['all'])
				} else {
					removeValue('all', val)
				}
			});
		}

		g_form.build('resources_filter', {
			class: 'p-0 m-0 pb-2 h-full align-content-center align-items-center',
			element_class: 'text-center align-self-center',
			element_bodyClass: 'mt-0 mb-0 p',
			elements: {
				types: {
					class: 'col-4',
					title: '',
					type: 'checkbox_list',
					list: { all: '全部', img: '图片', video: '视频', audio: '音频' },
					value: 'all',
					props: 'data-change="setFilter,types"'
				},
				ratio: {
					class: 'col-4',
					title: '',
					type: 'tom_select',
					size: 'sm',
					list: toTomList([['all', '所有尺寸'], [0.66, '2:3'], [0.75, '3:4'], [1, '1:1'], [1.77, '16:9']]),
					value: ['all'],
					onInit,
					props: 'data-change="setFilter,ratio"'
				},
				exts: {
					class: 'col-4',
					title: '',
					size: 'sm',
					type: 'tom_select',
					list: toTomList([['all', '所有格式'], 'jpg', 'png', 'webp', 'gif', 'svg', 'mp4', 'mp3', 'wav', 'webm']),
					value: ['all'],
					onInit,
					props: 'data-change="setFilter,types"'
				},
				match: {
					class: 'col-12 mb-1',
					title: '',
					rows: 2,
					placeHolder: '网址过滤',
					type: 'textarea',
					size: 'sm',
					props: 'data-input="setFilter,match"'
				},
				width: {
					class: 'col-4',
					title: '宽',
					type: 'range',
					opts: { min: 0, max: 4000, step: 1, format: '%spx' },
					value: 0,
					props: 'data-input="setFilter,width"'
				},
				height: {
					class: 'col-4',
					title: '高',
					type: 'range',
					opts: { min: 0, max: 4000, step: 1, format: '%spx' },
					value: 0,
					props: 'data-input="setFilter,height"'
				},
				size: {
					class: 'col-4',
					title: '大小',
					type: 'range',
					opts: { min: 0, max: 1024 * 4, step: 1 }, // TODO 变更选择范围选项
					value: 0,
					props: 'data-input="setFilter,size"'
				},
				actions: {
					class: 'col-12',
					type: 'html',
					bodyClass: 'mt-2',
					value: `
                      <div class="row align-items-center">
                        <div class="col-3">
                          ${g_tabler.build_select({
						list: ['计划中'],
						value: '',
						class: 'form-select-sm',
					})}
                          ${g_tabler.build_select({
						list: ['计划中'],
						value: '',
						class: 'form-select-sm',
					})}
                        </div>
                        <div class="col-auto">
                          <small>
                            <a href='javascript: void(0)' data-action="selectAll">全选</a>
                            <a href='javascript: void(0)' data-action="reveSelect">反选</a>
                            <a href='javascript: void(0)' data-action="showHidden">已隐藏</a>
                            <a href='javascript: void(0)' data-action="unsetAll">取消选中</a>
                            <a href='javascript: void(0)' data-action="removeSelect">移除选中</a>
                          </small>
                        </div>
                        <div class="col-12 text-end d-flex justify-content-end" style="gap: 10px;">
                          <div class="dropdown">
                            <a class="btn btn-sm dropdown-toggle" data-bs-toggle="dropdown">...</a>
                            <div class="dropdown-menu">
                              <a data-action="download" class="dropdown-item"><i class="ti ti-download me-1"></i>下载</a>
                              <a class="dropdown-item">...</a>
                            </div>
                          </div>
                          <button class="btn btn-sm btn-primary" data-action="mc_send">导入</button>
                          <button class="btn btn-sm btn-danger" data-action="mc_reset">重置</button>
                        </div>
                      </div>
                    `
				},
			},
			target: self.ifrmaeDoc.querySelector('#resources_filter')
		})
	},

	initStyle({ g_style }) {
		g_style.addStyle('image', `
			.img_selected img {
				border: 4px solid #206bc4;
			}
		`)
	},

	initPlugins(win) {
		let { g_plugin } = win
		win.assignInstance(g_plugin, {
			homepage: 'https://github.com/hunmer/mCollection/issues',
			init: () => g_plugin.initPlugins()
		})
	},


	loadScripts(name, cb){
		let urls
		if(name == 'filesaver'){
			urls = ['https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js']
		}else return
		loadRes(document, urls, cb)
	},

	initUntils(win) {
		// iframe不支持使用eval函数的替代方案
		Object.assign(win, {
			getObjVal(obj, key, def) {
				let val = obj
				key.split('.').some(k => {
					if (typeof (val[k]) == 'undefined') return true
					val = val[k]
				})
				return val ?? def
			},
			setObjVal(obj, key, value) {
				let last
				let val = obj
				let keys = key.split('.')
				if (keys.every(k => {
					if (typeof (val[k]) != 'undefined') {
						last = val
						val = val[k]
						return true
					}
				})) {
					last[keys.pop()] = value
					return true
				}
			}
		})
	},
}

g_app.init()

var g_api = {
	api: 'http://127.0.0.1:41597/',
	fetch(url, opts) {
		return GM_xmlhttpRequest({
			url, ...opts
		})
	},
	addFromPaths(data) {
		let items = data.items
		let all = items.length
		delete data.items
		if(all > 50) g_app.inst.tabs.setActive('log')
		g_app.log(`准备发送数据给mCollection...（${ items.length})`) & console.log(data)
		return new Promise(reslove => {
			const next = () => {
				let list = items.splice(0, 10)
				let len = list.length
				if(!len) return reslove({msg: 'OK'})

				g_app.log(`发送中...（${len} / ${items.length})`)
				this.fetch(this.api + "api/item/addFromPaths", {
					method: 'POST',
					responseType: 'JSON',
					headers: {
						'Content-Type': 'application/json'
						// 'Content-Type': 'application/x-www-form-urlencoded',
					},
					onerror: () => alert('导入失败,请确保mCollection在后台运行!') & reslove(),
					onload: ({status, statusText, responseText}) => {
						if (status == 200 && statusText == 'OK') {
							g_app.log(`收到mCollection回复...（${responseText}}）`)

							let ret = JSON.parse(responseText)
							// reslove(ret)
							console.log(ret)
							next()
						}
					},
					data: JSON.stringify({...data, items: list})
				})
			}
			next()
		})
	}
}

function getImageBase64(url, source ) {
	// TODO 进度显示
	let target = source || url
	return new Promise(reslove => {
		if (target.startsWith('data:image')) return reslove(target)
		_request(target, {
			// onprogress: progress =>
			onload: ({response}) => {
				let img = new Image();
				img.src = URL.createObjectURL(response);
				img.onload = () => {
					let canvas = document.createElement('canvas');
					canvas.width = img.width;
					canvas.height = img.height;
					canvas.getContext('2d').drawImage(img, 0, 0);
					reslove(canvas.toDataURL());
				}
			},
			onerror: reason => {
				console.error({msg: '获取图片失败！', url, source, reason})
				if(source != url) return getImageBase64(url).then(reslove) // 尝试获取小图片
			}
		})
	})
}

function _request(opts, callbacks = {}){
	let {onerror, onload, onstatechange} = callbacks
	if(typeof(opts) != 'object') opts = {url: opts}
	return GM_xmlhttpRequest(Object.assign({
		timeout: 1000 * 10,
		responseType: 'blob',
		anonymous: true,
		onprogress({ loaded, total }) {
			callbacks.onprogress && callbacks.onprogress(parseInt(loaded / total * 100))
		},
		onload(...args) {
			onload && onload.apply(this, args)
		},
		onreadystatechange({readyState, status}) {
			if(readyState == 4 && status != 200){
				onerror && onerror('error code ' + status)
			}
			onstatechange && onstatechange.apply(this, args)
		},
		// 下面的好像不触发...
		onerror: () => onerror && onerror('error'),
		ontimeout: () => onerror && onerror('timeout'),
		onabort: () => onerror && onerror('abort'),
	}, opts))
}

function createIframe(opts) {
	let iframe = this.iframe = document.createElement('iframe');
	iframe.src = 'about:blank';
	iframe.sandbox = 'allow-scripts allow-same-origin allow-modals';
	iframe.style.cssText = opts.css || ''
	document.body.appendChild(iframe);

	let { contentWindow: win, contentDocument } = iframe
	let ifrmaeDoc = contentDocument || win.document;
	ifrmaeDoc.body.innerHTML = opts.html
	initDraggableEles(ifrmaeDoc, iframe)
	return { iframe, win, ifrmaeDoc }
}

function initDraggableEles(container, parentEle){
	parentEle ??= container
	let isDragging = false;
	let lastX, lastY;
	let header = container.querySelector('#draggable-header')
	header.addEventListener('mousedown', function ({ offsetX, offsetY }) {
		lastX = offsetX;
		lastY = offsetY;
		isDragging = true;
	})
	header.addEventListener('mouseenter', () => header.style.cursor = 'move')
	header.addEventListener('mouseleave', () => header.style.cursor = 'none')
	container.addEventListener('mousemove', event => {
		if (isDragging) {
			let { left, top, width, height } = parentEle != container ? parentEle.getBoundingClientRect() : {left: 0, top: 0, width: 0, height: 0}
			let x = Math.min(Math.max(0, left + event.clientX - lastX), unsafeWindow.innerWidth - width);
			let y = Math.min(Math.max(0, top + event.clientY - lastY), unsafeWindow.innerHeight - height);
			parentEle.style.left = `${x}px`;
			parentEle.style.top = `${y}px`;
			event.preventDefault()
		}
	})
	container.addEventListener('mouseup', () => isDragging = false)
	container.addEventListener('mouseleave', () => isDragging = false)
}


function getSourceImage(url) {
	let args = url.split('/')
	if (url.includes('i.pinimg.com')) { // pinterest
		args[3] = 'originals'
	}else
	if(url.includes('.sinaimg.cn')){ // weibo
		// https://wx1.sinaimg.cn/orj360/006YezONly1hfn358xn4lj30jg0jgwgp.jpg
		// https://wx1.sinaimg.cn/large/006YezONly1hfn358xn4lj30jg0jgwgp.jpg
		args[3] = 'large'
	}
	return args.join('/')
}

const _loadedScripts = []
function loadRes(doc, files, callback, cache = true) {
	files = [...files]
	const load = url => {
		return new Promise(reslove => {
			if(_loadedScripts.includes(url)) reslove()
			_request({url, responseType: undefined}, {
				onload: ({ responseText }) => {
					_loadedScripts.push(url)
					let isCss = url.endsWith('.css')
					if (isCss) {
						let arr = url.split('/')
						arr.pop()
						responseText = responseText.replaceAll('./', arr.join('/') + '/') // 替换相对资源地址
					}
					reslove(GM_addElement(doc.head, isCss ? 'style' : 'script', {textContent: responseText}))
				}
			})
		})
	}
	const next = () => {
		let url = files.shift()
		if (url == undefined) return callback && callback()

		let ext = url.split('.').pop().toLowerCase()
		if (ext == "js") {
			if (!cache || !doc.querySelector('script[src="' + url + '"]')) {
				return load(url).then(next)
			}
		} else
			if (ext == "css") {
				if (!cache || !doc.querySelector('link[href="' + url + '"]')) {
					return load(url).then(next)
				}
			}
		next()
	}
	next()
}

// 类似primise.all, 但是它也能接受函数对象，让promise初始化保持顺序进行
function awaitPromises(promises) {
    return new Promise(reslove=>{
        let ret = []
        const next = ()=>{
            let promise = promises.shift()
            if (promise == undefined) return reslove(ret)
			if(typeof(promise) == 'function') promise = promise()
            promise.then(val => ret.push(val) & next())
        }
        next()
    })
}

Object.defineProperty(Array.prototype, 'map1', {
    value: function(cb) {
        let ret = [], val
        this.forEach(item => {
            if((val = cb(item)) !== undefined) ret.push(val)
        })
        return ret
    },
    enumerable: false
  });