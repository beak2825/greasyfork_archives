// ==UserScript==
// @name        Yoroi Videowall refresher
// @description N/A
// @namespace   yoroi
// @include     https://users.yoroi.company/*
// @version     v0.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26443/Yoroi%20Videowall%20refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/26443/Yoroi%20Videowall%20refresher.meta.js
// ==/UserScript==

var interval = 2 * 60 * 1000; // 2 minutes
setInterval(function(){
    angular.element('a.reload[href="javascript:;"]:visible').triggerHandler('click');
    console.debug('[REFRESHER] Should refresh...');
}, interval);