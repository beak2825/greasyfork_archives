// ==UserScript==
// @name         Quark Download
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  点击文件名左边下载图标直接下载夸克网盘内容，无需下载客户端
// @author       aozora
// @match        http*://pan.quark.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/clipboard.js/2.0.10/clipboard.min.js
// @resource css https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery-toast-plugin/1.3.2/jquery.toast.min.css
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery-toast-plugin/1.3.2/jquery.toast.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448617/Quark%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/448617/Quark%20Download.meta.js
// ==/UserScript==
let $ = window.$;
let copyBoxFlag;
async function genDownloadLink(fileid) {
	const rawData = await fetch("https://drive.quark.cn/1/clouddrive/file/download?pr=ucpro&fr=pc", {
		"headers": {
			"accept": "application/json, text/plain, */*",
			"accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
			"content-type": "application/json;charset=UTF-8",
			"sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Microsoft Edge\";v=\"103\", \"Chromium\";v=\"103\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-site"
		},
		"referrer": "https://pan.quark.cn/",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": `{\"fids\":[\"${fileid}\"]}`,
		"method": "POST",
		"mode": "cors",
		"credentials": "include"
	});
	const data = await rawData.json();
	const link = data.data[0].download_url
	console.log(link)
	return link;
}

async function downloadAllClick() {
	let tagList = document.querySelectorAll('.ant-table-row-selected');
	let downloadLinkList = [];
	if (!document.querySelector('.copy-box')) {
		AddCopyBox()
	}
	let copyNode = $('.copy-box').html('')
	for(let tag of tagList){
		let fileName = tag.querySelector('.filename-text').innerHTML
		let fileID = tag.getAttribute('data-row-key')
		
		let fileUrl = await genDownloadLink(fileID)
		if(fileUrl){
			let warpNode = $("<div></div>").addClass('aozora-copy-item')
			let hdNode = $(`<div><p>${fileName}</p></div>`).addClass('aozora-copy-hd')
			let btnNode = $(document.createElement('button')).addClass('aozora-copy-btn').html('复制链接')
			
			hdNode.append(btnNode)
			let bdNode = $(`<div></div>`).addClass('aozora-copy-bd')
			bdNode.append(`下载链接：<a class="aozora-copy-url" href="${fileUrl}" target="_blank">${fileUrl}</a>`)
			warpNode.append(hdNode)
			warpNode.append(bdNode)
			copyNode.append(warpNode)
			console.log(warpNode)
		}
	}
	
	if(copyNode.children().length>0){
		copyNode.removeClass('hide')
		copyBoxFlag = true
		setTimeout(()=>{
			document.addEventListener('click',copyBoxHide,false)
		},100)
	}
}
function copyBoxHide(e){
	console.log(e.path);
	let copyNode = document.querySelector('.copy-box');
	let btnNode = document.querySelector('.aozora-download-all');
	if(copyBoxFlag&&copyNode&&!copyNode.contains(e.target)&&btnNode&&!btnNode.contains(e.target)){
		$('.copy-box').addClass('hide')
	}
}
function addListener() {
	const tagList = document.querySelectorAll(
		'#ice-container > section > section > main > div > div.section-main > div.file-list > div.ant-table-wrapper.table-fixed-content > div > div > div > div > div > div.ant-table-body > table > tbody > tr'
	)
	tagList.forEach((tag) => {
		let rowkey = tag.getAttribute('data-row-key');
		let node = document.createElement("div");
		node.classList.add('quark-download')
		node.title = "直接下载";
		node.style.cssText =
			"width:40px;height:40px;padding:0 10px;margin-right:16px;background-repeat:no-repeat;background-position:50% center;cursor:pointer;background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMyMjIiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNOSAxMmwyIDIgMi0yeiIvPjxwYXRoIGQ9Ik0xNCA4aDEuNTUzYy44NSAwIDEuMTYuMDkzIDEuNDcuMjY3LjMxMS4xNzQuNTU2LjQzLjcyMi43NTYuMTY2LjMyNi4yNTUuNjUuMjU1IDEuNTR2NC44NzNjMCAuODkyLS4wODkgMS4yMTUtLjI1NSAxLjU0LS4xNjYuMzI3LS40MS41ODMtLjcyMi43NTctLjMxLjE3NC0uNjIuMjY3LTEuNDcuMjY3SDYuNDQ3Yy0uODUgMC0xLjE2LS4wOTMtMS40Ny0uMjY3YTEuNzc4IDEuNzc4IDAgMDEtLjcyMi0uNzU2Yy0uMTY2LS4zMjYtLjI1NS0uNjUtLjI1NS0xLjU0di00Ljg3M2MwLS44OTIuMDg5LTEuMjE1LjI1NS0xLjU0LjE2Ni0uMzI3LjQxLS41ODMuNzIyLS43NTcuMzEtLjE3NC42Mi0uMjY3IDEuNDctLjI2N0gxMSIvPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTExIDN2MTAiLz48L2c+PC9zdmc+)";
		node.setAttribute('data-row-key', rowkey);
		node.addEventListener('click', (e) => {
			//const fileID = e.target.parentNode.parentNode.getAttribute('data-row-key');
			const fileID = e.target.getAttribute('data-row-key');
			console.log(fileID)
			genDownloadLink(fileID).then(function(link) {
				window.open(link, '_blank');
			});
		})

		let node1 = tag.querySelector('.td-file');
		node1.style.cssText = 'display:inline-flex;align-items: center;'
		let firstnode = node1.firstChild;
		firstnode.style.cssText = 'flex:1;'
		node1.insertBefore(node, firstnode);
	})
}

