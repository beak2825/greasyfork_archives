// ==UserScript==
// @name         一键批量下载阿里国际站图片/视频
// @namespace    https://www.alibaba.com
// @version	1.0.15
// @description	 一键批量下载阿里巴巴国际站主图，详情页(重构和经过了一些逻辑上的改良，按钮更协调；内存占用更小；操作更流畅)
// @author       Leo
// @homepage
// @match        https://www.alibaba.com/product-detail/*
// @match        https://*.en.alibaba.com/product/*
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant			   GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/431699/%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E9%98%BF%E9%87%8C%E5%9B%BD%E9%99%85%E7%AB%99%E5%9B%BE%E7%89%87%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/431699/%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E9%98%BF%E9%87%8C%E5%9B%BD%E9%99%85%E7%AB%99%E5%9B%BE%E7%89%87%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
/*jshint multistr:true */

/*
 * 下载天猫图片工具
 * 下载商品主图
 * 下载sku
 * 下载详情页
 * */

window.onload = async () => {
	const props = getData()
	if (!props) {
		return
	}
	await setStyle()
	await getProductImage(props)
	await getProductSKU(props)
	await getProductInfoPage(props)
}

// 获取数据方法
function getData() {
	// 全部变量
	const props = {}
	const params = location.search.substr(1).split('&')
	for (let i in params) {
		props[params[i].split('=')[0]] = unescape(params[i].split('=')[1])
	}
	// 获取产品id
	const i = location.href.indexOf('.html')
	if (i) {
		let k = 5
		while (location.href[i - k - 1] !== '_' && k < 20) {
			k++
		}
		props.id = location.href.substr(i - k, k)
		return props
	}
}

// 注入下载商品主图方法
function getProductImage(props) {
	// 获取主图缩略图列表DOM
	let imgList = document
		.getElementById('module_main_image')
		?.getElementsByClassName('main-image-thumb-ul')[0]
	const downBox = document.createElement('div')
	const title = document.createElement('h3')
	title.innerHTML = '下载主图/视频'
	title.style = 'text-align: center; margin-bottom: 10px; margin-top: 10px'
	downBox.appendChild(title)
	// 创建并插入下载按钮列表
	const downList = document.createElement('ul')
	downList.className = 'main-image-thumb-ul'
	imgList.insertAdjacentElement('afterend', title)
	title.insertAdjacentElement('afterend', downList)

	// 创建主图的下载链接列表
	const imgArr = []

	// 遍历主图缩略图，并插入下载按钮
	for (let k = 0; k < imgList.getElementsByTagName('li').length; k++) {
		let isVideo = false
		// 检查首图视频
		if (k === 0) {
			if (
				imgList.getElementsByTagName('li')[0]?.getElementsByTagName('div')[0]
			) {
				// 首图是视频，不用获取图片
				isVideo = true
				const video = document
					.getElementById('module_main_image')
					?.getElementsByTagName('video')[0]
				const src = video?.src
				if (src) {
					// 添加下载视频按钮
					const downButton = document.createElement('li')
					downButton.className = 'main-image-thumb-item'
					const downImg = document.createElement('div')
					downImg.style =
						'width:49px; height:49px; text-align:center; color:red'
					downImg.innerHTML = '下载视频'
					downImg.style.cursor = 'pointer'
					downImg.onmouseover = () => {
						imgList.getElementsByTagName('li')[k].className =
							'main-image-thumb-item active'
					}
					downImg.onmouseout = () => {
						imgList.getElementsByTagName('li')[k].className =
							'main-image-thumb-item'
					}
					downImg.onclick = () => {
						GM_notification('正在下载主图视频，请稍等', '下载主图视频')
						GM_download(
							src,
							`${props.id}_视频_${k >= 9 ? k + 1 : '0' + (k + 1)}`
						)
					}
					downList.appendChild(downButton)
					downButton.appendChild(downImg)
				}
			}
		}
		let img
		if (!isVideo) {
			img = imgList
				.getElementsByTagName('li')
				?.[k]?.getElementsByTagName('img')[0]
		}
		let src = img?.src
		if (src) {
			if (src.includes('100x100')) {
				src = src.substr(0, src.length - 12)
			} else {
				src = src.substr(0, src.length - 10)
			}
			// 注入给下载列表
			imgArr.push(src)
			// 创建并注入按钮
			const downButton = document.createElement('li')
			downButton.className = 'main-image-thumb-item'
			const downImg = document.createElement('img')
			downImg.src = src
			downImg.onmouseover = () => {
				imgList.getElementsByTagName('li')[k].className =
					'main-image-thumb-item active'
			}
			downImg.onmouseout = () => {
				imgList.getElementsByTagName('li')[k].className =
					'main-image-thumb-item'
			}
			downImg.onclick = () => {
				GM_download(src, `${props.id}_主图_${k >= 9 ? k + 1 : '0' + (k + 1)}`)
			}
			downList.appendChild(downButton)
			downButton.appendChild(downImg)
		}
	}

	// 注入下载全部按钮
	const downAll = document.createElement('div')
	downAll.className = 'main-image-thumb-item'
	downAll.style =
		'background:#fff;margin-top:10px; width:100%; height:30px; display:flex; flexflow:column; border:1px solid; align-items:center; justify-content:center'

	const downAllSpan = document.createElement('span')
	downAllSpan.style.cursor = 'pointer'
	downAllSpan.onclick = () => {
		GM_notification('共下载 ' + imgArr.length + ' 张图片', '下载主图')
		imgArr.forEach((i, k) => {
			GM_download(
				i,
				`${props.id}_主图_${k >= 9 ? k + 1 : '0' + (k + 1)}${i.substr(-4, 4)}`
			)
		})
	}
	downAllSpan.innerHTML = '下载全部'
	downAllSpan.style.color = 'red'
	downList.insertAdjacentElement('afterend', downAll)
	downAll.appendChild(downAllSpan)

	return imgArr
}

