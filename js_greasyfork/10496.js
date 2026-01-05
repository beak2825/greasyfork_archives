// ==UserScript==
// @name        AO3: Wrangling home filter
// @description Show only fandoms with unwrangled/unfilterable tags.
// @namespace	https://greasyfork.org/en/scripts/10496-ao3-wrangling-home-filter
// @author	Min
// @version	1.1.2
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @include     *archiveofourown.org/tag_wranglers/*
// @downloadURL https://update.greasyfork.org/scripts/10496/AO3%3A%20Wrangling%20home%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/10496/AO3%3A%20Wrangling%20home%20filter.meta.js
// ==/UserScript==


(function($) {
	
	// check if the fandoms have unfilterable and unwrangled tags
	$('div.tag_wranglers-show.dashboard #user-page table tbody tr').each(function() {
		
		var tag_counters = $(this).find('td');
		
		if (tag_counters.slice(0,3).text() == '   ') {
			$(this).addClass('no-unfilterable');
		}
		
		if (tag_counters.slice(3,6).text() == '   ') {
			$(this).addClass('no-unwrangled');
		}
	});
	
	addToggle();
	
	var style = $('<style type="text/css"></style>').appendTo($('head'));
	
	// add toggle menu above the table
	function addToggle() {
		
		var toggle_p = $('<p></p>').html('Show only fandoms with:&nbsp;&nbsp;');
		
		var only_unwrangled = $('<a></a>').html('[ unwrangled tags ]');
		only_unwrangled.click(function() {
			addCss(1);
			toggle_p.find('a').css('font-weight', 'normal');
			$(this).css('font-weight', 'bold');
		});
		
		var unfilterable_unwrangled = $('<a></a>').html('[ unfilterable or unwrangled tags ]');
		unfilterable_unwrangled.click(function() {
			addCss(2);
			toggle_p.find('a').css('font-weight', 'normal');
			$(this).css('font-weight', 'bold');
		});
		
		var all_fandoms = $('<a style="font-weight: bold"></a>').html('[ all fandoms ]');
		all_fandoms.click(function() {
			addCss(3);
			toggle_p.find('a').css('font-weight', 'normal');
			$(this).css('font-weight', 'bold');
		});
		
		toggle_p.append(only_unwrangled, '&nbsp;&nbsp;', unfilterable_unwrangled, '&nbsp;&nbsp;', all_fandoms);
		
		$('#user-page table').before(toggle_p);
	}

	// add css rules to page head; 1 - unwrangled, 2 - unfilterable or unwrangled, 3 - all fandoms
	function addCss(option) {
		var css_unwrangled = '.no-unwrangled {display: none;}';
		var css_unfilterable = '.no-unfilterable.no-unwrangled {display: none;}';
		
		switch (option) {
			case 1:
				style.html(css_unwrangled);
				break;
			case 2:
				style.html(css_unfilterable);
				break;
			default:
				style.html('');
		}
	}
	
})(jQuery);
