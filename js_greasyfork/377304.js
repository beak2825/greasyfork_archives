// ==UserScript==
// @name     Autolike Oneliner
// @namespace autolikeoneline
// @description Autolike for youtube in one line of js
// @version  1
// @include	 *.youtube.com/watch*
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/377304/Autolike%20Oneliner.user.js
// @updateURL https://update.greasyfork.org/scripts/377304/Autolike%20Oneliner.meta.js
// ==/UserScript==

function init(){ if(document.getElementsByClassName("ytd-subscribe-button-renderer")[0].attributes['subscribed'] !== undefined && document.getElementsByClassName('ytd-toggle-button-renderer')[1].classList.value.search("active") == -1) document.getElementsByClassName('ytd-toggle-button-renderer')[1].click(); }
setTimeout(init, 7000);