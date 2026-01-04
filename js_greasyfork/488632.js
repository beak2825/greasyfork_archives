// ==UserScript==
// @name         幻想次元黑名单脚本
// @namespace    http://tampermonkey.net/
// @version      2025-04-08
// @description  用于屏蔽幻想次元文章和评论
// @author       Aerry
// @license      MIT
// @match        http*://hxcy.top/*
// @icon         https://hxcy.top/wp-content/themes/wpdx/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/488632/%E5%B9%BB%E6%83%B3%E6%AC%A1%E5%85%83%E9%BB%91%E5%90%8D%E5%8D%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/488632/%E5%B9%BB%E6%83%B3%E6%AC%A1%E5%85%83%E9%BB%91%E5%90%8D%E5%8D%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
	'use strict'
	// 初始化数据
	const initData = () => {
		let data = localStorage.getItem('blockAuthor')
		if (!data) {
			data = {
				categories: ['默认', '低质量', '广告'],
				authors: []
			}
			localStorage.setItem('blockAuthor', JSON.stringify(data))
		} else {
			try {
				const parsedData = JSON.parse(data)
				// 检查是否是对象且包含authors数组
				if (typeof parsedData === 'object' && parsedData !== null &&
					Array.isArray(parsedData.authors)) {
					data = parsedData
				} else {
					// 如果数据格式不正确，重置为默认值
					data = {
						categories: ['默认', '低质量', '广告'],
						authors: []
					}
					localStorage.setItem('blockAuthor', JSON.stringify(data))
				}
			} catch (e) {
				// 如果解析失败，也重置为默认值
				data = {
					categories: ['默认', '低质量', '广告'],
					authors: []
				}
				localStorage.setItem('blockAuthor', JSON.stringify(data))
			}
		}
		return typeof data === 'string' ? JSON.parse(data) : data
	}
	// 保存数据
	const saveData = (data) => {
		localStorage.setItem('blockAuthor', JSON.stringify(data))
	}
	// 创建控制按钮
	const createControlButton = () => {
		const btn = document.createElement('div')
		btn.id = 'togglePanelBtn'
		btn.innerHTML = '打开<br>面板'
		btn.style.position = 'fixed'
		btn.style.right = '20px'
		btn.style.bottom = '130px'
		btn.style.fontSize = '12px'
		btn.style.color = '#fff'
		btn.style.backgroundColor = '#323841'
		btn.style.width = '40px'
		btn.style.padding = '8px 0'
		btn.style.textAlign = 'center'
		btn.style.borderRadius = '2px'
		btn.style.zIndex = '1000'
		btn.style.cursor = 'pointer'
		document.body.appendChild(btn)
		return btn
	}
	// 创建面板
	const createPanel = () => {
		const panel = document.createElement('div')
		panel.id = 'blockAuthorPanel'
		panel.style.display = 'none' // 默认隐藏
		GM_addStyle(`
			@media screen and (max-width: 768px) {
				#togglePanelBtn {
					bottom: 85px !important;
				}
			}

			#blockAuthorPanel {
				position: fixed;
				top: 50px;
				right: 20px;
				width: 350px;
				background: #fff;
				border: 1px solid #ddd;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
				z-index: 9999;
				padding: 15px;
				font-family: Arial, sans-serif;
				max-height: 80vh;
				overflow-y: auto;
			}

			#blockAuthorPanel h2 {
				margin-top: 0;
				padding-bottom: 10px;
				border-bottom: 1px solid #eee;
				font-size: 18px;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.close-panel {
				cursor: pointer;
				font-size: 20px;
				color: #999;
			}

			.close-panel:hover {
				color: #666;
			}

			.author-list {
				margin: 10px 0;
			}

			.author-item {
				display: flex;
				align-items: center;
				padding: 8px 0;
				border-bottom: 1px solid #f5f5f5;
			}

			.author-item:hover {
				background: #f9f9f9;
			}

			.author-name {
				flex-grow: 1;
				margin-left: 10px;
			}

			.category-tag {
				display: inline-block;
				padding: 2px 6px;
				background: #e1f5fe;
				border-radius: 3px;
				font-size: 12px;
				margin-left: 10px;
				color: #0288d1;
			}

			.panel-actions {
				display: flex;
				justify-content: space-between;
				margin-top: 15px;
				padding-top: 10px;
				border-top: 1px solid #eee;
			}

			.panel-btn {
				padding: 6px 12px;
				background: #f0f0f0;
				border: 1px solid #ddd;
				border-radius: 3px;
				cursor: pointer;
			}

			.panel-btn:hover {
				background: #e0e0e0;
			}

			.panel-btn.primary {
				background: #4CAF50;
				color: white;
				border-color: #4CAF50;
			}

			.panel-btn.danger {
				background: #f44336;
				color: white;
				border-color: #f44336;
			}

			.category-selector {
				margin-bottom: 15px;
			}

			.category-filter {
				margin-bottom: 10px;
			}

			.add-author-form {
				display: flex;
				margin-bottom: 15px;
			}

			.add-author-input {
				flex-grow: 1;
				padding: 6px;
				border: 1px solid #ddd;
				border-radius: 3px;
			}

			.add-author-btn {
				margin-left: 10px;
			}

			.import-export-area {
				width: 100%;
				height: 100px;
				margin-bottom: 10px;
				border: 1px solid #ddd;
				padding: 5px;
			}`)
		panel.innerHTML = `
		<h2>
			<span>作者屏蔽面板</span>
			<span class="close-panel" title="关闭面板">×</span>
		</h2>
		<div class="category-filter">
			<select id="categoryFilter" class="panel-btn">
				<option value="all">所有分类</option>
			</select>
		</div>
		<div class="add-author-form">
			<input type="text" id="newAuthorName" class="add-author-input" placeholder="作者名称">
			<select id="newAuthorCategory" class="panel-btn">
			</select>
			<button id="addAuthorBtn" class="panel-btn add-author-btn">添加</button>
		</div>
		<div class="author-list" id="authorList"></div>
		<div class="panel-actions">
			<div>
				<button id="selectAllBtn" class="panel-btn">全选</button>
				<button id="deselectAllBtn" class="panel-btn">取消</button>
			</div>
			<div>
				<button id="deleteSelectedBtn" class="panel-btn danger">删除</button>
			</div>
		</div>
		<div class="panel-actions">
			<div>
				<button id="exportBtn" class="panel-btn">导出数据</button>
				<button id="importBtn" class="panel-btn">导入数据</button>
			</div>
		</div>
		<div id="importExportArea" style="display: none">
			<textarea class="import-export-area" id="dataTextarea"></textarea>
			<div class="panel-actions">
				<button id="confirmImportBtn" class="panel-btn primary">确认导入</button>
				<button id="cancelImportBtn" class="panel-btn">取消</button>
			</div>
		</div>`
		document.body.appendChild(panel)
		return panel
	}
	// 渲染作者列表
	const renderAuthorList = (data, filter = 'all') => {
		const authorList = document.getElementById('authorList')
		authorList.innerHTML = ''
		const authors = filter === 'all'
			? data.authors
			: data.authors.filter(author => author.category === filter)
		if (authors.length === 0) {
			authorList.innerHTML = '<p>没有作者数据</p>'
			return
		}
		authors.forEach(author => {
			const authorItem = document.createElement('div')
			authorItem.className = 'author-item'
			authorItem.innerHTML = `
				<input type="checkbox" class="author-checkbox" data-id="${author.id}" ${author.selected ? 'checked' : ''}>
				<span class="author-name">${author.name}</span>
				<span class="category-tag">${author.category}</span>
			`
			authorList.appendChild(authorItem)
		})
		// 添加点击事件
		document.querySelectorAll('.author-checkbox').forEach(checkbox => {
			checkbox.addEventListener('change', function () {
				const id = parseInt(this.getAttribute('data-id'))
				data.authors = data.authors.map(author => {
					if (author.id === id) {
						author.selected = this.checked
					}
					return author
				})
				saveData(data)
			})
		})
	}
	// 渲染分类选择器
	const renderCategorySelectors = (data) => {
		const categoryFilter = document.getElementById('categoryFilter')
		const newAuthorCategory = document.getElementById('newAuthorCategory')
		// 清空现有选项
		categoryFilter.innerHTML = '<option value="all">所有分类</option>'
		newAuthorCategory.innerHTML = ''
		// 添加分类选项
		data.categories.forEach(category => {
			categoryFilter.innerHTML += `<option value="${category}">${category}</option>`
			newAuthorCategory.innerHTML += `<option value="${category}">${category}</option>`
		})
	}
	// 主函数
	const main = () => {
		let data = initData()
		addButton(data)
		const toggleBtn = createControlButton()
		const panel = createPanel()
		renderCategorySelectors(data)
		renderAuthorList(data)
		// 切换面板显示/隐藏
		const togglePanel = () => {
			if (panel.style.display === 'none') {
				panel.style.display = 'block'
				toggleBtn.innerHTML = '关闭<br>面板'
				// 刷新数据
				data = initData()
				renderCategorySelectors(data)
				renderAuthorList(data, document.getElementById('categoryFilter').value)
			} else {
				panel.style.display = 'none'
				toggleBtn.innerHTML = '打开<br>面板'
			}
		}
		// 控制按钮点击事件
		toggleBtn.addEventListener('click', togglePanel)
		// 关闭按钮点击事件
		panel.querySelector('.close-panel').addEventListener('click', function () {
			panel.style.display = 'none'
			toggleBtn.innerHTML = '打开<br>面板'
		})
		// 分类筛选事件
		document.getElementById('categoryFilter').addEventListener('change', function () {
			renderAuthorList(data, this.value)
		})
		// 添加作者事件
		document.getElementById('addAuthorBtn').addEventListener('click', function () {
			const nameInput = document.getElementById('newAuthorName')
			const categorySelect = document.getElementById('newAuthorCategory')
			const name = nameInput.value.trim()
			if (name) {
				// 检查是否已存在
				const exists = data.authors.some(author => author.name === name)
				if (exists) {
					alert('该作者已存在!')
					return
				}
				// 获取最大ID
				const maxId = data.authors.reduce((max, author) => Math.max(max, author.id), 0)
				// 添加新作者
				data.authors.push({
					id: maxId + 1,
					name: name,
					category: categorySelect.value,
					selected: false
				})
				saveData(data)
				renderAuthorList(data, document.getElementById('categoryFilter').value)
				nameInput.value = ''
			}
		})
		// 全选事件
		document.getElementById('selectAllBtn').addEventListener('click', function () {
			const filter = document.getElementById('categoryFilter').value
			const authorsToUpdate = filter === 'all'
				? data.authors
				: data.authors.filter(author => author.category === filter)

			data.authors = data.authors.map(author => {
				if (authorsToUpdate.some(a => a.id === author.id)) {
					author.selected = true
				}
				return author
			})
			saveData(data)
			renderAuthorList(data, filter)
		})
		// 取消全选事件
		document.getElementById('deselectAllBtn').addEventListener('click', function () {
			const filter = document.getElementById('categoryFilter').value
			const authorsToUpdate = filter === 'all'
				? data.authors
				: data.authors.filter(author => author.category === filter)
			data.authors = data.authors.map(author => {
				if (authorsToUpdate.some(a => a.id === author.id)) {
					author.selected = false
				}
				return author
			})
			saveData(data)
			renderAuthorList(data, filter)
		})
		// 删除选中事件
		document.getElementById('deleteSelectedBtn').addEventListener('click', function () {
			if (confirm('确定要删除选中的作者吗?')) {
				data.authors = data.authors.filter(author => !author.selected)
				saveData(data)
				renderAuthorList(data, document.getElementById('categoryFilter').value)
			}
		})
		// 导出数据事件
		document.getElementById('exportBtn').addEventListener('click', function () {
			const importExportArea = document.getElementById('importExportArea')
			const dataTextarea = document.getElementById('dataTextarea')
			dataTextarea.value = JSON.stringify(data, null, 2)
			importExportArea.style.display = 'block'
		})
		// 导入数据事件
		document.getElementById('importBtn').addEventListener('click', function () {
			const importExportArea = document.getElementById('importExportArea')
			const dataTextarea = document.getElementById('dataTextarea')
			dataTextarea.value = ''
			importExportArea.style.display = 'block'
		})
		// 确认导入事件
		document.getElementById('confirmImportBtn').addEventListener('click', function () {
			const dataTextarea = document.getElementById('dataTextarea')
			try {
				const newData = JSON.parse(dataTextarea.value)
				if (newData.categories && newData.authors) {
					data = newData
					saveData(data)
					renderCategorySelectors(data)
					renderAuthorList(data, document.getElementById('categoryFilter').value)
					document.getElementById('importExportArea').style.display = 'none'
				} else {
					alert('数据格式不正确!')
				}
			} catch (e) {
				alert('解析JSON失败: ' + e.message)
			}
		})
		// 取消导入/导出事件
		document.getElementById('cancelImportBtn').addEventListener('click', function () {
			document.getElementById('importExportArea').style.display = 'none'
		})
		// 添加拖拽功能
		let isDragging = false
		let offsetX, offsetY
		panel.querySelector('h2').addEventListener('mousedown', function (e) {
			if (e.target.className !== 'close-panel') {
				isDragging = true
				offsetX = e.clientX - panel.getBoundingClientRect().left
				offsetY = e.clientY - panel.getBoundingClientRect().top
				panel.style.cursor = 'grabbing'
			}
		})
		document.addEventListener('mousemove', function (e) {
			if (isDragging) {
				panel.style.left = (e.clientX - offsetX) + 'px'
				panel.style.top = (e.clientY - offsetY) + 'px'
			}
		})
		document.addEventListener('mouseup', function () {
			isDragging = false
			panel.style.cursor = ''
		})
	}
	// 加载相关按钮
	const addButton = (data) => {
		// 获取最大ID
		const maxId = data.authors.reduce((max, author) => Math.max(max, author.id), 0)
		// 判断是否文章内页
		if (document.querySelector('body.single')) {
			// 加入黑名单
			const blockAuthor = () => {
				const author = document.querySelector('.post-meta span:nth-child(1) a')
				if (!data.authors.some(i => i.name == author.innerText)) {
					data.authors.push({
						id: maxId + 1,
						name: author.innerText,
						category: '默认',
						selected: false
					})
				}
				const [blockAuthor, whiteAuthor] = document.querySelectorAll('#blockAuthor, #whiteAuthor')
				blockAuthor.style.display = 'none'
				whiteAuthor.style.display = ''
				saveData(data)
				renderAuthorList(data, document.getElementById('categoryFilter').value)
				alert(`已屏蔽作者 ${author.innerText} 的文章, 刷新页面后生效`)
			}
			// 移出黑名单
			const whiteAuthor = () => {
				const author = document.querySelector('.post-meta span:nth-child(1) a')
				data.authors = data.authors.filter(i => i.name != author.innerText)
				saveData(data)
				renderAuthorList(data, document.getElementById('categoryFilter').value)
				const [blockAuthor, whiteAuthor] = document.querySelectorAll('#blockAuthor, #whiteAuthor')
				blockAuthor.style.display = ''
				whiteAuthor.style.display = 'none'
				alert(`已解除对于作者 ${author.innerText} 文章的屏蔽`)
			}
			const name = document.querySelector('#post-header .post-meta span:nth-child(1) a')
			const newListItem = document.createElement('li')
			const newButton1 = document.createElement('span')
			newButton1.onclick = blockAuthor
			newButton1.textContent = '屏蔽他的文章'
			newButton1.id = 'blockAuthor'
			newButton1.classList.add('badge')
			newButton1.style.display = data.authors.some(i => i.name == name.innerText) ? 'none' : ''
			const newButton2 = document.createElement('span')
			newButton2.id = 'whiteAuthor'
			newButton2.classList.add('badge')
			newButton2.onclick = whiteAuthor
			newButton2.textContent = '取消屏蔽他的文章'
			newButton2.style.display = data.authors.some(i => i.name == name.innerText) ? '' : 'none'
			newListItem.appendChild(newButton1)
			newListItem.appendChild(newButton2)
			const socialList = document.querySelector('.author-social')
			socialList.appendChild(newListItem)
			// 美化按钮
			const styleElement = document.createElement('style')
			styleElement.innerHTML = `
			.author-social .badge {
				border-radius: 0;
				line-height: 24px;
				background-color: #fe9a4b;
			}
			.author-social .badge:hover {
				background-color: #FF7000;
			}
			.badge.block {
				font-size: 11px;
			}`
			document.head.appendChild(styleElement)
		}
		// 判断是否分类页或标签
		if (document.querySelector('body.category') || document.querySelector('body.tag')) {
			// 文章列表
			const authors = document.querySelectorAll('.post-meta span:nth-child(1) a')
			const posts = document.querySelectorAll('.posts-ul li')
			authors.forEach((author, index) => {
				if (data.authors.some(i => i.name == author.innerText)) posts[index].remove()
			})
		}
		// 判断是否用户中心
		if (document.querySelector('body.author')) {
			if (data.authors.some(i => i.name == document.querySelector('.user-avatar img').alt)) document.querySelector('.widget-content').remove()
		}
		// 判断是否含有网站公告
		if (document.querySelectorAll('.widget-box.widget.category-posts')) {
			// 网站公告
			const categoryPosts = document.querySelectorAll('.widget-box.widget.category-posts li')
			categoryPosts.forEach((item, i) => {
				if (item.childNodes[1].childNodes[1]?.dataset.author && data.authors.some(i => i.name == item.childNodes[1].childNodes[1]?.dataset.author)) item.remove()
			})
		}
		//判断是否首页
		if (document.querySelector('body.home')) {
			// 最新文章 || 点击排行 || 最新资讯
			const recentPosts = document.querySelectorAll('.home-recent li')
			recentPosts.forEach((Item, i) => {
				if (Item.childNodes[2]?.dataset?.author && data.authors.some(i => i.name == Item.childNodes[2].dataset.author)) Item.remove()
			})
			// 图包分享 || Cosplay写真
			const picBoxPosts = document.querySelectorAll('.pic-box li')
			picBoxPosts.forEach((Item, i) => {
				if (Item.childNodes[1]?.dataset?.author && data.authors.some(i => i.name == Item.childNodes[1].dataset.author)) Item.remove()
			})
			// ACG资源聚合
			const threePosts = document.querySelectorAll('.three-row li')
			threePosts.forEach((Item, i) => {
				if (Item.childNodes[1].childNodes[1]?.dataset?.author && data.authors.some(i => i.name == Item.childNodes[1].childNodes[1].dataset.author)) Item.remove()
			})
			// 音乐分享 || 游戏分享 || 娱乐生活 || 工具&技巧
			const columnPosts = document.querySelectorAll('.column2 li')
			columnPosts.forEach((Item, i) => {
				if (Item.childNodes[1].childNodes[1] && Item.childNodes[1].childNodes[1]?.dataset?.author && data.authors.some(i => i.name == Item.childNodes[1].childNodes[1].dataset.author)) Item.remove()
				if (Item.childNodes[3] && Item.childNodes[3]?.dataset.author && data.authors.some(i => i.name == Item.childNodes[3].dataset.author)) Item.remove()
			})
		}
		//判断当前页面是否含有评论模块
		if (document.querySelector('.comment-box')) {
			const commentList = document.querySelectorAll('.commentlist .comment')
			const commentIdList = document.querySelectorAll('.conment_id')
			// 加入黑名单
			const blockCommentAuthor = (vl) => {
				if (!data.authors.some(i => i.name == vl.target.name)) {
					data.authors.push({
						id: maxId + 1,
						name: vl.target.name,
						category: '默认',
						selected: false
					})
				}
				const whiteClass = vl.target.id.replace('block', 'white')
				const whiteAuthor = document.querySelector(`#${whiteClass}`)
				vl.target.style.display = 'none'
				whiteAuthor.style.display = ''
				saveData(data)
				renderAuthorList(data, document.getElementById('categoryFilter').value)
				alert(`已屏蔽 ${vl.target.name} 的评论, 刷新页面后生效`)
			}
			// 移出黑名单
			const whiteCommentAuthor = (vl) => {
				const name = document.querySelector('.comment-author .conment_id a:nth-child(1)').innerText
				data.authors = data.authors.filter(i => i.name != name)
				saveData(data)
				renderAuthorList(data, document.getElementById('categoryFilter').value)
				const blockClass = vl.target.id.replace('white', 'block')
				const blockAuthor = document.querySelector(`#${blockClass}`)
				blockAuthor.style.display = ''
				vl.target.style.display = 'none'
				alert(`已解除对于 ${vl.target.name} 评论的屏蔽`)
			}
			// 如果有评论的话
			if (commentIdList.length > 0) {
				commentIdList.forEach((author, index) => {
					const commentButton1 = document.createElement('span')
					commentButton1.onclick = blockCommentAuthor
					commentButton1.textContent = '屏蔽他的评论'
					commentButton1.id = `blockCommentAuthor-${index}`
					commentButton1.classList = 'badge block'
					commentButton1.style.display = data.authors.some(i => i.name == author.childNodes[0].innerText) ? 'none' : ''
					commentButton1.name = author.childNodes[0].innerText
					const commentButton2 = document.createElement('span')
					commentButton2.id = `whiteCommentAuthor-${index}`
					commentButton2.classList = 'badge block'
					commentButton2.onclick = whiteCommentAuthor
					commentButton2.textContent = '取消屏蔽他的评论'
					commentButton2.style.display = data.authors.some(i => i.name == author.childNodes[0].innerText) ? '' : 'none'
					commentButton2.name = author.childNodes[0].innerText
					author.appendChild(commentButton1)
					author.appendChild(commentButton2)
					commentList[index].title = author.childNodes[0].innerText
					// 隐藏评论
					if (data.authors.some(i => i.name == author.childNodes[0].innerText)) commentList[index].remove()
				})
			}
		}
	}
	// 启动脚本
	main()
})()