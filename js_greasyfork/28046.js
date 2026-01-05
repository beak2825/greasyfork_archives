// ==UserScript==
// @name		[Konachan / yande.re / LB] Deleted Posts: Show Thumbnails
// @namespace	Zolxys
// @description	Shows a hovering thumbnail on the "Deleted Posts" pages (just as seen on the history pages).
// @include		/^https?://konachan\.com/post/deleted_index/?($|\?|#)/
// @include		/^https?://konachan\.net/post/deleted_index/?($|\?|#)/
// @include		/^https?://yande\.re/post/deleted_index/?($|\?|#)/
// @include		/^https?://lolibooru\.moe/post/deleted_index/?($|\?|#)/
// @version		1.0
// @downloadURL https://update.greasyfork.org/scripts/28046/%5BKonachan%20%20yandere%20%20LB%5D%20Deleted%20Posts%3A%20Show%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/28046/%5BKonachan%20%20yandere%20%20LB%5D%20Deleted%20Posts%3A%20Show%20Thumbnails.meta.js
// ==/UserScript==
var host = location.host.toString().replace('//yande.re', '//assets.yande.re');
Preload.preload_started = true; //Actually means window has loaded. Explicitly set here since Preload.init() won't be run before the window has loaded.
var tbl = document.getElementById('content').getElementsByTagName('table')[0];
var tn = document.createElement('img');
tn.id = 'hover-thumb';
tn.src = '/images/blank.gif';
tn.style.position = 'absolute';
tn.style.display = 'none';
tn.style.border = '2px solid #000';
tn.style.right = '10%';
tbl.parentNode.insertBefore(tn, tbl);
var l = tbl.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
var a = [];
for (var i = 0; i < l.length; ++i)
	l[i].id = 'r'+ (a[i] = parseInt(l[i].getElementsByTagName('td')[0].textContent.trim()));
a.sort(function(x, y) {
	return x - y;
});
var n = Math.floor(999/(a.length - 1));
for (var i = a.length - 1; i >= 0;) {
	var e = a[i--];
	var s = e;
	for (; i >= 0; --i) {
		if (a[i+1] - a[i] <= n)
			s = a[i];
		else
			break;
	}
	var r = new XMLHttpRequest();
	r.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var o = eval(this.responseText);
			var ai = a.length - 1;
			for (var oi = 0; oi < o.length; ++oi) {
				while (ai >= 0 && a[ai] > o[oi].id)
					--ai;
				if (a[ai] == o[oi].id) {
					o[oi].preview_url = location.protocol +'//'+ host +'/data/preview/'+ ((/lolibooru/.test(host))? '' : o[oi].md5.substr(0,2) +'/'+ o[oi].md5.substr(2,2) +'/') + o[oi].md5 +'.jpg';
					Preload.preload(o[oi].preview_url);
					Post.register(o[oi]);
					Post.init_hover_thumb(document.getElementById('r'+ a[ai]), o[oi].id, tn, tbl);
				}
			}
		}
	}
	r.open('GET', location.protocol +'//'+ location.host +'/post.json?limit=1000&tags=deleted:true+id:'+ s +'..'+ e, true);
	r.send();
}
if (window.zol_history_no_incorrect) // Running script from "History: Don't Show Incorrect Thumbnails" if it loaded first.
	window.zol_history_no_incorrect();
