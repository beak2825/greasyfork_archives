// ==UserScript==
// @name         查看拼嘻嘻商品
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license MIT
// @description  一键查看拼嘻嘻商品!
// @author       老萨
// @match        *://*.yangkeduo.com/*
// @run-at document-end
// @grant        GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM.setValue
// @grant GM.getValue
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/518306/%E6%9F%A5%E7%9C%8B%E6%8B%BC%E5%98%BB%E5%98%BB%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/518306/%E6%9F%A5%E7%9C%8B%E6%8B%BC%E5%98%BB%E5%98%BB%E5%95%86%E5%93%81.meta.js
// ==/UserScript==

// $("body").prepend('<div Style="position:fixed;bottom:140px;right:10px;backgroundColor:white;padding:10px;zIndex:100">'+
// 				'<input type="text" id="add_paramas"  placeholder="输入额外参数" />'+
// 			  '</div>');
// 全局变量
let isRunning = false;
let windowId = '';
let add_paramas="";
let capturedData = [];
let storageData= {};
// 检查当前页面URL
function checkAndPrintHTML() {
    const currentURL = window.location.href;
	checkurl_addfloatbtn();
	getstorage();
    if (currentURL.includes('goods.html')||currentURL.includes('goods2.html')) {
        // console.log('Current page HTML:', document.documentElement.outerHTML);
		//alert(document.documentElement.outerHTML);
		// 初始化时从storage加载保存的值
		// chrome.storage.local.get(['isRunning', 'windowId'], function(result) {
			if (isRunning) {
				// Convert HTML to a valid string for btoa
				const encodedHTML = btoa(unescape(encodeURIComponent(document.documentElement.outerHTML)));
				const dataToSend = {
					data: encodedHTML,
					key: windowId
				};
                postdata(dataToSend);
				// chrome.runtime.sendMessage({ action: 'postdata', data: dataToSend },function(response){

				// });
			}
		// });
		
		
    }
}

function getstorage(){
    // isRunning = JSON.parse(localStorage.getItem('isRunning')) || false;
    // windowId = localStorage.getItem('windowId') || '';
	// add_paramas= localStorage.getItem('add_paramas') || '';
    // capturedData = JSON.parse(localStorage.getItem('capturedData')) || [];
    isRunning=JSON.parse(GM_getValue("isRunning", false));
    storageData=JSON.parse(GM_getValue("storageData", null));
    if (storageData && Object.keys(storageData).length > 0) {
        isRunning = storageData.isRunning;
        windowId = storageData.windowId;
        add_paramas = storageData.add_paramas;
        capturedData = storageData.capturedData;
    }
    // windowId=GM_getValue("windowId", null);
    // add_paramas=GM_getValue("add_paramas", null);
    // capturedData=GM_getValue("capturedData", null);
    console.log("缓存数据状态", isRunning, windowId, capturedData);
}
// 保存值到storage
 function saveToStorage() {
    // localStorage.setItem('isRunning', JSON.stringify(isRunning));
    // localStorage.setItem('windowId', windowId);
	// localStorage.setItem('add_paramas', add_paramas);
    // localStorage.setItem('capturedData', JSON.stringify(capturedData));
    storageData = {
        isRunning: isRunning,
        windowId: windowId,
        add_paramas: add_paramas,
        capturedData: capturedData
    };
    console.log("保存数据状态:", storageData);
    GM_setValue("storageData",JSON.stringify(storageData));
    GM_setValue("isRunning",JSON.stringify(isRunning));
    GM_setValue("windowId",windowId);
    GM_setValue("add_paramas",add_paramas);
    GM_setValue("capturedData",capturedData);
}

