// ==UserScript==
// @name         zFrontier帖子显示大图
// @namespace    https://greasyfork.org/scripts/419183-zfrontier%E5%B8%96%E5%AD%90%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BE
// @version      0.3
// @description  zFrontier帖子图片替换为大图
// @author       mlch911
// @match        https://www.zfrontier.com/app/flow/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/419183/zFrontier%E5%B8%96%E5%AD%90%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/419183/zFrontier%E5%B8%96%E5%AD%90%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var max_width_key = 'max-width'

	function switchImg() {
		var pic = $('.gallery-pic img')
		if (pic.length > 0) {
			pic.each(function () {
				var large_img = $(this).attr("large")
				if (large_img.length > 0 && large_img != $(this)) {
					if ($(this).attr("lazy") != 'loaded') {
						setTimeout(function () {
							switchImg()
						}, 100)
						return
					} else {
						if ($(this).attr('src') != large_img) {
							$(this).attr('src', large_img)
						}
						if (!hasConfigCSS) {
							configCSS()
							hasConfigCSS = true
						}
					}
				}
			})
		}
	}

	var hasConfigCSS = false

	function configCSS() {
		var max_width = GM_getValue(max_width_key)
		if (max_width == null) {
			max_width = '50%'
			GM_setValue(max_width_key, max_width)
		}

		var left_side = $('.body-wrap .left-side')
		left_side.css('width', 'auto')
		left_side.css('max-width', max_width)

		var article = $('.body-wrap .left-side article')
		article.each(function () {
			$(this).css('width', 'auto')
		})

		var p = $('.body-wrap .left-side .article-wrap p')
		p.each(function () {
			if ($(this).find('.gallery-pic').length == 0) {
				$(this).css('max-width', '700px')
			}
		})
	}

	$('.body-wrap .left-side').ready(function () {
		setTimeout(function () {
			switchImg()
		}, 500)
	})

	function AddCustomStyle() {

	}

	AddCustomStyle();
	try {
		GM_registerMenuCommand('脚本设置', function () {
			document.querySelector("#sp-ac-content").style.display = 'block';
		});
	} catch (e) {}
})();