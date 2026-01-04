// ==UserScript==
// @name         L_PGNET_CLEANING
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  LinkedIn - Perpetually Growing NETwork - Cleaning old invitations
// @author       TH
// @include      https://www.linkedin.com/mynetwork/invitation-manager/sent/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/367959/L_PGNET_CLEANING.user.js
// @updateURL https://update.greasyfork.org/scripts/367959/L_PGNET_CLEANING.meta.js
// ==/UserScript==

let prefix = 'L_PGNET_CLEANING > ';
let timeAgoFilter = /(\d+) minute.?|(\d+) heure.?|(\d+) jour.?/i;
let running = false;

jQuery( document ).ready(function( $ ) {
    $.noConflict();

    let clean_start_button = $('<button id="clean-start" class="pgnet-btn feed-follows-module-recommendation__follow-btn button-secondary-small-muted ml2 follow ember-view"><span class="">☕ ►</span> Start CLEANING</button>').appendTo('.application-outlet');
    clean_start_button.css('position','fixed')
    clean_start_button.css('top','150px')
    clean_start_button.css('left','10px')
    clean_start_button.css('width', '200px')

    clean_start_button.click(function(e){
        console.log(prefix+ 'Ask for a sweep')
        if(running){
            return false;
        }
        console.log(prefix+ 'Cool down starts')
        $('#clean-start').prop('disabled', true)
        running = true;
        setTimeout(removeFilterUsers,1000)
    })

    function removeFilterUsers(){
        console.log(prefix + 'Removing old invitations')
        let total = $('.invitation-card').length
        let i = 0
        let j = 0
        setTimeout(function(){
            console.log(prefix+ 'Cool down ends')
            running = false;
            $('#clean-start').prop('disabled', false)
        },total*100+2000)
        $('.invitation-card').each(function(invitation){
            i++
            let invitationSince = $(this).find('.time-badge.time-ago').text().toLowerCase()
            let invitationWithdraw = $(this).find('button[data-control-name="withdraw_single"]')
            let timeExtract = timeAgoFilter.exec(invitationSince);
            if(parseInt(timeExtract[2])>9){
                j++
                setTimeout(function(){
                    console.log(prefix+ 'Removing user')
                    invitationWithdraw.click()
                },i*100)
            }
            if(parseInt(timeExtract[3])>=1){
                j++
                setTimeout(function(){
                    console.log(prefix+ 'Removing user')
                    invitationWithdraw.click()
                },i*100)
            }
        })
        console.log(prefix+ 'Removed users:',j)
    }

    (function() {
        'use strict';


    })();

});