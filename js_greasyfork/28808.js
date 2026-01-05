// ==UserScript==
// @name         DailyRush V5 Message notifications
// @namespace    drNotify
// @version      0.1
// @description  try to take over the world!
// @author       johnnie johansen
// @match        https://www.dailyrush.dk/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.12.3/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28808/DailyRush%20V5%20Message%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/28808/DailyRush%20V5%20Message%20notifications.meta.js
// ==/UserScript==


// http://www.greasespot.net/2012/08/greasemonkey-10-jquery-broken-with.html
this.$ = this.jQuery = jQuery.noConflict(true); // GM/jQ v1.0 quickfix

let userLoggedInSelector = '.td_user_logd_in';

$(document).ready(function(){

    dailyrushNotifications();

    function cl(string){
        console.log(string);
    }

    function dailyrushNotifications()
    {
        let userLoggedIn = $(userLoggedInSelector).attr('href');

        if (!userLoggedIn) return;

        userLoggedIn += "/messages";

        $.get(userLoggedIn, function( data ) {
            let anyNewMessages = $(data).find('#user-messages span').html();
            if(!anyNewMessages) return;

            let currentHtml = $(userLoggedInSelector).html();
            $(userLoggedInSelector).html(currentHtml + '<span style="margin-left:6px;color:#fff;background:#f0f;border-radius:6px;padding:3px 6px;font-size:10px;font-family:verdana;">' + anyNewMessages + '</span>');
        });
    }

});
