// ==UserScript==
// @name        KAT - ACL 8 - Easier Tier One
// @namespace   Dr.YeTii
// @description yeah
// @include     *kat.cr/moderator/verify/tier1/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11084/KAT%20-%20ACL%208%20-%20Easier%20Tier%20One.user.js
// @updateURL https://update.greasyfork.org/scripts/11084/KAT%20-%20ACL%208%20-%20Easier%20Tier%20One.meta.js
// ==/UserScript==

$('body').prepend('<style>.inlineindicator{margin:1px;min-width:16px;height:16px;display:inline-block;vertical-align:top;}</style>');
$('.greenButton.itorrent[href^="/moderator/verifycontrol/"]').each(function() {
	var id = $(this).attr('href').split('/')[3];
	$(this).next().remove();
	$(this).after('<a class="tierOneAccept greenButton iverify icon16" title="Accept"><span></span></a> <a class="tierOneNotSpecific greyButton iunverify icon16" title="Not Specific Enough\n[Decline - 3 days]"><span></span></a> <a class="tierOneDecline redButton iunverify icon16" title="Decline"><span></span></a>');
	$(this).remove();
});

var templateDecline = 'This is not a valid request. A valid one:\n•Is in English\n•Says something about yourself\n•Explicitly states what you plan to upload (titles, formats, etc)\nSo we will have to decline you [u]for the moment[/u]. Re-apply in 3 days. Don\'t PM mods requesting uploader status as this is not taken lightly.';
$(document).delegate('.tierOneAccept:not(.torrentDownloaded)', 'click', function() {
	var id = $(this).closest('tr').attr('id').split('_')[1];
	$.ajax({
		type: 'POST',
		url: '/moderator/verifycontrol/'+id+'/',
		data: {action: 'accept', return_uri: ''},
		beforeSend: function() {
			$('#request_'+id+' .lasttd .iverify').replaceWith('<img class="inlineindicator" src="https://kastatic.com/images/indicator.gif" alt="..." />');
			$('#request_'+id+' .lasttd').find('.iunverify').addClass('torrentDownloaded');
		},success: function() {
			$('#request_'+id).fadeOut(150);
		},error: function() {
			alert('An error occurred :(');
		}
	});
});
$(document).delegate('.tierOneNotSpecific:not(.torrentDownloaded)', 'click', function() {
	var id = $(this).closest('tr').attr('id').split('_')[1];
	tierOneDecline(id, templateDecline, 3);
});
$(document).delegate('.tierOneDecline:not(.torrentDownloaded)', 'click', function() {
	var id = $(this).closest('tr').attr('id').split('_')[1];
	var reason = prompt('Enter decline reason:');
	if (reason) {
		var days = prompt('How many days should this user wait? (invalid numbers default to 7)');
		if (!isNaN(days))
			tierOneDecline(id, reason, days);
	}
});
function tierOneDecline(id, decline_reason, days) {
	$.ajax({
		type: 'POST',
		url: '/moderator/verifycontrol/'+id+'/',
		data: {action: 'decline',
			   return_uri: '',
			   duration: '', 
			   custom_duration: days, 
			   reason: decline_reason},
		beforeSend: function() {
			if (decline_reason == templateDecline) {
				$('#request_'+id+' .lasttd .greyButton.iunverify').replaceWith('<img class="inlineindicator" src="https://kastatic.com/images/indicator.gif" alt="..." />');
			}else{
				$('#request_'+id+' .lasttd .redButton.iunverify').replaceWith('<img class="inlineindicator" src="https://kastatic.com/images/indicator.gif" alt="..." />');
			}
			$('#request_'+id+' .lasttd').find('.iverify, .iunverify').addClass('torrentDownloaded');
		},success: function() {
			$('#request_'+id).fadeOut(150);
		},error: function() {
			alert('An error occurred :(');
		}
	});
}