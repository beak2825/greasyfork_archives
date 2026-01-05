// ==UserScript==
// @name         poe.trade blacklist
// @namespace    http://porath.org/
// @version      0.15
// @description  blacklist users on poe.trade
// @author       arc
// @match        http://poe.trade/search/*
// @match        http://currency.poe.trade/search*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/17933/poetrade%20blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/17933/poetrade%20blacklist.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// user settings - change the url contents of this variable to any mp3 to change the notification sound, or comment out lines 18-21 if you want the original sound

var notification = 'http://porath.org/a/mynotification2.mp3';

$('#live-audio > source').attr('src', notification);
$('#live-audio').load();

// replace the notification checkboxes with my own so i can take control of the notifications

$('#live-notify-sound').prop('id', 'live-notify-sound-blacklist');
$('#live-notify-sound-blacklist').prop('onclick', null).off('click');
$('#live-notify-browser').prop('id', 'live-notify-browser-blacklist');
$('#live-notify-browser-blacklist').prop('onclick', null).off('click');

$('#live-notification-settings > a').prop('onclick', null).off('click');

var audioNotify = GM_getValue('audioNotify') || false;
var browserNotify = GM_getValue('browserNotify') || false;

if (audioNotify) {
    $('#live-notify-sound-blacklist').prop('checked', true);
}

if (browserNotify) {
    $('#live-notify-browser-blacklist').prop('checked', true);
}

$('#live-notification-settings > a').on('click', function () {
    live_notify_blacklist();
});

$('#live-notify-sound-blacklist').on('click', function () {
    if ($(this).prop('checked')) {
        GM_setValue('audioNotify', true);
    }
    else {
        GM_setValue('audioNotify', false);
    }
});

$('#live-notify-browser-blacklist').on('click', function () {
    if ($(this).prop('checked')) {
        GM_setValue('browserNotify', true);
    }
    else {
        GM_setValue('browserNotify', false);
    }
});

function live_notify_blacklist() {
    if ($('#live-notify-sound-blacklist').is(':checked')) {
        $("#live-audio").trigger("play");
    }
    if ($('#live-notify-browser-blacklist').is(':checked')) {
        if (!("Notification" in window))
            return;
        Notification.requestPermission(function(result) {
            if (result === 'denied' || result == 'default') {
                return;
            }
            new Notification("A new item matching your search is available.");
        });
    }
}

// add a checkbox to toggle the visibility of blacklisted items

var blacklistVisibilityCheckbox = $('<input />').attr('type', 'checkbox').attr('name', 'blacklist-visibility').attr('id', 'blacklist-visibility');
var blacklistVisibilitySpan = $('<span />').addClass('right').css('margin-right', '0.5em').text('Hide BL items: ').append(blacklistVisibilityCheckbox);
$('.protip').append(blacklistVisibilitySpan);

var blacklistVisibility = GM_getValue('blacklistVisibility') || false;

if (blacklistVisibility) {
    $('#blacklist-visibility').prop('checked', true);
}

$('#blacklist-visibility').on('click', function () {
    if ($(this).prop('checked')) {
        GM_setValue('blacklistVisibility', true);
    }
    else {
        GM_setValue('blacklistVisibility', false);
    }
    
    toggleVisibility();
});

// create an element to show that an item has been hidden

var hiddenDiv = $('<div />').addClass('alert-box').css('margin-bottom', '0px').text('Blacklisted item hidden');
var hiddenTd = $('<td />').attr('colspan', '16').append(hiddenDiv);
var hiddenTr = $('<tr />').addClass('hidden-row').append(hiddenTd);

// add links to each item to blacklist the user

var blacklistLink = $('<a />').addClass('blacklistLink').text('Blacklist');
var blacklistLi = $('<li />').append(blacklistLink);

var blacklistLabel = $('<span />').addClass('alert').addClass('label').addClass('blacklistLabel').text('blacklisted');

