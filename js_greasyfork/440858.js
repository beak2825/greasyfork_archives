// ==UserScript==
// @name         MDN文档内搜索,站内搜索,快捷键搜索
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  开始学习!
// @author       jackpapapapa
// @match        https://developer.mozilla.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440858/MDN%E6%96%87%E6%A1%A3%E5%86%85%E6%90%9C%E7%B4%A2%2C%E7%AB%99%E5%86%85%E6%90%9C%E7%B4%A2%2C%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/440858/MDN%E6%96%87%E6%A1%A3%E5%86%85%E6%90%9C%E7%B4%A2%2C%E7%AB%99%E5%86%85%E6%90%9C%E7%B4%A2%2C%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
	window.onload = function() {
		function simulatedClick(ele) {
			//模拟点击事件
			let click = new MouseEvent('click', {
				bubbles: true,
				cancelable: true
			})
			ele.dispatchEvent(click)
		}
		document.addEventListener('keydown', e => {
			if (e.ctrlKey && e.shiftKey && e.keyCode == 70) {
                let searchButton = document.querySelector('#root > div > header > div > div.top-navigation-main > button')
                let hasSearchInput = document.querySelector('#root > div > header > div > div.top-navigation-main.has-search-open')
		        let searchInput = document.querySelector('#main-q')
				let isInputExist = !!document.querySelector('#root > div > header > div > div.top-navigation-main.has-search-open')
				document.scrollingElement.scrollTop = 0; //滚动到页面顶部
				if (!isInputExist) {
					searchButton && simulatedClick(searchButton)
				}
				if(searchInput){searchInput.focus();searchInput.value = ''}
                let searchInputWeb = document.querySelector('#top-nav-search-q')
				if(hasSearchInput){searchInputWeb.focus();searchInputWeb.value=''}
			}
		})
	}
})()