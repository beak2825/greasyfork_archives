// ==UserScript==
// @name        Onlyfans Top %
// @description Follow all users on Onlyfans.
// @match       https://onlyfans.com/my/statements/earnings
// @version 0.0.1.20210505010728
// @namespace https://greasyfork.org/users/768556
// @downloadURL https://update.greasyfork.org/scripts/425964/Onlyfans%20Top%20%25.user.js
// @updateURL https://update.greasyfork.org/scripts/425964/Onlyfans%20Top%20%25.meta.js
// ==/UserScript==


var interval = setInterval(function() {
    document.getElementsByClassName('g-panel m-creators-top')[0].getElementsByTagName('p')[0].innerText = 'YOU ARE IN THE TOP 0.11% OF ALL CREATORS!'
    
    document.getElementsByClassName('b-statements__current-balance__value')[0].innerText = '$420.16'
    document.getElementsByClassName('b-statements__pending-balance__value')[0].innerText = '$13,672.27'
    
}, 50);
