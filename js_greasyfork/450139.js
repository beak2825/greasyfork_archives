// ==UserScript==
// @name        阿里巴巴国际站主图/视频一键下载
// @namespace   Violentmonkey Scripts
// @match        https://www.alibaba.com/product-detail/*
// @match        https://*.en.alibaba.com/product/*
// @grant        GM_download
// @version     1.0.1
// @author      Venlon
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAALVBMVEVHcEz+AGX+AGX+AGX+AGX+AGX+AGX+AGX+AGX+AGX+AGX+AGX+AGX+AGX+AGXX6eLfAAAADnRSTlMAonyPVC+2ZRjiC8n0RM3W8EcAAAFYSURBVDjLY2AYwSAUlwSLAS4Z7wZcWp7i0lLngE10aVHa8keeu9MEhVUCkMXDc969zLVLiL17pUgwu/o5XLxF5t1L2wVMLxdAuGxboOJcbu/ebVnAwJV3FM0CDpt37ySAdOe7yYLGSsoId3PIvXs3FUizznsHAo/hElx27969BKm7A5Z4iXCXD5D7BEizgyXeZcElFr6DyuihmQU1vICB+R2UgWwWyHSR61cjOvTeITm75h0UvJm9W8Dv5QKODriTr7iUlyspGxuKbdujNW9X5Zw301TRA5SrgfsZgyZIuwCazEqHfQIMHOeAMg/RgugZ42MW04tgKxegxtkEPQWIl949Q43/dy3P2aDORHI6x6Wcd2/jKiCefvcaEtghRcqG2SAhi8dQszZDgzRcSUmp3PdqaFSflqChoKCxyg0M3xzElZw4BXDJbMMlwZaAS8YMlwSvwMgtFgDoBrmPv43JgwAAAABJRU5ErkJggg==

// @description 2022/8/2 10:34:08
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/450139/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E4%B8%BB%E5%9B%BE%E8%A7%86%E9%A2%91%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/450139/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E4%B8%BB%E5%9B%BE%E8%A7%86%E9%A2%91%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

// window.onload =  () => {
// 	downloadFlow()
// }
setTimeout(()=> {
  downloadFlow()
},3000)

// 下载流程函数
 function downloadFlow() {
  const props = getData()
	if (!props) {
		return
	}
	const downoadList =  getLists(props) // 获得视频和图片
  console.log('downoadList',downoadList)
   setDownBtn(downoadList, props) // 添加下载按钮
  // await downLoadFn(downoadList, props) // 下载函数
 }


// 添加下载按钮
function setDownBtn(downoadList, props) {
  const btn = document.createElement("button"); //创建一个input对象（提示框按钮）
	btn.textContent = "下载图片/视频";
  btn.className = 'ui2-button ui2-button-primary ui2-button-large'
	// btn.style.width = "60px";
	// btn.style.height = "20px";
	// btn.style.align = "center";
  // btn.style.border = '1px solid #f60';
  // btn.style.color = '#ff6444';
  // btn.style.padding = '6px'
  // btn.style.background = '#fff';
  // btn.style.borderRadius = '50%';
  btn.onclick = function (){
		downLoadFn(downoadList, props)
	}

  const wrapper = document.getElementsByClassName('main-layout')[0]
  wrapper.appendChild(btn)
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

function getLists(props) {
  console.log('id: ', props)
   // 视频
  let videoSrc = document.getElementsByTagName('video')[0]?.getAttribute('src') || ''
  // if(videoSrc) GM_download(videoSrc, props.id + '.mp4')
  // 图片
  let [...picUlList] = document.querySelectorAll(('.main-list img')) // 获取图片列表
  if(videoSrc) picUlList.splice(0, 2) // 去掉含视频的图片
  return {
    videoSrc,
    picUlList
  }
  
}

function downLoadFn(downoadList, props) {
  const {videoSrc, picUlList} = downoadList
  // console.log(videoSrc,picUlList)
  if(videoSrc) GM_download(videoSrc, props.id + '.mp4') // 下载视频
  console.log(picUlList);
  picUlList.forEach((item, index)=>{
    // 图片名规则
    let srcUrl = item.src
    // let srcUrl = item.src.replace(/.jpg.+$/, '.jpg_720x720q50.jpg')
    GM_download(srcUrl, props.id + '-' + index + '.jpg')

    // console.log(item.src)
    // GM_download(item.src + '_720x720q50.jpg', props.id + '-' + index + '.jpg')
  })
}