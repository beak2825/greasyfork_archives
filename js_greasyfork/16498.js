// ==UserScript==
// @name        KAT - Reset Metadata Buttons
// @namespace   Dr.YeTii
// @include     http*://kat.cr/user/*/uploads/
// @include     http*://kat.cr/user/*/uploads/#*
// @include     http*://kat.cr/user/*/uploads/?*
// @description Reset meta information from uploads page
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16498/KAT%20-%20Reset%20Metadata%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/16498/KAT%20-%20Reset%20Metadata%20Buttons.meta.js
// ==/UserScript==

$('.data tr:not(.firstr)').each(function() {
	var hash = $(this).find('a[href^="/torrents/edit/"]').attr('href').split('/')[3];
	$(this).find('a[href^="/torrents/edit/"]').after(' <a class="ka ka16 ka-delete resetmetaBtn" title="Reset meta information" href="/moderator/torrent/resetmeta/'+hash+'/"></a>');
});
$('.data').before('<div id="resetmetabox"><a class="kaButton redButton smallButton resetallmetaBtn"><i class="ka ka-delete"></i> Reset meta information for all torrents</a></div>');
$(document).delegate('.resetallmetaBtn', 'click', function(e) {
	doNext();
});
function doNext() {
	setTimeout(function() {
		$('.resetmetaBtn:visible').first().click();
	}, 500);
}
$(document).delegate('.resetmetaBtn', 'click', function(e) {
	e.preventDefault();
	var b = $(this);
	$.ajax({
		'type':'POST',
		'url':b.attr('href'),
		'dataType':'json',
		beforeSend: function() {
			b.hide().after('<img src="//kastatic.com/images/indicator.gif" alt="..." id="resetmeta_'+b.attr('href').split('/')[3]+'">')
		}, success: function(data) {
			if (data.method == 'ok') {
				b.next('img').remove();
				b.show().removeClass('ka-delete resetmetaBtn').addClass('ka-green ka-accept');
				if ($('.resetmetaBtn').length>0)
					doNext();
			}else{
				b.next('img').remove();
				b.show();
				alert('Error:\n'+data.html);
			}
		}, error: function() {
			alert('An error occurred.');
		}
	});
});