// 更新按钮状态
function updateButtonState() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    if(isRunning){
		document.getElementById('startBtn').style.backgroundColor = 'grey';
	
		document.getElementById('stopBtn').style.backgroundColor = 'yellow';
		startBtn.disabled = true;
		stopBtn.disabled = false;
	}else{
		document.getElementById('startBtn').style.backgroundColor = 'yellow';
	
		document.getElementById('stopBtn').style.backgroundColor = 'grey';
		stopBtn.disabled = true;
		startBtn.disabled = false;
	}
    
}
// 开始执行事件
function start_getgoods() {
    
    saveToStorage();
    updateButtonState();
	getID();
	// content.js
	// window.postMessage({action: "fetchData"},'*');
	// chrome.runtime.sendMessage({ action: 'getID' }, function(response) {
      
    // });

}
function getID(){
    //获取请求的id
    return new Promise((resolve,reject) =>{
        GM_xmlhttpRequest({ //获取列表
            method : "GET",
            url : "http://121.37.208.194:8383/getID",
            onload: function(response){
                let res = response.response
                // 获取groupID
                console.log(response.response, '服务器响应')
                dogetdatawork(response.response);
                
            }
        })
    })
}
function postdata(data){
    GM_xmlhttpRequest({ //获取列表
        method : "POST",
        url : "http://121.37.208.194:8383/data",
        headers: {
            'Content-Type': 'application/json'
        },
        data:JSON.stringify(data),
        onload: function(response){
            let res = response.response
            // 获取groupID
            console.log(response.response, '服务器POSTDATA响应')
            doupdatadatawork(response.response);
            
        }
    });
}
function dogetdatawork(response){
	
	console.log('dogetdatawork:', response);
	if(response === '' || response === null || response === undefined){
		alert("任务获取失败");
		stop_getgoods();
		return;
	}
	if(response!==null){
		const id = response;
		const gd_src='https://mobile.yangkeduo.com/goods.html?goods_id=';
		var url = gd_src+ id;
		if (add_paramas.includes(gd_src)) {
			const regex = new RegExp(gd_src + '(\\d+)', 'g');
			add_paramas = add_paramas.replace(regex, '');
			
		}
		if(add_paramas != '' && add_paramas != null && add_paramas != undefined){
			url=url+add_paramas;
		}
		console.log('打开新的商品id:', id);
		//return id;
		window.location.href = url;
	}else{
		stop_getgoods();
	}

}
function doupdatadatawork(response){
	console.log('是否继续下一个商品:', response);
	setTimeout(() => {
		if(response==='YES'&&isRunning){
			start_getgoods();
		}else{
			stop_getgoods();
		}
	}, 2000);
	return;
}

function stop_getgoods(){
    isRunning = false;
    saveToStorage();
    updateButtonState();
}
function checkurl_addfloatbtn(){
	// 检测当前页面的URL
	if (window.location.href.includes('yangkeduo.com/')) {
		getstorage();
		// 创建浮动的输入框和按钮
		const firstfloatingDiv = document.createElement('div');
		firstfloatingDiv.style.position = 'fixed';
		firstfloatingDiv.style.bottom = '140px';
		firstfloatingDiv.style.right = '10px';
		firstfloatingDiv.style.backgroundColor = 'white';
		firstfloatingDiv.style.border = '1px solid #ccc';
		firstfloatingDiv.style.padding = '10px';
		firstfloatingDiv.style.zIndex = '1000';
		// {{ edit_1 }} 新增输入框
		const newInputBox = document.createElement('input');
		newInputBox.type = 'text';
		newInputBox.id = 'add_paramas'; // 新输入框的ID
		// 设置输入框的默认值为之前存储的add_paramas
		newInputBox.value = add_paramas || '';
		newInputBox.placeholder = '输入新值'; // 新输入框的占位符
		newInputBox.oninput = function(e) {
			// 处理新输入框的输入
			add_paramas = e.target.value;
			saveToStorage();
		};
		newInputBox.style.width="300px";
		// 将输入框和按钮添加到浮动的div中
		firstfloatingDiv.appendChild(newInputBox);
		
		// 将浮动的div添加到页面中
		document.body.appendChild(firstfloatingDiv);

		// 创建浮动的输入框和按钮
		const floatingDiv = document.createElement('div');
		floatingDiv.style.position = 'fixed';
		floatingDiv.style.bottom = '100px';
		floatingDiv.style.right = '10px';
		floatingDiv.style.backgroundColor = 'white';
		floatingDiv.style.border = '1px solid #ccc';
		floatingDiv.style.padding = '10px';
		floatingDiv.style.zIndex = '1000';
		
		// {{ edit_1 }} 结束
		// 创建输入框
		const inputBox = document.createElement('input');
		inputBox.type = 'text';
		inputBox.id = 'windowId';
		// 设置输入框的默认值为之前存储的windowId
		inputBox.value = windowId || '';
		inputBox.placeholder = '输入窗口编号';
		inputBox.oninput = function(e) {
			windowId = e.target.value;
			saveToStorage();
		};

		// 创建启动按钮
		const startButton = document.createElement('button');
		startButton.id = 'startBtn';
		startButton.innerText = '启动';
		startButton.style.marginLeft = '10px';
		startButton.style.width = '60px';
		
		startButton.onclick = function() {
			isRunning = true;
			start_getgoods();
		};

		// 创建停止按钮
		const stopButton = document.createElement('button');
		stopButton.id = 'stopBtn';
		stopButton.innerText = '停止';
		stopButton.style.marginLeft = '10px';
		stopButton.style.width = '60px';
		stopButton.onclick = function() {
			stop_getgoods();
		};
		
		// 将输入框和按钮添加到浮动的div中
		floatingDiv.appendChild(inputBox);
		floatingDiv.appendChild(startButton);
		floatingDiv.appendChild(stopButton);
		
		// 将浮动的div添加到页面中
		document.body.appendChild(floatingDiv);
		updateButtonState();
	}	
}

 checkAndPrintHTML();







