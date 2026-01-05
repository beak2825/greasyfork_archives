// ==UserScript==
// @name         Kaskus Invalid Page Skipper
// @namespace    https://github.com/drkwnx
// @version      0.1
// @description  Deal with Kaskus's invalid page
// @author       darkwinx
// @match        *://www.kaskus.co.id/lastpost/*
// @match        *://www.kaskus.co.id/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17162/Kaskus%20Invalid%20Page%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/17162/Kaskus%20Invalid%20Page%20Skipper.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

var message;
var host;
var urlSegments;
var threadId;
var validThreadUrl;

message = document.getElementsByClassName('list-message')[0];
if (message != undefined) {
    if ( message.innerHTML.split(' ')[0] == 'Invalid') {
        host = document.location.host;
        urlSegments = document.location.pathname.split('/');
        threadId = urlSegments[2];

        validThreadUrl = 'http://'+host + '/thread/' + threadId + '/invalidjs';

        console.log(validThreadUrl);

        window.location.assign(validThreadUrl);
    }
} else {
    urlSegments = document.location.pathname.split('/');
    if (urlSegments[urlSegments.length-1] == 'invalidjs') {
        urlSegments = document.getElementsByClassName('last-page')[0].href.split('/');
        urlSegments[urlSegments.length-1] = urlSegments[urlSegments.length-1] - 1;
        validThreadUrl = urlSegments.join('/');
        
        window.location.assign(validThreadUrl);
    }
}