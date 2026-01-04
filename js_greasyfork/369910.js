// ==UserScript==
// @name         Bunpro: Egg Timer
// @namespace    http://tampermonkey.net/
// @version      0.3.8
// @description  Times your review session.
// @author       Kumirei
// @include      *bunpro.jp/*
// @exclude      *community.bunpro.jp*
// @require      https://greasyfork.org/scripts/370623-bunpro-helpful-events/code/Bunpro:%20Helpful%20Events.js?version=974369
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369910/Bunpro%3A%20Egg%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/369910/Bunpro%3A%20Egg%20Timer.meta.js
// ==/UserScript==

(function () {
  var start = Date.now();
  var interval = false;
  var timerAdded = false;
  $("HTML")[0].addEventListener("new-review-item", () => {
    if ($(".review__stats.review-count-tracking")[0].innerText == "0/0") {
      if (timerAdded == false) {
        $(".home-dropdown").after(
          '<div id="egg-timer" class="help-button" style="left: 60px; top: 0; padding: 0;">00:00</div>'
        );
        timerAdded = true;
      }
      start = Date.now();
      if (interval != false) clearInterval(interval);
      interval = setInterval(function () {
        var location = window.location.href;
        if (window.location.href.match(/(study)|(cram)|(learn)/) == null)
          clearInterval(interval);
        else {
          var elapsed = ((Date.now() - start) / 1000).toFixed();
          var seconds = String(elapsed % 60);
          if (seconds < 10) seconds = "0" + seconds;
          var minutes = String(Math.floor(elapsed / 60) % 60);
          if (minutes < 10) minutes = "0" + minutes;
          var hours = "";
          if (elapsed / 60 >= 60) {
            hours = String(Math.floor(elapsed / 3600));
            if (hours < 10) hours = "0" + hours;
            hours += ":";
          }
          var timestamp = hours + minutes + ":" + seconds;
          $("#egg-timer")[0].innerText = timestamp;
        }
      }, 1000);
    }
  });
})();
