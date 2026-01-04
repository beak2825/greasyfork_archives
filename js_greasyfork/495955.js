// ==UserScript==
// @name         123读书网去广告
// @namespace    https://github.com/RANSAA
// @version      0.0.3
// @description  移除手机版的123读书网中的广告，如果有同种类型的广告的网站可以适配到该脚本中。
// @author       sayaDev
// @license      MIT License
// @icon         data:image/png;base64,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

// @match        *://m.123dua.com/*
// @grant        none


// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera 
// @compatible   safari 

// @run-at document-end


// @downloadURL https://update.greasyfork.org/scripts/495955/123%E8%AF%BB%E4%B9%A6%E7%BD%91%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/495955/123%E8%AF%BB%E4%B9%A6%E7%BD%91%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
/**
 * 说明:
 * 
 * noframes: 禁止脚本在iframe中运行
 * 
 * compatible：greasyfork.org脚本站点兼容性图标
 * 
 * run-at document-end：在文档结束时执行，但是在页面上的资源如图片和样式表加载完成之前。在DOM完全解析后立即执行。
 * 
 **/ 



const name = '123读书网去广告：';

(function() {
    'use strict';

    removeAD();
})();



function removeAD(){
    // //移除顶部悬浮广告
    // removeStyleFlexAD()

    // //移除底部ID为“nsws”的广告DIV标签
    // removeAllDivWithID("nsws");


    removeAllDIVNodesWithSpecifiedID();

    removeAllDynamicStyleNodes();
}


//----------------------------------------------------------------------------------------remove id div----------------------------------------------------------------------------------------
/**
 * 删除所有指定id的DIV节点
 **/ 
function removeAllDIVNodesWithSpecifiedID(){
	//移除底部ID为“nsws”的广告DIV标签
	removeDIVNodeWithID("nsws");
}

/**
 * 删除指定ID的DIV节点
 **/ 

function removeDIVNodeWithID(id){
	var divID = id;
	var isRemove = false;
	var allElements = document.querySelectorAll('*');
	for (var i = allElements.length - 1; i >= 0; i--) {
	  if (allElements[i].id === divID) {
	    console.log(name+"移除id为:"+divID+"的DIV标签")
	    console.log(allElements[i])
	    allElements[i].remove();
	    isRemove = true;
	  }
	}
	if (!isRemove) {
		//console.log(name+"没有找到id为:"+id+"的DIV标签");
	}
}
//----------------------------------------------------------------------------------------remove id div----------------------------------------------------------------------------------------





//----------------------------------------------------------------------------------------remove style----------------------------------------------------------------------------------------

/**
 * 移除所有动态的style节点
 */ 
function removeAllDynamicStyleNodes(){
	//移除顶部悬浮广告
	//123读书网动态广告style内容匹配正则表达式
	const styleContentRegex1 = /body{margin: 0px;}#(\w+) ~ \.(\w+){display: block; width: 10%; position: fixed; z-index: 2147483646;}#(\w+) ~ /;
	removeStyleWithRegex(styleContentRegex1);

	//移除123读书网顶部悬浮广告  -  弃用的正则表达式
	const styleContentRegex1_Deprecation = /body{margin-top:120px;padding-top:0 !important;}#(\w+){display:flex;}/;
	removeStyleWithRegex(styleContentRegex1_Deprecation);


	const styleContentRegex2 = /#(\w+) ~ \.(\w+){background-image: url\(/;
	removeStyleWithRegex(styleContentRegex2);




	//动态节点可能是由其它JS动态生成，所以想要移除，需要多次重复执行
	//每0.2秒执行一次，共执行10次 
	let count = 0;
	const interval = setInterval(() => {
	  // 执行目标函数
		if (count > 2) {
			removeStyleWithRegex(styleContentRegex1);
			removeStyleWithRegex(styleContentRegex1_Deprecation);
			removeStyleWithRegex(styleContentRegex2);		
		}
	  


		count++;
		if (count >= 12) {
		clearInterval(interval); // 停止定时器
		}
	}, 200);

}

/**
 * 利用正则表达式动态匹配style并删除style节点
 **/ 
function removeStyleWithRegex(styleContentRegex){
	// 指定要匹配的样式内容的正则表达式，例如匹配包含 ".target-class" 的样式
	// const styleContentRegex = /body{margin: 0px;}#(\w+) ~ \.(\w+){display: block; width: 10%; position: fixed; z-index: 2147483646;}#(\w+) ~ /;

	// 获取所有 <style> 标签
	const styleTags = document.querySelectorAll('style');
	var isRemove = false;

	// 遍历每个 <style> 标签
	styleTags.forEach(styleTag => {
	  // 检查 <style> 标签的内容是否匹配正则表达式
	  if (styleContentRegex.test(styleTag.innerHTML)) {
	    // 如果匹配，则移除该 <style> 标签
	    styleTag.remove();
	    isRemove = true;
	    console.log(name+"查找到了动态AD style：")
	    console.log(styleTag)

	    // 获取并输出匹配的 <style> 标签的 id 属性
	    const styleId = styleTag.getAttribute('id');
	    console.log(name, "匹配的 <style> 标签 ID:", styleId);

	    // 获取 <style> 标签中的所有类名（形如 .zXzyCei）
	    const classRegex = /\.(\w[-\w]*)/g;
	    const classes = [...styleTag.innerHTML.matchAll(classRegex)].map(match => match[1]);
	    console.log(name, "style中匹配到的Class名称:", classes);
	    classes.forEach( className => {
	    	//console.log(className);
	    	removeAllTagWithClass(className);
	    })

	    // 获取 <style> 标签中的所有 ID 选择器（形如 #VoUnOkp）
	    const idRegex = /#(\w[-\w]*)/g;
	    const ids = [...styleTag.innerHTML.matchAll(idRegex)].map(match => match[1]);
	    console.log(name, "style中匹配到的ID名称:", ids);
	    ids.forEach( idName => {
	    	//console.log(idName);
	    	removeAllTagWithID(idName);
	    })
	  }
	});
	if (!isRemove) {
		//console.log(name+"动态AD style查找失败！");
	}
}

//----------------------------------------------------------------------------------------remove style----------------------------------------------------------------------------------------






/**
 * 移除所有targetId的标签
 */ 
function removeAllTagWithID(targetId){
	//检查输入的ID选择器是否有效
	if (!/^[a-zA-Z_]/.test(targetId)) {
		return;
	}


	// // 使用模板字符串构造选择器
	// const divs = document.querySelectorAll(`div#${targetId}`);
	// // 遍历并移除每个匹配的 <div> 标签
	// divs.forEach(div => div.remove());


	// 使用模板字符串构造选择器，选择所有具有该 ID 的元素
	const elements = document.querySelectorAll(`#${targetId}`);
	// 遍历并移除每个匹配的元素
	elements.forEach(element => element.remove());
}


/**
 * 移除所有targetClass的标签
 **/
function removeAllTagWithClass(targetClass){
	// 使用模板字符串构造选择器，选择所有具有该类名的元素
	const elements = document.querySelectorAll(`.${targetClass}`);
	// 遍历并移除每个匹配的元素
	elements.forEach(element => element.remove());
}



