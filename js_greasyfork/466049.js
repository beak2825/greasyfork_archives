// ==UserScript==
// @name        b站搜索框清空按钮
// @namespace   Violentmonkey Scripts
// @match       *://*.bilibili.com/*
// @grant       none
// @version     1.0
// @author      yzjn6
// @license     MIT
// @description 给b站的搜索框加一个清空按钮，方便看热搜的时候不用按键盘清空搜索框。
// @downloadURL https://update.greasyfork.org/scripts/466049/b%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86%E6%B8%85%E7%A9%BA%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/466049/b%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86%E6%B8%85%E7%A9%BA%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
(function() {
	'use strict';

	var checkExist = setInterval(function() {
		if (document.querySelector('.nav-search-keyword')||document.getElementById('search-keyword')) {
			// 获取搜索框元素
      if(document.getElementById('search-keyword')){
			  var searchBox = document.getElementById('search-keyword');console.log("s1");
        if (searchBox) {
				// 添加清空按钮到搜索框的父级元素
				var clearButton = document.createElement('clear-word');
				clearButton.style.cssText =
					'position: absolute; top: 50%; right: 15px; transform: translateY(-50%); width: 20px; height: 20px; border-radius: 50%; background-color: rgb(237,246,249); color: rgb(0,161,214); font-size: 16px; font-family: Arial; text-align: center; line-height: 20px; cursor: pointer;';
				clearButton.innerHTML = '×';
				clearButton.style.display = 'none';
				searchBox.parentNode.appendChild(clearButton);

				// 鼠标悬浮在搜索框上时显示或隐藏清空按钮
				var search_dad = document.querySelector('.input-wrap');
				search_dad.addEventListener('mouseover', function() {
					clearButton.style.display = 'block';
				});
				search_dad.addEventListener('mouseout', function() {
					clearButton.style.display = 'none';

				});
				var keyEventElement = searchBox;
				// 点击清空按钮清空搜索框的文本内容
				clearButton.addEventListener('click', function() {
					searchBox.value = '';
					searchBox.focus();
					var inputEvent = new Event('input');
					searchBox.dispatchEvent(inputEvent);
				});
			}

      }else{
          var searchBox = document.querySelector('.nav-search-keyword');
          if (searchBox) {
				// 添加清空按钮到搜索框的父级元素
				var clearButton = document.createElement('clear-word');
				clearButton.style.cssText =
					'position: absolute; top: 50%; right: 55px; transform: translateY(-50%); width: 20px; height: 20px; border-radius: 50%; background-color: rgb(237,246,249); color: rgb(0,161,214); font-size: 16px; font-family: Arial; text-align: center; line-height: 20px; cursor: pointer;';
				clearButton.innerHTML = '×';
				clearButton.style.display = 'none';
				searchBox.parentNode.appendChild(clearButton);

				// 鼠标悬浮在搜索框上时显示或隐藏清空按钮
				var search_dad = document.querySelector('.nav-search');
				search_dad.addEventListener('mouseover', function() {
					clearButton.style.display = 'block';
				});
				search_dad.addEventListener('mouseout', function() {
					clearButton.style.display = 'none';

				});
				var keyEventElement = searchBox;
				// 点击清空按钮清空搜索框的文本内容
				clearButton.addEventListener('click', function() {
					searchBox.value = '';
					searchBox.focus();
					var inputEvent = new Event('input');
					searchBox.dispatchEvent(inputEvent);
				});
			}
        }
			// 如果存在搜索框，则添加清空按钮
			
			clearInterval(checkExist);
		}
	}, 500);
})();
