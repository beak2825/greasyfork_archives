// ==UserScript==
// @name		[Konachan-Mod] Thumbnails: Show Thumbnails for Deleted Posts (Most Pages)
// @namespace	Zolxys
// @description	Disables the hiding of thumbnails for deleted posts on the posts, pool and similar search pages.
// @include		/^https?://konachan\.(com|net)/(post(/similar(/\d+)?)?|pool/show/\d+)/?($|\?|#)/
// @version		1.1
// @downloadURL https://update.greasyfork.org/scripts/18581/%5BKonachan-Mod%5D%20Thumbnails%3A%20Show%20Thumbnails%20for%20Deleted%20Posts%20%28Most%20Pages%29.user.js
// @updateURL https://update.greasyfork.org/scripts/18581/%5BKonachan-Mod%5D%20Thumbnails%3A%20Show%20Thumbnails%20for%20Deleted%20Posts%20%28Most%20Pages%29.meta.js
// ==/UserScript==
var a = document.getElementById('post-list-posts').getElementsByTagName('img');
for (var i = 0; i < a.length; ++i)
  if (/deleted-preview.png$/.test(a[i].src)) {
	var r = /^p(\d+)$/.exec(a[i].parentNode.parentNode.parentNode.id);
	if (r != null) {
		var o = window.Post.posts._object[r[1]];
		a[i].src = location.protocol +'//'+ location.host +'/data/preview/'+ o.md5.substr(0,2) +'/'+ o.md5.substr(2,2) +'/'+ o.md5 + '.jpg';
		a[i].title = a[i].alt = o.flag_detail.flagged_by +': '+ o.flag_detail.reason +'.';
		a[i].style.borderStyle = 'dashed';
		a[i].className = a[i].className +' flagged';
	}
}
