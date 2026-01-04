// ==UserScript==
// @name         语雀思维导图一键保存
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  语雀思维导图一键保存，保存html，自动询问要保存的文件名，自动添加时间戳
// @author       thunder-sword
// @match        https://www.yuque.com/yuluo-vdhow/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuque.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456802/%E8%AF%AD%E9%9B%80%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/456802/%E8%AF%AD%E9%9B%80%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

/* 作用：根据指定的html字符串下载html文件，可指定文件名，自动获取当前页面中的css，自动添加时间戳 */
function downloadHtml(html, fileName='page.html', getCSS=true, addTimeSuffix=true){
    var result=`<head><meta charset="UTF-8"></head>`;
    if(getCSS){
        /* 获取当前页面 css */
        const css = Array.from(document.styleSheets)
        .map(styleSheet => Array.from(styleSheet.cssRules).map(rule => rule.cssText))
        .flat()
        .join("\n");
        result=`<head><style>\n${css}\n</style></head>`;
    }
    result+='<body>'+html+'</body>';
    const file = new File([result], "page.html", { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    fileName = fileName.endsWith(".html") ? fileName : fileName + ".html";
    if(addTimeSuffix){
        var currentTime = new Date();
        fileName=fileName.slice(0,-5)+`-${currentTime.getFullYear()}${(currentTime.getMonth()+1).toString().padStart(2, "0")}${currentTime.getDate().toString().padStart(2, "0")}.html`;
    }
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
}
/* 作用：保存语雀思维导图，可弹窗询问要保存的文件名，默认为false */
function savaYuQueMindMap(fileName='page.html', askFileName=false){
    /* askFileName为true时弹窗询问文件名 */
    fileName=askFileName?prompt('输入要保存的文件名：'):fileName;
    downloadHtml(document.querySelector('div.lake-diagram-viewport-container svg').outerHTML, fileName, getCSS=false);
}
// 创建一个 div 元素
var floatWindow = document.createElement('div');

// 设置 div 的内容
floatWindow.innerHTML = '一键保存思维导图';

// 设置 div 的样式
floatWindow.style.position = 'fixed';
floatWindow.style.bottom = '10px';
floatWindow.style.right = '10px';
floatWindow.style.padding = '5px 10px';
floatWindow.style.backgroundColor = '#333';
floatWindow.style.color = '#fff';
floatWindow.style.cursor = 'pointer';

// 将悬浮窗的优先级提高
floatWindow.style.zIndex = "99999";

var isDragging = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;
var cursorX;
var vursorY;

floatWindow.addEventListener("mousedown", function(e) {
	if (!isDragging) {
		cursorX = e.clientX;
		cursorY = e.clientY;
		initialX = cursorX - xOffset;
		initialY = cursorY - yOffset;
		isDragging = true;
	}
});
floatWindow.addEventListener("mousemove", function(e) {
	if (isDragging) {
		e.preventDefault();
		currentX = e.clientX - initialX;
		currentY = e.clientY - initialY;

		xOffset = currentX;
		yOffset = currentY;

		setTranslate(currentX, currentY, floatWindow);
	}
});
floatWindow.addEventListener("mouseup", function(e) {
	initialX = currentX;
	initialY = currentY;

	isDragging = false;
	// 如果点击时鼠标的位置没有改变，就认为是真正的点击
	if (cursorX === e.clientX && cursorY === e.clientY) {
		execCode();
	}
});

// 为悬浮窗添加事件处理程序，用来监听触摸开始和触摸移动事件
// 这些事件处理程序的实现方式与上面的鼠标事件处理程序类似
floatWindow.addEventListener('touchstart', (event) => {
	if (!isDragging) {
		cursorX = event.touches[0].clientX;
		cursorY = event.touches[0].clientY;
		initialX = cursorX - xOffset;
		initialY = cursorY - yOffset;
		isDragging = true;
	}
});
floatWindow.addEventListener('touchmove', (event) => {
	if (isDragging) {
		currentX = event.touches[0].clientX - initialX;
		currentY = event.touches[0].clientY - initialY;

		xOffset = currentX;
		yOffset = currentY;

		setTranslate(currentX, currentY, floatWindow);
	}
});

// 为悬浮窗添加事件处理程序，用来监听触摸结束事件
// 这个事件处理程序的实现方式与上面的鼠标事件处理程序类似
floatWindow.addEventListener('touchend', () => {
	initialX = currentX;
	initialY = currentY;

	isDragging = false;
	// 如果点击时鼠标的位置没有改变，就认为是真正的点击
	if (cursorX === event.touches[0].clientX && cursorY === event.touches[0].clientY) {
		execCode();
	}
});

function setTranslate(xPos, yPos, el) {
	el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

// 想要执行的代码放到此函数中：
function execCode() {
	// 执行你想要执行的代码
	//alert('执行代码');
    savaYuQueMindMap('',true);
}

// 将悬浮窗添加到 body 元素中
document.body.appendChild(floatWindow);