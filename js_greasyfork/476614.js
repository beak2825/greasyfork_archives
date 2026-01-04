// ==UserScript==
// @name         Auto expand channel list and Open channel showing video view
// @namespace    https://greasyfork.org/en/users/254603-shurtmato
// @version      1.0.0
// @description  Auto expand the channel list after 3 seconds and change to channel video tab after entering a channel
// @author       Shurtmato
// @match        https://www.youtube.com/*
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476614/Auto%20expand%20channel%20list%20and%20Open%20channel%20showing%20video%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/476614/Auto%20expand%20channel%20list%20and%20Open%20channel%20showing%20video%20view.meta.js
// ==/UserScript==
/* global $ */
/* global jQuery */
$( document ).ready(function() {
    setTimeout( function(){
        $("#expander-item").click();
        $('#sections a').click(function( event ){
            setTimeout( function(){
                $(".ytd-guide-collapsible-entry-renderer").eq(0).click();
                const videoTab = $('yt-tab-shape[tab-title]').filter(function() {
                    const title = $(this).attr('tab-title').toLowerCase();
                    return title === 'videos' || title === 'vídeos' || title === 'vidéos' || title === 'video';
                });

                if (videoTab.length > 0) {
                    if (videoTab.attr('aria-selected') !== 'true') {
                        videoTab[0].click();
                    }
                }
            }, 1000);
        });
    }, 3000);
});