// 注入下载sku方法
function getProductSKU(props) {
	// 获取SKU列表DOM
	let skuList = document
		.getElementById('skuWrap')
		?.getElementsByClassName('IMAGE')?.[0]
		?.getElementsByTagName('dd')?.[0]

	if (!skuList) return

	// 创建并注入下载专区
	const downBox = document.createElement('dl')
	downBox.className = 'sku-attr-dl util-clearfix IMAGE'
	document
		.getElementById('skuWrap')
		?.getElementsByClassName('IMAGE')?.[0]
		.insertAdjacentElement('afterend', downBox)
	// 创建并注入标题
	const title = document.createElement('dt')
	title.innerHTML = '下载 SKU'
	downBox.appendChild(title)
	// 创建注入下载图按钮的列表
	const downListBox = document.createElement('dd')
	downBox.appendChild(downListBox)
	const downList = document.createElement('ul')
	downListBox.appendChild(downList)

	// 创建主图的下载链接列表
	const imgArr = []

	//遍历SKU，生成并注入下载按钮
	for (let k = 0; k < skuList.getElementsByTagName('span').length; k++) {
		// 获取sku下载链接
		let img = skuList
			.getElementsByTagName('span')
			?.[k]?.getElementsByTagName('img')?.[0]
		let src = img?.src
		if (src) {
			if (src.includes('100x100')) {
				src = src.substr(0, src.length - 12)
			} else {
				src = src.substr(0, src.length - 10)
			}
			// 注入给下载列表
			imgArr.push(src)
			// 创建并注入按钮
			const downButton = document.createElement('span')
			downButton.className = 'sku-attr-val-frame picture-frame'
			const downImg = document.createElement('img')
			downImg.src = src
			downButton.onmouseover = function () {
				skuList.getElementsByTagName('span')[k].className =
					'sku-attr-val-frame picture-frame selected'
				this.className = 'sku-attr-val-frame picture-frame selected'
			}
			downButton.onmouseout = function () {
				skuList.getElementsByTagName('span')[k].className =
					'sku-attr-val-frame picture-frame'
				this.className = 'sku-attr-val-frame picture-frame '
			}
			downImg.onclick = () => {
				GM_download(src, `${props.id}_SKU_${k >= 9 ? k + 1 : '0' + (k + 1)}`)
			}
			downList.appendChild(downButton)
			downButton.appendChild(downImg)
		}
	}

	// 创建并注入下载全部按钮
	const downButton = document.createElement('li')
	downButton.className = 'sku-attr-val-frame picture-frame'
	const downImg = document.createElement('a')
	downImg.innerHTML = '全部'
	downImg.style = 'color: red; font-weight: bold;'
	downButton.onmouseover = function () {
		this.className = 'sku-attr-val-frame picture-frame selected'
	}
	downButton.onmouseout = function () {
		this.className = 'sku-attr-val-frame picture-frame '
	}
	downImg.onclick = () => {
		GM_notification('共下载 ' + imgArr.length + ' 张图片', '下载 SKU')
		imgArr.forEach((i, k) => {
			GM_download(i, `${props.id}_SKU_${k >= 9 ? k + 1 : '0' + (k + 1)}`)
		})
	}
	downList.appendChild(downButton)
	downButton.appendChild(downImg)
}

// 注入下载详情页方法
function getProductInfoPage(props) {
	// 创建详情页图片列表
	const imgArr = []

	// 获取表单
	const editForm = document
		.getElementById('module_tabs')
		?.getElementsByClassName('next-tabs-nav')?.[0]
	// 创建下载按钮
	const downButton = document.createElement('li')
	downButton.style.backgroundColor = '#fff'
	downButton.className = 'next-tabs-tab details-tab-pane'
	const downDiv = document.createElement('div')
	downDiv.className = 'next-tabs-tab-inner'
	const downA = document.createElement('span')
	// 调整属性
	downA.className = 'tab-name'
	downA.innerHTML = '下载详情页'
	downA.style = 'color: red; font-weight: bold;'
	downA.title =
		'请注意，下载详情图之前请先将所有详情图片显示完毕再点击此按钮下载，否则会出现下载不完整等问题'
	downA.onclick = () => {
		const imgList = document.getElementById(
			'J-rich-text-description'
		).childNodes
		// 改成多层遍历，穿透获取
		// 分层穿透,
		// 检查节点是否含有src
		// 检查节点是否有子元素 ———闭包遍历
		const imgArr = []
		const mapChild = list => {
			list.forEach(i => {
				if (i?.src) {
					imgArr.push(i.src)
				}
				if (i.childNodes.length !== 0) {
					mapChild(i.childNodes)
				}
			})
		}
		mapChild(imgList)
		GM_notification('共下载 ' + imgArr.length + ' 张图片', '下载详情页')
		// 下载图片
		for (let k = 0; k < imgArr.length; k++) {
			GM_download(
				imgArr[k],
				`${props.id}_详情页_${k >= 9 ? k + 1 : '0' + (k + 1)}`
			)
		}
	}
	// 将下载按钮注入表单
	editForm.insertBefore(
		downButton,
		document
			.getElementById('module_tabs')
			?.getElementsByClassName('next-tabs-nav')?.[0]
			?.getElementsByTagName('li')?.[0]
	)
	downButton.appendChild(downDiv)
	downDiv.appendChild(downA)
}

// 注入样式
function setStyle() {
	GM_addStyle(`
`)
}
