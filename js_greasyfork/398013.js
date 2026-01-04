// ==UserScript==
// @name         辣女神免翻页看图
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  省去翻页~辣女神连续看图脚本
// @author       siaall
// @match        https://*.lanvshen.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398013/%E8%BE%A3%E5%A5%B3%E7%A5%9E%E5%85%8D%E7%BF%BB%E9%A1%B5%E7%9C%8B%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/398013/%E8%BE%A3%E5%A5%B3%E7%A5%9E%E5%85%8D%E7%BF%BB%E9%A1%B5%E7%9C%8B%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
	'use strict';
	copyText()
	var parent = document.getElementsByTagName("body")[0]
	var c = document.getElementsByClassName("weixin")[0]
	parent.removeChild(c)
	//截取公用Url
	var url = document.getElementsByClassName("tupian_img")[0].src
	if(url.search("loadin") != -1) {
		//如果图片加载过慢获取错误则延迟再获取
		sleep(2500)
		url = document.getElementsByClassName("tupian_img")[0].src
	}
	var content = document.getElementsByClassName("content")[0]
	var urlLeft = url.substring(0, url.length - 5)
	//获取第一页的图片Dom数量
	var imgNum = content.childNodes.length
	//获取总页数
	var pageDiv = document.getElementById("pages")
	var pageA = pageDiv.getElementsByTagName("a")
	var page = pageA[pageA.length - 2].innerHTML
	var total = page * imgNum
	//alert("page：" + page + "imgNum" + imgNum)
	//添加DOM
	for(var i = imgNum; i <= total; i++) {
		var img = document.createElement("img")
		img.src = urlLeft + i + ".jpg"
		img.onload = errorEvent(img)
		img.width = 1270
		content.appendChild(img)
	}

	function errorEvent(dom) {
		//			if(dom.style.width==null||dom.style.width==""||dom.style.width==undefined||dom.style.height==null) {
		//				dom.style.display = "none"
		//				dom.onerror = null;
		//			}
	}

	function copyText() {
		//获取标题父级
		var weizhi = document.getElementsByClassName("weizhi")[0]
		//创建按钮
		var copyBtn = document.createElement("button")
		copyBtn.className = "copyBtn"
		copyBtn.innerHTML = "复制标题"
		copyBtn.style.height = "26px"
		copyBtn.style.width = "68px"
		copyBtn.style.backgroundColor = "#f44949"
		copyBtn.style.color = "#f9f9f9"
		copyBtn.style.float = "right"
		copyBtn.style.border = "1px solid #f44949"
		copyBtn.style.borderRadius = "2px"
		copyBtn.style.marginTop = "0.5%"
		copyBtn.style.marginRight = "0.6%"
		weizhi.appendChild(copyBtn)
		copyBtn.onclick = function() {
			//图片专辑标题
			var copyText = weizhi.children[1].innerText
			//替换Windows不支持格式名
			var flag = new RegExp("[/\\\\:*?<>|]")
			if(flag.test(copyText)) {
				copyText = copyText.replace(/[\\\/:*?"<>|]+/g, "_");
			}
			var oInput = document.createElement('input');
			oInput.value = copyText;
			document.body.appendChild(oInput);
			// 选择对象
			oInput.select();
			// 执行复制命令
			document.execCommand("Copy");
			oInput.className = 'oInput';
			oInput.style.display = 'none';
		}

	}

	function sleep(numberMillis) {
		var now = new Date()
		var exitTime = now.getTime() + numberMillis;
		while(true) {
			now = new Date()
			if(now.getTime() > exitTime) {
				return
			}
		}
	}

})();