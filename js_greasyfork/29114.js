// ==UserScript==
// @name        Show Download link OnTorrent.net | 01torrent.net
// @description Better use OnTorrent.net | 01torrent.net
// @namespace   https://greasyfork.org/fr/users/11667-hoax017
// @include     http*://*ontorrent.net/*
// @include     http*://*01torrent.net/*
// @version     1.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29114/Show%20Download%20link%20OnTorrentnet%20%7C%2001torrentnet.user.js
// @updateURL https://update.greasyfork.org/scripts/29114/Show%20Download%20link%20OnTorrentnet%20%7C%2001torrentnet.meta.js
// ==/UserScript==

jQuery(document).ready(function($) {
	var id = window.location.toString().split("/")[5];
	$.ajax(
		{
			type:"POST",
			url:"/showme.php",
			data:"id="+id+"&name=torrent",
			cache:false,
			success:function(html){
				$("#showlinks").html(html)
				var url = $("#showlinks").find('.btn-xsedt').last().attr("href");
				$("#forall").html('<a class="ladda-button" href="'+url+'" data-color="mint"><span class="ladda-label"><span class="glyphicon glyphicon-magnet"></span> Download »</span><span class="ladda-spinner"></span><div class="ladda-progress" style="width: 209px;"></div></a>')
			}
		}
	);
});