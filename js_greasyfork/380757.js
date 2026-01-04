// ==UserScript==
// @name		Lofter显示原图
// @namespace	https://github.com/ted423
// @version		1.0
// @description	Lofter显示原图,直接显示,用于页面批量下载
// @grant		unsafeWindow
// @author		ted423
// @match		*://*.lofter.com/post/*
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/380757/Lofter%E6%98%BE%E7%A4%BA%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/380757/Lofter%E6%98%BE%E7%A4%BA%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==
    "use strict";
	var imgs = document.querySelectorAll(".img img");
	[].forEach.call(imgs, function(img) {
	img.src=img.src.split("?")[0];
	console.log(img.src);
	});