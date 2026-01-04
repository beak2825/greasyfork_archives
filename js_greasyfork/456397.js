// ==UserScript==
// @name         悬浮窗代码执行
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  【编写脚本组件】页面中浮现一个小悬浮窗，点击就能执行指定代码，同时支持电脑端和手机端浏览器
// @author       thunder-sword
// @match        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456397/%E6%82%AC%E6%B5%AE%E7%AA%97%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/456397/%E6%82%AC%E6%B5%AE%E7%AA%97%E4%BB%A3%E7%A0%81%E6%89%A7%E8%A1%8C.meta.js
// ==/UserScript==

// 创建一个 div 元素
var floatWindow = document.createElement('div');

// 设置 div 的属性
floatWindow.id = 'float-window';

// 设置 div 的内容
floatWindow.innerHTML = '点我执行代码';

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
	alert('执行代码');
}

// 将悬浮窗添加到 body 元素中
document.body.appendChild(floatWindow);