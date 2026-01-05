// ==UserScript==
// @name        Extract images for acg.18touch.com
// @name:zh     萌聚原图收割机
// @namespace   https://github.com/cmheia/extract-images-for-18touch
// @description Adds a button that get all attached images as original size to every post.
// @include     http://acg.18touch.com/dmnews/*
// @author      cmheia
// @version     0.0.1
// @icon        http://acg.18touch.com/Public/images/favicon.jpg
// @grant       GM_setClipboard
// @license     MPL
// @downloadURL https://update.greasyfork.org/scripts/20733/Extract%20images%20for%20acg18touchcom.user.js
// @updateURL https://update.greasyfork.org/scripts/20733/Extract%20images%20for%20acg18touchcom.meta.js
// ==/UserScript==
(function () {
	// 去重
	var doUnique = function (arr) {
		var result = [], hash = {};
		for (var i = 0, elem; (elem = arr[i]) !== undefined; i++) {
			if (!hash[elem]) {
				result.push(elem);
				hash[elem] = true;
			}
		}
		return result;
	};

	var extracterImages = function () {
		var doMatch = function (str) {
			var regex = new RegExp(/((http|https):\/\/)+(\w+\.)+(\w+)[\w\/\.\-]*(jpg|jpeg|gif|png|webp)/, "gi");
			var strSource = str;
			var result = doUnique(strSource.match(regex));
			if (null === result || 0 === result.length) {
				return 0;
			}
			GM_setClipboard(result.join("\r\n"));
			return result.length;
		};

		var matched = doMatch(document.getElementsByClassName('news_content_main_page')[0].innerHTML);
		var message = document.getElementById("extracted");
		if (0 === matched) {
			message.innerHTML = "然而并不能收割 (╯#-_-)╯~~~~~~~~~~~~~~~~~╧═╧";
		} else if (1 === matched) {
			message.innerHTML = "搞到这张图啦 （⺻▽⺻ ）";
		} else if (1 < matched) {
			message.innerHTML = "搞到 " + matched + " 张图 （⺻▽⺻ ）";
		}
	};

	// 添加按钮
	var addButton = function () {
		var button = document.createElement('span');
		button.innerHTML="<a href='javascript:;' style='margin:0 8px;'>收割 ๑乛◡乛๑ (●´∀｀●)</a><span id='extracted'></span>";
		button.addEventListener("click", extracterImages);
		document.addEventListener("keydown", function (event) {
			// F9 = 120
			// F10 = 121
			if (120 === event.keyCode || 121 === event.keyCode) {
				extracterImages();
			}
		}, true);
		document.getElementsByClassName('info')[0].appendChild(button);
	};

	// 运行
	addButton();
}) ();
