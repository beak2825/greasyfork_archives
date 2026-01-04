// ==UserScript==
// @name         一键批量下载天猫图片
// @namespace    https://www.tmall.com
// @version	1.0.1
// @description	 一键批量下载天猫主图，sku以及详情页(重构和经过了一些逻辑上的改良，按钮更协调；内存占用更小；操作更流畅)
// @author       Leo
// @homepage
// @match        https://detail.tmall.com/*
// @match        https://detail.tmall.hk/*
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant			   GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/431634/%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%A4%A9%E7%8C%AB%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/431634/%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%A4%A9%E7%8C%AB%E5%9B%BE%E7%89%87.meta.js
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
	title.style = 'text-align: center; margin-bottom: 20px'
	downBox.appendChild(title)
	// 创建并插入下载按钮列表
	const downList = document.createElement('ul')
	downList.className = 'tb-thumb tm-clear thumbUlOverride'
	downBox.appendChild(downList)

	// 创建主图的下载链接列表
	const imgArr = []

	// 遍历主图缩略图，并插入下载按钮
	for (let k = 0; k < imgList.getElementsByTagName('li').length; k++) {
		// 获取主图下载链接
		const xpath = document.evaluate(
			`//li[${k + 1}]/a/img`,
			imgList,
			null,
			XPathResult.ANY_TYPE,
			null
		)
		let img = xpath.iterateNext()
		let src = img?.src
		if (src) {
			src = src.substr(0, src.length - 13)
			// 注入给下载列表
			imgArr.push(src)
			// 创建并注入按钮
			const downButton = document.createElement('li')
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
	let skuList = document.getElementsByClassName('tb-img')[0]

	// 创建并注入下载专区
	const downBox = document.createElement('dl')
	downBox.className = 'tb-prop'
	document
		.getElementsByClassName('tb-sku')[0]
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
			const src = 'https:' + img.substr(5, img.length - 20)
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
	const downA = document.createElement('a')
	// 调整属性
	downA.innerHTML = '下载详情页'
	downA.style = 'color: red; font-weight: bold;'
	downA.title =
		'请注意，下载详情图之前请先将所有详情图片显示完毕再点击此按钮下载，否则会出现下载不完整等问题'
	downA.onclick = () => {
		downButton.className = 'tm-selected'
		const imgList = document.getElementsByClassName('ke-post')[0].childNodes
		if (typeof imgList[0] !== 'undefined') {
			for (let i = 0; i < imgList.length; i++) {
				if (imgList[i].nodeName === 'IMG') {
				} else if (imgList[i].childNodes.length > 0) {
					for (let i1 = 0; i1 < imgList[i].childNodes.length; i1++) {
						if (imgList[i].childNodes[i1].nodeName === 'IMG')
							imgArr.push(imgList[i].childNodes[i1]?.src)
					}
				}
			}
			GM_notification('共下载 ' + imgArr.length + ' 张图片', '下载详情页')
			for (let k = 0; k < imgArr.length; k++) {
				GM_download(
					imgArr[k],
					`${props.id}_详情页_${k >= 9 ? k + 1 : '0' + (k + 1)}`
				)
			}
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
/* style for thumbs */
.thumbUlOverride li{
    padding-top:0 !important;
}
.thumbUlOverride li a {
    border:2px solid #000;
    width:56px!important;
    height:56px!important;
    font-size:22px;
    font-family: Arial, serif;
    font-weight:bold;
    color:#FE0335!important;
    line-height:56px!important;
}
.img-down li a{
    font-family: Arial, serif;
    cursor:pointer;
    color:#FE0335;
    font-weight:bold;
    font-size:16px;
}
.cat-ul{

}
.cat-ul li{
    line-height:28px;
    float:left;
    position:relative;
    margin:0 4px 4px 0;
    vertical-align:middle;
    padding:1px;
    list-style:none;
}
.cat-ul li a{
    width:38px!important;
    height:38px;
    padding:0;
    line-height:38px;
    outline:0;
    font-family: Arial, serif;
    color:#FE0335;
    font-weight:bolder;
}
`)
}
