// ==UserScript==
// @name        TORN : Change content of the travel messages and other fun stuff just for a laugh
// @author      Prince-5T3N [2156450]
// @description Boost 5t3n's ego
// @match       https://www.torn.com/*
// @version     1.0
// @namespace https://greasyfork.org/users/874696
// @downloadURL https://update.greasyfork.org/scripts/439788/TORN%20%3A%20Change%20content%20of%20the%20travel%20messages%20and%20other%20fun%20stuff%20just%20for%20a%20laugh.user.js
// @updateURL https://update.greasyfork.org/scripts/439788/TORN%20%3A%20Change%20content%20of%20the%20travel%20messages%20and%20other%20fun%20stuff%20just%20for%20a%20laugh.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        document.getElementsByClassName('inner-popup')[0].innerHTML = 'Prince-5T3N is a very clever old git who apparently loves unicorns more than aeroplanes';
        document.getElementById('plane').innerHTML = '<img src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/09f31754051083.5999397207a50.gif">';
    }
})();