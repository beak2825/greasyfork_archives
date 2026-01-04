// ==UserScript==
// @name        百度百科 - 将图片改为无水印版本
// @description 将百度百科的图片改为无水印版本，在单独打开百度百科图片时重定向到原图，并提供各种格式的原图链接。
// @namespace   RainSlide
// @author      RainSlide
// @version     3.0
// @license     blessing
// @icon        https://baike.baidu.com/favicon.ico
// @run-at      document-idle
// @grant       none
// @match       https://baike.baidu.com/pic/*
// @match       https://baike.baidu.com/picture/*
// @match       https://baike.baidu.com/historypic/*
// @match       https://baike.baidu.com/picview/history/*
// @match       https://bkimg.cdn.bcebos.com/pic/*
// @match       http://bkimg.cdn.bcebos.com/pic/*
// @downloadURL https://update.greasyfork.org/scripts/387058/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%20-%20%E5%B0%86%E5%9B%BE%E7%89%87%E6%94%B9%E4%B8%BA%E6%97%A0%E6%B0%B4%E5%8D%B0%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/387058/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%20-%20%E5%B0%86%E5%9B%BE%E7%89%87%E6%94%B9%E4%B8%BA%E6%97%A0%E6%B0%B4%E5%8D%B0%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

// https://bkimg.cdn.bcebos.com/pic/0823dd54564e9258dbbe38929382d158cdbf4ec7?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5
// https://bkimg.cdn.bcebos.com/pic/0823dd54564e9258dbbe38929382d158cdbf4ec7
// https://imgsrc.baidu.com/baike/pic/item/0823dd54564e9258dbbe38929382d158cdbf4ec7.jpg

"use strict";

const bce = "x-bce-process";
const isBkimg = url => url.hostname === "bkimg.cdn.bcebos.com";
const trimUrl = url => url.origin + url.pathname;

if (location.hostname === "baike.baidu.com") {

	const img = document.querySelector('div[class^="imgWraper"]:only-child > img');

	if (img) {

		const replaceUrl = () => {
			const url = new URL(img.src);
			if (isBkimg(url) && url.searchParams.has(bce)) {
				img.src = trimUrl(url);
			}
		};

		replaceUrl();

		new MutationObserver(replaceUrl).observe(
			img, {
				attributes: true,
				attributeFilter: ["src"]
			}
		);

	}

} else if (isBkimg(location) && document.contentType.startsWith("image/")) {

	const originalUrl = trimUrl(location);
	const formats = new Map([
	[ "jpg"  , "JPG"  ],
	[ "png"  , "PNG"  ],
	[ "bmp"  , "BMP"  ],
	[ "webp" , "WebP" ],
	[ "heic" , "HEIC" ],
	[ "gif"  , "GIF"  ],
	[ "avif" , "AVIF" ],
	[ "auto" , "自动" ],
]);

	const appendFormatLinks = format => {

		const $ = (tagName, ...props) => Object.assign(
			document.createElement(tagName), ...props
		);
		const createLink = (url, text) => $("a", { href: url, textContent: text });

		formats.has(format) &&
		formats.set(format, formats.get(format) + "[当前]");

		const links = [createLink(originalUrl, format === null ? "原图 [当前]" : "原图")];

		Array.from(formats.entries()).forEach(
			([f, name]) => links.push(" ", createLink(`?${bce}=image/format,f_${f}`, name))
		);

		const nav = $("nav", {
			className: "format-links",
			style: "position: absolute; padding: .1em .2em; background-color: #fff7"
		});
		nav.append(...links);
		document.body.append(nav);
	};

	const format = location.search.slice(30);

	location.search === ""
	? appendFormatLinks(null)
	: /^\?x-bce-process=image\/format,f_[a-z]{3,4}$/.test(location.search) &&
	 	formats.has(format)
		? appendFormatLinks(format)
		: location.replace(originalUrl);

	/* (() => {

		const searchParams = new URLSearchParams(location.search);
		if (searchParams.size === 0) {
			// 原图
			appendFormatLinks(null);
			return;
		} else if (searchParams.size === 1 && searchParams.has(bce)) {
			const actions = searchParams.get(bce).split("/");
			if (actions.shift() === "image") {
				const actionArr = actions.map(part => part.split(","));
				if (actionArr.length === 1 && actionArr[0][0] === "format") {
					const format = actionArr[0][1].slice(2);
					// 转换过格式的原图
					if (formats.has(format)) { appendFormatLinks(format); return; }
				}
			}
		}

		// 各种非原图
		location.replace(originalUrl);

	})(); */

}
