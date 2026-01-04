// ==UserScript==
// @name         替换网页中的内容
// @name:en      Replace content in a webpage(Revision)
// @name:zh-CN   替换网页中的内容
// @name:zh-TW   替換網頁中的內容
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  替换网页中的文本内容
// @description:en     Replace text content in a webpage(Revision)
// @description:zh-CN  替换网页中的文本内容
// @description:zh-TW  替換網頁中的文本內容
// @author       linmii
// @editor       zesion
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377730/%E6%9B%BF%E6%8D%A2%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%9A%84%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/377730/%E6%9B%BF%E6%8D%A2%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%9A%84%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==
/**
 * TO DO List
 *   1.增加整页内容替换功能，个人感觉整页内容替换没什么意义
 *
 *
 * 已知bug
 * 1. 存在iframe的页面无法进行替换
 *
 *
 * V1.0.3 2019-08-05 更新内容
 *   1. 解决模态框弹出页面无法输入的问题。
 *   2. 增加是否替换禁用文本框内容的功能
 *   3. 修改脚本只替换文本框内容的功能
 *
 * V1.0.4 2019-12-31 更新内容
 *   1. 解决一个页面出现多个替换图标的问题。
 *   2. 解决在某些网页，弹窗飘到屏幕顶部无法输入的问题，如1688网站订单页面。
 *
 * V1.1 2020-02-06 更新内容，bug修复
 *   1. 解决弹窗在不同网页中高度不一致的问题
 *   2. 解决脚本在阿里云后台，谷歌云后台等某些网站无法使用的问题。
 *
 * V1.1.2
 *   1. 清除数据后让查找输入框获得焦点
 *
 * V2.0
 *  本次进行了大版本更新，基本上是重写整个插件，采用了jquery框架，解决了纯js需要适配复杂页面等问题。
 *
 *  新增功能：
 *   1. 重写插件，采用jquery框架，修复插件在一些页面出现的各种无法使用问题
 *   2. 增加勾选，实现替换功能定制化
 *   3. 增加打开弹窗自动定位到查找输入框，方便输入
 *  功能优化：
 *   1. 优化弹出框高度的计算方法
 *   2. 删除无用代码
 *   3. 采用css方式对弹窗进行局中，去掉臃肿的js居中算法
 *  Bug修复：
 *   1. 修复某些页面弹窗显示问题，如淘宝产品详情页
 *   2. 修复某些页面插件报onclick, onmouseover等奇怪问题，导致插件无法使用的问题
 *   3. 增加勾选，实现替换功能定制化
 *
 * V2.0.1
 *  去掉jquery框架，继续采用原生javascrip编写插件，主要是发现jquery兼容问题比较差。
 *   1. 修复原生JavaScript各种报错问题。
 */

var elements = [];

(function () {
	'use strict';

	initCss();
	initModal();
	initRImg();
	initDialog();
	removeTagAttibute('tabindex');

})();

/**
 * 初始化css样式
 */
function initCss() {
	var lmStyle = document.createElement("style");
	lmStyle.type = "text/css";
	lmStyle.innerHTML
		= '.lm-r-button {'
		+ 'padding: 10px 18px;'
		+ 'font-size: 14px;'
		+ 'border-radius: 4px;'
		+ 'line-height: 1;'
		+ 'white-space: nowrap;'
		+ 'cursor: pointer;'
		+ 'background: #409EFF;'
		// + 'border: 1px solid #409EFF;'
		+ 'border: none;'
		+ 'color: #fff;'
		+ 'font-weight: 500;'
		+ '}'
		+ '.lm-r-button:hover {background: #66b1ff; border-color: #66b1ff; color: #fff;}'
		+ '.lm-r-button:focus {background: #66b1ff; border-color: #66b1ff; color: #fff;}'
		+ '.lm-r-input {'
		+ '-webkit-appearance: none;'
		+ 'background-color: #fff;'
		+ 'background-image: none;'
		+ 'border-radius: 4px;'
		+ 'border: 1px solid #dcdfe6;'
		+ 'box-sizing: border-box;'
		+ 'color: #606266;'
		+ 'display: inline-block;'
		+ 'font-size: 14px;'
		+ 'height: 40px;'
		+ 'line-height: 40px;'
		+ 'outline: none;'
		+ 'padding: 0 15px;'
		+ 'transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);'
		+ 'width: 100%;'
		+ '}'
		+ '.lm-r-input:hover {border-color: #C0C4CC;}'
		+ '.lm-r-input:focus {border-color: #409EFF;}';

	document.querySelector("head").appendChild(lmStyle);
}

