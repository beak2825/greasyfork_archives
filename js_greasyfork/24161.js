// ==UserScript==
// @name        Disable Kong's Stupid Chat Filter
// @namespace   kong_user
// @description Disable stupid chat filters
// @include     http://www.kongregate.com/games/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24161/Disable%20Kong%27s%20Stupid%20Chat%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/24161/Disable%20Kong%27s%20Stupid%20Chat%20Filter.meta.js
// ==/UserScript==

(function () {
  var scriptID = 'GM::Disable Stupid Chat Filter: ';
  
  if (window.parent != window) {
    //console.log (scriptID + "Aborting - in iframe or other subpage.");
    //console.warn (scriptID + "Aborting - in iframe or other subpage.");
    return; // Don't run in iframes or other nonsense...
  } 

  //console.log (scriptID + "Starting up!");
  
  var timerVal = 0;
  var tries = 0;
  var maxTries = 20;
  
  function checkAndDeleteFilter() {
    var done = false;
    if (typeof holodeck == 'object') {
      if (holodeck._incoming_message_filters.length > 2) {
        var f = holodeck._incoming_message_filters.shift();
        if (f != undefined) {
          done = true;
          console.log(scriptID + 'Nailed it! Filter removed on page ' + location);
          console.log(scriptID + 'There are now ' + holodeck._incoming_message_filters.length + ' incoming message filters.');
        }
      }
    }
    if (!done && tries < maxTries) {
      tries = tries + 1
      console.warn(scriptID + 'Filter not yet created, waiting for it... [' + tries + '/' + maxTries + '] -- ' + location);
    } else {
      if (tries >= maxTries) {
        console.warn(scriptID + 'Got tired of waiting for holodeck to exist!' + location);
      }
      clearInterval(t)
    }
  }
  
  // console.log(scriptID + 'Launching filter destroyer! ' + location);
  var t = setInterval(checkAndDeleteFilter, 1000);
  
  
})();
