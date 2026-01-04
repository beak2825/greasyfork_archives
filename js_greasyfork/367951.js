// ==UserScript==
// @name         L_PGNET_INVHEL
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  LinkedIn - Perpetually Growing NETwork - Invitation Sending Helper
// @author       TH
// @include      https://www.linkedin.com/search/results/index/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/367951/L_PGNET_INVHEL.user.js
// @updateURL https://update.greasyfork.org/scripts/367951/L_PGNET_INVHEL.meta.js
// ==/UserScript==

let prefix = 'L_PGNET_INVHEL > ';
let cycles = 0;

// ("project manager" OR PM OR PMO OR "chef de projet") AND Carrefour

jQuery( document ).ready(function( $ ) {
    $.noConflict();

    let vinhel_start_button = $('<button class="pgnet-btn feed-follows-module-recommendation__follow-btn button-secondary-small-muted ml2 follow ember-view"><span class="">⌹ ►</span> Start VINHEL</button>').appendTo('.application-outlet');
    vinhel_start_button.css('position','fixed')
    vinhel_start_button.css('bottom','40px')
    vinhel_start_button.css('left','10px')
    vinhel_start_button.css('width', '200px')

    vinhel_start_button.click(function(){
        window.location.reload()
    })

    function scroll() {
        console.log(prefix + 'Scroll')
        $("html, body").animate({
            scrollTop: $(document).height() - $(window).height()
        });
    }

    $(document).on('DOMNodeInserted', function(e) {
        if ( $(e.target).find('.send-invite__actions').length>0 ) {
            $('button.button-primary-large').click();
        }
    });

    function startProcess(){
        cycles++
        if(cycles>5){
            console.log(prefix + 'End of Process')
            return false;
        }
        console.log(prefix + 'Starting cycle',cycles)
        setTimeout(scroll,5000)
        setTimeout(inviteUsers,15000)
    }

    function inviteUsers(){
        console.log(prefix + 'Invite Users')
        let total = $('button.search-result__actions--primary:not(.message-anywhere-button)').length
        console.log(prefix + 'Buttons:', total)
        let i = 0
        setTimeout(function(){
            $('button.next').click()
            console.log(prefix + 'Loading next page')
            let timeBeforeStart = (Math.random()*10000+20000)|0
            console.log(prefix + 'Starting in',timeBeforeStart, 'ms')
            setTimeout(startProcess, timeBeforeStart)
        }, (total+1)*3000+5000)
        $('button.search-result__actions--primary:not(.message-anywhere-button)').each(function(button){
            let $it = $(this)
            let nb = i
            setTimeout(function(){
                console.log(prefix + 'Inviting user:', nb)
                $it.trigger('click')
            }, i*3000+2000)
            i++
        })
    }

    (function() {
        'use strict';
        console.log(prefix + 'Running...')
        let timeBeforeStart = (Math.random()*10000+20000)|0
        console.log(prefix + 'Starting in',timeBeforeStart, 'ms')

        setTimeout(startProcess, timeBeforeStart)

    })();
});