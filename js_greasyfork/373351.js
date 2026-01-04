// ==UserScript==
// @name         Last Review Tracker
// @namespace    sff-reviews
// @version      1.0
// @description  Keep track of the last review ID
// @author       amflare
// @match        https://scifi.stackexchange.com/review
// @match        https://scifi.stackexchange.com/review/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/373351/Last%20Review%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/373351/Last%20Review%20Tracker.meta.js
// ==/UserScript==
(function () {
  'use strict';

  //REVIEW PAGE
  let html = `<div class="module rn newuser">
                <h4>Last ID Viewed</h4>
                <input type="text" id="last-id-viewed" style="width:150px;padding:5px;">
              </div>`;

  $('#sidebar').append(html);

  let refreshRate = GM_getValue("config", {rate: $('#rn-rate').val()});
  let showID = function(){
    $('#last-id-viewed').val(GM_getValue("lastIdViewed"));
  };
  let inter = setInterval(showID, refreshRate.rate * 1000);

  showID();


  // IN QUEUES
  setTimeout(function(){
    let winID = window.location.pathname.match(/\d{1,9}/);
    let oldID = GM_getValue("lastIdViewed", 0);

    if (winID !== null) {
      let newID = winID[0];

      if (oldID < newID) {
        GM_setValue("lastIdViewed", newID);
      }
    }
  }, 1000);
}());