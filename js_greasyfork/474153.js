// ==UserScript==
// @name         速卖通标题一键复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  速卖通标题一键复制 https://www.aliexpress.com/
// @author       glk
// @include      https://www.aliexpress.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/474153/%E9%80%9F%E5%8D%96%E9%80%9A%E6%A0%87%E9%A2%98%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/474153/%E9%80%9F%E5%8D%96%E9%80%9A%E6%A0%87%E9%A2%98%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const showTip = (message, duration = 0.8, pos) => {
		let show_tip = document.getElementById('show_tip')
		if (show_tip) {
			document.body.removeChild(show_tip)
		}
		let tipDom = document.createElement('div')
		tipDom.id = 'show_tip'
		Object.assign(tipDom.style, {
			position: 'fixed',
			maxWidth: '80vw',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			lineHeight: '20px',
			zIndex: 9999,
			color: '#fff',
			backgroundColor: '#303133',
			borderRadius: ' 4px',
			padding: '10px',
			textAlign: 'center',
			opacity: 0.9,
			fontSize: '0.75rem',
			animation: `tipanimation ${duration}s 1`
		})
		if (pos) {
			const { left, top, offsetX = 0, offsetY = 0 } = pos
			Object.assign(tipDom.style, {
				top: (top + offsetY) + 'px',
				left: (left + offsetX) + 'px',
				transform: 'none'
			})
		}
		tipDom.innerText = message
		document.body.appendChild(tipDom)

		setTimeout(() => {
			let show_tip = document.getElementById('show_tip')
			if (show_tip) {
				document.body.removeChild(show_tip)
			}
		}, duration * 1000 - 100)
	}

	$('h1[data-pl="product-title"]').each(function () {
		// 获取父元素
		var $parent = $(this).parent(); 
		// 获取文本内容
		var textToCopy = $(this).text(); 

		// 设置Css
		$parent.css({
			"position": "relative",
		})

		// 创建复制图标元素
		var $copyIcon = $('<span title="复制" class="copy-icon">&#128203;</span>');

		// 设置复制图标的样式
		$copyIcon.css({
			"position": "absolute",
			"top": "0",
			"right": "0",
			"cursor": "pointer"
		});

		// 将复制图标添加到父元素
		$parent.append($copyIcon);

		// 为复制图标添加点击事件
		$copyIcon.click(function () {
			// 创建一个临时的textarea元素，将文本内容放入其中
			var $tempTextarea = $('<textarea>').val(textToCopy).appendTo('body').select();

			// 执行复制操作
			document.execCommand('copy');

			// 移除临时textarea元素
			$tempTextarea.remove();

			showTip("复制成功")
		});
	});

})();