// ==UserScript==
// @name         GC - Kad Fed Notification
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Displays a notification when youve fed a kad
// @author       Dani (but really mandi)
// @match        https://www.grundos.cafe/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/449542/GC%20-%20Kad%20Fed%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/449542/GC%20-%20Kad%20Fed%20Notification.meta.js
// ==/UserScript==

// get the current page since we use this a lot
const CURRENT_PAGE = window.location.pathname;

const THEME2004 = $('img[src*="/04/"]').length > 0 ? true : false;

 let currentUser = THEME2004 ? $('td.tl a[href^="/userlookup/?"]').text() : $('td.tt a[href^="/userlookup/?"]').text();
(function() {

    'use strict';
    // show message at the top of the page if you've already fed a kad
    if ('/games/kadoatery/' == CURRENT_PAGE) {
        let kad = $('p:contains("Thanks, ' + currentUser + '!")');
        if ( kad.length > 0) {
            let kadName = kad.parent().find('b:first-of-type').text();
            kadName = kadName.split(currentUser)[0]
            $('b:contains("The Kadoatery")').parent().parent().prepend(`<div id="alreadyFedKad" style="padding:5px;background-color:pink;"><center>You already fed "${kadName}"</center></div>`);
        }
    }
    // Your code here...
})();