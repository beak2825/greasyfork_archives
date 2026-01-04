// ==UserScript==
// @name         Handle TimeOut - @KMKnation
// @namespace    mayurkanojiya
// @version      1.0
// @description  Run a continuous interval on a specific webpage
// @match        https://in.bookmyshow.com/sports/winner-of-semi-final-1-vs-winner-of-semi-final-2/seat-layout/aerialcanvas/ET00367598/SPSM/10068?groupEventCode=ET00367203
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476934/Handle%20TimeOut%20-%20%40KMKnation.user.js
// @updateURL https://update.greasyfork.org/scripts/476934/Handle%20TimeOut%20-%20%40KMKnation.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function myFunction() {
    console.log("@KMKnation - Mayur Kanojiya Script is running...");
    let hour = new Date().getHours();
    if (hour < 20){
        console.log("Going to refresh on same page after 10 seconds");
        setTimeout(() => {
            window.location = window.location.href;
        }, 1000);

    }else{
        console.log("Not going to refresh after 8 PM");
    }
  }
  

  const interval = setInterval(myFunction, 9000); // 1000ms = 1 second
  localStorage.setItem('myInterval', interval);

  window.addEventListener('beforeunload', function() {
      const storedInterval = localStorage.getItem('myInterval');
      if (storedInterval) {
          clearInterval(parseInt(storedInterval));
      }
  });
})();