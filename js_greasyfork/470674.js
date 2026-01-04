// ==UserScript==
// @name         Youtube auto ad skiper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  see name
// @author       gamers_indo1223
// @match        https://www.youtube.com/watch?v=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/470674/Youtube%20auto%20ad%20skiper.user.js
// @updateURL https://update.greasyfork.org/scripts/470674/Youtube%20auto%20ad%20skiper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //obfuscated it so somone would not skid it
setInterval(() => {

const adDiv = document.querySelector('div.ad-showing');
if (!adDiv)return;
  document.querySelectorAll('video')[0].currentTime = document.querySelectorAll('video')[0].duration
if(!document.querySelector('.ytp-ad-skip-button.ytp-button')) return;
    document.querySelector('.ytp-ad-skip-button.ytp-button').click()
}, 550)
})();