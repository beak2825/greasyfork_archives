// ==UserScript==
// @name            WME Clear Feed
// @description     Adds a link to the sidebar to clear your WME feed
// @namespace       vaindil
// @version         2.2.0
// @grant           none
// @include         /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @author          vaindil
// @license         GPLv3
// @downloadURL https://update.greasyfork.org/scripts/22141/WME%20Clear%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/22141/WME%20Clear%20Feed.meta.js
// ==/UserScript==

const linkId = 'wme-clear-feed-link';
const msgId = 'wme-clear-feed-msg';

let isPaused = false;
let clearedCount = 0;
let numReloads = 0;
let lastTry = false;
let intervalId;

const style = document.createElement('style');
style.textContent = `
  .wme-clear-feed {
    font-weight: bold;
  }
  #${linkId} {
    cursor: pointer;
  }
  #${msgId} {
    display: none;
  }
`;
document.documentElement.appendChild(style);

function startup() {
  try {
    const element = $('.feed-notifications');
    if ($(element).length) {
      addButton();
    } else {
      setTimeout(startup, 1000);
    }
  } catch (err) {
    console.log("WMEClearFeed - " + err);
    setTimeout(startup, 1000);
  }
}

function addButton() {
  $('.feed-notifications').prepend(
    `<a id="${linkId}" class="wme-clear-feed">Clear feed</a>` +
    `<div id="${msgId}" class="wme-clear-feed"></div>`);
  $('.feed-notifications').click(clearFeed);
}

function clearFeed() {
  $(`#${linkId}`).hide();
  setClearingMessage();

  interval();
  intervalId = setInterval(interval, 1000);
}

function interval() {
  if (!isPaused) {
    setClearingMessage();
    $('.feed-load-more').click();
    numReloads++;
    const length = $('.feed-list > li').length;
    clearedCount += length;
    if (length === 0) {
      if (lastTry) {
        clearInterval(intervalId);
        finishUp(clearedCount);
        return;
      }
      else {
        lastTry = true;
        return;
      }
    }

    $('.feed-list > .feed-item > .inner > .delete').click();

    if (numReloads === 5) {
      isPaused = true;
      setPausedMessage(numReloads);
      const pauseIntervalId = setInterval(() => {
        numReloads--;

        if (numReloads === 0) {
          clearInterval(pauseIntervalId);
          isPaused = false;
          return;
        }

        setPausedMessage(numReloads);
      }, 1000);
    }
  }
}

function setClearingMessage() {
  $(`#${msgId}`).text('Clearing feed, just a moment...').css('color', 'darkorange').show();
}

function setPausedMessage(secondsLeft) {
  let secondsStr = 'seconds';
  if (secondsLeft === 1) {
    secondsStr = 'second';
  }

  $(`#${msgId}`).text(`Paused to prevent rate limiting, will continue in approx. ${secondsLeft} ${secondsStr}`);
}

function finishUp(clearedCount) {
  const msg = $(`#${msgId}`);

  clearedCount = 0;
  numReloads = 0;
  lastTry = false;

  let itemStr = 'items';

  if (clearedCount === 1) {
    itemStr = 'item';
  }

  msg.text(`${clearedCount} ${itemStr} cleared!`).css('color', 'green');
  setTimeout(function() {
    msg.fadeOut(500, 'swing', () => {
      msg.text('').hide();
      $(`#${linkId}`).show();
    });
  }, 2000);
}

startup();
