// ==UserScript==
// @name         1688图片下载助手
// @namespace    https://detail.1688.com
// @version	 1.0.3
// @description	 1688图片下载
// @author       Venlon
// @homepage     https://greasyfork.org/zh-CN/scripts/449704-1688%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B
// @match        https://detail.1688.com/*
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant	       GM_addStyle
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAALVBMVEVHcEz+AGX+AGX+AGX+AGX+AGX+AGX+AGX+AGX+AGX+AGX+AGX+AGX+AGX+AGXX6eLfAAAADnRSTlMAonyPVC+2ZRjiC8n0RM3W8EcAAAFYSURBVDjLY2AYwSAUlwSLAS4Z7wZcWp7i0lLngE10aVHa8keeu9MEhVUCkMXDc969zLVLiL17pUgwu/o5XLxF5t1L2wVMLxdAuGxboOJcbu/ebVnAwJV3FM0CDpt37ySAdOe7yYLGSsoId3PIvXs3FUizznsHAo/hElx27969BKm7A5Z4iXCXD5D7BEizgyXeZcElFr6DyuihmQU1vICB+R2UgWwWyHSR61cjOvTeITm75h0UvJm9W8Dv5QKODriTr7iUlyspGxuKbdujNW9X5Zw301TRA5SrgfsZgyZIuwCazEqHfQIMHOeAMg/RgugZ42MW04tgKxegxtkEPQWIl949Q43/dy3P2aDORHI6x6Wcd2/jKiCefvcaEtghRcqG2SAhi8dQszZDgzRcSUmp3PdqaFSflqChoKCxyg0M3xzElZw4BXDJbMMlwZaAS8YMlwSvwMgtFgDoBrmPv43JgwAAAABJRU5ErkJggg==
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449704/1688%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/449704/1688%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

window.onload = async () => {
	await downloadFlow()
}

// 下载流程函数
 function downloadFlow() {
  const props = getData()
	if (!props) { return }
	const downoadList = getLists(props) // 获得视频和图片
  // console.log('downoadList',downoadList)
   setDownBtn(downoadList, props) // 添加下载按钮
 }


// 添加下载按钮
function setDownBtn(downoadList, props) {
  const btn = document.createElement("button"); //创建一个input对象（提示框按钮）
  btn.textContent = "下载图片/视频";
  btn.style.align = "center";
  btn.style.border = '1px solid #f60';
  btn.style.color = '#ff6444';
  btn.style.padding = '6px'
  btn.style.background = '#fff';
  btn.style.borderRadius = '6px';
  btn.style.margin = '10px';
  btn.style.cursor = 'pointer';

  btn.onclick = function (){
		downLoadFn(downoadList, props)
	}

  const wrapper = document.getElementsByClassName('gallery-fix-wrapper')[0] || document.getElementsByClassName('detail-gallery-wrapper')[0]
  GM_log(wrapper)
  wrapper.appendChild(btn)
}
// 获取数据方法
function getData() {
  // 全部变量
  const props = {}
  props.id = location.pathname.substr(7,12)
  return props
}

function getLists(props) {
  console.log('id: ', props)
   // 视频
  let videoSrc = document.getElementsByTagName('video')[0]?.getAttribute('src') || ''
  // if(videoSrc) GM_download(videoSrc, props.id + '.mp4')
  // 图片
  let [...picUlList] = document.querySelectorAll(('.detail-gallery-turn img')) // 获取图片列表
  if(videoSrc) picUlList.splice(0, 2) // 去掉含视频的图片
  GM_log('picUlList', picUlList);
  return {
    videoSrc,
    picUlList
  }
}

function downLoadFn(downoadList, props) {
  const {videoSrc, picUlList} = downoadList
  // console.log(videoSrc,picUlList)
  if(videoSrc) GM_download(videoSrc, props.id + '.mp4') // 下载视频
  picUlList.forEach((item, index)=>{
    // 图片名规则
    let srcUrl = item.src
    GM_download(srcUrl, props.id + '-' + index + '.jpg')
    // GM_download(item.src + '_720x720q50.jpg', props.id + '-' + index + '.jpg')
  })
}