/**
 * 弹出框兼容
 */
function removeTagAttibute(attributeName){
	var allTags = '*';
	var specificTags = ['DIV', 'ARTICLE', 'INPUT'];

	var allelems = document.querySelectorAll(specificTags);
	var i,j= 0;
	for(i = 0, j = 0; i < allelems.length; i++) {
	 allelems[i].removeAttribute(attributeName);
	}
}

/**
 * 初始化R图标
 */
function initRImg() {
	var rImg = document.createElement("div");
	rImg.id = "lm-r-img";
	rImg.innerText = 'R';
	rImg.style.cssText = "z-index: 999999; position: fixed; top: 0; left: 0; font-size: 14px; border-radius: 4px; background-color: #fff; width: 20px; height: 20px; text-align: center; opacity: 0.5; cursor: pointer; border: solid 1px #999999;";
	/*if (document.querySelector("body")){
		document.querySelector("body").prepend(rImg);
	}*/
	if(window.self === window.top){
		if (document.querySelector("body")){
			document.body.appendChild(rImg);
		} else {
			document.documentElement.appendChild(rImg);
		}
	}
	rImg.addEventListener('click',function () {
		document.querySelector("#lm-r-modal").style.display = 'block';
		document.querySelector("#lm-dialog-div").style.display = 'block';
        document.querySelector("#lm-find-content").focus();
	});
	rImg.addEventListener('mouseover', function () {
		document.querySelector("#lm-r-img").style.opacity = 1;
	});
	rImg.addEventListener('mouseleave', function () {
		document.querySelector("#lm-r-img").style.opacity = 0.5;
	});
}

/**
 * 初始化遮罩
 */
function initModal() {
	var lmModal = document.createElement("div");
	lmModal.id = 'lm-r-modal';
	lmModal.style.cssText = 'position: fixed; left: 0; top: 0; width: 100%; height: 100%; opacity: 0.5; background: #000; z-index: 999999; display: none;';
	lmModal.onclick = function () {
		document.querySelector("#lm-close-btn").click();
	};
	document.querySelector("body").appendChild(lmModal);
}

/**
 * 初始化弹出框
 */
function initDialog() {
	var dialogDiv = document.createElement("div");
	dialogDiv.id = "lm-dialog-div";
	var htmlText = '<div>' +
						'<input id="lm-find-content" class="lm-r-input" id="searchTxt" placeholder="请输入查找内容(支持正则)" >'+
					'</div>' +
					'<div style="margin-top: 5px;">' +
						'<input id="lm-replace-content" class="lm-r-input" placeholder="请输入替换内容">' +
					'</div>' +
					'<div id="lm-switch-div" style="margin-top: 5px;">'+
						'<label><input class="lm-r-checkbox" name="lm-r-checkbox[]" type="checkbox" id="lm-replace-text" value="text" checked />文本框</label>&nbsp;&nbsp;'+
						'<label><input class="lm-r-checkbox" name="lm-r-checkbox[]" type="checkbox" id="lm-replace-disabled" value="disabled" />禁用文本框</label><br />'+
						'<label><input class="lm-r-checkbox" name="lm-r-checkbox[]" type="checkbox" id="lm-replace-textarea" value="textarea" />多行文本域</label>&nbsp;&nbsp;'+
						'<label><input class="lm-r-checkbox" name="lm-r-checkbox[]" type="checkbox" id="lm-replace-select" value="other" disabled/>其他文本</label>'+
						'<br />'+
					'</div>'+
					'<div style="margin-top: 5px;">' +
						'<button id="lm-replace-btn" class="lm-r-button">替 换</button>' +
						'<button id="lm-clear-btn" class="lm-r-button" style="margin-left: 10px;">清 空</button>' +
						'<button id="lm-close-btn" class="lm-r-button" style="margin-left: 10px;" >关 闭</button>' +
					'</div>';
	dialogDiv.innerHTML = htmlText;
	dialogDiv.style.border = 'solid 1px grey';
	dialogDiv.style.padding = '10px';
	dialogDiv.style.zIndex = '99999999';
	dialogDiv.style.position = 'fixed';
	dialogDiv.style.display = 'none';
	dialogDiv.style.background = '#fff';
	dialogDiv.style.borderRadius = '4px';
	dialogDiv.style.fontSize = '14px';
	dialogDiv.style.left = '50%';
	dialogDiv.style.top = '40%';
	dialogDiv.style.marginLeft = '-100px';
	dialogDiv.style.marginTop = '-50px';
	var body = document.querySelector("body");
	body.appendChild(dialogDiv);
}

