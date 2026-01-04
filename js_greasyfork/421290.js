// ==UserScript==
// @name         讯飞快读语音文件下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       glk
// @match        https://www.ffkuaidu.com/
// @grant        none
// @description 如果转换次数达到上限可以利用科学上网工具修改本机IP，然后继续转换。 讯飞快语读语音地址： https://www.ffkuaidu.com/
// @downloadURL https://update.greasyfork.org/scripts/421290/%E8%AE%AF%E9%A3%9E%E5%BF%AB%E8%AF%BB%E8%AF%AD%E9%9F%B3%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/421290/%E8%AE%AF%E9%A3%9E%E5%BF%AB%E8%AF%BB%E8%AF%AD%E9%9F%B3%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
	// 设置文件名称可参考 ==> https://blog.csdn.net/qq_37899792/article/details/103924657
	window.onload = function () {
		console.log('dd')
	  const downLodaStyles = {
		width: '100px',
		color: '#fff',
		background: '#1c8af4',
		textAlign: 'center',
		lineHeight: '43px',
		marginLeft: '30px',
		border: '1px solid #ccc',
		borderRadius: '5px',
		cursor: 'pointer'
	  }
	  let saveBox = document.getElementsByClassName('save_box')[0]

	  let downloadBtn = document.createElement('div')
	  Object.assign(downloadBtn.style, downLodaStyles)
	  downloadBtn.innerText = '下 崽'
	  saveBox.appendChild(downloadBtn)
	  downloadBtn.onclick = function () {
		  console.log('click')
		  let src = saveBox && saveBox.parentNode.getElementsByTagName('audio')[0].src
		if(src === window.location.href){
				alert('急个锤子！先转换语音@_@')
				return
			}
		  console.log('src', src)
		  let link = document.createElement('a');
		  link.style.display = 'none'
		  link.href = src
		  document.body.appendChild(link)
		  link.click()
		  document.body.removeChild(link);
	  }

	}

})();