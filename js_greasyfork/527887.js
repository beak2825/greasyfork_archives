// ==UserScript==
// @name         RateYourMusic Track Time Conversion
// @license      CC0-1.0
// @version      2025-03-14
// @description  Adds hours to the total time at the bottom of the track listings on rym track lists.
// @author       https://github.com/Schwtz
// @match        https://rateyourmusic.com/release/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        none
// @namespace https://greasyfork.org/users/1439067
// @downloadURL https://update.greasyfork.org/scripts/527887/RateYourMusic%20Track%20Time%20Conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/527887/RateYourMusic%20Track%20Time%20Conversion.meta.js
// ==/UserScript==
var time = document.getElementsByClassName('tracklist_total')[1].textContent.split('Total length: ')[1]
var totalMins = time.split(':')[0]
var seconds = time.split(':')[1]
 
var hours = Math.floor(totalMins / 60)
var remMins = totalMins % 60
if (remMins.toString().length == 1) {
    remMins = '0' + remMins
} 

if(hours !== 0) {
  document.getElementsByClassName('tracklist_total')[1].textContent = (hours+':'+remMins+':'+seconds)
}
