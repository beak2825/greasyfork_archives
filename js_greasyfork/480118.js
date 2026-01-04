
// ==UserScript==
// @name         知乎不抽风
// @namespace    https://gist.github.com/KnIfER
// @version      0.1
// @description  解决知乎【出了一点问题,我们正在解决,去往首页】
// @author       KnIfER
// @match        *://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480118/%E7%9F%A5%E4%B9%8E%E4%B8%8D%E6%8A%BD%E9%A3%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/480118/%E7%9F%A5%E4%B9%8E%E4%B8%8D%E6%8A%BD%E9%A3%8E.meta.js
// ==/UserScript==
var targetNode = document.querySelector('title')
	, rootNode = window.root;
if(rootNode) {
	var arr = [].slice.call(window.root.children)
	, title = document.title, ep, val
	// 创建一个 MutationObserver 实例
	, observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			val = mutation.target.textContent;
			if(val.includes('出了一点问题')) {
				ep = document.getElementsByClassName('ErrorPage')[0];
				if(ep) {
					console.log('日常抽风', 'https://www.zhihu.com/question/516484756/answer/3292586039');
					ep.remove();
					for (var i=0; i<arr.length;i++) {
						rootNode.append(arr[i]);
					}
					document.title = title;
				}
				window.dispatchEvent(new CustomEvent('focus'));
			}
			else title = val
		});
	})
	// 暗中开始观察目标节点
	observer.observe(targetNode, { childList: true, subtree: true })
}