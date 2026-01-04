// ==UserScript==
// @name        无需梯子 谷歌划词翻译 translate.googleapis.com
// @namespace   https://violentmonkey.github.io
// @version     1.1
// @description 基于 translate.googleapis.com，中译英，英译中
// @license     https://www.apache.org/licenses/LICENSE-2.0
// @author      zkrisj
// @include     *
// @exclude     https://juejin.cn/editor/drafts/*
// @connect     translate.googleapis.com
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451371/%E6%97%A0%E9%9C%80%E6%A2%AF%E5%AD%90%20%E8%B0%B7%E6%AD%8C%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91%20translategoogleapiscom.user.js
// @updateURL https://update.greasyfork.org/scripts/451371/%E6%97%A0%E9%9C%80%E6%A2%AF%E5%AD%90%20%E8%B0%B7%E6%AD%8C%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91%20translategoogleapiscom.meta.js
// ==/UserScript==
(function() {
	'use strict';
	var googleUrl = 'https://translate.googleapis.com/translate_a/single?client=gtx&hl=zh-CN&dt=t&dt=bd&dj=1&source=icon&tk=33858.33858';
	var word = '';
	var icon = document.createElement('div');
	icon.innerHTML = '<svg style="position: absolute;margin: 4px;" width="24" height="24" viewBox="0 0 768 768">' +
		'<path d="M672 640.5v-417c0-18-13.5-31.5-31.5-31.5h-282l37.5 129h61.5v-33h34.5v33h115.5v33h-40.5c-10.5 40.5-33 79.5-61.5 112.5l87 85.5-22.5 24-87-85.5-28.5 28.5 25.5 88.5-64.5 64.5h225c18 0 31.5-13.5 31.5-31.5zM447 388.5c7.5 15 19.5 34.5 36 54 39-46.5 49.5-88.5 49.5-88.5h-127.5l10.5 34.5h31.5zM423 412.5l19.5 70.5 18-16.5c-15-16.5-27-34.5-37.5-54zM355.5 339c0-7.381-0.211-16.921-3-22.5h-126v49.5h70.5c-4.5 19.5-24 48-67.5 48-42 0-76.5-36-76.5-78s34.5-78 76.5-78c24 0 39 10.5 48 19.5l3 1.5 39-37.5-3-1.5c-24-22.5-54-34.5-87-34.5-72 0-130.5 58.5-130.5 130.5s58.5 130.5 130.5 130.5c73.5 0 126-52.5 126-127.5zM640.5 160.5c34.5 0 63 28.5 63 63v417c0 34.5-28.5 63-63 63h-256.5l-31.5-96h-225c-34.5 0-63-28.5-63-63v-417c0-34.5 28.5-63 63-63h192l28.5 96h292.5z" style="fill:#3e84f4;"/></svg>';
	icon.setAttribute('style', 'width:32px;' + 'height:32px;' + 'display:none;' + 'background:#fff;' + 'border-radius:16px;' +
		'box-shadow:4px 4px 8px #888;' + 'position:absolute;' + 'z-index:2147483647;');
	// 添加翻译图标到 DOM
	document.documentElement.appendChild(icon);
	document.addEventListener('mousedown', function(e) {
		if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon) || (e.target.parentNode.parentNode && e.target
				.parentNode.parentNode == icon)) { // 点击翻译图标时阻止选中的文本消失
			e.preventDefault();
		}
	});
	// 选中变化事件
	document.addEventListener("selectionchange", function() {
		if (!window.getSelection().toString().trim()) {
			icon.style.display = 'none';
			// server.containerDestroy();
		}
	});
	// 显示、隐藏翻译图标
	document.addEventListener('mouseup', function(e) {
		if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon) || (e.target.parentNode.parentNode && e.target
				.parentNode.parentNode == icon)) { // 点击了翻译图标
			e.preventDefault();
			return;
		}
		var text = window.getSelection().toString().trim();
		if (text && text.length < 800 && icon.style.display == 'none') {
			icon.style.top = e.pageY + 12 + 'px';
			icon.style.left = e.pageX + 'px';
			icon.style.display = 'block';
		} else if (!text) {
			icon.style.display = 'none';
			for (var i = 0; i < server.rendered.length; i++) { // 点击了翻译内容面板
				if (e.target == server.rendered[i]) return; // 不再创建翻译图标
			}
			server.containerDestroy(); // 销毁翻译内容面板
		}
	});
	// 翻译图标点击事件
	icon.addEventListener('click', function(e) {
		var text = window.getSelection().toString().trim();
		if (text) {
			icon.style.display = 'none';
			server.containerDestroy(); // 销毁翻译内容面板
			// 新建翻译内容面板
			var container = server.container();
			container.style.top = e.pageY + 'px';
			if (e.pageX + 350 <= document.body.clientWidth) // container 面板css最大宽度为250px
				container.style.left = e.pageX + 'px';
			else container.style.left = document.body.clientWidth - 350 + 'px';
			document.body.appendChild(container);
			server.rendered.push(container);
			if (isChina(text)) {
				ajax(googleUrl + '&sl=zh-CN&tl=en&q=' + encodeURIComponent(text), container);
			} else {
				word = text;
				ajax(googleUrl + '&sl=en&tl=zh-CN&q=' + encodeURIComponent(text), container);
			}
		}
	});

	function isChina(str) {
		var reg = /^[\u4e00-\u9fa5]/;
		return reg.test(str);
	}

	function ajax(url, element, method, data, headers) {
		if (!method) method = 'GET';
		if (!headers) headers = { "content-type": "application/x-www-form-urlencoded;charset=UTF-8", };
		GM_xmlhttpRequest({
			method: method,
			url: url,
			headers: headers,
			data: data,
			onload: function(res) {
				res = JSON.parse(res.response);
				console.log(res);
				if (res.sentences.length > 1) {
					displaycontainer(res.sentences.map(function(v) { return v.trans; }).join(''), element);
				} else {
					var trans = res.sentences[0].trans;
					if (trans === word && res.dict && res.dict[0] && res.dict[0].terms && res.dict[0].terms[0]) trans = res.dict[0]
						.terms[0];
					displaycontainer(trans, element);
				}
			},
			onerror: function(res) {
				displaycontainer("连接失败", element);
			}
		});
	}

	function displaycontainer(text, element) {
		element.textContent = text;
		element.style.display = 'block';
	}
	var server = {
		// 存放已经生成的翻译内容面板（销毁的时候用）
		rendered: [],
		// 销毁已经生成的翻译内容面板
		containerDestroy: function() {
			for (var i = this.rendered.length - 1; i >= 0; i--) {
				if (this.rendered[i] && this.rendered[i].parentNode) {
					this.rendered[i].parentNode.removeChild(this.rendered[i]);
				}
			}
		},
		// 生成翻译结果面板 DOM （此时还未添加到页面）
		container: function() {
			var div = document.createElement('div');
			div.setAttribute('style', 'display:none;' + 'position:absolute;' + 'font-size:13px;' + 'overflow:auto;' + 'background:#fff;' +
				'font-family:sans-serif,Arial;' + 'font-weight:normal;' + 'text-align:left;' + 'color:#000;' + 'padding:0.5em 1em;' +
				'line-height:1.5em;' + 'border-radius:5px;' + 'border:1px solid #ccc;' + 'box-shadow:4px 4px 8px #888;' +
				'max-width:350px;' + 'max-height:216px;' + 'z-index:2147483647;');
			return div;
		}
	};
})();