function addDownloadAllBtn() {
	let btnOperate = $('.btn-operate')

	let node = document.createElement("button");
	node.classList.add('ant-btn', 'ant-btn-primary', 'aozora-download-all')
	
	node.title = "直接下载";
	node.innerHTML = '选中下载'
	node.addEventListener('click', (e) => {
		downloadAllClick()
	})
	//btnOperate.prepend(node);
	btnOperate.append(node);
}

function AddCopyBox() {
	let copynode = document.createElement("div");
	copynode.classList.add('copy-box', 'hide')
	let style = document.createElement("style");
	style.type = "text/css";

	let styleInner = '.btn-group{margin-right: 12px;}.copy-box{min-width: 20vw;max-width:80vw;min-height: 20vh;max-height:80vh;padding:10px;border-radius:16px;display: flex;flex-direction: column;justify-content: center;align-items: center;position: fixed;top: 50%;left: 50%;transform: translate(-50%,-50%);background-color: #e5e5e5;z-index: 100;}.copy-box.hide{display: none!important;}.aozora-copy-hd{display: flex;align-items: center;justify-content: space-between;}.aozora-copy-hd p,.aozora-copy-bd p{margin:0;}.aozora-copy-item{margin-bottom:6px;}'
	style.innerHTML = styleInner;
	if (window.self === window.top) {
		if (document.querySelector("body")) {
			document.body.appendChild(copynode);
		} else {
			document.documentElement.appendChild(copynode);
		}
	}
	GM_addStyle(styleInner);
}
(function() {
	'use strict';
	let Intervaltimer = setInterval(function() {
		if (document.querySelector(".aozora-download-all")) {
			clearInterval(Intervaltimer);
		} else {
			GM_addStyle(GM_getResourceText("css"));
			addListener();
			addDownloadAllBtn();
			AddCopyBox()
			
		}
	}, 500)
	let clipboard = new ClipboardJS('.aozora-copy-btn', {
	    text: function(target) {
				let $target = $(target)
				let fileUrl = $target.parents(".aozora-copy-item").find('.aozora-copy-url').text()
				console.log('ClipboardJS',$target,fileUrl);
				return fileUrl;
	    }
	});
	clipboard.on('success', function(e) {
	    console.info('Action:', e.action);
	    console.info('Text:', e.text);
	    console.info('Trigger:', e.trigger);
			$.toast({
				text: '复制成功',
				icon: 'success',
				position: 'mid-center',
				allowToastClose : false,
				loader: false
			})
			
	    e.clearSelection();
	});
	
	clipboard.on('error', function(e) {
	    console.error('Action:', e.action);
	    console.error('Trigger:', e.trigger);
			$.toast({
				text: '复制失败',
				icon: 'error',
				position: 'mid-center',
				loader: false,
				allowToastClose : false,
			})
	});
	
	window.addEventListener('hashchange', (e) => {
		if (!document.querySelector(".aozora-download-all")) {
			addDownloadAllBtn()
		}
	})
	// 夸克网盘用react写的，需要等待网页内容加载完成再添加事件监听
	//setTimeout(function () {
	//    addListener();
	//    addDownloadAllBtn();
	//}, 3000);
})();
