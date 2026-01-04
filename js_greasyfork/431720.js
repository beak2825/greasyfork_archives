// ==UserScript==
// @name         Make Trello Great Again
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Trello design tweaks
// @author       You
// @match        https://trello.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431720/Make%20Trello%20Great%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/431720/Make%20Trello%20Great%20Again.meta.js
// ==/UserScript==

function make_trello_great_again() {
    $('body, button, html, input, select, textarea').css({'font-family': 'Arial'});
    $('.list-card-title').css({'font-size': '13px'});

    // Wider card detail
    $('.window').css({'width': '1000px'});
    $('.window-main-col').css({'width': '730px'});
    $('.window-sidebar').css({'width': '170px'});

    // Card spacing
    $('.list-card').css({'margin-bottom': '4px'});
    $('.badges').css({'margin-bottom': '-7px'});

    // Rotate bell
    //$('.badge.is-unread-notification .badge-icon, .header-btn-icon.icon-notification').css({'transform': 'rotate(-45deg)'});

    // Make label smaller
    $('.list-card .card-label').css({'height': '4px'});

    // Make smaller avatars in cards
    $('.list-card-members').find('.member, .member-avatar').css({'height': '20px', 'width': '20px'});

    // Remove "X" button while editing card description
    $('.edit-controls .cancel').remove();

    // Remove "Power-Ups" buttons in card detail
    $('.js-plugin-buttons').remove();

    // Checked checklist items
    $('.checklist-item.checklist-item-state-complete').css({'background': '#ccffd7'});
    $('.checklist-item.checklist-item-state-complete .checklist-item-details-text').css({ 'text-decoration': 'none' });

    $('a[href*="merge_requests"]').each((i, el) => {
        let link = $(el).css({
           'font-size': '18px',
           'font-weight': 'bold',
        });
    });
}


make_trello_great_again();
setInterval(make_trello_great_again, 400);