// ==UserScript==
// @name           GLB DPC Play Save As New Play
// @namespace      Bogleg
// @version        1.0.1
// @include        https://glb.warriorgeneral.com/game/team_create_defense.pl?team_id=*&play_id=*
// @include        https://glb.warriorgeneral.com/game/team_create_defense.pl?create=*
// @require        https://greasyfork.org/scripts/12092-jquery-javascript-library-v1-4-2/code/jQuery%20JavaScript%20Library%20v142.js?version=71384
// @description Adds a "Save As New" checkbox to GLB Defensive Play Creator
// @downloadURL https://update.greasyfork.org/scripts/467046/GLB%20DPC%20Play%20Save%20As%20New%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/467046/GLB%20DPC%20Play%20Save%20As%20New%20Play.meta.js
// ==/UserScript==

if ($('div.tactic_container:contains(Current Custom Defensive Plays)').length == 0) { // don't work on the play index page

$('input[name=action]').before('<div class="small_head"><input type="checkbox" id="save_as_new_play" /> Save as New Play</div>');
var origPlayId = $('input[name=play_id]').val();
$('#save_as_new_play').change(function() {
	if ($(this).attr('checked')) {
		$('input[name=play_id]').val('');
	} else {
		$('input[name=play_id]').val(origPlayId);
	}
});

} // end if (!isIndex)
