// ==UserScript==
// @name 500px图片下载
// @version 20160402.1113
// @author qhq
// @homepageURL    https://greasyfork.org/zh-CN/scripts/14710
// @supportURL		https://greasyfork.org/zh-CN/scripts/14710/feedback
// @icon         https://assetcdn.500px.org/assets/favicon-1e8257b93fb787f8ceb66b5522ee853c.ico
// @description  在500px.com网站添加下载图片按钮
// @include http*://500px.com/*
// @grant none
// @namespace https://greasyfork.org/users/9065
// @downloadURL https://update.greasyfork.org/scripts/14710/500px%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/14710/500px%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
	/**
	var src = $("#preload img").attr("src");

	if (src.indexOf('/h%3D300/') == -1) {
	$( ".photo_sidebar .actions_region" ).append( '<DIV class="actions_region section"><a href="' + src + '" target="_blank"  title="Download..." download class="button medium submit">下载图片</a></DIV>' );
	}
	 **/
	var addBtnDownload = function (src) {
		var el = document.querySelector('.main_container .sidebar_region .photo_sidebar .actions_region');
		el.insertAdjacentHTML('afterEnd', '<a href="' + src + '" target="_blank" download class="button medium submit">Download</a>');
	}
	var eventHandler = function (events) {
		events.forEach(function (event) {
			if (event.type == "attributes" && event.attributeName == 'src') {
				if (event.target.src.indexOf('h%3D300/') ==  - 1 && event.target.alt != "" && event.target.className == "photo") {
					addBtnDownload(event.target.src);
					//console.log(event.target, event.attrChange, event.attrName, event.newValue);
				}
			}
		});
	}

	// Firefox和Chrome早期版本中带有前缀
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

	// 选择目标节点
	var target = document.querySelector('body');

	// 创建观察者对象
	var observer = new MutationObserver(eventHandler);

	// 配置观察选项:
	var config = {
		attributes : true,
		//attributeFilter : ["src"],
		//attributeOldValue : false,
		//childList : true,
		subtree : true
	}

	// 传入目标节点和观察选项
	observer.observe(target, config);

	// 随后,你还可以停止观察
	//	observer.disconnect();

})();
