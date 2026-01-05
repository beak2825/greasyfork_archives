// ==UserScript==
// @name			Tinychat Optimizer
// @namespace			https://greasyfork.org/users/14254-anyone
// @description			Optimize something ;)
// @include			http://tinychat.com/*
// @version			1.1
// @require			https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @icon			https://pbs.twimg.com/profile_images/618048559137472512/lqVpYWag.png
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/11782/Tinychat%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/11782/Tinychat%20Optimizer.meta.js
// ==/UserScript==

// hide commercial on top
$('body > img').remove();

// hide Premium Buttons
$('[href="http://tinychat.com/payment/upgrade_to_pro/step1"]').remove();
$('[href="http://tinychat.com/payment/promote_a_room/step1"]').remove();

// hide share-bar (facebook, twitter...)
$('#share-bar').remove();

// move counter to Topbar
$( '#live-count' ).insertAfter( $( '#logo' ) );
var count_anyone = document.getElementById('live-count');
count_anyone.style.position = 'relative';
count_anyone.style.display = 'inline-block';
count_anyone.style.width = '100px';
count_anyone.style.height = '35px';
count_anyone.style.margin = '0px 20px 0px';		// oben/unten, links/rechts   -  oben, seiten, unten
count_anyone.style.padding = '8px 0px 0px';

// move info to Topbar
document.getElementById('room_info').classList.remove('name');
$( '#room_info' ).insertAfter( $( '#live-count' ) );
document.getElementById('room_info').id='room_info_anyone';
var info_anyone = document.getElementById('room_info_anyone');
if (info_anyone) {
	info_anyone.style.margin = '0px';
	info_anyone.style.verticalAlign = 'middle';
	info_anyone.style.display = 'inline-block';
	info_anyone.style.color = '#fff';

	$('h1 > small').remove();
	$('#room_info_anyone > h2').remove();
	$('#location').remove();
	$('#website').remove();
}

// hide popularity
var popularity_anyone = document.getElementById('room-popularity-container');
if (popularity_anyone) {
	popularity_anyone.style.display = 'none';
}

// hide unused container
$('#room_header').remove();

// hide right Premiumbanner
var right_anyone = document.getElementById('right_block');
if (right_anyone) {
   right_anyone.style.display = 'none';
}

// set left container to 100%
document.getElementById('left_block').id='left_block_anyone';
var left_anyone = document.getElementById('left_block_anyone');
if (left_anyone) {
	left_anyone.width= '100%';
}

// hide footer
var footer_anyone = document.getElementById('footer');
if (footer_anyone) {
	footer_anyone.style.display = 'none';
}

