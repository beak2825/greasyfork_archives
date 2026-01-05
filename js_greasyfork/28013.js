// ==UserScript==
// @name		[Konachan / yande.re / LB] Thumbnail Info: Fix Position
// @namespace	Zolxys
// @description	Pertaining to the info box that appears when holding shift while hovering over a thumbnail: Prevents the slight overlap over the thumbnail. And if the info box extends past the top of the window, it will be moved to the bottom or side.
// @include		/^https?://konachan\.com/(post|pool/show/\d+)/?($|\?|#)/
// @include		/^https?://konachan\.net/(post|pool/show/\d+)/?($|\?|#)/
// @include		/^https?://yande\.re/(post|pool/show/\d+)/?($|\?|#)/
// @include		/^https?://lolibooru\.moe/(post|pool/show/\d+)/?($|\?|#)/
// @version		1.1
// @downloadURL https://update.greasyfork.org/scripts/28013/%5BKonachan%20%20yandere%20%20LB%5D%20Thumbnail%20Info%3A%20Fix%20Position.user.js
// @updateURL https://update.greasyfork.org/scripts/28013/%5BKonachan%20%20yandere%20%20LB%5D%20Thumbnail%20Info%3A%20Fix%20Position.meta.js
// ==/UserScript==
var mo = new MutationObserver(function (ma) {
	ma.forEach(function (m) {
		var o = m.target;
		var r = o.getBoundingClientRect();
		var tn = document.getElementById('index-hover-overlay').getBoundingClientRect();
		if (tn.height == 0) {
			tn = document.querySelectorAll('div:hover');
			tn = tn[tn.length - 1].getElementsByTagName('img')[0].getBoundingClientRect();
		}
		var vx = window.scrollX; vy = window.scrollY;
		var x = 0; y = 0;
		if (!o.visible())
			return;
		x = Math.max(Math.min(tn.left + (tn.width - r.width)/2, document.body.clientWidth), 0);
		if (r.height <= tn.top)
			y = tn.top - r.height;
		else if (r.height <= innerHeight - tn.bottom)
			y = tn.bottom;
		else {
			if (r.width <= tn.left)
				x = tn.left  - r.width;
			else
				x = tn.right;
			if (r.height >= innerHeight)
				y = Math.max(innerHeight - r.height, 0-vy);
		}
		if (Math.abs(r.top - y) >= 1 || Math.abs(r.left - x) >= 1) {
			o.style.left = (vx + x) +'px';
			o.style.top = (vy + y) +'px';
		}
	});
});
mo.observe(document.getElementById('index-hover-info'), {attributes: true, attributeFilter: ['style']});
