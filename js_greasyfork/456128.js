// ==UserScript==
// @name         微博、豆瓣相册原图批量下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  提供微博-微相册 ( photo.weibo.com ) 、豆瓣-豆瓣电影 ( movie.douban.com ) 相册专辑内单页原图批量下载
// @author       ShuangruiYang
// @match        *movie.douban.com/*/photos*
// @match        *photo.weibo.com/*/talbum/index*
// @match        *photo.weibo.com/*/albums/detail*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456128/%E5%BE%AE%E5%8D%9A%E3%80%81%E8%B1%86%E7%93%A3%E7%9B%B8%E5%86%8C%E5%8E%9F%E5%9B%BE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/456128/%E5%BE%AE%E5%8D%9A%E3%80%81%E8%B1%86%E7%93%A3%E7%9B%B8%E5%86%8C%E5%8E%9F%E5%9B%BE%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
	`use strict`;

	var config_;

	const batch_download = function () {
		let $img_list = document.querySelectorAll(config_.$img_list_selector);
		// 验证预览图是否未加载 是则 等待1秒后再次验证
		if ($img_list.length == 0) {
			setTimeout(batch_download, 1000);
			return;
		}

		$img_list.forEach(($img) => {
			// 格式化 原图下载链接
			let download_$a = document.createElement("a");
			download_$a.href = $img.src.replace(config_.photo_src_regex, config_.photo_src_replacement);
			download_$a.download = $img.parentNode.href.replace(config_.photo_id_regex, config_.photo_id_replacement);

			fetch(download_$a.href)
				.then(res => res.blob())
				.then(blob => {
					let blob_url = window.URL.createObjectURL(blob);
					download_$a.href = blob_url;
					download_$a.click();
					window.URL.revokeObjectURL(blob_url);
				});
		});
	}

	const init = function () {
		const domain_regex = /:\/\/(?<domain>[\w\.]+)/;
		const config_map = {
			"movie.douban.com": {
				"batch_download_$button_container_selector": ".opt-bar-line",
				"batch_download_$button_class": "fright",
				"$img_list_selector": "div.article ul li img",
				"photo_id_regex": /.+photo\/(?<id>\d+).*/,
				"photo_id_replacement": "$<id>",
				"photo_src_regex": /(?<prefix>.+photo\/)\w+(?<suffix>\/public.+)\..*/,
				"photo_src_replacement": "$<prefix>raw$<suffix>",
			},
			"photo.weibo.com": {
				"batch_download_$button_container_selector": ".m_share_like",
				"batch_download_$button_class": undefined,
				"$img_list_selector": "ul.photoList li img",
				"photo_id_regex": /.+photo_id\/(?<id>\d+).*/,
				"photo_id_replacement": "$<id>",
				"photo_src_regex": /(?<prefix>.+\/)\w+(?<suffix>\/.*)/,
				"photo_src_replacement": "$<prefix>large$<suffix>",
			}
		};

		let domain = domain_regex.exec(document.location.origin).groups.domain;
		config_ = config_map[domain];

		let batch_download_$button = document.createElement("button");
		batch_download_$button.textContent = "批量下载原图";
		batch_download_$button.style.fontWeight = "bolder";
		batch_download_$button.classList.add(config_.batch_download_$button_class);
		batch_download_$button.onclick = batch_download;
		document.querySelector(config_.batch_download_$button_container_selector).appendChild(batch_download_$button);
	}

	init();
})();
