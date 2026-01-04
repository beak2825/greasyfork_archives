// ==UserScript==
// @name         一键批量下载1688中文站图片/视频
// @namespace    https://detail.1688.com
// @version	1.0.16
// @description	 一键批量下载1688中文站主图，详情页(重构和经过了一些逻辑上的改良，按钮更协调；内存占用更小；操作更流畅)
// @author       Leo
// @homepage
// @match        https://detail.1688.com/*
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant			   GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/431737/%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD1688%E4%B8%AD%E6%96%87%E7%AB%99%E5%9B%BE%E7%89%87%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/431737/%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD1688%E4%B8%AD%E6%96%87%E7%AB%99%E5%9B%BE%E7%89%87%E8%A7%86%E9%A2%91.meta.js
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
	getProductImage(props)
	await getProductSKU(props)
	await getProductInfoPage(props)
}

// 获取数据方法
function getData() {
	// 全部变量
	const props = {}
	// 获取产品id
	const i = location.href.indexOf('.html')
	if (i) {
		let k = 5
		while (location.href[i - k - 1] !== '/' && k < 20) {
			k++
		}
		props.id = location.href.substr(i - k, k)
		return props
	}
}

// 注入下载商品主图方法
function getProductImage(props) {
	// 获取主图缩略图列表DOM
	let imgList = document.getElementById('dt-tab')?.getElementsByTagName('ul')[0]
	const downBox = document.createElement('div')
	downBox.className = 'tab-content  fd-clr'
	const title = document.createElement('h3')
	title.innerHTML = '下载主图/视频'
	title.style = 'text-align: center; margin-bottom: 10px; margin-top: 10px'
	// 创建并插入下载按钮列表
	const downList = document.createElement('ul')
	downList.className = 'nav nav-tabs fd-clr'
	document.getElementById('dt-tab').insertAdjacentElement('afterend', title)
	title.insertAdjacentElement('afterend', downBox)
	const downBox2 = document.createElement('div')
	downBox2.className = 'tab-content-container'
	downBox.appendChild(downBox2)
	downBox2.appendChild(downList)
	const downALLBox = document.createElement('div')
	downALLBox.style =
		'width:100%; display:flex; flexflow:row; justify-content:center;'
	downBox.insertAdjacentElement('afterend', downALLBox)
	// 创建主图的下载链接列表
	const imgArr = []

	// 遍历主图缩略图，并插入下载按钮
	for (let k = 0; k < imgList.getElementsByTagName('li').length && k < 5; k++) {
		// 获取图片链接
		let src = imgList
			.getElementsByTagName('li')
			[k]?.getElementsByTagName('img')?.[0]?.src
		if (src) {
			if (src.includes('60x60.jpg_.webp')) {
				const suffix = src.substr(src.length - 10, src.length - 6)
				src = `${src.substr(0, src.length - 16)}${suffix}`
			} else {
				const suffix = src.substr(src.length - 4, src.length)
				src = `${src.substr(0, src.length - 10)}${suffix}`
			}
			// 注入给下载列表
			imgArr.push(src)
			// 创建并注入按钮
			const downButton = document.createElement('li')
			downButton.className = 'tab-trigger'
			downButton.style.cursor = 'pointer'
			downButton.innerHTML = `<div class='vertical-img'><a class='box-img'><img src='${src}' alt='下载此图片' /></a></div>`
			downButton.onclick = () => {
				GM_download(src, `${props.id}_主图_${k >= 9 ? k + 1 : '0' + (k + 1)}`)
			}
			downButton.onmouseover = () => {
				downButton.className = 'tab-trigger active'
			}
			downButton.onmouseout = () => {
				downButton.className = 'tab-trigger'
			}
			downList.appendChild(downButton)
		}
	}
	const style =
		'cursor:pointer; margin:5px; padding:0 5px; border:1px solid black; font-size:20px; color:red; fontweight:bold;'

	// 注入下载视频按钮
	const video = document
		.getElementsByClassName('lib-video')?.[0]
		?.getElementsByTagName('video')?.[0]
		?.getElementsByTagName('source')?.[0]?.src
	console.log(video)
	if (video) {
		const downVideo = document.createElement('div')
		downVideo.style = style
		downVideo.innerHTML = '下载视频'
		downVideo.onclick = () => {
			GM_download(video, `${props.id}_视频_$`)
		}
		downALLBox.appendChild(downVideo)
	}

	// 注入下载全部按钮
	const downAll = document.createElement('div')
	downAll.style = style
	downAll.innerHTML = '下载全部'
	downAll.onclick = () => {
		GM_notification('共下载 ' + imgArr.length + ' 张图片', '下载主图')
		imgArr.forEach((i, k) => {
			GM_download(
				i,
				`${props.id}_主图_${k >= 9 ? k + 1 : '0' + (k + 1)}${i.substr(-4, 4)}`
			)
		})
	}
	downALLBox.appendChild(downAll)

	return imgArr
}

