// ==UserScript==
// @name         Novel Updates & Instapaper
// @namespace    TFDF
// @version      0.000.000.000.1
// @description  Companion for Novel Updates and Instapaper
// @author       TFernandes
//
// @match        https://www.instapaper.com/text?u=*
// @match        http://www.novelupdates.com/reading-list/
// @match        http://www.novelupdates.com/reading-list/?list=*
//
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.22.1/js/jquery.tablesorter.min.js
//
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
//
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25430/Novel%20Updates%20%20Instapaper.user.js
// @updateURL https://update.greasyfork.org/scripts/25430/Novel%20Updates%20%20Instapaper.meta.js
// ==/UserScript==


// User Variables Definition
var words_per_min  = 240;
var text_width_per = 65;  // % of window width
var text_size_per  = 3.8; // % of window height


/* DO NOT CHANGE */
// Variables Definition
var win_url      = window.location.href;
var alpha        = 1; // focus var
var text_pad_per = (100 - text_width_per)/2;
var win_height   = $(window).height();
var win_width    = $(window).width();
var word_count   = countWords( $('#story').text() );
var exp_time     = word_count/words_per_min; // Expected Reading time in min
var t            = 0; // Current Reading Time in seconds
var pos          = 1;
var progress_bar_width  = (text_width_per/100)*(15/100)*win_width;
var progress_bar_height = '25px';
var star_1 = '<i class="fa fa-star"></i>';
var star_0 = '<i class="fa fa-star-o"></i>';
var table_width = $('.tablesorter').width();
// functions
function bold_text(text) {return '<b>' + text + '</b>';}
function countWords(str){return str.replace(/(^\s*)|(\s*$)/gi, '').replace(/[ ]{2,}/gi, ' ').replace(/\n /, '\n').split(' ').length;}

if (win_url.match(/novelupdates\.com\/reading-list\/(\?list=.*)?/gi) !== null) {

	// Change Background of Novels with no new chapter
	$('.rl_links').each(function(){
		if ($(this).find('#bmicon').length === 0) {
			$(this).css('background-color', '#ffe3bb');
		}
	});

	// Add new table column
	$('.tablesorter thead tr').append($('<th>').attr('class', 'header read').text('My vote'));
	$('.rl_links').each(function() {
		var $this = $(this);

		// Change width
		$this.find('td').css('vertical-align', 'middle');
		$this.find('td').eq(0).attr('width', table_width*(5/100)  + 'px'); // Buttom
		$this.find('td').eq(1).attr('width', table_width*(65/100) + 'px'); // Series
		$this.find('td').eq(2).attr('width', table_width*(15/100) + 'px'); // My Status
		$this.find('td').eq(3).attr('width', table_width*(20/100) + 'px'); // Latest Release
		$this.append($('<td>').attr('width', '90px').attr('id', 'upvote')); // My Vote

		// Download Upvote Data
		var novel_url = $(this).find('td:eq(1) a').attr('href');
		var page = $('<div>').load(novel_url + ' .submitrate', function() {
			var upvote = page.find('.uvotes').text();
			if (upvote.match(/click/gi) === null) {
				upvote = upvote.match(/\d/gi)[0];
				if (upvote=='1') {upvote = star_1 + star_0 + star_0 + star_0 + star_0;}
				if (upvote=='2') {upvote = star_1 + star_1 + star_0 + star_0 + star_0;}
				if (upvote=='3') {upvote = star_1 + star_1 + star_1 + star_0 + star_0;}
				if (upvote=='4') {upvote = star_1 + star_1 + star_1 + star_1 + star_0;}
				if (upvote=='5') {upvote = star_1 + star_1 + star_1 + star_1 + star_1;}
			} else {
				upvote = star_0 + star_0 + star_0 + star_0 + star_0;
			}
			$this.find('#upvote').html(upvote);
		});
	});

	$('.tablesorter').tablesorter();
}

// If instapaper page
if (win_url.match(/instapaper.com\/text\?u=.*/gi) !== null) {

	// CSS change
	$('.container, .container-fluid').css( {'padding-left' : '0px', 'padding-right' : '0px'} );
	$('.container, .container-fluid').css( {'margin-left' : (text_pad_per/100)*win_width + 'px', 'margin-right' : (text_pad_per/100)*win_width + 'px'} );
	$('.story div, .container-fluid').css( {'width' : (text_width_per/100)*win_width + 'px', 'max-width' : (text_width_per/100)*win_width + 'px'} );
	$('.story div').css( {'text-align' : 'justify', 'font-size' : (text_size_per/100)*win_height + 'px', 'line-height' : '2.0em'} );

	// get Max Scroll Value; need to be done after CSS...
	$(window).scrollTop(99999999999);
	var scroll_max = $(window).scrollTop();
	$(window).scrollTop(0);

	// Change URLs to instapaper
	$('#story a').each(function() {
		var url = $(this).attr('href');
		url = 'https://www.instapaper.com/text?u=' + encodeURIComponent(url);
		$(this).attr('href', url);
	});

	// Detect Focus change
	$(window).focus(function() {alpha = 1;});
	$(window).blur(function() {alpha = 0;});

	// Create new elements to display in the header
	$('aside.logo')
		.after( $('<div class=progress>').append('<div class=progress-bar>').append('<div class=progress-bar-text>'))
		.after( $('<div class=curr-time>') )
		.after( $('<div class=exp-time>') )
		.after( $('<div class=word-count>') );

	// Reading Time and Word Count
	$('.word-count').html('Word Count: ' + bold_text(word_count));
	$('.exp-time').html('Expected Reading Time: ' + bold_text(Math.floor(exp_time) + 'min ' + Math.round((exp_time - Math.floor(exp_time))*60) + 's'));
	$('.word-count, .exp-time, .curr-time').css( {'font-size' : '.875rem', 'text-align' : 'right', 'color' : '#797979'} );
	// Progress Bar
	$('.progress, .progress-bar').css( {'width' : progress_bar_width + 'px', 'height' : progress_bar_height, 'background-color' : 'grey', 'position' : 'absolute', 'left' : (text_width_per/100)*win_width/2-progress_bar_width/2 + 'px'} ); // FIX
	$('.progress-bar').css( {'background-color' : 'green', 'left' : '0px'} );
	$('.progress-bar-text')
		.css( {'position' : 'absolute', 'width' : progress_bar_width + 'px', 'height' : progress_bar_height, 'font-size' : '1.0rem', 'left' : '5px', 'vertical-align' : 'middle', 'line-height' : '30px'} )
		.text('1%');

	// Reading Time
	function updateTime() {
		t = t + alpha;
		$('.curr-time').html('Current Reading Time: ' + bold_text(Math.floor(t/60) + 'min ' + Math.round(t - Math.floor(t/60)*60) + 's') + ' - ' + bold_text(Math.floor((progress_bar_width/(pos+1)*t)/60) + 'min ' + Math.round((progress_bar_width/(pos+1)*t) - Math.floor((progress_bar_width/(pos+1)*t)/60)*60) + 's'));
		setTimeout(updateTime, 1000);
	}
	updateTime();

	// Progress Bar
	function updateBar() {
		$('#control_bar').addClass('reveal');
		pos = Math.round($(window).scrollTop()/scroll_max * progress_bar_width);
		$('.progress-bar').css('width', pos + 'px');
		$('.progress-bar-text').text(Math.round(100*pos/progress_bar_width) + '%');
		setTimeout(updateBar, 100);
	}
	updateBar();
}