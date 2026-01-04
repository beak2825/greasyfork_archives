// ==UserScript==
// @name         PeatixReload
// @namespace    https://greasyfork.org/en/users/200777
// @version      1.0
// @description  Auto refresh until ticket sales opened
// @author       zhuhang.jasper
// @match        https://devfestxfirebase.peatix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374007/PeatixReload.user.js
// @updateURL https://update.greasyfork.org/scripts/374007/PeatixReload.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Replace @match to your event URL
    // If doesnt work, change the className of HTML element
    
    console.log('refreshing...');
    var action = document.getElementsByClassName('tix-action');
    if ((action[0].innerHTML).trim() == '') {
        setInterval(location.reload(),1000);
    } else {
        alert('You can buy ticket now!');
    }
    //console.log(action);
    
})();