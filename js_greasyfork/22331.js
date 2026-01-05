// ==UserScript==
// @name         _sentient
// @namespace    http://kadauchi.com/
// @version      1.0.2
// @description  blank
// @author       Kadauchi
// @icon         http://kadauchi.com/avatar4.jpg
// @include      /^https://(www|s3)\.(mturkcontent|amazonaws)\.com/
// @grant        GM_log
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @hitname      Shoe Similarity
// @hitsave      https://www.mturkcontent.com/dynamic/hit?hitId=3ROUCZ907FCN98O7HFX6NU58XIZOO3
// @downloadURL https://update.greasyfork.org/scripts/22331/_sentient.user.js
// @updateURL https://update.greasyfork.org/scripts/22331/_sentient.meta.js
// ==/UserScript==

if ($('#task6_checkbox10').length) { _sentient(); }

function _sentient () {

	var index = 0;

	var $target = $('.target-div');
	var $shoes  = $('table');

	function _next () {
		$target.hide();
		$shoes.hide();

		index ++;

		$target.eq(index).show();
		$shoes.eq(index).show();

		$('.tab').css({'backgroundColor': ''}).eq(index).css({'backgroundColor': 'lightgreen'});
	}

	function _switch (value) {
		$target.hide(); $shoes.hide();

		index = Number(value);

		$target.eq(index).show();
		$shoes.eq(index).show();

		$('.tab').css({'backgroundColor': ''}).eq(index).css({'backgroundColor': 'lightgreen'});
	}

	var tabs = '<div>';
	for (var i = 0; i < $target.length; i ++) { tabs += '<button class="tab" type="button" data-value="' + i + '">Shoes ' + (i+1) +'</button>'; }
	tabs += '</div>';

	$('.panel.panel-primary').after(tabs);


	$('.tab').click(function () {
		_switch($(this).data('value'));
	});

	$(':radio').change(function () {
		_next();
	});

	$('img').css({'width': '150px', 'height': '150px'});
	$target.hide();
	$shoes.hide();
	$target.eq(index).show();
	$shoes.eq(index).show();
	$('.tab').eq(index).css({'backgroundColor': 'lightgreen'});
}