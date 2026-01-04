// ==UserScript==
// @name         中国科学院大学课程网站增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Birkhoff_Lee
// @match        https://course.ucas.ac.cn/portal/site/*
// @require      http://libs.baidu.com/jquery/1.8.3/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411514/%E4%B8%AD%E5%9B%BD%E7%A7%91%E5%AD%A6%E9%99%A2%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/411514/%E4%B8%AD%E5%9B%BD%E7%A7%91%E5%AD%A6%E9%99%A2%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // axios全局设置, 设置带Cookie请求
    axios.defaults.withCredentials = true;
    window.axios = axios;
    // 脚本数据空间
    let data = {
    	hasResourcesUpdated: 0,
    };
    // 获取所有文件的超链接以及索引
    const getAllFilesBody = (event) => {
    	const body = document.getElementsByTagName('tbody')[0];
    	const selectedFilesList = Array.prototype.slice.call(body.children).map(
    		(item) => {
    			if (item.getElementsByTagName('input') &&
    				item.getElementsByTagName('input')[0] &&
    				item.getElementsByTagName('input')[0].checked) {
    				return item;
    			}
    		}
    	).slice(1);
    	// 所有可下载文件的链接Array
    	const ans = new Array();
    	selectedFilesList.map(
    		(item) => {
    			if(item && item.getElementsByTagName('a')[1].attributes.title.textContent.endsWith('文件夹')) {
    				item = null;
    			}
    			return item ? ans.push(
    				{
    					url: decodeURI(item.getElementsByTagName('a')[1].href),
    					filename: item.getElementsByTagName('a')[1].lastElementChild.textContent
    				}
    			) : item
    		}
    	)
    	for (var i in ans) {
    		downloadWithUri(ans[i].url, ans[i].filename);
    	}
    	// 阻止事件冒泡
    	event && event.stopPropagation();
    };
    // 通过一个临时的a标签来下载文件
    const downloadWithFakeAtag = (href, filename) => {
    	const a = document.createElement('a');
    	a.download = filename;
    	a.href = href;
    	a.style.display = 'none';
    	document.body.appendChild(a);
    	a.click();
    	a.remove();
    };
    // 通过文件的url下载文件
    const downloadWithUri = (uri, fname = '') => {
    	console.log('开始下载: ', uri);
    	window.axios.get(encodeURI(uri), {responseType: 'blob'})
    	.then((resp) => {
    		// console.log('文件下载成功啦', resp);
    		const content = window.URL.createObjectURL(resp.data);
    		const filename = fname ? fname :decodeURI(resp.config.url).split('/').slice(-1)[0];
    		downloadWithFakeAtag(content, filename);
    	})
    	.catch((error) => {
    		alert(error);
    	})
    };
    // 更新界面视图(包含按钮等元素)
    const updateResourcesPage = () => {
    	const css = document.createElement('style');
    	css.innerText = `
    		#birkhoff-download-selected {
    			display: inline-block;
    			float: right;
    			min-width: 10px;
    			padding: 3px 5px 3px 5px;
    			height: 100%;
    			border-radius: 5px;
    			background-color: pink;
    			-webkit-user-select: none;
    		}
    		#birkhoff-download-selected:hover {
    			background-color: skyblue;
    			cursor: pointer;
    		}
    	`;
    	document.getElementsByTagName('head')[0].appendChild(css);
    	const buttonLocationDiv = document.getElementById('copy-button').parentElement;
    	const downloadButton = document.createElement('div');
    	downloadButton.innerHTML = '下载选中项';
    	downloadButton.id = 'birkhoff-download-selected';
    	buttonLocationDiv.appendChild(downloadButton);
    	$('#birkhoff-download-selected').click(() => {
    		alert("已经发布下载任务, 暂不支持文件夹下的文件下载!");
    		getAllFilesBody();
    	})
    	data.hasResourcesUpdated ++;
    };
    // 检查当前界面是否处于资源界面
    const recourseCheck = window.setInterval(() => {
    	if (document.getElementsByClassName('is-current')[0].firstElementChild.title === '资源') {
    		// console.log('已经选中资源界面');
    		if (data.hasResourcesUpdated <= 0){
    			updateResourcesPage();
    		}
    	}
    }, 1000);
})();