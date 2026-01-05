// ==UserScript==
// @name        Skyforge Wikia - Bubble help on skill (Abilities and Talents)
// @namespace   hideonScript
// @author      Tegomass
// @description Add a bubble help when you mouseover a skill name (Abilities and Talents)
// @include     http://skyforge.wikia.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @version     1.0
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/11627/Skyforge%20Wikia%20-%20Bubble%20help%20on%20skill%20%28Abilities%20and%20Talents%29.user.js
// @updateURL https://update.greasyfork.org/scripts/11627/Skyforge%20Wikia%20-%20Bubble%20help%20on%20skill%20%28Abilities%20and%20Talents%29.meta.js
// ==/UserScript==

GM_addStyle('#WikiaArticle{overflow: visible !important;}\
	.tego_box{display:none;}\
	a[title]:hover .tego_box{ display:inline; position:absolute; z-index: 9999}');

$(function() { //shortcut link
	if (!$('table.lighttable.zebra').length) {
		return false;
	}
	$('table.lighttable.zebra').each(function(index, el) {
		$('a[title]', this).one('mouseover', function(e) {
			get_skill_info($(this).attr('href'), $(this));
		});
	});

	function get_skill_info(url, self) {
		$.get(url, function(data) {
			var item = $('aside.portable-infobox', data);
			item.addClass('tego_box');
			self.append(item);
		});
	}
});