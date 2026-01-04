// ==UserScript==
// @name          DM5 image download
// @author        Shiaupiau (https://github.com/stu43005)
// @include       http://*.dm5.com/*
// @include       https://*.dm5.com/*
// @version       1.1
// @namespace https://greasyfork.org/users/445066
// @description 動漫屋圖片下載
// @downloadURL https://update.greasyfork.org/scripts/422885/DM5%20image%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/422885/DM5%20image%20download.meta.js
// ==/UserScript==

(function init(func) {
	setTimeout(function () {
		if (typeof jQuery === 'undefined') {
			console.log('[DM5 image download] No jQuery, try again later');
			init(func);
			return;
		}
		const script = document.createElement('script');
		script.textContent = '(' + func.toString() + ')(window)';
		document.body.appendChild(script);
	}, 500);
})(function () {
	if (!jQuery(".view-main").length) return;

	jQuery(".rightToolBar").prepend(`<a href="javascript:void(0);" title="下載圖片" id="img-download-button" class="logo_1" style="display: block !important;transform: rotate(-90deg);" target="_blank"><div class="tip">下載圖片</div></a>`);

	const btn = jQuery("#img-download-button");

	jQuery(document).on("mousemove touchmove", ".view-main img", function (e) {
		const img = e.target;
		btn.attr("href", img.src);
	});
});
