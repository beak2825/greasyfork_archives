// ==UserScript==
// @name         Real Time Top Bar Reviews
// @namespace    sff-reviews
// @version      1.0.0
// @description  Make top bar refresh itself
// @author       amflare
// @match        https://scifi.stackexchange.com
// @match        https://scifi.stackexchange.com/*
// @exclude      https://scifi.stackexchange.com/review
// @exclude      https://scifi.stackexchange.com/review/*
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/35892/Real%20Time%20Top%20Bar%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/35892/Real%20Time%20Top%20Bar%20Reviews.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // INIT
  console.info('Real Time Top Bar Reviews: Active');

  let rate =  GM_getValue("config", {rate:30});

  let interval = setInterval(checkTopReviews, rate.rate * 1000);

  // CHECK
  function checkTopReviews() {
    $.get("https://scifi.stackexchange.com/topbar/review", function(html,t,j) {
      if (j.status !== 200) {
        console.log(t);
        console.log(j);
        clearInterval(interval);
        return;
      }
      let atLeastOne = false;
      let quickDom = $('<quickDom>').append($.parseHTML(html));
      $('li.-item', quickDom).each(function(){
        atLeastOne = ($(this).hasClass('danger-urgent') || $(this).hasClass('danger-active') || atLeastOne);
      });
      if (atLeastOne) {
        $('.js-review-button').addClass('_danger-indicator');
      } else {
        $('.js-review-button').removeClass('_danger-indicator');
      }
    });
  }
}());