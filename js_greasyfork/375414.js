// ==UserScript==
// @name         Timer Accelerator
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license      GNU AGPLv3
// @description  Accelerates time by decreasing the durations of time for timers, in order to shorten the time to wait for something. This script is intended to be used for decreasing the waiting time for file downloads. This script will only work on download sites which do not track the waiting time from the server, or if the waiting time is not JavaScript driven.
// @author       jcunews
// @match        *://downloadsite.com/*
// @match        *://otherdownloadsite.com/files/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/375414/Timer%20Accelerator.user.js
// @updateURL https://update.greasyfork.org/scripts/375414/Timer%20Accelerator.meta.js
// ==/UserScript==

//Note: this script should be applied only for specific sites. So, once the script is installed, change the above @match metadata.

(function() {

  //=== CONFIGURATION BEGIN ===

  //Note: durations are in milliseconds. 1000ms = 1 second.

  //Duration to use when the timer is 1 second.
  //It's usually used for decrease a counter every second.
  //If shortDuration is 50ms, the counter will be decreased every 50ms. So if the waiting time is e.g. 30 seconds, it will become 600ms.
  var shortDuration = 50; 

  //Duration to use when the timer is more than 1 second.
  //It's usually used to trigger download after e.g. 30 seconds.
  //If longDuration is 1 second when the waiting time is 30 seconds, it will become 1 second.
  var longDuration = 1000;

  //=== CONFIGURATION END ===

  var si = setInterval;
  setInterval = function(fn, duration) {
    if (duration >= 1000) duration = duration === 1000 ? shortDuration : duration;
    return si.apply(this, arguments);
  };
  var st = setTimeout;
  setTimeout = function(fn, duration) {
    if (duration >= 1000) duration = duration === 1000 ? shortDuration : longDuration;
    return st.apply(this, arguments);
  };
})();
