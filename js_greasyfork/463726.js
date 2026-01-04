// ==UserScript==
// @name         去除python123.io复制保护
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  清理python123拉的屎
// @author       4532
// @match        http://*python123.io/*
// @match        https://*python123.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463726/%E5%8E%BB%E9%99%A4python123io%E5%A4%8D%E5%88%B6%E4%BF%9D%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/463726/%E5%8E%BB%E9%99%A4python123io%E5%A4%8D%E5%88%B6%E4%BF%9D%E6%8A%A4.meta.js
// ==/UserScript==

(function() {


	//初始化配置
	//是否创建手动按扭 hide = false 创建; hide = true 则不创建
	var hide = true;
	//提示开关 sign = true则在左上角姓名左边创建提示
	var sign = true;
	//初始化结束




	//以下内容无特殊需求或无法理解代码含义请不要修改
	var button = document.createElement("button");
	var istarge = false;
	var ID = null;
	var autoid = null;
	ID = setInterval(isxxt, 3000);


	function removeshit() {
		var Urlt1 = window.location.href;
		if (Urlt1.includes("choices")) {
			var elements = document.getElementsByClassName("fa fa-user-circle-o is-icon");
			for (var i = 0; i < elements.length; i++) {
				var element = elements[i];
				if (sign == true) {
					element.innerText = "选择题净化执行成功";
				}
			}
			var watermarkClass = "water-mark is-text-white";
			var elements = document.getElementsByClassName(watermarkClass);
			for (var i = 0; i < elements.length; i++) {
				var element = elements[i];
				element.innerText = "";
			}
		} else if (Urlt1.includes("programmings")) {
			var elements = document.getElementsByClassName("fa fa-user-circle-o is-icon");
			for (var i = 0; i < elements.length; i++) {
				var element = elements[i];
				if (sign == true) {
					element.innerText = "编程题净化执行成功";
				}
			}
			button.remove();
			var watermarkClass = "water-mark is-text-white";
			var elements = document.getElementsByClassName(watermarkClass);
			for (var i = 0; i < elements.length; i++) {
				var element = elements[i];
				element.innerText = "";
			}
		} else {
			istarge = false;
			button.remove();
			ID = setInterval(isxxt, 3000);
			clearInterval(autoid);
		}
	}
	function isxxt() {
		var Urlt = window.location.href;
		if (Urlt.includes("choices")) {
			clearInterval(ID);
			istarge = true;
			setbtm();
			autoid = setInterval(removeshit, 3000);
		}
		if (Urlt.includes("programmings")) {
			clearInterval(ID);
			istarge = true;
			autoid = setInterval(removeshit, 3000);
		}
	}






  //按钮事件
	function setbtm() {
		if (istarge = true) {
			button = document.createElement("button");
		}
		if (hide != true) {
			button.style.width = "120px";
			button.style.height = "60px";
			button.innerText = "手动移除多余字符（自动去除失效时点击）";
			button.style.position = "fixed";
			button.style.top = "50%";
			button.style.left = "80%";
			button.style.transform = "translate(-50%, -50%)";
			button.style.zIndex = "1";
			document.body.appendChild(button);
			button.addEventListener("click", removeshit);
			var isDragging = false;
			var startX, startY, mouseX, mouseY;
			button.addEventListener("mousedown", function(event) {
				startX = event.clientX;
				startY = event.clientY;
				isDragging = true;
				button.classList.add("dragging");
			});
			button.addEventListener("mouseup", function(event) {
				isDragging = false;
				button.classList.remove("dragging");
			});
			document.addEventListener("mousemove", function(event) {
				if (isDragging) {
					mouseX = event.clientX;
					mouseY = event.clientY;
					var deltaX = mouseX - startX;
					var deltaY = mouseY - startY;
					var left = button.offsetLeft + deltaX;
					var top = button.offsetTop + deltaY;
					button.style.left = left + "px";
					button.style.top = top + "px";
					startX = mouseX;
					startY = mouseY;
				}
			});
		}
	}
})();

