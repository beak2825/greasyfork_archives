// ==UserScript==
// @name        Hpoi grid display
// @namespace   Violentmonkey Scripts
// @match       https://www.hpoi.net/user/home*
// @grant       none
// @version     1.0
// @author      arition
// @description Grid display for hpoi user home page
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522728/Hpoi%20grid%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/522728/Hpoi%20grid%20display.meta.js
// ==/UserScript==

function updateLayout() {
  $(".home-left").addClass("hidden");
  $(".home-right").addClass("hidden");
  $(".home-left + div").addClass("col-md-24");
  $(".home-info-content").addClass("col-md-24");
  $(".overlay-container").addClass("col-md-24");
  $(".hp-single-line").addClass("col-md-24").removeClass("col-xs-offset-8").removeClass("user-home-bottom-info");
  $(".main-content").css({
    display: "grid",
    "grid-template-columns": "repeat(6, minmax(0, 1fr))",
    gap: "1rem",
  });
}

$(document).ready(function () {
  updateLayout();

  var observer = new MutationObserver(function () {
    updateLayout();
  });

  observer.observe(document.querySelector(".main-content"), {
    childList: true,
    subtree: true,
  });
});
