// ==UserScript==
// @name        CRM Selectable Comments
// @description Fixes a bug of Firefox, related to the inability to select other people's comments text (for copying).
// @author Itr@nsiti0n_CRM | itransition.com
// @include     https://crm.itransition.com/*
// @include     https://crm/Itransition/*
// @version     1.0.1
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require https://greasyfork.org/scripts/26454-jquery-cookie/code/jQuery%20Cookie.user.js
// @icon        https://crm.itransition.com/favicon.ico
// @grant       none
// @namespace https://greasyfork.org/en/users/179451
// @downloadURL https://update.greasyfork.org/scripts/40500/CRM%20Selectable%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/40500/CRM%20Selectable%20Comments.meta.js
// ==/UserScript==

$(document).ready(function(){
	enable();
	$('#tdAreas').scroll(enable);
	// $('#editorButtonMTX').click(function(){
		// $(this).remove()
		// $('body').attr('contenteditable','true')
	// })
});

function enable() {
    $('#content_notescontrol').find('input:disabled, textarea:disabled').each(function () {
		$(this).removeProp('disabled');
		$(this).prop('readonly', true);
	});
}
//