// ==UserScript==
// @name		[Lolibooru] Pool: Fix Thumbnails
// @namespace	Zolxys
// @description	Fixes the major cropping of thumbnails on the pool pages.
// @include		/^https?://lolibooru\.moe/pool/show/\d+/?($|\?|#)/
// @version		1.0
// @downloadURL https://update.greasyfork.org/scripts/28018/%5BLolibooru%5D%20Pool%3A%20Fix%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/28018/%5BLolibooru%5D%20Pool%3A%20Fix%20Thumbnails.meta.js
// ==/UserScript==
var o = document.getElementById('post-list-posts');
var a = o.childNodes;
for (var i = a.length - 1; i >= 0; --i) {
	if (a[i].nodeType == 3)
		o.removeChild(a[i]);
	else if (a[i].nodeName == 'LI') {
		a[i].style.float = 'none';
		var d = a[i].getElementsByTagName('div')[0];
		a[i].style.width = d.style.width = d.style.height = '';
		var p = d.getElementsByTagName('img')[0];
		p.style.marginLeft = p.style.marginRight = '5px';
	}
}
document.getElementById('index-hover-overlay').firstElementChild.style.display = 'none';
