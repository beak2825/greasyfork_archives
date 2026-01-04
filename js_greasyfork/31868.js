// ==UserScript==
// ==UserScript==
// @name        MSDN Subscriber Info
// @namespace   MSDN Subscriber Info
// @description View MSDN Subscription Information
// @author      sleiqx@PCBeta
// @match       https://msdn.microsoft.com/*/subscriptions/downloads/*
// @match       https://msdn.microsoft.com/subscriptions/securedownloads/*
// @version     0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31868/MSDN%20Subscriber%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/31868/MSDN%20Subscriber%20Info.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $('#SubMigratedMessageArea').remove();
    setTimeout( function(){
        $('#DownloadsArea').show();
    }, 1 * 1000 );
})();