// ==UserScript==
// @name        阿里云盘自动切换为列表模式
// @namespace   https://greasyfork.org/zh-CN/users/185422-a-%E3%82%9E-%E5%AE%8C%E7%BE%8E
// @match       https://www.aliyundrive.com/s/*
// @version     1.0
// @author      渣渣火
// @description 2022/6/6 18:23:54
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446084/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%BA%E5%88%97%E8%A1%A8%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/446084/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%BA%E5%88%97%E8%A1%A8%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
(function () {
	var listeners = [];
	var doc = window.document;
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	var observer;

	function domReady(selector, fn) {
		// 储存选择器和回调函数
		listeners.push({
			selector: selector,
			fn: fn
		});
		if (!observer) {
			// 监听document变化
			observer = new MutationObserver(check);
			observer.observe(doc.documentElement, {
				childList: true,
				subtree: true
			});
		}
		// 检查该节点是否已经在DOM中
		check();
	}

	function check() {
		// 检查是否匹配已储存的节点
		for (var i = 0; i < listeners.length; i++) {
			var listener = listeners[i];
			// 检查指定节点是否有匹配
			var elements = doc.querySelectorAll(listener.selector);
			for (var j = 0; j < elements.length; j++) {
				var element = elements[j];
				// 确保回调函数只会对该元素调用一次
				if (!element.ready) {
					element.ready = true;
					// 对该节点调用回调函数
					listener.fn.call(element, element);
				}
			}
		}
	}

	// 对外暴露ready
	window.domReady = domReady;
})();
domReady('.list-container--2l28P', toList);

function toList() {
  let btn = document.querySelector('.switch-wrapper--1yEfx');
  if(btn) {
    btn.click();
  };
};