function addBlacklistLink() {
    if ($('.whisper-btn').length > 0) {
        $('.whisper-btn').closest('.proplist').each( function () {
            if ($(this).find('.blacklistLink').length == 0) {
                $(this).append(blacklistLi.clone());
                $(this).closest('.item').append(hiddenTr.clone());
            }
        });
    }
    else {
        $('.displayoffer-bottom').find('.right').each( function () {
            if ($(this).find('.blacklistLink').length == 0) {
                $(this).append(blacklistLink.clone());
                $('.blacklistLink').css('margin-left', '5px');
                $(this).closest('.item').append(hiddenTr.clone());
            }
        });
    }
    
    toggleVisibility();
}

addBlacklistLink();

// add link to clear the blacklist

var blClearLink = $('<a />').addClass('blacklistClearLink').text('Clear');
var blClearSpan = $('<span />').addClass('right').css('margin-right', '0.5em').text('Blacklist: ').append(blClearLink);
$('.protip').append(blClearSpan);

// if it exists, retrieve the existing blacklist

var blacklisted = GM_getValue('blacklisted') || '';
var blacklistArray = [];

if (blacklisted.length > 0) {
    blacklistArray = blacklisted.split(';');
}

// listener for clicking the blacklist link - adds seller to blacklist, adds blacklist labels to any items from seller

$(document).on('click', '.blacklistLink', function (e) {
    e.preventDefault();
    
    if ($('.item').length > 0) {
        var item = $(e.target).closest('.item');

        blacklistArray.push(item.data('seller'));
    }
    else {
        var item = $(e.target).closest('.displayoffer');

        blacklistArray.push(item.data('username'));
    }
    
    blacklisted = blacklistArray.join(';');
    
    addBlacklistLabel();
    
    GM_setValue('blacklisted', blacklisted);
});

// obviously, clicking clear removes all blacklisted sellers from the blacklist

$('.blacklistClearLink').on('click', function (e) {
    e.preventDefault();
    
    clearList();
});

// run these functions when the live search updates

$(document).on('ajaxSuccess', function () {
    addBlacklistLabel();
    addBlacklistLink();
    toggleVisibility();
    
    var items = $('.item').not('.old');
    
    if (items.length > 0 && items.find('.blacklistLabel').length == 0) {
        live_notify_blacklist();
    }
    
    $('.item').not('.old').addClass('old');
});

function addBlacklistLabel () {
    if ($('.whisper-btn').length > 0) {
        $('.whisper-btn').closest('.proplist').each( function () {
            var elem = $(this);
            var item = elem.closest('.item');

            if ($.inArray(item.data('seller'), blacklistArray) > -1 && item.find('.blacklistLabel').length < 1) {
                elem.prepend(blacklistLabel.clone());
                item.addClass('blacklisted');
            }
        });
    }
    else {
        $('.displayoffer-bottom').each( function () {
            var elem = $(this);
            var item = elem.closest('.displayoffer');

            if ($.inArray(item.data('username'), blacklistArray) > -1 && item.find('.blacklistLabel').length < 1) {
                elem.prepend(blacklistLabel.clone());
                item.addClass('blacklisted');
            }
        });
    }
    
    toggleVisibility();
}

function toggleVisibility () {
    $('.item > .hidden-row').hide();
    
    if ($('#blacklist-visibility').is(':checked')) {
        $('.blacklisted > .first-line').hide();
        $('.blacklisted > .bottom-row').hide();
        $('.blacklisted > .hidden-row').show();
    }
    else {
        $('.item > .first-line').show();
        $('.item > .bottom-row').show();
        $('.item > .hidden-row').hide();
    }
}

function clearList () {
    var keys = GM_listValues();
    
    for (var i=0, key=null; key=keys[i]; i++) {
        GM_deleteValue(key);
    }
    
    blacklistArray = [];
    $('.blacklistLabel').remove();
}

addBlacklistLabel();