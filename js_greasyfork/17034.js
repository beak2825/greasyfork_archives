// ==UserScript==
// @name        Select extender
// @description:en  Extends SoloTodo admin forms
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1/js/select2.full.min.js
// @namespace   http://userscripts.org/users/311633
// @include     http://www.solonotebooks.net/admin/*
// @include     http://www.solohardware.net/admin/*
// @include     http://www.soloelectro.net/admin/*
// @include     http://www.solosmartphones.net/admin/*
// @version     1.2
// @grant       none
// @description Extends SoloTodo admin forms
// @downloadURL https://update.greasyfork.org/scripts/17034/Select%20extender.user.js
// @updateURL https://update.greasyfork.org/scripts/17034/Select%20extender.meta.js
// ==/UserScript==

$("head").append (
    '<link '
  + 'href="http://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1/css/select2.min.css" '
  + 'rel="stylesheet" type="text/css">'
);

$('select[multiple=multiple]').attr('size', 10);

function update_selected_choices(select) {
	var selected_options = $(select).find('option:selected');
	
	var selected_texts = [];
	selected_options.each(function() {
		selected_texts.push($(this).text());
	});
	
	var final_text = selected_texts.join(', ');
	
	$(select).parent().find('.selected_choices').html(final_text);
}

$('select[multiple=multiple]').change(function() {
	update_selected_choices(this);
});

$('select[multiple=multiple]').each(function() {
	$('<span style="margin-left: 10px;" class="selected_choices"></span>').insertAfter($(this).parent().find('a'));
	update_selected_choices(this);
});

var input_ids = ['id_processor', 'id_dedicated_video_card'];

$.each(input_ids, function(idx, value) {
    var container = $('#' + value);
    container.select2();
});