// ==UserScript==
// @name        Extract images for tieba.baidu.com
// @name:zh     贴吧壁纸收割机
// @namespace   https://github.com/cmheia/extract-images-for-tieba
// @description Adds a button that get all attached images as original size to every post.
// @include     http://tieba.baidu.com/p/*
// @include     https://tieba.baidu.com/p/*
// @author      cmheia
// @version     0.3.3
// @icon        http://tb1.bdstatic.com/tb/favicon.ico
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @license     MPL
// @downloadURL https://update.greasyfork.org/scripts/20729/Extract%20images%20for%20tiebabaiducom.user.js
// @updateURL https://update.greasyfork.org/scripts/20729/Extract%20images%20for%20tiebabaiducom.meta.js
// ==/UserScript==
(function () {
	'use strict';

	var $id = function (o) {
		return document.getElementById(o);
	};

	// 去重
	var doUnique = function (arr) {
		var result = [],
		hash = {};
		for (let i = 0, elem; (elem = arr[i]) !== undefined; i++) {
			if (!hash[elem]) {
				result.push(elem);
				hash[elem] = true;
			}
		}
		return result;
	};

	// 插入样式表
	var apendStyle = function (cssText) {
		var head = document.head || document.querySelectorAll('head')[0];
		var style = document.createElement('style');
		style.type = 'text/css';
		var textNode = document.createTextNode(cssText);
		style.appendChild(textNode);
		head.appendChild(style);
	};

	// 创建样式表
	var addStyle = function () {
		apendStyle(".margin8 {margin:8px;} .preview_item {padding:3px;display:inline-block;vertical-align:top;position:relative;} .preview_box {max-width:300px;max-height:300px;vertical-align:bottom;} .preview_container {z-index:11000;} .preview_selector {position:absolute;left:0;} .preview_excluded {background:#FFCCFF;}");
	};

	// 页面显示信息
	var msg = function (msg) {
		$id("extracted").innerHTML = msg;
	};

	// 取得分页数量
	var getPages = function () {
		var l_posts_num = document.querySelectorAll('.l_posts_num > li > span.red');
		return parseInt(l_posts_num[l_posts_num.length - 1].innerText);
	};

	// 取得IMG标签中的SRC
	var getImgTags = function (content) {
		// console.group("取得IMG标签中的SRC");
		let images1 = content.match(/<img[^<>]*class=\"BDE_Image\"[^<>]*src\=\"(?:(?:(?:http|https)\:\/\/)?[^<>]*(?:jpg|jpeg|gif|png|webp))[^\"]*\"[^<>]*>/g);
		let images2 = content.match(/<img[^<>]*src\=\"(?:(?:(?:http|https)\:\/\/)?[^<>]*(?:jpg|jpeg|gif|png|webp))[^\"]*\"[^<>]*class=\"BDE_Image\"[^<>]*>/g);
		let images = null;

		if (null === images1 && null === images2) {
			return [];
		}
		if (null !== images1 && null === images2) {
			images = images1;
		}
		if (null === images1 && null !== images2) {
			images = images2;
		}
		if (null !== images1 && null !== images2) {
			images = images1.concat(images2);
			images1 = images2 = null;
		}
		// console.log("匹配结果", images);
		var imageSrc = [];
		if (null !== images) {
			imageSrc = images.map(function (val, i) {
				let src = val.match(/(?:(http[s]*):\/\/)([^\.]*)([^\/]*)(.*)(?:\.(?:jpg|jpeg|gif|png|webp))/);
				// console.log(i, val);
				// console.log(src);
				if (null !== src) {
					if ("adscdn" === src[2] || ".bdstatic.com" === src[3] ) {
						// 先去广告
						// console.log("去广告");
						return undefined;
					}
					if (".baidu.com" === src[3] || ".bdimg.com" === src[3]) {
						let m = src[0].match(/(?:[\w\d\.]+)(?:jpg|jpeg|gif|png|webp)/);
						// console.log("return", m);
						return `${src[1]}://imgsrc.baidu.com/forum/pic/item/${m[0]}`;
					}
					if (".sinaimg.cn" === src[3]) {
						let m = src[0].match(/((?:http|https)\:\/\/[\w\d\.]+)sinaimg\.cn\/([\w\d]+)\/([\w\d\.\?]+)/);
						// console.log("return", m);
						return `${m[1]}sinaimg.cn/large/${m[3]}`;
					}
					// console.log("原始链接", src[0]);
					return src[0];
				} else {
					return undefined;
				}
			});
		}
		for (let i = imageSrc.length - 1; i >= 0; i--) {
			if (undefined === imageSrc[i]) {
				imageSrc.splice(i, 1);
			}
		}
		// console.log(imageSrc);
		// console.groupEnd();
		return imageSrc;
	};

	// 取得单个分页原图链接
	var extractSinglePage = function (content) {
		var images = getImgTags(content);

		var result = doUnique(images);
		// console.warn(result);
		if (null === result || 0 === result.length) {
			return null;
		}
		return result;
	};

	// 取得所有分页原图链接
	var extractAllPages = function (pages, auto) {
		var imageSrc = {};
		var parsedPages = 0;
		var failedPages = 0;

		var collectImages = function () {
			if (pages === parsedPages) {
				// console.log("提取失败", failedPages, "页");
				// console.log(imageSrc);
				var imageSrcArray = [];
				for (let i in imageSrc) {
					// console.debug("第", i, "页", imageSrc[i].length, "图");
					for (let j of imageSrc[i]) {
						imageSrcArray.push(j);
					}
				}

				var result = doUnique(imageSrcArray);
				if (null === result || 0 === result.length) {
					msg("然而并没有图片 (╯#-_-)╯~~~~~~~~~~~~~~~~~╧═╧");
				} else {
					exportAlbum(result, auto);
				}
			}
		};
		var parseRespond = function (xhr) {
			var currentPage = xhr.finalUrl.replace(/http[s]*\:\/\/tieba.baidu.com\/p\/(\d+)\?pn=(\d+)$/, "$2") - 0;

			msg(`到手第${currentPage}页(共${parsedPages}页)，就剩${(pages - parsedPages)}页啦 (ฅ´ω\`ฅ)`);
			console.log('到手第', currentPage, '页(共', parsedPages, '页)，剩', pages - parsedPages, '页');

			currentPage--;
			imageSrc[currentPage] = getImgTags(xhr.response);
			parsedPages++;
			collectImages();
		};
		var xhrErrorHandler = function (xhr) {
			var currentPage = xhr.finalUrl.replace(/http[s]*\:\/\/tieba.baidu.com\/p\/(\d+)\?pn=(\d+)$/, "$2") - 0;

			msg(`第${currentPage}页提取失败 (ಥ_ಥ)`);
			console.log('第', currentPage, '页提取失败');
			parsedPages++;
			failedPages++;

			collectImages();
		};

		for (let i = 1; i <= pages; i++) {
			let url = window.location.origin + window.location.pathname + "?pn=" + i;
			GM_xmlhttpRequest({
				method : 'GET',
				url : url,
				onload : parseRespond,
				onerror : xhrErrorHandler
			});
		}
	};

	// 仅收割当前分页
	var extracterImage = function (auto) {
		var result = extractSinglePage(document.querySelector('#j_p_postlist').innerHTML);
		if (null !== result && 0 < result.length) {
			exportAlbum(result, auto);
		} else {
			msg("然而并不能收割 (╯#-_-)╯~~~~~~~~~~~~~~~~~╧═╧");
		}
	};

	// 收割全部分页
	var extracterImages = function (auto) {
		// console.clear();
		var pages = getPages();
		if (0 === pages) {
			msg("度娘又改版了 (╯#-_-)╯~~~~~~~~~~~~~~~~~╧═╧");
		} else if (1 === pages) {
			let result = extractSinglePage(document.querySelector('#j_p_postlist').innerHTML);
			if (null !== result && 0 < result.length) {
				exportAlbum(result, auto);
			} else {
				msg("然而并不能收割 (╯#-_-)╯~~~~~~~~~~~~~~~~~╧═╧");
			}
		} else {
			extractAllPages(pages, auto);
			msg("正在搞这 " + pages + " 页图，不要急嘛 (๑•̀_•́๑)");
		}
	};

	// 新建图集
	var exportAlbum = function (images, auto) {
		if (null === images || 0 === images.length) {
			return;
		}
		var imageCount = images.length;

		if (auto) {
			GM_setClipboard(images.join("\r\n"));
			msg(`搞到这${imageCount}张图啦 （⺻▽⺻ ）`);
			return;
		}

		// 删除图集
		var removeAlbum = function () {
			if (null !== $id("preview_window")) {
				document.body.removeChild($id("preview_window"));
			}
			msg("");
		};

		// 恢复被隐藏的元素
		var showOtherElements = function () {
			for (let i = 0; i < document.body.children.length; i++) {
				if ("DIV" === document.body.children[i].tagName && "y" === document.body.children[i].getAttribute("data-hide")) {
					document.body.children[i].style.display = "";
				}
			}
			document.querySelector(".tbui_aside_float_bar").style.display = "";
		};

		// 隐藏无关元素
		var hideOtherElements = function () {
			for (let i = 0; i < document.body.children.length; i++) {
				if ("DIV" === document.body.children[i].tagName && "com_userbar_message" !== document.body.children[i].id) {
					document.body.children[i].style.display = "none";
					document.body.children[i].setAttribute("data-hide", "y");
				}
			}
			document.querySelector(".tbui_aside_float_bar").style.display = "none";
		};

		// 导出选中图片链接
		var exportSelected = function () {
			var items = $id("preview_list");
			var counts = items.children.length;
			var result = [];
			for (let i = 0; i < counts; i++) {
				if (items.children[i].children[1].checked) {
					result.push(items.children[i].children[0].src);
				}
			}
			if (0 < result.length) {
				GM_setClipboard(result.join("\r\n"));
				$id("export_msg").innerHTML = "搞到这" + result.length + "张图啦 （⺻▽⺻ ）";
			} else {
				$id("export_msg").innerHTML = "至少选择一张图吧 ◔ ‸◔？";
			}
		};

		// 关闭图片墙
		var closePreviewWindow = function () {
			showOtherElements();
			$id("preview_window").style.display = "none";
		};

		// 选中全部图片
		var previewSelectAll = function () {
			var items = $id("preview_list");
			var counts = items.children.length;
			for (let i = 0; i < counts; i++) {
				items.children[i].children[1].checked = true;
				items.children[i].className = "preview_item";
			}
			$id("previewer_selected").innerHTML = counts;
		};

		// 反选
		var previewSelectInvert = function () {
			var items = $id("preview_list");
			var counts = items.children.length;
			for (let i = 0; i < counts; i++) {
				items.children[i].children[1].checked = !items.children[i].children[1].checked;
				items.children[i].className = (items.children[i].children[1].checked) ? "preview_item" : "preview_item preview_excluded";
			}
			$id("previewer_selected").innerHTML = counts - parseInt($id("previewer_selected").innerHTML);
		};

		// 点击图片切换选中状态
		var previewSelector = function (o) {
			o.nextSibling.checked = !o.nextSibling.checked;
			var selected = $id("previewer_selected");
			selected.innerHTML = parseInt(selected.innerHTML) + ((o.nextSibling.checked === true) ? 1 : -1);
			if (o.nextSibling.checked) {
				o.parentNode.className = "preview_item";
			} else {
				o.parentNode.className = "preview_item preview_excluded";
			}
		};

		// 创建控制栏
		var controller = document.createElement('div');
		controller.id = "previewer_ctrl";
		controller.style = "position:relative";

		var info = document.createElement('span');
		info.id = "previewer_info";
		info.className = "margin8";
		info.innerHTML = "共<span class='red'>" + imageCount + "</span>图，已选<span id='previewer_selected' class='red'>" + imageCount + "</span>图";
		controller.appendChild(info);

		var buttonClose = document.createElement('a');
		buttonClose.href = "javascript:;";
		buttonClose.className = "margin8";
		buttonClose.innerHTML = "关闭图片墙";
		buttonClose.addEventListener("click", closePreviewWindow);
		controller.appendChild(buttonClose);

		var buttonSelectAll = document.createElement('a');
		buttonSelectAll.href = "javascript:;";
		buttonSelectAll.className = "margin8";
		buttonSelectAll.innerHTML = "全选";
		buttonSelectAll.addEventListener("click", previewSelectAll);
		controller.appendChild(buttonSelectAll);

		var buttonInvert = document.createElement('a');
		buttonInvert.href = "javascript:;";
		buttonInvert.className = "margin8";
		buttonInvert.innerHTML = "反选";
		buttonInvert.addEventListener("click", previewSelectInvert);
		controller.appendChild(buttonInvert);

		var buttonExportSelected = document.createElement('a');
		buttonExportSelected.href = "javascript:;";
		buttonExportSelected.className = "margin8";
		buttonExportSelected.innerHTML = "导出选定图片";
		buttonExportSelected.addEventListener("click", exportSelected);
		controller.appendChild(buttonExportSelected);

		var message = document.createElement('span');
		message.id = "export_msg";
		message.className = "margin8";
		controller.appendChild(message);

		// 创建图片列表
		var itemList = document.createElement('ul');
		itemList.id = "preview_list";

		var previewer = document.createElement('div');
		previewer.id = "preview_matrix";
		previewer.appendChild(itemList);

		for (let i = 0; i < imageCount; i++) {
			let item = document.createElement('li');
			item.innerHTML = "<img id='" + "preview_img_" + i + "' class='preview_box' src='" + images[i] + "'><input type='checkbox' id='" + "preview_cb_" + i + "' class='preview_selector' checked='checked'>";
			item.className = "preview_item";
			item.children[0].addEventListener("click", function () {
				previewSelector(this);
			});
			itemList.appendChild(item);
		}

		// 删除旧的图片墙
		removeAlbum();
		var container = document.createElement('div');
		container.id = "preview_window";
		container.className = "preview_container";
		container.appendChild(controller);
		container.appendChild(previewer);
		hideOtherElements();
		document.body.appendChild(container);

		var button = document.createElement('a');
		button.href = "javascript:;";
		button.innerHTML = "打开图片墙";
		button.addEventListener("click", function () {
			hideOtherElements();
			$id("preview_window").style.display = "";
		});
		$id("extracted").appendChild(button);
	};

	// 添加按钮
	var addButton = function () {
		var button = document.createElement('li');
		button.innerHTML = "<a href='javascript:;' class='margin8'>收割</a><span id='extracted'></span>";
		button.class = "l_reply_num";
		button.children[0].addEventListener("click", function () {
			extracterImages(false);
		});
		document.addEventListener("keyup", function (event) {
			// F9 = 120
			// F10 = 121
			if (120 === event.keyCode) {
				extracterImage(true);
			} else if (121 === event.keyCode) {
				extracterImages(true);
			}
		}, true);
		document.querySelector('.l_posts_num').appendChild(button);
	};

	// 运行
	(function () {
		var DOMObserverTimer = false;
		var DOMObserverConfig = {
			attributes : true,
			childList  : true,
		};
		var DOMObserver = new MutationObserver(function () {
				if (DOMObserverTimer !== 'false') {
					clearTimeout(DOMObserverTimer);
				}
				DOMObserverTimer = setTimeout(function () {
					DOMObserver.disconnect();
					if (!$id("extracted")) {
						// console.log("重新添加按钮");
						addButton();
					}
					DOMObserver.observe(document.querySelector('#j_p_postlist'), DOMObserverConfig);
				}, 100);
			});
		DOMObserver.observe(document.querySelector('#j_p_postlist'), DOMObserverConfig);
	})();

	addStyle();
	addButton();
})();
