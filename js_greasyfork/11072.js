// ==UserScript==
// @name        KAT - ACL 8 - Tier One Column Fix
// @namespace   Dr.YeTii
// @description yeah
// @include     *kat.cr/moderator/verify/tier1/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11072/KAT%20-%20ACL%208%20-%20Tier%20One%20Column%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/11072/KAT%20-%20ACL%208%20-%20Tier%20One%20Column%20Fix.meta.js
// ==/UserScript==

$('#status_select').css('width','90px');
$('.data tr.firstr').find('th:eq(3), th:eq(2), th:eq(1)').remove();
$('.data tr:not(.firstr)').each(function() {
	var colName = $(this).find('td:eq(0)').html();
	var colReg = $(this).find('td:eq(1)').html();
	var colEmail = $(this).find('td:eq(2)').html();
	var colSesh = $(this).find('td:eq(3)').html().replace('started', '<br>started').replace('updated', '<br>updated');
	var table = '<table><tr><td>'+colName+'</td></tr><tr><td>'+colReg+'</td></tr><tr><td>'+colEmail+'</td></tr><tr style="width: 220px;"><td>'+colSesh+'</td></tr></table>';
	$(this).find('td:eq(3), td:eq(2), td:eq(1)').remove();
	$(this).find('td:eq(0)').html(table);
});
$('.data [href^="/moderator/listusers/"]').fancybox();