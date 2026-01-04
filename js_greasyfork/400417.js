// ==UserScript==
// @name         Twitch Timer
// @version      0.4
// @icon         https://www.iconsdb.com/icons/download/violet/clock-48.ico
// @description  Tells you how much you have spent watching each category on Twitch
// @author       John5G
// @include      /^https?://www\.twitch\.tv/\w+$/
// @require      https://cdn.jsdelivr.net/npm/easytimer@1.1.1/src/easytimer.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/users/502323
// @downloadURL https://update.greasyfork.org/scripts/400417/Twitch%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/400417/Twitch%20Timer.meta.js
// ==/UserScript==

'use strict';
let fireOnHashChangesToo = true;
let pageURLCheckTimer = setInterval(
  function() {
    if (this.lastPathStr !== location.pathname ||
      this.lastQueryStr !== location.search ||
      (fireOnHashChangesToo && this.lastHashStr !== location.hash)
    ) {
      this.lastPathStr = location.pathname;
      this.lastQueryStr = location.search;
      this.lastHashStr = location.hash;
      main();
    }
  }, 111
);

function main() {
  let category;
  let categoryName;
  let watchedTime = {
    seconds: 0
  };
  let timer;
  let player;
  let playerSelector = 'video'
  let categorySelector = 'div.tw-mg-t-05:nth-child(2) > div:nth-child(2)'
  let timerElement = `
<div class="tw-flex tw-flex-shrink-0">
   <div class="tw-mg-r-1">
      <div class="tw-align-items-center tw-flex">
         <div class="tw-mg-r-05">
            <div class="tw-align-items-center tw-flex">
               <p data-test-selector="labeled-text-label" class="tw-font-size-5">Time watched:</p>
            </div>
         </div>
         <p class="tw-ellipsis tw-font-size-5"><a class="tw-interactive tw-link timer">00:00:00</a></p>
      </div>
   </div>
</div>`
  /* beforeunload cannot be used with async function calls (GM_setValue / GM_getValue)
  * preferably we need to know when the user changes the page to save the time
  window.addEventListener("beforeunload", function (e) {
      saveTime();
      (e || window.event).returnValue = null;
      return null;
  });
  */

  // Wait for player to be intialized
  let playerStatus = new MutationObserver(function(mutations, me) {
    player = document.querySelector(playerSelector);
    category = document.querySelector(categorySelector);
    if (player && category) {
        // Temporary: assures that old timer object is reset between page changes
        timer = new Timer();
        timer.stop();
        timerHandler();
        me.disconnect();
        return;
    }
  });

  // Start player status observer
  playerStatus.observe(document, {
    childList: true,
    subtree: true
  });

  // Nasty trick since setting timer on object creation is bugged
  let timerStarter = (function() {
    var executed = false;
    return function() {
      if (!executed) {
        executed = true;
        timer.start({
          startValues: watchedTime
        });
      } else {
        timer.start();
      }
    };
  })();

  async function saveTime() {
    await GM_setValue(categoryName, JSON.stringify(timer.getTimeValues()));
  }

  function startTimer() {
    console.log("Playing", player.paused);
    if (!player.paused && !timer.isRunning()) {
      timerStarter();
      console.log("Timer Started");
      timer.addEventListener('secondsUpdated', async function(e) {
        document.querySelector('.timer').innerHTML = timer.getTimeValues().toString();
        await saveTime();
      });
    }
  }

  async function pauseTimer() {
    if (player.paused && timer.isRunning()) {
      timer.pause();
      console.log("Timer Paused");
    }
  }

  /**
   * Preferably create elements to improve performance
   * https://stackoverflow.com/questions/7327056/appending-html-string-to-the-dom
   */
  async function timerHandler() {
    if (!document.querySelector('.timer')) {
        category.insertAdjacentHTML('afterbegin', timerElement);
    }
    // Needs fixing: categoryName should be retrieved from category object instead making two DOM calls.
    categoryName = document.querySelector('a[data-a-target="stream-game-link"]').text;
    // Retrieve time watched for a given category from localStorage
    let watchedTimeStr = await GM_getValue(categoryName);
    if (watchedTimeStr) {
      watchedTime = JSON.parse(watchedTimeStr);
    }
    console.log("Resuming timer for", categoryName, "starting at",  watchedTime);
    player.addEventListener("play", startTimer);
    player.addEventListener("pause", pauseTimer);
  }
}