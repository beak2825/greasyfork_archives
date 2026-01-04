// ==UserScript==
// @name        Tinychat Optimizer
// @namespace   http://tinychat.com/
// @version     2.5 BETA
// @author      ๖ۣۜelaw
// @description Adds "Optimize" button next to the tinychat.com logo while in a room. Clicking this button should remove unneeded components and Optimize the room to fit the browser window.
// @include     http://tinychat.com/*
// @include     http://tinychat.com/room/*
// @include     https://tinychat.com/room/*
// @include     https://tinychat.com/*
// @exclude     https://tinychat.com/home
// @exclude     https://tinychat.com/download
// @exclude     https://tinychat.com/settings
// @exclude     https://tinychat.com/login
// @exclude     https://tinychat.com/gifts
// @exclude     /^https?://tinychat.com/.*//
// @match      https://tinychat.com/miya214*
// @copyright  2017+, You
// @namespace https://greasyfork.org/users/153402
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/33372/Tinychat%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/33372/Tinychat%20Optimizer.meta.js
// ==/UserScript==



window.onbeforeunload = function(e) {
    return 'You sure you want to leave us? :(';
};

// Style adding
function addStyle(css)
{
    var style = document.createElement('style');
    style.innerHTML = css;
    style.type='text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
}

// Element removal by id
function removeById(ids)
{
    ids.forEach(function(element) {
        var x = document.getElementById(element);
        if (x)
            x.parentNode.removeChild(x);
    });
}

// Resize to fit the window
function resizeTinyChat(size) { document.getElementById('chat').style.height = ($( document ).height()-size) + "px"; }
function resizeTinyChatMaximized()
{
    resizeTinyChat(0);
}
function resizeTinyChatSmallMode()
{
    resizeTinyChat(42);
}

// First cleanup function
function cleanTinyChat()
{
    // Modify css styles
    addStyle("#left_block { width: 100% ! important;}");
    addStyle("#wrapper { padding-bottom: 0px;}");
    addStyle("#room { padding: 0;}");
    addStyle("#header { margin: 0;}");
    addStyle("#tinychat { padding: 0px; min-height: 0;}");

    // Remove unncecessary elements
    removeById(["website", "room-gift-show", "footer", "tcad_container", "share-bar", "body_footer_ad"]);
    $('[href="https://tinychat.com/payment/upgrade_to_pro/step1"]').remove();
    $('[href="https://tinychat.com/payment/upgrade_to_pro/step2"]').remove();
    $('[href="https://tinychat.com/payment/promote_a_room/step1"]').remove();
    $('[href="https://tinychat.com/gifts"]').remove();
    $('[href="https://tinychat.com/download"]').remove();
    $('.btn-group').remove();
    $('#room_header').remove();

    // Disable Scrollbar
    document.documentElement.style.overflow = 'hidden';	 // Firefox, Chrome
    document.body.scroll = "no";	// IE Only

    // Resize the chat and make sure it resizes to window size
    resizeTinyChatSmallMode();
    window.addEventListener('resize', resizeTinyChatSmallMode, false);
}

// Main cleanup function
function maximizeTinyChat()
{
    // Remove unncecessary elements
    removeById(["header", "right_block", "room_header", "ad_banner", "chat-info", "goods", "category-bar", "left"]);

    // Resize to fit the window
    resizeTinyChatMaximized();
    window.removeEventListener("resize", resizeTinyChatSmallMode, false);
    window.addEventListener('resize', resizeTinyChatMaximized, false);
}

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

// Setup full window button
function addMaximizeButton()
{
    // Add the maximize button right after the logo
    var link = document.createElement('a');
    var div = document.getElementById('navigation');
    link.className = 'button white';
    link.addEventListener('click', maximizeTinyChat, false);
    link.innerHTML = 'Optimize';
    div.appendChild(link);
    $( ".button" ).css("border","0px");
}

// On load stuff here
function init()
{
    // Only work on rooms
    if (!document.getElementById('room'))
        return;

    // Move Info to Top Bar
    $( '#room_info' ).removeClass( 'name' )
        .insertAfter( '#logo' )
        .attr('id', 'room_info_anyone');

    addStyle('#room_info_anyone { margin: 0px; display: inline-block; color: #fff; vertical-align: middle; margin-top: 4px; margin-left: 25px; padding: 0;}');

    $('h1 > small').remove();
    $('#room_info_anyone > h2').remove();
    $('#location').remove();
    // Hide Popularity stuff if exists
    $('room-popularity-container').remove();

    // Execute the rest of the script
    cleanTinyChat();
    addMaximizeButton();
}

// Init Script Now after functions
init();