/**
 *  为dialogDiv的元素添加事件
 */
window.onload=function(){
	//为替换按钮添加事件
	var replaceBtnNode = document.getElementById("lm-replace-btn");
	replaceBtnNode.addEventListener("click", replaceContent);

	//为关闭按钮添加事件
	var closeBtnNode = document.getElementById("lm-close-btn");
	closeBtnNode.addEventListener("click", closeBindEvent);

	//为清空按钮添加事件
	var clearBtnNode = document.getElementById("lm-clear-btn");
	clearBtnNode.addEventListener("click", function(){
		document.querySelector("#lm-find-content").value="";
		document.querySelector('#lm-replace-content').value = ""
        document.querySelector("#lm-find-content").focus();
	});
}

/**
 * 判断需要替换的元素
 */
function replaceContent() {
	var replaceCounts	= 0;
	var findText		= document.querySelector("#lm-find-content").value;
	var replaceText		= document.querySelector("#lm-replace-content").value;

	elements = [];

	var disabledStatus	= document.querySelector("#lm-replace-disabled").checked;
	var checkboxEle		= document.getElementsByName("lm-r-checkbox[]");
	var count			= checkboxEle.length;
	for (var i = 0; i < count; i++) {
		if(checkboxEle[i].checked) {
			elements.push(checkboxEle[i].value);
		}
	}

	//替换input元素内容
	if(elements.indexOf('text') > -1 || elements.indexOf('disabled') > -1) {
		replaceCounts += replaceInputContent(replaceCounts, findText, replaceText);
	}

	//替换多行文本框内容
	if(elements.indexOf('textarea') > -1) {
		replaceCounts += replaceTextareaContent(replaceCounts, findText, replaceText);
	}

	//替换其他文本内容
	if(elements.indexOf('other') > -1) {
		// To do...
	}
	alert("替换完成, 共替换 【"+ replaceCounts +"】 处文本.");

	// 设置替换前的输入内容
	document.querySelector("#lm-find-content").value = findText;
	document.querySelector("#lm-replace-content").value = replaceText;
}

/**
 * 替换部分文本 - 输入框和禁用输入框
 */
function replaceInputContent(replaceCounts, findText, replaceText) {
	var disabledStatus 	= document.querySelector("#lm-replace-disabled").checked;
	if ("" !== findText) {
		var list 		= document.getElementsByTagName("input");
		var textCount 	= list.length;
		for(var i = 0;i < textCount;i++){
			//判断是否替换禁用文本框的内容
			if(true === list[i].disabled && false === disabledStatus) {
				continue;
			}
			if(list[i].id === 'lm-find-content' || list[i].id === 'lm-replace-content') {	//如果是弹出框则跳过
				continue;
			}
			var txt = list[i].value;
			if(list[i].type==="text" && "" !== txt && txt.indexOf(findText) >= 0){
				var ret 		= txt.replace(new RegExp(findText, "gm"), replaceText);
				list[i].value 	= ret;
				replaceCounts++;
			} else {
				continue;
			}
		}
	}
	return replaceCounts < 1 ? 0 : replaceCounts;
}

/**
 * 替换部分文本 - 文本域
 */
function replaceTextareaContent(replaceCounts, findText, replaceText) {
	if ("" !== findText) {
		var list 		= document.getElementsByTagName("textarea");
		var textCount 	= list.length;
		for (var i = 0; i < textCount; i++) {
			var textVal = list[i].value;
			if("" !== textVal && textVal.indexOf(findText) >= 0) {
				var ret 		= textVal.replace(new RegExp(findText, "gm"), replaceText);
				list[i].value 	= ret;
				replaceCounts++;
			}
		}
	}
	return replaceCounts < 1 ? 0 : replaceCounts;
}


/**
 * 隐藏弹窗
 */
function closeBindEvent() {
	document.querySelector("#lm-close-btn").click();
	document.querySelector("#lm-r-modal").style.display = 'none';
	document.querySelector('#lm-dialog-div').style.display = 'none';
}