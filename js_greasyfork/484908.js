// ==UserScript==
// @name        下载原码
// @version     2024.1.15
// @author       You
// @include     *
// @description  下载原代码，学习用
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @require https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @namespace https://greasyfork.org/users/1210231
// @downloadURL https://update.greasyfork.org/scripts/484908/%E4%B8%8B%E8%BD%BD%E5%8E%9F%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/484908/%E4%B8%8B%E8%BD%BD%E5%8E%9F%E7%A0%81.meta.js
// ==/UserScript==
$(function(){
	let bu = $('<button>原码</button>')
				.css({
					position:'fixed',
					top:10,
					right:10,
					'z-index':99999999,
				})
				.click(function(){
					downloadtxt(document.documentElement.innerHTML,document.title+".html")
				})
	$('body').append(bu)
})
function downloadtxt(content,filename) {
  // 创建a标签
  var eleLink = $('<a></a>')[0]
  // 设置a标签 download 属性，以及文件名
  eleLink.download = filename
  // a标签不显示
  eleLink.style.display = 'none'
  // 获取字符内容，转为blob地址
  var blob = new Blob([content])
  // blob地址转为URL
  eleLink.href = URL.createObjectURL(blob)
  // a标签添加到body
  document.body.appendChild(eleLink)
  // 触发a标签点击事件，触发下载
  eleLink.click()
  // a标签从body移除
  document.body.removeChild(eleLink)
}