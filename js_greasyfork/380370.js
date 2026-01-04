// ==UserScript==
// @name         Youtube thumbnails blocker
// @namespace    http://rastman.y0.pl
// @version      0.1
// @description  Extension blures thumbnails of videos which are uploaded by unknown users (it doesn't blur those from subscribed channels)
// @author       Shiffer
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/feed/subscriptions*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380370/Youtube%20thumbnails%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/380370/Youtube%20thumbnails%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let temp = 0;
    $('document').ready(function(){
        $('head').append('<style id="yttbhd">#guide{display:none!important}</style><style id="blur">ytd-thumbnail,ytd-playlist-thumbnail{filter: blur(7px);}</style>')
        let waitForMenu = setInterval(function(){
            if($('#guide-icon').length){
                clearInterval(waitForMenu);
                $('#guide-icon').click();


                let waitForSubs = setInterval(function(){
                    if($('ytd-guide-section-renderer:eq(1) #items ytd-guide-entry-renderer').length){
                        if($('ytd-guide-section-renderer:eq(1) #items ytd-guide-collapsible-entry-renderer').length){
                            $('ytd-guide-section-renderer:eq(1) #items ytd-guide-collapsible-entry-renderer #expander-item').click();
                            $('ytd-guide-section-renderer:eq(1) #items #collapser-item').click();
                        }

                        $('#guide-icon').click();
                        $('#yttbhd').remove();


                        clearInterval(waitForSubs);
                        const subscriptions = [];
                        // get list of subscriptions
                        $('ytd-guide-section-renderer:eq(1) #items ytd-guide-entry-renderer').each(function(){
                            subscriptions.push($.trim($(this).find('span').text()));
                        });

                        console.log(subscriptions);
                        let isChannel = ((window.location.pathname).split('/'))[1];
                        if(isChannel == "channel"){
                            if($.inArray($('#channel-title').text(),subscriptions) != '-1'){
                               $('#blur').remove();
                            }
                        }
                        else {
                            setInterval(function(){
                                if($('ytd-compact-video-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-playlist-video-renderer').length != temp){
                                    temp = $('ytd-compact-video-renderer, ytd-video-renderer, ytd-grid-video-renderer').length;

                                    $('ytd-compact-video-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-playlist-video-renderer').each(function(){
                                        $(this).attr('checked-byshiffer','1');
                                        //console.log($(this).find('#byline').attr('title'));
                                        if($.inArray($(this).find('#byline').attr('title'),subscriptions) != '-1'){
                                            $(this).find('ytd-thumbnail').css('filter','blur(0px)');
                                        }
                                    });
                                };
                            },100);
                        }

                    }
                }, 100);
            }
        },100);
    });
})();