// ==UserScript==
// @name        KAT - ACL 8 - Easier Tier One
// @namespace   Dr.YeTii
// @description yeah
// @include     *kat.cr/moderator/verify/tier1/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11073/KAT%20-%20ACL%208%20-%20Easier%20Tier%20One.user.js
// @updateURL https://update.greasyfork.org/scripts/11073/KAT%20-%20ACL%208%20-%20Easier%20Tier%20One.meta.js
// ==/UserScript==

$('body').prepend('<style>.inlineindicator{margin:1px;min-width:16px;height:16px;display:inline-block;vertical-align:top;}.ka-red, .ka-red.ka-180 { background: #D47E3C none repeat scroll 0% 0% !important; text-shadow: 0px 1px 0px #D47E3C; } .ka-grey, .ka-grey.ka-180 { background: #7A7A7A none repeat scroll 0% 0% !important; text-shadow: 0px 1px 0px #7A7A7A; }</style>');
$('[href^="/moderator/verifycontrol/"]:has(.ka-green)').each(function() {
	var id = $(this).attr('href').split('/')[3];
	$(this).next().remove();
	$(this).after('<a class="tierOneAccept ka ka16 ka-green ka-verify" title="Accept"></a> <a class="tierOneNotSpecific ka ka16 ka-grey ka-verify ka-180" title="Not Specific Enough\n[Decline - 3 days]"></a> <a class="tierOneDecline ka ka16 ka-red ka-verify ka-180" title="Decline"></a>');
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
			$('#request_'+id+' .lasttd .ka-green').replaceWith('<img class="inlineindicator" src="https://kastatic.com/images/indicator.gif" alt="..." />');
			$('#request_'+id+' .lasttd').find(':not(img)').addClass('torrentDownloaded');
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
				$('#request_'+id+' .lasttd .ka-grey').replaceWith('<img class="inlineindicator" src="https://kastatic.com/images/indicator.gif" alt="..." />');
			}else{
				$('#request_'+id+' .lasttd .ka-red').replaceWith('<img class="inlineindicator" src="https://kastatic.com/images/indicator.gif" alt="..." />');
			}
			$('#request_'+id+' .lasttd').find(':not(img)').addClass('torrentDownloaded');
		},success: function() {
			$('#request_'+id).fadeOut(150);
		},error: function() {
			alert('An error occurred :(');
		}
	});
}