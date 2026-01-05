// ==UserScript==
// @name		[Konachan / yande.re / LB] History: Don't Show Incorrect Thumbnails
// @namespace	Zolxys
// @description	On the history pages, when the thumbnail for the row you're hovering over hasn't loaded yet, it will show a blank thumbnail instead of an incorrect thembnail. (Useful for slow connections)
// @include		/^https?://konachan\.com/(history|post/deleted_index)/?($|\?|#)/
// @include		/^https?://konachan\.net/(history|post/deleted_index)/?($|\?|#)/
// @include		/^https?://yande\.re/(history|post/deleted_index)/?($|\?|#)/
// @include		/^https?://lolibooru\.moe/(history|post/deleted_index)/?($|\?|#)/
// @version		1.0
// @downloadURL https://update.greasyfork.org/scripts/28044/%5BKonachan%20%20yandere%20%20LB%5D%20History%3A%20Don%27t%20Show%20Incorrect%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/28044/%5BKonachan%20%20yandere%20%20LB%5D%20History%3A%20Don%27t%20Show%20Incorrect%20Thumbnails.meta.js
// ==/UserScript==
window.zol_history_no_incorrect = function() { // Added as a function so that it can be run from scripts that add a hovering thumbnail (ie. "Deleted Index: Show Thumbnails")
	var tbl = document.getElementById('content').getElementsByTagName('table')[0];
	var l = tbl.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
	for (var i = l.length - 1; i >= 0; --i) {
		l[i].observe("mouseover", function() {
			var r = /\/post\/show\/(\d+)$/.exec(((this.getElementsByClassName('id').length)? this.getElementsByClassName('id')[0] : this).getElementsByTagName('a')[0].href);
			var id = (r)? parseInt(r[1]) : false;
			if (id && !Post.is_blacklisted(id)) {
				var tn = document.getElementById('hover-thumb');
				tn.src = '/images/blank.gif';
				tn.src = window.Post.posts._object[id].preview_url;
			}
		});
	}
}
if (document.getElementById('hover-thumb'))
	window.zol_history_no_incorrect();
