// ==UserScript==
// @name         m.blogtruyen fix viewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://m.blogtruyen.vn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408968/mblogtruyen%20fix%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/408968/mblogtruyen%20fix%20viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('#mbtfloat').remove();
    $('center').remove();
    $('.qc-inner-move').remove();
    $('.qc-inner').remove();
    $('.qc_M_Chap_Middle').remove();

    $('.widget-forum-comment li.item').css('height', '20px');
    $('.widget-forum-comment div.row img').css({
        'height': '15px',
        'width': '15px',
        'max-width': '15px',
        'max-height': '15px',
        'margin-bottom' : '3px'
    });
    $('.widget-forum-comment div.row div.col-sm-1').css('width', '20px');
    $('.widget-forum-comment div.row div.col-sm-2').css({
        'float': 'right',
        'font-size': '90'
    });
    $('.widget-forum-comment div.row div.col-sm-9 a').css({
        'font-size': '90%',
        'display': 'block',
        'overflow': 'overlay',
        'height': '19.73px'
    });




    setTimeout(function(){
        $('.navbar-nav a').css({
            'height': '25px',
            'padding': '6px 15px',
            'font-size': '90%'
        });
        $('.navbar-nav a').hover(function() {
            $(this).css('color', '#ffffb3');
        }, function() {
            $(this).css('color', '#fff');
        });
    }, 1000);

//menu_bar_nav m.blogtruyen
$(document).ready(function() {
	$('.navbar').css('min-height', '0px');
	$('.headerNav').height(25);
	$('.navbar-header, .text-search').css({
		'margin': '1.2px auto 5px 15px',
		'height': '20px',
		'font-size': '87%'
	});
	$('.navbar-toggle').css({
	    'height': '20px',
	    'width': '32px',
	    'margin': '1.5px 35px 2px 0px',
	    'padding': '2px 4.2px',
	    'z-index': '1'
	});
	$('.icon-bar').width(23);
	$('.icon-bar').height('0.8px');
	$('.navbar-nav a').css({
		'height': '25px',
		'padding': '6px 15px',
		'font-size': '90%'
	});
	$('.navbar-nav a').hover(function() {
		$(this).css('color', '#ffffb3');
	}, function() {
		$(this).css('color', '#fff');
	});

});

//set form
$('.navbar-header form').css('position', 'relative');

//insert search icon
var search_bt = document.createElement('div');
search_bt.style = "background: none; height: 20px; width: 27px; position: absolute; top: 2px; right: 74px; cursor: pointer; text-align: center";
search_bt.id = 'search_submit_bt';
$('.navbar-header form').append(search_bt);
$('#search_submit_bt').click(function(event) {
	$(this).parent().submit();
});
$('.navbar-header form .text-search').removeClass('icon-search');
$('#search_submit_bt').html("<img src='https://image.flaticon.com/icons/svg/122/122932.svg' width='60%'>");

//insert home icon
var home_bt = document.createElement('div');
home_bt.style = "background: none; height: 20px; width: 20px; position: absolute; top: 1px; left: -10px; cursor: pointer; text-align: center";
home_bt.id = 'home_bt';
$('.navbar-header form').append(home_bt);
$('#home_bt').click(function(event) {
	$(location).attr('href', 'https://m.blogtruyen.com');
});
$('#home_bt').html("<img src='https://image.flaticon.com/icons/svg/941/941554.svg' width='90%'>");



// return manga page
//
// button next 2 chap
var next_2_chapter = $('option[selected]:eq(0)').prev().prev().val();

if(next_2_chapter !== undefined){
	createButtonNextChap('Next 2 chap >>', next_2_chapter);

} else if ($('option[selected]:eq(0)').prev().val() !== undefined) {
	createButtonNextChap('...1 left !>', '#');
	$('#next_2_icon_bt').click(function(event) {
		event.preventDefault();
	});

} else {
	createButtonNextChap('Last chapter!', '#');
	$('#next_2_icon_bt').click(function(event) {
		event.preventDefault();
	});
}

function createButtonNextChap (text, newHref) {
	var next_2_icon = document.createElement('a');

	next_2_icon.href = newHref;
	next_2_icon.style = "background: #6666ff; height: 33.73px; width: 107px; position: absolute; top: 0px; right: 5px; cursor: pointer; text-align: center; border: 1px solid transparent; border-radius: 4px; font-size: 13px; line-height: 31px; color: #f2f2f2";
	next_2_icon.id = 'next_2_icon_bt';
	$('.linkchapter:eq(1) .row .col-xs-6').append(next_2_icon);
	$('#next_2_icon_bt').text(text);
	$('#next_2_icon_bt').hover(function() {
		$(this).css({
			'color': '#fff',
			'background': '#5c00e6'
		});
	}, function() {
		$(this).css({
			'color': '#f2f2f2',
			'background': '#6666ff'
		});
	});
}



























})();