// 注入下载sku方法
function getProductSKU(props) {
	// 获取SKU列表DOM
	let skuBox = document
		.getElementById('mod-detail-bd')
		?.getElementsByClassName('obj-leading')?.[0]
	let skuList = skuBox?.getElementsByClassName('list-leading')?.[0]

	if (!skuList) return

	// 创建并注入下载专区
	const downBox = document.createElement('div')
	downBox.className = 'obj-leading'
	skuBox.insertAdjacentElement('afterend', downBox)
	// 创建并注入标题
	const title = document.createElement('div')
	title.className = 'obj-header'
	title.innerHTML = `<span class='obj-title'>下载SKU</span>`
	downBox.appendChild(title)
	const downContent = document.createElement('div')
	downContent.className = 'obj-content'
	downBox.appendChild(downContent)
	// 创建注入下载图按钮的列表
	const downList = document.createElement('ul')
	downList.className = 'list-leading'
	downContent.appendChild(downList)

	// 创建主图的下载链接列表
	const imgArr = []

	//遍历SKU，生成并注入下载按钮
	for (let k = 0; k < skuList?.getElementsByTagName('img').length; k++) {
		// 获取sku下载链接
		let img = skuList.getElementsByTagName('img')?.[k]
		let src = img?.src

		if (src) {
			if (src.includes('32x32.jpg_.webp')) {
				const suffix = src.substr(src.length - 10, src.length - 6)
				src = `${src.substr(0, src.length - 16)}${suffix}`
			} else {
				const suffix = src.substr(src.length - 4, src.length)
				src = `${src.substr(0, src.length - 10)}${suffix}`
			}

			// 注入给下载列表
			imgArr.push(src)
			// 创建并注入按钮
			const downButton = document.createElement('li')
			downButton.innerHTML = `
			<div class='unit-detail-spec-operator'>
            <a rel='nofollow'  class='image' >
            <span class='vertical-img-title fd-hide'>下载此图片</span>
            <span class='vertical-img'>
                <span class='box-img' style='cursor:pointer;'>
                    <img src='${src}' alt='下载此图片'>
                </span>
            </span>
            <div class='cor'></div> 
        </a>
    </div>
`

			downButton.onclick = () => {
				GM_download(src, `${props.id}_SKU_${k >= 9 ? k + 1 : '0' + (k + 1)}`)
			}
			downList.appendChild(downButton)
		}
	}

	// 创建并注入下载全部按钮
	const downButton = document.createElement('li')
	downButton.innerHTML = `
			<div class='unit-detail-spec-operator'>
            <a rel='nofollow'  class='image' >
            <span class='vertical-img-title fd-hide'>下载全部图片</span>
            <span class='vertical-img'>
                <span class='box-img' style='font-size: 14px; color:red; font-weight:bold; cursor:pointer;'>
                    全部
                </span>
            </span>
            <div class='cor'></div> 
        </a>
    </div>
`
	downButton.onclick = () => {
		GM_notification('共下载 ' + imgArr.length + ' 张图片', '下载 SKU')
		imgArr.forEach((i, k) => {
			GM_download(i, `${props.id}_SKU_${k >= 9 ? k + 1 : '0' + (k + 1)}`)
		})
	}
	downList.appendChild(downButton)
}

// 注入下载详情页方法
function getProductInfoPage(props) {
	// 创建详情页图片列表

	// 获取表单
	const editForm = document
		.getElementById('mod-detail-otabs')
		?.getElementsByTagName('ul')?.[0]
	// 创建下载按钮
	const downButton = document.createElement('li')
	downButton.className = 'tab-li first de-selected'
	downButton.innerHTML = `<a href="#" data-info="mod-detail-description"><span style='color:red;font-weight: bold'>下载详情页</span></a>`
	downButton.onclick = () => {
		const imgList = document.getElementById('de-description-detail')?.childNodes
		if (!imgList) return
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
	editForm.insertBefore(downButton, editForm?.getElementsByTagName('li')?.[0])
}
