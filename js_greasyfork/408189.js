// ==UserScript==
// @name         为网页添加一个遮罩(可用来遮蔽字幕)
// @name:zh-TW   為網頁添加一個遮罩(可用来遮蔽字幕)
// @name:en      Add a mask into the website
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  为网页添加一个遮罩，可以用来遮蔽字幕练习英文，可自行修改match网址以适配其他网页
// @description:en     Add a mask into the website. It can be used to cover the subtitle etc.
// @description:zh-TW  為網頁添加一個遮罩，可以用來遮蔽字幕練習英文，可自行修改match網址以適配其他網頁
// @author       You
// @match        *://www.bilibili.com/video*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408189/%E4%B8%BA%E7%BD%91%E9%A1%B5%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E9%81%AE%E7%BD%A9%28%E5%8F%AF%E7%94%A8%E6%9D%A5%E9%81%AE%E8%94%BD%E5%AD%97%E5%B9%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408189/%E4%B8%BA%E7%BD%91%E9%A1%B5%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E9%81%AE%E7%BD%A9%28%E5%8F%AF%E7%94%A8%E6%9D%A5%E9%81%AE%E8%94%BD%E5%AD%97%E5%B9%95%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var mask = document.createElement("div");
    mask.innerHTML = '<div id="resize" style="background-color: red;position: absolute;width: 10px;height: 10px;right: 0px;bottom: 0px;"></div>';
    mask.setAttribute ('id', 'mask');
    mask.style.position = "absolute";
    mask.style.backgroundColor = "grey";
    mask.style.width = "50px";
    mask.style.height = "50px";
    mask.style.left = "20px";
    mask.style.top = "80px";
    mask.style.zIndex = "999999";
    document.body.appendChild(mask);


	var resize = document.getElementById("resize");
	var moveFlag = false;
	var resizeFlag = false;
	var pointX;
	var pointY;
	var initialWidth;
	var initialHeight;

    if(localStorage.getItem("maskTop") != undefined){
        mask.style.width = localStorage.getItem("maskWidth") + "px";
        mask.style.height = localStorage.getItem("maskHeight") + "px";
        mask.style.left = localStorage.getItem("maskLeft") + "px";
        mask.style.top = localStorage.getItem("maskTop") + "px";
    }

	resize.onmousedown = function(){
			resizeFlag = true;
			pointX = window.event.pageX;
			pointY = window.event.pageY;
			initialWidth = mask.offsetWidth;
			initialHeight = mask.offsetHeight;
	}

	mask.onmousedown = function(){
		if(resizeFlag != true){
			moveFlag = true;
			pointX = event.offsetX;
			pointY = event.offsetY;
		}
	}
	window.onmouseup = function(){
		moveFlag = false;
		resizeFlag = false;
        localStorage.setItem("maskTop", mask.offsetTop);
        localStorage.setItem("maskLeft", mask.offsetLeft);
        localStorage.setItem("maskWidth", mask.offsetWidth);
        localStorage.setItem("maskHeight", mask.offsetHeight);
	}

	window.onmousemove = function(){
		if(moveFlag == true){
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		mask.style.left = window.event.pageX - pointX + "px";
		mask.style.top = window.event.pageY - pointY + "px";
		} else if(resizeFlag == true){
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			mask.style.width = window.event.pageX - pointX + initialWidth + "px";
			mask.style.height = window.event.pageY - pointY + initialHeight + "px";
		}
	}
    // Your code here...
})();