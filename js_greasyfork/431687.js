// ==UserScript==
// @name         一键批量下载淘宝图片
// @namespace    https://item.taobao.com
// @version	1.0.4
// @description	 一键批量下载淘宝主图，sku以及详情页(重构和经过了一些逻辑上的改良，按钮更协调；内存占用更小；操作更流畅)
// @author       Leo
// @homepage
// @match        https://item.taobao.com/*
// @match        https://item.taobao.hk/*
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant			   GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/431687/%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E6%B7%98%E5%AE%9D%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/431687/%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E6%B7%98%E5%AE%9D%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
/*jshint multistr:true */

/*
 * 下载天猫图片工具
 * 下载商品主图
 * 下载sku
 * 下载详情页
 * */

window.onload = () => {
	const props = getData()
	setStyle()
	getProductImage(props)
	getProductSKU(props)
	getProductInfoPage(props)
}

// 获取数据方法
function getData() {
	// 全部变量
	const props = {}
	const params = location.search.substr(1).split('&')
	for (let i in params) {
		props[params[i].split('=')[0]] = unescape(params[i].split('=')[1])
	}
	return props
}

// 注入下载商品主图方法
function getProductImage(props) {
	// 获取主图缩略图列表DOM
	let imgList = document.getElementById('J_UlThumb')
	// 创建并注入下载专区
	const downBox = document.createElement('div')
	document.getElementsByClassName('tb-gallery')[0].appendChild(downBox)
	// 创建并注入标题
	const title = document.createElement('h2')
	title.innerHTML = '下载主图'
	title.style = 'text-align: center; margin-bottom: 20px; margin-top: 20px'
	downBox.appendChild(title)
	// 创建并插入下载按钮列表
	const downList = document.createElement('ul')
	downList.className = 'tb-thumb tb-clearfix thumb-ul'
	downBox.appendChild(downList)

	// 创建主图的下载链接列表
	const imgArr = []

	// 遍历主图缩略图，并插入下载按钮
	for (let k = 0; k < imgList.getElementsByTagName('li').length; k++) {
		// 获取主图下载链接
		let src

		const xpath = document.evaluate(
			`//li[${k + 1}]/div/a/img`,
			imgList,
			null,
			XPathResult.ANY_TYPE,
			null
		)
		let img = xpath.iterateNext()

		if (k === 0) {
			// 检查首图视频
			const arr = imgList
				.getElementsByTagName('li')[0]
				?.getElementsByTagName('span')
			if (!(arr?.length >= 1)) {
				src = img?.src
			}
		} else {
			src = img?.src
		}

		if (src) {
			src = src.substr(0, src.length - 16)
			// 注入给下载列表
			imgArr.push(src)
			// 创建并注入按钮
			const downButton = document.createElement('li')
			downButton.style =
				'display:flex; flexflow: row; align-items: center; justify-content: center'
			const downImg = document.createElement('img')
			downImg.src = src
			downImg.style.cursor = 'pointer'
			downImg.title = (k + 1).toString()
			downImg.onmouseover = () => {
				imgList.getElementsByTagName('li')[k].className = 'tb-selected'
			}
			downImg.onmouseout = () => {
				imgList.getElementsByTagName('li')[k].className = 'tb-thumb tm-clear'
			}
			downImg.onclick = () => {
				GM_download(src, `${props.id}_主图_${k >= 9 ? k + 1 : '0' + (k + 1)}`)
			}
			downList.appendChild(downButton)
			downButton.appendChild(downImg)
		}
	}

	// 注入下载全部按钮
	const downAll = document.createElement('li')
	downAll.style =
		'display:flex; flexflow: row; align-items: center; justify-content: center'
	const downAllSpan = document.createElement('a')
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
	downAllSpan.innerHTML = '全部'
	downList.appendChild(downAll)
	downAll.appendChild(downAllSpan)

	return imgArr
}

// 注入下载sku方法
function getProductSKU(props) {
	// 获取SKU列表DOM
	let skuList = document.getElementsByClassName('J_Prop_Color')[0]
	console.log(skuList)
	// 创建并注入下载专区
	const downBox = document.createElement('dl')
	downBox.className = 'tb-prop'
	document
		.getElementsByClassName('tb-skin')[0]
		.getElementsByTagName('dl')[0]
		.insertAdjacentElement('afterend', downBox)
	// 创建并注入标题
	const title = document.createElement('dt')
	title.innerHTML = '下载 SKU'
	title.className = 'tb-metatit'
	downBox.appendChild(title)
	// 创建注入下载图按钮的列表
	const downListBox = document.createElement('dd')
	downBox.appendChild(downListBox)
	const downList = document.createElement('ul')
	downList.className = 'tm-clear J_TSaleProp tb-img'
	downListBox.appendChild(downList)

	// 创建主图的下载链接列表
	const imgArr = []

	//遍历SKU，生成并注入下载按钮
	for (let k = 0; k < skuList.getElementsByTagName('li').length; k++) {
		// 获取sku下载链接
		let img = skuList
			.getElementsByTagName('li')
			?.[k]?.getElementsByTagName('a')?.[0]?.style.backgroundImage
		if (img) {
			const src = 'https:' + img.substr(5, img.length - 17)
			// 注入给下载列表
			imgArr.push(src)
			// 创建并注入按钮
			const downButton = document.createElement('li')
			const downImg = document.createElement('a')
			downImg.style = `background: ${img} center no-repeat;`
			downImg.onmouseover = function () {
				skuList.getElementsByTagName('li')[k].className = 'tb-selected'
			}
			downImg.onmouseout = function () {
				skuList.getElementsByTagName('li')[k].className = ''
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
	const downImg = document.createElement('a')
	downImg.innerHTML = '全部'
	downImg.style = 'color: red; font-weight: bold;'
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
	const editForm = document.getElementById('J_TabBar')
	// 创建下载按钮
	const downButton = document.createElement('li')
	downButton.style =
		'display:flex; flexflow: row; align-items: center; justify-content: center'
	const downA = document.createElement('a')
	// 调整属性
	downA.innerHTML = '下载详情页'
	downA.style = 'color: red; font-weight: bold;'
	downA.title =
		'请注意，下载详情图之前请先将所有详情图片显示完毕再点击此按钮下载，否则会出现下载不完整等问题'
	downA.onclick = () => {
		downButton.className = 'tm-selected'
		const imgList = document.getElementsByClassName('ke-post')[0].childNodes
		// todo 改成多层遍历，穿透获取
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
		document.getElementsByClassName('tm-qrcode-icon')[0]
	)
	downButton.appendChild(downA)
}

// 注入样式
function setStyle() {
	GM_addStyle(`
.thumb-ul{
		font-family:Arial;
		font-weight:bold;
	}
	.thumb-ul li{
		border-style:solid;
		border-color:#FE4403!important;
		font-family:Arial;
		font-weight:bold;
		font-size:16px;
		cursor:pointer;
	}
	.cat-ul li{
		cursor:pointer;
		font-size:14px;
		font-family:Arial;
	}
	.detail-li,.border-li{
		width:40px!important;
		padding:0px!important;
	}
	.tb-tabbar>li{
		min-width:80px!important;
	}
`)
}
