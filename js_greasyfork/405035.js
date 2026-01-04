// ==UserScript==
// @name           Remove black background
// @namespace      https://greasyfork.org/en/users/159342-cleresd
// @description    Remove black background on the epicmafia.com
// @version        1.04
// @match          https://epicmafia.com/*
// @exclude        https://epicmafia.com/game*
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/405035/Remove%20black%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/405035/Remove%20black%20background.meta.js
// ==/UserScript==

// without timeout doesnt work
setTimeout(function(){
  $('body').css('filter', '');
  $('html > div').remove();
}, 450);