// ==UserScript==
// @name        KAT - Achievement Builder
// @namespace   Dr.YeTii
// @description Hmm I wonder
// @include     http*://kat.cr/achievementbuilder/
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16509/KAT%20-%20Achievement%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/16509/KAT%20-%20Achievement%20Builder.meta.js
// ==/UserScript==

var template = '<div class="achievement" style="width: 300px"> <h2>Achievement Unlocked!</h2> <img style="max-width:195px !important;max-height:144px !important;" title="$desc" src="//kastatic.com/images/achMedal_$type.jpg"> <h1><a href="#">$title</a></h1> <div>$award</div></div>';
document.title = 'Achievement Builder';

$('.errorpage').replaceWith('<div id="builder"><div class="objectAttachmentsJs"></div><h2>Achievement Builder</h2><table class="formtable" border="0"> <tbody> <tr> <td><label for="achievement_title">Title</label></td> <td><input id="achievement_title" name="title" value="" size="70" class="textinput longinput" required="required" type="text"></td> </tr> <tr> <td class="valignMiddle"><label for="achievement_description">Description</label></td> <td><textarea id="achievement_description" name="description" cols="50" rows="3" required="required"></textarea></td> </tr> <tr> <td><label for="achievement_type">Type</label></td> <td> <select id="achievement_type" style="width: 534px;" name="type"> <option value="simple">Simple</option> <option value="bronze">Bronze</option> <option value="silver">Silver</option> <option value="gold">Gold</option> <option value="special">Special</option> </select> </td> </tr> <tr> <td class="valignMiddle"><label for="achievement_award">Award</label></td> <td><textarea id="achievement_award" name="award" cols="50" rows="3" required="required"></textarea></td> </tr> <tr> <td><a title="Edit custom achievement badge" id="change_cover" class="smallButton kaButton"><i class="ka ka-edit"></i> badge</a></td> <td><img id="achievement_image"> <a style="display:none;" class="ka ka16 ka-delete ka-red" title="Reset custom badge" id="badge_reset"></a></td> </tr> <tr> <td>&nbsp;</td> <td> <div class="buttonsline"> <a class="siteButton bigButton" id="previewCheevo"><span>preview</span></a> </div> </td> </tr> </tbody></table></div>');
$('#builder').after('<div id="achievementOutput" style="display:none;"></div>');

$('#change_cover').imageSelector({
	select: function(images) {
		$('#badge_reset').show();
		$('#achievement_image').attr('src', images[0].link);
	}
});
$('#badge_reset').click(function() {
	$('#achievement_image').removeAttr('src');
	$(this).hide();
});

$('#previewCheevo').on('click', function() {
	if (!$('#achievement_title').val()||!$('#achievement_description').val()||!$('#achievement_award').val()) {
		alert('Fill out the title/desc/award first'); return false;
	}
	var html = template;
	html = html.replace(/\$desc/g, $('#achievement_description').val().replace(/"/g, '&quot;'));
	html = html.replace(/\$title/g, $('#achievement_title').val());
	if ($('#achievement_image').attr('src') !== undefined)
		html = html.replace(/\/\/kastatic\.com\/images\/achMedal_\$type\.jpg/g, $('#achievement_image').attr('src'));
	html = html.replace(/\$type/g, $('#achievement_type').val());
	html = html.replace(/\$award/g, $('#achievement_award').val());
	$('#achievementOutput').html(html);
	$('<a href="#achievementOutput"></a>').fancybox().click();
});